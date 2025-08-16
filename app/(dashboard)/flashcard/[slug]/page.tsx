"use client";
import { Button, Flex } from "@radix-ui/themes";
import { useRef } from "react";
import FlashCardComp from "../FlashCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Keyboard, Navigation, Pagination } from "swiper/modules";
import { FiVolume2 } from "react-icons/fi";
import { speak } from "@/app/utils/actionVocabulary";
import "swiper/css/effect-fade";
import { useRouter } from "next/navigation";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import ReadNoteSvg from "@/public/read_note.svg";
import Image from "next/image";
import { toast } from "react-toastify";

const FlashCard = (props: any) => {
  const {
    params: { slug },
  } = props;

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const vocabCommon = useQuery({
    queryKey: [`${slug}`],
    queryFn: async () => {
      const result = await fetch(`/api/flashcard/getFile?type=${slug}`, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((res) => {
          if (typeof res.data === "string") {
            return JSON.parse(res.data);
          }
          return res.data;
        })
        .catch((err) => []);
      return result;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col gap-2" key="">
      <Flex
        justify={"between"}
        className="text-2xl px-4 py-3 bg-white rounded-md"
      >
        <h3 data-testid="flashcard-id" className="text-2xl">
          FlashCard -{" "}
          {(slug as string).toLocaleUpperCase()?.replace(/\-/g, " ")}
        </h3>
        <Button
          variant="surface"
          className="!shadow-none hover:cursor-pointer !bg-transparent"
          onClick={() => router.back()}
        >
          <RiArrowGoBackFill size={24} color="#000000" />
        </Button>
      </Flex>

      <Flex
        justify={"between"}
        className="flex items-center flex-wrap gap-4 px-4 py-3 bg-white rounded-md w-full"
      >
        <form
          className="flex flex-wrap items-center gap-4"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const file = formData.get("file") as File;
            if (!file?.name) {
              return;
            }
            fetch("/api/flashcard/upload", {
              method: "POST",
              body: formData,
            })
              .then((resp) => resp.json())
              .then((res) => {
                vocabCommon.refetch();
                toast.success("Import success");
              })
              .catch((err) => {
                console.log(err);
                toast.error("Import error. Please try it!!!");
              })
              .finally(() => {
                if (formRef.current) {
                  formRef.current.reset();
                }
              });
          }}
        >
          <label htmlFor="file">Upload file</label>
          <input type="file" name="file" id="" />
          <input
            type="text"
            name="type"
            id=""
            defaultValue={slug}
            className="hidden"
          />
          <Button variant="soft" size={"3"}>
            Upload
          </Button>
        </form>
        <Button
          size={"3"}
          disabled={vocabCommon.data?.length <= 0}
          variant="solid"
          onClick={() => {
            fetch("/api/flashcard/export", {
              method: "POST",
              body: JSON.stringify({
                type: slug,
              }),
            })
              .then((resp) => resp.blob())
              .then((res) => {
                // Create a temporary link element
                const url = window.URL.createObjectURL(res);
                const link = document.createElement("a");
                link.href = url;
                link.download = slug + ".txt"; // Specify the filename for download
                document.body.appendChild(link);

                // Programmatically click the link to trigger the download
                link.click();

                // Clean up
                link.remove();
                window.URL.revokeObjectURL(url);
              })
              .catch((err) => console.log(err));
          }}
        >
          Export file
        </Button>
      </Flex>
      <div className="scroll-py-8">
        {vocabCommon.data?.length > 0 && (
          <>
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              centeredSlides={true}
              centerInsufficientSlides={true}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              effect={"creative"}
              grabCursor={true}
              modules={[Keyboard, Pagination, Navigation, EffectFade]}
              keyboard={{
                enabled: true,
              }}
              pagination={{
                type: "fraction",
                el: ".custom-pagination",
                renderFraction: (currentClass, totalClass) => {
                  return `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`;
                },
                clickable: true,
              }}
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
            >
              {vocabCommon.data?.map?.((item: any, index: number) => {
                return (
                  <SwiperSlide key={item.phrase} virtualIndex={index}>
                    <FlashCardComp vocabulary={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <div className="custom-pagination-container mx-auto flex gap-2 justify-center items-center">
              <Button variant="surface" className="custom-prev">
                {"<"}
              </Button>
              <div className="custom-pagination"></div>
              <Button className="custom-next " variant="surface">
                {">"}
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="mx-auto">
        {!vocabCommon.isLoading && vocabCommon.data?.length <= 0 && (
          <Image src={ReadNoteSvg} alt="" width={320} height={200} />
        )}
      </div>
      <div className="mt-8 scroll-pt-8">
        <Flex direction={"column"} gap={"4"}>
          {vocabCommon.data?.map?.((gram: any) => {
            return (
              <Flex
                key={gram.phrase}
                justify={"between"}
                className="px-4 py-6 bg-white rounded-sm shadow-sm justify-between"
              >
                <div className="flex justify-start items-center">
                  <div className="whitespace-pre-wrap w-32 md:w-48 border-r-2 border-r-gray-300 mr-4 ">
                    {gram.phrase}
                  </div>
                  <div>{gram.meaning}</div>
                </div>
                <div>
                  <FiVolume2
                    size={40}
                    color="white"
                    className="hover:cursor-pointer hover:bg-blue-700 bg-blue-600 p-2 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak({
                        contentEN: gram?.phrase,
                      });
                    }}
                  />
                </div>
              </Flex>
            );
          })}
        </Flex>
      </div>
    </div>
  );
};

export default FlashCard;
