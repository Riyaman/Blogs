import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import { useTheme } from "./ui/theme-provider";

export default function RTE({
  name = "content",
  control,
  label,
  defaultValue = "",
}) {
  const { theme } = useTheme();

  const currentTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          required: "Content is required",
        }}
        render={({ field: { value, onChange } }) => (
          <Editor
            key={currentTheme}
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            value={value || ""}
            onEditorChange={(content) => onChange(content)}
            init={{
              height: 500,

              menubar: true,
              branding: false,
              promotion: false,

              resize: true,
              statusbar: true,

              skin:
                currentTheme === "dark"
                  ? "oxide-dark"
                  : "oxide",

              content_css:
                currentTheme === "dark"
                  ? "dark"
                  : "default",

              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],

              toolbar:
                "undo redo | " +
                "blocks | " +
                "bold italic underline forecolor | " +
                "alignleft aligncenter alignright | " +
                "bullist numlist | " +
                "link image media table | " +
                "removeformat code fullscreen",

              toolbar_mode: "sliding",

              content_style: `
                body {
                  font-family: Inter, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.8;
                  padding: 16px;
                }

                img {
                  max-width: 100%;
                  height: auto;
                }
              `,
            }}
          />
        )}
      />
    </div>
  );
}