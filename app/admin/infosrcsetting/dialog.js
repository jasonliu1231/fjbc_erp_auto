"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { error } from "../../utils";

export default function Example({ items, setItems, index, open, setOpen, setInfo }) {
  const [srcName, setSrcName] = useState("");

  function handleInput(event) {
    const val = event.target.value;
    setSrcName(val);
  }

  async function closeItem() {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/info_source/` + items[index].id, config);
    const res = await response.json();
    if (response.ok) {
      const newItems = items;
      newItems[index] = res;
      setItems(newItems);
      setOpen(false);
      setInfo({
        show: true,
        success: true,
        msg: "來源已關閉"
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

  async function updateItem() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ info_name: srcName })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/info_source/` + items[index].id, config);
    const res = await response.json();
    if (response.ok) {
      const newItems = items;
      newItems[index] = res;
      setItems(newItems);
      setOpen(false);
      setInfo({
        show: true,
        success: true,
        msg: "資料已新增"
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

  async function openItem(e) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        info_name: items[index].info_name
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/info_source/`, config);
    const res = await response.json();
    if (response.ok) {
      const newItems = items;
      newItems[index] = res;
      setItems(newItems);
      setOpen(false);
      setInfo({
        show: true,
        success: true,
        msg: "來源重新開啟"
      });
      setSrcName("");
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
      onClose={setOpen}
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
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Cog6ToothIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-green-600"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  修改問班來源
                </DialogTitle>
                <div className="mt-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900 text-start"
                    >
                      來源名稱
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={items.length > 0 && items[index].info_name}
                        value={srcName}
                        onChange={handleInput}
                        className="p-3 peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={updateItem}
                className="text-white inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
              >
                修改
              </button>
              {items.length > 0 && items[index].is_active ? (
                <button
                  type="button"
                  data-autofocus
                  onClick={closeItem}
                  className="text-white mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400 sm:col-start-1 sm:mt-0"
                >
                  關閉
                </button>
              ) : (
                <button
                  type="button"
                  data-autofocus
                  onClick={openItem}
                  className="text-white mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-400 sm:col-start-1 sm:mt-0"
                >
                  開啟
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
