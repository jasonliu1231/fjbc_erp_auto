"use client";

import { XCircleIcon, CheckCircleIcon, Cog6ToothIcon } from "@heroicons/react/20/solid";
import Dialog from "./dialog";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ items, setItems, setInfo }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function dialogItem(index) {
    setIndex(index);
    setOpen(true);
  }

  return (
    <>
      <Dialog
        items={items}
        setItems={setItems}
        index={index}
        open={open}
        setOpen={setOpen}
        setInfo={setInfo}
      />
      <ul
        role="list"
        className="space-y-3"
        id="sortable-list"
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className={item.is_active ? "cursor-ns-resize overflow-hidden rounded-md px-6 py-4 shadow hover:bg-white bg-green-100" : "cursor-ns-resize overflow-hidden rounded-md px-6 py-4 shadow hover:bg-white bg-red-100"}
          >
            <input
              type="hidden"
              className="infoSrcId"
              value={item.id}
            />
            <div className="flex justify-between w-full">
              <div className="w-1/4">
                {item.is_active ? (
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-green-400"
                  />
                ) : (
                  <XCircleIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-red-400"
                  />
                )}
              </div>
              <div className="w-1/4">{index + 1}</div>
              <div className="w-1/4">{item.info_name}</div>
              <div
                className="w-1/4 flex justify-center items-center"
                id="item.id"
              >
                <Cog6ToothIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    dialogItem(index);
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
