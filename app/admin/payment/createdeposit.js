"use client";

import { useEffect, useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { TutoringSelect, StudentSelect } from "./select";
import { error } from "../../utils";
import Richtext from "./richtext";
import LogDialog from "./logdialog";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function Example({ setInfo }) {
  // 狀態：1.新增訂金 2.新增優惠券 3.刪除訂金 4.刪除優惠券
  const state = useRef(0);
  const deleteId = useRef(0);
  // 登入
  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [depositList, setDepositList] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [createData, setCreateData] = useState({
    coupon_name: "勵學券",
    coupon: 500,
    deposit: 0,
    remark: "",
    reason: "",
    handler_id: 0,
    creator_id: 0,
    tutoring_id: 0,
    student_id: 0
  });

  async function getCouponList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/coupon/list?tutoring_id=${createData.tutoring_id}&student_id=${createData.student_id}&used=false`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setCouponList(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getDepositList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/deposit/list?deposit_state=11&tutoring_id=${createData.tutoring_id}&student_id=${createData.student_id}&used=false`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setDepositList(res.list.filter((item) => !item.remark && !item.approved_reject && !item.invoice_id));
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  function checkItem() {
    if (createData.tutoring_id == 0) {
      setInfo({ show: true, success: false, msg: "請選擇補習班" });
      return;
    }
    if (createData.student_id == 0) {
      setInfo({ show: true, success: false, msg: "請選擇學生" });
      return;
    }
    if (state.current == 1) {
      if (!Number.isInteger(createData.deposit)) {
        setInfo({ show: true, success: false, msg: "金額需要是整數" });
        return;
      }
      if (createData.deposit < 1) {
        setInfo({ show: true, success: false, msg: "訂金需要大於零" });
        return;
      }
    } else if (state.current == 2) {
      if (createData.coupon_name == "") {
        setInfo({ show: true, success: false, msg: "請填寫優惠券名稱" });
        return;
      }
      if (createData.coupon < 1) {
        setInfo({ show: true, success: false, msg: "優惠券面額需要大於零" });
        return;
      }
    }

    setLogin(true);
  }

  async function submit(key) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/${key}/`;
    const response = await fetch(url, config);
    const res = await response.json();
    setCreateData({
      ...createData,
      creator_id: 0
    });
    if (response.ok) {
      if (state.current == 2) {
        getCouponList();
      }
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function deleteItem(key) {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/${key}/${deleteId.current}`;
    const response = await fetch(url, config);
    const res = await response.json();
    setCreateData({
      ...createData,
      creator_id: 0
    });
    if (response.ok) {
      if (state.current == 3) {
        getDepositList();
      } else if (state.current == 4) {
        getCouponList();
      }
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
    if (createData.student_id && createData.student_id != 0 && createData.tutoring_id && createData.tutoring_id != 0) {
      getCouponList();
      getDepositList();
    }
  }, [createData.student_id, , createData.tutoring_id]);

  useEffect(() => {
    if (createData.creator_id && createData.creator_id != 0) {
      if (state.current == 1) {
        submit("deposit");
      } else if (state.current == 2) {
        submit("coupon");
      } else if (state.current == 3) {
        deleteItem("deposit");
      } else if (state.current == 4) {
        deleteItem("coupon");
      }
    }
  }, [createData.creator_id]);

  return (
    <>
      {/* 刪除原因 */}
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
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    刪除原因
                  </DialogTitle>
                  <div className="mt-2">
                    <input
                      onChange={(event) => {
                        setCreateData({
                          ...createData,
                          reason: event.target.value
                        });
                      }}
                      value={createData?.reason}
                      type="text"
                      className="my-1 p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (createData.reason == "") {
                      setInfo({ show: true, success: false, msg: "刪除原因不可以是空的！" });
                      return;
                    }
                    setOpen(false);
                    setLogin(true);
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
      <LogDialog
        data={{
          login,
          setLogin,
          setInfo,
          submitData: createData,
          setSubmitData: setCreateData
        }}
      />
      <div className="isolate bg-white px-6 pt-12 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">新增 訂金 / 優惠券</h2>
        </div>
        <div className="mx-auto mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div className="sm:col-span-1">
              <TutoringSelect
                createData={createData}
                setCreateData={setCreateData}
              />
            </div>
            <div className="sm:col-span-1">
              <StudentSelect
                createData={createData}
                setCreateData={setCreateData}
              />
            </div>
            <div className="sm:col-span-2 mt-2">
              <Richtext createData={createData} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mt-3">
            <div className="col-span-1 border-2 rounded-md p-2">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">訂金</label>
                <div className="mt-2">
                  <input
                    type="number"
                    defaultValue={createData?.deposit}
                    onChange={(event) => {
                      setCreateData({
                        ...createData,
                        deposit: Number(event.target.value)
                      });
                    }}
                    className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="mt-2">
                <button
                  type="submit"
                  onClick={() => {
                    state.current = 1;
                    checkItem();
                  }}
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  新增訂金
                </button>
              </div>
              <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2">
                <ul
                  role="list"
                  className="divide-y divide-gray-200"
                >
                  {depositList.length > 0 &&
                    depositList.map((item) => (
                      <li
                        key={item.id}
                        className="px-4 py-4 sm:px-6"
                      >
                        <div className="flex">
                          <div className="w-1/5 text-left">訂金</div>
                          <div className="w-1/5 text-right">${item.deposit}</div>
                          <div className="w-1/5 flex justify-center">
                            <TrashIcon
                              className="text-gray-700 hover:text-gray-400 h-5 w-5"
                              onClick={() => {
                                state.current = 3;
                                deleteId.current = item.id;
                                setOpen(true);
                              }}
                            />
                          </div>
                          <div className="w-1/5 text-center">{item.creator.first_name}</div>
                          <div className="w-1/5 text-center">
                            <a
                              className="text-blue-400"
                              href={`/admin/payment/receipt?type=2&id=${item.id}`}
                            >
                              收據
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="col-span-1 border-2 rounded-md p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">優惠券名稱</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={createData?.coupon_name}
                      onChange={(event) => {
                        setCreateData({
                          ...createData,
                          coupon_name: event.target.value
                        });
                      }}
                      className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">優惠券金額</label>
                  <div className="mt-2">
                    <input
                      type="number"
                      defaultValue={createData?.coupon}
                      onChange={(event) => {
                        setCreateData({
                          ...createData,
                          coupon: Number(event.target.value)
                        });
                      }}
                      className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mt-2">
                  <button
                    type="submit"
                    onClick={() => {
                      state.current = 2;
                      checkItem();
                    }}
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    新增優惠券
                  </button>
                </div>
              </div>
              <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2">
                <ul
                  role="list"
                  className="divide-y divide-gray-200"
                >
                  {couponList.length > 0 &&
                    couponList.map((item) => (
                      <li
                        key={item.id}
                        className="px-4 py-4 sm:px-6"
                      >
                        <div className="grid grid-cols-7">
                          <div className="col-span-4">{item.coupon_name}</div>
                          <div className="col-span-1 text-right">${item.coupon}</div>
                          <div className="col-span-1 flex justify-center">
                            <TrashIcon
                              className="text-gray-700 hover:text-gray-400 h-5 w-5"
                              onClick={() => {
                                state.current = 4;
                                deleteId.current = item.id;
                                setOpen(true);
                              }}
                            />
                          </div>
                          <div className="col-span-1 text-center">{item.creator.first_name}</div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
