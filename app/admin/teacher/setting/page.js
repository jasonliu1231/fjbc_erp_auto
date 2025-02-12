"use client";

import { useEffect, useRef, useState } from "react";
import Course from "./course";
import Setting from "./setting";
import Alert from "../../alert";
import Wage from "./wage";

export default function Home() {
  const [id, setId] = useState(0);
  const [type, setType] = useState(1);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = Number(params.get("id"));
    setId(id);
  }, []);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto">
        <div className="mx-auto px-2 py-2 flex justify-between">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">教師</h1>
          <div>
            <button
              onClick={() => {
                setType(1);
              }}
              className={`${type == 1 ? "bg-blue-300" : "bg-white"} mx-1 ring-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700`}
            >
              基本資料
            </button>
            <button
              onClick={() => {
                setType(2);
              }}
              className={`${type == 2 ? "bg-blue-300" : "bg-white"} mx-1 ring-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700`}
            >
              課程表
            </button>
            <Wage
              teacher_id={id}
              setInfo={setInfo}
            />
          </div>
        </div>

        {type == 1 && (
          <Setting
            teacher_id={id}
            setInfo={setInfo}
          />
        )}
        {type == 2 && (
          <Course
            teacher_id={id}
            setInfo={setInfo}
          />
        )}
      </div>
    </>
  );
}
