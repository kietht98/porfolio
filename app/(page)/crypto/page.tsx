import { Flex, Grid, GridProps } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CardComponents, CardPartner } from "./utils";

const Pilot = () => {
  return (
    <div className="pt-20 bg-black text-white">
      <Flex
        gap={"3"}
        className=" bg-container p-4 md:p-4 max-w-screen-xl mx-auto"
        direction={"column"}
      >
        <header className="w-ful pb-9 md:pb-24">
          <Flex
            direction={"column"}
            align={"center"}
            gap={"8"}
            className="font-mono mx-auto w-fit"
          >
            <h2 className="text-7xl font-bold text-white text-center">
              <span>Balancing</span>
              <br />
              <span>Crypto Markets</span>
            </h2>
            <p className="text-2xl text-white md:max-w-2xl text-center">
              Our fully automated proprietary quantitative trading software
              provides 24/7 liquidity to 170+ crypto assets across 25+
              centralized spot and derivative crypto exchanges.
            </p>
            <button
              className="self-center bg-orange-600 px-10 py-4 rounded-xl text-white drop-shadow"
              style={{
                background:
                  "linear-gradient(90deg, rgba(99,128,217,1) 22%, rgba(95,164,230,1) 45%, rgba(210,171,103,1) 100%)",
              }}
            >
              Get in touch
            </button>
          </Flex>
        </header>
        <Flex
          direction={"column"}
          className="pt-9 md:pt-24 gap-9 md:gap-16 pb-9 md:pb-24"
        >
          <Flex gap={"5"} direction={"column"} className="w-fit mx-auto">
            <h3 className="font-medium text-center text-5xl">
              About Gravity Team
            </h3>
            <p className="text-xl text-center">
              At Gravity Team, we are on the mission to balance the supply{" "}
              <br className="hidden md:block" /> and demand across crypto
              markets worldwide. We are a crypto
              <br className="hidden md:block" /> native market maker founded by
              traders, developers,
              <br className="hidden md:block" /> and innovators who are strong
              believers and supporters of the future{" "}
              <br className="hidden md:block" />
              of decentralization and digital assets.
            </p>
          </Flex>
          <div
            className="relative w-fit mx-auto"
            style={{
              background:
                " linear-gradient(90deg, rgba(99,128,217,1) 22%, rgba(95,164,230,1) 45%, rgba(210,171,103,1) 100%)",
            }}
          >
            <CardComponents className="invisible w-fit mx-auto" />
            <CardComponents className="absolute inset-0 z-10 bg-transparent w-fit mx-auto" />
          </div>
        </Flex>
        <Flex direction={"column"} className="pt-9 md:pt-24 gap-9 md:gap-16">
          <Flex gap={"5"} direction={"column"} className="w-fit mx-auto">
            <h3 className="font-medium text-center text-5xl">
              Crypto Market Making
            </h3>
            <p className="text-xl text-center">
              <br className="hidden md:block" /> We are a global crypto
              liquidity provider and algorithmic market maker.
              <br className="hidden md:block" /> We trade digital assets listed
              on Centralized Exchanges in
              <br className="hidden md:block" /> over 15 countries worldwide.
            </p>
          </Flex>
          <Flex
            className="w-full mt-9 md:mt-24"
            align={"start"}
            gap={"3"}
            direction={{
              md: "row",
              sm: "column",
              xs: "column",
              initial: "column-reverse",
            }}
          >
            <Flex className="md:w-1/3" gap={"4"} direction={"column"}>
              <h4 className="font-medium text-start text-4xl">
                Market Making for Crypto Projects
              </h4>
              <p className="font-medium text-xl">
                Accelerate your token’s journey by boosting its liquidity
              </p>
              <p className="text-xl">
                We invest in building long-term, sustainable relationships and
                support our projects in their growth journey with our services,
                industry expertise and network.
              </p>
              <Link
                className="hover:underline transition-all"
                href={"#"}
                content="hello"
              >
                Learn more -&gt;{" "}
              </Link>
            </Flex>
            <Flex className="md:w-2/3" justify={"center"}>
              <Image
                src="/crypto/left.png"
                alt=""
                width={"422"}
                height={"366"}
              />{" "}
            </Flex>
          </Flex>{" "}
          <Flex
            className="z-10 w-full pt-[122px] bg-container"
            align={"start"}
            direction={{
              md: "row",
              sm: "column",
              xs: "column",
              initial: "column",
            }}
          >
            <Flex className="md:w-2/3" justify={"center"}>
              <Image
                src="/crypto/left-1.png"
                alt=""
                width={"514"}
                height={"522"}
              />{" "}
            </Flex>
            <Flex className="md:w-1/3" gap={"4"} direction={"column"}>
              <h4 className="font-medium text-start text-4xl">
                Market Making for Crypto Projects
              </h4>
              <p className="font-medium text-xl">
                Accelerate your token’s journey by boosting its liquidity
              </p>
              <p className="text-xl">
                We invest in building long-term, sustainable relationships and
                support our projects in their growth journey with our services,
                industry expertise and network.
              </p>
              <Link
                className="hover:underline transition-all"
                href={"#"}
                content="hello"
              >
                Learn more -&gt;{" "}
              </Link>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          direction={"column"}
          gap={"6"}
          className="mx-auto w-fit text-center pt-9 md:pt-24 gap-9 md:gap-16"
        >
          <h4 className="font-medium text-4xl">Our Partners & Friends</h4>
          <CardPartner />
        </Flex>

        <Flex
          direction={"column"}
          gap={"6"}
          justify={"center"}
          className="mx-auto w-fit text-center pt-9 md:pt-24 pb-9 md:pb-24 gap-9 md:gap-16"
        >
          <Flex className="w-fit mx-auto">
            <h4 className="font-medium whitespace-nowrap text-4xl">
              Join Gravity Team
            </h4>
          </Flex>
          <Flex
            direction={"column"}
            gap={"4"}
            justify={"start"}
            className="md:max-w-screen-md"
          >
            <p className="whitespace-pre-line">
              Join our community of innovators, problem solvers and owners who
              apply scientific discovery techniques to make crypto markets a
              better place for everyone.
            </p>
            <p>
              As we emphasize it in our name – Gravity Team, we are a team. A
              team of bright, talented people, each masters of their specialty,
              curious about the world and eager to solve the new exciting
              cryptocurrency market problems, build cool stuff and have fun
              whilst doing so!
            </p>
            <Link href={"#"} content="hover me">
              Learn more about working with us
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default Pilot;
