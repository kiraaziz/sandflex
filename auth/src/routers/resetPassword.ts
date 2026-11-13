import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { createHash } from "node:crypto"
import z from "zod"
import { db } from "../utils/db.js"
import bcrypt from "bcryptjs"

export const authResetPassword = new Hono()

authResetPassword.post("/", zValidator("json", z.object({
    token: z.string().min(1),
    password: z.string().min(8).max(72)
})), async (c) => {
    const body = c.req.valid("json")

    const reset = await db.passwordReset.findFirst({
        where: {
            tokenHash: createHash("sha256").update(body.token).digest("hex"),
            usedAt: null,
            expiresAt: { gt: new Date() }
        }
    })

    if (!reset) {
        return c.json({ message: "Invalid or expired token" }, 400)
    }

    await db.$transaction([
        db.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
        db.user.update({ where: { id: reset.userId }, data: { password: await bcrypt.hash(body.password, 12) } })
    ])

    return c.json({ message: "Password updated successfully!" })
})