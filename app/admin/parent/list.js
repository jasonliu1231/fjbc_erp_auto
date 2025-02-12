"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Alert from "../alert";
import { error } from "../../utils";

export default function Example() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [parent, setParent] = useState([]);
  const [query, setQuery] = useState("");

  let filteredItems =
    query === ""
      ? parent
      : parent.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const tel = item.user.tel?.toLowerCase() || "";
          return (
            name.includes(query.toLowerCase()) ||
            tel.includes(query.toLowerCase()) ||
            item.student_list.some((element) => {
              return element.user.first_name.includes(query.toLowerCase());
            })
          );
        });

  async function getParentList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/parent/list`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setParent(res.list);
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
    getParentList();
  }, []);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="flex">
        <div className="relative rounded-md shadow-sm">
          <input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            type="text"
            placeholder="學生姓名、家長姓名"
            className="p-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </div>
        </div>
      </div>
      <div className="h-70vh overflow-auto px-1 mt-1">
        <ul
          role="list"
          className="mx-auto mt-4 grid grid-cols-5 gap-2"
        >
          {filteredItems.map((person) => (
            <li
              key={person.id}
              className={`bg-white p-2 cursor-pointer hover:bg-gray-200 rounded-lg`}
              onClick={() => {
                window.location.href = `/admin/parent/setting?id=${person.id}`;
              }}
            >
              <div className="flex items-center justify-around">
                <div className="text-lg font-semibold tracking-tight text-gray-900">{person.user.first_name}</div>
                <div className="text-sm text-blue-600">
                  {person.student_list?.map((person) => (
                    <div>
                      {person.user.first_name}
                      {person.user.nick_name}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
