"use client";

import { useEffect, useRef, useState } from "react";
import Alert from "../../alert";
import { error } from "../../../utils";
import * as XLSX from "xlsx";

const date = new Date().toLocaleDateString().replaceAll("/", "-");

const def_search = {
  type: 1,
  index: true
};

const def_view = {
  begin: date,
  end: date
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState(def_search);
  const [view, setView] = useState(def_view);

  function getTableData() {
    const table = document.getElementById("myTable");
    const rows = table.querySelectorAll("tbody tr");

    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      console.log(cells);
      data.push({
        單位: cells[0].innerText,
        人員: cells[1].innerText,
        身份: cells[2].innerText,
        工時: cells[3].innerText,
        時薪: cells[4].innerText,
        小計: cells[5].innerText
      });
    });

    return data;
  }

  function ExportToExcel() {
    const date = new Date();
    const exportTableToExcel = () => {
      // 呼叫函數來取得選定的欄位資料
      const selectedData = getTableData();

      // 將選擇的資料轉為 worksheet
      const worksheet = XLSX.utils.json_to_sheet(selectedData);

      // 創建新的 workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 將 workbook 寫入 Excel 檔案
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_薪資明細總表.xlsx`);
    };

    return (
      <button
        className="mx-1 text-pink-600 border-2 border-pink-400 bg-pink-100 px-1 rounded-md"
        onClick={exportTableToExcel}
      >
        下載 Excel
      </button>
    );
  }

  async function getItemGroup() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...view, ...search })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/person/group`, config);
    const res = await response.json();
    if (response.ok) {
      setList(
        res.map((item) => {
          const money = item.wage * 0.5 * Math.floor(Number(item.working_time) / 30);
          return {
            ...item,
            money: money
          };
        })
      );
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    getItemGroup();
  }, [search]);

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
      <div className="container mx-auto">
        <div className="px-4 mt-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <h1 className="text-xl font-semibold text-gray-900">補習班身份薪資表</h1>
              <span className="ml-12">
                <input
                  value={view.begin}
                  onChange={(e) => {
                    setView({
                      ...view,
                      begin: e.target.value
                    });
                  }}
                  type="date"
                  className="ring-1 mx-1"
                />
                <input
                  value={view.end}
                  onChange={(e) => {
                    setView({
                      ...view,
                      end: e.target.value
                    });
                  }}
                  type="date"
                  className="ring-1 mx-1"
                />
                <button
                  className="text-sky-600 border-2 border-sky-400 bg-sky-100 px-1 rounded-md"
                  onClick={() => {
                    getItemGroup();
                  }}
                >
                  查詢
                </button>
                <ExportToExcel />
              </span>
            </div>
          </div>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle h-80vh">
                <table
                  id="myTable"
                  className="min-w-full divide-y divide-gray-300"
                >
                  <thead className="sticky top-0">
                    <tr className="divide-x divide-gray-200 bg-green-100 sticky top-0">
                      <th
                        onClick={() => {
                          setSearch({
                            type: 1,
                            index: !search.index
                          });
                        }}
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-green-200"
                      >
                        單位
                      </th>
                      <th
                        onClick={() => {
                          setSearch({
                            type: 2,
                            index: !search.index
                          });
                        }}
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-green-200"
                      >
                        人員
                      </th>
                      <th
                        onClick={() => {
                          setSearch({
                            type: 3,
                            index: !search.index
                          });
                        }}
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-green-200"
                      >
                        身份
                      </th>
                      <th
                        scope="col"
                        className="py-2 pr-2 text-right text-sm font-semibold text-gray-900"
                      >
                        工時 /小時
                      </th>
                      <th
                        scope="col"
                        className="py-2 pr-2 text-right text-sm font-semibold text-gray-900"
                      >
                        時薪
                      </th>
                      <th
                        scope="col"
                        className="py-2 pr-2 text-right text-sm font-semibold text-gray-900"
                      >
                        小計
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {list.map((item, index) => {
                      const working_time = Math.floor((Number(item.working_time) / 60) * 10) / 10;
                      return (
                        <tr
                          key={index}
                          className={`divide-x divide-gray-200 hover:bg-blue-100`}
                        >
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.short_name}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.c_name}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.content}</td>
                          <td className="whitespace-nowrap py-2 pr-2 text-right text-sm text-pink-500">{working_time}</td>
                          <td className="whitespace-nowrap py-2 pr-2 text-right text-sm text-blue-500">{item.wage}</td>
                          <td className="whitespace-nowrap py-2 pr-2 text-right text-sm text-blue-500">{item.money}</td>
                        </tr>
                      );
                    })}
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
