import type { OpenAPIObject } from "openapi3-ts/oas30";

export const openApiSpec: OpenAPIObject = {
    openapi: "3.0.3",
    info: {
        title: "Auth Service API",
        description: "Authentication & Authorization microservice",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {
        "/v1/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register User",
                security: [], // Public endpoint
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fullName", "email", "phone", "password"],
                                properties: {
                                    fullName: { type: "string", example: "John Doe" },
                                    email: { type: "string", example: "john@test.com" },
                                    phone: { type: "string", example: "9876543210" },
                                    password: { type: "string", example: "SecurePass123" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string", example: "User registered successfully" }
                                    }
                                }
                            }
                        }
                    },
                    "409": {
                        description: "Email or phone already exists",
                    },
                },
            },
        },

        "/v1/seller/register": {
            post: {
                tags: ["Auth"],
                summary: "Register Seller",
                security: [], // Public endpoint
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "phone", "password"],
                                properties: {
                                    email: { type: "string", example: "seller@test.com" },
                                    phone: { type: "string", example: "9876543211" },
                                    password: { type: "string", example: "SecureSellerPass123" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Seller registered successfully (Pending Approval)",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string", example: "Seller registration submitted for approval" }
                                    }
                                }
                            }
                        }
                    },
                    "409": {
                        description: "Email or phone already exists",
                    },
                },
            },
        },

        "/v1/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                security: [], // Public endpoint
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["identifier", "password"],
                                properties: {
                                    identifier: { type: "string", example: "john@test.com" },
                                    password: { type: "string", example: "SecurePass123" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                email: { type: "string" },
                                                phone: { type: "string" },
                                                role: { type: "string" },
                                                status: { type: "string" }
                                            }
                                        },
                                        accessToken: { type: "string" },
                                        refreshToken: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Invalid credentials",
                    },
                },
            },
        },

        "/v1/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh Token",
                security: [], // Public endpoint
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["refreshToken"],
                                properties: {
                                    refreshToken: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Token refreshed",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        accessToken: { type: "string" },
                                        refreshToken: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Invalid refresh token",
                    },
                },
            },
        },

        "/v1/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Logged out successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string", example: "Logged out successfully" }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },

        "/v1/auth/sessions": {
            get: {
                tags: ["Auth"],
                summary: "List active sessions",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Sessions list",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        sessions: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    sessionId: { type: "string" },
                                                    userAgent: { type: "string" },
                                                    ipAddress: { type: "string" },
                                                    createdAt: { type: "string" },
                                                    updatedAt: { type: "string" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },

        "/v1/auth/sessions/{sessionId}": {
            delete: {
                tags: ["Auth"],
                summary: "Revoke session",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "sessionId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Session revoked",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string", example: "Session revoked successfully" }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Session not found",
                    },
                },
            },
        },

        // =====================================================================
        // CATEGORY ENDPOINTS (PUBLIC)
        // =====================================================================
        "/v1/categories": {
            get: {
                tags: ["Categories"],
                summary: "List all categories",
                security: [],
                responses: {
                    "200": {
                        description: "Categories list (cached)",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        categories: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string" },
                                                    name: { type: "string" },
                                                    slug: { type: "string" },
                                                    isActive: { type: "boolean" },
                                                    createdAt: { type: "string" },
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },

        // =====================================================================
        // PRODUCT ENDPOINTS (PUBLIC)
        // =====================================================================
        "/v1/products": {
            get: {
                tags: ["Products"],
                summary: "List published products (paginated, cached)",
                security: [],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
                    { name: "categoryId", in: "query", schema: { type: "string" } },
                    { name: "search", in: "query", schema: { type: "string" } },
                ],
                responses: {
                    "200": {
                        description: "Paginated products list",
                    },
                },
            },
        },

        "/v1/products/{id}": {
            get: {
                tags: ["Products"],
                summary: "Get product details (cached)",
                security: [],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "Product with variants and inventory" },
                    "404": { description: "Product not found" },
                },
            },
        },

        // =====================================================================
        // SELLER PRODUCT ENDPOINTS (PROTECTED)
        // =====================================================================
        "/v1/seller/products": {
            post: {
                tags: ["Seller Products"],
                summary: "Create product (SELLER only)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["categoryId", "title"],
                                properties: {
                                    categoryId: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    isPublished: { type: "boolean", default: false },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "Product created" },
                    "400": { description: "Invalid category ID" },
                    "403": { description: "Not a seller" },
                },
            },
            get: {
                tags: ["Seller Products"],
                summary: "List my products (SELLER only)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Seller's products" },
                },
            },
        },

        "/v1/seller/products/{id}": {
            put: {
                tags: ["Seller Products"],
                summary: "Update my product (SELLER only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    categoryId: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    isPublished: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "Product updated" },
                    "403": { description: "Not product owner" },
                },
            },
            delete: {
                tags: ["Seller Products"],
                summary: "Delete my product (SELLER only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "Product deleted" },
                    "403": { description: "Not product owner" },
                },
            },
        },

        "/v1/seller/products/{id}/variants": {
            post: {
                tags: ["Seller Products"],
                summary: "Add variant to product (SELLER only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["sku", "price"],
                                properties: {
                                    sku: { type: "string" },
                                    price: { type: "number" },
                                    compareAtPrice: { type: "number" },
                                    initialStock: { type: "integer", default: 0 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "Variant created" },
                    "403": { description: "Not product owner" },
                    "409": { description: "SKU already exists" },
                },
            },
        },

        "/v1/seller/products/variants/{id}": {
            put: {
                tags: ["Seller Products"],
                summary: "Update variant (SELLER only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    price: { type: "number" },
                                    compareAtPrice: { type: "number" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "Variant updated" },
                    "403": { description: "Not product owner" },
                },
            },
        },

        "/v1/seller/products/variants/{id}/stock": {
            put: {
                tags: ["Seller Products"],
                summary: "Update stock (SELLER only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["stock"],
                                properties: {
                                    stock: { type: "integer", minimum: 0 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "Stock updated" },
                    "403": { description: "Not product owner" },
                },
            },
        },

        // =====================================================================
        // CART ENDPOINTS (BUYER ONLY)
        // =====================================================================
        "/v1/cart": {
            get: {
                tags: ["Cart"],
                summary: "Get shopping cart (cached)",
                description: "Returns the buyer's shopping cart with all items and current prices",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Cart with items",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        cart: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                userId: { type: "string" },
                                                items: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            id: { type: "string" },
                                                            productId: { type: "string" },
                                                            variantId: { type: "string" },
                                                            quantity: { type: "integer" },
                                                            priceSnapshot: { type: "number" },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "403": { description: "Not a buyer (USER role required)" },
                },
            },
        },

        "/v1/cart/items": {
            post: {
                tags: ["Cart"],
                summary: "Add item to cart",
                description: "Adds a product variant to cart. Price is snapshotted at add time. Validates stock availability.",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["productId", "variantId", "quantity"],
                                properties: {
                                    productId: { type: "string" },
                                    variantId: { type: "string" },
                                    quantity: { type: "integer", minimum: 1, maximum: 100 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "Item added to cart" },
                    "400": { description: "Insufficient stock or invalid data" },
                    "403": { description: "Not a buyer" },
                    "404": { description: "Product or variant not found" },
                },
            },
        },

        "/v1/cart/items/{id}": {
            put: {
                tags: ["Cart"],
                summary: "Update cart item quantity",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["quantity"],
                                properties: {
                                    quantity: { type: "integer", minimum: 1, maximum: 100 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "Cart item updated" },
                    "400": { description: "Insufficient stock" },
                    "404": { description: "Cart item not found" },
                },
            },
            delete: {
                tags: ["Cart"],
                summary: "Remove item from cart",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "Item removed from cart" },
                    "404": { description: "Cart item not found" },
                },
            },
        },

        // =====================================================================
        // CHECKOUT ENDPOINT
        // =====================================================================
        "/v1/checkout": {
            post: {
                tags: ["Checkout"],
                summary: "Process checkout",
                description: "Validates inventory, reserves stock, creates order, and clears cart. This is a transactional operation.",
                security: [{ bearerAuth: [] }],
                responses: {
                    "201": {
                        description: "Order placed successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        order: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                userId: { type: "string" },
                                                status: { type: "string", enum: ["PLACED", "CONFIRMED", "CANCELLED"] },
                                                totalAmount: { type: "number" },
                                                createdAt: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Cart empty or insufficient stock" },
                    "403": { description: "Not a buyer" },
                },
            },
        },

        // =====================================================================
        // BUYER ORDER ENDPOINTS
        // =====================================================================
        "/v1/orders": {
            get: {
                tags: ["Orders (Buyer)"],
                summary: "List buyer's orders (cached)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of orders",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        orders: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string" },
                                                    status: { type: "string" },
                                                    totalAmount: { type: "number" },
                                                    createdAt: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        "/v1/orders/{id}": {
            get: {
                tags: ["Orders (Buyer)"],
                summary: "Get order details (cached)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "Order with items" },
                    "404": { description: "Order not found" },
                },
            },
        },

        // =====================================================================
        // SELLER ORDER ENDPOINTS
        // =====================================================================
        "/v1/seller/orders": {
            get: {
                tags: ["Orders (Seller)"],
                summary: "List seller's order items",
                description: "Returns all order items that belong to this seller across all orders",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of order items for seller",
                    },
                    "403": { description: "Not a seller" },
                },
            },
        },

        "/v1/seller/orders/{id}": {
            get: {
                tags: ["Orders (Seller)"],
                summary: "Get seller's view of order",
                description: "Returns only the order items belonging to this seller for a specific order",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "Order items belonging to seller" },
                    "403": { description: "No items in this order belong to you" },
                    "404": { description: "Order not found" },
                },
            },
        },

        // =====================================================================
        // PAYMENT ENDPOINTS
        // =====================================================================
        "/v1/payments/initiate": {
            post: {
                tags: ["Payments"],
                summary: "Initiate payment flow",
                description: "Starts a payment for an order. Creates a pending payment record and returns provider-specific checkout info.",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["orderId", "provider"],
                                properties: {
                                    orderId: { type: "string" },
                                    provider: { type: "string", enum: ["MOCK", "RAZORPAY", "STRIPE"] },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Payment initiated",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                paymentId: { type: "string" },
                                                providerPaymentId: { type: "string" },
                                                checkoutUrl: { type: "string" },
                                                amount: { type: "number" },
                                                currency: { type: "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Order already paid or invalid request" },
                    "404": { description: "Order not found" },
                },
            },
        },

        "/v1/payments/{orderId}": {
            get: {
                tags: ["Payments"],
                summary: "Get payment details",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "orderId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "Payment details" },
                    "403": { description: "Unauthorized" },
                    "404": { description: "Payment not found" },
                },
            },
        },

        "/v1/payments/webhook/{provider}": {
            post: {
                tags: ["Payments"],
                summary: "Handle payment webhook",
                description: "Receives status updates from payment providers. Public endpoint with signature verification.",
                security: [], // Public
                parameters: [
                    { name: "provider", in: "path", required: true, schema: { type: "string" } },
                ],
                // We typically verify signatures via headers, but schema doesn't force documented headers
                responses: {
                    "200": { description: "Webhook processed" },
                    "400": { description: "Invalid provider or signature" },
                },
            },
        },

        // =====================================================================
        // SETTLEMENT ENDPOINTS (SELLER)
        // =====================================================================
        "/v1/seller/settlements": {
            get: {
                tags: ["Settlements"],
                summary: "List seller settlements",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of settlements",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string" },
                                                    amount: { type: "number" },
                                                    status: { type: "string", enum: ["PENDING", "PAID", "FAILED"] },
                                                    createdAt: { type: "string", format: "date-time" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": { description: "Not a seller" },
                },
            },
        },
    },
};