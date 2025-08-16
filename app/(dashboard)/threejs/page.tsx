"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Group, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function ThreeJsPage() {
  // Inputs
  const xRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);
  const zRef = useRef<HTMLInputElement>(null);

  const xRotateRef = useRef<HTMLInputElement>(null);
  const yRotateRef = useRef<HTMLInputElement>(null);
  const zRotateRef = useRef<HTMLInputElement>(null);

  const xLookRef = useRef<HTMLInputElement>(null);
  const yLookRef = useRef<HTMLInputElement>(null);
  const zLookRef = useRef<HTMLInputElement>(null);

  // Mount point
  const containerRef = useRef<HTMLDivElement>(null);

  // Three holders
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const groupRef = useRef<Group>();
  const dragging = useRef(false);
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const angleRef = useRef(0);
  const modelsRef = useRef<THREE.Object3D[]>([]); // to dispose

  useEffect(() => {
    const container = containerRef.current!;
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#e8eaee");
    sceneRef.current = scene;

    // Camera
    const aspect = 1080 / 475; // giữ tỉ lệ bạn đang dùng
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
    camera.position.set(0, 140, 150);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(1080, 475);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x334455, 0.9);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 10, 4);
    scene.add(hemi, dir);

    // A subtle ground to orient
    const grid = new THREE.GridHelper(500, 20, 0x667, 0x99a);
    (grid.material as THREE.Material).opacity = 0.15;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Group root
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Mouse/drag
    const onPointerDown = () => {
      dragging.current = true;
      document.body.style.cursor = "grabbing";
    };
    const onPointerUp = () => {
      dragging.current = false;
      mouse.current.set(0, 0);
      document.body.style.cursor = "grab";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      // scale nhỏ để làm góc quay mượt
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 0.1;
    };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    // Resize (nếu bạn muốn khung co giãn, đổi 1080/475 bằng container size)
    const onResize = () => {
      // ví dụ: giữ size cố định; nếu muốn responsive, lấy container.clientWidth/Height
      const w = 1080;
      const h = 475;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Load models
    const loader = new GLTFLoader();

    loader.load(
      "/sea/scene.gltf",
      (gltf) => {
        const model = gltf.scene || new Object3D();
        model.scale.set(0.2, 0.2, 0.2);
        model.position.set(0, 0, 0);
        model.lookAt(0, 0, 0);
        group.add(model);
        modelsRef.current.push(model);
      },
      undefined,
      (err) => console.error("SEA load error:", err)
    );

    loader.load(
      "/fighting_falcon/scene.gltf",
      (gltf) => {
        const bird = gltf.scene || new Object3D();
        bird.scale.set(1, 1, 1);
        bird.position.set(0, 60, 0);
        bird.lookAt(0, 0, 0);
        group.add(bird);
        modelsRef.current.push(bird);
      },
      undefined,
      (err) => console.error("Falcon load error:", err)
    );

    // Animate
    const animate = () => {
      // apply mouse drag rotation nhẹ cho toàn scene
      scene.rotation.y += mouse.current.x;
      scene.rotation.x += mouse.current.y * 0.5;

      // đọc input chỉ 1 lần/khung
      const camX = Number(xRef.current?.value ?? -50);
      const camY = Number(yRef.current?.value ?? 140);
      const camZ = Number(zRef.current?.value ?? 150);
      camera.position.set(camX, camY, camZ);

      const lookX = Number(xLookRef.current?.value ?? 0);
      const lookY = Number(yLookRef.current?.value ?? 0);
      const lookZ = Number(zLookRef.current?.value ?? 0);
      camera.lookAt(lookX, lookY, lookZ);

      // optional: rotate a child (nếu có model thứ 2)
      const second = group.children[1];
      if (second) {
        angleRef.current += 0.05;
        // orbit nhỏ quanh gốc
        const r = 1.5;
        second.position.x = Math.sin(angleRef.current) * r;
        second.position.z = -Math.cos(angleRef.current) * r;
      }

      // raycaster (nếu bạn muốn pick sau này)
      raycaster.current.setFromCamera(mouse.current, camera);

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);

      // remove from scene
      modelsRef.current.forEach((obj) => {
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose?.());
            } else {
              mesh.material?.dispose?.();
            }
          }
        });
        group.remove(obj);
      });
      modelsRef.current = [];

      scene.clear();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="p-2 flex flex-wrap gap-4">
      <div id="container" className="hidden" />
      <div ref={containerRef} id="threejs" className="mx-auto w-fit" />
      <div className="flex gap-6 flex-wrap">
        <div className="flex flex-col gap-3 w-fit">
          <h2 className="font-semibold">Camera Position</h2>
          <input
            ref={xRef}
            type="number"
            placeholder="x"
            className="py-2.5 px-3 border rounded-md"
            defaultValue={-50}
          />
          <input
            ref={yRef}
            type="number"
            placeholder="y"
            className="py-2.5 px-3 border rounded-md"
            defaultValue={140}
          />
          <input
            ref={zRef}
            type="number"
            placeholder="z"
            className="py-2.5 px-3 border rounded-md"
            defaultValue={150}
          />
        </div>

        <div className="flex flex-col gap-3 w-fit">
          <h2 className="font-semibold">Camera LookAt</h2>
          <input
            ref={xLookRef}
            type="number"
            placeholder="x"
            className="py-2.5 px-3 border rounded-md"
            defaultValue={0}
          />
          <input
            ref={yLookRef}
            type="number"
            placeholder="y"
            className="py-2.5 px-3 border rounded-md"
            defaultValue={0}
          />
          <input
            ref={zLookRef}
            type="number"
            placeholder="z"
            className="py-2.5 px-3 border rounded-md"
            defaultValue={0}
          />
        </div>

        <div className="flex flex-col gap-3 w-fit">
          <h2 className="font-semibold">Rotate (reserved)</h2>
          <input
            ref={xRotateRef}
            type="number"
            placeholder="x"
            className="py-2.5 px-3 border rounded-md"
          />
          <input
            ref={yRotateRef}
            type="number"
            placeholder="y"
            className="py-2.5 px-3 border rounded-md"
          />
          <input
            ref={zRotateRef}
            type="number"
            placeholder="z"
            className="py-2.5 px-3 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
