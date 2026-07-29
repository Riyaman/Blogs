import { FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({ title = "Nothing published yet", description = "The next useful idea can start here.", action = false }) {
    return <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"><FileText className="mx-auto mb-4 text-muted-foreground" size={32} /><h2 className="text-lg font-semibold text-foreground">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>{action && <Link to="/add-post" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"><Plus size={16} />Write a story</Link>}</div>;
}
