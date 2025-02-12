"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { PlusCircleIcon, CogIcon } from "@heroicons/react/24/outline";
import { error } from "../../utils";

const def_update = {
  course_name: "",
  color: "",
  is_course: true,
  is_visable: true
};

export function Tree({ open, setOpen }) {
  const [input, setInput] = useState({
    course_name: "",
    course_no: ""
  });

  const handleName = (event) => {
    setInput({
      ...input,
      course_name: event.target.value
    });
  };

  const handleNo = (event) => {
    setInput({
      ...input,
      course_no: event.target.value
    });
  };

  const courseSetting = async (data) => {
    if (data.method === "POST") {
      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          clientid: `${localStorage.getItem("client_id")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          course_name: input.course_name,
          parent_no: data.course_no,
          course_no: input.course_no
        })
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/`, config);
      const res = await response.json();
      if (response.ok) {
        open.setTreeData(res.course_list);
        setOpen({
          display: false
        });
      } else {
        const msg = error(response.status, res);
        open.setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    } else if (data.method === "PUT") {
      const config = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          clientid: `${localStorage.getItem("client_id")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          course_name: input.course_name
        })
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${data.course_no}`, config);
      const res = await response.json();
      if (response.ok) {
        open.setTreeData(res.course_list);
        setOpen({
          display: false
        });
      } else {
        const msg = error(response.status, res);
        open.setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    }
  };

  return (
    <Dialog
      open={open.display}
      onClose={() => setOpen({ display: false })}
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
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                {open.data && open.data.method === "POST" ? (
                  <PlusCircleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-green-600"
                  />
                ) : (
                  <CogIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-green-600"
                  />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <div className="relative m-2">
                  <label
                    htmlFor="name"
                    className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >
                    課程名稱
                  </label>
                  <input
                    type="text"
                    placeholder={open.data && open.data.method === "PUT" && open.data.course_name}
                    value={input.course_name}
                    onChange={handleName}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {open.data && open.data.method === "POST" && (
                  <div className="relative m-2">
                    <label
                      htmlFor="name"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      課程編號
                    </label>
                    <input
                      type="text"
                      value={input.course_no}
                      onChange={handleNo}
                      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => courseSetting(open.data)}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                送出
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export function Group({ item, setList, open, setOpen, setInfo }) {
  const [update, setUpdate] = useState(item);

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

  return (
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
                  placeholder={item.course_name}
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
                  value={item.color}
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
                onClick={setOpen}
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
  );
}
