import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/doppler/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  viene: 1.82, // viene
  pasa: 2.76, // pasa
  grave: 4.68, // grave
  final: 5.58, // final
  sonido: 8.08, // sonido
  anillos: 9.68, // anillos
  cuando: 10.90, // cuando
  acerca: 11.76, // acerca
  cada: 12.38, // cada
  cerca: 13.78, // cerca
  llegan: 15.32, // llegan
  apretadas: 15.58, // apretadas
  oyes: 17.46, // oyes
  agudo: 18.38, // agudo
  cuando2: 19.14, // cuando
  aleja: 19.50, // aleja
  lejos: 21.10, // lejos
  llegan2: 21.76, // llegan
  estiradas: 22.12, // estiradas
  grave2: 24.00, // grave
  efecto: 25.04, // efecto
  conductor: 26.30, // conductor
  mismo: 29.00, // mismo
  porEso: 29.90, // por
  fin: 31.60, // FIN
};

const ONDA = C.cyan;

// Ambulancia vista desde arriba
const Ambulancia: React.FC<{ readonly x: number; readonly y: number; readonly t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-90} y={-50} width={180} height={100} rx={16} fill={C.white} />
    <rect x={50} y={-44} width={34} height={88} rx={8} fill="#8AC8F8" />
    <rect x={-40} y={-12} width={60} height={24} fill={C.red} />
    <rect x={-22} y={-30} width={24} height={60} fill={C.red} />
    <circle cx={-70} cy={-30} r={12} fill={Math.sin(t * 20) > 0 ? "#3A6EE8" : C.red} />
    <circle cx={-70} cy={30} r={12} fill={Math.sin(t * 20) > 0 ? C.red : "#3A6EE8"} />
  </g>
);

// Persona (oído) vista desde arriba
const Persona: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={0} r={40} fill="#E8B48A" />
    <ellipse cx={0} cy={0} rx={70} ry={30} fill="#5A5478" opacity={0.6} />
    <circle cx={0} cy={0} r={34} fill="#E8B48A" />
  </g>
);

// Frentes de onda emitidos desde la fuente en movimiento: src(te) = x de la fuente en el instante te
const Frentes: React.FC<{ readonly t: number; readonly t1: number; readonly src: (te: number) => number; readonly y: number; readonly op?: number }> = ({
  t,
  t1,
  src,
  y,
  op = 1,
}) => {
  const dt = 0.35;
  const c = 330;
  const n = Math.floor((t - t1) / dt);
  return (
    <g opacity={op}>
      {new Array(Math.max(0, Math.min(n + 1, 40))).fill(0).map((_, k) => {
        const te = t1 + (n - k) * dt;
        const r = (t - te) * c;
        if (te < t1 || r > 1400) return null;
        return <circle key={k} cx={src(te)} cy={y} r={r} fill="none" stroke={ONDA} strokeWidth={5} opacity={Math.max(0, 1 - r / 1100)} />;
      })}
    </g>
  );
};

// Muestra de onda (tono): f = frecuencia relativa
const Tono: React.FC<{ readonly x: number; readonly y: number; readonly f: number; readonly col: string; readonly op: number; readonly t: number }> = ({
  x,
  y,
  f,
  col,
  op,
  t,
}) => (
  <path
    opacity={op}
    d={new Array(81)
      .fill(0)
      .map((_, i) => `${i ? "L" : "M"} ${x - 200 + i * 5} ${y + Math.sin(i * 0.25 * f - t * 10) * 34}`)
      .join(" ")}
    stroke={col}
    strokeWidth={6}
    fill="none"
  />
);

const ROAD = 900;

