import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useFetch } from "#/hooks/useFetch"

export const Route = createFileRoute("/auth/login")({
  component: Login
})

function Login() {
  const navigate = useNavigate()
  const [state, setState] = useState({ email: "", password: "" })

  const [isPending, login] = useFetch<typeof state>("/auth/login", "POST", (res) => {
    localStorage.setItem("AUTH_TOKEN", res.token)
    navigate({ to: "/auth/me" })
  })

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, [e.target.name]: e.target.value })

  return (
    <div>
      <p>Login</p>
      <input name="email" type="email" placeholder="Email" value={state.email} onChange={change} />
      <input name="password" type="password" placeholder="Password" value={state.password} onChange={change} />
      <button disabled={isPending} onClick={() => login(state)}>Login</button>
    </div>
  )
}