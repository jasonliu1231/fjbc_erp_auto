"use client";

import { useEffect, useState } from "react";
import { error } from "../../../utils";

const history = [
  { id: "h1", name: "無", en_name: "None" },
  { id: "h2", name: "氣喘", en_name: "Asthma" },
  { id: "h3", name: "易流鼻血", en_name: "Nosebleeds" },
  { id: "h4", name: "過敏體質", en_name: "Allergic tendency" },
  { id: "h5", name: "癲癇", en_name: "Epilepsy" },
  { id: "h6", name: "蠶豆症", en_name: "Favism" },
  { id: "h7", name: "心臟病", en_name: "Heart disease" },
  { id: "h8", name: "肝炎Ａ型", en_name: "Hepatitis A" },
  { id: "h9", name: "肝炎Ｂ型", en_name: "Hepatitis B" },
  { id: "h10", name: "肝炎Ｃ型", en_name: "Hepatitis C" },
  { id: "h11", name: "過敏", en_name: "Allergy" }
];
const mom_style = [
  { id: "ms1", name: "關懷管理", en_name: "Care" },
  { id: "ms2", name: "開明管理", en_name: "Open" },
  { id: "ms3", name: "權威管理", en_name: "Authoritarian" },
  { id: "ms4", name: "自主發展", en_name: "Autonomous" },
  { id: "ms5", name: "較少陪伴", en_name: "Less time spent" }
];
const dad_style = [
  { id: "ds1", name: "關懷管理", en_name: "Care" },
  { id: "ds2", name: "開明管理", en_name: "Open" },
  { id: "ds3", name: "權威管理", en_name: "Authoritarian" },
  { id: "ds4", name: "自主發展", en_name: "Autonomous" },
  { id: "ds5", name: "較少陪伴", en_name: "Less time spent" }
];
const life = [
  { id: "l1", name: "整潔", en_name: "Clean" },
  { id: "l2", name: "勤勞", en_name: "Diligent" },
  { id: "l3", name: "節儉", en_name: "Frugal" },
  { id: "l4", name: "骯髒", en_name: "Dirty" },
  { id: "l5", name: "懶惰", en_name: "Lazy" },
  { id: "l6", name: "浪費", en_name: "Wasteful" },
  { id: "l7", name: "作息有規律", en_name: "Regular schedule" },
  { id: "l8", name: "作息無規律", en_name: "Irregular schedule" }
];
const relationships = [
  { id: "r1", name: "和氣", en_name: "Friendly" },
  { id: "r2", name: "合群", en_name: "Sociable" },
  { id: "r3", name: "活潑", en_name: "Energetic" },
  { id: "r4", name: "信賴他人", en_name: "Trusting" },
  { id: "r5", name: "好爭吵", en_name: "Argumentative" },
  { id: "r6", name: "自我", en_name: "Self-centered" },
  { id: "r7", name: "冷漠", en_name: "Aloof" },
  { id: "r8", name: "不合群", en_name: "Unsociable" }
];
const introvert = [
  { id: "i1", name: "領導力強", en_name: "Strong leadership" },
  { id: "i2", name: "健談", en_name: "Talkative" },
  { id: "i3", name: "慷慨", en_name: "Generous" },
  { id: "i4", name: "熱心公務", en_name: "Enthusiastic about public affairs" },
  { id: "i5", name: "欺負同學", en_name: "Bullying classmates" },
  { id: "i6", name: "常講粗話", en_name: "Often uses vulgar language" },
  { id: "i7", name: "好遊蕩", en_name: "Wanders around" },
  { id: "i8", name: "愛唱反調", en_name: "Rebellious" }
];
const extrovert = [
  { id: "e1", name: "謹慎", en_name: "Cautious" },
  { id: "e2", name: "文靜", en_name: "Quiet" },
  { id: "e3", name: "自信", en_name: "Confident" },
  { id: "e4", name: "情緒穩定", en_name: "Emotionally stable" },
  { id: "e5", name: "畏縮", en_name: "Timid" },
  { id: "e6", name: "過分沈默", en_name: "Excessively silent" },
  { id: "e7", name: "過分依賴", en_name: "Overly dependent" },
  { id: "e8", name: "多愁善感", en_name: "Sentimental" }
];
const learning = [
  { id: "le1", name: "專心", en_name: "Focused" },
  { id: "le2", name: "積極努力", en_name: "Proactive and hardworking" },
  { id: "le3", name: "有恆心", en_name: "Persistent" },
  { id: "le4", name: "沈思好問", en_name: "Thoughtful and inquisitive" },
  { id: "le5", name: "分心", en_name: "Distracted" },
  { id: "le6", name: "被動馬虎", en_name: "Passive and careless" },
  { id: "le7", name: "半途而廢", en_name: "Gives up halfway" },
  { id: "le8", name: "偏好某科", en_name: "Preference for certain subjects" }
];

