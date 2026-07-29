import { ArrowLeft, ImageOff, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import appwriteService from "../appwrite/config";
import { Container } from "../components";

const formatDate = (value) => {
    if (!value) return "";

    return new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
};

export default function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const user = useSelector(
        (state) => state.auth.userData
    );

    const [state, setState] = useState({
        post: null,
        loading: true,
        error: "",
    });

    const [imageFailed, setImageFailed] = useState(false);
    const [deleting, setDeleting] = useState(false);


    // Fetch Post
    useEffect(() => {
        let mounted = true;

        const fetchPost = async () => {
            try {
                if (!slug) {
                    navigate("/", { replace: true });
                    return;
                }

                const post = await appwriteService.getPost(slug);

                if (mounted) {
                    setState({
                        post,
                        loading: false,
                        error: "",
                    });
                }

            } catch (error) {
                if (mounted) {
                    setState({
                        post: null,
                        loading: false,
                        error: error.message,
                    });
                }
            }
        };

        fetchPost();

        return () => {
            mounted = false;
        };

    }, [slug, navigate]);


    // Delete Post
    const removePost = async () => {

        if (
            !window.confirm(
                "Delete this story permanently? This cannot be undone."
            )
        ) {
            return;
        }

        try {
            setDeleting(true);

            await appwriteService.deletePost(
                state.post.$id
            );


            if (state.post.featuredImage) {
                await appwriteService.deleteFile(
                    state.post.featuredImage
                );
            }

            navigate("/");

        } catch (error) {

            setState((prev) => ({
                ...prev,
                error: error.message,
            }));

        } finally {
            setDeleting(false);
        }
    };


    if (state.loading) {
        return (
            <Container>
                <div className="grid min-h-[50vh] place-items-center">
                    <span className="size-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                </div>
            </Container>
        );
    }


    if (state.error || !state.post) {
        return (
            <Container>
                <div className="mx-auto my-16 max-w-xl rounded-2xl border border-rose-100 bg-card p-8 text-center">

                    <h1 className="text-xl font-bold text-foreground">
                        This story is unavailable
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {state.error ||
                            "It may have been removed or you may not have access."
                        }
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
                    >
                        <ArrowLeft size={16} />
                        Back to discover
                    </Link>

                </div>
            </Container>
        );
    }


    const { post } = state;


    // IMAGE DEBUG
    console.log("POST DATA:", post);
    console.log(
        "FEATURE IMAGE ID:",
        post?.featuredImage
    );


    const imageUrl = appwriteService.getFilePreview(
        post?.featuredImage
    );


    console.log(
        "GENERATED IMAGE URL:",
        imageUrl
    );


    const isAuthor =
        post.userId === user?.$id;



    return (
        <article className="pb-16 pt-8 sm:pt-12">

            <Container className="max-w-4xl">


                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-indigo-600"
                >
                    <ArrowLeft size={16} />
                    All stories
                </Link>



                <header className="mt-8">

                    <div className="flex flex-wrap items-center justify-between gap-4">


                        <p className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">

                            {
                                post.status === "active"
                                    ? "Published"
                                    : "Draft"
                            }

                        </p>


                        {
                            isAuthor && (

                                <div className="flex gap-2">


                                    <Link
                                        to={`/edit-post/${post.$id}`}
                                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
                                    >

                                        <Pencil size={15}/>
                                        Edit

                                    </Link>



                                    <button
                                        onClick={removePost}
                                        disabled={deleting}
                                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600"
                                    >

                                        <Trash2 size={15}/>

                                        {
                                            deleting
                                                ? "Deleting..."
                                                : "Delete"
                                        }

                                    </button>


                                </div>

                            )
                        }


                    </div>



                    <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
                        {post.title}
                    </h1>


                    <p className="mt-4 text-sm text-muted-foreground">
                        Published {formatDate(post.$createdAt)}
                    </p>


                </header>



                <div className="mt-10 overflow-hidden rounded-2xl bg-muted">


                    {
                        imageUrl && !imageFailed ? (

                            <img
                                src={imageUrl}
                                alt={post.title}

                                onError={(event)=>{

                                    console.log(
                                        "IMAGE FAILED:",
                                        event.currentTarget.src
                                    );

                                    setImageFailed(true);
                                }}

                                className="aspect-[16/8] w-full object-cover"
                            />

                        ) : (

                            <div className="grid aspect-[16/8] place-items-center text-muted-foreground">

                                <ImageOff size={32}/>

                            </div>

                        )
                    }


                </div>



                <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">

                    {
                        parse(
                            post.content ||
                            "<p>No story content was added.</p>"
                        )
                    }

                </div>


            </Container>


        </article>
    );
}