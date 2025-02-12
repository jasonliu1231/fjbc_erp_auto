"use client";
import { useEffect } from "react";
import { XCircleIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function Example({ info, setInfo }) {
  // 如果是成功提示自動關閉
  useEffect(() => {
    if (info.success && info.show) {
      const timer = setTimeout(() => {
        closeAlert();
      }, 1500);
      return () => clearTimeout(timer); // 清除定时器以防组件卸载时仍然存在
    }
  }, [info.success, info.show]); // 仅在 info.success 或 info.show 变化时触发
  function closeAlert() {
    setInfo({
      ...info,
      show: false
    });
  }
  return (
    <div className="fixed z-50 w-full flex justify-center">
      {info.show ? (
        info.success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-green-400"
                />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-medium text-green-800">{info.msg}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500"
                    onClick={closeAlert}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-red-400"
                />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-medium text-red-800">{info.msg}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500"
                    onClick={closeAlert}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
}
