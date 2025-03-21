"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import { Label, Dialog, DialogPanel, DialogBackdrop, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const items = [
  {
    grade_id: 1,
    grade_name: "幼幼班"
  },
  {
    grade_id: 2,
    grade_name: "小班"
  },
  {
    grade_id: 3,
    grade_name: "中班"
  },
  {
    grade_id: 4,
    grade_name: "大班"
  },
  {
    grade_id: 5,
    grade_name: "國小一"
  },
  {
    grade_id: 6,
    grade_name: "國小二"
  },
  {
    grade_id: 7,
    grade_name: "國小三"
  },
  {
    grade_id: 8,
    grade_name: "國小四"
  },
  {
    grade_id: 9,
    grade_name: "國小五"
  },
  {
    grade_id: 10,
    grade_name: "國小六"
  },
  {
    grade_id: 11,
    grade_name: "國中一"
  },
  {
    grade_id: 12,
    grade_name: "國中二"
  },
  {
    grade_id: 13,
    grade_name: "國中三"
  },
  {
    grade_id: 14,
    grade_name: "高中一"
  },
  {
    grade_id: 15,
    grade_name: "高中二"
  },
  {
    grade_id: 16,
    grade_name: "高中三"
  }
];

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [student, setStudent] = useState({
    student_id: 0,
    name: ""
  });
  const [query, setQuery] = useState("");
  const [point, setPoint] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);
  const [open, setOpen] = useState(false);
  const [pointList, setPointList] = useState([]);
  const [prizeList, setPrizeList] = useState([]);
  const [prizeLogList, setPrizeLogList] = useState([]);
  const [selectPrizeList, setSelectPrizeList] = useState([]);
  const [reasonList, setReasonList] = useState([]);
  const [createPointReason, setCreatePointReason] = useState("");
  const [compare, setCompare] = useState(0);
  const [grade, setGrade] = useState([]);

  let filteredStudent =
    query === ""
      ? studentList
      : studentList.filter((i) => {
          const name = i.name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  filteredStudent = grade.length === 0 ? filteredStudent : filteredStudent.filter((person) => grade.some((id) => person.grade && person.grade == id));
  console.log(filteredStudent);
  async function createPoint() {
    if (student.student_id == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇學生"
      });
      return;
    }
    let type = false;
    if (point == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "0 點不可以記錄！"
      });
      return;
    } else if (point < 0) {
      type = false;
    } else if (point > 0) {
      type = true;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        student_id: student.student_id,
        type: type,
        point: point > 0 ? point : -point,
        reason: createPointReason == "" ? null : createPointReason
      })
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point`, config);
    const res = await response.json();
    if (response.ok) {
      getStudentData();
      getReason();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function createPrize(item) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point`, config);
    const res = await response.json();
    if (response.ok) {
      getStudentData();
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

  async function deletePointLog(point_id) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point?point_id=${point_id}`, config);
    const res = await response.json();
    if (response.ok) {
      getStudentData();
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
      setStudentList(
        res.list.map((person) => {
          return {
            student_id: person.id,
            name: person.user.first_name,
            grade: person.grade?.id
          };
        })
      );
      setLoading(false);
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

  async function getStudentData() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/wallet/log?student_id=${student.student_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setTotalPoint(res.total_point);
      setPointList(res.point_log);
      setPrizeLogList(res.prize_log);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getReason() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/point/reason`, config);
    const res = await response.json();
    if (response.ok) {
      setReasonList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPrize() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/prize/list?enable=true`, config);
    const res = await response.json();
    if (response.ok) {
      setPrizeList(res);
      setOpen(true);
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
    getStudentList();
  }, []);

  useEffect(() => {
    if (student.student_id != 0) {
      getStudentData();
      getReason();
    }
  }, [student.student_id]);

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
              className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-4 gap-2 min-h-96">
                <div
                  className="col-span-3 grid grid-cols-3 gap-1 p-4"
                  style={{ alignSelf: "start" }}
                >
                  <div className="col-span-full">獎品選擇</div>
                  {prizeList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectPrizeList([
                          ...selectPrizeList,
                          {
                            student_id: student.student_id,
                            type: false,
                            name: item.name,
                            point: item.point,
                            prize_id: item.id,
                            reason: "兌換獎品"
                          }
                        ]);
                      }}
                      className="col-span-1 border-2 rounded-md px-2 py-1 flex justify-between cursor-pointer hover:bg-pink-50"
                    >
                      <div>{item.name}</div>
                      <div>{item.point}</div>
                    </div>
                  ))}
                </div>
                <div
                  className="col-span-1 grid grid-cols-1 gap-1 p-4"
                  style={{ alignSelf: "start" }}
                >
                  <div className="col-span-full text-blue-400">選擇列表</div>
                  {selectPrizeList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectPrizeList(selectPrizeList.filter((item, ii) => ii != index));
                      }}
                      className="col-span-1 border-2 rounded-md px-2 py-1 flex justify-between cursor-pointer hover:bg-pink-50"
                    >
                      <div>{item.name}</div>
                      <div>{item.point}</div>
                    </div>
                  ))}
                  <div className="col-span-full flex justify-around border-t-2 border-red-200">
                    <div>總計：</div>
                    <div className="text-red-400 font-bold">{selectPrizeList.reduce((sun, item) => sun + item.point, 0)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-2 px-3 py-2 text-sm font-semibold text-red-300 ring-2 ring-pink-300 hover:bg-red-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selectPrizeList.forEach((item) => {
                      createPrize(item);
                    });
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

      <div className="container mx-auto">
        <div className="flex items-end my-2">
          <h1 className="text-lg font-semibold text-gray-900">學生點數</h1>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl px-4 py-6 m-2">
          <div className="grid grid-cols-8">
            {items.map((item) => (
              <div
                key={item.grade_id}
                className={`${grade.some((id) => id == item.grade_id) && "bg-pink-100"} border p-1 m-1 text-center rounded-md cursor-pointer`}
                onClick={() => {
                  grade.some((id) => id == item.grade_id) ? setGrade(grade.filter((id) => id != item.grade_id)) : setGrade([...grade, item.grade_id]);
                }}
              >
                {item.grade_name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <Combobox
                as="div"
                value={student}
                onChange={(person) => {
                  setQuery("");
                  if (person) {
                    setStudent(person);
                  } else {
                    setStudent({
                      student_id: 0,
                      name: ""
                    });
                  }
                }}
              >
                <Label className="block text-sm/6 font-medium text-gray-900">學生</Label>
                <div className="relative mt-2">
                  <ComboboxInput
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    onChange={(event) => setQuery(event.target.value)}
                    onBlur={() => setQuery("")}
                    displayValue={(person) => person?.name}
                  />
                  <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="size-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </ComboboxButton>

                  {filteredStudent.length > 0 && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {filteredStudent.map((person) => (
                        <ComboboxOption
                          key={person.student_id}
                          value={person}
                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                        >
                          <span className="block truncate group-data-[selected]:font-semibold">{person?.name}</span>

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

            <div className="mt-2 col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">點數加減</label>
              <div>
                <input
                  value={point}
                  onChange={(e) => {
                    setPoint(e.target.value);
                  }}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="mt-2 col-span-1">
              <label className="block text-sm/6 font-medium text-gray-900">原因</label>
              <div>
                <input
                  value={createPointReason}
                  onChange={(e) => {
                    setCreatePointReason(e.target.value);
                  }}
                  type="text"
                  placeholder="如果是扣點請寫原因"
                  list="point-reasons"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <datalist id="point-reasons">
                  {reasonList.map((item, index) => (
                    <option
                      key={index}
                      value={item.reason}
                    />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-end col-span-1">
              <span className="isolate inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setPoint(point - 1)}
                  type="button"
                  className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  - 1
                </button>
                <button
                  onClick={() => setPoint(0)}
                  type="button"
                  className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  歸零
                </button>
                <button
                  onClick={() => setPoint(point + 1)}
                  type="button"
                  className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  + 1
                </button>
              </span>
              <span className="isolate inline-flex rounded-md shadow-sm">
                <button
                  onClick={createPoint}
                  type="button"
                  className="relative -ml-px inline-flex items-center rounded-md  bg-white px-3 py-2 text-sm font-semibold text-green-900 ring-1 ring-inset ring-green-300 hover:bg-green-50 focus:z-10"
                >
                  送出
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl m-2 col-span-2">
            <div className="px-4 py-6">
              <div className="flex justify-between">
                <div className="text-xl border-b-2 ">紀錄</div>
                <div className={`${totalPoint > 0 ? "text-green-500" : "text-red-500"} text-xl `}>總計：{totalPoint}</div>
              </div>

              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="bg-green-200">
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      課程
                    </th>
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      建立時間
                    </th>
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      建立人
                    </th>
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      點數
                    </th>
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      原因
                    </th>
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pointList.map((item) => (
                    <tr
                      key={item.point_id}
                      onClick={() => {
                        setCompare(item.point_id);
                      }}
                      className={`${compare == item.point_id && "bg-pink-100"} hover:bg-blue-50 course-pointer`}
                    >
                      <td className="whitespace-nowrap text-sm font-medium text-gray-900 w-1/6">
                        <span>{item.course_date}</span>
                        <span>{item.course_name}</span>
                      </td>
                      <td className="whitespace-nowrap text-sm text-gray-500 w-1/6">
                        <div>{new Date(item.create_at).toLocaleDateString()}</div>
                      </td>
                      <td className="whitespace-nowrap text-sm text-gray-500 w-1/6">
                        <span>{item.first_name}</span>
                        <span>{item.nick_name}</span>
                      </td>
                      <td className={`${item.type ? "text-green-600" : "text-red-600"} whitespace-nowrap text-sm text-gray-500 w-1/6`}>
                        <div>
                          {item.type ? " + " : " - "}
                          {item.point}
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-sm text-gray-500 w-1/4">
                        <div>{item.reason}</div>
                      </td>
                      <td className="whitespace-nowrap text-sm text-red-500">
                        <div
                          onClick={() => {
                            const check = confirm("確定要刪除嗎？");
                            if (check) {
                              deletePointLog(item.point_id);
                            }
                          }}
                          className="cursor-pointer hover:text-red-200"
                        >
                          刪除
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl m-2">
            <div className="px-4 py-6">
              <div className="flex justify-between">
                <div className="text-xl">兌換紀錄</div>
                {student.student_id != 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      getPrize();
                    }}
                    className="bg-green-600 px-2 py-1 text-sm font-semibold text-white ring-2 ring-green-300 hover:bg-green-500"
                  >
                    兌換列表
                  </button>
                )}
              </div>

              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="bg-green-200">
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      商品
                    </th>

                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      兌換人
                    </th>
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    >
                      兌換時間
                    </th>
                    <th
                      scope="col"
                      className="text-left text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prizeLogList.map((item) => (
                    <tr
                      key={item.point_id}
                      onClick={() => {
                        setCompare(item.point_id);
                      }}
                      className={`${compare == item.point_id && "bg-pink-100"} hover:bg-blue-50 course-pointer`}
                    >
                      <td className="whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>{item.name}</div>
                      </td>
                      <td className="whitespace-nowrap text-sm text-gray-500">
                        <div>{item.first_name}</div>
                      </td>
                      <td className="whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(item.create_at).toLocaleDateString()}</div>
                      </td>
                      <td className="whitespace-nowrap text-sm text-red-500">
                        <div
                          onClick={() => {
                            const check = confirm("確定要刪除嗎？");
                            if (check) {
                              deletePointLog(item.point_id);
                            }
                          }}
                          className="cursor-pointer hover:text-red-200"
                        >
                          刪除
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
    </>
  );
}
