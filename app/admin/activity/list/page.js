"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { MagnifyingGlassIcon, XCircleIcon, CheckCircleIcon, WrenchScrewdriverIcon } from "@heroicons/react/20/solid";
import { QRCodeSVG } from "qrcode.react";
import { error } from "../../../utils";
import Alert from "../../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [QRCode, setQRCode] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          const name = item.name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  async function setActivity(form_id, enable) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        enable: enable,
        form_id: form_id
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/switch`, config);
    const res = await response.json();
    if (response.ok) {
      getActivityList();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getActivityList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/list`, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    getActivityList();
  }, []);

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
      <div className="container mx-auto p-2">
        <div className="flex items-center">
          <div className="flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">問卷列表</h1>
            <div className="mt-1">
              <div className="relative rounded-md shadow-sm w-40">
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  value={query}
                  type="text"
                  placeholder="表單名稱"
                  className="p-1 block w-full rounded-md border-0 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="inline-block min-w-full py-2 align-middle h-80vh overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th
                  scope="col"
                  className="p-2 text-left font-semibold text-gray-900"
                >
                  表單名稱
                </th>
                <th
                  scope="col"
                  className="p-2 text-left font-semibold text-gray-900"
                >
                  時間
                </th>
                <th
                  scope="col"
                  className="p-2 text-left font-semibold text-gray-900"
                >
                  期限
                </th>
                <th
                  scope="col"
                  className="p-2 text-left font-semibold text-gray-900"
                >
                  連結相關
                </th>
                <th
                  scope="col"
                  className="p-2 text-left font-semibold text-gray-900"
                >
                  設定
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t border-gray-200">
                <th
                  scope="colgroup"
                  className="bg-green-50 p-2 text-left font-semibold text-gray-900"
                >
                  進行中
                </th>
                <th
                  scope="colgroup"
                  className="bg-green-50 p-2 text-left font-semibold text-gray-900"
                >
                  開啟
                </th>
                <th
                  scope="colgroup"
                  colSpan={3}
                  className="bg-green-50 p-2 text-left font-semibold text-gray-900"
                >
                  自動關閉
                </th>
              </tr>
              {filteredItems.length > 0 &&
                filteredItems
                  .filter((i) => i.enable)
                  .map((item) => {
                    return (
                      <tr
                        key={item.form_id}
                        className="hover:bg-blue-100"
                      >
                        <td className="whitespace-nowrap p-2 font-medium text-gray-900">{item.name}</td>
                        <td className="whitespace-nowrap p-2 text-gray-500">{item.open_date && new Date(item.open_date).toLocaleDateString()}</td>
                        <td className="whitespace-nowrap p-2 text-gray-500">{item.auto_close && new Date(item.auto_close).toLocaleDateString()}</td>
                        <td className="whitespace-nowrap p-2 text-gray-500">
                          <a
                            className="mx-1 text-pink-900 hover:text-pink-600"
                            href={`/admin/activity/view?id=${item.form_id}`}
                          >
                            檢測
                          </a>
                          <a
                            target="_blank"
                            className="mx-1 text-blue-900 hover:text-blue-600"
                            href={`https://tutoring.fjbcgroup.com/autoactivity?id=${item.form_id}`}
                          >
                            正式
                          </a>
                          <span
                            onClick={() => {
                              setOpen(true);
                              setQRCode(`https://tutoring.fjbcgroup.com/autoactivity?id=${item.form_id}`);
                            }}
                            className="mx-1 text-blue-600 cursor-pointer hover:opacity-50"
                          >
                            QRCode
                          </span>
                        </td>
                        <td className="whitespace-nowrap p-2 text-gray-500 flex items-end">
                          <div
                            onClick={() => {
                              window.location.href = `./setting?id=${item.form_index}`;
                            }}
                            className="flex text-yellow-500 mx-1 cursor-pointer hover:opacity-50"
                          >
                            <WrenchScrewdriverIcon className="w-4 h-4" />
                            設定
                          </div>
                          <div
                            onClick={() => {
                              const check = confirm(`確定關閉${item.name}嗎？`);
                              if (check) {
                                setActivity(item.form_id, false);
                              }
                            }}
                            className="flex text-green-500 mx-1 cursor-pointer hover:opacity-50"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            開啟中
                          </div>
                          {/* <div
                                  onClick={() => {
                                    window.location.href = `./paper?id=${item.id}`;
                                  }}
                                  className="flex text-sky-500 mx-2 cursor-pointer hover:opacity-50"
                                >
                                  <DocumentTextIcon className="w-4 h-4" />
                                  紙本
                                </div> */}
                        </td>
                      </tr>
                    );
                  })}
              <tr className="border-t border-gray-200">
                <th
                  scope="colgroup"
                  className="bg-red-50 p-2 text-left font-semibold text-gray-900"
                >
                  已結束
                </th>
                <th
                  scope="colgroup"
                  className="bg-red-50 p-2 text-left font-semibold text-gray-900"
                >
                  關閉
                </th>
                <th
                  scope="colgroup"
                  colSpan={3}
                  className="bg-red-50 p-2 text-left font-semibold text-gray-900"
                >
                  自動開啟
                </th>
              </tr>
              {filteredItems.length > 0 &&
                filteredItems
                  .filter((i) => !i.enable)
                  .map((item) => {
                    return (
                      <tr
                        key={item.form_id}
                        className={`${!item.open_date && !item.close_date ? "bg-sky-200" : "bg-gray-400"} hover:bg-gray-200`}
                      >
                        <td className="whitespace-nowrap p-2 font-medium text-gray-900 relative">
                          {!item.open_date && !item.close_date && <div className="color-flicker absolute font-semibold -top-2 -left-1">NEW</div>}
                          {item.name}
                        </td>
                        <td className="whitespace-nowrap p-2 text-gray-500">{item.close_date && new Date(item.close_date).toLocaleDateString()}</td>
                        <td className="whitespace-nowrap p-2 text-gray-500">{item.auto_open && new Date(item.auto_open).toLocaleDateString()}</td>
                        <td className="whitespace-nowrap p-2 text-gray-500"></td>
                        <td className="whitespace-nowrap p-2 text-gray-500 flex items-end">
                          <div
                            onClick={() => {
                              window.location.href = `./setting?id=${item.form_index}`;
                            }}
                            className="flex text-yellow-500 mx-1 cursor-pointer hover:opacity-50"
                          >
                            <WrenchScrewdriverIcon className="w-4 h-4" />
                            設定
                          </div>
                          <div
                            onClick={() => {
                              setActivity(item.form_id, true);
                            }}
                            className="flex text-red-500 mx-1 cursor-pointer hover:text-red-300"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            關閉中
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
