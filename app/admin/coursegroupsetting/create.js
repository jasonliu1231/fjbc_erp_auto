"use client";

import { useState } from "react";
import { error } from "../../utils";

export default function Example({ setInfo }) {
  const [input, setInput] = useState({
    course_name: "",
    course_no: "",
    color: ""
  });

  const handleName = (event) => {
    setInput({
      ...input,
      course_name: event.target.value
    });
  };

  const handleNo = (event) => {
    setInput({
      ...input,
      course_no: event.target.value
    });
  };

  const handleColor = (event) => {
    setInput({
      ...input,
      color: event.target.value
    });
  };

  async function addItem(e) {
    e.preventDefault();
    const data = {};
    if (input.course_name == "") {
      setInfo({
        show: true,
        success: false,
        msg: "群組名稱不可為空"
      });
      return;
    } else {
      data.course_name = input.course_name;
    }

    if (input.course_no == "") {
      setInfo({
        show: true,
        success: false,
        msg: "群組編號不可為空"
      });
      return;
    } else {
      data.course_no = input.course_no;
    }

    if (input.course_no != "") {
      data.color = input.color;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.reload();
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
    <div className="isolate bg-white px-6 py-12 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">新增群組</h2>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-8 sm:mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              名稱
            </label>
            <div className="sm:mt-2.5">
              <input
                type="text"
                autoComplete="name"
                value={input.course_name}
                onChange={handleName}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              編號
            </label>
            <div className="sm:mt-2.5">
              <input
                type="text"
                autoComplete="off"
                value={input.course_no}
                onChange={handleNo}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              代表色
            </label>
            <div className="sm:mt-2.5">
              <input
                type="color"
                autoComplete="off"
                value={input.color || ""}
                onChange={handleColor}
                className="h-12 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            onClick={addItem}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            新增
          </button>
        </div>
      </form>
    </div>
  );
}
