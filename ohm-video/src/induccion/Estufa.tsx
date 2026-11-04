import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una placa de inducción en corte lateral (sartén hirviendo, cubito de hielo sobre el vidrio
// y la bobina bajo el vidrio); en el centro, el corte ampliado (bobina → campo → vidrio → fondo de la sartén);
// a la derecha, la prueba del imán con una olla de hierro y otra de aluminio.
const B = { x0: 1340, x1: 2360, y0: 560, y1: 1560, aguaY: 620, base0: 740, base1: 880, vidrio1: 940, bobinaY: 1080, ferritaY: 1150 };
const OLLA_H = 2700;
const OLLA_A = 3150;
const COBRE = "#E8A040";
const VERDE = "#48C878";
const ACERO = "#8A8A9A";
const CALIENTE = "#E8603A";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 545, 1070, 1.4],
  [T.parece - 0.3, 545, 1070, 1.46],
  [T.parece + 0.5, 560, 1250, 1.6],
  [T.corriente - 0.3, 560, 1250, 1.62],
  [T.corriente + 0.6, 1850, 1060, 0.95],
  [T.metal - 0.3, 1850, 1060, 0.97],
  [T.metal + 0.4, 1850, 820, 1.45],
  [T.calor - 0.3, 1850, 820, 1.47],
  [T.calor + 0.4, 1850, 1060, 0.95],
  [T.vidrioNo - 0.3, 1850, 1060, 0.97],
  [T.vidrioNo + 0.4, 1850, 930, 1.3],
  [T.noToques - 0.3, 1850, 930, 1.32],
  [T.noToques + 0.4, 560, 1150, 1.3],
  [T.ollas - 0.2, 560, 1150, 1.32],
  [T.ollas + 0.5, 3030, 1100, 1.2],
  [T.final + 0.1, 3030, 1100, 1.22],
  [T.final + 0.9, 545, 1070, 1.4],
  [T.fin, 545, 1070, 1.46],
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

// Mezcla de dos colores hex
const mezcla = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * p));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

const BURBUJAS = new Array(18).fill(0).map((_, i) => ({ x: random(`bx${i}`), f: random(`bf${i}`), r: 5 + random(`br${i}`) * 7 }));
const ELECTRONES_VIDRIO = new Array(16).fill(0).map((_, i) => ({ x: B.x0 + 80 + random(`ev${i}`) * (B.x1 - B.x0 - 160), y: B.base1 + 14 + random(`ey${i}`) * 32, f: random(`ef${i}`) * 6 }));

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

