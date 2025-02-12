"use client";

import Navbar from "../navbar";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="container mx-auto mb-5 p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">問班表路徑</h1>
        </div>
        <ul
          role="list"
          className="divide-y divide-gray-200"
        >
          <li className="py-2 text-center text-2xl bg-gray-100">臺中市私立多易文理短期補習班</li>
          <li className="py-2 flex justify-around items-center">
            <span>現場</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=1</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=1`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=1`} />
          </li>
          <li className="py-2 flex justify-around items-center">
            <span>LINE</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=2</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=2`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=2`} />
          </li>
          <li className="py-2 flex justify-around items-center">
            <span>官網</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=3</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=3`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=1&src=3`} />
          </li>
          <li className="py-2 text-center text-2xl bg-gray-100">臺中市私立艾思文理短期補習班</li>
          <li className="py-2 flex justify-around items-center">
            <span>現場</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=1</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=1`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=1`} />
          </li>
          <li className="py-2 flex justify-around items-center">
            <span>LINE</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=2</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=2`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=2`} />
          </li>
          <li className="py-2 flex justify-around items-center">
            <span>官網</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=3</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=3`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=2&src=3`} />
          </li>
          <li className="py-2 text-center text-2xl bg-gray-100">臺中市私立華而敦國際文理短期補習班</li>
          <li className="py-2 flex justify-around items-center">
            <span>現場</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=1</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=1`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=1`} />
          </li>
          <li className="py-2 flex justify-around items-center">
            <span>LINE</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=2</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=2`}
            >
              查看畫面
            </a>
            <QRCodeSVG value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=2`} />
          </li>
          <li className="py-2 flex justify-around items-center">
            <span>官網</span>
            <span>https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=3</span>
            <a
              target="_blank"
              className="text-blue-900"
              href={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=3`}
            >
              查看畫面
            </a>
            <QRCodeSVG
              value={`https://tutoring.fjbcgroup.com/ask_course/inquiry?tutoring_id=3&src=3`}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
