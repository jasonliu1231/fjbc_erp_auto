"use client";
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { error } from "../../utils";
import Alert from "../alert";
import { Switch } from "@headlessui/react";

const def_update = {
  id: 0,
  username: "",
  change: ""
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [type, setType] = useState(2);
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(def_update);

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          const name = item.first_name.toLowerCase() || "";
          const student_list = item.student_list;
          if (student_list) {
            return (
              name.includes(query.toLowerCase()) ||
              student_list.some((student) => {
                if (student) {
                  const student_name = student.split("$$");
                  const cn_name = student_name[0];
                  const en_name = student_name[1].toLowerCase();
                  return cn_name.includes(query.toLowerCase()) || en_name.includes(query.toLowerCase());
                }
              })
            );
          } else {
            return name.includes(query.toLowerCase());
          }
        });

  async function getUser(type) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/username/list?type=${type}`, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res);
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

  async function changeUserName() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(select)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/username`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      setOpen(false);
      getUser(type);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateActive(data) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/username`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getUser(type);
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
    getUser(type);
  }, [type]);

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
              <div className="">
                <div className="flex justify-center">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-red-600"
                    />
                  </div>
                </div>

                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    <span className="text-lg text-blue-400">{select.first_name}</span>
                    <span className="mx-2 text-sm">帳號細節</span>
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">{`帳號：${select.username || "尚未建立"}`}</div>
                    <div className="mt-2">
                      <input
                        value={select.change}
                        onChange={(e) => {
                          setSelect({
                            ...select,
                            change: e.target.value
                          });
                        }}
                        type="text"
                        placeholder="修改帳號"
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={changeUserName}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  修改
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  關閉
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 flex justify-between">
          <h1 className="font-semibold leading-6 text-gray-900">帳號列表</h1>
        </div>
        <div className="flex">
          <div className="relative rounded-md">
            <input
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              type="text"
              placeholder="姓名、學校、年級"
              className="p-2 block w-full rounded-md border-0 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
          <span className="isolate inline-flex rounded-md shadow-sm mx-4">
            <button
              type="button"
              onClick={() => {
                setType(2);
                setLoading(true);
              }}
              className={`${
                type == 2 ? " ring-2 ring-red-300" : " ring-1 ring-gray-300"
              } rounded-lg relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset mx-1`}
            >
              老師
            </button>
            <button
              type="button"
              onClick={() => {
                setType(1);
                setLoading(true);
              }}
              className={`${
                type == 1 ? " ring-2 ring-red-300" : " ring-1 ring-gray-300"
              } rounded-lg relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset mx-1`}
            >
              學生
            </button>
            <button
              type="button"
              onClick={() => {
                setType(3);
                setLoading(true);
              }}
              className={`${
                type == 3 ? " ring-2 ring-red-300" : " ring-1 ring-gray-300"
              } rounded-lg relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset mx-1`}
            >
              家長
            </button>
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="overflow-auto h-128">
            <ul
              role="list"
              className="mx-auto mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2"
            >
              {filteredItems.map((person, index) => (
                <li
                  key={index}
                  className={`${person.is_active ? "bg-white" : "bg-gray-500"} flex p-2 rounded-md`}
                >
                  <div className="flex-auto">
                    <div className="flex justify-between">
                      <div className="">
                        <h3
                          onClick={() => {
                            setSelect({
                              ...select,
                              username: person.username,
                              first_name: person.first_name,
                              id: person.id
                            });
                            setOpen(true);
                          }}
                          className="text-md font-semibold tracking-tight text-sky-400 cursor-pointer"
                        >
                          {person.first_name}
                        </h3>
                        <div className="text-base text-sm text-gray-500 h-1">{person.nick_name}</div>
                      </div>
                      {type != 3 && (
                        <div className={`${person.status ? "text-green-500" : "text-red-500"} text-sm `}>{type != 1 ? (person.status ? "在職" : "離職") : person.status ? "在校" : "離校"}</div>
                      )}

                      {person.student_list && (
                        <div>
                          {person.student_list.map((student, index) => {
                            if (student) {
                              const name = student.split("$$");
                              return (
                                <div
                                  key={index}
                                  className="text-xs text-orange-400"
                                >
                                  {name[0]}({name[1]})
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mt-3 flex items-center justify-between">
                        <label className="text-sm text-red-400">啟用帳號</label>
                        <Switch
                          checked={person.is_active}
                          onChange={(e) => {
                            updateActive({
                              id: person.id,
                              is_active: e
                            });
                          }}
                          className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 data-[checked]:bg-green-600"
                        >
                          <span className="sr-only">Use setting</span>
                          <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in group-data-[checked]:opacity-0 group-data-[checked]:duration-100 group-data-[checked]:ease-out"
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 12 12"
                                className="h-3 w-3 text-gray-400"
                              >
                                <path
                                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-[checked]:opacity-100 group-data-[checked]:duration-200 group-data-[checked]:ease-in"
                            >
                              <svg
                                fill="currentColor"
                                viewBox="0 0 12 12"
                                className="h-3 w-3 text-green-600"
                              >
                                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                              </svg>
                            </span>
                          </span>
                        </Switch>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
