"use client";

import { useEffect, useRef, useState } from "react";
import { TutoringSelect } from "../select";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Alert from "../../alert";
import { error } from "../../../utils";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [user, setUser] = useState({
    first_name: "",
    nick_name: "",
    email: "",
    address: "",
    tel: "",
    birthday: ""
  });
  const [imageUrl, setImageUrl] = useState("");
  const [teacher_status, setTeacher_status] = useState([]);
  const createData = useRef({ user: {}, tutoring_id_list: [] });

  // 大頭照
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
          const compressedImageUrl = canvas.toDataURL("image/jpeg", 0.8);
          setImageUrl(compressedImageUrl); // 將圖片的 Data URL 設置為狀態
          createData.current.user.photo = compressedImageUrl;
        };
      };

      reader.readAsDataURL(file);
    }
  };

  async function submit() {
    if (!createData.current.user.first_name) {
      setInfo({ show: true, success: false, msg: "請填寫姓名！" });
      return;
    }
    if (!createData.current.user.tel) {
      setInfo({ show: true, success: false, msg: "請填寫電話！" });
      return;
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData.current)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/teacher`;
      setInfo({
        show: true,
        success: true,
        msg: "資料新增成功！"
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
    getStatus();
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4 mb-40">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">新增教師</h1>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  大頭照
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  {imageUrl != "" ? (
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="w-20"
                    />
                  ) : (
                    <UserCircleIcon
                      aria-hidden="true"
                      className="w-20 text-gray-300"
                    />
                  )}
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
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
              </div>

              <div className="col-span-2">
                <TutoringSelect createData={createData} />
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  老師身份
                </label>

                <select
                  onChange={(e) => {
                    createData.current.status_id = e.target.value;
                  }}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                >
                  <option>請選擇老師身份</option>
                  {teacher_status.map((item) => (
                    <option value={item.id}>{item.status_name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-400">*</span>中文姓名
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      value={user.first_name}
                      onChange={(event) => {
                        createData.current.user.first_name = event.target.value;
                        setUser({
                          ...user,
                          first_name: event.target.value
                        });
                      }}
                      id="first_name"
                      name="first_name"
                      type="text"
                      className="p-2 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="tel"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-400">*</span>聯絡電話
                </label>
                <div className="mt-2">
                  <input
                    value={user.tel}
                    onChange={(event) => {
                      // createData.current.user.username = event.target.value;
                      // createData.current.user.password = "00000000";
                      createData.current.user.tel = event.target.value;
                      setUser({
                        ...user,
                        tel: event.target.value
                      });
                    }}
                    id="tel"
                    name="tel"
                    type="tel"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="nick_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  英文姓名
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      value={user.nick_name}
                      onChange={(event) => {
                        createData.current.user.nick_name = event.target.value;
                        setUser({
                          ...user,
                          nick_name: event.target.value
                        });
                      }}
                      id="nick_name"
                      name="nick_name"
                      type="text"
                      className="p-2 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    value={user.email}
                    onChange={(event) => {
                      createData.current.user.email = event.target.value;
                      setUser({
                        ...user,
                        email: event.target.value
                      });
                    }}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  生日
                </label>
                <div className="mt-2">
                  <input
                    value={user.birthday}
                    onChange={(event) => {
                      createData.current.user.birthday = event.target.value;
                      setUser({
                        ...user,
                        birthday: event.target.value
                      });
                    }}
                    id="birthday"
                    name="birthday"
                    type="date"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  地址
                </label>
                <div className="mt-2">
                  <input
                    value={user.address}
                    onChange={(event) => {
                      createData.current.user.address = event.target.value;
                      setUser({
                        ...user,
                        address: event.target.value
                      });
                    }}
                    id="address"
                    name="address"
                    type="text"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              onClick={submit}
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
