import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/helicoptero/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  su: 2.06,
  cielo: 3.72,
  va: 5.04,
  final: 7.38,
  cola: 9.84,
  cada: 10.6,
  angulo: 12.48,
  plato: 14.34,
  si: 15.98,
  muerden: 16.52,
  inclina: 20.98,
  el: 22.04,
  adelante: 25.14,
  va2: 27.98,
  y: 29.18,
  sin: 30.54,
  gira: 31.56,
  la: 33.52,
  derecho: 35.58,
  porEso: 36.36,
  fin: 38.16,
};

const CUERPO = "#C84A3A";

// Helicóptero de perfil mirando a la derecha; incl = inclinación del rotor/cuerpo (grados)
const Heli: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly incl?: number; readonly colaBrillo?: number }> = ({
  x,
  y,
  s,
  t,
  incl = 0,
  colaBrillo = 0,
}) => {
  const pala = Math.cos(t * 30) * 300;
  return (
    <g transform={`translate(${x} ${y}) rotate(${incl}) scale(${s})`}>
      <rect x={-6} y={-150} width={12} height={50} fill="#3A3650" />
      <line x1={-pala} y1={-150} x2={pala} y2={-150} stroke="#C8C4D8" strokeWidth={10} strokeLinecap="round" />
      <ellipse cx={0} cy={-150} rx={300} ry={10} fill="#C8C4D8" opacity={0.15} />
      <ellipse cx={0} cy={-40} rx={150} ry={80} fill={CUERPO} />
      <path d="M 40 -90 Q 140 -80 150 -30 L 60 -30 Z" fill="#8AC8E8" />
      <path d="M -130 -60 L -380 -40 L -380 -20 L -130 -10 Z" fill={CUERPO} />
      <circle cx={-390} cy={-40} r={44} fill="none" stroke={colaBrillo > 0.5 ? C.yellow : "#C8C4D8"} strokeWidth={colaBrillo > 0.5 ? 10 : 5} />
      <line x1={-390} y1={-40 - Math.cos(t * 40) * 44} x2={-390} y2={-40 + Math.cos(t * 40) * 44} stroke="#C8C4D8" strokeWidth={6} />
      <path d="M -100 40 L -100 70 M 80 40 L 80 70 M -150 70 L 140 70" stroke="#3A3650" strokeWidth={10} fill="none" />
    </g>
  );
};

// Flecha
const Flecha: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly color: string; readonly op?: number; readonly w?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  op = 1,
  w = 12,
}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} />
      <path d={`M ${x2 + Math.cos(a) * 24} ${y2 + Math.sin(a) * 24} L ${x2 + Math.cos(a + 2.4) * 30} ${y2 + Math.sin(a + 2.4) * 30} L ${x2 + Math.cos(a - 2.4) * 30} ${y2 + Math.sin(a - 2.4) * 30} Z`} fill={color} />
    </g>
  );
};

// A. Gancho: ¿cómo vuela de lado un helicóptero?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.su], [1.12, 1])}>
        <Heli x={560} y={900} s={1.2} t={t} />
        {[0, 90, 180, 270].map((a) => (
          <Flecha key={a} x1={560 + Math.cos((a * Math.PI) / 180) * 380} y1={900 + Math.sin((a * Math.PI) / 180) * 300} x2={560 + Math.cos((a * Math.PI) / 180) * 470} y2={900 + Math.sin((a * Math.PI) / 180) * 380} color={C.cyan} op={q * 0.7} />
        ))}
        <Texto x={560} y={1380} size={110} color={C.yellow} op={q}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.74} color={C.cyan} />
    </>
  );
};

// B. Su hélice siempre apunta al cielo y aun así va adelante, atrás o de lado + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dx = interpolate(t, [T.va, T.va + 0.8, T.va + 1.6, T.final], [0, 160, -160, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.su, T.cada], [1, 1.05])}>
      <Heli x={560 + dx} y={860} s={0.9} t={t} incl={dx / 20} colaBrillo={aparece(t, T.cola - 0.6)} />
      <Flecha x1={560 + dx} y1={700} x2={560 + dx} y2={560} color={C.yellow} op={aparece(t, T.cielo - 0.6)} />
      <Texto x={560} y={500} size={34} color={C.yellow} op={aparece(t, T.cielo)}>
        siempre hacia el cielo
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.cada], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={36}>
          para qué sirve la hélice de la cola: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Perfil de pala (ala) con ángulo
const Pala: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly ang: number }> = ({ x, y, s, ang }) => (
  <g transform={`translate(${x} ${y}) rotate(${-ang}) scale(${s})`}>
    <path d="M -120 0 Q -100 -26 0 -24 Q 80 -18 130 0 Q 80 10 0 12 Q -100 14 -120 0 Z" fill="#C8C4D8" />
  </g>
);

