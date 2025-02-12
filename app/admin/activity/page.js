"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";
import Alert from "../alert";
import * as XLSX from "xlsx";

const def_create = {
  activity_id: 0,
  activity_name: "",
  result_id: 0,
  student_id: 0,
  remark: ""
};

export default function Example() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [enable, setEnable] = useState(true);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState();
  const [result, setResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudents] = useState([]);
  const [studentLink, setStudentsLink] = useState([]);
  const [create, setCreate] = useState(def_create);
  const [linkQuery, setLinkQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const filteredEnable = items.filter((i) => i.enable == enable);
  const filteredStudent =
    query === ""
      ? result
      : result.filter((i) => {
          const name = i.student.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  const filteredPeople =
    linkQuery === ""
      ? student
      : student.filter((person) => {
          return person.user.first_name.toLowerCase().includes(linkQuery.toLowerCase());
        });

  async function getResult(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/result?index=${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setItem(res.entity);
      setResult(res.result_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getDataList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/list`, config);
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
  }

  async function getStudentList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?student_status_id=1`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setStudents(res.list);
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

  async function getLink(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/link/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setStudentsLink(res);
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

  async function bindStudent() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/link`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      setOpen(false);
      getLink(create.activity_id);
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
    getDataList();
    getStudentList();
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div>
                  <Combobox
                    as="div"
                    value={selectedPerson}
                    onChange={(person) => {
                      setLinkQuery("");
                      setSelectedPerson(person);
                      if (person) {
                        setCreate({
                          ...create,
                          student_id: person.id
                        });
                      }
                    }}
                  >
                    <Label className="block text-sm/6 font-medium text-gray-900">學生</Label>
                    <div className="relative mt-2">
                      <ComboboxInput
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        onChange={(event) => setLinkQuery(event.target.value)}
                        onBlur={() => setLinkQuery("")}
                        displayValue={(person) => person?.user.first_name}
                      />
                      <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon
                          className="size-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </ComboboxButton>

                      {filteredPeople.length > 0 && (
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                          {filteredPeople.map((person) => (
                            <ComboboxOption
                              key={person.id}
                              value={person}
                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                            >
                              <span className="block truncate group-data-[selected]:font-semibold">{person?.user.first_name}</span>

                              <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
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
                </div>
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    備註
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={create.remark}
                      onChange={(e) => {
                        setCreate({
                          ...create,
                          remark: e.target.value
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-1 inline-flex justify-center rounded-md ring-2 ring-gray-600 px-3 py-2 text-sm text-gray-600 shadow-sm"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    bindStudent();
                  }}
                  className="mx-1 inline-flex justify-center rounded-md ring-2 ring-green-600 px-3 py-2 text-sm text-green-600 shadow-sm hover:bg-green-300"
                >
                  歸檔
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2 sm:p-4">
        <div className="flex mb-4">
          <div className="flex items-center">
            <div className="">
              <select
                onChange={(e) => {
                  const id = Number(e.target.value);
                  if (id != 0) {
                    getResult(id);
                    getLink(id);
                    setCreate({
                      ...create,
                      activity_id: id
                    });
                  }
                }}
                className="rounded-md border-0 px-3 py-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
              >
                <option value={0}>選擇表單</option>
                {filteredEnable.map((i) => (
                  <option
                    key={i.form_id}
                    value={i.form_index}
                  >
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="mx-2 isolate inline-flex rounded-md shadow-sm">
              <input
                onChange={(event) => setQuery(event.target.value)}
                value={query}
                type="text"
                placeholder="名稱"
                className="relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              />
            </span>
            <div className="ml-16 flex">
              <span className="mx-2 isolate inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setEnable(true);
                  }}
                  className={`${
                    enable ? "ring-red-300" : "ring-gray-200"
                  } relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-4 ring-inset hover:bg-gray-50 focus:z-10`}
                >
                  開啟
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnable(false);
                  }}
                  className={`${
                    !enable ? "ring-red-300" : "ring-gray-200"
                  } relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-4 ring-inset hover:bg-gray-50 focus:z-10`}
                >
                  關閉
                </button>
              </span>
            </div>
          </div>
        </div>

        {item && (
          <>
            <div className="font-semibold leading-6 text-gray-900 text-xl">{item.questionnaire.name}</div>
            <div className="grid grid-cols-5 my-2">
              <div className="col-span-1 text-sm text-gray-500">創建日期：{new Date(item.questionnaire.create_at).toLocaleDateString()}</div>
              {item.questionnaire?.deadline && <div className="col-span-1 text-sm text-gray-500">活動期限：{new Date(item.questionnaire.deadline).toLocaleDateString()}</div>}
              {item.questionnaire?.open_date && <div className="col-span-1 text-sm text-gray-500">開啟日期：{new Date(item.questionnaire.open_date).toLocaleDateString()}</div>}
              {item.questionnaire?.close_date && <div className="col-span-1 text-sm text-gray-500">關閉日期：{new Date(item.questionnaire.close_date).toLocaleDateString()}</div>}
            </div>
            <table
              id="myTable"
              className="min-w-full divide-y divide-gray-600 border-2 border-gray-300"
            >
              <thead>
                <tr className="divide-x divide-gray-300 bg-yellow-100">
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    學生姓名
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    家長姓名
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    聯絡電話
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    學校
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    年級
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    填表時間
                  </th>
                  {item.questionnaire_entity.map((i, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="p-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {i.title}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    設定
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-sm font-semibold text-gray-900"
                  >
                    綁定人員
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredStudent.map((data) => {
                  const dataName = Object.keys(data);
                  return (
                    <tr
                      key={data.id}
                      className="divide-x divide-gray-300 hover:bg-blue-100"
                    >
                      {dataName.map((j, index) =>
                        j != "id" ? (
                          j != "date" ? (
                            <td
                              key={index}
                              className={"relative p-3 text-sm"}
                            >
                              {data[j]}
                            </td>
                          ) : (
                            <td
                              key={index}
                              className={"relative p-3 text-sm"}
                            >
                              {data[j].substr(0, 10)}
                            </td>
                          )
                        ) : null
                      )}
                      <td className={"relative p-3 text-sm"}>
                        {/* {studentLink.some((i) => i.result_id == data.id) ? (
                          <div className="text-pink-300">已綁定</div>
                        ) : (
                          <button
                            onClick={() => {
                              setCreate({
                                ...create,
                                activity_name: item.questionnaire.name,
                                result_id: data.id
                              });
                              setOpen(true);
                            }}
                            type="button"
                            className="rounded-md bg-blue-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-blue-500"
                          >
                            綁定
                          </button>
                        )} */}
                        <button
                          onClick={() => {
                            setCreate({
                              ...create,
                              activity_name: item.questionnaire.name,
                              result_id: data.id
                            });
                            setOpen(true);
                          }}
                          type="button"
                          className="rounded-md bg-blue-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-blue-500"
                        >
                          綁定
                        </button>
                      </td>
                      <td className={"relative p-3 text-sm"}>
                        {studentLink
                          .filter((person) => person.result_id == data.id)
                          .map((person) => person.first_name)
                          .join(",")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
