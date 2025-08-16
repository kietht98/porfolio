"use client";
import React, { ReactNode, useMemo, useRef, useState } from "react";
import { RxBell, RxDownload } from "react-icons/rx";
import IVocabulary from "./action";
import { useQuery } from "@tanstack/react-query";

const VocabularyPage = () => {
  const [vocabulariesCommon, setVocabulariesCommon] = useState<any[]>([]);

  const formRef = useRef<{ type: string; ref: HTMLFormElement }[]>([]);
  const listRef = useRef<{ type: string; ref: HTMLDivElement }[]>([]);
  const vocab = useMemo(() => new IVocabulary(), []);

  const vocabCommon = useQuery({
    queryKey: ["vocabularyCommon"],
    queryFn: async () => {
      const result = await vocab.getVocabularyCommon();
      setVocabulariesCommon(result);
      return result;
    },
  });

  const addVocabulary = (form: any) => {
    fetch(`/api/vocabulary/${form.type}`, {
      method: "POST",
      body: JSON.stringify(form),
    })
      .then((resp) => {
        resp.json();
      })
      .then((res) => {
        console.log("form", form);
        const vocabCurrent = [
          {
            phrase: form.key,
            meaning: form.content,
          },
          ...(vocabCommon.data as any[]),
        ];

        setVocabulariesCommon(vocabCurrent);
        const formCurrent = formRef.current?.find(
          (item) => item.type === form.type
        );
        formCurrent?.ref?.reset();
      });
  };

  const onSearch = (key: string) => {
    const vocabCurrent = [...(vocabCommon.data as any[])].filter(
      (itm) => itm.phrase.includes(key) || itm.meaning.includes(key)
    );
    console.log(vocabCurrent);
  };

  return (
    <div className=" flex flex-col gap-4">
      <div className="grid grid-cols-1  gap-2">
        <div className="bg-[#D1E9F6] p-4 rounded-md  shadow-lg">
          <div className="flex gap-2 justify-between">
            <h2 className="font-medium text-lg whitespace-nowrap ">
              {" "}
              100 common phrases that frequently appear
            </h2>
            <div className="flex gap-1">
              <button
                className="px-4 py-2 rounded-md border  hover:bg-blue-200 "
                onClick={() => vocab.handleShowNotification(vocabCommon.data)}
              >
                <RxBell color="bg-blue-600" />
              </button>
              <button
                className="rounded-md border hover:bg-gray-200 px-4 py-1.5"
                onClick={() => vocab.exportDocs("common")}
              >
                <RxDownload />
              </button>
            </div>
          </div>
          <form
            ref={(rel) => {
              const common = { type: "common", ref: rel };
              if (
                !rel ||
                formRef.current?.findIndex((itm) => itm.type === common.type) >
                  -1
              ) {
                return;
              }
              formRef.current?.push(common as any);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.target as any);
              addVocabulary({
                key: form.get("key"),
                content: form.get("content"),
                type: "common",
              });
            }}
            className="my-2 flex flex-wrap gap-2"
          >
            <div className="flex flex-col gap-2  flex-1">
              <input
                className="border rounded-md px-2 py-1.5 outline-none"
                type="text"
                name="key"
                id=""
                placeholder="key"
                onChange={(e) => onSearch(e.target.value)}
              />
              <input
                className="border rounded-md px-2 py-1.5 outline-none"
                type="text"
                name="content"
                id=""
                placeholder="content"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="self-end w-28 px-4 py-2 rounded-md bg-blue-800 text-white"
            >
              Enter
            </button>
          </form>
          <div
            className="h-72 overflow-y-auto  scroll-py-4 rounded-md"
            ref={(rel) => {
              const common = { type: "common", ref: rel };
              if (
                !rel ||
                listRef.current?.findIndex((itm) => itm.type === common.type) >
                  -1
              ) {
                return;
              }
              listRef.current?.push(common as any);
            }}
          >
            <div className="flex flex-col bg-gray-100 p-2">
              <ul>
                {vocabulariesCommon?.map((item, index) => {
                  return (
                    <li key={index} className="text-black">
                      <div key={item.phrase}>
                        <span className="font-medium">{item.phrase}</span>:{" "}
                        {item.meaning as ReactNode}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;
