import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la placa de metal vista desde arriba (número estampado, limado, fantasma con ácido, polvo
// magnético y borrado); a la derecha, el metal en corte (cristales aplastados bajo el golpe, la lima y el ácido).
// Retención (estilo §10): cambio de plano cada 2-3 s, nada importante en la franja de subtítulos y final que empalma con el inicio.
const NUMERO = "A7K 4921";
const PLACA = { x0: 110, x1: 990, y0: 780, y1: 1260 };
const METAL = "#9AA0AC";
const ZONA = "#F8883A";
const ACIDO = "#7AE87A";
const B = { x0: 1400, x1: 2300, sup: 900, fondo: 1400, cx: 1850 };
const GRANOS = new Array(9).fill(0).map((_, f) => new Array(14).fill(0).map((__, c) => ({ dx: (random(`gx${f}-${c}`) - 0.5) * 20, dy: (random(`gy${f}-${c}`) - 0.5) * 20 })));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1010, 1.1],
  [1.9, 550, 1010, 1.16],
  [T.final + 0.3, 600, 1010, 1.5],
  [T.estampa - 0.2, 600, 1010, 1.56],
  [T.estampa + 0.2, B.cx, 1030, 1.0],
  [T.superficie - 0.1, B.cx, 1030, 1.03],
  [T.superficie + 0.2, 550, 1010, 1.15],
  [T.golpe - 0.1, 550, 1010, 1.2],
  [T.golpe + 0.2, B.cx, 1080, 1.6],
  [T.abajo - 0.1, B.cx, 1080, 1.63],
  [T.abajo + 0.2, B.cx, 1060, 1.0],
  [T.pero - 0.1, B.cx, 1060, 1.03],
  [T.pero + 0.2, B.cx, 1080, 1.5],
  [T.policia - 0.1, B.cx, 1080, 1.53],
  [T.policia + 0.2, 550, 1010, 1.15],
  [T.deformado - 0.1, 550, 1010, 1.2],
  [T.deformado + 0.2, B.cx, 1030, 1.3],
  [T.reaparece - 0.1, B.cx, 1030, 1.33],
  [T.reaparece + 0.2, 550, 1010, 1.3],
  [T.hierro - 0.1, 550, 1010, 1.33],
  [T.hierro + 0.2, 550, 1080, 1.05],
  [T.golpeado - 0.2, 550, 1080, 1.08],
  [T.golpeado + 0.2, 550, 1010, 1.45],
  [T.sigue, 550, 1010, 1.47],
  [T.sigue + 0.3, 550, 1010, 1.15],
  [T.porEso - 0.1, 550, 1010, 1.18],
  [T.porEso + 0.2, 600, 1010, 1.5],
  [T.metal, 600, 1010, 1.5],
  [T.fin + 0.3, 550, 1010, 1.1],
];

