import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un lavabo con el tubo de pasta tumbado, una mano que lo aprieta y un cepillo;
// a la derecha, la fábrica donde el tubo se llena boca abajo con tres pastas a la vez y se sella.
const ENCIMERA = 1250;
const R = 72;
const CY = ENCIMERA - R;
const X0 = 150;
const X1 = 720;
const PUNTA = 846;
const ROJO = "#E8414F";
const BLANCO = "#F4F2F8";
const AZUL = "#2E8AE8";
const PIEL = "#C98A64";
const PIEL_OSCURA = "#A86A48";
const MANGA = "#3E6E8E";
const FAB = { x: 1700, arriba: 700, abajo: 1180, r: 70 };

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 590, 1150, 1.3],
  [T.parece - 0.3, 590, 1150, 1.32],
  [T.parece + 0.6, 470, 1178, 1.8],
  [T.secreto - 0.3, 470, 1178, 1.82],
  [T.secreto + 0.7, FAB.x, 880, 1.15],
  [T.porQue - 0.3, FAB.x, 880, 1.17],
  [T.porQue + 0.7, 620, 1150, 1.25],
  [T.colorantes - 0.3, 620, 1150, 1.27],
  [T.colorantes + 0.6, 420, CY - 24, 4.0],
  [T.segunda - 0.3, 420, CY - 24, 4.05],
  [T.segunda + 0.6, 520, CY, 1.6],
  [T.cadaFranja - 0.3, 520, CY, 1.62],
  [T.cadaFranja + 0.5, 880, CY + 6, 2.6],
  [T.truco - 0.3, 880, CY + 6, 2.65],
  [T.truco + 0.6, 800, CY, 4.6],
  [T.color - 0.3, 800, CY, 4.65],
  [T.color + 0.6, 620, 1150, 1.25],
  [T.final - 0.3, 620, 1150, 1.27],
  [T.final + 0.5, 590, 1150, 1.35],
  [T.fin, 590, 1150, 1.38],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

// Contorno del tubo tumbado (cuerpo, hombro y cuello hasta la punta), aplastado `aplasta` px arriba
const contornoTubo = (aplasta: number) =>
  `M ${X0} ${CY - R + aplasta} L ${X1} ${CY - R + aplasta * 0.4} C ${X1 + 40} ${CY - R + 6}, ${X1 + 56} ${CY - 26}, ${X1 + 66} ${CY - 20} ` +
  `L ${PUNTA} ${CY - 18} L ${PUNTA} ${CY + 18} L ${X1 + 66} ${CY + 20} C ${X1 + 56} ${CY + 26}, ${X1 + 40} ${CY + R - 6}, ${X1} ${CY + R} L ${X0} ${CY + R} Z`;

