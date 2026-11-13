import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { authRegister } from "./routers/register.js"
import { authActivate } from "./routers/activate.js"
import { authLogin } from "./routers/login.js"
import { authMe } from "./routers/me.js"
import { authResendActivation } from "./routers/resendActivation.js"
import { docsPage, openapi } from "./openapi.js"
import { cors } from "hono/cors"
import { authForgotPassword } from "./routers/forgotPassword.js"
import { authResetPassword } from "./routers/resetPassword.js"

const app = new Hono()
app.use('/*', cors())

app.get("/", (c) => {
    return c.json({ ok: true })
})

app.get("/openapi.json", (c) => {
    return c.json(openapi)
})

app.get("/docs", (c) => {
    return c.html(docsPage)
})

app.route("/api/auth/register", authRegister)
app.route("/api/auth/activate", authActivate)
app.route("/api/auth/resend-activation", authResendActivation)
app.route("/api/auth/login", authLogin)
app.route("/api/auth/forgot-password", authForgotPassword)
app.route("/api/auth/reset-password", authResetPassword)
app.route("/api/auth/me", authMe)

serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server running on http://localhost:${info.port}`)
})