import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, los dientes de arriba de frente con brackets y alambre (y el hueso en rayos X);
// a la derecha, un diente en corte dentro del hueso: ligamento, osteoclastos que disuelven y osteoblastos que construyen.
const ENCIA = 880;
const DIENTES = [0, 1, 2, 3, 4, 5].map((i) => 220 + i * 128);
const TORCIDO = 3;
const HUESO = "#E8D8B0";
const HUESO_NUEVO = "#F8F0D8";
const CLASTO = "#A87AE8";
const BLASTO = "#5AB8F8";
const B = { x0: 1340, x1: 2360, y0: 600, y1: 1460, raizX: 1850, encia: 830 };

const POROS = new Array(40).fill(0).map((_, i) => ({ x: random(`px${i}`), y: random(`py${i}`), r: 6 + random(`pr${i}`) * 12 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 900, 1.3],
  [T.noPegados - 0.3, 550, 900, 1.34],
  [T.noPegados + 0.5, 1850, 1030, 1.0],
  [T.brackets - 0.3, 1850, 1030, 1.02],
  [T.brackets + 0.5, 550, 960, 1.3],
  [T.unLado - 0.3, 550, 960, 1.34],
  [T.unLado + 0.5, 1850, 1030, 1.0],
  [T.retenedor - 0.3, 1850, 1030, 1.02],
  [T.retenedor + 0.5, 550, 960, 1.3],
  [T.fin + 2, 550, 960, 1.36],
];

export const BracketsMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Diente torcido: en el gancho viaja a cámara rápida; luego, poco a poco con el alambre
  const gancho = interpolate(t, [0.2, 1.5, 1.9, 2.3], [0, 1, 1, 0], clamp);
  const lento = interpolate(t, [T.empuja, T.retenedor - 0.3], [0, 1], clamp);
  const alinea = Math.max(gancho, lento);
  const off = (i: number) => (i === TORCIDO ? { dx: -30 * (1 - alinea), dy: 70 * (1 - alinea), giro: 14 * (1 - alinea) } : { dx: 0, dy: 0, giro: 0 });
  const rayosX = Math.max(ventana(-1, T.secreto), ventana(T.empuja, T.unLado));
  const brillaBrackets = ventana(T.brackets, T.alambre);
  const brillaAlambre = ventana(T.alambre, T.unLado);
  const retenedor = interpolate(t, [T.retenedor + 0.4, T.retenedor + 1.0], [0, 1], clamp);

  // Diente en corte
  const corte = Math.max(ventana(T.noPegados - 0.3, T.brackets + 0.3, 0.6, 0.6), ventana(T.unLado - 0.3, T.retenedor + 0.3, 0.6, 0.6));
  const fibras = interpolate(t, [T.fibras - 0.2, T.fibras + 0.6], [0, 1], clamp);
  const hamaca = t > T.hamaca && t < T.brackets ? Math.sin((t - T.hamaca) * 6) * 8 : 0;
  const fuerza = t > T.unLado ? 1 : 0;
  const clastos = interpolate(t, [T.osteoclastos, T.osteoclastos + 0.6], [0, 1], clamp);
  const disuelve = interpolate(t, [T.disuelven, T.avanza + 2], [0, 1], clamp);
  const blastos = interpolate(t, [T.osteoblastos, T.osteoblastos + 0.6], [0, 1], clamp);
  const construye = interpolate(t, [T.nuevo, T.avanza + 2.2], [0, 1], clamp);
  const avance = interpolate(t, [T.avanza, T.hueco + 1.4], [0, 1], clamp);
  const aprieta = ventana(T.aprieta, T.otroLado + 0.6);
  const estira = ventana(T.estiran, T.avanza);
  const mover = 70 * avance;
  const raiz = B.raizX + mover;
  // Paredes del hueco: la derecha se disuelve, la izquierda crece
  const paredDer = raiz + 120 + 70 * disuelve - 8 * aprieta;
  const paredIzq = raiz - 120 + 70 * construye;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Fibras del ligamento entre la raíz y la pared, a un lado
  const ligamento = (lado: number, color: string) =>
    new Array(8).fill(0).map((_, k) => {
      const y = B.encia + 100 + k * 55;
      const xr = raiz + lado * (90 - k * 4) + hamaca * 0.3;
      const xp = lado > 0 ? paredDer : paredIzq;
      return <path key={k} d={`M ${xr} ${y} Q ${(xr + xp) / 2} ${y + 16 + (lado > 0 ? 10 * aprieta : -6 * estira)} ${xp} ${y - 14}`} fill="none" stroke={color} strokeWidth={4} opacity={fibras} />;
    });

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1500} height={2400} fill="#2A1A2A" opacity={0.6} />
        {/* Hueso del maxilar (rayos X) y encía */}
        <rect x={60} y={520} width={980} height={ENCIA - 520 + 20} rx={40} fill={HUESO} opacity={0.2 + 0.6 * rayosX} />
        {POROS.slice(0, 20).map((p, i) => (
          <circle key={i} cx={80 + p.x * 940} cy={540 + p.y * 300} r={p.r} fill="#C8B890" opacity={rayosX * 0.8} />
        ))}
        <path d={`M 40 ${ENCIA + 30} Q 550 ${ENCIA - 70} 1060 ${ENCIA + 30} L 1060 ${ENCIA - 30} Q 550 ${ENCIA - 130} 40 ${ENCIA - 30} Z`} fill="#D87A8A" opacity={1 - 0.6 * rayosX} />
        {/* Raíces y coronas */}
        {DIENTES.map((x, i) => {
          const o = off(i);
          return (
            <g key={i} transform={`translate(${x + o.dx} ${o.dy}) rotate(${o.giro} 0 ${ENCIA + 80})`}>
              <path d={`M -34 ${ENCIA} L -18 ${ENCIA - 230} Q 0 ${ENCIA - 260} 18 ${ENCIA - 230} L 34 ${ENCIA} Z`} fill="#F8F4E8" opacity={rayosX} />
              <rect x={-54} y={ENCIA - 30} width={108} height={180} rx={34} fill="#F8F4E8" />
              <rect x={-40} y={ENCIA - 10} width={20} height={120} rx={10} fill="#FFFFFF" opacity={0.6} />
              <rect x={-22} y={ENCIA + 50} width={44} height={40} rx={6} fill="#B8C0C8" stroke={C.yellow} strokeWidth={brillaBrackets * 5} />
              <rect x={-14} y={ENCIA + 62} width={28} height={16} rx={3} fill="#8A929A" />
            </g>
          );
        })}
        {/* Alambre: pasa por los brackets y quiere estar recto */}
        <path
          d={`M 120 ${ENCIA + 70} ${DIENTES.map((x, i) => {
            const o = off(i);
            return `L ${x + o.dx} ${ENCIA + 70 + o.dy * 0.92}`;
          }).join(" ")} L 980 ${ENCIA + 70}`}
          fill="none"
          stroke={brillaAlambre > 0 ? C.yellow : "#C8D0D8"}
          strokeWidth={6 + 4 * brillaAlambre}
          strokeLinejoin="round"
        />
        {/* Flecha de empuje sobre el diente torcido */}
        {brillaAlambre > 0 && lento < 1 ? (
          <path d={`M ${DIENTES[TORCIDO] + off(TORCIDO).dx} ${ENCIA + 260 + off(TORCIDO).dy} l 0 -60 m -18 22 l 18 -22 l 18 22`} fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" opacity={brillaAlambre} />
        ) : null}
        {/* Retenedor */}
        <path d={`M 140 ${ENCIA + 120} Q 550 ${ENCIA + 180} 960 ${ENCIA + 120}`} fill="none" stroke="#B8E8F8" strokeWidth={10} opacity={0.8 * retenedor} />
        <rect x={150} y={ENCIA - 40} width={800} height={200} rx={40} fill="#B8E8F8" opacity={0.18 * retenedor} />
        {gancho > 0 ? <Pildora x={550} y={ENCIA + 330} texto="× 10.000" color={C.cyan} o={ventana(0.1, 2.2, 0.2, 0.3)} tam={52} /> : null}

        {/* Diente en corte dentro del hueso */}
        <g opacity={corte}>
          <Panel x0={B.x0} y0={B.y0} x1={B.x1} y1={B.y1} />
          {/* Hueso */}
          <rect x={B.x0 + 30} y={B.encia} width={B.x1 - B.x0 - 60} height={B.y1 - B.encia - 30} rx={20} fill={HUESO} />
          {POROS.map((p, i) => (
            <circle key={i} cx={B.x0 + 50 + p.x * (B.x1 - B.x0 - 100)} cy={B.encia + 30 + p.y * 560} r={p.r} fill="#C8B890" />
          ))}
          {/* Hueso nuevo (detrás) */}
          <rect x={B.raizX - 120} y={B.encia + 60} width={paredIzq - (B.raizX - 120)} height={540} fill={HUESO_NUEVO} />
          {new Array(5).fill(0).map((_, k) => (
            <line key={k} x1={B.raizX - 120 + (k + 1) * 14 * construye} y1={B.encia + 70} x2={B.raizX - 120 + (k + 1) * 14 * construye} y2={B.encia + 590} stroke="#E8D8A8" strokeWidth={3} opacity={construye} />
          ))}
          {/* Hueco del diente (ligamento) */}
          <rect x={paredIzq} y={B.encia + 60} width={paredDer - paredIzq} height={540} rx={60} fill="#5A2A3A" />
          {/* Encía */}
          <rect x={B.x0 + 30} y={B.encia - 40} width={B.x1 - B.x0 - 60} height={70} rx={30} fill="#D87A8A" />
          {/* Diente: corona fuera, raíz dentro */}
          <g transform={`translate(${mover} ${hamaca})`}>
            <path d={`M ${B.raizX - 90} ${B.encia + 20} L ${B.raizX - 60} ${B.encia + 500} Q ${B.raizX} ${B.encia + 560} ${B.raizX + 60} ${B.encia + 500} L ${B.raizX + 90} ${B.encia + 20} Z`} fill="#F8F4E8" />
            <rect x={B.raizX - 130} y={B.encia - 200} width={260} height={230} rx={70} fill="#F8F4E8" />
            <rect x={B.raizX - 40} y={B.encia - 130} width={80} height={60} rx={8} fill="#B8C0C8" />
            <line x1={B.raizX - 200} y1={B.encia - 100} x2={B.raizX + 200} y2={B.encia - 100} stroke={C.yellow} strokeWidth={8} opacity={fuerza} />
          </g>
          {ligamento(1, aprieta > 0.3 ? C.red : "#F8A8B8")}
          {ligamento(-1, estira > 0.3 ? C.cyan : "#F8A8B8")}
          {/* Fuerza del alambre */}
          {fuerza ? <path d={`M ${raiz - 250} ${B.encia - 100} l 110 0 m -26 -22 l 26 22 l -26 22`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" /> : null}
          {/* Osteoclastos (lado que aprieta) y osteoblastos (lado que estira) */}
          {[0, 1, 2].map((k) => (
            <g key={`c${k}`} opacity={clastos}>
              <ellipse cx={paredDer + 22} cy={B.encia + 150 + k * 160} rx={30} ry={46} fill={CLASTO} />
              {[0, 1, 2].map((n) => (
                <circle key={n} cx={paredDer + 16 + (n % 2) * 12} cy={B.encia + 126 + k * 160 + n * 16} r={6} fill="#5A3A8A" />
              ))}
              {disuelve > 0 && disuelve < 1 ? <circle cx={paredDer + 60 + ((t * 40 + k * 13) % 40)} cy={B.encia + 150 + k * 160 + Math.sin(t * 5 + k) * 20} r={5} fill={HUESO} /> : null}
            </g>
          ))}
          {[0, 1, 2, 3].map((k) => (
            <circle key={`b${k}`} cx={paredIzq - 14} cy={B.encia + 120 + k * 130} r={22} fill={BLASTO} opacity={blastos} />
          ))}
          {/* Regla: un milímetro al mes */}
          <g opacity={ventana(T.milimetro, T.retenedor + 0.3)}>
            <rect x={B.raizX - 40} y={B.y1 - 90} width={200} height={34} rx={6} fill="#F8E8B0" />
            {new Array(11).fill(0).map((_, k) => (
              <line key={k} x1={B.raizX - 40 + k * 20} y1={B.y1 - 90} x2={B.raizX - 40 + k * 20} y2={B.y1 - (k % 5 === 0 ? 66 : 76)} stroke="#5A4030" strokeWidth={3} />
            ))}
          </g>
        </g>
        <Pildora x={1850} y={B.y1 + 70} texto="1 mm / mes" color={C.yellow} o={ventana(T.milimetro, T.retenedor + 0.3)} tam={48} />
      </g>

      <Tag x={sx(B.raizX + 100)} y={sy(B.encia + 380)} dx={160} dy={-300} texto="ligamento" color="#F8A8B8" o={ventana(T.ligamento, T.brackets)} />
      <Tag x={sx(paredDer + 22)} y={sy(B.encia + 340)} dx={60} dy={-360} texto="osteoclastos" color={CLASTO} o={ventana(T.osteoclastos, T.otroLado)} />
      <Tag x={sx(paredIzq - 14)} y={sy(B.encia + 430)} dx={-60} dy={-430} texto="osteoblastos" color={BLASTO} o={ventana(T.osteoblastos, T.avanza)} />
      <Tag x={sx(DIENTES[2])} y={sy(ENCIA + 70)} dx={-60} dy={300} texto="brackets" color="#C8D0D8" o={brillaBrackets} />
      <Tag x={sx(900)} y={sy(ENCIA + 70)} dx={-40} dy={280} texto="alambre" color={C.yellow} o={ventana(T.alambre, T.suave)} />
      <Tag x={sx(550)} y={sy(ENCIA + 150)} dx={0} dy={300} texto="retenedor" color="#B8E8F8" o={ventana(T.retenedor + 0.6, T.fin + 2)} />
    </svg>
  );
};
