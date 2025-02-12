"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Radio, RadioGroup } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";

const people = [
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" }
  // More people...
];

export default function Home({ setInfo }) {
  const [loading, setLoading] = useState(true);
  const [prizeList, setPrizeList] = useState([]);
  const [createData, setCreateData] = useState({
    name: "",
    pointer: 0
  });

  async function postPrize() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/prize`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "新增完成！"
      });
      setPrizeList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function switchPrize(id, disable) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        disable: disable
      })
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/prize`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "設定完成！"
      });
      setPrizeList(res);
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/prize/list`, config);
    const res = await response.json();
    if (response.ok) {
      setPrizeList(res);
      setLoading(false);
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
    getPrize();
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
    <div className="container mx-auto p-2">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              商品名稱
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              點數
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              建立時間
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              建立人
            </th>
            <th
              scope="col"
              className="relative py-3.5 pl-3 pr-4 sm:pr-6"
            >
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <tr className="bg-pink-100">
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {" "}
              <input
                value={createData.name}
                onChange={(e) => {
                  setCreateData({
                    ...createData,
                    name: e.target.value.trim()
                  });
                }}
                type="text"
                className="ring ring-inset ring-1 px-2 py-1"
              />
            </td>

            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <input
                value={createData.point}
                onChange={(e) => {
                  setCreateData({
                    ...createData,
                    point: Number(e.target.value)
                  });
                }}
                type="number"
                className="ring ring-inset ring-1 px-2 py-1"
              />
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div
                onClick={() => {
                  postPrize();
                }}
                className="text-green-500 text-xl cursor-pointer"
              >
                新增
              </div>
            </td>
          </tr>

          {prizeList.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-blue-50"
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{item.name}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.point}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(item.create_at).toLocaleString()}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.first_name}</td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <input
                  className="w-8 h-8"
                  checked={!item.disable}
                  onChange={(e) => {
                    switchPrize(item.id, !item.disable);
                  }}
                  type="checkbox"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
