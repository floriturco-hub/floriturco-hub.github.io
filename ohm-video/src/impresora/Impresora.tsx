import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una impresora y la hoja con su cuadrícula de puntos amarillos (luz azul y lupa);
// en el centro, el código descifrado (número de serie, fecha y hora); a la derecha, para qué sirve (billetes, 2005, 2017).
const AMARILLO = "#F8E030";
const AZUL = "#4A6AF8";
const HOJA = { x0: 230, x1: 870, y0: 560, y1: 1480 };
const COLS = 16;
const FILAS = 22;
const BLOQUE = { c: 8, f: 6 };
// Patrón de un bloque (se repite en toda la hoja)
const PATRON = new Array(BLOQUE.f).fill(0).map((_, f) => new Array(BLOQUE.c).fill(0).map((__, c) => (f === 0 || c === 0 ? 1 : random(`p${f}-${c}`) > 0.55 ? 1 : 0)));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1020, 1.05],
  [T.serie - 0.3, 550, 1020, 1.08],
  [T.serie + 0.5, 1850, 1030, 1.0],
  [T.paraQue - 0.3, 1850, 1030, 1.02],
  [T.paraQue + 0.5, 3100, 1030, 1.0],
  [T.noNombre - 0.3, 3100, 1030, 1.02],
  [T.noNombre + 0.5, 550, 1020, 1.05],
  [T.fin + 2, 550, 1020, 1.1],
];

