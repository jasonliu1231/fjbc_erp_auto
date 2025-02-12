import { PlusIcon, Cog6ToothIcon, DocumentCurrencyDollarIcon } from "@heroicons/react/20/solid";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ createView, setCreateView }) {
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "create") {
      sessionStorage.setItem("createView", true);
      setCreateView(true);
    } else if (selectedValue === "edit") {
      sessionStorage.setItem("createView", false);
      setCreateView(false);
    }
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
          value={createView ? "create" : "edit"}
        >
          <option value="create">新增</option>
          <option value="edit">列表</option>
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            aria-label="Tabs"
            className="-mb-px flex space-x-8"
          >
            <div
              aria-current={createView ? "page" : undefined}
              className={classNames(
                createView ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
              )}
              onClick={(e) => {
                setCreateView(true);
                sessionStorage.setItem("createView", true);
              }}
            >
              <PlusIcon
                aria-hidden="true"
                className={classNames(createView ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500", "-ml-0.5 mr-2 h-5 w-5")}
              />
              <span>新增</span>
            </div>
            <div
              aria-current={!createView ? "page" : undefined}
              className={classNames(
                !createView ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
              )}
              onClick={(e) => {
                setCreateView(false);
                sessionStorage.setItem("createView", false);
              }}
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className={classNames(!createView ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500", "-ml-0.5 mr-2 h-5 w-5")}
              />
              <span>列表</span>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
