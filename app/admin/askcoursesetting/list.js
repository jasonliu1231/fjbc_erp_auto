"use client";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ items, id }) {
  return (
    <>
      <ul
        role="list"
        className="space-y-3 border-2 p-1 sm:p-3"
        style={{minHeight: '75vh'}}
        id={id}
      >
        {items.length > 0 &&
          items.map((item, index) => (
            <li
              key={index}
              className={item.color ? "cursor-move overflow-hidden rounded-md p-1 sm:px-6 sm:py-4 shadow hover:opacity-50" : "cursor-move overflow-hidden rounded-md bg-white p-1 sm:px-6 sm:py-4 shadow hover:opacity-50"}
              style={
                item.color
                  ? {
                      backgroundColor: item.color
                    }
                  : {}
              }
            >
              <input
                type="hidden"
                className="course_no"
                value={item.course_no}
              />
              <div className="sm:flex justify-between w-full">
                <div className="sm:w-1/2 text-gray-500 test-sm">{item.course_no}</div>
                <div className="sm:w-1/2 text-xl">{item.course_name}</div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
