import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useFetch } from "#/hooks/useFetch"

export const Route = createFileRoute("/auth/forgot-password")({
    component: ForgotPassword
})

function ForgotPassword() {
    const [state, setState] = useState({ email: "" })

    const [isPending, forgot] = useFetch<typeof state>("/auth/forgot-password", "POST")

    const change = (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, [e.target.name]: e.target.value })

    return (
        <div>
            <p>Forgot password</p>
            <input name="email" type="email" placeholder="Email" value={state.email} onChange={change} />
            <button disabled={isPending} onClick={() => forgot(state)}>Send reset link</button>
        </div>
    )
}