import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import z from "zod"
import bcrypt from "bcryptjs"
import { db } from "../utils/db.js"
import { createToken } from "../utils/user.js"
import { sendActivationEmail } from "../utils/mail.js"
import { randomInt } from "node:crypto"

export const authRegister = new Hono()

authRegister.post("/", zValidator("json", z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(72)
})), async (c) => {
    const body = c.req.valid("json")
    const existing = await db.user.findUnique({ where: { email: body.email } })

    if (existing) {
        return c.json({ message: "Email already in use" }, 409)
    }

    const user = await db.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password, 12),
            isActive: false
        }
    })

    await db.otp.deleteMany({ where: { userId: user.id, usedAt: null } })

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0")

    await db.otp.create({
        data: {
            userId: user.id,
            code,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
    })

    const token = await createToken(user.id)

    await sendActivationEmail(user.email, user.name, code)

    return c.json({
        message: "Account created. Check your email for the activation code",
        token
    }, 201)
})