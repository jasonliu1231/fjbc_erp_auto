"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Alert from "../../alert";
import { error } from "../../../utils";

const def_create = {
  content: "",
  wage: 0
};

const def_update = {
  id: 0,
  wage: 0
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [create, setCreate] = useState(def_create);
  const [update, setUpdate] = useState(def_update);

  async function getList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/profile`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
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

  async function createItem() {
    if (create.content.trim() == "") {
      setInfo({
        show: true,
        success: false,
        msg: "名稱不可空白"
      });
      return;
    }
    if (create.wage < 0) {
      setInfo({
        show: true,
        success: false,
        msg: "金額不可以是負數"
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
      body: JSON.stringify(create)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/profile`, config);
    const res = await response.json();
    if (response.ok) {
      getList();
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
    if (create.wage < 0) {
      setInfo({
        show: true,
        success: false,
        msg: "金額不可以是負數"
      });
      return;
    }
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/profile`, config);
    const res = await response.json();
    if (response.ok) {
      getList();
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

  async function deleteItem(id, enable) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id, enable: enable })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/profile`, config);
    const res = await response.json();
    if (response.ok) {
      getList();
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
    getList();
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
                <label className="text-gray-600">時薪設定</label>
                <input
                  value={update.wage}
                  onChange={(e) => {
                    setUpdate({ ...update, wage: Number(e.target.value) });
                  }}
                  type="number"
                  className="border-2 w-full px-2 py-1"
                />
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2 mx-1"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={updateItem}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-green-600 ring-2 ring-green-400 mx-1"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <h1 className="text-xl font-semibold text-gray-900">教師身份設定</h1>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="divide-x divide-gray-200 bg-green-100">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                      >
                        身份名稱
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        預設時薪
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        修改時間
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        建立人
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
                    <tr className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">
                        <input
                          value={create.content}
                          onChange={(e) => {
                            setCreate({ ...create, content: e.target.value });
                          }}
                          type="text"
                          className="border-2 w-full px-2 py-1"
                          placeholder="請輸入建立名稱"
                        />
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {" "}
                        <input
                          value={create.wage}
                          onChange={(e) => {
                            setCreate({ ...create, wage: Number(e.target.value) });
                          }}
                          type="number"
                          className="border-2 w-20 px-2 py-1"
                        />
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500"></td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500"></td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                        <span
                          onClick={createItem}
                          className={`text-blue-400 hover:text-blue-600 mx-2 cursor-pointer`}
                        >
                          新增
                        </span>
                      </td>
                    </tr>
                    {list.map((item) => {
                      return (
                        <tr
                          key={item.id}
                          className={`${item.enable ? "bg-white" : "bg-gray-200"} divide-x divide-gray-200 hover:bg-blue-100`}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{item.content}</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{item.wage}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{new Date(item.update_at).toLocaleString()}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{item.update_by}</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                            <span
                              onClick={() => {
                                setUpdate({ ...update, id: item.id, wage: item.wage });
                                setOpen(true);
                              }}
                              className="text-orange-400 mx-2 cursor-pointer"
                            >
                              修改
                            </span>
                            <span
                              onClick={() => {
                                deleteItem(item.id, !item.enable);
                              }}
                              className={`${item.enable ? "text-red-400 hover:text-red-600" : "text-green-400 hover:text-green-600"} mx-2 cursor-pointer`}
                            >
                              {item.enable ? " 關閉" : " 開啟"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
