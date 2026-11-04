import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un móvil que se toca con una salchicha, un lápiz y un dedo; en el centro, la rejilla de
// electrodos bajo el cristal; a la derecha, la comparación de dedo, salchicha, lápiz y guante (y sus soluciones).
type P2 = [number, number];
const PIEL = "#C98A64";
const PIEL_OSCURA = "#A86A48";
const MANGA = "#3E6E8E";
const CONTACTO: P2 = [560, 1000];
const REJ = { x0: 1300, x1: 2400, y0: 560, y1: 1540 };
const FILAS = [700, 840, 980, 1120, 1260, 1400];
const COLUMNAS = [1420, 1570, 1720, 1870, 2020, 2170, 2320];
const CRUCE: P2 = [COLUMNAS[3], FILAS[3]];
const COMP = { x0: 2600, x1: 3800, base: 1300 };
const RANURAS = [2750, 3050, 3350, 3650];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1010, 1.12],
  [T.rejilla - 0.4, 560, 1010, 1.14],
  [T.rejilla + 0.6, (REJ.x0 + REJ.x1) / 2, 1080, 0.98],
  [T.salchicha2 - 0.4, (REJ.x0 + REJ.x1) / 2, 1080, 1.0],
  [T.salchicha2 + 0.6, (COMP.x0 + COMP.x1) / 2, 1080, 0.88],
  [T.final - 0.4, (COMP.x0 + COMP.x1) / 2, 1080, 0.9],
  [T.final + 0.6, 560, 1010, 1.12],
  [T.fin, 560, 1010, 1.15],
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

// Objetos dibujados a lo largo del eje +x, con la punta en (0, 0)
const Salchicha: React.FC = () => (
  <g>
    <rect x={0} y={-30} width={270} height={60} rx={30} fill="#C0583A" />
    <path d="M 30 -16 L 240 -16" stroke="#E08A60" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
    <path d="M 60 10 q 10 -8 20 0 M 140 12 q 10 -8 20 0 M 210 8 q 10 -8 20 0" fill="none" stroke="#9A3A20" strokeWidth={4} strokeLinecap="round" />
    <path d="M 268 0 l 22 -10 l 0 20 z" fill="#9A3A20" />
  </g>
);

const Lapiz: React.FC = () => (
  <g>
    <path d="M 0 0 L 16 -6 L 16 6 Z" fill="#3A3A44" />
    <path d="M 16 -6 L 50 -22 L 50 22 L 16 6 Z" fill="#E8C898" />
    <rect x={50} y={-22} width={290} height={44} fill="#F0C030" />
    <rect x={50} y={-22} width={290} height={14} fill="#F8D850" />
    <rect x={50} y={8} width={290} height={14} fill="#C89820" />
    <rect x={340} y={-23} width={34} height={46} fill="#B8BCC8" />
    <path d="M 348 -23 L 348 23 M 362 -23 L 362 23" stroke="#8A8E9A" strokeWidth={3} />
    <rect x={374} y={-22} width={34} height={44} rx={10} fill="#E88A9A" />
  </g>
);

const Lapicero: React.FC = () => (
  <g>
    <path d="M 0 0 C 0 -18, 20 -20, 30 -16 L 30 16 C 20 20, 0 18, 0 0 Z" fill="#1A1A20" />
    <rect x={30} y={-12} width={300} height={24} rx={6} fill="#B8BCC8" />
    <rect x={30} y={-12} width={300} height={7} rx={3} fill="#E0E4EC" />
    <rect x={250} y={-14} width={80} height={28} rx={6} fill="#5A5E6A" />
  </g>
);

