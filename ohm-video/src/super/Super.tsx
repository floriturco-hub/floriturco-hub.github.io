import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el plano del supermercado visto desde arriba (frutas en la entrada, pasillos y la leche al
// fondo) con el recorrido del cliente; en el centro, las frutas, el buen humor y la cesta «sano → capricho»; a la
// derecha, un carrito pequeño lleno frente a uno grande medio vacío.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const LECHE = "#A8D8F0";
const ESTANTE = "#5A4A3A";
const COLORES = ["#E8414F", "#F8C848", "#48C878", "#E8703C", "#8A5CC8", "#08D8E8"];
const ESTANTES = [230, 410, 590, 770];
const RUTA: [number, number][] = [
  [560, 1600],
  [560, 1480],
  [330, 1390],
  [335, 1230],
  [335, 680],
  [515, 680],
  [515, 1230],
  [695, 1230],
  [695, 640],
  [760, 610],
];

const enRuta = (p: number): [number, number] => {
  const L = RUTA.slice(1).map((q, i) => Math.hypot(q[0] - RUTA[i][0], q[1] - RUTA[i][1]));
  let d = Math.max(0, Math.min(1, p)) * L.reduce((a, b) => a + b, 0);
  for (let i = 0; i < L.length; i++) {
    if (d <= L[i]) {
      const f = d / L[i];
      return [RUTA[i][0] + (RUTA[i + 1][0] - RUTA[i][0]) * f, RUTA[i][1] + (RUTA[i + 1][1] - RUTA[i][1]) * f];
    }
    d -= L[i];
  }
  return RUTA[RUTA.length - 1];
};

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1010, 0.95],
  [T.final - 0.1, 550, 1010, 0.98],
  [T.final + 0.2, 560, 1460, 1.6],
  [T.entrar - 0.1, 560, 1460, 1.63],
  [T.entrar + 0.2, 550, 1010, 0.95],
  [T.frutas - 0.1, 550, 1010, 0.98],
  [T.frutas + 0.2, 340, 1390, 1.7],
  [T.colores - 0.1, 340, 1390, 1.73],
  [T.colores + 0.2, 1850, 1030, 1.0],
  [T.humor - 0.1, 1850, 1030, 1.03],
  [T.humor + 0.2, 1850, 930, 1.35],
  [T.sano - 0.1, 1850, 930, 1.38],
  [T.sano + 0.2, 1850, 1130, 1.1],
  [T.capricho - 0.1, 1850, 1130, 1.13],
  [T.capricho + 0.2, 1850, 1130, 1.4],
  [T.leche - 0.1, 1850, 1130, 1.43],
  [T.leche + 0.2, 760, 560, 1.7],
  [T.compra - 0.1, 760, 560, 1.73],
  [T.compra + 0.2, 760, 600, 1.35],
  [T.fondo - 0.1, 760, 600, 1.38],
  [T.fondo + 0.2, 550, 1010, 0.95],
  [T.recorrer - 0.1, 550, 1010, 0.98],
  [T.recorrer + 0.4, 550, 1010, 1.5],
  [T.lista - 0.1, 550, 1010, 1.5],
  [T.lista + 0.2, 550, 1010, 0.95],
  [T.carrito - 0.1, 550, 1010, 0.98],
  [T.carrito + 0.2, 3100, 1030, 1.0],
  [T.grandes - 0.1, 3100, 1030, 1.03],
  [T.grandes + 0.2, 3330, 1050, 1.35],
  [T.llenas - 0.1, 3330, 1050, 1.38],
  [T.llenas + 0.2, 3250, 1050, 1.1],
  [T.proxima - 0.1, 3250, 1050, 1.13],
  [T.proxima + 0.25, 550, 1010, 0.95],
  [T.fin + 0.3, 550, 1010, 0.98],
];

