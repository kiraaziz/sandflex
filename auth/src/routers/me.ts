import { Hono } from "hono"
import { db } from "../utils/db.js"
import { publicUser, verifyToken } from "../utils/user.js"

export const authMe = new Hono()

authMe.get("/", async (c) => {

    const header = c.req.header("Authorization")

    if (!header || !header.startsWith("Bearer ")) {
        return c.json({ message: "Unauthorized" }, 401)
    }

    const userId = await verifyToken(header.slice(7))

    if (!userId) {
        return c.json({ message: "Invalid or expired token" }, 401)
    }

    const user = await db.user.findUnique({ where: { id: userId } })

    if (!user || !user.isActive) {
        return c.json({ message: "Unauthorized" }, 401)
    }

    return c.json({ message: publicUser(user) })
})