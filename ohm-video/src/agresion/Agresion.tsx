import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un cachorro con el medidor de «ganas de apretar»; en el centro, el cerebro con su sistema de
// recompensa y un depósito de dopamina que se desborda hasta que una pizca de agresión lo equilibra; a la derecha,
// la gráfica de cuánto tarda en bajar la emoción.
const ROSA = "#F88AB8";
const DOPA = "#F8C848";
const CACHORRO = { x: 550, y: 1130 };

const CORAZONES = new Array(10).fill(0).map((_, i) => ({ x: random(`hx${i}`), f: random(`hf${i}`), s: 0.6 + random(`hs${i}`) * 0.7 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.2],
  [T.adorable - 0.3, 550, 1000, 1.24],
  [T.adorable + 0.5, 1850, 1030, 1.0],
  [T.estudios - 0.3, 1850, 1030, 1.02],
  [T.estudios + 0.5, 3100, 1030, 1.0],
  [T.cuidarlo - 0.3, 3100, 1030, 1.02],
  [T.cuidarlo + 0.5, 550, 1000, 1.2],
  [T.fin + 2, 550, 1000, 1.26],
];

const corazon = (x: number, y: number, s: number, color: string, o: number, k: string) => (
  <path key={k} d="M 0 10 C -30 -14, -18 -38, 0 -22 C 18 -38, 30 -14, 0 10 Z" transform={`translate(${x} ${y}) scale(${s})`} fill={color} opacity={o} />
);

// Cachorro de frente, sentado
const Cachorro: React.FC<{ readonly t: number; readonly ladea: number; readonly feliz: number }> = ({ t, ladea, feliz }) => (
  <g transform={`translate(${CACHORRO.x} ${CACHORRO.y + Math.abs(Math.sin(t * 3)) * -6}) rotate(${ladea})`}>
    {/* Cola */}
    <path d={`M 90 120 q 60 ${-40 + Math.sin(t * 14) * 30} 90 ${-90 + Math.sin(t * 14) * 30}`} fill="none" stroke="#C8904A" strokeWidth={22} strokeLinecap="round" />
    {/* Cuerpo y patas */}
    <ellipse cx={0} cy={140} rx={130} ry={110} fill="#E8B878" />
    <ellipse cx={0} cy={170} rx={70} ry={70} fill="#F8E0B8" />
    <ellipse cx={-60} cy={245} rx={42} ry={26} fill="#E8B878" />
    <ellipse cx={60} cy={245} rx={42} ry={26} fill="#E8B878" />
    {[-74, -60, -46, 46, 60, 74].map((x) => (
      <line key={x} x1={x} y1={238} x2={x} y2={258} stroke="#B88848" strokeWidth={4} strokeLinecap="round" />
    ))}
    {/* Cabeza */}
    <ellipse cx={-128} cy={-40} rx={52} ry={95} fill="#A8703A" transform="rotate(18 -128 -40)" />
    <ellipse cx={128} cy={-40} rx={52} ry={95} fill="#A8703A" transform="rotate(-18 128 -40)" />
    <circle cx={0} cy={-60} r={140} fill="#E8B878" />
    <ellipse cx={0} cy={0} rx={78} ry={58} fill="#F8E0B8" />
    {/* Ojos grandes y brillantes */}
    {[-56, 56].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={-78} rx={30} ry={36} fill="#1A1420" />
        <circle cx={x + 10} cy={-92} r={11} fill="#FFFFFF" />
        <circle cx={x - 8} cy={-66} r={5} fill="#FFFFFF" />
      </g>
    ))}
    <ellipse cx={0} cy={-18} rx={24} ry={16} fill="#3A2420" />
    <path d={`M -26 14 Q -13 ${30 + 8 * feliz} 0 14 Q 13 ${30 + 8 * feliz} 26 14`} fill="none" stroke="#3A2420" strokeWidth={5} strokeLinecap="round" />
    <ellipse cx={0} cy={36 + 6 * feliz} rx={14} ry={10 + 8 * feliz} fill="#F87A8A" />
    <circle cx={-92} cy={-14} r={16} fill={ROSA} opacity={0.5} />
    <circle cx={92} cy={-14} r={16} fill={ROSA} opacity={0.5} />
  </g>
);

