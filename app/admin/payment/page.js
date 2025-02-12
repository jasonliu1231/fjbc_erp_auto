"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import Tabs from "./tabs";
import Create from "./create";
import List from "./list";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [createView, setCreateView] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("createView")) {
        setCreateView(JSON.parse(sessionStorage.getItem("createView")));
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
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">繳費設定</h1>
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
