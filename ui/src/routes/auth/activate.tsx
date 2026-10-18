import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useFetch } from "#/hooks/useFetch"

export const Route = createFileRoute("/auth/activate")({
    component: Activate
})

function Activate() {
    const navigate = useNavigate()
    const [state, setState] = useState({ code: "" })

    const [isActivating, activate] = useFetch<typeof state>("/auth/activate", "POST", (res) => {
        localStorage.setItem("AUTH_TOKEN", res.token)
        navigate({ to: "/auth/me" })
    })

    const [isResending, resend] = useFetch<{ token: string }>("/auth/resend-activation", "POST")

    return (
        <div>
            {JSON.stringify(localStorage.getItem("AUTH_TOKEN"))}
            <p>Activate account</p>
            <input placeholder="Code" value={state.code} onChange={(e) => setState({ ...state, code: e.target.value })} />
            <button disabled={isActivating} onClick={() => activate(state)}>Activate</button>
            <button disabled={isResending} onClick={() => resend({} as any)}>Resend code</button>
        </div>
    )
}