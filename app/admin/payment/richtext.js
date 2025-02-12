"use client";

import { useEffect, useState } from "react";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function Home({ createData, settingData, setSettingData }) {
  const [textareaValue, setTextareaValue] = useState(``);
  const [quill, setQuill] = useState(true);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", { list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["image"]
    ]
  };

  useEffect(() => {
    if (settingData) {
      setTextareaValue(settingData.remark);
    }
  }, [settingData?.remark]);

  useEffect(() => {
    if (createData) {
      createData.remark = textareaValue;
    }

    if (settingData) {
      setSettingData({
        ...settingData,
        remark: textareaValue
      });
    }
  }, [textareaValue]);

  return (
    <>
      <span className="isolate inline-flex shadow-sm mb-1">
        <button
          onClick={() => setQuill(true)}
          type="button"
          className="relative inline-flex items-center gap-x-1.5 rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          <PencilIcon
            aria-hidden="true"
            className="-ml-0.5 h-5 w-5 text-gray-400"
          />
          編寫
        </button>
        <button
          onClick={() => setQuill(false)}
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          <EyeIcon
            aria-hidden="true"
            className="-ml-0.5 h-5 w-5 text-gray-400"
          />
          預覽
        </button>
      </span>
      {quill ? (
        <ReactQuill
          placeholder="文字編輯器"
          theme="snow"
          value={textareaValue}
          onChange={(text) => {
            setTextareaValue(text);
          }}
          modules={modules}
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: textareaValue }}
          className="mt-2 prose max-h-60 overflow-auto"
        />
      )}
    </>
  );
}
