import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/larsen/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  acercas: 1.82, // acercas
  bocina: 3.04, // bocina
  pitido: 4.06, // pitido
  final: 5.76, // final
  el: 8.16, // el
  capta: 8.74, // capta
  amplificador: 10.06, // amplificador
  fuerte: 11.28, // fuerte
  suelta: 12.80, // suelta
  si: 13.56, // si
  cerca: 14.38, // cerca
  vuelve: 15.06, // vuelve
  amplifica: 16.16, // amplifica
  otra1: 17.64, // otra
  otra2: 18.82, // otra
  otra3: 19.58, // otra
  bucle: 20.56, // bucle
  volumen: 22.06, // volumen
  frecuencias: 23.08, // frecuencias
  justo: 24.20, // justo
  sumarse: 25.18, // sumarse
  crecen: 26.02, // crecen
  maximo: 27.52, // maximo
  efecto: 29.14, // efecto
  larsen: 29.38, // larsen
  conciertos: 30.50, // conciertos
  lejos: 32.20, // lejos
  filtran: 33.40, // filtran
  porEso: 34.92, // por
  fin: 36.40, // FIN
};

const Mic: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number; readonly s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-22} y={40} width={44} height={220} rx={18} fill="#3A3A44" />
    <circle cx={0} cy={0} r={60} fill="#8A8A96" />
    {[-30, -10, 10, 30].map((d) => (
      <g key={d}>
        <line x1={d} y1={-52} x2={d} y2={52} stroke="#5A5A66" strokeWidth={4} />
        <line x1={-52} y1={d} x2={52} y2={d} stroke="#5A5A66" strokeWidth={4} />
      </g>
    ))}
  </g>
);

const Bocina: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly vib?: number }> = ({ x, y, s = 1, vib = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-130} y={-200} width={260} height={400} rx={20} fill="#2A2A34" stroke="#4A4A56" strokeWidth={6} />
    <circle cx={0} cy={60} r={95 + vib} fill="#1A1A22" stroke="#5A5A66" strokeWidth={8} />
    <circle cx={0} cy={60} r={35} fill="#4A4A56" />
    <circle cx={0} cy={-120} r={40} fill="#1A1A22" stroke="#5A5A66" strokeWidth={6} />
  </g>
);

// Ondas que salen de (x,y) en dirección ang (grados)
const Ondas: React.FC<{ readonly x: number; readonly y: number; readonly ang: number; readonly t: number; readonly col?: string; readonly op?: number; readonly n?: number }> = ({
  x,
  y,
  ang,
  t,
  col = C.cyan,
  op = 1,
  n = 4,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={op}>
    {new Array(n).fill(0).map((_, k) => {
      const u = (t * 1.6 + k / n) % 1;
      const r = 40 + u * 220;
      return <path key={k} d={`M ${r * 0.8} ${-r * 0.6} A ${r} ${r} 0 0 1 ${r * 0.8} ${r * 0.6}`} stroke={col} strokeWidth={8} fill="none" opacity={1 - u} />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Bocina x={330} y={950} vib={4 * Math.sin(t * 60)} />
    <Ondas x={430} y={1010} ang={-20} t={t * 2} col={C.red} />
    <Mic x={760} y={820} rot={-60} />
    <Texto x={760} y={1300} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué chilla este micrófono?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.acercas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.05} color={C.red} />
    </>
  );
};

// B. Acercas el micrófono a la bocina y sale un pitido + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mx = interpolate(t, [T.acercas, T.pitido], [900, 700], clamp);
  const pit = aparece(t, T.pitido);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.acercas, T.el], [1, 1.04]) + pit * 0.01 * Math.sin(t * 80)}>
        <Bocina x={330} y={950} vib={pit * 4 * Math.sin(t * 60)} />
        <Mic x={mx} y={820} rot={-60} />
        <Ondas x={430} y={1010} ang={-20} t={t * 2} col={C.red} op={pit} />
        <g opacity={pit}>
          <path
            d={`M 120 1300 ${new Array(80)
              .fill(0)
              .map((_, i) => `L ${120 + i * 10.5} ${1300 + 60 * Math.sin(i * 1.3 + t * 30)}`)
              .join(" ")}`}
            stroke={C.red}
            strokeWidth={6}
            fill="none"
          />
          <Texto x={540} y={1440} size={48} color={C.red}>
            ¡PIIIII!
          </Texto>
        </g>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            ¿cómo lo evitan en conciertos?: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.el], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.pitido} color={C.red} />
    </>
  );
};

