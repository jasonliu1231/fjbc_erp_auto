"use client";

import { useState } from "react";
import { error } from "../../utils";

const def_create = {
  course_name: "",
  color: "",
  is_course: false,
  course_no: "",
  parent_no: "FF",
  is_visable: true
};

export default function Example({ setInfo }) {
  const [create, setCreate] = useState(def_create);

  async function addItem() {
    if (create.course_name == "") {
      setInfo({
        show: true,
        success: false,
        msg: "名稱不可為空"
      });
      return;
    }

    if (create.course_no == "") {
      setInfo({
        show: true,
        success: false,
        msg: "編號不可為空"
      });
      return;
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "新增完成"
      });
      setCreate(def_create);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  return (
    <div className="isolate bg-white px-2 py-4 rounded-md">
      <div className="mx-auto text-center">
        <h2 className="text-xl font-bold text-gray-900">新增群組</h2>
      </div>
      <div className="mx-auto mt-2 px-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-900">名稱</label>
            <input
              type="text"
              value={create.course_name}
              onChange={(e) => {
                setCreate({
                  ...create,
                  course_name: e.target.value
                });
              }}
              className="block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-900">編號</label>
            <input
              type="text"
              value={create.course_no}
              onChange={(e) => {
                setCreate({
                  ...create,
                  course_no: e.target.value
                });
              }}
              className="block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>
          <div className="col-span-1">
            {" "}
            <label className="block text-sm font-semibold text-gray-900">代表色</label>
            <input
              type="color"
              value={create.color}
              onChange={(e) => {
                setCreate({
                  ...create,
                  color: e.target.value
                });
              }}
              className="h-10 block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            onClick={addItem}
            className="rounded-md bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}
