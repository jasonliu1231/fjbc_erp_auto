import { useEffect, useRef, useState } from "react";
import { SchoolMonth, UnitSelect, SubjectSelect } from "./select";

export default function Example({ data }) {
  const { invoiceList, setInvoiceList, invoice } = data;
  const [unitprice, setUnitprice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  return (
    <></>
  );
}
