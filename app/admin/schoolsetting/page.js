"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar";
import Alert from "../alert";
import Select from "./select";
import { error } from "../../utils";

export default function Settings() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [list, setList] = useState({
    city: [],
    dist: [],
    type: []
  });
  const [selected, setSelected] = useState({
    city: {
      name: "台中市",
      id: 2
    },
    dist: {
      name: "太平區",
      id: 120
    },
    type: {
      name: "國小",
      id: 2
    }
  });
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    getCity();
    getSchoolType();
  }, []);

  useEffect(() => {
    getDist();
  }, [selected.city]);

  useEffect(() => {
    getSchools();
    new Sortable(document.querySelector(`#sortable-list`), {
      ghostClass: "blue-background-class",
      onEnd: async () => {
        const data = document.querySelectorAll(`#sortable-list > li`);

        const body = [];
        data.forEach((item, index) => {
          const id = item.querySelector(".schoolid").value;
          body.push({
            id: Number(id),
            school_sort: index + 1
          });
        });
        const config = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8101}/fjbc_public_api/school/sort`, config);
        if (response.ok) {
          const res = await response.json();
          setSchools(res.TwSchool_list);
          setInfo({
            show: true,
            success: true,
            msg: "順序更新完成"
          });
        } else {
          setInfo({
            show: true,
            success: false,
            msg: "順序更新失敗"
          });
        }
      }
    });
  }, [selected]);

  async function getCity() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8101}/fjbc_public_api/address/city_list`);
    const res = await response.json();
    if (response.ok) {
      setList((prevList) => ({
        ...prevList,
        city: res.TwCity_list.map((city) => ({ id: city.id, name: city.city_name }))
      }));
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
      setList((prevList) => ({
        ...prevList,
        dist: res.TwDist_list.map((dist) => ({ id: dist.id, name: dist.dist_name }))
      }));
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
      setList((prevList) => ({
        ...prevList,
        type: res.TwSchoolType_list.map((type) => ({ id: type.id, name: type.school_type_name }))
      }));
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
      setSchools(res.TwSchool_list);
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
    <>
      {/* <Navbar /> */}
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">學校排序設定</h1>
        </div>
        <div className="flex mb-3">
          <Select
            data={{
              type: "city",
              items: list.city,
              selected: selected.city,
              setSelected: setSelected
            }}
          />
          <Select
            data={{
              type: "dist",
              items: list.dist,
              selected: selected.dist,
              setSelected: setSelected
            }}
          />
          <Select
            data={{
              type: "type",
              items: list.type,
              selected: selected.type,
              setSelected: setSelected
            }}
          />
        </div>
        <div>
          <ul
            role="list"
            className="divide-y divide-gray-100"
            id="sortable-list"
          >
            {schools.map((school, index) => (
              <li
                key={school.id}
                className="cursor-ns-resize flex justify-between gap-x-6 py-5 mt-3 p-3 rounded-md bg-white hover:bg-gray-200"
              >
                <input
                  type="hidden"
                  value={school.id}
                  className="schoolid"
                />
                <div className="md:w-1/3 sm:w-1/6">{school.school_sort}</div>
                <div className="flex min-w-0 gap-x-4 w-1/3">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{school.school_name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{school.address}</p>
                  </div>
                </div>
                <div className="shrink-0 sm:flex sm:flex-col w-1/3">
                  <p className="text-sm leading-6 text-gray-900">{school.tel}</p>
                  <a
                    className="text-sm leading-6 text-gray-900 text-blue-500"
                    href={school.url}
                  >
                    官方網站 <span className="sm:inline-block hidden">{school.url}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
