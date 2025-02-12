"use client";

import { XCircleIcon, Cog6ToothIcon, PlusCircleIcon, CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/20/solid";
import Dialog from "./dialog";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ items, setItems, setInfo }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState({});

  function dialogItem(item) {
    setIndex(item);
    setOpen(true);
  }

  const courseDelete = async (id) => {
    const check = confirm("確定要刪除嗎？如只是暫時不使用請點選關閉！");
    if (check) {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          clientid: `${localStorage.getItem("client_id")}`,
          "Content-Type": "application/json"
        }
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}`, config);
      const res = await response.json();
      if (response.ok) {
        setItems(res.course_list);
      } else {
        const msg = error(response.status, res);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    }
  };

  const courseSwitch = async (id, open) => {
    let url = "";
    if (open) {
      url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}/show`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}/hide`;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res.course_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  };

  return (
    <>
      <Dialog
        item={index}
        open={open}
        setOpen={setOpen}
        setInfo={setInfo}
        setItems={setItems}
      />
      <ul
        role="list"
        className="space-y-3"
        id="sortable-list"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-md bg-white px-6 py-4 shadow"
            style={{ backgroundColor: item.color }}
          >
            <div className="flex justify-between w-full">
              <div className="w-1/6 sm:text-xl">{item.course_no}</div>
              <div className="w-1/2 sm:text-2xl">{item.course_name}</div>
              <div className="w-1/4 flex justify-center items-center">
                <Cog6ToothIcon
                  aria-hidden="true"
                  className="w-8 sm:mx-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => {
                    dialogItem(item);
                  }}
                />
                {item.is_visable ? (
                  <NoSymbolIcon
                    className="w-8 sm:mx-2 text-red-400 hover:text-red-600 cursor-pointer"
                    onClick={() => courseSwitch(item.id, false)}
                  />
                ) : (
                  <CheckCircleIcon
                    className="w-8 sm:mx-2 text-green-400 hover:text-green-600 cursor-pointer"
                    onClick={() => courseSwitch(item.id, true)}
                  />
                )}
                <XCircleIcon
                  className="w-8 sm:mx-2 text-red-400 hover:text-red-600 cursor-pointer"
                  onClick={() => courseDelete(item.id)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
