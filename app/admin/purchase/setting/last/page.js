"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../../../utils";
import Alert from "../../../alert";

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
  tutoringid: 4,
  remark: "",
  usage: 3,
  product_group_id: 0,
  product_category_id: 0,
  new_product_name: ""
};

const def_finish = {
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
  const [purchase, setPurchase] = useState({});
  const [stockItem, setStockItem] = useState({});
  const [detail, setDetail] = useState([]);

  const [openLog, setOpenLog] = useState(false);
  const [log, setLog] = useState([]);

  const [openEnd, setOpenEnd] = useState(false);
  const [finishData, setFinishData] = useState(def_finish);

  const [openStock, setOpenStock] = useState(false);
  const [stockData, setStockData] = useState(def_create);

  const [productList, setProductsList] = useState({
    category: [],
    group: [],
    product: []
  });
  const [query, setQuery] = useState("");
  const filteredProduct =
    query === ""
      ? productList.product
      : productList.product.filter((product) => {
          return product.name.toLowerCase().includes(query.toLowerCase());
        });

  async function setPurchaseState(id, state) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase?id=${id}&state=${state}`, config);
    const res = await response.json();
    setLoading(false);
    if (response.ok) {
      window.location.href = `/admin/purchase`;
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

  async function getPurchase(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase?id=${id}&state=4`, config);
    const res = await response.json();
    setLoading(false);
    if (response.ok) {
      setPurchase(res.entity);
      setDetail(res.detail);
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

  async function getLog(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/detail/log?detail_id=${id}`, config);
    const res = await response.json();
    setLoading(false);
    if (response.ok) {
      setLog(res);
      setOpenLog(true);
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

  async function switchDetail(item) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: item.id, disabled: !item.disabled })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/detail`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getPurchase(purchase.id);
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
      body: JSON.stringify({
        ...finishData,
        data: purchase,
        detail: detail.filter((item) => !item.disabled)
      })
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/finish`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      window.location.href = `/admin/purchase/setting/finish?id=${purchase.id}`;
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function reject() {
    const check = confirm(`確定要關閉嗎？`);
    if (!check) {
      return;
    }
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/purchase/reject?id=${purchase.id}`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/purchase`;
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
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    getPurchase(id);
    getProductsLis();
  }, []);
  console.log(stockItem);
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
      {/* 紀錄視窗 */}
      <Dialog
        open={openLog}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="text-left sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-blue-500 text-center"
                  >
                    入庫紀錄
                  </DialogTitle>
                  <div className="mt-2">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr className="bg-green-200">
                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            商品
                          </th>
                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            數量
                          </th>

                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            單位
                          </th>
                          <th
                            scope="col"
                            className="p-2 font-semibold text-gray-900"
                          >
                            經手人
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white text-sm">
                        {log.map((item, index) => (
                          <tr
                            key={index}
                            className={`even:bg-sky-50`}
                          >
                            <td className="p-2 text-gray-700">{item.name}</td>
                            <td className="p-2 text-gray-700">{item.quantity}</td>
                            <td className="p-2 text-gray-700">{item.tutoring}</td>
                            <td className="p-2 text-gray-700">{item.first_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpenLog(false);
                  }}
                  className="mr-4 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-600 hover:bg-gray-300"
                >
                  關閉
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
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
                  <div className="mt-2 border-b-2">
                    <div className="grid grid-cols-4 bg-blue-100 py-2">
                      <div>{stockItem.name}</div>
                      <div>x{stockItem.quantity}</div>
                      <div>{stockItem.specification}</div>
                      <div>${stockItem.price}</div>
                    </div>
                  </div>
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
      <div className="container mx-auto p-2">
        <div className="mx-auto px-2 py-4">
          <h1 className="text-lg font-semibold text-gray-900">採購單瀏覽</h1>
        </div>
        <div className="bg-white p-4 rounded-md">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-1 text-md font-semibold">
              <div className="text-red-800">編號：{purchase.id}</div>
              <div className="text-blue-800">狀態：待結案</div>
              <select
                value={purchase.state}
                onChange={(e) => {
                  setPurchaseState(purchase.id, e.target.value);
                }}
                className="border border-gray-400 rounded-md px-2 py-1"
              >
                <option value={1}>待初審</option>
                <option value={2}>待報價</option>
                <option value={3}>待複審</option>
                <option value={4}>待結案</option>
                <option value={5}>已結案</option>
              </select>
            </div>
            <div className="col-span-4 flex my-4 h-8 m-auto">
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待初審</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-200 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待報價</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-200 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative border-red-400`}>
                <div className="absolute lineStr text-sm text-gray-300">待複審</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-300 border-pink-400`}></div>
              </div>
              <div className={`w-40 border-b-2 relative color-step`}>
                <div className="absolute lineStr font-semibold">待結案</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-red-300 border-red-400`}></div>
              </div>
              <div className={`w-40 relative`}>
                <div className="absolute lineStr text-sm">已結案</div>
                <div className={`absolute linePoint bottom-0 w-5 h-5 rounded-full border-2 bg-gray-300 border-gray-400`}></div>
              </div>
            </div>
            <div className="col-span-1 flex justify-end items-start">
              <div className="flex">
                <button
                  onClick={reject}
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
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">申請人：</span>
              <span className="text-sky-600 font-semibold">{purchase.createby}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">單位：</span>
              <span className="text-sky-600 font-semibold">{tutoring.filter((i) => i.id == purchase?.tutoringid)[0]?.name}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">申請時間：</span>
              <span className="text-sky-600 font-semibold">{new Date(purchase.createdon).toLocaleString()}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">課程：</span>
              <span className="text-sky-600 font-semibold">{purchase.class}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">需求日期：</span>
              <span className="text-sky-600 font-semibold">{new Date(purchase.deadline).toLocaleDateString()}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">事由：</span>
              <span className="text-sky-600 font-semibold">{purchase.reason}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">初審人：</span>
              <span className="text-pink-600 font-semibold">{purchase.firstby}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">報價人：</span>
              <span className="text-pink-600 font-semibold">{purchase.secondby}</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <span className="text-gray-600">複審人：</span>
              <span className="text-pink-600 font-semibold">{purchase.lastby}</span>
            </div>
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-green-200">
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        商品名稱
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        訂購數量
                      </th>

                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        單位
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        規格
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900"
                      >
                        備註
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900 text-right"
                      >
                        單價
                      </th>
                      <th
                        scope="col"
                        className="p-2 text-left text-sm font-semibold text-gray-900 text-right"
                      >
                        小計
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        設定
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap p-2 text-center text-sm font-semibold text-gray-900"
                      >
                        紀錄
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {detail.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${item.disabled ? "bg-gray-400" : "even:bg-yellow-50"}`}
                      >
                        <td className="p-2 text-xs font-medium text-gray-700">{item.name}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.quantity}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.unit}</td>
                        <td className="p-2 text-xs font-medium text-gray-700">{item.specification}</td>
                        <td className="p-2 text-xs font-medium text-gray-700 w-1/4">{item.remark}</td>
                        <td className="p-2 text-xs font-medium text-gray-700 text-right">{item.price}</td>
                        <td className="p-2 text-sm font-medium text-gray-700 text-right">{item.price * item.quantity}</td>
                        <td className="p-2 text-xs font-medium text-gray-700 w-1/6">
                          <div className="flex justify-center">
                            {item.disabled ? null : (
                              <button
                                onClick={() => {
                                  setOpenStock(true);
                                  setStockItem(item);
                                  setStockData({
                                    ...stockData,
                                    purchasedetail_id: item.id,
                                    amount: item.price * item.quantity
                                  });
                                }}
                                type="button"
                                className="mx-1 rounded bg-sky-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-sky-500"
                              >
                                入庫
                              </button>
                            )}
                            <button
                              onClick={() => {
                                switchDetail(item);
                              }}
                              type="button"
                              className={`${item.disabled ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"} mx-1 rounded  px-2 py-1 text-sm text-white shadow-sm `}
                            >
                              {item.disabled ? "開啟" : "關閉"}
                            </button>
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            getLog(item.id);
                          }}
                          className="p-2 text-sm font-medium text-blue-700 text-center cursor-pointer hover:text-sky-700"
                        >
                          查看
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-right text-sm px-2">
                        <div className="grid grid-cols-2">
                          <span>運費：</span>
                          <span className="text-blue-600">{purchase.transportation || 0}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span>總計：</span>
                          <span className="text-pink-600">{purchase.transportation + detail.reduce((sun, item) => sun + (item.disabled ? 0 : item.quantity * item.price), 0)}</span>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
