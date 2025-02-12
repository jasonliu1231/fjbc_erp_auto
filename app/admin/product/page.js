"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import Prize from "./prize";
import Product from "./product";

const tabs = [
  { id: 1, name: "商品" },
  { id: 2, name: "獎品" }
];

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [state, setState] = useState(1);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  setState(tab.id);
                }}
                className={`${
                  state == tab.id ? "border-blue-500 text-blue-600" : "text-gray-500 hover:border-blue-300 hover:text-blue-700"
                } w-full border-b-2 px-1 py-3 text-center text-md font-medium cursor-pointer`}
              >
                {tab.name}
              </div>
            ))}
          </nav>
        </div>
        {state == 1 && <Product setInfo={setInfo} />}
        {state == 2 && <Prize setInfo={setInfo} />}
      </div>
    </>
  );
}
