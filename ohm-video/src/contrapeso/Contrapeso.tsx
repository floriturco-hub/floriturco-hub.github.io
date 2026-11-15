import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el hueco del ascensor en corte (cabina, contrapeso de hierro tras la pared, cables y polea con
// el motor arriba); en el centro, el sube y baja equilibrado; a la derecha, las cuentas: cabina con carga frente a
// contrapeso, y la pequeña diferencia que mueve el motor.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const HIERRO = "#6A707C";
const CABINA = "#C8A060";
const CABLE = "#C8CED8";
const POLEA = { x: 550, y: 470 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 0.95],
  [T.final - 0.1, 550, 1000, 0.98],
  [T.final + 0.2, 550, 520, 1.6],
  [T.detras - 0.1, 550, 520, 1.63],
  [T.detras + 0.2, 550, 1000, 0.95],
  [T.hierro - 0.1, 550, 1000, 0.98],
  [T.hierro + 0.2, 700, 1040, 1.6],
  [T.cables - 0.1, 700, 1040, 1.63],
  [T.cables + 0.2, 550, 720, 1.2],
  [T.polea - 0.1, 550, 720, 1.23],
  [T.polea + 0.2, 550, 500, 1.8],
  [T.pesa - 0.1, 550, 500, 1.83],
  [T.pesa + 0.2, 3100, 1030, 1.0],
  [T.mitad - 0.1, 3100, 1030, 1.03],
  [T.mitad + 0.2, 2900, 1080, 1.35],
  [T.asi - 0.1, 2900, 1080, 1.38],
  [T.asi + 0.2, 550, 1000, 0.95],
  [T.reves - 0.1, 550, 1000, 0.98],
  [T.reves + 0.2, 550, 1000, 1.1],
  [T.subeybaja - 0.1, 550, 1000, 1.13],
  [T.subeybaja + 0.2, 1850, 1030, 1.0],
  [T.motor - 0.1, 1850, 1030, 1.03],
  [T.motor + 0.2, 550, 500, 1.6],
  [T.diferencia - 0.1, 550, 500, 1.63],
  [T.diferencia + 0.2, 3100, 1030, 1.0],
  [T.cuanto - 0.1, 3100, 1030, 1.03],
  [T.cuanto + 0.2, 3100, 1030, 1.15],
  [T.cientos - 0.1, 3100, 1030, 1.18],
  [T.cientos + 0.2, 3320, 1130, 1.55],
  [T.toneladas - 0.1, 3320, 1130, 1.58],
  [T.toneladas + 0.2, 3100, 1030, 1.0],
  [T.pequeno - 0.1, 3100, 1030, 1.03],
  [T.pequeno + 0.2, 550, 500, 1.6],
  [T.poreso - 0.1, 550, 500, 1.63],
  [T.poreso + 0.25, 550, 1000, 0.95],
  [T.fin + 0.3, 550, 1000, 0.98],
];