// Imán de herradura con las puntas hacia la derecha en (0, 0)
const Iman: React.FC<{ readonly x: number; readonly y: number; readonly giro: number }> = ({ x, y, giro }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro})`}>
    <path d="M -6 -30 L -50 -30 A 30 30 0 0 0 -50 30 L -6 30" fill="none" stroke="#D83A3A" strokeWidth={24} />
    <rect x={-18} y={-42} width={18} height={24} fill="#D8D8E0" />
    <rect x={-18} y={18} width={18} height={24} fill="#D8D8E0" />
  </g>
);

// Olla vista de frente
const Olla: React.FC<{ readonly x0: number; readonly color: string; readonly borde: string; readonly nombre: string }> = ({ x0, color, borde, nombre }) => (
  <g>
    <rect x={x0 - 52} y={1040} width={60} height={22} rx={11} fill={borde} />
    <rect x={x0 + 292} y={1040} width={60} height={22} rx={11} fill={borde} />
    <rect x={x0} y={1010} width={300} height={240} rx={16} fill={color} />
    <rect x={x0 + 24} y={1030} width={18} height={190} rx={9} fill="#FFFFFF" opacity={0.12} />
    <rect x={x0 - 14} y={994} width={328} height={24} rx={12} fill={borde} />
    <text x={x0 + 150} y={940} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
      {nombre}
    </text>
  </g>
);

export const Estufa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Corriente alterna (ralentizada para que se vea): fase y desplazamiento de vaivén
  const w = 2 * Math.PI * 0.9;
  const fase = Math.sin(w * t);
  const vaiven = 1 - Math.cos(w * t);
  const hayCorriente = interpolate(t, [T.corriente - 0.2, T.corriente + 0.4], [0, 1], clamp);

  // Placa (A)
  const fantasma = ventana(T.parece, T.bobina - 0.2);
  const tacha = interpolate(t, [T.peroNo, T.peroNo + 0.3], [0, 1], clamp) * fantasma;
  const rayosX = interpolate(t, [T.peroNo + 0.3, T.bobina], [0, 1], clamp);
  const levanta = ventana(T.noToques - 0.3, T.ollas + 0.3, 0.6, 0.6) * 130;
  const tibio = ventana(T.noToques - 0.2, T.ollas + 0.3, 0.6, 0.6);
  const campoA = interpolate(t, [T.campo, T.campo + 0.6], [0, 1], clamp);

  // Corte ampliado (B)
  const corte = ventana(T.corriente - 0.4, T.noToques + 0.3, 0.6, 0.6);
  const subeCampo = interpolate(t, [T.campo, T.sarten + 0.6], [B.y1, B.y0], clamp);
  const campoO = interpolate(t, [T.campo - 0.1, T.campo + 0.3], [0, 1], clamp);
  const remolinos = interpolate(t, [T.metal, T.metal + 0.5], [0, 1], clamp);
  const calor = interpolate(t, [T.resiste, T.calor + 1.0], [0, 1], clamp);
  const vidrioFoco = ventana(T.vidrioNo, T.noToques);
  const contacto = interpolate(t, [T.entibia, T.entibia + 0.8], [0, 1], clamp);

  // Prueba del imán (C)
  const imanH = interpolate(t, [T.iman - 0.4, T.iman + 0.1], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const imanA = interpolate(t, [T.iman + 0.2, T.iman + 0.6], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const caeA = interpolate(t, [T.iman + 0.8, T.sirve], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const marcas = interpolate(t, [T.sirve - 0.3, T.sirve], [0, 1], clamp);

  // Etiquetas del mundo
  const tagCien = ventana(-1, T.parece - 0.2) + ventana(T.final + 0.8, T.fin + 2);
  const tagFrio = ventana(-1, T.parece - 0.2) + ventana(T.final + 0.8, T.fin + 2);
  const tagBobina = ventana(T.bobina, T.corriente);
  const tagBobinaB = ventana(T.corriente + 0.5, T.campo);
  const tagVidrio = ventana(T.atraviesa, T.sarten + 0.6);
  const tagSarten = ventana(T.sarten, T.metal);
  const tagRemolinos = ventana(T.remolinos, T.calor);
  const tagSinRemolinos = ventana(T.atraviesa2, T.entibia + 0.2);
  const tagTibio = ventana(T.noToques + 0.4, T.ollas);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const colorBase = mezcla(ACERO, CALIENTE, calor);

  // Sartén en corte (A), con desplazamiento vertical al levantarla
  const sarten = (dy: number) => (
    <g transform={`translate(0 ${-dy})`}>
      <rect x={815} y={968} width={270} height={28} rx={14} fill="#1A1A20" />
      <path d="M 285 960 L 305 1180 L 795 1180 L 815 960 Z" fill="#3A3A44" />
      <path d="M 301 960 L 318 1150 L 782 1150 L 799 960 Z" fill="#1A1A22" />
      <path d={`M 305 1000 ${new Array(13).fill(0).map((_, i) => `L ${305 + i * 40} ${1000 + Math.sin(t * 9 + i * 1.7) * 4}`).join(" ")} L 795 1000 L 782 1150 L 318 1150 Z`} fill="#6AC8E8" opacity={0.85} />
      {BURBUJAS.map((b, i) => {
        const p = (t * 0.9 + b.f) % 1;
        return <circle key={i} cx={330 + b.x * 440 + Math.sin(t * 5 + i) * 6} cy={1145 - p * 140} r={b.r * (0.6 + 0.4 * p)} fill="none" stroke="#E8F8FF" strokeWidth={3} opacity={0.8 * (1 - p * 0.6)} />;
      })}
      <rect x={305} y={1150} width={490} height={30} fill="#E8603A" opacity={0.85} />
      <rect x={278} y={950} width={544} height={16} rx={8} fill="#4A4A55" />
    </g>
  );

  // Líneas de campo alrededor de cada mitad de la bobina (corte ampliado)
  const lineasCampo = (centroX: number, sentido: number) =>
    [0, 1, 2].map((k) => (
      <ellipse
        key={k}
        cx={centroX}
        cy={B.bobinaY - 40}
        rx={150 + k * 60}
        ry={300 + k * 70}
        fill="none"
        stroke={C.cyan}
        strokeWidth={5}
        strokeDasharray="22 16"
        strokeDashoffset={sentido * vaiven * 40}
        opacity={0.35 + 0.55 * Math.abs(fase)}
      />
    ));

  // Remolino de electrones en el fondo de la sartén
  const remolino = (centroX: number, sentido: number) => (
    <g opacity={remolinos}>
      <ellipse cx={centroX} cy={(B.base0 + B.base1) / 2} rx={150} ry={42} fill="none" stroke={C.yellow} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-sentido * vaiven * 50} />
      {new Array(7).fill(0).map((_, k) => {
        const a = (k / 7) * Math.PI * 2 + sentido * vaiven * 1.4;
        return <circle key={k} cx={centroX + Math.cos(a) * 150} cy={(B.base0 + B.base1) / 2 + Math.sin(a) * 42} r={9} fill={C.yellow} />;
      })}
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Cocina */}
        <rect x={-300} y={300} width={1550} height={1500} fill="#2A2440" />
        {new Array(10).fill(0).map((_, f) =>
          new Array(13).fill(0).map((__, c) => <rect key={`${f}-${c}`} x={-290 + c * 120} y={310 + f * 88} width={112} height={80} rx={6} fill="#322B4C" />),
        )}
        {/* Encimera y mueble */}
        <rect x={-300} y={1180} width={450} height={30} fill="#C8B89A" />
        <rect x={950} y={1180} width={300} height={30} fill="#C8B89A" />
        <rect x={-300} y={1210} width={1550} height={600} fill="#4A3E62" />
        {/* Cuerpo de la placa (se vuelve transparente: rayos X) */}
        <rect x={170} y={1204} width={760} height={230} rx={10} fill="#16141F" />
        <g opacity={0.25 + 0.75 * rayosX}>
          {new Array(12).fill(0).map((_, k) => {
            const x = k < 6 ? 340 + k * 38 : 572 + (k - 6) * 38;
            const s = (k < 6 ? 1 : -1) * (fase >= 0 ? 1 : -1);
            return (
              <g key={k}>
                <circle cx={x} cy={1240} r={15} fill={COBRE} opacity={0.75 + 0.25 * hayCorriente * Math.abs(fase)} />
                {hayCorriente > 0 ? (s > 0 ? <circle cx={x} cy={1240} r={4} fill="#1A1430" /> : <path d={`M ${x - 6} ${1234} L ${x + 6} ${1246} M ${x + 6} ${1234} L ${x - 6} ${1246}`} stroke="#1A1430" strokeWidth={3} />) : null}
              </g>
            );
          })}
          <rect x={330} y={1268} width={440} height={14} rx={4} fill="#5A5A66" />
          <rect x={390} y={1320} width={320} height={80} rx={10} fill="#2A2A40" stroke="#4A4670" strokeWidth={3} />
          <path d={`M 410 1360 ${new Array(29).fill(0).map((_, i) => `L ${410 + i * 10} ${1360 - Math.sin(i * 0.7 - t * 6) * 18}`).join(" ")}`} fill="none" stroke={C.cyan} strokeWidth={3} opacity={hayCorriente} />
          <path d="M 340 1255 L 340 1340 L 390 1340 M 760 1255 L 760 1340 L 710 1340" fill="none" stroke={COBRE} strokeWidth={4} />
        </g>
        {/* Resistencia imaginaria (lo que parece) */}
        {fantasma > 0 ? (
          <g opacity={fantasma}>
            <path d={`M 340 1250 ${new Array(12).fill(0).map((_, i) => `L ${360 + i * 36} ${i % 2 === 0 ? 1226 : 1274}`).join(" ")} L 770 1250`} fill="none" stroke="#FF4A2A" strokeWidth={12} strokeLinejoin="round" opacity={0.7 + 0.3 * Math.sin(t * 8)} strokeDasharray="20 10" />
            <text x={550} y={1330} textAnchor="middle" fill="#FF6A4A" fontFamily={mono} fontSize={44} fontWeight={700} opacity={1 - tacha}>
              ¿?
            </text>
            <g opacity={tacha}>
              <path d="M 450 1180 L 650 1320 M 650 1180 L 450 1320" stroke={C.red} strokeWidth={16} strokeLinecap="round" />
            </g>
          </g>
        ) : null}
        {/* Líneas de campo pequeñas en la placa */}
        {campoA > 0
          ? [440, 660].map((x0, i) =>
              [0, 1].map((k) => (
                <ellipse key={`${i}-${k}`} cx={x0} cy={1210} rx={70 + k * 30} ry={70 + k * 22} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="12 9" strokeDashoffset={(i === 0 ? 1 : -1) * vaiven * 24} opacity={campoA * (0.25 + 0.45 * Math.abs(fase))} />
              )),
            )
          : null}
        {/* Vidrio */}
        <rect x={150} y={1180} width={800} height={24} fill="#14141C" />
        <line x1={150} y1={1181} x2={950} y2={1181} stroke="#4A5A7A" strokeWidth={3} />
        {/* Zona tibia del vidrio (por contacto) */}
        <rect x={305} y={1176} width={490} height={14} rx={7} fill="#E8703C" opacity={0.75 * tibio} />
        {tibio > 0
          ? [380, 480, 580, 680].map((x, k) => {
              const p = (t * 0.6 + k / 4) % 1;
              return <path key={k} d={`M ${x} ${1165 - p * 70} q 10 -14 0 -28 q -10 -14 0 -28`} fill="none" stroke="#E8703C" strokeWidth={4} opacity={tibio * (1 - p)} />;
            })
          : null}
        {/* Cubito de hielo junto a la sartén */}
        <g>
          <rect x={186} y={1126} width={64} height={54} rx={9} fill="#CFF4FF" opacity={0.9} />
          <rect x={194} y={1132} width={20} height={10} rx={4} fill="#FFFFFF" opacity={0.8} />
          <path d="M 196 1170 L 240 1170" stroke="#9ADCF0" strokeWidth={3} />
        </g>
        {/* Sartén y vapor */}
        {sarten(levanta)}
        {[0, 1, 2, 3, 4].map((k) => {
          const p = (t * 0.35 + k / 5) % 1;
          return (
            <path
              key={k}
              d={`M ${380 + k * 85} ${950 - levanta - p * 260} q 22 -30 0 -60 q -22 -30 0 -60`}
              fill="none"
              stroke="#E8E6F0"
              strokeWidth={8}
              strokeLinecap="round"
              opacity={(1 - p) * 0.45 * (1 - tibio)}
            />
          );
        })}

        {/* Corte ampliado */}
        <g opacity={corte}>
          <clipPath id="panelB">
            <rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.y1 - B.y0} rx={40} />
          </clipPath>
          <rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.y1 - B.y0} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <g clipPath="url(#panelB)">
            {/* Agua */}
            <rect x={B.x0} y={B.aguaY} width={B.x1 - B.x0} height={B.base0 - B.aguaY} fill="#4AA8D8" opacity={0.7} />
            {calor > 0.4
              ? BURBUJAS.map((b, i) => {
                  const p = (t * 1.1 + b.f) % 1;
                  return <circle key={i} cx={B.x0 + 40 + b.x * (B.x1 - B.x0 - 80)} cy={B.base0 - 10 - p * 110} r={b.r} fill="none" stroke="#E8F8FF" strokeWidth={3} opacity={(calor - 0.4) * 1.6 * (1 - p)} />;
                })
              : null}
            {/* Fondo de la sartén */}
            <rect x={B.x0} y={B.base0} width={B.x1 - B.x0} height={B.base1 - B.base0} fill={colorBase} />
            <rect x={B.x0} y={B.base0} width={B.x1 - B.x0} height={10} fill="#FFFFFF" opacity={0.12} />
            {/* Vidrio */}
            <rect x={B.x0} y={B.base1} width={B.x1 - B.x0} height={B.vidrio1 - B.base1} fill="#1E3A58" />
            <rect x={B.x0} y={B.base1} width={B.x1 - B.x0} height={12} fill="#E8703C" opacity={0.7 * contacto} />
            <rect x={B.x0} y={B.base1} width={B.x1 - B.x0} height={B.vidrio1 - B.base1} fill="none" stroke={C.cyan} strokeWidth={4} opacity={vidrioFoco * (0.5 + 0.5 * Math.sin(t * 6))} />
            {/* Electrones del vidrio: quietos en su sitio */}
            {ELECTRONES_VIDRIO.map((e, i) => (
              <circle key={i} cx={e.x + Math.sin(t * 7 + e.f) * 2} cy={e.y} r={5} fill="#8AB8E8" opacity={0.3 + 0.6 * vidrioFoco} />
            ))}
            {/* Calor que baja por contacto */}
            {contacto > 0
              ? [1560, 1850, 2140].map((x, k) => {
                  const p = (t * 0.8 + k / 3) % 1;
                  return <path key={k} d={`M ${x} ${B.base1 - 30 + p * 40} l -12 -16 m 12 16 l 12 -16`} fill="none" stroke="#E8703C" strokeWidth={5} strokeLinecap="round" opacity={contacto * (1 - p)} />;
                })
              : null}
            {/* Campo magnético, que sube desde la bobina */}
            <clipPath id="subeCampo">
              <rect x={B.x0} y={subeCampo} width={B.x1 - B.x0} height={B.y1 - subeCampo + 10} />
            </clipPath>
            <g clipPath="url(#subeCampo)" opacity={campoO}>
              {lineasCampo(1650, 1)}
              {lineasCampo(2050, -1)}
            </g>
            {remolino(1650, 1)}
            {remolino(2050, -1)}
            {/* Bobina en corte: corriente que entra (×) o sale (•) y cambia de sentido */}
            {new Array(10).fill(0).map((_, k) => {
              const x = k < 5 ? 1480 + k * 70 : 1940 + (k - 5) * 70;
              const s = (k < 5 ? 1 : -1) * (fase >= 0 ? 1 : -1);
              return (
                <g key={k}>
                  <circle cx={x} cy={B.bobinaY} r={28} fill={COBRE} stroke={mezcla("#A86A20", "#F8D878", hayCorriente * Math.abs(fase))} strokeWidth={5} />
                  {hayCorriente > 0 ? (
                    s > 0 ? (
                      <circle cx={x} cy={B.bobinaY} r={8} fill="#1A1430" />
                    ) : (
                      <path d={`M ${x - 11} ${B.bobinaY - 11} L ${x + 11} ${B.bobinaY + 11} M ${x + 11} ${B.bobinaY - 11} L ${x - 11} ${B.bobinaY + 11}`} stroke="#1A1430" strokeWidth={5} strokeLinecap="round" />
                    )
                  ) : null}
                </g>
              );
            })}
            <rect x={1450} y={B.ferritaY} width={830} height={24} rx={6} fill="#5A5A66" />
            {/* Electrónica con la onda de la corriente alterna */}
            <rect x={1600} y={1330} width={500} height={150} rx={18} fill="#2A2A40" stroke="#4A4670" strokeWidth={3} />
            <line x1={1630} y1={1405} x2={2070} y2={1405} stroke="#4A4670" strokeWidth={2} />
            <path d={`M 1630 1405 ${new Array(45).fill(0).map((_, i) => `L ${1630 + i * 10} ${1405 - Math.sin(w * (t - (44 - i) * 0.025)) * 50}`).join(" ")}`} fill="none" stroke={C.cyan} strokeWidth={4} opacity={hayCorriente} />
            <circle cx={2070} cy={1405 - fase * 50} r={10} fill={C.yellow} opacity={hayCorriente} />
            <path d="M 1480 1108 L 1480 1300 L 1640 1300 L 1640 1330 M 2220 1108 L 2220 1300 L 2060 1300 L 2060 1330" fill="none" stroke={COBRE} strokeWidth={6} />
          </g>
          {/* Calor que sube del fondo */}
          {calor > 0.3
            ? [1500, 1700, 1900, 2100].map((x, k) => {
                const p = (t * 0.7 + k / 4) % 1;
                return <path key={k} d={`M ${x} ${B.base0 - 10 - p * 90} q 12 -16 0 -32 q -12 -16 0 -32`} fill="none" stroke={CALIENTE} strokeWidth={5} opacity={(calor - 0.3) * 1.4 * (1 - p)} />;
              })
            : null}
        </g>

        {/* Prueba del imán */}
        <rect x={2550} y={700} width={1000} height={1100} fill="#2A2440" />
        <rect x={2550} y={1250} width={1000} height={36} fill="#C8B89A" />
        <rect x={2550} y={1286} width={1000} height={520} fill="#4A3E62" />
        <Olla x0={OLLA_H} color="#45454F" borde="#2E2E36" nombre="hierro" />
        <Olla x0={OLLA_A} color="#C8CCD4" borde="#A8ACB4" nombre="aluminio" />
        <Iman x={2560 + (OLLA_H - 2560) * imanH} y={1190} giro={0} />
        {imanH >= 1 ? (
          <g opacity={interpolate(t, [T.iman + 0.1, T.iman + 0.5], [1, 0], clamp)}>
            <path d={`M ${OLLA_H - 10} 1140 l -20 -20 M ${OLLA_H - 10} 1240 l -20 20`} stroke={C.yellow} strokeWidth={5} strokeLinecap="round" />
          </g>
        ) : null}
        <Iman x={3560 - (3560 - OLLA_A - 300) * imanA + 30 * caeA} y={1190 + 32 * caeA} giro={180 - 90 * caeA} />
        <text x={OLLA_H + 150} y={1170} textAnchor="middle" fill={VERDE} fontFamily={mono} fontSize={110} fontWeight={700} opacity={marcas}>
          ✓
        </text>
        <text x={OLLA_A + 150} y={1170} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={110} fontWeight={700} opacity={marcas}>
          ✗
        </text>
      </g>

      <Tag x={sx(780)} y={sy(1060)} dx={110} dy={-230} texto="100 °C" color={CALIENTE} o={Math.min(1, tagCien)} />
      <Tag x={sx(218)} y={sy(1126)} dx={10} dy={-170} texto="frío" color={C.cyan} o={Math.min(1, tagFrio)} />
      <Tag x={sx(530)} y={sy(1240)} dx={0} dy={200} texto="bobina" color={COBRE} o={tagBobina} />
      <Tag x={sx(1690)} y={sy(B.bobinaY)} dx={-60} dy={190} texto="bobina" color={COBRE} o={tagBobinaB} />
      <Tag x={sx(2200)} y={sy((B.base1 + B.vidrio1) / 2)} dx={-40} dy={200} texto="vidrio" color={C.cyan} o={tagVidrio} />
      <Tag x={sx(2200)} y={sy((B.base0 + B.base1) / 2)} dx={-60} dy={-190} texto="sartén" color={C.white} o={tagSarten} />
      <Tag x={sx(2050)} y={sy((B.base0 + B.base1) / 2 - 42)} dx={40} dy={-170} texto="remolinos" color={C.yellow} o={tagRemolinos} />
      <Tag x={sx(1700)} y={sy((B.base1 + B.vidrio1) / 2)} dx={0} dy={200} texto="sin remolinos" color={C.cyan} o={tagSinRemolinos} />
      <Tag x={sx(700)} y={sy(1180)} dx={60} dy={190} texto="tibio" color="#E8703C" o={tagTibio} />
    </svg>
  );
};
