"use client";

import { ArrowsRightLeftIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Alert from "../alert";
import { error } from "../../utils";
import List from "./list";
import Select from "./select";

export default function Home() {
  const [oitems, setoItems] = useState([]);
  const [items, setItems] = useState([]);
  const [course, setCourse] = useState([]);
  const [tutoringList, setTutoringsList] = useState([]);
  const [tutoring, setTutorings] = useState({});
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const [query, setQuery] = useState("");
  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          const name = item.course_name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  async function setCourseList(list, array) {
    list.forEach((items) => {
      let course = {
        course_name: items.course_name,
        course_no: items.course_no,
        id: items.id,
        color: items.color
      };
      array.push(course);
      if (items.children_node_list.length > 0) {
        setCourseList(items.children_node_list, array);
      }
    });
    setoItems(array);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/course_list?visible=true&is_course=false`, config);
    const res = await response.json();
    if (response.ok) {
      setoItems(res.course_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getTutoringCoursesList() {
    setCourse([]);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ask_course/tutoring/${tutoring.id || 0}/course`, config);
    const res = await response.json();
    if (response.ok) {
      setCourse(res.course_list);
      setSortable();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getTutoring() {
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
      setTutoringsList(res.tutoring_list);
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
    getCoursesList();
    getTutoring();
  }, []);

  useEffect(() => {
    const result = oitems.filter((aItem) => !course.some((bItem) => bItem.id === aItem.id));
    setItems(result);
  }, [course]);

  function setSortable() {
    new Sortable(document.querySelector(`#sortable-list`), {
      group: "sortable",
      ghostClass: "blue-background-class",
      onAdd: async function (/**Event*/ evt) {
        const element = evt.item;
        const val = element.querySelector(".course_no").value;
        const config = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            clientid: `${localStorage.getItem("client_id")}`,
            "Content-Type": "application/json"
          }
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ask_course/tutoring/${tutoring.id}/course?course_no=${val}`, config);
        const res = await response.json();
        if (response.ok) {
          setCourse(res.course_list);
          setInfo({
            show: true,
            success: true,
            msg: "有興趣課程已移除"
          });
        } else {
          const msg = error(response.status, res);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      },
      onEnd: function (/**Event*/ evt) {
        evt.from.appendChild(evt.item);
      }
    });

    new Sortable(document.querySelector(`#sortable-list2`), {
      group: "sortable",
      ghostClass: "blue-background-class",
      onAdd: async function (/**Event*/ evt) {
        const element = evt.item;
        const val = element.querySelector(".course_no").value;
        const config = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            clientid: `${localStorage.getItem("client_id")}`,
            "Content-Type": "application/json"
          }
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ask_course/tutoring/${tutoring.id}/course?course_no=${val}`, config);
        const res = await response.json();
        if (response.ok) {
          setCourse(res.course_list);
          setInfo({
            show: true,
            success: true,
            msg: "有興趣課程已新增"
          });
        } else {
          const msg = error(response.status, res);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      },
      onEnd: function (/**Event*/ evt) {
        evt.from.appendChild(evt.item);
      }
    });
  }

  useEffect(() => {
    getTutoringCoursesList();
  }, [tutoring]);

  return (
    <>
      {/* <Navbar /> */}
      <Alert
        info={info}
        setInfo={setInfo}
      />

      <div
        className="container mx-auto p-2 sm:p-4"
        style={{ maxHeight: "90vh" }}
      >
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">問班表課程設定</h1>
        </div>
        <div className="flex">
          <div
            className="overflow-auto p-1 sm:p-2"
            style={{ maxHeight: "85vh", width: "48%" }}
          >
            <div
              className="sm:mb-3"
              style={{ height: "40px" }}
            >
              <input
                onChange={(event) => setQuery(event.target.value)}
                value={query}
                type="text"
                placeholder="名稱"
                className="m-1 relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              />
            </div>
            <List
              items={filteredItems}
              id={"sortable-list"}
              setInfo={setInfo}
            />
          </div>
          <div
            className="hidden p-1 sm:flex justify-center items-center"
            style={{ width: "4%" }}
          >
            <ArrowsRightLeftIcon className="w-5 h-5 text-blue-700" />
          </div>
          <div
            className="p-1 sm:p-2"
            style={{ maxHeight: "85vh", width: "48%" }}
          >
            <div
              className="sm:mb-3"
              style={{ height: "40px" }}
            >
              <Select
                tutoringList={tutoringList}
                tutoring={tutoring}
                setTutorings={setTutorings}
              />
            </div>
            <List
              items={course}
              id={"sortable-list2"}
              setInfo={setInfo}
            />
          </div>
        </div>
      </div>
    </>
  );
}
