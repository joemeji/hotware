import { forwardRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface RichTextEditor {
  height?: number;
  value?: any;
}

export const RichTextEditor = forwardRef(function RichTextEditor(
  props: RichTextEditor,
  ref: any
) {
  return (
    <Editor
      apiKey="04sk289ludyrfi5kd1q177jn3s1gawi4oh2ekv65iajnsacb"
      onInit={(evt: any, editor: any) => (ref.current = editor)}
      initialValue={props?.value || ""}
      init={{
        ui_mode: "split",
        height: props?.height || 500,
        menubar: false,
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
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        newline_behavior: "linebreak",
      }}
    />
  );
});
