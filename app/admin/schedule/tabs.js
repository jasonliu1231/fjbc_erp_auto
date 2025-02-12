import { PlusIcon, TableCellsIcon } from "@heroicons/react/20/solid";
import { LuTable, LuTable2 } from "react-icons/lu";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ viewType, setViewType }) {
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setViewType(selectedValue);
  };

  return (
    <div className="mb-3">
      <div className="sm:hidden">
        <label
          htmlFor="tabs"
          className="sr-only"
        >
          選取功能
        </label>
        <select
          id="tabs"
          name="tabs"
          className="p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          onChange={handleSelectChange}
          value={viewType}
        >
          <option value="1">新增</option>
          <option value="2">課程列表</option>
          <option value="3">週排課表</option>
          {/* <option value="4">新增日課表</option> */}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            aria-label="Tabs"
            className="-mb-px flex space-x-8"
          >
            <div
              aria-current={viewType == 1 ? "page" : undefined}
              className={classNames(
                viewType == 1 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium cursor-pointer"
              )}
              onClick={(e) => {
                setViewType(1);
                sessionStorage.setItem("schedule_type", 1);
              }}
            >
              <PlusIcon
                aria-hidden="true"
                className={classNames(viewType == 1 ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500", "-ml-0.5 mr-2 h-5 w-5")}
              />
              <span>新增</span>
            </div>
            <div
              aria-current={viewType == 2 ? "page" : undefined}
              className={classNames(
                viewType == 2 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium cursor-pointer"
              )}
              onClick={(e) => {
                setViewType(2);
                sessionStorage.setItem("schedule_type", 2);
              }}
            >
              <LuTable
                aria-hidden="true"
                className={classNames(viewType == 2 ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500", "-ml-0.5 mr-2 h-5 w-5")}
              />
              <span>課程列表</span>
            </div>
            <div
              aria-current={viewType == 3 ? "page" : undefined}
              className={classNames(
                viewType == 3 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium cursor-pointer"
              )}
              onClick={(e) => {
                setViewType(3);
                sessionStorage.setItem("schedule_type", 3);
              }}
            >
              <LuTable2
                aria-hidden="true"
                className={classNames(viewType == 3 ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500", "-ml-0.5 mr-2 h-5 w-5")}
              />
              <span>週排課表</span>
            </div>
            {/* <div
              aria-current={viewType == 4 ? "page" : undefined}
              className={classNames(
                viewType == 4 ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium cursor-pointer"
              )}
              onClick={(e) => {
                setViewType(4);
                sessionStorage.setItem("schedule_type", 4);
              }}
            >
              <TableCellsIcon
                aria-hidden="true"
                className={classNames(viewType == 4 ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500", "-ml-0.5 mr-2 h-5 w-5")}
              />
              <span>新增日課表</span>
            </div> */}
          </nav>
        </div>
      </div>
    </div>
  );
}
