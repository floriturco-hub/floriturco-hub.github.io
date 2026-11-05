import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la cocina con la sartén de aceite en llamas (agua → bola de fuego; tapa → se apaga);
// en el centro, el triángulo del fuego; a la derecha, un extintor por dentro.
const ACEITE = "#E8B840";
const AGUA = "#5AB8F8";
const ROJO = "#D83A3A";
const POLVO = "#F0ECD8";
const SARTEN = { x0: 330, x1: 770, fondo: 1240, aceite: 1185 };
const GOTAS = new Array(36).fill(0).map((_, i) => ({ a: -Math.PI / 2 + (random(`ga${i}`) - 0.5) * 1.6, v: 300 + random(`gv${i}`) * 600, x: random(`gx${i}`) }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 980, 1.12],
  [T.tres - 0.3, 550, 980, 1.16],
  [T.tres + 0.5, 1850, 1030, 1.0],
  [T.extintor - 0.3, 1850, 1030, 1.02],
  [T.extintor + 0.5, 3100, 1030, 1.0],
  [T.sarten - 0.3, 3100, 1030, 1.02],
  [T.sarten + 0.5, 550, 1050, 1.3],
  [T.hunde - 0.3, 550, 1050, 1.32],
  [T.hunde + 0.4, 550, 1180, 2.2],
  [T.lanza - 0.4, 550, 1180, 2.25],
  [T.lanza + 0.3, 550, 980, 1.12],
  [T.fin + 2, 550, 1000, 1.2],
];

// Llama que parpadea
const llama = (x: number, y: number, h: number, w: number, t: number, k: number, o = 1) => {
  if (h < 2 || o <= 0) {
    return null;
  }
  const f = 1 + 0.12 * Math.sin(t * 14 + k * 1.7);
  return (
    <g key={`ll${k}`} opacity={o}>
      <path d={`M ${x - w} ${y} C ${x - w} ${y - h * 0.5 * f}, ${x - w * 0.2} ${y - h * 0.7}, ${x + Math.sin(t * 6 + k) * w * 0.4} ${y - h * f} C ${x + w * 0.3} ${y - h * 0.6}, ${x + w} ${y - h * 0.5}, ${x + w} ${y} Z`} fill="#E8603A" />
      <path d={`M ${x - w * 0.55} ${y} C ${x - w * 0.5} ${y - h * 0.35}, ${x} ${y - h * 0.45 * f}, ${x + Math.sin(t * 7 + k) * w * 0.2} ${y - h * 0.62} C ${x + w * 0.3} ${y - h * 0.35}, ${x + w * 0.55} ${y - h * 0.3}, ${x + w * 0.55} ${y} Z`} fill={C.yellow} />
    </g>
  );
};

