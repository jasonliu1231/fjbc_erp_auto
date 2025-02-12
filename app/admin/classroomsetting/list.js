"use client";

import { XCircleIcon, Cog6ToothIcon, EyeIcon, MapPinIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { GiRotaryPhone } from "react-icons/gi";
import SettingDialog from "./dialog";
import { useState } from "react";

export default function Example({ items, setItems, setInfo }) {
  const [viewClass, setViewClass] = useState(false);
  const [viewData, setViewData] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [index, setIndex] = useState();

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

  return (
    <>
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7">
                      <div className="col-span-1">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 mx-1"
                        >
                          <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期一</li>
                          {Mon.map((item, index) => {
                            return (
                              <li
                                key={index}
                                className="py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1">
                                  <div className="text-lg flex items-center">
                                    <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                    {item.tutoring_course.course.course_name}
                                    {item.tutoring_course.course_name_extend}
                                  </div>
                                  <p className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.start_time}~{item.end_time}
                                  </p>
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
                            return (
                              <li
                                key={index}
                                className="py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1">
                                  <div className="text-lg flex items-center">
                                    <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                    {item.tutoring_course.course.course_name}
                                    {item.tutoring_course.course_name_extend}
                                  </div>
                                  <p className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.start_time} ~{item.end_time}
                                  </p>
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
                            return (
                              <li
                                key={index}
                                className="py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1">
                                  <div className="text-lg flex items-center">
                                    <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                    {item.tutoring_course.course.course_name}
                                    {item.tutoring_course.course_name_extend}
                                  </div>
                                  <p className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.start_time} ~{item.end_time}
                                  </p>
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
                            return (
                              <li
                                key={index}
                                className="py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1">
                                  <div className="text-lg flex items-center">
                                    <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                    {item.tutoring_course.course.course_name}
                                    {item.tutoring_course.course_name_extend}
                                  </div>
                                  <p className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.start_time} ~{item.end_time}
                                  </p>
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
                            return (
                              <li
                                key={index}
                                className="py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1">
                                  <div className="text-lg flex items-center">
                                    <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                    {item.tutoring_course.course.course_name}
                                    {item.tutoring_course.course_name_extend}
                                  </div>
                                  <p className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.start_time} ~{item.end_time}
                                  </p>
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
                            return (
                              <li
                                key={index}
                                className="py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1">
                                  <div className="text-lg flex items-center">
                                    <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                    {item.tutoring_course.course.course_name}
                                    {item.tutoring_course.course_name_extend}
                                  </div>
                                  <p className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.start_time} ~{item.end_time}
                                  </p>
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
                            return (
                              <li
                                key={index}
                                className="py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  window.location.href = `/admin/schedule/class?id=${item.id}`;
                                }}
                              >
                                <div className="p-1">
                                  <div className="text-lg flex items-center">
                                    <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                                    {item.tutoring_course.course.course_name}
                                    {item.tutoring_course.course_name_extend}
                                  </div>
                                  <p className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.start_time} ~{item.end_time}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>{" "}
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
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8">
              {/* <div className="col-span-1 text-sm">{item.id}</div> */}
              <div className="col-span-1 sm:col-span-4 sm:text-xl text-md">{item.classroom_name}</div>
              <div className="col-span-1 sm:col-span-2 sm:text-lg text-sm text-gray-600 flex items-center">
                <GiRotaryPhone className="w-5 h-5" />：{item.classroom_tel}
              </div>
              <div className="col-span-1 sm:col-span-3 sm:text-md text-sm text-gray-400 flex items-center">
                <MapPinIcon className="w-5 h-5" />：{item.location}
              </div>
              <div className="col-span-1 sm:col-span-2 mt-3 sm:mt-0 flex justify-center items-center">
                <EyeIcon
                  className="mr-3 w-8 sm:mx-2 text-blue-400 hover:text-blue-600 cursor-pointer"
                  onClick={() => {
                    getItemsList(item.id);
                    setViewData(item);
                    setViewClass(true);
                  }}
                />
                <Cog6ToothIcon
                  aria-hidden="true"
                  className="mr-3 w-8 sm:mx-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => {
                    dialogItem(item, index);
                  }}
                />
                <XCircleIcon
                  className="w-8 sm:mx-2 text-red-400 hover:text-red-600 cursor-pointer"
                  onClick={() => classRoomDelete(item.id)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
