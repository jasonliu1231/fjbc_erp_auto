"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Radio, RadioGroup } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";

export default function Home({ setInfo }) {
  const type = useRef(0);
  const state = useRef(0);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [productList, setProductsList] = useState([]);
  const [data, setData] = useState({ name: "" });
  const [selected, setSelected] = useState({
    category: "",
    group: ""
  });

  const filterGroup = selected.category != "" ? groupList.filter((i) => i.product_category_id == selected.category) : groupList;
  const filterProduct = selected.group != "" ? productList.filter((i) => i.product_group_id == selected.group) : productList;

  async function postCategory() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/category`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function putCategory() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/category`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function switchCategory() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/category`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function postGroup() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/group`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function putGroup() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/group`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function switchGroup() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/group`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function postProduct() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function putProduct() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function switchProduct() {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function moveGroup() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/group/move`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function moveProduct() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/move`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getAllProduct();
      setDialog(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function checkItems() {
    if (type.current == 1) {
      if (!data.name) {
        setInfo({
          show: true,
          success: false,
          msg: "請填寫名稱"
        });
      }
    }

    if (state.current == 1) {
      postCategory();
    } else if (state.current == 2) {
      putCategory();
    } else if (state.current == 3) {
      switchCategory();
    } else if (state.current == 4) {
      postGroup();
    } else if (state.current == 5) {
      putGroup();
    } else if (state.current == 6) {
      switchGroup();
    } else if (state.current == 7) {
      postProduct();
    } else if (state.current == 8) {
      putProduct();
    } else if (state.current == 9) {
      switchProduct();
    } else if (state.current == 10) {
      moveGroup();
    } else if (state.current == 11) {
      moveProduct();
    }
  }

  async function getAllProduct() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const api1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/category/list`, config);
    const api2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/group/list`, config);
    const api3 = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/product/list`, config);

    Promise.all([api1, api2, api3])
      .then(async ([response1, response2, response3]) => {
        const res1 = await response1.json();
        const res2 = await response2.json();
        const res3 = await response3.json();

        if (response1.ok) {
          setCategoryList(res1);
        } else {
          const msg = error(response1.status, res1);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (response2.ok) {
          setGroupList(res2);
        } else {
          const msg = error(response2.status, res2);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (response3.ok) {
          setProductsList(res3);
        } else {
          const msg = error(response3.status, res3);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllProduct();
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
      {/* 彈出視窗 */}
      <Dialog
        open={dialog}
        onClose={() => {}}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-gray-900"
                  >
                    {data.title}
                  </DialogTitle>
                  {type.current == 1 && (
                    <div>
                      <label className="block text-lg font-medium text-gray-900 text-left">名稱</label>
                      <div className="mt-2">
                        <input
                          value={data.name}
                          onChange={(e) => {
                            setData({
                              ...data,
                              name: e.target.value
                            });
                          }}
                          type="text"
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  )}
                  {type.current == 2 && <div className="mt-3 text-red-400">關閉時會一起關閉細項</div>}
                  {type.current == 3 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {categoryList.map((item) => (
                        <div
                          onClick={() => {
                            setData({
                              ...data,
                              product_category_id: item.id
                            });
                          }}
                          key={item.id}
                          className={`${data.product_category_id == item.id ? "border-red-300" : "border-gray-300"} col-span-1 border-2 p-2 cursor-pointer`}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {type.current == 4 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {groupList.map((item) => (
                        <div
                          onClick={() => {
                            setData({
                              ...data,
                              product_group_id: item.id
                            });
                          }}
                          key={item.id}
                          className={`${data.product_group_id == item.id ? "border-red-300" : "border-gray-300"} col-span-1 border-2 p-2 cursor-pointer`}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setDialog(false);
                  }}
                  className="mx-2 px-3 py-2 text-sm font-semibold text-red-300 ring-2 ring-pink-300 hover:bg-red-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    checkItems();
                  }}
                  className="mx-2 bg-green-600 px-3 py-2 text-sm font-semibold text-white ring-2 ring-green-300 hover:bg-green-500"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <div className="font-semibold text-xl">
              商品類別
              <button
                onClick={() => {
                  type.current = 1;
                  state.current = 1;
                  setData({
                    ...data,
                    title: "類別新增"
                  });
                  setDialog(true);
                }}
                type="button"
                className="ml-3 relative inline-flex items-end rounded-md bg-sky-300 px-2 py-1 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-sky-400 focus:z-10"
              >
                <PlusCircleIcon
                  aria-hidden="true"
                  className="-ml-0.5 h-5 w-5"
                />
                新增類別
              </button>
            </div>{" "}
            {categoryList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelected({
                    ...selected,
                    category: item.id,
                    group: ""
                  });
                }}
                className={`${selected.category == item.id ? "border-orange-400 " : "border-gray-200 "} ${
                  item.enable ? "bg-white" : "bg-gray-400"
                } border-2 hover:bg-gray-100 rounded-md px-2 py-1 m-2 cursor-pointer`}
              >
                <div className="truncate font-semibold">{item.name}</div>
                <div className="flex justify-between">
                  <div className="text-sm">修改時間：{new Date(item.update_at).toLocaleDateString()}</div>
                  <div className="text-sm">修改人：{item.nick_name}</div>
                </div>
                <div className="flex justify-around mt-2">
                  {item.enable && (
                    <>
                      <div>
                        <button
                          onClick={() => {
                            type.current = 1;
                            state.current = 2;
                            setData({
                              title: "類別修改",
                              id: item.id,
                              name: item.name
                            });
                            setDialog(true);
                          }}
                          type="button"
                          className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-blue-400 hover:bg-blue-300"
                        >
                          修改
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            type.current = 1;
                            state.current = 4;
                            setData({
                              title: "新增群組",
                              product_category_id: item.id
                            });
                            setDialog(true);
                          }}
                          type="button"
                          className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-green-400 hover:bg-green-300"
                        >
                          新增群組
                        </button>
                      </div>
                    </>
                  )}
                  <div>
                    <button
                      onClick={() => {
                        type.current = 2;
                        state.current = 3;
                        setData({
                          title: item.enable ? "類別關閉" : "類別開啟",
                          enable: item.enable ? false : true,
                          id: item.id
                        });
                        setDialog(true);
                      }}
                      type="button"
                      className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-red-400 hover:bg-red-300"
                    >
                      {item.enable ? "關閉" : "開啟"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-1">
            {" "}
            <div className="font-semibold text-xl">商品群組</div>
            {selected.category &&
              filterGroup.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelected({
                      ...selected,
                      group: item.id
                    });
                  }}
                  className={`${selected.group == item.id ? "border-orange-400 " : "border-gray-200 "} ${
                    item.enable ? "bg-white" : "bg-gray-400"
                  } border-2 hover:bg-gray-100 rounded-md px-2 py-1 m-2 cursor-pointer`}
                >
                  <div className="truncate font-semibold">
                    <div className="text-sm text-gray-400">{item.pc_name}</div>
                    <div> {item.name}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">修改時間：{new Date(item.update_at).toLocaleDateString()}</div>
                    <div className="text-sm">修改人：{item.nick_name}</div>
                  </div>
                  <div className="flex justify-around mt-2">
                    {item.enable && (
                      <>
                        <div>
                          <button
                            onClick={() => {
                              type.current = 1;
                              state.current = 5;
                              setData({
                                title: "類別修改",
                                id: item.id,
                                name: item.name
                              });
                              setDialog(true);
                            }}
                            type="button"
                            className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-blue-400 hover:bg-blue-300"
                          >
                            修改
                          </button>
                        </div>

                        <div>
                          <button
                            onClick={() => {
                              type.current = 1;
                              state.current = 7;
                              setData({
                                title: "新增商品",
                                product_group_id: item.id
                              });
                              setDialog(true);
                            }}
                            type="button"
                            className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-green-400 hover:bg-green-300"
                          >
                            新增商品
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              type.current = 3;
                              state.current = 10;
                              setData({
                                title: "移動群組",
                                id: item.id,
                                product_category_id: item.product_category_id
                              });
                              setDialog(true);
                            }}
                            type="button"
                            className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-orange-400 hover:bg-orange-300"
                          >
                            轉移
                          </button>
                        </div>
                      </>
                    )}

                    <div>
                      <button
                        onClick={() => {
                          type.current = 2;
                          state.current = 6;
                          setData({
                            title: item.enable ? "群組關閉" : "群組開啟",
                            enable: item.enable ? false : true,
                            id: item.id
                          });
                          setDialog(true);
                        }}
                        type="button"
                        className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-red-400 hover:bg-red-300"
                      >
                        {item.enable ? "關閉" : "開啟"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-span-1">
            {" "}
            <div className="col-span-12 font-semibold text-xl mx-2">商品</div>
            {selected.group &&
              filterProduct.map((item) => (
                <div
                  key={item.id}
                  className={`${selected.group == item.id ? "border-orange-400 " : "border-gray-200 "} ${item.enable ? "bg-white" : "bg-gray-400"} border-2 hover:bg-gray-100 rounded-md px-2 py-1 m-2`}
                >
                  <div className="font-semibold">
                    <span className="text-sm text-gray-400">{item.pc_name}</span>
                    <span className="text-sm text-gray-400 mx-1">{`>`}</span>
                    <span className="text-sm text-gray-400">{item.pg_name}</span>
                    <div> {item.name}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">修改時間：{new Date(item.update_at).toLocaleDateString()}</div>
                    <div className="text-sm">修改人：{item.nick_name}</div>
                  </div>
                  <div className="flex justify-around mt-2">
                    {item.enable && (
                      <>
                        <div>
                          <button
                            onClick={() => {
                              type.current = 1;
                              state.current = 8;
                              setData({
                                title: "類別商品",
                                id: item.id,
                                name: item.name
                              });
                              setDialog(true);
                            }}
                            type="button"
                            className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-blue-400 hover:bg-blue-300"
                          >
                            修改
                          </button>
                        </div>

                        <div>
                          <button
                            onClick={() => {
                              type.current = 4;
                              state.current = 11;
                              setData({
                                title: "移動商品",
                                id: item.id,
                                product_group_id: item.product_group_id
                              });
                              setDialog(true);
                            }}
                            type="button"
                            className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-orange-400 hover:bg-orange-300"
                          >
                            轉移
                          </button>
                        </div>
                      </>
                    )}

                    <div>
                      <button
                        onClick={() => {
                          type.current = 2;
                          state.current = 9;
                          setData({
                            title: item.enable ? "商品關閉" : "商品開啟",
                            enable: item.enable ? false : true,
                            id: item.id
                          });
                          setDialog(true);
                        }}
                        type="button"
                        className="px-4 py-1 text-sm font-semibold text-gray-600 ring-2 ring-red-400 hover:bg-red-300"
                      >
                        {item.enable ? "關閉" : "開啟"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
