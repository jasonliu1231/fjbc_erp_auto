"use client";

import { useEffect, useState } from "react";
import { error } from "../../utils";
import Alert from "../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [name, setName] = useState();
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);

  async function getList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/permission/list`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
      setLoading(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function submit() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: name })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/permission`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getList();
      setName("");
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  useEffect(() => {
    getList();
  }, []);

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
      <div className="container mx-auto">
        <div className="mx-auto px-2 mt-2">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">角色列表</h1>
        </div>
        <div className="max-w-60 my-2 flex items-center">
          <input
            value={name || ""}
            onChange={(event) => {
              setName(event.target.value);
            }}
            type="text"
            placeholder="角色名稱"
            className="p-2 block w-full rounded-l-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300"
          />
          <div className="">
            <button
              type="submit"
              onClick={submit}
              className="text-nowrap rounded-r-md bg-green-600 px-3 py-2 text-sm font-semibold text-white"
            >
              新增
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          {list.map((item) => (
            <a
              key={item.id}
              href={`/admin/permission/setting?id=${item.id}`}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
            >
              <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm font-medium text-gray-900">{new Date(item.update_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
