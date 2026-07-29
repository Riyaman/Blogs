import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import appwriteService from "../appwrite/config";
import { Container, EmptyState, PostCard } from "../components";


export default function AllPost() {

    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);



    useEffect(() => {

        let mounted = true;


        const fetchPosts = async () => {

            try {

                setLoading(true);
                setError("");


                const response = await appwriteService.getPosts({
                    status: null,
                });


                if (!mounted) return;


                setPosts(
                    response?.documents || []
                );


            } catch (err) {

                if (!mounted) return;

                console.error(
                    "Load Posts Error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load stories"
                );

                setPosts([]);

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }
        };


        fetchPosts();


        return () => {
            mounted = false;
        };


    }, []);




    const visiblePosts = useMemo(() => {

        const searchText =
            query.trim().toLowerCase();


        return posts.filter((post) => {


            const matchesStatus =
                status === "all" ||
                post.status === status;


            const matchesSearch =
                !searchText ||
                post.title
                    ?.toLowerCase()
                    .includes(searchText);



            return (
                matchesStatus &&
                matchesSearch
            );

        });


    }, [posts, query, status]);





    return (

        <section className="py-10 sm:py-14">

            <Container>


                <div className="mb-8">

                    <p className="text-sm font-semibold text-indigo-600">
                        Your publishing workspace
                    </p>


                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        Story library
                    </h1>


                    <p className="mt-2 text-muted-foreground">
                        Search, review, and manage your published stories.
                    </p>

                </div>




                <div className="mb-8 flex flex-col gap-3 sm:flex-row">


                    <label className="relative flex-1">

                        <Search
                            size={18}
                            className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
                        />


                        <input
                            value={query}
                            onChange={(e) =>
                                setQuery(e.target.value)
                            }
                            placeholder="Search stories..."
                            className="
                                h-11 w-full rounded-xl
                                border border-border
                                bg-background
                                pl-10 pr-4
                                text-sm text-foreground
                                outline-none
                                focus:border-indigo-500
                                focus:ring-4
                                focus:ring-indigo-100
                                dark:focus:ring-indigo-900/40
                            "
                        />

                    </label>




                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="
                            h-11 rounded-xl
                            border border-border
                            bg-background
                            px-3
                            text-sm font-medium
                            text-foreground
                            outline-none
                        "
                    >

                        <option value="all">
                            All statuses
                        </option>


                        <option value="active">
                            Published
                        </option>


                        <option value="inactive">
                            Drafts
                        </option>


                    </select>


                </div>





                {
                    loading ? (

                        <div className="
                            grid grid-cols-1
                            gap-6
                            sm:grid-cols-2
                            lg:grid-cols-3
                        ">

                            {
                                [1,2,3].map((item)=>(

                                    <div
                                        key={item}
                                        className="
                                            h-80
                                            animate-pulse
                                            rounded-2xl
                                            bg-muted
                                        "
                                    />

                                ))
                            }

                        </div>


                    ) : error ? (


                        <EmptyState
                            title="Your library is unavailable"
                            description={error}
                        />


                    ) : visiblePosts.length > 0 ? (


                        <div className="
                            grid grid-cols-1
                            gap-6
                            sm:grid-cols-2
                            lg:grid-cols-3
                        ">

                            {
                                visiblePosts.map((post)=>(

                                    <PostCard
                                        key={post.$id}
                                        post={post}
                                    />

                                ))
                            }

                        </div>


                    ) : (


                        <EmptyState
                            title="No stories found"
                            description="Try another search or create a new story."
                            action
                        />


                    )
                }



            </Container>


        </section>

    );
}