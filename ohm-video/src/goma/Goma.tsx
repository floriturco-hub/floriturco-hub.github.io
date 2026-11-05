import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una hoja con un garabato de lápiz que se borra (con pan o con goma); en el centro, el papel
// al microscopio (escamas de grafito sobre las fibras, la goma que las atrapa en virutas, y la tinta que se mete dentro);
// a la derecha, la historia de 1770.
const PAPEL = "#F4F0E4";
const GRAFITO = "#4A4A54";
const GOMA = "#F088A0";
const PAN = "#E8C888";
const ESCAMAS = new Array(28).fill(0).map((_, i) => ({ x: 1420 + random(`ex${i}`) * 860, a: (random(`ea${i}`) - 0.5) * 40 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.15],
  [T.noPintas - 0.3, 550, 1000, 1.18],
  [T.noPintas + 0.5, 1850, 1030, 1.0],
  [T.antes - 0.3, 1850, 1030, 1.02],
  [T.antes + 0.5, 550, 1000, 1.15],
  [T.historia - 0.3, 550, 1000, 1.18],
  [T.historia + 0.5, 3100, 1030, 1.0],
  [T.boli - 0.3, 3100, 1030, 1.02],
  [T.boli + 0.5, 1850, 1030, 1.0],
  [T.borrar - 0.3, 1850, 1030, 1.02],
  [T.borrar + 0.5, 550, 1000, 1.15],
  [T.fin + 2, 550, 1000, 1.2],
];

const garabato = "M 200 900 C 280 760, 360 1040, 440 880 C 520 720, 600 1060, 680 900 C 760 760, 820 1000, 900 880 M 220 1100 C 320 1020, 420 1180, 520 1080 C 620 980, 720 1160, 860 1060";

export const GomaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Hoja: borrador que pasa (pan en el gancho y en «antes»; goma al final)
  const pasa = t < T.noPintas ? interpolate(t, [0.2, 1.8], [0, 1], clamp) : t < T.historia ? interpolate(t, [T.pan - 0.3, T.blanda + 1.4], [0, 1], clamp) : interpolate(t, [T.borrar, T.borrar + 1.8], [0, 1], clamp);
  const borradorX = 160 + 780 * pasa;
  const conPan = t < T.historia;
  const borradorY = 990 + Math.sin(pasa * 40) * 80;

  // Papel al microscopio
  const micro = Math.max(ventana(T.noPintas - 0.3, T.antes + 0.3, 0.6, 0.6), ventana(T.boli - 0.3, T.borrar + 0.3, 0.6, 0.6));
  const bajaGoma = interpolate(t, [T.goma - 0.2, T.goma + 0.5], [0, 1], clamp) * (t < T.antes ? 1 : 0);
  const frota = t > T.frotar && t < T.antes ? Math.sin(t * 12) * 60 : 0;
  const pega = interpolate(t, [T.pegaMas - 0.2, T.pegaMas + 0.8], [0, 1], clamp);
  const virutas = interpolate(t, [T.virutas, T.grises + 0.8], [0, 1], clamp);
  const tinta = t > T.boli ? 1 : 0;

  // Historia
  const historia = ventana(T.historia - 0.3, T.boli + 0.3, 0.6, 0.6);
  const caucho = interpolate(t, [T.caucho - 0.2, T.caucho + 0.4], [0, 1], clamp);
  const mejor = interpolate(t, [T.mejor - 0.2, T.mejor + 0.4], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="borrado">
          <rect x={-300} y={0} width={borradorX + 300} height={2000} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1500} height={2400} fill="#2A2232" />
        {/* Hoja con garabato */}
        <rect x={120} y={620} width={860} height={760} rx={10} fill={PAPEL} />
        {new Array(12).fill(0).map((_, k) => (
          <line key={k} x1={120} y1={680 + k * 60} x2={980} y2={680 + k * 60} stroke="#C8D8E8" strokeWidth={3} />
        ))}
        <path d={garabato} fill="none" stroke={GRAFITO} strokeWidth={14} strokeLinecap="round" />
        <g clipPath="url(#borrado)">
          <rect x={120} y={620} width={860} height={760} fill={PAPEL} opacity={pasa > 0 ? 1 : 0} />
          {new Array(12).fill(0).map((_, k) => (
            <line key={k} x1={120} y1={680 + k * 60} x2={980} y2={680 + k * 60} stroke="#C8D8E8" strokeWidth={3} opacity={pasa > 0 ? 1 : 0} />
          ))}
        </g>
        {pasa > 0 && pasa < 1 ? (
          conPan ? (
            <g transform={`translate(${borradorX} ${borradorY})`}>
              <ellipse rx={70} ry={55} fill={PAN} />
              {[-20, 10, 30].map((d, k) => (
                <circle key={k} cx={d} cy={(k - 1) * 15} r={6} fill="#C8A868" />
              ))}
            </g>
          ) : (
            <rect x={borradorX - 70} y={borradorY - 45} width={140} height={90} rx={14} fill={GOMA} />
          )
        ) : null}
        {/* Migas grises que quedan */}
        {pasa > 0
          ? new Array(10).fill(0).map((_, k) => {
              const x = 160 + k * 80;
              return x < borradorX ? <circle key={k} cx={x} cy={1260 + (k % 3) * 18} r={10} fill={conPan ? "#B8A878" : "#C8A0A8"} stroke={GRAFITO} strokeWidth={3} /> : null;
            })
          : null}

        {/* Papel al microscopio */}
        <g opacity={micro}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {/* Fibras */}
          {new Array(9).fill(0).map((_, k) => (
            <path key={k} d={`M 1360 ${1180 + k * 28} C 1600 ${1150 + k * 28}, 1900 ${1210 + k * 28}, 2340 ${1170 + k * 28}`} fill="none" stroke="#D8C8A8" strokeWidth={22} opacity={0.9} />
          ))}
          {/* Tinta metida en las fibras */}
          {tinta ? <rect x={1360} y={1170} width={980} height={130} fill="#2A3A9A" opacity={0.55} /> : null}
          {/* Escamas de grafito: encima del papel, luego en la goma y en las virutas */}
          {!tinta
            ? ESCAMAS.map((e, i) => {
                const enGoma = pega * (i % 3 !== 0 ? 1 : 0.5);
                const y0 = 1162;
                const y1 = 900 + frota * 0;
                const x = e.x + frota * enGoma;
                const y = y0 + (y1 + 60 - y0) * enGoma * bajaGoma;
                const enViruta = virutas * enGoma;
                return <rect key={i} x={x - 18 + (enViruta * ((i % 5) - 2) * 40)} y={y - 5 - enViruta * 140} width={36} height={10} fill={GRAFITO} transform={`rotate(${e.a} ${x} ${y})`} />;
              })
            : null}
          {/* Goma */}
          {bajaGoma > 0 ? <rect x={1460 + frota} y={600 + 360 * bajaGoma - 260} width={760} height={260} rx={30} fill={GOMA} opacity={1 - virutas * 0.3} /> : null}
          {virutas > 0 && !tinta ? new Array(8).fill(0).map((_, k) => <ellipse key={k} cx={1500 + k * 110} cy={1020 - virutas * 80 + (k % 2) * 30} rx={34} ry={20} fill="#D8A0B0" stroke={GRAFITO} strokeWidth={4} opacity={virutas} />) : null}
        </g>
        <Pildora x={1850} y={1530} texto={tinta ? "tinta: dentro de las fibras" : "grafito: encima, como polvo"} color={tinta ? "#8A9AF8" : C.white} o={Math.max(ventana(T.escamas, T.goma), ventana(T.fibras, T.borrar))} tam={36} />

        {/* Historia: 1770 */}
        <g opacity={historia}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <text x={3100} y={760} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={90} fontWeight={700}>
            1770
          </text>
          <g transform="translate(2850 1080)">
            <path d="M -120 40 C -130 -60, -60 -100, 0 -100 C 60 -100, 130 -60, 120 40 Z" fill={PAN} />
            <text y={110} textAnchor="middle" fill={PAN} fontFamily={mono} fontSize={34} fontWeight={700}>
              pan
            </text>
          </g>
          <g transform="translate(3350 1080)" opacity={0.3 + 0.7 * caucho}>
            <rect x={-110} y={-70} width={220} height={120} rx={20} fill="#8A6A4A" />
            <text y={110} textAnchor="middle" fill="#C8A878" fontFamily={mono} fontSize={34} fontWeight={700}>
              caucho
            </text>
          </g>
          <text x={3350} y={950} textAnchor="middle" fill="#48C878" fontFamily={mono} fontSize={40} fontWeight={700} opacity={mejor}>
            ✓ borra mejor
          </text>
        </g>
      </g>

      <Tag x={sx(1700)} y={sy(1160)} dx={120} dy={-260} texto="escamas de grafito" color={C.white} o={ventana(T.escamas, T.goma)} />
      <Tag x={sx(1600)} y={sy(1200)} dx={120} dy={200} texto="fibras del papel" color="#D8C8A8" o={ventana(T.polvo - 0.6, T.goma + 0.6)} />
      <Tag x={sx(1850)} y={sy(860)} dx={0} dy={-230} texto="goma pegajosa" color={GOMA} o={ventana(T.pegajosa, T.virutas)} />
      <Tag x={sx(1720)} y={sy(960)} dx={-60} dy={-260} texto="virutas grises" color="#D8A0B0" o={ventana(T.virutas + 0.4, T.antes)} />
    </svg>
  );
};
