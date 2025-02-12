"use client";

import { Tree } from "./dialog";
import { Cog6ToothIcon, PlusCircleIcon, XCircleIcon, CheckCircleIcon, ArrowDownCircleIcon, ArrowUpCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { error } from "../../utils";

export default function Home({ setInfo }) {
  const [treeData, setTreeData] = useState([]);
  const [open, setOpen] = useState({
    display: false
  });

  async function getCoursesList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/list`, config);
    const res = await response.json();
    if (response.ok) {
      setTreeData(res.course_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function setIsCourse(id, val) {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        is_course: val
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      getCoursesList();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  const courseSetting = (course_name, course_no, method, setOpen, setInfo, setTreeData) => {
    setOpen({
      display: true,
      data: {
        course_name: course_name,
        course_no: course_no,
        method: method
      },
      setInfo: setInfo,
      setTreeData: setTreeData
    });
  };

  const courseDelete = async (id, setInfo, setTreeData) => {
    const check = confirm("確定要刪除嗎？如只是暫時不使用請點選關閉！");
    if (check) {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          clientid: `${localStorage.getItem("client_id")}`,
          "Content-Type": "application/json"
        }
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}`, config);
      const res = await response.json();
      if (response.ok) {
        setTreeData(res.course_list);
      } else {
        const msg = error(response.status, res);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }
    }
  };

  const courseSwitch = async (id, open, setInfo, setTreeData) => {
    let url = "";
    if (open) {
      url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}/show`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/courses/${id}/hide`;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setTreeData(res.course_list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  };

  const TreeNode = ({ node, isFrist, setOpen, color, setInfo, setTreeData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    if (isFrist) {
      color = node.color;
    }

    return (
      <li className={`${isFrist ? "rounded-md bg-gray-100" : "rounded-md bg-gray-100 pl-12"}`}>
        <div className="flex">
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={handleToggle}
          >
            {node.children_node_list.length > 0 && (isOpen ? <ArrowUpCircleIcon className="w-8 mx-2 text-red-500" /> : <ArrowDownCircleIcon className="w-8 mx-2 text-blue-500" />)}
          </div>
          {node.children_node_list.length == 0 && <div className="w-8 mx-2" />}
          <div
            className="pl-3 py-2 border-b-2 border-l-2 w-full grid grid-cols-6"
            style={{ borderColor: color, backgroundColor: !node.is_visable ? "#cacaca" : "" }}
          >
            <div
              className="col-span-4 flex cursor-pointer"
              onClick={handleToggle}
            >
              <div className="flex items-end">
                <div className="text-xl">{node.course_name}</div>
                <div className="text-sm ml-3 text-gray-400">{node.course_no}</div>
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              <div
                onClick={() => {
                  setIsCourse(node.id, !node.is_course);
                }}
                className={`${node.is_course ? "text-green-400 hover:text-green-600" : "text-orange-400 hover:text-orange-600"} text-md mr-4 cursor-pointer`}
              >
                {node.is_course ? "課程" : "群組"}
              </div>
              {isFrist ? (
                <div className="w-8 h-5 sm:mx-2" />
              ) : (
                <span
                  className="mx-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => courseSetting(node.course_name, node.id, "PUT", setOpen, setInfo, setTreeData)}
                >
                  設定
                </span>
                // <Cog6ToothIcon
                //   className="w-8 sm:mx-2 text-gray-500 cursor-pointer"
                //   onClick={() => courseSetting(node.course_name, node.id, "PUT", setOpen, setInfo, setTreeData)}
                // />
              )}
              <span
                className="mx-1 text-blue-400 hover:text-blue-600 cursor-pointer"
                onClick={() => courseSetting(node.course_name, node.course_no, "POST", setOpen, setInfo, setTreeData)}
              >
                新增
              </span>

              {/* <PlusCircleIcon
                className="w-8 sm:mx-2 text-green-500 cursor-pointer"
                onClick={() => courseSetting(node.course_name, node.course_no, "POST", setOpen, setInfo, setTreeData)}
              /> */}
              <span
                className={`${node.is_visable ? "text-pink-400 hover:text-pink-600" : "text-green-400 hover:text-green-600"} mx-1 cursor-pointer`}
                onClick={() => courseSwitch(node.id, !node.is_visable, setInfo, setTreeData)}
              >
                {node.is_visable ? "關閉" : "開啟"}
              </span>
              {/* {node.is_visable ? (
                <NoSymbolIcon
                  className="w-8 sm:mx-2 text-red-500 cursor-pointer"
                  onClick={() => courseSwitch(node.id, false, setInfo, setTreeData)}
                />
              ) : (
                <CheckCircleIcon
                  className="w-8 sm:mx-2 text-green-500 cursor-pointer"
                  onClick={() => courseSwitch(node.id, true, setInfo, setTreeData)}
                />
              )} */}
              {/* <XCircleIcon
                className="w-8 sm:mx-2 text-red-500 cursor-pointer"
                onClick={() => courseDelete(node.id, setInfo, setTreeData)}
              /> */}
            </div>
          </div>
        </div>

        {node.children_node_list.length > 0 && isOpen && node.children_node_list && (
          <ul
            role="list"
            className="divide-y"
          >
            {node.children_node_list.length > 0 &&
              node.children_node_list.map((child, index) => (
                <TreeNode
                  key={index}
                  node={child}
                  isFrist={false}
                  setOpen={setOpen}
                  setInfo={setInfo}
                  color={color}
                  setTreeData={setTreeData}
                />
              ))}
          </ul>
        )}
      </li>
    );
  };

  const TreeView = ({ data, setOpen, setInfo, setTreeData }) => {
    return (
      <ul
        role="list"
        className="divide-y"
      >
        {data.map((node, index) => (
          <TreeNode
            key={index}
            node={node}
            isFrist={true}
            setOpen={setOpen}
            setInfo={setInfo}
            setTreeData={setTreeData}
          />
        ))}
      </ul>
    );
  };

  useEffect(() => {
    getCoursesList();
  }, []);

  return (
    <>
      <Tree
        open={open}
        setOpen={setOpen}
      />
      <TreeView
        data={treeData}
        setOpen={setOpen}
        setInfo={setInfo}
        setTreeData={setTreeData}
      />
    </>
  );
}