const Amp: React.FC<{ readonly x: number; readonly y: number; readonly op?: number }> = ({ x, y, op = 1 }) => (
  <g opacity={op}>
    <rect x={x - 110} y={y - 80} width={220} height={160} rx={16} fill="#4A4270" />
    <path d={`M ${x - 40} ${y - 45} L ${x + 50} ${y} L ${x - 40} ${y + 45} Z`} fill={C.yellow} />
    <Texto x={x} y={y + 130} size={30} color={C.white}>
      amplificador
    </Texto>
  </g>
);

// C. El micrófono capta, el amplificador lo hace más fuerte, la bocina lo suelta
export const Cadena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const onda = (x0: number, amp: number, op: number) => (
    <path
      d={`M ${x0} 900 ${new Array(16)
        .fill(0)
        .map((_, i) => `L ${x0 + i * 6} ${900 + amp * Math.sin(i * 0.9 - t * 12)}`)
        .join(" ")}`}
      stroke={C.cyan}
      strokeWidth={5}
      fill="none"
      opacity={op}
    />
  );
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.si], [1, 1.04])}>
      <Mic x={170} y={850} rot={0} s={0.8} />
      <Texto x={170} y={1120} size={30} color={C.white}>
        micrófono
      </Texto>
      <Amp x={540} y={900} op={aparece(t, T.amplificador)} />
      <Bocina x={890} y={900} s={0.7} />
      <line x1={240} y1={900} x2={430} y2={900} stroke={C.grey} strokeWidth={4} opacity={aparece(t, T.amplificador)} />
      <line x1={650} y1={900} x2={790} y2={900} stroke={C.grey} strokeWidth={4} opacity={aparece(t, T.suelta)} />
      {onda(260, 12, aparece(t, T.capta))}
      {onda(670, 36, aparece(t, T.fuerte))}
      <Ondas x={980} y={940} ang={0} t={t} op={aparece(t, T.suelta)} />
    </Lienzo>
  );
};

// D. Si está cerca, vuelve a captar el sonido amplificado y lo amplifica otra vez... y otra
export const Lazo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vueltas = [T.amplifica, T.otra1, T.otra2, T.otra3].filter((v) => t > v).length;
  const amp = 10 * Math.pow(1.8, vueltas);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.frecuencias], [1, 1.04])}>
      <Mic x={250} y={780} rot={30} s={0.8} />
      <Amp x={540} y={1150} />
      <Bocina x={830} y={780} s={0.7} />
      <path d="M 280 1000 Q 300 1150 430 1150" stroke={C.grey} strokeWidth={4} fill="none" />
      <path d="M 650 1150 Q 790 1150 820 950" stroke={C.grey} strokeWidth={4} fill="none" />
      <g opacity={aparece(t, T.vuelve)}>
        <path d="M 720 650 Q 540 520 360 650" stroke={C.red} strokeWidth={10} fill="none" strokeDasharray="24 14" strokeDashoffset={-t * 120} />
        <path d="M 380 620 L 340 665 L 395 680 Z" fill={C.red} />
      </g>
      <Texto x={540} y={560} size={36} color={C.red} op={aparece(t, T.vuelve)}>
        vuelve al micrófono
      </Texto>
      <path
        d={`M 300 1420 ${new Array(80)
          .fill(0)
          .map((_, i) => `L ${300 + i * 6} ${1420 + Math.min(amp, 120) * Math.sin(i * 0.5 - t * 10)}`)
          .join(" ")}`}
        stroke={vueltas > 2 ? C.red : C.cyan}
        strokeWidth={6}
        fill="none"
      />
      <Texto x={540} y={900} size={44} color={C.yellow} op={vueltas > 0 ? 1 : 0}>
        {"vuelta " + vueltas}
      </Texto>
    </Lienzo>
  );
};

