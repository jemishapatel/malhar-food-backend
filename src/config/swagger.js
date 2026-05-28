const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Malhar Food API Documentation',
    version: '1.0.0',
    description: 'REST API documentation for Malhar Food grocery e-commerce, built with Node.js, Express, and MongoDB.',
    contact: {
      name: 'Malhar Food Wholesale Team',
      email: 'wholesale@malharfood.co.uk'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token obtained from OTP verification'
      }
    },
    schemas: {
      ApiResponseSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          statusCode: { type: 'integer', example: 200 },
          message: { type: 'string', example: 'Operation successful' },
          data: { type: 'object' }
        }
      },
      ApiResponseError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Error description message' },
          errors: { type: 'object', nullable: true, example: null }
        }
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4e7' },
          name: { type: 'string', example: 'Amit Patel' },
          mobile: { type: 'string', example: '+447700900123' },
          role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' },
          addresses: {
            type: 'array',
            items: { $ref: '#/components/schemas/Address' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Address: {
        type: 'object',
        required: ['fullName', 'mobile', 'addressLine', 'postcode'],
        properties: {
          _id: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4f1' },
          fullName: { type: 'string', example: 'Amit Patel' },
          mobile: { type: 'string', example: '+447700900123' },
          addressLine: { type: 'string', example: '42 High Street, Wembley' },
          city: { type: 'string', example: 'London' },
          postcode: { type: 'string', example: 'HA0 4AL' },
          isDefault: { type: 'boolean', example: true }
        }
      },
      Category: {
        type: 'object',
        required: ['name', 'image'],
        properties: {
          slug: { type: 'string', example: 'rice' },
          name: { type: 'string', example: 'Rice' },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1586201375761-83865001e31c' },
          subCategories: {
            type: 'array',
            items: { type: 'string' },
            example: ['Basmati', 'Brown Rice']
          }
        }
      },
      ProductVariant: {
        type: 'object',
        required: ['size', 'price'],
        properties: {
          _id: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4fa' },
          size: { type: 'string', example: '1kg' },
          price: { type: 'number', example: 7.99 },
          inStock: { type: 'boolean', example: true }
        }
      },
      Product: {
        type: 'object',
        required: ['name', 'categorySlug'],
        properties: {
          _id: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4fb' },
          name: { type: 'string', example: 'Premium XL Basmati Rice' },
          description: { type: 'string', example: 'Aged for 2 years...' },
          categorySlug: { type: 'string', example: 'rice' },
          subCategory: { type: 'string', example: 'Basmati' },
          isOrganic: { type: 'boolean', example: true },
          isVegan: { type: 'boolean', example: true },
          isGlutenFree: { type: 'boolean', example: true },
          origin: { type: 'string', example: 'India' },
          badge: { type: 'string', enum: ['none', 'New', 'Sale', 'Popular'], example: 'Popular' },
          inStock: { type: 'boolean', example: true },
          images: {
            type: 'array',
            items: { type: 'string' },
            example: ['https://images.unsplash.com/photo-1586201375761-83865001e31c']
          },
          variants: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductVariant' }
          }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4fc' },
          orderId: { type: 'string', example: 'ORD-UK-1001' },
          customerName: { type: 'string', example: 'Amit Patel' },
          mobile: { type: 'string', example: '+447700900123' },
          address: { type: 'string', example: '42 High Street, Wembley' },
          city: { type: 'string', example: 'London' },
          postcode: { type: 'string', example: 'HA0 4AL' },
          amount: { type: 'number', example: 18.99 },
          status: { type: 'string', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], example: 'Processing' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4fb' },
                variantId: { type: 'string', example: '1kg' },
                quantity: { type: 'integer', example: 1 },
                price: { type: 'number', example: 18.99 }
              }
            }
          }
        }
      },
      WholesaleInquiry: {
        type: 'object',
        required: ['fullName', 'email', 'mobile', 'businessName', 'businessType', 'city', 'postcode', 'address', 'productsInterested', 'monthlyVolume'],
        properties: {
          _id: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4fd' },
          inquiryId: { type: 'string', example: 'WHS-2026-0001' },
          fullName: { type: 'string', example: 'Rajesh Patel' },
          email: { type: 'string', example: 'rajesh@patelsupermarket.co.uk' },
          mobile: { type: 'string', example: '+447700911222' },
          businessName: { type: 'string', example: 'Patel Supermarket Ltd' },
          businessType: { type: 'string', example: 'Retailer' },
          vatNumber: { type: 'string', example: 'GB123456789' },
          companyReg: { type: 'string', example: '12345678' },
          country: { type: 'string', example: 'United Kingdom' },
          city: { type: 'string', example: 'Leicester' },
          postcode: { type: 'string', example: 'LE4 5AT' },
          address: { type: 'string', example: '123 Belgrave Road, Leicester' },
          productsInterested: { type: 'string', example: 'Basmati Rice, Spices' },
          monthlyVolume: { type: 'string', example: '£5,000 - £10,000' },
          deliveryRequirements: { type: 'string', example: 'Access after 9am' },
          additionalNotes: { type: 'string', example: 'None' },
          status: { type: 'string', enum: ['New Inquiry', 'Contacted', 'Negotiation', 'Approved', 'Rejected'], example: 'New Inquiry' }
        }
      }
    }
  },
  paths: {
    '/api/auth/otp/send': {
      post: {
        tags: ['Authentication & Profile'],
        summary: 'Send mock OTP',
        description: 'Sends a 6-digit OTP code to the provided mobile number.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['mobile'],
                properties: {
                  mobile: { type: 'string', example: '+447700900123' },
                  name: { type: 'string', example: 'Amit Patel' },
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'secret' },
                  role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' },
                  countryCode: { type: 'string', example: '+44' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OTP code sent successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            mobile: { type: 'string' },
                            code: { type: 'string', example: '123456' }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/otp/verify': {
      post: {
        tags: ['Authentication & Profile'],
        summary: 'Verify mock OTP',
        description: 'Verifies mock OTP code to log user in or register profile.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['mobile', 'code'],
                properties: {
                  mobile: { type: 'string', example: '+447700900123' },
                  code: { type: 'string', example: '123456' },
                  name: { type: 'string', example: 'Amit Patel' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OTP verified successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            token: { type: 'string', example: '+447700900123' },
                            user: { $ref: '#/components/schemas/User' }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/profile': {
      get: {
        tags: ['Authentication & Profile'],
        summary: 'Get current user profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'User details retrieved',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/User' } } }
                  ]
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Authentication & Profile'],
        summary: 'Update current user profile',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Amit K. Patel' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/User' } } }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/addresses': {
      get: {
        tags: ['Authentication & Profile'],
        summary: 'Get addresses',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of addresses',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Address' }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Authentication & Profile'],
        summary: 'Create address',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'mobile', 'addressLine', 'postcode'],
                properties: {
                  fullName: { type: 'string', example: 'Amit Patel' },
                  mobile: { type: 'string', example: '+447700900123' },
                  addressLine: { type: 'string', example: '42 High Street, Wembley' },
                  city: { type: 'string', example: 'London' },
                  postcode: { type: 'string', example: 'HA0 4AL' },
                  isDefault: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Address created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Address' } } }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Catalog (Products & Categories)'],
        summary: 'Retrieve products catalog',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug' },
          { name: 'subCategory', in: 'query', schema: { type: 'string' }, description: 'SubCategory string name' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Text search keyword' },
          { name: 'organic', in: 'query', schema: { type: 'boolean' }, description: 'Filter organic' },
          { name: 'vegan', in: 'query', schema: { type: 'boolean' }, description: 'Filter vegan' },
          { name: 'glutenFree', in: 'query', schema: { type: 'boolean' }, description: 'Filter gluten free' },
          { name: 'badge', in: 'query', schema: { type: 'string' }, description: 'Filter display badge' }
        ],
        responses: {
          200: {
            description: 'List of matching products',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Product' }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Create product (Admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'categorySlug'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  categorySlug: { type: 'string' },
                  subCategory: { type: 'string' },
                  isOrganic: { type: 'boolean' },
                  isVegan: { type: 'boolean' },
                  isGlutenFree: { type: 'boolean' },
                  origin: { type: 'string' },
                  badge: { type: 'string', enum: ['none', 'New', 'Sale', 'Popular'] },
                  inStock: { type: 'boolean' },
                  variants: { type: 'string', description: 'JSON string array of variants', example: '[{"size":"1kg","price":7.99,"inStock":true}]' },
                  images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Product created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Product' } } }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/categories': {
      get: {
        tags: ['Catalog (Products & Categories)'],
        summary: 'Retrieve categories catalog',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of all categories',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Category' }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Create category (Admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'slug'],
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  subCategories: { type: 'string', description: 'JSON string array of subcategories', example: '["Basmati", "Brown Rice"]' },
                  image: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Category created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Category' } } }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/wholesale': {
      post: {
        tags: ['Wholesale Partnership Portal'],
        summary: 'Submit B2B Inquiry',
        security: [{ BearerAuth: [] }],
        description: 'Submits a wholesale inquiry form with business details.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WholesaleInquiry' }
            }
          }
        },
        responses: {
          201: {
            description: 'Inquiry registered',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/WholesaleInquiry' } } }
                  ]
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Admin Panel & CRUD'],
        summary: 'List wholesale inquiries (Admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of inquiries',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/WholesaleInquiry' }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/orders': {
      post: {
        tags: ['Orders & Checkout'],
        summary: 'Place checkout order',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customerName', 'mobile', 'address', 'postcode', 'items'],
                properties: {
                  customerName: { type: 'string', example: 'Amit Patel' },
                  mobile: { type: 'string', example: '+447700900123' },
                  address: { type: 'string', example: '42 High Street, Wembley' },
                  city: { type: 'string', example: 'London' },
                  postcode: { type: 'string', example: 'HA0 4AL' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['productId', 'quantity'],
                      properties: {
                        productId: { type: 'string', example: '6652eb6f7df2d3bc9ce8b4fb' },
                        variantId: { type: 'string', example: '1kg' },
                        quantity: { type: 'integer', example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Order placed',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Order' } } }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/orders/my-orders': {
      get: {
        tags: ['Orders & Checkout'],
        summary: 'Customer order history',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Order history list',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Order' }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/orders/admin/stats': {
      get: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Sales analytics stats',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Analytics summary metrics',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            totalRevenue: { type: 'number', example: 15430.5 },
                            totalOrders: { type: 'integer', example: 124 },
                            customerCount: { type: 'integer', example: 89 },
                            pendingOrdersCount: { type: 'integer', example: 18 }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
      // Banner CRUD
    '/api/banners': {
      get: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Get all banners (Admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of all banners',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Banner' }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Create banner (Admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['title', 'image'],
                properties: {
                  title: { type: 'string' },
                  image: { type: 'string', format: 'binary' },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Banner created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Banner' } } }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/banners/{id}': {
      put: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Update banner (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  image: { type: 'string', format: 'binary' },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Banner updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Banner' } } }
                  ]
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Delete banner (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Banner deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' }
              }
            }
          }
        }
      }
    },
    // Product CRUD
    '/api/products/{id}': {
      put: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Update product (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'categorySlug'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  categorySlug: { type: 'string' },
                  subCategory: { type: 'string' },
                  isOrganic: { type: 'boolean' },
                  isVegan: { type: 'boolean' },
                  isGlutenFree: { type: 'boolean' },
                  origin: { type: 'string' },
                  badge: { type: 'string', enum: ['none', 'New', 'Sale', 'Popular'] },
                  inStock: { type: 'boolean' },
                  variants: { type: 'string', description: 'JSON string array of variants' },
                  images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Product updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Product' } } }
                  ]
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Delete product (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Product deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' }
              }
            }
          }
        }
      }
    },
    // Category CRUD
    '/api/categories/{id}': {
      put: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Update category (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'slug'],
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  subCategories: { type: 'string', description: 'JSON string array' },
                  image: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Category updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponseSuccess' },
                    { properties: { data: { $ref: '#/components/schemas/Category' } } }
                  ]
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Admin Panel & CRUD'],
        summary: 'Delete category (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Category deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponseSuccess' }
              }
            }
          }
        }
      }
    },
    }
};

const options = {
  swaggerDefinition,
  apis: [] // Not parsing comments to avoid changes to existing code files
};

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDefinition)
};
