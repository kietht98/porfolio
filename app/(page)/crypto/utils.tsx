import { GridProps, Grid, Flex } from "@radix-ui/themes";
import Image from "next/image";

const strings = [
  "~$100 billion",
  "0.8%",
  "~30",
  "~30",
  "~30",
  "~30",
  "~30",
  "~30",
];
const subStrings = [
  "cumulative trading volume to date",
  "cumulative trading volume to date",
  "cumulative trading volume to date",
  "cumulative trading volume to date",
  "cumulative trading volume to date",
  "cumulative trading volume to date",
  "cumulative trading volume to date",
  "cumulative trading volume to date",
];
const getCards = () => {
  const arr = [];
  for (let index = 0; index < 8; index++) {
    arr.push({
      id: index,
      title: strings[index],
      desc: subStrings[index],
    });
  }
  return arr;
};

export const CardComponents = ({ className }: Pick<GridProps, "className">) => {
  return (
    <Grid
      columns={{
        md: "4",
        sm: "2",
        xs: "1",
      }}
      rows={{
        md: "2",
        sm: "4",
        xs: "8",
      }}
      className={`${className} `}
      gap={"1"}
    >
      {getCards().map((item, index) => {
        return (
          <Flex
            gap={"3"}
            direction={"column"}
            className="bg-black px-6 py-6 hover:bg-transparent text-center"
            key={item?.id}
          >
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </Flex>
        );
      })}
    </Grid>
  );
};

const partners = [
  {
    id: 1,
    title: "",
    image: "/crypto/coin.svg",
  },
  {
    id: 2,
    title: "",
    image: "/crypto/ant.svg",
  },
  {
    id: 3,
    title: "",
    image: "/crypto/lucky.svg",
  },
  {
    id: 4,
    title: "",
    image: "/crypto/cenz.svg",
  },
  {
    id: 5,
    title: "",
    image: "/crypto/gmr.svg",
  },
  {
    id: 6,
    title: "",
    image: "/crypto/mona.svg",
  },
];

export const CardPartner = () => {
  return (
    <Grid
      columns={{
        md: "3",
        xs: "1",
        sm: "1",
      }}
      rows={{
        md: "2",
        xs: "4",
        sm: "4",
      }}
      gap={"4"}
    >
      {partners.map((partner) => {
        return (
          <Flex
            key={partner.id}
            justify={"center"}
            className="bg-glass p-12 border rounded-md hover:shadow-lg hover:bg-gray-600"
          >
            <Image src={partner.image} alt="" width={144} height={144} />
          </Flex>
        );
      })}
    </Grid>
  );
};
