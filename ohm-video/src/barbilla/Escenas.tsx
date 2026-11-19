import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/barbilla/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  barbilla: 2.88, // barbilla
  cae: 4.04, // cae
  inconsciente: 5.24, // inconsciente
  final: 6.58, // final
  palanca: 10.74, // palanca
  mandibula: 11.96, // mandibula
  girar: 13.84, // girar
  cuello: 15.40, // cuello
  rapido: 16.38, // rapido
  frente: 17.42, // frente
  cerebro: 18.34, // cerebro
  flota: 18.70, // flota
  cuando: 20.28, // cuando
  queda: 22.70, // queda
  tuerce: 24.38, // tuerce
  torsion: 25.38, // torsion
  tronco: 26.38, // tronco
  alerta: 28.26, // alerta
  conciencia: 29.04, // conciencia
  apaga: 29.96, // apaga
  importa: 30.84, // importa
  giro: 32.48, // giro
  peligroso: 34.14, // peligroso
  porEso: 35.02, // por
  fin: 37.06, // FIN
};

const PIEL = "#E8B48A";
const GUANTE = C.red;

// Cabeza de perfil mirando a la derecha; giro en grados sobre el cuello; ko = ojos cerrados; corte = cráneo y cerebro
const Cabeza: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly giro: number; readonly ko?: number; readonly corte?: number; readonly retraso?: number; readonly tronco?: number }> = ({
  x,
  y,
  s,
  giro,
  ko = 0,
  corte = 0,
  retraso = 0,
  tronco = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={150} width={120} height={200} fill={PIEL} />
    <g transform={`rotate(${giro} 0 160)`}>
      <path d="M -160 -40 Q -170 -230 20 -240 Q 190 -230 190 -60 L 200 20 L 170 40 L 175 90 Q 170 150 90 170 L 40 175 Q -60 200 -120 140 Q -170 80 -160 -40 Z" fill={PIEL} />
      <path d="M -160 -60 Q -170 -230 20 -245 Q 170 -240 185 -120 Q 60 -200 -160 -60 Z" fill="#3A2A1A" />
      <g opacity={1 - ko}>
        <circle cx={120} cy={-50} r={14} fill="#111" />
      </g>
      <g opacity={ko}>
        <path d="M 105 -62 l 28 24 m 0 -24 l -28 24" stroke="#111" strokeWidth={7} />
      </g>
      <path d="M -40 -20 q 40 -10 40 40 q 0 40 -30 50" stroke="#C88A6A" strokeWidth={12} fill="none" />
      <g opacity={corte}>
        <path d="M -150 -40 Q -160 -220 20 -228 Q 180 -220 180 -60 Q 170 60 40 80 Q -120 90 -150 -40 Z" fill="#141030" stroke="#E8E4F0" strokeWidth={10} />
        <g transform={`rotate(${-retraso} 10 -60)`}>
          <ellipse cx={10} cy={-70} rx={140} ry={110} fill="#E89AB8" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M ${-100 + k * 55} ${-140 + (k % 2) * 30} q 20 30 0 60 q -20 30 0 60`} stroke="#C86A8A" strokeWidth={6} fill="none" />
          ))}
          <path d="M -10 30 L -20 150 L 30 150 L 30 30 Z" fill={tronco > 0.5 ? C.yellow : "#C86A8A"} />
        </g>
      </g>
    </g>
  </g>
);

const Guante: React.FC<{ readonly x: number; readonly y: number; readonly op: number }> = ({ x, y, op }) => (
  <g opacity={op} transform={`translate(${x} ${y})`}>
    <rect x={40} y={-30} width={300} height={70} rx={30} fill="#8A3A3A" />
    <ellipse cx={0} cy={0} rx={80} ry={70} fill={GUANTE} />
    <ellipse cx={-30} cy={-40} rx={30} ry={22} fill={GUANTE} stroke="#8A1A2A" strokeWidth={4} />
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Cabeza x={420} y={900} s={1.2} giro={0} />
    <Guante x={740} y={1060} op={1} />
    <Texto x={800} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este golpe apaga a cualquiera?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.barbilla], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={GUANTE} />
    </>
  );
};

// B. Un golpe en la barbilla y el boxeador cae inconsciente + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const golpe = interpolate(t, [T.barbilla - 0.2, T.barbilla + 0.1], [900, 640], clamp);
  const giro = interpolate(t, [T.barbilla + 0.1, T.barbilla + 0.35], [0, -28], clamp);
  const cae = interpolate(t, [T.cae, T.cae + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.barbilla, T.palanca], [1, 1.04])}>
        <g transform={`rotate(${cae * 20} 420 1400) translate(0 ${cae * 80})`}>
          <Cabeza x={420} y={860} s={1} giro={giro} ko={aparece(t, T.inconsciente)} />
        </g>
        <Guante x={golpe} y={1000} op={1 - cae} />
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.palanca], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            no importa tanto la fuerza
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.barbilla + 0.1} color={C.white} />
    </>
  );
};

// C. La barbilla es la punta de una palanca larga: la mandíbula; el golpe hace girar la cabeza más rápido
export const Palanca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = t > T.girar ? -22 * Math.min(1, (t - T.girar) * 3) : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.palanca, T.cerebro], [1, 1.04])}>
      <Cabeza x={420} y={880} s={1.1} giro={g} />
      <g opacity={aparece(t, T.mandibula)}>
        <line x1={420 + 0} y1={880 + 50} x2={420 + 190} y2={880 + 170} stroke={C.yellow} strokeWidth={10} strokeLinecap="round" transform={`rotate(${g} 420 1056)`} />
        <circle cx={420} cy={1056} r={16} fill={C.yellow} />
        <Texto x={760} y={1150} size={36} color={C.yellow}>
          mandíbula = palanca
        </Texto>
      </g>
      <g opacity={aparece(t, T.girar)}>
        <path d="M 640 820 A 260 260 0 0 0 560 640" stroke={C.cyan} strokeWidth={8} fill="none" />
        <path d="M 560 640 l -6 34 l 30 -14 Z" fill={C.cyan} />
      </g>
      <g opacity={aparece(t, T.rapido)}>
        <rect x={190} y={1300} width={340} height={130} rx={18} fill={C.card} stroke={C.red} strokeWidth={4} />
        <Texto x={360} y={1355} size={30} color={C.white}>
          barbilla
        </Texto>
        <Texto x={360} y={1405} size={36} color={C.red}>
          giro rápido
        </Texto>
      </g>
      <g opacity={aparece(t, T.frente)}>
        <rect x={550} y={1300} width={340} height={130} rx={18} fill={C.card} stroke={C.grey} strokeWidth={4} />
        <Texto x={720} y={1355} size={30} color={C.white}>
          frente
        </Texto>
        <Texto x={720} y={1405} size={36} color={C.grey}>
          giro lento
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. El cerebro flota en el cráneo: cuando la cabeza gira, se queda atrás y se tuerce
export const Cerebro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.cuando, T.cuando + 0.4], [0, -28], clamp);
  const cerebroGiro = interpolate(t, [T.queda, T.tuerce + 0.6], [0, -28], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cerebro, T.torsion], [1, 1.04])}>
        <Cabeza x={460} y={900} s={1.3} giro={giro} corte={aparece(t, T.cerebro)} retraso={cerebroGiro - giro} />
        <Texto x={540} y={1380} size={38} color="#E89AB8" op={aparece(t, T.flota) * (1 - aparece(t, T.queda))}>
          el cerebro flota
        </Texto>
        <Texto x={540} y={1380} size={40} color={C.yellow} op={aparece(t, T.queda)}>
          se queda atrás y se tuerce
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tuerce} color="#E89AB8" />
    </>
  );
};

// E. La torsión sacude el tronco cerebral, que mantiene el estado de alerta: la conciencia se apaga
export const Tronco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const apaga = aparece(t, T.apaga);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.torsion, T.importa], [1, 1.04])}>
        <Cabeza x={460} y={900} s={1.3} giro={-10} corte={1} retraso={Math.sin(t * 20) * 4 * (1 - apaga)} tronco={aparece(t, T.tronco)} ko={apaga} />
        <Texto x={760} y={1150} size={36} color={C.yellow} op={aparece(t, T.tronco)}>
          tronco cerebral
        </Texto>
        <g opacity={aparece(t, T.alerta)} transform="translate(860 560)">
          <rect x={-90} y={-50} width={180} height={100} rx={50} fill={apaga > 0.5 ? "#3A3650" : "#3AC86A"} />
          <circle cx={apaga > 0.5 ? -40 : 40} cy={0} r={38} fill={C.white} />
          <Texto x={0} y={100} size={30} color={C.white}>
            alerta
          </Texto>
        </g>
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.45 * apaga }} />
    </>
  );
};

// F. No importa tanto la fuerza, sino el giro; por eso es tan peligroso
export const Giro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.importa, T.porEso], [1, 1.04])}>
        <Texto x={540} y={760} size={50} color={C.grey} op={aparece(t, T.importa)}>
          fuerza
        </Texto>
        <Texto x={540} y={960} size={110} color={C.red} op={aparece(t, T.giro)}>
          GIRO
        </Texto>
        <g opacity={aparece(t, T.giro)}>
          <path d="M 300 1060 A 280 120 0 0 0 780 1060" stroke={C.red} strokeWidth={10} fill="none" />
          <path d="M 780 1060 l -36 -6 l 18 30 Z" fill={C.red} />
        </g>
        <Texto x={540} y={1300} size={40} color={C.yellow} op={aparece(t, T.peligroso)}>
          por eso es tan peligroso
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.giro} color={C.red} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
