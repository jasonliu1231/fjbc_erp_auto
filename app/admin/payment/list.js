"use client";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { BellIcon, TrashIcon, DocumentCheckIcon, MagnifyingGlassIcon, EyeIcon, NoSymbolIcon, ArrowPathIcon, ArrowPathRoundedSquareIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";
import LogDialog from "./logdialog";

const today = new Date();
const ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(today.getDate() - 45);

export default function Example({ setInfo }) {
  const [payState, setPayState] = useState(1);
  const [tutoring, setTutoring] = useState(0);
  const [items, setItems] = useState([]);
  const [deposit, setDeposit] = useState([]);
  const [query, setQuery] = useState("");
  const [createData, setCreateData] = useState({
    reason: "",
    handler_id: 0
  });
  const [open, setOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refund, setRefund] = useState({
    deposit_id: 0,
    refund_deposit: 0,
    refund_reason: ""
  });
  const [login, setLogin] = useState(false);
  const [date, setDate] = useState({
    start_date: ninetyDaysAgo.toISOString().split("T")[0],
    end_date: today.toISOString().split("T")[0]
  });
  const deleteId = useRef(0);

  let filteredItems = payState == 3 ? items.filter((i) => i.reason) : payState == 2 ? items.filter((i) => i.handler && !i.reason) : items.filter((i) => !i.handler && !i.reason);

  filteredItems =
    query === ""
      ? filteredItems
      : filteredItems.filter((item) => {
          const name = item.student.user.first_name;
          return name.toLowerCase().includes(query.toLowerCase());
        });

  filteredItems = tutoring === 0 ? filteredItems : filteredItems.filter((item) => item.tutoring.id == tutoring);

  const filteredDeposit =
    query === ""
      ? deposit
      : deposit.filter((item) => {
          const name = item.student.user.first_name;
          return name.toLowerCase().includes(query.toLowerCase());
        });

  async function getDeposit() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/deposit/list`, config);
    const res = await response.json();
    if (response.ok) {
      setDeposit(res.list);
      setPayState(4);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function createRefund() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(refund)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/deposit/refund`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      getDeposit();
      setRefundOpen(false);
    } else {
      alert(res.msg);
    }
  }

  async function getList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/list?start_date=${date.start_date}&end_date=${date.end_date}`, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function deleteItem() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/${deleteId.current}/update`;
    const response = await fetch(url, config);
    const res = await response.json();
    setCreateData({
      ...createData,
      creator_id: 0
    });
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
      subject_amount: subjectAmount,
      payment_method: data.payment_method,
      other: "補發"
    };
    return invoiceData;
  }

  async function notification(invoice_id, isFirst) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/notification?invoice_id=${invoice_id}&first=${isFirst}`;
    const response = await fetch(url, config);
    if (response.ok) {
      alert("發送完成！");
    } else {
      alert("發送失敗！");
    }
  }

  useEffect(() => {
    if (createData.creator_id && createData.creator_id != 0) {
      deleteItem();
    }
  }, [createData.creator_id]);

  useEffect(() => {
    getList();
  }, [date]);

  useEffect(() => {
    getList();
  }, []);
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
                      className="my-1 p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
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
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 退款原因 */}
      <Dialog
        open={refundOpen}
        onClose={setRefundOpen}
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
                <div className="mt-3 sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-center leading-6 text-gray-900"
                  >
                    退款
                  </DialogTitle>
                  <div className="mt-2">
                    <label className="text-left font-semibold">金額</label>
                    <input
                      onChange={(event) => {
                        setRefund({
                          ...refund,
                          refund_deposit: event.target.value
                        });
                      }}
                      value={refund.refund_deposit}
                      type="number"
                      className="my-1 p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-left font-semibold">原因</label>
                    <input
                      onChange={(event) => {
                        setRefund({
                          ...refund,
                          refund_reason: event.target.value
                        });
                      }}
                      value={refund.refund_reason}
                      type="text"
                      className="my-1 p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={createRefund}
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
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
      <span className="isolate inline-flex mb-2">
        <span className="isolate inline-flex">
          <button
            onClick={() => {
              setPayState(1);
            }}
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            未繳費
          </button>
          <button
            onClick={() => {
              setPayState(2);
            }}
            type="button"
            className="relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            已繳費
          </button>
          <button
            onClick={() => {
              setPayState(3);
            }}
            type="button"
            className="relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10"
          >
            註銷
          </button>
          <button
            onClick={() => {
              getDeposit();
            }}
            type="button"
            className="relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10"
          >
            訂金
          </button>
        </span>

        <div className="relative ml-4 rounded-md shadow-sm">
          <input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            type="text"
            placeholder="學生姓名"
            className="p-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </div>
        </div>
        <div className="relative ml-4 rounded-md shadow-sm flex">
          <input
            onChange={(event) => {
              setDate({ ...date, start_date: event.target.value });
            }}
            value={date.start_date}
            type="date"
            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          />
          <input
            onChange={(event) => {
              setDate({ ...date, end_date: event.target.value });
            }}
            value={date.end_date}
            type="date"
            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          />
        </div>

        <span className="isolate inline-flex ml-4">
          <button
            onClick={() => {
              setTutoring(0);
            }}
            type="button"
            className={`${tutoring == 0 ? "bg-red-100" : "bg-white"} relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
          >
            全部
          </button>
          <button
            onClick={() => {
              setTutoring(1);
            }}
            type="button"
            className={`${tutoring == 1 ? "bg-red-100" : "bg-white"} relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
          >
            多易
          </button>
          <button
            onClick={() => {
              setTutoring(2);
            }}
            type="button"
            className={`${tutoring == 2 ? "bg-red-100" : "bg-white"} relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
          >
            艾思
          </button>
          <button
            onClick={() => {
              setTutoring(3);
            }}
            type="button"
            className={`${tutoring == 3 ? "bg-red-100" : "bg-white"} relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
          >
            華爾敦
          </button>
        </span>
      </span>

      {payState == 4 ? (
        <table className="min-w-full divide-y divide-gray-300 bg-white">
          <thead>
            <tr>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                單位
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                學生姓名
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                金額
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                狀態
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                原因
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                備註
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                建立時間
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                建立人
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                退款
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white h-80vh overflow-auto">
            {filteredDeposit.map((item, index) => {
              let state = "";
              let rejectMsg = "";
              let type = "";

              if (item.deposit_state == "12") {
                state = "已拒絕";
                rejectMsg = item.approved_reject;
                type = "bg-red-50 text-red-700 ring-red-600/50";
              } else if (item.deposit_state == "13") {
                state = "已註銷";
                rejectMsg = item.reason;
                type = "bg-pink-50 text-pink-700 ring-pink-600/50";
              } else if (item.deposit_state == "11") {
                state = "已審核";
                type = "bg-green-50 text-green-700 ring-green-600/50";
              } else if (item.deposit_state == "10") {
                state = "未審核";
                type = "bg-yellow-50 text-yellow-700 ring-yellow-600/50";
              } else if (item.deposit_state == "20") {
                state = "退款未審核";
                rejectMsg = item.refund_reason;
                type = "bg-yellow-50 text-yellow-700 ring-yellow-600/50";
              } else if (item.deposit_state == "21") {
                state = "退款已審核";
                type = "bg-green-50 text-green-700 ring-green-600/50";
              } else if (item.deposit_state == "22") {
                state = "退款已拒絕";
                rejectMsg = item.refund_reject;
                type = "bg-red-50 text-red-700 ring-red-600/50";
              }

              return (
                <tr
                  key={index}
                  className={`${item.deposit_state == "11" || item.deposit_state == "10" ? "" : "bg-gray-300"} hover:bg-sky-200`}
                >
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.tutoring.short_name}</td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.student.user.first_name}</td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.deposit}</td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <span className={`${type} inline-flex items-center rounded-full p-2 text-xs font-medium ring-1 ring-inset`}>{state}</span>
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">{rejectMsg}</td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.remark }}
                      className="prose text-xs"
                    />
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.creator.first_name}</td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    {item.deposit_state == "11" && (
                      <button
                        onClick={() => {
                          setRefund({
                            ...refund,
                            deposit_id: item.id
                          });
                          setRefundOpen(true);
                        }}
                        type="button"
                        className={`bg-red-600 px-2 py-1 rounded-md inline-flex items-center text-white hover:bg-red-400`}
                      >
                        退款
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <table className="min-w-full divide-y divide-gray-300 bg-white">
          <thead>
            <tr>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                學生姓名
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                繳費期限
              </th>
              {payState == 2 ? (
                <th
                  scope="col"
                  className="p-2 text-left text-sm font-semibold text-gray-900"
                >
                  繳費日期
                </th>
              ) : (
                <th
                  scope="col"
                  className="p-2 text-left text-sm font-semibold text-gray-900"
                >
                  開立日期
                </th>
              )}

              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900 text-center"
              >
                金額
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                狀態
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                註銷
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                列印收據
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                補印明細
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                補印收據
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                補發提醒
              </th>
              <th
                scope="col"
                className="p-2 text-left text-sm font-semibold text-gray-900"
              >
                退款
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white h-80vh overflow-auto">
            {filteredItems.map((item, index) => {
              const today = new Date();
              const delate = new Date(item.deadline) < today;
              return (
                <tr
                  key={index}
                  className={`${!item.reason && !item.handler && delate ? "bg-red-100" : ""} ${
                    item.handler && item.checkmoney ? "bg-green-50" : item.handler && item.reject ? "bg-red-50" : ""
                  } hover:bg-sky-200`}
                >
                  <td className="whitespace-nowrap text-sm p-2 relative">
                    {item.refund_state && (
                      <div className="absolute top-0 left-0 border border-red-600 w-5 h-5 flex justify-center items-center rounded-full bg-red-100">
                        <span className="font-semibold text-red-600">退</span>
                      </div>
                    )}
                    <div className="font-medium text-gray-900">{item.student.user.first_name}</div>
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <div className="text-gray-900">{item.deadline}</div>
                  </td>
                  {!item.charge_date ? (
                    <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                      <div className="text-gray-900">{new Date(item.created_at).toLocaleDateString()}</div>
                    </td>
                  ) : (
                    <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                      <div className="text-gray-900">{item.charge_date}</div>
                    </td>
                  )}

                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <div className={`${dataTidy(item).amount > 0 ? "text-gray-900" : "text-red-500"} text-right pr-5`}>{dataTidy(item).amount}</div>
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    {item.reason ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 p-2 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">已註銷</span>
                    ) : item.handler ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 p-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">已繳費</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 p-2 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">未繳費</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    {item.reason || item.handler ? (
                      ""
                    ) : (
                      <div
                        className={`${item.handler ? "opacity-15 cursor-not-allowed" : "cursor-pointer"} flex hover:text-blue-600`}
                        onClick={() => {
                          if (!item.handler) {
                            deleteId.current = item.id;
                            setOpen(true);
                          }
                        }}
                      >
                        <TrashIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-red-400"
                        />
                        註銷
                      </div>
                    )}
                    {item.reject && item.handler ? <div className={`text-gray-700`}>{item.reject}</div> : null}
                    {item.reason ? <div className={``}>{item.reason}</div> : null}
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    {item.reason || item.handler ? (
                      <div
                        className="cursor-pointer flex hover:text-blue-600"
                        onClick={() => {
                          window.location.href = `/admin/payment/view?id=${item.id}`;
                        }}
                      >
                        <EyeIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-blue-400"
                        />
                        查詢
                      </div>
                    ) : (
                      <div
                        className={`${item.handler ? "opacity-15 cursor-not-allowed" : "cursor-pointer"} flex hover:text-blue-600`}
                        onClick={() => {
                          if (!item.handler) {
                            window.location.href = `/admin/payment/checked?id=${item.id}`;
                          }
                        }}
                      >
                        <DocumentCheckIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-green-400"
                        />
                        列印
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <div
                      className={`cursor-pointer flex hover:text-blue-600`}
                      onClick={() => {
                        window.location.href = `/admin/payment/invoice?id=${item.id}`;
                      }}
                    >
                      <ArrowPathIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-green-400"
                      />
                      明細
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <div
                      className={`${!item.handler ? "opacity-15 cursor-not-allowed" : "cursor-pointer"} flex hover:text-blue-600`}
                      onClick={() => {
                        if (item.handler) {
                          window.location.href = `/admin/payment/receipt?type=1&id=${item.id}`;
                        }
                      }}
                    >
                      <ArrowPathRoundedSquareIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-green-400"
                      />
                      收據
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <div
                      className={`${!item.handler ? "opacity-15 cursor-not-allowed" : "cursor-pointer"} flex hover:text-purple-600`}
                      onClick={() => {
                        if (item.handler) {
                          notification(item.id, false);
                        }
                      }}
                    >
                      <BellIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-purple-400"
                      />
                      發送
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                    <div
                      className={`${!item.handler ? "opacity-15 cursor-not-allowed" : "cursor-pointer"} flex hover:text-purple-600`}
                      onClick={() => {
                        if (item.handler) {
                          window.location.href = "/admin/payment/refund?id=" + item.id;
                        }
                      }}
                    >
                      <NoSymbolIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-red-600"
                      />
                      退款
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
