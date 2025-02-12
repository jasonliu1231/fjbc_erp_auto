"use client";

import { useEffect, useState } from "react";
import { error } from "../../utils";

const today = new Date();
// 預設為前一天日期
const def_date = new Date(today.setDate(today.getDate() - 1)).toISOString().split("T")[0];

export default function Home({ setInfo }) {
  const [itemsList, setItemsList] = useState([]);
  const [newItemsList, setNewItemsList] = useState([]);
  const [search, setSearch] = useState(def_date);
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? itemsList
      : itemsList.filter((item) => {
          const first_name = item.first_name?.toLowerCase() || "";
          const course_name = item.course_name?.toLowerCase() || "";
          return first_name.includes(query.toLowerCase()) || course_name.includes(query.toLowerCase());
        });

  async function deleteReview() {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/contact_book_student/contactbook/reply`, config);
    const res = await response.json();
  }

  async function getItemList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/contact_book_student/contactbook/reply?search=${search}`, config);
    const res = await response.json();
    if (response.ok) {
      setItemsList(res);
      deleteReview(); // 刪除新舊紀錄
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getNewItemList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/contact_book_student/contactbook/reply/new`, config);
    const res = await response.json();
    if (response.ok) {
      setNewItemsList(res);
      deleteReview(); // 刪除新舊紀錄
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
    getNewItemList();
  }, []);

  useEffect(() => {
    getItemList();
  }, [search]);

  return (
    <>
      <div className="container mx-auto p-2 bg-white ">
        {newItemsList.length > 0 && (
          <>
            <div className="text-sky-400 font-semibold">未讀訊息</div>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="border-2 bg-yellow-50 text-center">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    日期
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    課程
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    學生
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    老師評語
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
                  >
                    家長回覆
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {newItemsList.map((person, index) => (
                  <tr
                    key={index}
                    className="text-sm text-left border-2 divide-x divide-gray-200 hover:bg-blue-100"
                  >
                    <td className="py-3 px-2 relative">
                      {person.is_review && <div className="color-flicker absolute font-semibold -top-2 -left-2">NEW</div>}

                      {person.course_date}
                    </td>
                    <td className="py-3 px-2">{person.course_name}</td>
                    <td className="py-3 px-2">
                      {person.first_name}({person.nick_name})
                    </td>
                    <td className="py-3 px-2">{person.teacher_sugg}</td>
                    <td className="py-3 px-2">{person.parent_sugg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="flex justify-around my-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="date"
            className="px-2 py-1 ring text-sky-600 rounded-md"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            type="text"
            placeholder="學生、課程"
            className="px-2 py-1 ring text-sky-600 rounded-md"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="border-2 bg-yellow-50 text-center">
            <tr>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                日期
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                課程
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                學生
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                老師評語
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                家長回覆
              </th>
            </tr>
          </thead>
          <tbody className="">
            {filteredItems.map((person, index) => (
              <tr
                key={index}
                className="text-sm text-left border-2 divide-x divide-gray-200 hover:bg-blue-100"
              >
                <td className="py-3 px-2">{person.course_date}</td>
                <td className="py-3 px-2">{person.course_name}</td>
                <td className="py-3 px-2">
                  {person.first_name}({person.nick_name})
                </td>
                <td className="py-3 px-2">{person.teacher_sugg}</td>
                <td className="py-3 px-2">{person.parent_sugg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
