"use client";

import { useEffect, useState } from "react";
import { UserIcon, UsersIcon } from "@heroicons/react/20/solid";
import Setperm from "./setperm";
import Setuser from "./setuser";
import Alert from "../../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [type, setType] = useState(1);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div>
          <div className="sm:hidden">
            <label
              htmlFor="tabs"
              className="sr-only"
            >
              Select a tab
            </label>
            <select
              onChange={(event) => {
                setType(event.target.value);
              }}
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={1}>權限設定</option>
              <option value={2}>附加權限</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav
                aria-label="Tabs"
                className="-mb-px flex space-x-8"
              >
                <div
                  onClick={() => {
                    setType(1);
                  }}
                  aria-current={type == 1 ? "page" : undefined}
                  className={`${
                    type == 1 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium`}
                >
                  <UserIcon
                    aria-hidden="true"
                    className={`${type == 1 ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"} -ml-0.5 mr-2 h-5 w-5`}
                  />
                  <span>權限設定</span>
                </div>
                <div
                  onClick={() => {
                    setType(2);
                  }}
                  aria-current={type == 2 ? "page" : undefined}
                  className={`${
                    type == 2 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium`}
                >
                  <UsersIcon
                    aria-hidden="true"
                    className={`${type == 2 ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"} -ml-0.5 mr-2 h-5 w-5`}
                  />
                  <span>附加權限</span>
                </div>
              </nav>
            </div>
          </div>
        </div>
        {type == 1 ? <Setperm setInfo={setInfo} /> : <Setuser setAlert={setInfo} />}
      </div>
    </>
  );
}
