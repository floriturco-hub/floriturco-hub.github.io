import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda (x < 0), el laboratorio (cubito bajo un coche y barra estirada); en el centro-izquierda,
// un edificio con su esqueleto de acero en rayos X; luego, un bloque con grietas diminutas; a la derecha, una viga
// que se dobla y el acero que la salva.
const GRIS = "#A8A8B0";
const GRIS_OSC = "#7A7A84";
const ACERO = "#F8C848";
const APRIETA = "#5AB8F8";
const ESTIRA = "#E8414F";
const GRIETAS = new Array(12).fill(0).map((_, i) => ({ x: 1560 + random(`gx${i}`) * 580, y: 860 + random(`gy${i}`) * 340, a: random(`ga${i}`) * 180, l: 26 + random(`gl${i}`) * 26 }));
const GRAVA = new Array(40).fill(0).map((_, i) => ({ x: random(`rx${i}`), y: random(`ry${i}`), r: 6 + random(`rr${i}`) * 10 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.15],
  [T.aplastas - 0.4, 550, 1000, 1.18],
  [T.aplastas + 0.4, -750, 1030, 1.0],
  [T.porQue - 0.3, -750, 1030, 1.02],
  [T.porQue + 0.5, 1850, 1030, 1.0],
  [T.dobla - 0.3, 1850, 1030, 1.02],
  [T.dobla + 0.5, 3100, 1030, 1.0],
  [T.uno - 0.3, 3100, 1030, 1.02],
  [T.uno + 0.5, 550, 1000, 1.15],
  [T.fin + 2, 550, 1000, 1.2],
];

export const ConcretoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Edificio: barrido de rayos X que descubre el esqueleto
  const barrido = t < T.aplastas ? interpolate(t, [0.1, 1.5], [0, 1], clamp) : interpolate(t, [T.uno, T.uno + 1.2], [0, 1], clamp);
  const yBarrido = 380 + barrido * 1020;
  const brillo = t > T.juntos ? 0.6 + 0.4 * Math.sin(t * 6) : 0.85;

  // Laboratorio
  const lab = ventana(T.aplastas - 0.3, T.porQue + 0.3, 0.6, 0.6);
  const coche = interpolate(t, [T.cubito - 0.2, T.cubito + 0.5], [0, 1], clamp);
  const tira = interpolate(t, [T.estiras, T.diez], [0, 1], clamp);
  const rompe = interpolate(t, [T.diez - 0.1, T.diez + 0.4], [0, 1], clamp);

  // Bloque con grietas
  const bloque = ventana(T.porQue - 0.3, T.dobla + 0.3, 0.6, 0.6);
  const aprieta = ventana(T.apretar, T.estirar + 0.1, 0.3, 0.2);
  const estira = interpolate(t, [T.estirar, T.estirar + 0.4], [0, 1], clamp);
  const crece = interpolate(t, [T.crece, T.crece + 0.6], [0, 1], clamp);
  const parte = interpolate(t, [T.crece + 0.6, T.crece + 0.9], [0, 1], clamp);
  const escalaGrieta = 1 - 0.7 * aprieta + 0.5 * estira;

  // Viga
  const viga = ventana(T.dobla - 0.3, T.uno + 0.3, 0.6, 0.6);
  const carga = interpolate(t, [T.dobla, T.dobla + 0.8], [0, 1], clamp);
  const acero = interpolate(t, [T.acero, T.acero + 0.6], [0, 1], clamp);
  const sag = 60 * carga * (1 - 0.55 * acero);
  const grietaViga = interpolate(t, [T.abajo + 0.3, T.abajo + 0.8], [0, 1], clamp) * (1 - acero);
  const zonas = interpolate(t, [T.viga - 0.2, T.viga + 0.4], [0, 1], clamp);
  const relieves = ventana(T.relieves, T.uno);
  const vy = (x: number, y: number) => y + sag * (1 - ((x - 3100) / 450) ** 2);
  const borde = (y: number) =>
    new Array(19)
      .fill(0)
      .map((_, i) => {
        const x = 2650 + i * 50;
        return `${x} ${vy(x, y)}`;
      })
      .join(" L ");

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Barra de concreto (dos mitades que se separan al romperse)
  const mitad = (lado: number) => (
    <g transform={`translate(${lado * (8 * tira + 60 * rompe)} 0)`}>
      <rect x={lado < 0 ? -760 : -575} y={1120} width={185} height={80} fill={GRIS} />
      <rect x={lado < 0 ? -800 : -390} y={1100} width={40} height={120} rx={6} fill="#5A5A66" />
      <path d={`M ${lado < 0 ? -820 : -370} 1160 l ${lado * 70} 0 m ${-lado * 20} -18 l ${lado * 20} 18 l ${-lado * 20} 18`} fill="none" stroke={ESTIRA} strokeWidth={8} strokeLinecap="round" opacity={tira > 0 ? 1 : 0} />
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Ciudad */}
        <rect x={-1400} y={-400} width={2700} height={2400} fill="#1A1E34" opacity={0.6} />
        <rect x={-1400} y={1400} width={2700} height={600} fill="#2A2A36" />
        {/* Edificio con esqueleto */}
        <g>
          <rect x={250} y={380} width={600} height={1020} fill={GRIS} />
          {new Array(6).fill(0).map((_, f) =>
            new Array(3).fill(0).map((__, c) => <rect key={`${f}-${c}`} x={300 + c * 190} y={420 + f * 165} width={120} height={100} rx={6} fill="#3A4A6A" />),
          )}
          <clipPath id="rayosEdificio">
            <rect x={240} y={370} width={620} height={yBarrido - 370} />
          </clipPath>
          <g clipPath="url(#rayosEdificio)">
            <rect x={250} y={380} width={600} height={1020} fill="#1A1E34" opacity={0.75} />
            {[260, 450, 640, 830].map((x) => (
              <g key={x}>
                <line x1={x} y1={380} x2={x} y2={1400} stroke={ACERO} strokeWidth={8} opacity={brillo} />
                <line x1={x + 12} y1={380} x2={x + 12} y2={1400} stroke={ACERO} strokeWidth={4} opacity={brillo * 0.7} />
              </g>
            ))}
            {new Array(7).fill(0).map((_, f) => (
              <g key={f}>
                <line x1={250} y1={392 + f * 165} x2={850} y2={392 + f * 165} stroke={ACERO} strokeWidth={8} opacity={brillo} />
                <line x1={250} y1={404 + f * 165} x2={850} y2={404 + f * 165} stroke={ACERO} strokeWidth={4} opacity={brillo * 0.7} />
              </g>
            ))}
          </g>
          {barrido > 0 && barrido < 1 ? <rect x={230} y={yBarrido - 6} width={640} height={12} fill={C.cyan} opacity={0.8} /> : null}
        </g>

        {/* Laboratorio */}
        <g opacity={lab}>
          <Panel x0={-1300} y0={600} x1={-200} y1={1460} />
          <text x={-1050} y={690} textAnchor="middle" fill={APRIETA} fontFamily={mono} fontSize={40} fontWeight={700}>
            aplastar
          </text>
          <text x={-560} y={690} textAnchor="middle" fill={ESTIRA} fontFamily={mono} fontSize={40} fontWeight={700}>
            estirar
          </text>
          {/* Cubito bajo un coche */}
          <rect x={-1080} y={1290} width={60} height={60} fill={GRIS} stroke="#E8E6F0" strokeWidth={3} />
          <rect x={-1250} y={1350} width={400} height={20} fill="#5A5A66" />
          <g transform={`translate(-1050 ${1290 - 250 * (1 - coche)})`} opacity={coche}>
            <path d="M -170 -10 L -150 -70 L -70 -110 L 60 -110 L 130 -60 L 170 -50 L 170 -10 Z" fill={C.red} />
            <rect x={-130} y={-100} width={70} height={40} rx={6} fill="#8AC8E8" />
            <rect x={-40} y={-100} width={80} height={40} rx={6} fill="#8AC8E8" />
            <circle cx={-110} cy={-10} r={32} fill="#1A1A20" />
            <circle cx={110} cy={-10} r={32} fill="#1A1A20" />
          </g>
          <text x={-1050} y={1420} textAnchor="middle" fill="#48C878" fontFamily={mono} fontSize={34} fontWeight={700} opacity={coche}>
            ✓ aguanta
          </text>
          {/* Barra estirada */}
          {mitad(-1)}
          {mitad(1)}
          {tira > 0.6 && rompe < 1 ? <path d="M -575 1120 l -10 20 l 14 18 l -10 22 l 8 20" fill="none" stroke="#1A1A20" strokeWidth={5} /> : null}
          <text x={-560} y={1420} textAnchor="middle" fill={ESTIRA} fontFamily={mono} fontSize={34} fontWeight={700} opacity={rompe}>
            ✗ ¡crac!
          </text>
        </g>
        <Pildora x={-1050} y={900} texto="2 cm" color={C.white} o={ventana(T.cubito, T.estiras)} tam={40} />
        <Pildora x={-560} y={900} texto="10× más débil" color={ESTIRA} o={ventana(T.diez, T.porQue + 0.3)} tam={40} />

        {/* Bloque con grietas diminutas */}
        <g opacity={bloque}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {[-1, 1].map((lado) => (
            <g key={lado} transform={`translate(${lado * 40 * parte} 0)`}>
              <clipPath id={`mitad${lado}`}>
                <rect x={lado < 0 ? 1500 : 1850} y={800} width={350} height={460} />
              </clipPath>
              <g clipPath={`url(#mitad${lado})`}>
                <rect x={1500} y={820} width={700} height={420} fill={GRIS} />
                {GRAVA.map((g, i) => (
                  <circle key={i} cx={1520 + g.x * 660} cy={840 + g.y * 380} r={g.r} fill={GRIS_OSC} />
                ))}
                {GRIETAS.map((g, i) => {
                  const a = (g.a * Math.PI) / 180;
                  const l = g.l * escalaGrieta;
                  return <line key={i} x1={g.x - Math.cos(a) * l} y1={g.y - Math.sin(a) * l} x2={g.x + Math.cos(a) * l} y2={g.y + Math.sin(a) * l} stroke="#1A1A20" strokeWidth={3 + 4 * estira} strokeLinecap="round" />;
                })}
                <path d={`M 1850 ${820} l -10 ${60 * crece} l 16 ${70 * crece} l -12 ${80 * crece} l 14 ${90 * crece} l -8 ${120 * crece}`} fill="none" stroke="#1A1A20" strokeWidth={6} />
              </g>
            </g>
          ))}
          {/* Flechas: aprieta o estira */}
          {[-1, 1].map((lado) => (
            <g key={lado}>
              <path d={`M ${1850 + lado * 450} 1030 l ${-lado * 70} 0 m ${lado * 20} -20 l ${-lado * 20} 20 l ${lado * 20} 20`} fill="none" stroke={APRIETA} strokeWidth={10} strokeLinecap="round" opacity={aprieta} />
              <path d={`M ${1850 + lado * 380} 1030 l ${lado * 70} 0 m ${-lado * 20} -20 l ${lado * 20} 20 l ${-lado * 20} 20`} fill="none" stroke={ESTIRA} strokeWidth={10} strokeLinecap="round" opacity={estira} />
            </g>
          ))}
        </g>

        {/* Viga que se dobla */}
        <g opacity={viga}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <path d="M 2700 1150 l -50 90 l 100 0 z M 3500 1150 l -50 90 l 100 0 z" fill="#5A5A66" />
          <rect x={3020} y={vy(3100, 950) - 120 * carga - 10} width={160} height={120 * carga} rx={10} fill="#8A6A3A" opacity={carga} />
          <path d={`M ${borde(950)} L ${borde(1100).split(" L ").reverse().join(" L ")} Z`} fill={GRIS} />
          {/* Zonas: arriba se aplasta, abajo se estira */}
          {zonas > 0
            ? [2850, 3100, 3350].map((x) => (
                <g key={x} opacity={zonas}>
                  <path d={`M ${x - 60} ${vy(x, 975)} l 40 0 m -14 -12 l 14 12 l -14 12 M ${x + 60} ${vy(x, 975)} l -40 0 m 14 -12 l -14 12 l 14 12`} fill="none" stroke={APRIETA} strokeWidth={6} strokeLinecap="round" />
                  <path d={`M ${x - 20} ${vy(x, 1075)} l -40 0 m 14 -12 l -14 12 l 14 12 M ${x + 20} ${vy(x, 1075)} l 40 0 m -14 -12 l 14 12 l -14 12`} fill="none" stroke={ESTIRA} strokeWidth={6} strokeLinecap="round" opacity={interpolate(t, [T.abajo - 0.2, T.abajo + 0.3], [0, 1], clamp)} />
                </g>
              ))
            : null}
          {grietaViga > 0 ? <path d={`M 3100 ${vy(3100, 1100)} l -8 ${-50 * grietaViga} l 12 ${-30 * grietaViga}`} fill="none" stroke="#1A1A20" strokeWidth={6} /> : null}
          {/* Varillas de acero */}
          <g opacity={acero}>
            <path d={`M ${borde(1065)}`} fill="none" stroke={ACERO} strokeWidth={12} />
            {new Array(18).fill(0).map((_, i) => {
              const x = 2675 + i * 50;
              return <line key={i} x1={x} y1={vy(x, 1055)} x2={x + 10} y2={vy(x, 1075)} stroke="#A88A28" strokeWidth={4} />;
            })}
          </g>
          {/* Lupa a los relieves */}
          <g opacity={relieves} transform="translate(3100 760)">
            <circle r={130} fill={GRIS} stroke={C.white} strokeWidth={6} />
            <rect x={-130} y={-28} width={260} height={56} fill={ACERO} />
            {new Array(9).fill(0).map((_, i) => (
              <path key={i} d={`M ${-120 + i * 30} -28 l 14 56`} stroke="#A88A28" strokeWidth={8} />
            ))}
            <line x1={0} y1={130} x2={0} y2={vy(3100, 1065) - 760 - 20} stroke={C.white} strokeWidth={4} />
          </g>
        </g>
      </g>

      <Tag x={sx(450)} y={sy(560)} dx={0} dy={-230} texto="esqueleto de acero" color={ACERO} o={ventana(0.9, T.aplastas)} />
      <Tag x={sx(1700)} y={sy(950)} dx={-40} dy={-260} texto="grietas diminutas" color={C.white} o={ventana(T.grietas, T.apretar)} />
      <Tag x={sx(2800)} y={sy(vy(2800, 1065))} dx={-20} dy={240} texto="varilla de acero" color={ACERO} o={ventana(T.varillas, T.relieves)} />
    </svg>
  );
};
