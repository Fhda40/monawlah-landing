import React, { useEffect, useRef, useState, useMemo, useCallback, useId } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════════════
   MONAWLAH · مناولة
   من يدك إلى وجهتك · From your hand to your destination
   ════════════════════════════════════════════════════════════════════ */

const BRAND = {
  orange: '#F25B24',
  orangeLight: '#F47A4A',
  orangeDeep: '#D44A18',
  charcoal: '#363436',
  charcoalDeep: '#1F1E20',
  cream: '#FAF7F2',
  creamDark: '#EFE9DF',
  white: '#FFFFFF',
};

const CITIES = [
  { name: 'الرياض', en: 'Riyadh', lat: 24.7136, lng: 46.6753, weight: 1.0 },
  { name: 'جدة', en: 'Jeddah', lat: 21.4858, lng: 39.1925, weight: 0.9 },
  { name: 'الدمام', en: 'Dammam', lat: 26.4207, lng: 50.0888, weight: 0.7 },
  { name: 'الخبر', en: 'Khobar', lat: 26.2172, lng: 50.1971, weight: 0.6 },
  { name: 'المدينة', en: 'Madinah', lat: 24.5247, lng: 39.5692, weight: 0.7 },
  { name: 'مكة', en: 'Makkah', lat: 21.3891, lng: 39.8579, weight: 0.85 },
  { name: 'أبها', en: 'Abha', lat: 18.2164, lng: 42.5053, weight: 0.5 },
  { name: 'تبوك', en: 'Tabuk', lat: 28.3835, lng: 36.5662, weight: 0.55 },
  { name: 'حائل', en: 'Hail', lat: 27.5219, lng: 41.6906, weight: 0.45 },
  { name: 'الطائف', en: 'Taif', lat: 21.2854, lng: 40.4183, weight: 0.55 },
  { name: 'بريدة', en: 'Buraidah', lat: 26.3260, lng: 43.9750, weight: 0.5 },
];

const KSA_OUTLINE: [number, number][] = [
  [34.5, 28.0], [36.5, 29.3], [37.5, 29.8], [38.5, 29.0], [39.0, 28.0],
  [39.2, 27.0], [38.8, 25.5], [39.5, 24.5], [38.5, 23.5], [39.0, 22.5],
  [40.0, 21.0], [41.0, 19.5], [42.5, 17.5], [43.5, 17.0], [44.5, 17.5],
  [46.0, 17.0], [47.5, 18.5], [49.0, 19.5], [50.5, 20.0], [52.0, 19.0],
  [54.5, 19.5], [55.5, 20.5], [55.0, 22.0], [52.0, 23.0], [51.5, 24.5],
  [51.0, 25.5], [50.0, 26.5], [49.5, 27.5], [48.0, 28.5], [46.5, 29.0],
  [45.0, 29.5], [42.5, 30.0], [40.5, 30.5], [38.5, 30.0], [36.5, 29.5],
  [34.5, 28.0],
];

/* ════════════════════════════════════════════════════════════════════
   LOGO MARK
   ════════════════════════════════════════════════════════════════════ */
function MonawlahMark({ size = 64, color = BRAND.orange, bg = 'transparent' }: { size?: number; color?: string; bg?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      {bg !== 'transparent' && <rect width="100" height="100" fill={bg} />}
      <path
        d="M 18 14
           L 82 14
           Q 88 14 88 20
           L 88 70
           Q 88 76 82 76
           L 50 76
           L 38 90
           L 40 76
           L 18 76
           Q 12 76 12 70
           L 12 20
           Q 12 14 18 14 Z"
        fill={color}
      />
      <rect x="38" y="32" width="26" height="26" fill={bg === 'transparent' ? BRAND.cream : bg} />
    </svg>
  );
}

