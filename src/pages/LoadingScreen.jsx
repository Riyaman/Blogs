export default function LoadingScreen({ label = "Preparing your workspace…" }) {
    return <div className="grid min-h-[50vh] place-items-center"><div className="flex items-center gap-3 text-sm font-medium text-slate-500"><span className="size-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />{label}</div></div>;
}
