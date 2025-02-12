"use client";

import { useEffect, useRef, useState } from "react";
import { error } from "../../../utils";
import Alert from "../../alert";

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
  const [search, setSearch] = useState({
    type: 0,
    bool: true
  });
  const [tutoring_id, setTutoring_id] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productList, setProductsList] = useState([]);

  async function getSettingData(type, bool) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/lend/setting?tutoring_id=${tutoring_id}`;
    if (type) {
      api += `&type=${type}&index=${bool}`;
    }

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setProductsList(res);
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

  async function saveSetting() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tutoring_id: tutoring_id, productList: productList })
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/lend/setting`;

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "設定完成"
      });
      getSettingData();
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
    getSettingData();
  }, [tutoring_id]);

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
      <div className="container mx-auto p-2">
        <div className="mx-auto px-2 py-2 flex justify-between">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">租借設定</h1>
          <div>
            <button
              onClick={() => {
                setTutoring_id(1);
              }}
              className={`${tutoring_id == 1 ? "bg-pink-100" : "bg-white"} mx-1 py-1 px-2 rounded-md`}
            >
              多易
            </button>
            <button
              onClick={() => {
                setTutoring_id(2);
              }}
              className={`${tutoring_id == 2 ? "bg-pink-100" : "bg-white"} mx-1 py-1 px-2 rounded-md`}
            >
              艾思
            </button>
            <button
              onClick={() => {
                setTutoring_id(3);
              }}
              className={`${tutoring_id == 3 ? "bg-pink-100" : "bg-white"} mx-1 py-1 px-2 rounded-md`}
            >
              華而敦
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                saveSetting();
              }}
              className={`bg-green-300 py-1 px-2 rounded-md`}
            >
              儲存
            </button>
          </div>
        </div>

        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="divide-x divide-gray-200">
                <th
                  onClick={() => {
                    if (search.type == 1) {
                      getSettingData(1, !search.bool);
                      setSearch({
                        ...search,
                        bool: !search.bool
                      });
                    } else {
                      getSettingData(1, true);
                      setSearch({
                        ...search,
                        type: 1,
                        bool: true
                      });
                    }
                  }}
                  scope="col"
                  className="whitespace-nowrap py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-blue-200 cursor-pointer"
                >
                  啟用
                </th>
                <th
                  onClick={() => {
                    if (search.type == 2) {
                      getSettingData(2, !search.bool);
                      setSearch({
                        ...search,
                        bool: !search.bool
                      });
                    } else {
                      getSettingData(2, true);
                      setSearch({
                        ...search,
                        type: 2,
                        bool: true
                      });
                    }
                  }}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-blue-200 cursor-pointer"
                >
                  類別
                </th>
                <th
                  onClick={() => {
                    if (search.type == 3) {
                      getSettingData(3, !search.bool);
                      setSearch({
                        ...search,
                        bool: !search.bool
                      });
                    } else {
                      getSettingData(3, true);
                      setSearch({
                        ...search,
                        type: 3,
                        bool: true
                      });
                    }
                  }}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-blue-200 cursor-pointer"
                >
                  群組
                </th>
                <th
                  onClick={() => {
                    if (search.type == 4) {
                      getSettingData(4, !search.bool);
                      setSearch({
                        ...search,
                        bool: !search.bool
                      });
                    } else {
                      getSettingData(4, true);
                      setSearch({
                        ...search,
                        type: 4,
                        bool: true
                      });
                    }
                  }}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-blue-200 cursor-pointer"
                >
                  商品
                </th>
                <th
                  onClick={() => {
                    if (search.type == 6) {
                      getSettingData(6, !search.bool);
                      setSearch({
                        ...search,
                        bool: !search.bool
                      });
                    } else {
                      getSettingData(6, true);
                      setSearch({
                        ...search,
                        type: 6,
                        bool: true
                      });
                    }
                  }}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-blue-200 cursor-pointer"
                >
                  庫存
                </th>
                <th
                  onClick={() => {
                    if (search.type == 5) {
                      getSettingData(5, !search.bool);
                      setSearch({
                        ...search,
                        bool: !search.bool
                      });
                    } else {
                      getSettingData(5, true);
                      setSearch({
                        ...search,
                        type: 5,
                        bool: true
                      });
                    }
                  }}
                  scope="col"
                  className="whitespace-nowrap py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-blue-200 cursor-pointer"
                >
                  數量
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {productList.length > 0 &&
                productList.map((item) => (
                  <tr
                    key={item.product_id}
                    className="divide-x divide-gray-200 hover:bg-blue-100"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">
                      <input
                        onChange={(e) => {
                          setProductsList(
                            productList.map((i) => {
                              if (i.product_id == item.product_id) {
                                return {
                                  ...i,
                                  enable: e.target.checked
                                };
                              } else {
                                return i;
                              }
                            })
                          );
                        }}
                        checked={item.enable}
                        type="checkbox"
                        className="w-full"
                      />
                    </td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{item.pc_name}</td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{item.pg_name}</td>
                    <td className="p-4 text-sm text-gray-500">{item.name}</td>
                    <td className="p-4 text-sm text-gray-500">{item.total || 0}</td>

                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                      <input
                        onChange={(e) => {
                          setProductsList(
                            productList.map((i) => {
                              if (i.product_id == item.product_id) {
                                return {
                                  ...i,
                                  max_quantity: Number(e.target.value)
                                };
                              } else {
                                return i;
                              }
                            })
                          );
                        }}
                        value={item.max_quantity}
                        type="number"
                        className="border w-12"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
