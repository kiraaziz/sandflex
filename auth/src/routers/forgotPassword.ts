import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { createHash, randomBytes } from "node:crypto"
import { db } from "../utils/db.js"
import { sendPasswordResetEmail } from "../utils/mail.js"
import z from "zod"

export const authForgotPassword = new Hono()

authForgotPassword.post("/", zValidator("json", z.object({
    email: z.string().trim().toLowerCase().email()
})), async (c) => {

    const body = c.req.valid("json")
    const user = await db.user.findUnique({ where: { email: body.email } })

    if (user && user.isActive) {
        await db.passwordReset.updateMany({
            where: { userId: user.id, usedAt: null },
            data: { usedAt: new Date() }
        })

        const token = randomBytes(32).toString("hex")

        await db.passwordReset.create({
            data: {
                userId: user.id,
                tokenHash: createHash("sha256").update(token).digest("hex"),
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            }
        })

        await sendPasswordResetEmail(user.email, user.name, token)
    }

    return c.json({ message: "If the email exists, a reset link was sent" })
})