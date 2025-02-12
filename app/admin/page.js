"use client";

import { useEffect, useState } from "react";
import Alert from "./alert";
import Schedule from "./home/schedule";
import Attendance from "./home/attendance";
import Rollteacher from "./home/rollteacher";
import Rollstudent from "./home/rollstudent";

export default function Example() {
  const [state, setState] = useState(1);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const tabs = [
    { id: 1, name: "課程" },
    { id: 2, name: "今日到校紀錄" },
    { id: 3, name: "今日老師" },
    { id: 4, name: "今日學生" }
  ];

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />

      <div className="container mx-auto">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  setState(tab.id);
                }}
                className={`${
                  state == tab.id ? "border-blue-500 text-blue-600" : "text-gray-500 hover:border-blue-300 hover:text-blue-700"
                } w-full border-b-2 px-1 py-3 text-center text-md font-medium cursor-pointer`}
              >
                {tab.name}
              </div>
            ))}
          </nav>
        </div>
        <div className="my-4">
          {state == 1 ? (
            <Schedule setInfo={setInfo} />
          ) : state == 2 ? (
            <Attendance setInfo={setInfo} />
          ) : state == 3 ? (
            <Rollteacher setInfo={setInfo} />
          ) : state == 4 ? (
            <Rollstudent setInfo={setInfo} />
          ) : null}
        </div>
      </div>
    </>
  );
}