export const ImpresoraMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Hoja: sale de la impresora y luego la luz azul y la lupa revelan los puntos
  const sale = t < T.muchas ? 1 : interpolate(t, [T.muchas, T.puntitos], [0, 1], clamp);
  const hojaDy = -(HOJA.y1 - HOJA.y0) * (1 - sale);
  const luzAzul = Math.max(interpolate(t, [0.1, 1.2], [0, 1], clamp) * (t < T.muchas ? 1 : 0), ventana(T.lupa, T.serie + 0.3), ventana(T.noNombre, T.fin + 2));
  const barrido = t < T.muchas ? interpolate(t, [0.1, 1.2], [0, 1], clamp) : 1;
  const puntos = Math.max(luzAzul, ventana(T.puntitos, T.amarillo + 0.4) * 0.8);
  const lupa = Math.max(ventana(0.6, T.muchas, 0.3, 0.3), ventana(T.puntitos + 0.4, T.amarillo), ventana(T.lupa + 0.3, T.noAzar));
  const bloques = ventana(T.noAzar, T.serie + 0.3);
  const decima = ventana(T.decima, T.amarillo);

  // Código descifrado
  const codigo = ventana(T.serie - 0.3, T.paraQue + 0.3, 0.6, 0.6);
  const serie = interpolate(t, [T.serie, T.serie + 0.6], [0, 1], clamp);
  const fecha = interpolate(t, [T.fecha, T.fecha + 0.6], [0, 1], clamp);

  // Para qué
  const para = ventana(T.paraQue - 0.3, T.noNombre + 0.3, 0.6, 0.6);
  const falso = interpolate(t, [T.falso, T.falso + 0.3], [0, 1], clamp);
  const maquina = interpolate(t, [T.maquina, T.maquina + 0.5], [0, 1], clamp);
  const a2005 = interpolate(t, [T.anio2005, T.anio2005 + 0.5], [0, 1], clamp);
  const a2017 = interpolate(t, [T.anio2017, T.anio2017 + 0.5], [0, 1], clamp);
  const filtro = interpolate(t, [T.filtro - 0.2, T.filtro + 0.4], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const dx = (HOJA.x1 - HOJA.x0) / (COLS + 1);
  const dy = (HOJA.y1 - HOJA.y0) / (FILAS + 1);
  const hayPunto = (c: number, f: number) => PATRON[f % BLOQUE.f][c % BLOQUE.c] === 1;
  const LUPA: [number, number] = [640, 1000];

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="hojaImp">
          <rect x={HOJA.x0} y={HOJA.y0} width={HOJA.x1 - HOJA.x0} height={HOJA.y1 - HOJA.y0} />
        </clipPath>
        <clipPath id="lupaImp">
          <circle cx={LUPA[0]} cy={LUPA[1]} r={170} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1500} height={2400} fill="#1A1A2A" />
        {/* Hoja */}
        <g clipPath="url(#hojaImp)">
          <rect x={HOJA.x0} y={HOJA.y0 + hojaDy} width={HOJA.x1 - HOJA.x0} height={HOJA.y1 - HOJA.y0} fill="#F8F8F4" />
          {new Array(16).fill(0).map((_, k) => (
            <rect key={k} x={HOJA.x0 + 60} y={HOJA.y0 + hojaDy + 80 + k * 52} width={(HOJA.x1 - HOJA.x0 - 120) * (k % 5 === 4 ? 0.6 : 1)} height={14} rx={7} fill="#B8B8C0" />
          ))}
          <rect x={HOJA.x0} y={HOJA.y0 + hojaDy} width={HOJA.x1 - HOJA.x0} height={(HOJA.y1 - HOJA.y0) * barrido} fill={AZUL} opacity={0.55 * luzAzul} />
          {new Array(FILAS).fill(0).map((_, f) =>
            new Array(COLS).fill(0).map((__, c) =>
              hayPunto(c, f) ? <circle key={`${f}-${c}`} cx={HOJA.x0 + (c + 1) * dx} cy={HOJA.y0 + hojaDy + (f + 1) * dy} r={4} fill={luzAzul > 0.3 ? "#1A1A40" : AMARILLO} opacity={0.12 + 0.88 * puntos} /> : null,
            ),
          )}
          {bloques > 0
            ? [0, 1, 2].map((b) => <rect key={b} x={HOJA.x0 + 0.5 * dx} y={HOJA.y0 + 0.5 * dy + b * BLOQUE.f * dy} width={BLOQUE.c * dx} height={BLOQUE.f * dy} fill="none" stroke={C.cyan} strokeWidth={5} strokeDasharray="14 8" opacity={bloques} />)
            : null}
        </g>
        {/* Impresora */}
        <rect x={170} y={400} width={760} height={180} rx={30} fill="#3A3A48" />
        <rect x={200} y={540} width={700} height={30} rx={10} fill="#1A1A24" />
        <circle cx={860} cy={460} r={14} fill={t < T.puntitos && t > T.muchas ? "#48C878" : "#5A5A66"} />
        {/* Lupa con los puntos ampliados */}
        {lupa > 0 ? (
          <g opacity={lupa}>
            <g clipPath="url(#lupaImp)">
              <rect x={LUPA[0] - 170} y={LUPA[1] - 170} width={340} height={340} fill={luzAzul > 0.3 ? "#8A9AF8" : "#F8F8F4"} />
              {new Array(7).fill(0).map((_, f) =>
                new Array(7).fill(0).map((__, c) =>
                  hayPunto(c, f) ? <circle key={`${f}-${c}`} cx={LUPA[0] - 150 + c * 50} cy={LUPA[1] - 150 + f * 50} r={13} fill={luzAzul > 0.3 ? "#1A1A40" : AMARILLO} /> : null,
                ),
              )}
            </g>
            <circle cx={LUPA[0]} cy={LUPA[1]} r={170} fill="none" stroke="#2A2A30" strokeWidth={20} />
            <line x1={LUPA[0] + 120} y1={LUPA[1] + 120} x2={LUPA[0] + 230} y2={LUPA[1] + 230} stroke="#2A2A30" strokeWidth={30} strokeLinecap="round" />
          </g>
        ) : null}
        <Pildora x={LUPA[0]} y={LUPA[1] + 250} texto="0,1 mm" color={AMARILLO} o={decima} tam={48} />

        {/* Código descifrado */}
        <g opacity={codigo}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {new Array(BLOQUE.f).fill(0).map((_, f) =>
            new Array(BLOQUE.c).fill(0).map((__, c) => (
              <g key={`${f}-${c}`}>
                <circle cx={1500 + c * 100} cy={720 + f * 70} r={8} fill="#3A3A4A" />
                {PATRON[f][c] ? <circle cx={1500 + c * 100} cy={720 + f * 70} r={20} fill={AMARILLO} /> : null}
              </g>
            )),
          )}
          <rect x={1450} y={690 + 70 * 1} width={820} height={160} rx={16} fill="none" stroke={C.cyan} strokeWidth={5} opacity={serie} />
          <rect x={1450} y={690 + 70 * 3} width={820} height={160} rx={16} fill="none" stroke={C.yellow} strokeWidth={5} opacity={fecha} />
          <text x={1850} y={1240} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={44} fontWeight={700} opacity={serie}>
            serie: 5501 2834
          </text>
          <text x={1850} y={1340} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={44} fontWeight={700} opacity={fecha}>
            09/05/2017 · 06:20
          </text>
        </g>

        {/* Para qué: billetes, 2005, 2017 */}
        <g opacity={para}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {/* Billete */}
          <g opacity={1 - a2005}>
            <rect x={2700} y={700} width={460} height={220} rx={16} fill="#5A9A6A" stroke="#3A7A4A" strokeWidth={6} />
            <circle cx={2930} cy={810} r={70} fill="#7ABA8A" />
            <text x={2930} y={828} textAnchor="middle" fill="#2A5A3A" fontFamily={mono} fontSize={52} fontWeight={700}>
              100
            </text>
            <g opacity={falso} transform="rotate(-12 2930 810)">
              <rect x={2790} y={770} width={280} height={80} rx={10} fill="none" stroke={C.red} strokeWidth={8} />
              <text x={2930} y={830} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={48} fontWeight={700}>
                FALSO
              </text>
            </g>
            <g opacity={maquina}>
              <path d="M 3180 810 l 90 0 m -24 -20 l 24 20 l -24 20" fill="none" stroke={C.white} strokeWidth={6} />
              <rect x={3300} y={750} width={220} height={120} rx={16} fill="#3A3A48" />
              <text x={3410} y={830} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>
                #5501…
              </text>
            </g>
          </g>
          {/* 2005: código descifrado */}
          <g opacity={a2005 * (1 - a2017)}>
            <text x={3100} y={760} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>
              2005
            </text>
            <rect x={3020} y={880} width={160} height={130} rx={16} fill="#8A8A9A" />
            <path d={`M 3050 880 L 3050 840 C 3050 790, 3150 790, 3150 ${840 - 40 * a2005}`} fill="none" stroke="#8A8A9A" strokeWidth={18} />
            <text x={3100} y={1100} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              código descifrado
            </text>
          </g>
          {/* 2017: documento filtrado */}
          <g opacity={a2017}>
            <text x={3100} y={760} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>
              2017
            </text>
            <rect x={2950} y={820} width={300} height={400} rx={10} fill="#F8F8F4" />
            <text x={3100} y={890} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={40} fontWeight={700}>
              SECRETO
            </text>
            {new Array(6).fill(0).map((_, k) => (
              <rect key={k} x={2980} y={930 + k * 40} width={240} height={12} rx={6} fill="#B8B8C0" />
            ))}
            {new Array(12).fill(0).map((_, k) => (
              <circle key={k} cx={2980 + (k % 6) * 48} cy={1180 + Math.floor(k / 6) * 20} r={5} fill={AMARILLO} opacity={0.3 + 0.7 * filtro} />
            ))}
            <circle cx={3100} cy={1190} r={110 * filtro} fill="none" stroke={C.cyan} strokeWidth={6} opacity={filtro} />
          </g>
        </g>
      </g>

      <Tag x={sx(HOJA.x0 + dx)} y={sy(HOJA.y0 + 13 * dy)} dx={200} dy={260} texto="puntos amarillos" color={AMARILLO} o={ventana(T.puntitos, T.decima)} />
      <Tag x={sx(HOJA.x0 + 4 * dx)} y={sy(HOJA.y0 + 3 * dy)} dx={140} dy={-200} texto="bloque repetido" color={C.cyan} o={ventana(T.noAzar + 0.3, T.serie)} />
    </svg>
  );
};