const Carrito: React.FC<{ x: number; y: number; e: number; lleno: number }> = ({ x, y, e, lleno }) => (
  <g transform={`translate(${x} ${y}) scale(${e})`}>
    {new Array(Math.round(lleno * 12)).fill(0).map((_, k) => (
      <rect key={k} x={-110 + (k % 4) * 55} y={-30 - Math.floor(k / 4) * 46} width={48} height={42} rx={8} fill={COLORES[k % COLORES.length]} />
    ))}
    <path d="M -150 -170 L -130 40 L 130 40 L 160 -170 Z" fill="none" stroke="#C8CED8" strokeWidth={10} strokeLinejoin="round" />
    {[-90, -30, 30, 90].map((dx) => (
      <line key={dx} x1={dx} y1={-170} x2={dx * 0.85} y2={40} stroke="#C8CED8" strokeWidth={4} />
    ))}
    <path d="M -150 -170 L -210 -230" stroke="#C8CED8" strokeWidth={10} strokeLinecap="round" />
    <circle cx={-90} cy={80} r={24} fill="#3A3F4C" />
    <circle cx={90} cy={80} r={24} fill="#3A3F4C" />
  </g>
);

export const SuperMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const k = camaraEn(camaraKeys(), t);
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Recorrido del cliente
  const p = t < T.final ? interpolate(t, [0, T.final], [0.55, 1], clamp) : t > T.proxima ? interpolate(t, [T.proxima, T.fin + 0.3], [0.1, 0.55], clamp) : t < T.leche ? interpolate(t, [T.entrar + 0.2, T.frutas + 0.8], [0, 0.14], clamp) : interpolate(t, [T.recorrer, T.lista + 0.3], [0.14, 1], clamp);
  const [px, py] = enRuta(p);
  const sigue = ventana(T.recorrer + 0.2, T.lista, 0.5, 0.3);
  const cx = k.cx + (px - k.cx) * sigue;
  const cy = k.cy + (py - k.cy) * sigue;
  const zoom = k.zoom;
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const caprichos = Math.floor(interpolate(p, [0.2, 1], [0, 9], clamp));
  const pregunta = Math.max(ventana(-1, T.final), ventana(T.proxima, T.fin + 2));
  const trazado = new Array(61).fill(0).map((_, i) => enRuta((i / 60) * p));

  // Paneles
  const verFrutas = ventana(T.colores - 0.1, T.leche + 0.2);
  const cesta = interpolate(t, [T.sano + 0.4, T.sano + 1.0], [0, 1], clamp);
  const capricho = interpolate(t, [T.capricho, T.capricho + 0.5], [0, 1], clamp);
  const verCarros = ventana(T.carrito - 0.1, T.proxima + 0.2);
  const llena = interpolate(t, [T.llenas, T.llenas + 1.0], [0.35, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#181A26" />

        {/* Plano del supermercado */}
        <rect x={120} y={460} width={860} height={1100} rx={16} fill="#2A2E3A" />
        <path d="M 480 1560 L 120 1560 L 120 460 L 980 460 L 980 1560 L 640 1560" fill="none" stroke="#8A90A0" strokeWidth={12} />
        <rect x={560} y={476} width={400} height={100} rx={10} fill={LECHE} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(${600 + i * 60} 500)`}>
            <rect width={36} height={56} fill="#FFFFFF" />
            <path d="M 0 0 L 18 -14 L 36 0 Z" fill="#2A6AC8" />
          </g>
        ))}
        <circle cx={760} cy={526} r={90 + 10 * Math.sin(t * 6)} fill="none" stroke={C.yellow} strokeWidth={8} opacity={Math.max(pregunta, ventana(T.leche, T.fondo + 0.3))} />
        {pregunta > 0 ? (
          <text x={760} y={680} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={120} fontWeight={700} opacity={pregunta}>
            ?
          </text>
        ) : null}
        {ESTANTES.map((x, i) => (
          <g key={x}>
            <rect x={x} y={740} width={60} height={440} rx={8} fill={ESTANTE} />
            {new Array(9).fill(0).map((_, j) => (
              <rect key={j} x={x + 10} y={754 + j * 47} width={40} height={34} rx={6} fill={COLORES[(i * 3 + j) % COLORES.length]} />
            ))}
          </g>
        ))}
        {/* Frutas y verduras en la entrada */}
        {new Array(24).fill(0).map((_, i) => (
          <circle key={i} cx={170 + (i % 8) * 44} cy={1320 + Math.floor(i / 8) * 50} r={20} fill={["#E8414F", "#F8C848", "#48C878", "#E8703C"][i % 4]} />
        ))}
        {/* Recorrido */}
        {p > 0 ? <path d={`M ${trazado.map((q) => `${q[0]} ${q[1]}`).join(" L ")}`} fill="none" stroke={C.yellow} strokeWidth={8} strokeDasharray="20 14" /> : null}
        {p > 0 ? <circle cx={px} cy={py} r={22} fill={C.yellow} stroke="#1A1A1A" strokeWidth={4} /> : null}
        {sigue > 0
          ? [0, 1, 2].map((j) => {
              const a = t * 4 + j * 2.1;
              return <circle key={j} cx={px + Math.cos(a) * 70} cy={py + Math.sin(a) * 70} r={8} fill="#FFFFFF" opacity={0.8 * sigue} />;
            })
          : null}
        <Carrito x={560} y={1490} e={0.45} lleno={0} />
        <Pildora x={550} y={1660} texto="el truco del carrito" color={C.white} o={ventana(T.final + 0.2, T.entrar)} tam={40} />
        <Pildora x={760} y={700} texto="lo más comprado" color={C.cyan} o={ventana(T.compra, T.fondo + 0.2)} tam={42} />

        {/* Frutas, buen humor y cesta */}
        <g opacity={verFrutas}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {new Array(12).fill(0).map((_, i) => (
            <circle key={i} cx={1500 + (i % 6) * 140} cy={1300 + Math.floor(i / 6) * 90 - (i % 2) * 20} r={44} fill={["#E8414F", "#F8C848", "#48C878", "#E8703C"][i % 4]} opacity={1 - 0.7 * cesta} />
          ))}
          <g opacity={ventana(T.humor, T.sano + 0.2)} transform="translate(1850 920)">
            <circle r={150} fill={C.yellow} />
            <circle cx={-50} cy={-40} r={18} fill="#1A1A1A" />
            <circle cx={50} cy={-40} r={18} fill="#1A1A1A" />
            <path d="M -80 30 Q 0 110 80 30" fill="none" stroke="#1A1A1A" strokeWidth={14} strokeLinecap="round" />
          </g>
          <g opacity={cesta} transform="translate(1850 1150)">
            <path d="M -200 -40 L 200 -40 L 160 140 L -160 140 Z" fill="#B88A50" />
            <path d="M -170 -40 Q 0 -260 170 -40" fill="none" stroke="#8A5A28" strokeWidth={14} />
            <circle cx={-60} cy={-70 + 30 * cesta} r={56} fill="#E8414F" />
            <text x={-60} y={-130} textAnchor="middle" fill="#48C878" fontFamily={mono} fontSize={30} fontWeight={700}>
              sano
            </text>
            <g opacity={capricho} transform={`translate(80 ${-60 - 120 * (1 - capricho)})`}>
              <circle r={60} fill="#C88A5A" />
              <circle r={22} fill="#2A2E3A" />
              <path d="M -50 -20 Q 0 -60 50 -20" fill="none" stroke="#F088A0" strokeWidth={16} />
            </g>
          </g>
        </g>
        <Pildora x={1850} y={700} texto="permiso para un capricho" color={C.orange} o={ventana(T.capricho + 0.3, T.leche)} tam={38} />

        {/* Carritos */}
        <g opacity={verCarros}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <Carrito x={2840} y={1150} e={0.65} lleno={1} />
          <Carrito x={3330} y={1150} e={1.05} lleno={llena * 0.75} />
          <text x={2840} y={1320} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
            antes
          </text>
          <text x={3330} y={1320} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
            ahora
          </text>
        </g>
        <Pildora x={3330} y={720} texto={llena > 0.5 ? "¡lo llenas!" : "parece poco…"} color={llena > 0.5 ? C.yellow : C.white} o={ventana(T.vacio, T.proxima + 0.2)} tam={46} />
      </g>

      <Pildora x={540} y={1460} texto={`+${caprichos} cosas fuera de la lista`} color={C.red} o={ventana(T.tentacion, T.carrito)} tam={40} />
      {[T.colores, T.leche, T.carrito, T.llenas].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(330)} y={sy(1360)} dx={150} dy={-220} texto="frutas y verduras" color="#48C878" o={ventana(T.frutas + 0.3, T.colores)} />
      <Tag x={sx(760)} y={sy(526)} dx={-170} dy={200} texto="la leche" color={LECHE} o={ventana(T.leche + 0.3, T.compra)} />
      <Tag x={sx(ESTANTES[1] + 30)} y={sy(960)} dx={150} dy={-150} texto="tentaciones" color={C.red} o={ventana(T.tentacion + 0.3, T.lista)} />
    </svg>
  );
};
