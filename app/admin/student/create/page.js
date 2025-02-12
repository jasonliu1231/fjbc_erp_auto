"use client";

import { useRef, useState } from "react";
import { SchoolSelect } from "../select";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Alert from "../../alert";
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

export default function Home() {
  const [type, setType] = useState(1);
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const user = useRef({
    first_name: "",
    nick_name: "",
    address: "",
    tel: "",
    birthday: null,
    photo: ""
  });
  const parent_list = useRef([
    {
      user: {
        first_name: "",
        tel: ""
      }
    },
    {
      user: {
        first_name: "",
        tel: ""
      }
    },
    {
      user: {
        first_name: "",
        tel: ""
      }
    }
  ]);
  const tutoring_id_list = useRef([]);
  const [imageUrl, setImageUrl] = useState("");
  const createData = useRef({ student_status_id: 1 });
  const [select, setSelect] = useState([]);

  // 大頭照
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 获取选中的文件
    if (file) {
      const reader = new FileReader(); // 创建 FileReader 来读取文件

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxSize = 100; // 最大宽度或高度（单位：像素）
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
          setImageUrl(compressedImageUrl); // 將圖片的 Data URL 設置為狀態
          user.current.photo = compressedImageUrl;
        };
      };

      reader.readAsDataURL(file);
    }
  };

  function handelSelect(id) {
    if (select.some((i) => i == id)) {
      setSelect(select.filter((i) => i != id));
    } else {
      setSelect([...select, id]);
    }
  }

  async function createAptitude(uid) {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uid, select })
    };
    const response = await fetch(`/api/aptitude`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/student`;
    }
  }

  async function submit() {
    createData.current.user = user.current;
    createData.current.parent_list = parent_list.current;
    createData.current.tutoring_id_list = tutoring_id_list.current;

    if (!createData.current.user.first_name) {
      setInfo({ show: true, success: false, msg: "請填寫姓名！" });
      return;
    }
    createData.current.parent_list = createData.current.parent_list.filter((i) => {
      return i.user.first_name != "";
    });
    if (createData.current.parent_list.length < 1) {
      setInfo({ show: true, success: false, msg: "請填寫一筆家長資料！" });
      return;
    }

    if (!createData.current.user.tel) {
      createData.current.user.tel = createData.current.parent_list[0].user.tel;
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData.current)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/`, config);
    const res = await response.json();
    if (response.ok) {
      createAptitude(res.id);
      setInfo({
        show: true,
        success: true,
        msg: "資料新增成功！"
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

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />

      <div className="container mx-auto p-2 sm:p-4">
        <div className="flex justify-between">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">新增學生</h1>
          <nav
            aria-label="Tabs"
            className="flex space-x-4 shadow-sm ring-1 ring-gray-200 rounded-md"
          >
            <div
              onClick={() => {
                setType(1);
              }}
              className={`${type == 1 ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:text-gray-700"} "rounded-md px-3 py-2 text-sm font-medium`}
            >
              基本資料
            </div>
            <div
              onClick={() => {
                setType(2);
              }}
              className={`${type == 2 ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:text-gray-700"} "rounded-md px-3 py-2 text-sm font-medium`}
            >
              學生情況
            </div>
          </nav>
          <div className="sm:text-2xl font-semibold leading-6 text-gray-900">
            {" "}
            <button
              onClick={submit}
              type="submit"
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              儲存
            </button>
          </div>
        </div>
        {type == 1 && (
          <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  大頭照
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  {imageUrl != "" ? (
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="w-20"
                    />
                  ) : (
                    <UserCircleIcon
                      aria-hidden="true"
                      className="w-20 text-gray-300"
                    />
                  )}
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>上傳照片</span>
                    <input
                      onChange={handleFileChange} // 綁定文件變更事件
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="col-span-1">
                <div className="border-b-2 text-md text-blue-400">所屬補習班</div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      onChange={(e) => {
                        if (e.target.checked) {
                          tutoring_id_list.current.push(1);
                        } else {
                          tutoring_id_list.current = tutoring_id_list.current.filter((i) => i != 1);
                        }
                      }}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label className="font-medium text-gray-900">臺中市私立多易文理短期補習班</label>{" "}
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      onChange={(e) => {
                        if (e.target.checked) {
                          tutoring_id_list.current.push(2);
                        } else {
                          tutoring_id_list.current = tutoring_id_list.current.filter((i) => i != 2);
                        }
                      }}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label className="font-medium text-gray-900">臺中市私立艾思文理短期補習班</label>{" "}
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      onChange={(e) => {
                        if (e.target.checked) {
                          tutoring_id_list.current.push(3);
                        } else {
                          tutoring_id_list.current = tutoring_id_list.current.filter((i) => i != 3);
                        }
                      }}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label className="font-medium text-gray-900">臺中市私立華而敦國際文理短期補習班</label>{" "}
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                {" "}
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  <span className="text-red-400">*</span>學生身份
                </label>
                <select
                  onChange={(e) => {
                    createData.current.student_status_id = e.target.value;
                  }}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-200"
                >
                  <option value={1}>一般生</option>
                  <option value={2}>試聽生</option>
                  <option value={3}>離校生</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  <span className="text-red-400">*</span>中文姓名
                </label>
                <div className="mt-2">
                  <input
                    onChange={(event) => {
                      user.current.first_name = event.target.value;
                    }}
                    type="text"
                    className="p-2 w-full block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">英文姓名</label>
                <div className="mt-2">
                  <input
                    onChange={(event) => {
                      user.current.nick_name = event.target.value;
                    }}
                    type="text"
                    className="p-2 w-full block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">聯絡電話</label>
                <div className="mt-2">
                  <input
                    onChange={(event) => {
                      user.current.tel = event.target.value;
                    }}
                    type="tel"
                    className="p-2 w-full block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              {/* <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  value={user.email}
                  onChange={(event) => {
                    createData.current.user.email = event.target.value;
                    setUser({
                      ...user,
                      email: event.target.value
                    });
                  }}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
            </div> */}
              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  <span className="text-red-400">*</span>家長資訊
                </label>
                <div className="mt-2">
                  <input
                    placeholder="姓名"
                    onChange={(event) => {
                      parent_list.current[0].user.first_name = event.target.value;
                    }}
                    type="text"
                    className="p-2 block w-full rounded-t-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <input
                  placeholder="電話"
                  onChange={(event) => {
                    parent_list.current[0].user.tel = event.target.value;
                  }}
                  type="text"
                  className="p-2 block w-full rounded-b-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">家長資訊</label>
                <div className="mt-2">
                  <input
                    placeholder="姓名"
                    onChange={(event) => {
                      parent_list.current[1].user.first_name = event.target.value;
                    }}
                    type="text"
                    className="p-2 block w-full rounded-t-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <input
                  placeholder="電話"
                  onChange={(event) => {
                    parent_list.current[1].user.tel = event.target.value;
                  }}
                  type="text"
                  className="p-2 block w-full rounded-b-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">家長資訊</label>
                <div className="mt-2">
                  <input
                    placeholder="姓名"
                    onChange={(event) => {
                      parent_list.current[2].user.first_name = event.target.value;
                    }}
                    type="text"
                    className="p-2 block w-full rounded-t-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <input
                  placeholder="電話"
                  onChange={(event) => {
                    parent_list.current[2].user.tel = event.target.value;
                  }}
                  type="text"
                  className="p-2 block w-full rounded-b-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>

              <div className="col-span-full">
                <SchoolSelect createData={createData} />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">生日</label>
                <div className="mt-2">
                  <input
                    onChange={(event) => {
                      if (event.target.value == "") {
                        user.current.birthday = null;
                      } else {
                        user.current.birthday = event.target.value;
                      }
                    }}
                    type="date"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">地址</label>
                <div className="mt-2">
                  <input
                    onChange={(event) => {
                      user.current.address = event.target.value;
                    }}
                    type="text"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
              </div>
              {/* <div className="col-span-full">
              <TutoringSelect createData={createData} />
            </div> */}
              <div className="col-span-3">
                <label className="text-gray-700 text-md flex">
                  備註<div className="hidden lg:block text-gray-500">(Remark)</div>
                </label>
                <div className="mt-2">
                  <textarea
                    rows={4}
                    className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      createData.current.health_description = e.target.value;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {type == 2 && (
          <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
            <div className="bg-white p-4 mt-4">
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
                <label className="mt-2 block text-md font-medium leading-6 text-sky-500">
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
                <label className="mt-2 block text-md font-medium leading-6 text-sky-500">
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
                        <div className="text-gray-700 text-sm">
                          {i.name}
                          <div className="text-gray-400">{i.en_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <label className="mt-2 block text-md font-medium leading-6 text-sky-500">
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
                <label className="mt-2 block text-md font-medium leading-6 text-sky-500">
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
                        <div className="text-gray-700 text-sm">
                          {i.name}
                          <div className="text-gray-400">{i.en_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <label className="mt-2 block text-md font-medium leading-6 text-sky-500">
                  外向行為<span className="text-gray-400">(Introvert)</span>
                </label>
                <div className="grid grid-cols-4 border-2 rounded-md p-1 mb-4">
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
                <label className="mt-2 block text-md font-medium leading-6 text-sky-500">
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
                        <div className="text-gray-700 text-sm">
                          {i.name}
                          <div className="text-gray-400">{i.en_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <label className="mt-2 block text-md font-medium leading-6 text-sky-500">
                  學習狀況<span className="text-gray-400">(Learning)</span>
                </label>
                <div className="grid grid-cols-4 border-2 rounded-md p-1 mb-4">
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
                          <div className="text-gray-400">{i.en_name}</div>
                        </div>
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
