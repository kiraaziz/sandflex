import { sign, verify } from "hono/jwt"
const maxAge = 60 * 60 * 24 * 7

type UserSource = {
    id: string
    name: string
    email: string
    photo: string | null
    isActive: boolean
    createdAt: Date
}

export async function createToken(userId: string) {
    return sign({ sub: userId, exp: Math.floor(Date.now() / 1000) + maxAge }, process.env.JWT_SECRET!, "HS256")
}

export async function verifyToken(token: string) {
    try {
        const payload = await verify(token, process.env.JWT_SECRET!, "HS256")
        const userId = payload["sub"]
 
        if (typeof userId !== "string") {
            return null
        }
 
        return userId
    } catch {
        return null
    }
}

export function publicUser(user: UserSource) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        isActive: user.isActive,
        createdAt: user.createdAt
    }
}

