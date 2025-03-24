"use client";

import { useState, useEffect, useRef } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { error } from "../../../utils";
import Alert from "../../alert";

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return "";
  // 使用 Date 物件來處理時區
  const date = new Date(dateTimeString);
  // 將其格式化為 'YYYY-MM-DD'，處理本地時間
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // 拼接成 'YYYY-MM-DD'
  return `${year}-${month}-${day}`;
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  // 使用 Date 物件來處理時區
  const date = new Date(dateTimeString);
  // 將其格式化為 'YYYY-MM-DDTHH:MM'，處理本地時間
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // 拼接成 'YYYY-MM-DDTHH:MM'
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
const tutoring = [
  {
    id: 1,
    name: "臺中市私立多易文理短期補習班",
    imageUrl: "/doyi.png",
    addr: "臺中市太平區新興路171號、169號",
    phone: "04-23959481"
  },
  {
    id: 2,
    name: "臺中市私立艾思文理短期補習班",
    imageUrl: "/funapple2.png",
    addr: "臺中市太平區新興路171號、169號",
    phone: "04-23952885"
  },
  {
    id: 3,
    name: "臺中市私立華而敦國際文理短期補習班",
    imageUrl: "/funapple2.png",
    addr: "臺中市北屯區崇德五路146巷28號",
    phone: "04-22471682"
  }
];
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

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [type, setType] = useState(1);
  const [subData, setSubData] = useState({ p_type: true });
  const [userList, setUserList] = useState([]);
  const [select, setSelect] = useState([]);
  const [course, setCourse] = useState([]);
  const [infoSource, setInfoSource] = useState([]);
  const [selected, setSelected] = useState(1);
  const [userId, setUserId] = useState();
  const [record, setRecord] = useState([]);
  const [grade, setGrade] = useState();
  const [city, setCity] = useState(2);
  const [dist, setDist] = useState(120);
  const [cityList, setCityList] = useState();
  const [distList, setDistList] = useState();
  const [school, setSchool] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [update, setUpdate] = useState({});
  const [open, setOpen] = useState(false);
  const [checkUser, setCheckUser] = useState(false);
  const [schoolType, setSchoolType] = useState(2);

  // 補習班
  const t = tutoring.filter((i) => i.id == selected)[0];

  const filteredDist = city ? distList?.filter((i) => i.city_id == city) : [];

  const schoolList = school?.filter((item) => {
    return item.city_id == city && item.dist_id == dist && schoolType == item.school_type_id;
  });

  const filteredSchool =
    query === ""
      ? schoolList
      : schoolList.filter((item) => {
          return item.school_name.toLowerCase().includes(query.toLowerCase()) && item.city_id == city && item.dist_id == dist;
        });

  async function submit(type) {
    if (type == 1) {
      subData.isclose = true;
    }
    if (!subData.chinese_name) {
      alert("請填寫學生中文姓名！");
      return;
    }

    subData.tutoring_id = t.id;
    subData.tutoring_name = t.name;
    const config = {
      method: userId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        user_id: localStorage.getItem("user_id")
      },
      body: JSON.stringify({
        preparation: subData,
        preparationdetail: select
      })
    };
    const response = await fetch(`/api/preparation`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      if (subData.isclose) {
        window.location.href = "/admin/preparation";
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

  function handelSelect(id) {
    if (select.some((i) => i == id)) {
      setSelect(select.filter((i) => i != id));
    } else {
      setSelect([...select, id]);
    }
  }

  async function getCourse(tutoring) {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        user_id: localStorage.getItem("user_id")
      }
    };
    const response = await fetch(`/api/course?id=${tutoring}`, config);
    const res = await response.json();
    if (response.ok) {
      setCourse(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getRecord(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/ask/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setRecord(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function saveRecord() {
    if (content.trim() == "") {
      setInfo({
        show: true,
        success: false,
        msg: "內容不可以空白"
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
        preparation_id: Number(userId),
        content: content
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/ask`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      setContent("");
      getRecord(userId);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function updateRecord() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      setContent("");
      getRecord(userId);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function deleteRecord(id) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/access/${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "操作完成！"
      });
      getRecord(userId);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function addErp() {
    setLoading(true);
    const parList = [];
    if (subData.mother_name && subData.mother_phone) {
      parList.push({
        user: {
          first_name: subData.mother_name,
          tel: subData.mother_phone
        }
      });
    }
    if (subData.father_name && subData.father_phone) {
      parList.push({
        user: {
          first_name: subData.father_name,
          tel: subData.father_phone
        }
      });
    }
    // if (subData.emergency_contact_name && subData.emergency_contact) {
    //   parList.push({
    //     user: {
    //       first_name: subData.emergency_contact_name,
    //       tel: subData.emergency_contact
    //     }
    //   });
    // }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        health_description: subData.remark,
        sign: subData.signature,
        user: {
          first_name: subData.chinese_name,
          nick_name: subData.english_name,
          address: subData.address,
          tel: subData.mother_phone || subData.father_phone,
          birthday: subData.birthday?.split("T")[0]
        },
        parent_list: parList,
        school_id: subData.school_id,
        grade_id: subData.grade_id,
        tutoring_id_list: subData.tutoring_id ? [Number(subData.tutoring_id)] : [],
        student_status_id: 1,
        preparation_id: subData.id
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/bind/create`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "轉入完成，將跳轉畫面！"
      });
      window.location.href = `/admin/student/setting?id=${res}`;
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      setLoading(false);
    }
  }

  async function searchUser() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: subData.chinese_name
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/bind/search`, config);
    const res = await response.json();
    if (response.ok) {
      setUserList(res);
      setCheckUser(true);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      setLoading(false);
    }
  }

  async function bindUser(data) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/bind/origin`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "轉入完成，將跳轉畫面！"
      });
      window.location.href = `/admin/student/setting?id=${res}`;
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
      setCheckUser(false);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    // const tutoring = params.get("tutoring");

    // console.log(tutoring);

    // if (tutoring) {
    //   setSelected(tutoring);
    //   getCourse(tutoring);
    // }

    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        user_id: localStorage.getItem("user_id")
      }
    };

    const grade = fetch(`/api/grade`);
    const school = fetch(`/api/school`);
    const source = fetch(`/api/infosource`);
    const api = [grade, school, source];
    if (id) {
      const preparation = fetch(`/api/preparation?id=${id}`, config);
      api.push(preparation);
      setUserId(id);
      getRecord(id);
    }
    Promise.all(api).then(async ([response1, response2, response3, response4]) => {
      const result1 = await response1.json();
      const result2 = await response2.json();
      const result3 = await response3.json();
      setGrade(result1);
      setSchool(result2.school);
      setCityList(result2.city);
      setDistList(result2.dist);
      setInfoSource(result3);
      if (id) {
        const result4 = await response4.json();
        if (id && !response4.ok) {
          const msg = error(response4.status, result4);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
          return;
        }
        setSubData(result4.entity);
        setCity(result4.entity.city_id);
        setDist(result4.entity.dist_id);
        setSchoolType(result4.entity.school_type_id);
        setSelectedSchool({
          school_id: result4.entity.school_id,
          school_name: result4.entity.school_name
        });
        setSelect(result4.detail.map((i) => i.selectid));
        setSelected(result4.entity.tutoring_id);
        if (result4.entity.tutoring_id) {
          getCourse(result4.entity.tutoring_id);
        }
      }

      setLoading(false);
    });
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
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <textarea
                  rows={4}
                  className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm: sm:leading-6"
                  value={update.content}
                  onChange={(e) => {
                    setUpdate({ ...update, content: e.target.value });
                  }}
                />
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    updateRecord();
                    setOpen(false);
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2  font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={checkUser}
        onClose={() => {}}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-center text-blue-400">轉入確認</div>
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="divide-x divide-gray-200 bg-green-100">
                    <th
                      scope="col"
                      className="p-2 text-left  font-semibold text-gray-900"
                    >
                      名稱
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left  font-semibold text-gray-900"
                    >
                      年級
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left  font-semibold text-gray-900"
                    >
                      學校
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left  font-semibold text-gray-900"
                    >
                      家長
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left  font-semibold text-gray-900"
                    >
                      綁定
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {userList.map((item) => {
                    return (
                      <tr
                        key={item.id}
                        className={`bg-white divide-x divide-gray-200`}
                        onClick={() => {}}
                      >
                        <td className="p-2  font-medium text-gray-900">
                          {item.student_name}({item.student_nick})
                        </td>
                        <td className="p-2  font-medium text-gray-900">{item.grade_name}</td>
                        <td className="p-2  font-medium text-gray-900">{item.school_name}</td>
                        <td className="p-2  font-medium text-gray-900">
                          {item.parent.map((i) => {
                            const parent = i.split("$$");
                            return (
                              <div>
                                <div>{parent[0]}</div>
                                <div>{parent[1]}</div>
                              </div>
                            );
                          })}
                        </td>
                        <td className="p-2  font-medium">
                          <span
                            onClick={() => {
                              const check = confirm(`確定要幾資料綁在 ${item.student_name} 上面嗎？`);
                              if (check) {
                                bindUser({
                                  preparation_id: subData.id,
                                  student_id: item.id,
                                  sign: subData.signature
                                });
                              }
                            }}
                            className="text-blue-500 cursor-pointer hover:text-sky-500"
                          >
                            綁定
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setCheckUser(false);
                  }}
                  className="mx-1 rounded-md bg-gray-600 px-3 py-2  text-white shadow-sm"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addErp();
                  }}
                  className="mx-1 rounded-md bg-green-600 px-3 py-2  text-white shadow-sm"
                >
                  建立
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-4">
        <div className="block flex justify-between">
          <nav
            aria-label="Tabs"
            className="flex space-x-4 shadow-sm ring-1 ring-gray-200"
          >
            <div
              onClick={() => {
                setType(1);
              }}
              className={`${type == 1 ? "bg-gray-100 text-blue-700" : "text-gray-600"} p-2 font-medium cursor-pointer`}
            >
              基本資料
            </div>
            <div
              onClick={() => {
                setType(2);
              }}
              className={`${type == 2 ? "bg-gray-100 text-blue-700" : "text-gray-600"} p-2 font-medium cursor-pointer`}
            >
              線上資訊
            </div>
            <div
              onClick={() => {
                setType(3);
              }}
              className={`${type == 3 ? "bg-gray-100 text-blue-700" : "text-gray-600"} p-2 font-medium cursor-pointer`}
            >
              性向
            </div>
            <div
              onClick={() => {
                setType(4);
              }}
              className={`${type == 4 ? "bg-gray-100 text-blue-700" : "text-gray-600"} p-2 font-medium cursor-pointer`}
            >
              追蹤
            </div>
          </nav>
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              onClick={submit}
              type="button"
              className="mx-1 rounded-md bg-blue-600 px-2 py-1 font-semibold text-white shadow-sm"
            >
              修改
            </button>
            <button
              onClick={() => {
                const check = confirm(`確定要關閉嗎？`);
                if (check) {
                  submit(1);
                }
              }}
              type="button"
              className="mx-1 rounded-md bg-red-600 px-2 py-1 font-semibold text-white shadow-sm"
            >
              關閉此表
            </button>
            {subData.admission && (
              <button
                onClick={() => {
                  searchUser();
                }}
                type="button"
                className="mx-1 rounded-md bg-green-600 px-2 py-1 font-semibold text-white shadow-sm"
              >
                轉入學生
              </button>
            )}
          </span>
        </div>

        {type == 1 && (
          <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            <div className="grid grid-cols-4 gap-3 mb-2">
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">中文姓名</label>
                <div className="mt-2">
                  <input
                    value={subData.chinese_name || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        chinese_name: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="中文(Chinese name)"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">英文姓名</label>
                <div className="mt-2">
                  <input
                    value={subData.english_name || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        english_name: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="英文(English name)"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">學校</label>
                <div className="grid grid-cols-3 gap-1 mt-2">
                  <div className="col-span-1">
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                    >
                      {cityList &&
                        cityList?.map((i) => (
                          <option
                            key={i.id}
                            value={i.id}
                          >
                            {i.city_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={dist}
                      onChange={(e) => {
                        setDist(e.target.value);
                      }}
                      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                    >
                      {filteredDist &&
                        filteredDist?.map((i) => (
                          <option
                            key={i.id}
                            value={i.id}
                          >
                            {i.dist_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={schoolType}
                      onChange={(e) => {
                        setSchoolType(e.target.value);
                      }}
                      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                    >
                      <option value={1}>幼兒園</option>
                      <option value={2}>國小</option>
                      <option value={3}>國中</option>
                      <option value={4}>高中</option>
                    </select>
                  </div>
                </div>
                <Combobox
                  as="div"
                  value={selectedSchool}
                  onChange={(select) => {
                    if (select) {
                      setQuery("");
                      setSelectedSchool(select);
                      setSubData({
                        ...subData,
                        school_id: select.id
                      });
                    }
                  }}
                >
                  <div className="relative">
                    <ComboboxInput
                      className="mt-1 w-full rounded-md border-0 bg-white py-1 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      onChange={(event) => setQuery(event.target.value)}
                      onBlur={() => setQuery("")}
                      displayValue={(selectedSchool) => selectedSchool?.school_name || "請選擇學校"}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </ComboboxButton>

                    {filteredSchool?.length > 0 && (
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
                        {filteredSchool.map((item) => (
                          <ComboboxOption
                            key={item.id}
                            value={item}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                          >
                            <span className="block truncate group-data-[selected]:font-semibold">{item.school_name}</span>
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </div>
                </Combobox>
              </div>
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">年級</label>
                <div className="mt-2">
                  <select
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        grade_id: e.target.value
                      });
                    }}
                    value={subData.grade_id || ""}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  >
                    <option>請選擇年級</option>
                    {grade &&
                      grade.map((i) => (
                        <option
                          key={i.id}
                          value={i.id}
                        >
                          {i.grade_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-span-1">
                <label className="block font-medium text-gray-900">性別</label>
                <div className="mt-2">
                  <select
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        gender: e.target.value
                      });
                    }}
                    value={subData.gender || ""}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  >
                    <option></option>
                    <option value={1}>男生</option>
                    <option value={2}>女生</option>
                  </select>
                </div>
              </div>
              <div className="col-span-1">
                <label className="block  font-medium text-gray-900">生日</label>
                <div className="mt-2">
                  <input
                    value={subData.birthday}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        birthday: e.target.value
                      });
                    }}
                    type="date"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block  font-medium text-gray-900">地址</label>
                <div className="mt-2">
                  <input
                    value={subData.address || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        address: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="EX:台中市太平區..."
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block  font-medium text-gray-900">媽媽姓名</label>
                <div className="mt-2">
                  <input
                    value={subData.mother_name || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        mother_name: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="中文姓名(Chinese name)"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block  font-medium text-gray-900">媽媽手機</label>
                <div className="mt-2">
                  <input
                    value={subData.mother_phone || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        mother_phone: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="EX:09xxxxxxxx"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block  font-medium text-gray-900">爸爸姓名</label>
                <div className="mt-2">
                  <input
                    value={subData.father_name || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        father_name: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="中文姓名(Chinese name)"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block  font-medium text-gray-900">爸爸手機</label>
                <div className="mt-2">
                  <input
                    value={subData.father_phone || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        father_phone: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="EX:09xxxxxxxx"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block  font-medium text-gray-900">緊急聯絡人</label>
                <div className="mt-2">
                  <input
                    value={subData.emergency_contact_name || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        emergency_contact_name: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="中文姓名(Chinese name)"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block  font-medium text-gray-900">聯絡電話</label>
                <div className="mt-2">
                  <input
                    value={subData.emergency_contact || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        emergency_contact: e.target.value
                      });
                    }}
                    type="text"
                    placeholder="EX:09xxxxxxxx"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 border-t-4">
              <div className="flex items-center col-span-1">
                <div>
                  <input
                    checked={select.some((ii) => ii == "audition")}
                    onChange={() => {
                      handelSelect("audition");
                    }}
                    type="checkbox"
                    className="w-5 h-5"
                  />
                </div>
                <div className="ml-4 p-1">
                  <div className="text-gray-700">意願試聽</div>
                </div>
              </div>
              <div className="flex items-center col-span-1">
                <div>
                  <input
                    checked={select.some((ii) => ii == "tryExam")}
                    onChange={() => {
                      handelSelect("tryExam");
                    }}
                    type="checkbox"
                    className="w-5 h-5"
                  />
                </div>
                <div className="ml-4 p-1">
                  <div className="text-gray-700">意願檢測</div>
                  <div className="hidden lg:block text-gray-500">Skills test</div>
                </div>
              </div>
              <div className="flex items-center col-span-1">
                <div>
                  <input
                    checked={subData.arrive}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        arrive: e.target.checked
                      });
                    }}
                    type="checkbox"
                    className="w-5 h-5"
                  />
                </div>
                <div className="ml-4 p-1">
                  <div className="text-gray-700">到班試聽</div>
                </div>
              </div>
              <div className="flex items-center col-span-1">
                <div>
                  <input
                    checked={subData.test}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        test: e.target.checked
                      });
                    }}
                    type="checkbox"
                    className="w-5 h-5"
                  />
                </div>
                <div className="ml-4 p-1">
                  <div className="text-gray-700">到班測驗</div>
                </div>
              </div>
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">希望面談時間</label>
                <div className="mt-2">
                  <input
                    value={formatDateTime(subData.meeting) || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        meeting: e.target.value
                      });
                    }}
                    type="datetime-local"
                    step={900}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">希望試聽時間</label>
                <div className="mt-2">
                  <input
                    value={formatDateTime(subData.trialclass) || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        trialclass: e.target.value
                      });
                    }}
                    type="datetime-local"
                    step={900}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">希望檢測時間</label>
                <div className="mt-2">
                  <input
                    value={formatDateTime(subData.exam) || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        exam: e.target.value
                      });
                    }}
                    type="datetime-local"
                    step={900}
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1  ">
                <label className="block font-medium text-gray-900">測驗等級</label>
                <div className="mt-2">
                  <input
                    value={subData.level || ""}
                    onChange={(e) => {
                      setSubData({
                        ...subData,
                        level: e.target.value
                      });
                    }}
                    type="text"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block font-medium text-gray-900">簽名</label>
                <div className="h-full">
                  <img src={subData.signature} />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block font-medium text-gray-900">表單建立時間</label>
                <div className="h-full">{new Date(subData.createdon).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
        {type == 2 && (
          <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 mt-2 sm:mt-4">
              <div className="col-span-1 sm:col-span-2">
                <label className="mt-2 block   font-medium text-sky-500">
                  詢問課程<span className="text-gray-400">(Course)</span>
                </label>
                <div className="grid grid-cols-3 border-2 rounded-md p-1 sm:mb-4">
                  {course.map((i) => (
                    <div
                      key={i.course_no}
                      className="flex items-center col-span-1"
                    >
                      <div>
                        <input
                          checked={select.some((ii) => ii == i.course_no)}
                          onChange={() => {
                            handelSelect(i.course_no);
                          }}
                          type="checkbox"
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="ml-4 p-1">
                        <div className="text-gray-700  sm:text-md">{i.course_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="mt-2 block   font-medium text-sky-500">
                  資訊來源<span className="text-gray-400">(Course)</span>
                </label>
                <div className="grid grid-cols-3 border-2 rounded-md p-1 sm:mb-4">
                  {infoSource.map((i) => (
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
                        <div className="text-gray-700  sm:text-md">{i.info_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {type == 3 && (
          <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            <div>
              <label className="mt-2 block  font-medium text-sky-500">
                身體將康狀況、過敏，需補習班留意<span className="text-gray-400">(History)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-span-6">
                  <label className="text-gray-700 text-md flex">
                    備註<div className="hidden lg:block text-gray-500">(Remark)</div>
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={2}
                      className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm: sm:leading-6"
                      value={subData.remark || ""}
                      onChange={(e) => {
                        setSubData({
                          ...subData,
                          remark: e.target.value
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <label className="mt-2 block  font-medium text-sky-500">
                母親管教方式<span className="text-gray-400">(Mother’s parenting approach)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-2 block  font-medium text-sky-500">
                父親管教方式<span className="text-gray-400">(Father’s parenting approach)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-2 block  font-medium text-sky-500">
                生活習慣<span className="text-gray-400">(Life)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="mt-2 block  font-medium text-sky-500">
                人際關係<span className="text-gray-400">(Interpersonal relationships)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-2 block  font-medium text-sky-500">
                外向行為<span className="text-gray-400">(Introvert)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-2 block  font-medium text-sky-500">
                內向行為<span className="text-gray-400">(Extrovert)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-2 block  font-medium text-sky-500">
                學習狀況<span className="text-gray-400">(Learning)</span>
              </label>
              <div className="grid grid-cols-6 border-2 rounded-md p-1 mb-4">
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
                      <div className="text-gray-700 text-md">
                        {i.name}
                        <div className="hidden lg:block text-gray-500">{i.en_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {type == 4 && (
          <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 mt-2 sm:mt-4">
              <div className="span-col-1 p-2">
                <div>
                  <label className="block text-xl font-medium text-gray-900 mb-4">追蹤紀錄</label>
                  <div className="mt-2">
                    <textarea
                      rows={15}
                      className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm: sm:leading-6"
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      saveRecord();
                    }}
                    className="mt-1 rounded-md bg-green-600 px-2.5 py-1.5  sm:text-md font-semibold text-white shadow-sm"
                  >
                    儲存
                  </button>
                </div>
              </div>
              <div className="span-col-1 p-2">
                <div>
                  <label className="block text-xl font-medium text-gray-900 mb-4">追蹤列表</label>
                  {record.map((i, index) => (
                    <div
                      key={index}
                      className="mb-3"
                    >
                      <div className="flex justify-between">
                        <div className="text-gray-400">
                          {new Date(i.update_at).toLocaleString("zh-TW", { hour12: false })}-<span className="text-gray-700"> {i.nick_name}</span>
                        </div>
                        <div className="flex">
                          <div
                            onClick={() => {
                              setUpdate({
                                id: i.id,
                                content: i.content
                              });
                              setOpen(true);
                            }}
                            className="mx-3 text-blue-400 text-right cursor-pointer"
                          >
                            修改
                          </div>
                          <div
                            onClick={() => {
                              const check = confirm("確定要刪除嗎？");
                              if (check) {
                                deleteRecord(i.id);
                              }
                            }}
                            className="mx-3 text-red-400 text-right cursor-pointer"
                          >
                            刪除
                          </div>
                        </div>
                      </div>
                      <div className="border border-blue-300 bg-white relative flex">
                        <div className="ml-4 w-full">
                          <textarea
                            rows={2}
                            className="block text-gray-900 w-full"
                            value={i.content}
                            readOnly
                          />
                        </div>
                        <div className="bg-white border-l border-b border-blue-300 absolute w-5 h-5 triangle top-0 left-0"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
