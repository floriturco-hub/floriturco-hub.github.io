import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/empano/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  y: 1.74,
  jabon: 2.8,
  final: 5.36,
  agua: 7.24,
  vapor: 9.46,
  cuando: 10.18,
  frio: 11.66,
  gotitas: 13.76,
  cada: 15.72,
  lupa: 17.48,
  desvia: 18.14,
  porEso: 20.26,
  nube: 22.56,
  jabon2: 23.56,
  el: 25.42,
  capa: 27.36,
  y2: 28.86,
  recta: 30.94,
  frota: 32.0,
  seca: 34.34,
  porEso2: 36.36,
  fin: 37.78,
};

const ESPEJO = "#9AB8D0";
const MARCO = "#C8A870";
const JABON = "#F0C8E0";

// Cara esquemática (el reflejo)
const Cara: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op?: number }> = ({ x, y, s, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <ellipse rx={110} ry={140} fill="#E8B890" />
    <circle cx={-40} cy={-20} r={14} fill="#1A1010" />
    <circle cx={40} cy={-20} r={14} fill="#1A1010" />
    <path d="M -40 60 Q 0 90 40 60" stroke="#5A1A20" strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M -110 -60 Q -100 -170 0 -160 Q 100 -170 110 -60 Q 60 -120 0 -110 Q -60 -120 -110 -60 Z" fill="#4A3A2A" />
  </g>
);

// Espejo ovalado con niebla (0..1)
const Espejo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly niebla: number; readonly id: string; readonly despejado?: number }> = ({
  x,
  y,
  s,
  niebla,
  id,
  despejado = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={260} ry={360} fill={MARCO} />
    <defs>
      <clipPath id={`esp-${id}`}>
        <ellipse rx={230} ry={330} />
      </clipPath>
    </defs>
    <g clipPath={`url(#esp-${id})`}>
      <rect x={-240} y={-340} width={480} height={680} fill={ESPEJO} />
      <Cara x={0} y={20} s={1.3} />
      <rect x={-240} y={-340} width={480} height={680} fill={C.white} opacity={0.85 * niebla} />
      {new Array(30).fill(0).map((_, k) => (
        <circle key={k} cx={-220 + random(`n${k}`) * 440} cy={-320 + random(`m${k}`) * 640} r={6 + random(`r${k}`) * 10} fill={C.white} opacity={niebla * 0.9} />
      ))}
      {despejado > 0 ? (
        <rect x={0} y={-340} width={240} height={680} fill={ESPEJO} opacity={despejado} />
      ) : null}
      {despejado > 0 ? (
        <g opacity={despejado}>
          <clipPath id={`der-${id}`}>
            <rect x={0} y={-340} width={240} height={680} />
          </clipPath>
          <g clipPath={`url(#der-${id})`}>
            <Cara x={0} y={20} s={1.3} />
          </g>
        </g>
      ) : null}
    </g>
  </g>
);

// A. Gancho: ¿por qué se empaña tu espejo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.y], [1.12, 1])}>
        <Espejo x={540} y={880} s={1.25} niebla={interpolate(t, [0, 1.0], [0.2, 1], clamp)} id="g" />
        <Texto x={540} y={1430} size={110} color={C.yellow} op={interpolate(t, [0.7, 1.0], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.9} />
    </>
  );
};

// Pastilla de jabón
const Jabon: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-50} width={220} height={100} rx={40} fill={JABON} />
    <rect x={-80} y={-34} width={90} height={16} rx={8} fill={C.white} opacity={0.6} />
  </g>
);

