// WebGL hover distortion for Work index grid.
// Three.js is lazy-loaded — only imported when this module runs.

import { gsap } from 'gsap';

const vert = /* glsl */`
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float w1 = sin(pos.x * 6.0 + uTime * 1.2) * cos(pos.y * 4.0 + uTime * 0.8) * 0.06;
    float w2 = sin(pos.x * 3.0 - uTime * 0.7) * sin(pos.y * 6.0 + uTime * 1.0) * 0.03;
    pos.z += (w1 + w2) * uHover;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const frag = /* glsl */`
  uniform vec3  uColor;
  uniform float uAlpha;
  uniform float uTime;
  varying vec2  vUv;

  float rand(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float grain    = rand(vUv + fract(uTime * 1.7)) * 0.07 - 0.035;
    vec2  uv       = vUv - 0.5;
    float vignette = 1.0 - dot(uv, uv) * 0.9;
    vec3  col      = clamp(uColor + grain, 0.0, 1.0) * vignette;
    gl_FragColor   = vec4(col, uAlpha);
  }
`;

let renderer = null;
let scene, camera, mesh, material;
let hoveredEl = null;
let tickFn = null;
const t0 = Date.now();

function onResize() {
  if (!renderer) return;
  const nW = window.innerWidth;
  const nH = window.innerHeight;
  renderer.setSize(nW, nH, false);
  camera.left   = -nW / 2; camera.right  =  nW / 2;
  camera.top    =  nH / 2; camera.bottom = -nH / 2;
  camera.updateProjectionMatrix();
}

export async function initWebGLDistortion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (renderer) return; // guard against double-init

  const cards = document.querySelectorAll('[data-webgl-hover]');
  if (!cards.length) return;

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const THREE = await import('three');

  const W = window.innerWidth;
  const H = window.innerHeight;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -10, 10);
  scene  = new THREE.Scene();

  material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    uniforms: {
      uTime:  { value: 0 },
      uHover: { value: 0 },
      uColor: { value: new THREE.Color(0x0d0d0d) },
      uAlpha: { value: 0 },
    },
  });

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 24, 24), material);
  scene.add(mesh);

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      hoveredEl = card;
      material.uniforms.uColor.value.set(card.dataset.color || '#0d0d0d');
      gsap.to(material.uniforms.uHover, { value: 1, duration: 0.6, ease: 'power2.out' });
      gsap.to(material.uniforms.uAlpha, { value: 1, duration: 0.4, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(material.uniforms.uHover, { value: 0, duration: 0.6, ease: 'power2.out' });
      gsap.to(material.uniforms.uAlpha, {
        value: 0, duration: 0.4, ease: 'power2.out',
        onComplete() { hoveredEl = null; },
      });
    });
  });

  tickFn = () => {
    material.uniforms.uTime.value = (Date.now() - t0) / 1000;

    if (hoveredEl) {
      const r  = hoveredEl.getBoundingClientRect();
      mesh.position.x = r.left + r.width  / 2 - W / 2;
      mesh.position.y = -(r.top  + r.height / 2 - H / 2);
      mesh.scale.set(r.width, r.height, 1);
    }

    renderer.render(scene, camera);
  };

  gsap.ticker.add(tickFn);
  window.addEventListener('resize', onResize);
}

export function destroyWebGLDistortion() {
  if (!renderer) return;

  gsap.ticker.remove(tickFn);
  tickFn = null;

  renderer.dispose();
  material?.dispose();
  mesh?.geometry.dispose();
  renderer = null;
  hoveredEl = null;

  window.removeEventListener('resize', onResize);
}
