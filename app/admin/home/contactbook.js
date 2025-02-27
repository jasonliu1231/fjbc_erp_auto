"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { error } from "../../utils";

export default function Example({ schedule_id, tutoring_id, setInfo }) {
  const [content, setContent] = useState([]);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function getContactBook() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/contact_book?schedule_id=${schedule_id}&tutoring_id=${tutoring_id}`, config);
    const res = await response.json();

    if (response.ok) {
      setContent(res.content);
      setDetail(res.detail);
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-full sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold flex justify-around"
                  >
                    <span className="text-blue-600">{content.course_name}</span>
                    <span className="text-gray-500 text-sm">{content.course_date}</span>
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="text-lg font-semibold">今日內容</div>
                    <div className="grid grid-cols-2 px-8">
                      <div className="col-span-1 py-1 ring-1 ring-gray-400 bg-blue-100">課程</div>
                      <pre className="col-span-1 py-1 ring-1 ring-gray-400 text-left overflow-auto p-3">{content.progress}</pre>
                      <div className="col-span-1 py-1 ring-1 ring-gray-400 bg-blue-100">作業</div>
                      <pre className="col-span-1 py-1 ring-1 ring-gray-400 text-left overflow-auto p-3">{content.homework}</pre>
                      <div className="col-span-1 py-1 ring-1 ring-gray-400 bg-blue-100">考試提醒</div>
                      <pre className="col-span-1 py-1 ring-1 ring-gray-400 text-left overflow-auto p-3">{content.next_quiz}</pre>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-lg font-semibold">學生</div>
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-yellow-50 text-center">
                        <tr>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            姓名
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            課堂表現
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            作業狀況
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            本週表現評分
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            評語
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            回覆
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            成績
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                          >
                            簽名
                          </th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {detail.map((person, index) => (
                          <tr
                            key={index}
                            className="text-sm text-left border-2 divide-x divide-gray-200"
                          >
                            <td className={`px-2 py-1`}>
                              <div>{person.first_name}</div>
                              <div>({person.nick_name})</div>
                            </td>
                            <td className={`px-2 py-1`}>
                              <div
                                className=""
                                dangerouslySetInnerHTML={{ __html: person.a_col }}
                              />
                            </td>
                            <td className={`px-2 py-1`}>
                              <div
                                className=""
                                dangerouslySetInnerHTML={{ __html: person.b_col }}
                              />
                            </td>
                            <td className={`px-2 py-1`}>
                              {Array.from({ length: 9 }, (_, index) => {
                                const directions = `c_col_${index + 1}_directions`;
                                const value = `c_col_${index + 1}`;
                                return (
                                  <div key={index}>
                                    <span className="text-gray-600">{person[directions]}</span>
                                    {person[directions] && (
                                      <span className={`${person[value] == 4 ? "text-red-500" : "text-sky-500"} ml-2`}>
                                        {person[value] == 1 ? "優秀(A+)" : person[value] == 2 ? "良好(A)" : person[value] == 3 ? "中等(B)" : person[value] == 4 ? "進步中" : ""}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </td>
                            <td className={`px-2 py-1 w-1/4`}>
                              <div>{person.teacher_sugg}</div>
                            </td>
                            <td className={`${person.parent_sugg ? "ring ring-inset" : ""} px-2 py-1 w-1/4`}>
                              <div>{person.parent_sugg}</div>
                            </td>
                            <td className={`px-2 py-1 whitespace-nowrap`}>
                              {person.exam?.map((item, index) => {
                                if (item) {
                                  const obj = item.split("$$");
                                  return (
                                    <div
                                      key={index}
                                      className="border-b-2 py-2"
                                    >
                                      <div>考試成績：{obj[0]}</div>
                                      {obj[1] && (
                                        <div className="text-pink-500">
                                          <div>輔導時間：</div>
                                          <div>
                                            <span>{new Date(obj[1]).toLocaleDateString()}</span>
                                            <span> {new Date(obj[1]).toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" }).substr(0, 5)}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              })}
                            </td>
                            <td className={`${person.parent_sign ? "text-green-500" : "text-red-500"} px-2 py-1 whitespace-nowrap`}>{person.parent_sign ? "已簽名" : "未簽名"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400"
                >
                  關閉
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <span
        onClick={() => {
          getContactBook();
        }}
        className="text-md text-sky-600 cursor-pointer hover:text-pink-400"
      >
        聯絡簿
      </span>
    </>
  );
}
