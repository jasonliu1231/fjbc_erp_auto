"use client";

import { useEffect, useState, useRef } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Alert from "../alert";
import { error } from "../../utils";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [create, setCreate] = useState({
    first_name: "",
    tel: ""
  });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(false);
  const [state, setState] = useState(1);
  const [userData, setUserData] = useState(null);

  const [userList, setUserList] = useState([]);

  async function searchUser() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/check_exist`, config);
    const res = await response.json();
    if (response.ok) {
      setUserList(res);
      setLoading(false);
      setQuery(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function searchRoleId(user_id, role_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/useridentification/${user_id}/${role_id}`, config);
    const res = await response.json();
    if (response.ok) {
      if (res == -1) {
        setInfo({
          show: true,
          success: false,
          msg: "身份不可查詢"
        });
      } else {
        getUserData(res, role_id);
      }
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getUserData(id, role_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api = "";
    if (role_id == 5) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/${id}`;
    } else if (role_id == 6) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/parent/${id}`;
    } else if (role_id == 4) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/${id}`;
    }

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setUserData(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function createUser(data, type) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: data })
    };
    let api = "";
    if (type == 1) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/`;
    } else if (type == 2) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/parent/`;
    } else if (type == 3) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/`;
    }

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      if (type == 1) {
        window.location.href = "/admin/student/setting?id=" + res.id;
      } else if (type == 2) {
        window.location.href = "/admin/parent/setting?id=" + res.id;
      } else if (type == 3) {
        window.location.href = "/admin/teacher/setting?id=" + res.id;
      }
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

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
      <div className="container mx-auto p-2">
        <div className="my-2">
          <h2 className="text-xl font-bold text-gray-900">建立使用者</h2>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl h-80vh min-h-70vh">
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="col-span-1">
              <div className="text-lg text-blue-400">搜尋</div>
              <div>
                <label className="hidden block text-sm/6 font-medium text-gray-900">全名</label>
                <div className="flex">
                  <input
                    value={create.first_name}
                    onChange={(e) => {
                      setQuery(false);
                      setCreate({ ...create, first_name: e.target.value });
                    }}
                    type="text"
                    placeholder="請輸入中文名稱"
                    className="block w-full rounded-l-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400"
                  />
                  <button
                    onClick={searchUser}
                    type="button"
                    className="whitespace-nowrap rounded-r-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                  >
                    查詢
                  </button>
                </div>
              </div>
              {query && (
                <>
                  {" "}
                  <div className="text-lg text-blue-400">建立使用者</div>
                  <span className="isolate inline-flex rounded-md shadow-sm mb-1">
                    <button
                      onClick={() => {
                        setState(1);
                      }}
                      type="button"
                      className={`${
                        state == 1 ? "bg-blue-100" : "be-white"
                      } relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
                    >
                      學生
                    </button>
                    <button
                      onClick={() => {
                        setState(2);
                      }}
                      type="button"
                      className={`${state == 2 ? "bg-blue-100" : "be-white"} relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
                    >
                      家長
                    </button>
                    <button
                      onClick={() => {
                        setState(3);
                      }}
                      type="button"
                      className={`${
                        state == 3 ? "bg-blue-100" : "be-white"
                      } relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
                    >
                      老師
                    </button>
                  </span>
                  <div>
                    <label className="hidden block text-sm/6 font-medium text-gray-900">全名</label>
                    <div className="flex">
                      <input
                        value={create.first_name}
                        onChange={(e) => {
                          setCreate({ ...create, first_name: e.target.value });
                        }}
                        type="text"
                        placeholder="請輸入中文名稱"
                        className="block w-full rounded-l-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400"
                      />
                      <input
                        value={create.tel}
                        onChange={(e) => {
                          setCreate({ ...create, tel: e.target.value });
                        }}
                        type="text"
                        placeholder="請輸入電話"
                        className="block w-full bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400"
                      />
                      <button
                        onClick={() => {
                          createUser(create, state);
                        }}
                        type="button"
                        className="whitespace-nowrap rounded-r-md bg-pink-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500"
                      >
                        建立
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4">
                <div className="text-lg text-blue-400 border-b-2">搜尋結果</div>
                {userList.length > 0 ? (
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 border my-1 rounded-md"
                  >
                    {userList.map((item) => (
                      <li
                        key={item.id}
                        className="p-2"
                      >
                        <div className="grid grid-cols-3">
                          <div className="col-span-1">
                            <div className="text-lg">{item.first_name}</div>
                            <div className="text-xs text-gray-400">{item.last_name}</div>
                            <div className="text-sm text-gray-600">{item.tel}</div>
                          </div>
                          <div className="col-span-1">
                            {item.role_list.map((role) => (
                              <div
                                key={role.id}
                                className="text-md text-blue-600"
                              >
                                <span
                                  onClick={() => {
                                    searchRoleId(item.id, role.id);
                                  }}
                                  className="cursor-pointer hover:text-blue-300"
                                >
                                  {role.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="col-span-1">
                            {item.role_list.some((role) => role.id == 4) || (
                              <div
                                onClick={() => {
                                  createUser(
                                    {
                                      user_id: item.id,
                                      first_name: item.first_name,
                                      tel: item.tel
                                    },
                                    3
                                  );
                                }}
                                className="text-sm cursor-pointer text-green-600 hover:text-green-400"
                              >
                                + 新增老師身份
                              </div>
                            )}
                            {item.role_list.some((role) => role.id == 5) || (
                              <div
                                onClick={() => {
                                  createUser(
                                    {
                                      user_id: item.id,
                                      first_name: item.first_name,
                                      tel: item.tel
                                    },
                                    1
                                  );
                                }}
                                className="text-sm cursor-pointer text-green-600 hover:text-green-400"
                              >
                                + 新增學生身份
                              </div>
                            )}
                            {item.role_list.some((role) => role.id == 6) || (
                              <div
                                onClick={() => {
                                  createUser(
                                    {
                                      user_id: item.id,
                                      first_name: item.first_name,
                                      tel: item.tel
                                    },
                                    2
                                  );
                                }}
                                className="text-sm cursor-pointer text-green-600 hover:text-green-400"
                              >
                                + 新增家長身份
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : query ? (
                  <div className="text-pink-500">無此使用者</div>
                ) : null}
              </div>
            </div>
            {userData && (
              <div className="col-span-2 border rounded-xl p-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 row-span-10">
                    {userData.user.photo ? (
                      <img
                        src={userData.user.photo}
                        className="w-full"
                      />
                    ) : (
                      <UserCircleIcon
                        aria-hidden="true"
                        className="w-full text-gray-300"
                      />
                    )}
                  </div>
                  <div className="col-span-2 border text-center flex overflow-hidden">
                    <div className="w-1/2 bg-blue-100">中文名稱</div>
                    <div className="w-1/2">{userData.user.first_name}</div>
                  </div>
                  <div className="col-span-2 border text-center flex overflow-hidden">
                    <div className="w-1/2 bg-blue-100">英文名稱</div>
                    <div className="w-1/2">{userData.user.nick_name}</div>
                  </div>
                  <div className="col-span-2 border text-center flex overflow-hidden">
                    <div className="w-1/2 bg-blue-100">電話</div>
                    <div className="w-1/2">{userData.user.tel}</div>
                  </div>
                  <div className="col-span-2 border text-center flex overflow-hidden">
                    <div className="w-1/2 bg-blue-100">信箱</div>
                    <div className="w-1/2">{userData.user.email}</div>
                  </div>
                  <div className="col-span-2 border text-center flex overflow-hidden">
                    <div className="w-1/2 bg-blue-100">地址</div>
                    <div className="w-1/2">{userData.user.address}</div>
                  </div>
                  {userData.status ? (
                    <div className="col-span-2 border text-center flex overflow-hidden">
                      <div className="w-1/2 bg-blue-100">身份</div>
                      <div className="w-1/2">{userData.status.status_name}</div>
                    </div>
                  ) : null}

                  {userData.school ? (
                    <div className="col-span-2 border text-center flex overflow-hidden">
                      <div className="w-1/2 bg-blue-100">學校</div>
                      <div className="w-1/2">{userData.school?.school_name}</div>
                    </div>
                  ) : null}
                  {userData.grade ? (
                    <div className="col-span-2 border text-center flex overflow-hidden">
                      <div className="w-1/2 bg-blue-100">年級</div>
                      <div className="w-1/2">{userData.grade?.grade_name}</div>
                    </div>
                  ) : null}
                  {userData.parent_list ? (
                    <>
                      <div className="col-span-2 border text-center bg-blue-100">家長訊息</div>
                      {userData.parent_list.map((person) => (
                        <div className="col-span-1 border px-2 py-1">
                          <div className="text-gray-600">{person.user.first_name}</div>
                          <div className="text-gray-400 text-xs">{person.user.tel}</div>
                        </div>
                      ))}
                    </>
                  ) : null}
                  {userData.student_list ? (
                    <>
                      <div className="col-span-2 border text-center bg-blue-100">學生訊息</div>
                      {userData.student_list.map((person) => (
                        <div className="col-span-1 border px-2 py-1">
                          <div className="text-gray-600">
                            {person.user.first_name}({person.user.nick_name})
                          </div>
                          <div className="flex justify-between">
                            <div className="text-gray-400 text-xs">{person.school?.school_name}</div>
                            <div className="text-gray-400 text-xs">{person.grade?.grade_name}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
