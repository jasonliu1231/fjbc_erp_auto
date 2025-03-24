"use client";

import { Label, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { XMarkIcon, TrashIcon, CheckIcon, ChevronUpDownIcon, ArrowLongLeftIcon, ChevronRightIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { error } from "../../utils";
import LogList from "./log";
import Alert from "../alert";
import * as XLSX from "xlsx";
import { Calendar } from "react-multi-date-picker";

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" },
  { id: 4, name: "總倉" }
];

const def_search = {
  tutoring_list: [4],
  type: 0,
  state: 999,
  index: true,
  product_category_id: 0,
  product_group_id: 0,
  product_id: 0,
  begin: "",
  end: ""
};

const def_create = {
  create_at: new Date(),
  purchasedetail_id: null,
  product_group_id: 0,
  product_category_id: 0,
  tutoring_product_id: 0,
  new_product_name: "",
  state: true,
  quantity: 0,
  money: 0,
  tutoringid: 4,
  remark: "",
  usage: 0
};

const def_transaction = {
  tutoring_product_id: 0,
  in_location: 0,
  out_location: 0,
  quantity: 0
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const [searchDialog, setSearchDialog] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [productList, setProductsList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [search, setSearch] = useState(def_search);

  const [transaction, setTransaction] = useState(false);
  const [transactionData, setTransactionData] = useState(def_transaction);
  const [createData, setCreateData] = useState(def_create);
  const [tradeDialog, setTradeDialog] = useState(false);

  const [query, setQuery] = useState("");
  const filteredProduct =
    query === ""
      ? productList
      : productList.filter((product) => {
          return product.name.toLowerCase().includes(query.toLowerCase());
        });

  const filter_group = createData.product_category_id == 0 ? groupList : groupList.filter((i) => i.product_category_id == createData.product_category_id);
  const filter_product = createData.product_group_id == 0 ? productList : productList.filter((i) => i.product_group_id == createData.product_group_id);
  const items_amount = stockList.reduce((val, item) => val + item.amount, 0);

  // 從 HTML 表格中擷取資料
  function getTableData() {
    const table = document.getElementById("myTable");
    const rows = table.querySelectorAll("tbody tr");

    // 提取表格中的資料，只選擇 Name 和 Age 欄位
    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      data.push({
        補習班名稱: cells[0].innerText,
        種類: cells[1].innerText,
        類別: cells[2].innerText,
        商品名稱: cells[3].innerText,
        數量: cells[4].innerText
      });
    });

    return data;
  }

  function ExportToExcel() {
    const date = new Date();
    const exportTableToExcel = () => {
      // 呼叫函數來取得選定的欄位資料
      const selectedData = getTableData();

      // 將選擇的資料轉為 worksheet
      const worksheet = XLSX.utils.json_to_sheet(selectedData);

      // 創建新的 workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 將 workbook 寫入 Excel 檔案
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_Stock.xlsx`);
    };

    return (
      <button
        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={exportTableToExcel}
      >
        下載 Excel
      </button>
    );
  }

  async function submit() {
    if (createData.tutoringid == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇入庫單位！"
      });
      return;
    }
    if (createData.quantity == 0 || createData.quantity < 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請確認入庫數量！"
      });
      return;
    }
    if (createData.tutoring_product_id == 0 && createData.new_product_name == "") {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇或建立入庫商品！"
      });
      return;
    }
    if (!createData.state && createData.usage == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇用途！"
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
      body: JSON.stringify(createData)
    };
    let api = "";
    if (createData.state) {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_product_detail/in`;
    } else {
      api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_product_detail/out`;
    }

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getStock();
      setTradeDialog(false);
      setCreateData(def_create);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function putTransaction() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transactionData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_product_detail/adj`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "調貨完成！"
      });
      getStock();
      setTransactionData(def_transaction);
      setTransaction(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getStock() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(search)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_product_detail/stock/list`, config);
    const res = await response.json();
    if (response.ok) {
      setStockList(res);
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

  async function getAllData() {
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

    Promise.all([api1, api2, api3]).then(async ([response1, response2, response3]) => {
      const res1 = await response1.json();
      const res2 = await response2.json();
      const res3 = await response3.json();

      if (response1.ok) {
        setCategoryList(res1.filter((i) => i.enable));
      } else {
        const msg = error(response1.status, res1);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      if (response2.ok) {
        setGroupList(res2.filter((i) => i.enable));
      } else {
        const msg = error(response2.status, res2);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      if (response3.ok) {
        setProductsList(res3.filter((i) => i.enable));
      } else {
        const msg = error(response3.status, res3);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    });
  }

  useEffect(() => {
    getAllData();
    getStock();
  }, []);

  useEffect(() => {
    getStock();
  }, [search]);

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
      {/* 調貨 */}
      <Dialog
        open={transaction}
        onClose={() => {}}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-xl text-center">調貨</div>
              <div className="py-2">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">轉入單位</label>
                  <select
                    value={transactionData.in_location}
                    onChange={(e) => {
                      setTransactionData({
                        ...transactionData,
                        in_location: Number(e.target.value)
                      });
                    }}
                    className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                  >
                    {transactionData.in_location == 0 && <option value={0}></option>}
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
                <label className="block text-sm font-medium text-red-400 mt-2">庫存量：{transactionData.total}</label>
                <input
                  value={transactionData.quantity}
                  onChange={(event) => {
                    setTransactionData({
                      ...transactionData,
                      quantity: Number(event.target.value)
                    });
                  }}
                  type="number"
                  placeholder="調出數量"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                />
              </div>
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setTransactionData(def_transaction);
                    setTransaction(false);
                  }}
                  className="mx-1 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-600 hover:bg-gray-300"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!transactionData.in_location) {
                      alert("請選擇轉出對象！");
                      return;
                    }
                    if (!transactionData.quantity || transactionData.quantity < 1) {
                      alert("數量不正確！");
                      return;
                    }
                    putTransaction();
                  }}
                  className="mx-1 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 進出庫 */}
      <Dialog
        open={tradeDialog}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-2xl text-blue-400 text-center mb-4">{`${createData.state ? "進貨" : "出貨"}`}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="col-span-1 row-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">日期</label>
                  <div className="flex justify-center">
                    <Calendar
                      value={createData.create_at}
                      onChange={(value) => {
                        setCreateData({
                          ...createData,
                          create_at: value.format("YYYY-MM-DD")
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">單位</label>
                  <select
                    value={createData.tutoringid}
                    onChange={(e) => {
                      setCreateData({
                        ...createData,
                        tutoringid: Number(e.target.value)
                      });
                    }}
                    className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                  >
                    {createData.tutoringid == 0 && <option value={0}></option>}
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
                {createData.state || (
                  <div className="col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">用途</label>
                    <select
                      value={createData.usage}
                      onChange={(e) => {
                        setCreateData({
                          ...createData,
                          usage: Number(e.target.value)
                        });
                      }}
                      className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                    >
                      <option value={0}></option>
                      <option value={1}>學生用</option>
                      <option value={2}>教師用</option>
                      <option value={3}>行政用</option>
                    </select>
                  </div>
                )}

                <div className={`${createData.state ? "row-span-3" : "row-span-2"} col-span-1 `}>
                  <label className="block text-sm font-medium leading-6 text-gray-900">備註</label>
                  <textarea
                    value={createData.remark || ""}
                    onChange={(event) => {
                      setCreateData({
                        ...createData,
                        remark: event.target.value
                      });
                    }}
                    placeholder="備註"
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                  />
                </div>
                {createData.state && (
                  <div className="col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">類別</label>
                    <select
                      value={createData.category}
                      onChange={(e) => {
                        setCreateData({
                          ...createData,
                          product_category_id: e.target.value,
                          product_group_id: 0,
                          tutoring_product_id: 0
                        });
                      }}
                      className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                    >
                      {createData.product_category_id == 0 && <option value={0}></option>}
                      {categoryList.map((i) => (
                        <option
                          key={i.id}
                          value={i.id}
                        >
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {createData.state && (
                  <div className="col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">群組</label>
                    <select
                      value={createData.product_group_id}
                      onChange={(e) => {
                        setCreateData({
                          ...createData,
                          product_group_id: e.target.value,
                          tutoring_product_id: 0
                        });
                      }}
                      className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                    >
                      {createData.product_group_id == 0 && <option value={0}></option>}
                      {filter_group.map((i) => (
                        <option
                          key={i.id}
                          value={i.id}
                        >
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">商品</label>
                  <select
                    value={createData.tutoring_product_id}
                    onChange={(e) => {
                      setCreateData({
                        ...createData,
                        tutoring_product_id: e.target.value
                      });
                    }}
                    className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                  >
                    {createData.tutoring_product_id == 0 && <option value={0}></option>}
                    {filter_product.map((i) => (
                      <option
                        key={i.id}
                        value={i.id}
                      >
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>

                {createData.state && (
                  <div className="col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">建立商品</label>
                    <input
                      value={createData.new_product_name}
                      onChange={(event) => {
                        setCreateData({
                          ...createData,
                          new_product_name: event.target.value
                        });
                      }}
                      type="text"
                      placeholder="新增商品名"
                      className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                )}

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    數量<span className="text-red-400">（庫存量：{createData.total}）</span>
                  </label>
                  <input
                    value={createData.quantity}
                    onChange={(event) => {
                      setCreateData({
                        ...createData,
                        quantity: Number(event.target.value)
                      });
                    }}
                    type="number"
                    placeholder="數量"
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                  />
                </div>

                {createData.state && (
                  <div className="col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">單價</label>
                    <input
                      value={createData.money}
                      onChange={(event) => {
                        setCreateData({
                          ...createData,
                          money: Number(event.target.value)
                        });
                      }}
                      type="number"
                      placeholder="單價"
                      className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                )}

                <div className="col-span-2 flex justify-center items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setTradeDialog(false);
                      setCreateData(def_create);
                    }}
                    className="mr-4 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-600 hover:bg-gray-300"
                  >
                    取消
                  </button>
                  <button
                    onClick={submit}
                    type="button"
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                  >
                    送出
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 搜尋 */}
      <Dialog
        open={searchDialog}
        onClose={setSearchDialog}
        className="relative z-10"
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-gray-900">搜尋列表</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setSearchDialog(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon
                            aria-hidden="true"
                            className="h-6 w-6"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">單位</label>
                      {tutoring.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setSearch({
                              ...search,
                              tutoring_list: search.tutoring_list.some((i) => i == item.id) ? search.tutoring_list.filter((i) => i != item.id) : [...search.tutoring_list, item.id]
                            });
                          }}
                          className={`${search.tutoring_list.some((i) => i == item.id) ? "ring-red-300" : "ring-gray-300"} m-1 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">時間範圍</label>
                      <div className="flex justify-center">
                        <Calendar
                          value={[search.begin, search.end]}
                          onChange={(value) => {
                            if (value[1]) {
                              setSearch({
                                ...search,
                                begin: value[0].format("YYYY-MM-DD"),
                                end: value[1].format("YYYY-MM-DD")
                              });
                            }
                          }}
                          range
                          rangeHover
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">進出項</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch({
                            ...search,
                            state: 999
                          });
                        }}
                        className={`${search.state == 999 ? "ring-red-300" : "ring-gray-300"} m-1 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
                      >
                        全部
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch({
                            ...search,
                            state: true
                          });
                        }}
                        className={`${search.state != 999 && search.state ? "ring-red-300" : "ring-gray-300"} m-1 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
                      >
                        進項
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch({
                            ...search,
                            state: false
                          });
                        }}
                        className={`${search.state != 999 && !search.state ? "ring-red-300" : "ring-gray-300"} m-1 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
                      >
                        出項
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">類別</label>
                      <select
                        value={search.product_category_id}
                        onChange={(e) => {
                          setSearch({
                            ...search,
                            product_category_id: e.target.value
                          });
                        }}
                        className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                      >
                        {search.product_category_id == 0 && <option value={0}></option>}
                        {categoryList.map((i) => (
                          <option
                            key={i.id}
                            value={i.id}
                          >
                            {i.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">群組</label>
                      <select
                        value={search.product_group_id}
                        onChange={(e) => {
                          setSearch({
                            ...search,
                            product_group_id: e.target.value
                          });
                        }}
                        className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                      >
                        {search.product_group_id == 0 && <option value={0}></option>}
                        {groupList.map((i) => (
                          <option
                            key={i.id}
                            value={i.id}
                          >
                            {i.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Combobox
                        as="div"
                        value={search.product_id}
                        onChange={(product) => {
                          setQuery("");
                          if (product) {
                            setSearch({
                              ...search,
                              product_id: product.id
                            });
                          }
                        }}
                      >
                        <Label className="block text-sm/6 font-medium text-gray-900">商品</Label>
                        <div className="relative mt-2">
                          <ComboboxInput
                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            onChange={(event) => setQuery(event.target.value)}
                            onBlur={() => setQuery("")}
                            displayValue={(product) => product?.name}
                          />
                          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="size-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </ComboboxButton>

                          {filteredProduct.length > 0 && (
                            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                              {filteredProduct.map((product) => (
                                <ComboboxOption
                                  key={product.id}
                                  value={product}
                                  className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                                >
                                  <span className="block truncate group-data-[selected]:font-semibold">{product.name}</span>

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
                      {/* <label className="block text-sm font-medium leading-6 text-gray-900">商品</label>
                      <select
                        value={search.product_id}
                        onChange={(e) => {
                          setSearch({
                            ...search,
                            product_id: e.target.value
                          });
                        }}
                        className="rounded-md border-0 px-3 py-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300"
                      >
                        {search.product_id == 0 && <option value={0}></option>}
                        {productList.map((i) => (
                          <option
                            key={i.id}
                            value={i.id}
                          >
                            {i.name}
                          </option>
                        ))}
                      </select> */}
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSearch(def_search);
                        }}
                        className={`mt-4 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
                      >
                        重新整理
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 ">
        <div className="mx-auto px-2 py-2 flex justify-between items-end">
          <div className="flex">
            <h1 className="text-2xl font-semibold text-gray-900 mr-2">庫存管理</h1>
            <button
              onClick={() => {
                setTradeDialog(true);
                setCreateData({
                  ...createData,
                  state: true
                });
              }}
              type="button"
              className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 bg-blue-300`}
            >
              進貨
            </button>
            <button
              onClick={() => {
                setTradeDialog(true);
                setCreateData({
                  ...createData,
                  state: false
                });
              }}
              type="button"
              className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 bg-blue-300`}
            >
              出貨
            </button>
          </div>

          <div className="flex justify-between">
            <div className="px-2 mr-4 rounded-md bg-white flex items-center">
              <span className="text-sm text-gray-600">列表總價值：</span>
              <span className={`${items_amount > 0 ? "text-green-600" : "text-red-600"} text-xl`}>{items_amount}</span>
            </div>
            <button
              onClick={() => {
                setSearchDialog(true);
              }}
              type="button"
              className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 bg-white`}
            >
              搜尋
            </button>
            <LogList
              update={tradeDialog}
              setInfo={setInfo}
            />
            <ExportToExcel />
          </div>
        </div>

        <div className="mt-4">
          <table
            id="myTable"
            className="min-w-full divide-y divide-gray-300 mt-2"
          >
            <thead className="bg-gray-50">
              <tr className="sticky top-0">
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
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300 pl-6"
                >
                  歸屬
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
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300"
                >
                  種類
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
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300"
                >
                  類別
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
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300"
                >
                  名稱
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
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300"
                >
                  庫存
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
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300"
                >
                  價值
                </th>
                <th
                  scope="col"
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300"
                >
                  調貨
                </th>
                <th
                  scope="col"
                  className="p-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-blue-300"
                >
                  出貨
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {stockList.map((stock, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap p-2 text-sm font-medium text-gray-900 pl-6">{tutoring.map((i) => (i.id == stock.tutoringid ? i.name : "")).join("")}</td>
                  <td className="whitespace-nowrap p-2 text-sm text-gray-500">{stock.pcname}</td>
                  <td className="p-2 text-sm text-gray-500">{stock.pgname}</td>
                  <td className="p-2 text-sm font-medium text-gray-900">{stock.pname}</td>
                  <td className={`${stock.total < 0 ? "text-red-500" : "text-green-500"} whitespace-nowrap p-2 text-sm`}>{stock.total}</td>
                  <td className={`${stock.amount < 0 ? "text-red-500" : "text-green-500"} whitespace-nowrap p-2 text-sm`}>{stock.amount}</td>
                  <td className={`whitespace-nowrap p-2 text-sm`}>
                    <div
                      onClick={() => {
                        setTransactionData({
                          ...transactionData,
                          total: stock.total,
                          tutoring_product_id: stock.pid,
                          out_location: stock.tutoringid // 調出店家
                        });
                        setTransaction(true);
                      }}
                      className="flex text-red-400 cursor-pointer"
                    >
                      <ArrowLeftEndOnRectangleIcon className="w-5 h-5" /> 調貨
                    </div>
                  </td>
                  <td className={`whitespace-nowrap p-2 text-sm`}>
                    <div
                      onClick={() => {
                        setTradeDialog(true);
                        setCreateData({
                          ...createData,
                          tutoring_product_id: stock.pid,
                          total: stock.total,
                          tutoringid: stock.tutoringid,
                          state: false
                        });
                      }}
                      className="flex text-orange-400 cursor-pointer"
                    >
                      <ArrowLeftEndOnRectangleIcon className="w-5 h-5" /> 出貨
                    </div>
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
