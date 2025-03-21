"use client";

import { useEffect, useRef, useState } from "react";
import { error } from "../../../utils";

export default function Home({ setInfo }) {
  const perm_id = useRef();
  const [uuidList, setUuidList] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  function handelUUid(uuid) {
    if (uuidList.some((i) => i == uuid)) {
      setUuidList(uuidList.filter((i) => i != uuid));
    } else {
      setUuidList([...uuidList, uuid]);
    }
  }

  async function submit() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        perm_id: perm_id.current,
        items: uuidList
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/permission/detail`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getPermDetail();
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function deletePerm() {
    const check = confirm(`確定要刪除 ${title} 嗎？`);
    if (!check) {
      return;
    }
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        perm_id: perm_id.current
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/permission`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      window.location.href = "/admin/permission";
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getPermDetail() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/user/permission/detail/list?perm_id=${perm_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      setTitle(res.perm_name);
      setUuidList(res.perm_detail?.map((i) => i.uuid));
      setLoading(false);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    perm_id.current = Number(id);
    getPermDetail();
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
      <div className="text-2xl my-4 flex justify-between items-center">
        <span>權限名稱：{title}</span>
        <span>
          <button
            onClick={submit}
            type="button"
            className="mx-1 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            儲存
          </button>
          <button
            onClick={deletePerm}
            type="button"
            className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            刪除
          </button>
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">薪資</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "adb16a4e-dacd-381e-20a0-26e9fb49ea53")}
                    onChange={() => {
                      handelUUid("adb16a4e-dacd-381e-20a0-26e9fb49ea53");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">薪資、明細表查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "55ce8c5a-0938-7c7d-a715-b5f334406b20")}
                    onChange={() => {
                      handelUUid("55ce8c5a-0938-7c7d-a715-b5f334406b20");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">教師身份新增</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "db31f4b0-4389-c23d-8160-f67bbb7d98bb")}
                    onChange={() => {
                      handelUUid("db31f4b0-4389-c23d-8160-f67bbb7d98bb");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">時數、薪資調整</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "8623e489-d2a0-7b20-623a-a7d7078d4d03")}
                    onChange={() => {
                      handelUUid("8623e489-d2a0-7b20-623a-a7d7078d4d03");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">教師身份開關</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "63ebaa09-c7c6-5a4a-5832-71c823b29410")}
                    onChange={() => {
                      handelUUid("63ebaa09-c7c6-5a4a-5832-71c823b29410");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">到校報表查詢</label>
                  <p className="text-gray-500">教師到校紀錄</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "f9b9efcf-641d-7f70-72b2-ce50c556e62b")}
                    onChange={() => {
                      handelUUid("f9b9efcf-641d-7f70-72b2-ce50c556e62b");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">到校報表審核</label>
                  <p className="text-gray-500">教師到校紀錄審核</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">帳號列表</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "25408f44-8244-6089-da74-46af017cd2d9")}
                    onChange={() => {
                      handelUUid("25408f44-8244-6089-da74-46af017cd2d9");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">學生</label>
                  <p className="text-gray-500">學生帳號讀取</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "8c274cd4-df8d-bdbd-c7d9-929fb8689d3e")}
                    onChange={() => {
                      handelUUid("8c274cd4-df8d-bdbd-c7d9-929fb8689d3e");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">老師</label>
                  <p className="text-gray-500">老師帳號讀取</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "8bea3c13-b365-8e88-4593-1683fb648b00")}
                    onChange={() => {
                      handelUUid("8bea3c13-b365-8e88-4593-1683fb648b00");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">家長</label>
                  <p className="text-gray-500">家長帳號讀取</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "266af649-349b-d7c7-6845-af0e89582fc9")}
                    onChange={() => {
                      handelUUid("266af649-349b-d7c7-6845-af0e89582fc9");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">帳號修改、開起</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">出席</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "638a1a66-4ddb-5b97-9aef-e46293fce8b0")}
                    onChange={() => {
                      handelUUid("638a1a66-4ddb-5b97-9aef-e46293fce8b0");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "3772fcef-a1c6-3e90-a0b1-0f60ff194220")}
                    onChange={() => {
                      handelUUid("3772fcef-a1c6-3e90-a0b1-0f60ff194220");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "896fbd81-9e93-b244-38e9-7224daadb0e0")}
                    onChange={() => {
                      handelUUid("896fbd81-9e93-b244-38e9-7224daadb0e0");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "3a229ef0-a137-d639-833b-9528d637ed04")}
                    onChange={() => {
                      handelUUid("3a229ef0-a137-d639-833b-9528d637ed04");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">點名</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "70c44d06-ae28-fbb4-5ba1-a6cca3a4a4fe")}
                    onChange={() => {
                      handelUUid("70c44d06-ae28-fbb4-5ba1-a6cca3a4a4fe");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "64e5236b-e716-3d4d-0ff5-915b62cfc40b")}
                    onChange={() => {
                      handelUUid("64e5236b-e716-3d4d-0ff5-915b62cfc40b");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "9bb3f682-5dd7-74d6-1838-9847ab078a6c")}
                    onChange={() => {
                      handelUUid("9bb3f682-5dd7-74d6-1838-9847ab078a6c");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "c71b5077-f653-d0de-51bd-359eea03930d")}
                    onChange={() => {
                      handelUUid("c71b5077-f653-d0de-51bd-359eea03930d");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">問班</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "01c28c0a-07cd-c213-94d3-fada3c8a5657")}
                    onChange={() => {
                      handelUUid("01c28c0a-07cd-c213-94d3-fada3c8a5657");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">問班資料查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "ec4237a7-4158-c47e-0b25-29862392ff1d")}
                    onChange={() => {
                      handelUUid("ec4237a7-4158-c47e-0b25-29862392ff1d");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">問班備註新增</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "a1723dce-3980-4e43-fba0-0d3c6132f0c4")}
                    onChange={() => {
                      handelUUid("a1723dce-3980-4e43-fba0-0d3c6132f0c4");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">問班備註修改、問班表拒絕</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "bbe98767-c57c-7cb5-f86d-a0d55193c24b")}
                    onChange={() => {
                      handelUUid("bbe98767-c57c-7cb5-f86d-a0d55193c24b");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">問班備註刪除</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">活動</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "18142189-c498-bc0d-fec8-35b640043e21")}
                    onChange={() => {
                      handelUUid("18142189-c498-bc0d-fec8-35b640043e21");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">活動回條查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "705891af-9845-9d0b-62af-3f8395a12471")}
                    onChange={() => {
                      handelUUid("705891af-9845-9d0b-62af-3f8395a12471");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">寫入學生活動</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "cc5f7bc1-c831-c816-d7e8-2ce0463c3fd5")}
                    onChange={() => {
                      handelUUid("cc5f7bc1-c831-c816-d7e8-2ce0463c3fd5");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">暫無功能</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "0b900323-7100-4846-92e4-73ecf2a844a1")}
                    onChange={() => {
                      handelUUid("0b900323-7100-4846-92e4-73ecf2a844a1");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">暫無功能</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">課程</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "1c04a233-b9a1-791f-2c42-15c6b0f7fd89")}
                    onChange={() => {
                      handelUUid("1c04a233-b9a1-791f-2c42-15c6b0f7fd89");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">課程、課表、排課相關查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "7ec710af-8f90-c7ab-437e-cbbf9a771d88")}
                    onChange={() => {
                      handelUUid("7ec710af-8f90-c7ab-437e-cbbf9a771d88");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">課程、課表、排課相關新增</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "9ea41a92-d1c1-9f5a-4351-33e2213af9da")}
                    onChange={() => {
                      handelUUid("9ea41a92-d1c1-9f5a-4351-33e2213af9da");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">課程、課表、排課相關修改</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "c397feef-e1c5-fbed-7505-0c786c8c042c")}
                    onChange={() => {
                      handelUUid("c397feef-e1c5-fbed-7505-0c786c8c042c");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">關閉課程、關閉課表科目</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "8ea5f23f-e052-c41e-4e1a-149120151239")}
                    onChange={() => {
                      handelUUid("8ea5f23f-e052-c41e-4e1a-149120151239");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">紀錄</label>
                  <p className="text-gray-500">修改已上過課程</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">教室</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "ba520e85-0b85-b25c-95ef-207bb1b934a0")}
                    onChange={() => {
                      handelUUid("ba520e85-0b85-b25c-95ef-207bb1b934a0");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">教室列表查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "42934673-ee37-93ba-ec61-86529528d376")}
                    onChange={() => {
                      handelUUid("42934673-ee37-93ba-ec61-86529528d376");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">新增教室</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "15ab1e1c-766b-d993-0736-ab4b7551cafe")}
                    onChange={() => {
                      handelUUid("15ab1e1c-766b-d993-0736-ab4b7551cafe");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">修改教室資料</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "b795e4f3-2e73-bab9-84e9-6763a7d3dca6")}
                    onChange={() => {
                      handelUUid("b795e4f3-2e73-bab9-84e9-6763a7d3dca6");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">刪除教室</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">教師</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "972483b5-814f-d06e-33e2-78132effd791")}
                    onChange={() => {
                      handelUUid("972483b5-814f-d06e-33e2-78132effd791");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">教師列表查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "dc3d662f-f916-8d8d-a7b7-63c9069e7025")}
                    onChange={() => {
                      handelUUid("dc3d662f-f916-8d8d-a7b7-63c9069e7025");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">新增教師資料</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "8e774dd9-2c7b-4c1e-0891-04a24fb6c8ce")}
                    onChange={() => {
                      handelUUid("8e774dd9-2c7b-4c1e-0891-04a24fb6c8ce");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">修改教師資料</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "1f3522e3-3120-16d6-54b9-5ce76e646f89")}
                    onChange={() => {
                      handelUUid("1f3522e3-3120-16d6-54b9-5ce76e646f89");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">離職設定</p>
                </div>
              </div>
              {/* <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        checked={uuidList.some((i) => i == "017865a2-59ca-1df0-a902-5a924d57cb09")}
                        onChange={() => {
                          handelUUid("017865a2-59ca-1df0-a902-5a924d57cb09");
                        }}
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label className="font-medium text-gray-900">薪資</label>
                      <p className="text-gray-500">設定各職位時薪</p>
                    </div>
                  </div> */}
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">餐費</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "2fe328ec-f5b0-8bcd-761a-2f78cd3a4e26")}
                    onChange={() => {
                      handelUUid("2fe328ec-f5b0-8bcd-761a-2f78cd3a4e26");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">餐費查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "89050558-1ef8-3773-d676-8a247c9c5bfa")}
                    onChange={() => {
                      handelUUid("89050558-1ef8-3773-d676-8a247c9c5bfa");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">餐費新增</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "4bc321de-6fd4-4620-48c1-90a0d816b975")}
                    onChange={() => {
                      handelUUid("4bc321de-6fd4-4620-48c1-90a0d816b975");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">餐費內容修改</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "bc26164e-3357-9fcb-82aa-0acb4ad2bfd9")}
                    onChange={() => {
                      handelUUid("bc26164e-3357-9fcb-82aa-0acb4ad2bfd9");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">餐費關閉修改</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">學生</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "97c92147-981c-7a6c-3390-3d63b193b863")}
                    onChange={() => {
                      handelUUid("97c92147-981c-7a6c-3390-3d63b193b863");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">學生列表</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "6de90ff8-839f-3fe6-d641-9cd509440aed")}
                    onChange={() => {
                      handelUUid("6de90ff8-839f-3fe6-d641-9cd509440aed");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">增加學生資料、問班表轉入</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "b37e6b40-f279-e15a-a293-590b944417f0")}
                    onChange={() => {
                      handelUUid("b37e6b40-f279-e15a-a293-590b944417f0");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">修改學生紀錄基本資料</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "71a13c46-f821-17c5-e68a-9104faf87da5")}
                    onChange={() => {
                      handelUUid("71a13c46-f821-17c5-e68a-9104faf87da5");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">刪除訪談紀錄</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">繳費</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "d1678b05-3e0d-fa0b-694c-853f04670b05")}
                    onChange={() => {
                      handelUUid("d1678b05-3e0d-fa0b-694c-853f04670b05");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">繳費、訂金、優惠券查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "561dff15-a668-51ec-86ed-40d054f704ae")}
                    onChange={() => {
                      handelUUid("561dff15-a668-51ec-86ed-40d054f704ae");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">新增繳費明細、收據、優惠券、訂金</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "016399ae-824d-0bd0-d789-4d2e53f8e571")}
                    onChange={() => {
                      handelUUid("016399ae-824d-0bd0-d789-4d2e53f8e571");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">暫無功能</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "ffeb7347-0558-cc8d-bf46-9d1d4fd90605")}
                    onChange={() => {
                      handelUUid("ffeb7347-0558-cc8d-bf46-9d1d4fd90605");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">註銷繳費單</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "a5bb34c9-7ac7-3b8c-c404-26261613d7b8")}
                    onChange={() => {
                      handelUUid("a5bb34c9-7ac7-3b8c-c404-26261613d7b8");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">送審</label>
                  <p className="text-gray-500">退款送審</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">權限</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "b6131f6d-3a0f-0713-9bd8-57f4d3839768")}
                    onChange={() => {
                      handelUUid("b6131f6d-3a0f-0713-9bd8-57f4d3839768");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">角色、使用者權限查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "fc7a045a-e57d-9f41-8446-4493887ec39b")}
                    onChange={() => {
                      handelUUid("fc7a045a-e57d-9f41-8446-4493887ec39b");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">新增角色</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "12c0298c-eb51-2324-dd37-5b258dbdeece")}
                    onChange={() => {
                      handelUUid("12c0298c-eb51-2324-dd37-5b258dbdeece");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">修改角色權限、賦予使用者權限</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "2fae9311-839b-c4c2-e0a3-1acfef26497f")}
                    onChange={() => {
                      handelUUid("2fae9311-839b-c4c2-e0a3-1acfef26497f");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">刪除角色</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">商品</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "1b882f16-3516-00b7-c441-adb51d1395a5")}
                    onChange={() => {
                      handelUUid("1b882f16-3516-00b7-c441-adb51d1395a5");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">商品查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "42889ad4-336d-25bf-cfa7-7276c0a84ec4")}
                    onChange={() => {
                      handelUUid("42889ad4-336d-25bf-cfa7-7276c0a84ec4");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">商品建立</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "094332e8-a119-f6b9-21fc-8f806d68b5b5")}
                    onChange={() => {
                      handelUUid("094332e8-a119-f6b9-21fc-8f806d68b5b5");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">商品修改</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "d65cbf1b-ec4f-e6a8-0d49-2406dde901cc")}
                    onChange={() => {
                      handelUUid("d65cbf1b-ec4f-e6a8-0d49-2406dde901cc");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">刪除商品</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">庫存</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "9a895946-ca91-72ed-70c0-57a79d75f195")}
                    onChange={() => {
                      handelUUid("9a895946-ca91-72ed-70c0-57a79d75f195");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">租借、庫存查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "3f84ee37-628a-cf66-ad64-450e42229249")}
                    onChange={() => {
                      handelUUid("3f84ee37-628a-cf66-ad64-450e42229249");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">租借、庫存建立</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "4234053d-a60b-689d-eb5b-672c3bfdcbec")}
                    onChange={() => {
                      handelUUid("4234053d-a60b-689d-eb5b-672c3bfdcbec");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">庫存調貨、租借歸還</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "37aa365a-80d7-4f68-9340-bc588784175b")}
                    onChange={() => {
                      handelUUid("37aa365a-80d7-4f68-9340-bc588784175b");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">刪除庫存紀錄</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "33bd6db1-87e8-851d-0690-a035ca108923")}
                    onChange={() => {
                      handelUUid("33bd6db1-87e8-851d-0690-a035ca108923");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">總倉</label>
                  <p className="text-gray-500">總倉庫管理權</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">零用金</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "e58b91c7-3dc9-ecc4-a7fb-fd09065d462c")}
                    onChange={() => {
                      handelUUid("e58b91c7-3dc9-ecc4-a7fb-fd09065d462c");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">零用金查詢</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "32f64da2-c50f-e33d-d0e4-b704b272e6e9")}
                    onChange={() => {
                      handelUUid("32f64da2-c50f-e33d-d0e4-b704b272e6e9");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">零用金建立</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "22d1082b-d912-9a1f-fbf9-1acb761a1f09")}
                    onChange={() => {
                      handelUUid("22d1082b-d912-9a1f-fbf9-1acb761a1f09");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">修改商品明細、內容</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "0777781b-e2e4-7a68-ce55-2a9eec682d3b")}
                    onChange={() => {
                      handelUUid("0777781b-e2e4-7a68-ce55-2a9eec682d3b");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">刪除</label>
                  <p className="text-gray-500">刪除零用金紀錄</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "2a99e0eb-73f8-4b7d-bcbb-534d308d37cf")}
                    onChange={() => {
                      handelUUid("2a99e0eb-73f8-4b7d-bcbb-534d308d37cf");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">送審</label>
                  <p className="text-gray-500">送審零用金資料</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="coi-span-1 p-2">
          <fieldset>
            <legend className="text-xl border-b-2 border-indigo-500 px-3 mb-2">採購</legend>
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "f7dbe62a-da74-04f8-1252-9ff9cbe18955")}
                    onChange={() => {
                      handelUUid("f7dbe62a-da74-04f8-1252-9ff9cbe18955");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">讀取</label>
                  <p className="text-gray-500">採購單瀏覽</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "a00a71e6-8a3c-ad8a-b70a-a5d2915466d4")}
                    onChange={() => {
                      handelUUid("a00a71e6-8a3c-ad8a-b70a-a5d2915466d4");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">新增</label>
                  <p className="text-gray-500">採購單申請</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "97f3b45f-9ed3-6b40-769f-a318e0da4d5e")}
                    onChange={() => {
                      handelUUid("97f3b45f-9ed3-6b40-769f-a318e0da4d5e");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">修改</label>
                  <p className="text-gray-500">確認金額、品項</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "5df830e6-2465-2b7d-781a-5972b3df9a7c")}
                    onChange={() => {
                      handelUUid("5df830e6-2465-2b7d-781a-5972b3df9a7c");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">初審</label>
                  <p className="text-gray-500">確認採購單是否需要</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "e2e74a00-a96b-8128-990c-b22718b31ad0")}
                    onChange={() => {
                      handelUUid("e2e74a00-a96b-8128-990c-b22718b31ad0");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">複審</label>
                  <p className="text-gray-500">確認採購金額可以購買</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    checked={uuidList.some((i) => i == "1429287a-ba43-252b-9953-9f3a87071f2f")}
                    onChange={() => {
                      handelUUid("1429287a-ba43-252b-9953-9f3a87071f2f");
                    }}
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-gray-900">結案</label>
                  <p className="text-gray-500">購買完成關閉採購單</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}
