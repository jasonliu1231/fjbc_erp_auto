"use client";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Navbar from "../../navbar";

// 文字格式金額
function changeStr(value) {
  const arr = value.toString().split("").reverse();
  let str = " 元整";
  for (let i = 0; i < arr.length; i++) {
    const s = arr[i];
    switch (s) {
      case "0":
        str = " 零" + str;
        break;
      case "1":
        str = " 壹" + str;
        break;
      case "2":
        str = " 貳" + str;
        break;
      case "3":
        str = " 參" + str;
        break;
      case "4":
        str = " 肆" + str;
        break;
      case "5":
        str = " 伍" + str;
        break;
      case "6":
        str = " 陸" + str;
        break;
      case "7":
        str = " 柒" + str;
        break;
      case "8":
        str = " 捌" + str;
        break;
      case "9":
        str = " 玖" + str;
        break;
    }
    if (i + 1 < arr.length) {
      switch (i) {
        case 0:
          str = " 拾" + str;
          break;
        case 1:
          str = " 佰" + str;
          break;
        case 2:
          str = " 仟" + str;
          break;
        case 3:
          str = " 萬" + str;
          break;
        case 4:
          str = " 拾" + str;
          break;
        case 5:
          str = " 佰" + str;
          break;
        case 6:
          str = " 仟" + str;
          break;
        case 7:
          str = " 億" + str;
          break;
        case 8:
          str = " 拾" + str;
          break;
      }
    }
  }
  return str;
}