// B. Un poco de jabón lo evita durante días + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.agua], [1, 1.05])}>
      <Espejo x={540} y={800} s={0.95} niebla={1} id="b" despejado={aparece(t, T.jabon + 0.6)} />
      <g opacity={aparece(t, T.jabon)}>
        <Jabon x={800} y={1180} s={0.9} />
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1310} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1310}
          width={700 * interpolate(t, [T.final, T.agua], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1410} color={C.white} size={40}>
          cómo hacerlo: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El agua caliente de la ducha llena el baño de vapor
export const Vapor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.agua, T.cuando], [1, 1.04])}>
      <rect x={420} y={460} width={240} height={40} rx={20} fill="#8A86A8" />
      <rect x={520} y={420} width={40} height={60} fill="#8A86A8" />
      {new Array(16).fill(0).map((_, k) => {
        const u = (t * 1.6 + k / 16) % 1;
        return <line key={k} x1={440 + (k % 8) * 28} y1={520 + u * 600} x2={440 + (k % 8) * 28 - 6} y2={560 + u * 600} stroke={C.cyan} strokeWidth={6} opacity={0.8} />;
      })}
      {new Array(10).fill(0).map((_, k) => {
        const u = (t * 0.35 + k / 10) % 1;
        return <circle key={`v${k}`} cx={200 + random(`vx${k}`) * 680 + Math.sin(u * 6 + k) * 40} cy={1200 - u * 700} r={50 + u * 60} fill={C.white} opacity={0.3 * Math.sin(u * Math.PI) * aparece(t, T.vapor - 1)} />;
      })}
      <Texto x={540} y={1300} size={44} color={C.white} op={aparece(t, T.vapor)}>
        vapor
      </Texto>
    </Lienzo>
  );
};

// D. El vapor toca el espejo frío y se convierte en millones de gotitas
export const Gotitas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.frio, T.cada], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.cada], [1, 1.04])}>
      <rect x={600} y={440} width={60} height={980} fill={ESPEJO} />
      <rect x={660} y={440} width={30} height={980} fill="#6A88A8" />
      {new Array(14).fill(0).map((_, k) => {
        const u = (t * 0.5 + k / 14) % 1;
        return <circle key={k} cx={120 + u * 470} cy={480 + random(`gy${k}`) * 900} r={14} fill={C.white} opacity={0.7 * (1 - u)} />;
      })}
      {new Array(18).fill(0).map((_, k) => (
        <circle key={`d${k}`} cx={590} cy={480 + k * 52} r={6 + 16 * crece * (0.6 + random(`dr${k}`) * 0.4)} fill={C.white} opacity={0.9} />
      ))}
      <g opacity={aparece(t, T.frio)} transform="translate(860 700)">
        <rect x={-24} y={-120} width={48} height={200} rx={24} fill="#2A2440" />
        <rect x={-12} y={20} width={24} height={50} rx={12} fill={C.cyan} />
        <circle cx={0} cy={90} r={36} fill={C.cyan} />
      </g>
      <Texto x={860} y={900} size={34} color={C.cyan} op={aparece(t, T.frio)}>
        frío
      </Texto>
      <Texto x={540} y={1500} size={40} color={C.white} op={aparece(t, T.gotitas)}>
        millones de gotitas
      </Texto>
    </Lienzo>
  );
};

// E. Cada gotita es redonda como una lupa y desvía la luz en todas direcciones
export const Lupa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const desvia = aparece(t, T.desvia);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.porEso], [1, 1.04])}>
      <rect x={60} y={1000} width={960} height={50} fill={ESPEJO} />
      {[240, 540, 840].map((x, k) => (
        <g key={x}>
          <path d={`M ${x - 110} 1000 A 110 110 0 0 1 ${x + 110} 1000 Z`} fill={C.white} opacity={0.6} />
          <line x1={x} y1={520} x2={x} y2={920} stroke={C.yellow} strokeWidth={8} />
          {[-60, -30, 0, 30, 60].map((a) => (
            <line
              key={a}
              x1={x}
              y1={920}
              x2={x + Math.sin(((a + k * 10) * Math.PI) / 180) * 260}
              y2={920 - Math.cos(((a + k * 10) * Math.PI) / 180) * 260 * (a % 60 === 0 ? -1 : 1)}
              stroke={C.yellow}
              strokeWidth={5}
              opacity={desvia}
            />
          ))}
        </g>
      ))}
      <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.lupa)}>
        cada gotita, una lupa
      </Texto>
      <Texto x={540} y={1280} size={36} color={C.yellow} op={desvia}>
        la luz sale en todas direcciones
      </Texto>
    </Lienzo>
  );
};

