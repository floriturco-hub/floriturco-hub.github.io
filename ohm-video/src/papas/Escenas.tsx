import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/papas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  intentas: 2.04, // intentas
  noche: 4.66, // noche
  trueno: 6.14, // trueno
  final: 7.20, // final
  bolsa: 9.32, // bolsa
  capas: 11.90, // capas
  aluminio: 13.44, // aluminio
  oxigeno: 15.32, // oxigeno
  rigida: 17.22, // rigida
  pandea: 20.30, // pandea
  chasquido: 21.58, // chasquido
  arruga: 22.70, // arruga
  miles: 24.62, // miles
  crujido: 26.78, // crujido
  silencio: 29.00, // silencio
  inflada: 32.04, // inflada
  nitrogeno: 32.54, // nitrogeno
  crujientes: 35.82, // crujientes
  porEso: 36.86, // por
  fin: 38.56, // FIN
};

const BOLSA = "#E84A3A";

// Bolsa de papas; arruga = 0..1 deformación
const Bolsa: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly arruga?: number; readonly t?: number }> = ({ x, y, s = 1, arruga = 0, t = 0 }) => {
  const zig = (lado: number) =>
    new Array(9)
      .fill(0)
      .map((_, i) => `${lado * (160 + arruga * 18 * Math.sin(i * 2.3 + t * 12))} ${-240 + i * 60}`)
      .join(" L ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -170 -260 L 170 -260 L ${zig(1)} L 170 260 L -170 260 L ${zig(-1).split(" L ").reverse().join(" L ")} Z`} fill={BOLSA} />
      <rect x={-170} y={-280} width={340} height={30} fill="#C83A2A" />
      <rect x={-170} y={250} width={340} height={30} fill="#C83A2A" />
      <ellipse cx={0} cy={0} rx={110} ry={70} fill={C.yellow} />
      <Texto x={0} y={14} size={44} color={BOLSA}>
        PAPAS
      </Texto>
    </g>
  );
};

