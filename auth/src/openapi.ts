const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` })
const content = (schema: object) => ({ "application/json": { schema } })
const response = (description: string, schema: object) => ({ description, content: content(schema) })
const body = (schema: object) => ({ required: true, content: content(schema) })

const email = { type: "string", format: "email", example: "kira@test.com" }
const password = { type: "string", minLength: 8, maxLength: 72, example: "password123" }
const token = { type: "string", example: "eyJhbGciOiJIUzI1NiJ9..." }

export const openapi = {
    openapi: "3.1.0",
    info: {
        title: "Auth API",
        version: "1.0.0",
        description: "Register, activate, login, password reset and current user"
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
        securitySchemes: {
            bearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
        },
        schemas: {
            Error: {
                type: "object",
                properties: { error: { type: "string" } }
            },
            Message: {
                type: "object",
                properties: { message: { type: "string" } }
            },
            PublicUser: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    email,
                    photo: { type: ["string", "null"] },
                    isActive: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            RegisterResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    token
                },
                required: ["message", "token"]
            },
            AuthResponse: {
                type: "object",
                properties: {
                    token,
                    user: ref("PublicUser")
                },
                required: ["token", "user"]
            }
        }
    },
    paths: {
        "/register": {
            post: {
                tags: ["Auth"],
                summary: "Create an account and send an activation code",
                requestBody: body({
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Kira" },
                        email,
                        password
                    }
                }),
                responses: {
                    "201": response("Account created with an activation token", ref("RegisterResponse")),
                    "400": response("Validation error", { type: "object" }),
                    "409": response("Email already in use", ref("Error"))
                }
            }
        },
        "/activate": {
            post: {
                tags: ["Auth"],
                summary: "Activate the account using the token and emailed code",
                requestBody: body({
                    type: "object",
                    required: ["token", "code"],
                    properties: {
                        token,
                        code: { type: "string", minLength: 4, maxLength: 6, example: "0000" }
                    }
                }),
                responses: {
                    "200": response("Account activated", ref("AuthResponse")),
                    "400": response("Invalid or expired code or account already active", ref("Error")),
                    "401": response("Invalid or expired token", ref("Error"))
                }
            }
        },
        "/resend-activation": {
            post: {
                tags: ["Auth"],
                summary: "Send a new activation code using the token",
                requestBody: body({
                    type: "object",
                    required: ["token"],
                    properties: { token }
                }),
                responses: {
                    "200": response("Activation code resend request processed", ref("Message")),
                    "400": response("Validation error", { type: "object" }),
                    "401": response("Invalid or expired token", ref("Error"))
                }
            }
        },
        "/login": {
            post: {
                tags: ["Auth"],
                summary: "Login and get an access token",
                requestBody: body({
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email,
                        password: { type: "string", example: "password123" }
                    }
                }),
                responses: {
                    "200": response("Logged in", ref("AuthResponse")),
                    "400": response("Validation error", { type: "object" }),
                    "401": response("Invalid email or password", ref("Error")),
                    "403": response("Account is not activated", ref("Error"))
                }
            }
        },
        "/forgot-password": {
            post: {
                tags: ["Auth"],
                summary: "Send a password reset link",
                requestBody: body({
                    type: "object",
                    required: ["email"],
                    properties: { email }
                }),
                responses: {
                    "200": response("Always returned, whether the email exists or not", ref("Message")),
                    "400": response("Validation error", { type: "object" })
                }
            }
        },
        "/reset-password": {
            post: {
                tags: ["Auth"],
                summary: "Set a new password using the emailed token",
                requestBody: body({
                    type: "object",
                    required: ["token", "password"],
                    properties: {
                        token,
                        password
                    }
                }),
                responses: {
                    "200": response("Password updated", ref("Message")),
                    "400": response("Invalid or expired token", ref("Error"))
                }
            }
        },
        "/me": {
            get: {
                tags: ["User"],
                summary: "Get the current user from the token",
                security: [{ bearer: [] }],
                responses: {
                    "200": response("Current user", {
                        type: "object",
                        properties: { user: ref("PublicUser") },
                        required: ["user"]
                    }),
                    "401": response("Missing, invalid or expired token", ref("Error"))
                }
            }
        }
    }
}

export const docsPage = `<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Auth API</title>
</head>
<body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`