"use client";

import { useEffect, useState } from "react";

const today = new Date();

const def_search = {
  begin: new Date(new Date().setDate(today.getDate() - 7)).toISOString().split("T")[0], // 7 天前
  end: today.toISOString().split("T")[0] // 今日
};

export default function Home({ student_id, setInfo }) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(def_search);
  const [contactBook, setContactBook] = useState([]);

  async function getContactBook() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ student_id, ...search })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/contact_book/list`, config);
    const res = await response.json();

    if (response.ok) {
      setContactBook(res);
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
      getContactBook();
    }
  }, [search]);

  return (
    <>
      <div className="container mx-auto p-2 sm:p-4 mb-40">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white ring-1 ring-gray-900/5 rounded-xl py-2 px-4">
            <div className="flex justify-center">
              <input
                value={search.begin}
                onChange={(e) => {
                  setSearch({
                    ...search,
                    begin: e.target.value
                  });
                }}
                className="border-2 px-2 py-1 rounded-md mx-1"
                type="date"
              />
              <input
                value={search.end}
                onChange={(e) => {
                  setSearch({
                    ...search,
                    end: e.target.value
                  });
                }}
                className="border-2 px-2 py-1 rounded-md mx-1"
                type="date"
              />
            </div>
            {contactBook.map((item) => (
              <div className="grid grid-cols-3 gap-1 border-2 border-blue-300 p-2 mt-4 rounded-md">
                <div className="col-span-1 border p-2 text-center rounded-md">
                  <div className="grid grid-cols-2">
                    <div className="col-span-1 px-2 py-1 bg-blue-200 border-b-2">課程日期</div>
                    <div className="col-span-1 px-2 py-1 border-b-2 border-gray-400 text-gray-400">{item.course_date}</div>
                    <div className="col-span-1 px-2 py-1 bg-blue-200 border-b-2">課程名稱</div>
                    <div className="col-span-1 px-2 py-1 border-b-2 border-gray-400 text-blue-400">{item.course_name}</div>
                    <div className="col-span-1 px-2 py-1 bg-blue-200">考試提醒</div>
                    <div className="col-span-1 px-2 py-1">{item.next_quiz}</div>
                  </div>
                  <div className="mt-2">
                    <div className="px-2 py-1 bg-blue-200 border-b-2">課程內容</div>
                    <pre className="border-2 min-h-20 text-xs text-left py-2 px-2">{item.progress}</pre>
                  </div>
                  <div className="mt-2">
                    <div className="px-2 py-1 bg-blue-200 border-b-2">作業</div>
                    <pre className="border-2 min-h-20 text-xs text-left py-2 px-2">{item.homework}</pre>
                  </div>
                  <div className="mt-2">
                    <div className="px-2 py-1 bg-blue-200 border-b-2">老師評語</div>
                    <pre className="border-2 min-h-20 text-xs text-left py-2 px-2">{item.teacher_sugg}</pre>
                  </div>
                  <div className="mt-2">
                    <div className="px-2 py-1 bg-blue-200 border-b-2">家長回覆</div>
                    <pre className="border-2 min-h-20 text-xs text-left py-2 px-2">{item.parent_sugg}</pre>
                  </div>
                  <div className="mt-2">
                    <div className="px-2 py-1 bg-blue-200 border-b-2">家長簽名</div>
                    <div className={`${item.parent_sign ? "text-gray-400" : "text-red-400"} border-2 py-2 px-2`}>{item.parent_sign ? "已簽名" : "未簽名"}</div>
                  </div>
                </div>
                <div className="col-span-1 border p-2 rounded-md text-sm">
                  <div className="ring-1 p-1">
                    <div className="bg-yellow-100 text-center py-1">課堂表現</div>
                    <div
                      className="text-gray-600 py-2"
                      dangerouslySetInnerHTML={{ __html: item.a_col }}
                    />
                  </div>
                  <div className="ring-1 p-1">
                    <div className="bg-yellow-100 text-center py-1">作業狀況</div>
                    <div
                      className="text-gray-600 py-2"
                      dangerouslySetInnerHTML={{ __html: item.b_col }}
                    />
                  </div>
                  <div className="ring-1 p-1">
                    <div className="bg-yellow-100 text-center py-1">本週表現評分</div>
                    {Array.from({ length: 9 }, (_, index) => {
                      const directions = `c_col_${index + 1}_directions`;
                      const value = `c_col_${index + 1}`;
                      return (
                        <div
                          key={index}
                          className="py-2"
                        >
                          <span className="text-gray-600">{item[directions]}</span>
                          <span className="text-sky-500 ml-2">{item[value] == 1 ? "優秀(A+)" : item[value] == 2 ? "良好(A)" : item[value] == 3 ? "中等(B)" : item[value] == 4 ? "進步中" : null}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-1 border p-2 rounded-md">
                  {item.exam?.map((item, index) => {
                    if (item) {
                      const obj = item.split("$$");
                      return (
                        <div
                          key={index}
                          className="border-b-2 py-2 flex"
                        >
                          <div>考試成績：{obj[0]}</div>
                          {obj[1] && (
                            <div className="text-pink-500 ml-4">
                              <div>
                                <span>輔導時間：</span>
                                <span>{new Date(obj[1]).toLocaleDateString()}</span>
                                <span> {new Date(obj[1]).toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" }).substr(0, 5)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
