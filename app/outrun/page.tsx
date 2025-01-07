"use client";

import React, { useEffect, useRef, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

function Outrun() {
    const router = useRouter();
  const searchParams = useSearchParams();
  const text = searchParams.get("text");
    const [inputText, setInputText] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText('/outrun?text=');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            router.push(`/outrun?text=${encodeURIComponent(inputText.trim())}`);
        }
    };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const textPivotRef = useRef<THREE.Group | null>(null);

  const bloomComposerRef = useRef<EffectComposer | null>(null);
  const finalComposerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Core setup
    const BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      threshold: 0,
      strength: 0.34,
      radius: 0.13,
      exposure: 1,
    };

    const plane = {
      width: 200,
      height: 500,
      widthSegments: 32,
      heightSegments: 32,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );

    camera.position.set(0, 1, 5);
    // camera.lookAt(0, 10, 0);
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
    });
    rendererRef.current.setClearColor(0x030000);
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);

    // Bloom Stuff
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    bloomComposerRef.current = new EffectComposer(rendererRef.current);
    bloomComposerRef.current.renderToScreen = false;
    bloomComposerRef.current.addPass(renderScene);
    bloomComposerRef.current.addPass(bloomPass);

    const mixPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: {
            value: bloomComposerRef.current.renderTarget2.texture,
          },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
        fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;

          varying vec2 vUv;

          void main() {
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
          }
        `,
        defines: {},
      }),
      "baseTexture"
    );
    mixPass.needsSwap = true;

    const outputPass = new OutputPass();

    finalComposerRef.current = new EffectComposer(rendererRef.current);
    finalComposerRef.current.addPass(renderScene);
    finalComposerRef.current.addPass(mixPass);
    finalComposerRef.current.addPass(outputPass);

    // Fog
    // const fog = new THREE.Fog('#030000', 100, 250);
    // scene.fog = fog;

    // // Scene objects setup
    // const textureLoader = new THREE.TextureLoader();

    // // Galaxy
    // const milkyWay = textureLoader.load("/sky.jpg");
    // milkyWay.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = milkyWay;

    // Grid
    const gridGeometry = new THREE.PlaneGeometry(
      plane.width,
      plane.height,
      plane.widthSegments,
      plane.heightSegments
    );

    const gridMaterial = new THREE.ShaderMaterial({
      uniforms: {
        gridColor: { value: new THREE.Color(0.67, 0.0, 0.0) },
        widthSegments: { value: plane.widthSegments },
        heightSegments: { value: plane.heightSegments },
        lineWidth: { value: 1.0 },
        displacement: { value: 21 },
        path: { value: 4 },
        time: { value: 0.0 },
        fogStart: { value: 144.0 }, // Distance where fog begins
        fogEnd: { value: 233.0 }, // Distance where fog completely obscures
        fogColor: { value: new THREE.Color(0x130000) }, // Distance where fog completely obscures
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vFogDepth;    // Add this to pass view distance to fragment shader
        uniform float displacement;
        uniform float time;
        uniform uint widthSegments;
        uniform uint heightSegments;
        uniform uint path;
        
        // Random function
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float calculateDisplacement(float x, float y, float pathWidth) {
          // Previous displacement calculation code remains the same
          float pathHalfWidth = (float(path) / 2.0) / float(widthSegments);
          float center = 0.5;
          float distFromCenter = abs(x - center);
          float mirroredY = y > 0.5 ? 1.0 - y : y;
          
          if (distFromCenter < pathHalfWidth) {
            return 0.0;
          } else {
            float maxDist = 0.5 - pathHalfWidth;
            float distFromEdge = distFromCenter - pathHalfWidth;
            float normalizedDist = distFromEdge / maxDist;
            float baseIntensity = sin(normalizedDist * 3.14159);
            float rand = random(vec2(floor(x * float(widthSegments)), floor(mirroredY * float(heightSegments))));
            return baseIntensity * rand * displacement;
          }
        }

        void main() {
          vUv = uv;
          
          // Calculate displacement
          float verticalDisplacement = calculateDisplacement(vUv.x, vUv.y, float(path));
          
          // Apply displacement
          vec3 newPosition = position;
          newPosition.z += verticalDisplacement;
          
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Calculate view distance for fog
          vFogDepth = -mvPosition.z;
        }
      `,
      fragmentShader: `
        uniform vec3 gridColor;
        uniform uint widthSegments;
        uniform uint heightSegments;
        uniform float lineWidth;
        uniform float fogStart;
        uniform float fogEnd;
        uniform vec3 fogColor; // Add this line for the fog color
        varying vec2 vUv;
        varying float vFogDepth;

        void main() {
          vec2 coord = vUv * vec2(widthSegments, heightSegments);
          vec2 ddx = dFdx(coord);
          vec2 ddy = dFdy(coord);
          vec2 adjustedWidth = vec2(
            (2.0 / lineWidth) * length(vec2(ddx.x, ddy.x)),
            (2.0 / lineWidth) * length(vec2(ddx.y, ddy.y))
          );
          
          vec2 grid = vec2(
            smoothstep(0.99 - adjustedWidth.x, 0.99, fract(coord.x)) +
            smoothstep(0.01 + adjustedWidth.x, 0.01, fract(coord.x)),
            smoothstep(0.99 - adjustedWidth.y, 0.99, fract(coord.y)) +
            smoothstep(0.01 + adjustedWidth.y, 0.01, fract(coord.y))
          );
          
          float line = max(grid.x, grid.y);
          vec3 intensity = gridColor * vec3(line);
          
          // Calculate fog factor
          float fogFactor = clamp((fogEnd - vFogDepth) / (fogEnd - fogStart), 0.0, 1.0);
          
          // Interpolate between intensity and fogColor based on fogFactor
          vec3 finalColor = mix(fogColor, intensity, fogFactor);
          
          // Set the final color with full opacity
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true, // Enable transparency for fog fade-out
    });

    // const gridTexture = textureLoader.load("grid.svg");
    // const gridTerrainTexture = textureLoader.load("grid_terrain.svg");
    // const gridMaterial = new THREE.MeshStandardMaterial({
    //   map: gridTexture,
    //   displacementMap: gridTerrainTexture,
    //   displacementScale: 0.5,
    //   // wireframe: true,
    // });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;

    grid.layers.enable(BLOOM_SCENE);
    scene.add(grid);

    const anotherGrid = new THREE.Mesh(gridGeometry, gridMaterial);
    anotherGrid.rotation.x = -Math.PI / 2;

    grid.layers.enable(BLOOM_SCENE);
    scene.add(anotherGrid);

    // Text
    const loader = new FontLoader();
    loader.load("playwrite.json", function (font) {
      const textGeometry = new TextGeometry(text || "Hello World", {
        font: font,
        size: 55,
        // steps: 1,
        // bevelThickness: 50,
        // bevelSize: 50,
      });

      const textMesh = new THREE.Mesh(textGeometry, [
        new THREE.MeshBasicMaterial({ color: 0xaa0000 }),
        new THREE.MeshBasicMaterial({ color: 0x770000 }),
      ]);

      // Create a bounding box:
      const box = new THREE.Box3().setFromObject(textMesh);

      // Reset mesh position:
      box.getCenter(textMesh.position);
      textMesh.position.multiplyScalar(-1);
      textMesh.layers.enable(BLOOM_SCENE);

      // Then add the mesh to a pivot object:
      const pivot = new THREE.Group();
      pivot.add(textMesh);

      const x = 0;
      const y = 144;
      const z = -610;

      pivot.position.x = x;
      pivot.position.y = y;
      pivot.position.z = z;

      const opposite = Math.abs(y - camera.position.y);
      const adjacent = Math.abs(z - camera.position.z);

      const radians = opposite / adjacent;

      textMesh.rotation.x = radians;

      camera.lookAt(x, y, z);

      textPivotRef.current = pivot;
      scene.add(textPivotRef.current);
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

    // const pivot = new THREE.Group();
    // scene.add(pivot);
    // pivot.add();

    // Animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      grid.position.z = (elapsedTime * 20) % plane.height;
      anotherGrid.position.z =
        ((elapsedTime * 20) % plane.height) - plane.height;

      // Text mesh animations
      if (textPivotRef.current) {
        // Floating animation - use sine wave for smooth up/down motion
        const xAmplitude = 0.025; // How far it moves up/down
        const xFrequency = 0.5; // How fast it moves up/down
        textPivotRef.current.rotation.x =
          Math.sin(elapsedTime * xFrequency) * xAmplitude;

        // Floating animation - use sine wave for smooth up/down motion
        const yAmplitude = 0.025; // How far it moves up/down
        const yFrequency = 1.3; // How fast it moves up/down
        textPivotRef.current.rotation.y =
          Math.sin(elapsedTime * yFrequency) * yAmplitude;

        // Swaying animation - use sine wave for smooth rotation
        const zAmplitude = 0.025; // How far it rotates (in radians)
        const zFrequency = 0.8; // How fast it sways
        textPivotRef.current.rotation.z =
          Math.sin(elapsedTime * zFrequency) * zAmplitude;
      }

      bloomComposerRef.current?.render();
      finalComposerRef.current?.render();

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
      gridGeometry.dispose();
      gridMaterial.dispose();
    };
  }, [text]);

  return text ? (
    <main className="w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} />
    </main>
  ) : (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="font-playwrite text-bold text-4xl text-[#aa0000]">
          Outrun
        </h1>
        <div className="space-y-5">
                    <div className="relative group">
                        <code
                            className="block bg-black/25 p-5 rounded-lg text-lg cursor-pointer transition-all duration-200 hover:bg-white/25"
                            onClick={handleCopy}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isHovered ? '/outrun?text=' : '/outrun?text=Your Text Here'}
                        </code>

                        {/* Hover tooltip */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/25  text-sm py-2 px-3 rounded-md opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-90">
                            Click to copy
                        </div>

                        {/* Copied confirmation */}
                        {copied && (
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#0a0] text-white text-sm py-2 px-3 rounded-md opacity-90 transition-opacity duration-200">
                                Copied to clipboard!
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter your text here"
                            className="w-full px-4 py-3 bg-rhed-accent text-rhed-background rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] focus:shadow-[inset_0_3px_4px_rgba(0,0,0,0.8)]"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-3 bg-rhed-foreground text-rhed-background rounded-lg font-medium hover:bg-rhed-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            disabled={!inputText.trim()}
                        >
                            Generate Outrun
                        </button>
                    </form>

                    <p className="text-sm text-rhed-accent">
                        The text will be displayed in the <span className="font-playwrite">Playwrite font</span> behind an infinite outrun.
                    </p>
                </div>
      </div>
    </main>
  );
}

const OutrunPage = () => (
  <Suspense>
    <Outrun />
  </Suspense>
);

export default OutrunPage;
