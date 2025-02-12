"use client";

import { useEffect, useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";

export function TutoringSelect({ createData, setCreateData }) {
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
        setCreateData({
          ...createData,
          tutoring_id: selected.id
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">補習班</Label>
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

export function SchoolYear({ createData, setCreateData }) {
  const y = new Date().getFullYear() - 1911;
  const year = [y - 1, y, y + 1];
  const [selected, setSelected] = useState([]);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setCreateData({
          ...createData,
          school_year: selected
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">學年度</Label>
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

export function StartMonth({ createData, setCreateData }) {
  const month = [
    { id: 1, name: "一月" },
    { id: 2, name: "二月" },
    { id: 3, name: "三月" },
    { id: 4, name: "四月" },
    { id: 5, name: "五月" },
    { id: 6, name: "六月" },
    { id: 7, name: "七月" },
    { id: 8, name: "八月" },
    { id: 9, name: "九月" },
    { id: 10, name: "十月" },
    { id: 11, name: "十一月" },
    { id: 12, name: "十二月" }
  ];

  const [selected, setSelected] = useState([]);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setCreateData({
          ...createData,
          start_month: selected.id
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">起始月份</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.name || "請選擇月份"}</span>
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
          {month.length > 0 &&
            month.map((schoolMonth) => (
              <ListboxOption
                key={schoolMonth.id}
                value={schoolMonth}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{schoolMonth.name}</span>

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

export function EndMonth({ createData, setCreateData }) {
  const month = [
    { id: 1, name: "一月" },
    { id: 2, name: "二月" },
    { id: 3, name: "三月" },
    { id: 4, name: "四月" },
    { id: 5, name: "五月" },
    { id: 6, name: "六月" },
    { id: 7, name: "七月" },
    { id: 8, name: "八月" },
    { id: 9, name: "九月" },
    { id: 10, name: "十月" },
    { id: 11, name: "十一月" },
    { id: 12, name: "十二月" }
  ];

  const [selected, setSelected] = useState([]);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        setCreateData({
          ...createData,
          end_month: selected.id
        });
        setSelected(selected);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">結束月份</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.name || "請選擇月份"}</span>
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
          {month.length > 0 &&
            month.map((schoolMonth) => (
              <ListboxOption
                key={schoolMonth.id}
                value={schoolMonth}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{schoolMonth.name}</span>

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?student_status_id=1&tutoring_id=${createData.tutoring_id || 100}`, config);
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

export function UnitSelect({ data }) {
  const { invoice_detail_create_list, setInvoice_detail_create_list, index } = data;
  const units = [
    { id: 1, name: "堂" },
    { id: 2, name: "週" },
    { id: 3, name: "月" },
    { id: 4, name: "季" },
    { id: 5, name: "學期" }
  ];

  const [selected, setSelected] = useState();
  const [selectedUnit, setSelectedUnit] = useState("選擇單位");

  useEffect(() => {
    if (invoice_detail_create_list[index].unit > 0) {
      const unitName = units.find((i) => i.id == invoice_detail_create_list[index].unit)?.name;
      if (unitName) {
        setSelectedUnit(unitName);
      }
    }
  }, [invoice_detail_create_list]);

  useEffect(() => {
    if (selected) {
      const newArray = invoice_detail_create_list.map((sub, i) => {
        if (i == index) {
          return {
            ...sub,
            unit: selected?.id
          };
        }
        return sub;
      });
      setInvoice_detail_create_list(newArray);
    }
  }, [selected]);

  return (
    <Listbox
      value={selected}
      onChange={setSelected}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">單位</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selectedUnit}</span>
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
          {units.length > 0 &&
            units.map((unit) => (
              <ListboxOption
                key={unit.id}
                value={unit}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">{unit.name}</span>

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

export function SubjectSelect({ data }) {
  const { invoice_detail_create_list, setInvoice_detail_create_list, index, tutoring_id } = data;
  const items1 = [
    { id: 1, name: "課輔" },
    { id: 2, name: "國文" },
    { id: 3, name: "英文" },
    { id: 4, name: "數學" },
    { id: 5, name: "社會" },
    { id: 6, name: "自然" },
    { id: 7, name: "其他" },
    { id: 8, name: "寒假營隊" },
    { id: 9, name: "暑假營隊" }
  ];

  const items2 = [
    { id: 1, name: "ESL 4日 班" },
    { id: 2, name: "ESL 4日 親子班" },
    { id: 3, name: "ESL 3日 班" },
    { id: 4, name: "EFL 3日 班" },
    { id: 5, name: "EFL 2日 班(外師)" },
    { id: 6, name: "EFL 2日 班(中師)" },
    { id: 7, name: "繪本班" },
    { id: 8, name: "課輔" },
    { id: 9, name: "其他" },
    { id: 10, name: "EFL 1日 班" },
    { id: 11, name: "寒假營隊" },
    { id: 12, name: "暑假營隊" }
  ];

  const [selected, setSelected] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (tutoring_id == 1) {
      setItems(items1);
    } else if (tutoring_id == 2) {
      setItems(items2);
    }
  }, [tutoring_id]);

  useEffect(() => {
    if (selected) {
      const newArray = invoice_detail_create_list.map((sub, i) => {
        if (i == index) {
          return {
            ...sub,
            name: selected.name
          };
        }
        return sub;
      });
      setInvoice_detail_create_list(newArray);
    }
  }, [selected]);

  return (
    <Listbox
      value={selected}
      onChange={setSelected}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">科目</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{invoice_detail_create_list[index].name || "選擇科目"}</span>
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
          {items.map((item) => (
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
