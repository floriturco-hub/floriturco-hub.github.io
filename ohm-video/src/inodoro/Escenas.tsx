import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/inodoro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  se: 1.98,
  cable: 4.38,
  final: 5.8,
  dentro: 8.32,
  flotador: 9.56,
  valvula: 10.74,
  cuando: 11.92,
  tapon: 13.24,
  cae: 14.62,
  baja: 16.02,
  alBajar: 17.22,
  abre: 19.3,
  entra: 20.3,
  cierra: 21.66,
  llena: 23.24,
  sube: 24.8,
  altura: 25.98,
  empuja: 27.48,
  simple: 29.34,
  si: 30.48,
  rebose: 33.28,
  porEso: 35.86,
  fin: 37.78,
};

const LOZA = "#E8E6F0";
const AGUA = "#4AA8E8";

// Estado del tanque según el tiempo de la narración
const estado = (t: number) => {
  const falla = t > T.si;
  const nivel = falla
    ? interpolate(t, [T.si, T.rebose], [0.95, 1.02], clamp)
    : t < T.tapon
      ? 0.95
      : t < T.llena
        ? interpolate(t, [T.cae, T.baja + 0.6], [0.95, 0.12], clamp)
        : interpolate(t, [T.llena, T.altura + 0.6], [0.12, 0.95], clamp);
  const tapon = t > T.tapon && t < T.cierra ? 1 : 0;
  const valvula = falla ? 1 : t > T.abre && t < T.empuja ? 1 : 0;
  return { nivel, tapon, valvula, falla };
};

// Tanque en corte: nivel 0..1
const Tanque: React.FC<{ readonly t: number; readonly etiquetas?: number }> = ({ t, etiquetas = 0 }) => {
  const { nivel, tapon, valvula, falla } = estado(t);
  const yAgua = 1240 - nivel * 560;
  const yFlot = Math.max(yAgua - 10, 760);
  const flujo = (t * 600) % 60;
  return (
    <g>
      <rect x={220} y={540} width={640} height={740} rx={30} fill="#2A2640" stroke={LOZA} strokeWidth={14} />
      <rect x={234} y={yAgua} width={612} height={1266 - yAgua} fill={AGUA} opacity={0.75} />
      {/* tubo de rebose */}
      <rect x={640} y={640} width={40} height={630} fill="#C8C4D8" />
      {falla && nivel > 1 ? (
        <rect x={648} y={650} width={24} height={620} fill={AGUA} strokeDasharray="20 20" opacity={0.9} />
      ) : null}
      {/* tapón */}
      <g transform={`rotate(${-tapon * 50} 700 1262)`}>
        <rect x={700} y={1240} width={120} height={26} rx={10} fill="#3A3650" />
      </g>
      <rect x={700} y={1266} width={120} height={24} fill={tapon ? AGUA : "#2A2640"} />
      {/* cadena a la palanca */}
      <line x1={760} y1={600 - tapon * 30} x2={760} y2={1250 - tapon * 40} stroke={C.grey} strokeWidth={4} strokeDasharray="8 6" />
      <rect x={720} y={570 - tapon * 30} width={190} height={24} rx={10} fill={C.grey} transform={`rotate(${-tapon * 10} 900 580)`} />
      {/* válvula de entrada */}
      <rect x={300} y={640} width={40} height={630} fill="#C8C4D8" />
      <rect x={280} y={600} width={80} height={60} rx={14} fill={valvula ? "#5AC878" : C.red} />
      {valvula ? (
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <rect key={k} x={312} y={660 + ((k * 90 + flujo * 1.5) % 560)} width={16} height={50} rx={8} fill={AGUA} />
          ))}
        </g>
      ) : null}
      {/* brazo y flotador */}
      <line x1={360} y1={630} x2={500} y2={yFlot} stroke={C.white} strokeWidth={8} />
      <circle cx={520} cy={yFlot} r={44} fill={C.orange} />
      <g opacity={etiquetas}>
        <Texto x={520} y={yFlot + 100} size={30} color={C.orange}>
          flotador
        </Texto>
        <Texto x={320} y={515} size={30} color={valvula ? "#5AC878" : C.red}>
          válvula
        </Texto>
        <Texto x={760} y={1340} size={30} color={C.grey}>
          tapón
        </Texto>
        <Texto x={660} y={620} size={26} color={C.grey}>
          rebose
        </Texto>
      </g>
    </g>
  );
};

