"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
// import "moment/locale/zh-cn"; // 引入中文语言包
// moment.locale("zh-cn"); // 设置 moment 的全局中文
const localizer = momentLocalizer(moment);

const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    backgroundColor: event.type ? "#fe0000" : "#0000fe",
    opacity: 0.6
  };
  return {
    style: style
  };
};

export default function Home({ teacher, student }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [eventsList, setEventsList] = useState([]);
  const [start_date, setStart] = useState("");
  const [end_date, setEnd] = useState("");

  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(22, 0, 0);

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="mx-3">
        <div className="h-12 flex items-center">
          <span className="w-1/3 flex justify-around items-center">
            <input
              value={start_date}
              onChange={(e) => {
                setStart(e.target.value);
              }}
              type="date"
              className="block w-28 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
            />
            <span> ～ </span>
            <input
              value={end_date}
              onChange={(e) => {
                setEnd(e.target.value);
              }}
              type="date"
              className="block w-28 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
            />
            <button
              onClick={() => {
                getData();
              }}
              type="button"
              className="block w-28 rounded-md border-0 py-1.5 text-gray-200 ring-1 ring-inset ring-gray-300 bg-blue-400"
            >
              查詢
            </button>
          </span>
          <div className="w-1/3 flex items-center justify-center">
            <button onClick={() => onNavigate("PREV")}>
              <ChevronLeftIcon className="h-6" />
            </button>
            <span className="text-blue-700 text-xl font-bold">{label}</span>
            <button onClick={() => onNavigate("NEXT")}>
              <ChevronRightIcon className="h-6" />
            </button>
          </div>
          <span className="w-1/3 isolate inline-flex rounded-md shadow-sm justify-end">
            <button
              onClick={() => {
                setOpen(false);
              }}
              type="button"
              className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 hover:text-red-300 focus:z-10"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </span>
        </div>
      </div>
    );
  };

  function setData(data) {
    const teacher = data.teacher.map((i) => {
      const date = new Date(i.course_date);
      const start_time = i.start_time?.split(":");
      const end_time = i.end_time?.split(":");

      return {
        title: i.c_name,
        start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_time[0], start_time[1]),
        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_time[0], end_time[1]),
        type: true,
        course_name: i.course_name,
        classroom_name: i.classroom_name,
        start_time: i.start_time,
        end_time: i.end_time
      };
    });

    const student = data.student.map((i) => {
      const date = new Date(i.course_date);
      const start_time = i.start_time?.split(":");
      const end_time = i.end_time?.split(":");

      return {
        title: i.c_name,
        start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_time[0], start_time[1]),
        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_time[0], end_time[1]),
        type: false,
        course_name: i.course_name,
        classroom_name: i.classroom_name,
        start_time: i.start_time,
        end_time: i.end_time
      };
    });

    setEventsList([...teacher, ...student]);
  }

  async function getData() {
    if (!start_date || !end_date) {
      alert("請填寫起始與結束時間");
      return;
    }
    console.log(teacher);
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teacher: teacher.map((i) => i.teacher_id),
        student: student.map((i) => i.student_id),
        start: start_date,
        end: end_date
      })
    };
    const response = await fetch(`/api/conflict`, config);
    const res = await response.json();
    if (response.ok) {
      setData(res);
    } else {
    }
  }

  const handleSelectEvent = (event) => {
    const msg = `名稱：${event.title}\n課程名稱：${event.course_name}\n教室：${event.classroom_name}\n${event.start_time}~${event.end_time}`;
    alert(msg);
  };

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
          <div className="flex min-h-full items-end justify-center text-center">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              {eventsList && (
                <Calendar
                  style={{ height: "100vh" }} // css
                  className="w-screen" // class
                  eventPropGetter={eventStyleGetter} // 自定義事件模式
                  localizer={localizer} // 本地化時間
                  events={eventsList} // 資料列表
                  view={Views.WEEK} // 顯示方式
                  date={date} // 起始顯示日期
                  onNavigate={handleNavigate} // 控制時間
                  startAccessor="start"
                  endAccessor="end"
                  step={30} // 時間間隔
                  min={minTime}
                  max={maxTime}
                  components={{
                    toolbar: CustomToolbar // 上方 bar
                  }}
                  onSelectEvent={handleSelectEvent} // 單擊事件
                />
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <button
        onClick={() => {
          setOpen(true);
        }}
        type="button"
        className="relative inline-flex items-center rounded-md bg-yellow-100 px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
      >
        課表
      </button>
    </>
  );
}
