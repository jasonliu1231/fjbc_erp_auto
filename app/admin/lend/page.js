"use client";

import { Label, Dialog, DialogPanel, DialogTitle, DialogBackdrop, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, XMarkIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { error } from "../../utils";
import Alert from "../alert";
import { Calendar } from "react-multi-date-picker";

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" }
];

const def_search = {
  tutoring_list: [1, 2, 3],
  type: 7,
  index: true,
  state: false,
  begin: "",
  end: ""
};

const def_create = {
  product_id: 0,
  tutoring_id: 0,
  quantity: 0,
  course_no: "",
  remark: ""
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [dialog, setDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [lendItemsList, setLendItemsList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [createData, setCreateData] = useState(def_create);
  const [lendList, setLendList] = useState([]);
  const [search, setSearch] = useState(def_search);
  const [query, setQuery] = useState("");
  const filteredCourse =
    query === ""
      ? courseList
      : courseList.filter((course) => {
          return course.course_name.toLowerCase().includes(query.toLowerCase());
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

  async function returnLend(id) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/lend`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "歸還完成！"
      });
      getLendDetail();
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
    if (!createData.tutoring_id) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇補習班"
      });
      return;
    }
    if (!createData.product_id) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇商品"
      });
      return;
    }
    if (!createData.course_no) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇使用課程"
      });
      return;
    }
    if (!createData.remark) {
      setInfo({
        show: true,
        success: false,
        msg: "請寫借用原因"
      });
      return;
    }
    if (!createData.quantity || createData.quantity < 0) {
      setInfo({
        show: true,
        success: false,
        msg: "數量請確認"
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/lend/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "新增完成！"
      });
      setDialog(false);
      setCreateData(def_create);
      setLendItemsList([]);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getLendDetail() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(search)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/lend/list`, config);
    const res = await response.json();
    if (response.ok) {
      setLendList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function searchItems() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        keyword
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/lend/items/list`, config);
    const res = await response.json();
    if (response.ok) {
      setLendItemsList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getCourseList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/list?visable=true&is_course=true`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setCourseList(
        res.course_list.map((i) => {
          return { course_no: i.course_no, course_name: i.course_name };
        })
      );
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
    getLendDetail();
    getCourseList();
  }, [dialog]);

  useEffect(() => {
    getLendDetail();
  }, [search]);

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
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">狀態</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch({
                            ...search,
                            state: true
                          });
                        }}
                        className={`${search.state ? "ring-red-300" : "ring-gray-300"} m-1 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
                      >
                        已歸還
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch({
                            ...search,
                            state: false
                          });
                        }}
                        className={`${!search.state ? "ring-red-300" : "ring-gray-300"} m-1 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
                      >
                        未歸還
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">重置</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch(def_search);
                        }}
                        className={`m-1 px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-2`}
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
                <div className="mt-3">
                  <DialogTitle
                    as="h3"
                    className="font-semibold leading-6 text-gray-900 flex justify-center"
                  >
                    <input
                      value={keyword}
                      onChange={(e) => {
                        setKeyword(e.target.value);
                      }}
                      className="p-2 block rounded-l-md border-0 text-gray-900 shadow-sm ring-1 ring-blue-300 placeholder:text-gray-400"
                      placeholder="商品關鍵字搜尋"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        searchItems();
                      }}
                      className="px-3 py-2 text-sm font-semibold text-blue-300 ring-1 ring-blue-300 rounded-r-lg hover:bg-blue-500"
                    >
                      查詢
                    </button>
                  </DialogTitle>
                  <div className="grid grid-cols-3 gap-1 py-2">
                    {lendItemsList.map((item) => (
                      <div
                        key={item.product_id}
                        onClick={() => {
                          setCreateData({
                            ...createData,
                            ...item,
                            quantity: 0
                          });
                        }}
                        className={`${
                          createData.product_id == item.product_id && createData.tutoring_id == item.tutoring_id ? "border-green-400" : "border-gray-200"
                        } col-span-1 border-2 rounded-md p-2 pl-8 relative cursor-pointer`}
                      >
                        {createData.product_id == item.product_id && createData.tutoring_id == item.tutoring_id && (
                          <div className="absolute top-0 left-0 bg-green-400 rounded-sm">
                            <CheckIcon className="h-5 w-5 text-white" />
                          </div>
                        )}

                        <div className="text-lg text-blue-600">{item.name}</div>
                        <div className="flex justify-between text-sm">
                          <div className=" text-gray-500">{tutoring.filter((i) => i.id == item.tutoring_id)[0].name}</div>
                          <div className=" text-pink-500">存量：{item.min}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <Combobox
                        as="div"
                        value={createData}
                        onChange={(course) => {
                          setQuery("");
                          setCreateData({
                            ...createData,
                            ...course
                          });
                        }}
                      >
                        <Label className="block text-sm/6 font-medium text-gray-900">使用課程</Label>
                        <div className="relative mt-2">
                          <ComboboxInput
                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            onChange={(event) => setQuery(event.target.value)}
                            onBlur={() => setQuery("")}
                            displayValue={(course) => course?.course_name}
                          />
                          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </ComboboxButton>

                          {filteredCourse.length > 0 && (
                            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredCourse.map((course) => (
                                <ComboboxOption
                                  key={course.course_no}
                                  value={course}
                                  className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                                >
                                  <span className="block truncate group-data-[selected]:font-semibold">{course.course_name}</span>

                                  <span className="absolute inset-y-0 left-0 hidden items-center pl-1.5 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
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

                    <div className="col-span-1 row-span-2">
                      <label className="block text-sm font-medium text-gray-900">借用原因</label>
                      <div className="mt-2">
                        <textarea
                          value={createData.remark}
                          onChange={(e) => {
                            setCreateData({
                              ...createData,
                              remark: e.target.value
                            });
                          }}
                          rows={4}
                          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-900">借用數量</label>
                      <div className="mt-2">
                        <input
                          value={createData.quantity}
                          onChange={(e) => {
                            setCreateData({
                              ...createData,
                              quantity: Number(e.target.value)
                            });
                          }}
                          max={createData.min || 0}
                          min={0}
                          type="number"
                          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        />
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
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4 flex justify-between">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">租借紀錄</h1>
          <div>
            <button
              onClick={() => {
                setDialog(true);
              }}
              className={`px-3 py-2 text-sm rounded-md font-semibold text-gray-600 ring-1 bg-blue-300 ring-gray-300`}
            >
              新增
            </button>
            <button
              onClick={() => {
                window.location.href = `/admin/lend/setting`;
              }}
              className={`px-3 py-2 text-sm rounded-md font-semibold text-gray-100 ring-1 bg-blue-600 ring-gray-300 mx-2`}
            >
              設定
            </button>
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

        <div className="mt-4">
          <table
            id="myTable"
            className="min-w-full divide-y divide-gray-300 mt-2"
          >
            <thead className="bg-gray-50">
              <tr>
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
                  className="p-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200 cursor-pointer"
                >
                  租借單位
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
                  className="p-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200 cursor-pointer"
                >
                  借用課程
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
                  className="p-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200 cursor-pointer"
                >
                  商品名稱
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
                  className="p-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200 cursor-pointer"
                >
                  數量
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
                  className="p-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200 cursor-pointer"
                >
                  原因
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
                  className="p-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200 cursor-pointer"
                >
                  經手人
                </th>
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
                  className="p-1 text-left text-sm font-semibold text-gray-900 hover:bg-blue-200 cursor-pointer"
                >
                  時間
                </th>
                <th
                  scope="col"
                  className="p-1 text-left text-sm font-semibold text-gray-900"
                >
                  狀態
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {lendList.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-100"
                >
                  <td className="p-1 whitespace-nowrap text-sm text-gray-500">{tutoring.filter((i) => i.id == item.tutoring_id)[0].name}</td>
                  <td className="p-1 text-sm font-medium  text-gray-900">{item.course_name}</td>
                  <td className="p-1 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="p-1 whitespace-nowrap text-sm font-medium text-gray-900">{item.quantity}</td>
                  <td className="p-1 text-sm font-medium text-gray-900">{item.remark}</td>
                  <td className="p-1 whitespace-nowrap text-sm font-medium text-gray-900">{item.return_by}</td>
                  <td className="p-1 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(item.update_at).toLocaleString("zh-TW", { hour12: false })}</td>
                  <td className="p-1 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.return ? (
                      <span className="text-green-400">已歸還</span>
                    ) : (
                      <span
                        onClick={() => {
                          const check = confirm(`請確認商品歸還數量是否正確？\n商品名：${item.name}\n數量：${item.quantity}`);
                          if (check) {
                            returnLend(item.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-200 cursor-pointer"
                      >
                        未歸還
                      </span>
                    )}
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
