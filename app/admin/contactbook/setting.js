"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { error } from "../../utils";

const def_search = {
  tutoring_id: 0,
  col_name: "",
  directions: "",
  directions_english: ""
};

export default function Home({ setInfo }) {
  const [itemsList, setItemsList] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [search, setSearch] = useState(def_search);
  const [update, setUpdate] = useState({});
  const [select, setSelect] = useState(0);
  const [open, setOpen] = useState(false);

  async function getItemList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/performance_detail/list?tutoring_id=${search.tutoring_id}&col_name=${search.col_name}`, config);
    const res = await response.json();
    if (response.ok) {
      setSelect(res.filter((i) => i.active).map((i) => i.id)[0]);
      setItemsList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPerformanceList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/performance_detail/tutoring/list?tutoring_id=${search.tutoring_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setPerformance(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function createItem() {
    if (search.directions == "") {
      setInfo({
        show: true,
        success: false,
        msg: "說明欄位不可空白"
      });
      return;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(search)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/performance_detail`, config);
    const res = await response.json();
    if (response.ok) {
      getItemList();
      setSearch({
        ...search,
        directions: null,
        directions_english: null
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
    if (update.directions_english == "") {
      setInfo({
        show: true,
        success: false,
        msg: "欄位不可空白"
      });
      return;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/performance_detail/directions`, config);
    const res = await response.json();
    if (response.ok) {
      getItemList();
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

  async function setItem(change, type) {
    const data = {};
    if (type) {
      data.active_contact_book_performance_detail_id = change;
    } else {
      data.deactive_contact_book_performance_detail_id = change;
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/performance_detail`, config);
    const res = await response.json();
    if (response.ok) {
      getPerformanceList();
      getItemList();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function setDefault(id, type) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        is_default_detail_id: id,
        is_default: type
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/performance_detail/default`, config);
    const res = await response.json();
    if (response.ok) {
      getPerformanceList();
      getItemList();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  useEffect(() => {
    if (search.tutoring_id != 0) {
      if (search.col_name != "") {
        getItemList();
      }
      getPerformanceList();
    }
  }, [search.tutoring_id, search.col_name]);

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
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">英文敘述</label>
                <div className="mt-2">
                  <input
                    value={update.directions_english}
                    onChange={(e) => {
                      setUpdate({
                        ...update,
                        directions_english: e.target.value
                      });
                    }}
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="inline-flex mx-1 justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={updateItem}
                  className="inline-flex mx-1 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="">
        <div className="px-4 mt-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <h1 className="text-xl font-semibold text-gray-900">聯絡簿設定</h1>
              <span>
                <select
                  onChange={(e) => {
                    setSearch({ ...search, tutoring_id: Number(e.target.value) });
                  }}
                  className="mx-2 w-40 text-gray-600 border-2 border-gray-400 px-2 py-1 rounded-md"
                >
                  {search.tutoring_id == 0 && <option>請選擇補習班</option>}
                  <option value={1}>多易</option>
                  <option value={2}>艾思</option>
                  <option value={3}>華而敦</option>
                </select>
                <select
                  onChange={(e) => {
                    setSearch({ ...search, col_name: e.target.value });
                  }}
                  className="mx-2 w-40 text-gray-600 border-2 border-gray-400 px-2 py-1 rounded-md"
                >
                  {search.col_name == "" && <option>請選擇編號</option>}
                  <option value={"a_col_1"}>課堂表現_欄位1</option>
                  <option value={"a_col_2"}>課堂表現_欄位2</option>
                  <option value={"a_col_3"}>課堂表現_欄位3</option>
                  <option value={"a_col_4"}>課堂表現_欄位4</option>
                  <option value={"a_col_5"}>課堂表現_欄位5</option>
                  <option value={"a_col_6"}>課堂表現_欄位6</option>
                  <option value={"a_col_7"}>課堂表現_欄位7</option>
                  <option value={"a_col_8"}>課堂表現_欄位8</option>
                  <option value={"a_col_9"}>課堂表現_欄位9</option>
                  <option value={"b_col_1"}>作業狀況_欄位1</option>
                  <option value={"b_col_2"}>作業狀況_欄位2</option>
                  <option value={"b_col_3"}>作業狀況_欄位3</option>
                  <option value={"b_col_4"}>作業狀況_欄位4</option>
                  <option value={"b_col_5"}>作業狀況_欄位5</option>
                  <option value={"b_col_6"}>作業狀況_欄位6</option>
                  <option value={"c_col_1"}>本週表現評分_欄位1</option>
                  <option value={"c_col_2"}>本週表現評分_欄位2</option>
                  <option value={"c_col_3"}>本週表現評分_欄位3</option>
                  <option value={"c_col_4"}>本週表現評分_欄位4</option>
                  <option value={"c_col_5"}>本週表現評分_欄位5</option>
                  <option value={"c_col_6"}>本週表現評分_欄位6</option>
                  <option value={"c_col_7"}>本週表現評分_欄位7</option>
                  <option value={"c_col_8"}>本週表現評分_欄位8</option>
                  <option value={"c_col_9"}>本週表現評分_欄位9</option>
                </select>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="col-span-2">
              <label className="text-blue-600">啟用欄位</label>
              <div className="grid grid-cols-3 gap-1">
                <div className="col-span-1 h-70vh overflow-auto">
                  <div className="bg-yellow-100 py-1 mb-1 text-center sticky top-0">課堂表現</div>
                  {performance
                    .filter((i) => i.col_category == "a")
                    .map((col, index) => (
                      <div
                        key={index}
                        className="bg-white p-1 rounded-md m-1 text-sm text-center cursor-pointer hover:bg-sky-100"
                        onClick={(e) => {
                          setSearch({ ...search, col_name: col.col_name });
                        }}
                      >
                        <div className="text-center py-1">{"欄位_" + col.col_name.split("_")[2]}</div>
                        <div className="text-sky-600 px-2">{col.directions}</div>
                        <div className="text-gray-400 px-2">{col.directions_english}</div>
                      </div>
                    ))}
                </div>
                <div className="col-span-1 h-70vh overflow-auto">
                  <div className="bg-yellow-100 py-1 mb-1 text-center sticky top-0">作業狀況</div>
                  {performance
                    .filter((i) => i.col_category == "b")
                    .map((col, index) => (
                      <div
                        key={index}
                        className="bg-white p-1 rounded-md m-1 text-sm text-center cursor-pointer hover:bg-sky-100"
                        onClick={(e) => {
                          setSearch({ ...search, col_name: col.col_name });
                        }}
                      >
                        <div className="text-center py-1">{"欄位_" + col.col_name.split("_")[2]}</div>
                        <div className="text-sky-600 px-2">{col.directions}</div>
                        <div className="text-gray-400 px-2">{col.directions_english}</div>
                      </div>
                    ))}
                </div>
                <div className="col-span-1 h-70vh overflow-auto">
                  <div className="bg-yellow-100 py-1 mb-1 text-center sticky top-0">本週表現評分</div>
                  {performance
                    .filter((i) => i.col_category == "c")
                    .map((col, index) => (
                      <div
                        key={index}
                        className="bg-white p-1 rounded-md m-1 text-sm text-center cursor-pointer hover:bg-sky-100"
                        onClick={(e) => {
                          setSearch({ ...search, col_name: col.col_name });
                        }}
                      >
                        <div className="text-center py-1">{"欄位_" + col.col_name.split("_")[2]}</div>
                        <div className="text-sky-600 px-2">{col.directions}</div>
                        <div className="text-gray-400 px-2">{col.directions_english}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <label className="text-blue-600">欄位設定</label>
              {search.tutoring_id != 0 && search.col_name != "" && (
                <div className="mb-4 flex">
                  <input
                    value={search.directions}
                    onChange={(e) => {
                      setSearch({
                        ...search,
                        directions: e.target.value.trim()
                      });
                    }}
                    className="w-full text-gray-600 border-2 border-gray-400 px-2 py-1 rounded-md"
                    type="text"
                    placeholder={"欄位_" + search.col_name.split("_")[2] + "_中文"}
                  />
                  <input
                    value={search.directions_english}
                    onChange={(e) => {
                      setSearch({
                        ...search,
                        directions_english: e.target.value.trim()
                      });
                    }}
                    className="mx-2 w-full text-gray-600 border-2 border-gray-400 px-2 py-1 rounded-md"
                    type="text"
                    placeholder={"欄位_" + search.col_name.split("_")[2] + "_英文"}
                  />
                  <button
                    className="text-green-600 border-2 border-green-400 bg-green-100 px-2 py-1 rounded-md whitespace-nowrap"
                    onClick={createItem}
                  >
                    新增
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-1 h-60vh overflow-auto">
                {itemsList.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.active ? "bg-green-200" : "bg-gray-200"} col-span-1 px-4 py-2 rounded-md cursor-pointer`}
                  >
                    <div className="grid grid-cols-12">
                      <div className="col-span-10">
                        <div className="text-sky-600 px-2">{item.directions}</div>
                        <div className="text-gray-400 px-2">{item.directions_english}</div>
                      </div>
                      <div className="col-span-2">
                        <>
                          <div
                            className={`${item.is_default ? "text-green-700" : "text-gray-400"} block text-sm`}
                            onClick={() => setDefault(item.id, !item.is_default)}
                          >
                            {item.is_default ? "預設" : "非預設"}
                          </div>
                          {item.active ? (
                            <div
                              onClick={() => {
                                setItem(item.id, false);
                              }}
                              className="block text-sm text-red-700 data-[focus]:bg-red-100 data-[focus]:text-red-900 data-[focus]:outline-none"
                            >
                              關閉
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setItem(item.id, true);
                              }}
                              className="block text-sm text-green-700 data-[focus]:bg-green-100 data-[focus]:text-green-900 data-[focus]:outline-none"
                            >
                              啟用
                            </div>
                          )}
                          {item.directions_english ? null : (
                            <div
                              onClick={() => {
                                if (!item.directions_english) {
                                  setUpdate({
                                    contact_book_performance_detail_id: item.id,
                                    directions_english: ""
                                  });
                                  setOpen(true);
                                }
                              }}
                              className={`${item.directions_english ? "bg-blue-400" : ""} block text-sm text-blue-700 `}
                            >
                              補英文
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
