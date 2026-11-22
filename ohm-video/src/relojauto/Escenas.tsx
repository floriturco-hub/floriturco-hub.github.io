import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/relojauto/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  automatico: 2.68, // automatico
  bateria: 3.86, // bateria
  cuerda: 5.28, // cuerda
  final: 6.44, // final
  aguanta: 7.62, // aguanta
  rotor: 11.72, // rotor
  muneca: 13.40, // mu
  engranes: 14.68, // engranes
  resorte: 16.44, // resorte
  espiral: 17.00, // espiral
  energia: 19.60, // energia
  escape: 20.54, // escape
  volante: 23.90, // volante
  manecillas: 27.42, // manecillas
  llena: 29.14, // llena
  embrague: 29.80, // embrague
  quitas: 32.70, // quitas
  dias: 34.46, // dias
  asi: 35.18, // asi
  fin: 37.12, // FIN
};

const ORO = "#E8C870";
const ACERO = "#C8CCD8";

// Esfera del reloj con manecillas
const Reloj: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-330} width={140} height={160} rx={20} fill="#5A4030" />
    <rect x={-70} y={170} width={140} height={160} rx={20} fill="#5A4030" />
    <circle cx={0} cy={0} r={200} fill={ACERO} />
    <circle cx={0} cy={0} r={175} fill="#1A2633" />
    {new Array(12).fill(0).map((_, k) => (
      <rect key={k} x={-4} y={-165} width={8} height={24} fill={ORO} transform={`rotate(${k * 30})`} />
    ))}
    <rect x={-6} y={-100} width={12} height={110} fill={ACERO} transform={`rotate(${t * 6})`} />
    <rect x={-4} y={-150} width={8} height={160} fill={ACERO} transform={`rotate(${t * 72})`} />
    <rect x={-2} y={-160} width={4} height={180} fill={C.orange} transform={`rotate(${Math.floor(t * 8) * 6 * 0.75})`} />
    <circle cx={0} cy={0} r={10} fill={ORO} />
  </g>
);

// Mecanismo por detrás: rotor (ángulo r), barrilete con resorte (nivel n), volante oscilando
const Mecanismo: React.FC<{ readonly t: number; readonly rot: number; readonly nivel: number; readonly volante?: number; readonly rotorOp?: number }> = ({ t, rot, nivel, volante = 0, rotorOp = 1 }) => {
  const vueltas = 2 + 6 * nivel;
  const esp: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * vueltas * Math.PI * 2;
    const r = 18 + (i / 120) * 110;
    esp.push(`${i ? "L" : "M"} ${Math.cos(a) * r} ${Math.sin(a) * r}`);
  }
  const osc = volante * 30 * Math.sin(t * 16);
  return (
    <g>
      <circle cx={540} cy={1000} r={330} fill="#2A2E3A" stroke={ACERO} strokeWidth={10} />
      {/* barrilete */}
      <g transform="translate(430 1000)">
        <circle cx={0} cy={0} r={140} fill="#1A1E28" stroke={ORO} strokeWidth={6} />
        <path d={esp.join(" ")} stroke={C.yellow} strokeWidth={4} fill="none" />
      </g>
      {/* volante */}
      <g transform={`translate(720 1120) rotate(${osc})`} opacity={volante > 0 ? 1 : 0.4}>
        <circle cx={0} cy={0} r={80} fill="none" stroke={ORO} strokeWidth={10} />
        <line x1={-80} y1={0} x2={80} y2={0} stroke={ORO} strokeWidth={6} />
        <line x1={0} y1={-80} x2={0} y2={80} stroke={ORO} strokeWidth={6} />
      </g>
      {/* engrane intermedio */}
      <g transform={`translate(700 860) rotate(${rot * 2})`}>
        <circle cx={0} cy={0} r={60} fill="none" stroke={ACERO} strokeWidth={14} strokeDasharray="12 8" />
      </g>
      {/* rotor de media luna */}
      <g transform={`translate(540 1000) rotate(${rot})`} opacity={rotorOp}>
        <path d="M -310 0 A 310 310 0 0 0 310 0 L 250 0 A 250 250 0 0 1 -250 0 Z" fill={ORO} opacity={0.85} />
        <circle cx={0} cy={0} r={22} fill={ACERO} />
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Reloj x={540} y={1000} t={t} s={1.3} />
    <Texto x={880} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo funciona este reloj sin pila?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.automatico], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Un reloj automático no usa batería ni le das cuerda a mano + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.automatico, T.rotor], [1, 1.04])}>
      <Reloj x={540} y={980} t={t} s={1.1} />
      <g opacity={aparece(t, T.bateria)} transform="translate(250 1420)">
        <rect x={-60} y={-30} width={120} height={60} rx={10} fill="none" stroke={C.grey} strokeWidth={6} />
        <line x1={-80} y1={-50} x2={80} y2={50} stroke={C.red} strokeWidth={8} />
      </g>
      <Texto x={250} y={1520} size={30} color={C.grey} op={aparece(t, T.bateria)}>
        sin pila
      </Texto>
      <g opacity={aparece(t, T.cuerda)} transform="translate(830 1420)">
        <circle cx={0} cy={0} r={34} fill="none" stroke={C.grey} strokeWidth={6} />
        <line x1={-60} y1={-50} x2={60} y2={50} stroke={C.red} strokeWidth={8} />
      </g>
      <Texto x={830} y={1520} size={30} color={C.grey} op={aparece(t, T.cuerda)}>
        sin darle cuerda
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuánto aguanta sin usarlo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.rotor], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Un rotor de media luna gira cada vez que mueves la muñeca
export const Rotor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rot = 50 * Math.sin(t * 2.4) * aparece(t, T.muneca);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rotor, T.engranes], [1, 1.04])}>
        <g transform={`rotate(${8 * Math.sin(t * 2.4) * aparece(t, T.muneca)} 540 1000)`}>
          <Mecanismo t={t} rot={rot} nivel={0.2} />
        </g>
        <Texto x={540} y={600} size={42} color={ORO} op={aparece(t, T.rotor)}>
          el rotor
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.white} op={aparece(t, T.muneca)}>
          gira cuando mueves la muñeca
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.rotor} color={ORO} />
    </>
  );
};

