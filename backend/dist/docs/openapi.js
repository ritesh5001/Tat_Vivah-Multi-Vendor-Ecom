export const openApiSpec = {
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
    },
};
//# sourceMappingURL=openapi.js.map