export default function Home({ student_id, setInfo }) {
  const [select, setSelect] = useState([]);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  function handelSelect(id) {
    if (select.some((i) => i == id)) {
      setSelect(select.filter((i) => i != id));
    } else {
      setSelect([...select, id]);
    }
  }

  async function saveAptitude() {
    setLoading(true);
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ student_id: student_id, select: select, version: version, test: Math.random() })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/aptitude/${student_id}`, config);
    const res = await response.json();
    if (response.ok) {
      getAptitude();
      setUpdate(false);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getAptitude() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/aptitude/${student_id}`, config);
    const res = await response.json();
    if (response.ok) {
      if (res.length) {
        setSelect(res.map((i) => i.selectid));
        setVersion(res[0].version);
      }

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

  useEffect(() => {
    if (student_id != 0) {
      getAptitude();
    }
  }, [student_id]);

  return (
    <>
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl px-4 py-2">
            <span className="flex justify-end p-2">
              <button
                onClick={() => {
                  setUpdate(!update);
                }}
                type="button"
                className="relative inline-flex items-center rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-gray-900"
              >
                {`${update ? " 瀏覽" : "修改"}`}
              </button>
            </span>
            {update ? (
              <div className="">
                <div>
                  <label className="mt-2 text-md font-medium text-sky-500">
                    身體將康狀況、過敏，需補習班留意<span className="text-gray-400">(History)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {history.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-400">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    母親管教方式<span className="text-gray-400">(Mother’s parenting approach)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {mom_style.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-400">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    父親管教方式<span className="text-gray-400">(Father’s parenting approach)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {dad_style.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-400">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    生活習慣<span className="text-gray-400">(Life)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {life.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-400">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    人際關係<span className="text-gray-400">(Interpersonal relationships)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {relationships.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-400">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    外向行為<span className="text-gray-400">(Introvert)</span>
                  </label>
                  <div className="grid grid-cols-4 border rounded-md px-2 py-1">
                    {introvert.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-400">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    內向行為<span className="text-gray-400">(Extrovert)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {extrovert.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-400">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    學習狀況<span className="text-gray-400">(Learning)</span>
                  </label>
                  <div className="grid grid-cols-4 border rounded-md px-2 py-1">
                    {learning.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center col-span-1"
                      >
                        <div>
                          <input
                            checked={select.some((ii) => ii == i.id)}
                            onChange={() => {
                              handelSelect(i.id);
                            }}
                            type="checkbox"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="ml-4 p-1">
                          <div className="text-gray-700 text-sm">
                            {i.name}
                            <div className="text-gray-500">{i.en_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex justify-center">
                  <button
                    onClick={() => {
                      saveAptitude();
                    }}
                    type="button"
                    className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-green-900 ring-1 ring-inset ring-green-300 hover:bg-green-300 focus:z-10"
                  >
                    儲存
                  </button>
                </div>
              </div>
            ) : (
              <div className="">
                <div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    身體將康狀況、過敏，需補習班留意<span className="text-gray-400">(History)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1 mb-4">
                    {history.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-700">
                              {i.name}
                              <div className="text-gray-500">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    母親管教方式<span className="text-gray-400">(Mother’s parenting approach)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {mom_style.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-700">
                              {i.name}
                              <div className="text-gray-400">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    父親管教方式<span className="text-gray-400">(Father’s parenting approach)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {dad_style.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-700 text-md">
                              {i.name}
                              <div className="text-gray-400">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    生活習慣<span className="text-gray-400">(Life)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {life.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-700 text-md">
                              {i.name}
                              <div className="text-gray-400">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                <div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    人際關係<span className="text-gray-400">(Interpersonal relationships)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {relationships.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-700">
                              {i.name}
                              <div className="text-gray-400">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    外向行為<span className="text-gray-400">(Introvert)</span>
                  </label>
                  <div className="grid grid-cols-4 border rounded-md px-2 py-1">
                    {introvert.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-700">
                              {i.name}
                              <div className="text-gray-400">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    內向行為<span className="text-gray-400">(Extrovert)</span>
                  </label>
                  <div className="grid grid-cols-6 border rounded-md px-2 py-1">
                    {extrovert.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-700">
                              {i.name}
                              <div className="text-gray-400">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <label className="mt-2 block text-md font-medium text-sky-500">
                    學習狀況<span className="text-gray-400">(Learning)</span>
                  </label>
                  <div className="grid grid-cols-4 border rounded-md px-2 py-1">
                    {learning.map((i) => {
                      if (select.some((ii) => ii == i.id)) {
                        return (
                          <div
                            key={i.id}
                            className="col-span-1 text-sm"
                          >
                            <div className="text-gray-900">
                              {i.name}
                              <div className="text-gray-400">{i.en_name}</div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
