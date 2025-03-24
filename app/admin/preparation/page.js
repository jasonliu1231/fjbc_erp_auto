"use client";

import { useEffect, useRef, useState } from "react";
import { error } from "../../utils";
import Alert from "../alert";

const tutoring = [
  {
    id: 1,
    name: "多易",
    imageUrl: "/doyi.png",
    addr: "臺中市太平區新興路171號、169號",
    phone: "04-23959481"
  },
  {
    id: 2,
    name: "艾思",
    imageUrl: "/funapple2.png",
    addr: "臺中市太平區新興路171號、169號",
    phone: "04-23952885"
  },
  {
    id: 3,
    name: "華而敦",
    imageUrl: "/funapple2.png",
    addr: "臺中市北屯區崇德五路146巷28號",
    phone: "04-22471682"
  }
];

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [items, setItems] = useState([]);
  const [type, setType] = useState(1);
  const [loading, setLoading] = useState(true);
  const [t, setT] = useState(0);
  const [isClose, setIsClose] = useState(false);
  const [search, setSearch] = useState({
    type: 0,
    bool: true
  });

  const list1 = isClose ? items.filter((i) => i.isclose == true) : items.filter((i) => i.isclose == false);
  const list = t == 0 ? list1 : list1.filter((i) => i.tutoring_id == t);

  const ask = list.filter((i) => i.admission != true);
  const admission = list.filter((i) => i.admission == true);

  async function getPreparation(type, bool) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/preparation/list?type=${type || 0}&index=${bool || true}`;
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setItems(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    getPreparation();
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
      <div className="container mx-auto p-2 sm:p-4">
        <div className="flex justify-between items-end">
          <div className="block">
            <div className="border-b border-gray-200">
              <nav
                aria-label="Tabs"
                className="-mb-px flex space-x-8"
              >
                <div
                  aria-current={type == 1 ? "page" : undefined}
                  onClick={() => {
                    setType(1);
                  }}
                  className={`${
                    type == 1 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
                >
                  問班表
                  {ask.length > 0 ? (
                    <span className={`${type == 1 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-900"} ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}>
                      {ask.length}
                    </span>
                  ) : null}
                </div>
                <div
                  aria-current={type == 2 ? "page" : undefined}
                  onClick={() => {
                    setType(2);
                  }}
                  className={`${
                    type == 2 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
                >
                  入班表
                  {admission.length > 0 ? (
                    <span className={`${type == 2 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-900"} ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}>
                      {admission.length}
                    </span>
                  ) : null}
                </div>
              </nav>
            </div>
          </div>
          <div>
            <span className="isolate inline-flex rounded-md shadow-sm">
              <button
                onClick={() => {
                  setIsClose(!isClose);
                }}
                type="button"
                className={`${
                  isClose ? "ring-4 ring-red-300" : "ring-1 ring-gray-300"
                } relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10`}
              >
                已關閉
              </button>
              <button
                onClick={() => {
                  setT(0);
                }}
                type="button"
                className="relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              >
                全部
              </button>
              {tutoring.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setT(t.id);
                  }}
                  type="button"
                  className="relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  {t.name}
                </button>
              ))}
            </span>
          </div>
        </div>
        {type == 1 ? (
          <>
            <table className="min-w-full divide-y divide-gray-300 bg-white shadow-sm ring-1 ring-gray-200 rounded-md my-4">
              <thead>
                <tr>
                  <th
                    onClick={() => {
                      if (search.type == 1) {
                        getPreparation(1, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(1, true);
                        setSearch({
                          ...search,
                          type: 1,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    補習班
                  </th>
                  <th
                    // onClick={() => {
                    //   if (search.type == 2) {
                    //     getPreparation(2, !search.bool);
                    //     setSearch({
                    //       ...search,
                    //       bool: !search.bool
                    //     });
                    //   } else {
                    //     getPreparation(2, true);
                    //     setSearch({
                    //       ...search,
                    //       type: 2,
                    //       bool: true
                    //     });
                    //   }
                    // }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                  >
                    建表時間
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 2) {
                        getPreparation(2, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(2, true);
                        setSearch({
                          ...search,
                          type: 2,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    姓名
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 3) {
                        getPreparation(3, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(3, true);
                        setSearch({
                          ...search,
                          type: 3,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    面談時間
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 5) {
                        getPreparation(5, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(5, true);
                        setSearch({
                          ...search,
                          type: 5,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    試聽時間
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 7) {
                        getPreparation(7, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(7, true);
                        setSearch({
                          ...search,
                          type: 7,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    試聽
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 4) {
                        getPreparation(4, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(4, true);
                        setSearch({
                          ...search,
                          type: 4,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    測驗時間
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 8) {
                        getPreparation(8, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(8, true);
                        setSearch({
                          ...search,
                          type: 8,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    測驗
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 6) {
                        getPreparation(6, !search.bool);
                        setSearch({
                          ...search,
                          bool: !search.bool
                        });
                      } else {
                        getPreparation(6, true);
                        setSearch({
                          ...search,
                          type: 6,
                          bool: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    等級
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4"
                  >
                    <span className="sr-only">細節</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ask.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{tutoring.filter((i) => i.id == item.tutoring_id)[0].name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(item.createdon).toLocaleString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.chinese_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.meeting && new Date(item.meeting).toLocaleString("zh-TW", { hour12: false })}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.trialclass && new Date(item.trialclass).toLocaleString("zh-TW", { hour12: false })}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`${item.arrive ? "text-green-300" : "text-red-300"}`}>{item.arrive ? "完成" : "未完成"}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.exam && new Date(item.exam).toLocaleString("zh-TW", { hour12: false })}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`${item.test ? "text-green-300" : "text-red-300"}`}>{item.test ? "完成" : "未完成"}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.level}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <a
                        href={`/admin/preparation/detail?id=${item.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        查看
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : type == 2 ? (
          <>
            <table className="min-w-full divide-y divide-gray-300 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl my-4">
              <thead>
                <tr>
                  <th
                    onClick={() => {
                      getPreparation(1);
                    }}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    補習班
                  </th>
                  <th
                    onClick={() => {
                      getPreparation(2);
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    姓名
                  </th>
                  <th
                    onClick={() => {
                      getPreparation(3);
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    試聽時間
                  </th>
                  <th
                    onClick={() => {
                      getPreparation(4);
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    檢測時間
                  </th>
                  <th
                    onClick={() => {
                      getPreparation(6);
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    檢測等級
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4"
                  >
                    <span className="sr-only">細節</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admission.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{item.tutoring_id && tutoring.filter((i) => i.id == item.tutoring_id)[0].name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.chinese_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.meeting && new Date(item.meeting).toLocaleString("zh-TW", { hour12: false })}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.exam && new Date(item.exam).toLocaleString("zh-TW", { hour12: false })}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.level}</td>
                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.role}</td> */}
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <a
                        href={`/admin/preparation/detail?id=${item.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        查看
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
      </div>
    </>
  );
}
