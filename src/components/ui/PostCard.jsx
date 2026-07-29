import { ArrowUpRight, ImageOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../../appwrite/config";

const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
          }).format(new Date(value))
        : "Recently published";


export default function PostCard({ post }) {

    const [imageFailed, setImageFailed] = useState(false);

    const imageUrl = appwriteService.getFilePreview(
        post?.featuredImage
    );


    return (

        <Link
            to={`/post/${post.$id}`}
            className="
                group block h-full
                overflow-hidden
                rounded-2xl
                border border-border
                bg-card
                shadow-sm
                transition
                duration-200
                hover:-translate-y-1
                hover:border-indigo-200
                hover:shadow-xl
                hover:shadow-indigo-100/60
                dark:hover:shadow-indigo-950/40
            "
        >


            <div
                className="
                    relative
                    aspect-[16/9]
                    overflow-hidden
                    bg-gradient-to-br
                    from-indigo-100
                    via-violet-50
                    to-amber-50
                    dark:from-indigo-950/70
                    dark:via-violet-950/60
                    dark:to-amber-950/40
                "
            >


                {
                    imageUrl && !imageFailed ? (

                        <img
                            src={imageUrl}
                            alt={post.title}

                            onError={() =>
                                setImageFailed(true)
                            }

                            className="
                                h-full
                                w-full
                                object-cover
                                transition
                                duration-500
                                group-hover:scale-105
                            "
                        />

                    ) : (

                        <ImageOff
                            size={30}
                            className="
                                absolute
                                inset-0
                                m-auto
                                text-indigo-300
                            "
                        />

                    )
                }



                <span
                    className="
                        absolute
                        left-4
                        top-4
                        rounded-full
                        bg-background/90
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-indigo-700
                        backdrop-blur
                    "
                >

                    {
                        post.status === "active"
                            ? "Published"
                            : "Draft"
                    }

                </span>


            </div>




            <div
                className="
                    flex
                    min-h-44
                    flex-col
                    p-5
                "
            >

                <p
                    className="
                        text-xs
                        font-medium
                        text-muted-foreground
                    "
                >
                    {formatDate(post.$createdAt)}
                </p>



                <h2
                    className="
                        mt-2
                        line-clamp-2
                        text-lg
                        font-semibold
                        leading-6
                        text-foreground
                    "
                >
                    {post.title}
                </h2>



                <span
                    className="
                        mt-auto
                        inline-flex
                        items-center
                        gap-1.5
                        pt-5
                        text-sm
                        font-semibold
                        text-indigo-600
                    "
                >

                    Read story

                    <ArrowUpRight size={15}/>

                </span>


            </div>


        </Link>

    );
}