// F. Por eso ya no ves tu reflejo, sino una nube blanca
export const Nube: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.jabon2], [1, 1.06])}>
      <Espejo x={540} y={860} s={1.1} niebla={interpolate(t, [T.porEso, T.nube], [0.3, 1], clamp)} id="n" />
    </Lienzo>
  );
};

// G. El jabón hace que el agua no forme gotas, sino una capa finísima y lisa
export const Capa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const aplana = interpolate(t, [T.el + 0.4, T.capa + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.jabon2, T.y2], [1, 1.04])}>
      <rect x={60} y={1000} width={960} height={50} fill={ESPEJO} />
      <rect x={60} y={992} width={960} height={8} fill={JABON} opacity={aparece(t, T.jabon2 + 0.4)} />
      {[240, 540, 840].map((x) => (
        <ellipse key={x} cx={x} cy={1000 - 100 * (1 - aplana) - 4 * aplana} rx={110 + 220 * aplana} ry={100 * (1 - aplana) + 6 * aplana} fill={C.white} opacity={0.6} />
      ))}
      <Jabon x={540} y={700} s={1} />
      <Texto x={540} y={1200} size={40} color={JABON} op={aparece(t, T.jabon2 + 0.3)}>
        el jabón cambia la superficie
      </Texto>
      <Texto x={540} y={1280} size={38} color={C.white} op={aparece(t, T.capa)}>
        una capa finísima y lisa
      </Texto>
    </Lienzo>
  );
};

// H. A través de una capa lisa la luz pasa recta
export const Recta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.y2, T.frota], [1, 1.04])}>
        <rect x={60} y={1000} width={960} height={50} fill={ESPEJO} />
        <rect x={60} y={985} width={960} height={15} fill={C.white} opacity={0.5} />
        {[240, 540, 840].map((x) => (
          <g key={x}>
            <line x1={x - 120} y1={520} x2={x} y2={990} stroke={C.yellow} strokeWidth={8} />
            <line x1={x} y1={990} x2={x + 120} y2={520} stroke={C.yellow} strokeWidth={8} opacity={aparece(t, T.recta - 0.6)} />
          </g>
        ))}
        <Texto x={540} y={1200} size={44} color={C.yellow} op={aparece(t, T.recta)}>
          la luz pasa recta
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.recta} />
    </>
  );
};

// I. Frota jabón o espuma de afeitar y sécalo con un paño sin enjuagar
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const frota = aparece(t, T.frota);
  const paso = interpolate(t, [T.seca, T.porEso2], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.frota, T.porEso2], [1, 1.04])}>
      <Espejo x={540} y={800} s={0.95} niebla={0.15} id="t" />
      <g transform={`translate(${540 + Math.sin(t * 6) * 120 * frota} ${720 + Math.cos(t * 4) * 80})`} opacity={frota * (1 - aparece(t, T.seca))}>
        <Jabon x={0} y={0} s={0.6} />
      </g>
      <g opacity={aparece(t, T.seca)} transform={`translate(${380 + paso * 320} ${700 + Math.sin(t * 5) * 60})`}>
        <rect x={-90} y={-60} width={180} height={120} rx={20} fill="#5AC878" />
      </g>
      <Texto x={540} y={1300} size={36} color={JABON} op={frota}>
        1. frota jabón o espuma
      </Texto>
      <Texto x={540} y={1370} size={36} color="#5AC878" op={aparece(t, T.seca)}>
        2. seca con un paño, sin enjuagar
      </Texto>
    </Lienzo>
  );
};

// J. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso2, T.fin + 0.5], [1, 1.12])}>
      <Espejo x={540} y={880} s={1.25} niebla={interpolate(t, [T.porEso2, T.fin], [0.6, 0.2], clamp)} id="c" />
      <Texto x={540} y={1430} size={110} color={C.yellow}>
        ?
      </Texto>
    </Lienzo>
  );
};