// Mano que señala: índice extendido, otros tres dedos doblados, pulgar y manga. `guante`: null, "lana" o "tactil"
const Mano: React.FC<{ readonly guante: null | "lana" | "tactil" }> = ({ guante }) => {
  const piel = guante ? "#6A7A9A" : PIEL;
  const sombra = guante ? "#4A5A7A" : PIEL_OSCURA;
  return (
    <g transform="translate(0 38)">
      {/* Manga */}
      <rect x={300} y={-80} width={260} height={160} rx={30} fill={MANGA} />
      <rect x={300} y={-80} width={40} height={160} rx={10} fill="#2A4C64" />
      <path d="M 360 -60 L 540 -60" stroke="#6898B8" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
      <path d="M 420 40 q 14 -10 28 0 M 470 44 q 14 -10 28 0" fill="none" stroke="#2A4C64" strokeWidth={4} strokeLinecap="round" />
      {/* Palma */}
      <rect x={140} y={-56} width={180} height={120} rx={46} fill={piel} />
      {/* Tres dedos doblados (nudillos) */}
      {[0, 1, 2].map((k) => (
        <rect key={k} x={126 + k * 4} y={-22 + k * 30} width={60} height={34} rx={17} fill={piel} stroke={sombra} strokeWidth={3} />
      ))}
      {/* Pulgar */}
      <path d="M 250 -54 C 220 -86, 170 -90, 150 -70" fill="none" stroke={piel} strokeWidth={30} strokeLinecap="round" />
      <path d="M 162 -78 q 8 -6 16 -2" fill="none" stroke={sombra} strokeWidth={3} strokeLinecap="round" />
      {/* Índice extendido */}
      <rect x={0} y={-56} width={170} height={36} rx={18} fill={piel} />
      <path d="M 70 -50 q 6 8 0 24 M 120 -50 q 6 8 0 24" fill="none" stroke={sombra} strokeWidth={3} strokeLinecap="round" />
      {guante === "lana"
        ? [20, 60, 100, 140].map((x) => <path key={x} d={`M ${x} -54 l 8 10 l 8 -10 M ${x} -30 l 8 10 l 8 -10`} fill="none" stroke="#8A9ABA" strokeWidth={2} />)
        : null}
      {guante === "tactil" ? (
        <g>
          <rect x={0} y={-56} width={36} height={36} rx={18} fill="#C8CCD8" />
          {[0, 1, 2].map((k) => (
            <line key={k} x1={6 + k * 10} y1={-52} x2={6 + k * 10} y2={-24} stroke="#8A8E9A" strokeWidth={2} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// Coloca un objeto con la punta en `punta`, orientado según `angulo` (grados) y separado `lejos` px
const Puesto: React.FC<{ readonly punta: P2; readonly angulo: number; readonly lejos: number; readonly dy?: number; readonly children: React.ReactNode; readonly o?: number }> = ({
  punta,
  angulo,
  lejos,
  dy = 0,
  children,
  o = 1,
}) => {
  const a = (angulo * Math.PI) / 180;
  return (
    <g opacity={o} transform={`translate(${punta[0] + Math.cos(a) * lejos} ${punta[1] + Math.sin(a) * lejos}) rotate(${angulo}) translate(0 ${dy})`}>
      {children}
    </g>
  );
};

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

export const Movil: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Golpecitos: 0 = tocando, 1 = separado
  const toques = (a: number, b: number, periodo: number) => {
    if (t < a || t > b) {
      return 1;
    }
    const f = ((t - a) % periodo) / periodo;
    return f < 0.35 ? 0 : interpolate(f, [0.35, 0.6, 1], [0, 1, 1], clamp);
  };
  const objeto: "salchicha" | "lapiz" | "dedo" = t < 2.4 ? "salchicha" : t < 12 ? "lapiz" : "dedo";
  const sepSalchicha = toques(0, 2.4, 1.1);
  const sepLapiz = t > T.apretar && t < T.nada + 0.4 ? 0 : toques(2.6, 12, 1.2);
  const sepDedo = Math.min(toques(12.2, T.rejilla, 1.2), toques(T.final + 0.4, T.fin + 1, 1.2));
  const separacion = objeto === "salchicha" ? sepSalchicha : objeto === "lapiz" ? sepLapiz : sepDedo;
  const tocando = separacion < 0.05;
  const conduce = objeto !== "lapiz";
  const fuerza = t > T.apretar && t < T.nada + 0.4 ? Math.sin(t * 20) * 4 : 0;
  const onda = tocando && conduce ? ((t * 2) % 1) : 0;

  // Rejilla
  const rejilla = ventana(T.rejilla - 0.6, T.salchicha2 + 0.4, 0.6, 0.6);
  const filas = interpolate(t, [T.filas - 0.4, T.filas + 0.6], [0, 1], clamp);
  const columnas = interpolate(t, [T.filas, T.filas + 1.0], [0, 1], clamp);
  const campo = interpolate(t, [T.campo, T.campo + 0.6], [0, 1], clamp);
  const escaneo = t > T.mide ? Math.floor(t * 24) % (FILAS.length * COLUMNAS.length) : -1;
  const acerca = interpolate(t, [T.dedo, T.acercarlo + 0.6], [1, 0], suave);
  const robo = interpolate(t, [T.acercarlo, T.cambia + 0.4], [0, 1], clamp);
  const sabe = interpolate(t, [T.sabe - 0.2, T.sabe + 0.2], [0, 1], clamp);

  // Comparación
  const comp = ventana(T.salchicha2 - 0.6, T.final + 0.4, 0.6, 0.6);
  const solucion = interpolate(t, [T.porEso, T.porEso + 0.8], [0, 1], suave);
  const medidas = [
    { valor: 0.9, desde: T.salchicha2 - 0.4 },
    { valor: 0.85, desde: T.salchicha2 + 0.2 },
    { valor: 0.08 + 0.72 * interpolate(t, [T.goma, T.goma + 0.6], [0, 1], clamp), desde: T.puntaLapiz },
    { valor: 0.05 + 0.75 * interpolate(t, [T.hilos, T.hilos + 0.6], [0, 1], clamp), desde: T.guante },
  ];

  // Etiquetas
  const tagFilas = ventana(T.filas, T.campo);
  const tagCampo = ventana(T.campo + 0.2, T.mide);
  const tagCruce = ventana(T.mide, T.dedo);
  const tagMedida = ventana(T.cambia - 0.2, T.salchicha2);
  const tagMadera = ventana(T.madera - 0.2, T.guante);
  const tagAislante = ventana(T.aislante - 0.2, T.porEso);
  const tagHilos = ventana(T.hilos - 0.2, T.final);
  const tagGoma = ventana(T.goma - 0.2, T.final);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const angulo = 45;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="fondo-tc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3A2A7A" />
          <stop offset="1" stopColor="#1A4A7A" />
        </linearGradient>
      </defs>
      <g transform={camaraT}>
        {/* Mesa */}
        <rect x={-300} y={200} width={1500} height={1500} fill="#1E1838" />
        {/* Móvil */}
        <rect x={240} y={380} width={600} height={1240} rx={70} fill="#0A0810" stroke="#5A5478" strokeWidth={6} />
        <rect x={272} y={450} width={536} height={1100} rx={40} fill="url(#fondo-tc)" />
        <rect x={480} y={400} width={120} height={22} rx={11} fill="#1A1820" />
        {new Array(20).fill(0).map((_, i) => {
          const c = i % 4;
          const f = Math.floor(i / 4);
          const x = 320 + c * 120;
          const y = 520 + f * 140;
          const bajoDedo = Math.abs(x + 40 - CONTACTO[0]) < 60 && Math.abs(y + 40 - CONTACTO[1]) < 70;
          const colores = ["#E8414F", "#48C878", "#F8C848", "#08D8E8", "#A87AE8"];
          return <rect key={i} x={x} y={y} width={80} height={80} rx={20} fill={colores[(i * 3) % 5]} opacity={bajoDedo && tocando && conduce ? 1 : 0.75} stroke={bajoDedo && tocando && conduce ? "#FFFFFF" : "none"} strokeWidth={6} />;
        })}
        {/* Respuesta al toque */}
        {onda > 0 ? <circle cx={CONTACTO[0]} cy={CONTACTO[1]} r={20 + onda * 90} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={1 - onda} /> : null}
        {tocando && conduce && t < T.rejilla ? (
          <g>
            {[0, 1, 2, 3].map((k) => (
              <path key={k} d={`M ${CONTACTO[0]} ${CONTACTO[1]} l ${Math.cos(k * 1.6) * 30} ${Math.sin(k * 1.6) * 30} l ${Math.cos(k * 1.6 + 0.6) * 20} ${Math.sin(k * 1.6 + 0.6) * 20}`} fill="none" stroke={C.yellow} strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(t * 30 + k)} />
            ))}
          </g>
        ) : null}
        {tocando && !conduce ? (
          <g transform={`translate(${CONTACTO[0] - 120} ${CONTACTO[1] - 120})`}>
            <circle r={44} fill={C.red} />
            <path d="M -18 -18 L 18 18 M 18 -18 L -18 18" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}
        {tocando && conduce && t < T.rejilla ? (
          <g transform={`translate(${CONTACTO[0] - 120} ${CONTACTO[1] - 120})`}>
            <circle r={44} fill="#48C878" />
            <path d="M -18 0 L -4 14 L 20 -14" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
        {/* Presión con el lápiz: flechas */}
        {t > T.apretar && t < T.nada + 0.4 ? (
          <g opacity={0.9}>
            {[0, 1].map((k) => (
              <path key={k} d={`M ${CONTACTO[0] + 260 + k * 40} ${CONTACTO[1] + 200 + k * 40} l -60 -60 m 0 30 l 0 -30 l 30 0`} fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>
        ) : null}
        {/* Objeto que toca */}
        {t < T.rejilla + 0.5 || t > T.final - 0.2 ? (
          <Puesto punta={[CONTACTO[0] + fuerza, CONTACTO[1] + fuerza]} angulo={angulo} lejos={8 + 70 * separacion}>
            {objeto === "salchicha" ? <Salchicha /> : objeto === "lapiz" ? <Lapiz /> : <Mano guante={null} />}
          </Puesto>
        ) : null}

        {/* Rejilla bajo el cristal */}
        <g opacity={rejilla}>
          <rect x={REJ.x0} y={REJ.y0} width={REJ.x1 - REJ.x0} height={REJ.y1 - REJ.y0} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          {FILAS.map((y, i) => (
            <rect key={i} x={REJ.x0 + 40} y={y - 6} width={(REJ.x1 - REJ.x0 - 80) * filas} height={12} rx={6} fill={C.cyan} opacity={0.75} />
          ))}
          {COLUMNAS.map((x, i) => (
            <rect key={i} x={x - 6} y={REJ.y0 + 40} width={12} height={(REJ.y1 - REJ.y0 - 80) * columnas} rx={6} fill={C.yellow} opacity={0.75} />
          ))}
          {/* Campo en cada cruce */}
          {campo > 0
            ? FILAS.map((y, i) =>
                COLUMNAS.map((x, j) => {
                  const esCruce = x === CRUCE[0] && y === CRUCE[1];
                  const sube = esCruce ? robo : 0;
                  return (
                    <path
                      key={`${i}-${j}`}
                      d={`M ${x - 6} ${y - 8} Q ${x - 30} ${y - 40 - 80 * sube} ${x - 50} ${y - 6} M ${x + 6} ${y - 8} Q ${x + 30} ${y - 40 - 80 * sube} ${x + 50} ${y - 6}`}
                      fill="none"
                      stroke="#E8E6F0"
                      strokeWidth={3}
                      opacity={campo * 0.6}
                    />
                  );
                }),
              )
            : null}
          {/* Escaneo: el teléfono mide cada cruce */}
          {escaneo >= 0 && t < T.acercarlo ? (
            <circle cx={COLUMNAS[escaneo % COLUMNAS.length]} cy={FILAS[Math.floor(escaneo / COLUMNAS.length)]} r={28} fill="none" stroke="#FFFFFF" strokeWidth={5} />
          ) : null}
          {/* Cruce tocado */}
          {robo > 0 ? <circle cx={CRUCE[0]} cy={CRUCE[1]} r={30 + 10 * Math.sin(t * 8)} fill={C.red} opacity={0.35 + 0.4 * robo} /> : null}
          {sabe > 0 ? (
            <g opacity={sabe} transform={`translate(${CRUCE[0] - 220} ${CRUCE[1] - 90})`}>
              <rect x={-110} y={-34} width={220} height={60} rx={14} fill="#1A1430" stroke={C.red} strokeWidth={4} />
              <text x={0} y={8} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
                x4 · y4
              </text>
            </g>
          ) : null}
          {/* Dedo que se acerca */}
          {t > T.dedo - 0.4 ? (
            <Puesto punta={[CRUCE[0] + 10, CRUCE[1] + 10]} angulo={angulo} lejos={20 + 520 * acerca}>
              <Mano guante={null} />
            </Puesto>
          ) : null}
        </g>

        {/* Comparación */}
        <g opacity={comp}>
          <rect x={COMP.x0} y={REJ.y0} width={COMP.x1 - COMP.x0} height={REJ.y1 - REJ.y0} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <rect x={COMP.x0 + 40} y={COMP.base} width={COMP.x1 - COMP.x0 - 80} height={40} rx={12} fill="url(#fondo-tc)" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <rect key={k} x={COMP.x0 + 80 + k * 140} y={COMP.base + 14} width={8} height={12} fill={C.yellow} opacity={0.6} />
          ))}
          {/* Umbral */}
          <line x1={COMP.x0 + 60} y1={780 - 0.3 * 160} x2={COMP.x1 - 60} y2={780 - 0.3 * 160} stroke={C.red} strokeWidth={3} strokeDasharray="10 8" />
          <text x={COMP.x1 - 70} y={780 - 0.3 * 160 - 12} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={22} fontWeight={700}>
            umbral
          </text>
          {RANURAS.map((x, i) => {
            const m = medidas[i];
            const o = interpolate(t, [m.desde, m.desde + 0.4], [0, 1], clamp);
            const ok = m.valor > 0.3;
            return (
              <g key={i} opacity={o}>
                <rect x={x - 22} y={620} width={44} height={160} rx={10} fill="#2A2440" />
                <rect x={x - 22} y={780 - 160 * m.valor} width={44} height={160 * m.valor} rx={10} fill={ok ? "#48C878" : C.red} />
                <g transform={`translate(${x} 1480)`}>
                  <circle r={30} fill={ok ? "#48C878" : C.red} />
                  {ok ? (
                    <path d="M -12 0 L -3 10 L 14 -10" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M -10 -10 L 10 10 M 10 -10 L -10 10" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
                  )}
                </g>
                <Puesto punta={[x, COMP.base - 4]} angulo={-90} lejos={0}>
                  <g transform="scale(0.55)">
                    {i === 0 ? <Mano guante={null} /> : null}
                    {i === 1 ? <Salchicha /> : null}
                    {i === 2 ? (
                      <g>
                        <g opacity={1 - solucion}>
                          <Lapiz />
                        </g>
                        <g opacity={solucion}>
                          <Lapicero />
                        </g>
                      </g>
                    ) : null}
                    {i === 3 ? <Mano guante={solucion > 0.5 ? "tactil" : "lana"} /> : null}
                  </g>
                </Puesto>
              </g>
            );
          })}
        </g>
      </g>

      <Tag x={sx(COLUMNAS[0])} y={sy(FILAS[0])} dx={140} dy={-150} texto="cables transparentes" color={C.cyan} o={tagFilas} />
      <Tag x={sx(COLUMNAS[1])} y={sy(FILAS[1] - 30)} dx={100} dy={-160} texto="campo eléctrico" color={C.white} o={tagCampo} />
      <Tag x={sx(COLUMNAS[5])} y={sy(FILAS[0])} dx={0} dy={-140} texto="mide cada cruce" color={C.white} o={tagCruce} />
      <Tag x={sx(CRUCE[0])} y={sy(CRUCE[1])} dx={-200} dy={-200} texto="la medida cambia" color={C.red} o={tagMedida} />
      <Tag x={sx(RANURAS[2])} y={sy(COMP.base - 120)} dx={0} dy={-200} texto="madera: aísla" color={C.red} o={tagMadera} />
      <Tag x={sx(RANURAS[3])} y={sy(COMP.base - 120)} dx={-60} dy={-200} texto="aislante" color={C.red} o={tagAislante} />
      <Tag x={sx(RANURAS[3])} y={sy(COMP.base - 10)} dx={-90} dy={130} texto="hilos conductores" color={"#48C878"} o={tagHilos} />
      <Tag x={sx(RANURAS[2])} y={sy(COMP.base - 10)} dx={-60} dy={220} texto="goma conductora" color={"#48C878"} o={tagGoma} />
    </svg>
  );
};
