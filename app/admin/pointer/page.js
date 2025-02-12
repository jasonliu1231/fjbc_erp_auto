"use client";

import { useState } from "react";
import Rollcall from "./rollcall";
import Attendance from "./attendance";
import Pointer from "./pointer";
import Alert from "../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [type, setType] = useState(1);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 ">
        <span className="isolate inline-flex rounded-md shadow-sm">
          <button
            onClick={() => {
              setType(1);
            }}
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            手動點名/簽到
          </button>
          <button
            onClick={() => {
              setType(2);
            }}
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            補點名
          </button>
          <button
            onClick={() => {
              setType(3);
            }}
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            補簽到
          </button>
        </span>
        <div>{type == 1 ? <Pointer setInfo={setInfo} /> : type == 2 ? <Rollcall setInfo={setInfo} /> : <Attendance setInfo={setInfo} />}</div>
      </div>
    </>
  );
}
