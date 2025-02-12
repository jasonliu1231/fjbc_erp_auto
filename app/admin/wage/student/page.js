"use client";

import { useEffect, useState } from "react";
import Alert from "../../alert";
import { error } from "../../../utils";
import * as XLSX from "xlsx";

const def_search = {
  type: 1,
  index: true
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
  const [query, setQuery] = useState("");

  function getTableData() {
    const table = document.getElementById("myTable");
    const rows = table.querySelectorAll("tbody tr");

    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      console.log(cells);
      data.push({
        學生身份: cells[0].innerText,
        學生姓名: cells[1].innerText,
        英文名: cells[2].innerText,
        學校: cells[3].innerText,
        年級: cells[4].innerText,
        家長資訊: cells[5].innerText,
        簽名認證: cells[6].innerText,
        健康狀況: cells[7].innerText,
        多易: cells[8].innerText,
        艾思: cells[9].innerText,
        繳費: cells[10].innerText
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
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_學生資料表.xlsx`);
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

  async function getItemList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/statements/student`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
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
    getItemList();
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
        <div className="mt-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <h1 className="text-xl font-semibold text-gray-900">學生資料表</h1>
              <ExportToExcel />
            </div>
          </div>
          <div className="mt-4 flow-root">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle h-80vh">
                <table
                  id="myTable"
                  className="min-w-full divide-y divide-gray-300"
                >
                  <thead>
                    <tr className="divide-x divide-gray-200 bg-green-100 sticky top-0">
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        學生身份
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        學生姓名
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        英文名
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        學校
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        年級
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        家長資訊
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        簽名認證
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        健康狀況
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        多易
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        艾思
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        繳費
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {list.map((item) => {
                      const parent = item.parent_list;
                      const invoice = item.invoice_data_list;
                      return (
                        <tr
                          key={item.student_id}
                          className={`divide-x divide-gray-200 hover:bg-blue-100`}
                        >
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.student_state}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.student_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.student_en_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.school_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.grade_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                            {parent?.map((item, index) => {
                              const data = item.split("$$");
                              return (
                                <div key={index}>
                                  {data[0]}：{data[1]}
                                </div>
                              );
                            })}
                          </td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.lsat_sign}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.history_list}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.tutoring1}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.tutoring2}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                            {invoice?.map((item, index) => {
                              const data = item.split("$$");
                              return (
                                <div key={index}>
                                  {data[2]}({data[0]})：{data[1]}：{data[3]}
                                </div>
                              );
                            })}
                          </td>
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
