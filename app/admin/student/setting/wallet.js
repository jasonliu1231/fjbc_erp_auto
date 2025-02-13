"use client";

import { useEffect, useRef, useState } from "react";
import { error } from "../../../utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Home({ student_id, setInfo }) {
  const [couponList, setCouponList] = useState([]);
  const [depositList, setDepositList] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [point, setPoint] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);
  const [offset, setOffset] = useState(0);
  const [prizeOffset, setPrizeOffset] = useState(0);
  const [invoiceOffset, setInvoiceOffset] = useState(0);
  const [createPointReason, setCreatePointReason] = useState("");
  const [state, setState] = useState(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [prizeList, setPrizeList] = useState([]);
  const [prizeLogList, setPrizeLogList] = useState([]);
  const [selectPrizeList, setSelectPrizeList] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);

  async function getTicket() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const coupon = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/coupon/list?student_id=${student_id}`, config);
    const deposit = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/deposit/list?deposit_state=11&student_id=${student_id}`, config);

    Promise.all([coupon, deposit]).then(async ([response1, response2]) => {
      const result1 = await response1.json();
      const result2 = await response2.json();

      if (response1.ok) {
        setCouponList(result1.list);
      } else {
        const msg = error(response1.status, res1);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      if (response2.ok) {
        setDepositList(result2.list);
      } else {
        const msg = error(response2.status, res2);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    });
    setLoading(false);
  }

  async function createPoint() {
    let type = false;
    if (point == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "0 點不可以記錄！"
      });
      return;
    } else if (point < 0) {
      type = false;
    } else if (point > 0) {
      type = true;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        student_id: student_id,
        type: type,
        point: point > 0 ? point : -point,
        reason: createPointReason == "" ? null : createPointReason
      })
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point`, config);
    const res = await response.json();
    if (response.ok) {
      getPointLog();
      getPointTotal();
      setOffset(0);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function createPrize(item) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point`, config);
    const res = await response.json();
    if (response.ok) {
      getPointTotal();
      setOffset(0);
      setPrizeOffset(0);
      getPointLog();
      getPrizeLog();
      setSelectPrizeList([]);
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

  async function deletePointLog(point_id) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point?point_id=${point_id}`, config);
    const res = await response.json();
    if (response.ok) {
      getPointTotal();
      setOffset(0);
      setPrizeOffset(0);
      getPointLog();
      getPrizeLog();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPointTotal() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point/total?student_id=${student_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setTotalPoint(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPointLog() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point/log?student_id=${student_id}&offset=${offset}`, config);
    const res = await response.json();
    if (response.ok) {
      setPointList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPrizeLog() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/prize/log?student_id=${student_id}&offset=${prizeOffset}`, config);
    const res = await response.json();
    if (response.ok) {
      setPrizeLogList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPrize() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/prize/list?enable=true`, config);
    const res = await response.json();
    if (response.ok) {
      setPrizeList(res);
      setOpen(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getInvoice() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/invoice/log?student_id=${student_id}&offset=${invoiceOffset}`, config);
    const res = await response.json();
    if (response.ok) {
      setInvoiceList(res);
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
    getPointLog();
  }, [offset]);

  useEffect(() => {
    getPrizeLog();
  }, [prizeOffset]);

  useEffect(() => {
    getInvoice();
  }, [invoiceOffset]);

  useEffect(() => {
    if (student_id != 0) {
      getTicket();
      getPointTotal();
    }
  }, [student_id]);

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
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-4 gap-2 min-h-96">
                <div
                  className="col-span-3 grid grid-cols-3 gap-1 p-4"
                  style={{ alignSelf: "start" }}
                >
                  <div className="col-span-full">獎品選擇</div>
                  {prizeList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectPrizeList([
                          ...selectPrizeList,
                          {
                            student_id: student_id,
                            type: false,
                            name: item.name,
                            point: item.point,
                            prize_id: item.id,
                            reason: "兌換獎品"
                          }
                        ]);
                      }}
                      className="col-span-1 border-2 rounded-md px-2 py-1 flex justify-between cursor-pointer hover:bg-pink-50"
                    >
                      <div>{item.name}</div>
                      <div>{item.point}</div>
                    </div>
                  ))}
                </div>
                <div
                  className="col-span-1 grid grid-cols-1 gap-1 p-4"
                  style={{ alignSelf: "start" }}
                >
                  <div className="col-span-full text-blue-400">選擇列表</div>
                  {selectPrizeList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectPrizeList(selectPrizeList.filter((item, ii) => ii != index));
                      }}
                      className="col-span-1 border-2 rounded-md px-2 py-1 flex justify-between cursor-pointer hover:bg-pink-50"
                    >
                      <div>{item.name}</div>
                      <div>{item.point}</div>
                    </div>
                  ))}
                  <div className="col-span-full flex justify-around border-t-2 border-red-200">
                    <div>總計：</div>
                    <div className="text-red-400 font-bold">{selectPrizeList.reduce((sun, item) => sun + item.point, 0)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-2 px-3 py-2 text-sm font-semibold text-red-300 ring-2 ring-pink-300 hover:bg-red-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selectPrizeList.forEach((item) => {
                      createPrize(item);
                    });
                  }}
                  className="mx-2 bg-green-600 px-3 py-2 text-sm font-semibold text-white ring-2 ring-green-300 hover:bg-green-500"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="px-4 py-6">
                <div className="text-xl border-b-2">點數</div>

                <div className="mt-2">
                  <label className="block text-sm/6 font-medium text-gray-900">點數加減</label>
                  <div>
                    <input
                      value={point}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        setPoint(p);
                      }}
                      type="number"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm/6 font-medium text-gray-900">原因</label>
                  <div>
                    <input
                      value={createPointReason}
                      onChange={(e) => {
                        setCreatePointReason(e.target.value);
                      }}
                      type="text"
                      placeholder="如果是扣點請寫原因"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => setPoint(point - 1)}
                      type="button"
                      className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      - 1
                    </button>
                    <button
                      onClick={() => setPoint(0)}
                      type="button"
                      className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      歸零
                    </button>
                    <button
                      onClick={() => setPoint(point + 1)}
                      type="button"
                      className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      + 1
                    </button>
                  </span>
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                      onClick={createPoint}
                      type="button"
                      className="relative -ml-px inline-flex items-center rounded-md  bg-white px-3 py-2 text-sm font-semibold text-green-900 ring-1 ring-inset ring-green-300 hover:bg-green-50 focus:z-10"
                    >
                      送出
                    </button>
                  </span>
                </div>
                <div className="flex justify-between my-4">
                  <div className="text-xl border-b-2 ">紀錄</div>
                  <div className={`${totalPoint > 0 ? "text-green-500" : "text-red-500"} text-xl `}>總計：{totalPoint}</div>
                </div>

                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-green-200">
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        課程
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        建立時間
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        建立人
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        點數
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        原因
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pointList.map((item) => (
                      <tr key={item.point_id}>
                        <td className="whitespace-nowrap text-sm font-medium text-gray-900 w-1/6">
                          <div>{item.course_date}</div>
                          <div>{item.course_name}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500 w-1/6">
                          <div>{new Date(item.create_at).toLocaleDateString()}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500 w-1/6">
                          <div>{item.first_name}</div>
                          <div>{item.nick_name}</div>
                        </td>
                        <td className={`${item.type ? "text-green-600" : "text-red-600"} whitespace-nowrap text-sm text-gray-500 w-1/6`}>
                          <div>
                            {item.type ? " + " : " - "}
                            {item.point}
                          </div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500 w-1/4">
                          <div>{item.reason}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-red-500">
                          <div
                            onClick={() => {
                              const check = confirm("確定要刪除嗎？");
                              if (check) {
                                deletePointLog(item.point_id);
                              }
                            }}
                            className="cursor-pointer hover:text-red-200"
                          >
                            刪除
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center mt-2">
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => {
                        if (offset > 0) {
                          setOffset(offset - 5);
                        }
                      }}
                      type="button"
                      className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </button>
                    <button
                      onClick={() => {
                        if (pointList.length == 5) {
                          setOffset(offset + 5);
                        }
                      }}
                      type="button"
                      className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-1 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="px-4 py-6">
                <div>繳費紀錄</div>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-green-200">
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        單位
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        學年
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        月份
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        總金額
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        繳費時間
                      </th>
                      {/* <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      ></th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceList.map((item) => (
                      <tr key={item.point_id}>
                        <td className="whitespace-nowrap text-sm font-medium text-gray-900">
                          <div>{item.tutoring_id}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500">
                          <div>{item.school_year}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500">
                          <div>
                            {item.start_month}-{item.end_month}
                          </div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-red-500">
                          <div>{item.amount || 0}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500">
                          <div>{item.charge_date}</div>
                        </td>
                        {/* <td className="whitespace-nowrap text-sm text-red-500">
                          <div className="cursor-pointer hover:text-red-200"></div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-span-1 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="px-4 py-6">
                <div className="flex justify-between border-b-2 p-2">
                  <div className="text-xl">兌換紀錄</div>
                  <button
                    type="button"
                    onClick={() => {
                      getPrize();
                    }}
                    className="bg-green-600 px-2 py-1 text-sm font-semibold text-white ring-2 ring-green-300 hover:bg-green-500"
                  >
                    兌換列表
                  </button>
                </div>

                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-green-200">
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        商品
                      </th>

                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        兌換人
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      >
                        兌換時間
                      </th>
                      <th
                        scope="col"
                        className="text-left text-sm font-semibold text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {prizeLogList.map((item) => (
                      <tr key={item.point_id}>
                        <td className="whitespace-nowrap text-sm font-medium text-gray-900">
                          <div>{item.name}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500">
                          <div>{item.first_name}</div>
                          {/* <div>{item.nick_name}</div> */}
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500">
                          <div>{new Date(item.create_at).toLocaleDateString()}</div>
                        </td>
                        <td className="whitespace-nowrap text-sm text-red-500">
                          <div
                            onClick={() => {
                              const check = confirm("確定要刪除嗎？");
                              if (check) {
                                deletePointLog(item.point_id);
                              }
                            }}
                            className="cursor-pointer hover:text-red-200"
                          >
                            刪除
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center mt-2">
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => {
                        console.log("123");
                        if (prizeOffset > 0) {
                          setPrizeOffset(prizeOffset - 5);
                        }
                      }}
                      type="button"
                      className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </button>
                    <button
                      onClick={() => {
                        if (prizeLogList.length == 5) {
                          console.log("345");
                          setPrizeOffset(prizeOffset + 5);
                        }
                      }}
                      type="button"
                      className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-1 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="px-4 py-6">
                <span className="isolate inline-flex rounded-md shadow-sm mt-2">
                  <button
                    onClick={() => {
                      setState(1);
                    }}
                    type="button"
                    className={`${
                      state == 1 ? "ring-blue-300" : "ring-gray-300"
                    } mx-1 relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-2 ring-inset`}
                  >
                    獎券
                  </button>
                  <button
                    onClick={() => {
                      setState(2);
                    }}
                    type="button"
                    className={`${
                      state == 2 ? "ring-blue-300" : "ring-gray-300"
                    } mx-1 relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-2 ring-inset`}
                  >
                    訂金
                  </button>
                </span>
                {state == 1 ? (
                  <div className="overflow-auto mt-2">
                    <ul
                      role="list"
                      className="divide-y divide-gray-200"
                    >
                      {couponList.length > 0 &&
                        couponList.map((item) => (
                          <li
                            key={item.id}
                            className={`${(item.reason || item.invoice_id) && "bg-gray-300 opacity-25"} py-4`}
                          >
                            <div className="grid grid-cols-12 items-center">
                              <div className="col-span-2">
                                <div>{new Date(item.created_at).toLocaleDateString()}</div>
                                {/* <div>{new Date(item.created_at).toLocaleTimeString()}</div> */}
                              </div>
                              <div className="col-span-4 text-blue-600">{item.tutoring.tutoring_name}</div>
                              <div className="col-span-3 text-center text-gray-600">{item.coupon_name}</div>
                              <div className="col-span-1 text-right text-green-600">${item.coupon}</div>
                              <div className="col-span-2 text-center">{item.invoice_id ? (item.invoice.charge_date ? new Date(item.invoice.charge_date).toLocaleDateString() : "使用未收費") : ""}</div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : state == 2 ? (
                  <div className="overflow-auto mt-2">
                    <ul
                      role="list"
                      className="divide-y divide-gray-200"
                    >
                      {depositList.length > 0 &&
                        depositList.map((item) => (
                          <li
                            key={item.id}
                            className={`${(item.reason || item.invoice_id) && "bg-gray-300 opacity-50"} p-2`}
                          >
                            <div className="grid grid-cols-12 items-center">
                              <div className="col-span-2">
                                <div>{new Date(item.created_at).toLocaleDateString()}</div>
                                <div>{new Date(item.created_at).toLocaleTimeString()}</div>
                              </div>
                              <div className="col-span-4 text-blue-600">{item.tutoring.tutoring_name}</div>
                              <div className="col-span-3 text-center text-gray-600">訂金</div>
                              <div className="col-span-1 text-right text-green-600">${item.deposit}</div>
                              <div className="col-span-2 text-center">{item.invoice_id ? (item.invoice.charge_date ? new Date(item.invoice.charge_date).toLocaleDateString() : "使用未收費") : ""}</div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
