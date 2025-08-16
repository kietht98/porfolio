"use client";

import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Center,
  useGLTF,
  Html,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

/* =========================
 * Types & Utils
 * ========================= */
type ViewerProps = {
  url: string;
  scale?: number;
  castShadow?: boolean;
  dracoDecoder?: string;
  height?: number;
  pivot?: "center" | "base";
};

type CameraState = { x: number; y: number; z: number; fov: number };

const round = (n: number, p = 4) => {
  const m = 10 ** p;
  return Math.round(n * m) / m;
};

const safeNum = (v: string | number, fallback = 0) => {
  const n = Number.parseFloat(`${v}`);
  return Number.isFinite(n) ? n : fallback;
};

async function checkUrl(url: string) {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return !!result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/* =========================
 * Model
 * ========================= */
function Model({
  url,
  scale = 1,
  castShadow = true,
  dracoDecoder,
  pivot = "center",
}: ViewerProps) {
  let PROXIED = url;
  if (url?.includes("https://")) {
    PROXIED = `/api/models?url=${encodeURIComponent(url)}`;
  }

  const gltf = useGLTF(
    dracoDecoder ? (PROXIED as any) : PROXIED,
    dracoDecoder
  ) as any;
  const { gl } = useThree(); // lấy renderer
  const maxAniso = gl.capabilities.getMaxAnisotropy();
  useMemo(() => {
    if (!gltf) {
      return;
    }
    gltf.scene.traverse((obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      // Shadow flags (tuỳ cảnh)
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat: any) => {
        if (!mat) return;

        // 1) Texture màu (albedo/baseColor)
        if (mat.map) {
          mat.map.anisotropy = maxAniso; // càng cao càng nét khi nhìn nghiêng
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.anisotropy = Math.min(8, maxAniso ?? 8);
          mat.map.generateMipmaps = true;
          mat.map.minFilter = THREE.LinearMipmapLinearFilter;
          mat.map.magFilter = THREE.LinearFilter;
        }

        // 2) Map phi-màu → dùng Linear (normal/rough/metal/ao/emissive/bump/alpha...)
        const NON_COLOR_KEYS = [
          "roughnessMap",
          "metalnessMap",
          "normalMap",
          "aoMap",
          "emissiveMap",
          "bumpMap",
          "displacementMap",
          "alphaMap",
        ] as const;

        NON_COLOR_KEYS.forEach((k) => {
          const tex = mat[k];
          if (tex && tex.isTexture) {
            // three r15x: LinearSRGBColorSpace cho data map (thay cho LinearEncoding cũ)
            tex.colorSpace = THREE.LinearSRGBColorSpace as any;
            tex.anisotropy = Math.min(4, maxAniso ?? 4);
          }
        });

        // 3) Một số tuỳ chọn hay dùng
        // mat.side = THREE.FrontSide;      // tránh draw 2 mặt trừ khi cần
        // if (mat.alphaMap || mat.transparent) mat.alphaTest = 0.5; // cutout
        // mat.envMapIntensity = 1.0;       // nếu dùng Environment HDRI

        mat.needsUpdate = true;
      });
    });
  }, [gltf, castShadow, maxAniso]);

  // ✅ đưa model về đúng gốc toạ độ (0,0,0) một lần
  useMemo(() => {
    if (!gltf) {
      return;
    }
    const scene = gltf?.scene as THREE.Object3D;
    scene?.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const min = box.min.clone();

    // offset khác nhau tuỳ pivot
    const offset =
      pivot === "center"
        ? center // tâm về (0,0,0)
        : new THREE.Vector3(center.x, min.y, center.z); // đáy nằm Y=0, XZ cân giữa

    scene.position.sub(offset); // dịch về gốc
    scene.updateMatrixWorld(true);
  }, [gltf, pivot]);

  return (
    <Center disableY>
      {gltf && <primitive object={gltf.scene} scale={scale} />}
      {!gltf && "Not Found"}
    </Center>
  );
}
useGLTF.preload("/model3d/coke.glb");

type AxisInputProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
};

export function AxisInput({
  label,
  value,
  onChange,
  step = 1,
}: AxisInputProps) {
  const badge =
    label === "x"
      ? "bg-rose-100 text-rose-700"
      : label === "y"
      ? "bg-emerald-100 text-emerald-700"
      : label === "z"
      ? "bg-sky-100 text-sky-700"
      : "bg-yellow-100 text-yellow-700";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(safeNum(e.target.value, value));
    },
    [onChange, value]
  );

  return (
    <label className="flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 shadow-sm">
      <span
        className={`grid size-6 place-items-center rounded-md text-xs font-semibold ${badge}`}
      >
        {label}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        onChange={handleChange}
        className="w-full bg-transparent text-sm text-slate-800 outline-none"
      />
    </label>
  );
}
type TextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  const badge =
    label === "name"
      ? "bg-purple-100 text-purple-700"
      : label === "email"
      ? "bg-sky-100 text-sky-700"
      : "bg-slate-100 text-slate-700";

  return (
    <label className="flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 shadow-sm">
      <span
        className={`grid size-6 place-items-center rounded-md text-xs font-semibold ${badge}`}
      >
        {label.charAt(0).toUpperCase()}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-slate-800 outline-none"
      />
    </label>
  );
}

