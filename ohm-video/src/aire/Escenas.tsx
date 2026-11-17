import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/aire/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  dices: 2.10, // dices
  final: 5.28, // final
  adentro: 8.06, // adentro
  dif: 9.68, // dif
  liquido: 11.88, // liquido
  encima: 12.62, // encima
  vapor: 14.26, // vapor
  apretar: 15.46, // apretar
  disparado: 17.22, // disparado
  entonces: 18.02, // entonces
  hierve: 20.58, // hierve
  pero: 22.38, // pero
  calor: 23.38, // calor
  mano: 25.40, // mano
  enfria: 26.48, // enfria
  si: 27.08, // si
  mismo: 29.32, // mismo
  teclado: 30.84, // teclado
  congela: 31.58, // congela
  porEso: 32.36, // por
  fin: 34.40, // FIN
};

const LIQ = "#2AA8D8";
const HIELO = "#DDF4FF";

// Lata de aire comprimido: corte 0-1 muestra el interior, escarcha 0-1
const Lata: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly corte?: number;
  readonly nivel?: number;
  readonly escarcha?: number;
  readonly rot?: number;
  readonly t?: number;
  readonly hervor?: number;
  readonly inv?: boolean;
}> = ({ x, y, s, corte = 0, nivel = 0.55, escarcha = 0, rot = 0, t = 0, hervor = 0, inv = false }) => {
  const alto = 520;
  const top = -alto / 2;
  const ly = top + alto * (1 - nivel);
  const liqY = inv ? top + 20 : ly;
  const liqH = inv ? alto * nivel - 20 : top + alto - 20 - ly;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* boquilla y pajilla */}
      <rect x={-40} y={top - 70} width={80} height={60} rx={10} fill="#C8C4D8" />
      <rect x={-10} y={top - 110} width={20} height={50} fill="#8C88A8" />
      <rect x={10} y={top - 60} width={150} height={12} rx={6} fill={C.red} />
      <rect x={-130} y={top} width={260} height={alto} rx={40} fill="#3A6EA8" />
      <rect x={-130} y={top - 20} width={260} height={40} rx={20} fill="#C8C4D8" />
      <g opacity={1 - corte}>
        <rect x={-130} y={-60} width={260} height={120} fill={C.white} />
        <Texto x={0} y={15} size={52} color="#3A6EA8">
          AIRE
        </Texto>
      </g>
      <g opacity={corte}>
        <rect x={-110} y={top + 20} width={220} height={alto - 40} rx={30} fill="#141030" />
        <rect x={-110} y={liqY} width={220} height={liqH} rx={20} fill={LIQ} />
        {new Array(14).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={-90 + ((k * 53) % 180) + Math.sin(t * 5 + k) * 8}
            cy={(inv ? top + alto * nivel + 20 : top + 40) + ((k * 37) % Math.max(20, ly - top - 60)) + Math.cos(t * 6 + k) * 8}
            r={9}
            fill={C.white}
            opacity={0.8}
          />
        ))}
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.8 + k / 8) % 1;
          return (
            <circle
              key={`b${k}`}
              cx={-80 + k * 22}
              cy={top + alto - 30 - u * (top + alto - 30 - ly)}
              r={10 + 6 * u}
              fill="none"
              stroke={C.white}
              strokeWidth={4}
              opacity={hervor * (1 - u * 0.5)}
            />
          );
        })}
      </g>
      <g opacity={escarcha}>
        <rect x={-130} y={top + alto * 0.4} width={260} height={alto * 0.6} rx={40} fill={HIELO} opacity={0.55} />
        {new Array(10).fill(0).map((_, k) => (
          <path
            key={k}
            d={`M ${-100 + (k % 5) * 50} ${top + alto * 0.5 + Math.floor(k / 5) * 120} m -14 0 l 28 0 m -14 -14 l 0 28 m -10 -10 l 20 20 m 0 -20 l -20 20`}
            stroke={C.white}
            strokeWidth={4}
          />
        ))}
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Lata x={540} y={980} s={1.25} escarcha={1} t={t} />
    <Texto x={250} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta lata de aire se congela?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.dices], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.cyan} />
    </>
  );
};

// B. Dices que es aire, pero adentro no hay aire + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tache = aparece(t, T.dices + 1.2);
  return (
    <Lienzo zoom={interpolate(t, [T.dices, T.adentro], [1, 1.05])}>
      <Lata x={540} y={860} s={0.95} t={t} />
      <g opacity={tache}>
        <line x1={380} y1={800} x2={700} y2={920} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
        <line x1={380} y1={920} x2={700} y2={800} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.adentro], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué no ponerla de cabeza: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Adentro hay un gas tan apretado que se vuelve líquido
export const Liquido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = aparece(t, T.adentro + 0.2);
  return (
    <Lienzo zoom={interpolate(t, [T.adentro, T.encima], [1, 1.05])}>
      <Lata x={540} y={860} s={1.05} corte={corte} t={t} />
      <Texto x={540} y={1290} size={40} color={C.cyan} op={aparece(t, T.dif) * (1 - aparece(t, T.liquido))}>
        difluoroetano
      </Texto>
      <Texto x={540} y={1290} size={40} color={LIQ} op={aparece(t, T.liquido)}>
        gas apretado = líquido
      </Texto>
    </Lienzo>
  );
};

