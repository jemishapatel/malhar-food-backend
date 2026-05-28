const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createOrder = async (orderData) => {
  const { customerName, mobile, address, city, postcode, items, userId, countryCode } = orderData;

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Verify prices and calculate total amount
  let calculatedAmount = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found with ID: ${item.productId}`);
    }

    let price = 0;
    if (item.variantId && product.variants && product.variants.length > 0) {
      const variant = product.variants.find(v => v.id === item.variantId || v.size === item.variantId);
      if (!variant) {
        throw new Error(`Variant not found for size/id: ${item.variantId}`);
      }
      price = variant.price;
    } else {
      // Fallback to first variant price if available, or error out
      if (product.variants && product.variants.length > 0) {
        price = product.variants[0].price;
      } else {
        throw new Error(`No pricing details found for product ${product.name}`);
      }
    }

    calculatedAmount += price * item.quantity;
    verifiedItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price
    });
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
    items: verifiedItems
  });

  return await order.save();
};

exports.fetchMyOrders = async (mobile) => {
  return await Order.find({ mobile }).sort({ createdAt: -1 });
};

exports.fetchOrderById = async (id) => {
  // Can query by mongoose ObjectId or custom orderId string
  const query = id.startsWith('ORD-') ? { orderId: id } : { _id: id };
  const order = await Order.findOne(query).populate('items.productId');
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

exports.fetchAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

exports.updateOrderStatus = async (id, status) => {
  const query = id.startsWith('ORD-') ? { orderId: id } : { _id: id };
  const order = await Order.findOneAndUpdate(query, { status }, { new: true });
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

exports.getAdminStats = async () => {
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

exports.fetchCustomersList = async () => {
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

exports.fetchCustomerDetailByMobile = async (mobile) => {
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
