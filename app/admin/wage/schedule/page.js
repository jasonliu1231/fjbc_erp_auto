"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Alert from "../../alert";
import { error } from "../../../utils";
import * as XLSX from "xlsx";

const date = new Date().toLocaleDateString().replaceAll("/", "-");

const def_search = {
  type: 1,
  index: true
};

const def_view = {
  type: 1,
  index: true,
  begin: date,
  end: date
};

const def_update = {
  id: 0,
  working_time: 0
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState(def_search);
  const [view, setView] = useState(def_view);
  const [update, setUpdate] = useState(def_update);
  const [query, setQuery] = useState("");
  const [tutoring, setTutoring] = useState(0);

  function getTableData() {
    const table = document.getElementById("myTable");
    const rows = table.querySelectorAll("tbody tr");

    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      console.log(cells);
      data.push({
        單位: cells[0].innerText,
        日期: cells[1].innerText,
        課程: cells[2].innerText,
        人員: cells[3].innerText,
        身份: cells[4].innerText,
        課程開始: cells[5].innerText,
        課程結束: cells[6].innerText,
        打卡開始: cells[7].innerText,
        打卡結束: cells[8].innerText,
        工時: cells[9].innerText,
        時薪: cells[10].innerText,
        小計: cells[11].innerText
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
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_個人薪資條.xlsx`);
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
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...view, ...search })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/schedule/list`, config);
    const res = await response.json();
    if (response.ok) {
      setList(
        res.map((item) => {
          const money = item.wage * 0.5 * Math.floor(Number(item.working_time) / 30);
          const working_time = Math.floor((Number(item.working_time) / 60) * 10) / 10;
          return {
            ...item,
            money: money,
            working_time: working_time
          };
        })
      );
    } else {
      const msg = error(response.status, res);
      console.log(msg);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  async function updateItem() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...update, working_time: Number(update.working_time) * 60 })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/schedule/working`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "修改完成"
      });
      getItemList();
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

  const filterItems = tutoring == 0 ? list : list.filter((person) => person.tid == tutoring);

  filterItems =
    query == ""
      ? filterItems
      : filterItems.filter((person) => {
          const name = person.c_name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <label className="text-gray-600">工時設定(小時)</label>
                <input
                  value={update.working_time}
                  onChange={(e) => {
                    setUpdate({ ...update, working_time: e.target.value });
                  }}
                  type="text"
                  className="border-2 w-full px-2 py-1"
                />
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2 mx-1"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={updateItem}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-green-600 ring-2 ring-green-400 mx-1"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        <div className="px-4 mt-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <h1 className="text-xl font-semibold text-gray-900">薪資明細總表</h1>
              <span className="ml-12">
                <div className="flex">
                  <button
                    onClick={() => {
                      setTutoring(0);
                    }}
                    type="button"
                    className={`${tutoring == 0 ? "bg-pink-100" : "bg-white"} mx-1 rounded px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => {
                      setTutoring(1);
                    }}
                    type="button"
                    className={`${tutoring == 1 ? "bg-pink-100" : "bg-white"} mx-1 rounded px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300`}
                  >
                    多易
                  </button>
                  <button
                    onClick={() => {
                      setTutoring(2);
                    }}
                    type="button"
                    className={`${tutoring == 2 ? "bg-pink-100" : "bg-white"} mx-1 rounded px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300`}
                  >
                    艾思
                  </button>
                  <button
                    onClick={() => {
                      setTutoring(3);
                    }}
                    type="button"
                    className={`${tutoring == 3 ? "bg-pink-100" : "bg-white"} mx-1 rounded px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300`}
                  >
                    華而敦
                  </button>
                </div>

                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  placeholder="姓名搜尋"
                  type="text"
                  className="ring-1 mx-1 px-2 py-1 rounded-md"
                />
                <input
                  value={view.begin}
                  onChange={(e) => {
                    setView({
                      ...view,
                      begin: e.target.value
                    });
                  }}
                  type="date"
                  className="ring-1 mx-1 rounded-md"
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
                  className="ring-1 mx-1 rounded-md"
                />
                <button
                  className="text-sky-600 border-2 border-sky-400 bg-sky-100 px-1 rounded-md"
                  onClick={() => {
                    getItemList();
                  }}
                >
                  查詢
                </button>
                <ExportToExcel />
              </span>
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
                        日期
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
                        課程
                      </th>
                      <th
                        onClick={() => {
                          setSearch({
                            type: 4,
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
                            type: 5,
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
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        課程開始
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        課程結束
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        打卡開始
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        打卡結束
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
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        設定
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filterItems.map((item) => {
                      let late = "";
                      let early = "";

                      if (item.check_in_time) {
                        if (new Date(`${item.course_date} ${item.check_in_time}`) > new Date(`${item.course_date} ${item.course_start_time}`)) {
                          late = "ring-2 ring-inset ring-yellow-400 bg-yellow-50";
                        }
                      } else {
                        late = "ring-2 ring-inset ring-red-400 bg-red-50";
                      }

                      if (item.check_out_time) {
                        if (new Date(`${item.course_date} ${item.check_out_time}`) < new Date(`${item.course_date} ${item.course_end_time}`)) {
                          early = "ring-2 ring-inset ring-yellow-400 bg-yellow-50";
                        }
                      } else {
                        early = "ring-2 ring-inset ring-red-400 bg-red-50";
                      }
                      return (
                        <tr
                          key={item.id}
                          className={`divide-x divide-gray-200 hover:bg-blue-100`}
                        >
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.short_name}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.course_date}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.course_name}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.c_name}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.content}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.course_start_time?.substr(0, 5)}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.course_end_time?.substr(0, 5)}</td>
                          <td className={`${late} whitespace-nowrap py-2 pl-2 text-sm text-gray-500`}>{item.check_in_time?.substr(0, 5)}</td>
                          <td className={`${early} whitespace-nowrap py-2 pl-2 text-sm text-gray-500`}>{item.check_out_time?.substr(0, 5)}</td>
                          <td className="whitespace-nowrap py-2 pr-2 text-sm text-pink-500 text-right">{item.working_time}</td>
                          <td className="whitespace-nowrap py-2 pr-2 text-sm text-blue-500 text-right">{item.wage}</td>
                          <td className="whitespace-nowrap py-2 pr-2 text-sm text-blue-500 text-right">{item.money}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">
                            <span
                              onClick={() => {
                                setUpdate({ id: item.id, working_time: item.working_time });
                                setOpen(true);
                              }}
                              className="text-orange-400 cursor-pointer"
                            >
                              修改
                            </span>
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