// C. Cada pala puede cambiar su ángulo mientras gira, gracias a un plato móvil debajo
export const Palas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ang = 8 + 6 * Math.sin((t - T.cada) * 2) * aparece(t, T.angulo - 0.6);
  const plato = aparece(t, T.plato - 0.3);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.si], [1, 1.04])}>
      <Pala x={540} y={680} s={2.2} ang={ang} />
      <line x1={200} y1={680} x2={880} y2={680} stroke="#4A4466" strokeWidth={4} strokeDasharray="12 10" />
      <Texto x={540} y={540} size={36} color={C.white} op={aparece(t, T.angulo)}>
        {`ángulo: ${Math.round(ang)}°`}
      </Texto>
      <g opacity={plato}>
        <rect x={530} y={860} width={20} height={300} fill="#3A3650" />
        <g transform={`rotate(${Math.sin(t * 2) * 8} 540 1060)`}>
          <ellipse cx={540} cy={1060} rx={200} ry={40} fill={C.orange} />
          <line x1={400} y1={1050} x2={400} y2={900} stroke="#8A86A8" strokeWidth={8} />
          <line x1={680} y1={1050} x2={680} y2={900} stroke="#8A86A8" strokeWidth={8} />
        </g>
        <Texto x={540} y={1240} size={36} color={C.orange}>
          plato móvil
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Si muerden más aire en un lado, empujan más fuerte ahí y el disco se inclina
export const Disco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lado = aparece(t, T.muerden);
  const incl = interpolate(t, [T.inclina - 0.6, T.inclina + 0.4], [0, 14], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.el], [1, 1.04])}>
        <g transform={`rotate(${incl} 540 820)`}>
          <ellipse cx={540} cy={820} rx={380} ry={60} fill="#C8C4D8" opacity={0.25} stroke="#C8C4D8" strokeWidth={4} />
          {[-1, 1].map((l) => (
            <Flecha key={l} x1={540 + l * 230} y1={800} x2={540 + l * 230} y2={l > 0 ? 800 - 120 - 120 * lado : 800 - 120} color={l > 0 ? C.yellow : C.cyan} />
          ))}
        </g>
        <rect x={530} y={830} width={20} height={200} fill="#3A3650" />
        <Texto x={760} y={540} size={34} color={C.yellow} op={lado}>
          más empuje aquí
        </Texto>
        <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.inclina)}>
          el disco se inclina
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.inclina} color={C.yellow} />
    </>
  );
};

// E. El empuje ahora apunta hacia adelante, atrás o al lado; el helicóptero va hacia donde se inclina
export const Empuje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const incl = interpolate(t, [T.el, T.adelante], [0, 14], suave);
  const avanza = interpolate(t, [T.va2 - 0.4, T.y], [0, 1], suave);
  const a = ((90 - incl) * Math.PI) / 180;
  const cx = 480 + avanza * 220;
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.y], [1, 1.04])}>
      <Heli x={cx} y={900} s={0.9} t={t} incl={incl} />
      <Flecha x1={cx} y1={740} x2={cx + Math.cos(a) * 260} y2={740 - Math.sin(a) * 260} color={C.yellow} />
      <g opacity={aparece(t, T.adelante - 0.4)}>
        <Flecha x1={cx} y1={740} x2={cx} y2={740 - Math.sin(a) * 240} color={C.cyan} op={0.6} w={8} />
        <Flecha x1={cx} y1={740} x2={cx + Math.cos(a) * 240} y2={740} color={C.orange} op={0.8} w={8} />
      </g>
      <Texto x={540} y={1200} size={38} color={C.orange} op={aparece(t, T.adelante)}>
        parte del empuje va hacia adelante
      </Texto>
      <Texto x={540} y={1280} size={36} color={C.white} op={aparece(t, T.va2)}>
        y el helicóptero avanza
      </Texto>
    </Lienzo>
  );
};

// F. Sin la cola, el cuerpo giraría al revés que el rotor; la hélice chiquita lo mantiene derecho
export const Cola: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sinCola = interpolate(t, [T.sin, T.la], [0, 1], clamp);
  const conCola = aparece(t, T.la);
  const giro = sinCola * (1 - conCola) * (t - T.sin) * -60;
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.porEso], [1, 1.04])}>
      {/* vista desde arriba */}
      <g transform={`rotate(${giro} 540 800)`}>
        <ellipse cx={540} cy={800} rx={90} ry={150} fill={CUERPO} />
        <rect x={525} y={940} width={30} height={260} fill={CUERPO} />
        <rect x={555} y={1170} width={60} height={14} fill={conCola > 0.5 ? C.yellow : "#C8C4D8"} />
        {conCola > 0.5 ? <Flecha x1={620} y1={1177} x2={760} y2={1177} color={C.yellow} /> : null}
      </g>
      <g transform={`rotate(${t * 400} 540 800)`}>
        <line x1={240} y1={800} x2={840} y2={800} stroke="#C8C4D8" strokeWidth={10} />
        <line x1={540} y1={500} x2={540} y2={1100} stroke="#C8C4D8" strokeWidth={10} />
      </g>
      <path d="M 540 470 A 330 330 0 0 1 870 800" stroke={C.cyan} strokeWidth={8} fill="none" />
      <Texto x={820} y={520} size={30} color={C.cyan}>
        rotor
      </Texto>
      <g opacity={sinCola * (1 - conCola)}>
        <path d="M 400 640 A 200 200 0 0 0 400 960" stroke={C.red} strokeWidth={8} fill="none" />
        <Texto x={540} y={1300} size={38} color={C.red}>
          sin cola: el cuerpo gira al revés
        </Texto>
      </g>
      <Texto x={540} y={1300} size={38} color={C.yellow} op={conCola}>
        la cola lo mantiene derecho
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
      <Heli x={560} y={900} s={1.2} t={t} />
      {[0, 90, 180, 270].map((a) => (
        <Flecha key={a} x1={560 + Math.cos((a * Math.PI) / 180) * 380} y1={900 + Math.sin((a * Math.PI) / 180) * 300} x2={560 + Math.cos((a * Math.PI) / 180) * 470} y2={900 + Math.sin((a * Math.PI) / 180) * 380} color={C.cyan} op={q * 0.7} />
      ))}
      <Texto x={560} y={1380} size={110} color={C.yellow} op={q}>
        ?
      </Texto>
    </Lienzo>
  );
};
