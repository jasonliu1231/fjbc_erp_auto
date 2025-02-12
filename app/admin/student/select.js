"use client";

import { useEffect, useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { error } from "../../utils";

export function HistorySelect({ createData, settingData, setSettingData }) {
  const medicalHistory = ["無", "氣喘", "易流鼻血", "過敏體質", "癲癇", "蠶豆症", "心臟病", "肝炎Ａ型", "肝炎Ｂ型", "肝炎Ｃ型", "過敏"];
  const [health_status, setHealth_status] = useState([false, false, false, false, false, false, false, false, false, false, false]);

  function translate(data) {
    let health = "";
    data.forEach((checked) => {
      if (checked) {
        health += "1";
      } else {
        health += "0";
      }
    });

    return health;
  }

  // useEffect(() => {
  //   const health = translate(health_status);

  //   if (createData) {
  //     createData.current.health_status = health;
  //   }

  //   if (settingData) {
  //     setSettingData({
  //       ...settingData,
  //       health_status: health
  //     });
  //   }
  // }, [health_status]);

  useEffect(() => {
    if (settingData && translate(health_status) != settingData.health_status) {
      if (settingData.health_status && settingData.health_status != "") {
        const status = settingData.health_status.split("");
        setHealth_status(status.map((i) => i == 1));
      }
    }
  }, [settingData?.health_status]);

  return (
    <>
      {medicalHistory.map((historyItem, index) => (
        <div
          className="col-span-1"
          key={index}
        >
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                checked={health_status[index] || false}
                onChange={(event) => {
                  const checked = event.target.checked;
                  const newStatus = health_status.map((item, i) => (i === index ? checked : item));
                  setHealth_status(newStatus);
                  // health_status[index] = checked;
                  // health_status.current[index] = event.target.checked;
                }}
                id={"comments" + index}
                name={"comments" + index}
                type="checkbox"
                aria-describedby="comments-description"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label
                htmlFor={"comments" + index}
                className="font-medium text-gray-900 cursor-pointer"
              >
                {historyItem}
              </label>{" "}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function TutoringSelect({ createData, settingData, setSettingData }) {
  const [tutoringList, setTutoringList] = useState([]);
  const [tutoring_id_list, setTutoring_id_list] = useState([]);

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
      setTutoringList(res.tutoring_list);
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

  useEffect(() => {
    if (createData) {
      createData.current.tutoring_id_list = tutoring_id_list;
    }
    if (settingData) {
      setSettingData({
        ...settingData,
        tutoring_id_list: tutoring_id_list
      });
    }
  }, [tutoring_id_list]);

  useEffect(() => {
    if (settingData) {
      setTutoring_id_list(() => {
        return settingData.tutoring_list.map((i) => i.id);
      });
    }
  }, [settingData?.tutoring_list]);

  return (
    <fieldset className="border-b border-gray-200 divide-y divide-gray-200">
      <legend>所屬補習班</legend>
      {tutoringList.map((tutoring) => (
        <div
          className="divide-y divide-gray-200"
          key={tutoring.id}
        >
          <div className="relative flex items-start pb-4 pt-3.5">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label className="font-medium text-gray-900">{tutoring.tutoring_name}</label>
              <p
                id="comments-description"
                className="text-gray-500"
              >
                <span className="flex">
                  <MapPinIcon className="w-5" />：{tutoring.address}
                </span>

                <span className="flex">
                  <PhoneIcon className="w-5" />：{tutoring.tel}
                </span>
              </p>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                checked={tutoring_id_list?.includes(tutoring.id)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  if (checked) {
                    setTutoring_id_list([...tutoring_id_list, tutoring.id]);
                  } else {
                    setTutoring_id_list(tutoring_id_list.filter((id) => id !== tutoring.id));
                  }
                }}
                type="checkbox"
                aria-describedby="comments-description"
                className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      ))}
    </fieldset>
  );
}

export function SchoolSelect({ createData, settingData, setSettingData }) {
  // 搜尋物件
  const [cityList, setCityList] = useState([]);
  const [distList, setDistList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [school, setSchool] = useState([]);
  const [query, setQuery] = useState("");
  // 選擇值
  const [selected, setSelected] = useState({
    city: 2,
    dist: 120,
    grade: 0
  });
  const [selectedSchool, setSelectedSchool] = useState(null);

  const filteredDist = selected.city ? distList?.filter((i) => i.city_id == selected.city) : [];

  const schoolList = school?.filter((item) => {
    return item.city_id == selected.city && item.dist_id == selected.dist;
  });

  const filteredSchool =
    query === ""
      ? schoolList
      : schoolList.filter((item) => {
          return item.school_name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    const grade = fetch(`/api/grade`);
    const school = fetch(`/api/school`);

    Promise.all([grade, school])
      .then(async ([response1, response2]) => {
        const result1 = await response1.json();
        const result2 = await response2.json();

        setGradeList(result1);
        setSchool(result2.school);
        setCityList(result2.city);
        setDistList(result2.dist);
      })
      .catch((err) => {
        alert("讀取不到資料，請聯繫資訊組!");
      });
  }, []);

  useEffect(() => {
    if (settingData) {
      setSelected({
        city: settingData.school.city_id,
        dist: settingData.school.dist_id,
        grade: settingData.grade.id
      });
      setSelectedSchool({
        id: settingData.school.id,
        school_name: settingData.school.school_name
      });
      console.log(settingData);
    }
  }, [settingData]);

  return (
    <fieldset className="bg-white">
      <legend className="block text-sm font-medium leading-6 text-gray-900">學校</legend>
      <div className="mt-2 -space-y-px rounded-md shadow-sm">
        <div className="flex justify-between">
          <div className="w-full">
            <select
              value={selected.city}
              onChange={(e) => {
                setSelected({
                  ...selected,
                  city: e.target.value
                });
              }}
              className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
            >
              {cityList &&
                cityList?.map((i) => (
                  <option
                    key={i.id}
                    value={i.id}
                  >
                    {i.city_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-full">
            <select
              value={selected.dist}
              onChange={(e) => {
                setSelected({
                  ...selected,
                  dist: e.target.value
                });
              }}
              className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
            >
              {filteredDist &&
                filteredDist?.map((i) => (
                  <option
                    key={i.id}
                    value={i.id}
                  >
                    {i.dist_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-full">
            {" "}
            <select
              value={selected.grade}
              onChange={(e) => {
                createData.current.grade_id = e.target.value;
                setSelected({
                  ...selected,
                  grade: e.target.value
                });
              }}
              className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
            >
              <option>請選擇年級</option>
              {gradeList &&
                gradeList.map((i) => (
                  <option
                    key={i.id}
                    value={i.id}
                  >
                    {i.grade_name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="pt-1">
          <Combobox
            as="div"
            value={selectedSchool}
            onChange={(select) => {
              if (select) {
                setQuery("");
                setSelectedSchool(select);
                createData.current.school_id = select.id;
              }
            }}
          >
            <div className="relative">
              <ComboboxInput
                className="w-full rounded-md border-0 bg-white py-1 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => setQuery("")}
                value={selectedSchool?.school_name || ""}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>

              {filteredSchool?.length > 0 && (
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
                  {filteredSchool.map((item) => (
                    <ComboboxOption
                      key={item.id}
                      value={item}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      <span className="block truncate group-data-[selected]:font-semibold">{item.school_name}</span>
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              )}
            </div>
          </Combobox>
        </div>
      </div>
    </fieldset>
  );
}
