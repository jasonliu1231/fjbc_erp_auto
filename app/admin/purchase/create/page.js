"use client";

import { useState, useEffect, useRef } from "react";
import { error, notificationType } from "../../../utils";
import Alert from "../../alert";

const def = {
  name: "",
  quantity: 0,
  unit: "",
  specification: "",
  price: 0,
  remark: ""
};

const tutoring = [
  { id: 1, name: "多易" },
  { id: 2, name: "艾思" },
  { id: 3, name: "華而敦" }
];

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const sendData = useRef({});
  const [productList, setProductsList] = useState([def]);

  async function send() {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: localStorage.getItem("user_id")
      },
      body: JSON.stringify(sendData.current)
    };
    const response = await fetch(`/api/purchase`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "申請完成!"
      });
      await notificationType({
        type: 1,
        title: "採購單初審",
        message: `${sendData.current.className} 申請採購！`
      });
      window.location.href = "/admin/purchase";
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function submit() {
    if (!sendData.current.tutoringid) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇補習班"
      });
      return;
    }
    if (!sendData.current.className) {
      setInfo({
        show: true,
        success: false,
        msg: "請輸入班級"
      });
      return;
    }
    if (!sendData.current.deadline) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇期限"
      });
      return;
    }
    if (!sendData.current.reason) {
      setInfo({
        show: true,
        success: false,
        msg: "請輸入用途"
      });
      return;
    }
    let products = productList.filter((i) => !(i.name == "" && i.quantity == 0 && i.specification == ""));
    if (products.length == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請輸入至少一筆商品"
      });
      return;
    }
    products.forEach((i) => {
      if (i.name == "" || i.quantity == 0 || i.specification == "") {
        setInfo({
          show: true,
          success: false,
          msg: "商品名稱、數量、規格有空白"
        });
        return;
      }
    });

    sendData.current.products = products;
    send();
  }

  function setProducts(val, i) {
    const list = productList.map((origin, index) => {
      if (i == index) {
        return val;
      } else {
        return origin;
      }
    });
    setProductsList(list);
  }

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto">
        <div
          onClick={() => {
            window.history.back();
          }}
          className="top-0 m-2 absolute border-2 border-blue-400 rounded-md"
        >
          <span className="text-blue-400 font-medium px-2 py-1">←</span>
        </div>
        <div className="mt-12 text-xl text-gray-900 font-semibold">
          採購申請單<div className="text-sm">Purchase Order</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 bg-white px-4 py-2 rounded-lg">
          <div className="col-span-1">
            <label className="block font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
              使用補習班<span className="text-gray-500">(Tutoring Centers)</span>
            </label>
            <select
              onChange={(event) => {
                sendData.current.tutoringid = event.target.value;
              }}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
            >
              <option>請選擇單位</option>
              {tutoring.map((i) => (
                <option
                  key={i.id}
                  value={i.id}
                >
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
              班級<span className="text-gray-500">(Class)</span>
            </label>
            <div>
              <input
                onChange={(event) => {
                  sendData.current.className = event.target.value;
                }}
                placeholder="Please enter the class name."
                type="text"
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
              需求日期<span className="text-gray-500">(Deadline)</span>
            </label>
            <div>
              <input
                onChange={(event) => {
                  sendData.current.deadline = event.target.value;
                }}
                type="date"
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
              請購理由<span className="text-gray-500">(Reason)</span>
            </label>
            <div>
              <input
                onChange={(event) => {
                  sendData.current.reason = event.target.value;
                }}
                placeholder="Please enter the reason."
                type="text"
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
              商品<span className="text-gray-500">(Product)</span>
              <span
                onClick={() => {
                  console.log(productList);
                  productList.forEach((item) => {
                    if (item.name == "") {
                      setInfo({
                        show: true,
                        success: false,
                        msg: "有商品名稱是空白"
                      });
                    } else if (item.quantity == 0) {
                      setInfo({
                        show: true,
                        success: false,
                        msg: "有數量為 0"
                      });
                    } else if (item.specification == "") {
                      setInfo({
                        show: true,
                        success: false,
                        msg: "請說明規格"
                      });
                    } else {
                      setProductsList([...productList, def]);
                    }
                  });
                }}
                className="text-green-600 ring-2 ring-inset ring-green-300 ml-4 px-2 py-1 rounded-md"
              >
                新增(Add)
              </span>
            </label>

            {productList.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 mt-2"
              >
                <div className="col-span-2">
                  <label className="block text-sm font-medium leading-6 text-red-500">商品名稱</label>
                  <div>
                    <input
                      value={item.name}
                      onChange={(event) => {
                        setProductsList((prevList) => prevList.map((ii, j) => (j === index ? { ...ii, name: event.target.value } : ii)));
                      }}
                      placeholder="品名(name)"
                      type="text"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-red-500">數量</label>
                  <div>
                    <input
                      value={item.quantity}
                      onChange={(event) => {
                        setProductsList((prevList) => prevList.map((ii, j) => (j === index ? { ...ii, quantity: event.target.value } : ii)));
                      }}
                      placeholder="需求數(quantity)"
                      type="number"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">單位</label>
                  <div>
                    <input
                      value={item.unit}
                      onChange={(event) => {
                        setProductsList((prevList) => prevList.map((ii, j) => (j === index ? { ...ii, unit: event.target.value } : ii)));
                      }}
                      placeholder="EX:張、本、支"
                      type="text"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium leading-6 text-red-500">規格</label>
                  <div>
                    <input
                      value={item.specification}
                      onChange={(event) => {
                        setProductsList((prevList) => prevList.map((ii, j) => (j === index ? { ...ii, specification: event.target.value } : ii)));
                      }}
                      placeholder="物品大小、版本、品牌"
                      type="text"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">單價</label>
                  <div>
                    <input
                      value={item.price}
                      onChange={(event) => {
                        setProductsList((prevList) => prevList.map((ii, j) => (j === index ? { ...ii, price: event.target.value } : ii)));
                      }}
                      placeholder="NT"
                      type="number"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">備註</label>
                  <div>
                    <input
                      value={item.remark}
                      onChange={(event) => {
                        setProductsList((prevList) => prevList.map((ii, j) => (j === index ? { ...ii, remark: event.target.value } : ii)));
                      }}
                      placeholder="如有教師用書請額外備註"
                      type="text"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-4 flex justify-center mt-12">
            <span className="isolate inline-flex rounded-md shadow-sm">
              <button
                onClick={submit}
                type="button"
                className="rounded-md bg-green-600 px-2.5 py-1.5 text-md font-semibold text-white shadow-sm"
              >
                送出<span className="text-gray-300">(Submit)</span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