// D. Con engranes, el giro enrolla un resorte en espiral: la cuerda guarda la energía
export const Cuerda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nivel = interpolate(t, [T.engranes, T.energia + 0.5], [0.2, 0.9], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.engranes, T.escape], [1, 1.04])}>
      <Mecanismo t={t} rot={t * 120} nivel={nivel} rotorOp={0.35} />
      <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.engranes)}>
        los engranes enrollan…
      </Texto>
      <Texto x={540} y={1440} size={40} color={C.yellow} op={aparece(t, T.espiral)}>
        un resorte en espiral: la cuerda
      </Texto>
      <Texto x={540} y={1510} size={34} color={C.white} op={aparece(t, T.energia)}>
        ahí se guarda la energía
      </Texto>
    </Lienzo>
  );
};

// E. El escape deja salir la energía poco a poco y hace oscilar un volante: tic tac
export const Escape: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.escape, T.llena], [1, 1.04])}>
        <Mecanismo t={t} rot={0} nivel={0.85} volante={aparece(t, T.volante)} rotorOp={0.2} />
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.escape)}>
          el escape: poco a poco
        </Texto>
        <Texto x={720} y={1260} size={32} color={ORO} op={aparece(t, T.volante)}>
          volante
        </Texto>
        <Texto x={540} y={1440} size={44} color={C.yellow} op={aparece(t, T.manecillas)}>
          tic tac → manecillas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.volante} color={ORO} />
    </>
  );
};

// F. Con la cuerda llena, un embrague resbala para no romper el resorte
export const Embrague: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.llena, T.quitas], [1, 1.04])}>
      <Mecanismo t={t} rot={t * 120} nivel={1} volante={1} rotorOp={0.6} />
      <circle cx={430} cy={1000} r={150} fill="none" stroke="#5AD08A" strokeWidth={8} strokeDasharray="20 14" strokeDashoffset={t * 80} opacity={aparece(t, T.embrague)} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.llena)}>
        cuerda llena…
      </Texto>
      <Texto x={540} y={1440} size={38} color="#5AD08A" op={aparece(t, T.embrague)}>
        el embrague resbala
      </Texto>
    </Lienzo>
  );
};

// G. Si te lo quitas, suele aguantar unos dos días
export const Reserva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.quitas, T.asi], [1, 0.1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.quitas, T.asi], [1, 1.04])}>
        <Reloj x={540} y={900} t={t} s={0.9} />
        <g transform="translate(540 1320)">
          <rect x={-300} y={-30} width={600} height={60} rx={30} fill="#2A2E3A" />
          <rect x={-300} y={-30} width={600 * u} height={60} rx={30} fill={C.yellow} />
        </g>
        <Texto x={540} y={1250} size={30} color={C.white} op={aparece(t, T.quitas)}>
          cuerda restante
        </Texto>
        <Texto x={540} y={1450} size={46} color={C.yellow} op={aparece(t, T.dias)}>
          ~2 días
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.dias} color={C.yellow} />
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
