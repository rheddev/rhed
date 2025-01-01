// generator.ts
import * as THREE from "three";
import { Font } from "three/examples/jsm/Addons.js";
import {
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/Addons.js";

interface GeneratorOptions {
  camera: THREE.PerspectiveCamera;
  position: THREE.Vector3;
  fonts: {
    regular: Font;
    italic?: Font;
    bold?: Font;
    boldItalic?: Font;
  };
  emoteSize?: number; // Size for emote sprites
  geometryParams?: Partial<TextGeometryParameters>;
}

const COLOR_MAP: { [key: string]: number } = {
  WHITE: 0xffffff,
  RED: 0xff0000,
  GREEN: 0x00ff00,
  BLUE: 0x0000ff,
  YELLOW: 0xffff00,
  MAGENTA: 0xff00ff,
  CYAN: 0x00ffff,
};

// Add at the top of the file
const materialCache = new Map<number, THREE.Material[]>();
const geometryCache = new Map<string, TextGeometry>();
const textureCache = new Map<string, THREE.Texture>();

export function text3dGenerator(
  ast: RootNode,
  options: GeneratorOptions
): THREE.Group {
  const concatenationGroup = new THREE.Group();
  const SPACING = options.geometryParams?.size
    ? options.geometryParams?.size * 0.4
    : 40;
  let totalWidth = 0;

  function getFontForStyle(style: StyleType): Font {
    switch (style) {
      case "ITALIC":
        return options.fonts.italic || options.fonts.regular;
      case "BOLD":
        return options.fonts.bold || options.fonts.regular;
      case "BOLD_ITALIC":
        return (
          options.fonts.boldItalic ||
          options.fonts.bold ||
          options.fonts.italic ||
          options.fonts.regular
        );
      case "REGULAR":
      default:
        return options.fonts.regular;
    }
  }

  function countSpaces(text: string): { leading: number; trailing: number } {
    const leading = text.match(/^[\s]*/)?.[0].length || 0;
    const trailing = text.match(/[\s]*$/)?.[0].length || 0;
    return { leading, trailing };
  }

  function transformColor(hexColor: number): number {
    const r = (hexColor >> 16) & 0xff;
    const g = (hexColor >> 8) & 0xff;
    const b = hexColor & 0xff;
    const average = Math.ceil((r + g + b) / 3);
    const factor = average >= 0x55 ? 0.7 : 3;
    const newR = Math.min(Math.floor(r * factor), 0xff);
    const newG = Math.min(Math.floor(g * factor), 0xff);
    const newB = Math.min(Math.floor(b * factor), 0xff);
    return (newR << 16) | (newG << 8) | newB;
  }

  function generateTextNode(node: TextNode): THREE.Group {
    const { leading, trailing } = countSpaces(node.value);

    if (node.value.trim() === "") {
      const textGroup = new THREE.Group();
      const spaceWidth = node.value.length * SPACING;
      textGroup.position.x = totalWidth;
      totalWidth += spaceWidth;
      return textGroup;
    }

    const cacheKey = `${node.value.trim()}-${node.style}-${JSON.stringify(
      options.geometryParams
    )}`;
    let textGeometry = geometryCache.get(cacheKey);

    if (!textGeometry) {
      const geometryParams: TextGeometryParameters = {
        font: getFontForStyle(node.style),
        size: options.geometryParams?.size || 100,
        depth: options.geometryParams?.depth || 50,
        curveSegments: options.geometryParams?.curveSegments || 12,
        bevelEnabled: options.geometryParams?.bevelEnabled || false,
        bevelThickness: options.geometryParams?.bevelThickness || 10,
        bevelSize: options.geometryParams?.bevelSize || 8,
        bevelOffset: options.geometryParams?.bevelOffset || 0,
        bevelSegments: options.geometryParams?.bevelSegments || 3,
      };

      textGeometry = new TextGeometry(node.value.trim(), geometryParams);
      geometryCache.set(cacheKey, textGeometry);
    }

    const color = COLOR_MAP[node.color] || COLOR_MAP.WHITE;
    let materials = materialCache.get(color);

    if (!materials) {
      materials = [
        new THREE.MeshBasicMaterial({ color: color }),
        new THREE.MeshBasicMaterial({ color: transformColor(color) }),
      ];
      materialCache.set(color, materials);
    }

    const textMesh = new THREE.Mesh(textGeometry, materials);
    const textGroup = new THREE.Group();
    textGroup.add(textMesh);

    const finalLeading = Math.max(leading * SPACING, SPACING * 0.13);
    const finalTrailing = Math.max(trailing * SPACING, SPACING * 0.13);

    textGroup.position.x = totalWidth + finalLeading;

    if (!textGeometry.boundingBox) {
      textGeometry.computeBoundingBox();
    }
    const nodeWidth =
      textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;

    totalWidth += finalLeading + nodeWidth + finalTrailing;

    return textGroup;
  }

  const EMOTE_SIZE = options.emoteSize || options.geometryParams?.size || 100;
  const textureLoader = new THREE.TextureLoader();

  function generateEmoteNode(node: EmoteNode): THREE.Group {
    const emoteGroup = new THREE.Group();
    const DEPTH = options.geometryParams?.depth || 50;
    const DEPTH_SEGMENTS = 25; // Reduced from 50 to 25 for better performance

    const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${node.emoteId}/static/light/3.0`;

    // Position the group immediately
    emoteGroup.position.x = SPACING * 0.13 + totalWidth;
    totalWidth += SPACING * 0.13 + EMOTE_SIZE + SPACING * 0.13;

    const cachedTexture = textureCache.get(emoteUrl);
    if (cachedTexture) {
      createEmoteSprites(cachedTexture);
    } else {
      // Create placeholder
      const placeholderMaterial = new THREE.SpriteMaterial({ color: 0xffffff });
      const placeholderSprite = new THREE.Sprite(placeholderMaterial);
      placeholderSprite.center = new THREE.Vector2(0, 0);
      placeholderSprite.scale.set(EMOTE_SIZE, EMOTE_SIZE, 1);
      emoteGroup.add(placeholderSprite);

      textureLoader.load(
        emoteUrl,
        (texture) => {
          textureCache.set(emoteUrl, texture);
          emoteGroup.remove(placeholderSprite);
          createEmoteSprites(texture);
        },
        undefined,
        (error) => {
          console.error(`Failed to load emote ${node.emoteId}:`, error);
        }
      );
    }

    function createEmoteSprites(texture: THREE.Texture) {
      const aspectRatio = texture.image.width / texture.image.height;
      const material = new THREE.SpriteMaterial({ map: texture });

      for (let i = 0; i < DEPTH_SEGMENTS; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.center = new THREE.Vector2(0, 0);
        sprite.scale.set(EMOTE_SIZE, EMOTE_SIZE * (1 / aspectRatio), 1);
        sprite.position.z = i * (DEPTH / DEPTH_SEGMENTS);
        emoteGroup.add(sprite);
      }
    }

    return emoteGroup;
  }

  function generateNodes(nodes: BaseNode[]): void {
    for (const node of nodes) {
      switch (node.type) {
        case "text":
          concatenationGroup.add(generateTextNode(node as TextNode));
          break;
        case "emote":
          concatenationGroup.add(generateEmoteNode(node as EmoteNode));
          break;
      }
    }
  }

  generateNodes(ast.children);

  const box = new THREE.Box3().setFromObject(concatenationGroup);
  const center = box.getCenter(new THREE.Vector3());
  concatenationGroup.position.copy(center.multiplyScalar(-1));

  const pivotGroup = new THREE.Group();
  pivotGroup.add(concatenationGroup);

  pivotGroup.position.copy(options.position);

  return pivotGroup;
}

export function cleanupGenerator() {
  // Dispose of cached resources
  geometryCache.forEach((geometry) => geometry.dispose());
  materialCache.forEach((materials) =>
    materials.forEach((material) => material.dispose())
  );
  textureCache.forEach((texture) => texture.dispose());

  // Clear caches
  geometryCache.clear();
  materialCache.clear();
  textureCache.clear();
}
