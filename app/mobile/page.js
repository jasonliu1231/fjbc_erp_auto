"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { notificationAll, notificationPerson, notificationType } from "../utils";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [QRCode, setQRCode] = useState("");
  const [type, setType] = useState(1);
  const [offset, setOffset] = useState(0);

  async function getList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/mobile/list?role_id=${type}&offset=${offset}`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
    } else {
      if (response.status == 403) {
        alert("非管理員無法使用！");
      }
    }
  }

  async function getSearch() {
    if (search == "") {
      alert("關鍵字不可以空白！");
      return;
    }
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        search: search
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/mobile`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
    } else {
      if (response.status == 403) {
        alert("非管理員無法使用！");
      }
    }
  }

  async function createUser(user_id) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user_id
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/mobile`, config);
    const res = await response.json();
    if (response.ok) {
      setQRCode(res.mobile_id);
      setOpen(true);
    }
  }

  async function sendTest() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: [3],
        user_id: [1],
        title: "測試推播",
        message: "TEST"
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/notification/person`, config);
  }

  useEffect(() => {
    getList();
  }, [type, offset]);

  return (
    <>
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <DialogTitle
                  as="h3"
                  className="text-center font-semibold leading-6 text-gray-900"
                >
                  QRCode
                </DialogTitle>
                <div className="mt-3 flex items-center justify-center">{QRCode != "" && <QRCodeSVG value={QRCode} />}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mt-10">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold text-gray-900">手機使用者綁定</h1>
            </div>
            <div className="sm:flex-auto">
              <span className="isolate inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => {
                    setType(1);
                    setOffset(0);
                  }}
                  type="button"
                  className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  管理員
                </button>
                <button
                  onClick={() => {
                    setType(2);
                    setOffset(0);
                  }}
                  type="button"
                  className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  工程師
                </button>
                <button
                  onClick={() => {
                    setType(3);
                    setOffset(0);
                  }}
                  type="button"
                  className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  使用者
                </button>
                <button
                  onClick={() => {
                    setType(4);
                    setOffset(0);
                  }}
                  type="button"
                  className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  老師
                </button>
                <button
                  onClick={() => {
                    setType(5);
                    setOffset(0);
                  }}
                  type="button"
                  className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  學生
                </button>
                <button
                  onClick={() => {
                    setType(6);
                    setOffset(0);
                  }}
                  type="button"
                  className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  家長
                </button>
                <button
                  onClick={() => {
                    setType(7);
                    setOffset(0);
                  }}
                  type="button"
                  className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  財務
                </button>
              </span>
              <input
                onChange={(e) => {
                  setSearch(e.target.value.trim());
                }}
                className="mx-2 px-2 py-1"
                placeholder="請輸入關鍵字"
              />
              <button
                onClick={() => {
                  getSearch();
                }}
                className="text-blue-500"
              >
                查詢
              </button>
            </div>

            {/* <div>
              <button
                className="mx-2 border-2 border-pink-300 px-2 py-1 bg-pink-600 rounded-md text-white"
                onClick={() => {
                  sendTest();
                }}
              >
                群組發送
              </button>
              <button
                className="border-2 border-pink-300 px-2 py-1 bg-pink-600 rounded-md text-white"
                onClick={() => {
                  notificationAll({
                    title: "這是一則群發測試推播訊息！",
                    message: "全體發送測試！"
                  });
                }}
              >
                全體發送
              </button>
            </div> */}
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                {list.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr className="divide-x divide-gray-200 bg-yellow-100">
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                        >
                          名稱
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          暱稱
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          身份
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          帳號
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          電話
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
                      {list.map((person, index) => (
                        <tr
                          key={index}
                          className="divide-x divide-gray-200 hover:bg-blue-50"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{person.first_name}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.nick_name}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.type}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.username}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.tel}</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                            <span
                              onClick={() => {
                                createUser(person.user_id);
                              }}
                              className="mx-2 text-blue-400 hover:text-blue-600 cursor-pointer"
                            >
                              綁定
                            </span>
                            <span
                              onClick={() => {
                                notificationPerson({
                                  user_id: [person.user_id],
                                  title: "這是一則測試推播訊息！",
                                  message: "恭喜綁定成功～😂"
                                });
                              }}
                              className="mx-2 text-red-400 hover:text-blue-600 cursor-pointer"
                            >
                              測試發送
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-4xl text-red-400">無使用者</div>
                )}
                <div className="flex justify-center mt-4">
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => {
                        if (offset > 0) {
                          setOffset(offset - 10);
                        }
                      }}
                      type="button"
                      className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </button>
                    <button
                      onClick={() => {
                        if (list.length == 10) {
                          setOffset(offset + 10);
                        }
                      }}
                      type="button"
                      className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
