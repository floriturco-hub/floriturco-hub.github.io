import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/chocolate/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  buen: 1.86, // buen
  funde: 2.66, // funde
  mano: 4.50, // mano
  final: 5.30, // final
  manteca: 7.68, // manteca
  formas: 9.76, // formas
  punto: 11.82, // punto
  buena: 13.08, // buena
  funde2: 14.72, // funde
  treinta: 15.44, // treinta
  debajo: 17.30, // debajo
  boca: 18.60, // boca
  porEso1: 19.16, // por
  templa: 20.24, // templa
  calienta: 21.16, // calienta
  enfria: 21.96, // enfria
  cristales: 24.46, // cristales
  brillante: 25.96, // brillante
  cruje: 26.86, // cruje
  si: 27.82, // si
  tienda: 28.56, // tienda
  sube: 31.02, // sube
  mal: 32.84, // mal
  capa: 33.62, // capa
  grasa: 34.42, // grasa
  moho: 35.28, // moho
  comer: 36.20, // comer
  porEso: 36.86, // por
  fin: 38.22, // FIN
};

const CHOCO = "#6A3A1A";
const CHOCO2 = "#8A4A22";
const BLOOM = "#D8CCC0";

// Tableta de chocolate: brillo 0-1, bloom 0-1 (capa blanca), derrite 0-1, partida
const Tableta: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brillo?: number; readonly bloom?: number; readonly derrite?: number }> = ({
  x,
  y,
  s,
  brillo = 0.5,
  bloom = 0,
  derrite = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-240} y={-160} width={480} height={320} rx={16} fill={CHOCO} />
    {new Array(3).fill(0).map((_, r) =>
      new Array(4).fill(0).map((__, c) => (
        <rect key={`${r}${c}`} x={-224 + c * 116} y={-144 + r * 100} width={100} height={84} rx={8} fill={CHOCO2} />
      )),
    )}
    <path d="M -200 -140 L -120 -140 L -230 40 L -230 -40 Z" fill={C.white} opacity={0.25 * brillo} />
    <g opacity={bloom}>
      {new Array(40).fill(0).map((_, k) => (
        <circle key={k} cx={-220 + ((k * 97) % 440)} cy={-140 + ((k * 53) % 280)} r={10 + (k % 4) * 6} fill={BLOOM} opacity={0.7} />
      ))}
    </g>
    <g opacity={derrite}>
      <path d="M -160 160 q 10 60 30 60 q 20 0 20 -60 M 40 160 q 10 90 30 90 q 20 0 20 -90" fill={CHOCO} />
    </g>
  </g>
);

// Seis formas cristalinas con su punto de fusión
const FORMAS = [
  ["I", "17"],
  ["II", "23"],
  ["III", "26"],
  ["IV", "28"],
  ["V", "34"],
  ["VI", "36"],
];

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Tableta x={540} y={940} s={1.3} brillo={1} derrite={1} />
    <Texto x={540} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué se derrite en tu boca?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.buen], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={CHOCO2} />
    </>
  );
};

// B. Se funde en tu lengua, pero no en tu mano + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.buen, T.manteca], [1, 1.04])}>
      <g transform="translate(300 860)">
        <path d="M -150 -40 Q 0 -100 150 -40 Q 160 120 0 160 Q -160 120 -150 -40 Z" fill="#E87A8A" />
        <Tableta x={0} y={0} s={0.35} derrite={aparece(t, T.funde)} />
        <Texto x={0} y={250} size={36} color="#E87A8A" op={aparece(t, T.funde)}>
          lengua: se funde
        </Texto>
      </g>
      <g transform="translate(780 860)" opacity={aparece(t, T.mano)}>
        <rect x={-150} y={20} width={300} height={140} rx={60} fill="#E8B48A" />
        <Tableta x={0} y={-20} s={0.35} />
        <Texto x={0} y={250} size={36} color="#E8B48A">
          mano: aguanta
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.manteca], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          ¿qué es la capa blanca? al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Cristal hexagonal pequeño
const Hex: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly col: string; readonly rot?: number }> = ({ x, y, r, col, rot = 0 }) => (
  <polygon
    transform={`rotate(${rot} ${x} ${y})`}
    points={new Array(6)
      .fill(0)
      .map((_, k) => `${x + Math.cos((k * Math.PI) / 3) * r},${y + Math.sin((k * Math.PI) / 3) * r}`)
      .join(" ")}
    fill={col}
  />
);

