"use client";

import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// 註冊必需的 Chart.js 組件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// 圖表的選項
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top" // 圖例位置
    },
    title: {
      display: true,
      text: "補習班日收表" // 圖表標題
    }
  }
};
const items = ["學費", "學費退費", "教材費", "教材費退費", "交通費", "交通退費", "餐費", "餐費退費", "訂金", "優惠券", "折扣"];
const today = new Date();
const year_list = [];
for (let i = 2024; i <= today.getFullYear(); i++) {
  year_list.push(i);
}

export default function Home() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [tutoring, setTutoring] = useState(1);

  async function getData() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/financial-statements/year-summary/?year=${year}&month=${month}&tutoring_id=${tutoring}`,
      config
    );
    const res = await response.json();
    if (response.ok) {
      setData([res.money, res.money_refund, res.textbook, res.textbook_refund, res.transportation, res.transportation_refund, res.meal, res.meal_refund, res.deposit, res.coupon, res.discount]);
    } else {
      alert(res.msg);
    }
  }

  useEffect(() => {
    getData();
  }, [year, month, tutoring]);

  return (
    <div className="container mx-auto">
      <div className="bg-white mt-8 p-4 rounded-md">
        <div className="flex items-end p-4">
          <span className="isolate inline-flex">
            <button
              type="button"
              onClick={() => {
                setTutoring(1);
              }}
              className={`${
                tutoring == 1 ? "ring-4 ring-blue-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              多易
            </button>
            <button
              type="button"
              onClick={() => {
                setTutoring(2);
              }}
              className={`${
                tutoring == 2 ? "ring-4 ring-blue-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              艾思
            </button>
            <button
              type="button"
              onClick={() => {
                setTutoring(3);
              }}
              className={`${
                tutoring == 3 ? "ring-4 ring-blue-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              華而敦
            </button>
            <div className="mx-1 grid grid-cols-1">
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                }}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                {year_list.map((year) => (
                  <option value={year}>{year} 年</option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
            <div className="mx-1 grid grid-cols-1">
              <select
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value={1}>一月</option>
                <option value={2}>二月</option>
                <option value={3}>三月</option>
                <option value={4}>四月</option>
                <option value={5}>五月</option>
                <option value={6}>六月</option>
                <option value={7}>七月</option>
                <option value={8}>八月</option>
                <option value={9}>九月</option>
                <option value={10}>十月</option>
                <option value={11}>十一月</option>
                <option value={12}>十二月</option>
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <Bar
              data={{
                labels: items,
                datasets: [
                  {
                    label: tutoring == 1 ? "多易" : tutoring == 2 ? "艾思" : tutoring == 3 ? "華而敦" : "",
                    data: data, // 這裡是折線圖的數據
                    backgroundColor: ["#00DB00", "#DB0000", "#00DB00", "#DB0000", "#00DB00", "#DB0000", "#00DB00", "#DB0000", "#00DB00", "#00DB00", "#DB0000", "#DB0000"] // 填充顏色
                  }
                ]
              }}
              options={options}
            />
          </div>
          <div className="col-span-1">
            <table className="min-w-full divide-y divide-gray-300 text-center">
              <thead>
                <tr className="divide-x divide-gray-200 border bg-yellow-50">
                  <th
                    scope="col"
                    className="whitespace-nowrap py-2 text-sm font-semibold text-gray-900"
                  >
                    項目
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap py-2 text-sm font-semibold text-gray-900"
                  >
                    金額
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className="divide-x divide-gray-200 border"
                  >
                    <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">{item}</td>
                    <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">{data[index]}</td>
                  </tr>
                ))}
                <tr className="divide-x divide-gray-200 border bg-sky-100">
                  <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">總計</td>
                  <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">
                    {data[0] - data[1] + data[2] - data[3] + data[4] - data[5] + data[6] - data[7] + data[8] - data[9] - data[10]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
