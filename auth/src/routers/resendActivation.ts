import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import z from "zod"
import { db } from "../utils/db.js"
import { verifyToken } from "../utils/user.js"
import { sendActivationEmail } from "../utils/mail.js"
import { randomInt } from "node:crypto"

export const authResendActivation = new Hono()

authResendActivation.post("/", zValidator("json", z.object({
    token: z.string().min(1)
})), async (c) => {
    const body = c.req.valid("json")
    const payload = await verifyToken(body.token)

    if (!payload) {
        return c.json({ message: "Invalid or expired token" }, 401)
    }

    const user = await db.user.findUnique({
        where: { id: payload }
    })

    if (user && !user.isActive) {
        await db.otp.deleteMany({
            where: { userId: user.id, usedAt: null }
        })

        const code = randomInt(0, 1_000_000).toString().padStart(6, "0")

        await db.otp.create({
            data: {
                userId: user.id,
                code,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }
        })

        await sendActivationEmail(user.email, user.name, code)
    }

    return c.json({
        message: "If the account exists and is not active, a new activation code was sent"
    })
})