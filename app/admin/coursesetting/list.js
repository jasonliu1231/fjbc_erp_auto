"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { error } from "../../utils";

const def_update = {
  course_name: "",
  color: ""
};

export default function Example({ setInfo }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [update, setUpdate] = useState(def_update);

  async function courseSetting() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${item.id}`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res.course_list);
      setOpen(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getCoursesList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/list`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res.course_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  const courseDelete = async (id) => {
    const check = confirm("確定要刪除嗎？如只是暫時不使用請點選關閉！");
    if (check) {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          clientid: `${localStorage.getItem("client_id")}`,
          "Content-Type": "application/json"
        }
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}`, config);
      const res = await response.json();
      if (response.ok) {
        setList(res.course_list);
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

  const courseSwitch = async (id, open) => {
    let url = "";
    if (open) {
      url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}/show`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}/hide`;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setList(res.course_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  };

  useEffect(() => {
    getCoursesList();
  }, []);

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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="mt-3 text-center sm:mt-5">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >
                    名稱
                  </label>
                  <input
                    type="text"
                    placeholder={update.course_name}
                    value={update.course_name}
                    onChange={(e) => {
                      setUpdate({
                        ...update,
                        course_name: e.target.value
                      });
                    }}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="relative mt-3">
                  <label
                    htmlFor="name"
                    className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >
                    代表色
                  </label>
                  <input
                    type="color"
                    value={update.color}
                    onChange={(e) => {
                      setUpdate({
                        ...update,
                        color: e.target.value
                      });
                    }}
                    className="h-12 p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-1 rounded-md bg-gray-600 px-3 py-2 text-sm text-white shadow-sm"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={courseSetting}
                  className="mx-1 rounded-md bg-green-600 px-3 py-2 text-sm text-white shadow-sm"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <ul
        role="list"
        className="space-y-1"
        id="sortable-list"
      >
        {list.map((item) => (
          <li
            key={item.id}
            className="border-2 rounded-md bg-white py-2 px-4"
            style={{ borderColor: item.color }}
          >
            <div className="grid grid-cols-12">
              <div className="col-span-2">{item.course_no}</div>
              <div className="col-span-8">{item.course_name}</div>
              <div className="col-span-2 flex justify-around">
                <span
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => {
                    setUpdate({
                      course_name: item.course_name,
                      color: item.color
                    });
                    setOpen(true);
                  }}
                >
                  設定
                </span>
                <span
                  className={`${item.is_visable ? "text-pink-400 hover:text-pink-600" : "text-green-400 hover:text-green-600"}  cursor-pointer`}
                  onClick={() => courseSwitch(item.id, !item.is_visable)}
                >
                  {item.is_visable ? "關閉" : "開啟"}
                </span>
                {/* <span
                  className="w-8 text-red-400 hover:text-red-600 cursor-pointer"
                  onClick={() => courseDelete(item.id)}
                >
                  刪除
                </span> */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