// C. La manteca de cacao cristaliza de seis formas, cada una con su punto de fusión; la buena es la V
export const Formas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const buena = aparece(t, T.buena);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.manteca, T.porEso1], [1, 1.04])}>
        <Texto x={540} y={500} size={40} color={C.white} op={aparece(t, T.manteca)}>
          manteca de cacao
        </Texto>
        {FORMAS.map(([n, tf], k) => {
          const x = 240 + (k % 3) * 300;
          const y = 720 + Math.floor(k / 3) * 330;
          const es5 = k === 4;
          return (
            <g key={n} opacity={aparece(t, T.formas + k * 0.12) * (buena > 0.5 && !es5 ? 0.3 : 1)}>
              <Hex x={x} y={y} r={80} col={es5 && buena > 0.5 ? C.yellow : CHOCO2} rot={k * 10} />
              <Texto x={x} y={y + 16} size={50} color={C.white}>
                {n}
              </Texto>
              <Texto x={x} y={y + 140} size={34} color={es5 && buena > 0.5 ? C.yellow : C.grey} op={aparece(t, T.punto)}>
                {`${tf} °C`}
              </Texto>
            </g>
          );
        })}
        <g opacity={aparece(t, T.debajo)}>
          <rect x={190} y={1300} width={700} height={130} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={1350} size={32} color={C.white}>
            V funde a 34 °C
          </Texto>
          <Texto x={540} y={1405} size={32} color="#E87A8A">
            tu boca: unos 37 °C
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.buena} color={C.yellow} />
    </>
  );
};

// D. El chocolatero lo templa: calienta y enfría con precisión para que solo se formen cristales V
export const Templa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.calienta, T.cristales], [0, 1], clamp);
  const pts = [
    [0, 30],
    [0.3, 45],
    [0.65, 27],
    [1, 31],
  ];
  const tempAt = (u: number) => {
    for (let i = 0; i < pts.length - 1; i++) {
      if (u <= pts[i + 1][0]) {
        const f = (u - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
        return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      }
    }
    return 31;
  };
  const X = (u: number) => 160 + u * 760;
  const Y = (tc: number) => 1150 - (tc - 20) * 18;
  const d = new Array(61)
    .fill(0)
    .map((_, i) => `${i ? "L" : "M"} ${X((i / 60) * p)} ${Y(tempAt((i / 60) * p))}`)
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.porEso1, T.brillante], [1, 1.04])}>
      <Texto x={540} y={500} size={44} color={C.yellow} op={aparece(t, T.templa)}>
        templado
      </Texto>
      <line x1={160} y1={1150} x2={920} y2={1150} stroke={C.grey} strokeWidth={4} />
      <line x1={160} y1={1150} x2={160} y2={640} stroke={C.grey} strokeWidth={4} />
      <path d={d} stroke={C.orange} strokeWidth={8} fill="none" />
      <Texto x={X(0.3)} y={Y(45) - 24} size={30} color={C.red} op={aparece(t, T.calienta)}>
        45 °C
      </Texto>
      <Texto x={X(0.65)} y={Y(27) + 54} size={30} color={C.cyan} op={aparece(t, T.enfria)}>
        27 °C
      </Texto>
      <g opacity={aparece(t, T.cristales)}>
        {new Array(7).fill(0).map((_, k) => (
          <Hex key={k} x={260 + k * 95} y={1300} r={36} col={C.yellow} />
        ))}
        <Texto x={540} y={1410} size={34} color={C.yellow}>
          solo cristales V
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Queda brillante y cruje al partirlo
export const Brillo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const parte = interpolate(t, [T.cruje, T.cruje + 0.3], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.brillante, T.si], [1, 1.04])}>
        <g transform={`translate(${-parte * 40} 0) rotate(${-parte * 6} 540 900)`}>
          <Tableta x={540} y={900} s={1.1} brillo={1} />
        </g>
        <line x1={540} y1={720} x2={540} y2={1080} stroke="#141030" strokeWidth={12 * parte} />
        <Texto x={540} y={1250} size={44} color={C.white} op={aparece(t, T.brillante)}>
          brillante
        </Texto>
        <Texto x={800} y={700} size={70} color={C.yellow} op={aparece(t, T.cruje)}>
          ¡crac!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cruje} color={C.white} />
    </>
  );
};

// F. Si se calienta y enfría en la tienda, la grasa sube y cristaliza mal: capa blanca de grasa, no moho
export const Bloom: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bloom = interpolate(t, [T.sube, T.mal + 0.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.04])}>
      <Tableta x={540} y={860} s={1.1} brillo={1 - bloom} bloom={bloom} />
      <g opacity={aparece(t, T.tienda) * (1 - aparece(t, T.capa))}>
        <Texto x={540} y={520} size={40} color={C.red}>
          calor... frío... calor
        </Texto>
      </g>
      <Texto x={540} y={1150} size={38} color={BLOOM} op={aparece(t, T.sube) * (1 - aparece(t, T.capa))}>
        la grasa sube y cristaliza mal
      </Texto>
      <g opacity={aparece(t, T.grasa)}>
        <Texto x={540} y={1150} size={44} color={BLOOM}>
          es grasa, no moho
        </Texto>
      </g>
      <Texto x={540} y={1230} size={38} color="#6AE88A" op={aparece(t, T.comer)}>
        se puede comer
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
      <Inicio q={q} />
    </Lienzo>
  );
};
