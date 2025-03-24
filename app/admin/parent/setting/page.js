"use client";

import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Alert from "../../alert";
import { error } from "../../../utils";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [settingData, setSettingData] = useState();
  const [loading, setLoading] = useState(true);
  const [tagList, setTagList] = useState([]);
  const [currentTagList, setCurrentTagList] = useState([]);
  const [tagUser, setTagUser] = useState({});
  const [query, setQuery] = useState("");

  let filteredTagList = tagList.filter((item) => !currentTagList.some((ii) => ii.tag_id === item.id));

  filteredTagList =
    query === ""
      ? filteredTagList
      : filteredTagList.filter((item) => {
          const content = item.content.toLowerCase() || "";
          return content.includes(query.toLowerCase());
        });

  async function getTagList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag/list`, config);
    const res = await response.json();
    if (response.ok) {
      setTagList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  async function getCurrentTagList(user_id, role_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag/link?user_id=${user_id}&role_id=${role_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setCurrentTagList(res);
      getTagList();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function addTag(tag_id) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...tagUser,
        tag_id: tag_id
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag/link`, config);
    const res = await response.json();
    if (response.ok) {
      getCurrentTagList(tagUser.user_id, tagUser.role_id);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function removeTag(tag_id) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...tagUser,
        tag_id: tag_id
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag/link`, config);
    const res = await response.json();
    if (response.ok) {
      getCurrentTagList(tagUser.user_id, tagUser.role_id);
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
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settingData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/parent/${settingData.id}`, config);
    const res = await response.json();
    if (response.ok) {
      setSettingData(res);
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getParent(parent_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/parent/${parent_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setSettingData(res);
      setTagUser({
        ...tagUser,
        user_id: res.user.id,
        role_id: res.id
      });
      getCurrentTagList(res.user.id, res.id);
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
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = Number(params.get("id"));
    getParent(id);
  }, []);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto py-2">
        <div className="my-2">
          <h2 className="text-xl font-bold text-gray-900">家長資訊</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label
                      htmlFor="first_name"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      中文姓名
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
                        <input
                          value={settingData?.user.first_name || ""}
                          onChange={(event) => {
                            setSettingData((prevState) => ({
                              ...prevState,
                              user: {
                                ...prevState.user, // 展開現有的 user 物件
                                first_name: event.target.value // 設定新的 first_name
                              }
                            }));
                          }}
                          id="first_name"
                          name="first_name"
                          type="text"
                          className="p-2 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="nick_name"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      英文姓名
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
                        <input
                          value={settingData?.user.nick_name || ""}
                          onChange={(event) => {
                            setSettingData((prevState) => ({
                              ...prevState,
                              user: {
                                ...prevState.user, // 展開現有的 user 物件
                                nick_name: event.target.value // 設定新的 first_name
                              }
                            }));
                          }}
                          id="nick_name"
                          name="nick_name"
                          type="text"
                          className="p-2 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="tel"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      聯絡電話
                    </label>
                    <div className="mt-2">
                      <input
                        value={settingData?.user.tel || ""}
                        onChange={(event) => {
                          setSettingData((prevState) => ({
                            ...prevState,
                            user: {
                              ...prevState.user, // 展開現有的 user 物件
                              tel: event.target.value // 設定新的 first_name
                            }
                          }));
                        }}
                        id="tel"
                        name="tel"
                        type="tel"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="birthday"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      生日
                    </label>
                    <div className="mt-2">
                      <input
                        value={settingData?.user.birthday || ""}
                        onChange={(event) => {
                          setSettingData((prevState) => ({
                            ...prevState,
                            user: {
                              ...prevState.user, // 展開現有的 user 物件
                              birthday: event.target.value // 設定新的 first_name
                            }
                          }));
                        }}
                        id="birthday"
                        name="birthday"
                        type="date"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        value={settingData?.user.email || ""}
                        onChange={(event) => {
                          setSettingData((prevState) => ({
                            ...prevState,
                            user: {
                              ...prevState.user, // 展開現有的 user 物件
                              email: event.target.value // 設定新的 first_name
                            }
                          }));
                        }}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      地址
                    </label>
                    <div className="mt-2">
                      <input
                        value={settingData?.user.address || ""}
                        onChange={(event) => {
                          setSettingData((prevState) => ({
                            ...prevState,
                            user: {
                              ...prevState.user, // 展開現有的 user 物件
                              address: event.target.value // 設定新的 first_name
                            }
                          }));
                        }}
                        id="address"
                        name="address"
                        type="text"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div>
                  <div>標籤</div>
                  {currentTagList.map((item) => (
                    <span
                      key={item.tag_id}
                      onClick={() => {
                        removeTag(item.tag_id);
                      }}
                      style={{
                        color: item.color,
                        borderColor: item.color
                      }}
                      className="whitespace-nowrap text-xs border-2 rounded-full px-2 py-1 m-1 cursor-pointer leading-8"
                    >
                      {item.content}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>標籤池</div>
                    <div>
                      <input
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                        }}
                        className="ring-1 ring-gray-400 rounded-md p-1"
                        placeholder="關鍵字搜尋"
                      />
                    </div>
                  </div>
                  {filteredTagList.map((item) => (
                    <span
                      key={item.id}
                      onClick={() => {
                        addTag(item.id);
                      }}
                      style={{
                        color: item.color,
                        borderColor: item.color
                      }}
                      className="whitespace-nowrap text-xs border-2 rounded-full px-2 py-1 m-1 cursor-pointer leading-8"
                    >
                      {item.content}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div>學生資訊</div>
                {settingData.student_list.map((person) => (
                  <div className="border px-4 py-2 m-1 rounded-md">
                    <div className="grid grid-cols-2">
                      <div className="col-span-1 text-blue-500">
                        {person.user.first_name}({person.user.nick_name})
                      </div>
                      <div className="col-span-1 row-span-3 text-gray-500">
                        {person.tutoring_list.map((tutoring) => (
                          <div>{tutoring.tutoring_name}</div>
                        ))}
                      </div>
                      <div className="col-span-1 text-sm text-gray-500">{person.grade?.grade_name}</div>
                      <div className="col-span-1 text-gray-700">{person.school?.school_name}</div>
                    </div>

                    <div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-gray-900/10 mt-2 p-4">
              <button
                onClick={submit}
                type="submit"
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                儲存
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
