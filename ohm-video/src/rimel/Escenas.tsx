import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { FlechasAire, Jeringa, Ojo, Tubo } from "./Piezas";

// Instantes clave (s) de public/audio/rimel/narracion.wav (voz ×1,1), sacados con Whisper
export const T = {
  secando: 3.3,
  tubo: 4.9,
  encaja: 7.18,
  jeringa: 8.82,
  cada: 10.58,
  sacas: 11.16,
  metes: 11.8,
  empujas: 12.68,
  bombea: 14.54,
  diez: 17.36,
  hecho: 18.14,
  secarse: 19.46,
  agua: 20.68,
  evaporan: 22.4,
  siLeDas: 24.54,
  empieza: 26.34,
  espeso: 28.9,
  grumos: 29.88,
  dura: 30.68,
  ademas: 31.52,
  entrar: 33.36,
  oscuro: 34.64,
  crezcan: 37.56,
  ojos: 38.18,
  que: 39.9,
  saca: 40.76,
  sinBombear: 43.04,
  carga: 44.08,
  rozando: 45.02,
  cierra: 46.62,
  cambia: 47.6,
  tres: 48.9,
  bombear: 49.86,
  mas: 50.94,
  aire: 52.28,
  fin: 53.9,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

// Bombeo: n carreras entre a y b. Devuelve la salida del cepillo y cuántas carreras van (continuo)
const bombeo = (t: number, a: number, b: number, n: number, amp = 0.5) => {
  if (t <= a || t >= b) return { salida: 0, carreras: t >= b ? n : 0, bajando: 0 };
  const u = ((t - a) / (b - a)) * n;
  const fase = u % 1;
  return {
    salida: amp * 0.5 * (1 - Math.cos(fase * Math.PI * 2)),
    carreras: u,
    bajando: fase > 0.5 ? Math.sin((fase - 0.5) * 2 * Math.PI) : 0,
  };
};

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

// A. Gancho: bombeo rápido y el rímel se seca
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = bombeo(t, 0.1, 3.2, 6, 0.42);
  const seco = interpolate(t, [T.secando, T.secando + 0.6], [0, 0.85], suave);
  const flash = interpolate(t, [T.secando, T.secando + 0.08, T.secando + 0.5], [0, 0.35, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tubo], [1, 1.07])} cy={800}>
        <Tubo t={t} x={540} y={480} s={1.2} salida={b.salida} aire={b.carreras * 3} seco={seco} />
        <FlechasAire x={540} y={480} s={1.2} a={t < 3.2 ? 0.4 + 0.6 * b.bajando : 0} t={t} />
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.red, opacity: flash }} />
    </>
  );
};

// B. El cepillo encaja casi justo, como el émbolo de una jeringa
export const Piston: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lado = interpolate(t, [T.jeringa - 0.3, T.jeringa + 0.3], [0, 1], suave);
  const b = bombeo(t, T.jeringa + 0.3, T.cada + 0.2, 2, 0.4);
  return (
    <Lienzo zoom={interpolate(t, [T.tubo, T.cada], [1, 1.04])}>
      <Tubo t={t} x={540 - 230 * lado} y={400} s={1.25} salida={b.salida} holgura={aparece(t, T.encaja)} />
      {lado > 0 ? (
        <g opacity={lado}>
          <Jeringa x={790} y={420} s={0.95} embolo={b.salida * 1.6} />
          <text x={790} y={1400} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>émbolo</text>
          <text x={310} y={1400} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30} opacity={lado}>cepillo</text>
        </g>
      ) : null}
    </Lienzo>
  );
};

