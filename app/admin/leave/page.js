"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState(false);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");

  let filteredList =
    query === ""
      ? list
      : list.filter((item) => {
          const e_name = item.e_name?.toLowerCase() || "";
          const c_name = item.c_name?.toLowerCase() || "";
          return e_name.includes(query.toLowerCase()) || c_name.includes(query.toLowerCase());
        });
  filteredList = finish ? filteredList.filter((i) => !i.is_makeup) : filteredList.filter((i) => i.is_makeup);

  async function getList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/leave/list`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res);
      setLoading(false);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function updateItem(id, type) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/leave?id=${id}&finish=${type}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "修改完成"
      });
      getList();
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  useEffect(() => {
    getList();
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
        <div className="px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-end justify-between">
            <h1 className="text-xl font-semibold text-gray-900">補課列表</h1>

            <div className="flex items-end">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                className="ring-1 rounded-md px-2 py-1"
                placeholder="姓名"
              />
              <button
                onClick={() => {
                  setFinish(true);
                }}
                className={`${finish ? "bg-blue-400 text-white" : "bg-gray-50 text-gray-400"} ring-2 ring-gray-300 mx-1 px-2 py-1 rounded-md`}
              >
                已補課
              </button>
              <button
                onClick={() => {
                  setFinish(false);
                }}
                className={`${!finish ? "bg-blue-400 text-white" : "bg-gray-50 text-gray-400"} ring-2 ring-gray-300 mx-1 px-2 py-1 rounded-md`}
              >
                未補課
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0">
                    <tr className="divide-x divide-gray-200 bg-pink-50 sticky top-0">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                      >
                        日期
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        課程名稱
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        姓名
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        假別
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        起始時間
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        結束時間
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        原因
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                      >
                        設定
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredList.length > 0 &&
                      filteredList.map((leave) => {
                        return (
                          <tr
                            key={leave.id}
                            className="divide-x divide-gray-200 hover:bg-blue-50"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{leave.course_date}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{leave.course_name}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">
                              {leave.c_name} ({leave.e_name})
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{leave.leave_type == 2 ? "事假" : "病假"}</td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500">{leave.leave_start_time?.substr(0, 5)}</td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500">{leave.leave_end_time?.substr(0, 5)}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{leave.leave_reason}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                              <span
                                onClick={() => {
                                  updateItem(leave.id, !leave.is_makeup);
                                }}
                                className={`${leave.is_makeup ? "text-red-400" : "text-blue-400"} cursor-pointer`}
                              >
                                {leave.is_makeup ? "未補課" : "已完成"}
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
