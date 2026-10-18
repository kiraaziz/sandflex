import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/auth")({
    component: AuthLayout
})

function AuthLayout() {
    return (
        <div>
            <nav>
                <Link to="/auth/login">Login</Link>{" "}
                <Link to="/auth/register">Register</Link>{" "}
                <Link to="/auth/forgot-password">Forgot password</Link>{" "}
                <Link to="/auth/me">Me</Link>
            </nav>
            <Outlet />
        </div>
    )
}