// C. Cada bombeo mete aire nuevo
export const Bombeo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.sacas, T.sacas + 0.45], [0, 0.5], suave);
  const entra = interpolate(t, [T.metes, T.metes + 0.35], [0, 0.5], { ...clamp, easing: Easing.in(Easing.quad) });
  const b = bombeo(t, T.bombea, T.diez + 0.2, 10, 0.42);
  const salida = t < T.bombea ? sale - entra : b.salida;
  const aire = 3 * entra * 2 + b.carreras * 3;
  const cuenta = Math.min(10, Math.floor(b.carreras + 0.5));
  const flechas = t < T.bombea ? interpolate(t, [T.metes, T.metes + 0.2, T.bombea - 0.4, T.bombea], [0, 1, 1, 0.4], clamp) : t < T.diez + 0.2 ? 0.4 + 0.6 * b.bajando : 0;
  const tarjeta = aparece(t, T.bombea - 0.2);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.hecho], [1, 1.05])}>
      <Tubo t={t} x={360} y={460} s={1.2} salida={salida} aire={aire} />
      <FlechasAire x={360} y={460} s={1.2} a={flechas} t={t} />
      <g opacity={tarjeta}>
        <rect x={620} y={720} width={400} height={330} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={660} y={790} fill={C.grey} fontFamily={mono} fontSize={30}>bombeos</text>
        <text x={820} y={960} textAnchor="middle" fill={cuenta >= 10 ? C.yellow : C.white} fontFamily={mono} fontSize={150} fontWeight={700}>
          {cuenta}
        </text>
        <text x={820} y={1020} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28} opacity={aparece(t, T.diez)}>= aire nuevo ×10</text>
      </g>
    </Lienzo>
  );
};

// D1. El rímel está hecho para secarse al aire, en las pestañas
export const Pestanas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const moleculas = aparece(t, T.agua);
  const evap = interpolate(t, [T.evaporan, T.evaporan + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.hecho, T.siLeDas], [1, 1.08])} cy={780}>
      <Ojo x={540} y={900} s={2} rimel={1} t={t} />
      {moleculas > 0
        ? new Array(18).fill(0).map((_, k) => {
            const u = (k + 0.5) / 18;
            const bx = 160 + u * 760;
            const by = 900 - 300 * 2 * (0.1 + u * 0.8) * (1 - (0.1 + u * 0.8)) - 150 - (k % 3) * 40;
            const fase = evap > 0 ? ((t - T.evaporan) * 0.5 + (k % 5) * 0.2) % 1 : 0;
            const yy = by - fase * 420 * evap;
            const op = moleculas * (evap > 0 ? Math.cos(fase * Math.PI * 0.5) : 1);
            return (
              <g key={k} opacity={op}>
                <circle cx={bx} cy={yy} r={11} fill={C.cyan} />
                <circle cx={bx - 11} cy={yy - 7} r={6} fill={C.cyan} opacity={0.7} />
                <circle cx={bx + 11} cy={yy - 7} r={6} fill={C.cyan} opacity={0.7} />
              </g>
            );
          })
        : null}
    </Lienzo>
  );
};

// D2. Con aire dentro, se seca en el tubo: espeso y con grumos
export const SecaTubo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const seco = interpolate(t, [T.empieza, T.grumos], [0, 1], clamp);
  const salida = interpolate(t, [T.grumos - 0.3, T.grumos + 0.4], [0, 0.45], suave);
  const grumos = interpolate(t, [T.grumos, T.grumos + 0.6], [0, 9], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.siLeDas, T.ademas], [1, 1.06])} cy={800}>
      <Tubo t={t} x={500} y={480} s={1.25} aire={30} evapora={interpolate(t, [T.siLeDas + 0.6, T.empieza, T.grumos, T.ademas], [0, 1, 1, 0.4], clamp)} seco={seco} salida={salida} grumos={grumos} />
      {/* Barra de "espesor" */}
      <g opacity={aparece(t, T.empieza)}>
        <text x={860} y={620} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>espesor</text>
        <rect x={830} y={650} width={60} height={500} rx={30} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <rect x={838} y={1142 - 484 * (0.15 + 0.85 * seco)} width={44} height={484 * (0.15 + 0.85 * seco)} rx={22} fill={seco > 0.7 ? C.orange : C.yellow} />
      </g>
    </Lienzo>
  );
};

