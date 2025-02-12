"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { error } from "../../utils";

export default function Home({ course, schedule_id, setInfo, getData }) {
  const [open, setOpen] = useState(false);
  const [classRoomList, setClassRoomList] = useState([]);

  async function getClassRoom() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        user_id: localStorage.getItem("user_id"),
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/classroom/list`, config);
    const res = await response.json();
    if (response.ok) {
      setClassRoomList(res.list);
      setOpen(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateClassRoom(id) {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        classroom_id: id
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/${schedule_id}/update`, config);
    const res = await response.json();
    if (response.ok) {
      getData(schedule_id);
      setInfo({
        show: true,
        success: true,
        msg: "教室修改完成！"
      });
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

  return (
    <>
      {/* 教室修改 */}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-4">
                <div className="border-b-2 col-span-4 mb-3">教室</div>
                {classRoomList.map((i, index) => (
                  <span
                    key={index}
                    onClick={() => {
                      updateClassRoom(i.id);
                    }}
                    className={`${
                      course.classroom_id == i.id ? "border-green-500 text-green-500" : "border-gray-600 text-gray-600"
                    } border-2 inline-block m-1 px-2 py-1 rounded-lg cursor-pointer hover:opacity-75 col-span-1`}
                  >
                    <div className="flex">
                      <div className="flex">{course.classroom_id == i.id && <CheckCircleIcon className="w-5" />}</div>
                      <div>{i.classroom_name}</div>
                    </div>
                  </span>
                ))}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <button
        onClick={() => {
          getClassRoom();
        }}
        type="button"
        className="relative inline-flex items-center rounded-md bg-pink-100 px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
      >
        改教室
      </button>
    </>
  );
}
