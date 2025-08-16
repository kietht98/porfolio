"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CameraPanel } from "./View3D";

/* --- progress 0..1 theo scroll toàn trang --- */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const get = () => {
      const h = document.documentElement;
      const st = h.scrollTop || window.scrollY || 0;
      const sh = Math.max(1, h.scrollHeight - h.clientHeight);
      setP(Math.min(1, Math.max(0, st / sh)));
    };
    get();
    window.addEventListener("scroll", get, { passive: true });
    window.addEventListener("resize", get);
    return () => {
      window.removeEventListener("scroll", get);
      window.removeEventListener("resize", get);
    };
  }, []);
  return p;
}

type Pivot = "center" | "bottomCenter";

function normalizeTexture(tex?: THREE.Texture, aniso = 1) {
  if (!tex) return;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(tex.anisotropy ?? 1, aniso);
  tex.needsUpdate = true;
}

function tweakMaterialsAndShadows(
  obj: THREE.Object3D,
  { insideOut = false, anisotropy = 1, enableShadows = true } = {}
) {
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;

    if (enableShadows) {
      m.castShadow = true;
      m.receiveShadow = true;
    }

    const mats = Array.isArray(m.material) ? m.material : [m.material];
    for (const mat of mats) {
      if (!mat) continue;
      const anyMat = mat as any;

      // Albedo/baseColor & emissive nên để sRGB
      normalizeTexture(anyMat.map, anisotropy);
      if ("emissiveMap" in anyMat)
        normalizeTexture(anyMat.emissiveMap, anisotropy);

      if (insideOut && "side" in anyMat && anyMat.side !== THREE.BackSide) {
        anyMat.side = THREE.BackSide;
        anyMat.needsUpdate = true;
      }
    }
  });
}

function fitAndRecenter(
  obj: THREE.Object3D,
  { targetMaxSize = 2, pivot = "bottomCenter" as Pivot } = {}
) {
  // 1) Tính bbox ban đầu
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxAxis = Math.max(size.x, size.y, size.z);
  if (maxAxis > 0) {
    const s = targetMaxSize / maxAxis;
    obj.scale.multiplyScalar(s);
    obj.updateMatrixWorld(true);
  }

  // 2) Recompute bbox sau khi scale rồi mới offset
  const box2 = new THREE.Box3().setFromObject(obj);
  const center = box2.getCenter(new THREE.Vector3());
  const min = box2.min.clone();
  const offset =
    pivot === "center" ? center : new THREE.Vector3(center.x, min.y, center.z); // bottomCenter: đáy nằm Y=0, XZ cân giữa

  obj.position.sub(offset);
  obj.updateMatrixWorld(true);
}

function useNormalizeGltf(
  gltf: { scene?: THREE.Object3D },
  { insideOut = false, targetMaxSize = 2, pivot = "bottomCenter" as Pivot } = {}
) {
  const { gl } = useThree();
  const maxAniso = useMemo(
    () =>
      gl.capabilities.getMaxAnisotropy ? gl.capabilities.getMaxAnisotropy() : 8,
    [gl]
  );

  useLayoutEffect(() => {
    const scene = gltf.scene;
    if (!scene) return;

    tweakMaterialsAndShadows(scene, {
      insideOut,
      anisotropy: maxAniso,
      enableShadows: true,
    });
    fitAndRecenter(scene, { targetMaxSize, pivot });
  }, [gltf?.scene, insideOut, targetMaxSize, pivot, maxAniso]);
}