const Ondas: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) => (
  <g opacity={op}>
    {[0, 1, 2].map((k) => {
      const u = (t * 2 + k / 3) % 1;
      const r = 220 + u * 200;
      return (
        <g key={k} opacity={1 - u}>
          <path d={`M ${x - r} ${y - r * 0.5} A ${r} ${r} 0 0 0 ${x - r} ${y + r * 0.5}`} stroke={C.yellow} strokeWidth={8} fill="none" />
          <path d={`M ${x + r} ${y - r * 0.5} A ${r} ${r} 0 0 1 ${x + r} ${y + r * 0.5}`} stroke={C.yellow} strokeWidth={8} fill="none" />
        </g>
      );
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Bolsa x={540} y={960} arruga={1} t={t} />
    <Ondas x={540} y={960} t={t} op={1} />
    <Texto x={540} y={1450} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta bolsa suena tanto?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.intentas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Abrirla en silencio de noche: suena como un trueno + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ruido = aparece(t, T.trueno);
  return (
    <Lienzo zoom={interpolate(t, [T.intentas, T.bolsa], [1, 1.04]) + ruido * 0.01 * Math.sin(t * 60)}>
      <circle cx={860} cy={620} r={70} fill="#E8E8C8" opacity={aparece(t, T.noche)} />
      <circle cx={890} cy={600} r={60} fill="#0E0B1E" opacity={aparece(t, T.noche)} />
      <Bolsa x={540} y={1000} arruga={ruido} t={t} />
      <Ondas x={540} y={1000} t={t} op={ruido} />
      <Texto x={540} y={1430} size={40} color={C.grey} op={aparece(t, T.intentas) * (1 - ruido)}>
        shhh…
      </Texto>
      <Texto x={540} y={1430} size={60} color={C.yellow} op={ruido}>
        ¡CRAAAC!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué gas hay dentro?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.bolsa], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Varias capas, una de aluminio, para bloquear la luz y el oxígeno
export const Capas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const capas = [
    ["plástico impreso", BOLSA],
    ["aluminio", "#C8C8D4"],
    ["plástico", "#E8E8EE"],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.bolsa, T.rigida], [1, 1.04])}>
      {capas.map(([nom, col], k) => (
        <g key={k} opacity={aparece(t, k === 1 ? T.aluminio : k === 0 ? T.bolsa : T.capas + 0.3)} transform={`translate(0 ${k * 140})`}>
          <path d="M 160 760 L 760 760 L 920 840 L 320 840 Z" fill={col} />
          <Texto x={540} y={900} size={32} color={col}>
            {nom}
          </Texto>
        </g>
      ))}
      <g opacity={aparece(t, T.oxigeno)}>
        {[0, 1, 2].map((k) => {
          const u = (t * 0.8 + k / 3) % 1;
          return (
            <g key={k}>
              <circle cx={300 + k * 200} cy={560 + u * 160} r={18} fill={C.red} />
              <circle cx={330 + k * 200} cy={560 + u * 160} r={18} fill={C.red} />
            </g>
          );
        })}
        <Texto x={540} y={1300} size={38} color={C.white}>
          bloquea luz y oxígeno ✗
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Rígida: al doblarla se pandea de golpe con un chasquido; miles de saltos = crujido
export const Pandeo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const salto = t > T.chasquido ? 1 : interpolate(t, [T.pandea - 0.6, T.chasquido], [0, 0.3], clamp);
  const lam = (b: number) => `M 200 900 Q 540 ${900 - 160 * (1 - 2 * b)} 880 900`;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rigida, T.silencio], [1, 1.04])}>
        <g opacity={1 - aparece(t, T.miles)}>
          <path d={lam(salto)} stroke="#C8C8D4" strokeWidth={14} fill="none" />
          <path d="M 200 960 L 200 840 M 880 960 L 880 840" stroke={C.cyan} strokeWidth={8} />
          <path d="M 160 900 l 40 0 M 920 900 l -40 0" stroke={C.cyan} strokeWidth={8} />
          <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.rigida)}>
            lámina rígida
          </Texto>
          <Texto x={540} y={600} size={56} color={C.yellow} op={t > T.chasquido ? 1 : 0}>
            ¡CLIC!
          </Texto>
        </g>
        <g opacity={aparece(t, T.miles)}>
          {new Array(30).fill(0).map((_, k) => {
            const on = Math.sin(t * 20 + k * 7) > 0.7;
            return <path key={k} d={`M ${150 + (k % 6) * 150} ${700 + Math.floor(k / 6) * 130} l 30 -20 l 30 20`} stroke={on ? C.yellow : "#C8C8D4"} strokeWidth={6} fill="none" />;
          })}
          <Texto x={540} y={1450} size={42} color={C.yellow} op={aparece(t, T.crujido)}>
            miles de clics = crujido
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.chasquido} color={C.yellow} />
    </>
  );
};

// E. De noche, en silencio, tu oído lo nota más; inflada con nitrógeno para mantenerlas crujientes
export const Nitrogeno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n2 = aparece(t, T.nitrogeno);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.silencio, T.porEso], [1, 1.04])}>
        <g opacity={1 - aparece(t, T.inflada)}>
          <rect x={200} y={760} width={680} height={60} rx={20} fill="#2A2440" />
          <rect x={200} y={760} width={60} height={60} rx={20} fill={C.grey} />
          <Texto x={540} y={720} size={36} color={C.grey}>
            ruido de fondo de noche: casi nada
          </Texto>
          <rect x={200} y={960} width={680} height={60} rx={20} fill="#2A2440" />
          <rect x={200} y={960} width={480} height={60} rx={20} fill={C.yellow} />
          <Texto x={540} y={920} size={36} color={C.yellow}>
            la bolsa
          </Texto>
        </g>
        <g opacity={aparece(t, T.inflada)}>
          <Bolsa x={540} y={960} s={1.1} />
          {new Array(10).fill(0).map((_, k) => (
            <g key={k} opacity={n2}>
              <circle cx={380 + (k % 5) * 80 + 10 * Math.sin(t * 2 + k)} cy={760 + Math.floor(k / 5) * 400 + 10 * Math.cos(t * 2 + k)} r={16} fill={C.cyan} />
              <circle cx={406 + (k % 5) * 80 + 10 * Math.sin(t * 2 + k)} cy={760 + Math.floor(k / 5) * 400 + 10 * Math.cos(t * 2 + k)} r={16} fill={C.cyan} />
            </g>
          ))}
          <Texto x={540} y={1400} size={48} color={C.cyan} op={n2}>
            nitrógeno (N₂)
          </Texto>
          <Texto x={540} y={1470} size={34} color={C.white} op={aparece(t, T.crujientes)}>
            no reacciona: papas crujientes
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.nitrogeno} color={C.cyan} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