export const ExtintorMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Cocina: gancho con bola de fuego, luego la explicación y al final la tapa
  const vierte = ventana(0.1, 1.0, 0.2, 0.3);
  const bola1 = interpolate(t, [0.75, 1.1, 1.7, 2.2], [0, 1, 1, 0], clamp);
  const gota = interpolate(t, [T.agua - 0.2, T.agua + 0.4], [0, 1], clamp);
  const hunde = interpolate(t, [T.hunde, T.hunde + 0.8], [0, 1], clamp);
  const hierve = interpolate(t, [T.hierve, T.hierve + 0.4], [0, 1], clamp);
  const lanza = interpolate(t, [T.lanza, T.millones + 0.6], [0, 1], clamp);
  const bola2 = interpolate(t, [T.bola - 0.6, T.bola, T.queHacer - 0.2, T.queHacer + 0.3], [0, 1, 1, 0], clamp);
  const apagaEstufa = interpolate(t, [T.apaga, T.apaga + 0.3], [0, 1], clamp);
  const tapa = interpolate(t, [T.tapa - 0.2, T.tapa + 0.3], [0, 1], clamp);
  const muere = interpolate(t, [T.tapa, T.sinOxigeno + 0.6], [1, 0], clamp);
  const fuegoSarten = (t < T.tres + 0.4 ? 1 : t > T.sarten - 0.5 ? 1 : 0) * muere;
  const bola = Math.max(bola1, bola2);
  const termo = ventana(T.aceite, T.agua);
  const vaporX = ventana(T.vapor, T.millones);

  // Triángulo del fuego
  const triangulo = ventana(T.tres - 0.3, T.extintor + 0.3, 0.6, 0.6);
  const lado = (k: number) => interpolate(t, [T.calor + k * 0.75, T.calor + k * 0.75 + 0.3], [0, 1], clamp);
  const quita = interpolate(t, [T.quita, T.quita + 0.6], [0, 1], clamp);
  const fuegoTri = 1 - interpolate(t, [T.quita + 0.4, T.quita + 1.2], [0, 1], clamp);

  // Extintor por dentro
  const ext = ventana(T.extintor - 0.3, T.sarten + 0.3, 0.6, 0.6);
  const pasador = interpolate(t, [T.pasador, T.pasador + 0.4], [0, 1], clamp);
  const palanca = interpolate(t, [T.palanca, T.palanca + 0.3], [0, 1], clamp);
  const sale = interpolate(t, [T.empuja, T.manguera + 0.3], [0, 1], clamp);
  const nube = interpolate(t, [T.manguera, T.cubre + 0.6], [0, 1], clamp);
  const fuegoExt = 1 - interpolate(t, [T.corta, T.reaccion + 0.4], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const nivelAgua = SARTEN.fondo - 18;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Cocina */}
        <rect x={-300} y={-400} width={1500} height={2400} fill="#2A2232" />
        <rect x={-300} y={360} width={1500} height={30} fill="#3A3242" />
        {new Array(8).fill(0).map((_, f) =>
          new Array(13).fill(0).map((__, c) => <rect key={`${f}-${c}`} x={-290 + c * 120} y={400 + f * 100} width={112} height={92} rx={6} fill="#32283E" />),
        )}
        <rect x={-300} y={1250} width={1500} height={40} fill="#C8C0B8" />
        <rect x={-300} y={1290} width={1500} height={600} fill="#4A3E52" />
        {/* Hornilla y perilla */}
        <rect x={360} y={1240} width={380} height={12} rx={4} fill="#1A1A20" />
        {[0, 1, 2, 3, 4].map((k) => llama(400 + k * 75, 1250, 26 * (1 - apagaEstufa), 12, t, 20 + k, (t < T.tres + 0.4 || t > T.sarten - 0.5) ? 0.9 : 0))}
        <g transform="translate(550 1380)">
          <circle r={42} fill="#E8E6F0" />
          <rect x={-8} y={-38} width={16} height={40} rx={6} fill="#3A3242" transform={`rotate(${-90 * apagaEstufa})`} />
        </g>
        {/* Sartén en corte con aceite */}
        <rect x={SARTEN.x1} y={1170} width={260} height={26} rx={13} fill="#1A1A20" />
        <path d={`M ${SARTEN.x0 - 20} 1140 L ${SARTEN.x0} ${SARTEN.fondo} L ${SARTEN.x1} ${SARTEN.fondo} L ${SARTEN.x1 + 20} 1140 L ${SARTEN.x1 + 6} 1140 L ${SARTEN.x1 - 10} ${SARTEN.fondo - 12} L ${SARTEN.x0 + 10} ${SARTEN.fondo - 12} L ${SARTEN.x0 - 6} 1140 Z`} fill="#3A3A44" />
        <rect x={SARTEN.x0 + 10} y={SARTEN.aceite} width={SARTEN.x1 - SARTEN.x0 - 20} height={SARTEN.fondo - 12 - SARTEN.aceite} fill={ACEITE} opacity={0.9} />
        {/* Gota de agua que cae, se hunde y hierve */}
        {gota > 0 && hierve < 1 ? (
          <ellipse cx={550} cy={gota < 1 ? 900 + (SARTEN.aceite - 900) * gota : SARTEN.aceite + (nivelAgua - SARTEN.aceite) * hunde} rx={24 * (1 - hierve)} ry={20 * (1 - hierve)} fill={AGUA} />
        ) : null}
        {hierve > 0 && lanza < 1
          ? [0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={500 + k * 20} cy={nivelAgua - hierve * (20 + k * 12)} r={6 + 10 * hierve} fill="#E8F4FF" opacity={0.7 * (1 - lanza)} />)
          : null}
        {/* Gotitas de aceite lanzadas que se encienden */}
        {lanza > 0 && t < T.bola - 0.1
          ? GOTAS.map((g, i) => {
              const d = g.v * lanza;
              const enciende = interpolate(t, [T.millones - 0.3, T.millones + 0.4], [0, 1], clamp);
              return <circle key={i} cx={420 + g.x * 260 + Math.cos(g.a) * d * 0.4} cy={SARTEN.aceite + Math.sin(g.a) * d} r={7 + 6 * enciende} fill={enciende > 0.5 ? "#F8883A" : ACEITE} />;
            })
          : null}
        {/* Fuego de la sartén */}
        {[0, 1, 2, 3, 4].map((k) => llama(390 + k * 80, SARTEN.aceite, 150 + 40 * Math.sin(k), 50, t, k, fuegoSarten * (1 - bola)))}
        {/* Bola de fuego hasta el techo */}
        {bola > 0
          ? [0, 1, 2, 3, 4, 5, 6].map((k) => (
              <circle key={k} cx={550 + Math.sin(k * 2.1) * 160 * bola} cy={SARTEN.aceite - 120 - k * 110 * bola} r={(120 + k * 30) * bola} fill={k % 2 === 0 ? "#E8603A" : C.yellow} opacity={0.75} />
            ))
          : null}
        {bola > 0 ? <rect x={-300} y={-400} width={1500} height={2400} fill="#F8A040" opacity={0.18 * bola} /> : null}
        {/* Tapa */}
        {tapa > 0 ? (
          <g transform={`translate(0 ${-260 * (1 - tapa)})`} opacity={tapa}>
            <path d={`M ${SARTEN.x0 - 30} 1140 Q 550 1040 ${SARTEN.x1 + 30} 1140 Z`} fill="#A8A8B8" />
            <rect x={525} y={1056} width={50} height={22} rx={8} fill="#1A1A20" />
          </g>
        ) : null}
        {/* Vaso del gancho */}
        {vierte > 0 ? (
          <g opacity={vierte}>
            <g transform={`translate(760 860) rotate(${-70 * vierte})`}>
              <path d="M -40 -60 L 40 -60 L 30 60 L -30 60 Z" fill="#E8F4FF" fillOpacity={0.25} stroke="#E8F4FF" strokeWidth={4} />
              <rect x={-34} y={-10} width={66} height={60} fill={AGUA} opacity={0.6} />
            </g>
            <path d="M 720 820 Q 640 900 600 1150" fill="none" stroke={AGUA} strokeWidth={14} strokeLinecap="round" opacity={interpolate(t, [0.3, 0.45, 0.8, 0.9], [0, 1, 1, 0], clamp)} />
          </g>
        ) : null}
        <Pildora x={740} y={1000} texto="> 300 °C" color={C.red} o={termo} tam={46} />
        <Pildora x={550} y={1095} texto="vapor × 1.700" color="#E8F4FF" o={vaporX} tam={40} />

        {/* Triángulo del fuego */}
        <g opacity={triangulo}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <line x1={1850} y1={720} x2={1500} y2={1320} stroke={ROJO} strokeWidth={22} strokeLinecap="round" opacity={lado(0)} />
          <line x1={1500} y1={1320} x2={2200} y2={1320} stroke="#C8904A" strokeWidth={22} strokeLinecap="round" opacity={lado(1)} />
          <g transform={`translate(${200 * quita} ${-120 * quita})`} opacity={lado(2) * (1 - quita)}>
            <line x1={2200} y1={1320} x2={1850} y2={720} stroke={C.cyan} strokeWidth={22} strokeLinecap="round" />
          </g>
          <text x={1600} y={960} textAnchor="end" fill={ROJO} fontFamily={mono} fontSize={40} fontWeight={700} opacity={lado(0)}>
            calor
          </text>
          <text x={1850} y={1400} textAnchor="middle" fill="#C8904A" fontFamily={mono} fontSize={40} fontWeight={700} opacity={lado(1)}>
            combustible
          </text>
          <text x={2100} y={960} fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700} opacity={lado(2) * (1 - quita)}>
            oxígeno
          </text>
          {llama(1850, 1250, 300 * fuegoTri, 110, t, 9, fuegoTri)}
        </g>

        {/* Extintor por dentro */}
        <g opacity={ext}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2830} y={760} width={240} height={640} rx={60} fill={ROJO} />
          <rect x={2850} y={800} width={200} height={580} rx={50} fill="#5A1A1A" />
          <rect x={2852} y={960} width={196} height={418} rx={44} fill={POLVO} />
          {/* Gas a presión arriba */}
          {new Array(10).fill(0).map((_, k) => (
            <circle key={k} cx={2870 + (k % 5) * 40 + Math.sin(t * 8 + k) * 4} cy={850 + Math.floor(k / 5) * 50 + Math.cos(t * 7 + k) * 4} r={8} fill={C.cyan} />
          ))}
          {sale > 0 && sale < 1 ? [2890, 2950, 3010].map((x) => <path key={x} d={`M ${x} 930 l 0 30 m -12 -14 l 12 14 l 12 -14`} fill="none" stroke={C.cyan} strokeWidth={5} />) : null}
          {/* Tubo sifón */}
          <rect x={2940} y={740} width={20} height={620} fill="#8A8A9A" />
          {sale > 0 && sale < 1
            ? [0, 1, 2, 3].map((k) => {
                const p = (t * 1.4 + k / 4) % 1;
                return <circle key={k} cx={2950} cy={1340 - p * 600} r={8} fill={POLVO} />;
              })
            : null}
          {/* Cabeza, pasador y palanca */}
          <rect x={2900} y={690} width={100} height={70} rx={14} fill="#2A2A30" />
          <g transform={`rotate(${22 * palanca} 3000 690)`}>
            <rect x={2900} y={660} width={170} height={22} rx={10} fill="#3A3A44" />
          </g>
          <rect x={2890} y={630} width={130} height={20} rx={10} fill="#3A3A44" />
          <g transform={`translate(${-160 * pasador} ${-40 * pasador})`} opacity={1 - pasador * 0.6}>
            <circle cx={2880} cy={715} r={22} fill="none" stroke={C.yellow} strokeWidth={6} />
            <line x1={2902} y1={715} x2={2960} y2={715} stroke={C.yellow} strokeWidth={6} />
          </g>
          {/* Manguera y nube de polvo */}
          <path d="M 3000 730 C 3150 730, 3200 850, 3220 1000" fill="none" stroke="#1A1A20" strokeWidth={22} strokeLinecap="round" />
          {nube > 0
            ? new Array(12).fill(0).map((_, k) => (
                <circle key={k} cx={3220 + (k % 4) * 50 * nube + 20} cy={1010 + Math.floor(k / 4) * 70 * nube + (k % 4) * 30 * nube} r={20 + 28 * nube} fill={POLVO} opacity={0.75} />
              ))
            : null}
          <rect x={3330} y={1370} width={180} height={20} rx={6} fill="#5A4A30" />
          {llama(3420, 1370, 160 * fuegoExt, 70, t, 30, fuegoExt)}
        </g>
      </g>

      <Tag x={sx(2950)} y={sy(1150)} dx={-150} dy={-180} texto="polvo químico" color={POLVO} o={ventana(T.polvo, T.pasador)} />
      <Tag x={sx(2950)} y={sy(870)} dx={-170} dy={-190} texto="gas a presión" color={C.cyan} o={ventana(T.gas, T.palanca + 0.6)} />
      <Tag x={sx(2880)} y={sy(715)} dx={-80} dy={-140} texto="pasador" color={C.yellow} o={ventana(T.pasador - 0.2, T.empuja)} />
      <Tag x={sx(2950)} y={sy(1300)} dx={-170} dy={150} texto="tubo" color="#C8C8D8" o={ventana(T.empuja, T.cubre)} />
      <Tag x={sx(550)} y={sy(SARTEN.aceite + 20)} dx={-160} dy={200} texto="aceite" color={ACEITE} o={ventana(T.aceite, T.hunde)} />
      <Tag x={sx(550)} y={sy(nivelAgua)} dx={200} dy={150} texto="agua al fondo" color={AGUA} o={ventana(T.hunde + 0.4, T.vapor)} />
    </svg>
  );
};
