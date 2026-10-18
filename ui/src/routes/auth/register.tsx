import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useFetch } from "#/hooks/useFetch"

export const Route = createFileRoute("/auth/register")({
    component: Register
})

function Register() {
    const navigate = useNavigate()
    const [state, setState] = useState({ name: "", email: "", password: "" })

    const [isPending, Register] = useFetch<typeof state>("/auth/register", "POST", (res) => {
        localStorage.setItem("AUTH_TOKEN", res.token)
        navigate({ to: "/auth/activate" })
    })

    return (
        <div>
            <p>Register</p>
            <input placeholder="Name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
            <input type="email" placeholder="Email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} />
            <input type="password" placeholder="Password" value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} />
            <button disabled={isPending} onClick={() => Register(state)}>Register</button>
        </div>
    )
}