function MonawlahLockup({ color = BRAND.orange, textColor = BRAND.charcoal }: { color?: string; textColor?: string }) {
  return (
    <div className="flex items-center gap-3">
      <MonawlahMark size={40} color={color} />
      <div className="flex flex-col leading-none">
        <span
          dir="rtl"
          style={{
            color: textColor,
            fontFamily: '"Tajawal", "Cairo", system-ui, sans-serif',
            fontWeight: 800,
            fontSize: '22px',
            letterSpacing: '0.02em',
          }}
        >
          مناولة
        </span>
        <span
          style={{
            color: textColor,
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.18em',
            marginTop: '2px',
          }}
        >
          MONAWLAH
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BRAND PATTERN
   ════════════════════════════════════════════════════════════════════ */
function LogoPattern({ className = '', color = BRAND.orange, opacity = 0.08 }: { className?: string; color?: string; opacity?: number }) {
  const uid = useId();
  const id = `mono-pattern-${color.replace('#', '')}-${uid.replace(/:/g, '')}`;
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <g opacity={opacity}>
            <path
              d="M 18 12 L 42 12 Q 46 12 46 16 L 46 38 Q 46 42 42 42 L 28 42 L 22 50 L 23 42 L 18 42 Q 14 42 14 38 L 14 16 Q 14 12 18 12 Z"
              fill={color}
              transform="translate(0,0) scale(0.7)"
            />
            <rect x="22" y="20.4" width="12" height="12" fill={BRAND.cream} transform="scale(0.7)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   3D LIVING MAP
   ════════════════════════════════════════════════════════════════════ */
function LivingMap({ scrollProgress }: { scrollProgress: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const targetRotation = useRef(0);

  const projectToScene = useCallback((lng: number, lat: number): [number, number, number] => {
    const cx = 45, cy = 24;
    return [(lng - cx) * 1.2, 0, -(lat - cy) * 1.2];
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x363436, 0.045);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 14, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0xf25b24, 0.7);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    // Grid
    const gridGeom = new THREE.BufferGeometry();
    const gridPoints: number[] = [];
    const gridSize = 30;
    const gridDiv = 24;
    for (let i = -gridDiv / 2; i <= gridDiv / 2; i++) {
      gridPoints.push(-gridSize / 2, 0, i * (gridSize / gridDiv));
      gridPoints.push(gridSize / 2, 0, i * (gridSize / gridDiv));
      gridPoints.push(i * (gridSize / gridDiv), 0, -gridSize / 2);
      gridPoints.push(i * (gridSize / gridDiv), 0, gridSize / 2);
    }
    gridGeom.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
    scene.add(new THREE.LineSegments(gridGeom, new THREE.LineBasicMaterial({ color: 0x4a4548, transparent: true, opacity: 0.4 })));

    // KSA outline
    const outlinePts = KSA_OUTLINE.map(([lng, lat]) => {
      const [x, , z] = projectToScene(lng, lat);
      return new THREE.Vector3(x, 0.02, z);
    });
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(outlinePts),
      new THREE.LineBasicMaterial({ color: 0xf25b24, transparent: true, opacity: 0.9 }),
    ));

    // Fill
    const fillShape = new THREE.Shape();
    KSA_OUTLINE.forEach(([lng, lat], i) => {
      const [x, , z] = projectToScene(lng, lat);
      if (i === 0) fillShape.moveTo(x, z);
      else fillShape.lineTo(x, z);
    });
    const fillMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(fillShape),
      new THREE.MeshBasicMaterial({ color: 0xf25b24, transparent: true, opacity: 0.07, side: THREE.DoubleSide }),
    );
    fillMesh.rotation.x = Math.PI / 2;
    fillMesh.position.y = 0.01;
    scene.add(fillMesh);

    type AnimObj = { mesh: THREE.Object3D; type: 'node' | 'ring' | 'particle'; data: { phase?: number; points?: THREE.Vector3[]; offset?: number; speed?: number } };
    const animatedObjects: AnimObj[] = [];

    CITIES.forEach((city) => {
      const [x, , z] = projectToScene(city.lng, city.lat);
      const radius = 0.08 + city.weight * 0.12;

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xf25b24 }),
      );
      node.position.set(x, 0.15, z);
      scene.add(node);
      animatedObjects.push({ mesh: node, type: 'node', data: { phase: Math.random() * Math.PI * 2 } });

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius * 1.4, radius * 1.65, 32),
        new THREE.MeshBasicMaterial({ color: 0xf25b24, transparent: true, opacity: 0.6, side: THREE.DoubleSide }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(x, 0.05, z);
      scene.add(ring);
      animatedObjects.push({ mesh: ring, type: 'ring', data: { phase: Math.random() * Math.PI * 2 } });

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 1.6 + city.weight * 1.2, 8),
        new THREE.MeshBasicMaterial({ color: 0xf25b24, transparent: true, opacity: 0.35 }),
      );
      beam.position.set(x, 0.8 + city.weight * 0.6, z);
      scene.add(beam);
    });

    const trailPairs = [[0, 1], [0, 2], [0, 4], [0, 5], [1, 5], [2, 3], [0, 7], [1, 6], [0, 10], [4, 5]];
    trailPairs.forEach(([a, b]) => {
      const [ax, , az] = projectToScene(CITIES[a].lng, CITIES[a].lat);
      const [bx, , bz] = projectToScene(CITIES[b].lng, CITIES[b].lat);
      const dist = Math.hypot(bx - ax, bz - az);
      const arcH = Math.min(2.5, dist * 0.35);
      const segments = 50;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        points.push(new THREE.Vector3(
          ax + (bx - ax) * t,
          Math.sin(t * Math.PI) * arcH + 0.15,
          az + (bz - az) * t,
        ));
      }
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0xf25b24, transparent: true, opacity: 0.22 }),
      ));

      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      scene.add(particle);
      animatedObjects.push({
        mesh: particle,
        type: 'particle',
        data: { points, offset: Math.random(), speed: 0.0018 + Math.random() * 0.002 },
      });
    });

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      animatedObjects.forEach((obj) => {
        if (obj.type === 'ring') {
          const s = 1 + Math.sin(t * 2 + (obj.data.phase ?? 0)) * 0.5 + 0.5;
          obj.mesh.scale.set(s, s, s);
          ((obj.mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - (s - 1) * 0.5);
        } else if (obj.type === 'node') {
          obj.mesh.position.y = 0.15 + Math.sin(t * 2 + (obj.data.phase ?? 0)) * 0.03;
        } else if (obj.type === 'particle' && obj.data.points) {
          obj.data.offset = ((obj.data.offset ?? 0) + (obj.data.speed ?? 0.002)) % 1;
          const pts = obj.data.points;
          const idx = (obj.data.offset ?? 0) * (pts.length - 1);
          const i0 = Math.floor(idx);
          const i1 = Math.min(i0 + 1, pts.length - 1);
          const f = idx - i0;
          obj.mesh.position.set(
            pts[i0].x + (pts[i1].x - pts[i0].x) * f,
            pts[i0].y + (pts[i1].y - pts[i0].y) * f,
            pts[i0].z + (pts[i1].z - pts[i0].z) * f,
          );
        }
      });

      const r = 18;
      const angle = targetRotation.current;
      camera.position.x = Math.sin(angle) * r;
      camera.position.z = Math.cos(angle) * r;
      camera.position.y = 10 + Math.sin(t * 0.3) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      rendererRef.current.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [projectToScene]);

  useEffect(() => {
    targetRotation.current = scrollProgress * Math.PI * 0.6;
  }, [scrollProgress]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

/* ════════════════════════════════════════════════════════════════════
   LOADING SCREEN
   ════════════════════════════════════════════════════════════════════ */
function LoadingScreen({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: BRAND.charcoal }}
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 inline-block"
            >
              <MonawlahMark size={88} color={BRAND.orange} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              dir="rtl"
              style={{
                fontFamily: '"Tajawal", system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                color: '#ffffff',
                opacity: 0.85,
                letterSpacing: '0.1em',
              }}
              className="mb-2"
            >
              من يدك إلى وجهتك
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: BRAND.orange,
                letterSpacing: '0.35em',
              }}
            >
              FROM YOUR HAND TO YOUR DESTINATION
            </motion.div>
            <motion.div className="mt-10 w-56 h-[2px] bg-white/10 mx-auto overflow-hidden">
              <motion.div
                style={{ backgroundColor: BRAND.orange, height: '100%' }}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SHARED UI
   ════════════════════════════════════════════════════════════════════ */