// Carretera con rayas que se desplazan (la cámara sigue a la ambulancia)
const Carretera: React.FC<{ readonly t: number; readonly y: number }> = ({ t, y }) => (
  <g>
    <rect x={0} y={y - 90} width={1080} height={180} fill="#2A2640" />
    {new Array(9).fill(0).map((_, k) => (
      <rect key={k} x={((k * 160 - t * 165) % 1440 + 1440) % 1440 - 180} y={y - 6} width={80} height={12} fill="#5A5478" />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <rect x={0} y={ROAD - 90} width={1080} height={180} fill="#2A2640" />
    <Frentes t={t + 3} t1={0} src={(te) => 200 + te * 60} y={ROAD} />
    <Ambulancia x={200 + (t + 3) * 60} y={ROAD} t={t} />
    <Persona x={700} y={1180} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué cambia el sonido de la sirena?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.viene], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={ONDA} />
    </>
  );
};

// B. Viene aguda, pasa a tu lado y se vuelve grave + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const src = (te: number) => 120 + (te - T.viene) * 190;
  const pasada = src(t) > 540;
  return (
    <Lienzo zoom={interpolate(t, [T.viene, T.sonido], [1, 1.05])}>
      <rect x={0} y={ROAD - 90} width={1080} height={180} fill="#2A2640" />
      <Frentes t={t} t1={T.viene} src={src} y={ROAD} />
      <Ambulancia x={src(t)} y={ROAD} t={t} />
      <Persona x={540} y={1150} />
      <Texto x={540} y={1260} size={48} color={pasada ? C.purpleLight : C.yellow} op={aparece(t, T.viene)}>
        {pasada ? "grave" : "aguda"}
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.sonido], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          la sirena nunca cambió: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El sonido son ondas, como anillos en el agua
export const Anillos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sonido, T.cuando], [1, 1.04])}>
      <Frentes t={t} t1={T.sonido} src={() => 540} y={900} />
      <circle cx={540} cy={900} r={26} fill={C.yellow} />
      <Texto x={540} y={1400} size={40} color={ONDA} op={aparece(t, T.anillos)}>
        como anillos en el agua
      </Texto>
    </Lienzo>
  );
};

// D. Cuando se acerca, las ondas llegan apretadas: tono más agudo
export const Acerca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  // cámara que sigue a la ambulancia: los frentes viejos se quedan atrás
  const src = (te: number) => 400 - 165 * (t - te);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.cuando2], [1, 1.04])}>
        <Carretera t={t} y={ROAD} />
        <Frentes t={t} t1={T.cuando - 4} src={src} y={ROAD} />
        <Ambulancia x={400} y={ROAD} t={t} />
        <Persona x={930} y={ROAD} />
        <path d="M 760 1020 l 80 0 m -24 -20 l 24 20 l -24 20" stroke={C.white} strokeWidth={6} fill="none" opacity={aparece(t, T.acerca)} />
        <Texto x={540} y={1100} size={38} color={C.white} op={aparece(t, T.cerca)}>
          cada onda sale más cerca de ti
        </Texto>
        <Texto x={540} y={1200} size={40} color={C.yellow} op={aparece(t, T.apretadas)}>
          llegan apretadas
        </Texto>
        <Tono x={540} y={1330} f={2.2} col={C.yellow} op={aparece(t, T.oyes)} t={t} />
        <Texto x={540} y={1440} size={44} color={C.yellow} op={aparece(t, T.agudo)}>
          agudo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.agudo} color={C.yellow} />
    </>
  );
};

// E. Cuando se aleja, llegan estiradas: tono grave
export const Aleja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const src = (te: number) => 700 - 165 * (t - te);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando2, T.efecto], [1, 1.04])}>
        <Carretera t={t} y={ROAD} />
        <Frentes t={t} t1={T.cuando2 - 4} src={src} y={ROAD} />
        <Ambulancia x={700} y={ROAD} t={t} />
        <Persona x={130} y={ROAD} />
        <Texto x={540} y={1100} size={38} color={C.white} op={aparece(t, T.lejos)}>
          cada onda sale más lejos
        </Texto>
        <Texto x={540} y={1200} size={40} color={C.purpleLight} op={aparece(t, T.estiradas)}>
          llegan estiradas
        </Texto>
        <Tono x={540} y={1330} f={0.8} col={C.purpleLight} op={aparece(t, T.estiradas)} t={t} />
        <Texto x={540} y={1440} size={44} color={C.purpleLight} op={aparece(t, T.grave2)}>
          grave
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.grave2} color={C.purpleLight} />
    </>
  );
};

// F. Es el efecto Doppler; el conductor oye siempre el mismo tono
export const Conductor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.efecto, T.porEso], [1, 1.04])}>
      <Texto x={540} y={520} size={60} color={C.yellow} op={aparece(t, T.efecto)}>
        EFECTO DOPPLER
      </Texto>
      <g transform="translate(540 860) scale(2)">
        <Ambulancia x={0} y={0} t={t} />
      </g>
      <circle cx={640} cy={860} r={30} fill="#E8B48A" opacity={aparece(t, T.conductor)} />
      <Texto x={540} y={1060} size={38} color={C.white} op={aparece(t, T.conductor)}>
        el conductor viaja con la sirena
      </Texto>
      <Tono x={540} y={1210} f={1.3} col={ONDA} op={aparece(t, T.mismo)} t={t} />
      <Texto x={540} y={1330} size={44} color={ONDA} op={aparece(t, T.mismo)}>
        siempre el mismo tono
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t - T.fin} />
    </Lienzo>
  );
};
