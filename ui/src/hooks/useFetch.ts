import { useRouter } from "@tanstack/react-router"
import { useTransition } from "react"
import { toast } from "sonner"


export type UseFetchReturn<DataType = any> = [
    boolean,
    (data: DataType, showInfo?: boolean) => Promise<void>
]

export function useFetch<DataType = unknown>(
    path: string,
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
    action?: (data: any) => void,
    {
        showSonner = true,
        showActionOnError = false,
        refresh = true,
    }: {
        showSonner?: boolean,
        showActionOnError?: boolean,
        refresh?: boolean
    } = {}
): UseFetchReturn<DataType> {

    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const Run = async (data: DataType): Promise<void> => {
        startTransition(async () => {
            try {
                const req = await fetch(`http://localhost:3000/api${path}`, {
                    method,
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`
                    },
                    cache: "no-cache",
                })

                const res: any = await req.json()

                if (!req.ok) {
                    showSonner && toast.error(`🥲 ${res.message || `Error: ${req.status}`}`)

                    if (showActionOnError && action) {
                        action(res)
                    }

                    return
                }

                refresh && router.invalidate()

                if (res.success === false) {
                    showSonner && toast.error(`🥲 ${res.message}`)

                    if (showActionOnError && action) {
                        action(res)
                    }
                } else {
                    showSonner && toast.success(`✨🎉 ${res.message}`)
                    action && action(res)
                }
            } catch (error: any) {
                console.error(error)
                showSonner && toast.error(`🥲 ${error.message || "Something went wrong"}`)
            }
        })
    }

    return [isPending, Run]
}