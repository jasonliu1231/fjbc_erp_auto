"use client";

import { useEffect, useState } from "react";
import { error } from "../../../utils";

export default function Home({ student_id, setInfo }) {
  const [loading, setLoading] = useState(true);
  const [activityList, setActivityList] = useState([]);

  async function getActivity() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/bind/${student_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setActivityList(res);
      setLoading(false);
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
    if (student_id != 0) {
      getActivity();
    }
  }, [student_id]);

  return (
    <>
      <div className="container mx-auto p-2 sm:p-4 mb-40">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white ring-1 ring-gray-900/5 rounded-xl">
            <div className="p-4 grid grid-cols-3 gap-2">
              {activityList.map((item, index) => (
                <div
                  key={index}
                  className="col-span-1 border-2 px-4 py-2 rounded-md hover:border-blue-500 cursor-pointer"
                >
                  <div className="text-blue-500 mb-3">{item.activity_name}</div>
                  <div className="text-sm text-gray-600">{item.remark || "無備注"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
