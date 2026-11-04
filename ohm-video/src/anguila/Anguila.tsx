import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Pildora, Panel, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el río con el pez eléctrico (rayos X: órganos delante, batería en la cola, grasa y la
// corriente que sale por el agua); a la derecha, los electrocitos apilados en serie y la orden del cerebro.
const CABEZA_X = 150;
const LARGO = 900;
const EJE_Y = 1000;
const ORGANO = 0.22;
const AMARILLO = "#F8D848";
const CORAZON = "#E8414F";

const RAYOS = new Array(9).fill(0).map((_, i) => ({ u: 0.25 + random(`ru${i}`) * 0.7, lado: random(`rl${i}`) > 0.5 ? 1 : -1, l: 70 + random(`rl2${i}`) * 90 }));
const PLANTAS = new Array(9).fill(0).map((_, i) => ({ x: -250 + i * 170 + random(`px${i}`) * 60, h: 160 + random(`ph${i}`) * 220 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 530, 980, 1.5],
  [T.bateria - 0.3, 530, 980, 1.56],
  [T.bateria + 0.4, 600, 1000, 1.18],
  [T.dentro - 0.3, 600, 1000, 1.22],
  [T.dentro + 0.5, 1850, 1030, 1.0],
  [T.corazon - 0.3, 1850, 1030, 1.02],
  [T.corazon + 0.5, 400, 1000, 1.55],
  [T.tercero - 0.3, 400, 1000, 1.58],
  [T.tercero + 0.5, 600, 1000, 1.15],
  [T.fin + 2, 600, 1000, 1.2],
];

export const AnguilaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.04, a + 0.5], [0, 1, 0], clamp);

  // Descargas: dos en el gancho, una con la orden del cerebro y una al final
  const descarga = Math.max(destello(0.25), destello(1.05), destello(T.zas), destello(T.afuera));
  const rayosX = Math.max(ventana(T.bateria, T.dentro + 0.3), ventana(T.corazon, T.fin + 2));
  const grasa = interpolate(t, [T.grasa, T.grasa + 0.5], [0, 1], clamp);
  const corriente = ventana(T.corriente, T.fin + 2);
  const lejos = ventana(T.cabeza - 0.4, T.segundo);

  // Cuerpo del pez: línea central ondulante y grosor que se afina hacia la cola
  const centro = (u: number): [number, number] => [CABEZA_X + u * LARGO, EJE_Y + Math.sin(u * 7 - t * 3) * 26 * u];
  const ancho = (u: number) => 88 * (1 - u * 0.85);
  const N = 40;
  const borde = (lado: number) => new Array(N + 1).fill(0).map((_, i) => {
    const u = i / N;
    const [x, y] = centro(u);
    return [x, y + lado * ancho(u)] as [number, number];
  });
  const arriba = borde(-1);
  const abajo = borde(1);
  const cuerpo = `M ${CABEZA_X - 50} ${EJE_Y} Q ${CABEZA_X - 40} ${EJE_Y - 60} ${arriba[0][0]} ${arriba[0][1]} ${arriba.map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} ${abajo
    .slice()
    .reverse()
    .map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ")} Q ${CABEZA_X - 40} ${EJE_Y + 60} ${CABEZA_X - 50} ${EJE_Y} Z`;
  const vientre = `M ${abajo[0][0]} ${abajo[0][1] - 14} ${abajo.map(([x, y], i) => `L ${x.toFixed(1)} ${(y - 14 * (1 - i / N)).toFixed(1)}`).join(" ")}`;

  // Pez presa que queda aturdido
  const aturdido = interpolate(t, [0.3, 0.6], [0, 1], clamp);
  const presaX = CABEZA_X + 120 + Math.sin(t * 2) * 10 * (1 - aturdido);
  const presaY = 820 - 50 * aturdido;

  // Electrocitos
  const pila = ventana(T.dentro - 0.3, T.corazon + 0.3, 0.6, 0.6);
  const encendidas = interpolate(t, [T.cada, T.suman], [1, 4000], { ...clamp, easing: (x) => x * x * x });
  const voltios = Math.min(600, encendidas * 0.15);
  const orden = interpolate(t, [T.cerebro, T.vez + 0.3], [0, 1], clamp);
  const todas = destello(T.zas) + (t > T.zas ? 0 : 0);
  const pilasAA = ventana(T.pilas - 0.2, T.cada + 0.6);
  const filasCel = 12;
  const colsCel = 6;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const [hx, hy] = centro(0.06);
  const [cx0, cy0] = centro(ORGANO);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Río */}
        <rect x={-400} y={-400} width={1700} height={2400} fill="#123A3A" opacity={0.75} />
        <rect x={-400} y={-400} width={1700} height={2400} fill="#F8F0A8" opacity={0.25 * descarga} />
        <path d="M -400 1500 Q 100 1460 600 1500 T 1300 1490 L 1300 2000 L -400 2000 Z" fill="#3A3424" />
        {PLANTAS.map((p, i) => (
          <path key={i} d={`M ${p.x} 1500 Q ${p.x + 30 + Math.sin(t + i) * 20} ${1500 - p.h / 2} ${p.x + Math.sin(t * 0.8 + i) * 30} ${1500 - p.h}`} fill="none" stroke="#2A6A3A" strokeWidth={14} strokeLinecap="round" />
        ))}
        {/* Corriente que sale por el agua: de + (detrás de la cabeza) a − (cola) */}
        {corriente > 0
          ? [0, 1, 2].map((k) =>
              [-1, 1].map((lado) => (
                <path
                  key={`${k}-${lado}`}
                  d={`M ${cx0} ${cy0 + lado * 50} C ${cx0 + 120} ${EJE_Y + lado * (220 + k * 120)}, ${CABEZA_X + LARGO - 160} ${EJE_Y + lado * (220 + k * 120)}, ${CABEZA_X + LARGO} ${EJE_Y + lado * 12}`}
                  fill="none"
                  stroke={AMARILLO}
                  strokeWidth={5}
                  strokeDasharray="20 14"
                  strokeDashoffset={-t * 80}
                  opacity={corriente * 0.8}
                />
              )),
            )
          : null}
        {/* Presa */}
        <g transform={`translate(${presaX} ${presaY}) rotate(${150 * aturdido})`}>
          <ellipse rx={44} ry={18} fill={aturdido > 0.5 ? "#C8C8B8" : "#E8A848"} />
          <path d="M 40 0 l 26 -18 l 0 36 z" fill={aturdido > 0.5 ? "#C8C8B8" : "#E8A848"} />
          <circle cx={-26} cy={-4} r={4} fill="#1A1A20" />
        </g>
        {/* Pez eléctrico */}
        <path d={cuerpo} fill="#4A4A30" />
        <path d={vientre} fill="none" stroke="#E8883A" strokeWidth={14} strokeLinecap="round" opacity={0.9} />
        <circle cx={CABEZA_X - 20} cy={EJE_Y - 18} r={7} fill="#1A1A20" />
        <path d={`M ${CABEZA_X - 50} ${EJE_Y + 4} L ${CABEZA_X - 20} ${EJE_Y + 10}`} stroke="#1A1A20" strokeWidth={4} />
        {/* Rayos X: órganos delante, batería en la cola */}
        <g opacity={rayosX}>
          <path d={cuerpo} fill="#0B0920" opacity={0.55} />
          {new Array(Math.round((1 - ORGANO) * 46)).fill(0).map((_, k) => {
            const u = ORGANO + (k / 46) * 1;
            if (u > 0.97) {
              return null;
            }
            const [x, y] = centro(u);
            const w = ancho(u) * 0.8;
            return <rect key={k} x={x - 5} y={y - w} width={10} height={w * 2} rx={4} fill={AMARILLO} opacity={0.45 + 0.55 * descarga} />;
          })}
          <circle cx={hx + 20} cy={hy} r={20} fill={CORAZON} />
          <circle cx={CABEZA_X - 4} cy={EJE_Y - 6} r={16} fill="#E8A8C8" />
          <ellipse cx={(CABEZA_X + cx0) / 2} cy={EJE_Y} rx={(cx0 - CABEZA_X) / 2 + 30} ry={60} fill="none" stroke="#F8E8A8" strokeWidth={12} opacity={0.75 * grasa} />
          <text x={cx0 + 10} y={cy0 - 70} fill={C.red} fontFamily={mono} fontSize={44} fontWeight={700}>
            +
          </text>
          <text x={CABEZA_X + LARGO - 20} y={centro(1)[1] - 40} fill={C.cyan} fontFamily={mono} fontSize={44} fontWeight={700}>
            −
          </text>
        </g>
        {/* Distancia del corazón a la batería */}
        {lejos > 0 ? (
          <g opacity={lejos}>
            <path d={`M ${hx + 20} ${EJE_Y + 110} L ${cx0} ${EJE_Y + 110}`} stroke={C.white} strokeWidth={4} markerEnd="" />
            <path d={`M ${hx + 20} ${EJE_Y + 96} l 0 28 M ${cx0} ${EJE_Y + 96} l 0 28`} stroke={C.white} strokeWidth={4} />
          </g>
        ) : null}
        {/* Rayos de la descarga */}
        {descarga > 0
          ? RAYOS.map((r, i) => {
              const [x, y] = centro(r.u);
              const pts = new Array(5).fill(0).map((_, k) => `${x + (random(`z${i}-${k}-${Math.floor(t * 20)}`) - 0.5) * 40} ${y + r.lado * (ancho(r.u) + (k * r.l) / 4)}`);
              return <path key={i} d={`M ${pts.join(" L ")}`} fill="none" stroke={AMARILLO} strokeWidth={6} strokeLinejoin="round" opacity={descarga} />;
            })
          : null}
        <Pildora x={520} y={700} texto="600 V" color={AMARILLO} o={ventana(-1, T.noEs)} tam={80} />

        {/* Electrocitos en serie */}
        <g opacity={pila}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {/* Cerebro y nervios */}
          <circle cx={1440} cy={720} r={50} fill="#E8A8C8" />
          {new Array(filasCel).fill(0).map((_, f) => (
            <path key={f} d={`M 1440 770 L 1440 ${830 + f * 46} L 1530 ${830 + f * 46}`} fill="none" stroke="#8A84A8" strokeWidth={3} />
          ))}
          {orden > 0 && orden < 1
            ? new Array(filasCel).fill(0).map((_, f) => <circle key={f} cx={1440 + 90 * orden} cy={770 + (60 + f * 46) * Math.min(1, orden * 1.5)} r={8} fill={AMARILLO} />)
            : null}
          {new Array(filasCel).fill(0).map((_, f) =>
            new Array(colsCel).fill(0).map((__, c) => {
              const idx = f * colsCel + c;
              const lit = encendidas >= ((idx + 1) / (filasCel * colsCel)) * 4000 * 0.25 || t > T.suman ? 1 : 0;
              return (
                <g key={`${f}-${c}`}>
                  <rect x={1540 + c * 112} y={810 + f * 46} width={100} height={36} rx={8} fill={AMARILLO} opacity={0.25 + 0.45 * lit + 0.3 * todas} />
                  <text x={1550 + c * 112} y={836 + f * 46} fill="#1A1430" fontFamily={mono} fontSize={20} fontWeight={700}>
                    + −
                  </text>
                </g>
              );
            }),
          )}
          <text x={1850} y={690} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={56} fontWeight={700} opacity={interpolate(t, [T.cada - 0.2, T.cada + 0.2], [0, 1], clamp)}>
            {`${voltios < 10 ? voltios.toFixed(2).replace(".", ",") : Math.round(voltios)} V`}
          </text>
          {/* Pilas AA como comparación */}
          <g opacity={pilasAA} transform="translate(1850 1400)">
            {[-2, -1, 0, 1, 2].map((k) => (
              <g key={k} transform={`translate(${k * 120} 0)`}>
                <rect x={-50} y={-22} width={100} height={44} rx={8} fill="#3A3440" stroke="#8A84A8" strokeWidth={3} />
                <rect x={50} y={-10} width={10} height={20} rx={3} fill="#8A84A8" />
              </g>
            ))}
          </g>
        </g>
        <Pildora x={1850} y={1400} texto="2 ms" color={AMARILLO} o={ventana(T.descarga, T.corazon)} tam={56} />
        <Pildora x={1850} y={560} texto="¡ZAS!" color={C.red} o={ventana(T.zas, T.descarga + 0.6, 0.05, 0.3)} tam={60} />
      </g>

      <Tag x={sx(cx0 + 200)} y={sy(EJE_Y)} dx={60} dy={-260} texto="batería: 80 %" color={AMARILLO} o={ventana(T.bateria + 0.2, T.dentro + 0.3)} />
      <Tag x={sx(hx + 20)} y={sy(hy)} dx={-40} dy={-230} texto="corazón" color={CORAZON} o={ventana(T.primero, T.segundo)} />
      <Tag x={sx((hx + cx0) / 2)} y={sy(EJE_Y + 110)} dx={0} dy={160} texto="lejos" color={C.white} o={lejos} />
      <Tag x={sx((CABEZA_X + cx0) / 2)} y={sy(EJE_Y - 60)} dx={40} dy={-230} texto="grasa" color="#F8E8A8" o={ventana(T.grasa, T.tercero)} />
      <Tag x={sx(1530)} y={sy(830)} dx={0} dy={-170} texto="electrocitos" color={AMARILLO} o={ventana(T.electrocitos, T.cada)} />
    </svg>
  );
};
