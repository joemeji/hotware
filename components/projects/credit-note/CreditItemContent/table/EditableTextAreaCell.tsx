import React, { useEffect, useState, useRef } from "react";

const replaceBreakTags = (str: string) => {
  return str?.replace(/<br\s*\/?>/gi, "\n");
};

const EditableTextareaCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(replaceBreakTags(initialValue));
  const [editable, setEditable] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setValue(replaceBreakTags(initialValue));
  }, [initialValue]);

  const submit = () => {
    if (!(editorRef?.current as any)?.innerHTML) {
      return;
    }

    table.options.meta?.updateData(
      row.original[column.columnDef.meta.id],
      column.id,
      (editorRef?.current as any)?.innerHTML
    );
    setEditable(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      // Enter
      submit();
    } else if (e.keyCode === 27) {
      // Esc
      setValue(replaceBreakTags(initialValue));
      setEditable(false);
    }
  };

  if (!column?.columnDef?.meta?.editable) {
    return (
      <div
        className="whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: value }}
      ></div>
    );
  }
  
  if (editable) {
    return (
      <div
        ref={editorRef}
        className="whitespace-pre-line"
        contentEditable="true"
        dangerouslySetInnerHTML={{ __html: value }}
        onBlur={submit}
        autoFocus={true}
        onKeyDown={handleKeyDown}
      ></div>
    );
  }

  return (
    <div
      className="whitespace-pre-line"
      onClick={() => setEditable(true)}
      dangerouslySetInnerHTML={{ __html: value }}
    ></div>
  );
};

export default EditableTextareaCell;
