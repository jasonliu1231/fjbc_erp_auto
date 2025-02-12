"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import Tree from "./tree";
import GroupCreate from "./create";
import GroupList from "./list";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(3);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料讀取中...</span>
      </div>
    );
  }

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto mb-5 p-2">
        <div className="mx-auto px-2 py-2 flex items-end justify-between">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">課程設定</h1>
          <span className="isolate inline-flex">
            <button
              onClick={() => {
                setType(1);
              }}
              type="button"
              className={`${type == 1 ? "bg-pink-200" : "bg-white"} px-2 py-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
            >
              新增大類
            </button>
            <button
              onClick={() => {
                setType(2);
              }}
              type="button"
              className={`${type == 2 ? "bg-pink-200" : "bg-white"} px-2 py-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
            >
              大類設定
            </button>
            <button
              onClick={() => {
                setType(3);
              }}
              type="button"
              className={`${type == 3 ? "bg-pink-200" : "bg-white"} px-2 py-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
            >
              內容設定
            </button>
          </span>
        </div>
        {type == 1 && <GroupCreate setInfo={setInfo} />}
        {type == 2 && <GroupList setInfo={setInfo} />}
        {type == 3 && <Tree setInfo={setInfo} />}
      </div>
    </>
  );
}
