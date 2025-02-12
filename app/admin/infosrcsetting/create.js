"use client";

import { useState } from "react";
import { error } from "../../utils";

export default function Example({ setInfo }) {
  const [srcName, setSrcName] = useState("");

  function handleInput(event) {
    const val = event.target.value;
    setSrcName(val.trim());
  }

  async function addItem(e) {
    e.preventDefault();
    if (srcName == "") {
      setInfo({
        show: true,
        success: false,
        msg: "來源名稱不可以為空白"
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
      body: JSON.stringify({
        info_name: srcName
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/info_source/`, config);
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "資料已新增"
      });
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
    <div className="isolate bg-white px-4 py-20 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">新增問班來源</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">請輸入來源名稱</p>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              來源名稱
            </label>
            <div className="sm:mt-2.5">
              <input
                id="srcName"
                name="srcName"
                type="text"
                autoComplete="name"
                value={srcName}
                onChange={handleInput}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