export const AgresionMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Medidor de «ganas de apretar»
  const ganas = t < T.adorable ? interpolate(t, [0, 0.8, T.ves, T.aprietas, T.comoMe], [0.2, 1, 0.5, 0.85, 1], clamp) : interpolate(t, [T.cuidarlo, T.maldad, T.freno + 0.6], [0.95, 0.5, 0.35], clamp);
  const tiembla = ganas > 0.9 ? Math.sin(t * 60) * 4 : 0;
  const nam = ventana(0.6, T.ves, 0.1, 0.3) + ventana(T.comoMe, T.nombre + 0.2, 0.1, 0.3);
  const dientes = ventana(T.aprietas, T.punos + 0.3);
  const cuida = interpolate(t, [T.cuidarlo, T.cuidarlo + 0.6], [0, 1], clamp);

  // Cerebro y depósito de dopamina
  const cerebro = ventana(T.adorable - 0.3, T.estudios + 0.3, 0.6, 0.6);
  const recompensa = interpolate(t, [T.recompensa - 0.3, T.recompensa + 0.4], [0, 1], clamp);
  const nivel = interpolate(t, [T.dopamina - 0.3, T.desborda, T.contraria, T.intensidad + 0.6], [0, 1.12, 1.12, 0.62], clamp);
  const desborda = nivel > 1 ? 1 : 0;
  const valvula = interpolate(t, [T.contraria - 0.2, T.contraria + 0.3], [0, 1], clamp);
  const alegria = ventana(T.alegria, T.estudios + 0.2);

  // Gráfica de la calma
  const grafica = ventana(T.estudios - 0.3, T.cuidarlo + 0.3, 0.6, 0.6);
  const dibuja = interpolate(t, [T.estudios, T.calman + 0.8], [0, 1], clamp);
  const curva = (rapida: boolean) =>
    new Array(41)
      .fill(0)
      .map((_, i) => {
        const u = (i / 40) * dibuja;
        const v = Math.exp(-u * (rapida ? 4.2 : 1.4));
        return `${i === 0 ? "M" : "L"} ${2720 + u * 760} ${1300 - v * 520}`;
      })
      .join(" ");

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const tanque = { x: 2120, y0: 720, y1: 1300, w: 180 };
  const nivelY = tanque.y1 - (tanque.y1 - tanque.y0) * Math.min(1, nivel);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Sala */}
        <rect x={-300} y={-400} width={1500} height={2400} fill="#2A1E3A" opacity={0.6} />
        <rect x={-300} y={1400} width={1500} height={600} fill="#3A2A4A" />
        <ellipse cx={CACHORRO.x} cy={1400} rx={260} ry={40} fill="#1A1228" opacity={0.6} />
        {CORAZONES.map((h, i) => {
          const p = (t * 0.25 + h.f) % 1;
          return corazon(150 + h.x * 800, 1250 - p * 700, h.s, ROSA, 0.6 * (1 - p) * (0.4 + 0.6 * ganas), `c${i}`);
        })}
        <Cachorro t={t} ladea={Math.sin(t * 1.6) * 6} feliz={cuida} />
        {cuida > 0 ? corazon(CACHORRO.x + 190, 930, 2.4 + 0.2 * Math.sin(t * 5), ROSA, cuida, "cuida") : null}
        {/* Medidor */}
        <g transform={`translate(${550 + tiembla} 770)`}>
          <path d="M -180 0 A 180 180 0 0 1 180 0" fill="none" stroke="#3A3360" strokeWidth={34} />
          <path d="M -180 0 A 180 180 0 0 1 180 0" fill="none" stroke={ROSA} strokeWidth={34} strokeDasharray={`${Math.PI * 180 * ganas} 1000`} />
          <line x1={0} y1={0} x2={-Math.cos(Math.PI * ganas) * 150} y2={-Math.sin(Math.PI * ganas) * 150} stroke={C.white} strokeWidth={8} strokeLinecap="round" />
          <circle r={14} fill={C.white} />
          <text y={70} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
            ganas de apretar
          </text>
        </g>
        <Pildora x={880} y={930} texto="¡ÑAM!" color={C.red} o={Math.min(1, nam)} tam={64} />
        {/* Dientes apretados */}
        {dientes > 0 ? (
          <g opacity={dientes} transform={`translate(${200 + tiembla} 950)`}>
            <rect x={-90} y={-40} width={180} height={80} rx={20} fill="#F8F4E8" stroke="#C8A8A8" strokeWidth={4} />
            <line x1={-90} y1={0} x2={90} y2={0} stroke="#C8A8A8" strokeWidth={4} />
            {[-45, 0, 45].map((x) => (
              <line key={x} x1={x} y1={-40} x2={x} y2={40} stroke="#C8A8A8" strokeWidth={3} />
            ))}
          </g>
        ) : null}

        {/* Cerebro y dopamina */}
        <g opacity={cerebro}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <path d="M 1450 1040 C 1430 860, 1560 740, 1720 750 C 1880 740, 1990 840, 1980 980 C 1990 1080, 1920 1160, 1820 1160 C 1810 1190, 1812 1230, 1806 1270 L 1760 1270 C 1762 1230, 1750 1190, 1720 1160 C 1580 1170, 1460 1130, 1450 1040 Z" fill="#E8A8C8" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M ${1500 + k * 110} ${820 + (k % 2) * 30} q 30 60 0 120 q -30 60 0 120`} fill="none" stroke="#C888A8" strokeWidth={6} />
          ))}
          <circle cx={1730} cy={1000} r={46 + 20 * recompensa * Math.abs(Math.sin(t * 4))} fill={DOPA} opacity={0.3 + 0.6 * recompensa} />
          {/* Ola de dopamina hacia el depósito */}
          {recompensa > 0
            ? [0, 1, 2, 3, 4].map((k) => {
                const p = (t * 0.8 + k / 5) % 1;
                return <circle key={k} cx={1780 + p * (tanque.x - 1780)} cy={1000 - Math.sin(p * Math.PI) * 120} r={12} fill={DOPA} opacity={recompensa * (nivel < 1.1 ? 1 : 0.5)} />;
              })
            : null}
          {/* Depósito con límite */}
          <rect x={tanque.x} y={tanque.y0} width={tanque.w} height={tanque.y1 - tanque.y0} rx={16} fill="#1A1430" stroke="#8A84A8" strokeWidth={5} />
          <rect x={tanque.x + 5} y={nivelY} width={tanque.w - 10} height={tanque.y1 - nivelY - 5} rx={10} fill={DOPA} opacity={0.85} />
          <line x1={tanque.x - 20} y1={tanque.y0 + 120} x2={tanque.x + tanque.w + 20} y2={tanque.y0 + 120} stroke={C.red} strokeWidth={5} strokeDasharray="14 10" />
          {desborda
            ? [0, 1, 2, 3].map((k) => {
                const p = (t * 1.2 + k / 4) % 1;
                return <circle key={k} cx={tanque.x + tanque.w + 10 + p * 40} cy={tanque.y0 + p * 400} r={10} fill={DOPA} />;
              })
            : null}
          {/* Válvula de «agresión» */}
          <g opacity={valvula} transform={`translate(${tanque.x + tanque.w / 2} ${tanque.y1 + 40})`}>
            <rect x={-60} y={-18} width={120} height={36} rx={10} fill={C.red} />
            <text y={10} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={24} fontWeight={700}>
              agresión
            </text>
          </g>
          <g opacity={alegria} transform="translate(1600 1340)">
            <path d="M 0 -40 q 26 34 0 52 q -26 -18 0 -52 z" fill="#8AD8F8" />
            <text x={50} y={10} fill="#8AD8F8" fontFamily={mono} fontSize={32} fontWeight={700}>
              llorar de alegría
            </text>
          </g>
        </g>
        <Pildora x={2210} y={640} texto="¡paralizado!" color={C.red} o={ventana(T.paralizado, T.equilibra)} tam={40} />

        {/* Gráfica: quién se calma antes */}
        <g opacity={grafica}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <text x={2660} y={680} fill={C.grey} fontFamily={mono} fontSize={32}>
            intensidad de la emoción
          </text>
          <line x1={2720} y1={1300} x2={3500} y2={1300} stroke="#5A5478" strokeWidth={3} />
          <line x1={2720} y1={1300} x2={2720} y2={740} stroke="#5A5478" strokeWidth={3} />
          <path d={curva(false)} fill="none" stroke="#8A84A8" strokeWidth={6} strokeDasharray="14 10" />
          <path d={curva(true)} fill="none" stroke={ROSA} strokeWidth={8} />
          <text x={3480} y={1180} textAnchor="end" fill="#8A84A8" fontFamily={mono} fontSize={28} fontWeight={700} opacity={dibuja}>
            sin agresión tierna
          </text>
          <text x={3480} y={1370} textAnchor="end" fill={ROSA} fontFamily={mono} fontSize={28} fontWeight={700} opacity={dibuja}>
            con agresión tierna
          </text>
          <text x={3110} y={1430} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26}>
            tiempo →
          </text>
        </g>
      </g>

      <Tag x={sx(1730)} y={sy(1000)} dx={-80} dy={-330} texto="sistema de recompensa" color={DOPA} o={ventana(T.recompensa, T.desborda)} />
      <Tag x={sx(tanque.x + tanque.w / 2)} y={sy(nivelY)} dx={-60} dy={-160} texto="dopamina" color={DOPA} o={ventana(T.dopamina, T.paralizado)} />
    </svg>
  );
};
