import { Easing, interpolate, random } from "remotion";
import { Persona } from "../orinar/Persona";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un cuarto oscuro con bombilla blanca, lámpara roja de seguridad, tres cubetas y una
// persona revelando; a la derecha, un cristal de bromuro de plata visto de cerca y, debajo, el "muro" de energía.
type P2 = [number, number];
const MESA = 1250;
const SUELO = 1660;
const PX = 190;
const BOMBILLA: P2 = [640, 640];
const LAMPARA: P2 = [900, 700];
const CUBETAS = [470, 780, 1090];
const NOMBRES = ["REVELADOR", "PARO", "FIJADOR"];
const CRISTAL: P2 = [2000, 960];
const IMPACTO: P2 = [1960, 900];
const MURO = { x: 2050, arriba: 1600, suelo: 1900 };
const AZUL = "#4A8AF8";
const ROJO = "#E8414F";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 470, 1120, 1.55],
  [T.parece - 0.3, 470, 1120, 1.57],
  [T.parece + 0.6, 620, 1080, 1.1],
  [T.cristales - 0.3, 620, 1080, 1.12],
  [T.cristales + 0.7, 2000, 900, 1.25],
  [T.muro - 0.3, 2000, 900, 1.27],
  [T.muro + 0.6, 2020, 1720, 1.3],
  [T.porEso - 0.3, 2020, 1720, 1.32],
  [T.porEso + 0.7, 620, 1080, 1.1],
  [T.cerca - 0.3, 620, 1080, 1.12],
  [T.cerca + 0.5, 600, 1000, 1.35],
  [T.final - 0.3, 600, 1000, 1.37],
  [T.final + 0.5, 560, 1100, 1.2],
  [T.fin, 560, 1100, 1.22],
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

