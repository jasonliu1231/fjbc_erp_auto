"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../../../utils";
import Alert from "../../../alert";

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" },
  { id: 4, name: "總倉" }
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [purchase, setPurchase] = useState({});
  const [detail, setDetail] = useState([]);
  const [openLog, setOpenLog] = useState(false);
  const [log, setLog] = useState([]);

  async function setPurchaseState(id, state) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase?id=${id}&state=${state}`, config);
    const res = await response.json();
    setLoading(false);
    if (response.ok) {
      window.location.href = `/admin/purchase`;
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      return;
    }
  }

  async function getPurchase(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase?id=${id}&state=5`, config);
    const res = await response.json();
    setLoading(false);
    if (response.ok) {
      setPurchase(res.entity);
      setDetail(res.detail);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      return;
    }
  }

  async function getLog(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/detail/log?detail_id=${id}`, config);
    const res = await response.json();
    setLoading(false);
    if (response.ok) {
      setLog(res);
      setOpenLog(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      return;
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    getPurchase(id);
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
      {/* 紀錄視窗 */}
      <Dialog
        open={openLog}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="text-left sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-blue-500 text-center"
                  >
                    入庫紀錄
                  </DialogTitle>
                  <div className="mt-2">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr className="bg-green-200">
                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            商品
                          </th>
                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            數量
                          </th>

                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            單位
                          </th>
                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            經手人
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white text-sm">
                        {log.map((item, index) => (
                          <tr
                            key={index}
                            className={`even:bg-sky-50`}
                          >
                            <td className="p-2 text-gray-700">{item.name}</td>
                            <td className="p-2 text-gray-700">{item.quantity}</td>
                            <td className="p-2 text-gray-700">{item.tutoring}</td>
                            <td className="p-2 text-gray-700">{item.first_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpenLog(false);
                  }}
                  className="mr-4 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-600 hover:bg-gray-300"
                >
                  關閉
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2">
        <div className="mx-auto px-2 py-4">
          <h1 className="text-lg font-semibold text-gray-900">採購單瀏覽</h1>
        </div>
        <div className="bg-white p-4 rounded-md">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-1 text-lg font-semibold">
              <div className="text-red-800">編號：{purchase.id}</div>
              <div className="text-blue-800">狀態：已結案</div>
              <select
                value={purchase.state}
                onChange={(e) => {
                  setPurchaseState(purchase.id, e.target.value);
                }}
                className="border border-gray-400 rounded-md px-2 py-1"
              >
                <option value={1}>待初審</option>
                <option value={2}>待報價</option>
                <option value={3}>待複審</option>
                <option value={4}>待結案</option>
                <option value={5}>已結案</option>
              </select>
            </div>
            <div className="col-span-5 flex my-4 h-8 m-auto">
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待初審</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-200 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待報價</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-200 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待複審</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-300 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待結案</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-300 border-red-400`}></div>
              </div>
              <div className={`w-40 relative color-step`}>
                <div className="absolute lineStr font-semibold">已結案</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-300 border-red-400`}></div>
              </div>
            </div>

            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">申請人：</span>
              <span className="text-sky-600 font-semibold">{purchase.createby}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">單位：</span>
              <span className="text-sky-600 font-semibold">{tutoring.filter((i) => i.id == purchase?.tutoringid)[0]?.name}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">申請時間：</span>
              <span className="text-sky-600 font-semibold">{new Date(purchase.createdon).toLocaleString()}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">課程：</span>
              <span className="text-sky-600 font-semibold">{purchase.class}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">需求日期：</span>
              <span className="text-sky-600 font-semibold">{new Date(purchase.deadline).toLocaleDateString()}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">事由：</span>
              <span className="text-sky-600 font-semibold">{purchase.reason}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 my-4">
            <div className="col-span-1 flex justify-center">
              <span className="text-gray-600">初審人：</span>
              <span className="text-pink-600 font-semibold">{purchase.firstby}</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <span className="text-gray-600">報價人：</span>
              <span className="text-pink-600 font-semibold">{purchase.secondby}</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <span className="text-gray-600">複審人：</span>
              <span className="text-pink-600 font-semibold">{purchase.lastby}</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <span className="text-gray-600">結案人：</span>
              <span className="text-pink-600 font-semibold">{purchase.closeby}</span>
            </div>
          </div>

          <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-green-200">
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        商品名稱
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        訂購數量
                      </th>

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
                        規格
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        備註
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900 text-right"
                      >
                        單價
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900 text-right"
                      >
                        小計
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        紀錄
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {detail.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${item.disabled ? "bg-gray-400" : "even:bg-yellow-50"}`}
                      >
                        <td className="p-2 text-xs font-medium text-gray-700">{item.name}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.quantity}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.unit}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.specification}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.remark}</td>
                        <td className="p-2 text-xs font-medium text-gray-700 text-right">{item.price}</td>
                        <td className="p-2 text-sm font-medium text-gray-700 text-right">{item.price * item.quantity}</td>
                        <td
                          onClick={() => {
                            getLog(item.id);
                          }}
                          className="p-2 text-sm font-medium text-blue-700 text-center cursor-pointer hover:text-sky-700"
                        >
                          查看
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-right text-sm px-2">
                        <div className="grid grid-cols-2">
                          <span>運費：</span>
                          <span className="text-blue-600">{purchase.transportation || 0}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span>折扣：</span>
                          <span className={`${purchase.discount > 0 ? "text-green-600" : "text-red-600"}`}>{purchase.discount * -1}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span>總計：</span>
                          <span className="text-pink-600">{purchase.transportation + detail.reduce((sun, item) => sun + (item.disabled ? 0 : item.quantity * item.price), 0) - purchase.discount}</span>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
