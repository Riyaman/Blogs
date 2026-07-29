import { BookOpen, LayoutDashboard, PenSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo, LogoutBtn } from "../index";
import { ModeToggle } from "../ui/mode-toggle";

const linkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

export default function Header() {
    const isAuthenticated = useSelector((state) => state.auth.status);

    return (
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="Main navigation">
                <Logo />
                <div className="flex items-center gap-1 sm:gap-2">
                    <NavLink to="/" end className={linkClass}><BookOpen size={16} /> <span className="hidden sm:inline">Discover</span></NavLink>
                    {isAuthenticated ? (
                        <>
                            <NavLink to="/all-posts" className={linkClass}><LayoutDashboard size={16} /> <span className="hidden sm:inline">Library</span></NavLink>
                            <NavLink to="/add-post" className={linkClass}><PenSquare size={16} /> <span className="hidden sm:inline">Write</span></NavLink>
                            <LogoutBtn />
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={linkClass}>Sign in</NavLink>
                            <NavLink to="/signup" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">Get started</NavLink>
                        </>
                    )}
                    <ModeToggle />
                </div>
            </nav>
        </header>
    );
}
