"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { error } from "../../utils";

const def_data = {
  tutoring_course_status_id: 4,
  remark: ""
};

export default function Home({ schedule_id, setInfo, getData }) {
  const [open, setOpen] = useState(false);
  const [submitData, setSubmitData] = useState(def_data);

  // 停課
  async function submit() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(submitData)
    };

    let api = "";
    if (submitData.tutoring_course_status_id == 2) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/modification/${schedule_id}/cc`;
    } else if (submitData.tutoring_course_status_id == 4) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/modification/${schedule_id}/ccm`;
    } else {
      setInfo({
        show: true,
        success: false,
        msg: "設定錯誤，請與資訊部門聯絡"
      });
    }
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      getData(schedule_id);
      setInfo({
        show: true,
        success: true,
        msg: "課程已停止！"
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
      {/* 課程調整 */}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-center text-2xl text-blue-400">停課</div>
              <div className="flex justify-center mt-2">
                <div className="mx-1 flex items-center">
                  <input
                    onClick={() => {
                      setSubmitData({ ...submitData, tutoring_course_status_id: 4 });
                    }}
                    defaultChecked={true}
                    id="type_4"
                    name="stopClass"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600"
                  />
                  <label
                    htmlFor="type_4"
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    需補課
                  </label>
                </div>
                <div className="mx-1 flex items-center">
                  <input
                    onClick={() => {
                      setSubmitData({ ...submitData, tutoring_course_status_id: 2 });
                    }}
                    id="type_2"
                    name="stopClass"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600"
                  />
                  <label
                    htmlFor="type_2"
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    不需補課
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">備註</label>
                <div className="mt-2">
                  <textarea
                    value={submitData.remark}
                    onChange={(e) => {
                      setSubmitData({ ...submitData, remark: e.target.value });
                    }}
                    rows={4}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={() => {
                    submit();
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <button
        onClick={() => {
          setOpen(true);
        }}
        type="button"
        className="relative inline-flex rounded-md items-center bg-white px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
      >
        停課
      </button>
    </>
  );
}
