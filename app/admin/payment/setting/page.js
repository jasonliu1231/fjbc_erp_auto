"use client";

import { useEffect, useState } from "react";
import Navbar from "../../navbar";
import Alert from "../../alert";
import { error } from "../../../utils";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [data, setData] = useState({
    discount: 0,
    meal: 0,
    textbook: 0,
    transportation: 0,
    deadline: "",
    remark: "",
    reason: "",
    tutoring: {
      tutoring_name: ""
    },
    student: {
      id: 0,
      user: {
        first_name: "",
        last_name: "",
        nick_name: ""
      },
      grade: {
        grade_name: ""
      }
    }
  });
  const [invoice_detail_list, setInvoice_detail_list] = useState([{}, {}]);
  const [login, setLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

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
      // invoiceSubmit(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "取得使用者失敗" + msg
      });
    }
    return;
  }

  function dataTidy(data) {
    // 補習班名稱
    const tutoring_name = data.tutoring.tutoring_name;
    // 學生中文名稱
    const student_name = data.student.user.first_name;
    // 學生英文名稱
    const student_english_name = data.student.nick_name;
    // 學生年級
    const student_grade = data.student.grade?.grade_name || "";
    // 學年度
    const schoolYear = data.school_year;
    // 繳費月份
    const schoolMonth = data.school_month;
    // 折扣金額
    const discount = Number(data.discount) || 0;
    // 訂金
    const deposit = Number(data.deposit) || 0;
    // 餐費
    const meal = Number(data.meal) || 0;
    // 教材費
    const textbook = Number(data.textbook) || 0;
    // 交通費
    const transportation = Number(data.transportation) || 0;
    // 繳費期限
    const deadline = data.deadline;
    // 備註
    const remark = data.remark;

    // 課程
    setInvoice_detail_list([...data.invoice_detail_list, ...invoice_detail_list]);

    // 學費
    const subject_amount =
      data.invoice_detail_list.reduce((total, subject) => {
        return total + Number(subject.money);
      }, 0) || 0;
    // 小計
    const amount = subject_amount + meal + textbook + transportation + deposit - discount;

    setData({
      ...data,
      tutoring_name,
      student_name,
      student_english_name,
      student_grade,
      schoolYear,
      schoolMonth,
      discount,
      meal,
      textbook,
      transportation,
      deadline,
      remark,
      subject_amount,
      amount,
      deposit
    });
  }

  async function invoiceSubmit(id) {
    data.invoice_detail_list = invoice_detail_list.filter((obj) => Object.keys(obj).length > 0 && obj.name != "");
    data.charge_id = id;

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(submitData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/${submitData.tutoringid}/student/${submitData.studentid}/invoice`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/payment/invoice?id=${res.id}`;
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function invoiceSubmit(id) {
    data.invoice_detail_list = invoice_detail_list.filter((obj) => Object.keys(obj).length > 0 && obj.name != "");
    localStorage.setItem("invoice", JSON.stringify(data));
    window.location.href = "/admin/payment";
  }

  async function getInvoice(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      dataTidy(res);
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
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    getInvoice(id);
  }, []);

  return (
    <>
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
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    使用者確認
                  </DialogTitle>
                  <div>
                    <label
                      htmlFor="email"
                      className="sr-only"
                    >
                      帳號
                    </label>
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
                      className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <label
                      htmlFor="email"
                      className="sr-only"
                    >
                      密碼
                    </label>
                    <input
                      onChange={(event) => {
                        setLoginData({
                          ...loginData,
                          password: event.target.value
                        });
                      }}
                      value={loginData?.password}
                      type="text"
                      placeholder="密碼"
                      className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
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
      {/* <Navbar /> */}
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">繳費修改</h1>
        </div>
        <div className="space-y-12 bg-white py-2 px-5">
          <div className="pb-8 px-4 sm:px-12 border-b-2 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                補習班：
              </label>
              <div className="mt-2 text-xl">{data?.tutoring_name}</div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                學年度：
              </label>
              <div className="mt-2 text-xl">{data?.schoolYear}</div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                月份：
              </label>
              <div className="mt-2 text-xl">{data?.schoolMonth}</div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                中文姓名：
              </label>
              <div className="mt-2 text-xl">{data?.student_name}</div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                英文姓名：
              </label>
              <div className="mt-2 text-xl">{data?.student_english_name}</div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                年級：
              </label>
              <div className="mt-2 text-xl">{data?.student_grade}</div>
            </div>
          </div>

          <div className="border-b-2 pb-4 m-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
            {invoice_detail_list.map((item, index) => {
              return (
                <div
                  key={index}
                  className="col-span-1 sm:col-span-2 flex"
                >
                  <div className="sm:w-1/2">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      科目
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(event) => {
                          const val = event.target.value;
                          setInvoice_detail_list(
                            invoice_detail_list.map((s, i) => {
                              if (i === index) {
                                return {
                                  ...s,
                                  name: val
                                };
                              }
                              return s; // 確保返回未修改的元素
                            })
                          );
                        }}
                        value={item.name || ""}
                        type="text"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:w-1/2">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      金額
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(event) => {
                          const val = event.target.value;
                          setInvoice_detail_list(
                            invoice_detail_list.map((s, i) => {
                              if (i === index) {
                                return {
                                  ...s,
                                  money: val
                                };
                              }
                              return s; // 確保返回未修改的元素
                            })
                          );
                        }}
                        value={item.money || ""}
                        type="number"
                        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-b-2 pb-4 m-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                教材費
              </label>
              <div className="mt-2">
                <input
                  onChange={(event) => {
                    const val = event.target.value;
                    setData({
                      ...data,
                      textbook: val
                    });
                  }}
                  value={data?.textbook}
                  type="number"
                  className=" p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                餐費
              </label>
              <div className="mt-2">
                <input
                  onChange={(event) => {
                    const val = event.target.value;
                    setData({
                      ...data,
                      meal: val
                    });
                  }}
                  value={data?.meal}
                  type="number"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                交通費
              </label>
              <div className="mt-2">
                <input
                  onChange={(event) => {
                    const val = event.target.value;
                    setData({
                      ...data,
                      transportation: val
                    });
                  }}
                  value={data?.transportation}
                  type="text"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                折扣費用
              </label>
              <div className="mt-2">
                <input
                  onChange={(event) => {
                    const val = event.target.value;
                    setData({
                      ...data,
                      discount: val
                    });
                  }}
                  value={data?.discount}
                  type="text"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          {/* <div className="mx-12 gap-x-8 gap-y-6 grid grid-cols-2">
            <div className="sm:col-span-1 hidden sm:flex"></div>
            <div className="sm:col-span-1 col-span-2 border-b-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                <div className="flex justify-between">
                  <div>小計：</div>
                  <div className="text-xl">{amount}</div>
                </div>
              </label>
            </div>
          </div> */}

          <div className="mx-12 grid grid-cols-4 gap-x-8 gap-y-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">繳費期限</label>
              <div className="mt-2">
                <input
                  type="date"
                  onChange={(event) => {
                    setData({
                      ...data,
                      deadline: event.target.value
                    });
                  }}
                  defaultValue={data?.deadline}
                  className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">備註欄位</label>
              <div className="mt-2">
                <textarea
                  rows={4}
                  className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={data?.remark}
                  onChange={(event) => {
                    setData({
                      ...data,
                      remark: event.target.value
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 px-12">
            <label className="block text-sm font-medium leading-6 text-gray-900">修改原因</label>
            <div className="mt-2">
              <input
                onChange={(event) => {
                  const val = event.target.value;
                  setData({
                    ...data,
                    reason: val
                  });
                }}
                value={data?.reason || ""}
                type="text"
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              onClick={() => {
                setLogin(true);
              }}
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              修改
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
