"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { error } from "../../utils";
import Alert from "../alert";
import DatePicker, { Calendar } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" },
  { id: 4, name: "食材" },
  { id: 5, name: "其他" }
];

const def_detail = {
  content: "",
  money: 0,
  quantity: 0,
  unit: "",
  remark: ""
};

const def_data = {
  date: new Date().toISOString().split("T")[0],
  content: "",
  tutoring_id: 0,
  state: false,
  amount: 0,
  invoice: "",
  remark: ""
};

const def_search = {
  tutoring_list: [1, 2, 3, 4, 5],
  type: 0,
  index: true,
  begin: "",
  end: ""
};

const def_update = {
  entity: {},
  detail: []
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [detailSelected, setDetailSelected] = useState("");
  const [amount, setAmount] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [search, setSearch] = useState(def_search);
  const [searchFood, setSearchFood] = useState({});
  const [updateData, setUpdateData] = useState(def_update);
  const [createData, setCreateData] = useState(def_data);
  const [createDetail, setCreateDetail] = useState([def_detail, def_detail, def_detail, def_detail, def_detail]);
  const [billList, setBillList] = useState([]);
  const [billDetail, setBillDetail] = useState([]);
  const [query, setQuery] = useState("");
  const [remark, setRemark] = useState("");
  const [discount, setDiscount] = useState({
    content: "折扣(正數代表增加)",
    money: 0,
    quantity: 0,
    unit: "",
    remark: ""
  });

  // 從 HTML 表格中擷取資料
  function getTableData() {
    const table = document.getElementById("myTable");
    const rows = table.querySelectorAll("tbody tr");

    // 提取表格中的資料，只選擇 Name 和 Age 欄位
    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      data.push({
        日期: cells[0].innerText,
        品項敘述: cells[1].innerText,
        數量: cells[2].innerText,
        單位: cells[3].innerText,
        金額: cells[4].innerText
      });
    });

    return data;
  }

  function ExportToExcel({ tableId, fileName }) {
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
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_Bill.xlsx`);
    };

    return (
      <button
        className="block bg-white px-3 py-2 text-center text-sm font-semibold text-green-600 ring-2 ring-green-600"
        onClick={exportTableToExcel}
      >
        下載 Excel
      </button>
    );
  }

  // 從 HTML 表格中擷取資料
  function getTableData2() {
    const table = document.getElementById("myTable2");
    const rows = table.querySelectorAll("tbody tr");

    // 提取表格中的資料，只選擇 Name 和 Age 欄位
    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      data.push({
        日期: cells[0].innerText,
        單位: cells[1].innerText,
        品項敘述: cells[2].innerText,
        備註: cells[3].innerText,
        支出: cells[4].innerText == "支出" ? cells[5].innerText : 0,
        收入: cells[4].innerText == "收入" ? cells[5].innerText : 0,
        // 金額: cells[5].innerText,
        發票: cells[5].innerText
      });
    });

    return data;
  }

  function ExportToExcel2({ tableId, fileName }) {
    const date = new Date();
    const exportTableToExcel = () => {
      // 呼叫函數來取得選定的欄位資料
      const selectedData = getTableData2();

      // 將選擇的資料轉為 worksheet
      const worksheet = XLSX.utils.json_to_sheet(selectedData);

      // 創建新的 workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 將 workbook 寫入 Excel 檔案
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_Bill.xlsx`);
    };

    return (
      <button
        className="mt-2 w-full px-3 py-2 text-sm font-semibold text-green-600 ring-2 ring-green-600 hover:bg-green-500"
        onClick={exportTableToExcel}
      >
        下載 Excel
      </button>
    );
  }

  async function deleteItem(id) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "單據已刪除"
      });
      getBill();
      getAmount();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function submitReview(id) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "單據已送審"
      });
      getBill();
      getAmount();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateItem() {
    const detail = updateData.detail.filter((i) => i.content != "");
    updateData.detail = detail;
    updateData.entity.amount = detail.reduce((amount, item) => amount + item.money, 0);
    if (updateData.amount <= 0) {
      alert("明細總金額錯誤！");
      return;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "單據已修改"
      });
      setUpdateDialog(false);
      getBill();
      getAmount();
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
    if (!createData.content) {
      alert("請輸入敘述");
      return;
    }

    if (!createData.tutoring_id) {
      alert("請選擇單位");
      return;
    }

    const detail = createDetail.filter((i) => i.content != "");
    // 有折扣寫入，並將資料轉成負數
    if (discount.money != 0) {
      detail.push({ ...discount, money: -discount.money });
    }
    const detail_amount = detail.reduce((amount, item) => amount + item.money, 0);
    if (detail_amount < 0) {
      alert("明細總金額錯誤！");
      return;
    }
    createData.amount = detail_amount;

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: createData, detail: detail })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill`, config);
    const res = await response.json();
    if (response.ok) {
      setDialog(false);
      setCreateData(def_data);
      setCreateDetail([def_detail, def_detail, def_detail, def_detail, def_detail]);
      setInfo({
        show: true,
        success: true,
        msg: "新增完成"
      });
      getBill();
      getAmount();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getBillDetail(bill, type) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: bill.id })
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/detail`;
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      if (type == 1) {
        setBillDetail(res);
        setDetailDialog(true);
      } else if (type == 2) {
        setUpdateData({
          entity: bill,
          detail: res
        });
        setUpdateDialog(true);
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

  async function selectedDetail() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content: detailSelected })
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/detail/selected`;
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setBillDetail(res);
      setDetailDialog(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getBill() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(search)
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/list`;
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setBillList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getAmount() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/amount`;
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setAmount(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getFoodDetail() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(searchFood)
    };
    let api = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/food/detail`;
    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      setBillDetail(res);
      setDetailDialog(true);
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
    getBill();
    getAmount();
  }, [search]);

  const filteredItems =
    query === ""
      ? billList
      : billList.filter((item) => {
          const content = item.content.toLowerCase() || "";
          const invoice = item.invoice?.toLowerCase() || "";
          return content.includes(query.toLowerCase()) || invoice.includes(query.toLowerCase());
        });

  const detail_amount = createDetail.reduce((sum, item) => sum + item.money, 0) - discount.money;
  const update_detail_amount = updateData.detail.reduce((sum, item) => sum + item.money, 0);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      {/* 搜尋彈窗 */}
      <Dialog
        open={open}
        onClose={setOpen}
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
                      <DialogTitle className="text-base font-semibold text-gray-900">條件搜尋</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
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
                  <div className="relative mt-6 flex-1 px-4">
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">時間範圍</label>
                      <div className="flex justify-center">
                        {" "}
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
                      {" "}
                      <label className="block text-sm font-medium leading-6 text-gray-900">單位選取</label>
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
                    <div className="mx-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900">關鍵字搜尋</label>
                      <input
                        onChange={(event) => setQuery(event.target.value)}
                        value={query}
                        type="text"
                        placeholder="發票、內容"
                        className="px-3 py-2 w-full block rounded-md border-0 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                    <div className="mx-1">
                      <ExportToExcel2 />
                    </div>

                    <div className="border-t-4 border-red-400 mt-5">
                      <h1 className="text-xl py-2 text-blue-600">食材明細查詢</h1>
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">時間範圍</label>
                        <div className="flex justify-center">
                          <Calendar
                            value={[searchFood.begin, searchFood.end]}
                            onChange={(value) => {
                              if (value[1]) {
                                setSearchFood({
                                  ...searchFood,
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
                      <button
                        type="button"
                        onClick={() => {
                          getFoodDetail();
                        }}
                        className="mt-2 w-full px-3 py-2 text-sm font-semibold text-red-300 ring-2 ring-pink-300 hover:bg-red-500"
                      >
                        搜尋食材明細
                      </button>
                    </div>

                    <div className="border-t-4 border-red-400 mt-5">
                      <h1 className="text-xl py-2 text-blue-600">品項查詢</h1>
                      <input
                        onChange={(event) => setDetailSelected(event.target.value)}
                        value={detailSelected}
                        type="text"
                        placeholder="品項名稱"
                        className="px-3 py-2 w-full block rounded-md border-0 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          selectedDetail();
                        }}
                        className="mt-2 w-full px-3 py-2 text-sm font-semibold text-red-300 ring-2 ring-pink-300 hover:bg-red-500"
                      >
                        搜尋
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
      {/* 建立彈窗 */}
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
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-5xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="font-semibold leading-6 text-gray-900 flex justify-around my-3"
                  >
                    <span className="isolate inline-flex rounded-md shadow-sm">
                      <button
                        onClick={() => {
                          setCreateData({
                            ...createData,
                            state: true
                          });
                        }}
                        type="button"
                        className={`${
                          createData.state ? "bg-blue-400" : "bg-white"
                        } relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                      >
                        收入
                      </button>
                      <button
                        onClick={() => {
                          setCreateData({
                            ...createData,
                            state: false
                          });
                        }}
                        type="button"
                        className={`${
                          !createData.state ? "bg-blue-400" : "bg-white"
                        } relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                      >
                        支出
                      </button>
                    </span>
                    <span className="isolate inline-flex rounded-md shadow-sm items-end">
                      <div className="text-red-400 mx-2">明細商品名沒填寫視同取消</div>
                      <button
                        onClick={() => {
                          setCreateDetail([...createDetail, def_detail]);
                        }}
                        type="button"
                        className={`bg-yellow-300 relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                      >
                        新增明細
                      </button>
                    </span>
                  </DialogTitle>
                  <div className="grid grid-cols-3 gap-x-4 border-b-2 pb-4">
                    <div className="col-span-1 border-r-2 p-2">
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">使用單位</label>
                        <select
                          value={createData.tutoring_id}
                          onChange={(e) => {
                            setCreateData({
                              ...createData,
                              tutoring_id: Number(e.target.value)
                            });
                          }}
                          className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          <option value={0}>請選擇單位</option>
                          {tutoring.map((item, index) => (
                            <option
                              key={index}
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">時間</label>
                        <DatePicker
                          render={<InputIcon className="p-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />}
                          value={createData.date}
                          onChange={(value) => {
                            setCreateData({
                              ...createData,
                              date: value.format("YYYY-MM-DD")
                            });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">主敘述</label>
                        <input
                          value={createData.content}
                          onChange={(event) => {
                            setCreateData({
                              ...createData,
                              content: event.target.value
                            });
                          }}
                          type="text"
                          placeholder="抬頭"
                          className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">發票</label>
                        <input
                          value={createData.invoice}
                          onChange={(event) => {
                            setCreateData({
                              ...createData,
                              invoice: event.target.value
                            });
                          }}
                          type="text"
                          placeholder="發票號碼"
                          className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">總金額</label>
                        <input
                          value={detail_amount}
                          readOnly={true}
                          type="number"
                          placeholder="未填寫自動計算細項"
                          className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">備註</label>
                        <textarea
                          value={createData.remark}
                          onChange={(event) => {
                            setCreateData({
                              ...createData,
                              remark: event.target.value
                            });
                          }}
                          rows={4}
                          placeholder="備註"
                          className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-span-2">
                      {createDetail.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2"
                        >
                          <div className="col-span-3">
                            <label className="block text-sm/6 font-medium text-gray-900">商品名</label>
                            <input
                              value={item.content}
                              onChange={(event) => {
                                setCreateDetail(
                                  createDetail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        content: event.target.value
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                );
                              }}
                              type="text"
                              placeholder="商品名"
                              className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm/6 font-medium text-gray-900">數量</label>
                            <input
                              value={item.quantity}
                              onChange={(event) => {
                                setCreateDetail(
                                  createDetail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        quantity: Number(event.target.value)
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                );
                              }}
                              type="number"
                              placeholder="數量"
                              className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm/6 font-medium text-gray-900">單位</label>
                            <input
                              value={item.unit}
                              onChange={(event) => {
                                setCreateDetail(
                                  createDetail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        unit: event.target.value
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                );
                              }}
                              type="text"
                              placeholder="單位"
                              className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm/6 font-medium text-gray-900">小計</label>
                            <input
                              value={item.money}
                              onChange={(event) => {
                                setCreateDetail(
                                  createDetail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        money: Number(event.target.value)
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                );
                              }}
                              type="number"
                              placeholder="金額"
                              className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-sm/6 font-medium text-gray-900">備注</label>
                            <input
                              value={item.remark}
                              onChange={(event) => {
                                setCreateDetail(
                                  createDetail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        remark: event.target.value
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                );
                              }}
                              type="text"
                              placeholder="備注"
                              className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-7">
                          <label className="block text-sm/6 font-medium text-gray-900">商品名</label>
                          <input
                            value={discount.content}
                            readOnly={true}
                            className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                          />
                        </div>
                        {/* <div className="col-span-2">
                          <label className="block text-sm/6 font-medium text-gray-900">數量</label>
                          <input
                            value={discount.quantity}
                            readOnly={true}
                            className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-sm/6 font-medium text-gray-900">單位</label>
                          <input
                            value={discount.unit}
                            readOnly={true}
                            className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                          />
                        </div> */}
                        <div className="col-span-2">
                          <label className="block text-sm/6 font-medium text-gray-900">小計</label>
                          <input
                            value={discount.money}
                            onChange={(event) => {
                              setDiscount({
                                ...discount,
                                money: event.target.value
                              });
                            }}
                            type="number"
                            placeholder="金額"
                            className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
                  onClick={submit}
                  className="mx-2 bg-green-600 px-3 py-2 text-sm font-semibold text-white ring-2 ring-green-300 hover:bg-green-500"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 明細彈窗 */}
      <Dialog
        open={detailDialog}
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
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 sm:mt-5">
                  <table
                    id="myTable"
                    className="min-w-full divide-y divide-gray-300"
                  >
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          日期
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          商品名稱
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          數量
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          單位
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          小計
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          備註
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {billDetail.length > 0 ? (
                        billDetail.map((item, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.date}</td>
                            <td className="px-2 py-2 text-sm text-gray-500">{item.content}</td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.quantity}</td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.unit}</td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.money}</td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.remark}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="whitespace-nowrap px-2 py-2 text-xl text-center text-gray-500"
                          >
                            無明細
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">總金額：</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{billDetail.reduce((all, item) => all + item.money, 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="text-pink-300 text-sm">備註：{remark}</div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setDetailDialog(false);
                  }}
                  className="mx-2 px-3 py-2 text-sm font-semibold text-red-400 ring-2 ring-pink-400 hover:bg-red-100"
                >
                  關閉
                </button>
                {billDetail.length > 0 && <ExportToExcel />}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 更新彈窗 */}
      <Dialog
        open={updateDialog}
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
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">使用單位</label>
                  <select
                    onChange={(e) => {
                      setUpdateData({
                        ...updateData,
                        entity: {
                          ...updateData.entity,
                          tutoring_id: Number(e.target.value)
                        }
                      });
                    }}
                    value={updateData.entity.tutoring_id}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                  >
                    <option>請選擇單位</option>
                    {tutoring.map((item, index) => (
                      <option
                        key={index}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">時間</label>
                  <input
                    onChange={(e) => {
                      setUpdateData({
                        ...updateData,
                        entity: {
                          ...updateData.entity,
                          date: e.target.value
                        }
                      });
                    }}
                    value={updateData.entity.date}
                    type="date"
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">主敘述</label>
                  <input
                    onChange={(e) => {
                      setUpdateData({
                        ...updateData,
                        entity: {
                          ...updateData.entity,
                          content: e.target.value
                        }
                      });
                    }}
                    value={updateData.entity.content}
                    type="text"
                    placeholder="抬頭"
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">發票</label>
                  <input
                    onChange={(e) => {
                      setUpdateData({
                        ...updateData,
                        entity: {
                          ...updateData.entity,
                          invoice: e.target.value
                        }
                      });
                    }}
                    value={updateData.entity.invoice}
                    type="text"
                    placeholder="發票號碼"
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">總金額</label>
                  <input
                    value={update_detail_amount}
                    readOnly={true}
                    type="number"
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">備註</label>
                  <input
                    onChange={(e) => {
                      setUpdateData({
                        ...updateData,
                        entity: {
                          ...updateData.entity,
                          remark: e.target.value
                        }
                      });
                    }}
                    value={updateData.entity.remark}
                    type="text"
                    placeholder="備註"
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />{" "}
                </div>
              </div>
              <span className="isolate flex rounded-md shadow-sm mt-3 justify-end items-end">
                <div className="text-red-400 mx-2">明細商品名沒填寫視同取消</div>
                <button
                  onClick={() => {
                    setUpdateData({
                      ...updateData,
                      detail: [...updateData.detail, def_detail]
                    });
                  }}
                  type="button"
                  className={`bg-yellow-300 relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                >
                  新增明細
                </button>
              </span>
              <div className="mt-3">
                <table
                  id="myTable"
                  className="min-w-full divide-y divide-gray-300"
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        商品名稱
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        數量
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        單位
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        小計
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {updateData.detail.length > 0 ? (
                      updateData.detail.map((item, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            <input
                              onChange={(e) => {
                                setUpdateData({
                                  ...updateData,
                                  detail: updateData.detail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        content: e.target.value
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                });
                              }}
                              value={item.content}
                              type="text"
                              className="p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            <input
                              onChange={(e) => {
                                setUpdateData({
                                  ...updateData,
                                  detail: updateData.detail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        quantity: Number(e.target.value)
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                });
                              }}
                              value={item.quantity}
                              type="number"
                              className="p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            <input
                              onChange={(e) => {
                                setUpdateData({
                                  ...updateData,
                                  detail: updateData.detail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        unit: e.target.value
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                });
                              }}
                              value={item.unit}
                              type="text"
                              className="p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            <input
                              onChange={(e) => {
                                setUpdateData({
                                  ...updateData,
                                  detail: updateData.detail.map((i, ii) => {
                                    if (index == ii) {
                                      return {
                                        ...i,
                                        money: Number(e.target.value)
                                      };
                                    } else {
                                      return i;
                                    }
                                  })
                                });
                              }}
                              value={item.money}
                              type="number"
                              className="p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="whitespace-nowrap px-2 py-2 text-xl text-center text-gray-500"
                        >
                          無明細
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setUpdateDialog(false);
                  }}
                  className="mx-2 px-3 py-2 text-sm font-semibold text-gray-400 ring-2 ring-gray-400 hover:bg-gray-100"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={updateItem}
                  className="mx-2 px-3 py-2 text-sm font-semibold text-green-400 ring-2 ring-green-400 hover:bg-green-100"
                >
                  修改
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 flex justify-between items-end">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">零用金</h1>

          <div className="flex items-end">
            <h3 className={`sm:text-xl font-semibold leading-6 mt-2 md:mt-0 min-w-36`}>
              總餘額：<span className={`${amount < 0 ? "text-red-500" : "text-green-500"}`}>{amount || 0}</span>
            </h3>
            <div>
              <button
                type="button"
                onClick={() => {
                  setDialog(true);
                }}
                className="mx-1 px-3 py-2 text-sm rounded-md font-semibold text-green-600 ring-1 bg-green-100 ring-green-300"
              >
                新增
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                }}
                className="px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-1 bg-gray-100 ring-gray-300"
              >
                搜尋
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <table
            id="myTable2"
            className="min-w-full divide-y divide-gray-300"
          >
            <thead className="bg-yellow-100 sticky top-20">
              <tr className="">
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
                  className="px-3 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-blue-300 cursor-pointer"
                >
                  日期
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
                  className="px-3 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-blue-300 cursor-pointer"
                >
                  單位
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
                  className="px-3 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-blue-300 cursor-pointer"
                >
                  品項敘述
                </th>
                <th
                  // onClick={() => {
                  //   if (search.type == 3) {
                  //     setSearch({
                  //       ...search,
                  //       index: !search.index
                  //     });
                  //   } else {
                  //     setSearch({
                  //       ...search,
                  //       type: 3,
                  //       index: true
                  //     });
                  //   }
                  // }}
                  scope="col"
                  className="hidden px-3 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  備註
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
                  className="px-3 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-blue-300 cursor-pointer text-right"
                >
                  狀態
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
                  className="px-3 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-blue-300 cursor-pointer"
                >
                  金額
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
                  className="px-3 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-blue-300 cursor-pointer"
                >
                  發票
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  設定
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredItems.map((bill, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{tutoring.filter((i) => i.id == bill.tutoring_id)[0].name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                    <span
                      onClick={() => {
                        setRemark(bill.remark);
                        getBillDetail(bill, 1);
                      }}
                      className={`text-blue-400 cursor-pointer`}
                    >
                      {bill.content}
                    </span>
                  </td>
                  <td className={`hidden px-3 py-4 text-sm text-left`}>{bill.remark}</td>
                  <td className={`${bill.state ? "text-green-500" : "text-red-500"} whitespace-nowrap px-3 py-4 text-sm text-right`}>{bill.state ? "收入" : "支出"}</td>
                  <td className={`${bill.state ? "text-green-500" : "text-red-500"} whitespace-nowrap px-3 py-4 text-sm text-left`}>{bill.amount}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{bill.invoice}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm flex justify-between">
                    {bill.review ? (
                      <span>已送審</span>
                    ) : (
                      <>
                        <div
                          onClick={() => {
                            getBillDetail(bill, 2);
                          }}
                          className="text-green-600 hover:text-green-300 cursor-pointer"
                        >
                          修改
                        </div>
                        <div
                          onClick={() => {
                            submitReview(bill.id);
                          }}
                          className="text-yellow-600  hover:text-yellow-300 cursor-pointer"
                        >
                          送審
                        </div>
                        <TrashIcon
                          className="w-5 h-5 text-red-500 hover:text-red-300"
                          onClick={() => {
                            const check = confirm(`確定要刪除?\n${new Date(bill.date).toLocaleDateString()} ${bill.state ? "收入" : "支出"} ${bill.content} ${bill.amount}元`);
                            if (check) {
                              deleteItem(bill.id);
                            }
                          }}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900"></td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900"></td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900"></td>
                <td className="hidden whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900"></td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 text-right">總計：</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{filteredItems.reduce((sum, item) => (item.state ? sum + item.amount : sum - item.amount), 0)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900"></td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
