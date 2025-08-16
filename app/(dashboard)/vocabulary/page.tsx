"use client";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { RxBell, RxDownload } from "react-icons/rx";
import IVocabulary from "./action";
import { useStoreGrammars } from "@/app/redux/store";
import { Skeleton } from "@radix-ui/themes";

const VocabularyPage = () => {
  const formRef = useRef<{ type: string; ref: HTMLFormElement }[]>([]);
  const listRef = useRef<{ type: string; ref: HTMLDivElement }[]>([]);
  const vocab = useMemo(() => new IVocabulary(), []);
  const grammars = useStoreGrammars();

  useEffect(() => {
    if (!grammars.data && !grammars.loading) {
      grammars.fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addVocabulary = async (form: any) => {
    await fetch(`/api/vocabulary/${form.type}`, {
      method: "POST",
      body: JSON.stringify(form),
    })
      .then((resp) => {
        resp.json();
      })
      .then((res) => {
        console.log("form", form);
        switch (form.type) {
          case "adv":
            if (grammars.data?.["Adv"]) {
              const vocabData = [...grammars.data["Adv"]];
              vocabData.push({
                phrase: form.key,
                meaning: form.content,
              });
              grammars.setVocabularies({ Adv: vocabData });
            }
            break;
          case "adj":
            if (grammars.data?.["Adj"]) {
              const vocabData = [...grammars.data["Adj"]];
              vocabData.push({
                phrase: form.key,
                meaning: form.content,
              });
              grammars.setVocabularies({ Adj: vocabData });
            }

            break;
          case "noun":
            if (grammars.data?.["Noun"]) {
              const vocabData = [...grammars.data["Noun"]];
              vocabData.push({
                phrase: form.key,
                meaning: form.content,
              });
              grammars.setVocabularies({ Noun: vocabData });
            }
            break;
        }
      });
    const formCurrent = formRef.current?.find(
      (item) => item.type === form.type
    );
    formCurrent?.ref?.reset();
    const listCurrent = listRef.current?.find(
      (item) => item.type === form.type
    );

    listCurrent?.ref?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <div className=" flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="bg-[#D1E9F6] p-4 rounded-md  shadow-lg">
          <div className="flex gap-2 justify-between">
            <h2 className="font-medium text-lg whitespace-nowrap ">
              {" "}
              Vocabulary Adv
            </h2>
            <div className="flex gap-1">
              <button
                className="px-4 py-2 rounded-md border  hover:bg-blue-200 "
                onClick={() =>
                  vocab.handleShowNotification(grammars.data?.["Adv"])
                }
              >
                <RxBell color="bg-blue-600" />
              </button>
              <button
                data-testid="export-btn"
                disabled
                className="rounded-md border hover:bg-gray-200 px-4 py-1.5"
                onClick={() => vocab.exportDocs("adv")}
              >
                <RxDownload />
              </button>
            </div>
          </div>
          <form
            ref={(rel) => {
              const adv = { type: "adv", ref: rel };
              if (
                !rel ||
                formRef.current?.findIndex((itm) => itm.type === adv.type) > -1
              ) {
                return;
              }
              formRef.current?.push(adv as any);
            }}
            data-testid="onsubmit"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.target as any);
              addVocabulary({
                key: form.get("key"),
                content: form.get("content"),
                type: "adv",
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
              />
              <input
                className="border rounded-md px-2 py-1.5 outline-none"
                type="text"
                name="content"
                id=""
                placeholder="content"
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
            className="h-72 overflow-y-auto scroll-py-4"
            ref={(rel) => {
              const adv = { type: "adv", ref: rel };
              if (
                !rel ||
                listRef.current?.findIndex((itm) => itm.type === adv.type) > -1
              ) {
                return;
              }
              listRef.current?.push(adv as any);
            }}
          >
            <div className="flex flex-col">
              <ul>
                <Skeleton loading={grammars.loading} />
                {grammars.data?.["Adv"]?.map((item: any, index: any) => {
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
        <div className="bg-[#D1E9F6] p-4 rounded-md  shadow-lg">
          <div className="flex gap-2 justify-between">
            <h2 className="font-medium text-lg whitespace-nowrap">
              Vocabulary Adj
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                className="px-4 py-2 rounded-md border  hover:bg-blue-200 "
                onClick={() =>
                  vocab.handleShowNotification(grammars.data?.["Adj"])
                }
              >
                <RxBell />
              </button>
              <button
                className="rounded-md border hover:bg-gray-200 px-4 py-1.5"
                onClick={() => vocab.exportDocs("adj")}
              >
                <RxDownload />
              </button>
            </div>
          </div>
          <form
            ref={(rel) => {
              const adj = { type: "adj", ref: rel };
              if (
                !rel ||
                formRef.current?.findIndex((itm) => itm.type === adj.type) > -1
              ) {
                return;
              }
              formRef.current?.push(adj as any);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.target as any);
              addVocabulary({
                key: form.get("key"),
                content: form.get("content"),
                type: "adj",
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
              />
              <input
                className="border rounded-md px-2 py-1.5 outline-none"
                type="text"
                name="content"
                id=""
                placeholder="content"
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
            className="h-72 overflow-y-auto scroll-py-4"
            ref={(rel) => {
              const adj = { type: "adj", ref: rel };
              if (
                !rel ||
                listRef.current?.findIndex((itm) => itm.type === adj.type) > -1
              ) {
                return;
              }
              listRef.current?.push(adj as any);
            }}
          >
            <div className="flex flex-col">
              <ul>
                <Skeleton loading={grammars.loading} />
                {grammars.data?.["Adj"]?.map((item: any, index: any) => {
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
        <div className="bg-[#D1E9F6] p-4 rounded-md  shadow-lg">
          <div className="flex gap-2 justify-between">
            <h2 className="font-medium text-lg whitespace-nowrap">
              {" "}
              Vocabulary Noun
            </h2>
            <div className="flex gap-1">
              {" "}
              <button
                type="button"
                className="px-4 py-2 rounded-md border  hover:bg-blue-200 "
                onClick={() =>
                  vocab.handleShowNotification(grammars.data?.["Noun"])
                }
              >
                <RxBell />
              </button>
              <button
                className="rounded-md border hover:bg-gray-200 px-4 py-1.5"
                onClick={() => vocab.exportDocs("noun")}
              >
                <RxDownload />
              </button>
            </div>
          </div>
          <form
            ref={(rel) => {
              const noun = { type: "noun", ref: rel };
              if (
                !rel ||
                formRef.current?.findIndex((itm) => itm.type === noun.type) > -1
              ) {
                return;
              }
              formRef.current?.push(noun as any);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.target as any);
              addVocabulary({
                key: form.get("key"),
                content: form.get("content"),
                type: "noun",
              });
            }}
            className="my-2 flex flex-wrap gap-2"
          >
            <div className="flex flex-col flex-1 flex-wrap gap-2">
              <input
                className="border rounded-md px-2 py-1.5 outline-none"
                type="text"
                name="key"
                id=""
                placeholder="key"
              />
              <input
                className="border rounded-md px-2 py-1.5 outline-none"
                type="text"
                name="content"
                id=""
                placeholder="content"
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
            className="h-72 overflow-y-auto scroll-py-4"
            ref={(rel) => {
              const noun = { type: "noun", ref: rel };
              if (
                !rel ||
                listRef.current?.findIndex((itm) => itm.type === noun.type) > -1
              ) {
                return;
              }
              listRef.current?.push(noun as any);
            }}
          >
            <div className="flex flex-col">
              <ul>
                <Skeleton loading={grammars.loading} />
                {grammars.data?.["Noun"]?.map((item: any, index: any) => {
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
      </div>{" "}
    </div>
  );
};

export default VocabularyPage;
