import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/rfid/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  pasas: 1.80, // pasas
  ochenta: 2.26, // ochenta
  parabrisas: 4.56, // parabrisas
  final: 5.72, // final
  etiqueta: 9.98, // etiqueta
  chip: 10.68, // chip
  antena: 11.82, // antena
  envia: 13.52, // envia
  ondas: 13.98, // ondas
  llegar: 15.30, // llegar
  inducen: 16.72, // inducen
  corriente: 17.90, // corriente
  energia: 19.14, // energia
  despertar: 20.16, // despertar
  responde: 21.32, // responde
  numero: 22.06, // numero
  modulando: 22.56, // modulando
  todo: 24.62, // todo
  milesimas: 25.36, // milesimas
  sistema: 27.76, // sistema
  cobra: 29.32, // cobra
  chip2: 30.64, // chip
  alimenta: 32.44, // alimenta
  asi: 34.58, // asi
  fin: 36.26, // FIN
};

const RADIO = C.cyan;
const VUELTA = C.yellow;

// Pórtico del peaje con antena
const Portico: React.FC<{ readonly ondas: number; readonly t: number }> = ({ ondas, t }) => (
  <g>
    <rect x={120} y={560} width={40} height={720} fill="#5A5478" />
    <rect x={920} y={560} width={40} height={720} fill="#5A5478" />
    <rect x={120} y={540} width={840} height={60} rx={10} fill="#3A3650" />
    <rect x={500} y={600} width={80} height={40} rx={8} fill="#8C88A8" />
    <g opacity={ondas}>
      {[0, 1, 2].map((k) => {
        const r = 40 + ((t * 160 + k * 60) % 180);
        return <path key={k} d={`M ${540 - r} ${640 + r * 0.4} Q 540 ${640 + r * 1.2} ${540 + r} ${640 + r * 0.4}`} stroke={RADIO} strokeWidth={6} fill="none" opacity={1 - r / 220} />;
      })}
    </g>
  </g>
);

// Auto de perfil
const Auto: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -220 0 L -200 -70 L -100 -80 L -40 -150 L 120 -150 L 190 -80 L 230 -70 L 240 0 Z" fill={C.red} />
    <path d="M -30 -138 L 110 -138 L 160 -84 L -80 -84 Z" fill="#8AC8F8" />
    <rect x={20} y={-130} width={30} height={22} rx={4} fill={C.white} />
    <circle cx={-130} cy={0} r={48} fill="#111" />
    <circle cx={150} cy={0} r={48} fill="#111" />
    <circle cx={-130} cy={0} r={20} fill="#5A5478" />
    <circle cx={150} cy={0} r={20} fill="#5A5478" />
  </g>
);

// Etiqueta en el parabrisas: chip y antena enrollada
const Etiqueta: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly antena: number; readonly corriente: number; readonly chip: number; readonly t: number }> = ({
  x,
  y,
  s,
  antena,
  corriente,
  chip,
  t,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-160} width={520} height={320} rx={24} fill={C.white} />
    <g opacity={antena}>
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={-230 + k * 22} y={-130 + k * 22} width={460 - k * 44} height={260 - k * 44} rx={14} fill="none" stroke={corriente > 0.5 ? C.orange : "#C88A4A"} strokeWidth={8} />
      ))}
      {corriente > 0
        ? [0, 1, 2].map((k) => {
            const u = (t * 0.7 + k / 3) % 1;
            return <circle key={k} cx={-230 + u * 460} cy={-130} r={10} fill={C.yellow} opacity={corriente} />;
          })
        : null}
    </g>
    <rect x={-40} y={-30} width={80} height={60} rx={8} fill={chip > 0.5 ? C.yellow : "#3A3650"} opacity={0.4 + 0.6 * aparecer(chip)} />
  </g>
);
const aparecer = (v: number) => Math.min(1, Math.max(0, v));

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <rect x={0} y={1280} width={1080} height={200} fill="#2A2A38" />
    <Portico ondas={1} t={t} />
    <Auto x={540} y={1230} s={1.2} />
    <Texto x={540} y={480} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo te cobra el peaje sin parar?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pasas], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={RADIO} />
    </>
  );
};

// B. Pasas a ochenta por hora y te cobra a través del parabrisas + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x = interpolate(t, [T.pasas, T.etiqueta], [-300, 1400], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.pasas, T.etiqueta], [1, 1.04])}>
      <rect x={0} y={1280} width={1080} height={200} fill="#2A2A38" />
      <Portico ondas={1} t={t} />
      <Auto x={x} y={1230} s={1.1} />
      <Texto x={540} y={790} size={60} color={C.white} op={aparece(t, T.ochenta) * (1 - aparece(t, T.final))}>
        80 km/h
      </Texto>
      <g opacity={aparece(t, T.parabrisas) * (1 - aparece(t, T.final))}>
        <rect x={360} y={850} width={360} height={90} rx={18} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={910} size={40} color={C.yellow}>
          cobrado
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={820} width={700} height={24} rx={12} fill="#2A2440" />
        <rect x={190} y={820} width={700 * interpolate(t, [T.final, T.etiqueta], [0, 1], clamp)} height={24} rx={12} fill={C.yellow} />
        <Texto x={540} y={910} color={C.white} size={36}>
          ¿y la batería del chip? al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. En tu parabrisas hay una etiqueta con un chip diminuto y una antena
