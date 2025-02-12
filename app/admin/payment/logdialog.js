"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Example({ data }) {
  const { login, setLogin, setInfo, submitData, setSubmitData } = data;
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [save, setSave] = useState(false);

  async function isWho() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        username: loginData.username,
        password: loginData.password
      })
    };
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/`, config);
    const res = await response.json();
    if (response.ok) {
      setSubmitData({
        ...submitData,
        creator_id: res,
        canceller_id: res,
        handler_id: res
      });
      if (!save) {
        setLoginData({ username: "", password: "" });
      }
    } else {
      setInfo({
        show: true,
        success: false,
        msg: "取得使用者失敗"
      });
    }
    return;
  }

  return (
    <Dialog
      open={login}
      onClose={setLogin}
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
              <div className="text-center">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  使用者確認
                </DialogTitle>
                <div>
                  <input
                    onChange={(event) => {
                      setLoginData({
                        ...loginData,
                        username: event.target.value
                      });
                    }}
                    value={loginData?.username}
                    type="text"
                    placeholder="帳號"
                    className="my-1 p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <input
                    onChange={(event) => {
                      setLoginData({
                        ...loginData,
                        password: event.target.value
                      });
                    }}
                    value={loginData?.password}
                    type="password"
                    placeholder="密碼"
                    className="my-1 p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={save}
                    onChange={() => {
                      setSave(true);
                    }}
                  />
                  <label
                    htmlFor="comments"
                    className="text-gray-700"
                  >
                    暫存帳號、密碼
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => {
                  setLogin(false);
                  isWho();
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
  );
}
