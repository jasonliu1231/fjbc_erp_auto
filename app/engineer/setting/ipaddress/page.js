"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Label, Switch } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

const def_create = {
  id: 0,
  check: true,
  delete: false,
  equipment_name: "",
  equipment_ip: ""
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [createData, setCreateData] = useState(def_create);

  async function getList() {
    const response = await fetch(`/api/ip_address`);
    const res = await response.json();
    if (response.ok) {
      setList(res);
    }
  }

  async function createItem() {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    const response = await fetch(`/api/ip_address`, config);
    const res = await response.json();
    if (response.ok) {
      setOpen(false);
      getList();
    } else {
      alert(res.msg);
    }
  }

  async function updateItem() {
    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    const response = await fetch(`/api/ip_address`, config);
    const res = await response.json();
    if (response.ok) {
      setOpen(false);
      getList();
    } else {
      alert(res.msg);
    }
  }

  async function deleteItem() {
    const config = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    const response = await fetch(`/api/ip_address`, config);
    const res = await response.json();
    if (response.ok) {
      setOpen(false);
      getList();
    } else {
      alert(res.msg);
    }
  }

  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 hidden">
                  <CheckIcon
                    aria-hidden="true"
                    className="size-6 text-green-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-blue-600"
                  >
                    {createData.delete ? "刪除" : createData.id != 0 ? "修改" : "新增"}
                  </DialogTitle>
                  {createData.delete ? (
                    <div>
                      <p className="text-red-400">請問要刪除以下資料嗎？</p>
                      <p>名稱：{createData.equipment_name}</p>
                      <p>ip：{createData.equipment_ip}</p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div>
                        <label className="block text-sm/6 font-medium text-red-400 text-left">名稱</label>
                        <div className="mt-2">
                          <input
                            value={createData.equipment_name}
                            onChange={(e) => {
                              setCreateData({
                                ...createData,
                                equipment_name: e.target.value
                              });
                            }}
                            type="text"
                            placeholder="ip 名稱"
                            className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm/6 font-medium text-red-400 text-left">位置</label>
                        <div className="mt-2">
                          <input
                            value={createData.equipment_ip}
                            onChange={(e) => {
                              setCreateData({
                                ...createData,
                                equipment_ip: e.target.value
                              });
                            }}
                            type="text"
                            placeholder="ip 位置"
                            className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      <Field className="flex items-center mt-2">
                        <Switch
                          checked={createData.check}
                          onChange={(val) => {
                            setCreateData({
                              ...createData,
                              check: val
                            });
                          }}
                          className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                          />
                        </Switch>
                        <Label
                          as="span"
                          className="ml-3 text-sm"
                        >
                          <span className="font-medium text-gray-900">判斷名稱與位置是否衝突</span>
                        </Label>
                      </Field>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (createData.delete) {
                      deleteItem();
                    } else {
                      if (createData.id == 0) {
                        createItem();
                      } else {
                        updateItem();
                      }
                    }
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
      <div className="container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mt-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold text-gray-900">補習班電視牆設定</h1>
              <p className="mt-2 text-sm text-gray-700 hidden">A list of all the users in your account including their name, title, email and role.</p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={() => {
                  setCreateData(def_create);
                  setOpen(true);
                }}
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                新增
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                        位置
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        建立時間
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        修改時間
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
                    {list.length > 0 &&
                      list.map((ip) => (
                        <tr
                          key={ip.id}
                          className="divide-x divide-gray-200 hover:bg-blue-50"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{ip.equipment_name}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{ip.equipment_ip}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{new Date(ip.created_at).toLocaleString()}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{new Date(ip.updated_at).toLocaleString()}</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                            <span
                              onClick={() => {
                                setCreateData({
                                  ...createData,
                                  ...ip,
                                  delete: false
                                });
                                setOpen(true);
                              }}
                              className="mx-2 text-blue-400 hover:text-blue-600 cursor-pointer"
                            >
                              修改
                            </span>
                            <span
                              onClick={() => {
                                setCreateData({
                                  ...createData,
                                  ...ip,
                                  delete: true
                                });
                                setOpen(true);
                              }}
                              className="mx-2 text-red-400 hover:text-red-600 cursor-pointer"
                            >
                              刪除
                            </span>
                          </td>
                        </tr>
                      ))}
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
