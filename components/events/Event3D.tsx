// /components/Event3D.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { floatingObject } from "@/utils/three";
import {
  formatTwitchMessage,
  formatSubDuration,
  formatTier,
  formatGiftCount,
} from "@/utils/twitch";

import text3D from "@/utils/text3d";
import { ANSI_COLORS } from "@/utils/text3d/ansi";
import { cleanupGenerator } from "@/utils/text3d/generator";
// import { ANSI_COLORS } from "@/types/text3d";
// import { ANSI_COLORS } from "@/types/text3d";

interface Event3DProps {
  event: TwitchEvent | null;
}

export function Event3D({ event }: Event3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const headingOneRef = useRef<THREE.Group | null>(null);
  const headingTwoRef = useRef<THREE.Group | null>(null);
  const headingThreeRef = useRef<THREE.Group | null>(null);
  const headingFourRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );

    camera.position.set(0, 0, 0);
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);

    const headingGroup = new THREE.Group();

    const sizes = {
      one: 13,
      two: 8,
      three: 5,
      four: 3,
    };

    const depthScale = 1;

    const spacing = 3;

    // Username
    const loader = new FontLoader();
    loader.load("playwrite.json", function (regular) {
      const name =
        event?.type === "channel.subscription.gift" && event.event.is_anonymous
          ? "Anonymous"
          : event?.event.user_name;
      const headingOne: THREE.Group<THREE.Object3DEventMap> = text3D(
        camera,
        `${ANSI_COLORS.RED} ${name}` || "Username",
        new THREE.Vector3(0, 0, -100),
        {
          regular,
        },
        {
          size: sizes.one,
          depth: sizes.one * depthScale,
        }
      );
      headingOneRef.current = headingOne;
      headingGroup.add(headingOneRef.current);
    });

    // Other text
    loader.load("roboto_bold.json", function (bold) {
      loader.load("roboto_bold_italic.json", function (boldItalic) {
        loader.load("roboto_italic.json", function (italic) {
          loader.load("roboto_regular.json", function (regular) {
            let headingTwo: THREE.Group<THREE.Object3DEventMap>;
            let headingThree: THREE.Group<THREE.Object3DEventMap>;
            let headingFour: THREE.Group<THREE.Object3DEventMap>;

            let total_height = 0;

            switch (event?.type) {
              case "channel.follow":
                // just followed!

                total_height += sizes.one + spacing;
                headingTwo = text3D(
                  camera,
                  "just followed!",
                  new THREE.Vector3(0, -1 * total_height, -100),
                  {
                    regular,
                    italic,
                    bold,
                    boldItalic,
                  },
                  {
                    size: sizes.two,
                    depth: sizes.two * depthScale,
                  }
                );
                headingTwoRef.current = headingTwo;
                headingGroup.add(headingTwoRef.current);
                break;

              case "channel.subscribe":
                const subscribe: TwitchSub = event.event;
                total_height += sizes.one + spacing;
                headingTwo = text3D(
                  camera,
                  `is now a **Tier ${ANSI_COLORS.RED}${formatTier(
                    subscribe.tier
                  )}${ANSI_COLORS.WHITE} sub!**`,
                  new THREE.Vector3(0, -1 * total_height, -100),
                  {
                    regular,
                    italic,
                    bold,
                    boldItalic,
                  },
                  {
                    size: sizes.two,
                    depth: sizes.two * depthScale,
                  }
                );
                headingTwoRef.current = headingTwo;
                headingGroup.add(headingTwoRef.current);
                break;

              case "channel.subscription.message":
                const resub: TwitchResub = event.event;

                // resubscribed for # months at Tier #!
                total_height += sizes.one + spacing;
                headingTwo = text3D(
                  camera,
                  `resubscribed for **${formatSubDuration(
                    resub.cumulative_months,
                    ANSI_COLORS.RED
                  )}** at **Tier ${ANSI_COLORS.RED}${formatTier(resub.tier)}${
                    ANSI_COLORS.WHITE
                  }!**`,
                  new THREE.Vector3(0, -1 * total_height, -100),
                  {
                    regular,
                    italic,
                    bold,
                    boldItalic,
                  },
                  {
                    size: sizes.two,
                    depth: sizes.two * depthScale,
                  }
                );
                headingTwoRef.current = headingTwo;
                headingGroup.add(headingTwoRef.current);

                // message?
                if (resub.message.text) {
                  total_height += sizes.two + spacing;
                  headingThree = text3D(
                    camera,
                    `"${formatTwitchMessage(resub.message)}"`,
                    new THREE.Vector3(0, -1 * total_height, -100),
                    {
                      regular,
                      italic,
                      bold,
                      boldItalic,
                    },
                    {
                      size: sizes.three,
                      depth: sizes.three * depthScale,
                    }
                  );
                  headingThreeRef.current = headingThree;
                  headingGroup.add(headingThreeRef.current);
                }

                if (resub.streak_months > 1) {
                  total_height += headingThreeRef.current
                    ? sizes.three + spacing
                    : sizes.two + spacing;

                  const CURSE_LIT_ID = 116625;

                  headingFour = text3D(
                    camera,
                    `:${CURSE_LIT_ID}: **${ANSI_COLORS.RED}${resub.streak_months}${ANSI_COLORS.WHITE} month streak!**`,
                    new THREE.Vector3(0, -1 * total_height, -100),
                    {
                      regular,
                      italic,
                      bold,
                      boldItalic,
                    },
                    {
                      size: sizes.four,
                      depth: sizes.four * depthScale,
                    }
                  );
                  headingFourRef.current = headingFour;
                  headingGroup.add(headingFourRef.current);
                }

                break;
              case "channel.subscription.gift":
                const giftSub: TwitchGiftSub = event.event;

                total_height += sizes.one + spacing;
                headingTwo = text3D(
                  camera,
                  `gifted **${ANSI_COLORS.RED}${giftSub.total}${
                    ANSI_COLORS.WHITE
                  } Tier ${ANSI_COLORS.RED}${formatTier(giftSub.tier)}${
                    ANSI_COLORS.WHITE
                  } ${formatGiftCount(giftSub.total)}!**`,
                  new THREE.Vector3(0, -1 * total_height, -100),
                  {
                    regular,
                    italic,
                    bold,
                    boldItalic,
                  },
                  {
                    size: sizes.two,
                    depth: sizes.two * depthScale,
                  }
                );
                headingTwoRef.current = headingTwo;
                headingGroup.add(headingTwoRef.current);

                if (giftSub.cumulative_total > giftSub.total) {
                  total_height += sizes.two + spacing;
                  headingThree = text3D(
                    camera,
                    `They've now gifted **${ANSI_COLORS.RED}${giftSub.cumulative_total}${ANSI_COLORS.WHITE} subs** in total!`,
                    new THREE.Vector3(0, -1 * total_height, -100),
                    {
                      regular,
                      italic,
                      bold,
                      boldItalic,
                    },
                    {
                      size: sizes.three,
                      depth: sizes.three * depthScale,
                    }
                  );
                  headingThreeRef.current = headingThree;
                  headingGroup.add(headingThreeRef.current);
                }
                break;
              default:
                break;
            }

            camera.lookAt(0, (-1 * total_height) / 2, -100);

            if (headingOneRef.current) scene.add(headingOneRef.current);
            if (headingTwoRef.current) scene.add(headingTwoRef.current);
            if (headingThreeRef.current) scene.add(headingThreeRef.current);
            if (headingFourRef.current) scene.add(headingFourRef.current);
          });
        });
      });
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight("#ffffff", 10);
    scene.add(ambientLight);

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      rendererRef.current?.setSize(window.innerWidth, window.innerHeight);
    };

    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      floatingObject(headingOneRef, elapsedTime, "sin", {
        x: { amplitude: 0.01, frequency: 0.5 },
        y: { amplitude: 0.01, frequency: 1.3 },
        z: { amplitude: 0.01, frequency: 0.8 },
      });

      floatingObject(headingTwoRef, elapsedTime, "cos", {
        x: { amplitude: 0.02, frequency: 0.5 },
        y: { amplitude: 0.02, frequency: 1.3 },
        z: { amplitude: 0.02, frequency: 0.8 },
      });

      floatingObject(headingThreeRef, elapsedTime, "sin", {
        x: { amplitude: 0.03, frequency: 0.5 },
        y: { amplitude: 0.03, frequency: 1.3 },
        z: { amplitude: 0.03, frequency: 0.8 },
      });

      floatingObject(headingFourRef, elapsedTime, "cos", {
        x: { amplitude: 0.04, frequency: 0.5 },
        y: { amplitude: 0.04, frequency: 1.3 },
        z: { amplitude: 0.04, frequency: 0.8 },
      });

      rendererRef.current?.render(scene, camera);

      requestAnimationFrame(animate);
    };

    // Start animation and add resize listener
    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current?.dispose();
      scene.clear();
      cleanupGenerator();
    };
  }, [event]);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <h1></h1>
      <canvas ref={canvasRef} />
    </main>
  );
}
