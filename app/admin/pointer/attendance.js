"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";

const def_data = {
  type: true, // true: teacher, false: student
  date: new Date().toISOString().split("T")[0],
  HH: "09",
  mm: "00",
  attendance_time: "09:00",
  status: "",
  remark: "",
  photo: "",
  id: 0
};

export default function Home({ setInfo }) {
  const [loading, setLoading] = useState(true);
  const [stateDialog, setStateDialog] = useState(false);
  const [student_list, setStudent_list] = useState([]);
  const [teacher_list, setTeacher_list] = useState([]);
  const [teacherQuery, setTeacherQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [createData, setCreateData] = useState(def_data);
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredTeacher =
    teacherQuery === ""
      ? teacher_list
      : teacher_list.filter((item) => {
          const first_name = item.first_name?.toLowerCase() || "";
          const nick_name = item.nick_name?.toLowerCase() || "";
          return first_name.includes(teacherQuery.toLowerCase()) || nick_name.includes(teacherQuery.toLowerCase());
        });

  const filteredStudent =
    studentQuery === ""
      ? student_list
      : student_list.filter((item) => {
          const first_name = item.first_name?.toLowerCase() || "";
          const nick_name = item.nick_name?.toLowerCase() || "";
          return first_name.includes(studentQuery.toLowerCase()) || nick_name.includes(studentQuery.toLowerCase());
        });

  async function getData() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api1 = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_teacher/${searchDate}`;
    let api2 = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_student/${searchDate}`;

    const teacher = fetch(api1, config);
    const student = fetch(api2, config);
    Promise.all([student, teacher])
      .then(async ([response1, response2]) => {
        const res1 = await response1.json();
        const res2 = await response2.json();

        if (response1.ok) {
          setStudent_list(
            res1.list.map((i) => {
              return {
                attendance_id: i.id,
                id: i.student.id,
                first_name: i.student?.user.first_name,
                nick_name: i.student?.user.first_name,
                check_in_time: i.arrival_time,
                check_out_time: i.leave_time
              };
            })
          );
        } else {
          setInfo({
            show: true,
            success: false,
            msg: res1.detail
          });
        }

        if (response2.ok) {
          setTeacher_list(
            res2.list.map((i) => {
              return {
                attendance_id: i.id,
                id: i.teacher.id,
                first_name: i.teacher?.user.first_name,
                nick_name: i.teacher?.user.first_name,
                check_in_time: i.arrival_time,
                check_out_time: i.leave_time
              };
            })
          );
        } else {
          setInfo({
            show: true,
            success: false,
            msg: res2.detail
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function updateAttendance() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    let api = "";
    if (createData.type) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_teacher/${createData.url_id}/update`;
    } else {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_student/${createData.url_id}/update`;
    }

    const response = await fetch(api, config);
    const res = await response.json();

    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "補點名完成"
      });
      getData();
      setStateDialog(false);
      setCreateData(def_data);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  useEffect(() => {
    getData();
  }, [searchDate]);

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
      <Dialog
        open={stateDialog}
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
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-2xl text-blue-400 my-2 text-center">{createData.status}</div>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">日期</label>
                  <div className="mt-2">
                    <input
                      value={createData.date}
                      onChange={(e) => {
                        setCreateData({
                          ...createData,
                          date: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">時</label>
                  <select
                    value={createData.HH}
                    onChange={(e) => {
                      setCreateData({
                        ...createData,
                        HH: e.target.value,
                        attendance_time: `${e.target.value}:${createData.mm}`
                      });
                    }}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                  >
                    {/* <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option> */}
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">分</label>
                  <select
                    value={createData.mm}
                    onChange={(e) => {
                      setCreateData({
                        ...createData,
                        mm: e.target.value,
                        attendance_time: `${createData.HH}:${e.target.value}`
                      });
                    }}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                  >
                    <option value="00">00</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="45">45</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div className="col-span-6">
                  <label className="block text-sm/6 font-medium text-gray-900">備註</label>
                  <textarea
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    value={createData.remark}
                    rows={4}
                    onChange={(e) => {
                      setCreateData({
                        ...createData,
                        remark: e.target.value
                      });
                    }}
                  />
                </div>

                <div className="col-span-3">
                  <button
                    type="button"
                    onClick={() => {
                      updateAttendance();
                    }}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg text-green-600 ring-2 ring-green-600 hover:bg-green-200"
                  >
                    送出
                  </button>
                </div>
                <div className="col-span-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStateDialog(false);
                    }}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg text-red-600 ring-2 ring-red-600 hover:bg-red-200"
                  >
                    關閉
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 ">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end">
            <div className="flex">
              <h1 className="text-base font-semibold text-gray-900">老師</h1>
              <input
                value={teacherQuery}
                onChange={(e) => {
                  setTeacherQuery(e.target.value);
                }}
                className="px-2 py-1 ml-10 rounded-md"
                placeholder="姓名"
              />
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">日期搜尋</label>
              <div className="mt-2">
                <input
                  value={searchDate}
                  onChange={(e) => {
                    setSearchDate(e.target.value);
                  }}
                  type="date"
                  className="px-2 block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        中文名稱
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        英文名稱
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        到校時間
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        離校時間
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTeacher.map((teacher, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-100"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{teacher.first_name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{teacher.nick_name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{teacher.check_in_time ? teacher.check_in_time.substr(0, 8) : "未點名"}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {teacher.check_out_time ? teacher.check_out_time.substr(0, 8) : "未點名"}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <span
                            onClick={() => {
                              setCreateData({
                                ...createData,
                                id: teacher.attendance_id,
                                url_id: teacher.id,
                                status: "到校",
                                type: true
                              });
                              setStateDialog(true);
                            }}
                            className="text-green-600 hover:text-green-900 mx-2 cursor-pointer"
                          >
                            補到校<span className="sr-only">, {teacher.name}</span>
                          </span>
                          <span
                            onClick={() => {
                              setCreateData({
                                ...createData,
                                id: teacher.attendance_id,
                                url_id: teacher.id,
                                status: "離校",
                                type: true
                              });
                              setStateDialog(true);
                            }}
                            className="text-red-600 hover:text-red-900 mx-2 cursor-pointer"
                          >
                            補離校<span className="sr-only">, {teacher.name}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex justify-between items-end">
            <div className="flex">
              <h1 className="text-base font-semibold text-gray-900">學生</h1>
              <input
                value={studentQuery}
                onChange={(e) => {
                  setStudentQuery(e.target.value);
                }}
                className="px-2 py-1 ml-10 rounded-md"
                placeholder="姓名"
              />
            </div>
          </div>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        中文名稱
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        英文名稱
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        到校時間
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        離校時間
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudent.map((student, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-100"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{student.first_name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.nick_name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.check_in_time ? student.check_in_time.substr(0, 8) : "未點名"}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {student.check_out_time ? student.check_out_time.substr(0, 8) : "未點名"}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <span
                            onClick={() => {
                              setCreateData({
                                ...createData,
                                id: student.attendance_id,
                                url_id: student.id,
                                status: "到校",
                                type: false
                              });
                              setStateDialog(true);
                            }}
                            className="text-green-600 hover:text-green-900 mx-2 cursor-pointer"
                          >
                            補到校<span className="sr-only">, {student.name}</span>
                          </span>
                          <span
                            onClick={() => {
                              setCreateData({
                                ...createData,
                                id: student.attendance_id,
                                url_id: student.id,
                                status: "離校",
                                type: false
                              });
                              setStateDialog(true);
                            }}
                            className="text-red-600 hover:text-red-900 mx-2 cursor-pointer"
                          >
                            補離校<span className="sr-only">, {student.name}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
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
