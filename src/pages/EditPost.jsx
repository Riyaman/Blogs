import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, PostForm } from "../components";

export default function EditPost() {
    const { slug } = useParams(); const navigate = useNavigate(); const [state, setState] = useState({ post: null, loading: true, error: "" });
    useEffect(() => { let active = true; appwriteService.getPost(slug).then((post) => active && setState({ post, loading: false, error: "" })).catch((error) => active && setState({ post: null, loading: false, error: error.message })); return () => { active = false; }; }, [slug]);
    if (state.loading) return <Container><div className="grid min-h-[50vh] place-items-center"><span className="size-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" /></div></Container>;
    if (state.error) return <Container><div className="my-16 rounded-2xl border border-rose-100 bg-card p-8 text-center"><p className="font-medium text-rose-700">{state.error}</p><button type="button" onClick={() => navigate("/all-posts")} className="mt-4 text-sm font-semibold text-indigo-600">Return to library</button></div></Container>;
    return <section className="py-10 sm:py-14"><Container><PostForm post={state.post} /></Container></section>;
}
