import { LogOut } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

export default function LogoutBtn() {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);

    const handleLogout = async () => {
        setIsPending(true);
        try {
            await authService.logout();
            dispatch(logout());
        } finally {
            setIsPending(false);
        }
    };

    return <button type="button" onClick={handleLogout} disabled={isPending} className="ml-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-60"><LogOut size={16} /> <span className="hidden sm:inline">Sign out</span></button>;
}
