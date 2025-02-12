"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Alert from "../../alert";
import { error } from "../../../utils";
import * as XLSX from "xlsx";

const date = new Date().toLocaleDateString().replaceAll("/", "-");

const def_search = {
  teacher_id: 0,
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
  const [teacherList, setTeacherList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const filteredPeople =
    query === ""
      ? teacherList
      : teacherList.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  function getTableData() {
    const table = document.getElementById("myTable");
    const rows = table.querySelectorAll("tbody tr");

    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      console.log(cells);
      data.push({
        名稱: cells[1].innerText,
        起始日期: cells[2].innerText,
        結束日期: cells[3].innerText,
        總工時: cells[4].innerText,
        應領小計: cells[5].innerText,
        獎金: cells[6].innerText,
        加給: cells[7].innerText,
        實領: cells[8].innerText,
        經手人: cells[10].innerText
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
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_個人薪資明細表.xlsx`);
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

  async function setBill(data) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/salary`, config);
    const res = await response.json();
    if (response.ok) {
      getItemList();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/salary?teacher_id=${search.teacher_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
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

  async function getTeacher() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list`, config);
    const res = await response.json();
    if (response.ok) {
      setTeacherList(
        res.list.map((i) => {
          return {
            teacher_id: i.id,
            name: i.user.first_name
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
  }

  useEffect(() => {
    getItemList();
    getTeacher();
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

      <div className="container mx-auto">
        <div className="px-4 mt-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <h1 className="text-xl font-semibold text-gray-900">個人薪資條</h1>
              <span className="ml-12 flex">
                <Combobox
                  as="div"
                  value={selectedPerson}
                  onChange={(person) => {
                    setQuery("");
                    setSelectedPerson(person);
                    if (person) {
                      setSearch({
                        ...search,
                        teacher_id: person.teacher_id
                      });
                    }
                  }}
                >
                  <div className="relative">
                    <ComboboxInput
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      onChange={(event) => setQuery(event.target.value)}
                      onBlur={() => setQuery("")}
                      displayValue={(person) => person?.name}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="size-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </ComboboxButton>

                    {filteredPeople.length > 0 && (
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                          <ComboboxOption
                            key={person.teacher_id}
                            value={person}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                          >
                            <span className="block truncate group-data-[selected]:font-semibold">{person.name}</span>

                            <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                              <CheckIcon
                                className="size-5"
                                aria-hidden="true"
                              />
                            </span>
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </div>
                </Combobox>
                {/* <input
                  value={search.begin}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      begin: e.target.value
                    });
                  }}
                  type="date"
                  className="ring-1 ring-inset ring-gray-300 py-1 px-2 mx-1 rounded-md"
                />
                <input
                  value={search.end}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      end: e.target.value
                    });
                  }}
                  type="date"
                  className="ring-1 ring-inset ring-gray-300 py-1 px-2 mx-1 rounded-md"
                /> */}
                <button
                  className="mx-2 text-sky-600 border-2 border-sky-400 bg-sky-100 px-1 rounded-md"
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
            <div className="-mx-4 -my-2 overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <table
                  id="myTable"
                  className="min-w-full divide-y divide-gray-300"
                >
                  <thead>
                    <tr className="divide-x divide-gray-200 bg-green-100">
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        編號
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        名稱
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        起始日期
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        結束日期
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        總工時 /小時
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        應領小計
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        獎金
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        加給
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        實領
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        經手時間
                      </th>
                      <th
                        scope="col"
                        className="py-2 pl-2 text-left text-sm font-semibold text-gray-900"
                      >
                        經手人
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
                    {list.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className={`${item.enable ? "bg-white" : "bg-gray-300"} divide-x divide-gray-200 hover:bg-blue-100`}
                        >
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.no}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.name}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.start_date}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.end_date}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.working_time}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.wage}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.bonus}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.plus}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-pink-500">{item.amount}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-blue-500">{new Date(item.update_at).toLocaleString()}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm text-blue-500">{item.first_name}</td>
                          <td className="whitespace-nowrap py-2 pl-2 text-sm">
                            <span
                              onClick={() => {
                                setBill({ id: item.id, teacher_id: item.teacher_id, start_date: item.start_date, end_date: item.end_date, enable: !item.enable });
                              }}
                              className={`${item.enable ? "text-red-500" : "text-green-500"} cursor-pointer`}
                            >
                              {item.enable ? "關閉" : "開啟"}
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
