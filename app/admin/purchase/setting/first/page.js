"use client";

import { useEffect, useState } from "react";
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

  async function getPurchase(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase?id=${id}&state=1`, config);
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

  async function pass() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/step1/pass?id=${purchase.id}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      window.location.href = `/admin/purchase/setting/sell?id=${purchase.id}`;
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
      <div className="container mx-auto p-2">
        <div className="mx-auto px-2 py-4">
          <h1 className="text-lg font-semibold text-gray-900">採購單瀏覽</h1>
        </div>
        <div className="bg-white p-4 rounded-md">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-1 text-lg font-semibold">
              <div className="text-red-800">編號：{purchase.id}</div>
              <div className="text-blue-800">狀態：待初審</div>
            </div>
            <div className="col-span-4 flex my-4 h-8 m-auto">
              <div className={`w-40 border-b-2 relative color-step`}>
                <div className="absolute lineStr font-semibold">待初審</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-200 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative`}>
                <div className="absolute lineStr text-sm">待報價</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-gray-300 border-gray-400`}></div>
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
            <div className="col-span-1 flex justify-end items-start">
              <div className="flex">
                <button
                  onClick={pass}
                  type="button"
                  className="mx-1 block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  通過
                </button>
                <button
                  onClick={reject}
                  type="button"
                  className="mx-1 block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  駁回
                </button>
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

          <div className="mt-8 flow-root">
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
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        單價
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        小計
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {detail.map((item, index) => (
                      <tr
                        key={item.id}
                        className="even:bg-yellow-50"
                      >
                        <td className="p-2 text-xs font-medium text-gray-700">{item.name}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.quantity}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.unit}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.specification}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.remark}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.price}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.price * item.quantity}</td>
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
