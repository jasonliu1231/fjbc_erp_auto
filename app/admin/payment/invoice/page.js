"use client";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

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

  function dataTidy(data) {
    const date = new Date(data.deadline);
    let subjectAmount = 0;
    // 學費
    data.invoice_detail_list.forEach((item) => {
      subjectAmount += item.money;
    });
    const invoiceData = {
      // 補習班 id 用於替換圖章
      tutoring_id: data.tutoring.id,
      // 補習班名稱
      tutoring_name: data.tutoring.tutoring_name,
      // 學生中文名稱
      student_name: data.student.user.first_name,
      // 學生英文名稱
      student_english_name: data.student.user.nick_name,
      // 學生年級
      student_grade: data.student.grade?.grade_name || "",
      // 學年度
      schoolYear: data.school_year,
      // 繳費月份
      start_month: data.start_month,
      end_month: data.end_month,
      // 折扣金額
      discount: Number(data.discount) || 0,
      // 訂金
      deposit: Number(data.deposit) || 0,
      // 餐費
      meal: Number(data.meal) || 0,
      // 教材費
      textbook: Number(data.textbook) || 0,
      // 交通費
      transportation: Number(data.transportation) || 0,
      // 優惠券
      coupon: Number(data.coupon) || 0,
      // 繳費期限
      deadline: `${date.getFullYear() - 1911} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`,
      // 備註
      remark: data.remark,
      // 小計
      amount: subjectAmount + data.meal + data.textbook + data.transportation - data.deposit - data.discount - data.coupon,
      // 合併欄位數量
      len: data.invoice_detail_list.length,
      // 係項陣列
      subjects: data.invoice_detail_list
    };

    setData(invoiceData);
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
      dataTidy(res);
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
    const id = params.get("id");
    getInvoice(id);
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

          <table
            ref={captureRef}
            className="p-3 bg-white border-2 border-gray-900"
          >
            <thead>
              <tr className="relative border-2 border-gray-900">
                <th
                  scope="col"
                  colSpan={12}
                  className="px-3 py-12 text-left text-xl font-semibold text-gray-900 text-center"
                >
                  {data?.tutoring_name}
                  {data?.tutoring_id == 1 ? (
                    <img
                      alt=""
                      src="/doyi.png"
                      className="w-32 absolute top-1 right-1"
                    />
                  ) : data?.tutoring_id == 2 ? (
                    <img
                      alt=""
                      src="/funapple2.png"
                      className="w-36 absolute top-1 right-1"
                    />
                  ) : data?.tutoring_id == 3 ? (
                    <img
                      alt=""
                      src="/funapple2.png"
                      className="w-36 absolute top-1 right-1"
                    />
                  ) : (
                    ""
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className=" border-2 border-gray-900">
                <td
                  colSpan={12}
                  className="whitespace-nowrap p-3 text-xl font-medium text-gray-900 text-center"
                >
                  {`${data?.schoolYear || ""} 學年度 ${data?.start_month == data?.end_month ? `${data?.start_month}` : `${data?.start_month} ~ ${data?.end_month}`} 月學費明細`}
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  中文名稱
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  英文名稱
                </td>
                <td
                  colSpan={1}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  年級
                </td>
                <td
                  colSpan={6}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  <span className="text-red-600">* </span>請於 {data?.deadline} 前繳款
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-500 border-2 border-gray-900"
                >
                  {data?.student_name}
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-gray-500 border-2 border-gray-900"
                >
                  {data?.student_english_name}
                </td>
                <td
                  colSpan={1}
                  className="whitespace-nowrap p-2 text-lg text-gray-500 border-2 border-gray-900"
                >
                  {data?.student_grade}
                </td>
                <td
                  colSpan={6}
                  className="whitespace-nowrap p-2 text-lg text-gray-500 border-2 border-gray-900"
                >
                  <p>＊此為學費明細，並非正式學費收據＊</p>
                  <p>為響應環保，本校採無紙化中</p>
                  <p>如需紙本收據，請另外和櫃檯老師諮詢。</p>
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  科目
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  金額
                </td>
                <td
                  colSpan={7}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  備註
                </td>
              </tr>
              {/* 浮動項目 */}
              {data?.subjects.map((subject, index) => {
                if (index == 0) {
                  return (
                    <tr
                      className="text-center"
                      key={index}
                    >
                      <td
                        colSpan={3}
                        className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                      >
                        {subject.name}
                      </td>
                      <td
                        colSpan={2}
                        className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                      >
                        {subject.money}
                      </td>
                      <td
                        colSpan={7}
                        rowSpan={data?.len}
                        className="divide-y divide-white p-2 text-lg text-gray-900 text-start align-top border-2 border-gray-900 text-left whitespace-pre-line"
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: data?.remark }}
                          className="mt-2 prose"
                        />
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr
                      className="text-center"
                      key={index}
                    >
                      <td
                        colSpan={3}
                        className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                      >
                        {subject.name}
                      </td>
                      <td
                        colSpan={2}
                        className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                      >
                        {subject.money}
                      </td>
                    </tr>
                  );
                }
              })}
              {/* 固定欄位 */}
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  {data?.textbook > 0 && "教材費"}
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  {data?.textbook > 0 && data?.textbook}
                </td>
                <td
                  colSpan={7}
                  rowSpan={6}
                  className=" p-2 text-lg text-gray-900 text-start align-top border-2 border-gray-900"
                >
                  <p>
                    <span className="text-red-600">* </span>如因個人因素無法接續完成課程，相關的退費方法皆以台中市教育局規定結算處理。
                  </p>
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  {data?.transportation > 0 && "交通費"}
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  {data?.transportation > 0 && data?.transportation}
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  {data?.meal > 0 && "餐費"}
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  {data?.meal > 0 && data?.meal}
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  {data?.discount > 0 && "優惠折抵"}
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-red-500 border-2 border-gray-900"
                >
                  {data?.discount > 0 && `- ${data?.discount}`}
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  {data?.coupon > 0 && "勵學券"}
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-red-500 border-2 border-gray-900"
                >
                  {data?.coupon > 0 && `- ${data?.coupon}`}
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  {data?.deposit > 0 && "訂金折抵"}
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-red-500 border-2 border-gray-900"
                >
                  {data?.deposit > 0 && `- ${data?.deposit}`}
                </td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={5}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                ></td>
                <td
                  colSpan={5}
                  rowSpan={2}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                ></td>
              </tr>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="whitespace-nowrap p-2 text-lg font-medium text-gray-900 border-2 border-gray-900"
                >
                  共計
                </td>
                <td
                  colSpan={2}
                  className="whitespace-nowrap p-2 text-lg text-gray-900 border-2 border-gray-900"
                >
                  {data?.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
