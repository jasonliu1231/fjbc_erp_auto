"use client";

import { useEffect, useState } from "react";
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

  const [item, setItem] = useState([]);
  const [content, setContent] = useState([]);
  const [save, setSave] = useState({});
  const [title, setTitle] = useState("預設標題");
  const [loading, setLoading] = useState(true);

  async function getForm(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/activity/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setItem(res.fjbc_form);
      setContent(res.fjbc_form_content);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    getForm(id);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料讀取中...</span>
      </div>
    );
  }

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto">
        <div className="text-base font-semibold text-gray-900 py-3">畫面預覽</div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <div className="mx-auto border-8 border-black rounded-3xl w-72 py-20 bg-blue-50 relative">
              <div className="absolute top-0 right-1/2 translate-x-1/2 rounded-b-xl bg-black h-6 w-32"></div>
              <div className="absolute bottom-1 right-1/2 translate-x-1/2 rounded-xl bg-black h-2 w-32"></div>
              <div className="w-full h-96 overflow-auto bg-white pb-20">
                <div className="max-w-full">
                  {item.banner != "" && (
                    <img
                      src={item.banner}
                      className="w-full"
                    />
                  )}
                </div>
                <div className="px-2">
                  <div className="max-w-full">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.textarea }}
                      className="editor"
                    />
                  </div>
                  <div className="grid grid-cols-1">
                    <div className="col-span-1">
                      <Input
                        label="學生姓名"
                        required={true}
                        submit={{
                          setting: setSave,
                          item: "student"
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="家長姓名"
                        required={true}
                        submit={{
                          setting: setSave,
                          item: "parents"
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="聯絡電話"
                        required={true}
                        submit={{
                          setting: setSave,
                          item: "tel"
                        }}
                      />
                    </div>
                    {item.schooltype != 0 && (
                      <div className="col-span-1">
                        {item.schooltype == 1 ? (
                          <Input
                            label="學校"
                            required={false}
                            submit={{
                              setting: setSave,
                              item: "school"
                            }}
                          />
                        ) : item.schooltype == 2 && !item.schoolcontent ? (
                          <School
                            submit={{
                              setting: setSave,
                              item: "school"
                            }}
                          />
                        ) : (
                          <Radio
                            data={item.schoolcontent}
                            label="學校"
                            submit={{
                              setting: setSave,
                              item: "school"
                            }}
                          />
                        )}
                      </div>
                    )}
                    {item.gradetype != 0 && (
                      <div className="col-span-1">
                        {item.gradetype == 1 ? (
                          <Input
                            label="年級"
                            required={false}
                            submit={{
                              setting: setSave,
                              item: "grade"
                            }}
                          />
                        ) : (
                          <Radio
                            data={item.gradecontent ? item.gradecontent : grade}
                            label="年級"
                            submit={{
                              setting: setSave,
                              item: "grade"
                            }}
                          />
                        )}
                      </div>
                    )}
                    {content?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="col-span-1"
                        >
                          {item.type == 1 ? (
                            <Input
                              label={item.title}
                              submit={{
                                setting: setSave,
                                item: `text${index}`
                              }}
                            />
                          ) : item.type == 2 ? (
                            <Radio
                              data={item.content}
                              label={item.title}
                              submit={{
                                setting: setSave,
                                item: `text${index}`
                              }}
                            />
                          ) : (
                            <Checkbox
                              data={item.content}
                              label={item.title}
                              submit={{
                                setting: setSave,
                                item: `text${index}`
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    送出
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="-mr-0.5 h-5 w-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="mx-auto border-8 border-black rounded-3xl max-w-xl py-20 bg-blue-50 relative">
              <div className="absolute top-0 right-1/2 translate-x-1/2 rounded-b-xl bg-black h-6 w-32"></div>
              <div className="absolute bottom-1 right-1/2 translate-x-1/2 rounded-xl bg-black h-2 w-32"></div>
              <div className="w-full h-60vh overflow-auto bg-white pb-20">
                <div className="max-w-full">
                  {item.banner != "" && (
                    <img
                      src={item.banner}
                      className="w-full"
                    />
                  )}
                </div>
                <div className="px-4">
                  <div className="max-w-full">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.textarea }}
                      className="editor"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <Input
                        label="學生姓名"
                        required={true}
                        submit={{
                          setting: setSave,
                          item: "student"
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="家長姓名"
                        required={true}
                        submit={{
                          setting: setSave,
                          item: "parents"
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        label="聯絡電話"
                        required={true}
                        submit={{
                          setting: setSave,
                          item: "tel"
                        }}
                      />
                    </div>
                    {item.schooltype != 0 && (
                      <div className="col-span-1">
                        {item.schooltype == 1 ? (
                          <Input
                            label="學校"
                            required={false}
                            submit={{
                              setting: setSave,
                              item: "school"
                            }}
                          />
                        ) : item.schooltype == 2 && !item.schoolcontent ? (
                          <School
                            submit={{
                              setting: setSave,
                              item: "school"
                            }}
                          />
                        ) : (
                          <Radio
                            data={item.schoolcontent}
                            label="學校"
                            submit={{
                              setting: setSave,
                              item: "school"
                            }}
                          />
                        )}
                      </div>
                    )}
                    {item.gradetype != 0 && (
                      <div className="col-span-1">
                        {item.gradetype == 1 ? (
                          <Input
                            label="年級"
                            required={false}
                            submit={{
                              setting: setSave,
                              item: "grade"
                            }}
                          />
                        ) : (
                          <Radio
                            data={item.gradecontent ? item.gradecontent : grade}
                            label="年級"
                            submit={{
                              setting: setSave,
                              item: "grade"
                            }}
                          />
                        )}
                      </div>
                    )}

                    {content?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="col-span-1"
                        >
                          {item.type == 1 ? (
                            <Input
                              label={item.title}
                              submit={{
                                setting: setSave,
                                item: `text${index}`
                              }}
                            />
                          ) : item.type == 2 ? (
                            <Radio
                              data={item.content}
                              label={item.title}
                              submit={{
                                setting: setSave,
                                item: `text${index}`
                              }}
                            />
                          ) : (
                            <Checkbox
                              data={item.content}
                              label={item.title}
                              submit={{
                                setting: setSave,
                                item: `text${index}`
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    送出
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="-mr-0.5 h-5 w-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
