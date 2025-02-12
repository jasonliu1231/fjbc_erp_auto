"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Alert from "../alert";

const def_create = {
  schedule_id: 0,
  s_h: "",
  s_m: "",
  e_h: "",
  e_m: ""
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [viewList, setViewList] = useState([]);
  const [list, setList] = useState([]);
  const [createData, setCreateData] = useState(def_create);
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split("T")[0]);

  async function getView(data) {
    const start = new Date(data.start_time).getTime() / 1000;
    const e = new Date(data.end_time);
    const e_str = `${e.toLocaleDateString()} ${e.getHours()}:${e.getMinutes()}:59`;
    const end = new Date(e_str).getTime() / 1000;

    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_VIDEO}/fjbc_recording_api/recording/list/?classroom_id=${data.classroom_id}&start_time=${start}&end_time=${end}`, config);
    const res = await response.json();
    if (response.ok) {
      setViewList(res);
      setView(true);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function getList() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_VIDEO}/fjbc_recording_api/recording/schedule/list/?start_time=${searchDate + " 00:00:00"}&end_time=${searchDate + " 23:59:59"}`,
      config
    );
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

  async function sendItem(data) {
    const api = [];
    data.forEach((element) => {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          classroom_id: element.id,
          start_time: new Date(`${element.course_date} ${element.start_time}`),
          end_time: new Date(`${element.course_date} ${element.end_time}`)
        })
      };
      api.push(fetch(`${process.env.NEXT_PUBLIC_API_URL_VIDEO}/fjbc_recording_api/recording/schedule/`, config));
    });

    Promise.all([api])
      .then(async ([response]) => {
        let error_msg = [];
        for (let i = 0; i < response.length; i++) {
          const r = await response[i];
          const res = await r.json();
          if (!r.ok) {
            error_msg.push(res.detail);
          }
        }

        if (error_msg.length > 0) {
          setShow(true);
          setErrorMsg(error_msg);
        }
      })
      .finally(() => {
        getList();
      });
  }

  async function createItem() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/recording/list`, config);
    const res = await response.json();
    if (response.ok) {
      sendItem(res);
    }
  }

  async function updateItem() {
    const data = {
      schedule_id: createData.schedule_id,
      start_time: new Date(`${searchDate} ${createData.s_h}:${createData.s_m}`),
      end_time: new Date(`${searchDate} ${createData.e_h}:${createData.e_m}`)
    };

    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_VIDEO}/fjbc_recording_api/recording/schedule/${createData.schedule_id}`, config);
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

  async function deleteItem(id) {
    const config = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_VIDEO}/fjbc_recording_api/recording/schedule/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "刪除完成"
      });
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
  }, [searchDate]);

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
        open={view}
        onClose={() => {
          setView(false);
          setViewList([]);
        }}
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
                <div className="text-center">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-blue-600"
                  >
                    影片列表
                  </DialogTitle>
                  <ul>
                    {viewList.map((i, index) => {
                      const start_time = new Date(i.start_time);
                      const end_time = new Date(i.end_time);
                      return (
                        <li
                          key={index}
                          className="border-t-2 py-2"
                        >
                          <a
                            className="text-blue-400 hover:text-red-400"
                            href={i.output_url}
                            target="_blank"
                          >
                            {start_time.toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })} ~{" "}
                            {end_time.toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-blue-600"
                  >
                    修改
                  </DialogTitle>
                  <div>
                    <div className="">
                      <label className="block text-sm/6 font-medium text-gray-900 text-left">起始時間</label>
                      <div className="flex">
                        <select
                          value={createData.s_h}
                          onChange={(e) => {
                            setCreateData({
                              ...createData,
                              s_h: e.target.value
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 24 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}時
                              </option>
                            );
                          })}
                        </select>
                        <select
                          value={createData.s_m}
                          onChange={(e) => {
                            setCreateData({
                              ...createData,
                              s_m: e.target.value
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 60 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}分
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="">
                      <label className="block text-sm/6 font-medium text-gray-900 text-left">結束時間</label>
                      <div className="flex">
                        <select
                          value={createData.e_h}
                          onChange={(e) => {
                            setCreateData({
                              ...createData,
                              e_h: e.target.value
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 24 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}時
                              </option>
                            );
                          })}
                        </select>
                        <select
                          value={createData.e_m}
                          onChange={(e) => {
                            setCreateData({
                              ...createData,
                              e_m: e.target.value
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 60 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}分
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    updateItem();
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-end sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={show}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
              <div className="p-4">
                {errorMsg.map((msg, index) => (
                  <div
                    key={index}
                    className="flex items-center mt-2"
                  >
                    <div className="shrink-0">
                      <XCircleIcon
                        aria-hidden="true"
                        className="size-6 text-red-400"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-600">{msg}</p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShow(false);
                    }}
                    className="px-1 rounded-sm bg-white text-gray-400 hover:text-gray-500 ring-2 ring-gray-300"
                  >
                    <span className="">Close</span>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <h1 className="text-xl font-semibold text-gray-900">錄影列表</h1>
              <div className="ml-4">
                <button
                  onClick={() => {
                    createItem();
                  }}
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  新增當日錄影
                </button>
              </div>
            </div>
            <div>
              <input
                value={searchDate}
                onChange={(e) => {
                  setSearchDate(e.target.value);
                }}
                type="date"
                className="ring-2 ring-gray-300 rounded-sm px-2 py-1"
              />
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="divide-x divide-gray-200 bg-yellow-100">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                      >
                        教室名稱
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        起始時間
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        結束時間
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                      >
                        設定
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {list.length > 0 &&
                      list.map((recording) => {
                        const s = new Date(recording.start_time);
                        const e = new Date(recording.end_time);
                        return (
                          <tr
                            key={recording.id}
                            className="divide-x divide-gray-200 hover:bg-blue-50"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{recording.classroom_name}</td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500">{s.toLocaleString()}</td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500">{e.toLocaleString()}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                              <span
                                onClick={() => {
                                  getView(recording);
                                }}
                                className="mx-2 text-pink-400 hover:text-pink-600 cursor-pointer"
                              >
                                查看
                              </span>
                              <span
                                onClick={() => {
                                  setCreateData({
                                    ...createData,
                                    schedule_id: recording.id,
                                    s_h: s.getHours(),
                                    s_m: s.getMinutes(),
                                    e_h: e.getHours(),
                                    e_m: e.getMinutes()
                                  });

                                  setOpen(true);
                                }}
                                className="mx-2 text-blue-400 hover:text-blue-600 cursor-pointer"
                              >
                                修改
                              </span>
                              <span
                                onClick={() => {
                                  const check = confirm(`確定要刪除嗎？\n教室：${recording.classroom_name}\n錄影起始時間：${s.toLocaleString()}\n錄影結束時間：${e.toLocaleString()}`);
                                  if (check) {
                                    deleteItem(recording.id);
                                  }
                                }}
                                className="mx-2 text-red-400 hover:text-red-600 cursor-pointer"
                              >
                                刪除
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
