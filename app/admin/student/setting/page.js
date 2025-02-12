"use client";

import { useEffect, useState } from "react";
import Setting from "./setting";
import Aptitude from "./aptitude";
import Interview from "./interview";
import Contactbook from "./contactbook";
import Wallet from "./wallet";
import Activity from "./activity";
import Course from "./course";
import Alert from "../../alert";

export default function Home() {
  const [id, setId] = useState(0);
  const [state, setState] = useState(1);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const tabs = [
    { id: 1, name: "基本資料" },
    { id: 2, name: "性向" },
    { id: 7, name: "課程表" },
    { id: 4, name: "聯絡簿" },
    { id: 3, name: "訪談紀錄" },
    { id: 5, name: "錢包" },
    { id: 6, name: "活動紀錄" }
    // { id: 8, name: "問班/檢測" }
  ];

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = Number(params.get("id"));
    setId(id);
  }, []);

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
            <Setting
              student_id={id}
              setInfo={setInfo}
            />
          ) : state == 2 ? (
            <Aptitude
              student_id={id}
              setInfo={setInfo}
            />
          ) : state == 3 ? (
            <Interview
              student_id={id}
              setInfo={setInfo}
            />
          ) : state == 4 ? (
            <Contactbook
              student_id={id}
              setInfo={setInfo}
            />
          ) : state == 5 ? (
            <Wallet
              student_id={id}
              setInfo={setInfo}
            />
          ) : state == 6 ? (
            <Activity
              student_id={id}
              setInfo={setInfo}
            />
          ) : state == 7 ? (
            <Course
              student_id={id}
              setInfo={setInfo}
            />
          ) : state == 8 ? (
            <Course
              student_id={id}
              setInfo={setInfo}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
