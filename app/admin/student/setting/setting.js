"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { error } from "../../../utils";

const def_p = {
  id: 0,
  first_name: "",
  tel: ""
};

export default function Home({ student_id, setInfo }) {
  const [settingData, setSettingData] = useState({});
  const [parentData, setParentData] = useState([]);
  const [tutoring_id_list, setTutoring_id_list] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);

  // 搜尋物件
  const [sign, setSign] = useState("");
  const [school, setSchool] = useState([]);

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
          setSettingData({
            ...settingData,
            photo: compressedImageUrl
          });
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
      body: JSON.stringify({
        health_description: settingData.health_description,
        user: {
          first_name: settingData.first_name,
          nick_name: settingData.nick_name,
          email: settingData.email,
          address: settingData.address,
          tel: settingData.tel,
          birthday: settingData.birthday,
          photo: settingData.photo
        },
        school_id: settingData.school != 0 ? settingData.school : null,
        grade_id: settingData.grade != 0 ? settingData.grade : null,
        parent_list: parentData,
        tutoring_id_list: tutoring_id_list,
        status_id: settingData.status
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/${settingData.id}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getStudent(student_id);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getStudent(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setSettingData({
        id: res.id,
        first_name: res.user.first_name,
        nick_name: res.user.nick_name,
        email: res.user.email,
        tel: res.user.tel,
        birthday: res.user.birthday,
        photo: res.user.photo,
        school: res.school ? res.school.id : 0,
        grade: res.grade ? res.grade.id : 0,
        status: res.status ? res.status.id : 0
      });

      getSchoolName(res.school?.id);
      setParentData(res.parent_list);

      setTutoring_id_list(res.tutoring_list?.map((i) => i.id));
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

  async function getSign(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/sign/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setSign(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getSchool() {
    if (keyword.trim() == "") {
      setInfo({
        show: true,
        success: false,
        msg: "關鍵字請勿空白"
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
      body: JSON.stringify({ keyword })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/school`, config);
    const res = await response.json();
    if (response.ok) {
      setSchool(res);
      setOpen(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getSchoolName(id) {
    if (!id) {
      return;
    }
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/school?id=${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setKeyword(res.school_name);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function searchUser() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: search
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/check_exist`, config);
    const res = await response.json();
    if (response.ok) {
      setUserList(res.filter((person) => person.role_list.some((role) => role.id == 6)));
    } else {
      const msg = error(response.status, res);
      setCreate({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function searchRoleId(user, role_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/useridentification/${user.id}/${role_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setParentData([
        ...parentData,
        {
          id: res,
          user: {
            first_name: user.first_name,
            tel: user.tel
          }
        }
      ]);
      setParentOpen(false);
    } else {
      const msg = error(response.status, res);
      setCreate({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  useEffect(() => {
    if (student_id != 0) {
      getStudent(student_id);
      getSign(student_id);
    }
  }, [student_id]);

  return (
    <>
      {/* 學校 */}
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="text-center text-xl">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-blue-600"
                  >
                    學校
                  </DialogTitle>
                </div>
              </div>
              <div>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="divide-x divide-gray-200 bg-green-100">
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        名稱
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        縣市
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        地區
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {school.map((item) => {
                      return (
                        <tr
                          key={item.id}
                          className={`bg-white divide-x divide-gray-200 hover:bg-blue-100 cursor-pointer`}
                          onClick={() => {
                            setSettingData({
                              ...settingData,
                              school: item.id
                            });
                            setKeyword(item.school_name);
                            setOpen(false);
                          }}
                        >
                          <td className="p-2 text-sm font-medium text-gray-900">{item.city_name}</td>
                          <td className="p-2 text-sm font-medium text-gray-900">{item.dist_name}</td>
                          <td className="p-2 text-sm font-medium text-gray-900">{item.school_name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 家長 */}
      <Dialog
        open={parentOpen}
        onClose={setParentOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="text-center text-xl">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-blue-600"
                  >
                    家長
                  </DialogTitle>
                </div>
              </div>
              <div>
                <div className="text-blue-400">搜尋</div>
                <div>
                  <label className="hidden block text-sm/6 font-medium text-gray-900">全名</label>
                  <div className="flex">
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
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
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              searchRoleId(item, 6);
                            }}
                          >
                            <div className="grid grid-cols-2">
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
                                    {role.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white ring-1 ring-gray-900/5 rounded-xl">
            <div className="px-2 py-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 row-span-6">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    大頭照
                  </label>
                  <div className="mt-2 flex items-center">
                    {settingData.photo ? (
                      <img
                        src={settingData.photo}
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
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600"
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
                  <div className="mt-2">
                    <label className="block text-sm font-medium leading-6 text-red-600">
                      {sign.create_at && <span className="mr-4">{new Date(sign.create_at).toLocaleDateString()}</span>}
                      認證簽名:
                    </label>
                    <div>
                      <img
                        src={sign.sign}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 text-red-400">中文姓名</label>
                  <div className="mt-2">
                    <div className="flex rounded-md ring-1 ring-inset ring-gray-300">
                      <input
                        value={settingData.first_name}
                        onChange={(e) => {
                          setSettingData({
                            ...settingData,
                            first_name: e.target.value
                          });
                        }}
                        type="text"
                        className="p-2 block flex-1 border-0 bg-transparent  pl-1 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">英文姓名</label>
                  <div className="mt-2">
                    <div className="flex rounded-md ring-1 ring-inset ring-gray-300">
                      <input
                        value={settingData.nick_name}
                        onChange={(e) => {
                          setSettingData({
                            ...settingData,
                            nick_name: e.target.value
                          });
                        }}
                        type="text"
                        className="p-2 block flex-1 border-0 bg-transparent  pl-1 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="border-b-2 text-lg text-blue-400">所屬補習班</div>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        checked={tutoring_id_list.some((i) => i == 1)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTutoring_id_list([...tutoring_id_list, 1]);
                          } else {
                            setTutoring_id_list(tutoring_id_list.filter((i) => i != 1));
                          }
                        }}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label className="font-medium text-gray-900">多易</label>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        checked={tutoring_id_list.some((i) => i == 2)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTutoring_id_list([...tutoring_id_list, 2]);
                          } else {
                            setTutoring_id_list(tutoring_id_list.filter((i) => i != 2));
                          }
                        }}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label className="font-medium text-gray-900">艾思</label>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        checked={tutoring_id_list.some((i) => i == 3)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTutoring_id_list([...tutoring_id_list, 3]);
                          } else {
                            setTutoring_id_list(tutoring_id_list.filter((i) => i != 3));
                          }
                        }}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label className="font-medium text-gray-900">華而敦</label>
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                  <div className="mt-2">
                    <input
                      value={settingData.email}
                      onChange={(e) => {
                        setSettingData({
                          ...settingData,
                          email: e.target.value
                        });
                      }}
                      type="email"
                      className="p-2 block w-full rounded-md border-0  text-gray-900 ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">聯絡電話</label>
                  <div className="mt-2">
                    <input
                      value={settingData.tel}
                      onChange={(e) => {
                        setSettingData({
                          ...settingData,
                          tel: e.target.value
                        });
                      }}
                      type="tel"
                      className="p-2 block w-full rounded-md border-0  text-gray-900 ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>

                {/* 備註 */}
                <div className="col-span-1 row-span-2">
                  <label className="text-gray-700 text-md flex">
                    備註<div className="hidden lg:block text-gray-500"></div>
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={10}
                      className="p-4 block w-full rounded-md border-0  text-gray-900 ring-1 ring-inset ring-gray-300"
                      value={settingData.health_description || ""}
                      onChange={(e) => {
                        setSettingData({
                          ...settingData,
                          health_description: e.target.value
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">生日</label>
                  <div className="mt-2">
                    <input
                      value={settingData.birthday}
                      onChange={(e) => {
                        setSettingData({
                          ...settingData,
                          birthday: e.target.value
                        });
                      }}
                      type="date"
                      className="p-2 block w-full rounded-md border-0  text-gray-900 ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <fieldset className="bg-white">
                    <legend className="block text-sm font-medium leading-6 text-gray-900">學校</legend>
                    <div className="mt-2 -space-y-px rounded-md shadow-sm">
                      <div className="w-full">
                        <select
                          value={settingData.grade}
                          onChange={(e) => {
                            setSettingData({
                              ...settingData,
                              grade: e.target.value
                            });
                          }}
                          className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300"
                        >
                          {settingData.grade == 0 && <option value="0">年級</option>}
                          <option value="1">幼幼班</option>
                          <option value="2">小班</option>
                          <option value="3">中班</option>
                          <option value="4">大班</option>
                          <option value="5">小一</option>
                          <option value="6">小二</option>
                          <option value="7">小三</option>
                          <option value="8">小四</option>
                          <option value="9">小五</option>
                          <option value="10">小六</option>
                          <option value="11">國一</option>
                          <option value="12">國二</option>
                          <option value="13">國三</option>
                          <option value="14">高一</option>
                          <option value="15">高二</option>
                          <option value="16">高三</option>
                        </select>
                      </div>
                      <div className="pt-1 flex">
                        <input
                          value={keyword}
                          onChange={(e) => {
                            setKeyword(e.target.value);
                          }}
                          className={`${settingData.school == 0 ? "text-gray-600" : "text-blue-600"} p-2 text-sm w-5/6 rounded-md border-0 ring-1 ring-inset ring-gray-300`}
                          placeholder="請輸入關鍵字"
                        />
                        <button
                          onClick={() => {
                            getSchool();
                          }}
                          className="ml-1 p-2 text-sm w-1/6 rounded-md border-0 text-blue-900 ring-1 ring-inset ring-blue-300 hover:bg-blue-200"
                        >
                          搜尋
                        </button>
                        {/* <select
                          value={settingData?.school?.id}
                          onChange={(e) => {
                            setSettingData({
                              ...settingData,
                              school_id: e.target.value
                            });
                          }}
                        >
                          <option>請選擇學校</option>
                          {filteredSchool &&
                            filteredSchool.map((i) => (
                              <option
                                key={i.id}
                                value={i.id}
                              >
                                {i.school_name}
                              </option>
                            ))}
                        </select> */}
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">地址</label>
                  <div className="mt-2">
                    <input
                      value={settingData.address}
                      onChange={(e) => {
                        setSettingData({
                          ...settingData,
                          address: e.target.value
                        });
                      }}
                      type="text"
                      className="p-2 block w-full rounded-md border-0  text-gray-900 ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-red-500">學生身份</label>
                  <select
                    value={settingData.status}
                    onChange={(e) => {
                      setSettingData({
                        ...settingData,
                        status: e.target.value
                      });
                    }}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 mt-2"
                  >
                    {settingData.status == 0 && <option value={0}>請選擇</option>}
                    <option value={1}>一般生</option>
                    <option value={3}>離校生</option>
                  </select>
                </div>

                <div
                  onClick={() => {
                    setParentOpen(true);
                  }}
                  className="col-span-1 text-green-600 border border-green-500 flex justify-center items-center rounded-md hover:bg-green-200 cursor-pointer"
                >
                  新增家長
                </div>

                {parentData.map((parent, index) => (
                  <div
                    key={index}
                    className="col-span-1 border-2 p-2 rounded-md"
                  >
                    <div className="flex justify-between">
                      <div className={`block text-sm font-medium`}>家長資訊</div>
                      <div
                        onClick={() => {
                          setParentData(parentData.filter((person) => person.user.id != parent.user.id));
                        }}
                        className="text-sm text-red-600 cursor-pointer hover:text-red-300"
                      >
                        刪除
                      </div>
                    </div>

                    <div className="text-sm text-blue-600">{parent.user.first_name}</div>
                    <div className="text-sm text-gray-600">{parent.user.tel}</div>
                  </div>
                ))}

                {/* 
                <HistorySelect
                  settingData={settingData}
                  setSettingData={setSettingData}
                /> */}
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={submit}
                type="submit"
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
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
