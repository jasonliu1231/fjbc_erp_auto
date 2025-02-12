"use client";

import { useEffect, useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function TutoringSelect({ createData, setCreateData, setInput }) {
  const [tutorings, setTutoring] = useState([]);
  const [selected, setSelected] = useState({});

  async function getTutoringList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/list`, config);
    const res = await response.json();
    if (response.ok) {
      setTutoring(res.tutoring_list);
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
    getTutoringList();
  }, []);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setInput((prev) => {
          return {
            ...prev,
            tutoring_id: selected.id
          };
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-red-500">補習班</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.tutoring_name || "請選擇補習班"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {tutorings.length > 0 &&
            tutorings.map((tutoring) => (
              <ListboxOption
                key={tutoring.id}
                value={tutoring}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{tutoring.tutoring_name}</span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </ListboxOption>
            ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function SchoolYear({ createData, setCreateData, setInput }) {
  let y = new Date().getFullYear() - 1911;
  const year = [y - 1, y, y + 1];
  const [selected, setSelected] = useState([]);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setInput((prev) => {
          return {
            ...prev,
            school_year: selected
          };
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-red-500">學年度</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{(selected != "" && selected + " 學年") || "請選擇學年"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {year.length > 0 &&
            year.map((schoolYear, index) => (
              <ListboxOption
                key={index}
                value={schoolYear}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{schoolYear} 學年</span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </ListboxOption>
            ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function Semester({ createData, setCreateData, setInput }) {
  const semester = [
    {
      id: 1,
      name: "上學期"
    },
    {
      id: 2,
      name: "下學期"
    },
    {
      id: 3,
      name: "暑假"
    },
    {
      id: 4,
      name: "寒假"
    },
    {
      id: 5,
      name: "其他"
    }
  ];
  const [selected, setSelected] = useState([]);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setInput((prev) => {
          return {
            ...prev,
            semester: selected.id
          };
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-red-500">學期</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.name || "請選擇學期"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {semester.length > 0 &&
            semester.map((item, index) => (
              <ListboxOption
                key={index}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{item.name}</span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </ListboxOption>
            ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function Week({ createData, setCreateData, setDetail, index, setAddData }) {
  const week = [
    {
      id: 0,
      name: "星期一"
    },
    {
      id: 1,
      name: "星期二"
    },
    {
      id: 2,
      name: "星期三"
    },
    {
      id: 3,
      name: "星期四"
    },
    {
      id: 4,
      name: "星期五"
    },
    {
      id: 5,
      name: "星期六"
    },
    {
      id: 6,
      name: "星期日"
    }
  ];
  const [selected, setSelected] = useState({});

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setSelected(selected);
        if (setDetail) {
          setDetail((prev) => {
            return prev.map((item, i) => {
              if (i === index) {
                return { ...item, week: selected.id };
              }
              return item;
            });
          });
        }

        if (setAddData) {
          setAddData((prev) => {
            return {
              ...prev,
              week: selected.id
            };
          });
        }
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-red-500">上課星期</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.name || "請選擇日期"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {week.length > 0 &&
            week.map((item, index) => (
              <ListboxOption
                key={item.id}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{item.name}</span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </ListboxOption>
            ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function CourseExtend({ createData, setCreateData, setInput }) {
  const semester = ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];
  const [selected, setSelected] = useState(semester[0]);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setInput((prev) => {
          return {
            ...prev,
            course_name_extend: selected
          };
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">班別</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected || "請選擇班別"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {semester.length > 0 &&
            semester.map((item, index) => (
              <ListboxOption
                key={index}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{item}</span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </ListboxOption>
            ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function StudentSelect({ createData, setCreateData }) {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  async function getStudentList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?tutoring_id=${createData.tutoring_id || 100}`, config);
    const res = await response.json();
    if (response.ok) {
      setStudents(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  const filteredItems =
    query === ""
      ? students
      : students.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const en_name = item.user.nick_name?.toLowerCase() || "";
          const school = item.school?.school_name?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || en_name.includes(query.toLowerCase()) || school.includes(query.toLowerCase());
        });

  useEffect(() => {
    getStudentList();
  }, [createData.tutoring_id]);

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(selected) => {
        setCreateData({
          ...createData,
          student_id: selected?.id
        });
        setQuery("");
        setSelectedPerson(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">姓名</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(item) => {
            const str = [];
            const name = item?.user.first_name || "";
            if (name != "") str.push(name);
            const en_name = item?.user.nick_name || "";
            if (en_name != "") str.push(en_name);
            const grade = item?.grade?.grade_name || "";
            if (grade != "") str.push(grade);
            return str.join(" / ");
          }}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredItems.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item, index) => (
              <ComboboxOption
                key={index}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <div className="flex">
                  <span className="truncate group-data-[selected]:font-semibold">{item.user.first_name}</span>
                  <span className="ml-2 truncate text-gray-500 group-data-[focus]:text-indigo-200">{item.user.nick_name}</span>
                  <span className="ml-2 truncate text-gray-500 group-data-[focus]:text-indigo-200">{item.grade?.grade_name}</span>
                </div>

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
  );
}

