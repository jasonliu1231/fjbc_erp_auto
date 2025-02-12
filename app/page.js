"use client";

import { useState } from "react";

// 簡單的哈希函數
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function getBrowserFingerprint() {
  const fingerprint = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    languages: navigator.languages.join(","),
    cookieEnabled: navigator.cookieEnabled,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    plugins: Array.from(navigator.plugins)
      .map((plugin) => plugin.name)
      .join(",")
  };

  // Canvas fingerprint
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText("Browser Fingerprint", 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText("Browser Fingerprint", 4, 17);
  const canvasFingerprint = canvas.toDataURL();

  fingerprint.canvasFingerprint = canvasFingerprint;

  // 將指紋信息轉換為字符串
  const fingerprintString = JSON.stringify(fingerprint);

  // 生成指紋的哈希值
  const fingerprintHash = hashString(fingerprintString);

  return fingerprintHash;
}

export default function Home() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  function handUser(event) {
    setUser(event.target.value);
  }

  function handPassword(event) {
    setPassword(event.target.value);
  }

  async function login(event) {
    event.preventDefault(); // 防止默認的表單提交行為
    setLoginLoading(true);
    if (user == "" || password == "") {
      return;
    }
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        username: user,
        password: password,
        client_id: getBrowserFingerprint()
      })
    };
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8100}/fjbc_login_api/auth/login`, config);
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("client_id", getBrowserFingerprint());
      localStorage.setItem("name", data.user.first_name);
      localStorage.setItem("user_id", data.user.id);
      if (!!data.user.photo) {
        localStorage.setItem("photo", data.user.photo);
      }
      window.location.href = "/admin";
    } else {
      if (response.status == 403) {
        alert(data.detail["zh-TW"]);
      } else {
        alert("系統錯誤！");
      }
    }
    setLoginLoading(false);
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/FJBC_Logo.png"
            className="mx-auto w-auto"
          />
          {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2> */}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={login}
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                帳號
              </label>
              <div className="mt-2">
                <input
                  value={user}
                  onChange={handUser}
                  type="text"
                  required
                  autoComplete="username"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  密碼
                </label>
                <input
                  value={password}
                  onChange={handPassword}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {loginLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner"></div>
                  <div>
                    <div className="mx-4 text-blue-500">登入中，請稍候...</div>
                    <div className="mx-4 text-blue-500">Logging in, please wait...</div>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
