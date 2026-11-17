import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/estrellafugaz/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  parece: 2.16, // parece
  cayendo: 3.04, // cayendo
  polvo: 5.40, // polvo
  arena: 7.28, // arena
  final: 8.08, // final
  entra: 11.18, // entra
  kilometros: 13.26, // kilometros
  bala: 16.50, // bala
  velocidad: 17.36, // velocidad
  comprime: 17.78, // comprime
  calienta: 19.64, // calienta
  vaporiza: 22.06, // vaporiza
  altura: 23.80, // altura
  tubo: 24.92, // tubo
  largo: 26.90, // largo
  ves: 27.78, // ves
  aire: 29.76, // aire
  cada: 30.90, // cada
  toneladas: 32.88, // toneladas
  asi: 34.28, // asi
  fin: 36.54, // FIN
};

const Estrellas: React.FC<{ readonly t: number }> = ({ t }) => (
  <g>
    {new Array(40).fill(0).map((_, k) => (
      <circle key={k} cx={(k * 137) % 1080} cy={420 + ((k * 211) % 1300)} r={2 + (k % 3)} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 2 + k)} />
    ))}
  </g>
);

// Estela de la estrella fugaz; u = progreso 0..1
const Estela: React.FC<{ readonly u: number; readonly x0?: number; readonly y0?: number; readonly x1?: number; readonly y1?: number; readonly op?: number }> = ({
  u,
  x0 = 900,
  y0 = 520,
  x1 = 200,
  y1 = 1200,
  op = 1,
}) => {
  const hx = x0 + (x1 - x0) * u;
  const hy = y0 + (y1 - y0) * u;
  const L = 0.35;
  const tx = x0 + (x1 - x0) * Math.max(0, u - L);
  const ty = y0 + (y1 - y0) * Math.max(0, u - L);
  return (
    <g opacity={op}>
      <defs>
        <linearGradient id="estela" x1={tx} y1={ty} x2={hx} y2={hy} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#E8F0FF" stopOpacity={1} />
        </linearGradient>
      </defs>
      <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="url(#estela)" strokeWidth={10} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={12} fill="#fff" />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Estrellas t={t} />
    <Estela u={0.3 + ((t * 0.35) % 0.7)} />
    <Texto x={540} y={1450} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿qué tan grande es esta estrella fugaz?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.parece], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Parece una estrella cayendo, pero es un grano de polvo del tamaño de la arena + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const grano = aparece(t, T.polvo);
  return (
    <Lienzo zoom={interpolate(t, [T.parece, T.entra], [1, 1.04])}>
      <g opacity={1 - grano}>
        <Estrellas t={t} />
        <Estela u={interpolate(t, [T.parece, T.polvo], [0.2, 1], clamp)} />
        <Texto x={540} y={1400} size={40} color={C.white} op={aparece(t, T.cayendo)}>
          ¿una estrella cayendo?
        </Texto>
      </g>
      <g opacity={grano}>
        <path d="M 300 1500 Q 300 900 540 860 Q 780 900 780 1500 Z" fill="#C89A7A" />
        <ellipse cx={540} cy={900} rx={150} ry={60} fill="#D8AA8A" />
        <circle cx={540} cy={880} r={10} fill="#B8A890" />
        <circle cx={540} cy={880} r={40} fill="none" stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={640} size={40} color={C.yellow}>
          un grano de polvo
        </Texto>
        <Texto x={540} y={710} size={38} color={C.white} op={aparece(t, T.arena)}>
          como un grano de arena
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuánto polvo cae al día?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.entra], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Entra a más de 40.000 km/h, unas 50 veces más rápido que una bala
export const Velocidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xg = ((t * 900) % 1300) - 100;
  const xb = ((t * 18) % 1300) - 100;
  return (
    <Lienzo zoom={interpolate(t, [T.entra, T.velocidad], [1, 1.04])}>
      <g opacity={aparece(t, T.kilometros)}>
        <line x1={xg - 300} y1={800} x2={xg} y2={800} stroke="#E8F0FF" strokeWidth={6} opacity={0.6} />
        <circle cx={xg} cy={800} r={12} fill="#fff" />
        <Texto x={540} y={720} size={44} color={C.white}>
          +40.000 km/h
        </Texto>
      </g>
      <g opacity={aparece(t, T.bala)}>
        <path d={`M ${xb} 1100 l 60 0 q 30 0 40 15 q -10 15 -40 15 l -60 0 Z`} fill="#C8A040" />
        <Texto x={540} y={1240} size={38} color="#C8A040">
          bala: 50 veces más lenta
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Comprime el aire de delante, que se calienta a miles de grados
export const Compresion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cal = aparece(t, T.calienta);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.velocidad, T.vaporiza], [1, 1.04])}>
        {new Array(30).fill(0).map((_, k) => {
          const y0 = 560 + (k % 10) * 90;
          const x0 = 100 + Math.floor(k / 10) * 280 + ((t * 200) % 280);
          const dx = 600 - x0;
          const empuje = aparece(t, T.comprime) * Math.max(0, 1 - Math.abs(dx) / 300);
          return <circle key={k} cx={x0 - empuje * 60} cy={y0} r={10} fill={C.cyan} opacity={0.5} />;
        })}
        <path d="M 560 760 Q 700 1000 560 1240" stroke={cal ? C.orange : C.cyan} strokeWidth={30} fill="none" opacity={aparece(t, T.comprime) * (0.5 + 0.5 * cal)} />
        <circle cx={520} cy={1000} r={24} fill="#B8A890" />
        <path d="M 520 1000 L 100 1000" stroke="#fff" strokeWidth={8} opacity={0.4} />
        <Texto x={760} y={700} size={38} color={C.cyan} op={aparece(t, T.comprime)}>
          aire comprimido
        </Texto>
        <Texto x={540} y={1400} size={44} color={C.orange} op={cal}>
          ¡miles de grados!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.calienta} color={C.orange} />
    </>
  );
};

