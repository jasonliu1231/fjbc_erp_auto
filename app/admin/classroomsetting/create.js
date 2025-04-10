"use client";

import { useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";

const tutorings = [
  {
    tutoring_name: "多易補習班",
    tutoring_no: "A"
  },
  {
    tutoring_name: "艾思補習班",
    tutoring_no: "B"
  },
  {
    tutoring_name: "華而敦補習班",
    tutoring_no: "C"
  }
];

export default function Example({ setInfo }) {
  const [selected, setSelected] = useState({});
  const [classNumber, setClassNumber] = useState("");
  const [createData, setCreateData] = useState({
    classroom_name: "",
    classroom_no: "",
    classroom_tel: "",
    location: ""
  });

  function randomNumber() {
    const randomFourDigitString = Math.floor(Math.random() * 9999) + 1;
    const fourDigitString = randomFourDigitString.toString().padStart(4, "0");

    return fourDigitString;
  }

  async function addItem() {
    // if (!selected.tutoring_name) {
    //   setInfo({ show: true, success: false, msg: "請選擇補習班" });
    //   return;
    // }
    if (classNumber < 1 && createData.classroom_name == "") {
      setInfo({ show: true, success: false, msg: "請填寫教室號碼或教室名稱" });
      return;
    }
    // 無填寫教室名稱自動生成
    if (createData.classroom_name == "") {
      createData.classroom_name = `${selected.tutoring_name} ${classNumber} 教室`;
    }

    if (classNumber < 1) {
      const fourDigitString = randomNumber();
      createData.classroom_no = `${selected.tutoring_no}_${fourDigitString}`;
    } else {
      createData.classroom_no = `${selected.tutoring_no}_${classNumber}`;
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/classroom/`, config);
    const res = await response.json();
    // 如果隨機產生重複將自動重新新增
    if (response.status == 409 && classNumber < 1) {
      const fourDigitString = randomNumber();
      createData.classroom_no = `${selected.tutoring_no}_${fourDigitString}`;
      addItem();
    }
    setCreateData({
      ...createData,
      classroom_name: "",
      classroom_no: "",
      classroom_tel: "",
      location: ""
    });
    if (response.ok) {
      window.location.reload();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  return (
    <div className="isolate bg-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">新增教室</h2>
        {/* <p className="text-sm font-bold tracking-tight text-red-400">教室名稱、教室號碼，可以擇一填寫</p> */}
      </div>
      <div className="mx-auto mt-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
          {/* <div className="sm:col-span-1">
            <Listbox
              value={selected}
              onChange={(selected) => {
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
                        key={tutoring.tutoring_no}
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
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              教室號碼
            </label>
            <div className="sm:mt-2.5">
              <input
                type="text"
                autoComplete="name"
                value={classNumber}
                onChange={(event) => {
                  setClassNumber(event.target.value);
                }}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div> */}
          <div className="sm:col-span-1">
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              教室名稱
            </label>
            <div className="sm:mt-2.5">
              <input
                type="text"
                autoComplete="street-address"
                value={createData.classroom_name}
                onChange={(event) => {
                  setCreateData({
                    ...createData,
                    classroom_name: event.target.value
                  });
                }}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              分機
            </label>
            <div className="sm:mt-2.5">
              <input
                type="text"
                autoComplete="tel"
                value={createData.classroom_tel}
                onChange={(event) => {
                  setCreateData({
                    ...createData,
                    classroom_tel: event.target.value
                  });
                }}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="srcName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              地點
            </label>
            <div className="sm:mt-2.5">
              <input
                type="text"
                autoComplete="street-address"
                value={createData.location}
                onChange={(event) => {
                  setCreateData({
                    ...createData,
                    location: event.target.value
                  });
                }}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            onClick={addItem}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}
