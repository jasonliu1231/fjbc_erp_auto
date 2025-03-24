"use client";

import { XCircleIcon, Cog6ToothIcon, EyeIcon, MapPinIcon, VideoCameraIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { GiRotaryPhone } from "react-icons/gi";
import SettingDialog from "./dialog";
import { useState } from "react";
import { error } from "../../utils";

export default function Example({ items, setItems, setInfo }) {
  const [viewClass, setViewClass] = useState(false);
  const [viewData, setViewData] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [index, setIndex] = useState();
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoData, setVideoData] = useState({});

  const [list, setList] = useState([]);

  const Mon = list.filter((i) => i.week == 0);
  const Tue = list.filter((i) => i.week == 1);
  const Wed = list.filter((i) => i.week == 2);
  const Thu = list.filter((i) => i.week == 3);
  const Fri = list.filter((i) => i.week == 4);
  const Sat = list.filter((i) => i.week == 5);
  const Sun = list.filter((i) => i.week == 6);

  async function getItemsList(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/list?classroom_id=${id}`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setList(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  function dialogItem(item, index) {
    setIndex(index);
    setData(item);
    setOpen(true);
  }

  const classRoomDelete = async (id) => {
    const check = confirm("確定要刪除嗎？");
    if (check) {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          clientid: `${localStorage.getItem("client_id")}`,
          "Content-Type": "application/json"
        }
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/classroom/${id}`, config);
      const res = await response.json();
      if (response.ok) {
        const newItems = items;
        setItems(newItems.filter((item) => item.classroom_no != res.classroom_no));
      } else {
        const msg = error(response.status, res);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    }
  };

  async function setVideo() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(videoData)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_VIDEO}/start_recording/`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "設定完成"
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

  return (
    <>
      <Dialog
        open={videoOpen}
        onClose={setVideoOpen}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <DialogTitle
                  as="h3"
                  className="mb-4 text-xl font-semibold leading-6 text-gray-900 text-center"
                >
                  錄影設定
                </DialogTitle>
              </div>
              <div>
                {/* <div className="">
                  <label className="block text-sm font-semibold leading-6 text-gray-900">錄製日期</label>
                  <div className="">
                    <input
                      type="date"
                      value={videoData.date}
                      onChange={(event) => {
                        setVideoData({
                          ...videoData,
                          date: event.target.value
                        });
                      }}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div> */}
                <div className="">
                  <label className="block text-sm font-semibold leading-6 text-gray-900">起始時間</label>
                  <div className="">
                    <input
                      step={900}
                      type="datetime-local"
                      value={videoData.start_time}
                      onChange={(event) => {
                        setVideoData({
                          ...videoData,
                          start_time: event.target.value
                        });
                      }}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="">
                  <label className="block text-sm font-semibold leading-6 text-gray-900">結束時間</label>
                  <div className="">
                    <input
                      step={900}
                      type="datetime-local"
                      value={videoData.end_time}
                      onChange={(event) => {
                        setVideoData({
                          ...videoData,
                          end_time: event.target.value
                        });
                      }}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setVideo();
                    setVideoOpen(false);
                  }}
                  className="mt-3 inline-flex justify-center rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-900 shadow-sm ring-1 ring-inset ring-green-300 hover:bg-green-50 sm:mt-0 sm:w-auto"
                >
                  儲存
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={viewClass}
        onClose={setViewClass}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <EyeIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    {viewData.classroom_name}
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期一</li>
                          {Mon.map((item, index) => {
                            const start = item.start_time.split(":");
                            const end = item.end_time.split(":");
                            return (
                              <li
                                key={index}
                                className="py-2"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                                  <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                  <div className="text-md flex items-center justify-center w-full">
                                    <span>
                                      {item.tutoring_course.course.course_name}
                                      {item.tutoring_course.course_name_extend}
                                    </span>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期二</li>
                          {Tue.map((item, index) => {
                            const start = item.start_time.split(":");
                            const end = item.end_time.split(":");
                            return (
                              <li
                                key={index}
                                className="py-2"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                                  <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                  <div className="text-md flex items-center justify-center w-full">
                                    <span>
                                      {item.tutoring_course.course.course_name}
                                      {item.tutoring_course.course_name_extend}
                                    </span>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期三</li>
                          {Wed.map((item, index) => {
                            const start = item.start_time.split(":");
                            const end = item.end_time.split(":");
                            return (
                              <li
                                key={index}
                                className="py-2"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                                  <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                  <div className="text-md flex items-center justify-center w-full">
                                    <span>
                                      {item.tutoring_course.course.course_name}
                                      {item.tutoring_course.course_name_extend}
                                    </span>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期四</li>
                          {Thu.map((item, index) => {
                            const start = item.start_time.split(":");
                            const end = item.end_time.split(":");
                            return (
                              <li
                                key={index}
                                className="py-2"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                                  <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                  <div className="text-md flex items-center justify-center w-full">
                                    <span>
                                      {item.tutoring_course.course.course_name}
                                      {item.tutoring_course.course_name_extend}
                                    </span>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期五</li>
                          {Fri.map((item, index) => {
                            const start = item.start_time.split(":");
                            const end = item.end_time.split(":");
                            return (
                              <li
                                key={index}
                                className="py-2"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                                  <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                  <div className="text-md flex items-center justify-center w-full">
                                    <span>
                                      {item.tutoring_course.course.course_name}
                                      {item.tutoring_course.course_name_extend}
                                    </span>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期六</li>
                          {Sat.map((item, index) => {
                            const start = item.start_time.split(":");
                            const end = item.end_time.split(":");
                            return (
                              <li
                                key={index}
                                className="py-2"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                                  <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                  <div className="text-md flex items-center justify-center w-full">
                                    <span>
                                      {item.tutoring_course.course.course_name}
                                      {item.tutoring_course.course_name_extend}
                                    </span>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期日</li>
                          {Sun.map((item, index) => {
                            const start = item.start_time.split(":");
                            const end = item.end_time.split(":");
                            return (
                              <li
                                key={index}
                                className="py-2"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                                  <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                  <div className="text-md flex items-center justify-center w-full">
                                    <span>
                                      {item.tutoring_course.course.course_name}
                                      {item.tutoring_course.course_name_extend}
                                    </span>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex justify-center">
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setViewClass(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <SettingDialog
        item={data}
        open={open}
        setOpen={setOpen}
        setInfo={setInfo}
        items={items}
        setItems={setItems}
        index={index}
      />
      <ul
        role="list"
        className="space-y-3"
        id="sortable-list"
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-md bg-white px-6 py-4 shadow hover:bg-gray-200"
          >
            <div className="grid grid-cols-12 gap-x-8">
              {/* <div className="col-span-1 text-sm">{item.id}</div> */}
              <div className="col-span-3 sm:text-xl text-md">{item.classroom_name}</div>
              <div className="col-span-3 sm:text-lg text-sm text-gray-600 flex items-center">
                <GiRotaryPhone className="w-5 h-5" />：{item.classroom_tel}
              </div>
              <div className="col-span-3 sm:text-md text-sm text-gray-400 flex items-center">
                <MapPinIcon className="w-5 h-5" />：{item.location}
              </div>
              <div className="col-span-3 flex justify-start items-center">
                <EyeIcon
                  className="mr-3 w-6 text-blue-400 hover:text-blue-600 cursor-pointer"
                  onClick={() => {
                    getItemsList(item.id);
                    setViewData(item);
                    setViewClass(true);
                  }}
                />
                <Cog6ToothIcon
                  aria-hidden="true"
                  className="mr-3 w-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => {
                    dialogItem(item, index);
                  }}
                />
                <XCircleIcon
                  className="mr-3 w-6 text-red-400 hover:text-red-600 cursor-pointer"
                  onClick={() => classRoomDelete(item.id)}
                />
                {item.ip_addr ? (
                  <VideoCameraIcon
                    onClick={() => {
                      setVideoOpen(true);
                      setVideoData({
                        ...videoData,
                        classroom_id: item.id
                      });
                    }}
                    className="mr-3 w-6 text-yellow-400 hover:text-yellow-600 cursor-pointer"
                  />
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
