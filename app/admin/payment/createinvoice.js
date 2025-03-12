"use client";

import { useEffect, useState } from "react";
import { TutoringSelect, SchoolYear, StartMonth, EndMonth, StudentSelect, SubjectSelect, UnitSelect } from "./select";
import { error } from "../../utils";
import Richtext from "./richtext";
import LogDialog from "./logdialog";

export default function Example({ setInfo }) {
  // 登入
  const [login, setLogin] = useState(false);
  const [createData, setCreateData] = useState({
    school_year: 0,
    start_month: 0,
    end_month: 0,
    discount: 0,
    meal: 0,
    textbook: 0,
    transportation: 0,
    deadline: "",
    remark: "",
    tutoring_id: 0,
    student_id: 0,
    creator_id: 0
  });
  const [invoice_detail_create_list, setInvoice_detail_create_list] = useState([
    {
      name: "",
      money: 0,
      count: 1,
      unit: 1
    }
  ]);
  const [depositList, setDepositList] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [coupon_id_list, setCoupon_id_list] = useState([]);
  const [deposit_id_list, setDeposit_id_list] = useState([]);
  const [depositAmount, setDepositAmount] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);
  const [amount, setAmount] = useState(0);

  function checkItem() {
    if (!Number.isInteger(createData.tutoring_id)) {
      setInfo({ show: true, success: false, msg: "請選擇補習班" });
      return;
    }
    if (!Number.isInteger(createData.student_id)) {
      setInfo({ show: true, success: false, msg: "請選擇學生" });
      return;
    }
    if (couponAmount > 0) {
      createData.remark = `<p>優惠券折抵${couponAmount}元</p>` + createData.remark;
    }
    if (depositAmount > 0) {
      createData.remark = `<p>訂金折抵${depositAmount}元</p>` + createData.remark;
    }
    createData.invoice_detail_create_list = invoice_detail_create_list.filter((i) => i.name && i.name != "");
    createData.coupon_id_list = coupon_id_list;
    createData.deposit_id_list = deposit_id_list;
    createData.deposit = depositAmount;
    createData.coupon = couponAmount;
    setLogin(true);
  }

  async function submit() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      window.open(`/admin/payment/invoice?id=${res.id}`, "_blank", "noopener,noreferrer");
      window.location.reload();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      setCreateData({
        ...createData,
        creator_id: 0
      });
    }
  }

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
      setDepositList(res.list.filter((item) => !item.invoice_id));
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
    let sum = 0;
    invoice_detail_create_list.forEach((item) => {
      sum += item.money;
    });
    sum += createData.textbook + createData.meal + createData.transportation - (createData.discount + depositAmount + couponAmount);
    setAmount(sum);
  }, [createData, depositAmount, couponAmount, invoice_detail_create_list]);

  useEffect(() => {
    if (createData.student_id && createData.student_id != 0 && createData.tutoring_id != 0) {
      getCouponList();
      getDepositList();
    }
  }, [createData.student_id, , createData.tutoring_id]);

  useEffect(() => {
    if (createData.creator_id != 0) {
      submit();
    }
  }, [createData.creator_id]);

  return (
    <>
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
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">新增繳費明細</h2>
        </div>
        <div className="mx-auto mt-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <TutoringSelect
                createData={createData}
                setCreateData={setCreateData}
              />
            </div>
            <div className="sm:col-span-1">
              <SchoolYear
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
            <div className="sm:col-span-1">
              <StartMonth
                createData={createData}
                setCreateData={setCreateData}
              />
            </div>
            <div className="sm:col-span-1">
              <EndMonth
                createData={createData}
                setCreateData={setCreateData}
              />
            </div>
          </div>

          <div className="sm:text-lg lg:text-xl py-2 mt-2 border-b-2 flex">
            <div>明細</div>
            <div className="ml-3">
              <button
                type="button"
                className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                onClick={() => {
                  setInvoice_detail_create_list([
                    ...invoice_detail_create_list,
                    {
                      name: "",
                      money: 0,
                      count: 1,
                      unit: 1
                    }
                  ]);
                }}
              >
                新增科目
              </button>
            </div>
          </div>
          {invoice_detail_create_list.length > 0 &&
            invoice_detail_create_list.map((invoice, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-6 mt-3 border-2 border-red-200 p-3"
                >
                  <div className="col-span-4">
                    <SubjectSelect
                      data={{
                        invoice_detail_create_list,
                        setInvoice_detail_create_list,
                        index,
                        tutoring_id: createData.tutoring_id
                      }}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">數量</label>
                    <div className="mt-2">
                      <input
                        type="number"
                        value={invoice.count}
                        onChange={(event) => {
                          const newArray = invoice_detail_create_list.map((sub, i) => {
                            if (i == index) {
                              return {
                                ...sub,
                                count: Number(event.target.value)
                              };
                            }
                            return sub;
                          });
                          setInvoice_detail_create_list(newArray);
                        }}
                        className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <UnitSelect
                      data={{
                        invoice_detail_create_list,
                        setInvoice_detail_create_list,
                        index
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">小計</label>
                    <div className="mt-2">
                      <input
                        type="number"
                        value={invoice.money}
                        onChange={(event) => {
                          const newArray = invoice_detail_create_list.map((sub, i) => {
                            if (i == index) {
                              return {
                                ...sub,
                                money: Number(event.target.value)
                              };
                            }
                            return sub;
                          });
                          setInvoice_detail_create_list(newArray);
                        }}
                        className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-1 flex justify-center items-center">
                    <button
                      type="submit"
                      onClick={() => {
                        const checked = confirm(`確定要刪除此項目嗎？`);
                        if (checked) {
                          setInvoice_detail_create_list(invoice_detail_create_list.filter((s, i) => i != index));
                        }
                      }}
                      className="rounded-md bg-red-600 px-2.5 py-1.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              );
            })}

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-4 mt-3">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">教材費</label>
              <div className="mt-2">
                <input
                  type="number"
                  min="0"
                  defaultValue={createData?.textbook}
                  onChange={(event) => {
                    setCreateData({
                      ...createData,
                      textbook: Number(event.target.value)
                    });
                  }}
                  className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">餐費</label>
              <div className="mt-2">
                <input
                  type="number"
                  min="0"
                  defaultValue={createData?.meal}
                  onChange={(event) => {
                    setCreateData({
                      ...createData,
                      meal: Number(event.target.value)
                    });
                  }}
                  className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">交通費</label>
              <div className="mt-2">
                <input
                  type="number"
                  min="0"
                  defaultValue={createData?.transportation}
                  onChange={(event) => {
                    setCreateData({
                      ...createData,
                      transportation: Number(event.target.value)
                    });
                  }}
                  className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">折扣費用</label>
              <div className="mt-2">
                <input
                  type="number"
                  min="0"
                  defaultValue={createData?.discount}
                  onChange={(event) => {
                    setCreateData({
                      ...createData,
                      discount: Number(event.target.value)
                    });
                  }}
                  className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mt-3">
            <div className="md:col-span-1 max-h-60 overflow-auto">
              <label className="block text-sm font-medium leading-6 text-gray-900">訂金折抵</label>
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
                          <div className="w-1/3">
                            <input
                              checked={deposit_id_list.includes(item.id)}
                              onChange={(event) => {
                                const checked = event.target.checked;
                                if (checked) {
                                  setDeposit_id_list([...coupon_id_list, item.id]);
                                  setDepositAmount(depositAmount + item.deposit);
                                } else {
                                  setDeposit_id_list(coupon_id_list.filter((i) => i != item.id));
                                  setDepositAmount(depositAmount - item.deposit);
                                }
                              }}
                              type="checkbox"
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="w-1/3 text-left">訂金</div>
                          <div className="w-1/3 text-right">${item.deposit}</div>
                          {/* <div className="w-1/4 text-right">{new Date(item.created_at).toLocaleDateString()}</div> */}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="md:col-span-1 max-h-60 overflow-auto">
              <label className="block text-sm font-medium leading-6 text-gray-900">勵學券折抵</label>
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
                        <div className="flex">
                          <div className="w-1/3">
                            <input
                              checked={coupon_id_list.includes(item.id)}
                              onChange={(event) => {
                                const checked = event.target.checked;
                                if (checked) {
                                  setCoupon_id_list([...coupon_id_list, item.id]);
                                  setCouponAmount(couponAmount + item.coupon);
                                } else {
                                  setCoupon_id_list(coupon_id_list.filter((i) => i != item.id));
                                  setCouponAmount(couponAmount - item.coupon);
                                }
                              }}
                              type="checkbox"
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="w-1/3">{item.coupon_name}</div>
                          <div className="w-1/3 text-right">${item.coupon}</div>
                          {/* <div className="w-1/4 text-right">{new Date(item.created_at).toLocaleDateString()}</div> */}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={`${amount < 0 ? "text-red-500" : ""} border-t text-right font-bold text-xl p-2`}>總計：{amount}</div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-4 mt-3">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">繳費期限</label>
              <div className="mt-2">
                <input
                  type="date"
                  value={createData.deadline}
                  onChange={(event) => {
                    setCreateData({
                      ...createData,
                      deadline: event.target.value
                    });
                  }}
                  className="pl-3 pr-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <Richtext createData={createData} />
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={checkItem}
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
