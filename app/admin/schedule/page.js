"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import Tabs from "./tabs";
import Create from "./create";
import List from "./list";
import List2 from "./list2";
import Calander from "./calander";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [viewType, setViewType] = useState(2);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("schedule_type")) {
        setViewType(JSON.parse(sessionStorage.getItem("schedule_type")));
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料讀取中...</span>
      </div>
    );
  }

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">排課</h1>
        </div>
        <Tabs
          viewType={viewType}
          setViewType={setViewType}
        />
        {viewType == 1 ? <Create setInfo={setInfo} /> : viewType == 2 ? <List2 setInfo={setInfo} /> : viewType == 3 ? <List setInfo={setInfo} /> : <Calander setInfo={setInfo} />}
      </div>
    </>
  );
}
