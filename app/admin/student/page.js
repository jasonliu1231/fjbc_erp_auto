"use client";

import List from "./list";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";
import Alert from "../alert";
import { useState } from "react";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2">
        <div className="mx-auto px-2 py-2 sm:py-4 flex justify-between">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">學生列表</h1>
          {/* <a href="/admin/student/create">
            <PlusCircleIcon className="w-8 sm:w-12 text-blue-700 hover:text-blue-400" />
          </a> */}
        </div>

        <List
          error={error}
          setInfo={setInfo}
        />
      </div>
    </>
  );
}
