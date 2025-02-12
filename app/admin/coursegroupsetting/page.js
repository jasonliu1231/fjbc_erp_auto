"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar";
import Alert from "../alert";
import Tabs from "./tabs";
import Create from "./create";
import List from "./list";
import { error } from "../../utils";

export default function Home() {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/list`, config);
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

  useEffect(() => {
    getCoursesList();
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">課程群組設定</h1>
        </div>
        <Tabs
          createView={createView}
          setCreateView={setCreateView}
        />
        {createView ? (
          <Create setInfo={setInfo} />
        ) : (
          <List
            items={items}
            setItems={setItems}
            setInfo={setInfo}
          />
        )}
      </div>
    </>
  );
}
