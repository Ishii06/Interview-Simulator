"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Group, Mesh } from "three";
import type { GLTF } from "three-stdlib";

type RhubarbMouthCue = {
  start: number;
  end: number;
  value: string;
};

type RhubarbLipSync = {
  mouthCues?: RhubarbMouthCue[];
};

type InterviewAvatarProps = {
  modelPath: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  lipSyncUrl: string | null;
};

type AvatarGLTF = GLTF & {
  scene: Group;
};

const RPM_VISEMES = [
  "viseme_sil",
  "viseme_PP",
  "viseme_FF",
  "viseme_TH",
  "viseme_DD",
  "viseme_kk",
  "viseme_CH",
  "viseme_SS",
  "viseme_nn",
  "viseme_RR",
  "viseme_aa",
  "viseme_E",
  "viseme_ih",
  "viseme_oh",
  "viseme_ou",
] as const;

const RHUBARB_TO_RPM: Record<string, (typeof RPM_VISEMES)[number]> = {
  A: "viseme_aa",
  B: "viseme_PP",
  C: "viseme_E",
  D: "viseme_DD",
  E: "viseme_ih",
  F: "viseme_ou",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_sil",
};

function AvatarModel({
  modelPath,
  audioRef,
  mouthCues,
}: {
  modelPath: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  mouthCues: RhubarbMouthCue[];
}) {
  const gltf = useGLTF(modelPath) as AvatarGLTF;

  const visemeMeshes = useMemo(() => {
    const meshes: Mesh[] = [];
    gltf.scene.traverse((node) => {
      const mesh = node as Mesh;
      if (
        mesh.isMesh &&
        mesh.morphTargetDictionary &&
        mesh.morphTargetInfluences &&
        RPM_VISEMES.some((viseme) => mesh.morphTargetDictionary?.[viseme] !== undefined)
      ) {
        meshes.push(mesh);
      }
    });
    return meshes;
  }, [gltf.scene]);

  useFrame(() => {
    const audio = audioRef.current;
    const currentTime = audio && !audio.paused ? audio.currentTime : -1;

    const activeCue =
      currentTime >= 0
        ? mouthCues.find((cue) => currentTime >= cue.start && currentTime <= cue.end)
        : null;

    const targetViseme = RHUBARB_TO_RPM[activeCue?.value || "X"] || "viseme_sil";

    for (const mesh of visemeMeshes) {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
        continue;
      }

      for (const viseme of RPM_VISEMES) {
        const index = mesh.morphTargetDictionary[viseme];
        if (index !== undefined) {
          mesh.morphTargetInfluences[index] *= 0.75;
        }
      }

      const targetIndex = mesh.morphTargetDictionary[targetViseme];
      if (targetIndex !== undefined) {
        mesh.morphTargetInfluences[targetIndex] = 1;
      }
    }
  });

  return <primitive object={gltf.scene} position={[0, -3.65, 0]} scale={2.5} />;
}

function LoadingAvatar() {
  return (
    <div className="flex h-90 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-sm text-zinc-500">
      Loading avatar...
    </div>
  );
}

export default function InterviewAvatar({ modelPath, audioRef, lipSyncUrl }: InterviewAvatarProps) {
  const [mouthCues, setMouthCues] = useState<RhubarbMouthCue[]>([]);
  const [isContextLost, setIsContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadLipSync = async () => {
      if (!lipSyncUrl) {
        setMouthCues([]);
        return;
      }

      try {
        const res = await fetch(lipSyncUrl);
        if (!res.ok) {
          throw new Error("Failed to fetch lip sync JSON");
        }

        const data = (await res.json()) as RhubarbLipSync;
        if (!ignore) {
          setMouthCues(Array.isArray(data?.mouthCues) ? data.mouthCues : []);
        }
      } catch {
        if (!ignore) {
          setMouthCues([]);
        }
      }
    };

    loadLipSync();

    return () => {
      ignore = true;
    };
  }, [lipSyncUrl]);

  const handleCanvasCreated = useCallback(
    ({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
      const canvas = gl.domElement;

      const onContextLost = (event: Event) => {
        event.preventDefault();
        setIsContextLost(true);
      };

      const onContextRestored = () => {
        setIsContextLost(false);
      };

      canvas.addEventListener("webglcontextlost", onContextLost, false);
      canvas.addEventListener("webglcontextrestored", onContextRestored, false);

      // Cleanup listeners when canvas is removed to avoid duplicate handlers.
      const disconnect = () => {
        canvas.removeEventListener("webglcontextlost", onContextLost, false);
        canvas.removeEventListener("webglcontextrestored", onContextRestored, false);
      };

      canvas.addEventListener("webglcontextcreationerror", disconnect, { once: true });
    },
    []
  );

  const resetCanvas = () => {
    setIsContextLost(false);
    setCanvasKey((prev) => prev + 1);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[radial-gradient(circle_at_50%_15%,rgba(29,78,216,0.18),rgba(3,7,18,1))]">
      <div className="h-90 w-full">
        {isContextLost ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-950/80 px-4 text-center text-zinc-300">
            <p className="text-sm">3D renderer context was lost.</p>
            <button
              type="button"
              onClick={resetCanvas}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-zinc-800"
            >
              Reset Avatar Renderer
            </button>
          </div>
        ) : (
          <Suspense fallback={<LoadingAvatar />}>
            <Canvas
              key={canvasKey}
              dpr={[1, 1.5]}
              camera={{ position: [0, 1.45, 2.3], fov: 32 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              onCreated={handleCanvasCreated}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
              <directionalLight position={[-2, 1, 1]} intensity={0.4} color="#9ca3af" />

              <AvatarModel modelPath={modelPath} audioRef={audioRef} mouthCues={mouthCues} />
              <Environment preset="city" />
              <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.9} maxPolarAngle={1.7} />
            </Canvas>
          </Suspense>
        )}
      </div>
    </div>
  );
}

useGLTF.preload("/avatar/rpm-avatar.glb");
