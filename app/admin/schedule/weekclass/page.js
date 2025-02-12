"use client";

import { useEffect, useRef, useState } from "react";
import { Week, Classroom, Teacher } from "../select";
import { Dialog, DialogBackdrop, DialogPanel, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Switch } from "@headlessui/react";
import { CalendarIcon, ChevronUpDownIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Alert from "../../alert";
import { error } from "../../../utils";
import DatePicker, { Calendar } from "react-multi-date-picker";

const week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const def = {
  course_date: "",
  start_time: "",
  end_time: "",
  teacherList: [],
  studentList: []
};

const def_create = {
  s_h: "09",
  s_m: "00",
  e_h: "09",
  e_m: "00",
  week: 0,
  begin: "",
  end: "",
  start_time: "09:00",
  end_time: "09:00",
  classroom_id: 0,
  teacher_id_list: []
};

const def_classroom = {
  course_time_id: 0,
  classroom_id: 0
};

const def_time = {
  s_h: "09",
  s_m: "00",
  e_h: "09",
  e_m: "00",
  begin: "",
  start_time: "09:00",
  end_time: "09:00"
};

const def_close = {
  begin: ""
};

export default function Home() {
  const check_type = useRef(1);
  const submit_type = useRef();
  const course_id = useRef();
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [course, setCourse] = useState();
  const [courseTime, setCourseTime] = useState();

  const [checkedDialog, setCheckedDialog] = useState(false);

  const [createDialog, setCreateDialog] = useState(false);
  const [create, setCreate] = useState(def_create);

  const [updateTimeDialog, setUpdateTimeDialog] = useState(false);
  const [updateTime, setUpdateTime] = useState(def_time);

  const [updateClassroomDialog, setUpdateClassroomDialog] = useState(false);
  const [updateClassroom, setUpdateClassroom] = useState(def_classroom);

  const [closeDialog, setCloseDialog] = useState(false);
  const [close, setClose] = useState(def_close);

  const [loading, setLoading] = useState(true);
  const [righting, setRighting] = useState(false);
  const [extLog, setExtLog] = useState(false);
  const [checkConflict, setCheckConflict] = useState(true);
  const [classroom, setClassroom] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [student, setStudent] = useState([]);

  const [selected, setSelected] = useState({
    start_time: "",
    end_time: "9:00:00"
  });
  const [extData, setExtData] = useState(def);
  const [conflict, setConflict] = useState([]);
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState(0);

  const filteredTeacher =
    query === ""
      ? teacher
      : teacher.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const e_name = item.user.nick_name?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || e_name.includes(query.toLowerCase());
        });

  const studentList = grade == 0 ? student : student.filter((i) => i.grade?.id == grade);

  const filteredStudent =
    query === ""
      ? studentList
      : studentList.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const e_name = item.user.nick_name?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || e_name.includes(query.toLowerCase());
        });

  async function getConflict() {
    if (!extData.course_date) {
      setInfo({
        show: true,
        success: false,
        msg: "請填寫日期"
      });
      return;
    }
    if (!extData.start_time || !extData.end_time) {
      setInfo({
        show: true,
        success: false,
        msg: "請填寫時間"
      });
      return;
    }
    // return;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teacher: extData.teacherList,
        student: extData.studentList,
        start: extData.course_date,
        end: extData.course_date,
        start_time: extData.start_time,
        end_time: extData.end_time
      })
    };
    const response = await fetch(`/api/conflict`, config);
    const res = await response.json();
    if (response.ok) {
      setConflict(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "查詢錯誤"
      });
    }
  }

  async function getTimeStudent() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/all_student/${course_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      setExtData({
        ...extData,
        studentList: res.map((i) => i.student_id)
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "查詢錯誤" + msg
      });
    }
  }

  async function addItem() {
    if (create.week?.toString() == "") {
      setInfo({ show: true, success: false, msg: "請填寫上課日期" });
      return;
    }
    if (!create.start_time) {
      setInfo({ show: true, success: false, msg: "請填寫上課時間" });
      return;
    }
    if (!create.end_time) {
      setInfo({ show: true, success: false, msg: "請填寫下課時間" });
      return;
    }
    if (create.begin > create.end) {
      setInfo({ show: true, success: false, msg: "日期區間錯誤" });
      return;
    }

    if (new Date(`${create.begin} ${create.start_time}`) > new Date(`${create.begin} ${create.end_time}`)) {
      setInfo({ show: true, success: false, msg: "時間區間錯誤" });
      return;
    }

    setRighting(true);
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...create, checkConflict })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/?tutoring_course_id=${course_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
      setCreateDialog(false);
      setCheckedDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setRighting(false);
  }

  async function putClassroom() {
    if (updateClassroom.classroom_id == 0) {
      setInfo({ show: true, success: false, msg: "請選擇教室" });
      return;
    }
    setRighting(true);
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateClassroom)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/classroom`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
      setUpdateClassroomDialog(false);
      setUpdateClassroom(def_classroom);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setRighting(false);
  }

  async function putTime() {
    if (!updateTime.begin) {
      setInfo({ show: true, success: false, msg: "請填寫起始日期" });
      return;
    }
    if (!updateTime.start_time) {
      setInfo({ show: true, success: false, msg: "請填寫上課時間" });
      return;
    }
    if (!updateTime.end_time) {
      setInfo({ show: true, success: false, msg: "請填寫下課時間" });
      return;
    }

    if (new Date(`${updateTime.begin} ${updateTime.start_time}`) > new Date(`${updateTime.begin} ${updateTime.end_time}`)) {
      setInfo({ show: true, success: false, msg: "時間區間錯誤" });
      return;
    }

    setRighting(true);
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateTime)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/change_time`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
      setUpdateTimeDialog(false);
      setUpdateTime(def_time);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setRighting(false);
  }

  async function deleteItem() {
    const check = confirm(`確定要刪除嗎？`);
    if (!check) {
      return;
    }
    setRighting(true);
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(close)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/${close.course_time_id}`, config);
    const res = await response.json();
    if (response.ok) {
      getItems(course_id.current);
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
    setRighting(false);
  }

  async function getItems(id) {
    setLoading(true);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const course = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course/${id}`, config);
    const course_time = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/list?tutoring_course_id=${id}`, config);
    const teacher = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list?show_exit=false`, config);
    const student = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?student_status_id=1`, config);
    const classroom = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/classroom/list`, config);
    Promise.all([course, course_time, teacher, classroom, student])
      .then(async ([response1, response2, response3, response4, response5]) => {
        const res1 = await response1.json();
        const res2 = await response2.json();
        const res3 = await response3.json();
        const res4 = await response4.json();
        const res5 = await response5.json();

        if (response1.ok) {
          setCourse(res1);
        } else {
          const msg = error(response1.status, res1);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (response2.ok) {
          setCourseTime(res2.list);
        } else {
          const msg = error(response2.status, res2);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (response3.ok) {
          setTeacher(res3.list.filter((i) => i.status.id != 4 && i.status.id != 5));
        } else {
          const msg = error(response3.status, res3);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (response4.ok) {
          setClassroom(res4.list);
        } else {
          const msg = error(response4.status, res4);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (response5.ok) {
          setStudent(res5.list.filter((i) => i.status.id != 4 && i.status.id != 5));
        } else {
          const msg = error(response5.status, res5);
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

  async function deleteCourse() {
    const check = confirm(`確定要刪除嗎？`);
    if (!check) {
      return;
    }
    setRighting(true);
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course/close/${course_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "資料已修改"
      });
      window.location.href = "../";
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setRighting(false);
  }

  // 加課
  async function exc() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(extData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/modification/exc?tutoring_course_id=${course_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/course?id=${res.id}`;
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
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    course_id.current = id;
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

  if (righting) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料生成中需要一點時間請稍後...</span>
      </div>
    );
  }

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      {/* 確認視窗 */}
      <Dialog
        open={checkedDialog}
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
              <div className="">
                <div className="text-center text-blue-600 text-xl mb-2">確認資訊</div>
                {check_type.current == 1 && (
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1">
                      <div className="text-left text-gray-500">日期：</div>
                    </div>
                    <div className="col-span-2">
                      <div>
                        {create.begin} ~ {create.end}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-left text-gray-500">星期：</div>
                    </div>
                    <div className="col-span-2">
                      <div>{week[create.week]}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-left text-gray-500">時間：</div>
                    </div>
                    <div className="col-span-2">
                      <div>
                        {create.start_time} ~ {create.end_time}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-left text-gray-500">老師：</div>
                    </div>
                    <div className="col-span-2">
                      <div>
                        {teacher
                          .filter((person) => create.teacher_id_list?.some((i) => i == person.id))
                          .map((person) => person.user.first_name)
                          .join(", ")}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-left text-gray-500">教室：</div>
                    </div>
                    <div className="col-span-2">
                      <div>{classroom.filter((i) => i.id == create.classroom_id)[0]?.classroom_name}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-left text-gray-500">判斷衝堂：</div>
                    </div>
                    <div className="col-span-2">
                      <div>{checkConflict ? "開啟" : "關閉"}</div>
                    </div>
                  </div>
                )}
                {check_type.current == 2 && (
                  <div className="grid grid-cols-4 ring-1 text-center">
                    <div className="col-span-1 ring-1">
                      <div className="font-semibold px-2 py-1">日期</div>
                    </div>
                    <div className="col-span-3 ring-1">
                      <div className="text-gray-500 px-2 py-1">{extData.course_date}</div>
                    </div>

                    <div className="col-span-1 ring-1">
                      <div className="font-semibold px-2 py-1">時間</div>
                    </div>
                    <div className="col-span-3 ring-1">
                      <div className="text-gray-500 px-2 py-1">
                        {extData.start_time.substr(0, 5)} ~ {extData.end_time.substr(0, 5)}
                      </div>
                    </div>

                    <div className="col-span-1 ring-1">
                      <div className="font-semibold px-2 py-1">老師</div>
                    </div>
                    <div className="col-span-3 ring-1">
                      <div className="text-gray-500 px-2 py-1">
                        {teacher
                          .filter((person) => extData.teacherList?.some((i) => i == person.id))
                          .map((person) => person.user.first_name)
                          .join(", ")}
                      </div>
                    </div>

                    <div className="col-span-1 ring-1">
                      <div className="font-semibold px-2 py-1">學生</div>
                    </div>
                    <div className="col-span-3 ring-1">
                      <div className="text-gray-500 px-2 py-1">
                        {student
                          .filter((person) => extData.studentList?.some((i) => i == person.id))
                          .map((person) => person.user.first_name)
                          .join(", ")}
                      </div>
                    </div>

                    <div className="col-span-1 ring-1">
                      <div className="font-semibold px-2 py-1">備註</div>
                    </div>
                    <div className="col-span-3 ring-1">
                      <div className="text-gray-500 px-2 py-1">{extData.remark}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setCheckedDialog(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (check_type.current == 1) {
                      addItem();
                    }
                    if (check_type.current == 2) {
                      exc();
                    }
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 新增視窗 */}
      <Dialog
        open={createDialog}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 row-span-3">
                  <label className="block text-sm font-semibold leading-6 ">日期範圍</label>
                  <div className="flex mb-2">
                    <input
                      value={create.begin}
                      onChange={(e) => {
                        setCreate({
                          ...create,
                          begin: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-1/2 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                    />
                    <input
                      value={create.end}
                      onChange={(e) => {
                        setCreate({
                          ...create,
                          end: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-1/2 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                    />
                  </div>
                  <div className="flex justify-center">
                    <Calendar
                      value={[create.begin, create.end]}
                      onChange={(value) => {
                        if (value[1]) {
                          setCreate({
                            ...create,
                            begin: value[0].format("YYYY-MM-DD"),
                            end: value[1].format("YYYY-MM-DD")
                          });
                        }
                      }}
                      range
                      rangeHover
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">上課週</label>
                  <select
                    value={create.week}
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        week: e.target.value
                      });
                    }}
                    className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                  >
                    <option value={0}>星期一</option>
                    <option value={1}>星期二</option>
                    <option value={2}>星期三</option>
                    <option value={3}>星期四</option>
                    <option value={4}>星期五</option>
                    <option value={5}>星期六</option>
                    <option value={6}>星期日</option>
                  </select>
                </div>

                <Listbox
                  as="div"
                  value={create.teacher_id_list}
                  multiple
                >
                  <Label className="block text-sm font-medium leading-6 text-gray-900">老師</Label>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                      <span className="block truncate">
                        {teacher
                          .filter((person) => create.teacher_id_list?.some((i) => i == person.id))
                          .map((person) => person.user.first_name)
                          .join(", ") || "請選擇老師"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-gray-400"
                        />
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                    >
                      {teacher.map((person) => (
                        <ListboxOption
                          key={person.id}
                          value={person}
                          className={`group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ${create.teacher_id_list?.some((id) => id === person.id) ? "bg-blue-400 text-white" : ""}`}
                          onClick={() => {
                            if (create.teacher_id_list?.some((id) => id === person.id)) {
                              setCreate({
                                ...create,
                                teacher_id_list: create.teacher_id_list.filter((id) => id !== person.id)
                              });
                            } else {
                              setCreate({
                                ...create,
                                teacher_id_list: [...create.teacher_id_list, person.id]
                              });
                            }
                          }}
                        >
                          <span className="block truncate font-normal">{person.user.first_name}</span>
                          {selected.teacher_id_list?.some((id) => id === person.id) && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                              <CheckIcon
                                aria-hidden="true"
                                className="h-5 w-5"
                              />
                            </span>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>

                <div className="">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">起始時間</label>
                  <div className="flex">
                    <select
                      value={create.s_h}
                      onChange={(e) => {
                        setCreate({
                          ...create,
                          s_h: e.target.value,
                          start_time: `${e.target.value.padStart(2, "0")}:${create.s_m.toString().padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 14 }, (_, index) => {
                        return (
                          <option
                            key={index + 9}
                            value={index + 9}
                          >
                            {index + 9}時
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={create.s_m}
                      onChange={(e) => {
                        setCreate({
                          ...create,
                          s_m: e.target.value,
                          start_time: `${create.s_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 12 }, (_, index) => {
                        return (
                          <option
                            key={index * 5}
                            value={index * 5}
                          >
                            {index * 5}分
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">結束時間</label>
                  <div className="flex">
                    <select
                      value={create.e_h}
                      onChange={(e) => {
                        setCreate({
                          ...create,
                          e_h: e.target.value,
                          end_time: `${e.target.value.padStart(2, "0")}:${create.e_m.toString().padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 14 }, (_, index) => {
                        return (
                          <option
                            key={index + 9}
                            value={index + 9}
                          >
                            {index + 9}時
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={create.e_m}
                      onChange={(e) => {
                        setCreate({
                          ...create,
                          e_m: e.target.value,
                          end_time: `${create.e_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 12 }, (_, index) => {
                        return (
                          <option
                            key={index * 5}
                            value={index * 5}
                          >
                            {index * 5}分
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">教室</label>
                  <select
                    value={create.classroom_id}
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        classroom_id: e.target.value
                      });
                    }}
                    className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                  >
                    <option>請選擇教室</option>
                    {classroom.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.classroom_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setCreateDialog(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    check_type.current = 1;
                    setCheckedDialog(true);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  送出
                </button>

                <div className="flex mt-2">
                  <Switch
                    checked={checkConflict}
                    onChange={(e) => {
                      setCheckConflict(e);
                    }}
                    className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-400 transition-colors duration-200 ease-in-out data-[checked]:bg-red-600"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                    />
                  </Switch>
                  <label className="mx-2 block text-sm font-medium leading-6 text-red-600">是否判斷衝堂</label>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 教室視窗 */}
      <Dialog
        open={updateClassroomDialog}
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
                <label className="block text-sm font-medium leading-6 text-gray-900">教室</label>
                <select
                  value={updateClassroom.classroom_id}
                  onChange={(e) => {
                    setUpdateClassroom({
                      ...updateClassroom,
                      classroom_id: Number(e.target.value)
                    });
                  }}
                  className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                >
                  <option>請選擇教室</option>
                  {classroom.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.classroom_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setUpdateClassroomDialog(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    putClassroom();
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 時間視窗 */}
      <Dialog
        open={updateTimeDialog}
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
              <div className="">
                <label className="block text-sm font-semibold leading-6 ">起始日期</label>
                <div className="flex justify-center">
                  <Calendar
                    value={updateTime.begin}
                    onChange={(value) => {
                      if (value) {
                        setUpdateTime({
                          ...updateTime,
                          begin: value.format("YYYY-MM-DD")
                        });
                      }
                    }}
                  />
                </div>
                <div className="">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">起始時間</label>
                  <div className="flex">
                    <select
                      value={updateTime.s_h}
                      onChange={(e) => {
                        setUpdateTime({
                          ...updateTime,
                          s_h: e.target.value,
                          start_time: `${e.target.value.padStart(2, "0")}:${updateTime.s_m.toString().padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 14 }, (_, index) => {
                        return (
                          <option
                            key={index + 9}
                            value={index + 9}
                          >
                            {index + 9}時
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={updateTime.s_m}
                      onChange={(e) => {
                        setUpdateTime({
                          ...updateTime,
                          s_m: e.target.value,
                          start_time: `${updateTime.s_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 12 }, (_, index) => {
                        return (
                          <option
                            key={index * 5}
                            value={index * 5}
                          >
                            {index * 5}分
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">結束時間</label>
                  <div className="flex">
                    <select
                      value={updateTime.e_h}
                      onChange={(e) => {
                        setUpdateTime({
                          ...updateTime,
                          e_h: e.target.value,
                          end_time: `${e.target.value.padStart(2, "0")}:${updateTime.e_m.toString().padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 14 }, (_, index) => {
                        return (
                          <option
                            key={index + 9}
                            value={index + 9}
                          >
                            {index + 9}時
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={updateTime.e_m}
                      onChange={(e) => {
                        setUpdateTime({
                          ...updateTime,
                          e_m: e.target.value,
                          end_time: `${updateTime.e_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 12 }, (_, index) => {
                        return (
                          <option
                            key={index * 5}
                            value={index * 5}
                          >
                            {index * 5}分
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setUpdateTimeDialog(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    putTime();
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 關閉視窗 */}
      <Dialog
        open={closeDialog}
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
              <div className="">
                <label className="block text-sm font-semibold leading-6 ">結束日期</label>
                <div className="flex justify-center">
                  <Calendar
                    value={close.begin}
                    onChange={(value) => {
                      if (value) {
                        setClose({
                          ...close,
                          begin: value.format("YYYY-MM-DD")
                        });
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setCloseDialog(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteItem();
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 加課 */}
      <Dialog
        open={extLog}
        onClose={setExtLog}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full justify-center text-center">
            <DialogPanel
              transition
              className="relative p-2 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:w-full data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <span className="flex justify-between items-center">
                <span className="text-3xl font-semibold text-blue-600">加課</span>
                <button
                  onClick={() => {
                    setExtLog(false);
                  }}
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 hover:text-red-300 focus:z-10"
                >
                  <XMarkIcon className="h-10 w-10" />
                </button>
              </span>
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold leading-6 ">加課日期</label>
                  <div className="mt-2">
                    <input
                      value={extData.course_date}
                      onChange={(e) => {
                        setExtData({
                          ...extData,
                          course_date: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold leading-6 ">上課時間</label>
                  <div className="mt-2">
                    <input
                      step="900"
                      value={extData.start_time}
                      onChange={(e) => {
                        setExtData({
                          ...extData,
                          start_time: e.target.value
                        });
                      }}
                      type="time"
                      lang="zh-TW"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold leading-6">下課時間</label>
                  <div className="mt-2">
                    <input
                      step="900"
                      value={extData.end_time}
                      onChange={(e) => {
                        setExtData({
                          ...extData,
                          end_time: e.target.value
                        });
                      }}
                      type="time"
                      lang="zh-TW"
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                    />
                  </div>
                </div>
                <div className="col-span-2 row-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">備註</label>
                  <div className="mt-2">
                    <textarea
                      value={extData.remark}
                      onChange={(e) => {
                        setExtData({ ...extData, remark: e.target.value });
                      }}
                      rows={4}
                      className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold leading-6 ">關鍵字搜尋</label>
                  <div>
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                      type="text"
                      className="block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold leading-6 ">年級</label>
                  <div>
                    <select
                      onChange={(e) => {
                        setGrade(e.target.value);
                      }}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
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
                <div className="col-span-1 flex justify-center items-center">
                  <button
                    onClick={() => {
                      getTimeStudent();
                    }}
                    type="button"
                    className="inline-flex justify-center rounded-md bg-sky-600 px-2 py-1 text-md text-white hover:bg-sky-900"
                  >
                    匯入全部定期學生
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 mt-4">
                <div className="col-span-1">
                  <div className="h-60vh grid grid-cols-1 gap-1 px-1 overflow-auto">
                    {filteredTeacher.map((i) => (
                      <label
                        key={i.id}
                        className="relative flex items-start border-b border-r rounded-md p-1 cursor-pointer hover:bg-yellow-50"
                      >
                        <div className="flex h-6 items-center">
                          <input
                            checked={extData.teacherList.some((j) => j == i.id)}
                            onChange={() => {
                              if (extData.teacherList.some((j) => j == i.id)) {
                                setExtData({
                                  ...extData,
                                  teacherList: extData.teacherList.filter((j) => j != i.id)
                                });
                              } else {
                                setExtData({
                                  ...extData,
                                  teacherList: [...extData.teacherList, i.id]
                                });
                              }
                            }}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <span className="font-medium text-gray-900">{i.user.first_name}</span> <span className="text-gray-500">{i.user.nick_name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="h-60vh grid grid-cols-4 gap-1 px-1 overflow-auto">
                    {filteredStudent.map((i) => (
                      <label
                        key={i.id}
                        className="relative flex items-start border-b border-r rounded-md p-1 cursor-pointer hover:bg-yellow-50"
                      >
                        <div className="flex h-6 items-center">
                          <input
                            checked={extData.studentList.some((j) => j == i.id)}
                            onChange={() => {
                              if (extData.studentList.some((j) => j == i.id)) {
                                setExtData({
                                  ...extData,
                                  studentList: extData.studentList.filter((j) => j != i.id)
                                });
                              } else {
                                setExtData({
                                  ...extData,
                                  studentList: [...extData.studentList, i.id]
                                });
                              }
                            }}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <span className="font-medium text-gray-900">{i.user.first_name}</span> <span className="text-gray-500">{i.user.nick_name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 border-2 border-pink-400 rounded-md py-2 py-4">
                  <div className="flex items-center justify-around">
                    <label className="block font-medium leading-6 text-gray-900">衝堂顯示</label>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          getConflict();
                        }}
                        className="inline-flex justify-center rounded-md bg-pink-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-pink-900"
                      >
                        查詢衝堂
                      </button>
                    </div>
                  </div>
                  <table className="w-full mt-2 text-sm">
                    <thead>
                      <tr className="divide-x divide-gray-600 bg-pink-200">
                        <th className="text-center font-semibold text-gray-900">名稱</th>
                        <th className="text-center font-semibold text-gray-900">課程</th>
                        <th className="text-center font-semibold text-gray-900">起始</th>
                        <th className="text-center font-semibold text-gray-900">結束</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {conflict.teacher?.map((i) => (
                        <tr className="text-center hover:bg-pink-100">
                          <td className="text-orange-500">{i.c_name}(老師)</td>
                          <td className="text-gray-500">{i.course_name}</td>
                          <td className="text-gray-500">{i.start_time.substr(0, 5)}</td>
                          <td className="text-gray-500">{i.end_time.substr(0, 5)}</td>
                        </tr>
                      ))}
                      {conflict.student?.map((i) => (
                        <tr className="text-center hover:bg-pink-100">
                          <td className="text-gray-500 font-medium">{i.c_name}</td>
                          <td className="text-gray-500">{i.course_name}</td>
                          <td className="text-gray-500">{i.start_time.substr(0, 5)}</td>
                          <td className="text-gray-500">{i.end_time.substr(0, 5)}</td>
                        </tr>
                      ))}
                      {conflict.teacher?.length == 0 && conflict.student?.length == 0 && (
                        <tr className="text-center">
                          <td
                            colSpan={4}
                            className="text-xl text-pink-500 font-medium"
                          >
                            無衝堂
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    check_type.current = 2;
                    setCheckedDialog(true);
                  }}
                  className="inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 flex items-end">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">課程設定</h1>
          <div className="">
            <button
              type="button"
              onClick={() => {
                setExtLog(true);
              }}
              className="ml-3 -m-2inline-flex justify-center rounded-md bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              加課
            </button>
          </div>
          <div className="">
            <button
              type="button"
              onClick={() => {
                deleteCourse();
              }}
              className="ml-3 -m-2inline-flex justify-center rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              刪除
            </button>
          </div>
        </div>

        <div className="px-2 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
          {/* 課程資訊 */}
          {course && (
            <div>
              <div className="flex mb-4">
                <div className="w-1/3 flex items-end">
                  <div className="text-2xl">
                    {" "}
                    {course.course.course_name}
                    {course.course_name_extend}
                  </div>
                  <div className="text-gray-600 ml-2">{course.school_year} 學年</div>
                </div>

                <p className="flex items-center text-lg text-gray-500">
                  <CalendarIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  課程：{course.start_date} ~ {course.end_date}
                </p>
              </div>
              <ul
                role="list"
                className="divide-y divide-gray-200"
              >
                <li className="py-4 grid grid-cols-5">
                  <div className="col-span-1">星期</div>
                  <div className="col-span-1">日期</div>
                  <div className="col-span-1">時間</div>
                  <div className="col-span-1">教室</div>
                  <div className="col-span-1">設定</div>
                </li>
                {courseTime.map((i, index) => {
                  const today = new Date();
                  const late = new Date(i.end_date) < today;
                  const start = i.start_time.split(":");
                  const end = i.end_time.split(":");
                  return late ? null : (
                    <li
                      key={index}
                      className="py-4 grid grid-cols-5"
                    >
                      <div className="col-span-1">{week[i.week]}</div>
                      <div className="col-span-1">
                        <div>{i.start_date}</div>
                        <div>{i.end_date}</div>
                      </div>
                      <div className="col-span-1">
                        <div>
                          {start[0]}:{start[1]}
                        </div>
                        <div>
                          {end[0]}:{end[1]}
                        </div>
                      </div>
                      <div className="col-span-1">{i.classroom?.classroom_name}</div>
                      <div className="col-span-1">
                        <button
                          onClick={() => {
                            setUpdateClassroom({
                              ...updateClassroom,
                              course_time_id: i.id
                            });
                            setUpdateClassroomDialog(true);
                          }}
                          type="button"
                          className="mr-2 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                          改教室
                        </button>
                        <button
                          onClick={() => {
                            const s = i.start_time.split(":");
                            const e = i.end_time.split(":");
                            setUpdateTime({
                              ...updateTime,
                              s_h: s[0],
                              s_m: s[1],
                              e_h: e[0],
                              e_m: e[1],
                              start_time: `${s[0]}:${s[1]}`,
                              end_time: `${e[0]}:${e[1]}`,
                              course_time_id: i.id,
                              begin: i.start_date
                            });
                            setUpdateTimeDialog(true);
                          }}
                          type="button"
                          className="mr-2 rounded-md bg-yellow-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
                        >
                          改時間
                        </button>
                        <button
                          onClick={() => {
                            setCloseDialog(true);
                            setClose({
                              course_time_id: i.id,
                              begin: i.end_date
                            });
                          }}
                          type="button"
                          className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                        >
                          關閉
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="sm:col-span-1 flex justify-center items-center">
            <button
              onClick={() => {
                submit_type.current = 1;
                setCheckConflict(true);
                setCreateDialog(true);
                setCreate({
                  ...create,
                  begin: course.start_date,
                  end: course.end_date
                });
              }}
              type="button"
              className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
