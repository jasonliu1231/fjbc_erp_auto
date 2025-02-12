import Navbar from "../navbar";
import List from "./list";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="container mx-auto p-2 sm:p-4">
        <div className="mx-auto px-2 py-2 sm:py-4 flex justify-between">
          <h1 className="sm:text-2xl font-semibold leading-6 text-gray-900">家長列表</h1>
        </div>
        <List />
      </div>
    </>
  );
}
