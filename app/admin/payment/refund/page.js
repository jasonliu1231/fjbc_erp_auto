"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Alert from "../../alert";
import { error } from "../../../utils";

const def_create = {
  tutoring_student_invoice_id: 0,
  meal_refund: 0,
  textbook_refund: 0,
  transportation_refund: 0,
  start_month: 0,
  end_month: 0,
  refund_payment_method: 0,
  refund_reason: ""
};

export default function Example() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState({});
  const [create, setCreate] = useState(def_create);
  const [detail, setDetail] = useState([]);

  async function submit() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tutoring_student_invoice_id: create.tutoring_student_invoice_id,
        meal_refund: Number(create.meal_refund),
        textbook_refund: Number(create.textbook_refund),
        transportation_refund: Number(create.transportation_refund),
        tutoring_student_invoice_detail_list: detail
          .filter((item) => item.course_refund_money != 0)
          .map((item) => {
            return {
              tutoring_student_invoice_detail_id: item.tutoring_student_invoice_detail_id,
              course_name: item.course_name,
              course_count: Number(item.course_count),
              course_unit: item.course_unit,
              course_refund_money: Number(item.course_refund_money),
              course_refund_reason: item.course_refund_reason
            };
          }),
        start_month: create.start_month,
        end_month: create.end_month,
        refund_payment_method: create.refund_payment_method,
        refund_reason: create.refund_reason
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/refund`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "退款申請完成"
      });
      window.location.href = "/admin/payment";
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getInvoice(invoice_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/${invoice_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setInvoice(res);
      setCreate({
        ...create,
        tutoring_student_invoice_id: res.id
      });
      setDetail(
        res.invoice_detail_list.map((item) => {
          return {
            tutoring_student_invoice_detail_id: item.id,
            course_name: item.name,
            course_count: 0,
            course_unit: 0,
            course_refund_money: 0,
            course_refund_reason: ""
          };
        })
      );
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
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");

    getInvoice(id);

    setCreate({
      ...create,
      tutoring_student_invoice_id: id
    });
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
      <div className="container mx-auto">
        <div className="my-4">
          <h2 className="text-xl font-bold text-gray-900">退費</h2>
        </div>
        <div className="bg-white p-4 rounded-md">
          {/* 基本資料 */}
          <div className="grid grid-cols-5 gap-3 mb-8">
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">學生</label>
              <div className="mt-2 text-blue-600">{invoice.student?.user.first_name}</div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">繳費日期</label>
              <div className="mt-2 text-blue-600">{invoice.charge_date}</div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">繳費學期</label>
              <div className="mt-2 text-blue-600">{invoice.school_year}</div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">繳費月份</label>
              <div className="mt-2 text-blue-600">
                {invoice.start_month} ~ {invoice.end_month}
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">繳費方式</label>
              <div className="mt-2 text-blue-600">{invoice.payment_method == 1 ? "現金" : invoice.payment_method == 2 ? "轉帳" : invoice.payment_method == 3 ? "信用卡" : "其他"}</div>
            </div>
          </div>
          {/* 退費資料 */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">起始月份</label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={create.start_month}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      start_month: e.target.value
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value={0}>選擇月份</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    return (
                      <option
                        key={index + 1}
                        value={index + 1}
                      >
                        {index + 1} 月
                      </option>
                    );
                  })}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">結束月份</label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={create.end_month}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      end_month: e.target.value
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value={0}>選擇月份</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    return (
                      <option
                        key={index + 1}
                        value={index + 1}
                      >
                        {index + 1} 月
                      </option>
                    );
                  })}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">退費方式</label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={create.refund_payment_method}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      refund_payment_method: e.target.value
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value={0}>選擇退費方式</option>
                  <option value={1}>現金</option>
                  <option value={2}>轉帳</option>
                  <option value={3}>信用卡</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div className="col-span-1 row-span-2">
              <label className="block text-sm/6 font-medium text-gray-900">備註</label>
              <textarea
                value={create.refund_reason}
                onChange={(e) => {
                  setCreate({
                    ...create,
                    refund_reason: e.target.value
                  });
                }}
                rows={5}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">
                餐費
                <span className="ml-4 text-red-500">原餐費：{invoice.meal}</span>
              </label>
              <div className="mt-2">
                <input
                  value={create.meal_refund}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      meal_refund: e.target.value
                    });
                  }}
                  type="number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">
                教材費<span className="ml-4 text-red-500">原教材費：{invoice.textbook}</span>
              </label>
              <div className="mt-2">
                <input
                  value={create.textbook_refund}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      textbook_refund: e.target.value
                    });
                  }}
                  type="number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">
                交通費<span className="ml-4 text-red-500">原交通費：{invoice.transportation}</span>
              </label>
              <div className="mt-2">
                <input
                  value={create.transportation_refund}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      transportation_refund: e.target.value
                    });
                  }}
                  type="number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          {/* 退費資料 */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            {detail.map((item, index) => {
              const unit = invoice.invoice_detail_list[index]?.unit;
              let str = "";
              if (unit == 1) {
                str = "堂";
              } else if (unit == 2) {
                str = "周";
              } else if (unit == 3) {
                str = "月";
              } else if (unit == 4) {
                str = "季";
              } else if (unit == 5) {
                str = "學期";
              }
              return (
                <div
                  key={index}
                  className="ring p-2 rounded-md flex justify-around items-center"
                >
                  <span className="text-blue-600">{item.course_name}</span>
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      數量<span className="ml-2 text-red-500">原數量：{invoice.invoice_detail_list[index]?.count}</span>
                    </label>
                    <input
                      value={item.course_count}
                      onChange={(e) => {
                        setDetail(
                          detail.map((i, idx) => {
                            if (index == idx) {
                              return {
                                ...i,
                                course_count: e.target.value
                              };
                            } else {
                              return i;
                            }
                          })
                        );
                      }}
                      type="number"
                      className="block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      單位<span className="ml-2 text-red-500">原單位：{str}</span>
                    </label>
                    <div className="grid grid-cols-1">
                      <select
                        value={create.course_unit}
                        onChange={(e) => {
                          setDetail(
                            detail.map((i, idx) => {
                              if (index == idx) {
                                return {
                                  ...i,
                                  course_unit: e.target.value
                                };
                              } else {
                                return i;
                              }
                            })
                          );
                        }}
                        className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option value={0}>選擇單位</option>
                        <option value={1}>堂</option>
                        <option value={2}>周</option>
                        <option value={3}>月</option>
                        <option value={4}>季</option>
                        <option value={5}>學期</option>
                      </select>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      學費<span className="ml-2 text-red-500">原學費：{invoice.invoice_detail_list[index]?.money}</span>
                    </label>
                    <input
                      value={item.course_refund_money}
                      onChange={(e) => {
                        setDetail(
                          detail.map((i, idx) => {
                            if (index == idx) {
                              return {
                                ...i,
                                course_refund_money: e.target.value
                              };
                            } else {
                              return i;
                            }
                          })
                        );
                      }}
                      type="number"
                      className="block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">備註</label>
                    <input
                      value={item.course_refund_reason}
                      onChange={(e) => {
                        setDetail(
                          detail.map((i, idx) => {
                            if (index == idx) {
                              return {
                                ...i,
                                course_refund_reason: e.target.value
                              };
                            } else {
                              return i;
                            }
                          })
                        );
                      }}
                      type="text"
                      className="block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <button
              onClick={submit}
              type="submit"
              className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
