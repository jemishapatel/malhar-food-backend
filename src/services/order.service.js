import Order from '../models/Order.js';
import ServiceablePostcode from '../models/DeliveryArea.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const createOrder = async (orderData) => {
  const { customerName, mobile, address, city, postcode, items, userId, countryCode, paymentMethod, draftOrderId, deliveryOption, deliverySlot } = orderData;

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Verify prices, stock, and calculate total amount
  let calculatedAmount = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found with ID: ${item.productId}`);
    }
    
    // Real-Time Inventory Check
    if (!product.inStock) {
      throw new Error(`Sorry, "${product.name}" is currently out of stock.`);
    }

    let price = 0;
    if (item.variantId && product.variants && product.variants.length > 0) {
      const variant = product.variants.find(v => v.id === item.variantId || v.size === item.variantId);
      if (!variant) {
        throw new Error(`Variant not found for size/id: ${item.variantId}`);
      }
      if (variant.inStock === false) {
        throw new Error(`Sorry, the ${variant.size} variant of "${product.name}" is currently out of stock.`);
      }
      price = variant.price;
    } else {
      // Fallback to first variant price if available, or error out
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants[0];
        if (variant.inStock === false) {
           throw new Error(`Sorry, the ${variant.size} variant of "${product.name}" is currently out of stock.`);
        }
        price = variant.price;
      } else {
        throw new Error(`No pricing details found for product ${product.name}`);
      }
    }

    let finalItemTotal = price * item.quantity;
    
    // Check if valid offer applies
    if (product.offer && product.offer.type !== 'none' && product.offer.isActive) {
      const now = new Date();
      let isValidDate = true;
      if (product.offer.startDate && new Date(product.offer.startDate) > now) isValidDate = false;
      if (product.offer.endDate) {
        const end = new Date(product.offer.endDate);
        end.setHours(23, 59, 59, 999);
        if (end < now) isValidDate = false;
      }
      
      if (isValidDate) {
        const oType = product.offer.type;
        const oPrice = Number(product.offer.price) || 0;
        const oQty = Number(product.offer.quantity) || 1;
        
        if (oType === 'discount') {
          finalItemTotal = oPrice * item.quantity;
        } else if (oType === 'multibuy') {
          const bundles = Math.floor(item.quantity / oQty);
          const remainder = item.quantity % oQty;
          finalItemTotal = (bundles * oPrice) + (remainder * price);
        } else if (oType === 'quantity') {
          if (item.quantity >= oQty) {
            finalItemTotal = oPrice * item.quantity;
          }
        }
      }
    }

    calculatedAmount += finalItemTotal;
    verifiedItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price // We store base price, but amount is calculated correctly
    });
  }

  if (draftOrderId) {
    const existingOrder = await Order.findOne({ orderId: draftOrderId });
    if (existingOrder) {
      existingOrder.customerName = customerName;
      existingOrder.mobile = mobile;
      existingOrder.countryCode = countryCode || '+44';
      existingOrder.address = address;
      existingOrder.city = city;
      existingOrder.postcode = postcode;
      existingOrder.amount = calculatedAmount;
      existingOrder.paymentMethod = paymentMethod || 'COD';
      existingOrder.deliveryOption = deliveryOption || 'normal';
      if (deliverySlot) existingOrder.deliverySlot = deliverySlot;
      existingOrder.items = verifiedItems;
      existingOrder.status = 'Processing';
      if (userId) existingOrder.userId = userId;
      return await existingOrder.save();
    }
  }

  // Generate unique order ID
  const count = await Order.countDocuments();
  const orderId = `ORD-UK-${1000 + count + 1}`;

  const order = new Order({
    orderId,
    userId,
    customerName,
    mobile,
    countryCode: countryCode || '+44',
    address,
    city,
    postcode,
    amount: calculatedAmount,
    status: 'Processing',
    deliveryOption: deliveryOption || 'normal',
    deliverySlot: deliverySlot || undefined,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'pending',
    items: verifiedItems
  });

  return await order.save();
};

export const createDraftOrder = async (orderData) => {
  const { address, city, postcode, userId, email } = orderData;
  const count = await Order.countDocuments();
  const orderId = `ORD-UK-${1000 + count + 1}`;

  const order = new Order({
    orderId,
    userId,
    email: email || null,
    address,
    city,
    postcode,
    status: 'Draft',
    items: []
  });
  return await order.save();
};

export const updateDraftAddress = async (orderId, addressData) => {
  const { address, city, postcode, userId, email } = addressData;
  const existingOrder = await Order.findOne({ orderId });

  // Stale draftOrderId: the order no longer exists — create a fresh draft instead
  if (!existingOrder) {
    const count = await Order.countDocuments();
    const newOrderId = `ORD-UK-${1000 + count + 1}`;
    const newOrder = new Order({
      orderId: newOrderId,
      userId: userId || null,
      email: email || null,
      address,
      city,
      postcode,
      status: 'Draft',
      items: []
    });
    return await newOrder.save();
  }

  existingOrder.address = address;
  existingOrder.city = city;
  existingOrder.postcode = postcode;
  if (email) existingOrder.email = email;
  return await existingOrder.save();
};

export const fetchMyOrders = async (mobile) => {
  return await Order.find({ mobile }).sort({ createdAt: -1 });
};

export const addServiceablePostcode = async (postcodeData) => {
  const {
    postcode,
    email,
    serviceable,
    quick_delivery_available,
    estimated_minutes,
    delivery_charge,
    weekday_charge,
    saturday_charge,
    free_delivery_threshold
  } = postcodeData;
  if (!postcode) throw new Error("Postcode is required");

  const normalized = postcode.replace(/\s+/g, '').toUpperCase();

  // ── Email-only update ────────────────────────────────────────────────────────
  // When only postcode + email are provided (no delivery-charge fields), update
  // ONLY the email on the existing record — do not touch any other fields.
  const isEmailOnly = email !== undefined &&
    serviceable === undefined &&
    quick_delivery_available === undefined &&
    weekday_charge === undefined &&
    saturday_charge === undefined;

  if (isEmailOnly) {
    const updated = await ServiceablePostcode.findOneAndUpdate(
      { postcode: normalized },
      { $set: { email } },
      { new: true }
    );
    return updated;
  }
  // ────────────────────────────────────────────────────────────────────────────

  const newArea = await ServiceablePostcode.findOneAndUpdate(
    { postcode: normalized },
    {
      $set: {
        postcode: normalized,
        serviceable: serviceable !== undefined ? serviceable : true,
        quickDeliveryAvailable: quick_delivery_available !== undefined ? quick_delivery_available : false,
        estimatedMinutes: estimated_minutes ? String(estimated_minutes) : null,
        deliveryCharge: delivery_charge || 0, // backward compat
        weekdayCharge: weekday_charge !== undefined ? Number(weekday_charge) : 0,
        saturdayCharge: saturday_charge !== undefined ? Number(saturday_charge) : 0,
        freeDeliveryThreshold: free_delivery_threshold !== undefined ? Number(free_delivery_threshold) : 40
      }
    },
    { upsert: true, new: true }
  );

  return newArea;
};

export const validatePostcodeServiceability = async (postcode) => {
  if (!postcode) return { isServiceable: false, quickDelivery: false };

  const normalized = postcode.replace(/\s+/g, '').toUpperCase();

  // Exact match
  const area = await ServiceablePostcode.findOne({ postcode: normalized });
  if (area && area.serviceable) {
    return {
      isServiceable: true,
      quickDelivery: area.quickDeliveryAvailable,
      estimatedMinutes: area.estimatedMinutes,
      deliveryCharge: area.deliveryCharge, // backward compat
      weekdayCharge: area.weekdayCharge ?? 0,
      saturdayCharge: area.saturdayCharge ?? 0,
      freeDeliveryThreshold: area.freeDeliveryThreshold ?? 40
    };
  }

  // Prefix match (e.g., 'HA', 'NW')
  const allAreas = await ServiceablePostcode.find({ serviceable: true });
  for (const a of allAreas) {
    if (normalized.startsWith(a.postcode.toUpperCase())) {
      return {
        isServiceable: true,
        quickDelivery: a.quickDeliveryAvailable,
        estimatedMinutes: a.estimatedMinutes,
        deliveryCharge: a.deliveryCharge, // backward compat
        weekdayCharge: a.weekdayCharge ?? 0,
        saturdayCharge: a.saturdayCharge ?? 0,
        freeDeliveryThreshold: a.freeDeliveryThreshold ?? 40
      };
    }
  }

  return { isServiceable: false, quickDelivery: false };
};

export const fetchOrderById = async (id) => {
  // Can query by mongoose ObjectId or custom orderId string
  const query = id.startsWith('ORD-') ? { orderId: id } : { _id: id };
  const order = await Order.findOne(query).populate('items.productId');
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

export const fetchAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

export const updateOrderStatus = async (id, status) => {
  const query = id.startsWith('ORD-') ? { orderId: id } : { _id: id };
  const order = await Order.findOneAndUpdate(query, { status }, { new: true });
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

export const getAdminStats = async () => {
  // Aggregate revenue and counts
  const totalRevenueResult = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].total : 0;

  const totalOrders = await Order.countDocuments();
  const pendingOrdersCount = await Order.countDocuments({ status: 'Processing' });

  // Approximate unique customers count
  const customerCountResult = await Order.aggregate([
    { $group: { _id: '$mobile' } },
    { $count: 'count' }
  ]);
  const customerCount = customerCountResult[0] ? customerCountResult[0].count : 0;

  return {
    totalRevenue,
    totalOrders,
    customerCount,
    pendingOrdersCount
  };
};

export const fetchCustomersList = async () => {
  // Aggregate spending and orders per mobile/customer
  return await Order.aggregate([
    {
      $group: {
        _id: '$mobile',
        name: { $first: '$customerName' },
        mobile: { $first: '$mobile' },
        address: { $first: '$address' },
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$amount' }
      }
    },
    { $sort: { totalSpent: -1 } }
  ]);
};

export const fetchCustomerDetailByMobile = async (mobile) => {
  // Fetch aggregate customer spending and order history
  const orders = await Order.find({ mobile }).sort({ createdAt: -1 });
  if (orders.length === 0) {
    throw new Error('Customer order history not found');
  }

  const name = orders[0].customerName;
  const address = orders[0].address;
  const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);

  return {
    name,
    mobile,
    address,
    totalSpent,
    totalOrders: orders.length,
    orders
  };
};
