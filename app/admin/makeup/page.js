"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import Alert from "../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState(false);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState([]);
  const [selected, setSelected] = useState("");

  let filteredList =
    selected === ""
      ? list
      : list.filter((item) => {
          const name = item.student_c_name.toLowerCase() || "";
          const course_name = item.course_name.toLowerCase() || "";
          return name?.includes(selected.toLowerCase()) || course_name.includes(selected.toLowerCase());
        });

  filteredList = finish ? filteredList.filter((i) => i.makeup_date && new Date(i.makeup_date) < new Date()) : filteredList.filter((i) => !i.makeup_date || new Date(i.makeup_date) >= new Date());

  async function getList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_student_exam/list?is_makeup=true`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
      setLoading(false);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function updateItem() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_student_exam/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "修改完成"
      });
      setOpen(false);
      getList();
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
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
      <Dialog
        open={open}
        onClose={() => {}}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xs sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold flex justify-around text-red-400"
                  >
                    原時段：{update.origin_makeup_date ? new Date(update.origin_makeup_date).toLocaleString() : "未預約"}
                  </DialogTitle>
                </div>
                <div className="mt-2">
                  <input
                    onChange={(e) => {
                      setUpdate({
                        ...update,
                        makeup_date: e.target.value
                      });
                    }}
                    className="px-2 py-1 w-full ring ring-red-400 rounded-md"
                    type="datetime-local"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mx-1 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 rounded-md"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={updateItem}
                  className="mx-1 px-3 py-2 text-sm font-semibold text-green-900 shadow-sm ring-1 ring-inset ring-green-400 rounded-md"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        <div className="px-4">
          <div className="mt-2 flex items-end justify-between">
            <h1 className="text-xl font-semibold text-gray-900">補課列表</h1>

            <input
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
              }}
              className="px-2 py-1"
              placeholder="名字、課程"
            />

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFinish(true);
                }}
                className={`${finish ? "bg-blue-400 text-white" : "bg-gray-50 text-gray-400"} ring-2 ring-gray-300 mx-1 px-2 py-1 rounded-md`}
              >
                已輔導
              </button>
              <button
                onClick={() => {
                  setFinish(false);
                }}
                className={`${!finish ? "bg-blue-400 text-white" : "bg-gray-50 text-gray-400"} ring-2 ring-gray-300 mx-1 px-2 py-1 rounded-md`}
              >
                未輔導
              </button>
            </div>
          </div>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0">
                    <tr className="divide-x divide-gray-200 bg-pink-50 sticky top-0">
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        日期
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        課程
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        學生
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        考試名稱
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        考試範圍
                      </th>

                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        成績
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        輔導時間
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        設定
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredList.length > 0 &&
                      filteredList.map((item) => {
                        return (
                          <tr
                            key={item.id}
                            className="divide-x divide-gray-200 hover:bg-blue-50"
                          >
                            <td className="whitespace-nowrap p-2 text-sm font-medium text-gray-900">{item.exam_date}</td>
                            <td className="whitespace-nowrap p-2 text-sm font-medium text-gray-900">{item.course_name}</td>
                            <td className="whitespace-nowrap p-2 text-sm font-medium text-blue-500">
                              {item.student_c_name} ({item.student_e_name})
                            </td>
                            <td className="whitespace-nowrap p-2 text-sm font-medium text-gray-900">{item.exam_name}</td>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.exam_scope}</td>
                            <td className="whitespace-nowrap p-2 text-sm text-pink-500">{item.score}</td>
                            <td className="whitespace-nowrap p-2 text-sm font-medium text-red-600">{item.makeup_date ? new Date(item.makeup_date).toLocaleString() : "未預約"}</td>
                            <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                              <span
                                onClick={() => {
                                  setOpen(true);
                                  setUpdate({
                                    id: item.id,
                                    is_makeup: true,
                                    origin_makeup_date: item.makeup_date,
                                    makeup_date: null
                                  });
                                }}
                                className={`cursor-pointer text-orange-400`}
                              >
                                設定
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
