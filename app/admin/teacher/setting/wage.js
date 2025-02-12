"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { error } from "../../../utils";

export default function Home({ teacher_id, setInfo }) {
  const [open, setOpen] = useState(false);
  const [profileList, setProfileList] = useState([]);
  const [wageList, setWageList] = useState([]);
  const [create, setCreate] = useState({
    schedule_teacher_status_id: 0,
    wage: 0
  });

  async function createWage() {
    create.teacher_id = teacher_id;
    if (create.schedule_teacher_status_id == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請選取身份"
      });
      return;
    }
    if (create.wage == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "薪資設定不可以為 0"
      });
      return;
    }
    if (create.teacher_id == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "教師設定有誤，請重新整理頁面"
      });
      return;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/person`, config);
    const res = await response.json();

    if (response.ok) {
      getData();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
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

    const profile = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/profile`, config);
    const wage = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/wage/person/list?teacher_id=${teacher_id}`, config);

    Promise.all([profile, wage]).then(async ([response1, response2]) => {
      const res1 = await response1.json();
      const res2 = await response2.json();

      if (response1.ok) {
        setProfileList(res1.filter((i) => i.enable));
      } else {
        const msg = error(response1.status, res1);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      if (response2.ok) {
        setWageList(res2);
        setOpen(true);
      } else {
        const msg = error(response2.status, res2);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    });
  }

  return (
    <>
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="mb-3">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="divide-x divide-gray-200 bg-green-100">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                      >
                        身份
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        時薪
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                      >
                        經手人
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {wageList.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className={`divide-x divide-gray-200 hover:bg-blue-100`}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">{item.content}</td>
                          <td className="whitespace-nowrap p-4 text-sm text-blue-500">{item.wage}</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">{item.first_name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <label className="text-gray-600">身份</label>
                  <select
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        schedule_teacher_status_id: Number(e.target.value)
                      });
                    }}
                    className="border-2 w-full px-2 py-1"
                  >
                    {create.schedule_teacher_status_id == 0 && <option value={0}>請選擇身份</option>}
                    {profileList.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.content}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-gray-600">薪資設定</label>
                  <input
                    value={create.wage}
                    onChange={(e) => {
                      setCreate({ ...create, wage: Number(e.target.value) });
                    }}
                    type="number"
                    className="border-2 w-full px-2 py-1"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2 mx-1"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={createWage}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-green-600 ring-2 ring-green-400 mx-1"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <button
        onClick={() => {
          getData();
        }}
        className={`bg-red-600 mx-1 rounded-md px-3 py-2 text-sm font-semibold text-gray-100`}
      >
        時薪
      </button>
    </>
  );
}
