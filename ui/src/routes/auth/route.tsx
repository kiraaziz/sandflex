import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/auth")({
    component: AuthLayout
})

function AuthLayout() {
    return (
        <div className="grid h-svh lg:grid-cols-2">
            <div className="relative hidden lg:flex items-center justify-center p-5">
                <div className="w-full h-full hidden md:block relative rounded-2xl! overflow-hidden bg-primary/20">
                    <img src="/images/1.png" className="object-cover h-full w-full absolute opacity-100 blur-lg " />
                    <img src="/images/1.png" className="object-cover h-full w-full absolute opacity-80 " />
                    <img src="/images/2.png" className="h-full mx-auto absolute left-0 right-0" />
                    <div className="absolute bottom-0 w-full p-5  bg-linear-to-b from-transparent to-background">
                        <h1 className="text-6xl ">SendFlex</h1>
                        <p className="text-lg text-foreground/70">Your Transactions, Verified by AI. Simple, Smart, Secure.</p>
                    </div>
                </div>

            </div>
            <div className="h-svh relative">
                <video src="/video/2.mp4" autoPlay loop muted playsInline className="object-cover h-full w-full absolute lg:hidden opacity-20 top-0 -z-10" />
                <div className="h-full w-full -z-10 bg-linear-to-t from-background via-background/80 absolute top-0 lg:hidden" />
                <div className="flex-1 w-full overflow-auto h-[calc(100svh-3.5rem)] py-7 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}