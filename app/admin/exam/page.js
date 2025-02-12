"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import { Label, Dialog, DialogPanel, DialogBackdrop, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const y = new Date().getFullYear() - 1911;
const year = [y - 1, y, y + 1];

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

const def_create = {
  student_id: 0,
  student: {},
  school_year: 0,
  semester: 0,
  semesterItem: {},
  exam_date: "",
  course_no: "",
  exam_type: 0,
  exam_name: "",
  exam_scope: "",
  is_makeup: false,
  score: 0,
  class_rank: 0,
  school_rank: 0
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [studentExam, setStudentExam] = useState([]);
  const [course, setCourse] = useState([]);
  const [query, setQuery] = useState("");
  const [create, setCreate] = useState(def_create);
  const [update, setUpdate] = useState({});
  const [open, setOpen] = useState(false);

  const filteredStudent =
    query === ""
      ? studentList
      : studentList.filter((i) => {
          const name = i.name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

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

  async function getExam(student_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_student_exam/list?student_id=${student_id}`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setStudentExam(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function createExam() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_student_exam/`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      getExam(create.student_id);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateExam() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_student_exam/`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      getExam(create.student_id);
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

  async function deleteExam(id) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_student_exam/`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      getExam(create.student_id);
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

  async function getStudentList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?student_status_id=1`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setStudentList(
        res.list.map((person) => {
          return {
            student_id: person.id,
            name: person.user.first_name
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
    getStudentList();
    getCourse();
    if (create.student_id != 0) {
      getExam(create.student_id);
    }
  }, [create.student_id]);

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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">姓名</label>
                  <div className="mt-2 grid grid-cols-1 text-blue-600">{update.student_c_name}</div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">學年度</label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={update.school_year}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
                          school_year: Number(e.target.value)
                        });
                      }}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                    >
                      {update.school_year == 0 && <option value={0}>請選擇學年</option>}
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
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={update.semester}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
                          semester: Number(e.target.value)
                        });
                      }}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                    >
                      {update.semester == 0 && <option value={0}>請選擇學年</option>}
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
                  <label className="block text-sm/6 font-medium text-gray-900">測驗日期</label>
                  <div className="mt-2">
                    <input
                      value={update.exam_date}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
                          exam_date: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">科目</label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={update.course_no}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
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
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={update.exam_type}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
                          exam_type: e.target.value
                        });
                      }}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                    >
                      {update.exam_type == 0 && <option value={0}>請選擇學年</option>}
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
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">測驗名稱</label>
                  <div className="mt-2">
                    <input
                      value={update.exam_name}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
                          exam_name: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">測驗範圍</label>
                  <div className="mt-2">
                    <input
                      value={update.exam_scope}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
                          exam_scope: e.target.value
                        });
                      }}
                      type="text"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">測驗成績</label>
                  <div className="mt-2">
                    <input
                      value={update.score}
                      onChange={(e) => {
                        setUpdate({
                          ...update,
                          score: Number(e.target.value)
                        });
                      }}
                      type="number"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                    />
                  </div>
                </div>
                {/* <label className="block text-sm/6 font-medium text-gray-900 col-span-3">APP顯示</label>
                {course.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (update.tutoring_course_ids.some((i) => i == item.id)) {
                        setUpdate({
                          ...create,
                          tutoring_course_ids: update.tutoring_course_ids.filter((i) => i != item.id)
                        });
                      } else {
                        setUpdate({
                          ...update,
                          tutoring_course_ids: [...update.tutoring_course_ids, item.id]
                        });
                      }
                    }}
                    className={`${
                      create.tutoring_course_ids.some((i) => i == item.id) ? "bg-green-100" : "bg-white"
                    } my-1 rounded-md px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300`}
                  >
                    {item.course_name}
                  </div>
                ))} */}
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="inline-flex mx-1 justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={updateExam}
                  className="inline-flex mx-1 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        <div className="flex items-end my-2">
          <h1 className="text-lg font-semibold text-gray-900">學生成績單</h1>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-1 bg-white p-2">
            <Combobox
              as="div"
              value={create.student}
              onChange={(person) => {
                setQuery("");
                if (person) {
                  setCreate({
                    ...create,
                    student_id: person.student_id,
                    student: person
                  });
                }
              }}
            >
              <Label className="block text-sm/6 font-medium text-gray-900">學生</Label>
              <div className="relative mt-2">
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

                {filteredStudent.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredStudent.map((person) => (
                      <ComboboxOption
                        key={person.student_id}
                        value={person}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                      >
                        <span className="block truncate group-data-[selected]:font-semibold">{person?.name}</span>

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
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">學年度</label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={create.schoolYear}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      school_year: e.target.value
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {create.school_year == 0 && <option value={0}>請選擇學年</option>}
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
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={create.semester}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      semester: e.target.value
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {create.semester == 0 && <option value={0}>請選擇學期</option>}
                  {semester.map((item, index) => (
                    <option
                      key={index}
                      value={item.id}
                    >
                      {item.name}
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
              <label className="block text-sm/6 font-medium text-gray-900">測驗日期</label>
              <div className="mt-2">
                <input
                  value={create.exam_date}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      exam_date: e.target.value
                    });
                  }}
                  type="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">科目</label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={create.course_no}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      course_no: e.target.value,
                      exam_name: course.filter((i) => i.id == e.target.value)[0].name
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {create.course_no == 0 && <option value={0}>請選擇科目</option>}
                  {course.map((group, index) => (
                    <option
                      key={index}
                      value={group.id}
                    >
                      {group.name}
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
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={create.exam_type}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      exam_type: e.target.value,
                      exam_scope: exam_type.filter((i) => i.id == e.target.value)[0].name
                    });
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                >
                  {create.exam_type == 0 && <option value={0}>請選擇類別</option>}
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
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">測驗名稱</label>
              <div className="mt-2">
                <input
                  value={create.exam_name}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      exam_name: e.target.value
                    });
                  }}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">測驗範圍</label>
              <div className="mt-2">
                <input
                  value={create.exam_scope}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      exam_scope: e.target.value
                    });
                  }}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="col-span-1 ">
                <label className="block text-sm/6 font-medium text-gray-900">測驗成績</label>
                <div className="mt-2">
                  <input
                    value={create.score}
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        score: Number(e.target.value)
                      });
                    }}
                    type="number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                  />
                </div>
              </div>
              <div className="col-span-1 ">
                <label className="block text-sm/6 font-medium text-gray-900">班排</label>
                <div className="mt-2">
                  <input
                    value={create.class_rank}
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        class_rank: Number(e.target.value)
                      });
                    }}
                    type="number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                  />
                </div>
              </div>
              <div className="col-span-1 ">
                <label className="block text-sm/6 font-medium text-gray-900">校排</label>
                <div className="mt-2">
                  <input
                    value={create.school_rank}
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        school_rank: Number(e.target.value)
                      });
                    }}
                    type="number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300"
                  />
                </div>
              </div>
            </div>
            <div className="mt-1 flex justify-center">
              <button
                onClick={createExam}
                type="button"
                className="rounded bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                送出
              </button>
            </div>
          </div>
          {/* <div className="col-span-1 bg-white p-2">
            <div className="h-80vh overflow-auto">
              <label className="block text-sm/6 font-medium text-gray-900">APP顯示</label>
              {course.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (create.tutoring_course_ids.some((i) => i == item.id)) {
                      setCreate({
                        ...create,
                        tutoring_course_ids: create.tutoring_course_ids.filter((i) => i != item.id)
                      });
                    } else {
                      setCreate({
                        ...create,
                        tutoring_course_ids: [...create.tutoring_course_ids, item.id]
                      });
                    }
                  }}
                  className={`${
                    create.tutoring_course_ids.some((i) => i == item.id) ? "bg-green-100" : "bg-white"
                  } my-1 rounded-md px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300`}
                >
                  {item.course_name}
                </div>
              ))}
            </div>
          </div> */}
          <div className="col-span-4 bg-white p-2">
            <table className="min-w-full divide-y divide-gray-300 h-80vh overflow-auto">
              <thead className="border-2 bg-yellow-50 text-center">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    學年
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    類別
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    科目
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    日期
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    考試名稱
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    考試範圍
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    成績
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    班排
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    校排
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  ></th>
                </tr>
              </thead>
              <tbody className="">
                {studentExam.map((person, index) => (
                  <tr
                    key={index}
                    className="text-sm text-left border-2 divide-x divide-gray-200 hover:bg-blue-100"
                  >
                    <td className="py-3 px-2">
                      {person.school_year}-{semester.filter((i) => (i.id = person.semester))[0]?.name}
                    </td>
                    <td className="py-3 px-2">{exam_type.filter((i) => i.id == person.exam_type)[0]?.name}</td>
                    <td className="py-3 px-2">{course.filter((i) => i.id == person.course_no)[0]?.name}</td>
                    <td className="py-3 px-2">{person.exam_date}</td>
                    <td className="py-3 px-2">{person.exam_name}</td>
                    <td className="py-3 px-2">{person.exam_scope}</td>
                    <td className="py-3 px-2">{person.score}</td>
                    <td className="py-3 px-2">{person.class_rank == 0 ? "" : person.class_rank}</td>
                    <td className="py-3 px-2">{person.school_rank == 0 ? "" : person.school_rank}</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => {
                          setUpdate(person);
                          setOpen(true);
                        }}
                        type="button"
                        className="mx-1 rounded bg-orange-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-500"
                      >
                        修改
                      </button>
                      <button
                        onClick={() => {
                          const check = confirm(`確定要刪除此筆資料嗎？`);
                          if (check) {
                            deleteExam(person.id);
                          }
                        }}
                        type="button"
                        className="mx-1 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