export default function Home() {
  const [data, setData] = useState();
  // 使用 useRef 來引用要截圖的 DOM 元素
  const captureRef = useRef(null);
  // 截圖並複製到剪貼板
  // const takeScreenshot = async () => {
  //   const captureElement = captureRef.current;

  //   try {
  //     // 使用 html2canvas 截圖
  //     const canvas = await html2canvas(captureElement);
  //     const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

  //     // 確認瀏覽器支持 Clipboard API
  //     if (navigator.clipboard && navigator.clipboard.write) {
  //       // 使用 Clipboard API 將圖像寫入剪貼板
  //       await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

  //       alert("圖片已成功複製！你可以在其他應用中直接使用 Ctrl+V。");
  //     } else {
  //       alert("你的瀏覽器不支持，無法將圖片複製。");
  //     }
  //   } catch (error) {
  //     console.error("截圖或複製失敗：", error);
  //     alert("截圖或複製失敗，請檢查控制台日誌以獲取更多資訊。");
  //   }
  // };

  const takeScreenshot = async () => {
    const captureElement = captureRef.current;

    try {
      // 使用 html2canvas 截圖
      const canvas = await html2canvas(captureElement);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

      // 創建下載鏈接
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.student_name}.png`;
      a.click();

      // 釋放 URL 對象
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("截圖或下載失敗：", error);
      alert("截圖或下載失敗，請檢查控制台日誌以獲取更多資訊。");
    }
  };

  function invoiceData(data) {
    // ＴＯＤＯ：收費日期
    const handlerDate = new Date();
    let subjectAmount = 0;
    // 學費
    data.invoice_detail_list.forEach((item) => {
      subjectAmount += item.money;
    });
    let total = subjectAmount + data.meal + data.textbook + data.transportation - data.deposit - data.discount - data.coupon;
    const invoiceData = {
      // 補習班 id 用於替換圖章
      tutoring_id: data.tutoring.id,
      // 補習班地址
      tutoring_address: data.tutoring.address,
      // 補習班電話
      tutoring_tel: data.tutoring.tel,
      // 補習班立案名稱
      tutoring_registration_name: data.tutoring.registration_name,
      // 補習班立案字號
      tutoring_registration_no: data.tutoring.registration_no,
      // 今天日期
      dateStr: `${handlerDate.getFullYear() - 1911} 年 ${handlerDate.getMonth() + 1} 月 ${handlerDate.getDate()} 日`,
      // 學生中文名稱
      student_name: data.student.user.first_name,
      // 學生英文名稱
      student_english_name: data.student.user.nick_name,
      // 學年度
      schoolYear: data.school_year,
      // 繳費月份
      start_month: data.start_month,
      end_month: data.end_month,
      // 折扣金額
      discount: Number(data.discount) || 0,
      // 訂金折抵
      cutDeposit: Number(data.deposit) || 0,
      // 餐費
      meal: Number(data.meal) || 0,
      // 教材費
      textbook: Number(data.textbook) || 0,
      // 交通費
      transportation: Number(data.transportation) || 0,
      // 交通費
      coupon: Number(data.coupon) || 0,
      // 備註
      remark: data.remark,
      // 經收人
      manager: data.handler.first_name,
      // 課程
      subject: data.invoice_detail_list?.map((i) => i.name).join(", "),
      // 學費
      subject_amount: subjectAmount,
      // 小計
      amount: total,
      // 小計中文
      chinese_amount: changeStr(total)
    };

    setData(invoiceData);
  }

  function depositData(data) {
    const created_at = new Date(data.created_at);
    const depositData = {
      // 補習班 id 用於替換圖章
      tutoring_id: data.tutoring.id,
      // 補習班地址
      tutoring_address: data.tutoring.address,
      // 補習班電話
      tutoring_tel: data.tutoring.tel,
      // 補習班立案名稱
      tutoring_registration_name: data.tutoring.registration_name,
      // 補習班立案字號
      tutoring_registration_no: data.tutoring.registration_no,
      // 今天日期
      dateStr: `${created_at.getFullYear() - 1911} 年 ${created_at.getMonth() + 1} 月 ${created_at.getDate()} 日`,
      // 學生中文名稱
      student_name: data.student.user.first_name,
      // 學生英文名稱
      student_english_name: data.student.user.nick_name,
      // 訂金
      deposit: Number(data.deposit) || 0,
      // 備註
      remark: data.remark,
      // 經收人
      manager: data.creator.first_name,
      // 小計
      amount: Number(data.deposit) || 0,
      // 小計中文
      chinese_amount: changeStr(data.deposit)
    };

    setData(depositData);
  }

  async function getInvoice(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/invoice/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      invoiceData(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getDeposit(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/student/deposit/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      depositData(res);
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
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const type = params.get("type");
    const id = params.get("id");
    if (type == 1) {
      getInvoice(id);
    } else if (type == 2) {
      getDeposit(id);
    }
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <div className="container mx-auto p-2 sm:p-4">
        <div>
          <button
            onClick={takeScreenshot}
            type="button"
            className="mb-5 rounded-full hover:bg-blue-400 px-3 py-1.5 text-lg font-semibold hover:text-gray-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-blue-200"
          >
            下載
          </button>
          <div ref={captureRef}>
            <div className="bg-white p-3">
              <div className="text-center text-2xl">{data?.tutoring_registration_name || ""}</div>
              <div className="text-center text-lg relative">
                <div>第二聯：學生收執聯</div>
                <div className="border-2 border-gray-900 px-3 py-1 absolute top-0 right-1">收費收據</div>
              </div>
              <div className="text-center text-lg mt-5">{data?.tutoring_registration_no || ""}</div>
              <div className="text-lg flex justify-center">
                <div className="mx-5">地址：{data?.tutoring_address || ""}</div>
                <div className="mx-5">電話：{data?.tutoring_tel || ""}</div>
              </div>
              {data?.schoolYear && data?.start_month && data?.end_month && (
                <div className="text-2xl flex justify-center">
                  {`${data?.schoolYear || ""} 學年度 ${data?.start_month == data?.end_month ? `${data?.start_month}` : `${data?.start_month} ~ ${data?.end_month}`} 月學費明細`}
                </div>
              )}

              <div className="text-lg flex justify-between mt-5">
                <div className="mx-5">姓名：{data?.student_name || data?.student_english_name}</div>
                <div className="mx-5">收費日期：{data?.dateStr || ""}</div>
              </div>
              <table className="w-full mt-2">
                <tbody>
                  <tr className="border-2 border-gray-900">
                    <th
                      scope="col"
                      colSpan={8}
                      className="p-3 text-left font-semibold text-gray-900"
                    >
                      課程：{data?.subject || ""}
                    </th>
                  </tr>
                  <tr className="font-semibold text-gray-900 text-center">
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      項目
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      金額
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      項目
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      金額
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      學費
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      {data?.subject_amount != 0 ? data?.subject_amount : ""}
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      餐費
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      {data?.meal != 0 ? data?.meal : ""}
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      教材費
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      {data?.textbook != 0 ? data?.textbook : ""}
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      交通費
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      {data?.transportation != 0 ? data?.transportation : ""}
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      訂金
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      {data?.deposit != 0 ? data?.deposit : ""}
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      訂金折抵
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900 text-red-500"
                    >
                      {data?.cutDeposit > 0 ? `- ${data?.cutDeposit}` : ""}
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      折扣 / 折抵
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900 text-red-500"
                    >
                      {data?.discount > 0 ? `- ${data?.discount}` : ""}
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900"
                    >
                      優惠券
                    </th>
                    <th
                      colSpan={2}
                      className="p-3 w-1/4 border-2 border-gray-900 text-red-500"
                    >
                      {data?.coupon > 0 ? `- ${data?.coupon}` : ""}
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th
                      colSpan={1}
                      className="p-3 border-2 border-gray-900"
                    >
                      NT.小計
                    </th>
                    <th
                      colSpan={7}
                      className="p-3 border-2 border-gray-900 text-left"
                    >
                      {data?.amount != 0 ? data?.amount : ""} 元整
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th
                      colSpan={1}
                      className="p-3 border-2 border-gray-900"
                    >
                      實收金額
                    </th>
                    <th
                      colSpan={7}
                      className="p-3 border-2 border-gray-900 text-left"
                    >
                      新台幣：
                      {data?.amount != 0 ? data?.chinese_amount : ""}
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th
                      colSpan={8}
                      className="p-3 border-2 border-gray-900 text-left whitespace-pre-line"
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: data?.remark }}
                        className="mt-2 prose"
                      />
                    </th>
                  </tr>
                  <tr className="text-left text-sm">
                    <th
                      colSpan={8}
                      className="p-3 border-2 border-gray-900 relative"
                    >
                      {data?.tutoring_id == 1 ? (
                        <img
                          src="/invoice1.png"
                          className="absolute top-12 right-24"
                          width={300}
                        />
                      ) : data?.tutoring_id == 2 ? (
                        <img
                          src="/invoice2.png"
                          className="absolute top-12 right-24"
                          width={300}
                        />
                      ) : data?.tutoring_id == 3 ? (
                        <img
                          src="/invoice3.png"
                          className="absolute top-12 right-24"
                          width={300}
                        />
                      ) : (
                        ""
                      )}

                      <div>
                        <p>退費說明：</p>
                        <p>短期補習班設立及管理準則第 23 條</p>
                        <p>補習班收取費用，應掣給正式收據，且不得以任何理由要求學生繳回收據收執聯。</p>
                        <p>前項收據，應載明補習班名稱、班址、立案證號、修業期間、收費項目、各項金額、總額及退費規定。</p>
                        <p>台中市短期補習班管理規則第 36 條第 1 項</p>
                        <p>補習班學生繳納費用後離班者，補習班應依下列規定辦理退費：</p>
                        <p>一、學生於開課日三十日前提出退費申請者，退還當期開班約定繳納費用總額百分之九十五，惟補習班所收取之百分之五部分最高不得超過新臺幣一千元。</p>
                        <p>二、學生於開課日前三十日內提出退費申請者，退還當期開班約定繳納費用總額百分之九十。</p>
                        <p>三、學生於實際開課日起至第十日前，且未逾全期（或總課程時數）三分之一期間內提出退費申請者，退還當期開班約定繳納費用總額百分之八十。</p>
                        <p>四、學生於實際開課日第十日起且未逾全期（或總課程時數）三分之一期間內提出退費申請者，退還約定繳納費用百分之六十。</p>
                        <p>五、學生於全期（或總課程時數）三分之一以上且未逾全期(或總課程時數)二分之一期間內提出退費申請者，退還約定繳納費用百分之四十。</p>
                        <p>六、學生於全期（或總課程時數）二分之一以上提出退費申請者，所收取之當期費用得全數不予退還。</p>
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2">※學生及家長對本次收費之折扣內容(包含但不限於項目、金額)具保密義務，非經本補習班同意不得任意洩露給第三人。</div>
              <div className="flex">
                <div className="w-1/4">班主任：</div>
                <div className="w-1/4">會計：</div>
                <div className="w-1/4">出納：</div>
                <div className="w-1/4">經收人：{data?.manager || ""}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
