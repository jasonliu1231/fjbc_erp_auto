"use client";

export default function Home() {
  return (
    <>
      <div className="container mx-auto">
        <div className="px-4 mt-4">
          <div className="flex items-end">
            <h1 className="text-xl font-semibold text-gray-900">明細報表</h1>
          </div>
          <div className="text-blue-600 text-xl my-2 border-b-2">薪資</div>
          <div className="grid grid-cols-5 gap-4">
            <a
              href="/admin/wage/schedule"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              薪資明細總表
            </a>
            <a
              href="/admin/wage/person"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              個人薪資明細表
            </a>
            <a
              href="/admin/wage/persongroup"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              補習班身份薪資表
            </a>
            <a
              href="/admin/wage/statusgroup"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              補習班時薪總表
            </a>
            <a
              href="/admin/wage/salary"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              個人薪資條
            </a>
          </div>
          <div className="text-blue-600 text-xl my-2 border-b-2">財務</div>
          <div className="grid grid-cols-4 gap-4">
            <a
              href="/admin/wage/page1"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              單日收退長條圖
            </a>
            <a
              href="/admin/wage/page2"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              單月收退長條圖
            </a>
            <a
              href="/admin/wage/page3"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              單年收退長條圖
            </a>
            <a
              href="/admin/wage/page4"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              全年繳費綜合圖
            </a>
            <a
              href="/admin/wage/page5"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              單月拆賬長條圖
            </a>
            <a
              href="/admin/wage/page6"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              單年拆賬長條圖
            </a>
            <a
              href="/admin/wage/page7"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              全年拆賬綜合圖
            </a>
            <a
              href="/admin/wage/page8"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              單月科目人數長條圖
            </a>
            <a
              href="/admin/wage/page9"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              單年科目人數長條圖
            </a>
          </div>
          <div className="text-blue-600 text-xl my-2 border-b-2">其他</div>
          <div className="grid grid-cols-4 gap-4">
            <a
              href="/admin/wage/student"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              學生資料表
            </a>
            <a
              href="/admin/wage/grade"
              className="col-span-1 font-semibold rounded-lg bg-white px-8 py-4 text-center hover:bg-pink-200"
            >
              學生成績表
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