/* --- Model: Intro 360° + Scroll rotate + Parallax --- */
function CokeCan({
  url,
  scale = 10,
  // Intro
  insideOut = true,
  // Scroll
  turns = 3, // số vòng khi scroll 0→1
  tilt = 0.12, // nghiêng X (rad)
  moveY = 1.4, // biên độ trượt dọc
  invert = false, // đảo chiều xoay
}: {
  url: string;
  scale?: number;
  insideOut?: boolean;
  introTurns?: number;
  introDuration?: number;
  turns?: number; // muốn quay 3 vòng khi scroll từ 0 → 1
  tilt?: number;
  moveY?: number;
  invert?: boolean;
}) {
  const gltf = useGLTF(url) as any;
  const progress = useScrollProgress();

  // 2 group: introGroup (quay 360 lúc mount), bên trong là scrollGroup (theo scroll)
  const introGroup = useRef<THREE.Group>(null);
  const scrollGroup = useRef<THREE.Group>(null);

  // Chuẩn hoá material + đưa tâm về gốc để xoay chuẩn
  useMemo(() => {
    const scene = gltf.scene as THREE.Object3D;

    scene.traverse((o: THREE.Object3D) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;

      m.castShadow = true;
      m.receiveShadow = true;

      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mat: THREE.Material | any) => {
        if (!mat) return;
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.anisotropy = 8;
        }
        if (insideOut) {
          mat.side = THREE.BackSide; // bắt đầu từ “mặt trong”
          mat.needsUpdate = true;
        }
      });
    });

    const box = new THREE.Box3().setFromObject(scene);

    const size = new THREE.Vector3();
    box.getSize(size);

    const maxAxis = Math.max(size.x, size.y, size.z);
    scene.scale.multiplyScalar(2 / maxAxis); // scale để trục lớn nhất = 2 đơn vị
    const center = box.getCenter(new THREE.Vector3());
    const min = box.min.clone();

    // offset khác nhau tuỳ pivot
    const offset = new THREE.Vector3(center.x, min.y, center.z); // đáy nằm Y=0, XZ cân giữa

    scene.position.sub(offset); // dịch về gốc
    scene.updateMatrixWorld(true);
  }, [gltf, insideOut]);

  // Scroll: xoay + trượt (damp mượt)
  /*Mẹo nhanh
   * Muốn “lắc” nhanh hơn → tăng yawFreq.
   * Muốn xoay rộng hơn → tăng yawAmp (ví dụ Math.PI/4 = ±45°).
   * Muốn đảo chiều mặc định → đổi invert.
   */
  useFrame((_, dt) => {
    if (!scrollGroup.current) return;
    const sign = invert ? -1 : 1;

    // --- chọn 1 trong 2 block dưới ---

    // A) Sin (mượt):
    const yawAmp = Math.PI / 6; // ±30°
    const yawFreq = 1; // 1 lần qua-trái-quay-phải / 1 progress
    const targetRotY =
      Math.sin(progress * Math.PI * 2 * yawFreq) * yawAmp * sign;

    // B) Triangle (tốc độ đều):
    // function pingpong(t){ return 1 - Math.abs((t % 2) - 1); }
    // function tri01to11(x){ return x * 2 - 1; }
    // const yawAmp = Math.PI / 6;
    // const yawFreq = 1;
    // const tri = tri01to11(pingpong(progress * yawFreq));
    // const targetRotY = tri * yawAmp * sign;

    const targetRotX = Math.sin(progress * Math.PI * 2) * tilt;
    const targetRotZ = Math.sin(progress * Math.PI * 2) * tilt;

    const targetPosY = THREE.MathUtils.lerp(moveY / 2, -moveY / 2, progress);
    const amplitude = 1;
    const targetPosX = Math.sin(progress * Math.PI * 2) * amplitude;

    const k = 6;
    const g = scrollGroup.current;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, k, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRotZ, k, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, k, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, targetPosX, k, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetPosY, k, dt);
  });

  return (
    <Center>
      <group ref={introGroup}>
        <group ref={scrollGroup}>
          <primitive object={gltf.scene} scale={scale} />
        </group>
      </group>
    </Center>
  );
}

const URL = "/model3d/coke.glb";
useGLTF.preload(URL);
// x xoay quanh trục thảng đứng, hướng trái sang phải ngược lại
// y xoay quanh trục nằm ngang,
// z xoay quanh trục thẳng đứng, xa lại gần
/* ================= Viewer demo ================= */
export default function CokeScrollViewer() {
  const [camera] = useState<any>({
    x: 0,
    y: 0,
    z: 100,
    fov: 2,
  });

  return (
    <div
      style={{
        height: "300vh",
        position: "relative",
        width: "100%",
      }}
    >
      <div className="fixed inset-0">
        <Canvas dpr={[1, 2]} shadows gl={{ antialias: true }}>
          <color attach="background" args={["#000000"]} />
          {/* camera controlled by state */}
          <PerspectiveCamera
            makeDefault
            fov={camera.fov}
            position={[camera.x, camera.y, camera.z]}
          />
          <ambientLight intensity={0.35} />
          <hemisphereLight intensity={0.8} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-bias={-0.0002}
            shadow-normalBias={0.02}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
          />
          <React.Suspense
            fallback={
              <Html center style={{ color: "white", opacity: 0.85 }}>
                Loading 3D…
              </Html>
            }
          >
            <CokeCan
              url={URL}
              // Intro
              insideOut
              introTurns={1}
              introDuration={1.2}
              // Scroll
              turns={3}
              tilt={0.75}
              moveY={1.4}
              invert={false}
            />
            <Environment preset="studio" />
          </React.Suspense>

          {/* Khoá rotate/pan để tập trung scroll-effect */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            makeDefault
            enableDamping
            dampingFactor={0.08}
            autoRotate
            autoRotateSpeed={1}
            target={[0, 0, 0]} // xoay & nhìn chính giữa
            maxPolarAngle={Math.PI * 0.95}
            minPolarAngle={0}
          />
        </Canvas>
      </div>
    </div>
  );
}
