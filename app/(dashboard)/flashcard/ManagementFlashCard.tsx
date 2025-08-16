/* eslint-disable @next/next/no-img-element */
import { Box, Card, Flex } from "@radix-ui/themes";
import React, { useMemo } from "react";

import Link from "next/link";

export const COLOR_STYLE = "#35A3DA";

function getTopics(color?: string) {
  return [
    {
      id: 0,
      title: "POPULAR",
      icon: <img src="/topics/earth.png" width={64} alt="" />,
    },
    {
      id: 21,
      title: "SCHOOL",
      icon: <img src="/topics/school.png" width={64} alt="" />,
    },
    {
      id: 2,
      title: "LEISURE ACTIVITIES",
      icon: <img src="/topics/lecture.png" width={64} alt="" />,
    },
    {
      id: 6,
      title: "WORK",
      icon: <img src="/topics/work.png" width={64} alt="" />,
    },
    {
      id: 4,
      title: "SPORT AND GAME",
      icon: <img src="/topics/sport.png" width={64} alt="" />,
    },
    {
      id: 5,
      title: "EDUCATION",
      icon: <img src="/topics/education.png" width={64} alt="" />,
    },
    {
      id: 3,
      title: "FOOD AND DRINK",
      icon: <img src="/topics/food.png" width={64} alt="" />,
    },
    {
      id: 7,
      title: "FAMILY",
      icon: <img src="/topics/family.png" width={64} alt="" />,
    },
    {
      id: 1,
      title: "TOURISM",
      icon: <img src="/topics/tourist.png" width={64} alt="" />,
    },
    {
      id: 9,
      title: "LifeStyle",
      icon: <img src="/topics/lifestyles.png" width={64} alt="" />,
    },
    {
      id: 10,
      title: "TRANSPORTATION",
      icon: <img src="/topics/transportation.png" width={64} alt="" />,
    },
    {
      id: 11,
      title: "GENDER EQUALITY",
      icon: <img src="/topics/gender-equality.png" width={64} alt="" />,
    },
    {
      id: 12,
      title: "CULTURE",
      icon: <img src="/topics/culture.png" width={64} alt="" />,
    },
    {
      id: 13,
      title: "VOLUNTEERING",
      icon: <img src="/topics/volunteer.png" width={64} alt="" />,
    },
    {
      id: 15,
      title: "THE MEDIA",
      icon: <img src="/topics/media.png" width={64} alt="" />,
    },
    {
      id: 18,
      title: "URBANISATION",
      icon: <img src="/topics/urbanisation.png" width={64} alt="" />,
    },
    {
      id: 20,
      title: "FILM",
      icon: <img src="/topics/film.png" width={64} alt="" />,
    },
    {
      id: 22,
      title: "RELATIONSHIP",
      icon: <img src="/topics/friendship.png" width={64} alt="" />,
    },
    {
      id: 29,
      title: "HOLIDAYS AND FESTIVALS",
      icon: <img src="/topics/holiday.png" width={64} alt="" />,
    },
    // { id: 30, title: "CUSTOMS AND TRADITIONS", icon: <FcBullish size={"48"} color={color} /> },
    {
      id: 24,
      title: "HEALTH",
      icon: <img src="/topics/hearth.png" width={64} alt="" />,
    },
    {
      id: 25,
      title: "COMMUNITY SERVICE",
      icon: <img src="/topics/communicate.png" width={64} alt="" />,
    },
    {
      id: 26,
      title: "MUSIC AND ART",
      icon: <img src="/topics/musical.png" width={64} alt="" />,
    },
    // { id: 28, title: "CRIME AND PUNISHMENT", icon: <FcBullish size={"48"} color={color} /> },
    {
      id: 17,
      title: "PHYSICAL APPEARANCE AND PERSONALITY",
      icon: <img src="/topics/physical.png" width={64} alt="" />,
    },
    // { id: 19, title: "THE GREEN MOVEMENT", icon: <FcBullish size={"48"} color={color} /> },
    {
      id: 30,
      title: "COUNTRY AND CITY LIFE",
      icon: <img src="/topics/city.png" width={64} alt="" />,
    },
    {
      id: 14,
      title: "NATURE AND ENVIRONMENT",
      icon: <img src="/topics/animals.png" width={64} alt="" />,
    },
    {
      id: 16,
      title: "SCIENCE AND TECHNOLOGY",
      icon: <img src="/topics/science.png" width={64} alt="" />,
    },
    {
      id: 27,
      title: "SPACE AND OTHER PLANETS",
      icon: <img src="/topics/planet.png" width={64} alt="" />,
    },
    {
      id: 23,
      title: "PLACES AND WONDERS",
      icon: <img src="/topics/forest.png" width={64} alt="" />,
    },
  ];
}

const ManagementFlashCard = () => {
  const initialTopic = useMemo(
    () => getTopics().sort((a, b) => (a.id > b.id ? 1 : -1)),
    []
  );
  return (
    <div>
      <Flex
        direction={"row"}
        gap="4"
        wrap={"wrap"}
        className="justify-center md:justify-start"
      >
        {initialTopic.map((topic) => {
          return (
            <Link
              href={`/flashcard/${topic.title
                .replace(/\s/g, "-")
                .toLocaleLowerCase()}`}
              key={topic.id}
              content={topic.title}
            >
              <span className="hidden">{topic.title}</span>
              <Box width={"240px"}>
                <Card className="hover:bg-gray-300 !border-none" size={"4"}>
                  <Flex
                    direction={"column"}
                    justify={"center"}
                    align={"center"}
                    gap={"3"}
                  >
                    <div>{topic.icon}</div>
                    <div className="text-center">{topic.title}</div>
                  </Flex>
                </Card>
              </Box>
            </Link>
          );
        })}
      </Flex>
    </div>
  );
};

export default ManagementFlashCard;
