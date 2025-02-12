"use client";

import { useEffect, useState } from "react";
import { TutoringSelect, RoleSelect } from "../select";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { error } from "../../../utils";

export default function Home({ teacher_id, setInfo }) {
  const [settingData, setSettingData] = useState();
  const [teacher_status, setTeacher_status] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 获取选中的文件
    if (file) {
      const reader = new FileReader(); // 创建 FileReader 来读取文件

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxSize = 100; // 最大宽度或高度（单位：像素）
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const compressedImageUrl = canvas.toDataURL("image/jpeg", 1);
          setSettingData((prevState) => ({
            ...prevState,
            user: {
              ...prevState.user,
              photo: compressedImageUrl
            }
          }));
        };
      };

      reader.readAsDataURL(file);
    }
  };

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/${settingData.id}`, config);
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

  async function getTeacher() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/${teacher_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setSettingData(res);
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

  async function getStatus() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/status/list`, config);
    const res = await response.json();

    if (response.ok) {
      setTeacher_status(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "教師狀態列表錯誤：" + msg
      });
    }
  }

  useEffect(() => {
    if (teacher_id != 0) {
      getTeacher();
      // getStatus();
    }
  }, [teacher_id]);

  return (
    <>
      <div className="container mx-auto py-2">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 row-span-4">
                  <label
                    htmlFor="photo"
                    className="block text-md font-medium leading-6 text-gray-900"
                  >
                    大頭照
                  </label>
                  <div className="flex items-center">
                    {settingData?.user.photo ? (
                      <img
                        src={settingData.user.photo}
                        alt="Uploaded"
                        className="w-full"
                      />
                    ) : (
                      <UserCircleIcon
                        aria-hidden="true"
                        className="w-full text-gray-300"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 flex justify-center"
                  >
                    <span>上傳照片</span>
                    <input
                      onChange={handleFileChange} // 綁定文件變更事件
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </div>

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

                <div className="col-span-1 row-span-3">
                  <TutoringSelect
                    settingData={settingData}
                    setSettingData={setSettingData}
                  />
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

                <div className="col-span-1">
                  <label
                    htmlFor="first_name"
                    className="block text-md font-medium leading-6 text-gray-900"
                  >
                    老師身份
                  </label>

                  <select
                    value={settingData?.status?.id}
                    onChange={(e) => {
                      setSettingData({
                        ...settingData,
                        status: {
                          ...settingData.status,
                          id: e.target.value
                        },
                        status_id: e.target.value
                      });
                    }}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                  >
                    <option value={0}>請選擇老師身份</option>
                    <option value={1}>在職</option>
                    <option value={5}>離職</option>
                    {/* {teacher_status.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.status_name}
                      </option>
                    ))} */}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
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
