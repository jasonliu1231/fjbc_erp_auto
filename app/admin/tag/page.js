"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Alert from "../alert";
import { error } from "../../utils";

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [tagList, setTagList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState([]);
  const [query, setQuery] = useState("");
  const [create, setCreate] = useState({
    content: "",
    content_color: "#000000"
  });
  const [update, setUpdate] = useState({
    id: 0,
    content: "",
    color: ""
  });

  const filteredTagList =
    query === ""
      ? tagList
      : tagList.filter((item) => {
          const content = item.content.toLowerCase() || "";
          return content.includes(query.toLowerCase());
        });

  async function submit() {
    if (create.content == "") {
      setInfo({
        show: true,
        success: false,
        msg: "名稱不可以空白"
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag`, config);
    const res = await response.json();
    if (response.ok) {
      getTagList();
      setInfo({
        show: true,
        success: true,
        msg: "新增完成！"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateTag() {
    if (update.content == "") {
      setInfo({
        show: true,
        success: false,
        msg: "名稱不可以空白"
      });
      return;
    }
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag`, config);
    const res = await response.json();
    if (response.ok) {
      getTagList();
      setInfo({
        show: true,
        success: true,
        msg: "修改完成！"
      });
      setOpen(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function checkTag(tag_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag?id=${tag_id}`, config);
    const res = await response.json();
    if (response.ok) {
      // 還在使用的給予確認，沒有直接刪除
      if (res.name_list) {
        setDeleteId(tag_id);
        setDeleteAlert(true);
        setDeleteMsg(res.name_list);
      } else {
        deleteTag(tag_id);
      }
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function deleteTag(tag_id) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag?id=${tag_id}`, config);
    const res = await response.json();
    if (response.ok) {
      getTagList();
      setOpen(false);
      setDeleteAlert(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getTagList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tag/list`, config);
    const res = await response.json();
    if (response.ok) {
      setTagList(res);
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
    getTagList();
  }, []);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <Dialog
        open={deleteAlert}
        onClose={() => {}}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xs sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="text-blue-500">{deleteMsg.join("，")}</div>
                <div className="text-red-500">還在使用中，是否要刪除？</div>
                <div className="text-red-500 text-sm">* 刪除會一並移除使用中的標籤</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => setDeleteAlert(false)}
                    className="w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  >
                    取消
                  </button>
                </div>
                <div className="col-span-1">
                  {" "}
                  <button
                    type="button"
                    onClick={() => {
                      deleteTag(deleteId);
                    }}
                    className="w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    確定刪除
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={open}
        onClose={() => {}}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xs sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center">
                  <div>
                    <div className="mt-2">
                      <label className="block text-sm/6 font-medium text-gray-900">名稱</label>
                      <div>
                        <input
                          value={update.content}
                          onChange={(e) => {
                            setUpdate({
                              ...update,
                              content: e.target.value
                            });
                          }}
                          type="text"
                          placeholder="最多10個字"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm/6 font-medium text-gray-900">顏色</label>
                      <div>
                        <input
                          value={update.color}
                          onChange={(e) => {
                            setUpdate({
                              ...update,
                              color: e.target.value
                            });
                          }}
                          type="color"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => setOpen(false)}
                    className="w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  >
                    取消
                  </button>
                </div>
                <div className="col-span-1">
                  {" "}
                  <button
                    type="button"
                    onClick={updateTag}
                    className="w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                  >
                    修改
                  </button>
                </div>
                <div className="col-span-1">
                  {" "}
                  <button
                    type="button"
                    onClick={() => checkTag(update.id)}
                    className="w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto py-2">
        <div className="my-2">
          <h2 className="text-xl font-bold text-gray-900">標籤設定</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 bg-white rounded-xl px-3 py-4">
            <div className="font-bold text-gray-900">預覽</div>
            <div className="flex justify-center mt-4">
              {create.content != "" && create.content_color != "" ? (
                <span
                  style={{
                    color: create.content_color,
                    borderColor: create.content_color
                  }}
                  className="text-xs border-2 rounded-full px-2 py-1"
                >
                  {create.content}
                </span>
              ) : (
                <span
                  style={{
                    color: create.content_color,
                    borderColor: create.content_color
                  }}
                  className="text-xs border-2 rounded-full px-2 py-1 "
                >
                  範例
                </span>
              )}
            </div>
            <div className="mt-2">
              <label className="block text-sm/6 font-medium text-gray-900">名稱</label>
              <div>
                <input
                  value={create.content}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      content: e.target.value
                    });
                  }}
                  type="text"
                  placeholder="最多10個字"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-sm/6 font-medium text-gray-900">顏色</label>
              <div>
                <input
                  value={create.content_color}
                  onChange={(e) => {
                    setCreate({
                      ...create,
                      content_color: e.target.value
                    });
                  }}
                  type="color"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="flex items-center justify-center border-t border-gray-900/10 px-4 py-4">
              <button
                onClick={submit}
                type="submit"
                className="rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-500"
              >
                儲存
              </button>
            </div>
          </div>
          <div className="col-span-3 bg-white rounded-xl ring-1 ring-gray-900/5 px-3 py-4">
            <div className="font-bold text-gray-900 mb-4 flex justify-between">
              <div>標籤池</div>
              <div>
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  className="ring-1 ring-gray-400 rounded-md p-1"
                  placeholder="關鍵字搜尋"
                />
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center mt-4">
                <div className="spinner"></div>
                <span className="mx-4 text-blue-500">資料讀取中...</span>
              </div>
            ) : (
              <div className="bg-white rounded-xl">
                {filteredTagList.map((item) => (
                  <span
                    key={item.id}
                    onClick={() => {
                      setUpdate({
                        id: item.id,
                        content: item.content,
                        color: item.color
                      });
                      setOpen(true);
                    }}
                    style={{
                      color: item.color,
                      borderColor: item.color
                    }}
                    className="whitespace-nowrap text-xs border-2 rounded-full px-2 py-1 m-1 cursor-pointer leading-8"
                  >
                    {item.content}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
