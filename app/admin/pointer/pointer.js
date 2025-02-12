"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";
import Alert from "../alert";

const def_data = {
  type: true, // true: teacher, false: student
  id: 0,
  photo: "",
  rollcall_status: 1,
  rollcall_method: 1
};

export default function Home({ setInfo }) {
  const [loading, setLoading] = useState(true);
  const [stateDialog, setStateDialog] = useState(false);
  const [student_list, setStudent_list] = useState([]);
  const [teacher_list, setTeacher_list] = useState([]);
  const [teacherQuery, setTeacherQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [createData, setCreateData] = useState(def_data);
  const [corseList, setCorseList] = useState([]);
  const [tutoring, setTutoring] = useState(0);

  const filteredTeacher =
    teacherQuery === ""
      ? teacher_list
      : teacher_list.filter((item) => {
          const first_name = item.first_name.toLowerCase() || "";
          const nick_name = item.nick_name?.toLowerCase() || "";
          return first_name.includes(teacherQuery.toLowerCase()) || nick_name.includes(teacherQuery.toLowerCase());
        });

  const filteredStudent =
    studentQuery === ""
      ? student_list
      : student_list.filter((item) => {
          const first_name = item.first_name.toLowerCase() || "";
          const nick_name = item.nick_name?.toLowerCase() || "";
          return first_name.includes(studentQuery.toLowerCase()) || nick_name.includes(studentQuery.toLowerCase());
        });

  async function getCourse(id, type) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api = "";
    if (type) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course/teacher/${id}/today`;
    } else {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course/student/${id}/today`;
    }

    const response = await fetch(api, config);
    const res = await response.json();

    if (response.ok) {
      setCorseList(res);
      setStateDialog(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function rollcall_teacher(data) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/rollcall_teacher/teacher`, config);
    const res = await response.json();

    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "點名完成"
      });
      setStateDialog(false);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: "錯誤，" + res.detail
      });
    }
  }

  async function attendance_teacher(data) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_teacher/?teacher_id=${createData.id}`, config);
    const res = await response.json();

    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "出席完成"
      });
      setStateDialog(false);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: "錯誤，" + res.detail
      });
    }
  }

  async function rollcall_student(data) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/rollcall_student/student`, config);
    const res = await response.json();

    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "點名完成"
      });
      setStateDialog(false);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: "錯誤，" + res.detail
      });
    }
  }

  async function attendance_student(data) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_student/?student_id=${createData.id}`, config);
    const res = await response.json();

    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "出席完成"
      });
      setStateDialog(false);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: "錯誤，" + res.detail
      });
    }
  }

  async function getData() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?student_status_id=1`;
    if (tutoring) {
      api += `&tutoring_id=${tutoring}`;
    }
    const student = fetch(api, config);
    const teacher = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list?show_exit=false`, config);
    Promise.all([student, teacher])
      .then(async ([response1, response2]) => {
        const res1 = await response1.json();
        const res2 = await response2.json();

        if (response1.ok) {
          setStudent_list(
            res1.list.map((i) => {
              return {
                id: i.id,
                photo: i.user.photo,
                first_name: i.user.first_name,
                nick_name: i.user.nick_name
              };
            })
          );
        } else {
          const msg = error(response1.status, res1);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (response2.ok) {
          setTeacher_list(
            res2.list.map((i) => {
              return {
                id: i.id,
                photo: i.user.photo,
                first_name: i.user.first_name,
                nick_name: i.user.nick_name
              };
            })
          );
        } else {
          const msg = error(response2.status, res2);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getData();
  }, [tutoring]);

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
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-2 gap-3">
                {corseList.map((course, index) => {
                  let bgc = "";
                  if (course.check_in_time == 0) {
                    if (course.check_out_time == 0) {
                      bgc = "bg-white";
                    } else {
                      bgc = "bg-red-100";
                    }
                  } else if (course.check_in_time > 0) {
                    if (course.check_in_time > course.check_out_time) {
                      bgc = "bg-green-200";
                    } else if (course.check_in_time == course.check_out_time) {
                      bgc = "bg-gray-400";
                    } else {
                      bgc = "bg-red-100";
                    }
                  }
                  return (
                    <div
                      key={index}
                      className="col-span-1 my-2"
                    >
                      <div className={`${bgc} flex justify-around items-center px-3 py-2 font-semibold rounded-t-lg text-gray-600 ring-2 ring-gray-600`}>
                        <div>
                          <span className="text-gray-700 text-lg">{course.course_name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {" "}
                          <div>{course.start_time.substr(0, 5)}</div>
                          <div>{course.end_time.substr(0, 5)}</div>
                        </div>
                        <div>
                          <span className={`${course.leave_type == 1 ? "text-sky-500" : "text-pink-500"}`}>{course.content}</span>
                        </div>
                      </div>
                      <div className={`${bgc} flex justify-center px-3 py-2 text-sm font-semibold rounded-b-lg text-gray-600 ring-2 ring-gray-600`}>
                        <button
                          type="button"
                          onClick={() => {
                            if (createData.type) {
                              rollcall_teacher({
                                rollcall_status: 2,
                                rollcall_method: 1,
                                tutoring_course_schedule_id: course.course_id,
                                tcst_id: course.pointer_id
                              });
                            } else {
                              rollcall_student({
                                rollcall_status: 2,
                                rollcall_method: 1,
                                tutoring_course_schedule_id: course.course_id,
                                tcss_id: course.pointer_id
                              });
                            }
                          }}
                          className="px-3 py-2 mx-1 text-sm font-semibold rounded-lg bg-green-500 text-gray-100 hover:bg-green-900"
                        >
                          上課(次數：{course.check_in_time})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (createData.type) {
                              rollcall_teacher({
                                rollcall_status: 3,
                                rollcall_method: 1,
                                tutoring_course_schedule_id: course.course_id,
                                tcst_id: course.pointer_id
                              });
                            } else {
                              rollcall_student({
                                rollcall_status: 3,
                                rollcall_method: 1,
                                tutoring_course_schedule_id: course.course_id,
                                tcss_id: course.pointer_id
                              });
                            }
                          }}
                          className="px-3 py-2 mx-1 text-sm font-semibold rounded-lg bg-red-500 text-gray-100 hover:bg-red-900"
                        >
                          下課(次數：{course.check_out_time})
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="col-span-2 flex justify-center ">
                  <button
                    type="button"
                    onClick={() => {
                      if (createData.type) {
                        attendance_teacher({
                          ...createData,
                          status: "到校"
                        });
                      } else {
                        attendance_student({
                          ...createData,
                          status: "到校"
                        });
                      }
                    }}
                    className="mx-2 px-3 py-2 text-sm font-semibold rounded-lg text-green-600 ring-2 ring-green-600 hover:bg-green-200"
                  >
                    到校
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (createData.type) {
                        attendance_teacher({
                          ...createData,
                          status: "離校"
                        });
                      } else {
                        attendance_student({
                          ...createData,
                          status: "離校"
                        });
                      }
                    }}
                    className="mx-2 px-3 py-2 text-sm font-semibold rounded-lg text-red-600 ring-2 ring-red-600 hover:bg-red-200"
                  >
                    離校
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStateDialog(false);
                    }}
                    className="mx-2 px-3 py-2 text-sm font-semibold rounded-lg text-gray-400 ring-2 ring-gray-400 hover:bg-gray-100"
                  >
                    關閉
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 flex">
        <div className="w-1/2 px-1">
          <div className="border-b-2 text-blue-400 text-xl my-4 flex items-end">
            老師
            <input
              value={teacherQuery}
              onChange={(e) => {
                setTeacherQuery(e.target.value);
              }}
              className="px-2 py-1 ml-2 rounded-md"
              placeholder="姓名"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 h-70vh overflow-auto px-1">
            {filteredTeacher.map((i, index) => (
              <div
                key={index}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-pink-50 px-6 py-5 shadow-sm hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setCreateData({
                    ...createData,
                    type: true,
                    id: i.id
                  });
                  getCourse(i.id, true);
                }}
              >
                <div className="shrink-0">
                  {i.photo ? (
                    <img
                      alt=""
                      src={i.photo}
                      className="size-10 rounded-full"
                    />
                  ) : (
                    <span className="inline-block size-10 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="size-full text-gray-300"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="focus:outline-none">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    />
                    <p className="text-sm font-medium text-gray-900">{i.first_name}</p>
                    <p className="truncate text-sm text-gray-500">{i.nick_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 px-1">
          <div className="border-b-2 text-blue-400 text-xl my-4 flex items-end">
            學生
            <input
              value={studentQuery}
              onChange={(e) => {
                setStudentQuery(e.target.value);
              }}
              className="px-2 py-1 ml-2 rounded-md"
              placeholder="姓名"
            />
            <span className="isolate inline-flex rounded-md shadow-sm mx-2">
              <button
                onClick={() => {
                  setTutoring(1);
                }}
                type="button"
                className={`${
                  tutoring == 1 ? "bg-yellow-100" : "bg-white"
                } relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
              >
                多易
              </button>
              <button
                onClick={() => {
                  setTutoring(2);
                }}
                type="button"
                className={`${tutoring == 2 ? "bg-yellow-100" : "bg-white"} relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
              >
                艾思
              </button>
              <button
                onClick={() => {
                  setTutoring(3);
                }}
                type="button"
                className={`${
                  tutoring == 3 ? "bg-yellow-100" : "bg-white"
                } relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300`}
              >
                華而敦
              </button>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 h-70vh overflow-auto px-1">
            {filteredStudent.map((i, index) => (
              <div
                onClick={() => {
                  setCreateData({
                    ...createData,
                    type: false,
                    id: i.id
                  });
                  getCourse(i.id), false;
                }}
                key={index}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-yellow-50 px-6 py-5 shadow-sm hover:bg-blue-100 cursor-pointer"
              >
                <div className="shrink-0">
                  {i.photo ? (
                    <img
                      alt=""
                      src={i.photo}
                      className="size-10 rounded-full"
                    />
                  ) : (
                    <span className="inline-block size-10 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="size-full text-gray-300"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="focus:outline-none">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    />
                    <p className="text-sm font-medium text-gray-900">{i.first_name}</p>
                    <p className="truncate text-sm text-gray-500">{i.nick_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
