"use client";

import { useEffect, useState } from "react";
import { error } from "../../utils";
import Alert from "../alert";

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" }
];
export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [type, setType] = useState(1);
  const [purchaseList, setPurchaseList] = useState([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState({
    type: 8,
    index: true
  });
  const [query, setQuery] = useState("");

  const filterCreate =
    query === ""
      ? purchaseList
      : purchaseList.filter((item) => {
          const createby = item.createby?.toLowerCase() || "";

          return createby.includes(query.toLowerCase());
        });

  const filterList = filterCreate.filter((i) => i.state == type);

  async function getPurchaseList() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(search)
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/list`;
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setPurchaseList(res);
      setReady(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      return;
    }
  }

  useEffect(() => {
    getPurchaseList();
  }, [search]);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4 flex justify-between">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">採購單</h1>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="申請人搜尋"
            type="text"
            className="mx-1 rounded px-2 py-1 text-sm font-semibold text-gray-600 shadow-sm"
          />

          <button
            onClick={() => {
              window.location.href = `/admin/purchase/create`;
            }}
            type="button"
            className="mx-1 rounded bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            新增
          </button>
        </div>
        <div>
          <div className="block">
            <div className="border-b border-gray-200">
              <nav
                aria-label="Tabs"
                className="-mb-px flex space-x-8"
              >
                <span
                  onClick={() => {
                    setType(1);
                  }}
                  className={`${
                    type == 1 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer`}
                >
                  新申請
                  <span className={`${type == 1 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-900"} ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}>
                    {filterCreate.filter((i) => i.state == 1).length}
                  </span>
                </span>
                <span
                  onClick={() => {
                    setType(2);
                  }}
                  className={`${
                    type == 2 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer`}
                >
                  待報價
                  <span className={`${type == 2 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-900"} ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}>
                    {filterCreate.filter((i) => i.state == 2).length}
                  </span>
                </span>
                <span
                  onClick={() => {
                    setType(3);
                  }}
                  className={`${
                    type == 3 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer`}
                >
                  待複審
                  <span className={`${type == 3 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-900"} ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}>
                    {filterCreate.filter((i) => i.state == 3).length}
                  </span>
                </span>
                <span
                  onClick={() => {
                    setType(4);
                  }}
                  className={`${
                    type == 4 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer`}
                >
                  待結案
                  <span className={`${type == 4 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-900"} ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}>
                    {filterCreate.filter((i) => i.state == 4).length}
                  </span>
                </span>
                <span
                  onClick={() => {
                    setType(5);
                  }}
                  className={`${
                    type == 5 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer`}
                >
                  已結案
                  <span className={`${type == 5 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-900"} ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}>
                    {filterCreate.filter((i) => i.state == 5).length}
                  </span>
                </span>
              </nav>
            </div>
          </div>
        </div>
        {ready ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mt-4">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => {
                      if (search.type == 8) {
                        setSearch({
                          ...search,
                          index: !search.index
                        });
                      } else {
                        setSearch({
                          ...search,
                          type: 8,
                          index: true
                        });
                      }
                    }}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 hover:bg-blue-200"
                  >
                    編號
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 1) {
                        setSearch({
                          ...search,
                          index: !search.index
                        });
                      } else {
                        setSearch({
                          ...search,
                          type: 1,
                          index: true
                        });
                      }
                    }}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 hover:bg-blue-200"
                  >
                    申請人
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 2) {
                        setSearch({
                          ...search,
                          index: !search.index
                        });
                      } else {
                        setSearch({
                          ...search,
                          type: 2,
                          index: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    申請時間
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 3) {
                        setSearch({
                          ...search,
                          index: !search.index
                        });
                      } else {
                        setSearch({
                          ...search,
                          type: 3,
                          index: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    單位
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 4) {
                        setSearch({
                          ...search,

                          index: !search.index
                        });
                      } else {
                        setSearch({
                          ...search,
                          type: 4,
                          index: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    課程
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 5) {
                        setSearch({
                          ...search,
                          index: !search.index
                        });
                      } else {
                        setSearch({
                          ...search,
                          type: 5,
                          index: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    事由
                  </th>
                  <th
                    onClick={() => {
                      if (search.type == 6) {
                        setSearch({
                          ...search,
                          index: !search.index
                        });
                      } else {
                        setSearch({
                          ...search,
                          type: 6,
                          index: true
                        });
                      }
                    }}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                  >
                    期限
                  </th>
                  {type != 1 && type != 2 ? (
                    <th
                      onClick={() => {
                        if (search.type == 7) {
                          setSearch({
                            ...search,
                            index: !search.index
                          });
                        } else {
                          setSearch({
                            ...search,
                            type: 7,
                            index: true
                          });
                        }
                      }}
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200"
                    >
                      總金額
                    </th>
                  ) : null}
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filterList.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-sky-100"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{purchase.id}</td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{purchase.createby}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{new Date(purchase.createdon).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{tutoring.filter((i) => i.id == purchase.tutoringid)[0].name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{purchase.class}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{purchase.reason}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{new Date(purchase.deadline).toLocaleDateString()}</td>
                    {type != 1 && type != 2 ? <td className="px-3 py-4 text-sm text-gray-500">{purchase.amount + purchase.transportation - purchase.discount}</td> : null}
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div>
                        <button
                          onClick={() => {
                            if (type == 1) {
                              window.location.href = `/admin/purchase/setting/first?id=${purchase.id}`;
                            } else if (type == 2) {
                              window.location.href = `/admin/purchase/setting/sell?id=${purchase.id}`;
                            } else if (type == 3) {
                              window.location.href = `/admin/purchase/setting/second?id=${purchase.id}`;
                            } else if (type == 4) {
                              window.location.href = `/admin/purchase/setting/last?id=${purchase.id}`;
                            } else if (type == 5) {
                              window.location.href = `/admin/purchase/setting/finish?id=${purchase.id}`;
                            }
                          }}
                          type="button"
                          className="mx-1 rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                          查看
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="spinner mt-4"></div>
        )}
      </div>
    </>
  );
}
