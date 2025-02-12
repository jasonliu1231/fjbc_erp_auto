"use client";

import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, LineController, Tooltip, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";

// 註冊 Chart.js 元件
ChartJS.register(
  CategoryScale, // X 軸類別
  LinearScale, // Y 軸數值
  BarElement, // 長條圖元素
  PointElement, // 數據點
  LineElement, // 折線元素
  LineController, // 折線圖控制器
  Tooltip, // 提示工具
  Legend // 圖例
);

const options = {
  // responsive: true,
  plugins: {
    legend: {
      position: "top" // 圖例顯示在上方
    }
  },
  scales: {
    x: {
      stacked: true // X 軸堆疊
    },
    y: {
      stacked: false // Y 軸不堆疊，讓折線圖和長條圖可以共存
      // ticks: {
      //   callback: (value) => `$${value}` // 格式化 Y 軸標籤（加上 $ 符號）
      // }
    }
  }
};

const today = new Date();
const year_list = [];
for (let i = 2024; i <= today.getFullYear(); i++) {
  year_list.push(i);
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [person, setPerson] = useState([]);
  const [money, setMoney] = useState([]);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/statements/page9?year=${year}&tutoring_id=${tutoring}`, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res.map((i) => i.name));
      setPerson(res.map((i) => i.count));
      setMoney(res.map((i) => i.money));
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
                  <option
                    key={year}
                    value={year}
                  >
                    {year} 年
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <Chart
              data={{
                labels: items,
                datasets: [
                  {
                    type: "bar", // 長條圖
                    label: "金額",
                    data: money, // 長條圖數據
                    backgroundColor: "rgba(0, 255, 0, 0.3)" // 綠色背景
                  }
                ]
              }}
              options={options}
            />
          </div>
          <div className="col-span-1">
            <Chart
              data={{
                labels: items,
                datasets: [
                  {
                    type: "line", // 折線圖
                    label: "人數",
                    data: person, // 折線圖數據
                    borderColor: "rgba(54, 162, 235, 1)", // 折線顏色
                    borderWidth: 2 // 線條寬度
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
                    人數
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
                    <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">{person[index]}</td>
                    <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">{money[index]}</td>
                  </tr>
                ))}
                <tr className="divide-x divide-gray-200 border bg-sky-100">
                  <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">總計</td>
                  <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">{person.reduce((sun, item) => sun + item, 0)}</td>
                  <td className="whitespace-nowrap py-2 text-sm font-medium text-gray-900">{money.reduce((sun, item) => sun + item, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
