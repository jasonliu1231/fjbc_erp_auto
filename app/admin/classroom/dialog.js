"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { error } from "../../utils";

export default function Example({ item, open, setOpen, setInfo, items, setItems, index }) {
  const [input, setInput] = useState({
    classroom_name: "",
    location: "",
    classroom_tel: ""
  });

  const courseSetting = async () => {
    const data = {};
    if (input.classroom_name == "") {
      data.classroom_name = item.classroom_name;
    } else {
      data.classroom_name = input.classroom_name;
    }

    if (input.location == "") {
      data.location = item.location;
    } else {
      data.location = input.location;
    }

    if (input.classroom_tel == "") {
      data.classroom_tel = item.classroom_tel;
    } else {
      data.classroom_tel = input.classroom_tel;
    }

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/classroom/${item.id}`, config);
    const res = await response.json();
    if (response.ok) {
      const newItems = items;
      newItems[index] = res;
      setItems(newItems);
      setOpen(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
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
                <Cog6ToothIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-green-600"
                />
              </div>
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
                    placeholder={item.classroom_name}
                    value={input.classroom_name}
                    onChange={(event) => {
                      setInput({
                        ...input,
                        classroom_name: event.target.value
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
                    分機
                  </label>
                  <input
                    type="text"
                    placeholder={item.classroom_tel}
                    value={input.classroom_tel}
                    onChange={(event) => {
                      setInput({
                        ...input,
                        classroom_tel: event.target.value
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
                    地點
                  </label>
                  <input
                    type="text"
                    placeholder={item.location}
                    value={input.location}
                    onChange={(event) => {
                      setInput({
                        ...input,
                        location: event.target.value
                      });
                    }}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={courseSetting}
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
