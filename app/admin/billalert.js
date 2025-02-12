"use client";

import { ExclamationTriangleIcon, BellIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function Example() {
  const [purchase, setPurchase] = useState();
  const [ask, setAsk] = useState();
  const [meal, setMeal] = useState();
  const [reply, setReply] = useState();
  const [makeup, setMakeup] = useState();
  const [message, setMessage] = useState();
  const [invoice, setInvoice] = useState([]);

  async function getAlert() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/alert/bill`, config);
    const res = await response.json();
    if (response.ok) {
      setPurchase(res.purchase);
      setAsk(res.preparation);
      setInvoice(res.invoice);
      setMeal(res.meal);
      setReply(res.reply);
      setMakeup(res.makeup);
      setMessage(res.message);
    }
  }

  useEffect(() => {
    getAlert();
    setInterval(() => {
      getAlert();
    }, 10 * 60 * 1000);
  }, []);

  return (
    <>
      {message > 0 && (
        <a
          href="/admin/message"
          className="mx-2 text-sm font-semibold leading-6 text-gray-900 flex items-center hover:border-b-2"
        >
          <BellIcon className="text-teal-600 w-5 h-5 bell" />
          <span className="mx-1">未讀</span>
          <div className="w-5 h-5 bg-red-500 text-gray-200 text-center text-sm rounded-full">{message}</div>
        </a>
      )}
      {makeup > 0 && (
        <a
          href="/admin/makeup"
          className="mx-2 text-sm font-semibold leading-6 text-gray-900 flex items-center hover:border-b-2"
        >
          <BellIcon className="text-orange-600 w-5 h-5 bell" />
          <span className="mx-1">課輔</span>
          <div className="w-5 h-5 bg-red-500 text-gray-200 text-center text-sm rounded-full">{makeup}</div>
        </a>
      )}
      {reply > 0 && (
        <a
          href="/admin/contactbook"
          className="mx-2 text-sm font-semibold leading-6 text-gray-900 flex items-center hover:border-b-2"
        >
          <BellIcon className="text-red-600 w-5 h-5 bell" />
          <span className="mx-1">聯絡簿</span>
          <div className="w-5 h-5 bg-red-500 text-gray-200 text-center text-sm rounded-full">{reply}</div>
        </a>
      )}
      {purchase > 0 && (
        <a
          href="/admin/purchase"
          className="mx-2 text-sm font-semibold leading-6 text-gray-900 flex items-center hover:border-b-2"
        >
          <BellIcon className="text-yellow-600 w-5 h-5 bell" />
          <span className="mx-1">採購</span>
          <div className="w-5 h-5 bg-red-500 text-gray-200 text-center text-sm rounded-full">{purchase}</div>
        </a>
      )}
      {ask > 0 && (
        <a
          href="/admin/preparation"
          className="mx-2 text-sm font-semibold leading-6 text-gray-900 flex items-center hover:border-b-2"
        >
          <BellIcon className="text-pink-600 w-5 h-5 bell" />
          <span className="mx-1">問班</span>
          <div className="w-5 h-5 bg-red-500 text-gray-200 text-center text-sm rounded-full">{ask}</div>
        </a>
      )}
      {invoice > 0 && (
        <a
          href="/admin/payment"
          className="mx-2 text-sm font-semibold leading-6 text-gray-900 flex items-center hover:border-b-2"
        >
          <BellIcon className="text-purple-600 w-5 h-5 bell" />
          <span className="mx-1">遲繳</span>
          <div className="w-5 h-5 bg-red-500 text-gray-200 text-center text-sm rounded-full">{invoice}</div>
        </a>
      )}
      {meal > 0 && (
        <a
          href="/admin/meal"
          className="mx-2 text-sm font-semibold leading-6 text-gray-900 flex items-center hover:border-b-2"
        >
          <BellIcon className="text-blue-600 w-5 h-5 bell" />
          <span className="mx-1">餐費</span>
          <div className="w-5 h-5 bg-red-500 text-gray-200 text-center text-sm rounded-full">{meal}</div>
        </a>
      )}
    </>
  );
}