// Inodoro de perfil
const Inodoro: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brillo?: number }> = ({ x, y, s, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={40} y={-320} width={220} height={300} rx={24} fill={LOZA} stroke={brillo > 0.5 ? C.yellow : "none"} strokeWidth={10} />
    <rect x={30} y={-340} width={240} height={30} rx={10} fill="#C8C4D8" />
    <path d="M -220 0 L 200 0 Q 200 140 60 180 L 60 280 L -60 280 L -60 180 Q -220 140 -220 0 Z" fill={LOZA} />
    <rect x={-240} y={-24} width={460} height={30} rx={14} fill="#C8C4D8" />
  </g>
);

// A. Gancho: ¿cómo sabe tu inodoro cuándo parar?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = interpolate(t, [0.4, 0.8], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.se], [1.12, 1])}>
        <Inodoro x={540} y={1000} s={1.4} brillo={b} />
        <Texto x={760} y={470} size={110} color={C.yellow} op={b}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.52} color={C.cyan} />
    </>
  );
};

// B. Se llena solo y se detiene a tiempo, sin cables + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.se, T.dentro], [1, 1.05])}>
      <Inodoro x={420} y={980} s={1} />
      <g opacity={aparece(t, T.cable)} transform="translate(820 720)">
        <rect x={-40} y={-30} width={80} height={60} rx={10} fill={C.grey} />
        <rect x={-24} y={-70} width={12} height={40} fill={C.grey} />
        <rect x={12} y={-70} width={12} height={40} fill={C.grey} />
        <path d="M 0 30 Q 0 90 60 110" stroke={C.grey} strokeWidth={10} fill="none" />
        <line x1={-80} y1={-90} x2={90} y2={130} stroke={C.red} strokeWidth={14} />
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1370} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1370}
          width={700 * interpolate(t, [T.final, T.dentro], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1470} color={C.white} size={40}>
          qué pasa cuando falla: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C-F. El tanque por dentro (las mismas piezas en varias escenas)
export const Dentro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.cuando], [1, 1.04])}>
      <Tanque t={t} etiquetas={aparece(t, T.flotador)} />
    </Lienzo>
  );
};

export const Descarga: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.alBajar], [1, 1.04])}>
      <Tanque t={t} etiquetas={0.6} />
      <Texto x={540} y={1440} size={40} color={AGUA} op={aparece(t, T.cae)}>
        el agua baja a la taza
      </Texto>
    </Lienzo>
  );
};

export const Abre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.alBajar, T.llena], [1, 1.04])}>
        <Tanque t={t} etiquetas={0.6} />
        <Texto x={540} y={1440} size={40} color="#5AC878" op={aparece(t, T.abre)}>
          flotador abajo = válvula abierta
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.abre} color="#5AC878" />
    </>
  );
};

export const Llena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llena, T.si], [1, 1.04])}>
        <Tanque t={t} etiquetas={0.6} />
        <Texto x={540} y={1440} size={40} color={C.red} op={aparece(t, T.empuja)}>
          flotador arriba = válvula cerrada
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.empuja} color={C.red} />
    </>
  );
};

// G. Si algo falla, el agua se va por el tubo de rebose
export const Falla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.04])}>
      <Tanque t={t} etiquetas={0.6} />
      <Texto x={540} y={1440} size={40} color={AGUA} op={aparece(t, T.rebose)}>
        sale por el tubo de rebose
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inodoro x={540} y={1000} s={1.4} brillo={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)} />
      <Texto x={760} y={470} size={110} color={C.yellow} op={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)}>
        ?
      </Texto>
    </Lienzo>
  );
};
