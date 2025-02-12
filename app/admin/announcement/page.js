"use client";

import { useEffect, useState } from "react";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/solid";
import Alert from "../alert";
import { error } from "../../utils";
import "@fortawesome/fontawesome-free/css/all.css";
import dynamic from "next/dynamic";
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

const def_create = {
  id: 0,
  is_create: true,
  tutoring_id: 0,
  title: "",
  content: "",
  announcement_type: 0,
  announcement_start_date: "",
  announcement_end_date: "",
  is_top: false,
  is_active: true
};

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [announcementList, setAnnouncementList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState(def_create);
  const [reactQuill, setReactQuill] = useState("");
  const [quill, setQuill] = useState(true);

  const config = {
    language: "zh_tw",
    height: 300,
    toolbarButtons: ["fontSize", "align", "formatOL", "formatUL", "bold", "italic", "underline", "strikeThrough", "textColor", "backgroundColor", "insertTable", "emoticons", "html"],
    pluginsEnabled: ["table", "emoticons", "align", "colors", "fontSize", "lists"]
  };

  async function loadResources() {
    try {
      await Promise.all([
        import("froala-editor/js/plugins.pkgd.min.js"),
        import("froala-editor/js/froala_editor.pkgd.min.js"),
        import("froala-editor/css/froala_editor.pkgd.min.css"),
        import("froala-editor/js/languages/zh_tw.js"),
        import("froala-editor/js/plugins/image.min.js")
      ]);
      setEditorLoaded(true);
    } catch (error) {
      console.error("Error loading Froala Editor resources:", error);
    }
  }

  async function getAnnouncement(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_announcement/list?tutoring_id=${id}&is_active=true`, config);
    const res = await response.json();
    if (response.ok) {
      setAnnouncementList(res);
      setLoading(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function createAnnouncement() {
    if (create.tutoring_id == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇補習班"
      });
      return;
    }
    if (create.announcement_start_date == "" || create.announcement_end_date == "") {
      setInfo({
        show: true,
        success: false,
        msg: "時間不可以空白"
      });
      return;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };
    create.content = reactQuill;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_announcement/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "新增完成！"
      });
      getAnnouncement(create.tutoring_id);
      setCreate(def_create);
      setReactQuill("");
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateAnnouncement() {
    create.content = reactQuill;
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_announcement/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "更新完成！"
      });
      getAnnouncement(create.tutoring_id);
      setCreate(def_create);
      setReactQuill("");
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function deleteAnnouncement(data) {
    const check = confirm("確定要刪除嗎？");
    if (!check) {
      return;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring_announcement/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "已刪除！"
      });
      getAnnouncement(data.tutoring_id);
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
    loadResources();
    if (create.tutoring_id != 0) {
      getAnnouncement(create.tutoring_id);
    }
  }, [create.tutoring_id]);

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
        <label className="block text-xl font-medium leading-6 text-gray-900 my-2">新增公告</label>
        <div className="bg-white ring-1 ring-gray-900/5 rounded-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="col-span-1">
              <div className="flex justify-between">
                <span>
                  <button
                    onClick={() => {
                      setCreate(def_create);
                      setReactQuill("");
                    }}
                    type="button"
                    className={`${create.is_create ? "bg-blue-100" : "bg-white"} relative inline-flex items-center rounded-l-md px-2 py-1 text-sm font-semibold text-gray-600 ring-1 hover:bg-blue-100`}
                  >
                    新增
                  </button>
                  <button
                    onClick={() => {
                      if (create.tutoring_id != 0) {
                        setCreate({ ...create, is_create: false });
                      }
                    }}
                    type="button"
                    className={`${
                      !create.is_create ? "bg-blue-100" : "bg-white"
                    } relative inline-flex items-center rounded-r-md px-2 py-1 text-sm font-semibold text-gray-600 ring-1 hover:bg-blue-100`}
                  >
                    修改
                  </button>
                </span>
                <select
                  value={create.tutoring_id}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      tutoring_id: Number(e.target.value)
                    });
                  }}
                  className={`px-2 py-1 text-sm font-semibold text-gray-600 ring-1 rounded-md`}
                >
                  <option value={0}>補習班</option>
                  <option value={1}>多易</option>
                  <option value={2}>艾思</option>
                  <option value={3}>華爾敦</option>
                </select>
                <input
                  value={create.title}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      title: e.target.value
                    });
                  }}
                  className={`px-2 py-1 text-sm font-semibold text-gray-600 ring-1 ring-red-400 rounded-md`}
                  placeholder="公告標題"
                />

                <span>
                  <button
                    onClick={() => setQuill(true)}
                    type="button"
                    className={`${quill ? "bg-blue-100" : "bg-white"} relative inline-flex items-center rounded-l-md px-2 py-1 text-sm font-semibold text-gray-600 ring-1 hover:bg-blue-100`}
                  >
                    <PencilIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                    />
                    編寫
                  </button>
                  <button
                    onClick={() => setQuill(false)}
                    type="button"
                    className={`${!quill ? "bg-blue-100" : "bg-white"} relative inline-flex items-center rounded-r-md px-2 py-1 text-sm font-semibold text-gray-600 ring-1 hover:bg-blue-100`}
                  >
                    <EyeIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                    />
                    預覽
                  </button>
                </span>
              </div>
              <div className="flex justify-between my-2">
                <input
                  value={create.announcement_start_date}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      announcement_start_date: e.target.value
                    });
                  }}
                  className={`px-2 py-1 text-sm font-semibold text-gray-600 ring-1 rounded-md`}
                  type="date"
                />
                <span>至</span>
                <input
                  value={create.announcement_end_date}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      announcement_end_date: e.target.value
                    });
                  }}
                  className={`px-2 py-1 text-sm font-semibold text-gray-600 ring-1 rounded-md`}
                  type="date"
                />
                <select
                  value={create.announcement_type}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      announcement_type: Number(e.target.value)
                    });
                  }}
                  className={`mx-1 px-2 py-1 text-sm font-semibold text-gray-600 ring-1 rounded-md`}
                >
                  <option value={0}>公告類別</option>
                  <option value={1}>活動</option>
                  <option value={2}>系統</option>
                  <option value={3}>重要通知</option>
                  <option value={4}>一般公告</option>
                </select>
                <label className={`px-2 py-1 text-sm font-semibold text-gray-600 rounded-md ring-1 flex items-center`}>
                  <input
                    checked={create.is_top}
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        is_top: e.target.checked
                      });
                    }}
                    type="checkbox"
                    className="w-5 h-5 mr-2"
                  />
                  是否置頂
                </label>
                <label className={`px-2 py-1 text-sm font-semibold text-gray-600 rounded-md ring-1 flex items-center`}>
                  <input
                    checked={create.is_active}
                    onChange={(e) => {
                      setCreate({
                        ...create,
                        is_active: e.target.checked
                      });
                    }}
                    type="checkbox"
                    className="w-5 h-5 mr-2"
                  />
                  是否顯示
                </label>
              </div>

              <div className="mt-2 h-60vh">
                {quill ? (
                  <>
                    {editorLoaded ? (
                      <FroalaEditor
                        tag="textarea"
                        model={reactQuill}
                        onModelChange={(text) => {
                          setReactQuill(text);
                        }}
                        config={config}
                      />
                    ) : (
                      <div>模組加入中...</div>
                    )}
                  </>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: create.content }}
                    className="mt-2 prose text-sm editor h-60vh overflow-auto"
                  />
                )}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    if (create.is_create) {
                      createAnnouncement();
                    } else {
                      updateAnnouncement();
                    }
                  }}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  儲存
                </button>
              </div>
            </div>
            <div className="col-span-1 overflow-auto  overflow-auto h-80vh">
              <div className="px-4">
                <label className="block text-xl font-medium leading-6 text-gray-900 mb-4">公告列表</label>
                {announcementList.map((item, index) => (
                  <div
                    key={index}
                    className="my-2 border border-green-600 rounded-md p-1"
                  >
                    <div className="text-blue-400 font-medium">{item.title}</div>
                    <div className="flex justify-between">
                      <div className="text-gray-400">
                        <span className="text-gray-400">
                          {item.announcement_type == 1 ? "活動" : item.announcement_type == 2 ? "系統" : item.announcement_type == 3 ? "重要通知" : item.announcement_type == 4 ? "一般公告" : ""}
                        </span>
                        <span className="text-red-400 mx-2">{item.is_top && "置頂"}</span>
                        <span className="text-pink-400 font-medium">{item.is_active && "顯示"}</span>
                      </div>
                      <div className="text-gray-400">
                        {item.announcement_start_date} ~ {item.announcement_end_date}
                      </div>
                      <div className="flex">
                        <div
                          onClick={() => {
                            setCreate({
                              ...item,
                              is_create: false
                            });
                            setReactQuill(item.content);
                          }}
                          className="mx-2 text-blue-400 text-right cursor-pointer"
                        >
                          修改
                        </div>
                        <div
                          onClick={() => {
                            deleteAnnouncement({
                              ...item,
                              is_active: false
                            });
                          }}
                          className="mx-2 text-red-400 text-right cursor-pointer"
                        >
                          刪除
                        </div>
                      </div>
                    </div>
                    <div
                      className="h-32 overflow-auto w-full p-2 border-t-2 border-green-600 editor"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