// Mano que aprieta: antebrazo con manga (puño oscuro, luz, pliegue), palma, cuatro dedos y pulgar
const Mano: React.FC<{ readonly x: number; readonly baja: number }> = ({ x, baja }) => {
  const y = CY - R - 8 + baja;
  return (
    <g>
      {/* Antebrazo y manga */}
      <path d={`M ${x - 330} ${y - 420} L ${x - 70} ${y - 40}`} stroke={MANGA} strokeWidth={84} strokeLinecap="round" />
      <path d={`M ${x - 300} ${y - 400} L ${x - 140} ${y - 160}`} stroke="#6898B8" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
      <path d={`M ${x - 230} ${y - 250} q 26 -6 40 14 M ${x - 200} ${y - 210} q 22 -4 34 12`} fill="none" stroke="#2A4C64" strokeWidth={4} strokeLinecap="round" />
      <path d={`M ${x - 108} ${y - 96} L ${x - 66} ${y - 34}`} stroke="#2A4C64" strokeWidth={86} strokeLinecap="butt" />
      {/* Palma sobre el tubo */}
      <path d={`M ${x - 80} ${y - 30} C ${x - 60} ${y - 62}, ${x + 40} ${y - 60}, ${x + 70} ${y - 26} C ${x + 76} ${y - 6}, ${x + 60} ${y + 8}, ${x + 30} ${y + 8} L ${x - 60} ${y + 8} C ${x - 84} ${y + 4}, ${x - 90} ${y - 14}, ${x - 80} ${y - 30} Z`} fill={PIEL} />
      {/* Cuatro dedos que rodean el tubo por delante */}
      {[0, 1, 2, 3].map((i) => {
        const bx = x + 14 + i * 18;
        const by = y - 30 + i * 6;
        return (
          <g key={i}>
            <path d={`M ${bx} ${by} C ${bx + 22} ${by - 2}, ${bx + 34} ${by + 26}, ${bx + 30} ${by + 56 + i * 4}`} fill="none" stroke={i % 2 === 0 ? PIEL : "#B87A56"} strokeWidth={17} strokeLinecap="round" />
            <path d={`M ${bx + 22} ${by + 8} q 7 4 8 12`} fill="none" stroke={PIEL_OSCURA} strokeWidth={2.5} strokeLinecap="round" />
          </g>
        );
      })}
      {/* Pulgar por el lado de acá */}
      <path d={`M ${x - 50} ${y + 2} C ${x - 64} ${y + 30}, ${x - 52} ${y + 56}, ${x - 30} ${y + 64}`} fill="none" stroke={PIEL} strokeWidth={24} strokeLinecap="round" />
      <path d={`M ${x - 34} ${y + 56} q 6 6 2 12`} fill="none" stroke={PIEL_OSCURA} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};

// Tira de pasta a rayas que sale de la boquilla (longitud `largo`)
const Tira: React.FC<{ readonly largo: number }> = ({ largo }) => {
  if (largo <= 1) {
    return null;
  }
  const n = Math.max(2, Math.round(largo / 6));
  const camino = (dy: number) =>
    new Array(n + 1)
      .fill(0)
      .map((_, i) => {
        const u = (largo * i) / n;
        return `${i === 0 ? "M" : "L"} ${PUNTA + u} ${CY + 4 + dy + Math.sin(u / 22) * 4 + Math.min(1, u / 50) * 2}`;
      })
      .join(" ");
  return (
    <g>
      <path d={camino(0)} fill="none" stroke={BLANCO} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={camino(-11)} fill="none" stroke={ROJO} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <path d={camino(11)} fill="none" stroke={AZUL} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

const PARTICULAS = new Array(60).fill(0).map((_, i) => ({ u: random(`pa${i}`), v: random(`pv${i}`), f: random(`pf${i}`) * 6 }));

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

export const Tubo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Apretones: la mano baja y la tira crece
  const apreton = (a: number, b: number) => interpolate(t, [a, a + 0.25, b - 0.25, b], [0, 1, 1, 0], clamp) * (0.6 + 0.4 * Math.abs(Math.sin((t - a) * 5)));
  const aprieta = Math.max(apreton(-0.2, 1.6), apreton(1.8, 3.6), apreton(T.empujas - 0.3, T.empujas + 0.9), apreton(T.apretar - 0.1, T.capas + 0.6), apreton(T.cadaFranja - 0.2, T.cadaFranja + 1.4));
  const manoX = interpolate(t, [1.6, 1.9], [380, 560], clamp);
  const mano = ventana(-1, T.parece + 0.2, 0.4, 0.5) + ventana(T.porQue + 0.4, T.colorantes, 0.4, 0.4) + ventana(T.segunda, T.truco, 0.4, 0.4) + ventana(T.color + 0.2, T.fin + 1, 0.4, 0.4);
  const largo =
    interpolate(t, [0, 3.6], [50, 120], clamp) +
    interpolate(t, [T.empujas - 0.3, T.empujas + 0.9], [0, 20], clamp) +
    interpolate(t, [T.apretar, T.capas + 0.6], [0, 20], clamp) +
    interpolate(t, [T.cadaFranja, T.cadaFranja + 1.4], [0, 30], clamp);

  // Rayos X del tubo: tres franjas juntas; separadores que no existen
  const rayos = Math.max(ventana(T.parece - 0.2, T.secreto), ventana(T.colorantes - 0.4, T.color + 0.3));
  const separadores = ventana(T.compartimentos - 0.2, T.juntas + 0.4);
  const tacha = interpolate(t, [T.peroNo, T.peroNo + 0.3], [0, 1], clamp);
  const toca = ventana(T.tocandose - 0.2, T.secreto);
  const difusion = ventana(T.colorantes - 0.2, T.segunda + 0.2);
  const flujo = ventana(T.apretar - 0.2, T.truco);
  const truco = ventana(T.tubito - 0.6, T.color + 0.2);

  // Fábrica: llenado boca abajo y sellado
  const fabrica = ventana(T.secreto - 0.5, T.porQue + 0.5, 0.6, 0.6);
  const llenado = interpolate(t, [T.inyecta - 0.4, T.franjas + 1.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const mordaza = interpolate(t, [T.sella - 0.1, T.sella + 0.4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const sellado = t > T.sella + 0.4 ? 1 : 0;

  // Etiquetas
  const tagSeparador = ventana(T.compartimentos, T.juntas);
  const tagToca = ventana(T.tocandose, T.secreto);
  const tagAbierto = ventana(T.abierto - 0.2, T.inyecta);
  const tagBoquilla = ventana(T.boquilla, T.sella);
  const tagSellado = ventana(T.sella + 0.2, T.porQue + 0.2);
  const tagColorante = ventana(T.colorantes + 0.4, T.segunda);
  const tagCapas = ventana(T.capas, T.cadaFranja);
  const tagTubito = ventana(T.tubito + 0.3, T.color);
  const tagAgujeros = ventana(T.agujeritos, T.color);

  const nivel = FAB.abajo - (FAB.abajo - FAB.arriba) * llenado;
  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Franjas dentro del tubo tumbado (se estrechan en el cuello)
  const franjas = (
    <g>
      <path d={`M ${X0} ${CY - R} L ${X1} ${CY - R} C ${X1 + 40} ${CY - R + 6}, ${X1 + 56} ${CY - 26}, ${X1 + 66} ${CY - 20} L ${PUNTA} ${CY - 18} L ${PUNTA} ${CY - 6} L ${X1 + 66} ${CY - 7} C ${X1 + 30} ${CY - 12}, ${X1 + 10} ${CY - 24}, ${X1} ${CY - 24} L ${X0} ${CY - 24} Z`} fill={ROJO} />
      <path d={`M ${X0} ${CY - 24} L ${X1} ${CY - 24} C ${X1 + 10} ${CY - 24}, ${X1 + 30} ${CY - 12}, ${X1 + 66} ${CY - 7} L ${PUNTA} ${CY - 6} L ${PUNTA} ${CY + 6} L ${X1 + 66} ${CY + 7} C ${X1 + 30} ${CY + 12}, ${X1 + 10} ${CY + 24}, ${X1} ${CY + 24} L ${X0} ${CY + 24} Z`} fill={BLANCO} />
      <path d={`M ${X0} ${CY + 24} L ${X1} ${CY + 24} C ${X1 + 10} ${CY + 24}, ${X1 + 30} ${CY + 12}, ${X1 + 66} ${CY + 7} L ${PUNTA} ${CY + 6} L ${PUNTA} ${CY + 18} L ${X1 + 66} ${CY + 20} C ${X1 + 56} ${CY + 26}, ${X1 + 40} ${CY + R - 6}, ${X1} ${CY + R} L ${X0} ${CY + R} Z`} fill={AZUL} />
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="tubo-ps">
          <path d={contornoTubo(0)} />
        </clipPath>
        <clipPath id="fab-ps">
          <rect x={FAB.x - FAB.r} y={FAB.arriba} width={FAB.r * 2} height={FAB.abajo - FAB.arriba} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        {/* Baño: azulejos */}
        <rect x={-600} y={200} width={1900} height={1100} fill="#1E2A44" />
        {new Array(12).fill(0).map((_, f) =>
          new Array(16).fill(0).map((__, c) => <rect key={`${f}-${c}`} x={-590 + c * 120} y={210 + f * 90} width={112} height={82} rx={6} fill="#24324E" />),
        )}
        {/* Fábrica: pared y depósitos */}
        <rect x={1300} y={200} width={900} height={1100} fill="#221C38" />
        {[
          [1460, ROJO],
          [1700, BLANCO],
          [1940, AZUL],
        ].map(([x, color], i) => (
          <g key={i}>
            <rect x={(x as number) - 70} y={260} width={140} height={170} rx={20} fill="#3A3458" />
            <rect x={(x as number) - 56} y={300} width={112} height={116} rx={12} fill={color as string} opacity={0.85} />
            <path d={`M ${x} 430 L ${x} 470 Q ${x} 500 ${FAB.x + (i - 1) * 30} 520 L ${FAB.x + (i - 1) * 30} 540`} fill="none" stroke={color as string} strokeWidth={12} />
          </g>
        ))}
        <rect x={FAB.x - 80} y={540} width={160} height={70} rx={12} fill="#6A7080" />
        {/* Agujas de llenado que suben con el nivel */}
        {fabrica > 0
          ? [-1, 0, 1].map((k) => (
              <line key={k} x1={FAB.x + k * 40} y1={610} x2={FAB.x + k * 40} y2={Math.max(610, nivel - 6)} stroke={k === -1 ? ROJO : k === 0 ? "#C8C4D8" : AZUL} strokeWidth={10} />
            ))
          : null}
        {/* Tubo boca abajo: tapón abajo, fondo abierto arriba */}
        <rect x={FAB.x - FAB.r - 4} y={FAB.arriba} width={FAB.r * 2 + 8} height={FAB.abajo - FAB.arriba} fill="rgba(255,255,255,0.12)" stroke="#C8C4D8" strokeWidth={4} />
        <path d={`M ${FAB.x - FAB.r} ${FAB.abajo} L ${FAB.x - 20} ${FAB.abajo + 34} L ${FAB.x - 20} ${FAB.abajo + 54} L ${FAB.x + 20} ${FAB.abajo + 54} L ${FAB.x + 20} ${FAB.abajo + 34} L ${FAB.x + FAB.r} ${FAB.abajo} Z`} fill="#C8C4D8" />
        <rect x={FAB.x - 34} y={FAB.abajo + 50} width={68} height={20} rx={4} fill="#8A84A8" />
        <g clipPath="url(#fab-ps)">
          <rect x={FAB.x - FAB.r} y={nivel} width={FAB.r * 0.66} height={FAB.abajo - nivel} fill={ROJO} />
          <rect x={FAB.x - FAB.r * 0.34} y={nivel} width={FAB.r * 0.68} height={FAB.abajo - nivel} fill={BLANCO} />
          <rect x={FAB.x + FAB.r * 0.34} y={nivel} width={FAB.r * 0.66} height={FAB.abajo - nivel} fill={AZUL} />
        </g>
        {/* Mordazas de sellado */}
        <rect x={FAB.x - FAB.r - 70 + 66 * mordaza} y={FAB.arriba - 30} width={60} height={60} rx={6} fill="#8A8A9A" opacity={0.3 + 0.7 * fabrica} />
        <rect x={FAB.x + FAB.r + 10 - 66 * mordaza} y={FAB.arriba - 30} width={60} height={60} rx={6} fill="#8A8A9A" opacity={0.3 + 0.7 * fabrica} />
        {sellado ? (
          <g>
            <rect x={FAB.x - FAB.r - 4} y={FAB.arriba - 24} width={FAB.r * 2 + 8} height={26} fill="#C8C4D8" />
            {new Array(10).fill(0).map((_, i) => (
              <line key={i} x1={FAB.x - FAB.r + 6 + i * 14} y1={FAB.arriba - 22} x2={FAB.x - FAB.r + 6 + i * 14} y2={FAB.arriba} stroke="#8A84A8" strokeWidth={3} />
            ))}
          </g>
        ) : null}
        <rect x={1300} y={ENCIMERA + 30} width={900} height={1100} fill="#1A1530" />
        {/* Cinta transportadora */}
        <rect x={1300} y={ENCIMERA} width={900} height={40} fill="#3A3458" />
        {new Array(12).fill(0).map((_, i) => (
          <circle key={i} cx={1330 + i * 76} cy={ENCIMERA + 20} r={14} fill="#5A5478" />
        ))}

        {/* Encimera del lavabo */}
        <rect x={-600} y={ENCIMERA} width={1900} height={30} fill="#D8D4E4" />
        <rect x={-600} y={ENCIMERA + 30} width={1900} height={900} fill="#8A84A8" />
        <rect x={-600} y={ENCIMERA + 30} width={1900} height={10} fill="#6A6488" />
        <rect x={-600} y={ENCIMERA + 290} width={2800} height={900} fill="#16122A" />

        {/* Cepillo de dientes */}
        <rect x={1040} y={ENCIMERA - 14} width={380} height={14} rx={7} fill="#48A8C8" />
        <path d={`M 880 ${ENCIMERA - 22} L 1046 ${ENCIMERA - 22} L 1046 ${ENCIMERA - 6} L 880 ${ENCIMERA - 6} Z`} fill="#48A8C8" />
        {new Array(8).fill(0).map((_, i) => (
          <rect key={i} x={886 + i * 20} y={ENCIMERA - 58} width={14} height={36} rx={3} fill={i % 2 === 0 ? "#E8E6F0" : "#9AD8E8"} />
        ))}

        {/* Tubo de pasta */}
        <path d={contornoTubo(10 * aprieta * (mano > 0 ? 1 : 0))} fill="#E8E6F0" />
        <rect x={X0 + 140} y={CY - R + 14} width={330} height={R * 2 - 28} rx={10} fill="#2E6AB8" />
        <text x={X0 + 305} y={CY + 6} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={40} fontWeight={700}>
          DENTI
        </text>
        <path d={`M ${X0 + 140} ${CY + 24} L ${X0 + 470} ${CY + 24}`} stroke={ROJO} strokeWidth={6} />
        <path d={`M ${X0 + 140} ${CY + 34} L ${X0 + 470} ${CY + 34}`} stroke="#FFFFFF" strokeWidth={4} />
        <rect x={X0 - 16} y={CY - R - 4} width={24} height={R * 2 + 8} fill="#C8C4D8" />
        {new Array(8).fill(0).map((_, i) => (
          <line key={i} x1={X0 - 14} y1={CY - R + 6 + i * 19} x2={X0 + 6} y2={CY - R + 6 + i * 19} stroke="#8A84A8" strokeWidth={3} />
        ))}
        <path d={`M ${X0 + 10} ${CY - R + 10} L ${X1 - 10} ${CY - R + 10}`} stroke="#FFFFFF" strokeWidth={6} opacity={0.6} />

        {/* Rayos X: dentro del tubo */}
        {rayos > 0 ? (
          <g opacity={rayos}>
            <g clipPath="url(#tubo-ps)">
              <rect x={X0 - 20} y={CY - R - 20} width={PUNTA - X0 + 40} height={2 * R + 40} fill="#0A0818" />
              {franjas}
              {/* Truco antiguo: tubo blanco y la pasta de color alrededor del tubito del cuello */}
              {truco > 0 ? (
                <g opacity={truco}>
                  <rect x={X0} y={CY - R} width={X1 - X0 - 10} height={2 * R} fill={BLANCO} />
                  <path d={`M ${X1 - 10} ${CY - R} L ${X1} ${CY - R} C ${X1 + 40} ${CY - R + 6}, ${X1 + 56} ${CY - 26}, ${X1 + 66} ${CY - 20} L ${PUNTA} ${CY - 18} L ${PUNTA} ${CY + 18} L ${X1 + 66} ${CY + 20} C ${X1 + 56} ${CY + 26}, ${X1 + 40} ${CY + R - 6}, ${X1} ${CY + R} L ${X1 - 10} ${CY + R} Z`} fill={ROJO} />
                  <rect x={X1 - 20} y={CY - 8} width={PUNTA - X1 + 20} height={16} fill={BLANCO} stroke="#8A84A8" strokeWidth={2} />
                  {[0, 1, 2, 3, 4].map((k) => (
                    <g key={k}>
                      <circle cx={X1 + 20 + k * 22} cy={CY - 8} r={3} fill={ROJO} />
                      <circle cx={X1 + 20 + k * 22} cy={CY + 8} r={3} fill={ROJO} />
                      <path d={`M ${X1 + 20 + k * 22} ${CY - 8} q 6 4 12 6`} stroke={ROJO} strokeWidth={2} fill="none" opacity={0.6 + 0.4 * Math.sin(t * 6 + k)} />
                    </g>
                  ))}
                </g>
              ) : null}
              {/* Separadores imaginarios */}
              {separadores > 0 ? (
                <g opacity={separadores}>
                  <line x1={X0} y1={CY - 24} x2={X1} y2={CY - 24} stroke={C.yellow} strokeWidth={5} strokeDasharray="14 10" />
                  <line x1={X0} y1={CY + 24} x2={X1} y2={CY + 24} stroke={C.yellow} strokeWidth={5} strokeDasharray="14 10" />
                </g>
              ) : null}
              {/* Las franjas se tocan */}
              {toca > 0 ? (
                <g opacity={toca * (0.6 + 0.4 * Math.sin(t * 5))}>
                  <line x1={X0} y1={CY - 24} x2={X1} y2={CY - 24} stroke={C.cyan} strokeWidth={3} />
                  <line x1={X0} y1={CY + 24} x2={X1} y2={CY + 24} stroke={C.cyan} strokeWidth={3} />
                </g>
              ) : null}
              {/* Difusión: el colorante apenas se mueve en su franja */}
              {difusion > 0
                ? PARTICULAS.map((p, i) => {
                    const franja = i % 3;
                    if (franja === 1) {
                      return null;
                    }
                    const yBase = franja === 0 ? CY - 72 + p.v * 44 : CY + 28 + p.v * 44;
                    return (
                      <circle
                        key={i}
                        cx={340 + p.u * 160 + Math.sin(t * 7 + p.f) * 1.5}
                        cy={yBase + Math.cos(t * 6 + p.f) * 1.5}
                        r={2.2}
                        fill={franja === 0 ? "#FF9AA4" : "#9ACCFF"}
                        opacity={difusion}
                      />
                    );
                  })
                : null}
              {/* Flujo laminar: capas que avanzan, más rápido en el centro */}
              {flujo > 0
                ? [-56, -40, -12, 0, 12, 40, 56].map((dy, i) => {
                    const v = 1 - (dy / R) ** 2;
                    return (
                      <line
                        key={i}
                        x1={X0}
                        y1={CY + dy}
                        x2={X1}
                        y2={CY + dy}
                        stroke="#0A0818"
                        strokeWidth={3}
                        strokeDasharray="18 22"
                        strokeDashoffset={-t * 90 * v}
                        opacity={0.55 * flujo}
                      />
                    );
                  })
                : null}
            </g>
            {flujo > 0
              ? [-50, -25, 0, 25, 50].map((dy, i) => {
                  const v = 1 - (dy / (R + 6)) ** 2;
                  return <path key={i} d={`M ${460} ${CY + dy} l ${70 * v} 0 m -12 -8 l 12 8 l -12 8`} fill="none" stroke={C.yellow} strokeWidth={4} opacity={flujo} />;
                })
              : null}
            {separadores > 0 ? (
              <g opacity={tacha * separadores} transform={`translate(${(X0 + X1) / 2} ${CY})`}>
                <line x1={-50} y1={-50} x2={50} y2={50} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
                <line x1={50} y1={-50} x2={-50} y2={50} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
              </g>
            ) : null}
          </g>
        ) : null}

        {/* Tira de pasta a rayas sobre el cepillo */}
        <Tira largo={largo} />

        {/* Mano */}
        {mano > 0 ? (
          <g opacity={Math.min(1, mano)}>
            <Mano x={manoX} baja={10 * aprieta} />
          </g>
        ) : null}
      </g>

      <Tag x={sx((X0 + X1) / 2)} y={sy(CY - 24)} dx={80} dy={-170} texto="¿separadores?" color={C.yellow} o={tagSeparador} />
      <Tag x={sx(X0 + 120)} y={sy(CY + 24)} dx={60} dy={200} texto="se tocan" color={C.cyan} o={tagToca} />
      <Tag x={sx(FAB.x - FAB.r)} y={sy(FAB.arriba)} dx={-180} dy={-80} texto="fondo abierto" color={C.white} o={tagAbierto} />
      <Tag x={sx(FAB.x + 40)} y={sy(575)} dx={180} dy={-60} texto="boquilla" color={C.yellow} o={tagBoquilla} />
      <Tag x={sx(FAB.x + FAB.r)} y={sy(FAB.arriba - 12)} dx={200} dy={-40} texto="sellado" color={C.white} o={tagSellado} />
      <Tag x={sx(420)} y={sy(CY - 50)} dx={0} dy={-260} texto="colorante" color={ROJO} o={tagColorante} />
      <Tag x={sx(600)} y={sy(CY - 40)} dx={0} dy={-230} texto="capas" color={C.yellow} o={tagCapas} />
      <Tag x={sx(PUNTA - 30)} y={sy(CY)} dx={40} dy={260} texto="tubito" color={C.white} o={tagTubito} />
      <Tag x={sx(X1 + 64)} y={sy(CY - 8)} dx={-40} dy={-260} texto="agujeritos" color={ROJO} o={tagAgujeros} />
    </svg>
  );
};