/* =========================
 * Controls Panel
 * ========================= */
function AxisField({
  label,
  value,
  onChange,
  step = 10,
}: {
  label: "x" | "y" | "z" | "f";
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  const minus = useCallback(
    () => onChange(round(value - step)),
    [onChange, step, value]
  );
  const plus = useCallback(
    () => onChange(round(value + step)),
    [onChange, step, value]
  );

  const badge =
    label === "x"
      ? "bg-rose-100 text-rose-700"
      : label === "y"
      ? "bg-emerald-100 text-emerald-700"
      : label === "z"
      ? "bg-sky-100 text-sky-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <label className="flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 shadow-sm">
      <span
        className={`grid size-6 place-items-center rounded-md text-xs font-semibold ${badge}`}
      >
        {label}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        onChange={(e) => onChange(safeNum(e.target.value, value))}
        className="w-full bg-transparent text-sm text-slate-800 outline-none"
      />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={minus}
          className="grid size-6 place-items-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          aria-label={`decrease ${label}`}
        >
          –
        </button>
        <button
          type="button"
          onClick={plus}
          className="grid size-6 place-items-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          aria-label={`increase ${label}`}
        >
          +
        </button>
      </div>
    </label>
  );
}

export function CameraPanel({
  camera,
  reset,
  className,
  setCamera,
}: {
  camera: CameraState;
  reset: VoidFunction;
  setCamera: Dispatch<SetStateAction<CameraState>>;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Camera</span>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-sky-700 hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <AxisField
          label="f"
          value={camera.fov}
          step={5}
          onChange={(v) => setCamera((c) => ({ ...c, fov: v }))}
        />
        <AxisField
          label="x"
          value={camera.x}
          onChange={(v) => setCamera((c) => ({ ...c, x: v }))}
        />
        <AxisField
          label="y"
          value={camera.y}
          onChange={(v) => setCamera((c) => ({ ...c, y: v }))}
        />
        <AxisField
          label="z"
          value={camera.z}
          onChange={(v) => setCamera((c) => ({ ...c, z: v }))}
        />
      </div>
    </div>
  );
}

/* =========================
 * Viewer
 * ========================= */
export default function ModelViewer({
  url = "/models/my-model.glb",
  scale = 1.2,
  castShadow = true,
  dracoDecoder,
  height = 800,
}: ViewerProps) {
  const [urlModel, setUrlModel] = useState(url);
  const [camera, setCamera] = useState<CameraState>({
    x: 0,
    y: 0,
    z: 1000,
    fov: 1,
  });

  async function checkUrlModel(link: string) {
    let PROXIED = link;
    if (link?.includes("https://")) {
      PROXIED = `/api/models?url=${encodeURIComponent(link)}`;
    }
    try {
      const response = await fetch(PROXIED);
      const res = await response?.blob();
      console.log("res", res);
      if (res.size < 10000) {
        throw new Error();
      }
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow"
      style={{ width: "100%", height }}
    >
      {/* Control panel (sticky ở trên cùng box) */}
      <div className="absolute left-3 right-3 top-3 z-10">
        <div className="rounded-xl border border-sky-200/60 bg-white/90 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="">
            <span className="text-xs font-medium text-slate-600">Url</span>
            <TextField
              label="url"
              value={urlModel}
              onChange={async (v) => {
                console.log("v", v);
                const resp = await checkUrlModel(v);
                console.log("checkUrlModel", resp);
                setUrlModel(resp ? v : "");
              }}
            />
          </div>
          <CameraPanel
            camera={camera}
            setCamera={setCamera}
            reset={() => {
              setCamera({
                x: 0,
                y: 0,
                z: 1000,
                fov: 1,
              });
              setUrlModel(url);
            }}
          />
        </div>
      </div>

      {/* glow nền xanh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
        [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
      >
        <div className="absolute inset-x-0 -top-10 h-[120%] blur-3xl bg-gradient-to-b from-sky-300/50 via-sky-400/30 to-transparent" />
      </div>

      <Canvas dpr={[1, 2]} shadows>
        {/* nền xanh */}
        <color attach="background" args={["#0ea5e9"]} />
        {/* camera controlled by state */}
        <PerspectiveCamera
          makeDefault
          fov={camera.fov}
          position={[camera.x, camera.y, camera.z]}
        />
        {/* lights */}
        <ambientLight intensity={0.1} /> {/* ánh sáng chung nhẹ */}
        <directionalLight
          position={[0, 0, 0]} // cao hơn để bóng đẹp
          intensity={1.2} // sáng hơn chút
          castShadow
          shadow-mapSize-width={2048} // bóng mịn hơn
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[0, 5, 0]} // phía đối diện
          intensity={0.4} // ánh sáng phụ, tránh mặt tối bị đen thui
        />
        {/* axes (nhỏ thôi để khỏi che model) */}
        <axesHelper args={[5]} />
        <Suspense
          fallback={
            <Html center style={{ color: "white", fontSize: 14, opacity: 0.8 }}>
              Loading 3D…
            </Html>
          }
        >
          {urlModel.length > 0 && (
            <Model
              url={urlModel}
              scale={scale}
              castShadow={castShadow}
              dracoDecoder={dracoDecoder}
            />
          )}
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
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
  );
}
