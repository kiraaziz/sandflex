import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useFetch } from "#/hooks/useFetch"

export const Route = createFileRoute("/auth/reset-password")({
    validateSearch: (search: Record<string, unknown>) => ({
        token: String(search.token ?? "")
    }),
    component: ResetPassword
})

function ResetPassword() {
    const { token } = Route.useSearch()
    const navigate = useNavigate()
    const [state, setState] = useState({ token, password: "" })

    const [isPending, reset] = useFetch<typeof state>("/auth/reset-password", "POST", () => {
        navigate({ to: "/auth/login" })
    })

    const change = (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, [e.target.name]: e.target.value })

    return (
        <div>
            <p>Reset password</p>
            <input name="password" type="password" placeholder="New password" value={state.password} onChange={change} />
            <button disabled={isPending} onClick={() => reset(state)}>Reset</button>
        </div>
    )
}