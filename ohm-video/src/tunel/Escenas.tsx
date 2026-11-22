import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { GraficaGravedad, GraficaOscilacion, Marcador, Saltador, Termometro, Tierra } from "./Piezas";

// Instantes clave (s) de public/audio/tunel/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  llegas: 2.48,
  cuarenta: 3.54,
  luego: 4.7,
  imagina: 6.84,
  sinAire: 9.42,
  saltas: 10.36,
  pero: 13.16,
  menos: 14.4,
  gravedad: 17.24,
  centro: 19.22,
  ahi: 20.64,
  ocho: 21.7,
  kmh: 23.6,
  desde: 26.16,
  frena: 27.3,
  llegas2: 28.56,
  detienes: 30.86,
  vuelves: 32.56,
  ida: 33.82,
  ciclo: 35.64,
  flotando: 37.84,
  loco: 40.22,
  cualquier: 41.22,
  tarda: 43.96,
  claro: 46.56,
  aire: 47.94,
  nucleo: 49.04,
  grados: 50.06,
  papel: 51.5,
  ciudad: 52.94,
  sinMotor: 56.28,
  fin: 57.1,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);
const VMAX = 28460; // km/h en el centro (modelo de densidad uniforme)

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

// Posición en el túnel: fase 0 = superficie de arriba, pi = superficie de abajo
const yTunel = (cy: number, R: number, fase: number) => cy - R * Math.cos(fase);
const reloj = (min: number) => {
  const m = Math.floor(min);
  const s = Math.floor((min - m) * 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
const kmh = (fase: number) => Math.round((VMAX * Math.abs(Math.sin(fase))) / 100) * 100;
const miles = (n: number) => n.toLocaleString("es-ES").replace(/,/g, ".");

// Estela de velocidad detrás del saltador
const Estela: React.FC<{ readonly x: number; readonly y: number; readonly v: number; readonly dir: 1 | -1 }> = ({ x, y, v, dir }) => (
  <g opacity={Math.min(1, v)}>
    {[-10, 0, 10].map((dx, k) => (
      <line key={k} x1={x + dx} y1={y - dir * 50} x2={x + dx} y2={y - dir * (50 + 90 * v)} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    ))}
  </g>
);

// A. Gancho: saltas, 42 minutos, y vuelves
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ida = interpolate(t, [0.25, T.cuarenta + 0.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const vuelta = interpolate(t, [T.luego, T.imagina + 0.4], [0, 0.55], { ...clamp, easing: Easing.in(Easing.sin) });
  const fase = Math.PI * (ida - vuelta);
  const y = yTunel(980, 400, fase);
  const flash = interpolate(t, [T.cuarenta, T.cuarenta + 0.08, T.cuarenta + 0.45], [0, 0.25, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.imagina], [1, 1.05])}>
        <Tierra cx={540} cy={980} R={400} t={t} />
        <Estela x={540} y={y} v={Math.abs(Math.sin(fase))} dir={vuelta > 0 ? -1 : 1} />
        <Saltador x={540} y={y} s={1.1} rot={vuelta > 0 ? 0 : 180 * Math.min(1, ida * 3)} />
        <Marcador x={540} y={300} titulo="tiempo de caída" valor={reloj(42 * (ida + vuelta))} />
        {vuelta > 0 ? (
          <g opacity={aparece(t, T.luego)}>
            <path d="M 640 1300 Q 700 1000 640 700" stroke={C.cyan} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="20 14" />
            <path d="M 615 735 L 640 700 L 668 732" stroke={C.cyan} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// B. Caes cada vez más rápido
export const Caida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fase = interpolate(t, [T.saltas, T.pero + 0.2], [0, 0.9], { ...clamp, easing: Easing.in(Easing.quad) });
  const y = yTunel(900, 420, fase);
  const sinAire = aparece(t, T.sinAire);
  const barrido = interpolate(t, [T.imagina + 0.5, T.imagina + 2.2], [0, 1], suave);
  const brilloTunel = interpolate(t, [T.imagina + 0.5, T.imagina + 0.8, T.saltas, T.saltas + 0.6], [0, 0.45, 0.45, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.imagina, T.pero], [1, 1.04])}>
      <Tierra cx={540} cy={900} R={420} t={t} />
      <rect x={522} y={900 - 420 - 26} width={36} height={(2 * 420 + 52) * barrido} rx={10} fill={C.cyan} opacity={brilloTunel} />
      <g opacity={aparece(t, T.imagina + 1.6) * (1 - aparece(t, T.saltas))}>
        <text x={600} y={900 - 420 + 10} fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>de lado</text>
        <text x={600} y={900 + 420 + 10} fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>a lado</text>
      </g>
      <Estela x={540} y={y} v={Math.sin(fase) * 1.4} dir={1} />
      <Saltador x={540} y={y} s={1.2} rot={180} />
      <Marcador x={540} y={280} titulo="velocidad" valor={`${miles(kmh(fase))} km/h`} color={C.cyan} w={520} />
      <g opacity={sinAire} transform="translate(860 520)">
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M -60 ${-30 + k * 30} q 30 -18 60 0 t 60 0`} stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
        <line x1={-70} y1={-60} x2={70} y2={70} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
        <text x={0} y={130} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>sin aire</text>
      </g>
    </Lienzo>
  );
};

// C. Cuanto más bajas, menos Tierra tira de ti
export const Gravedad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fase = interpolate(t, [T.pero, T.centro + 0.6], [0.9, Math.PI / 2], suave);
  const R = 360;
  const cy = 740;
  const y = yTunel(cy, R, fase);
  const r = Math.abs(cy - y);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.ahi], [1, 1.03])}>
      <Tierra cx={540} cy={cy} R={R} t={t} esfera={t > T.menos - 0.2 ? Math.max(2, r) : 0} />
      <Saltador x={540} y={y} s={1.1} rot={180} />
      <g opacity={aparece(t, T.menos)}>
        <text x={540 + R * 0.72} y={cy - R * 0.85} fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>tira de ti</text>
        <text x={540 - R - 10} y={cy - R * 0.92} fill={C.grey} fontFamily={mono} fontSize={28} textAnchor="start">se anula</text>
      </g>
      <g opacity={aparece(t, T.gravedad)}>
        <GraficaGravedad x={120} y={1180} w={840} h={300} f={r / R} dibujo={interpolate(t, [T.gravedad, T.gravedad + 0.8], [0, 1], clamp)} />
      </g>
    </Lienzo>
  );
};

// D. En el centro, velocidad máxima
export const Centro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const R = 360;
  const cy = 800;
  const fase = Math.PI / 2 + Math.sin((t - T.ahi) * 3) * 0.04;
  const y = yTunel(cy, R, fase);
  const valor = t < T.kmh ? "7,9 km/s" : `${miles(Math.round(interpolate(t, [T.kmh, T.kmh + 0.9], [0, 28000], clamp)))} km/h`;
  return (
    <Lienzo zoom={interpolate(t, [T.ahi, T.desde], [1, 1.06])}>
      <Tierra cx={540} cy={cy} R={R} t={t} />
      <Estela x={540} y={y} v={1.2} dir={1} />
      <Saltador x={540} y={y} s={1.1} rot={180} />
      <g opacity={aparece(t, T.ocho)}>
        <Marcador x={540} y={1340} titulo="en el centro" valor={valor} color={C.yellow} w={600} />
      </g>
    </Lienzo>
  );
};

// E. La gravedad te frena, llegas al otro lado y vuelves
export const Oscila: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const R = 330;
  const cy = 690;
  const baja = interpolate(t, [T.desde, T.detienes], [Math.PI / 2, Math.PI], { ...clamp, easing: Easing.out(Easing.sin) });
  const sube = interpolate(t, [T.vuelves, T.ida + 1.2], [0, 0.6], { ...clamp, easing: Easing.in(Easing.sin) });
  const fase = baja - sube;
  const y = yTunel(cy, R, fase);
  const flota = aparece(t, T.flotando);
  return (
    <Lienzo zoom={interpolate(t, [T.desde, T.loco], [1, 1.04])}>
      <Tierra cx={540} cy={cy} R={R} t={t} />
      <Saltador x={540} y={y + Math.sin(t * 2.5) * 6 * flota} s={1.05} rot={sube > 0 ? 0 : 180} />
      <g opacity={flota}>
        <text x={620} y={y + 10} fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>flotando</text>
      </g>
      <g opacity={aparece(t, T.ida)}>
        <GraficaOscilacion x={100} y={1100} w={880} h={340} dibujo={interpolate(t, [T.ida, T.ciclo + 0.6], [0, 1], clamp)} marcas={aparece(t, T.ciclo)} />
      </g>
    </Lienzo>
  );
};

// F. Cualquier túnel recto tarda lo mismo
const CUERDAS: [number, number][] = [
  [-150, -30],
  [-115, 25],
  [160, 40],
  [-70, 115],
  [200, 95],
];
export const Cuerdas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const R = 400;
  const cx = 540;
  const cy = 860;
  const pt = (a: number): [number, number] => [cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)];
  return (
    <Lienzo zoom={interpolate(t, [T.loco, T.claro], [1, 1.04])}>
      <Tierra cx={cx} cy={cy} R={R} t={t} tunel={false} />
      {CUERDAS.map(([a, b], k) => {
        const p = pt(a);
        const q = pt(b);
        const op = aparece(t, T.cualquier + k * 0.35);
        const u = 0.5 - 0.5 * Math.cos(((t - T.cualquier) * 0.9 + k) * Math.PI);
        const sx = p[0] + (q[0] - p[0]) * u;
        const sy = p[1] + (q[1] - p[1]) * u;
        const mx = (p[0] + q[0]) / 2;
        const my = (p[1] + q[1]) / 2;
        return (
          <g key={k} opacity={op}>
            <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#0B091D" strokeWidth={22} strokeLinecap="round" />
            <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#5A5478" strokeWidth={4} strokeLinecap="round" strokeDasharray="10 10" />
            <circle cx={sx} cy={sy} r={12} fill={C.white} />
            <g opacity={aparece(t, T.tarda + k * 0.12)}>
              <rect x={mx - 70} y={my - 26} width={140} height={46} rx={23} fill={C.card} stroke={C.yellow} strokeWidth={3} />
              <text x={mx} y={my + 7} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={28} fontWeight={700}>42 min</text>
            </g>
          </g>
        );
      })}
    </Lienzo>
  );
};

// G. En la realidad: el aire y el calor del núcleo
export const Realidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const viento = aparece(t, T.aire);
  const calor = interpolate(t, [T.nucleo, T.nucleo + 0.8], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.claro, T.papel], [1, 1.04])}>
      <Tierra cx={450} cy={860} R={360} t={t} calor={calor} />
      <g opacity={viento}>
        {[0, 1, 2, 3].map((k) => {
          const yy = 560 + ((t * 260 + k * 90) % 360);
          return <path key={k} d={`M 436 ${yy} q 14 -16 0 -32 q -14 -16 0 -32`} stroke={C.white} strokeWidth={5} fill="none" opacity={0.7} />;
        })}
        <text x={450} y={430} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>el aire te frena</text>
      </g>
      <g opacity={aparece(t, T.grados)}>
        <Termometro x={900} y={880} nivel={interpolate(t, [T.grados, T.grados + 0.8], [0.1, 0.95], clamp)} texto="5.000 °C" />
      </g>
    </Lienzo>
  );
};

// H. Cierre: cualquier ciudad en 42 minutos
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const R = 380;
  const cx = 540;
  const cy = 900;
  const origen = -120;
  const destinos = [-40, 5, 50, 110, 165];
  const pt = (a: number): [number, number] => [cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)];
  const o = pt(origen);
  return (
    <Lienzo zoom={interpolate(t, [T.papel, T.fin + 0.5], [1, 1.06])}>
      <Tierra cx={cx} cy={cy} R={R} t={t} tunel={false} />
      {destinos.map((a, k) => {
        const d = pt(a);
        const p = interpolate(t, [T.ciudad + k * 0.25, T.ciudad + k * 0.25 + 0.6], [0, 1], suave);
        return (
          <g key={k}>
            <line x1={o[0]} y1={o[1]} x2={o[0] + (d[0] - o[0]) * p} y2={o[1] + (d[1] - o[1]) * p} stroke={C.cyan} strokeWidth={6} strokeDasharray="14 10" />
            <circle cx={d[0]} cy={d[1]} r={14} fill={C.yellow} opacity={p} />
          </g>
        );
      })}
      <circle cx={o[0]} cy={o[1]} r={18} fill={C.white} />
      <text x={o[0] - 30} y={o[1] - 30} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={32} fontWeight={700}>tú</text>
      <g opacity={aparece(t, T.ciudad)}>
        <Marcador x={540} y={300} titulo="a cualquier ciudad" valor="42:00" />
      </g>
    </Lienzo>
  );
};
