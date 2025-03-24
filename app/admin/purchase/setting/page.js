"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../../utils";
import Alert from "../../alert";

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" },
  { id: 4, name: "總倉" }
];

const def_create = {
  create_at: new Date().toISOString().split("T")[0],
  tutoring_product_id: 0,
  purchasedetail_id: 0,
  state: true,
  quantity: 0,
  amount: 0,
  money: 0,
  tutoringid: 0,
  remark: "",
  usage: 3,
  product_group_id: 0,
  product_category_id: 0,
  new_product_name: ""
};

const def_finish = {
  data: [],
  detail: {},
  discount: 0,
  invoice: "",
  remark: ""
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const submitData = useRef({});
  const type = useRef();
  const [openStock, setOpenStock] = useState(false);
  const [stockData, setStockData] = useState(def_create);
  const [finishData, setFinishData] = useState(def_finish);
  const [purchase, setPurchase] = useState();
  const [productList, setProductsList] = useState({
    category: [],
    group: [],
    product: []
  });
  const [updateDate, setUpdateDate] = useState();
  const [ready, setReady] = useState(false);

  const [openEnd, setOpenEnd] = useState(false);
  const [transportation, setTransportation] = useState(0);
  const [query, setQuery] = useState("");

  const filteredProduct =
    query === ""
      ? productList.product
      : productList.product.filter((product) => {
          return product.name.toLowerCase().includes(query.toLowerCase());
        });

  if (purchase) {
    type.current = purchase.entity.state;
    // if (purchase.entity.firstchecked == null) {
    //   type.current = 1;
    // } else if (purchase.entity.firstchecked != null && purchase.entity.secondchecked == null) {
    //   type.current = 2;
    // } else if (purchase.entity.secondchecked != null && purchase.entity.lastchecked == null) {
    //   type.current = 3;
    // } else if (purchase.entity.lastchecked != null && purchase.entity.closedon == null) {
    //   type.current = 4;
    // } else {
    //   type.current = 5;
    // }
  }
  // 單純顯示，不需要修改寫好公式就好
  const amount = updateDate?.reduce((total, item) => total + item.price * item.quantity, 0) + Number(transportation) - purchase?.entity.discount;

  async function getPurchase(id) {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        user_id: localStorage.getItem("user_id")
      }
    };
    const response = await fetch(`/api/purchasedetail?id=${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setFinishData({
        ...finishData,
        data: res.entity,
        detail: res.detail
      });
      setPurchase(res);
      setUpdateDate(res.detail);
      setTransportation(res.entity.transportation || 0);
      getProductsLis();
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

  async function stockProducts() {
    if (stockData.tutoringid == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇入庫單位！"
      });
      return;
    }
    if (stockData.quantity == 0 || stockData.quantity < 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請確認入庫數量！"
      });
      return;
    }
    if (stockData.tutoring_product_id == 0 && stockData.new_product_name == "") {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇或建立入庫商品！"
      });
      return;
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(stockData)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_product_detail/in`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      setStockData(def_create);
      setOpenStock(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function purchaseFinish() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finishData)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/finish`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getPurchase(finishData.data.id);
      setOpenEnd(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function submit() {
    submitData.current.user = localStorage.getItem("name");
    submitData.current.amount = amount;
    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        user_id: localStorage.getItem("user_id")
      },
      body: JSON.stringify(submitData.current)
    };
    const response = await fetch(`/api/purchase`, config);
    const res = await response.json();
    if (response.ok) {
      if (submitData.current.type == 4) {
        setInfo({
          show: true,
          success: true,
          msg: "操作完成！"
        });
        window.location.href = "/admin/purchase";
      } else {
        setInfo({
          show: true,
          success: true,
          msg: "操作完成！"
        });
        getPurchase(res.id);
      }
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateItem(index, type) {
    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        user_id: localStorage.getItem("user_id")
      },
      body: JSON.stringify({
        type: type,
        user: localStorage.getItem("name"),
        item: updateDate[index]
      })
    };
    const response = await fetch(`/api/purchasedetail`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getPurchase(res.id);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getProductsLis() {
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

        if (!response1.ok) {
          const msg = error(response1.status, res1);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (!response2.ok) {
          const msg = error(response2.status, res2);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (!response3.ok) {
          const msg = error(response3.status, res3);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        setProductsList({
          category: res1.filter((i) => i.enable),
          group: res2.filter((i) => i.enable),
          product: res3.filter((i) => i.enable)
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    submitData.current.purchaseid = id;

    getPurchase(id);
  }, []);

  function setUpdate(item, val, index) {
    const list = updateDate.map((p, i) => {
      if (i == index) {
        return {
          ...p,
          [item]: val
        };
      } else {
        return p;
      }
    });
    setUpdateDate(list);
  }
  // 先給一筆折扣
  submitData.current.discount = 0;

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
      {/* 結案視窗 */}
      <Dialog
        open={openEnd}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    結案
                  </DialogTitle>
                  <div className="mt-2">
                    <div>
                      <label className="block text-sm font-medium leading-6  text-blue-600 text-left">折扣金額</label>
                      <input
                        value={finishData.discount}
                        onChange={(event) => {
                          setFinishData({
                            ...finishData,
                            discount: Number(event.target.value)
                          });
                        }}
                        type="number"
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6  text-blue-600 text-left">發票</label>
                      <input
                        value={finishData.invoice}
                        onChange={(event) => {
                          setFinishData({
                            ...finishData,
                            invoice: event.target.value
                          });
                        }}
                        type="text"
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-blue-600 text-left">備註缺貨原因</label>
                      <textarea
                        value={finishData.remark}
                        onChange={(event) => {
                          setFinishData({
                            ...finishData,
                            remark: event.target.value
                          });
                        }}
                        rows={4}
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpenEnd(false);
                  }}
                  className="mr-4 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-600 hover:bg-gray-300"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    purchaseFinish();
                  }}
                  className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 入庫視窗 */}
      <Dialog
        open={openStock}
        onClose={setOpenStock}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-6xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="text-center">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    入庫
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-blue-600 text-left">入庫單位</label>
                        <select
                          value={stockData.tutoringid}
                          onChange={(event) => {
                            setStockData({
                              ...stockData,
                              tutoringid: Number(event.target.value)
                            });
                          }}
                          className="mt-1 block w-full rounded-md border-0 p-1 text-gray-900 ring-1 ring-inset ring-gray-300"
                        >
                          {stockData.tutoringid == 0 && <option value={0}>請選擇單位</option>}
                          {tutoring.map((i) => (
                            <option
                              key={i.id}
                              value={i.id}
                            >
                              {i.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={`row-span-2 col-span-2`}>
                        <label className="block text-sm font-medium  text-blue-600 text-left">備註</label>
                        <textarea
                          value={stockData.remark}
                          onChange={(event) => {
                            setStockData({
                              ...stockData,
                              remark: event.target.value
                            });
                          }}
                          rows={3}
                          className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-blue-600 text-left">入庫數量</label>
                        <input
                          value={stockData.quantity}
                          onChange={(event) => {
                            setStockData({
                              ...stockData,
                              quantity: Number(event.target.value),
                              money: Number(stockData.amount) / Number(event.target.value)
                            });
                          }}
                          className="mt-1 block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                          type="number"
                          placeholder="入庫數量"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6  text-blue-600 text-left">商品類別</label>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        {productList.category.map((item) => (
                          <div
                            onClick={() => {
                              setStockData({
                                ...stockData,
                                product_category_id: item.id,
                                product_group_id: 0,
                                tutoring_product_id: 0
                              });
                            }}
                            key={item.id}
                            className={`${stockData.product_category_id == item.id ? "border-red-300" : "border-gray-300"} rounded-md col-span-1 border p-1 cursor-pointer`}
                          >
                            {item.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6  text-blue-600 text-left">商品群組</label>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        {productList.group
                          .filter((i) => i.product_category_id == stockData.product_category_id)
                          .map((item) => (
                            <div
                              onClick={() => {
                                setStockData({
                                  ...stockData,
                                  product_group_id: item.id,
                                  tutoring_product_id: 0
                                });
                              }}
                              key={item.id}
                              className={`${stockData.product_group_id == item.id ? "border-red-300" : "border-gray-300"} rounded-md col-span-1 border p-1 cursor-pointer`}
                            >
                              {item.name}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <div className="grid grid-cols-3 gap-2">
                        <Combobox
                          as="div"
                          value={stockData.tutoring_product_id}
                          onChange={(product) => {
                            setQuery("");
                            if (product) {
                              setStockData({
                                ...stockData,
                                tutoring_product_id: product.id,
                                new_product_name: ""
                              });
                            }
                          }}
                        >
                          <Label className="block text-sm font-medium leading-6 text-blue-600 text-left">商品</Label>

                          <div className="relative mt-2">
                            <ComboboxInput
                              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                              onChange={(event) => setQuery(event.target.value)}
                              onBlur={() => setQuery("")}
                              displayValue={(id) => (id != 0 ? filteredProduct.filter((i) => i.id == id)[0].name : "請選擇商品")}
                            />
                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                              <ChevronUpDownIcon
                                className="size-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </ComboboxButton>

                            {filteredProduct.length > 0 && (
                              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                                {filteredProduct
                                  .filter((i) => i.product_group_id == stockData.product_group_id)
                                  .map((product) => (
                                    <ComboboxOption
                                      key={product.id}
                                      value={product}
                                      className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                                    >
                                      <span className="text-left block group-data-[selected]:font-semibold">{product.name}</span>

                                      <span className="absolute inset-y-0 left-0 hidden items-center pl-1.5 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                        <CheckIcon
                                          className="size-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </ComboboxOption>
                                  ))}
                              </ComboboxOptions>
                            )}
                          </div>
                        </Combobox>
                        {/* {productList.product
                          .filter((i) => i.product_group_id == stockData.product_group_id)
                          .map((item) => (
                            <div
                              onClick={() => {
                                setStockData({
                                  ...stockData,
                                  tutoring_product_id: item.id,
                                  new_product_name: ""
                                });
                              }}
                              key={item.id}
                              className={`${stockData.tutoring_product_id == item.id ? "border-red-300" : "border-gray-300"} rounded-md col-span-1 border p-1 cursor-pointer`}
                            >
                              {item.name}
                            </div>
                          ))} */}
                        {stockData.product_category_id != 0 && stockData.product_group_id != 0 && stockData.tutoring_product_id == 0 && (
                          <div className="flex items-end col-span-1">
                            <input
                              value={stockData.new_product_name}
                              onChange={(event) => {
                                setStockData({
                                  ...stockData,
                                  new_product_name: event.target.value
                                });
                              }}
                              className="p-1 w-full block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                              type="text"
                              placeholder="建立新品"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpenStock(false);
                    setStockData(def_create);
                  }}
                  className="mr-4 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-600 hover:bg-gray-300"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={stockProducts}
                  className="inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 sm:p-4 mb-40">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">採購單瀏覽</h1>
        </div>
        {ready ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <div className="flex my-4 h-8">
                  <div className={`${type.current == 1 ? "text-red-400" : ""} ${type.current > 1 ? "border-red-400" : ""} w-40 border-b-2 relative`}>
                    <div className="absolute lineStr">待初審</div>
                    <div className={`${type.current >= 1 ? "bg-red-400 border-pink-700" : "bg-gray-400 border-blue-700"} absolute linePoint bottom-0 w-5 h-5 rounded-full border-2`}></div>
                  </div>
                  <div className={`${type.current == 2 ? "text-red-400" : ""} ${type.current > 2 ? "border-red-400" : ""} w-40 border-b-2 relative`}>
                    <div className="absolute lineStr">待報價</div>
                    <div className={`${type.current >= 2 ? "bg-red-400 border-pink-700" : "bg-gray-400 border-blue-700"} absolute linePoint bottom-0 w-5 h-5 rounded-full border-2`}></div>
                  </div>
                  <div className={`${type.current == 3 ? "text-red-400" : ""} ${type.current > 3 ? "border-red-400" : ""} w-40 border-b-2 relative`}>
                    <div className="absolute lineStr">待複審</div>
                    <div className={`${type.current >= 3 ? "bg-red-400 border-pink-700" : "bg-gray-400 border-blue-700"} absolute linePoint bottom-0 w-5 h-5 rounded-full border-2`}></div>
                  </div>
                  <div className={`${type.current == 4 ? "text-red-400" : ""} ${type.current > 4 ? "border-red-400" : ""} w-40 border-b-2 relative`}>
                    <div className="absolute lineStr">待結案</div>
                    <div className={`${type.current >= 4 ? "bg-red-400 border-pink-700" : "bg-gray-400 border-blue-700"} absolute linePoint bottom-0 w-5 h-5 rounded-full border-2`}></div>
                  </div>
                  <div className={`${type.current == 5 ? "text-red-400" : ""} ${type.current > 5 ? "border-red-400" : ""} w-40 relative`}>
                    <div className="absolute lineStr">已結案</div>
                    <div className={`${type.current >= 5 ? "bg-red-400 border-pink-700" : "bg-gray-400 border-blue-700"} absolute linePoint bottom-0 w-5 h-5 rounded-full border-2`}></div>
                  </div>
                </div>
                <h1 className="text-xl text-base font-semibold leading-6 text-blue-800">
                  狀態：
                  {type.current == 1 ? "待初審" : type.current == 2 ? "待報價" : type.current == 3 ? "待複審" : type.current == 4 ? "待結案" : "已結案"}
                </h1>
                <p className="mt-2 text-lg text-gray-700 w-full">
                  <span className="w-1/3 inline-block">申請人：{purchase.entity.createby}</span>
                  <span className="mx-4">單位：{tutoring.filter((i) => i.id == purchase.entity.tutoringid)[0].name}</span>
                </p>
                <p className="mt-2 text-lg text-gray-700">
                  <span className="w-1/3 inline-block">申請時間：{new Date(purchase.entity.createdon).toLocaleString()}</span>
                  <span className="mx-4">課程：{purchase.entity.class}</span>
                </p>
                <p className="mt-2 text-lg text-gray-700">
                  <span className="w-1/3 inline-block">需求日期：{new Date(purchase.entity.deadline).toLocaleDateString()}</span>
                  <span className="mx-4">事由：{purchase.entity.reason}</span>
                </p>
                {type.current > 2 && (
                  <p className="mt-2 text-lg text-gray-700">
                    <span>運費：{purchase.entity.transportation}</span>
                  </p>
                )}
                {type.current == 5 && (
                  <>
                    <p className="mt-2 text-lg text-gray-700">
                      <span>折扣金額：{purchase.entity.discount}</span>
                    </p>
                    <p className="mt-2 text-lg text-gray-700">
                      <span>註記：{purchase.entity.remark}</span>
                    </p>
                  </>
                )}
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                {type.current == 1 ? (
                  <div className="flex">
                    <button
                      onClick={() => {
                        submitData.current.type = 1;
                        submitData.current.checked = true;
                        submit();
                      }}
                      type="button"
                      className="mx-1 block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      通過
                    </button>
                    <button
                      onClick={() => {
                        submitData.current.type = 1;
                        submitData.current.checked = false;
                        submit();
                      }}
                      type="button"
                      className="mx-1 block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                      駁回
                    </button>
                  </div>
                ) : type.current == 2 ? (
                  <div className="flex items-center">
                    {updateDate.filter((i) => i.updatedon == null).length == 0 ? (
                      <>
                        <div>運費：</div>
                        <input
                          value={transportation}
                          onChange={(event) => {
                            submitData.current.transportation = event.target.value;
                            setTransportation(event.target.value);
                          }}
                          type="number"
                          placeholder="運費"
                          className="pl-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                        />
                        <button
                          onClick={() => {
                            submitData.current.type = 2;
                            submitData.current.checked = true;
                            submit();
                          }}
                          type="button"
                          className="mx-1 block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                        >
                          報價
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-red-400">尚有商品未確認</span>
                    )}
                  </div>
                ) : type.current == 3 ? (
                  <div className="flex">
                    <button
                      onClick={() => {
                        submitData.current.type = 3;
                        submitData.current.checked = true;
                        submit();
                      }}
                      type="button"
                      className="mx-1 block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      通過
                    </button>
                    <button
                      onClick={() => {
                        submitData.current.type = 3;
                        submitData.current.checked = false;
                        submit();
                      }}
                      type="button"
                      className="mx-1 block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                      駁回
                    </button>
                  </div>
                ) : type.current == 4 ? (
                  <div className="flex">
                    <button
                      onClick={() => {
                        submitData.current.type = 3;
                        submitData.current.checked = false;
                        submit();
                      }}
                      type="button"
                      className="mx-1 block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                      消單
                    </button>
                    <button
                      onClick={() => {
                        setOpenEnd(true);
                      }}
                      type="button"
                      className="mx-1 block rounded-md bg-yellow-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
                    >
                      結案
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end text-xl">總計：{amount}</div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                          colSpan={3}
                        >
                          商品名稱
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          訂購數量
                        </th>
                        {/* {type.current == 4 && (
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            未到數量
                          </th>
                        )} */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          單位
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          規格
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          備註
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          單價
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          小計
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {updateDate.map((item, index) => (
                        <tr
                          key={item.id}
                          className="even:bg-yellow-50"
                        >
                          <td
                            className="w-1/3 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
                            colSpan={3}
                          >
                            <input
                              className="w-full pl-1 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                              value={item.name || ""}
                              onChange={(event) => {
                                setUpdate("name", event.target.value, index);
                              }}
                              type="text"
                              disabled={type.current == 2 || type.current == 3 ? false : true}
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                              value={item.quantity || ""}
                              onChange={(event) => {
                                setUpdate("quantity", event.target.value, index);
                              }}
                              type="number"
                              disabled={type.current == 2 || type.current == 3 ? false : true}
                            />
                          </td>
                          {/* {type.current == 4 && (
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <input
                                className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                value={item.remainder || 0}
                                type="number"
                                disabled={true}
                              />
                            </td>
                          )} */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                              value={item.unit || ""}
                              onChange={(event) => {
                                setUpdate("unit", event.target.value, index);
                              }}
                              type="text"
                              disabled={type.current == 2 || type.current == 3 ? false : true}
                            />
                          </td>
                          <td className="w-1/12 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                              value={item.specification || ""}
                              onChange={(event) => {
                                setUpdate("specification", event.target.value, index);
                              }}
                              type="text"
                              disabled={type.current == 2 || type.current == 3 ? false : true}
                            />
                          </td>
                          <td className="w-1/6 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                              value={item.remark || ""}
                              onChange={(event) => {
                                setUpdate("remark", event.target.value, index);
                              }}
                              type="text"
                              disabled={type.current == 2 || type.current == 3 ? false : true}
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              className="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                              value={item.price || ""}
                              onChange={(event) => {
                                setUpdate("price", event.target.value, index);
                              }}
                              type="number"
                              disabled={type.current == 2 || type.current == 3 ? false : true}
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.price * item.quantity}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <div>
                              {type.current == 2 || type.current == 3 ? (
                                <>
                                  <button
                                    onClick={() => {
                                      updateItem(index, 1);
                                    }}
                                    type="button"
                                    className={`${item.updatedon ? "bg-yellow-600 hover:bg-yellow-500" : "bg-green-600 hover:bg-green-500"} mx-1 rounded  px-2 py-1 text-sm text-white shadow-sm `}
                                  >
                                    {item.updatedon ? "修改" : "確認"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      updateItem(index, 2);
                                    }}
                                    type="button"
                                    className="mx-1 rounded bg-red-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-red-500"
                                  >
                                    關閉
                                  </button>
                                </>
                              ) : type.current == 4 ? (
                                <div className="flex">
                                  <button
                                    onClick={() => {
                                      setOpenStock(true);
                                      setStockData({
                                        ...stockData,
                                        amount: item.price * item.quantity
                                      });
                                    }}
                                    type="button"
                                    className="mx-1 rounded bg-sky-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-sky-500"
                                  >
                                    入庫
                                  </button>
                                  <button
                                    onClick={() => {
                                      updateItem(index, 2);
                                    }}
                                    type="button"
                                    className="mx-1 rounded bg-red-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-red-500"
                                  >
                                    關閉
                                  </button>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="spinner mt-4"></div>
        )}
      </div>
    </>
  );
}
