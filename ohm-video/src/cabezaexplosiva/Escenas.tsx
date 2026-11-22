import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cabezaexplosiva/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  dormido: 2.02, // dormido
  portazo: 3.08, // portazo
  explosion: 4.06, // explosion
  nadie: 5.76, // nadie
  final: 7.28, // final
  llama: 8.94, // llama
  sindrome: 9.18, // sindrome
  dormirte: 11.50, // dormirte
  apagando: 12.74, // apagando
  edificio: 14.72, // edificio
  oido: 15.84, // oido
  cree: 17.20, // cree
  orden: 19.20, // orden
  neuronas: 20.18, // neuronas
  dispara: 21.38, // dispara
  interpreta: 23.00, // interpreta
  ruido: 24.56, // ruido
  despierta: 25.60, // despierta
  comun: 27.28, // comun
  estres: 27.78, // estres
  sueno: 28.78, // sueno
  asusta: 29.40, // asusta
  inofensivo: 30.42, // inofensivo
  dano: 31.96, // dano
  eso: 33.20, // eso
  fin: 34.28, // FIN
};

// Cabeza de perfil dormida; susto 0..1 abre el ojo
const Cabeza: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly susto?: number }> = ({ x, y, s = 1, susto = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={130} width={120} height={120} rx={30} fill="#3A3458" />
    <circle cx={0} cy={0} r={170} fill="#C89A7A" />
    <path d="M 165 -10 L 205 40 L 160 55 Z" fill="#C89A7A" />
    <path d="M -170 -20 C -170 -190 160 -210 170 -60 C 80 -120 -60 -110 -170 -20 Z" fill="#3A2A22" />
    {susto < 0.5 ? (
      <path d="M 70 -10 Q 95 5 120 -10" stroke="#3A2A22" strokeWidth={8} fill="none" strokeLinecap="round" />
    ) : (
      <>
        <circle cx={95} cy={-12} r={24} fill="#fff" />
        <circle cx={102} cy={-12} r={11} fill="#111" />
      </>
    )}
    <ellipse cx={-30} cy={20} rx={26} ry={40} fill="#B8876A" />
  </g>
);

const Bum: React.FC<{ readonly x: number; readonly y: number; readonly k: number; readonly r?: number }> = ({ x, y, k, r = 120 }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + k * 0.4})`} opacity={k}>
    <path
      d={new Array(24)
        .fill(0)
        .map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const rr = i % 2 ? r * 0.55 : r;
          return `${i ? "L" : "M"} ${Math.cos(a) * rr} ${Math.sin(a) * rr}`;
        })
        .join(" ")}
      fill={C.yellow}
    />
    <Texto x={0} y={14} size={44} color="#111">
      BUM
    </Texto>
  </g>
);

const Inicio: React.FC<{ readonly t: number }> = ({ t }) => {
  const k = 0.85 + 0.15 * Math.sin(t * 20);
  return (
    <>
      <Cabeza x={480} y={980} s={1.3} />
      <Bum x={720} y={640} k={k} r={150} />
    </>
  );
};

// A. Gancho: ¿qué fue ese estruendo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.dormido], [1.12, 1])}>
        <Inicio t={t} />
      </Lienzo>
      <Flash t={t} d={0.05} color={C.white} />
    </>
  );
};

// B. Al dormirte oyes un portazo o una explosión; nadie más la oyó + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.dormido, T.llama], [1, 1.04])}>
        <rect x={140} y={1080} width={560} height={60} rx={20} fill="#4A4270" />
        <rect x={140} y={1040} width={160} height={50} rx={20} fill="#E8E0F0" />
        <Cabeza x={240} y={960} s={0.45} susto={t > T.explosion ? 1 : 0} />
        <rect x={290} y={1010} width={400} height={80} rx={30} fill="#6A5AA8" />
        <g opacity={aparece(t, T.portazo) * (1 - aparece(t, T.explosion))}>
          <rect x={780} y={700} width={150} height={300} fill="#8A6A4A" />
          <Texto x={720} y={680} size={50} color={C.yellow}>
            ¡PAM!
          </Texto>
        </g>
        <Bum x={600} y={720} k={aparece(t, T.explosion) * (1 - aparece(t, T.nadie))} r={140} />
        <g opacity={aparece(t, T.nadie)}>
          <Texto x={780} y={760} size={40} color={C.grey}>
            zzz
          </Texto>
          <Texto x={540} y={1280} size={38} color={C.white}>
            nadie más lo oyó
          </Texto>
        </g>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            ¿es peligroso?: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.llama], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.explosion} color={C.yellow} />
    </>
  );
};

// C. Nombre: síndrome de la cabeza explosiva
export const Nombre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.llama, T.dormirte], [1, 1.06])}>
      <Cabeza x={540} y={1000} s={1} />
      <Bum x={760} y={760} k={aparece(t, T.sindrome) * 0.9} r={90} />
      <Texto x={540} y={560} size={52} color={C.yellow} op={aparece(t, T.sindrome)}>
        síndrome de la
      </Texto>
      <Texto x={540} y={630} size={52} color={C.yellow} op={aparece(t, T.sindrome + 0.4)}>
        cabeza explosiva
      </Texto>
    </Lienzo>
  );
};

// D. El cerebro se apaga por zonas, como las luces de un edificio (también el oído)
export const Apagado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const filas = 6;
  const cols = 4;
  return (
    <Lienzo zoom={interpolate(t, [T.dormirte, T.cree], [1, 1.04])}>
      <g opacity={aparece(t, T.dormirte)}>
        <rect x={290} y={520} width={500} height={860} rx={12} fill="#2A2440" />
        {new Array(filas * cols).fill(0).map((_, i) => {
          const f = Math.floor(i / cols);
          const c = i % cols;
          const esOido = f === 3 && c === 1;
          const tOff = T.apagando + ((i * 7) % 24) * 0.14 + (esOido ? 99 : 0);
          const tOffOido = T.oido + 0.2;
          const on = esOido ? t < tOffOido : t < tOff;
          return (
            <rect key={i} x={330 + c * 110} y={560 + f * 135} width={80} height={95} rx={6} fill={on ? (esOido ? C.cyan : C.yellow) : "#151225"} />
          );
        })}
      </g>
      <Texto x={540} y={1460} size={38} color={C.white} op={aparece(t, T.apagando)}>
        el cerebro se apaga por zonas
      </Texto>
      <Texto x={540} y={470} size={36} color={C.cyan} op={aparece(t, T.oido)}>
        también el oído
      </Texto>
    </Lienzo>
  );
};

// E. En lugar de apagarse en orden, un grupo de neuronas auditivas se dispara de golpe
export const Descarga: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const golpe = t > T.dispara;
  const pts = new Array(14).fill(0).map((_, i) => [540 + Math.cos(i * 2.4) * (80 + (i % 4) * 60), 900 + Math.sin(i * 2.4) * (80 + (i % 4) * 60)]);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cree, T.interpreta], [1, 1.06])}>
        <g opacity={aparece(t, T.cree)}>
          {pts.map(([x, y], i) =>
            pts.slice(i + 1, i + 3).map(([x2, y2], j) => <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={golpe ? C.yellow : "#4A4270"} strokeWidth={5} />),
          )}
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={golpe ? 26 + 6 * Math.sin(t * 30 + i) : 22} fill={golpe ? C.yellow : C.cyan} opacity={golpe ? 1 : 0.6} />
          ))}
        </g>
        <Texto x={540} y={1340} size={38} color={C.grey} op={aparece(t, T.orden) * (1 - aparece(t, T.dispara))}>
          ¿apagarse en orden?
        </Texto>
        <Texto x={540} y={1340} size={40} color={C.yellow} op={aparece(t, T.dispara)}>
          neuronas auditivas: ¡descarga!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.dispara} color={C.yellow} />
    </>
  );
};

// F. El cerebro lo interpreta como un ruido enorme y te despierta sobresaltado
export const Ruido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const desp = t > T.despierta;
  return (
    <Lienzo zoom={interpolate(t, [T.interpreta, T.comun], [1, 1.04])}>
      <Cabeza x={400} y={1000} s={1} susto={desp ? 1 : 0} />
      {[0, 1, 2, 3].map((k) => {
        const u = (t * 1.5 + k * 0.25) % 1;
        return (
          <path
            key={k}
            d={`M ${620 + u * 300} ${780 - u * 150} A ${200 + u * 200} ${200 + u * 200} 0 0 1 ${620 + u * 300} ${1180 + u * 150}`}
            stroke={C.yellow}
            strokeWidth={10}
            fill="none"
            opacity={aparece(t, T.ruido) * (1 - u)}
          />
        );
      })}
      <Texto x={540} y={500} size={42} color={C.yellow} op={aparece(t, T.ruido)}>
        «ruido» enorme
      </Texto>
      <Texto x={540} y={1400} size={40} color={C.white} op={aparece(t, T.despierta)}>
        ¡te despierta!
      </Texto>
    </Lienzo>
  );
};

// G. Más común con estrés y falta de sueño. Asusta, pero es inofensivo
export const Inofensivo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.comun, T.eso], [1, 1.04])}>
        <g opacity={aparece(t, T.estres) * (1 - aparece(t, T.asusta))}>
          <Texto x={540} y={700} size={48} color={C.orange}>
            + estrés
          </Texto>
        </g>
        <g opacity={aparece(t, T.sueno) * (1 - aparece(t, T.asusta))}>
          <Texto x={540} y={800} size={48} color={C.purpleLight}>
            − sueño
          </Texto>
          <Texto x={540} y={900} size={48} color={C.yellow}>
            = más episodios
          </Texto>
        </g>
        <g opacity={aparece(t, T.inofensivo)}>
          <path d="M 540 560 L 760 640 L 740 900 Q 700 1080 540 1150 Q 380 1080 340 900 L 320 640 Z" fill="#2A8A5A" />
          <path d="M 440 860 L 520 940 L 660 760" stroke="#fff" strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Texto x={540} y={1260} size={50} color="#5AD08A">
            inofensivo
          </Texto>
        </g>
        <Texto x={540} y={1340} size={36} color={C.white} op={aparece(t, T.dano)}>
          ningún daño en tu cabeza
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.inofensivo} color="#5AD08A" />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.eso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} />
    </Lienzo>
  );
};
