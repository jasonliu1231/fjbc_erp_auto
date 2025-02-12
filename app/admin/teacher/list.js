"use client";

import { useState, useEffect } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Alert from "../alert";
import { error } from "../../utils";

export default function Example() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [tutorings, setTutoring] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [selected, setSelected] = useState({});
  const [query, setQuery] = useState("");
  const [leave, setLeave] = useState(false);

  let teacherList = leave ? teacher.filter((item) => item.status != null && item.status.id == 5) : teacher.filter((item) => item.status == null || item.status.id != 5);

  let filteredItems =
    query === ""
      ? teacherList
      : teacherList.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const en_name = item.user.nick_name?.toLowerCase() || "";
          const tel = item.user.tel?.toLowerCase() || "";
          const school = item.school?.school_name?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || en_name.includes(query.toLowerCase()) || tel.includes(query.toLowerCase()) || school.includes(query.toLowerCase());
        });

  async function getTutoringList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/list`, config);
    const res = await response.json();
    if (response.ok) {
      setTutoring(res.tutoring_list);
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
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list`;
    if (selected.id) {
      url += `?tutoring_id=${selected.id}`;
    }
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setTeacher(res.list);
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
    getTutoringList();
    getStudentList();
  }, [selected?.id]);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="flex">
        <Listbox
          value={selected}
          onChange={(selected) => {
            setSelected(selected);
          }}
        >
          <div className="relative w-96">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selected.tutoring_name || "請選擇補習班"}</span>
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
              {tutorings.length > 0 &&
                tutorings.map((tutoring) => (
                  <ListboxOption
                    key={tutoring.id}
                    value={tutoring}
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                  >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">{tutoring.tutoring_name}</span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                      <CheckIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </span>
                  </ListboxOption>
                ))}
            </ListboxOptions>
          </div>
        </Listbox>
        <div className="relative ml-12 rounded-md shadow-sm">
          <input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            type="text"
            placeholder="教師姓名"
            className="p-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </div>
        </div>
        <span className="isolate inline-flex rounded-md shadow-sm mx-1">
          <button
            onClick={() => {
              setLeave(false);
            }}
            type="button"
            className={`${
              !leave ? "ring-2 ring-red-300" : "ring-1 ring-gray-300"
            } ring-inset relative -ml-px inline-flex items-center bg-white rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
          >
            在校人員
          </button>
          <button
            onClick={() => {
              setLeave(true);
            }}
            type="button"
            className={`${
              leave ? "ring-2 ring-red-300" : "ring-1 ring-gray-300"
            } ring-inset relative -ml-px inline-flex items-center bg-white rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
          >
            離職人員
          </button>
        </span>
      </div>
      <div className="h-70vh overflow-auto px-2 mt-1">
        <ul
          role="list"
          className="mx-auto mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-2"
        >
          {filteredItems.map((person) => (
            <li
              key={person.id}
              className={`bg-white flex flex-col gap-6 xl:flex-row p-2 cursor-pointer hover:bg-gray-200 rounded-lg`}
              onClick={() => {
                window.location.href = `/admin/teacher/setting?id=${person.id}`;
              }}
            >
              <div className="flex items-center">
                {person.user.photo ? (
                  <img
                    alt=""
                    src={person.user.photo}
                    className="h-12 w-12"
                  />
                ) : (
                  <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-full w-full text-gray-300"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}

                <div className="flex-auto ml-3">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.user.first_name}</h3>
                  <p className={`${person.user.nick_name ? "" : "opacity-0"} text-base leading-7 text-gray-600`}>{person.user.nick_name || "no name"}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
