export type PublicUser = {
    id: string
    name: string
    email: string
    photo: string | null
    isActive: boolean
    createdAt: string
}

// const ACCESS_KEY = "access_token"
// const PENDING_KEY = "activation_token"

// export const tokens = {
//     access: () => localStorage.getItem(ACCESS_KEY),
//     setAccess: (value: string) => localStorage.setItem(ACCESS_KEY, value),
//     clearAccess: () => localStorage.removeItem(ACCESS_KEY),
//     pending: () => localStorage.getItem(PENDING_KEY),
//     setPending: (value: string) => localStorage.setItem(PENDING_KEY, value),
//     clearPending: () => localStorage.removeItem(PENDING_KEY)
// }

// export const readData = <T>(res: any) => res.data as T

// export const readForm = <T>(event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     return Object.fromEntries(new FormData(event.currentTarget)) as T
// }

// export const getMe = async (): Promise<PublicUser> => {
//     const res = await fetch(`/api${authPaths.me}`, {
//         headers: { Authorization: `Bearer ${tokens.access()}` }
//     })
//     if (!res.ok) throw new Error(String(res.status))
//     const json = await res.json()
//     return json.user
// }