"use client";

import Billalert from "./billalert";
import { PopoverGroup, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaRegMoneyBillAlt, FaChalkboardTeacher, FaHandHoldingUsd } from "react-icons/fa";
import { MdProductionQuantityLimits, MdLocalActivity, MdOutlineLocalActivity } from "react-icons/md";
import { RiQuestionnaireFill, RiHomeOfficeFill } from "react-icons/ri";
import { GrDocumentVerified } from "react-icons/gr";
import { IoPeopleSharp } from "react-icons/io5";
import {
  MegaphoneIcon,
  UserMinusIcon,
  HomeIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  CogIcon,
  AdjustmentsVerticalIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UserGroupIcon,
  CalendarDateRangeIcon,
  MapPinIcon,
  VideoCameraIcon,
  DocumentCurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  DocumentCheckIcon,
  HandThumbDownIcon,
  UserPlusIcon,
  UsersIcon,
  TagIcon,
  ClipboardIcon,
  GiftIcon
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function Example() {
  const [user, setUser] = useState({});
  const [hidden_page, setHidden_page] = useState(0);

  const items = [
    {
      name: "建立",
      description: "建立使用者",
      href: "/admin/createuser",
      icon: UserPlusIcon,
      blank: false
    },
    {
      name: "家長",
      description: "家長資料修改",
      href: "/admin/parent",
      icon: UsersIcon,
      blank: false
    },
    {
      name: "學生",
      description: "學生資料修改",
      href: "/admin/student",
      icon: UserGroupIcon,
      blank: false
    },
    {
      name: "教師",
      description: "教師資料修改",
      href: "/admin/teacher",
      icon: FaChalkboardTeacher,
      blank: false
    },
    {
      name: "教師類型",
      description: "老師身份設定",
      href: "/admin/teacher/profile",
      icon: FaChalkboardTeacher,
      blank: false
    },
    {
      name: "帳號",
      description: "帳號列表、修改",
      href: "/admin/user",
      icon: UserIcon,
      blank: false
    },
    {
      name: "權限",
      description: "設定職位權限",
      href: "/admin/permission",
      icon: IoPeopleSharp,
      blank: false
    },
    {
      name: "標籤",
      description: "設定標籤",
      href: "/admin/tag",
      icon: TagIcon,
      blank: false
    }
  ];
  const items1 = [
    {
      name: "首頁",
      description: "當日課程、出席",
      href: "/admin",
      icon: RiHomeOfficeFill,
      blank: false
    },

    {
      name: "行事曆",
      description: "行事曆",
      href: "/admin/calender",
      icon: CalendarDateRangeIcon,
      blank: false
    },

    {
      name: "教室",
      description: "設定教室資訊",
      href: "/admin/classroom",
      icon: HomeIcon,
      blank: false
    },

    // {
    //   name: "課程群組",
    //   description: "課程類別設定",
    //   href: "/admin/coursegroupsetting",
    //   icon: AcademicCapIcon,
    //   blank: false
    // },
    {
      name: "課程",
      description: "課程搜尋、新增課程內容、修改課程、刪除課程",
      href: "/admin/coursesetting",
      icon: AcademicCapIcon,
      blank: false
    },
    {
      name: "排課",
      description: "選擇課程、設定課程時間、設定課程老師、設定課程學生",
      href: "/admin/schedule",
      icon: BookOpenIcon,
      blank: false
    },
    {
      name: "錄影",
      description: "錄影排程設定",
      href: "/admin/video",
      icon: VideoCameraIcon,
      blank: false
    },

    {
      name: "公告",
      description: "公告通知設定",
      href: "/admin/announcement",
      icon: MegaphoneIcon,
      blank: false
    }
  ];
  const items2 = [
    // {
    //   name: "問班表路徑",
    //   description: "問班表網址、QRcode",
    //   href: `/admin/askurl`,
    //   icon: MdLocalActivity,
    //   blank: false
    // },
    {
      name: "追蹤紀錄",
      description: "問班表查詢結果",
      href: `/admin/preparation`,
      icon: RiQuestionnaireFill,
      blank: true
    },
    {
      name: "課程選取",
      description: "選取問班表中的感興趣課程",
      href: "/admin/askcoursesetting",
      icon: CogIcon,
      blank: false
    },
    {
      name: "學校設定",
      description: "設定問班表中的區域學校的顯示順序",
      href: "/admin/schoolsetting",
      icon: AdjustmentsVerticalIcon,
      blank: false
    },
    {
      name: "來源設定",
      description: "選取問班表中的問班資訊來源",
      href: "/admin/infosrcsetting",
      icon: QuestionMarkCircleIcon,
      blank: false
    }
  ];
  const items3 = [
    // {
    //   name: "活動列表",
    //   description: "活動、問券表單填寫結果",
    //   href: `https://tutoring.fjbcgroup.com/autoactivity/admin/list`,
    //   icon: MdOutlineLocalActivity,
    //   blank: true
    // },
    // {
    //   name: "表單回覆",
    //   description: "活動、問券表單填寫結果",
    //   href: `https://tutoring.fjbcgroup.com/autoactivity/admin/view`,
    //   icon: MdOutlineLocalActivity,
    //   blank: true
    // },
    {
      name: "表單回覆，歸檔",
      description: "活動、問券表回條",
      href: `/admin/activity`,
      icon: MdLocalActivity,
      blank: false
    },
    {
      name: "活動列表",
      description: "活動、問券狀態列表",
      href: `/admin/activity/list`,
      icon: MdLocalActivity,
      blank: false
    },
    {
      name: "活動建立",
      description: "表單建立",
      href: `/admin/activity/create`,
      icon: MdOutlineLocalActivity,
      blank: false
    }
  ];
  const items4 = [
    {
      name: "繳費",
      description: "學生課程費用計算、繳費單列印",
      href: "/admin/payment",
      icon: CurrencyDollarIcon,
      blank: false
    },
    {
      name: "採購單",
      description: "採購單確認",
      href: "/admin/purchase",
      icon: GrDocumentVerified,
      blank: false
    },
    {
      name: "商品",
      description: "庫存商品、禮物設定",
      href: "/admin/product",
      icon: MdProductionQuantityLimits,
      blank: false
    },
    {
      name: "借出",
      description: "書本文具借出紀錄",
      href: "/admin/lend",
      icon: FaHandHoldingUsd,
      blank: false
    },
    {
      name: "庫存管理",
      description: "進貨銷貨紀錄",
      href: "/admin/stock",
      icon: FaRegMoneyBillAlt,
      blank: false
    },
    {
      name: "零用金",
      description: "零用金記錄表",
      href: "/admin/bill",
      icon: LiaFileInvoiceDollarSolid,
      blank: false
    },
    {
      name: "訂餐",
      description: "訂餐紀錄",
      href: "/admin/meal",
      icon: LiaFileInvoiceDollarSolid,
      blank: false
    },
    {
      name: "報表",
      description: "相關報表",
      href: "/admin/wage",
      icon: DocumentCurrencyDollarIcon,
      blank: false
    }
  ];
  const items5 = [
    {
      name: "出席點名",
      description: "點名、出席、手動簽到、補點",
      href: "/admin/pointer",
      icon: MapPinIcon,
      blank: false
    },
    {
      name: "聊天室",
      description: "家長訊息",
      href: "/admin/message",
      icon: ChatBubbleLeftRightIcon,
      blank: false
    },
    {
      name: "請假",
      description: "補課列表",
      href: "/admin/leave",
      icon: UserMinusIcon,
      blank: false
    },
    {
      name: "教師日誌",
      description: "教師日誌填寫",
      href: "/admin/teachercontactbook",
      icon: ClipboardIcon,
      blank: false
    },
    {
      name: "聯絡簿",
      description: "聯絡簿欄位設定，家長回覆",
      href: "/admin/contactbook",
      icon: BookOpenIcon,
      blank: false
    },
    {
      name: "成績",
      description: "學生成績單",
      href: "/admin/exam",
      icon: DocumentCheckIcon,
      blank: false
    },
    {
      name: "補課",
      description: "補課資料",
      href: "/admin/makeup",
      icon: HandThumbDownIcon,
      blank: false
    },
    {
      name: "點數對換",
      description: "加扣點、禮物兌換",
      href: "/admin/point",
      icon: GiftIcon,
      blank: false
    }
  ];

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const client_id = localStorage.getItem("client_id");
    if (!!!access_token && !!!client_id) {
      window.location.href = "/";
    }

    setUser({
      name: localStorage.getItem("name"),
      photo: localStorage.getItem("photo")
    });

    setInterval(() => {
      setHidden_page(0);
    }, 1500);
  }, []);

  useEffect(() => {
    if (hidden_page > 5) {
      window.location.href = "/engineer/setting/ipaddress";
    }
  }, [hidden_page]);

  return (
    <header className="relative isolate z-10 bg-white sticky top-0">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between py-3 px-6"
      >
        <div className="flex mr-12">
          <a
            onClick={() => {
              setHidden_page(hidden_page + 1);
            }}
            className="-m-1.5 p-1.5"
          >
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="/FJBC_Logo.png"
              className="h-10 w-auto"
            />
          </a>
        </div>
        <PopoverGroup className="flex gap-x-6">
          <Popover>
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              補習班
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">
                {items1.map((item) => (
                  <div
                    key={item.name}
                    className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50 flex lg:block items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <a
                      href={item.href}
                      className=" block font-semibold text-gray-900"
                    >
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="hidden lg:flex mt-1 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Popover>
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              班務
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">
                {items5.map((item) => (
                  <div
                    key={item.name}
                    className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50 flex lg:block items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <a
                      href={item.href}
                      className=" block font-semibold text-gray-900"
                    >
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="hidden lg:flex mt-1 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Popover>
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              人員
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50 flex lg:block items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <a
                      href={item.href}
                      className=" block font-semibold text-gray-900"
                    >
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="hidden lg:flex mt-1 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Popover>
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              問班
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">
                {items2.map((item) => (
                  <div
                    key={item.name}
                    className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50 flex lg:block items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <a
                      href={item.href}
                      className=" block font-semibold text-gray-900"
                    >
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="hidden lg:flex mt-1 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Popover>
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              活動
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">
                {items3.map((item) => (
                  <div
                    key={item.name}
                    className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50 flex lg:block items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <a
                      href={item.href}
                      target={item.blank ? "_blank" : ""}
                      className=" block font-semibold text-gray-900"
                    >
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="hidden lg:flex mt-1 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Popover>
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              財務/報表
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">
                {items4.map((item) => (
                  <div
                    key={item.name}
                    className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50 flex lg:block items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <a
                      href={item.href}
                      className=" block font-semibold text-gray-900"
                    >
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="hidden lg:flex mt-1 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>

        <div className="flex flex-1 justify-end">
          <Billalert />
        </div>

        <div
          onClick={() => {
            window.location.href = "/admin/profile";
          }}
          className="flex justify-end cursor-pointer ml-12"
        >
          {user.name}
        </div>
      </nav>
    </header>
  );
}
