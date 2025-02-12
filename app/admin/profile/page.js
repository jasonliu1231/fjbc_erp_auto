"use client";

import { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Alert from "../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [user, setUser] = useState({});
  const [password, setPassword] = useState({
    entity: "",
    check: ""
  });

  function clear() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("client_id");
    localStorage.removeItem("name");
    localStorage.removeItem("user_id");
    window.location.href = "/";
  }

  async function logout() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8100}/fjbc_login_api/auth/logout`, config);
    if (response.ok) {
      clear();
    } else {
      alert("登出失敗！");
    }
  }

  async function getMine() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/mine`, config);
    const res = await response.json();
    if (response.ok) {
      setUser(res);
      setLoading(false);
      setUpdate(false);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function changPassword() {
    if (password.entity == "") {
      setInfo({
        show: true,
        success: false,
        msg: "密碼不可以為空"
      });
      return;
    }
    if (password.entity != password.check) {
      setInfo({
        show: true,
        success: false,
        msg: "密碼不相同"
      });
      return;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: password.entity
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8100}/fjbc_login_api/auth/changpassword`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "修改完成請重新登入！"
      });
      clear();
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function updateUser() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/mine`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "修改完成"
      });
      getMine();
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  useEffect(() => {
    getMine();
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
        <div className="px-4 py-2 bg-white mt-12 rounded-lg">
          {update ? (
            <>
              <div className="grid grid-cols-4 gap-4 p-4">
                <div className="col-span-2">
                  <label className="block font-medium text-gray-900">中文名</label>
                  <div className="mt-2">
                    <input
                      value={user.first_name}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          first_name: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-900">英文名</label>
                  <div className="mt-2">
                    <input
                      value={user.nick_name}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          nick_name: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-900">電話</label>
                  <div className="mt-2">
                    <input
                      value={user.tel}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          tel: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-900">生日</label>
                  <div className="mt-2">
                    <input
                      value={user.birthday}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          birthday: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block font-medium text-gray-900">信箱</label>
                  <div className="mt-2">
                    <input
                      value={user.email}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          email: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block font-medium text-gray-900">地址</label>
                  <div className="mt-2">
                    <input
                      value={user.address}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          address: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-gray-900">帳號</label>
                  <div className="mt-2">
                    <input
                      value={user.username}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          username: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div className="col-span-1">
                      <label className="block font-medium text-gray-900">修改密碼</label>
                      <div className="mt-2">
                        <input
                          value={password.entity}
                          onChange={(e) => {
                            setPassword({
                              ...password,
                              entity: e.target.value
                            });
                          }}
                          type="password"
                          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label className="block font-medium text-gray-900">確認密碼</label>
                      <div className="mt-2">
                        <input
                          value={password.check}
                          onChange={(e) => {
                            setPassword({
                              ...password,
                              check: e.target.value
                            });
                          }}
                          type="password"
                          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={changPassword}
                        type="button"
                        className="mx-2 rounded-md text-md font-semibold text-gray-600 bg-pink-200 px-2 py-1 hover:bg-pink-600 hover:text-gray-200"
                      >
                        修改密碼
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center py-4">
                <button
                  onClick={() => {
                    setUpdate(!update);
                  }}
                  type="button"
                  className="mx-1 rounded-md text-md font-semibold text-blue-400 px-2 py-1 ring-2 hover:bg-blue-100"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    updateUser();
                  }}
                  type="button"
                  className="mx-1 rounded-md text-md font-semibold text-green-600 bg-green-200 ring-2 ring-green-400 px-2 py-1 hover:bg-green-100"
                >
                  送出修改
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-y-4 gap-x-2 p-4">
                <div className="col-span-1 row-span-6">
                  <img
                    src={user.photo}
                    className="w-full"
                  />
                </div>
                <div className="col-span-1">
                  <span className="text-md text-gray-600">中文姓名：</span>
                  <span className="text-xl text-blue-600">{user.first_name}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-md text-gray-600">英文姓名：</span>
                  <span className="text-xl text-blue-600">{user.nick_name}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-md text-gray-600">電話：</span>
                  <span className="text-xl text-blue-600">{user.tel}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-md text-gray-600">生日：</span>
                  <span className="text-xl text-blue-600">{user.birthday}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-md text-gray-600">電子信箱：</span>
                  <span className="text-xl text-blue-600">{user.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-md text-gray-600">地址：</span>
                  <span className="text-xl text-blue-600">{user.address}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-md text-gray-600">登入帳號：</span>
                  <span className="text-xl text-blue-600">{user.username}</span>
                </div>
              </div>
              <div className="flex justify-center py-4">
                <button
                  onClick={() => {
                    setUpdate(!update);
                  }}
                  type="button"
                  className="mx-1 rounded-md text-md font-semibold text-gray-600 bg-blue-200 px-2 py-1 hover:bg-blue-400"
                >
                  {update ? "瀏覽" : "修改"}
                </button>
                <button
                  onClick={logout}
                  type="button"
                  className="mx-1 rounded-md text-md font-semibold text-gray-600 bg-pink-200 px-2 py-1 hover:bg-pink-400"
                >
                  登出
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
