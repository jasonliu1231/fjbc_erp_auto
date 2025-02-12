"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Radio, Checkbox, School, Editor, Teacher } from "../component";
import { CheckCircleIcon, XCircleIcon, PlusCircleIcon, DocumentChartBarIcon, PhotoIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { error } from "../../../utils";
import Alert from "../../alert";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const dataid = useRef();
  const [view, setView] = useState(false);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [customize, setCustomize] = useState([]);

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

  const handleItemsTypeChange = (index, val) => {
    const update = customize.map((item, i) => {
      if (i == index) {
        return {
          ...item,
          type: Number(val)
        };
      } else {
        return item;
      }
    });
    setCustomize(update);
  };

  const handleItemsContentChange = (index1, index2, val) => {
    const update = customize.map((item, i) => {
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
    setCustomize(update);
  };

  const handleItemsContentAdd = (index1) => {
    const update = customize.map((item, i) => {
      if (i == index1) {
        return {
          ...item,
          content: [...item.content, ""]
        };
      } else {
        return item;
      }
    });
    setCustomize(update);
  };

  const handleItemsTitleChange = (index, val) => {
    const update = customize.map((item, i) => {
      if (i == index) {
        return {
          ...item,
          title: val
        };
      } else {
        return item;
      }
    });
    setCustomize(update);
  };

  async function submit() {
    customize.forEach((item, index) => {
      item.index = index;
      const uniqueItems = new Set(item.content.filter((i) => i != ""));
      item.content = [...uniqueItems];
    });
    const data = {
      form_index: dataid.current,
      deadline: questionnaire.deadline,
      textarea: textareaValue,
      banner: imageUrl,
      auto_open: questionnaire.auto_open,
      auto_close: questionnaire.auto_close,
      items: customize
    };

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    console.log(data);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/setting`, config);
    const res = await response.json();
    if (response.ok) {
      alert("修改成功");
      window.location.href = "./list";
    } else {
      alert(res.msg);
    }
  }

  async function getData(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/setting/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setQuestionnaire(res.questionnaire);
      setTextareaValue(res.questionnaire.textarea);
      setImageUrl(res.questionnaire.banner);
      setCustomize(res.questionnaire_entity);
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
    const id = Number(params.get("id"));

    dataid.current = id;
    getData(id);
  }, []);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto">
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
          <div className="bg-white p-4 rounded-md">
            <div className="max-w-2xl mx-auto">
              {imageUrl != "" && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full"
                />
              )}
              <div className="bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mb-28">
                <div className="flex justify-center w-full col-span-1 sm:col-span-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: textareaValue }}
                    className="w-full editor"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="學生姓名"
                    required={true}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="家長姓名"
                    required={false}
                  />
                </div>

                <div className="col-span-1">
                  <Input
                    label="聯絡電話"
                    required={false}
                  />
                </div>
                <div className="col-span-1">
                  {questionnaire.schooltype == 1 ? (
                    <Input
                      label="學校"
                      required={false}
                    />
                  ) : questionnaire.schooltype == 2 ? (
                    <Radio label="學校" />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-span-1">
                  {questionnaire.gradetype == 1 ? (
                    <Input
                      label="年級"
                      required={false}
                    />
                  ) : questionnaire.gradetype == 2 ? (
                    <Radio label="年級" />
                  ) : (
                    <></>
                  )}
                </div>

                {customize.map((item, index) => {
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
          </div>
        ) : (
          <div className="bg-white p-4 rounded-md">
            {/* 問卷名稱 */}
            <div className="grid grid-cols-12 grid-flow-row-dense gap-1 py-4 items-center">
              <div className="col-span-1">
                <label className="block text-md font-medium text-red-500">表單名稱</label>
              </div>
              <div className="col-span-2">{questionnaire?.name}</div>
              <div className="col-span-1">
                <label className="block text-md font-medium text-gray-500">期限</label>
              </div>
              <div className="col-span-2">
                <div className="text-red-400">{questionnaire.deadline ? new Date(questionnaire.deadline).toLocaleString() : "無設定"}</div>
                <input
                  onChange={(event) => {
                    setQuestionnaire({
                      ...questionnaire,
                      deadline: event.target.value
                    });
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
                  value={questionnaire?.auto_open}
                  onChange={(event) => {
                    setQuestionnaire({
                      ...questionnaire,
                      auto_open: event.target.value
                    });
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
                  value={questionnaire?.auto_close}
                  onChange={(event) => {
                    setQuestionnaire({
                      ...questionnaire,
                      auto_close: event.target.value
                    });
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
              <label className="font-medium text-gray-900 col-span-1">主題內容</label>
              <div className="text-sm leading-6 col-span-10">
                <div className="">
                  {" "}
                  <Editor
                    textareaValue={textareaValue}
                    setTextareaValue={setTextareaValue}
                  />
                </div>
              </div>
            </div>
            {/* 自訂欄位 */}
            {/* <div className="grid grid-cols-12 grid-flow-row-dense gap-4 py-2">
              {customize.map((item, index) => {
                return (
                  <div className="flex items-center justify-center col-span-3">
                    {" "}
                    <div className="text-sm leading-6">
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(event) => handleItemsTitleChange(index, event.target.value)}
                        placeholder="欄位名稱"
                        className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="text-sm leading-6">{item.type == 1 ? "輸入框" : item.type == 2 ? "單選框" : "複選框"}</div>
                  </div>
                );
              })}
            </div> */}
            {/* 自訂框 */}
            {customize.map((item, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-12 grid-flow-row-dense gap-4 py-2"
                >
                  <div className="text-sm leading-6 col-span-1">
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(event) => handleItemsTitleChange(index, event.target.value)}
                      placeholder="欄位名稱"
                      className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            <div className="flex justify-around">
              {/* <button
                onClick={() => {
                  setCustomize([
                    ...customize,
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
              </button> */}
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
        )}
      </div>
    </>
  );
}