export const ContrapesoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Cabina y contrapeso unidos por el cable: (yCab − polea) + (yCw − polea) = constante
  const gancho = t < T.final || t > T.poreso;
  const tg = t > T.poreso ? t - T.poreso : t;
  const yCab = gancho
    ? interpolate(tg, [0, 2.0], [720, 1080], clamp)
    : t < T.asi
      ? 900
      : t < T.reves
        ? interpolate(t, [T.baja - 0.3, T.reves - 0.2], [900, 1180], clamp)
        : t < T.motor
          ? interpolate(t, [T.reves, T.subeybaja + 0.8], [1180, 760], clamp)
          : 900;
  const yCw = 1840 - yCab;
  const pared = gancho ? 0.25 : t < T.detras ? 1 : interpolate(t, [T.detras, T.detras + 0.8], [1, 0.2], clamp);
  const giraPolea = (yCab - 900) * 0.8;
  const motorChico = interpolate(t, [T.pequeno, T.pequeno + 0.8], [1, 0.6], clamp);

  // Sube y baja
  const verBalancin = ventana(T.subeybaja - 0.1, T.motor + 0.2);
  const inclina = 6 * Math.sin(t * 2);

  // Cuentas
  const verCuentas = Math.max(ventana(T.pesa - 0.1, T.asi + 0.2), ventana(T.diferencia - 0.1, T.pequeno + 0.2));
  const barra = (kg: number) => kg * 0.32;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#161A26" />

        {/* Edificio y hueco del ascensor */}
        <rect x={140} y={380} width={820} height={1220} rx={16} fill="#2A2E3A" />
        <rect x={200} y={540} width={700} height={1030} fill="#1A1E28" />
        {[760, 1020, 1280].map((y) => (
          <line key={y} x1={200} y1={y} x2={600} y2={y} stroke="#3A3F4C" strokeWidth={6} />
        ))}
        {/* Sala de máquinas: motor y polea */}
        <rect x={200} y={400} width={700} height={140} fill="#3A3F4C" />
        <g transform={`translate(380 470) scale(${motorChico})`}>
          <rect x={-70} y={-50} width={140} height={100} rx={14} fill="#5A6A8A" />
          <text y={14} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={30} fontWeight={700}>
            motor
          </text>
        </g>
        <g transform={`rotate(${giraPolea} ${POLEA.x} ${POLEA.y})`}>
          <circle cx={POLEA.x} cy={POLEA.y} r={62} fill="#8A90A0" stroke="#5A5F6C" strokeWidth={10} />
          <line x1={POLEA.x - 60} y1={POLEA.y} x2={POLEA.x + 60} y2={POLEA.y} stroke="#5A5F6C" strokeWidth={8} />
          <line x1={POLEA.x} y1={POLEA.y - 60} x2={POLEA.x} y2={POLEA.y + 60} stroke="#5A5F6C" strokeWidth={8} />
        </g>
        {/* Cables */}
        <line x1={490} y1={POLEA.y} x2={490} y2={yCab} stroke={CABLE} strokeWidth={8} />
        <line x1={612} y1={POLEA.y} x2={612} y2={yCw} stroke={CABLE} strokeWidth={8} />
        {/* Cabina */}
        <g transform={`translate(0 ${yCab})`}>
          <rect x={250} y={0} width={300} height={280} rx={10} fill={CABINA} />
          <rect x={280} y={40} width={110} height={220} fill="#8A6A3A" />
          <rect x={410} y={40} width={110} height={220} fill="#8A6A3A" />
          <circle cx={340} cy={130} r={22} fill="#E8B090" />
          <rect x={320} y={154} width={40} height={90} rx={14} fill="#3A6AC8" />
          <circle cx={460} cy={140} r={22} fill="#C98A64" />
          <rect x={440} y={164} width={40} height={80} rx={14} fill="#C83A3A" />
        </g>
        {/* Contrapeso */}
        <g transform={`translate(0 ${yCw})`}>
          <rect x={560} y={0} width={110} height={220} rx={8} fill={HIERRO} stroke="#8A90A0" strokeWidth={4} />
          {[40, 90, 140, 190].map((y) => (
            <line key={y} x1={560} y1={y} x2={670} y2={y} stroke="#4A505C" strokeWidth={5} />
          ))}
        </g>
        {/* Pared que lo esconde */}
        <rect x={540} y={540} width={360} height={1030} fill="#4A4E5C" opacity={pared} />
        {pared > 0.5 ? (
          <text x={720} y={1060} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={160} fontWeight={700} opacity={pared}>
            ?
          </text>
        ) : null}
        <Pildora x={550} y={640} texto="¿cuánto mueve?" color={C.white} o={ventana(T.final + 0.2, T.detras)} tam={40} />
        <Pildora x={550} y={640} texto="motor pequeño" color={C.yellow} o={ventana(T.pequeno + 0.3, T.poreso)} tam={40} />

        {/* Sube y baja */}
        <g opacity={verBalancin}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <path d="M 1850 1180 L 1790 1330 L 1910 1330 Z" fill="#8A90A0" />
          <g transform={`rotate(${inclina} 1850 1170)`}>
            <rect x={1450} y={1160} width={800} height={24} rx={10} fill="#C8A060" />
            <rect x={1480} y={990} width={170} height={170} rx={10} fill={CABINA} />
            <text x={1565} y={1090} textAnchor="middle" fill="#3A2A10" fontFamily={mono} fontSize={32} fontWeight={700}>
              cabina
            </text>
            <rect x={2080} y={1010} width={130} height={150} rx={8} fill={HIERRO} />
          </g>
        </g>
        <Pildora x={1850} y={760} texto="equilibrado" color={C.cyan} o={ventana(T.subeybaja + 0.3, T.motor)} tam={46} />

        {/* Cuentas */}
        <g opacity={verCuentas}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <line x1={2680} y1={1300} x2={3520} y2={1300} stroke={C.grey} strokeWidth={4} />
          {/* Cabina + carga */}
          <rect x={2760} y={1300 - barra(1000)} width={180} height={barra(1000)} fill={CABINA} />
          <rect x={2760} y={1300 - barra(1800)} width={180} height={barra(800)} fill="#E8B090" opacity={ventana(T.mitad - 0.2, T.pequeno + 0.2)} />
          <rect x={2760} y={1300 - barra(1400)} width={180} height={4} fill={C.white} opacity={ventana(T.mitad, T.asi)} />
          <text x={2850} y={1350} textAnchor="middle" fill={CABINA} fontFamily={mono} fontSize={30} fontWeight={700}>
            cabina + gente
          </text>
          <text x={2850} y={1300 - barra(1800) - 20} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
            1800 kg
          </text>
          {/* Contrapeso */}
          <rect x={3260} y={1300 - barra(1400)} width={180} height={barra(1400)} fill={HIERRO} />
          <text x={3350} y={1350} textAnchor="middle" fill="#A8AEB8" fontFamily={mono} fontSize={30} fontWeight={700}>
            contrapeso
          </text>
          <text x={3350} y={1300 - barra(1400) - 20} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
            1400 kg
          </text>
          {/* Diferencia */}
          <g opacity={ventana(T.diferencia, T.pequeno + 0.2)}>
            <rect x={3260} y={1300 - barra(1800)} width={180} height={barra(400)} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" />
          </g>
        </g>
        <Pildora x={2850} y={700} texto="cabina + media carga" color={CABINA} o={ventana(T.pesa + 0.4, T.asi)} tam={40} />
        <Pildora x={3350} y={1420} texto="≈ 400 kg" color={C.yellow} o={ventana(T.cuanto, T.pequeno)} tam={56} />
      </g>

      {[T.detras + 0.3, T.subeybaja, T.diferencia, T.pequeno].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(615)} y={sy(yCw + 110)} dx={150} dy={-200} texto="contrapeso" color="#A8AEB8" o={ventana(T.contrapeso, T.cables)} />
      <Tag x={sx(POLEA.x + 40)} y={sy(POLEA.y + 40)} dx={140} dy={180} texto="polea" color={CABLE} o={ventana(T.polea + 0.2, T.pesa)} />
      <Tag x={sx(490)} y={sy(700)} dx={-160} dy={-120} texto="cables" color={CABLE} o={ventana(T.cables + 0.2, T.polea)} />
    </svg>
  );
};