// Fotón: un trozo de onda que viaja de `desde` a `hasta` (p: 0..1); onda corta = azul, onda larga = rojo
const Foton: React.FC<{ readonly desde: P2; readonly hasta: P2; readonly p: number; readonly color: string; readonly onda: number; readonly o?: number }> = ({ desde, hasta, p, color, onda, o = 1 }) => {
  if (p <= 0 || p >= 1.001) {
    return null;
  }
  const ang = Math.atan2(hasta[1] - desde[1], hasta[0] - desde[0]);
  const x = desde[0] + (hasta[0] - desde[0]) * p;
  const y = desde[1] + (hasta[1] - desde[1]) * p;
  const n = 40;
  const largo = 150;
  const d = new Array(n + 1)
    .fill(0)
    .map((_, i) => {
      const s = -largo + (largo * i) / n;
      return `${i === 0 ? "M" : "L"} ${s} ${Math.sin((s / onda) * Math.PI * 2) * 10}`;
    })
    .join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${(ang * 180) / Math.PI})`} opacity={o}>
      <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
      <path d="M 0 -10 L 16 0 L 0 10 Z" fill={color} />
    </g>
  );
};

const LLUVIA = new Array(18).fill(0).map((_, i) => ({ x: 1560 + random(`lx${i}`) * 420, d: random(`ld${i}`) * 1.4 }));

// Imagen de la foto en un cuadrado unidad (paisaje): cielo claro, sol, montañas y un árbol
const Foto: React.FC<{ readonly densidad: number }> = ({ densidad }) => (
  <g opacity={densidad}>
    <circle cx={0.74} cy={0.28} r={0.1} fill="#7A7A80" />
    <path d="M 0 0.78 L 0.22 0.42 L 0.38 0.62 L 0.58 0.3 L 0.82 0.66 L 1 0.5 L 1 1 L 0 1 Z" fill="#2A2A30" />
    <path d="M 0 0.88 L 1 0.84 L 1 1 L 0 1 Z" fill="#141418" />
    <rect x={0.14} y={0.6} width={0.025} height={0.24} fill="#141418" />
    <circle cx={0.152} cy={0.58} r={0.07} fill="#141418" />
  </g>
);

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

export const Cuarto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Luces: blanca al principio, luego roja; oscuridad total para el carrete
  const blanca = interpolate(t, [T.pero, T.pero + 0.4], [1, 0], clamp);
  const roja = interpolate(t, [T.pero + 0.1, T.roja], [0, 1], clamp);
  const oscuridad = interpolate(t, [T.carrete + 0.2, T.carrete + 0.7, T.ojo - 0.4, T.ojo], [0, 1, 1, 0], clamp);

  // Papel A (se vela con la luz blanca) y papel B (intacto con luz roja, luego se revela)
  const velaA = interpolate(t, [0, T.arruina + 0.6], [0.15, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const papelA = interpolate(t, [T.pero, T.pero + 0.4], [1, 0], clamp);
  const papelB = interpolate(t, [T.pero + 0.2, T.roja], [0, 1], clamp);
  const revela = interpolate(t, [T.revelador - 0.2, T.negra + 1.0], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) * 0.9;
  const acerca = interpolate(t, [T.cerca - 0.2, T.cerca + 0.8, T.final, T.final + 0.6], [0, 1, 1, 0], suave);
  const velaB = interpolate(t, [T.cerca + 0.4, T.vela + 0.6], [0, 0.55], clamp) * (t < T.final + 0.6 ? 1 : interpolate(t, [T.final + 0.6, T.final + 1.2], [1, 0], clamp));
  const lampara: P2 = [LAMPARA[0] + (CUBETAS[0] + 80 - LAMPARA[0]) * acerca, LAMPARA[1] + (1010 - LAMPARA[1]) * acerca];

  // Microscopio: fotón azul que libera un electrón y forma plata; fotones rojos que rebotan
  const pAzul1 = interpolate(t, [T.foton, T.choca + 0.3], [0, 1], clamp);
  const golpe1 = t > T.choca + 0.3 ? 1 : 0;
  const electron = interpolate(t, [T.electron - 0.2, T.electron + 1.2], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const plata = interpolate(t, [T.puntito, T.latente + 0.4], [0, 1], clamp);
  const negro = interpolate(t, [T.revelador, T.negra + 0.6], [0, 1], clamp);
  const pAzul2 = interpolate(t, [T.azul + 0.2, T.golpean + 0.2], [0, 1], clamp);
  const pRojo = interpolate(t, [T.rojaE, T.chocan], [0, 1], clamp);
  const rebote = interpolate(t, [T.chocan, T.chocan + 1.4], [0, 1], clamp);
  const lluvia = ventana(T.mil - 0.2, T.muro, 0.3, 0.4);
  const pAzul3 = interpolate(t, [T.mil + 1.2, T.unoAzul + 0.2], [0, 1], clamp);
  const micro = ventana(T.cristales - 0.4, T.porEso + 0.4, 0.6, 0.6);

  // Muro de energía: la bola azul salta por encima; las rojas no llegan, por más que lo intenten
  const muro = ventana(T.muro - 0.6, T.porEso + 0.4);
  const saltoAzul = interpolate(t, [T.muro + 0.3, T.muro + 1.5], [0, 1], clamp);
  const saltoAzul2 = interpolate(t, [T.altura - 0.4, T.altura + 0.8], [0, 1], clamp);

  // Persona con pinzas en la cubeta
  const pinza: P2 = [CUBETAS[0] - 80, 1196];
  const mano: P2 = [pinza[0] - 70 - PX + Math.sin(t * 1.6) * 6, pinza[1] - 34 - SUELO];

  // Etiquetas
  const tagBlanca = ventana(0.2, T.pero + 0.2);
  const tagIntacto = ventana(T.nada - 0.2, T.parece + 0.6);
  const tagCristal = ventana(T.bromuro, T.foton + 0.4);
  const tagElectron = ventana(T.electron + 0.3, T.latente);
  const tagLatente = ventana(T.latente, T.revelador + 0.6);
  const tagRebota = ventana(T.chocan + 0.2, T.cantidad);
  const tagNecesaria = ventana(T.muro, T.porEso);
  const tagCarrete = ventana(T.carrete + 0.5, T.ojo - 0.2);
  const tagVelado = ventana(T.vela - 0.2, T.final + 0.4);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const pared = blanca > 0.5 ? "#5A5470" : "#2A2034";

  const cubeta = (x: number, i: number) => (
    <g key={i}>
      <polygon points={`${x - 140},1222 ${x + 140},1222 ${x + 140},${MESA} ${x - 140},${MESA}`} fill="#3A6A8A" />
      <polygon points={`${x - 115},1165 ${x + 115},1165 ${x + 140},1222 ${x - 140},1222`} fill="#4A82A8" />
      <polygon points={`${x - 105},1170 ${x + 105},1170 ${x + 126},1217 ${x - 126},1217`} fill="#2A4A60" />
      <text x={x} y={1242} textAnchor="middle" fill="#E8E6F0" fontFamily={mono} fontSize={16} fontWeight={700}>
        {NOMBRES[i]}
      </text>
    </g>
  );
  // Papel en paralelogramo dentro de la primera cubeta
  const papel = (o: number, velo: number, densidad: number) => (
    <g opacity={o} transform={`matrix(180 0 -18 42 ${CUBETAS[0] - 88} 1173)`}>
      <rect x={0} y={0} width={1} height={1} fill="#F4F2EC" />
      <Foto densidad={densidad} />
      <rect x={0} y={0} width={1} height={1} fill="#141418" opacity={velo} />
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Cuarto oscuro */}
        <rect x={-400} y={300} width={1800} height={MESA - 300} fill={pared} />
        <rect x={-400} y={MESA} width={1800} height={1000} fill="#3A2A30" />
        <rect x={-400} y={MESA} width={1800} height={12} fill="#5A4048" />
        {/* Bombilla blanca */}
        <line x1={BOMBILLA[0]} y1={300} x2={BOMBILLA[0]} y2={BOMBILLA[1] - 30} stroke="#1A1420" strokeWidth={4} />
        <circle cx={BOMBILLA[0]} cy={BOMBILLA[1]} r={220} fill="#FFF8E0" opacity={0.25 * blanca} />
        <circle cx={BOMBILLA[0]} cy={BOMBILLA[1]} r={30} fill={blanca > 0.5 ? "#FFF8E0" : "#4A4458"} />
        {/* Lámpara roja de seguridad */}
        <circle cx={lampara[0]} cy={lampara[1]} r={260} fill={ROJO} opacity={0.18 * roja} />
        <rect x={lampara[0] - 70} y={lampara[1] - 45} width={140} height={90} rx={12} fill="#1A1420" />
        <rect x={lampara[0] - 56} y={lampara[1] - 32} width={112} height={64} rx={8} fill={roja > 0.5 ? "#FF3A3A" : "#5A2A2A"} />
        {acerca > 0 ? <polygon points={`${lampara[0] - 50},${lampara[1] + 40} ${lampara[0] + 50},${lampara[1] + 40} ${CUBETAS[0] + 140},1200 ${CUBETAS[0] - 140},1200`} fill={ROJO} opacity={0.2 * acerca} /> : null}

        {/* Persona revelando (detrás de la mesa) */}
        <Persona x={PX} suelo={SUELO} t={t} mano={mano} miedo={0.5 * (1 - roja)} />
        {/* Mesa y cubetas */}
        <rect x={-400} y={MESA} width={1800} height={420} fill="#4A3A40" />
        <rect x={-400} y={MESA} width={1800} height={14} fill="#6A5458" />
        {CUBETAS.map((x, i) => cubeta(x, i))}
        {papel(papelA, velaA, 0)}
        {papel(papelB, velaB, revela)}
        {/* Pinzas */}
        <path d={`M ${pinza[0] - 64 + Math.sin(t * 1.6) * 6} ${pinza[1] - 30} L ${pinza[0]} ${pinza[1]} M ${pinza[0] - 58 + Math.sin(t * 1.6) * 6} ${pinza[1] - 40} L ${pinza[0] + 6} ${pinza[1] - 6}`} stroke="#C8C4D8" strokeWidth={5} strokeLinecap="round" />
        {/* Carrete y película sobre la mesa */}
        <g transform={`translate(1000 ${MESA - 4})`}>
          <rect x={-40} y={-90} width={80} height={90} rx={10} fill="#2A2A30" />
          <rect x={-46} y={-100} width={92} height={14} rx={4} fill="#4A4A54" />
          <rect x={-46} y={-6} width={92} height={10} rx={4} fill="#4A4A54" />
          <path d="M 40 -70 L 180 -70 L 180 -20 L 40 -20 Z" fill="#5A3A20" />
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <g key={k}>
              <rect x={50 + k * 18} y={-66} width={8} height={7} fill="#2A1A10" />
              <rect x={50 + k * 18} y={-31} width={8} height={7} fill="#2A1A10" />
            </g>
          ))}
        </g>
        {/* Luz roja que lo tiñe todo, y la oscuridad total del carrete */}
        <rect x={-400} y={300} width={1800} height={1400} fill="#FF2A2A" opacity={0.42 * roja * (1 - oscuridad)} style={{ mixBlendMode: "multiply" }} />
        <rect x={-400} y={300} width={1800} height={1400} fill="#050308" opacity={0.92 * oscuridad} />
        {oscuridad > 0 ? (
          <g opacity={oscuridad * 0.6} transform={`translate(1000 ${MESA - 4})`}>
            <rect x={-40} y={-90} width={80} height={90} rx={10} fill="none" stroke="#5A5478" strokeWidth={3} strokeDasharray="6 6" />
            <path d="M 40 -70 L 180 -70 L 180 -20 L 40 -20 Z" fill="none" stroke="#5A5478" strokeWidth={3} strokeDasharray="6 6" />
          </g>
        ) : null}

        {/* Microscopio: cristal de bromuro de plata */}
        <g opacity={micro}>
          <rect x={1480} y={420} width={1060} height={940} rx={40} fill="#120E22" stroke="#3A3360" strokeWidth={4} />
          {new Array(5).fill(0).map((_, j) =>
            new Array(7).fill(0).map((__, i) => {
              const x = CRISTAL[0] + (i - 3) * 76 + (j - 2) * 22;
              const y = CRISTAL[1] + (j - 2) * 64;
              const plataIon = (i + j) % 2 === 0;
              return <circle key={`${i}-${j}`} cx={x} cy={y} r={plataIon ? 14 : 22} fill={plataIon ? "#B8BCC8" : "#C8843A"} opacity={0.9} />;
            }),
          )}
          {/* Puntito de plata (imagen latente) que el revelador ennegrece */}
          {plata > 0 ? (
            <g>
              {[0, 1, 2, 3, 4].map((k) => (
                <circle key={k} cx={IMPACTO[0] + Math.cos(k * 1.3) * 16 * (k > 0 ? 1 : 0)} cy={IMPACTO[1] + Math.sin(k * 1.3) * 16 * (k > 0 ? 1 : 0)} r={10 * Math.min(1, plata * 5 - k)} fill="#2A2A34" opacity={Math.max(0, Math.min(1, plata * 5 - k))} />
              ))}
              <circle cx={IMPACTO[0]} cy={IMPACTO[1]} r={20 + 70 * negro} fill="#0A0A0E" opacity={negro} />
            </g>
          ) : null}
          {golpe1 && t < T.choca + 0.8 ? <circle cx={IMPACTO[0]} cy={IMPACTO[1]} r={30 + (t - T.choca - 0.3) * 120} fill="none" stroke={AZUL} strokeWidth={6} opacity={1 - (t - T.choca - 0.3) * 2} /> : null}
          <Foton desde={[1580, 480]} hasta={IMPACTO} p={pAzul1} color={AZUL} onda={22} />
          {electron > 0 && electron < 1 ? (
            <g transform={`translate(${IMPACTO[0] + 300 * electron} ${IMPACTO[1] - 160 * electron + 120 * electron * electron})`} opacity={1 - electron * 0.3}>
              <circle r={16} fill={C.cyan} />
              <text x={0} y={7} textAnchor="middle" fill="#0A0818" fontFamily={mono} fontSize={20} fontWeight={700}>
                e⁻
              </text>
            </g>
          ) : null}
          <Foton desde={[1580, 480]} hasta={[2120, 1030]} p={pAzul2} color={AZUL} onda={22} />
          {pAzul2 >= 1 && t < T.marcan + 1 ? <circle cx={2120} cy={1030} r={18 + (t - T.golpean - 0.2) * 40} fill="#0A0A0E" opacity={0.85} /> : null}
          <Foton desde={[1580, 600]} hasta={[1880, 1080]} p={pRojo} color={ROJO} onda={46} />
          <Foton desde={[1880, 1080]} hasta={[1700, 1360]} p={rebote} color={ROJO} onda={46} o={1 - rebote * 0.5} />
          {lluvia > 0
            ? LLUVIA.map((l, i) => {
                const fase = ((t - T.mil) * 0.9 + l.d) % 1.4;
                const p = fase / 1.4;
                const llegada: P2 = [l.x + 260, 1080];
                return p < 0.6 ? (
                  <Foton key={i} desde={[l.x, 440]} hasta={llegada} p={p / 0.6} color={ROJO} onda={46} o={lluvia} />
                ) : (
                  <Foton key={i} desde={llegada} hasta={[llegada[0] + 160, 760]} p={(p - 0.6) / 0.4} color={ROJO} onda={46} o={lluvia * 0.6} />
                );
              })
            : null}
          <Foton desde={[1580, 480]} hasta={[1880, 840]} p={pAzul3} color={AZUL} onda={22} />
          {pAzul3 >= 1 ? <circle cx={1880} cy={840} r={22} fill="#0A0A0E" opacity={0.9 * ventana(T.unoAzul, T.porEso)} /> : null}
        </g>

        {/* Muro de energía */}
        <g opacity={muro}>
          <rect x={1480} y={1460} width={1060} height={520} rx={40} fill="#120E22" stroke="#3A3360" strokeWidth={4} />
          <rect x={1500} y={MURO.suelo} width={1020} height={12} fill="#5A5478" />
          <rect x={MURO.x - 30} y={MURO.arriba} width={60} height={MURO.suelo - MURO.arriba} fill="#6A5A88" />
          {new Array(6).fill(0).map((_, k) => (
            <line key={k} x1={MURO.x - 30} y1={MURO.arriba + 50 * k} x2={MURO.x + 30} y2={MURO.arriba + 50 * k} stroke="#4A3E68" strokeWidth={4} />
          ))}
          <line x1={1520} y1={MURO.arriba} x2={2500} y2={MURO.arriba} stroke={C.yellow} strokeWidth={3} strokeDasharray="12 10" />
          {/* Rojas: saltan y vuelven */}
          {[0, 1, 2].map((k) => {
            const f = ((t - T.muro) * 1.2 + k / 3) % 1;
            const x = 1640 + k * 60 + f * 260;
            const y = MURO.suelo - 30 - Math.sin(f * Math.PI) * 220;
            const vuelta = f > 0.5 ? 1640 + k * 60 + (1 - f) * 260 : x;
            return <circle key={k} cx={vuelta} cy={y} r={26} fill={ROJO} />;
          })}
          {/* Azul: salta por encima */}
          {[saltoAzul, saltoAzul2].map((s, k) =>
            s > 0 && s < 1 ? <circle key={k} cx={1640 + s * 760} cy={MURO.suelo - 30 - Math.sin(s * Math.PI) * 400} r={26} fill={AZUL} /> : null,
          )}
        </g>
      </g>

      <Tag x={sx(BOMBILLA[0])} y={sy(BOMBILLA[1] + 30)} dx={170} dy={90} texto="luz blanca" color={C.white} o={tagBlanca} />
      <Tag x={sx(CUBETAS[0])} y={sy(1195)} dx={160} dy={170} texto="intacto ✓" color="#48C878" o={tagIntacto} />
      <Tag x={sx(CRISTAL[0] + 120)} y={sy(CRISTAL[1] + 128)} dx={60} dy={170} texto="bromuro de plata" color="#C8843A" o={tagCristal} />
      <Tag x={sx(IMPACTO[0] + 300)} y={sy(IMPACTO[1] - 40)} dx={40} dy={-140} texto="electrón" color={C.cyan} o={tagElectron} />
      <Tag x={sx(IMPACTO[0])} y={sy(IMPACTO[1])} dx={-200} dy={260} texto="imagen latente" color={C.yellow} o={tagLatente} />
      <Tag x={sx(1880)} y={sy(1080)} dx={260} dy={180} texto="rebota" color={ROJO} o={tagRebota} />
      <Tag x={sx(MURO.x)} y={sy(MURO.arriba)} dx={200} dy={-120} texto="energía necesaria" color={C.yellow} o={tagNecesaria} />
      <Tag x={sx(1000)} y={sy(MESA - 50)} dx={-120} dy={-220} texto="carrete: a oscuras" color={C.white} o={tagCarrete} />
      <Tag x={sx(CUBETAS[0])} y={sy(1195)} dx={160} dy={170} texto="velado" color={C.red} o={tagVelado} />
    </svg>
  );
};