// E. Cada vuelta suma volumen; ciertas frecuencias regresan a tiempo, crecen hasta el máximo. Efecto Larsen
export const Frecuencias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.crecen, T.maximo + 0.5], [0.15, 1], clamp);
  const lar = aparece(t, T.larsen);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frecuencias, T.conciertos], [1, 1.04])}>
        <g opacity={1 - lar}>
          {[0, 1].map((k) => (
            <path
              key={k}
              d={`M 140 ${760 + k * 0} ${new Array(100)
                .fill(0)
                .map((_, i) => `L ${140 + i * 8} ${760 + 60 * Math.sin(i * 0.3 - t * 6 + (k ? Math.PI * interpolate(t, [T.justo, T.sumarse], [1, 0], clamp) : 0))}`)
                .join(" ")}`}
              stroke={k ? C.yellow : C.cyan}
              strokeWidth={6}
              fill="none"
              opacity={aparece(t, T.frecuencias)}
            />
          ))}
          <Texto x={540} y={620} size={36} color={C.yellow} op={aparece(t, T.justo)}>
            llega justo a tiempo: se suma
          </Texto>
          <line x1={140} y1={1000} x2={940} y2={1000} stroke={C.red} strokeWidth={4} strokeDasharray="16 10" opacity={aparece(t, T.crecen)} />
          <line x1={140} y1={1400} x2={940} y2={1400} stroke={C.red} strokeWidth={4} strokeDasharray="16 10" opacity={aparece(t, T.crecen)} />
          <path
            d={`M 140 1200 ${new Array(100)
              .fill(0)
              .map((_, i) => `L ${140 + i * 8} ${1200 + Math.max(-200, Math.min(200, 260 * crece * Math.sin(i * 0.3 - t * 6)))}`)
              .join(" ")}`}
            stroke={C.red}
            strokeWidth={6}
            fill="none"
            opacity={aparece(t, T.crecen)}
          />
          <Texto x={540} y={1480} size={36} color={C.red} op={aparece(t, T.maximo)}>
            ¡al máximo del equipo!
          </Texto>
        </g>
        <g opacity={lar}>
          <Inicio t={t} q={0} />
          <Texto x={540} y={560} size={60} color={C.yellow}>
            efecto Larsen
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.larsen} color={C.yellow} />
    </>
  );
};

// F. Conciertos: micrófonos lejos de las bocinas y filtran esas frecuencias
export const Conciertos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fil = aparece(t, T.filtran);
  return (
    <Lienzo zoom={interpolate(t, [T.conciertos, T.porEso], [1, 1.04])}>
      <g opacity={1 - fil * 0.85}>
        <rect x={80} y={1060} width={920} height={40} fill="#4A4270" />
        <Bocina x={200} y={900} s={0.55} />
        <Bocina x={880} y={900} s={0.55} />
        <Ondas x={200} y={1000} ang={90} t={t} op={0.8} />
        <Ondas x={880} y={1000} ang={90} t={t} op={0.8} />
        <Mic x={540} y={820} rot={interpolate(t, [T.conciertos, T.lejos], [0, 180], clamp)} s={0.7} />
        <Texto x={540} y={560} size={36} color={C.white} op={aparece(t, T.lejos)}>
          micrófono lejos de las bocinas
        </Texto>
      </g>
      <g opacity={fil}>
        {new Array(12).fill(0).map((_, k) => {
          const h = k === 7 ? 40 : 160 + 60 * Math.sin(k * 1.7);
          return <rect key={k} x={150 + k * 66} y={1300 - h} width={44} height={h} rx={8} fill={k === 7 ? C.red : C.cyan} />;
        })}
        <path d="M 640 1080 L 640 1150" stroke={C.red} strokeWidth={6} />
        <Texto x={540} y={1380} size={40} color={C.yellow}>
          filtran esa frecuencia
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