export const Etiq: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.etiqueta, T.envia], [1, 1.04])}>
      <rect x={60} y={560} width={960} height={760} rx={40} fill="#8AC8F8" opacity={0.25} />
      <Etiqueta x={540} y={900} s={1.4} antena={aparece(t, T.antena)} corriente={0} chip={aparece(t, T.chip) * 0.5} t={t} />
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.chip)}>
        chip diminuto
      </Texto>
      <Texto x={540} y={1300} size={36} color={C.orange} op={aparece(t, T.antena)}>
        + antena enrollada
      </Texto>
    </Lienzo>
  );
};

// D. La antena del peaje envía ondas de radio que inducen una corriente en tu antena
export const Induce: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.envia, T.energia], [1, 1.04])}>
        <rect x={440} y={430} width={200} height={70} rx={12} fill="#8C88A8" />
        <Texto x={540} y={480} size={30} color="#141030">
          peaje
        </Texto>
        <g opacity={aparece(t, T.ondas)}>
          {[0, 1, 2, 3].map((k) => {
            const r = (t * 220 + k * 90) % 360;
            return <path key={k} d={`M ${540 - 200} ${510 + r} Q 540 ${560 + r} ${540 + 200} ${510 + r}`} stroke={RADIO} strokeWidth={8} fill="none" opacity={1 - r / 400} />;
          })}
        </g>
        <Etiqueta x={540} y={1060} s={1.1} antena={1} corriente={aparece(t, T.inducen)} chip={0} t={t} />
        <Texto x={540} y={1330} size={38} color={C.orange} op={aparece(t, T.corriente)}>
          una pequeña corriente
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.inducen} color={C.orange} />
    </>
  );
};

// E. Esa energía despierta al chip, que responde con su número modulando la misma onda
export const Responde: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bits = "1 0 1 1 0 0 1 0";
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.energia, T.todo], [1, 1.04])}>
        <rect x={440} y={430} width={200} height={70} rx={12} fill="#8C88A8" />
        <Etiqueta x={540} y={1060} s={1.1} antena={1} corriente={1} chip={aparece(t, T.despertar)} t={t} />
        <g opacity={aparece(t, T.responde)}>
          {[0, 1, 2].map((k) => {
            const r = (t * 220 + k * 120) % 360;
            return (
              <path
                key={k}
                d={`M ${540 - 200} ${870 - r} Q 540 ${820 - r} ${540 + 200} ${870 - r}`}
                stroke={VUELTA}
                strokeWidth={8}
                strokeDasharray={k % 2 ? "30 12" : "12 12"}
                fill="none"
                opacity={1 - r / 400}
              />
            );
          })}
        </g>
        <g opacity={aparece(t, T.numero)}>
          <rect x={290} y={1320} width={500} height={110} rx={20} fill={C.card} stroke={VUELTA} strokeWidth={4} />
          <Texto x={540} y={1395} size={46} color={VUELTA}>
            {aparece(t, T.modulando) > 0.5 ? bits : "ID: 48210"}
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.despertar} color={C.yellow} />
    </>
  );
};

// F. Todo en milésimas de segundo; el sistema busca el número y cobra a tu cuenta
export const Cobro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.todo, T.chip2], [1, 1.04])}>
      <Texto x={540} y={560} size={60} color={C.white} op={aparece(t, T.milesimas)}>
        0,005 s
      </Texto>
      <g opacity={aparece(t, T.sistema)}>
        <rect x={240} y={720} width={600} height={420} rx={30} fill={C.card} stroke={C.grey} strokeWidth={4} />
        <Texto x={540} y={800} size={36} color={C.grey}>
          ID 48210
        </Texto>
        <Texto x={540} y={900} size={40} color={C.white}>
          tu cuenta
        </Texto>
        <Texto x={540} y={1040} size={64} color={C.red} op={aparece(t, T.cobra)}>
          − peaje
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. El chip no necesita batería: lo alimenta la antena del peaje
export const Bateria: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.chip2, T.asi], [1, 1.04])}>
        <g transform="translate(540 760)" opacity={aparece(t, T.chip2)}>
          <rect x={-90} y={-160} width={180} height={320} rx={20} fill="none" stroke={C.white} strokeWidth={10} />
          <rect x={-40} y={-190} width={80} height={30} rx={8} fill={C.white} />
          <line x1={-160} y1={-200} x2={160} y2={200} stroke={C.red} strokeWidth={16} />
        </g>
        <Texto x={540} y={1060} size={40} color={C.white} op={aparece(t, T.chip2)}>
          sin batería
        </Texto>
        <g opacity={aparece(t, T.alimenta)}>
          <path d="M 540 1120 L 540 1250 M 515 1220 L 540 1250 L 565 1220" stroke={RADIO} strokeWidth={8} fill="none" />
          <Texto x={540} y={1320} size={38} color={RADIO}>
            la energía viene del peaje
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.alimenta} color={RADIO} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
