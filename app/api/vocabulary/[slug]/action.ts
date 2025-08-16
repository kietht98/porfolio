import { writeFile, existsSync, readFileSync } from "fs";
import { NextResponse } from "next/server";
import { getFileLocal, getFileSource } from "../../flashcard/[slug]/action";

const createFile = (slug: string, pathFile: string) => {
  const vocab = require(`./${slug}.json`);
  writeFile(pathFile, JSON.stringify(vocab.phrases), (error) => {
    console.log("error create file", error);
  });
  return NextResponse.json({ data: vocab.phrases });
};

const LIST_GRAMMAR = ["adj", "adv", "common", "conjunction", "noun"];
const getTotalCounts = () => {
  const objGrammar = {
    adv: 0,
    adj: 0,
    noun: 0,
    phrases: 0,
    conjunction: 0,
    tenses: 0,
  };

  for (const key in LIST_GRAMMAR) {
    const element = LIST_GRAMMAR[key];
    const pathFile = `${__dirname}/${element}.json`;
    if (!existsSync(pathFile)) {
      return createFile(element, pathFile);
    }
    const res = readFileSync(pathFile, {
      encoding: "utf8",
    });
    const grammar = JSON.parse(res);
    objGrammar[element as keyof typeof objGrammar] = grammar.length;
  }

  return NextResponse.json({
    data: objGrammar,
  });
};

const getGrammar = (params: any) => {
  const pathFileSync = `${__dirname}/${params.slug}.json`;
  const pathFileSource = `./public/uploads/${params.slug}.json`;
  if (existsSync(pathFileSync)) {
    try {
      const uniqueObjectsArray = getFileLocal(pathFileSync, pathFileSource);
      return NextResponse.json({
        data: uniqueObjectsArray,
      });
    } catch (error) {
      return NextResponse.error();
    }
  }
  if (existsSync(pathFileSource)) {
    try {
      const uniqueObjectsArray = getFileSource(pathFileSync, params.slug);
      return NextResponse.json({ data: uniqueObjectsArray });
    } catch (error) {
      return NextResponse.error();
    }
  }
};

function exportFile(type: string, slug: string) {
  // Define the path to the file
  const filePath = `${__dirname}/${type}.json`;
  // Read the file from the filesystem
  const fileBuffer = readFileSync(filePath);

  // Create a response with the file
  const response = new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="${__dirname}/${slug}.json"`,
    },
  });

  return response;
}

function updateFile(slug: string, param: any) {
  const res = readFileSync(`${__dirname}/${slug}.json`, {
    encoding: "utf8",
  });

  let writeData = JSON.parse(res).concat([
    { phrase: param.key, meaning: param.content },
  ]);
  writeFile(`${__dirname}/${slug}.json`, JSON.stringify(writeData), (err) => {
    console.log(err);
  });
}

export {
  LIST_GRAMMAR,
  createFile,
  existsSync,
  getGrammar,
  getTotalCounts,
  exportFile,
  updateFile,
};
