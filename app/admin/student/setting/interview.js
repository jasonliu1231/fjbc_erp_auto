"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { error } from "../../../utils";

export default function Home({ student_id, setInfo }) {
  const userID = useRef();
  const [record, setRecord] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState({});
  const [open, setOpen] = useState(false);

  async function getRecord() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/student/${student_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setRecord(res);
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

  async function saveRecord() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        student_id: Number(student_id),
        content: content
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/student`, config);
    const res = await response.json();
    if (response.ok) {
      setContent("");
      getRecord(student_id);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateRecord() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      setContent("");
      getRecord(userID.current);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function deleteRecord(id) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      getRecord(student_id);
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
    if (student_id != 0) {
      getRecord();
    }
  }, [student_id]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <textarea
                  rows={15}
                  className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={update.content}
                  onChange={(e) => {
                    setUpdate({ ...update, content: e.target.value });
                  }}
                />
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white "
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateRecord();
                    setOpen(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white "
                >
                  確認
                </button>
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
            <div className="px-4 py-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <div>
                    <label className="block text-xl font-medium leading-6 text-gray-900 mb-4">追蹤紀錄</label>
                    <div className="mt-2">
                      <textarea
                        rows={20}
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => {
                          saveRecord();
                        }}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        儲存
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "75vh"
                  }}
                  className="col-span-2 overflow-auto"
                >
                  <div className="px-4">
                    <label className="block text-xl font-medium leading-6 text-gray-900 mb-4">追蹤列表</label>
                    {record.map((i, index) => (
                      <div
                        key={index}
                        className="mb-3"
                      >
                        {" "}
                        <div className="flex justify-between">
                          <div className="text-gray-400">
                            {new Date(i.update_at).toLocaleString("zh-TW", { hour12: false })}-<span className="text-gray-700"> {i.nick_name}</span>
                          </div>
                          <div className="flex">
                            <div
                              onClick={() => {
                                setUpdate({
                                  id: i.id,
                                  content: i.content
                                });
                                setOpen(true);
                              }}
                              className="mx-3 text-blue-400 text-right cursor-pointer"
                            >
                              修改
                            </div>
                            <div
                              onClick={() => {
                                const check = confirm("確定要刪除嗎？");
                                if (check) {
                                  deleteRecord(i.id);
                                }
                              }}
                              className="mx-3 text-red-400 text-right cursor-pointer"
                            >
                              刪除
                            </div>
                          </div>
                        </div>
                        <div className={`${i.preparationid ? "border-purple-300" : "border-blue-300"} border-2 bg-white relative flex`}>
                          <div
                            className="h-32 overflow-auto ml-4 w-full"
                            dangerouslySetInnerHTML={{ __html: i.content.replace(/\n/g, "<br>") }}
                          ></div>
                          <div className={`${i.preparationid ? "border-purple-300" : "border-blue-300"} bg-white border-l-2 border-b-2 absolute w-5 h-5 triangle top-0 left-0`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
