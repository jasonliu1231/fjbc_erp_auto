"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Alert from "../../alert";
import { error } from "../../../utils";
import * as XLSX from "xlsx";

const y = new Date().getFullYear() - 1911;
const year = [y - 2, y - 1, y, y + 1, y + 2];

const semester = [
  {
    id: 1,
    name: "上學期"
  },
  {
    id: 2,
    name: "下學期"
  },
  {
    id: 3,
    name: "暑假"
  },
  {
    id: 4,
    name: "寒假"
  },
  {
    id: 5,
    name: "其他"
  }
];

const exam_type = [
  {
    id: 1,
    name: "期中考"
  },
  {
    id: 2,
    name: "期末考"
  },
  {
    id: 3,
    name: "第一次段考"
  },
  {
    id: 4,
    name: "第二次段考"
  },
  {
    id: 5,
    name: "第三次段考"
  },
  {
    id: 6,
    name: "會考"
  },
  {
    id: 7,
    name: "模擬考"
  },
  {
    id: 8,
    name: "統測"
  },
  {
    id: 9,
    name: "學測"
  },
  {
    id: 10,
    name: "隨堂小考"
  },
  {
    id: 99,
    name: "其他"
  }
];

const def_search = {
  school_year: 113,
  semester: 1,
  course_no: "B1",
  exam_type: 1,
  grade: 5
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);
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
        學生姓名: cells[0].innerText,
        英文名: cells[1].innerText,
        學校: cells[2].innerText,
        年級: cells[3].innerText,
        成績: cells[4].innerText,
        班排: cells[5].innerText,
        校排: cells[6].innerText
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
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_學生成績表.xlsx`);
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

  async function searchExam() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/statements/student/grade?school_year=${search.school_year}&semester=${search.semester}&course_no=${search.course_no}&exam_type=${search.exam_type}&grade=${search.grade}`,
      config
    );
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

  async function getCourse() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_student_exam/course/list`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setCourse(res);
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
    getCourse();
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
        <div className="mt-4">
          <div className="flex">
            <div className="flex-1 text-xl font-semibold text-gray-900">學生資料表</div>

            <ExportToExcel />
          </div>
          <div className="flex items-end">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">學年度</label>
              <div className="grid grid-cols-1">
                <select
                  value={search.school_year}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      school_year: Number(e.target.value)
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {year.map((schoolYear, index) => (
                    <option
                      key={index}
                      value={schoolYear}
                    >
                      {schoolYear}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">學期</label>
              <div className="grid grid-cols-1">
                <select
                  value={search.semester}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      semester: Number(e.target.value)
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {semester.map((semester, index) => (
                    <option
                      key={index}
                      value={semester.id}
                    >
                      {semester.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">科目</label>
              <div className="grid grid-cols-1">
                <select
                  value={search.course_no}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      course_no: e.target.value
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {course.map((course, index) => (
                    <option
                      key={index}
                      value={course.id}
                    >
                      {course.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">類別</label>
              <div className="grid grid-cols-1">
                <select
                  value={search.exam_type}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      exam_type: e.target.value
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {exam_type.map((type, index) => (
                    <option
                      key={index}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div className="">
              <label className="block text-sm/6 font-medium text-gray-900">年級</label>
              <select
                onChange={(e) => {
                  setSearch({ ...search, grade: e.target.value });
                }}
                className="p-2 block w-full rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
              >
                <option value="5">小一</option>
                <option value="6">小二</option>
                <option value="7">小三</option>
                <option value="8">小四</option>
                <option value="9">小五</option>
                <option value="10">小六</option>
                <option value="11">國一</option>
                <option value="12">國二</option>
                <option value="13">國三</option>
                <option value="14">高一</option>
                <option value="15">高二</option>
                <option value="16">高三</option>
              </select>
            </div>
            <button
              className="mx-1 text-blue-600 border-2 border-blue-400 bg-blue-100 px-2 py-1 rounded-md"
              onClick={searchExam}
            >
              查詢
            </button>
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
                        成績
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        班排
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        校排
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
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.first_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.nick_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.school_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.grade_name}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.score}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.class_rank}</td>
                          <td className="whitespace-nowrap p-2 text-sm text-gray-500">{item.school_rank}</td>
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
