"use client";

import { useEffect, useState } from "react";
import { error, notificationType } from "../../../../utils";
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
  const [transportation, setTransportation] = useState(0);

  async function getPurchase(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase?id=${id}&state=2`, config);
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

  async function updateDetail(item) {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/detail`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getPurchase(purchase.id);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function switchDetail(item) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: item.id, disabled: !item.disabled })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/detail`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getPurchase(purchase.id);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function pass() {
    const check = confirm(`運費金額為 ${transportation} 是否報價？`);
    if (!check) {
      return;
    }

    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/step2/pass?id=${purchase.id}&transportation=${transportation}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function reject() {
    const check = confirm(`確定要關閉嗎？`);
    if (!check) {
      return;
    }
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/reject?id=${purchase.id}`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/purchase`;
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
      <div className="px-2 mx-auto">
        <div className="mx-auto px-2 py-4">
          <h1 className="text-lg font-semibold text-gray-900">採購單瀏覽</h1>
        </div>
        <div className="bg-white p-4 rounded-md">
          <div className="grid grid-cols-7 gap-4">
            <h1 className="col-span-1 text-lg font-semibold">
              <div className="text-red-800">編號：{purchase.id}</div>
              <div className="text-blue-800">狀態：待報價</div>
            </h1>
            <div className="col-span-4 flex my-4 h-8 m-auto">
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待初審</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-200 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative color-step`}>
                <div className="absolute lineStr font-semibold">待報價</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-200 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative`}>
                <div className="absolute lineStr text-sm">待複審</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-gray-300 border-gray-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative`}>
                {" "}
                <div className="absolute lineStr text-sm">待結案</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-gray-300 border-gray-400`}></div>
              </div>
              <div className={`w-40 relative`}>
                {" "}
                <div className="absolute lineStr text-sm">已結案</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-gray-300 border-gray-400`}></div>
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              {detail.filter((item) => item.updatedon == null).length == 0 ? (
                <div className="flex items-end">
                  <div>
                    <label className="block text-sm/6 font-medium text-pink-900">運費</label>
                    <div className="flex items-center">
                      <input
                        value={transportation}
                        onChange={(event) => {
                          setTransportation(event.target.value);
                        }}
                        type="number"
                        placeholder="填寫運費總額"
                        className="block w-full rounded-l-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={pass}
                      type="button"
                      className="rounded-r-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      報價
                    </button>
                    <button
                      onClick={reject}
                      type="button"
                      className="mx-1 rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                      消單
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-red-400">尚有商品未確認</span>
              )}
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
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">初審人：</span>
              <span className="text-pink-600 font-semibold">{purchase.firstby}</span>
            </div>
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-green-200">
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        品名
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        數量
                      </th>

                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        單位
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        規格
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        備註
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        單價
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-left text-sm font-semibold text-gray-900 text-right"
                      >
                        小計
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        設定
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {detail.map((item, index) => {
                      if (item.disabled) {
                        return (
                          <tr
                            key={item.id}
                            className="bg-gray-400"
                          >
                            <td className="p-2 text-xs font-medium text-gray-700">{item.name}</td>
                            <td className="p-2 text-xs font-medium text-gray-700">{item.quantity}</td>
                            <td className="p-2 text-xs font-medium text-gray-700">{item.unit}</td>
                            <td className="p-2 text-xs font-medium text-gray-700">{item.specification}</td>
                            <td className="p-2 text-xs font-medium text-gray-700">{item.remark}</td>
                            <td className="p-2 text-xs font-medium text-gray-700">{item.price}</td>
                            <td className="p-2 text-sm font-medium text-gray-700 text-right">{item.price * item.quantity}</td>
                            <td className="p-2 text-xs font-medium text-gray-700 w-1/6">
                              <div className="flex justify-center">
                                <button
                                  onClick={() => {
                                    switchDetail(item);
                                  }}
                                  type="button"
                                  className={`${item.disabled ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"} mx-1 rounded  px-2 py-1 text-sm text-white shadow-sm `}
                                >
                                  {item.disabled ? "開啟" : "關閉"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr
                            key={item.id}
                            className="even:bg-yellow-50"
                          >
                            <td className="p-2 text-xs font-medium text-gray-700 w-1/5">
                              <input
                                className="rounded-sm w-full ring-1 p-1"
                                type="text"
                                value={item.name}
                                onChange={(event) => {
                                  setDetail(
                                    detail.map((product, detail_index) => {
                                      if (detail_index == index) {
                                        return {
                                          ...product,
                                          name: event.target.value
                                        };
                                      } else {
                                        return product;
                                      }
                                    })
                                  );
                                }}
                              />
                            </td>
                            <td className="p-2 text-xs font-medium text-gray-700">
                              <input
                                className="rounded-sm w-full ring-1 p-1"
                                type="number"
                                value={item.quantity}
                                onChange={(event) => {
                                  setDetail(
                                    detail.map((product, detail_index) => {
                                      if (detail_index == index) {
                                        return {
                                          ...product,
                                          quantity: Number(event.target.value)
                                        };
                                      } else {
                                        return product;
                                      }
                                    })
                                  );
                                }}
                              />
                            </td>
                            <td className="p-2 text-xs font-medium text-gray-700">
                              <input
                                className="rounded-sm w-full ring-1 p-1"
                                type="text"
                                value={item.unit}
                                onChange={(event) => {
                                  setDetail(
                                    detail.map((product, detail_index) => {
                                      if (detail_index == index) {
                                        return {
                                          ...product,
                                          unit: event.target.value
                                        };
                                      } else {
                                        return product;
                                      }
                                    })
                                  );
                                }}
                              />
                            </td>
                            <td className="p-2 text-xs font-medium text-gray-700 w-1/5">
                              <input
                                className="rounded-sm w-full ring-1 p-1"
                                type="text"
                                value={item.specification}
                                onChange={(event) => {
                                  setDetail(
                                    detail.map((product, detail_index) => {
                                      if (detail_index == index) {
                                        return {
                                          ...product,
                                          specification: event.target.value
                                        };
                                      } else {
                                        return product;
                                      }
                                    })
                                  );
                                }}
                              />
                            </td>
                            <td className="p-2 text-xs font-medium text-gray-700 w-1/5">
                              <input
                                className="rounded-sm w-full ring-1 p-1"
                                type="text"
                                value={item.remark}
                                onChange={(event) => {
                                  setDetail(
                                    detail.map((product, detail_index) => {
                                      if (detail_index == index) {
                                        return {
                                          ...product,
                                          remark: event.target.value
                                        };
                                      } else {
                                        return product;
                                      }
                                    })
                                  );
                                }}
                              />
                            </td>
                            <td className="p-2 text-xs font-medium text-gray-700">
                              <input
                                className="rounded-sm w-full ring-1 p-1"
                                type="number"
                                value={item.price}
                                onChange={(event) => {
                                  setDetail(
                                    detail.map((product, detail_index) => {
                                      if (detail_index == index) {
                                        return {
                                          ...product,
                                          price: Number(event.target.value)
                                        };
                                      } else {
                                        return product;
                                      }
                                    })
                                  );
                                }}
                              />
                            </td>
                            <td className="p-2 text-sm font-medium text-gray-700 text-right">{item.price * item.quantity}</td>
                            <td className="p-2 text-xs font-medium text-gray-700 w-1/6">
                              <div className="flex justify-center">
                                <button
                                  onClick={() => {
                                    updateDetail(item);
                                  }}
                                  type="button"
                                  className={`${item.updatedon ? "bg-yellow-600 hover:bg-yellow-500" : "bg-green-600 hover:bg-green-500"} mx-1 rounded  px-2 py-1 text-sm text-white shadow-sm `}
                                >
                                  {item.updatedon ? "修改" : "確認"}
                                </button>
                                <button
                                  onClick={() => {
                                    switchDetail(item);
                                  }}
                                  type="button"
                                  className={`${item.disabled ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"} mx-1 rounded  px-2 py-1 text-sm text-white shadow-sm `}
                                >
                                  {item.disabled ? "開啟" : "關閉"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-right text-sm px-2 whitespace-nowrap w-20">
                        <div className="grid grid-cols-2">
                          <span>總計：</span>
                          <span className="text-pink-600">{purchase.transportation + detail.reduce((sun, item) => sun + (item.disabled ? 0 : item.quantity * item.price), 0)}</span>
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
