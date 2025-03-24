"use client";

import { useState } from "react";
import { Input, Radio, Checkbox, School, Editor, Teacher } from "../component";
import { CheckCircleIcon, XCircleIcon, PlusCircleIcon, DocumentChartBarIcon, PhotoIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { error } from "../../../utils";
import Alert from "../../alert";

export default function Home() {
  const grade = ["國小一年級", "國小二年級", "國小三年級", "國小四年級", "國小五年級", "國小六年級", "國中一年級", "國中二年級", "國中三年級", "高中一年級", "高中二年級", "高中三年級"];
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [view, setView] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [autoOpen, setAutoOpen] = useState("");
  const [autoClose, setAutoClose] = useState("");

  const [schoolType, setSchoolType] = useState(1);
  const [schoolTypeStyle, setSchoolTypeStyle] = useState(true); // true 為預設，false 自訂
  const [schoolData, setSchoolData] = useState(["", "", "", "", "", ""]);

  const [gradeType, setGradeType] = useState(1);
  const [gradeTypeStyle, setGradeTypeStyle] = useState(true); // true 為預設，false 自訂
  const [gradeData, setGradeData] = useState(["", "", "", "", "", ""]);

  const [show, setShow] = useState([true, true, true, true, false, false, false, false, false, false, false]);
  // 客製化選項
  const [items, setItems] = useState([
    {
      show: false,
      title: "", // 標題
      type: 1, // 種類 1.輸入框 2.單選 3.複選
      content: ["", "", "", "", "", ""] // 單選與複選的內容
    }
  ]);
  const [imageUrl, setImageUrl] = useState("");

  function handleFileChange(event) {
    const file = event.target.files[0]; // 获取选中的文件
    if (file) {
      const reader = new FileReader(); // 创建 FileReader 来读取文件

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // 设置 canvas 宽高为图片的原始宽高
          canvas.width = img.width;
          canvas.height = img.height;

          // 将图片绘制到 canvas 上
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // 生成图片的 Data URL
          const originalImageUrl = canvas.toDataURL("image/jpeg");

          // 将图片的 Data URL 设置为状态
          setImageUrl(originalImageUrl);
        };
      };

      reader.readAsDataURL(file);
    }
  }

  const handleCheckboxChange = (index) => {
    const updatedShow = [...show]; // 复制当前的 show 数组
    updatedShow[index] = !updatedShow[index]; // 切换指定 index 的值
    setShow(updatedShow); // 更新状态
  };

  const handleItemsCheckboxChange = (index, val) => {
    const update = items.map((item, i) => {
      if (i == index) {
        return {
          ...item,
          show: val
        };
      } else {
        return item;
      }
    });
    setItems(update);
  };

  const handleItemsTitleChange = (index, val) => {
    const update = items.map((item, i) => {
      if (i == index) {
        return {
          ...item,
          title: val
        };
      } else {
        return item;
      }
    });
    setItems(update);
  };

  const handleItemsTypeChange = (index, val) => {
    const update = items.map((item, i) => {
      if (i == index) {
        return {
          ...item,
          type: Number(val)
        };
      } else {
        return item;
      }
    });
    setItems(update);
  };

  const handleItemsContentChange = (index1, index2, val) => {
    const update = items.map((item, i) => {
      if (i == index1) {
        return {
          ...item,
          content: item.content.map((item, i) => {
            if (i == index2) {
              return val;
            } else {
              return item;
            }
          })
        };
      } else {
        return item;
      }
    });
    setItems(update);
  };

  const handleItemsContentAdd = (index1) => {
    const update = items.map((item, i) => {
      if (i == index1) {
        return {
          ...item,
          content: [...item.content, ""]
        };
      } else {
        return item;
      }
    });
    console.log(update);
    setItems(update);
  };

  const handleSchoolContentChange = (index, val) => {
    const update = schoolData.map((item, i) => {
      if (i == index) {
        return val;
      } else {
        return item;
      }
    });
    setSchoolData(update);
  };

  const handleGradeContentChange = (index, val) => {
    const update = gradeData.map((item, i) => {
      if (i == index) {
        return val;
      } else {
        return item;
      }
    });
    setGradeData(update);
  };

  async function submit() {
    if (name.trim() == "") {
      alert("表單名稱不可以是空白！");
      return;
    }
    let itemsList = items.filter((i) => i.show);
    items.forEach((item, index) => {
      item.index = index;
      const uniqueItems = new Set(item.content.filter((i) => i != ""));
      item.content = [...uniqueItems];
    });
    if (itemsList.length == 0) {
      const check = confirm("目前沒有設定自訂欄位，是否要新增？");
      if (!check) {
        return;
      }
    }
    const data = {
      name: name,
      deadline: deadline,
      textarea: textareaValue,
      schooltype: show[4] ? schoolType : 0,
      schoolcontent: schoolType == 2 && !show[4] ? schoolData : null,
      gradetype: show[5] ? gradeType : 0,
      gradecontent: gradeType == 2 && !show[5] ? gradeData : null,
      banner: imageUrl,
      auto_open: autoOpen,
      auto_close: autoClose,
      items: itemsList
    };

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/create`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "新增完成！"
      });
      window.location.href = "/admin/activity/list";
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="flex justify-between my-2">
          <h1 className="text-lg flex items-center">{view ? "預覽畫面" : "畫面編輯"}</h1>
          <span className="isolate inline-flex">
            <button
              type="button"
              onClick={() => {
                setView(false);
              }}
              className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              編輯
            </button>
            <button
              type="button"
              onClick={() => {
                setView(true);
              }}
              className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              預覽
            </button>
          </span>
        </div>

        {view ? (
          <div className="max-w-2xl mx-auto">
            {imageUrl != "" && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full"
              />
            )}
            <div className="bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mb-28">
              {show[0] && (
                <div className="flex justify-center w-full col-span-1 sm:col-span-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: textareaValue }}
                    className="w-full editor"
                  />
                </div>
              )}
              {show[1] && (
                <div className="col-span-1">
                  <Input
                    label="學生姓名"
                    required={true}
                  />
                </div>
              )}
              {show[2] && (
                <div className="col-span-1">
                  <Input
                    label="家長姓名"
                    required={false}
                  />
                </div>
              )}
              {show[3] && (
                <div className="col-span-1">
                  <Input
                    label="聯絡電話"
                    required={false}
                  />
                </div>
              )}
              {show[4] && (
                <div className="col-span-1">
                  {schoolType == 1 ? (
                    <Input
                      label="學校"
                      required={false}
                    />
                  ) : schoolTypeStyle ? (
                    <School />
                  ) : (
                    <Radio
                      data={schoolData}
                      label="學校"
                    />
                  )}
                </div>
              )}
              {show[5] && (
                <div className="col-span-1">
                  {gradeType == 1 ? (
                    <Input
                      label="年級"
                      required={false}
                    />
                  ) : (
                    <Radio
                      data={gradeTypeStyle ? grade : gradeData}
                      label="年級"
                    />
                  )}
                </div>
              )}
              {items.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="col-span-1"
                  >
                    {item.type == 1 ? (
                      <Input label={item.title} />
                    ) : item.type == 2 ? (
                      <Radio
                        data={item.content}
                        label={item.title}
                      />
                    ) : (
                      <Checkbox
                        data={item.content}
                        label={item.title}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-md px-4">
            <div className="divide-y divide-gray-400">
              {/* 問卷名稱 */}
              <div className="grid grid-cols-12 grid-flow-row-dense gap-4 py-4 items-center">
                <div className="col-span-1">
                  <label className="block text-md font-medium text-red-500">表單名稱</label>
                </div>
                <div className="col-span-2">
                  <input
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    type="text"
                    placeholder="必填啊！！！"
                    className="px-2 py-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-md font-medium text-gray-500">期限</label>
                </div>
                <div className="col-span-2">
                  <input
                    value={deadline}
                    onChange={(event) => {
                      setDeadline(event.target.value);
                    }}
                    type="datetime-local"
                    className="px-2 py-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-md font-medium text-gray-500">自動開啟</label>
                </div>
                <div className="col-span-2">
                  <input
                    value={autoOpen}
                    onChange={(event) => {
                      setAutoOpen(event.target.value);
                    }}
                    type="date"
                    className="px-2 py-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-md font-medium text-gray-500">自動關閉</label>
                </div>
                <div className="col-span-2">
                  <input
                    value={autoClose}
                    onChange={(event) => {
                      setAutoClose(event.target.value);
                    }}
                    type="date"
                    className="px-2 py-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              {/* banner */}
              <div className="grid grid-cols-12 grid-flow-row-dense gap-4 py-4 items-center">
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    上方 Banner
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      {imageUrl != "" ? (
                        <div className="flex justify-center">
                          <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="h-20"
                          />
                        </div>
                      ) : (
                        <PhotoIcon
                          aria-hidden="true"
                          className="mx-auto h-12 w-12 text-gray-300"
                        />
                      )}
                      <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>上傳 Banner 圖片</span>
                          <input
                            onChange={handleFileChange}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>
                      <p className="text-xs leading-5 text-gray-600">建議圖面尺寸:1800x667px</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 主題 */}
              <div className="grid grid-cols-12 grid-flow-row-dense gap-4 py-2">
                <div className="col-span-1">
                  <input
                    disabled
                    type="checkbox"
                    checked={show[0]}
                    onChange={() => handleCheckboxChange(0)}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </div>
                <label className="font-medium text-gray-900 col-span-1">主題內容</label>
                <div className="text-sm leading-6 col-span-10">
                  <div className="">
                    <Editor
                      textareaValue={textareaValue}
                      setTextareaValue={setTextareaValue}
                    />
                  </div>
                </div>
              </div>
              {/* 姓名、家長、聯絡電話 */}
              <div className="grid grid-cols-12 grid-flow-row-dense gap-4 py-2">
                <div className="col-span-1">
                  <input
                    disabled
                    type="checkbox"
                    checked={show[1]}
                    onChange={() => handleCheckboxChange(1)}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </div>
                <div className="text-sm leading-6 col-span-2">
                  <label className="font-medium text-gray-900">學生姓名</label>
                  <p className="text-sm leading-6 text-gray-500">輸入框</p>
                </div>
                <div className="col-span-1">
                  <input
                    disabled
                    type="checkbox"
                    checked={show[2]}
                    onChange={() => handleCheckboxChange(2)}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </div>
                <div className="text-sm leading-6 col-span-2">
                  <label className="font-medium text-gray-900">家長</label>
                  <p className="text-sm leading-6 text-gray-500">輸入框</p>
                </div>
                <div className="col-span-1">
                  <input
                    disabled
                    type="checkbox"
                    checked={show[3]}
                    onChange={() => handleCheckboxChange(3)}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </div>
                <div className="text-sm leading-6 col-span-2">
                  <label className="font-medium text-gray-900">聯絡電話</label>
                  <p className="text-sm leading-6 text-gray-500">輸入框</p>
                </div>
              </div>
              {/* 學校 */}
              <div className="grid grid-cols-12 grid-flow-row-dense gap-4 py-2">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={show[4]}
                    onChange={() => handleCheckboxChange(4)}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </div>
                <div className="text-sm leading-6 col-span-1">
                  <label className="font-medium text-gray-900">學校</label>
                </div>
                <div className="text-sm leading-6 col-span-1">
                  <span className="isolate inline-flex flex-col rounded-md shadow-sm">
                    <button
                      onClick={() => {
                        setSchoolType(1);
                      }}
                      type="button"
                      className="relative inline-flex items-center rounded-t-md bg-white p-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      {schoolType == 1 ? (
                        <CheckCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-green-500"
                        />
                      ) : (
                        <XCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-red-500"
                        />
                      )}
                      輸入框
                    </button>
                    <button
                      onClick={() => {
                        setSchoolType(2);
                      }}
                      type="button"
                      className="relative inline-flex items-center rounded-b-md bg-white p-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      {schoolType == 2 ? (
                        <CheckCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-green-500"
                        />
                      ) : (
                        <XCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-red-500"
                        />
                      )}
                      單選框
                    </button>
                  </span>
                </div>
                {schoolType == 1 || (
                  <>
                    <div className="text-sm leading-6 col-span-2">
                      <fieldset>
                        <legend className="text-sm font-semibold leading-6 text-gray-900">單選框選擇</legend>
                        {/* <div className="flex items-center">
                          <input
                            checked={schoolTypeStyle}
                            onChange={() => {
                              setSchoolTypeStyle(true);
                            }}
                            id="schoolDefault"
                            type="radio"
                            name="schoolRadioType"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="schoolDefault"
                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                          >
                            預設（國小、國中、高中）
                          </label>
                        </div> */}
                        <div className="flex items-center">
                          <input
                            checked={!schoolTypeStyle}
                            onChange={() => {
                              setSchoolTypeStyle(false);
                            }}
                            id="schoolCustomize"
                            type="radio"
                            name="schoolRadioType"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="schoolCustomize"
                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                          >
                            自訂
                          </label>
                        </div>
                      </fieldset>
                    </div>
                    {schoolTypeStyle || (
                      <div className="text-sm leading-6 col-span-7">
                        <div className="grid grid-cols-3 grid-flow-row-dense gap-2">
                          {schoolData.map((text, index) => {
                            return (
                              <div
                                key={index}
                                className="text-sm leading-6"
                              >
                                {/* <label>內容</label> */}
                                <input
                                  type="text"
                                  value={text || ""}
                                  onChange={(event) => handleSchoolContentChange(index, event.target.value)}
                                  placeholder={`選項${index + 1}`}
                                  className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                />
                              </div>
                            );
                          })}
                          <button
                            onClick={() => {
                              setSchoolData([...schoolData, ""]);
                            }}
                            type="button"
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                          >
                            <PlusCircleIcon
                              aria-hidden="true"
                              className="-ml-0.5 h-5 w-5"
                            />
                            新增選項
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* 年級 */}
              <div className="grid grid-cols-12 grid-flow-row-dense gap-4 py-2">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={show[5]}
                    onChange={() => handleCheckboxChange(5)}
                    className="h-6 w-6 rounded border-gray-300"
                  />
                </div>
                <div className="text-sm leading-6 col-span-1">
                  <label className="font-medium text-gray-900">年級</label>
                </div>
                <div className="text-sm leading-6 col-span-1">
                  <span className="isolate inline-flex flex-col rounded-md shadow-sm">
                    <button
                      onClick={() => {
                        setGradeType(1);
                      }}
                      type="button"
                      className="relative inline-flex items-center rounded-t-md bg-white p-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      {gradeType == 1 ? (
                        <CheckCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-green-500"
                        />
                      ) : (
                        <XCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-red-500"
                        />
                      )}
                      輸入框
                    </button>
                    <button
                      onClick={() => {
                        setGradeType(2);
                      }}
                      type="button"
                      className="relative inline-flex items-center rounded-b-md bg-white p-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      {gradeType == 2 ? (
                        <CheckCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-green-500"
                        />
                      ) : (
                        <XCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 mr-2 text-red-500"
                        />
                      )}
                      單選框
                    </button>
                  </span>
                </div>
                {gradeType == 1 || (
                  <>
                    <div className="text-sm leading-6 col-span-2">
                      <fieldset>
                        <legend className="text-sm font-semibold leading-6 text-gray-900">單選框選擇</legend>
                        {/* <div className="flex items-center">
                          <input
                            checked={gradeTypeStyle}
                            onChange={() => {
                              setGradeTypeStyle(true);
                            }}
                            id="gradeDefault"
                            type="radio"
                            name="gradeRadioType"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="gradeDefault"
                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                          >
                            預設（國小、國中、高中）
                          </label>
                        </div> */}
                        <div className="flex items-center">
                          <input
                            checked={!gradeTypeStyle}
                            onChange={() => {
                              setGradeTypeStyle(false);
                            }}
                            id="gradeCustomize"
                            type="radio"
                            name="gradeRadioType"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="gradeCustomize"
                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                          >
                            自訂
                          </label>
                        </div>
                      </fieldset>
                    </div>
                    {gradeTypeStyle || (
                      <div className="text-sm leading-6 col-span-7">
                        <div className="grid grid-cols-3 grid-flow-row-dense gap-4">
                          {gradeData.map((text, index) => {
                            return (
                              <div
                                key={index}
                                className="text-sm leading-6"
                              >
                                {/* <label>內容</label> */}
                                <input
                                  type="text"
                                  value={text || ""}
                                  onChange={(event) => handleGradeContentChange(index, event.target.value)}
                                  placeholder={`選項${index + 1}`}
                                  className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                />
                              </div>
                            );
                          })}
                          <button
                            onClick={() => {
                              setGradeData([...gradeData, ""]);
                            }}
                            type="button"
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                          >
                            <PlusCircleIcon
                              aria-hidden="true"
                              className="-ml-0.5 h-5 w-5"
                            />
                            新增選項
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 自訂框 */}
              {items.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 grid-flow-row-dense gap-4 py-2"
                  >
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={item.show}
                        onChange={(event) => handleItemsCheckboxChange(index, event.target.checked)}
                        className="h-6 w-6 rounded border-gray-300"
                      />
                    </div>
                    <div className="text-sm leading-6 col-span-1">
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(event) => handleItemsTitleChange(index, event.target.value)}
                        placeholder="欄位名稱"
                        className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      />
                    </div>
                    <div className="text-sm leading-6 col-span-1">
                      <span className="isolate inline-flex flex-col rounded-md shadow-sm">
                        <button
                          onClick={() => {
                            handleItemsTypeChange(index, 1);
                          }}
                          type="button"
                          className="relative inline-flex items-center rounded-t-md bg-white p-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        >
                          {item.type == 1 ? (
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 mr-2 text-green-500"
                            />
                          ) : (
                            <XCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 mr-2 text-red-500"
                            />
                          )}
                          輸入框
                        </button>
                        <button
                          onClick={() => {
                            handleItemsTypeChange(index, 2);
                          }}
                          type="button"
                          className="relative inline-flex items-center bg-white p-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        >
                          {item.type == 2 ? (
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 mr-2 text-green-500"
                            />
                          ) : (
                            <XCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 mr-2 text-red-500"
                            />
                          )}
                          單選框
                        </button>
                        <button
                          onClick={() => {
                            handleItemsTypeChange(index, 3);
                          }}
                          type="button"
                          className="relative inline-flex items-center rounded-b-md bg-white p-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        >
                          {item.type == 3 ? (
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 mr-2 text-green-500"
                            />
                          ) : (
                            <XCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 mr-2 text-red-500"
                            />
                          )}
                          複選框
                        </button>
                      </span>
                    </div>
                    {item.type != 1 && (
                      <div className="text-sm leading-6 col-span-8">
                        <div className="grid grid-cols-3 grid-flow-row-dense gap-2">
                          {item.content?.map((text, index2) => {
                            return (
                              <div
                                key={index2}
                                className="text-sm leading-6"
                              >
                                {/* <label>內容</label> */}
                                <input
                                  type="text"
                                  value={text || ""}
                                  onChange={(event) => handleItemsContentChange(index, index2, event.target.value)}
                                  placeholder={`選項${index2 + 1}`}
                                  className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                />
                              </div>
                            );
                          })}
                          <button
                            onClick={() => {
                              handleItemsContentAdd(index);
                            }}
                            type="button"
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                          >
                            <PlusCircleIcon
                              aria-hidden="true"
                              className="-ml-0.5 h-5 w-5"
                            />
                            新增選項
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="py-2 flex justify-between">
                <button
                  onClick={() => {
                    setItems([
                      ...items,
                      {
                        show: true,
                        title: "", // 標題
                        type: 1, // 種類 1.輸入框 2.單選 3.複選
                        content: ["", "", "", "", "", ""] // 單選與複選的內容
                      }
                    ]);
                  }}
                  type="button"
                  className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <PlusCircleIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  新增客製化框
                </button>
                <button
                  onClick={submit}
                  type="button"
                  className="inline-flex items-center gap-x-2 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <DocumentChartBarIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  儲存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
