import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useFetch } from "#/hooks/useFetch"

export const Route = createFileRoute("/auth/me")({
    beforeLoad: () => {
        if (!localStorage.getItem("AUTH_TOKEN")) throw redirect({ to: "/auth/login" })
    },
    component: Me
})

function Me() {
    const navigate = useNavigate()
    const [state, setState] = useState({ name: "", email: "", isActive: false })

    const [isPending, me] = useFetch<void>("/auth/me", "GET", (res) => {
        setState(res.user)
    }, { showSonner: false, refresh: false })

    useEffect(() => {
        me()
    }, [])

    return (
        <div>
            <p>Me</p>
            {JSON.stringify(state)}
            {/* <p>{state.name}</p>
            <p>{state.email}</p>
            <p>{state.isActive ? "Active" : "Not active"}</p> */}
            <button
                disabled={isPending}
                onClick={() => {
                    localStorage.removeItem("AUTH_TOKEN")
                    navigate({ to: "/auth/login" })
                }}
            >
                Logout
            </button>
        </div>
    )
}