// E. Se vaporiza a ~100 km de altura y deja un tubo de aire brillante de km de largo
export const Tubo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.vaporiza, T.tubo + 0.8], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.vaporiza, T.ves], [1, 1.04])}>
      <rect x={0} y={1420} width={1080} height={500} fill="#1A3A2A" />
      {[0, 25, 50, 75, 100].map((km) => (
        <g key={km}>
          <line x1={80} y1={1420 - km * 8.5} x2={110} y2={1420 - km * 8.5} stroke={C.grey} strokeWidth={4} />
          <Texto x={170} y={1430 - km * 8.5} size={28} color={C.grey}>
            {km + " km"}
          </Texto>
        </g>
      ))}
      <line x1={260} y1={570} x2={1000} y2={570} stroke={C.yellow} strokeWidth={4} strokeDasharray="14 10" opacity={aparece(t, T.altura)} />
      <path d={`M 1000 470 L ${1000 - u * 600} ${470 + u * 220}`} stroke="#E8F0FF" strokeWidth={30 * aparece(t, T.tubo) + 6} strokeLinecap="round" opacity={0.85} />
      <Texto x={700} y={820} size={38} color="#E8F0FF" op={aparece(t, T.largo)}>
        tubo de aire brillante, km de largo
      </Texto>
    </Lienzo>
  );
};

// F. Lo que ves no es la piedra: es ese aire encendido
export const Aire: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ves, T.cada], [1, 1.06])}>
      <ellipse cx={540} cy={950} rx={420} ry={90} fill="#E8F0FF" opacity={0.25 + 0.1 * Math.sin(t * 8)} />
      <ellipse cx={540} cy={950} rx={380} ry={50} fill="#E8F0FF" opacity={0.5} />
      <circle cx={900} cy={950} r={6} fill="#B8A890" opacity={1 - aparece(t, T.aire)} />
      <Texto x={540} y={760} size={40} color={C.grey} op={aparece(t, T.ves)}>
        no es la piedra…
      </Texto>
      <Texto x={540} y={1150} size={46} color="#E8F0FF" op={aparece(t, T.aire)}>
        es el aire encendido
      </Texto>
    </Lienzo>
  );
};

// G. Cada día caen a la Tierra decenas de toneladas de este polvo
export const Toneladas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cada, T.asi], [1, 1.04])}>
        <circle cx={540} cy={1000} r={300} fill="#2A6AC8" />
        <path d="M 400 820 q 80 -40 140 20 q 40 60 -20 120 q -80 20 -120 -40 Z M 620 1060 q 80 0 100 60 q -20 60 -100 40 Z" fill="#3AA85A" />
        {new Array(24).fill(0).map((_, k) => {
          const a = (k / 24) * Math.PI * 2;
          const u = (t * 0.6 + k / 24) % 1;
          const r = 600 - u * 290;
          return <line key={k} x1={540 + Math.cos(a) * r} y1={1000 + Math.sin(a) * r} x2={540 + Math.cos(a) * (r + 40)} y2={1000 + Math.sin(a) * (r + 40)} stroke="#E8F0FF" strokeWidth={4} opacity={aparece(t, T.cada) * (1 - u)} />;
        })}
        <Texto x={540} y={1440} size={50} color={C.yellow} op={aparece(t, T.toneladas)}>
          decenas de toneladas al día
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.toneladas} color={C.yellow} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
