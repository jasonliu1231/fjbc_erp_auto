"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Alert from "../../../alert";
import { error } from "../../../../utils";
import * as XLSX from "xlsx";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [view, setView] = useState({
    teacher_id: 0,
    begin: "",
    end: ""
  });
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [total, setTotal] = useState({});
  const [open, setOpen] = useState(false);
  const [checkData, setCheckData] = useState({});

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
        單位: cells[0].innerText,
        日期: cells[1].innerText,
        課程: cells[2].innerText,
        身份: cells[3].innerText,
        課程開始: cells[4].innerText,
        課程結束: cells[5].innerText,
        打卡開始: cells[6].innerText,
        打卡結束: cells[7].innerText,
        工時: cells[8].innerText,
        時薪: cells[9].innerText,
        小計: cells[10].innerText
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

  async function getItemList() {
    if (view.begin == "" || view.end == "") {
      setInfo({
        show: true,
        success: false,
        msg: "時間區間不可以空白"
      });
      return;
    }
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/attendance/person?teacher_id=${view.teacher_id}&begin=${view.begin}&end=${view.end}`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
      let allAttendance = 0;
      let allCourse = 0;
      let allCheck = 0;
      res.forEach((item) => {
        item.attendance?.forEach((data) => {
          const time = data.total_time?.split(":");
          if (data.total_time) {
            allAttendance += Number(time[0]) * 60 + Number(time[1]);
          }
        });
        item.course?.forEach((data) => {
          const course_time = data.course_time?.split(":");
          const working_time = data.working_time?.split(":");
          if (data.course_time) {
            allCourse += Number(course_time[0]) * 60 + Number(course_time[1]);
          }
          if (data.working_time) {
            allCheck += Number(working_time[0]) * 60 + Number(working_time[1]);
          }
        });
      });

      setTotal({
        attendance: allAttendance,
        course: allCourse,
        check: allCheck
      });
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

  async function checkTime() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(checkData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/attendance/check`, config);
    const res = await response.json();
    if (response.ok) {
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

  useEffect(() => {
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
                <div>起始時間</div>
                <input
                  value={checkData.check_in_time}
                  onChange={(e) => {
                    setCheckData({
                      ...checkData,
                      check_in_time: e.target.value
                    });
                  }}
                  className="ring-1 w-full p-2"
                  type="time"
                />
              </div>
              <div>
                <div>結束時間</div>
                <input
                  value={checkData.check_out_time}
                  onChange={(e) => {
                    setCheckData({
                      ...checkData,
                      check_out_time: e.target.value
                    });
                  }}
                  className="ring-1 w-full p-2"
                  type="time"
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
                  onClick={checkTime}
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
        <div className="flex items-end justify-between mt-5">
          <h1 className="text-xl font-semibold text-gray-900">個人簽到明細表</h1>
          <span className="ml-12 flex">
            <Combobox
              as="div"
              value={selectedPerson}
              onChange={(person) => {
                setQuery("");
                setSelectedPerson(person);
                if (person) {
                  setView({
                    ...view,
                    teacher_id: person.teacher_id
                  });
                } else {
                  setView({
                    ...view,
                    teacher_id: 0
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
            <input
              value={view.begin}
              onChange={(e) => {
                setView({
                  ...view,
                  begin: e.target.value
                });
              }}
              type="date"
              className="ring-1 ring-inset ring-gray-300 py-1 px-2 mx-1 rounded-md"
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
              className="ring-1 ring-inset ring-gray-300 py-1 px-2 mx-1 rounded-md"
            />
            <button
              className="text-sky-600 border-2 border-sky-400 bg-sky-100 px-1 rounded-md"
              onClick={() => {
                getItemList();
              }}
            >
              查詢
            </button>
            {/* <ExportToExcel /> */}
          </span>
        </div>

        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle h-80vh">
              <table
                id="myTable"
                className="min-w-full divide-y divide-gray-300"
              >
                <thead>
                  <tr className="divide-x divide-gray-200 bg-green-100 sticky top-0">
                    <th
                      scope="col"
                      className="py-2 pl-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-green-200 w-1/12"
                    >
                      名稱
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-green-200 w-1/12"
                    >
                      日期
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-green-200 w-1/3"
                    >
                      <div className="mb-4 text-center text-gray-500">打卡時段紀錄</div>
                      <div className="flex">
                        <span className="flex-1">起始</span>
                        <span className="flex-1">結束</span>
                        <span className="flex-1">時數</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-green-200 w-1/2"
                    >
                      <div className="mb-4 text-center text-gray-500">課程審核資料</div>
                      <div className="flex">
                        <span className="flex-1">名稱</span>
                        <span className="flex-1">起始</span>
                        <span className="flex-1">結束</span>
                        <span className="flex-1">時數</span>
                        <span className="flex-1"></span>
                        <span className="flex-1">已審時段</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {list.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={`divide-x divide-gray-200 hover:bg-blue-100`}
                      >
                        <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.first_name}</td>
                        <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.date}</td>
                        <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">
                          {item.attendance?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className={`${index != 0 && "border-t-2 border-red-200"} flex p-2`}
                              >
                                <span className="flex-1">{item.start_time?.substr(0, 5)}</span>
                                <span className="flex-1">{item.end_time?.substr(0, 5)}</span>
                                <span className="flex-1">{item.total_time?.substr(0, 5)}</span>
                              </div>
                            );
                          })}
                        </td>
                        <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">
                          {item.course?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className={`${index != 0 && "border-t-2 border-red-200"} flex p-2`}
                              >
                                <span className="flex-1">{item.course_name}</span>
                                <span className="flex-1">{item.start_time?.substr(0, 5)}</span>
                                <span className="flex-1">{item.end_time?.substr(0, 5)}</span>
                                <span className="flex-1">{item.course_time?.substr(0, 5)}</span>
                                <span
                                  className={`${item.check_in_time ? "text-green-500" : "text-pink-500"} flex-1 cursor-pointer`}
                                  onClick={() => {
                                    setCheckData({
                                      ...view,
                                      tutoring_course_schedule_id: item.schedule_id,
                                      date: item.course_date,
                                      check_in_time: item.start_time,
                                      check_out_time: item.end_time,
                                      tcst_id: item.tcst_id
                                    });
                                    setOpen(true);
                                  }}
                                >
                                  {item.check_in_time ? "已審核" : "未審核"}
                                </span>
                                <span className="flex-1">{item.check_in_time ? `${item.check_in_time?.substr(0, 5)}~${item.check_out_time?.substr(0, 5)}` : null}</span>
                              </div>
                            );
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-yellow-50">
                    <td className="whitespace-nowrap text-sm py-4 font-medium text-gray-900"></td>
                    <td className="whitespace-nowrap text-sm py-4 font-medium text-gray-900"></td>
                    <td className="whitespace-nowrap text-sm font-medium text-gray-900 text-right pr-6">總打卡時數：{total.attendance} 分鐘</td>
                    <td className="whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      <span className="mx-5">總課程時數：{total.course} 分鐘</span>
                      <span className="mx-5">總審核時數：{total.check} 分鐘</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
