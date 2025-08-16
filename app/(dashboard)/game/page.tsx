"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@radix-ui/themes";


const Game2dPage = () => {
  // Use ref to get direct access to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editRef = useRef(false);
  const [isReset, setIsReset] = useState(false);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    // Get the canvas context once the component is mounted
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let x = 0;
    let y = 0;
    ctx.clearRect(0, 0, 1000, 1000);
    let count = 0;

    for (let index = 0; index < 400; index++) {
      if (index % 2 === 0) {
        continue;
      }
      if (x > 450) {
        x = 0;
        y = y + 50;
        count = count + 1;
      }

      ctx.rect(x, y, 50, 50);
      ctx.stroke();
      ctx.strokeStyle = "gray";
      if (y === 0) {
        ctx.fillText(`${x}`, x + 10, y + 10);
      }
      if (y > 0 && count > 0) {
        ctx.fillText(`${y}`, x + 10, y + 10);
      }
      ctx.fillStyle = "black";
      ctx.closePath();
      x = x + 50;
      count = 0;
    }
    ctx.closePath();
    ctx.save();
    ctx.translate(50, 50);
    const shape = new Path2D();
    shape.rect(0, 0, 50, 50);

    ctx.fill(shape);
  }, [isReset]); // Empty dependency array to run this only once after mounting

  return (
    <div>
      <div className="mx-auto w-fit">
        <div className="mb-4 flex gap-4">
          <h2>Game2dPage</h2>
          <Button
            onClick={() => {
              editRef.current = true;
            }}
          >
            Edit Canvas
          </Button>
          <Button
            onClick={() => {
              setIsReset((prev) => !prev);
              editRef.current = false;
              const canvas = canvasRef.current;
              if (!canvas) return;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              ctx.clearRect(0, 0, 1000, 600);
            }}
          >
            Reset Canvas
          </Button>
        </div>
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          style={{ border: "1px solid black" }}
        />
      </div>
    </div>
  );
};

export default Game2dPage;
