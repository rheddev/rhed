// text3d.ts
import { text3dLexer } from './lexer';
import { text3dParser } from './parser';
import { cleanupGenerator, text3dGenerator } from './generator';
import * as THREE from 'three';
import { Font } from 'three/examples/jsm/Addons.js';
import { TextGeometryParameters } from 'three/examples/jsm/Addons.js';

// text3d.ts
export default function text3D(
    camera: THREE.PerspectiveCamera,
    text: string,
    position: THREE.Vector3,
    fonts: {
      regular: Font;
      italic?: Font;
      bold?: Font;
      boldItalic?: Font;
    },
    geometryParams?: Partial<TextGeometryParameters>
  ): THREE.Group {
    cleanupGenerator();
    const tokens = text3dLexer(text);
    const ast = text3dParser(tokens);
    return text3dGenerator(ast, {
      camera,
      position,
      fonts,
      geometryParams
    });
  }