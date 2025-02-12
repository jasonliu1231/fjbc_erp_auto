"use client";

import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LiaChalkboardTeacherSolid, LiaBookReaderSolid } from "react-icons/lia";
import { TbClockUp, TbClockX } from "react-icons/tb";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/zh-cn"; // 引入中文语言包
moment.locale("zh-cn"); // 设置 moment 的全局中文

// 设置本地化为 moment.js
const localizer = momentLocalizer(moment);

const def = {
  tutoring: 0,
  calendarType: 1,
  classType: 0
};

export default function MyCalendar() {
  const [open, setOpen] = useState(false);
  const [classData, setClassData] = useState({});
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(def);

  const tutoringEvents = selected.tutoring == 0 ? eventsList : eventsList.filter((i) => i.tutoring_id == selected.tutoring);
  const calendarEvents = selected.classType == 0 ? tutoringEvents : tutoringEvents.filter((i) => i.tutoring_course_status_id == selected.classType);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  async function getData(date) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/calendar/list?date=${date}`, config);
    const res = await response.json();
    if (response.ok) {
      const list = [];
      res.forEach((element) => {
        const date = element.course_date.split("-");
        const start_time = element.start_time.split(":");
        const end_time = element.end_time.split(":");
        list.push({
          ...element,
          start: new Date(date[0], date[1] - 1, date[2], start_time[0], start_time[1]),
          end: new Date(date[0], date[1] - 1, date[2], end_time[0], end_time[1]),
          class_state:
            element.tutoring_course_status_id == 1
              ? "正常上課"
              : element.tutoring_course_status_id == 2
              ? "停課(不補課)"
              : element.tutoring_course_status_id == 3
              ? "調課"
              : element.tutoring_course_status_id == 4
              ? "停課(需補課)"
              : element.tutoring_course_status_id == 5
              ? "補課"
              : element.tutoring_course_status_id == 6
              ? "加課"
              : "恢復上課",
          color:
            element.tutoring_course_status_id == 1
              ? "#FCFCFC"
              : element.tutoring_course_status_id == 2
              ? "#F03F09"
              : element.tutoring_course_status_id == 3
              ? "#60E1F0"
              : element.tutoring_course_status_id == 4
              ? "#F5A3A2"
              : element.tutoring_course_status_id == 5
              ? "#32F084"
              : element.tutoring_course_status_id == 6
              ? "#60F0CF"
              : "#ECECFE"
        });
      });
      setEventsList(list);
      setLoading(false);
    } else {
      if (response.status == 405) {
        alert("權限不足");
        return;
      }
    }
  }

  useEffect(() => {
    const d = new Date(date);
    const str = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    getData(str);
  }, [date]);

  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(23, 0, 0);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt("新增時段");
      if (title) {
        setEventsList((prev) => [...prev, { start, end, title }]);
      }
    },
    [eventsList]
  );

  const handleSelectEvent = (event) => {
    console.log(event);
    alert(`你点击了事件: ${event.title}-${event.tutoring_course_status_id}`);
  };

  const handleDoubleClickEvent = (event) => {
    setOpen(true);
    setClassData(event);
  };

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEventsList(eventsList.map((e) => (e.title === event.title ? updatedEvent : e)));
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: "4px",
      color: "#000000",
      border: `1px solid ${event.tutoring_id == 1 ? "#009100" : "#CE0000"}`
    };
    return {
      style: style
    };
  };

  const MyEventComponent = ({ event }) => {
    return (
      <>
        {view === "month" && (
          <div>
            <div className="flex justify-between">
              <strong>{event.course_name}</strong>
              <p className={`${event.tutoring_id == 1 ? "text-green-600" : "text-red-600"}`}>{`${event.tutoring_id == 1 ? "多易" : event.tutoring_id == 2 ? "艾思" : "華而敦"}`}</p>
            </div>
            {/* <p className={`${event.classroom_name ? "" : "text-red-700"}`}>{event.classroom_name || "無教室"}</p> */}
          </div>
        )}
        {view === "agenda" && (
          <div className="flex items-start text-md">
            <div className={`${event.tutoring_id == 1 ? "text-green-600" : "text-red-600"}`}>{`${event.tutoring_id == 1 ? "多易" : event.tutoring_id == 2 ? "艾思" : "華而敦"}`}</div>
            <strong className="mx-4">{event.course_name}</strong>
            <span className={`${event.classroom_name ? "text-gray-400" : "text-red-300"}`}>{event.classroom_name || "無教室"}</span>
          </div>
        )}
        {view === "day" && (
          <div className="flex items-start text-md">
            <div className={`${event.tutoring_id == 1 ? "text-green-600" : "text-red-600"}`}>{`${event.tutoring_id == 1 ? "多易" : event.tutoring_id == 2 ? "艾思" : "華而敦"}`}</div>
            <strong>
              <span>{event.course_name}</span>
              <span className={`${event.classroom_name ? "text-gray-400" : "text-red-300"}`}>{event.classroom_name || "無教室"}</span>
            </strong>
          </div>
        )}
      </>
    );
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="mb-1">
        <div className="h-12 flex items-center justify-center">
          <button
            onClick={() => {
              onNavigate("PREV");
            }}
          >
            <ChevronLeftIcon className="h-6" />
          </button>
          <span className="text-blue-700 text-xl font-bold">{label}</span>
          <button
            onClick={() => {
              onNavigate("NEXT");
            }}
          >
            <ChevronRightIcon className="h-6" />
          </button>
        </div>
        <div className="flex justify-around">
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  tutoring: 0
                });
              }}
              className={`${
                selected.tutoring == 0 ? "ring-4 ring-blue-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  tutoring: 1
                });
              }}
              className={`${
                selected.tutoring == 1 ? "ring-4 ring-blue-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              多易
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  tutoring: 2
                });
              }}
              className={`${
                selected.tutoring == 2 ? "ring-4 ring-blue-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              艾思
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  tutoring: 3
                });
              }}
              className={`${
                selected.tutoring == 3 ? "ring-4 ring-blue-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              華而敦
            </button>
          </span>
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 0
                });
              }}
              className={`${
                selected.classType == 0 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 1
                });
              }}
              style={{ backgroundColor: "#FCFCFC" }}
              className={`${
                selected.classType == 1 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              正常上課
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 2
                });
              }}
              style={{ backgroundColor: "#F03F09" }}
              className={`${
                selected.classType == 2 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              停課
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 3
                });
              }}
              style={{ backgroundColor: "#60E1F0" }}
              className={`${
                selected.classType == 3 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              調課
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 4
                });
              }}
              style={{ backgroundColor: "#F5A3A2" }}
              className={`${
                selected.classType == 4 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              需補課
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 5
                });
              }}
              style={{ backgroundColor: "#32F084" }}
              className={`${
                selected.classType == 5 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              補課
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 6
                });
              }}
              style={{ backgroundColor: "#60F0CF" }}
              className={`${
                selected.classType == 6 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              加課
            </button>
            {/* <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  classType: 7
                });
              }}
              style={{ backgroundColor: "#ECECFE" }}
              className={`${
                selected.classType == 7 ? "ring-4 ring-purple-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              恢復上課
            </button> */}
          </span>
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  calendarType: 1
                });
                onView("month");
              }}
              className={`${
                selected.calendarType == 1 ? "ring-4 ring-pink-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 rounded-l-md text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              月曆
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  calendarType: 2
                });
                onView("day");
              }}
              className={`${
                selected.calendarType == 2 ? "ring-4 ring-pink-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              日曆
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected({
                  ...selected,
                  calendarType: 3
                });
                onView("agenda");
              }}
              className={`${
                selected.calendarType == 3 ? "ring-4 ring-pink-300" : "ring-1 ring-gray-300"
              } relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              議程
            </button>
          </span>
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => {
                onNavigate("TODAY");
              }}
              className={`ring-1 ring-gray-300 relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              回當日
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(def);
                onNavigate("TODAY");
                onView("month");
              }}
              className={`ring-1 ring-gray-300 relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              <ArrowPathIcon className="h-6" />
            </button>
          </span>
        </div>
      </div>
    );
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    const isToday = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();

    return {
      style: {
        backgroundColor: isToday ? "#FAF9AB" : ""
      }
    };
  };

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
        open={open}
        onClose={setOpen}
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
              className="relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
              style={{ backgroundColor: `${classData.color}` }}
            >
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  <LiaBookReaderSolid
                    aria-hidden="true"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <span className="px-2 py-1 absolute text-xl text-gray-700 top-5 left-5 bg-white rounded-lg">{classData.class_state}</span>
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    {classData.tutoring_name} ➤ {classData.course_name}〖{classData.school_year}〗
                  </DialogTitle>
                  <div className="mt-2 text-md text-gray-500">
                    {/* <div className="flex p-1">
                      <div className="w-1/2 flex justify-center items-center">
                        <LiaChalkboardTeacherSolid className="mr-2 w-5 h-5" />
                        {classData.teacher_c_name}
                      </div>
                      
                    </div> */}
                    <div className="flex justify-around p-1">
                      <div className="flex justify-center items-center">
                        <MapPinIcon className="mr-2 w-5 h-5" />
                        {classData.classroom_name}
                      </div>
                      <div className="flex justify-center items-center">
                        <TbClockUp className="mr-2 w-5 h-5" />
                        {new Date(classData.start).toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="flex justify-center items-center">
                        <TbClockX className="mr-2 w-5 h-5" />
                        {new Date(classData.end).toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    setOpen(false);
                    window.location.href = `/admin/course?id=${classData.id}`;
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  查看課程
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Calendar
        style={{ height: "90vh" }} // css
        className="w-full px-4 py-2 bg-gray-50" // class
        // dayPropGetter={dayPropGetter} // 自定義日曆模式
        eventPropGetter={eventStyleGetter} // 自定義事件模式
        localizer={localizer} // 本地化時間
        events={calendarEvents} // 資料列表
        view={view} // 顯示方式
        onView={handleViewChange} // 控制顯示方式
        date={date} // 起始顯示日期
        dayPropGetter={dayPropGetter} // 當天顏色
        onNavigate={handleNavigate} // 控制時間
        views={[Views.MONTH, Views.DAY, Views.AGENDA]}
        startAccessor="start"
        endAccessor="end"
        popup={true} // 多個是否出現彈窗
        // getDrilldownView={getDrilldownView} // 深入查看與 popup 不可互相使用
        step={30} // 時間間隔
        dayLayoutAlgorithm="no-overlap" // 區塊不重疊
        // showAllEvents={true} // 顯示所有資料不折疊
        // 上頭標題
        onEventDrop={handleEventDrop}
        components={{
          toolbar: CustomToolbar, // 上方 bar
          event: MyEventComponent // 行事曆方匡內容
        }}
        // 顯示時間範圍
        min={minTime}
        max={maxTime}
        // selectable // 拖曳行為開關
        // onSelectSlot={handleSelectSlot} // 行事曆上拖曳新增
        // onSelectEvent={handleSelectEvent} // 單擊事件
        onDoubleClickEvent={handleDoubleClickEvent} // 雙擊事件
      />
    </>
  );
}
