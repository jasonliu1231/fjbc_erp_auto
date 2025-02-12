"use client";

import { useEffect, useState } from "react";
import Navbar from "../../navbar";
import Alert from "../../alert";
import { CheckCircleIcon, ExclamationCircleIcon, PrinterIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import { error } from "../../../utils";
import LogDialog from "../logdialog";

const payOptions = [
  { name: "現金", method: 1 },
  { name: "轉帳", method: 2 },
  { name: "信用卡", method: 3 },
  { name: "其他", method: 4 }
];

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [data, setData] = useState();
  const [checked, setChecked] = useState({
    subject_amount: false,
    meal: false,
    textbook: false,
    transportation: false,
    discount: false,
    deposit: false,
    coupon: false
  });
  const [mem, setMem] = useState(payOptions[0]);
  const [settingData, setSettingData] = useState({
    invoice_id: 0,
    handler_id: 0,
    payment_method: 1,
    payment_description: ""
  });
  const [login, setLogin] = useState(false);
  const [description, setDescription] = useState(false);
  const [description1, setDescription1] = useState(false);

  function checkItem() {
    if (!checked.subject_amount) {
      setInfo({ show: true, success: false, msg: "請確認學費是否正確！" });
      return;
    }
    if (!checked.meal) {
      setInfo({ show: true, success: false, msg: "請確認餐費是否正確！" });
      return;
    }
    if (!checked.textbook) {
      setInfo({ show: true, success: false, msg: "請確認教材費是否正確！" });
      return;
    }
    if (!checked.transportation) {
      setInfo({ show: true, success: false, msg: "請確認交通費是否正確！" });
      return;
    }
    if (!checked.discount) {
      setInfo({ show: true, success: false, msg: "請確認折扣是否正確！" });
      return;
    }
    if (!checked.deposit) {
      setInfo({ show: true, success: false, msg: "請確認訂金是否正確！" });
      return;
    }
    if (!checked.coupon) {
      setInfo({ show: true, success: false, msg: "請確認抵用券是否正確！" });
      return;
    }
    if (settingData.payment_method == 2 && settingData.payment_description == "") {
      setInfo({ show: true, success: false, msg: "非現金請輸入比對碼！" });
      return;
    }
    if (settingData.payment_method == 3 && (settingData.payment_description == "" || settingData.payment_description1 == "")) {
      setInfo({ show: true, success: false, msg: "非現金請輸入比對碼！" });
      return;
    }
    setLogin(true);
  }

  function dataTidy(data) {
    const date = new Date(data.deadline);
    let subjectAmount = 0;
    // 學費
    data.invoice_detail_list.forEach((item) => {
      subjectAmount += item.money;
    });
    const invoiceData = {
      // 補習班 id 用於替換圖章
      tutoring_id: data.tutoring.id,
      // 補習班名稱
      tutoring_name: data.tutoring.tutoring_name,
      // 學生中文名稱
      student_name: data.student.user.first_name,
      // 學生英文名稱
      student_english_name: data.student.nick_name,
      // 學生年級
      student_grade: data.student.grade?.grade_name || "",
      // 學年度
      schoolYear: data.school_year,
      // 繳費月份
      start_month: data.start_month,
      end_month: data.end_month,
      // 折扣金額
      discount: Number(data.discount) || 0,
      // 訂金
      deposit: Number(data.deposit) || 0,
      // 餐費
      meal: Number(data.meal) || 0,
      // 教材費
      textbook: Number(data.textbook) || 0,
      // 交通費
      transportation: Number(data.transportation) || 0,
      // 優惠券
      coupon: Number(data.coupon) || 0,
      // 繳費期限
      deadline: `${date.getFullYear() - 1911} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`,
      // 備註
      remark: data.remark,
      // 小計
      amount: subjectAmount + data.meal + data.textbook + data.transportation - data.deposit - data.discount - data.coupon,
      // 合併欄位數量
      len: data.invoice_detail_list.length,
      // 係項陣列
      subjects: data.invoice_detail_list,
      // 學費
      subject_amount: subjectAmount
    };
    setData(invoiceData);
  }

  async function LineAlert() {
    data.payment_method = settingData.payment_method;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`/api/linealert`, config);
    const res = await response.json();
    if (response.ok) {
      console.log(res.msg);
    }
  }

  async function updateInvoice() {
    if (data.amount < 0) {
      settingData.refund = true;
    } else {
      settingData.refund = false;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settingData)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/payment`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/payment/receipt?type=1&id=${settingData.invoice_id}`;
      LineAlert();
    } else {
      const msg = error(response.status, res);
      setSettingData({
        ...settingData,
        handler_id: 0
      });
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
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
    setSettingData({
      ...settingData,
      invoice_id: id
    });
    getInvoice(id);
  }, []);

  useEffect(() => {
    if (settingData.handler_id != 0) {
      updateInvoice();
    }
  }, [settingData.handler_id]);

  return (
    <>
      <LogDialog
        data={{
          login,
          setLogin,
          setInfo,
          submitData: settingData,
          setSubmitData: setSettingData
        }}
      />
      {/* <Navbar /> */}
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">繳費確認</h1>
        </div>
        <div className="mt-10 lg:mt-0">
          <div className="lg:flex mt-4 rounded-lg bg-white shadow-sm">
            <div className="lg:w-1/3 p-2 sm:p-12 grid grid-cols-1 gap-y-4 sm:border-r-2 border-b-2 divide-y divide-gray-200">
              <div className="sm:col-span-1">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  補習班：
                </label>
                <div className="mt-2 text-xl">{data?.tutoring_name}</div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  學年度：
                </label>
                <div className="mt-2 text-xl">{data?.schoolYear}</div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  月份：
                </label>
                <div className="mt-2 text-xl">
                  {data?.start_month}
                  {data?.start_month == data?.end_month || ` ~ ${data?.end_month}`} 月份
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  中文姓名：
                </label>
                <div className="mt-2 text-xl">{data?.student_name}</div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  英文姓名：
                </label>
                <div className="mt-2 text-xl">{data?.student_english_name}</div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  年級：
                </label>
                <div className="mt-2 text-xl">{data?.student_grade}</div>
              </div>
            </div>

            <div className="lg:w-1/2 p-2 sm:p-12 sm:border-r-2 border-b-2">
              <div className="sm:space-y-5 space-y-2">
                <div className="flex items-center">
                  <div className="w-1/4 flex h-6 items-center">
                    {checked.subject_amount ? <CheckCircleIcon className="w-10 text-green-400" /> : <ExclamationCircleIcon className="w-10 text-red-400" />}
                  </div>
                  <div className="w-1/4 ml-3 text-2xl leading-6">
                    <label className="font-medium text-gray-900 text-nowrap">學費：</label>
                  </div>
                  <div className="w-1/4 text-gray-500 text-2xl text-end">{data?.subject_amount}</div>
                  <div className="w-1/4 text-end">
                    <button
                      onClick={() => {
                        setChecked({
                          ...checked,
                          subject_amount: !checked.subject_amount
                        });
                      }}
                      className={checked.subject_amount ? "text-lg bg-red-200 py-1 px-2 ml-5 text-nowrap" : "text-lg bg-green-200 py-1 px-2 ml-5 text-nowrap"}
                    >
                      {checked.subject_amount ? "取消" : "正確"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/4 flex h-6 items-center">{checked.meal ? <CheckCircleIcon className="w-10 text-green-400" /> : <ExclamationCircleIcon className="w-10 text-red-400" />}</div>
                  <div className="w-1/4 ml-3 text-2xl leading-6 text-justify">
                    <label className="font-medium text-gray-900 text-nowrap">餐費：</label>
                  </div>
                  <div className="w-1/4 text-gray-500 text-2xl text-end">{data?.meal}</div>
                  <div className="w-1/4 text-end">
                    <button
                      onClick={() => {
                        setChecked({
                          ...checked,
                          meal: !checked.meal
                        });
                      }}
                      className={checked.meal ? "text-lg bg-red-200 py-1 px-2 ml-5 text-nowrap" : "text-lg bg-green-200 py-1 px-2 ml-5 text-nowrap"}
                    >
                      {checked.meal ? "取消" : "正確"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/4 flex h-6 items-center">{checked.textbook ? <CheckCircleIcon className="w-10 text-green-400" /> : <ExclamationCircleIcon className="w-10 text-red-400" />}</div>
                  <div className="w-1/4 ml-3 text-2xl leading-6">
                    <label className="font-medium text-gray-900 text-nowrap">教材費：</label>
                  </div>
                  <div className="w-1/4 text-gray-500 text-2xl text-end">{data?.textbook}</div>
                  <div className="w-1/4 text-end">
                    <button
                      onClick={() => {
                        setChecked({
                          ...checked,
                          textbook: !checked.textbook
                        });
                      }}
                      className={checked.textbook ? "text-lg bg-red-200 py-1 px-2 ml-5 text-nowrap" : "text-lg bg-green-200 py-1 px-2 ml-5 text-nowrap"}
                    >
                      {checked.textbook ? "取消" : "正確"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/4 flex h-6 items-center">
                    {checked.transportation ? <CheckCircleIcon className="w-10 text-green-400" /> : <ExclamationCircleIcon className="w-10 text-red-400" />}
                  </div>
                  <div className="w-1/4 ml-3 text-2xl leading-6">
                    <label className="font-medium text-gray-900 text-nowrap">交通費：</label>
                  </div>
                  <div className="w-1/4 text-gray-500 text-2xl text-end">{data?.transportation}</div>
                  <div className="w-1/4 text-end">
                    <button
                      onClick={() => {
                        setChecked({
                          ...checked,
                          transportation: !checked.transportation
                        });
                      }}
                      className={checked.transportation ? "text-lg bg-red-200 py-1 px-2 ml-5 text-nowrap" : "text-lg bg-green-200 py-1 px-2 ml-5 text-nowrap"}
                    >
                      {checked.transportation ? "取消" : "正確"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/4 flex h-6 items-center">{checked.deposit ? <CheckCircleIcon className="w-10 text-green-400" /> : <ExclamationCircleIcon className="w-10 text-red-400" />}</div>
                  <div className="w-1/4 ml-3 text-2xl leading-6">
                    <label className="font-medium text-gray-900 text-nowrap">訂金折抵：</label>
                  </div>
                  <div className="w-1/4 text-red-500 text-2xl text-end">{data?.deposit}</div>
                  <div className="w-1/4 text-end">
                    <button
                      onClick={() => {
                        setChecked({
                          ...checked,
                          deposit: !checked.deposit
                        });
                      }}
                      className={checked.deposit ? "text-lg bg-red-200 py-1 px-2 ml-5 text-nowrap" : "text-lg bg-green-200 py-1 px-2 ml-5 text-nowrap"}
                    >
                      {checked.deposit ? "取消" : "正確"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/4 flex h-6 items-center">{checked.coupon ? <CheckCircleIcon className="w-10 text-green-400" /> : <ExclamationCircleIcon className="w-10 text-red-400" />}</div>
                  <div className="w-1/4 ml-3 text-2xl leading-6">
                    <label className="font-medium text-gray-900 text-nowrap">抵用券：</label>
                  </div>
                  <div className="w-1/4 text-red-500 text-2xl text-end">{data?.coupon}</div>
                  <div className="w-1/4 text-end">
                    <button
                      onClick={() => {
                        setChecked({
                          ...checked,
                          coupon: !checked.coupon
                        });
                      }}
                      className={checked.coupon ? "text-lg bg-red-200 py-1 px-2 ml-5 text-nowrap" : "text-lg bg-green-200 py-1 px-2 ml-5 text-nowrap"}
                    >
                      {checked.coupon ? "取消" : "正確"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/4 flex h-6 items-center">{checked.discount ? <CheckCircleIcon className="w-10 text-green-400" /> : <ExclamationCircleIcon className="w-10 text-red-400" />}</div>
                  <div className="w-1/4 ml-3 text-2xl leading-6">
                    <label className="font-medium text-gray-900 text-nowrap">折扣：</label>
                  </div>
                  <div className="w-1/4 text-red-500 text-2xl text-end">{data?.discount}</div>
                  <div className="w-1/4 text-end">
                    {" "}
                    <button
                      onClick={() => {
                        setChecked({
                          ...checked,
                          discount: !checked.discount
                        });
                      }}
                      className={checked.discount ? "text-lg bg-red-200 py-1 px-2 ml-5 text-nowrap" : "text-lg bg-green-200 py-1 px-2 ml-5 text-nowrap"}
                    >
                      {checked.discount ? "取消" : "正確"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center border-t-2 p-4 justify-center">
                  <div className="flex h-6 items-center"></div>
                  <div className="ml-3 text-2xl leading-6">
                    <label className="font-medium text-gray-900">小計：</label>
                  </div>
                  <div className="text-gray-500 text-2xl text-end">{data?.amount}</div>
                </div>
              </div>
            </div>

            <div className="sm:flex justify-center p-2 sm:p-12 lg:inline w-60">
              <RadioGroup
                value={mem}
                onChange={setMem}
                className="mt-2 grid gap-3 grid-cols-2 sm:grid-cols-5 lg:grid-cols-1"
              >
                {payOptions.map((option) => (
                  <Radio
                    key={option.method}
                    value={option}
                    onClick={() => {
                      setSettingData({
                        ...settingData,
                        payment_method: option.method
                      });
                      if (option.method == 2) {
                        setDescription(true);
                        setDescription1(false);
                      } else if (option.method == 3) {
                        setDescription(true);
                        setDescription1(true);
                      } else {
                        setDescription(false);
                        setDescription1(false);
                      }
                    }}
                    className="text-sm cursor-pointer flex items-center justify-center rounded-md bg-white px-3 py-3 text-sm font-semibold uppercase text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 data-[checked]:bg-blue-600 data-[checked]:text-white data-[checked]:ring-0 data-[focus]:data-[checked]:ring-2 data-[focus]:ring-2 data-[focus]:ring-blue-600 data-[focus]:ring-offset-2 data-[checked]:hover:bg-blue-500 sm:flex-1 [&:not([data-focus],[data-checked])]:ring-inset"
                  >
                    {option.name}
                  </Radio>
                ))}
              </RadioGroup>
              <div className="mt-2">
                {(description || description1) && (
                  <input
                    value={settingData?.payment_description}
                    onChange={(event) => {
                      setSettingData({
                        ...settingData,
                        payment_description: event.target.value
                      });
                    }}
                    type="text"
                    placeholder="請輸入主比對碼"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                )}
                {description1 && (
                  <input
                    value={settingData?.payment_description1}
                    onChange={(event) => {
                      setSettingData({
                        ...settingData,
                        payment_description1: event.target.value
                      });
                    }}
                    type="text"
                    placeholder="請輸入次比對碼"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                )}
              </div>

              <div className="flex justify-center mt-3">
                <button
                  className="text-nowrap lg:mt-12 mx-4 flex h-12 rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  onClick={checkItem}
                >
                  <PrinterIcon className="w-6" />
                  列印
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
