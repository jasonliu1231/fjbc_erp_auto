"use client";

import { Dialog, DialogPanel, DialogBackdrop, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { TrashIcon, CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Alert from "../alert";
import { error } from "../../utils";

const def = {
  type: false,
  date: new Date().toISOString().split("T")[0],
  user: 0
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [update, setUpdate] = useState({
    update_content: "",
    update_id: ""
  });
  const [selected, setSelected] = useState({
    type: false,
    date: new Date().toISOString().split("T")[0]
  });
  const [search, setSearch] = useState({
    user: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [open, setOpen] = useState(false);
  const [openLog, setOpenLog] = useState(false);
  const [log, setLog] = useState([]);
  const [billList, setBillList] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [amount, setAmount] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [type, setType] = useState(1);
  const [index, setIndex] = useState(true);

  const filteredPeople =
    query === ""
      ? user
      : user.filter((person) => {
          return person.first_name.toLowerCase().includes(query.toLowerCase());
        });

  const filteredItems = type === 1 ? billList : type === 2 ? billList.filter((item) => item.type) : billList.filter((item) => !item.type);

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
        姓名: cells[1].innerText,
        品項: cells[2].innerText,
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
      XLSX.writeFile(workbook, `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_Order.xlsx`);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/meal`, config);
    const res = await response.json();
    if (response.ok) {
      getMealList();
      if (search.date) {
        getGroup();
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

  async function submit() {
    if (!selected.type) {
      if (!selected.content) {
        alert("請輸入品項敘述");
        return;
      }
    }
    if (!selected.user) {
      alert("請選擇姓名");
      return;
    }
    if (!selected.money || selected.money < 0) {
      alert("請確認金額");
      return;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(selected)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/meal`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "新增完成"
      });
      getMealList();
      if (search.date) {
        getGroup();
      }
      setSelected(def);
      setOpen(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateBill() {
    if (!update.update_content) {
      alert("請輸入品項敘述");
      return;
    }

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/meal`, config);
    const res = await response.json();
    if (response.ok) {
      getMealList();
      if (search.date) {
        getGroup();
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

  async function getMealList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/meal/list?index=${index}`;

    if (search.user) {
      url += `&user_id=${search.user}`;
    }
    if (search.date) {
      url += `&date=${search.date}`;
    }

    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setBillList(res);
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

  async function getUser() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/list`, config);
    const res = await response.json();
    if (response.ok) {
      setUser(res);
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/meal/amount`, config);
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

  async function getPersonAmount() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/meal/person/amount`, config);
    const res = await response.json();
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
    }
  }

  async function getGroup() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/meal/group?date=${search.date}`, config);
    const res = await response.json();
    if (response.ok) {
      setStatistics(res);
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
    getMealList();
  }, [index, search]);

  useEffect(() => {
    if (search.date != "") {
      getGroup();
    }
  }, [search.date]);

  useEffect(() => {
    getUser();
    getAmount();
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
      {/* 新增視窗 */}
      <Dialog
        open={open}
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
              <div className="text-2xl text-blue-400 text-center mb-4">餐費設定</div>
              <span className="isolate inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => {
                    setSelected({
                      ...selected,
                      type: true
                    });
                  }}
                  type="button"
                  className={`${selected.type ? "bg-blue-200" : "bg-white"} relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset`}
                >
                  儲值
                </button>
                <button
                  onClick={() => {
                    setSelected({
                      ...selected,
                      type: false
                    });
                  }}
                  type="button"
                  className={`${selected.type ? "bg-white" : "bg-blue-200"} relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset`}
                >
                  訂餐
                </button>
              </span>
              <div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">日期</label>
                  <div>
                    <input
                      value={selected.date}
                      onChange={(e) => {
                        setSelected({
                          ...selected,
                          date: e.target.value
                        });
                      }}
                      type="date"
                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <Combobox
                    as="div"
                    value={selectedPerson}
                    onChange={(person) => {
                      setQuery("");
                      setSelectedPerson(person);
                      if (person) {
                        setSearch({
                          ...search,
                          user: person.id
                        });
                        setSelected({
                          ...selected,
                          user: person.id
                        });
                      } else {
                        setSearch({
                          ...search,
                          user: ""
                        });
                      }
                    }}
                  >
                    <Label className="block text-sm/6 font-medium text-gray-900">姓名</Label>
                    <div className="relative">
                      <ComboboxInput
                        className="w-full rounded-md border-0 bg-white py-2 px-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        onChange={(event) => setQuery(event.target.value)}
                        onBlur={() => setQuery("")}
                        displayValue={(person) => person?.first_name}
                      />
                      <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </ComboboxButton>

                      {filteredPeople.length > 0 && (
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
                          {filteredPeople.map((person) => (
                            <ComboboxOption
                              key={person.id}
                              value={person}
                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                            >
                              <span className="block truncate group-data-[selected]:font-semibold">{person.first_name}</span>

                              <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            </ComboboxOption>
                          ))}
                        </ComboboxOptions>
                      )}
                    </div>
                  </Combobox>
                </div>

                {!selected.type && (
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">內容</label>
                    <div>
                      <input
                        onChange={(e) => {
                          setSelected({
                            ...selected,
                            content: e.target.value
                          });
                        }}
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">金額</label>
                  <div>
                    <input
                      onChange={(e) => {
                        setSelected({
                          ...selected,
                          money: Number(e.target.value)
                        });
                      }}
                      type="number"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="inline-flex justify-center rounded-md ring-2 ring-gray-400 px-3 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-200"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={() => {
                    submit();
                  }}
                  className="inline-flex justify-center rounded-md ring-2 ring-green-400 px-3 py-2 text-sm text-green-600 shadow-sm hover:bg-green-200"
                >
                  儲存
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 餘額視窗 */}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-2xl text-blue-400 text-center mb-4">餘額</div>
              <div className="grid grid-cols-5 gap-2">
                {log.map((item) => (
                  <div
                    onClick={() => {
                      setSearch({
                        ...search,
                        user: item.id
                      });
                      setSelectedPerson({ first_name: item.first_name, id: item.id });
                      setOpenLog(false);
                    }}
                    key={item.id}
                    className="border-2 border-blue-300 p-2 flex justify-around rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <div>{item.first_name}</div>
                    <div className={`${item.amount < 0 ? "text-red-400" : "text-gray-400"}`}>{item.amount}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpenLog(false);
                  }}
                  className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  關閉
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2">
        <div className="mx-auto px-2 py-2 flex justify-between">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">訂餐</h1>
          <div>
            <button
              type="button"
              onClick={() => {
                getPersonAmount();
              }}
              className="mx-2 inline-flex justify-center rounded-md bg-blue-300 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-200"
            >
              餘額
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(true);
              }}
              className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              新增
            </button>
          </div>
        </div>

        <div className="">
          <div className="my-3 md:flex justify-between items-center">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">收支表</h3>
            <div className="flex justify-between items-end">
              <div className="mx-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">日期</label>
                <input
                  value={search.date || ""}
                  onChange={(event) => {
                    setSearch({
                      ...search,
                      date: event.target.value
                    });
                  }}
                  type="date"
                  className="p-2 block rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300"
                />
              </div>
              <div className="mx-1">
                <Combobox
                  as="div"
                  value={selectedPerson}
                  onChange={(person) => {
                    setQuery("");
                    setSelectedPerson(person);
                    if (person) {
                      setSearch({
                        ...search,
                        user: person.id
                      });
                    } else {
                      setSearch({
                        ...search,
                        user: ""
                      });
                    }
                  }}
                >
                  <Label className="block text-sm/6 font-medium text-gray-900">姓名</Label>
                  <div className="relative">
                    <ComboboxInput
                      className="rounded-md border-0 bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      onChange={(event) => setQuery(event.target.value)}
                      onBlur={() => setQuery("")}
                      displayValue={(person) => person?.first_name}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </ComboboxButton>

                    {filteredPeople.length > 0 && (
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
                        {filteredPeople.map((person) => (
                          <ComboboxOption
                            key={person.id}
                            value={person}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                          >
                            <span className="block truncate group-data-[selected]:font-semibold">{person.first_name}</span>

                            <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </div>
                </Combobox>
              </div>
              <div className="mx-1">
                <span className="isolate inline-flex rounded-md">
                  <button
                    onClick={() => {
                      setType(1);
                    }}
                    type="button"
                    className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                  >
                    全部
                  </button>
                  <button
                    onClick={() => {
                      setType(2);
                    }}
                    type="button"
                    className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                  >
                    儲值
                  </button>
                  <button
                    onClick={() => {
                      setType(3);
                    }}
                    type="button"
                    className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                  >
                    支出
                  </button>
                </span>
              </div>
            </div>
            <h3 className={`flex justify-center text-xl font-semibold leading-6 mt-2 min-w-36`}>
              總餘額：<span className={`${amount < 0 ? "text-red-500" : "text-green-500"}`}>{amount || 0}</span>
            </h3>
            <ExportToExcel />
          </div>
          {search.date && (
            <div className="grid grid-cols-4">
              {statistics.map((i, index) => (
                <span
                  key={index}
                  className="m-1 px-4 py-2 bg-white rounded-md flex justify-between"
                >
                  {/* <span>{search.date}</span> */}
                  <span>{i.content}</span>
                  <span className="text-pink-500">{i.count}</span>
                </span>
              ))}
            </div>
          )}

          <table
            id="myTable"
            className="min-w-full divide-y divide-gray-300 mt-4"
          >
            <thead className="bg-gray-50">
              <tr className="sticky top-0">
                <th
                  onClick={() => {
                    setIndex(!index);
                  }}
                  scope="col"
                  className="px-2 py-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-100 cursor-pointer"
                >
                  日期
                </th>
                <th
                  scope="col"
                  className="px-2 py-1 text-left text-sm font-semibold text-gray-900"
                >
                  姓名
                </th>

                <th
                  scope="col"
                  className="px-2 py-1 text-left text-sm font-semibold text-gray-900"
                >
                  品項
                </th>
                <th
                  scope="col"
                  className="px-2 py-1 text-right text-sm font-semibold text-gray-900"
                >
                  金額
                </th>
                <th
                  scope="col"
                  className="px-2 py-1 text-center text-sm font-semibold text-gray-900"
                >
                  刪除
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredItems.map((bill, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-100"
                >
                  <td className="whitespace-nowrap px-2 py-1 text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-2 py-1 text-sm text-gray-900">{bill.first_name}</td>
                  <td className="hidden whitespace-nowrap px-2 py-1 text-sm text-gray-900">{bill.content}</td>
                  <td className="whitespace-nowrap px-2 py-1 text-sm text-gray-900">
                    <div className="flex">
                      {bill.isset ? (
                        <>
                          <div className="">
                            <input
                              value={update.update_content}
                              onChange={(e) => {
                                setUpdate({
                                  ...update,
                                  update_content: e.target.value
                                });
                              }}
                              className="border px-1"
                              placeholder={bill.content}
                            />
                          </div>
                          <div
                            onClick={updateBill}
                            className="text-green-500 cursor-pointer"
                          >
                            儲存
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="">{bill.content}</div>
                          {bill.type || (
                            <div
                              onClick={() => {
                                setUpdate({
                                  ...update,
                                  update_id: bill.id
                                });
                                setBillList(
                                  billList.map((item) => {
                                    if (item.id == bill.id) {
                                      return {
                                        ...item,
                                        isset: true
                                      };
                                    } else {
                                      return item;
                                    }
                                  })
                                );
                              }}
                              className="text-blue-300 cursor-pointer ml-2"
                            >
                              修改
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className={`${bill.type ? "text-green-500" : "text-red-500"} whitespace-nowrap px-2 py-1 text-sm text-right`}>
                    {`${bill.type ? "+" : "-"}`}
                    {bill.money}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1 text-sm flex justify-center">
                    <TrashIcon
                      className="w-5 h-5 text-red-600 hover:text-red-300"
                      onClick={() => {
                        const check = confirm(`確定要刪除?\n${new Date(bill.date).toLocaleDateString()} ${bill.type ? "儲值" : "支出"} ${bill.content} ${bill.money}元`);
                        if (check) {
                          deleteItem(bill.id);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
              <tr className="sticky bottom-0 bg-yellow-50">
                <td className="px-2 py-1 text-sm text-gray-900"></td>
                <td className="px-2 py-1 text-sm text-gray-900"></td>
                <td className="text-right px-2 py-1">總計：</td>
                <td className="hidden px-2 py-1 text-sm text-gray-900"></td>
                <td className={`px-2 py-1 text-right`}>{filteredItems?.reduce((total, item) => total + (item.type ? item.money : -item.money), 0)}</td>
                <td className="px-2 py-1 text-sm text-gray-900"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
