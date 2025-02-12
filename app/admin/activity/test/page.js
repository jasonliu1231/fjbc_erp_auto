"use client";

import { useEffect, useState, useRef } from "react";
import { Input, Radio, Checkbox, School } from "./component";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

const grade = ["國小一年級", "國小二年級", "國小三年級", "國小四年級", "國小五年級", "國小六年級", "國中一年級", "國中二年級", "國中三年級", "高中一年級", "高中二年級", "高中三年級"];

export default function Home() {
  const form_index = useRef();
  const type = useRef();
  const [item, setItem] = useState([]);
  const [save, setSave] = useState({});
  const [loading, setLoading] = useState(true);

  async function submit() {
    if (save.student.trim() == "") {
      alert("請填寫學生名稱");
      return;
    }
    if (save.parents.trim() == "") {
      alert("請填寫家長名稱");
      return;
    }
    if (save.tel.trim() == "") {
      alert("請填寫聯絡電話");
      return;
    }

    save.id = form_index.current;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(save)
    };

    let api = "";
    if (type.current) {
      api = `/api/fjbc_form/new`;
    } else {
      api = `/api/fjbc_form/old`;
    }

    const response = await fetch(api, config);
    const res = await response.json();
    if (response.ok) {
      alert("已送出，感謝您的填寫！");
      window.location.reload();
    } else {
      alert(res.msg);
    }
  }

  async function getOld(id) {
    const response = await fetch(`/api/fjbc_form/old?id=${id}`);
    const res = await response.json();
    if (response.ok) {
      setItem(res);
      setLoading(false);
    } else {
      alert(res.msg);
    }
  }

  async function getNew(id) {
    const response = await fetch(`/api/fjbc_form/new?id=${id}`);
    const res = await response.json();
    if (response.ok) {
      setItem(res);
      setLoading(false);
    } else {
      alert(res.msg);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");

    const is_new = Number.isNaN(Number(id));

    if (is_new) {
      getNew(id);
    } else {
      getOld(id);
    }

    form_index.current = id;
    type.current = is_new;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">補習班活動表單</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-50">
        <div className="max-w-xl m-auto bg-white">
          <div className="max-w-full">
            {item.banner != "" && (
              <img
                src={item.banner}
                className="w-full"
              />
            )}
          </div>
          <div className="container mx-auto p-2">
            <div className="max-w-full">
              <div
                dangerouslySetInnerHTML={{ __html: item.textarea }}
                className="editor"
              />
            </div>
            <div
              className="bg-white grid sm:grid-cols-2 gap-4 p-4"
              style={{
                marginTop: "-40px",
                position: "relative",
                zIndex: "999"
              }}
            >
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

              {item.customize?.map((item, index) => {
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
          <div className="pb-40 flex justify-center">
            <button
              onClick={submit}
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
    </>
  );
}
