const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RehamerPaint ERP API',
      version: '1.0.0',
      description: `
        Comprehensive API documentation for the RehamerPaint ERP System.
        
        ## Features
        - **Multi-tenant Architecture** with company-based data isolation
        - **Role-based Access Control** (admin, manager, operator, viewer)
        - **JWT Authentication** with refresh tokens
        - **Comprehensive Audit Logging**
        - **Real-time Inventory Management**
        - **Production Planning and Tracking**
        - **Financial Management**
        - **Supply Chain Management**
        
        ## Authentication
        Most endpoints require authentication. Include the access token in the Authorization header:
        \`\`\`
        Authorization: Bearer <access_token>
        \`\`\`
        
        ## Error Handling
        All API responses follow a consistent format:
        \`\`\`
        {
          "success": true|false,
          "data": {}, // Only for successful responses
          "message": "Description",
          "error": { // Only for error responses
            "code": "ERROR_CODE",
            "message": "Error description",
            "details": []
          },
          "timestamp": "2024-01-01T00:00:00.000Z"
        }
        \`\`\`
        
        ## Pagination
        List endpoints support pagination with these parameters:
        - \`page\`: Page number (default: 1)
        - \`limit\`: Items per page (default: 20, max: 100)
        - \`sort\`: Sort field (default: id)
        - \`order\`: Sort order (asc|desc, default: desc)
        - \`search\`: Search term
      `,
      contact: {
        name: 'API Support',
        email: 'support@rehamerpaint.com',
        url: 'https://rehamerpaint.com/support'
      },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `${config.server.url}:${config.server.port}${config.api.prefix}`,
        description: 'Development server'
      },
      {
        url: 'https://api.rehamerpaint.com/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token obtained from /auth/login'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the operation was successful'
            },
            data: {
              type: 'object',
              description: 'Response data (only present for successful responses)'
            },
            message: {
              type: 'string',
              description: 'Human-readable message'
            },
            error: {
              type: 'object',
              description: 'Error details (only present for error responses)',
              properties: {
                code: {
                  type: 'string',
                  description: 'Machine-readable error code'
                },
                message: {
                  type: 'string',
                  description: 'Error description'
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object'
                  },
                  description: 'Additional error details'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            }
          }
        },
        PaginatedResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      description: 'Current page number'
                    },
                    limit: {
                      type: 'integer',
                      description: 'Items per page'
                    },
                    total: {
                      type: 'integer',
                      description: 'Total number of items'
                    },
                    totalPages: {
                      type: 'integer',
                      description: 'Total number of pages'
                    },
                    hasNextPage: {
                      type: 'boolean',
                      description: 'Whether there is a next page'
                    },
                    hasPrevPage: {
                      type: 'boolean',
                      description: 'Whether there is a previous page'
                    }
                  }
                }
              }
            }
          ]
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Unique username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'operator', 'viewer'],
              description: 'User role'
            },
            companyId: {
              type: 'integer',
              description: 'Company ID'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user is active'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Company: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Company ID'
            },
            name: {
              type: 'string',
              description: 'Company name'
            },
            code: {
              type: 'string',
              description: 'Unique company code'
            },
            address: {
              type: 'string',
              description: 'Company address'
            },
            phone: {
              type: 'string',
              description: 'Phone number'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Company email'
            },
            taxId: {
              type: 'string',
              description: 'Tax identification number'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Product ID'
            },
            companyId: {
              type: 'integer',
              description: 'Company ID'
            },
            categoryId: {
              type: 'integer',
              description: 'Category ID'
            },
            unitId: {
              type: 'integer',
              description: 'Unit ID'
            },
            sku: {
              type: 'string',
              description: 'Stock keeping unit'
            },
            name: {
              type: 'string',
              description: 'Product name'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            productType: {
              type: 'string',
              enum: ['raw_material', 'finished_good', 'semi_finished'],
              description: 'Product type'
            },
            reorderLevel: {
              type: 'number',
              description: 'Reorder level'
            },
            maxStock: {
              type: 'number',
              description: 'Maximum stock level'
            },
            minStock: {
              type: 'number',
              description: 'Minimum stock level'
            },
            standardCost: {
              type: 'number',
              description: 'Standard cost'
            },
            sellingPrice: {
              type: 'number',
              description: 'Selling price'
            },
            weight: {
              type: 'number',
              description: 'Product weight'
            },
            volume: {
              type: 'number',
              description: 'Product volume'
            },
            shelfLife: {
              type: 'integer',
              description: 'Shelf life in days'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the product is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        ProductionOrder: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Production order ID'
            },
            companyId: {
              type: 'integer',
              description: 'Company ID'
            },
            orderNumber: {
              type: 'string',
              description: 'Order number'
            },
            productId: {
              type: 'integer',
              description: 'Product ID'
            },
            bomId: {
              type: 'integer',
              description: 'Bill of materials ID'
            },
            plannedQuantity: {
              type: 'number',
              description: 'Planned quantity'
            },
            producedQuantity: {
              type: 'number',
              description: 'Produced quantity'
            },
            status: {
              type: 'string',
              enum: ['planned', 'released', 'in_progress', 'completed', 'cancelled'],
              description: 'Order status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Priority level'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Planned start date'
            },
            completionDate: {
              type: 'string',
              format: 'date',
              description: 'Planned completion date'
            },
            actualStartDate: {
              type: 'string',
              format: 'date-time',
              description: 'Actual start timestamp'
            },
            actualCompletionDate: {
              type: 'string',
              format: 'date-time',
              description: 'Actual completion timestamp'
            },
            notes: {
              type: 'string',
              description: 'Order notes'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        SalesOrder: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Sales order ID'
            },
            companyId: {
              type: 'integer',
              description: 'Company ID'
            },
            customerId: {
              type: 'integer',
              description: 'Customer ID'
            },
            orderNumber: {
              type: 'string',
              description: 'Order number'
            },
            orderDate: {
              type: 'string',
              format: 'date',
              description: 'Order date'
            },
            deliveryDate: {
              type: 'string',
              format: 'date',
              description: 'Requested delivery date'
            },
            status: {
              type: 'string',
              enum: ['draft', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled'],
              description: 'Order status'
            },
            totalAmount: {
              type: 'number',
              description: 'Total amount'
            },
            taxAmount: {
              type: 'number',
              description: 'Tax amount'
            },
            discountAmount: {
              type: 'number',
              description: 'Discount amount'
            },
            netAmount: {
              type: 'number',
              description: 'Net amount'
            },
            notes: {
              type: 'string',
              description: 'Order notes'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'Validation failed'
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'email'
                      },
                      message: {
                        type: 'string',
                        example: 'Email is required'
                      }
                    }
                  }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Items per page',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20
          }
        },
        SortParam: {
          name: 'sort',
          in: 'query',
          description: 'Sort field',
          required: false,
          schema: {
            type: 'string',
            default: 'id'
          }
        },
        OrderParam: {
          name: 'order',
          in: 'query',
          description: 'Sort order',
          required: false,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc'
          }
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          description: 'Search term',
          required: false,
          schema: {
            type: 'string'
          }
        },
        IdParam: {
          name: 'id',
          in: 'path',
          description: 'Resource ID',
          required: true,
          schema: {
            type: 'integer'
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'UNAUTHORIZED',
                  message: 'Authentication required'
                },
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'FORBIDDEN',
                  message: 'Insufficient permissions'
                },
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'NOT_FOUND',
                  message: 'Resource not found'
                },
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Validation failed',
                  details: [
                    {
                      field: 'email',
                      message: 'Email is required'
                    }
                  ]
                },
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'HR & Payroll',
        description: 'Human resources and payroll management'
      },
      {
        name: 'Inventory',
        description: 'Inventory and stock management'
      },
      {
        name: 'Manufacturing',
        description: 'Production planning and manufacturing'
      },
      {
        name: 'Sales',
        description: 'Sales orders and customer management'
      },
      {
        name: 'Procurement',
        description: 'Purchase orders and supplier management'
      },
      {
        name: 'Finance',
        description: 'Financial transactions and accounting'
      },
      {
        name: 'Logistics',
        description: 'Delivery and transportation management'
      },
      {
        name: 'Admin',
        description: 'System administration (admin only)'
      },
      {
        name: 'Reports',
        description: 'Business reports and analytics'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = {
  specs,
  swaggerOptions
};
