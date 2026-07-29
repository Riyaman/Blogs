import { ImagePlus, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import appwriteService from "../../appwrite/config";
import { Button, Input, RTE, Select } from "..";

const makeSlug = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");


export default function PostForm({ post }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      content: post?.content ?? "",
      status: post?.status ?? "active",
    },
  });


  const submit = async (data) => {
    if (!user && !post) {
      setServerError("You must be logged in to create a post.");
      return;
    }

    setServerError("");
    setIsSubmitting(true);

    let uploadedFile = null;

    try {
      const imageFile = data.image?.[0];

      if (imageFile) {
        uploadedFile = await appwriteService.uploadFile(imageFile);

        if (!uploadedFile) {
          throw new Error("Image upload failed");
        }
      }


      const postData = {
        title: data.title,
        slug:
          data.slug ||
          makeSlug(data.title),

        content: data.content,

        status: data.status,

        featuredImage:
          uploadedFile?.$id ||
          post?.featuredImage ||
          "",

        userId:
          post?.userId ||
          user.$id,
      };


      const savedPost = post
        ? await appwriteService.updatePost(
            post.$id,
            postData
          )
        : await appwriteService.createPost(
            postData
          );


      if (!savedPost) {
        throw new Error("Unable to save post");
      }


      // delete old image after successful update
      if (
        uploadedFile &&
        post?.featuredImage
      ) {
        await appwriteService
          .deleteFile(post.featuredImage)
          .catch(() => {});
      }


      navigate(`/post/${savedPost.$id}`);


    } catch (error) {

      if (uploadedFile) {
        await appwriteService
          .deleteFile(uploadedFile.$id)
          .catch(() => {});
      }

      setServerError(
        error.message ||
        "Something went wrong"
      );

    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mx-auto max-w-6xl"
    >

      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">
          {post ? "Refine your draft" : "New story"}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          {post
            ? "Edit story"
            : "Write without the clutter"}
        </h1>

        <p className="mt-2 text-muted-foreground">
          A cover, a clear title, and your ideas are all you need.
        </p>
      </div>


      {serverError && (
        <div className="mb-6 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {serverError}
        </div>
      )}



      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">


        <div className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">


          <Input
            label="Story title"
            placeholder="Give your idea a clear name"
            error={errors.title?.message}

            {...register(
              "title",
              {
                required:
                  "Title is required",

                minLength:{
                  value:3,
                  message:
                    "Minimum 3 characters required",
                },

                onBlur:(event)=>{

                  if(!post){

                    setValue(
                      "slug",
                      makeSlug(
                        event.target.value
                      ),
                      {
                        shouldValidate:true,
                        shouldDirty:true,
                      }
                    );

                  }

                },
              }
            )}
          />



          <Input
            label="URL slug"
            placeholder="your-story-title"
            error={errors.slug?.message}

            {...register(
              "slug",
              {
                required:
                  "Slug is required",

                pattern:{
                  value:
/^[a-z0-9]+(?:-[a-z0-9]+)*$/,

                  message:
                    "Only lowercase letters, numbers and hyphens allowed",
                },
              }
            )}
          />



          <RTE
            label="Story"
            name="content"
            control={control}
            defaultValue={
              post?.content || ""
            }
          />

          {errors.content && (
            <p className="text-xs text-rose-600">
              {errors.content.message}
            </p>
          )}

        </div>



        <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm">


          <div>
            <h2 className="font-semibold text-foreground">
              Publishing
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Publish now or save as draft.
            </p>
          </div>



          <Select
            label="Visibility"
            options={[
              "active",
              "inactive",
            ]}
            {...register("status")}
          />



          <Input
            label="Cover image"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"

            error={
              errors.image?.message
            }

            {...register(
              "image",
              {
                validate:{
                  fileType:(files)=>
                    !files?.[0] ||
                    files[0]
                    .type
                    .startsWith("image/") ||
                    "Select an image",

                  fileSize:(files)=>
                    !files?.[0] ||
                    files[0].size <=
                    5 * 1024 * 1024 ||
                    "Image must be under 5MB",
                },
              }
            )}
          />



          {post?.featuredImage && (

            <img
              src={
                appwriteService
                .getFilePreview(
                  post.featuredImage
                )
              }

              alt="Current cover"

              className="aspect-video w-full rounded-xl object-cover"

            />

          )}



          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >

            <Save size={16} className="mr-2"/>

            {
              isSubmitting
              ? "Saving..."
              : post
              ? "Save changes"
              : "Publish story"
            }

          </Button>


          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImagePlus size={14}/>
            Images are stored in Appwrite Storage.
          </p>


        </aside>

      </div>

    </form>
  );
}