function Arrow({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function CTAButton({
  children,
  primary = false,
  onLight = false,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onLight?: boolean;
}) {
  const styles = primary
    ? { background: BRAND.orange, color: BRAND.white, border: 'none' }
    : onLight
      ? { background: 'transparent', color: BRAND.charcoal, border: `1.5px solid ${BRAND.charcoal}` }
      : { background: 'transparent', color: BRAND.white, border: '1.5px solid rgba(255,255,255,0.4)' };

  return (
    <button
      className="group relative inline-flex items-center gap-3 px-8 py-4 text-xs uppercase transition-all duration-500 overflow-hidden"
      style={{
        ...styles,
        fontFamily: '"Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: '0.22em',
      }}
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 w-4 h-4 overflow-hidden inline-block">
        <Arrow className="w-4 h-4 absolute transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[150%]" flip />
        <Arrow className="w-4 h-4 absolute transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-[150%] group-hover:translate-x-0" flip />
      </span>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LIVE TICKER
   ════════════════════════════════════════════════════════════════════ */
function DeliveryTicker() {
  const items = [
    { route: 'الرياض ← جدة', driver: 'محمد ع.', price: '٤٢ ر.س', time: 'منذ ١٢ ث' },
    { route: 'الدمام ← الخبر', driver: 'أحمد ك.', price: '١٨ ر.س', time: 'منذ ٤٣ ث' },
    { route: 'مكة ← المدينة', driver: 'فهد ر.', price: '٣١ ر.س', time: 'منذ ١ د' },
    { route: 'جدة ← الطائف', driver: 'سعد ب.', price: '٢٥ ر.س', time: 'منذ ٢ د' },
    { route: 'الرياض ← بريدة', driver: 'يوسف ح.', price: '٣٨ ر.س', time: 'منذ ٣ د' },
    { route: 'تبوك ← حائل', driver: 'ناصر ل.', price: '٥٢ ر.س', time: 'منذ ٤ د' },
  ];
  const doubled = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden border-y py-4"
      style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: BRAND.charcoalDeep }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((it, i) => (
          <div key={i} className="flex items-center gap-4 text-sm shrink-0" style={{ fontFamily: '"Tajawal", sans-serif' }}>
            <span className="w-1.5 h-1.5 animate-pulse" style={{ backgroundColor: BRAND.orange }} />
            <span style={{ color: BRAND.white }} dir="rtl">{it.route}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span style={{ color: BRAND.orange }} dir="rtl">{it.driver}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }} dir="rtl">{it.price}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }} dir="rtl">{it.time}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   INTERACTIVE PARCEL DRAG
   ════════════════════════════════════════════════════════════════════ */
const SENDER = { x: 0.15, y: 0.5 };
const RECEIVER = { x: 0.85, y: 0.5 };
const toArabicNumerals = (n: number) =>
  n.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);

function MomentOfTrust() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parcelPos, setParcelPos] = useState({ x: SENDER.x, y: SENDER.y });
  const [isDragging, setIsDragging] = useState(false);
  const [delivered, setDelivered] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDelivered(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.2, Math.min(0.8, (e.clientY - rect.top) / rect.height));
    setParcelPos({ x, y });
  };
  const handlePointerUp = () => {
    setIsDragging(false);
    const distToReceiver = Math.hypot(parcelPos.x - RECEIVER.x, parcelPos.y - RECEIVER.y);
    if (distToReceiver < 0.12) {
      setParcelPos(RECEIVER);
      setDelivered(true);
      setTimeout(() => {
        setParcelPos(SENDER);
        setDelivered(false);
      }, 2400);
    } else {
      setParcelPos(SENDER);
    }
  };

  const distance = useMemo(() => {
    const dx = parcelPos.x - SENDER.x;
    const dy = parcelPos.y - SENDER.y;
    return Math.hypot(dx, dy) * 1200;
  }, [parcelPos]);
  const price = useMemo(() => Math.round(15 + distance * 0.08), [distance]);
  const eta = useMemo(() => Math.round(25 + distance * 0.12), [distance]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] overflow-hidden select-none"
        style={{ backgroundColor: BRAND.charcoal, border: `1px solid rgba(255,255,255,0.1)` }}
      >
        <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.orange} opacity={0.05} />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGrad" x1="0%" x2="100%">
              <stop offset="0%" stopColor={BRAND.orange} stopOpacity="0.9" />
              <stop offset="100%" stopColor={BRAND.orangeLight} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line
            x1={`${SENDER.x * 100}%`} y1={`${SENDER.y * 100}%`}
            x2={`${parcelPos.x * 100}%`} y2={`${parcelPos.y * 100}%`}
            stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 6"
          />
          <line
            x1={`${parcelPos.x * 100}%`} y1={`${parcelPos.y * 100}%`}
            x2={`${RECEIVER.x * 100}%`} y2={`${RECEIVER.y * 100}%`}
            stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 4"
          />
        </svg>

        {/* Sender */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${SENDER.x * 100}%`, top: `${SENDER.y * 100}%` }}>
          <div className="relative">
            <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: 'rgba(242,91,36,0.15)', border: `2px solid ${BRAND.orange}` }}>
              <div className="w-3 h-3" style={{ backgroundColor: BRAND.orange }} />
            </div>
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>SENDER</div>
              <div style={{ color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontSize: '13px', marginTop: '2px' }} dir="rtl">المُرسِل</div>
            </div>
          </div>
        </div>

        {/* Receiver */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${RECEIVER.x * 100}%`, top: `${RECEIVER.y * 100}%` }}>
          <motion.div animate={delivered ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.6 }} className="relative">
            <div
              className="w-12 h-12 flex items-center justify-center transition-colors"
              style={{
                backgroundColor: delivered ? BRAND.orange : 'rgba(242,91,36,0.15)',
                border: `2px solid ${BRAND.orange}`,
              }}
            >
              <div className="w-3 h-3" style={{ backgroundColor: delivered ? BRAND.white : BRAND.orange }} />
            </div>
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>RECEIVER</div>
              <div style={{ color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontSize: '13px', marginTop: '2px' }} dir="rtl">المُستقبِل</div>
            </div>
          </motion.div>
        </div>

        {/* Draggable parcel */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
          style={{ left: `${parcelPos.x * 100}%`, top: `${parcelPos.y * 100}%` }}
          animate={{ scale: isDragging ? 1.15 : 1, rotate: isDragging ? 8 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-xl opacity-60" style={{ backgroundColor: BRAND.orange }} />
            <div className="relative shadow-2xl">
              <MonawlahMark size={64} color={BRAND.orange} bg={BRAND.charcoal} />
            </div>
            {!isDragging && !delivered && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: BRAND.white }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {delivered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3"
              style={{ backgroundColor: BRAND.orange, color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.15em' }}
              dir="rtl"
            >
              ✓ تم التسليم
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
          <div style={{ color: 'rgba(255,255,255,0.35)' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>DRAG THE PARCEL</div>
            <div style={{ fontSize: '13px', marginTop: '4px', fontFamily: '"Tajawal", sans-serif' }} dir="rtl">اسحب الطرد إلى وجهته</div>
          </div>
        </div>
      </div>

      {/* Readout */}
      <div className="grid grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '1px' }}>
        {[
          { label: 'DISTANCE', ar: 'المسافة', value: distance.toFixed(0), unit: 'KM', unitAr: 'كم', color: BRAND.orange },
          { label: 'PRICE', ar: 'السعر', value: price.toString(), unit: 'SAR', unitAr: 'ر.س', color: BRAND.white },
          { label: 'ETA', ar: 'الوصول', value: eta.toString(), unit: 'MIN', unitAr: 'دقيقة', color: BRAND.orangeLight },
        ].map((stat, i) => (
          <div key={i} className="p-6" style={{ backgroundColor: BRAND.charcoal }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '10px' }}>{stat.label}</div>
            <div className="flex items-baseline gap-2">
              <span style={{ color: stat.color, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: '36px', lineHeight: 1 }}>
                {stat.value}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>{stat.unit}</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px', fontFamily: '"Tajawal", sans-serif' }} dir="rtl">
              {toArabicNumerals(parseInt(stat.value))} {stat.unitAr}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CONTENT SECTIONS
   ════════════════════════════════════════════════════════════════════ */
function PickupSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parcelScale = useTransform(scrollYProgress, [0.1, 0.5], [0.4, 1]);
  const parcelRot = useTransform(scrollYProgress, [0, 1], [-15, 25]);
  const textX = useTransform(scrollYProgress, [0.1, 0.5], ['10%', '0%']);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: BRAND.cream }}>
      <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.orange} opacity={0.04} />

      <div className="relative w-full max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center py-32">
        <motion.div style={{ scale: parcelScale, rotate: parcelRot }} className="relative aspect-square max-w-md mx-auto">
          <div className="absolute inset-0 blur-[100px] opacity-30" style={{ backgroundColor: BRAND.orange }} />
          <div className="relative">
            <MonawlahMark size={400} color={BRAND.orange} />
          </div>
        </motion.div>

        <motion.div style={{ x: textX }} className="text-right" dir="rtl">
          <div style={{ color: BRAND.orange, fontSize: '12px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '24px' }}>
            ٠١ · CHAPTER ONE
          </div>
          <h2
            style={{
              color: BRAND.charcoal,
              fontFamily: '"Tajawal", system-ui, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              lineHeight: 0.9,
              marginBottom: '24px',
            }}
          >
            الاستلام
          </h2>
          <div style={{ color: 'rgba(54,52,54,0.4)', fontSize: '20px', letterSpacing: '0.18em', fontFamily: '"Inter", sans-serif', fontWeight: 600, marginBottom: '32px' }}>
            THE PICKUP
          </div>
          <p style={{ color: 'rgba(54,52,54,0.75)', fontSize: '18px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '480px', marginLeft: 'auto', fontFamily: '"Tajawal", sans-serif' }}>
            أنشئ طلبك في ثوانٍ. مسافر موثوق بنفاذ يستلم طردك من باب بيتك — لا طوابير، لا انتظار.
          </p>
          <p style={{ color: 'rgba(54,52,54,0.45)', fontSize: '15px', lineHeight: 1.7, maxWidth: '480px', marginLeft: 'auto', fontFamily: '"Inter", sans-serif' }} dir="ltr">
            Create your shipment in seconds. A Nafath-verified traveler picks it up from your door — no queues, no waiting.
          </p>

          <div className="grid grid-cols-3 gap-px mt-12" style={{ backgroundColor: 'rgba(54,52,54,0.1)' }}>
            {[
              { ar: '٣٠ ث', en: 'TO BOOK' },
              { ar: '٤.٩', en: 'AVG RATING' },
              { ar: '٢٤/٧', en: 'AVAILABLE' },
            ].map((s, i) => (
              <div key={i} className="p-6" style={{ backgroundColor: BRAND.cream }}>
                <div style={{ color: BRAND.orange, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: '28px', marginBottom: '4px' }}>{s.ar}</div>
                <div style={{ color: 'rgba(54,52,54,0.4)', fontSize: '10px', letterSpacing: '0.25em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>{s.en}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function OnTheRoadSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineX = useTransform(scrollYProgress, [0.1, 0.6], ['-100%', '0%']);
  const truckX = useTransform(scrollYProgress, [0.2, 0.7], ['-10%', '110%']);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: BRAND.charcoal }}>
      <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.orange} opacity={0.05} />

      <div className="relative w-full max-w-[1400px] mx-auto px-8 py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-right" dir="rtl">
            <div style={{ color: BRAND.orange, fontSize: '12px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '24px' }}>
              ٠٢ · CHAPTER TWO
            </div>
            <h2 style={{ color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: 'clamp(3.5rem, 9vw, 8rem)', lineHeight: 0.9, marginBottom: '24px' }}>
              على الطريق
            </h2>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px', letterSpacing: '0.18em', fontFamily: '"Inter", sans-serif', fontWeight: 600, marginBottom: '32px' }}>
              ON THE ROAD
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '480px', marginLeft: 'auto', fontFamily: '"Tajawal", sans-serif' }}>
              تتبع طردك على الخريطة لحظة بلحظة. كل مسافر موثق بنفاذ ورخصة قيادة سارية.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', lineHeight: 1.7, maxWidth: '480px', marginLeft: 'auto', fontFamily: '"Inter", sans-serif' }} dir="ltr">
              Live GPS tracking, stage-by-stage notifications. Every courier verified by Nafath.
            </p>
          </div>

          <div className="lg:col-span-7 relative h-[500px] overflow-hidden" style={{ backgroundColor: BRAND.charcoalDeep }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BRAND.charcoal} 0%, ${BRAND.charcoalDeep} 100%)` }} />

            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px] h-[1px]"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 23) % 50}%`,
                  backgroundColor: BRAND.white,
                  opacity: 0.3 + ((i * 7) % 70) / 100,
                }}
              />
            ))}

            <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{ background: `linear-gradient(to top, ${BRAND.orange}20, transparent)` }} />
            <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="absolute bottom-0 w-full h-32">
              <path d="M0 200 L0 120 Q100 80 200 110 Q300 140 400 100 Q500 60 600 95 Q700 130 800 90 L800 200 Z" fill={BRAND.charcoal} />
              <path d="M0 200 L0 150 Q150 110 300 140 Q450 170 600 130 Q700 105 800 140 L800 200 Z" fill={BRAND.charcoalDeep} />
            </svg>

            <div className="absolute bottom-0 left-0 right-0 h-32" style={{ backgroundColor: '#000' }} />
            <motion.div style={{ x: lineX }} className="absolute bottom-14 left-0 w-full h-[2px] flex">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-full mr-12" style={{ backgroundColor: BRAND.orange, width: '60px' }} />
              ))}
            </motion.div>

            <motion.div style={{ x: truckX }} className="absolute bottom-16 left-0">
              <svg viewBox="0 0 100 50" className="w-32 h-16">
                <rect x="5" y="15" width="55" height="25" fill={BRAND.orange} />
                <rect x="60" y="20" width="25" height="20" fill={BRAND.charcoal} />
                <rect x="62" y="22" width="8" height="8" fill={BRAND.orange} />
                <circle cx="20" cy="42" r="5" fill="#000" />
                <circle cx="20" cy="42" r="2" fill={BRAND.orange} />
                <circle cx="75" cy="42" r="5" fill="#000" />
                <circle cx="75" cy="42" r="2" fill={BRAND.orange} />
                <text x="32" y="30" fill={BRAND.white} fontSize="5.5" fontFamily="Inter, sans-serif" fontWeight="700">MONAWLAH</text>
              </svg>
            </motion.div>

            <div className="absolute top-6 right-6 backdrop-blur-md p-5 text-right" dir="rtl" style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 justify-end mb-2">
                <span style={{ color: BRAND.orange, fontSize: '10px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>LIVE · مباشر</span>
                <span className="w-1.5 h-1.5 animate-pulse" style={{ backgroundColor: BRAND.orange }} />
              </div>
              <div style={{ color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>محمد ع.</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"Tajawal", sans-serif', fontSize: '13px' }}>هيونداي · أبيض</div>
              <div className="flex items-center gap-1 mt-3 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="w-3 h-3" fill={BRAND.orange}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveredSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parcelY = useTransform(scrollYProgress, [0.1, 0.5], ['-100%', '0%']);
  const stampScale = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const stampRot = useTransform(scrollYProgress, [0.4, 0.6], [-30, -12]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: BRAND.cream }}>
      <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.orange} opacity={0.04} />

      <div className="relative w-full max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center py-32">
        <div className="text-right order-2 lg:order-1" dir="rtl">
          <div style={{ color: BRAND.orange, fontSize: '12px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '24px' }}>
            ٠٣ · CHAPTER THREE
          </div>
          <h2 style={{ color: BRAND.charcoal, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: 'clamp(3.5rem, 9vw, 8rem)', lineHeight: 0.9, marginBottom: '24px' }}>
            تم التسليم
          </h2>
          <div style={{ color: 'rgba(54,52,54,0.4)', fontSize: '20px', letterSpacing: '0.18em', fontFamily: '"Inter", sans-serif', fontWeight: 600, marginBottom: '32px' }}>
            DELIVERED
          </div>
          <p style={{ color: 'rgba(54,52,54,0.75)', fontSize: '18px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '480px', marginLeft: 'auto', fontFamily: '"Tajawal", sans-serif' }}>
            رمز تأكيد سري بين المُرسِل والمُستقبِل. ضمان حتى ١٠,٠٠٠ ر.س على كل شحنة.
          </p>
          <p style={{ color: 'rgba(54,52,54,0.45)', fontSize: '15px', lineHeight: 1.7, maxWidth: '480px', marginLeft: 'auto', fontFamily: '"Inter", sans-serif' }} dir="ltr">
            A secret confirmation code between sender and receiver. Up to 10,000 SAR insurance on every shipment.
          </p>
        </div>

        <div className="relative aspect-square max-w-md mx-auto order-1 lg:order-2 overflow-hidden">
          <motion.div style={{ y: parcelY }} className="relative">
            <div className="absolute inset-0 blur-[120px] opacity-40" style={{ backgroundColor: BRAND.orange }} />
            <MonawlahMark size={400} color={BRAND.orange} />
            <motion.div
              style={{ scale: stampScale, rotate: stampRot, transformOrigin: 'center' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div
                className="px-6 py-3 backdrop-blur-sm"
                style={{ border: `4px solid ${BRAND.charcoal}`, backgroundColor: 'rgba(250,247,242,0.9)' }}
              >
                <div style={{ color: BRAND.charcoal, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '0.05em' }} dir="rtl">
                  تم التسليم
                </div>
                <div style={{ color: 'rgba(54,52,54,0.6)', fontSize: '11px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, textAlign: 'center', marginTop: '4px' }}>
                  DELIVERED
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { num: '٠١', ar: 'موثق بنفاذ', en: 'Nafath verified', desc: 'كل مسافر يمر بالتحقق من الهوية الوطنية ورخصة القيادة.' },
    { num: '٠٢', ar: 'تتبع مباشر', en: 'Live tracking', desc: 'موقع الطرد لحظة بلحظة على الخريطة، مع إشعارات لكل مرحلة.' },
    { num: '٠٣', ar: 'رمز سري', en: 'Secret code', desc: 'رمز تأكيد بين المرسل والمستقبل لا يفتح إلا بالاتفاق.' },
    { num: '٠٤', ar: 'ضمان ١٠ آلاف', en: '10,000 SAR cover', desc: 'تأمين على كل شحنة حتى ١٠,٠٠٠ ر.س من شركاء معتمدين.' },
    { num: '٠٥', ar: 'أرخص ٦٠٪', en: '60% cheaper', desc: 'استفد من رحلات موجودة أصلاً — لا حاجة لشاحنات جديدة.' },
    { num: '٠٦', ar: 'إرسال دائم', en: '24/7 dispatch', desc: 'آلاف المسافرين بين المدن في كل ساعة من اليوم.' },
  ];

  return (
    <section className="relative py-32 overflow-hidden" style={{ backgroundColor: BRAND.cream }}>
      <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.charcoal} opacity={0.025} />

      <div className="relative max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20">
          <div className="text-right" dir="rtl">
            <div style={{ color: BRAND.orange, fontSize: '12px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '16px' }}>
              المنظومة · THE SYSTEM
            </div>
            <h2 style={{ color: BRAND.charcoal, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9 }}>
              ثقة <span style={{ color: BRAND.orange }}>مُهندَسة</span>
            </h2>
            <div style={{ color: 'rgba(54,52,54,0.4)', fontSize: '20px', letterSpacing: '0.18em', fontFamily: '"Inter", sans-serif', fontWeight: 600, marginTop: '16px' }}>
              ENGINEERED TRUST
            </div>
          </div>
          <p style={{ color: 'rgba(54,52,54,0.65)', maxWidth: '380px', fontSize: '17px', lineHeight: 1.7, marginTop: '32px', fontFamily: '"Tajawal", sans-serif' }} dir="rtl">
            ست طبقات من الأمان والكفاءة تجعل مناولة الخيار الأول للشحن الفوري في المملكة.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(54,52,54,0.1)' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 group cursor-pointer text-right transition-colors duration-500"
              dir="rtl"
              style={{ backgroundColor: BRAND.cream }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND.charcoal; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BRAND.cream; }}
            >
              <div className="flex justify-between items-start mb-12">
                <div className="text-6xl transition-colors duration-500" style={{ color: 'rgba(54,52,54,0.15)', fontFamily: '"Tajawal", sans-serif', fontWeight: 800 }}>
                  {f.num}
                </div>
                <Arrow className="w-6 h-6 transition-all duration-500 -translate-x-2 group-hover:translate-x-0" />
              </div>
              <h3 className="text-3xl mb-2 transition-colors duration-500" style={{ color: BRAND.charcoal, fontFamily: '"Tajawal", sans-serif', fontWeight: 800 }}>
                {f.ar}
              </h3>
              <div style={{ color: 'rgba(54,52,54,0.4)', fontSize: '11px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginTop: '8px', marginBottom: '20px' }} dir="ltr">
                {f.en}
              </div>
              <p style={{ color: 'rgba(54,52,54,0.6)', fontSize: '14px', lineHeight: 1.7, fontFamily: '"Tajawal", sans-serif' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .group:hover .text-6xl { color: ${BRAND.orange} !important; opacity: 0.5; }
        .group:hover h3 { color: ${BRAND.white} !important; }
        .group:hover p { color: rgba(255,255,255,0.6) !important; }
        .group:hover [dir="ltr"] { color: ${BRAND.orange} !important; }
        .group:hover svg { color: ${BRAND.orange} !important; }
      `}</style>
    </section>
  );
}

function NumbersSection() {
  const numbers = [
    { value: '٢.٤M', ar: 'شحنة', en: 'SHIPMENTS', sub: 'منذ الإطلاق' },
    { value: '٤٧', ar: 'مدينة', en: 'CITIES', sub: 'في المملكة' },
    { value: '١٨K', ar: 'مسافر', en: 'COURIERS', sub: 'موثقون بنفاذ' },
    { value: '٢٧', ar: 'دقيقة', en: 'MIN AVG', sub: 'متوسط التسليم' },
  ];

  return (
    <section className="relative py-32 overflow-hidden" style={{ backgroundColor: BRAND.charcoal }}>
      <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.orange} opacity={0.05} />

      <div className="relative max-w-[1400px] mx-auto px-8">
        <div className="text-right mb-20" dir="rtl">
          <div style={{ color: BRAND.orange, fontSize: '12px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '16px' }}>
            بالأرقام · BY THE NUMBERS
          </div>
          <h2 style={{ color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9 }}>
            حركة <span style={{ color: BRAND.orange }}>المملكة</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          {numbers.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 text-right relative overflow-hidden"
              dir="rtl"
              style={{ backgroundColor: BRAND.charcoal }}
            >
              <div
                className="absolute -top-4 -left-4 pointer-events-none"
                style={{ fontSize: '200px', color: 'rgba(255,255,255,0.025)', lineHeight: 1, fontFamily: '"Tajawal", sans-serif', fontWeight: 800 }}
              >
                {i + 1}
              </div>
              <div className="relative">
                <div style={{ color: BRAND.orange, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, marginBottom: '12px' }}>
                  {n.value}
                </div>
                <div style={{ color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontSize: '18px', fontWeight: 600 }}>{n.ar}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginTop: '8px' }}>{n.en}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px', fontFamily: '"Tajawal", sans-serif' }}>{n.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [mapScroll, setMapScroll] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handle = () => {
      const max = window.innerHeight * 2;
      setMapScroll(Math.min(1, window.scrollY / max));
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      const s = d.getSeconds().toString().padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: BRAND.charcoal, color: BRAND.white }} dir="rtl">
      <LoadingScreen done={loaded} />

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(54,52,54,0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <MonawlahLockup color={BRAND.orange} textColor={BRAND.white} />
          <div className="hidden md:flex items-center gap-8" style={{ fontSize: '11px', letterSpacing: '0.25em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
            {['كيف تعمل', 'للمسافرين', 'الأسعار', 'AR / EN'].map((link) => (
              <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = BRAND.orange)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              >
                {link}
              </a>
            ))}
          </div>
          <CTAButton primary>حمّل التطبيق</CTAButton>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden pt-24" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="absolute inset-0">
          <LivingMap scrollProgress={mapScroll} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(54,52,54,0.5), transparent, ${BRAND.charcoal})` }} />
        </div>

        {/* Corner brackets */}
        {[
          { top: '8rem', left: '2rem', borderTop: true, borderLeft: true },
          { top: '8rem', right: '2rem', borderTop: true, borderRight: true },
          { bottom: '8rem', left: '2rem', borderBottom: true, borderLeft: true },
          { bottom: '8rem', right: '2rem', borderBottom: true, borderRight: true },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-12 h-12 pointer-events-none"
            style={{
              top: pos.top,
              left: pos.left,
              bottom: pos.bottom,
              right: pos.right,
              borderTop: pos.borderTop ? `1px solid ${BRAND.orange}66` : undefined,
              borderBottom: pos.borderBottom ? `1px solid ${BRAND.orange}66` : undefined,
              borderLeft: pos.borderLeft ? `1px solid ${BRAND.orange}66` : undefined,
              borderRight: pos.borderRight ? `1px solid ${BRAND.orange}66` : undefined,
            }}
          />
        ))}

        <div
          className="absolute top-32 left-1/2 -translate-x-1/2 flex items-center gap-3"
          style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}
        >
          <span className="w-1.5 h-1.5 animate-pulse" style={{ backgroundColor: BRAND.orange }} />
          <span>LIVE NETWORK</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span className="tabular-nums">{time} AST</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span dir="rtl" style={{ fontFamily: '"Tajawal", sans-serif' }}>شبكة مباشرة</span>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-8 pt-32 pb-12">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={loaded ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-right"
            dir="rtl"
          >
            <div
              className="inline-flex items-center gap-3 mb-8 px-4 py-2"
              style={{ border: `1px solid ${BRAND.orange}55` }}
            >
              <span className="w-1.5 h-1.5" style={{ backgroundColor: BRAND.orange }} />
              <span style={{ color: BRAND.orange, fontSize: '11px', letterSpacing: '0.35em', fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>
                VISION 2030 · رؤية
              </span>
            </div>

            <h1 style={{ color: BRAND.white, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, lineHeight: 0.85, marginBottom: '24px' }}>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={loaded ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(3.5rem, 11vw, 11rem)' }}
              >
                من يدك
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={loaded ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(3.5rem, 11vw, 11rem)', color: BRAND.orange }}
              >
                إلى وجهتك.
              </motion.div>
            </h1>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={loaded ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              dir="ltr"
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                letterSpacing: '0.05em',
                marginBottom: '20px',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
              }}
            >
              From your hand <span style={{ color: BRAND.orange, fontWeight: 600 }}>to your destination.</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.7 }}
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '18px',
                lineHeight: 1.7,
                maxWidth: '520px',
                marginLeft: 'auto',
                marginBottom: '40px',
                fontFamily: '"Tajawal", sans-serif',
              }}
              dir="rtl"
            >
              منصة مناولة تربط طرودك بمسافرين موثقين بنفاذ يعبرون المملكة. بشر يوصلون، تقنية تتتبع، ثقة مضمونة.
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={loaded ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap gap-4 justify-end"
            >
              <CTAButton primary>أرسل طردك الآن</CTAButton>
              <CTAButton>كن مسافراً معنا</CTAButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-20 flex flex-wrap items-center gap-x-12 gap-y-3"
              style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.4)', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}
            >
              <span style={{ color: BRAND.orange }}>●</span>
              <span><span style={{ color: 'rgba(255,255,255,0.8)' }}>47 CITIES</span> · ٤٧ مدينة</span>
              <span style={{ color: BRAND.orange }}>●</span>
              <span><span style={{ color: 'rgba(255,255,255,0.8)' }}>27 MIN AVG</span> · ٢٧ دقيقة</span>
              <span style={{ color: BRAND.orange }}>●</span>
              <span><span style={{ color: 'rgba(255,255,255,0.8)' }}>2.4M DELIVERED</span> · ٢.٤ مليون طرد</span>
            </motion.div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}
        >
          <span>SCROLL · انزل</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12"
            style={{ background: `linear-gradient(to bottom, ${BRAND.orange}, transparent)` }}
          />
        </div>
      </section>

      <DeliveryTicker />
      <PickupSection />
      <OnTheRoadSection />
      <DeliveredSection />

      {/* MOMENT OF TRUST */}
      <section className="relative py-32 overflow-hidden" style={{ backgroundColor: BRAND.cream }}>
        <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.orange} opacity={0.04} />
        <div className="relative max-w-[1400px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
            <div className="text-right" dir="rtl">
              <div style={{ color: BRAND.orange, fontSize: '12px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '16px' }}>
                جربها · TRY IT
              </div>
              <h2 style={{ color: BRAND.charcoal, fontFamily: '"Tajawal", sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9 }}>
                لحظة <span style={{ color: BRAND.orange }}>الثقة</span>
              </h2>
              <div style={{ color: 'rgba(54,52,54,0.4)', fontSize: '20px', letterSpacing: '0.18em', fontFamily: '"Inter", sans-serif', fontWeight: 600, marginTop: '16px' }}>
                THE MOMENT OF TRUST
              </div>
            </div>
            <p style={{ color: 'rgba(54,52,54,0.65)', maxWidth: '380px', fontSize: '15px', lineHeight: 1.7, marginTop: '32px', fontFamily: '"Tajawal", sans-serif' }} dir="rtl">
              اسحب الطرد من المُرسل إلى المُستقبِل. شاهد السعر يُحتسب فوراً.
            </p>
          </div>
          <div style={{ backgroundColor: BRAND.charcoal, padding: '4px' }}>
            <MomentOfTrust />
          </div>
        </div>
      </section>

      <FeaturesSection />
      <NumbersSection />

      {/* FINAL CTA */}
      <section className="relative py-40 overflow-hidden" style={{ backgroundColor: BRAND.charcoal }}>
        <LogoPattern className="absolute inset-0 w-full h-full" color={BRAND.orange} opacity={0.06} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${BRAND.orange}08, transparent)` }} />

        <div className="relative max-w-[1400px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-center mb-8">
              <MonawlahMark size={72} color={BRAND.orange} />
            </div>
            <div style={{ color: BRAND.orange, fontSize: '12px', letterSpacing: '0.4em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '24px' }}>
              انضم الآن · JOIN NOW
            </div>
            <h2
              style={{
                color: BRAND.white,
                fontFamily: '"Tajawal", sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(3rem, 10vw, 9rem)',
                lineHeight: 0.9,
                marginBottom: '32px',
              }}
              dir="rtl"
            >
              المملكة <br />
              <span style={{ color: BRAND.orange }}>تتحرك معك.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '20px', maxWidth: '560px', margin: '0 auto 12px', fontFamily: '"Tajawal", sans-serif' }} dir="rtl">
              انضم إلى ٢.٤ مليون شحنة سلكت طريقها مع مناولة.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px', maxWidth: '560px', margin: '0 auto 48px', fontFamily: '"Inter", sans-serif' }} dir="ltr">
              Join 2.4 million shipments already moving with MONAWLAH.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <CTAButton primary>iOS · App Store</CTAButton>
              <CTAButton>Android · Google Play</CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16" style={{ backgroundColor: BRAND.charcoalDeep, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid lg:grid-cols-4 gap-12 mb-16 text-right" dir="rtl">
            <div className="lg:col-span-2">
              <div className="flex justify-end mb-6">
                <MonawlahLockup color={BRAND.orange} textColor={BRAND.white} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, maxWidth: '380px', marginLeft: 'auto', fontFamily: '"Tajawal", sans-serif' }}>
                منصة سعودية لربط المسافرين بمن يحتاج شحناً سريعاً وآمناً. مرخصة من هيئة الاتصالات وتقنية المعلومات.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', lineHeight: 1.7, maxWidth: '380px', marginLeft: 'auto', marginTop: '12px', fontFamily: '"Inter", sans-serif' }} dir="ltr">
                A Saudi platform connecting travelers with people who need fast, safe delivery. Licensed by CITC.
              </p>
            </div>
            <div>
              <div style={{ color: BRAND.orange, fontSize: '11px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '20px' }}>
                الشركة · COMPANY
              </div>
              <ul className="space-y-3" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontFamily: '"Tajawal", sans-serif', listStyle: 'none', padding: 0 }}>
                {['عن مناولة', 'الوظائف', 'الصحافة', 'تواصل معنا'].map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <div style={{ color: BRAND.orange, fontSize: '11px', letterSpacing: '0.3em', fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: '20px' }}>
                قانوني · LEGAL
              </div>
              <ul className="space-y-3" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontFamily: '"Tajawal", sans-serif', listStyle: 'none', padding: 0 }}>
                {['الشروط والأحكام', 'سياسة الخصوصية', 'السلامة', 'التأمين'].map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div
            className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.2em', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}
          >
            <div>© 2026 MONAWLAH · مناولة · ALL RIGHTS RESERVED</div>
            <div className="flex items-center gap-3">
              <span>WWW.MONAWLAH.COM</span>
              <span>·</span>
              <span style={{ fontFamily: '"Tajawal", sans-serif' }}>المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
