/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef } from "react";
import { SpritePlayer } from "./ISprite";
import { Layer } from "./ILayer";
import Control from "../utils";
import { FlyEnemy } from "./IFly";

const GameBike = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const layerRef = useRef<HTMLImageElement>(null);
  const layer2Ref = useRef<HTMLImageElement>(null);
  const layer3Ref = useRef<HTMLImageElement>(null);
  const layer4Ref = useRef<HTMLImageElement>(null);
  const enemyRef = useRef<HTMLImageElement>(null);
  const enemyPlantRef = useRef<HTMLImageElement>(null);
  const enemySpiderRef = useRef<HTMLImageElement>(null);
  const fireRef = useRef<HTMLImageElement>(null);
  const boomRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const layer1 = new Layer(ctx, layerRef.current, 0.4);
    const layer2 = new Layer(ctx, layer2Ref.current, 0.2);
    const layer3 = new Layer(ctx, layer3Ref.current, 0.4);
    const layer4 = new Layer(ctx, layer4Ref.current, 0.4);

    const player = new SpritePlayer(
      ctx,
      imgRef.current,
      {
        imageEnemy: enemyRef.current ?? new Image(),
        imageEnemyPlant: enemyPlantRef.current ?? new Image(),
        imageEnemySpider: enemySpiderRef.current ?? new Image(),
      },
      {
        imageFire: fireRef.current ?? new Image(),
        imageBoom: boomRef.current ?? new Image(),
      }
    );
    let lastTime = 0;

    const drawImage = (timeStamp: number) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      ctx.clearRect(0, 0, Control.CANVAS_WIDTH, Control.CANVAS_HEIGHT);
      // shape tree
      //  layer4.update();
      // layer4.draw();
      // cloud
      layer3.update();
      layer3.draw();
      // tree
      layer2.update();
      layer2.draw();

      layer1.update();
      layer1.draw();
      player.update(deltaTime);
      player.draw();
      requestAnimationFrame(drawImage);
    };
    drawImage(0);
    player.handleMove(window);

    // disable scroll
    canvasRef.current?.addEventListener("dblclick", () => {
      document.body.style.pointerEvents = "none";
      document.body.style.overflowY = "hidden";
    });
    // exit disable scroll
    document.addEventListener("keydown", (event) => {
      if (event.key.toLocaleLowerCase() === "escape") {
        document.body.style.pointerEvents = "unset";
        document.body.style.overflowY = "auto";
      }
    });
    return () => {};
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mx-auto w-fit">
        <canvas
          ref={canvasRef}
          width={Control.CANVAS_WIDTH}
          height={Control.CANVAS_HEIGHT}
          style={{ border: "1px solid black" }}
        />
        <img
          className="hidden"
          ref={imgRef}
          src="/game/player.png"
          alt=""
          id="show-bike"
        />
        <img
          className="hidden"
          ref={layerRef}
          src="/game/layer-5.png"
          alt=""
          id="show-bike"
        />
        <img
          className="hidden"
          ref={layer2Ref}
          src="/game/layer-2.png"
          alt=""
          id="show-bike"
        />{" "}
        <img
          className="hidden"
          ref={layer3Ref}
          src="/game/layer-3.png"
          alt=""
          id="show-bike"
        />
        <img
          className="hidden"
          ref={layer4Ref}
          src="/game/layer-4.png"
          alt=""
          id="show-bike"
        />
        {/* Enemy */}
        <img
          className="hidden"
          ref={enemyRef}
          src="/game/enemy1.png"
          alt=""
          id="show-bike"
        />
        <img
          className="hidden"
          ref={enemyPlantRef}
          src="/game/enemy_plant.png"
          alt=""
          id="show-bike"
        />
        <img
          className="hidden"
          ref={enemySpiderRef}
          src="/game/enemy_spider_big.png"
          alt=""
          id="show-bike"
        />
        <img
          className="hidden"
          ref={fireRef}
          src="/game/fire.png"
          alt=""
          id="show-bike"
        />
        <img
          className="hidden"
          ref={boomRef}
          src="/game/boom.png"
          alt=""
          id="show-bike"
        />
      </div>
    </div>
  );
};

export default GameBike;
