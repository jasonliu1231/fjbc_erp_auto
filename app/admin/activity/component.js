"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import "@fortawesome/fontawesome-free/css/all.css";
// import { getSchool } from "./api";

import dynamic from "next/dynamic";
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

export function Input({ required, label, submit }) {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (submit) {
      const { setting, item } = submit;
      setting((prev) => {
        return {
          ...prev,
          [item]: selected
        };
      });
    }
  }, [selected]);

  return (
    <>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {required && <span className="text-red-400 mr-2">*</span>}
        {label || ""}
      </label>
      <input
        type="text"
        value={selected}
        onChange={(event) => {
          setSelected(event.target.value);
        }}
        placeholder={label || ""}
        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </>
  );
}

export function Radio({ data, label, submit }) {
  const setData = new Set(data);
  data = [...setData];
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (submit) {
      const { setting, item } = submit;
      setting((prev) => {
        return {
          ...prev,
          [item]: selected
        };
      });
    }
  }, [selected]);

  return (
    <Listbox
      as="div"
      value={selected}
      onChange={setSelected}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        <span className="text-red-200">（單選）</span>
      </Label>
      <div className="relative">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block ">{selected || "單選"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-28 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {data.map((item, index) => {
            if (item != "") {
              return (
                <ListboxOption
                  key={index}
                  value={item}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-sky-400 data-[focus]:text-white"
                >
                  <span className="block  font-normal group-data-[selected]:font-semibold">{item}</span>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </span>
                </ListboxOption>
              );
            }
          })}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function Checkbox({ data, label, submit }) {
  const setData = new Set(data);
  data = [...setData];
  const [selected, setSelected] = useState([]);

  const handleSelect = (select) => {
    setSelected((prevSelected) => select);
  };

  useEffect(() => {
    if (submit) {
      const { setting, item } = submit;
      setting((prev) => {
        return {
          ...prev,
          [item]: selected.join(", ")
        };
      });
    }
  }, [selected]);

  return (
    <Listbox
      as="div"
      value={selected}
      onChange={handleSelect}
      multiple
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        <span className="text-red-200">（複選）</span>
      </Label>
      <div className="relative">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block ">{selected.length > 0 ? selected.join(", ") : "複選"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-28 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {data.map((item, index) => {
            if (item != "") {
              return (
                <ListboxOption
                  key={index}
                  value={item}
                  className={({ selected }) =>
                    `group relative cursor-default select-none py-2 pl-3 pr-9 ${selected ? "bg-cyan-400 text-white" : "text-gray-900"} data-[focus]:bg-sky-400 data-[focus]:text-white`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block  ${selected ? "font-semibold" : "font-normal"}`}>{item}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                          <CheckIcon
                            aria-hidden="true"
                            className="h-5 w-5"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              );
            }
          })}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export function School(submit) {
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState([]);
  const [selected, setSelected] = useState(null);

  const filtered =
    query === ""
      ? school
      : school.filter((item) => {
          return item.school_name.toLowerCase().includes(query.toLowerCase()) || item.dist_name.toLowerCase().includes(query.toLowerCase());
        });

  async function fetchData() {
    const school = await getSchool(2, null, null);
    setSchool(school);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (submit.setting) {
      const { setting, item } = submit;
      setting((prev) => {
        return {
          ...prev,
          [item]: selected.school_name
        };
      });
    }
  }, [selected]);

  return (
    <Combobox
      as="div"
      value={selected}
      onChange={(item) => {
        setQuery("");
        setSelected(item);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">
        學校<span className="text-red-200">（單選）</span>
      </Label>
      <div className="relative">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(item) => item?.school_name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filtered.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.map((item) => (
              <ComboboxOption
                key={item.id}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block  group-data-[selected]:font-semibold">
                  <span>{item.school_name}</span>
                  <span className="text-sm text-gray-400">--{item.dist_name}</span>
                </span>

                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}

export function Editor({ textareaValue, setTextareaValue }) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef(null);

  const config = {
    language: "zh_tw",
    height: 300,
    toolbarButtons: ["fontSize", "align", "formatOL", "formatUL", "bold", "italic", "underline", "strikeThrough", "textColor", "backgroundColor", "insertTable", "emoticons", "html"],
    pluginsEnabled: ["table", "emoticons", "align", "colors", "fontSize", "lists"]
  };

  const handleModelChange = (model) => {
    setTextareaValue(model);
  };

  useLayoutEffect(() => {
    const loadResources = async () => {
      try {
        await Promise.all([
          import("froala-editor/js/plugins.pkgd.min.js"),
          import("froala-editor/js/froala_editor.pkgd.min.js"),
          import("froala-editor/css/froala_editor.pkgd.min.css"),
          import("froala-editor/js/languages/zh_tw.js"),
          import("froala-editor/js/plugins/image.min.js")
        ]);
        setEditorLoaded(true);
      } catch (error) {
        console.error("Error loading Froala Editor resources:", error);
      }
    };

    loadResources();
  }, []);

  if (!editorLoaded) {
    return <div>Loading editor...</div>; // 顯示加載中的狀態
  }

  return (
    <FroalaEditor
      tag="textarea"
      model={textareaValue}
      onModelChange={handleModelChange}
      config={config}
    />
  );
}