// D. Encima queda vapor a presión; al apretar el botón, sale disparado
export const Vapor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = aparece(t, T.apretar + 0.3);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.encima, T.entonces], [1, 1.04])}>
        <Lata x={500} y={900} s={1.05} corte={1} t={t} />
        <g opacity={aparece(t, T.vapor)}>
          <path d="M 760 700 L 660 720" stroke={C.white} strokeWidth={6} />
          <Texto x={790} y={690} size={36} color={C.white} anchor="start">
            vapor
          </Texto>
          <Texto x={790} y={735} size={30} color={C.grey} anchor="start">
            a presión
          </Texto>
        </g>
        <g opacity={aparece(t, T.apretar)}>
          <path d="M 500 470 l 0 60 m -22 -22 l 22 22 l 22 -22" stroke={C.yellow} strokeWidth={8} fill="none" />
        </g>
        {new Array(12).fill(0).map((_, k) => {
          const u = ((t - T.apretar) * 1.8 + k / 12) % 1;
          return (
            <circle key={k} cx={700 + u * 330} cy={567 + Math.sin(k * 3) * 30 * u} r={9} fill={C.white} opacity={sale * (1 - u)} />
          );
        })}
      </Lienzo>
      <Flash t={t} d={T.disparado} color={C.white} />
    </>
  );
};

// Manómetro
const Presion: React.FC<{ readonly x: number; readonly y: number; readonly v: number }> = ({ x, y, v }) => {
  const a = Math.PI * (1 + v);
  return (
    <g>
      <circle cx={x} cy={y} r={110} fill="#1A1630" stroke={C.grey} strokeWidth={8} />
      <line x1={x} y1={y} x2={x + Math.cos(a) * 85} y2={y + Math.sin(a) * 85} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={y} r={14} fill={C.white} />
      <Texto x={x} y={y + 160} size={32} color={C.grey}>
        presión
      </Texto>
    </g>
  );
};

// E. La presión baja y parte del líquido hierve para reponer el vapor
export const Hierve: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.entonces, T.entonces + 1], [0.85, 0.35], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.entonces, T.pero], [1, 1.04])}>
      <Lata x={380} y={900} s={1} corte={1} t={t} hervor={aparece(t, T.hierve)} nivel={0.55 - aparece(t, T.hierve) * 0.06} />
      <Presion x={800} y={760} v={p} />
      <Texto x={380} y={1290} size={40} color={LIQ} op={aparece(t, T.hierve)}>
        el líquido hierve
      </Texto>
    </Lienzo>
  );
};

// F. Hervir roba calor de la lata y de tu mano: por eso se enfría
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const frio = interpolate(t, [T.calor, T.enfria + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.si], [1, 1.04])}>
        <Lata x={420} y={880} s={1} corte={1} t={t} hervor={1} escarcha={interpolate(t, [T.enfria, T.enfria + 0.8], [0, 1], clamp)} />
        {[0, 1, 2].map((k) => {
          const u = ((t - T.calor) * 1.2 + k / 3) % 1;
          return (
            <path
              key={k}
              d={`M ${700 - u * 160} ${780 + k * 90} l -50 0 m 18 -18 l -18 18 l 18 18`}
              stroke={C.orange}
              strokeWidth={10}
              fill="none"
              opacity={aparece(t, T.calor) * (1 - u)}
            />
          );
        })}
        <g opacity={aparece(t, T.mano)}>
          <rect x={760} y={740} width={150} height={260} rx={50} fill="#E8B48A" />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={660} y={760 + k * 60} width={140} height={44} rx={22} fill="#E8B48A" />
          ))}
          <Texto x={800} y={1080} size={34} color="#E8B48A">
            tu mano
          </Texto>
        </g>
        <g transform="translate(860 1230)">
          <rect x={-22} y={-150} width={44} height={200} rx={22} fill="#1A1630" stroke={C.grey} strokeWidth={6} />
          <rect x={-12} y={-140 + 150 * frio} width={24} height={190 - 150 * frio} rx={12} fill={frio > 0.5 ? C.cyan : C.red} />
          <circle cx={0} cy={60} r={34} fill={frio > 0.5 ? C.cyan : C.red} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.enfria} color={C.cyan} />
    </>
  );
};

// Teclado
const Teclado: React.FC<{ readonly x: number; readonly y: number; readonly hielo: number }> = ({ x, y, hielo }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-360} y={-90} width={720} height={180} rx={16} fill="#2A2640" />
    {new Array(3).fill(0).map((_, r) =>
      new Array(10).fill(0).map((__, k) => (
        <rect key={`${r}${k}`} x={-340 + k * 68} y={-75 + r * 55} width={58} height={45} rx={6} fill="#4A4466" />
      )),
    )}
    <ellipse cx={0} cy={0} rx={220} ry={70} fill={HIELO} opacity={hielo * 0.8} />
  </g>
);

// G. Si la pones de cabeza sale el líquido y congela el teclado
export const Cabeza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.si, T.si + 0.6], [0, 180], clamp);
  const chorro = aparece(t, T.mismo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.04])}>
        <Lata x={540} y={720} s={0.75} corte={1} rot={giro} nivel={0.55} t={t} inv={giro > 90} />
        {new Array(10).fill(0).map((_, k) => {
          const u = ((t - T.mismo) * 1.5 + k / 10) % 1;
          return <circle key={k} cx={480 - u * 40 + Math.sin(k) * 10} cy={1000 + u * 160} r={12} fill={LIQ} opacity={chorro * (1 - u * 0.6)} />;
        })}
        <Teclado x={540} y={1250} hielo={interpolate(t, [T.teclado, T.congela + 0.5], [0, 1], clamp)} />
        <Texto x={540} y={1450} size={40} color={C.cyan} op={aparece(t, T.congela)}>
          ¡se congela!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.congela} color={C.cyan} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
