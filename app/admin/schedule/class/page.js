"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XCircleIcon, UserIcon, CalendarIcon, MagnifyingGlassIcon, HomeIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import Alert from "../../alert";
import { error } from "../../../utils";

export default function Home() {
  const course_time_id = useRef();
  const type = useRef();
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [course_students, setCourse_Students] = useState([]);
  const [course_teacher, setCourse_teacher] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [item, setItem] = useState({});
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState({
    name: "",
    person_id: 0,
    begin: "",
    end: "",
    uuid: ""
  });
  const [grade, setGrade] = useState(0);

  const studentList = grade == 0 ? students : students.filter((i) => i.grade?.id == grade);
  let filterStudent =
    query === ""
      ? studentList
      : studentList.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const en_name = item.user.nick_name?.toLowerCase() || "";
          const tel = item.user.tel?.toLowerCase() || "";
          const school = item.school?.school_name?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || en_name.includes(query.toLowerCase()) || tel.includes(query.toLowerCase()) || school.includes(query.toLowerCase());
        });

  let filterTeacher =
    query === ""
      ? teacher
      : teacher.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const en_name = item.user.nick_name?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || en_name.includes(query.toLowerCase());
        });

  async function addStudent() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(select)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/student/${course_time_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_time_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateStudent() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(select)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/student/${course_time_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_time_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function addTeacher() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(select)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/teacher/${course_time_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_time_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateTeacher() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(select)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/teacher/${course_time_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_time_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getItems(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api1 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/${id}/get`, config);
    let api2 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?student_status_id=1`, config);
    let api3 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list?show_exit=false`, config);

    Promise.all([api1, api2, api3]).then(async ([response1, response2, response3]) => {
      const res1 = await response1.json();
      const res2 = await response2.json();
      const res3 = await response3.json();

      if (response1.ok) {
        setItem(res1.course[0]);
        setCourse_Students(res1.student || []);
        setCourse_teacher(res1.teacher);
      } else {
        const msg = error(response1.status, res1);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      if (response2.ok) {
        setStudents(res2.list.filter((i) => i.status.id != 3 || i.status.id != 4));
      } else {
        const msg = error(response2.status, res2);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      if (response3.ok) {
        setTeacher(res3.list.filter((i) => i.status.id != 5));
      } else {
        const msg = error(response3.status, res3);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    });
    setLoading(false);
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    course_time_id.current = id;
    getItems(id);
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-xl font-semibold leading-6 text-center">{select.name}</div>
              {type.current == 1 && (
                <div className="mt-2">
                  <label className="block text-sm font-semibold leading-6 ">起始日期</label>
                  <div>
                    <input
                      value={select.begin}
                      onChange={(e) => {
                        setSelect({
                          ...select,
                          begin: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                    />
                  </div>
                </div>
              )}

              <div className="mt-2">
                <label className="block text-sm font-semibold leading-6 ">結束日期</label>
                <div>
                  <input
                    value={select.end}
                    onChange={(e) => {
                      setSelect({
                        ...select,
                        end: e.target.value
                      });
                    }}
                    type="date"
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-1 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (status) {
                      if (type.current == 1) {
                        addStudent();
                      } else {
                        updateStudent();
                      }
                    } else {
                      if (type.current == 1) {
                        addTeacher();
                      } else {
                        updateTeacher();
                      }
                    }

                    setOpen(false);
                  }}
                  className="mx-1 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 sm:p-4">
        {/* <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">課程設定</h1>
        </div> */}

        {item && (
          <div className="border-b-2 border-gray-200 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            <div className="flex grid grid-cols-12">
              <h1 className="text-2xl col-span-4">{item.cname}</h1>
              <div className="flex items-center text-gray-500 col-span-6">
                <div className="flex">
                  <CalendarIcon className="h-5 w-5" />：
                </div>
                <div>
                  <div>
                    {item.start_date} ~ {item.end_date}（{item.wday}）
                  </div>
                  <div>
                    {item.start_time} ~ {item.end_time}
                  </div>
                </div>
              </div>
              <div className="flex items-center col-span-2">
                <HomeIcon className="h-5 w-5" />：{item.classroom_name}
              </div>
              {/* <div className="w-1/6 flex items-center">
                <UserIcon className="h-5 w-5" />：{item.teacher_list?.map((item) => item.user.first_name).join(", ")}
              </div> */}
            </div>
            <div className="my-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setStatus(true);
                }}
                className={`${status ? "border-red-300" : ""} mx-2 rounded-md px-2.5 py-1.5 text-sm font-semibold text-gray-600 shadow-sm border-2 hover:bg-gray-200`}
              >
                學生
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus(false);
                }}
                className={`${status ? "" : "border-red-300"} mx-2 rounded-md px-2.5 py-1.5 text-sm font-semibold text-gray-600 shadow-sm border-2 hover:bg-gray-200`}
              >
                老師
              </button>
            </div>
            {status ? (
              <div className="my-2">
                <div className="grid grid-cols-3 gap-4">
                  {course_students.map((person, index) => {
                    const today = new Date();
                    const end = new Date(person.end_date);

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          type.current = 2;
                          setSelect({
                            ...select,
                            name: person.first_name,
                            person_id: person.student_id,
                            uuid: person.uuid
                          });
                          setOpen(true);
                        }}
                        className={`${end < today ? "bg-gray-300" : "bg-white"} relative flex items-center space-x-3 rounded-lg border border-gray-300 px-3 py-2 shadow-sm hover:border-gray-400`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="focus:outline-none">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">{person.first_name}</p>
                              <p className="truncate text-sm text-gray-500">{person.nick_name}</p>
                            </div>

                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-400">{person.start_date}</p>
                              <p className="truncate text-sm text-red-400">{person.end_date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 hover:bg-red-400">
                          <XCircleIcon className="w-5 h-5 text-red-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="my-2">
                <div className="grid grid-cols-3 gap-4">
                  {course_teacher.map((person, index) => {
                    const today = new Date();
                    const end = new Date(person.end_date);

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          type.current = 2;
                          setSelect({
                            ...select,
                            name: person.first_name,
                            person_id: person.teacher_id,
                            uuid: person.uuid
                          });
                          setOpen(true);
                        }}
                        className={`${end < today ? "bg-gray-300" : "bg-white"} relative flex items-center space-x-3 rounded-lg border border-gray-300 px-3 py-2 shadow-sm hover:border-gray-400`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="focus:outline-none">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">{person.first_name}</p>
                              <p className="truncate text-sm text-gray-500">{person.nick_name}</p>
                            </div>

                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-400">{person.start_date}</p>
                              <p className="truncate text-sm text-red-400">{person.end_date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 hover:bg-red-400">
                          <XCircleIcon className="w-5 h-5 text-red-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-2 flex">
          <div className="relative rounded-md shadow-sm">
            <input
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              type="text"
              placeholder="姓名、學校、電話"
              className="p-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
          <div className="ml-4">
            <select
              onChange={(e) => {
                setGrade(e.target.value);
              }}
              className="p-2 block w-full rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
            >
              <option value="0">年級搜尋</option>
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
        </div>
        {status ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-2">
            {filterStudent.map((person, index) => (
              <div
                key={index}
                onClick={() => {
                  type.current = 1;
                  const today = new Date();
                  let start = "";
                  if (new Date(item.start_date) < today) {
                    const d = new Date(today.setDate(today.getDate() + 1));
                    start = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                  } else {
                    start = item.start_date;
                  }

                  setSelect({
                    ...select,
                    begin: start,
                    end: item.end_date,
                    name: person.user.first_name,
                    person_id: person.id
                  });
                  setOpen(true);
                }}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm hover:border-gray-400"
              >
                <div className="min-w-0 flex-1">
                  <div className="focus:outline-none">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    />
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{person.user.first_name}</p>
                      <p className="truncate text-sm text-gray-500">{person.user.nick_name}</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="truncate text-sm text-gray-500">{person.school?.school_name}</p>
                      <p className="truncate text-sm text-gray-500">{person.grade?.grade_name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 hover:bg-red-400">
                  <PlusCircleIcon className="w-5 h-5 text-green-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-4 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            {filterTeacher.map((person, index) => (
              <div
                key={index}
                onClick={() => {
                  type.current = 1;
                  const today = new Date();
                  let start = "";
                  if (new Date(item.start_date) < today) {
                    const d = new Date(today.setDate(today.getDate() + 1));
                    start = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                  } else {
                    start = item.start_date;
                  }

                  setSelect({
                    ...select,
                    begin: start,
                    end: item.end_date,
                    name: person.user.first_name,
                    person_id: person.id
                  });
                  setOpen(true);
                }}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm hover:border-gray-400"
              >
                <div className="min-w-0 flex-1">
                  <div className="focus:outline-none">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    />
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{person.user.first_name}</p>
                      <p className="truncate text-sm text-gray-500">{person.user.nick_name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 hover:bg-red-400">
                  <PlusCircleIcon className="w-5 h-5 text-green-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
