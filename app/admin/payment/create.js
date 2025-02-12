"use client";

import { useState } from "react";
import { ClipboardDocumentListIcon, CurrencyDollarIcon } from "@heroicons/react/20/solid";
import Createinvoice from "./createinvoice";
import Createdeposit from "./createdeposit";

export default function Example({ setInfo }) {
  const [isInvoice, setIsInvoice] = useState(true);
  return (
    <>
      <span className="isolate inline-flex rounded-md shadow-sm mb-3">
        <button
          onClick={() => {
            setIsInvoice(false);
          }}
          type="button"
          className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          <CurrencyDollarIcon className="w-5 h-5" />
          訂金/優惠券
        </button>
        <button
          onClick={() => {
            setIsInvoice(true);
          }}
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
          明細
        </button>
      </span>
      {isInvoice ? <Createinvoice setInfo={setInfo} /> : <Createdeposit setInfo={setInfo} />}
    </>
  );
}
