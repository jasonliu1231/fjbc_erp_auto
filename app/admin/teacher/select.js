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

  useEffect(() => {
    const health = translate(health_status);

    if (createData) {
      createData.current.health_status = health;
    }

    if (settingData) {
      setSettingData({
        ...settingData,
        health_status: health
      });
    }
  }, [health_status]);

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
  const [city, setCity] = useState([]);
  const [schoolType, setSchoolType] = useState([]);
  const [grade, setGrade] = useState([]);
  const [dist, setDist] = useState([]);
  const [school, setSchool] = useState([]);
  // 選擇值
  const [selected, setSelected] = useState({
    city: {
      city_name: "臺中市",
      city_code: "B",
      id: 2
    },
    dist: {
      dist_name: "太平區",
      post_code: 411,
      id: 120
    },
    type: {
      school_type_name: "國小",
      id: 2
    }
  });

  async function getCity() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8101}/fjbc_public_api/address/city_list`);
    const res = await response.json();
    if (response.ok) {
      setCity(res.TwCity_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getDist() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8101}/fjbc_public_api/address/dist_list/${selected.city.id}`);
    const res = await response.json();
    if (response.ok) {
      setDist(res.TwDist_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getGrade() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8101}/fjbc_public_api/school/school_grade?school_type_id=${selected.type.id}`);
    const res = await response.json();
    if (response.ok) {
      setGrade(res.TwGrade_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getSchoolType() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8101}/fjbc_public_api/school/school_type`);
    const res = await response.json();
    if (response.ok) {
      setSchoolType(res.TwSchoolType_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getSchools() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8101}/fjbc_public_api/school/schools?city_id=${selected.city.id}&dist_id=${selected.dist.id}&school_type_id=${selected.type.id}`);
    const res = await response.json();
    if (response.ok) {
      setSchool(res.TwSchool_list);
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
    getSchoolType();
    getCity();
  }, []);

  useEffect(() => {
    getDist();
  }, [selected.city]);

  useEffect(() => {
    getGrade();
  }, [selected.type]);

  useEffect(() => {
    getSchools();
  }, [selected]);

  useEffect(() => {
    if (createData) {
      createData.current.school_id = selected.school?.id;
      createData.current.grade_id = selected.grade?.id;
    }
    if (settingData) {
      setSettingData({
        ...settingData,
        school_id: selected.school?.id,
        grade_id: selected.grade?.id
      });
    }
  }, [selected.school, selected.grade]);

  useEffect(() => {
    if (settingData && !settingData.school_id && !settingData.grade_id) {
      setSelected({
        ...selected,
        grade: settingData.grade,
        school: settingData.school
      });
    }
  }, [settingData]);

  return (
    <fieldset className="bg-white">
      <legend className="block text-sm font-medium leading-6 text-gray-900">學校</legend>
      <div className="mt-2 -space-y-px rounded-md shadow-sm">
        <div className="flex">
          <div className="w-1/4">
            <Listbox
              value={selected.city}
              onChange={(select) => {
                setSelected({
                  ...selected,
                  city: select
                });
              }}
            >
              <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default rounded-tl-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <span className="block truncate">{selected.city.city_name}</span>
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
                  {city.map((c) => (
                    <ListboxOption
                      key={c.id}
                      value={c}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">{c.city_name}</span>

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
          <div className="w-1/4">
            <Listbox
              value={selected.dist}
              onChange={(select) => {
                setSelected({
                  ...selected,
                  dist: select
                });
              }}
            >
              <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <span className="block truncate">{selected.dist.dist_name}</span>
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
                  {dist.map((d) => (
                    <ListboxOption
                      key={d.id}
                      value={d}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">{d.dist_name || ""}</span>

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
          <div className="w-1/4">
            <Listbox
              value={selected.type}
              onChange={(select) => {
                setSelected({
                  ...selected,
                  type: select
                });
              }}
            >
              <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <span className="block truncate">{selected.type.school_type_name}</span>
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
                  {schoolType.map((t) => (
                    <ListboxOption
                      key={t.id}
                      value={t}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">{t.school_type_name}</span>

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
          <div className="w-1/4">
            <Listbox
              value={selected.grade || ""}
              onChange={(select) => {
                setSelected({
                  ...selected,
                  grade: select
                });
              }}
            >
              <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default rounded-rl-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <span className="block truncate">{selected.grade?.grade_name || "請選擇年級！"}</span>
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
                  {grade.map((g) => (
                    <ListboxOption
                      key={g.id}
                      value={g}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">{g.grade_name}</span>

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
        </div>
        <div>
          <Listbox
            value={selected.school || ""}
            onChange={(select) => {
              setSelected({
                ...selected,
                school: select
              });
            }}
          >
            <div className="relative">
              <ListboxButton className="relative w-full cursor-default rounded-b-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="block truncate">{selected.school?.school_name || "請選擇學校！"}</span>
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
                {school.map((s) => (
                  <ListboxOption
                    key={s.id}
                    value={s}
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                  >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">{s.school_name}</span>

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
      </div>
    </fieldset>
  );
}

export function RoleSelect({ createData, settingData, setSettingData }) {
  const roleList = [
    { id: 1, name: "學生" },
    { id: 2, name: "家長" },
    { id: 3, name: "老師" },
    { id: 4, name: "使用者" },
    { id: 5, name: "管理員" },
    { id: 6, name: "員工" }
  ];

  const [selected, setSelected] = useState(roleList[2]);

  return (
    <Listbox
      value={selected}
      onChange={setSelected}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">權限</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected.name}</span>
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
          {roleList.map((role) => (
            <ListboxOption
              key={role.id}
              value={role}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
            >
              <span className="block truncate font-normal group-data-[selected]:font-semibold">{role.name}</span>

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