export function Course({ setInput }) {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [course, setCourse] = useState([]);

  function getList(course_list, array) {
    course_list.forEach((course) => {
      const data = {
        id: course.course_no,
        name: course.course_name,
        visable: course.is_visable
      };
      array.push(data);
      // if (course.children_node_list.length > 0) {
      //   getList(course.children_node_list, array);
      // }
    });
    setCourse(array);
  }

  async function getCoursesList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/course_list?is_course=true&visible=true`, config);
    const res = await response.json();
    if (response.ok) {
      getList(res.course_list, []);
    } else {
      const msg = error(response.status, res);
      //   setInfo({
      //     show: true,
      //     success: false,
      //     msg: "錯誤" + msg
      //   });
    }
  }

  useEffect(() => {
    getCoursesList();
  }, []);

  const filteredItems =
    query === ""
      ? course
      : course.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(item) => {
        if (item) {
          setInput((prev) => {
            return {
              ...prev,
              course_no: item.id
            };
          });
          setQuery("");
          setSelectedPerson(item);
        }
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-red-500">課程名稱</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(item) => item?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredItems.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <ComboboxOption
                key={item.id}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <div className="flex items-center">
                  <span
                    className={classNames("inline-block h-2 w-2 flex-shrink-0 rounded-full", item.visable ? "bg-green-400" : "bg-gray-400")}
                    aria-hidden="true"
                  />
                  <span className="ml-3 truncate group-data-[selected]:font-semibold">
                    {item.name}
                    <span className="sr-only"> is {item.visable ? "visable" : "offline"}</span>
                  </span>
                </div>

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
  );
}

export function Classroom({ setDetail, index, setAddData }) {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [classroom, setClassroom] = useState([]);

  async function getClassRoomList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/classroom/list`, config);
    const res = await response.json();
    if (response.ok) {
      setClassroom(res.list);
    } else {
      const msg = error(response.status, res);
    }
  }

  useEffect(() => {
    getClassRoomList();
  }, []);

  const filteredItems =
    query === ""
      ? classroom
      : classroom.filter((item) => {
          return item.classroom_name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(selected) => {
        if (setDetail) {
          setDetail((prev) => {
            return prev.map((item, i) => {
              if (i === index) {
                return { ...item, classroom_id: selected?.id };
              }
              return item;
            });
          });
        }

        if (setAddData) {
          setAddData((prev) => {
            return {
              ...prev,
              classroom_id: selected?.id
            };
          });
        }

        setQuery("");
        setSelectedPerson(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">教室</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(item) => item?.classroom_name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredItems.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <ComboboxOption
                key={item.id}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <div className="flex">
                  <span className="truncate group-data-[selected]:font-semibold">{item.classroom_name}</span>
                  <span className="ml-2 truncate text-gray-500 group-data-[focus]:text-indigo-200">{item.classroom_no}</span>
                </div>

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
  );
}

export function Teacher({ setDetail, index, setAddData }) {
  const [teacherList, setTeacherList] = useState([]);
  const [teacher, setTeacher] = useState([]);

  async function getTeacherList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list?show_exit=false`, config);
    const res = await response.json();
    if (response.ok) {
      setTeacher(res.list);
    } else {
      const msg = error(response.status, res);
    }
  }

  useEffect(() => {
    getTeacherList();
  }, []);

  const handleSelect = (select) => {
    setTeacherList((prevSelected) => {
      if (prevSelected?.some((item) => item.id === select.id)) {
        return prevSelected?.filter((item) => item.id !== select.id);
      } else {
        return [...prevSelected, select];
      }
    });
  };

  useEffect(() => {
    if (setDetail) {
      setDetail((prev) => {
        return prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              teacher_id_list: teacherList.map((j) => j.id)
            };
          }
          return item;
        });
      });
    }

    if (setAddData) {
      setAddData((prev) => {
        return {
          ...prev,
          teacher_id_list: teacherList.map((j) => j.id)
        };
      });
    }
  }, [teacherList]);

  return (
    <Listbox
      as="div"
      value={teacherList}
      multiple
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">老師</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{teacherList?.map((person) => person.user?.first_name).join(", ") || "請選擇老師"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {teacher.map((person) => (
            <ListboxOption
              key={person.id}
              value={person}
              className={`group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ${teacherList?.some((item) => item.id === person.id) ? "bg-indigo-600 text-white" : ""}`}
              onClick={() => handleSelect(person)}
            >
              <span className="block truncate font-normal">{person.user.first_name}</span>
              {teacherList?.some((item) => item.id === person.id) && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