export const SerieMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Placa vista desde arriba
  const estampado = ventana(T.superficie - 0.3, T.golpe + 0.2);
  const limada = t > T.ladron && t < T.fin + 1 ? 1 : 0;
  const fantasma = Math.max(ventana(0.5, T.estampa - 0.3, 0.6, 0.6), interpolate(t, [T.reaparece - 0.2, T.fantasma, T.sigue, T.borra + 0.6], [0, 1, 1, 0], clamp));
  const iman = ventana(T.hierro, T.sigue, 0.4, 0.4);
  const limaduras = interpolate(t, [T.polvo, T.golpeado], [0, 1], clamp) * iman;
  const pule = ventana(T.policia, T.acido + 0.3);
  const gotas = ventana(T.acido - 0.2, T.deformado + 0.3);
  const oscurece = interpolate(t, [T.sigue, T.borra + 0.6], [0, 0.35], clamp) * (t < T.porEso + 1.5 ? 1 : interpolate(t, [T.porEso + 1.5, T.fin], [1, 0], clamp));
  const hisopo = t < T.estampa ? interpolate(t, [0, 1.2], [0, 1], clamp) : 0;
  const visor = Math.max(ventana(T.final, T.estampa - 0.1), ventana(T.porEso, T.metal + 0.6));
  const foto = Math.max(destello(T.final + 1.4), destello(T.instante));

  // Corte del metal
  const corte = Math.max(ventana(T.estampa - 0.1, T.superficie + 0.3), ventana(T.golpe, T.policia + 0.3), ventana(T.deformado, T.reaparece + 0.3));
  const baja = interpolate(t, [T.estampa + 0.3, T.estampa + 0.8, T.estampa + 1.2, T.superficie], [0, 1, 1, 0], clamp);
  const marca = t > T.estampa + 0.8 ? 1 : 0;
  const zona = interpolate(t, [T.golpe, T.golpe + 0.6], [0, 1], clamp);
  const lima = interpolate(t, [T.ladron, T.liso + 0.6], [0, 1], clamp);
  const sup = B.sup + 90 * lima;
  const invisible = t > T.pero && t < T.deformado ? 1 : 0;
  const ataque = interpolate(t, [T.deformado, T.reaparece], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Superficie del corte: muesca del golpe (antes de limar) y hundimiento por el ácido sobre la zona
  const superficie = new Array(46)
    .fill(0)
    .map((_, i) => {
      const x = B.x0 + i * 20;
      const d = Math.abs(x - B.cx);
      const muesca = marca && lima < 1 ? Math.max(0, 70 - d * 1.4) * (1 - lima) : 0;
      const hundido = ataque * 26 * Math.exp(-((d / 140) ** 2));
      return `${i === 0 ? "M" : "L"} ${x} ${sup + muesca + hundido}`;
    })
    .join(" ");

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <pattern id="limaduras" width={14} height={14} patternUnits="userSpaceOnUse">
          <circle cx={7} cy={7} r={4} fill="#2A2A30" />
        </pattern>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={3000} height={2400} fill="#1A1E28" />
        {/* Placa de metal */}
        <rect x={PLACA.x0} y={PLACA.y0} width={PLACA.x1 - PLACA.x0} height={PLACA.y1 - PLACA.y0} rx={20} fill={METAL} />
        {new Array(24).fill(0).map((_, k) => (
          <line key={k} x1={PLACA.x0 + 10} y1={PLACA.y0 + 10 + k * 20} x2={PLACA.x1 - 10} y2={PLACA.y0 + 10 + k * 20} stroke="#B8BEC8" strokeWidth={2} opacity={0.4} />
        ))}
        {limada
          ? new Array(18).fill(0).map((_, k) => <line key={k} x1={PLACA.x0 + 40 + k * 50} y1={PLACA.y0 + 40} x2={PLACA.x0 + k * 50 - 60} y2={PLACA.y1 - 40} stroke="#C8CED8" strokeWidth={3} opacity={0.5} />)
          : null}
        <rect x={PLACA.x0} y={PLACA.y0} width={PLACA.x1 - PLACA.x0} height={PLACA.y1 - PLACA.y0} rx={20} fill="#3A3020" opacity={oscurece} />
        {/* Número estampado, fantasma y con limaduras */}
        <text x={553} y={1063} textAnchor="middle" fill="#D8DCE4" fontFamily={mono} fontSize={124} fontWeight={700} opacity={estampado}>
          {NUMERO}
        </text>
        <text x={550} y={1060} textAnchor="middle" fill="#3A3A44" fontFamily={mono} fontSize={124} fontWeight={700} opacity={estampado}>
          {NUMERO}
        </text>
        <text x={550} y={1060} textAnchor="middle" fill="#E8F0F8" fontFamily={mono} fontSize={124} fontWeight={700} opacity={0.85 * fantasma} stroke="#5A6A7A" strokeWidth={2}>
          {NUMERO}
        </text>
        <text x={550} y={1060} textAnchor="middle" fill="url(#limaduras)" fontFamily={mono} fontSize={124} fontWeight={700} opacity={limaduras}>
          {NUMERO}
        </text>
        {/* Polvo suelto que se junta y el imán debajo */}
        {iman > 0
          ? new Array(30).fill(0).map((_, k) => {
              const p = Math.min(1, limaduras * 1.4);
              return <circle key={k} cx={PLACA.x0 + 60 + random(`lx${k}`) * 760 * (1 - p) + 300 * p} cy={PLACA.y0 + 60 + random(`ly${k}`) * 360} r={4} fill="#2A2A30" opacity={iman * (1 - p)} />;
            })
          : null}
        {iman > 0 ? (
          <g opacity={iman} transform="translate(550 1390)">
            <path d="M -160 0 L -160 60 A 160 60 0 0 0 160 60 L 160 0 L 90 0 L 90 50 A 90 30 0 0 1 -90 50 L -90 0 Z" fill={C.red} />
            <rect x={-160} y={-20} width={70} height={30} fill="#D8D8E0" />
            <rect x={90} y={-20} width={70} height={30} fill="#D8D8E0" />
          </g>
        ) : null}
        {/* Hisopo con ácido (gancho) y pulido */}
        {hisopo > 0 && hisopo < 1 ? (
          <g transform={`translate(${PLACA.x0 + 60 + 780 * hisopo} ${1010 + Math.sin(hisopo * 30) * 60})`}>
            <line x1={0} y1={0} x2={60} y2={-200} stroke="#D8C8A0" strokeWidth={10} />
            <ellipse rx={26} ry={18} fill={ACIDO} />
          </g>
        ) : null}
        {pule > 0 ? <circle cx={550 + Math.cos(t * 8) * 200} cy={1020 + Math.sin(t * 8) * 80} r={70} fill="#E8E6F0" opacity={0.5 * pule} /> : null}
        {gotas > 0
          ? [0, 1, 2, 3, 4].map((k) => {
              const p = (t * 1.3 + k / 5) % 1;
              return <ellipse key={k} cx={250 + k * 150} cy={700 + p * 300} rx={14} ry={20} fill={ACIDO} opacity={gotas * (1 - p * 0.5)} />;
            })
          : null}
        {/* Visor de cámara */}
        {visor > 0 ? (
          <g opacity={visor} stroke="#FFFFFF" strokeWidth={8} fill="none">
            <path d={`M ${PLACA.x0 - 20} ${PLACA.y0 + 40} l 0 -60 l 60 0 M ${PLACA.x1 + 20} ${PLACA.y0 + 40} l 0 -60 l -60 0 M ${PLACA.x0 - 20} ${PLACA.y1 - 40} l 0 60 l 60 0 M ${PLACA.x1 + 20} ${PLACA.y1 - 40} l 0 60 l -60 0`} />
            <circle cx={PLACA.x1 - 40} cy={PLACA.y0 - 60} r={14} fill={C.red} stroke="none" opacity={Math.sin(t * 10) > 0 ? 1 : 0.3} />
          </g>
        ) : null}
        <Pildora x={550} y={1400} texto="¡en segundos!" color={C.yellow} o={ventana(T.final + 0.3, T.estampa - 0.1)} tam={48} />
        <Pildora x={550} y={1400} texto="¡clic!" color={C.white} o={ventana(T.instante, T.metal + 0.4, 0.1, 0.3)} tam={52} />

        {/* Metal en corte */}
        <g opacity={corte}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <clipPath id="metalCorte">
            <path d={`${superficie} L ${B.x1} ${B.fondo} L ${B.x0} ${B.fondo} Z`} />
          </clipPath>
          <g clipPath="url(#metalCorte)">
            <rect x={B.x0} y={B.sup - 100} width={B.x1 - B.x0} height={B.fondo - B.sup + 100} fill={METAL} />
            {GRANOS.map((fila, f) =>
              fila.map((g, c) => {
                const x = B.x0 + 20 + c * 66 + (f % 2) * 33 + g.dx;
                const y = B.sup + 30 + f * 56 + g.dy;
                const d = Math.hypot(x - B.cx, (y - B.sup) * 0.8);
                const aplasta = zona * Math.max(0, 1 - d / 240);
                return <ellipse key={`${f}-${c}`} cx={x} cy={y} rx={30 + 10 * aplasta} ry={24 * (1 - 0.55 * aplasta)} fill="none" stroke="#6A707C" strokeWidth={3} />;
              }),
            )}
            <ellipse cx={B.cx} cy={B.sup} rx={190} ry={260} fill={ZONA} opacity={(invisible ? 0.12 : 0.4) * zona + 0.35 * ataque} />
            {invisible ? <ellipse cx={B.cx} cy={B.sup} rx={190} ry={260} fill="none" stroke={ZONA} strokeWidth={5} strokeDasharray="14 10" /> : null}
          </g>
          {/* Troquel que golpea */}
          {baja > 0 ? (
            <g transform={`translate(${B.cx} ${B.sup - 220 + 220 * baja})`}>
              <rect x={-110} y={-260} width={220} height={240} fill="#5A5A66" />
              <path d="M -50 -20 L 0 50 L 50 -20 Z" fill="#5A5A66" />
            </g>
          ) : null}
          {/* Lima */}
          {lima > 0 && lima < 1 ? (
            <g transform={`translate(${B.cx + Math.sin(t * 14) * 260} ${sup - 20})`}>
              <rect x={-220} y={-30} width={440} height={34} rx={6} fill="#4A4A54" />
              {new Array(20).fill(0).map((_, k) => (
                <line key={k} x1={-210 + k * 22} y1={-30} x2={-200 + k * 22} y2={4} stroke="#8A8A9A" strokeWidth={3} />
              ))}
            </g>
          ) : null}
          {/* Ácido encima */}
          {ataque > 0 ? <rect x={B.x0} y={sup - 40} width={B.x1 - B.x0} height={40} fill={ACIDO} opacity={0.35} /> : null}
          {ataque > 0.2
            ? [-1, 1].map((l) => <path key={l} d={`M ${B.cx + l * 60} ${sup - 70} l 0 50 m -14 -16 l 14 16 l 14 -16`} fill="none" stroke={ACIDO} strokeWidth={6} strokeLinecap="round" />)
            : null}
          {/* Profundidad */}
          {ventana(T.abajo, T.ladron) > 0 ? (
            <g opacity={ventana(T.abajo, T.ladron)}>
              <path d={`M ${B.cx + 240} ${B.sup} L ${B.cx + 240} ${B.sup + 260}`} stroke={C.white} strokeWidth={5} />
              <path d={`M ${B.cx + 226} ${B.sup + 240} l 14 20 l 14 -20`} fill="none" stroke={C.white} strokeWidth={5} />
            </g>
          ) : null}
        </g>
      </g>

      {[T.estampa + 0.8, T.reaparece, T.golpeado + 0.2].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(d)} />
      ))}
      <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.7 * foto} />
      <Tag x={sx(B.cx)} y={sy(B.sup + 120)} dx={-240} dy={-200} texto="cristales aplastados" color={ZONA} o={ventana(T.golpe + 0.3, T.ladron)} />
      <Tag x={sx(B.cx + 190)} y={sy(B.sup + 120)} dx={120} dy={-220} texto="sigue ahí" color={ZONA} o={ventana(T.pero + 0.3, T.policia)} />
      <Tag x={sx(B.cx)} y={sy(sup - 20)} dx={-200} dy={-220} texto="se disuelve más rápido" color={ACIDO} o={ventana(T.velocidad, T.reaparece)} />
      <Tag x={sx(550)} y={sy(1300)} dx={0} dy={150} texto="imán" color={C.red} o={ventana(T.hierro + 0.3, T.acumula)} />
    </svg>
  );
};
