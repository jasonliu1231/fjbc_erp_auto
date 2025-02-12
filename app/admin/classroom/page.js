"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Navbar from "../navbar";
import Alert from "../alert";
import Tabs from "./tabs";
import Create from "./create";
import List from "./list";
import { error } from "../../utils";

export default function Home() {
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [createView, setCreateView] = useState(false);
  const [items, setItems] = useState([]);

  async function getCoursesList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/classroom/list`, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res.list);
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
    getCoursesList();
  }, []);

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          const name = item.classroom_name.toLowerCase() || "";
          // const id = item.id.toLowerCase() || "";
          const tel = item.classroom_tel?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || tel.includes(query.toLowerCase());
        });

  return (
    <>
      {/* <Navbar /> */}
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">教室設定</h1>
        </div>
        <Tabs
          createView={createView}
          setCreateView={setCreateView}
        />
        {createView ? (
          <Create setInfo={setInfo} />
        ) : (
          <>
            <div className="relative my-2 w-48 rounded-md shadow-sm">
              <input
                onChange={(event) => setQuery(event.target.value)}
                value={query}
                type="text"
                placeholder="名稱、分機"
                className="p-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-400"
                />
              </div>
            </div>
            <List
              items={filteredItems}
              setItems={setItems}
              setInfo={setInfo}
            />
          </>
        )}
      </div>
    </>
  );
}
