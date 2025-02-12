"use client";

import { useEffect, useRef, useState } from "react";
import Alert from "../alert";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/24/solid";
import { FaceSmileIcon, PaperClipIcon, UserCircleIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const moods = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "🫠",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "☺️",
  "🥲",
  "😜",
  "🤪",
  "🫣",
  "🙄",
  "😑",
  "🤢",
  "😮‍💨",
  "🤯",
  "🥳",
  "😎",
  "☹️",
  "😨",
  "😭",
  "😖",
  "🥱",
  "😤",
  "🤬",
  "👿",
  "💩",
  "🤡",
  "👻",
  "👽",
  "💯",
  "💢",
  "💤",
  "👋",
  "✌️",
  "✊",
  "🖐️",
  "🧠",
  "👍",
  "👎",
  "🙅",
  "🙋",
  "👦",
  "❤️",
  "🤵",
  "👰",
  "🚗"
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// const tutoringUserId = [0, 571, 572, 573]; // 測試
const tutoringUserId = [0, 554, 555, 556]; // 正式

export default function Home() {
  const [person, setPerson] = useState({});
  const [open, setOpen] = useState(false);
  const [personDialog, setPersonDialog] = useState(false);
  const [groupSendDialog, setGroupSendDialog] = useState(false);
  const [selectedPic, setSelectedPic] = useState("");
  const [selected, setSelected] = useState(moods[5]);
  const tutoringId = useRef(1);
  const msg = useRef("");
  const messagesEndRef = useRef(null);

  const messageInfo = useRef({});
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);

  const websocketRef = useRef(null);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });

  const [loading, setLoading] = useState(false);
  const [tutoring, setTutoring] = useState(1);
  const [parentList, setParentList] = useState([]);
  const [message, setMessage] = useState([]);
  const [pic, setPic] = useState([]);
  const [messageStr, setMessageStr] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(50);
  const [changeSwitch, setChangeSwitch] = useState(false);
  const wsState = useRef(false);

  // 群發
  const [selectPersonList, setSelectPersonList] = useState([]);
  const [groupMessage, setGroupMessage] = useState("");
  const [groupPic, setGroupPic] = useState("");

  let filteredParentList =
    query === ""
      ? parentList
      : parentList.filter((item) => {
          const first_name = item.first_name.toLowerCase() || "";

          return (
            first_name.includes(query.toLowerCase()) ||
            item.tag_list.some((element) => {
              if (element) {
                const split = element?.split("$$");
                return split[0] == query;
              }
            }) ||
            item.name_list.some((element) => {
              if (element) {
                const split = element?.split("$$");
                return split[0]?.includes(query.toLowerCase()) || split[1]?.includes(query.toLowerCase()) || split[2] == query;
              }
            })
          );
        });

  const handleFileChange = (event) => {
    if (!messageInfo.current.room_id) {
      setInfo({
        show: true,
        success: false,
        msg: "請選擇傳送對象"
      });
      return;
    }
    const file = event.target.files[0]; // 获取选中的文件
    if (file) {
      const reader = new FileReader(); // 创建 FileReader 来读取文件

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxSize = 1000; // 最大宽度或高度（单位：像素）
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const compressedImageUrl = canvas.toDataURL("image/jpeg", 0.8);
          createMessage(2, compressedImageUrl);
        };
      };

      reader.readAsDataURL(file);

      readMessage({
        room_id: messageInfo.current.room_id,
        user_id: tutoringUserId[tutoring]
      });
    }
  };

  const handleGroupFileChange = (event) => {
    const file = event.target.files[0]; // 获取选中的文件
    if (file) {
      const reader = new FileReader(); // 创建 FileReader 来读取文件

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxSize = 1000; // 最大宽度或高度（单位：像素）
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const compressedImageUrl = canvas.toDataURL("image/jpeg", 0.8);
          setGroupPic(compressedImageUrl);
        };
      };

      reader.readAsDataURL(file);
    }
  };

  async function getParentList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ws/parent/list?tutoring_id=${tutoringId.current}`, config);
    const res = await response.json();
    if (response.ok) {
      setParentList(res);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }

    setLoading(false);
  }

  async function getMessage(room_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ws/message?room_id=${room_id}&limit=${limit}`, config);
    const res = await response.json();
    if (response.ok) {
      setMessage(
        res.map((item) => {
          const dateTime = new Date(item.created_at);
          // 正式
          return {
            id: item.id,
            type: item.user_id == 554 || item.user_id == 555 || item.user_id == 556 ? "tutoring" : "parent",
            person: {
              name: item.user_id == 554 || item.user_id == 555 || item.user_id == 556 ? "補習班" : messageInfo.current.user_nick_name,
              imageUrl: item.user_id == 554 || item.user_id == 555 || item.user_id == 556 ? "" : messageInfo.current.user_pic
            },
            message: item.message,
            pic: item.pic,
            read_ids: item.read_ids,
            dateTime: dateTime,
            date: dateTime.toLocaleDateString(),
            time: dateTime.toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })
          };
          // 測試
          // return {
          //   id: item.id,
          //   type: item.user_id == 571 || item.user_id == 572 || item.user_id == 573 ? "tutoring" : "parent",
          //   person: {
          //     name: item.user_id == 571 || item.user_id == 572 || item.user_id == 573 ? "補習班" : messageInfo.current.user_nick_name,
          //     imageUrl: item.user_id == 571 || item.user_id == 572 || item.user_id == 573 ? "" : messageInfo.current.user_pic
          //   },
          //   message: item.message,
          //   pic: item.pic,
          //   read_ids: item.read_ids,
          //   dateTime: dateTime,
          //   date: dateTime.toLocaleDateString(),
          //   time: dateTime.toLocaleTimeString("zh-TW", { hour12: false, hour: "2-digit", minute: "2-digit" })
          // };
        })
      );
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function getPic(room_id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ws/message/pic?room_id=${room_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setPic(res);
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function readMessage(data) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ws/message/read`, config);
    const res = await response.json();
    if (response.ok) {
      sendMessage("", tutoringUserId[tutoring], "read");
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function createMessage(state, pic) {
    if (!msg.current && !pic) {
      setInfo({
        show: true,
        success: false,
        msg: "內容不可以是空的！"
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
      body: JSON.stringify({
        room_id: messageInfo.current.room_id,
        user_id: tutoringUserId[tutoring],
        message: state == 1 ? msg.current : null,
        pic: state == 1 ? null : pic
      })
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ws/message`, config);
    const res = await response.json();
    if (response.ok) {
      sendMessage(res, "", "message");
      msg.current = "";
      setMessageStr("");
    } else {
      setInfo({
        show: true,
        success: false,
        msg: res.detail
      });
    }
  }

  async function createGroupMessage() {
    if (!groupMessage && !groupPic) {
      setInfo({
        show: true,
        success: false,
        msg: "內容不可以是空的！"
      });
      return;
    }
    selectPersonList.forEach(async (item) => {
      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          clientid: `${localStorage.getItem("client_id")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          room_id: item.room_id,
          user_id: tutoringUserId[tutoring],
          message: "👉 此訊息為群體發送 👈\n" + groupMessage,
          pic: groupPic ? groupPic : null
        })
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/ws/message`, config);
      const res = await response.json();
      if (response.ok) {
        sendMessage(res, "", "message");
      } else {
        setInfo({
          show: true,
          success: false,
          msg: res.detail
        });
      }
    });
  }

  const attemptReconnect = (attempt) => {
    if (attempt <= maxReconnectAttempts) {
      console.log(`Attempting to reconnect... (Attempt #${attempt})`);
      setTimeout(() => {
        connectWebSocket();
      }, reconnectDelay * attempt);
    } else {
      console.error("Max reconnect attempts reached");
    }
  };

  //// websocket ///// 連線
  const reconnectDelay = 1000;
  const maxReconnectAttempts = 5;
  const ws_url = "wss://tutoring.fjbcgroup.com/socket/";

  const connectWebSocket = () => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected");
      return;
    }
    const wsUri = `${ws_url}`;
    const ws = new WebSocket(wsUri);
    websocketRef.current = ws;
    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsWebSocketOpen(true);
    };
    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsWebSocketOpen(false);
      attemptReconnect(1);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsWebSocketOpen(false);
      attemptReconnect(1);
    };

    ws.onmessage = (event) => {
      let response = JSON.parse(event.data);
      console.log(response);
      try {
        if (messageInfo.current.room_id && response.room_id == messageInfo.current.room_id) {
          getMessage(messageInfo.current.room_id);
        }
      } catch {
        attemptReconnect(1);
      }
    };
  };

  const sendMessage = (data, reader, type) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      const msg = {
        type: "systemmsg",
        name: "tutoring",
        room_id: messageInfo.current.room_id?.toString(),
        message: {
          status: type,
          reader_id: reader,
          data: data
        }
      };
      websocketRef.current.send(JSON.stringify(msg));
    }
  };

  useEffect(() => {
    getParentList();
    setMessage([]);
  }, [tutoring]);

  useEffect(() => {
    connectWebSocket();
    setInterval(() => {
      getParentList();
    }, 5 * 1000);
  }, []);

  // const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     const currentTime = new Date().getTime();
  //     if (currentTime - lastKeyPressTime < 300) {
  //       // 如果兩次按鍵間隔小於300ms，觸發操作
  //       handleAction();
  //     }
  //     setLastKeyPressTime(currentTime);
  //   }
  // };

  // const handleAction = () => {
  //   if (messageInfo.current.room_id && msg.current.trim() != "") {
  //     createMessage(1);
  //   }
  // };

  // useEffect(() => {
  //   // 在組件加載時添加全局事件監聽
  //   window.addEventListener("keydown", handleKeyPress);

  //   return () => {
  //     // 清除事件監聽，防止內存洩漏
  //     window.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [lastKeyPressTime]);

  const [scrollPosition, setScrollPosition] = useState(null);
  const originScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesEndRef.current) {
        setScrollPosition(messagesEndRef.current.scrollTop);
      }
    };
    const container = messagesEndRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollPosition == 0) {
      setLimit(limit + 20);
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (messageInfo.current.room_id) {
      getMessage(messageInfo.current.room_id);
      originScrollTop.current = messagesEndRef.current.scrollHeight;
    }
  }, [limit, changeSwitch]);

  // 滾動到最底部
  useEffect(() => {
    if (limit == 50) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    } else {
      const current_position = messagesEndRef.current.scrollHeight - originScrollTop.current;
      messagesEndRef.current.scrollTop = current_position;
      // setScrollPosition(current_position);
    }
  }, [message]);

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
      {/* 群發 */}
      <Dialog
        open={groupSendDialog}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                群發對象
                <button
                  type="button"
                  onClick={() => setGroupSendDialog(false)}
                  className="absolute right-5 top-5 rounded-md text-gray-500 hover:text-pink-300"
                >
                  <span className="absolute -inset-2.5" />
                  <XMarkIcon
                    aria-hidden="true"
                    className="size-6"
                  />
                </button>
              </div>
              <div className="flex my-2">
                {selectPersonList?.map((person, index) => (
                  <div
                    key={index}
                    className="text-xs mx-2"
                  >
                    <span className="text-blue-400">{person.user_nick_name}</span>
                    <span className="text-gray-400">({person.first_name})</span>
                  </div>
                ))}
              </div>
              <div>
                <textarea
                  value={groupMessage}
                  onChange={(e) => {
                    setGroupMessage(e.target.value);
                  }}
                  rows={4}
                  className="w-full border-2 rounded-md p-2"
                />
              </div>
              <div className="mt-3 flex justify-center">
                <div>
                  {groupPic && (
                    <img
                      alt=""
                      src={groupPic}
                      className="relative w-10 h-10 mr-2"
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <label
                    htmlFor="file-group-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600"
                  >
                    <span>
                      <PaperClipIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </span>
                    <input
                      onChange={handleGroupFileChange}
                      id="file-group-upload"
                      name="file-group-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    createGroupMessage();
                  }}
                  className="mx-2 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 圖片放大 */}
      <Dialog
        open={open}
        onClose={setOpen}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <img
                  src={selectedPic}
                  className="relative w-full"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 個人資訊 */}
      <Dialog
        open={personDialog}
        onClose={setPersonDialog}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-96 transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="h-full overflow-y-auto bg-white p-8">
                  <button
                    type="button"
                    onClick={() => setPersonDialog(false)}
                    className="absolute right-5 top-5 rounded-md text-gray-500 hover:text-pink-300"
                  >
                    <span className="absolute -inset-2.5" />
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6"
                    />
                  </button>
                  {person && (
                    <>
                      <div className="flex justify-center">
                        <div>
                          {person.user_pic ? (
                            <img
                              alt=""
                              src={person.user_pic}
                              className="relative size-40 flex-none rounded-full bg-gray-50"
                            />
                          ) : (
                            <UserCircleIcon
                              aria-hidden="true"
                              className="relative size-40 flex-none rounded-full bg-gray-50"
                            />
                          )}
                        </div>
                      </div>
                      <div className="text-center my-4 flex justify-center items-end">
                        <span className="mr-2"> {person.user_nick_name}</span>
                        <span className="mr-2 text-xs text-gray-400"> {person.first_name}</span>
                        {/* <PencilSquareIcon className="w-5 h-5 text-sky-400 cursor-pointer" /> */}
                      </div>
                      <div className="text-center my-4">
                        {person.name_list?.map((data, index) => {
                          if (data) {
                            const info = data.split("$$");
                            return (
                              <p
                                key={index}
                                className="truncate text-xs font-medium text-gray-400"
                              >
                                <span className="text-md text-blue-400 mx-2">{info[0]}</span>
                                <span className="mx-2">{info[1]}</span>
                                <span className="mx-2">{info[2]}</span>
                              </p>
                            );
                          }
                        })}
                      </div>
                      <div className="text-gray-600 font-medium text-lg py-1">歷史照片</div>
                      <div className="grid grid-cols-4 gap-2 h-96 overflow-auto px-2">
                        {pic.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="col-span-1"
                              onClick={() => {
                                setSelectedPic(item.pic);
                                setOpen(true);
                              }}
                            >
                              <img
                                src={`${item.pic}`}
                                className="relative w-full"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
      <div className="px-2 mx-auto">
        <div className="mt-8">
          <div className="grid grid-cols-4 gap-4 bg-white p-4">
            <div className="col-span-2">
              <div className="border-b border-gray-200">
                <div className="px-2 flex justify-between">
                  <nav className="-mb-px flex space-x-6">
                    <div
                      onClick={() => {
                        setTutoring(1);
                        tutoringId.current = 1;
                      }}
                      className={`${
                        tutoring == 1 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      } whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium cursor-pointer`}
                    >
                      多易
                    </div>
                    <div
                      onClick={() => {
                        setTutoring(2);
                        tutoringId.current = 2;
                      }}
                      className={`${
                        tutoring == 2 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      } whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium cursor-pointer`}
                    >
                      艾思
                    </div>
                    <div
                      onClick={() => {
                        setTutoring(3);
                        tutoringId.current = 3;
                      }}
                      className={`${
                        tutoring == 3 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      } whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium cursor-pointer`}
                    >
                      華而敦
                    </div>
                  </nav>
                  <div>
                    <input
                      className="ring-1 rounded-md p-2 text-xs w-60"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                      placeholder="學生、家長、年級、學校、標籤"
                    />
                    <button
                      type="button"
                      onClick={() => setGroupSendDialog(true)}
                      className="mx-2 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      群發
                    </button>
                  </div>
                </div>
              </div>
              <ul
                role="list"
                className="flex-1 divide-y divide-gray-200 overflow-y-auto"
              >
                {filteredParentList.map((person, index) => {
                  const name_list = person.name_list;
                  const tag_list = person.tag_list;
                  return (
                    <li
                      key={index}
                      className={`${messageInfo.current.room_id == person.room_id ? "bg-sky-100" : "bg-white"} relative hover:bg-blue-100 h-24 overflow-hidden cursor-pointer`}
                      onClick={() => {
                        if (person.room_id != messageInfo.current.room_id) {
                          setPerson(person);
                          setLimit(50);
                          setChangeSwitch(!wsState.current);
                          wsState.current = !wsState.current;
                          // getMessage(person.room_id);
                          getPic(person.room_id);
                          messageInfo.current.user_nick_name = person.user_nick_name;
                          messageInfo.current.user_pic = person.user_pic;
                          messageInfo.current.room_id = person.room_id;
                        }
                        setPersonDialog(true);
                      }}
                    >
                      <div className="px-2 py-3 grid grid-cols-12">
                        <div className="col-span-1">
                          <input
                            onClick={(e) => {
                              e.stopPropagation();

                              if (e.target.checked) {
                                setSelectPersonList([...selectPersonList, person]);
                              } else {
                                setSelectPersonList(selectPersonList.filter((item) => item.room_id != person.room_id));
                              }
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="col-span-2">
                          {name_list.map((data, index) => {
                            if (data) {
                              const info = data.split("$$");
                              return (
                                <p
                                  key={index}
                                  className="truncate"
                                >
                                  <span className="text-sm font-medium text-blue-400 mx-1"> {info[0]}</span>
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuery(info[2]);
                                    }}
                                    className="text-xs text-gray-400 hover:text-gray-700"
                                  >
                                    {info[2]}
                                  </span>
                                </p>
                              );
                            }
                          })}
                        </div>
                        <div className="col-span-2">
                          <p className="truncate text-sm font-medium text-gray-900">{person.user_nick_name}</p>
                          <p className="truncate text-xs font-medium text-gray-400">{person.first_name}</p>
                        </div>
                        <div className="col-span-7 mr-5">
                          {tag_list.map((tag, index) => {
                            if (tag) {
                              const value = tag.split("$$");
                              return (
                                <span
                                  key={index}
                                  style={{
                                    color: value[1],
                                    borderColor: value[1]
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuery(value[0]);
                                  }}
                                  className="whitespace-nowrap text-xs border-2 rounded-full px-2 py-1 m-1 leading-8 hover:opacity-30"
                                >
                                  {value[0]}
                                </span>
                              );
                            }
                          })}
                        </div>
                      </div>
                      {person.coalesce > 0 && (
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex justify-center items-center rounded-full bg-pink-400 text-gray-200">{person.coalesce}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-span-2">
              <div
                ref={messagesEndRef}
                className="h-screen-65 overflow-auto p-2 border-2 rounded-md"
              >
                <ul
                  role="list"
                  className="space-y-6"
                >
                  {message.map((item, index) => (
                    <li
                      key={item.id}
                      className="relative flex gap-x-4"
                    >
                      <div className={classNames(index === message.length - 1 ? "h-6" : "-bottom-6", "absolute left-0 top-0 flex w-6 justify-center")}>
                        <div className="w-px bg-gray-200" />
                      </div>
                      {item.type === "parent" ? (
                        <>
                          {!item.read_ids ? (
                            <div className="color-flicker relative mt-3 size-6 flex-none rounded-full bg-gray-50">NEW</div>
                          ) : (
                            <>
                              {messageInfo.current.user_pic ? (
                                <img
                                  alt=""
                                  src={messageInfo.current.user_pic}
                                  className="relative mt-3 size-6 flex-none rounded-full bg-gray-50"
                                />
                              ) : (
                                <UserCircleIcon
                                  aria-hidden="true"
                                  className="relative mt-3 size-6 flex-none rounded-full bg-gray-50"
                                />
                              )}
                            </>
                          )}

                          <div className="flex-auto rounded-md p-2 ring-1 ring-inset ring-sky-200">
                            <div className="flex justify-between gap-x-4">
                              <div className="py-0.5 text-xs/5 text-gray-500">
                                <span className="font-medium text-blue-600">{item.person.name}</span>
                                {item.pic && (
                                  <img
                                    alt=""
                                    src={`${item.pic}`}
                                    className="relative"
                                    onClick={() => {
                                      setSelectedPic(item.pic);
                                      setOpen(true);
                                    }}
                                  />
                                )}

                                <div dangerouslySetInnerHTML={{ __html: item.message?.replaceAll("\n", "<br/>") }} />
                              </div>
                              <time
                                dateTime={item.dateTime}
                                className="flex-none py-0.5 text-xs/5 text-gray-500"
                              >
                                <div className="hidden">{item.date}</div>
                                <div>{item.time}</div>
                              </time>
                            </div>
                            <p className="text-sm/6 text-gray-500">{item.comment}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                            {item.read_ids ? (
                              <CheckCircleIcon
                                aria-hidden="true"
                                className="size-5 text-green-600"
                              />
                            ) : (
                              <div className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                            )}
                          </div>
                          <div className="flex-auto rounded-md p-2 ring-1 ring-inset ring-gray-200">
                            <div className="flex justify-between gap-x-4">
                              <div className="py-0.5 text-xs/5 text-gray-500">
                                <span className="font-medium text-gray-600">{item.person.name}</span>
                                {item.pic && (
                                  <img
                                    alt=""
                                    src={`${item.pic}`}
                                    className="relative"
                                    onClick={() => {
                                      setSelectedPic(item.pic);
                                      setOpen(true);
                                    }}
                                  />
                                )}

                                <div dangerouslySetInnerHTML={{ __html: item.message?.replaceAll("\n", "<br/>") }} />
                              </div>
                              <time
                                dateTime={item.dateTime}
                                className="flex-none py-0.5 text-xs/5 text-gray-500"
                              >
                                <div className="hidden">{item.date}</div>
                                <div>{item.time}</div>
                              </time>
                            </div>
                            <p className="text-sm/6 text-gray-500">{item.comment}</p>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex gap-x-3">
                {tutoring == 1 ? (
                  <img
                    alt=""
                    src="/doyi.png"
                    className="size-6 flex-none rounded-full bg-gray-50"
                  />
                ) : tutoring == 2 ? (
                  <img
                    alt=""
                    src="/funapple2.png"
                    className="size-6 flex-none rounded-full bg-gray-50"
                  />
                ) : (
                  <img
                    alt=""
                    src="/funapple1.png"
                    className="size-6 flex-none rounded-full bg-gray-50"
                  />
                )}

                <div className="relative flex-auto">
                  <div className="overflow-hidden rounded-lg pb-12 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <textarea
                      value={messageStr}
                      onClick={() => {
                        if (messageInfo.current.room_id) {
                          readMessage({
                            room_id: messageInfo.current.room_id,
                            user_id: tutoringUserId[tutoring]
                          });
                        }
                      }}
                      onChange={(e) => {
                        setMessageStr(e.target.value);
                        msg.current = e.target.value.trim();
                      }}
                      rows={2}
                      className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <div className="flex items-center space-x-5">
                      <div className="flex items-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600"
                        >
                          <span>
                            {" "}
                            <PaperClipIcon
                              aria-hidden="true"
                              className="size-5"
                            />
                          </span>
                          <input
                            onChange={handleFileChange} // 綁定文件變更事件
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <Listbox
                        value={selected}
                        onChange={setSelected}
                      >
                        <Label className="sr-only">Your mood</Label>
                        <div className="relative">
                          <ListboxButton className="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                            <span className="flex items-center justify-center">
                              <span>
                                <FaceSmileIcon
                                  aria-hidden="true"
                                  className="size-5 shrink-0"
                                />
                              </span>
                            </span>
                          </ListboxButton>
                          <ListboxOptions
                            transition
                            className="grid grid-cols-12 absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:ml-auto sm:text-sm"
                          >
                            {moods.map((mood, index) => (
                              <ListboxOption
                                key={index}
                                onClick={() => {
                                  msg.current += mood;
                                  setMessageStr(messageStr + mood);
                                }}
                                className="relative cursor-default select-none bg-white data-[focus]:bg-gray-400"
                              >
                                <span>{mood}</span>
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </div>
                      </Listbox>
                    </div>
                    <button
                      onClick={() => {
                        if (messageInfo.current.room_id) {
                          createMessage(1);
                        } else {
                          setInfo({
                            show: true,
                            success: false,
                            msg: "請選擇傳送對象"
                          });
                        }
                      }}
                      type="submit"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      送出
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
