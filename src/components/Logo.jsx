import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="Inkwell home">
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition group-hover:-rotate-6">
                <PenLine size={18} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">Inkwell</span>
        </Link>
    );
}
