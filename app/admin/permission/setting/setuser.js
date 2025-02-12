"use client";

import { useEffect, useRef, useState } from "react";
import { error } from "../../../utils";

export default function Home({ setAlert }) {
  const perm_id = useRef();
  const [userList, setUserList] = useState([]);
  const [permUserList, setPermUserList] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  let filterItem = userList.filter((i) => !permUserList.some((j) => j.id === i.id));

  async function submit() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        perm_id: perm_id.current,
        items: permUserList
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/permission/link`, config);
    const res = await response.json();
    if (response.ok) {
      setAlert({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getPermUser();
    } else {
      const msg = error(response.status, res);
      setAlert({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getTeacher() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list?show_exit=false`, config);
    const res = await response.json();
    if (response.ok) {
      setUserList(
        res.list.map((person) => {
          return {
            id: person.user.id,
            first_name: person.user.first_name,
            nick_name: person.user.nick_name
          };
        })
      );
    } else {
      const msg = error(response.status, res);
      setAlert({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPermUser() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/permission/link/list?perm_id=${perm_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo(res.perm_data);
      setPermUserList(res.perm_detail);
      setLoading(false);
    } else {
      const msg = error(response.status, res);
      setAlert({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    perm_id.current = Number(id);

    getPermUser();
    getTeacher();
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
      <div className="text-xl my-4 flex justify-between">
        <span>權限名稱：{info.name}</span>
        <span>建立時間：{new Date(info.createdon).toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {permUserList ? (
          permUserList.map((item) => (
            <div
              onClick={() => {
                const list = permUserList.filter((i) => i.id != item.id);
                setPermUserList(list);
              }}
              key={item.id}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
            >
              <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{item.first_name}</div>
                    <div className="text-sm font-medium text-gray-500">{item.nick_name}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="spinner"></div>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={submit}
          type="button"
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          儲存
        </button>
      </div>
      <div className="text-xl border-b-2 border-indigo-500 px-3 mb-2">教師</div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {filterItem ? (
          filterItem.map((item) => (
            <div
              onClick={() => {
                const list = [...permUserList, item];
                setPermUserList(list);
              }}
              key={item.id}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
            >
              <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{item.first_name}</div>
                    <div className="text-sm font-medium text-gray-500">{item.nick_name}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="spinner"></div>
        )}
      </div>
    </>
  );
}
