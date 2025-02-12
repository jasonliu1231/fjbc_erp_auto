"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { error } from "../../utils";

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" },
  { id: 4, name: "總倉" }
];

export default function Home({ update, setInfo }) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    tutoring_id: 4,
    type: 8,
    index: false
  });
  const [open, setOpen] = useState(false);
  const [logList, setLogList] = useState([]);
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? logList
      : logList.filter((item) => {
          const name = item.product_name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  async function deleteItem(id) {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uuid: id })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_product_detail/set`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getProductsDetail();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getProductsDetail() {
    setLoading(true);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_product_detail/list?tutoringid=${search.tutoring_id}&order_num=${search.type}&order_type=${search.index}`;

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setLogList(res);
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
    getProductsDetail();
  }, [search, update]);

  return (
    <>
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-10"
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-base font-semibold leading-6 text-gray-900">進出庫紀錄</DialogTitle>
                      <span className="isolate inline-flex rounded-md shadow-sm">
                        <input
                          onChange={(event) => setQuery(event.target.value)}
                          value={query}
                          type="text"
                          placeholder="名稱"
                          className="m-1 relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        />
                        {tutoring.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSearch({
                                ...search,
                                tutoring_id: item.id
                              });
                            }}
                            type="button"
                            className={`${
                              item.id == search.tutoring_id ? "bg-blue-200" : "bg-white"
                            } m-1 relative inline-flex rounded-md items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
                          >
                            {item.name}
                          </button>
                        ))}
                      </span>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon
                            aria-hidden="true"
                            className="h-6 w-6"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50 text-gray-900">
                          <tr>
                            <th
                              onClick={() => {
                                if (search.type == 1) {
                                  setSearch({
                                    ...search,
                                    index: !search.index
                                  });
                                } else {
                                  setSearch({
                                    ...search,
                                    type: 1,
                                    index: true
                                  });
                                }
                              }}
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap hover:bg-blue-300 cursor-pointer"
                            >
                              名稱
                            </th>
                            <th
                              onClick={() => {
                                if (search.type == 4) {
                                  setSearch({
                                    ...search,
                                    index: !search.index
                                  });
                                } else {
                                  setSearch({
                                    ...search,
                                    type: 4,
                                    index: true
                                  });
                                }
                              }}
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap hover:bg-blue-300 cursor-pointer"
                            >
                              狀態
                            </th>
                            <th
                              onClick={() => {
                                if (search.type == 5) {
                                  setSearch({
                                    ...search,
                                    index: !search.index
                                  });
                                } else {
                                  setSearch({
                                    ...search,
                                    type: 5,
                                    index: true
                                  });
                                }
                              }}
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap hover:bg-blue-300 cursor-pointer"
                            >
                              數量
                            </th>
                            <th
                              onClick={() => {
                                if (search.type == 6) {
                                  setSearch({
                                    ...search,
                                    index: !search.index
                                  });
                                } else {
                                  setSearch({
                                    ...search,
                                    type: 6,
                                    index: true
                                  });
                                }
                              }}
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap hover:bg-blue-300 cursor-pointer"
                            >
                              單價
                            </th>
                            <th
                              onClick={() => {
                                if (search.type == 7) {
                                  setSearch({
                                    ...search,
                                    index: !search.index
                                  });
                                } else {
                                  setSearch({
                                    ...search,
                                    type: 7,
                                    index: true
                                  });
                                }
                              }}
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap hover:bg-blue-300 cursor-pointer"
                            >
                              備註
                            </th>
                            <th
                              onClick={() => {
                                if (search.type == 9) {
                                  setSearch({
                                    ...search,
                                    index: !search.index
                                  });
                                } else {
                                  setSearch({
                                    ...search,
                                    type: 9,
                                    index: true
                                  });
                                }
                              }}
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap hover:bg-blue-300 cursor-pointer"
                            >
                              用途
                            </th>
                            <th
                              onClick={() => {
                                if (search.type == 8) {
                                  setSearch({
                                    ...search,
                                    index: !search.index
                                  });
                                } else {
                                  setSearch({
                                    ...search,
                                    type: 8,
                                    index: true
                                  });
                                }
                              }}
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap hover:bg-blue-300 cursor-pointer"
                            >
                              紀錄日期
                            </th>
                            <th
                              scope="col"
                              className="text-left text-sm font-semibold whitespace-nowrap"
                            >
                              刪除
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {loading ? (
                            <tr>
                              <td className="flex justify-center items-center py-2">
                                <div className="spinner"></div>
                                <span className="mx-4 text-blue-500">資料讀取中...</span>
                              </td>
                            </tr>
                          ) : (
                            filteredItems.map((log) => (
                              <tr
                                key={log.id}
                                className="text-gray-500 hover:bg-blue-100"
                              >
                                <td className="text-sm font-medium">{log.product_name}</td>
                                <td className={`${log.state ? "text-green-500" : "text-red-500"} text-sm font-medium`}>{log.state ? "進貨" : "出貨"}</td>
                                <td className={`${log.state ? "text-green-500" : "text-red-500"} text-sm font-medium`}>{log.quantity}</td>
                                <td className="whitespace-nowrap text-sm">${log.money || 0}</td>
                                <td className="text-sm">{log.remark}</td>
                                <td className="px-1 whitespace-nowrap text-sm">{log.usage == 1 ? "學生用" : log.usage == 2 ? "教師用" : log.usage == 3 ? "行政用" : log.usage == 10 ? "租借" : ""}</td>
                                <td className="whitespace-nowrap text-sm">{new Date(log.create_at).toLocaleDateString()}</td>
                                <td className="whitespace-nowrap text-sm">
                                  <TrashIcon
                                    className="w-5 h-5 text-red-400 hover:text-red-200"
                                    onClick={() => {
                                      const check = confirm(`確定要刪除?\n商品名：${log.product_name}\n類別：${log.state ? "進貨" : "出貨"}\n數量：${log.quantity}`);
                                      if (check) {
                                        deleteItem(log.id);
                                      }
                                    }}
                                  />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
      <button
        onClick={() => {
          setOpen(true);
        }}
        type="button"
        className="px-2 py-1 relative rounded-md bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
      >
        顯示紀錄
      </button>
    </>
  );
}
