import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import z from "zod"
import bcrypt from "bcryptjs"
import { db } from "../utils/db.js"
import { createToken, publicUser } from "../utils/user.js"

export const authLogin = new Hono()

authLogin.post("/", zValidator("json", z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1)
})), async (c) => {

    const body = c.req.valid("json")
    const user = await db.user.findUnique({ where: { email: body.email } })

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
        return c.json({ message: "Invalid email or password" }, 401)
    }

    if (!user.isActive) {
        return c.json({ message: "Account is not activated" }, 403)
    }

    return c.json({
        token: await createToken(user.id),
        user: publicUser(user),
        message: "Welcome! Your account has been activated successfully. We're glad to have you on board!"
    })
})