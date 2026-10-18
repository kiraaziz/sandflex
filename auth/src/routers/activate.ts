import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import z from "zod"
import { db } from "../utils/db.js"
import { verifyToken, createToken, publicUser } from "../utils/user.js"

export const authActivate = new Hono()

authActivate.post("/", zValidator("json", z.object({
    code: z.string().trim().min(4).max(6)
})), async (c) => {
    const body = c.req.valid("json")
    const header = c.req.header("Authorization")

    if (!header || !header.startsWith("Bearer ")) {
        return c.json({ message: "Unauthorized" }, 401)
    }

    const userId = await verifyToken(header.slice(7))

    if (!userId) {
        return c.json({ message: "Invalid or expired token" }, 401)
    }

    const user = await db.user.findUnique({ where: { id: userId } })

    if (!user) {
        return c.json({ message: "Invalid or expired token" }, 401)
    }

    if (user.isActive) {
        return c.json({ message: "Account already active" }, 400)
    }

    const otp = await db.otp.findFirst({
        where: {
            userId: user.id,
            code: body.code,
            usedAt: null,
            expiresAt: { gt: new Date() }
        }
    })

    if (!otp) {
        return c.json({ message: "Invalid or expired code" }, 400)
    }

    const [, activated] = await db.$transaction([
        db.otp.update({ where: { id: otp.id }, data: { usedAt: new Date() } }),
        db.user.update({ where: { id: user.id }, data: { isActive: true } })
    ])

    return c.json({
        token: await createToken(activated.id),
        user: publicUser(activated),
        message: "Account activated successfully!"
    })
})