// E. Con el aire pueden entrar microbios
export const Microbios: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = bombeo(t, T.ademas + 0.4, T.entrar + 0.4, 3, 0.4);
  const entran = interpolate(t, [T.ademas + 0.6, T.entrar + 0.6], [0, 6], clamp);
  const crecen = interpolate(t, [T.oscuro + 1.2, T.ojos], [0, 16], clamp);
  const oscuro = interpolate(t, [T.oscuro, T.oscuro + 0.8], [0, 1], clamp);
  const lado = interpolate(t, [T.ojos - 0.4, T.ojos + 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.ademas, T.que], [1, 1.05])}>
      <Tubo t={t} x={540 - 220 * lado} y={460} s={1.2 - 0.15 * lado} salida={b.salida} aire={30} seco={0.5} microbios={entran + crecen} microbiosEntran={6} oscuro={oscuro} />
      <FlechasAire x={540 - 220 * lado} y={460} s={1.2 - 0.15 * lado} a={t < T.entrar + 0.4 ? 0.3 + 0.7 * b.bajando : 0} t={t} />
      {lado > 0 ? (
        <g opacity={lado}>
          <Ojo x={790} y={700} s={0.85} rimel={1} t={t} />
          <path d={`M 470 520 Q 640 430 ${700} 600`} stroke={C.red} strokeWidth={6} fill="none" strokeDasharray="18 14" strokeDashoffset={-t * 40} />
        </g>
      ) : null}
    </Lienzo>
  );
};

// F. Qué hacer: girar sin bombear, cerrar bien, cambiarlo
export const QueHacer: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.saca, T.sinBombear + 0.3], [0, 0.45], suave);
  const vuelve = interpolate(t, [T.rozando + 0.6, T.cierra], [0, 0.45], suave);
  const giro = interpolate(t, [T.saca, T.sinBombear + 0.3], [0, 14], clamp) + interpolate(t, [T.rozando + 0.6, T.cierra], [0, 10], clamp);
  const girando = interpolate(t, [T.saca, T.saca + 0.3, T.sinBombear, T.sinBombear + 0.3], [0, 1, 1, 0], clamp);
  const items = [
    { texto: "Gira, no bombees", t: T.saca },
    { texto: "Roza las paredes", t: T.rozando },
    { texto: "Ciérralo bien", t: T.cierra },
    { texto: "Cámbialo ~3 meses", t: T.cambia },
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.que, T.bombear], [1, 1.04])}>
      <text x={540} y={300} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={88} fontWeight={700} opacity={aparece(t, T.que)}>
        ¿Qué hacer?
      </text>
      <Tubo t={t} x={250} y={760} s={0.95} salida={sale - vuelve} giro={giro} aire={4} />
      {/* Flecha de giro alrededor del tapón */}
      <g opacity={girando} transform={`translate(250 ${760 + 0.95 * (-150 - (sale - vuelve) * 660)})`}>
        <path d="M -90 30 A 90 30 0 1 0 90 30" stroke={C.cyan} strokeWidth={7} fill="none" strokeDasharray="20 14" strokeDashoffset={-t * 50} />
        <path d="M 80 10 L 96 36 L 66 40" stroke={C.cyan} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g opacity={aparece(t, T.saca - 0.2)}>
        <rect x={450} y={560} width={580} height={620} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        {items.map((it, k) => {
          const a = aparece(t, it.t);
          return (
            <g key={k} opacity={0.15 + 0.85 * a}>
              <circle cx={510} cy={680 + k * 140} r={30} fill="none" stroke={a > 0.5 ? C.cyan : C.grey} strokeWidth={5} />
              <path
                d={`M ${494} ${680 + k * 140} L ${506} ${694 + k * 140} L ${528} ${666 + k * 140}`}
                stroke={C.cyan}
                strokeWidth={7}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={60}
                strokeDashoffset={60 * (1 - interpolate(t, [it.t + 0.1, it.t + 0.5], [0, 1], clamp))}
              />
              <text x={565} y={694 + k * 140} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
                {it.texto}
              </text>
            </g>
          );
        })}
      </g>
    </Lienzo>
  );
};

// G. Conclusión: más aire al tubo, no más rímel
export const Conclusion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = bombeo(t, T.bombear + 0.1, T.aire + 0.3, 5, 0.38);
  const tachar = interpolate(t, [T.mas + 0.3, T.mas + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.bombear, T.fin + 0.5], [1, 1.06])} cy={760}>
      <Tubo t={t} x={540} y={440} s={1.05} salida={b.salida} aire={10 + b.carreras * 3} seco={0.6} />
      <FlechasAire x={540} y={440} s={1.05} a={t < T.aire + 0.3 ? 0.4 + 0.6 * b.bajando : 0} t={t} />
      <g opacity={aparece(t, T.mas)}>
        <text x={540} y={1300} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={64} fontWeight={700}>
          + rímel al cepillo
        </text>
        <line x1={180} y1={1278} x2={180 + 720 * tachar} y2={1278} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      </g>
    </Lienzo>
  );
};
