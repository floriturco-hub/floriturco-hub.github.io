import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/espagueti/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  doblas: 2.32, // doblas
  nunca: 4.08, // nunca
  dos: 5.08, // dos
  salen: 5.56, // salen
  final: 7.58, // final
  cuando: 10.12, // cuando
  primera: 10.94, // primera
  doblada: 12.86, // doblada
  libre: 14.32, // libre
  endereza: 15.16, // endereza
  sacudida: 16.54, // sacudida
  onda: 18.56, // onda
  dobla: 19.28, // dobla
  ahi: 20.92, // ahi
  porEso1: 22.46, // por
  en2018: 24.64, // en
  mit: 26.56, // mit
  torcerlo: 28.42, // torcerlo
  vuelta: 30.22, // vuelta
  doblarlo: 31.06, // doblarlo
  soltarse: 31.90, // soltarse
  torsion: 32.68, // torsion
  gasta: 34.14, // gasta
  asi: 35.84, // asi
  porEso: 37.56, // por
  fin: 39.74, // FIN
};

const PASTA = "#F0D070";

// Tramo de espagueti: centro (x,y), largo L, ángulo ang, curvatura k (1/px)
const Tramo: React.FC<{ readonly x: number; readonly y: number; readonly L: number; readonly ang?: number; readonly k?: number; readonly onda?: { pos: number; amp: number } }> = ({
  x,
  y,
  L,
  ang = 0,
  k = 0,
  onda,
}) => {
  const n = 40;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const s = -L / 2 + (L * i) / n;
    let px: number;
    let py: number;
    if (Math.abs(k) < 1e-6) {
      px = s;
      py = 0;
    } else {
      const R = 1 / k;
      px = R * Math.sin(s / R);
      py = R - R * Math.cos(s / R);
    }
    if (onda) {
      const d = s - onda.pos;
      py += onda.amp * Math.exp(-(d * d) / 1800) * Math.cos(d / 12);
    }
    pts.push(`${i ? "L" : "M"} ${px} ${py}`);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path d={pts.join(" ")} stroke={PASTA} strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Chispa: React.FC<{ readonly x: number; readonly y: number; readonly op: number }> = ({ x, y, op }) => (
  <g opacity={op} transform={`translate(${x} ${y})`}>
    {new Array(8).fill(0).map((_, k) => {
      const a = (k / 8) * Math.PI * 2;
      return <line key={k} x1={Math.cos(a) * 20} y1={Math.sin(a) * 20} x2={Math.cos(a) * 50} y2={Math.sin(a) * 50} stroke={C.yellow} strokeWidth={6} />;
    })}
  </g>
);

const Tres: React.FC<{ readonly t: number; readonly x: number; readonly y: number }> = ({ t, x, y }) => (
  <g transform={`translate(0 ${2 * y}) scale(1 -1)`}>
    <Tramo x={x - 260 - Math.sin(t * 2) * 10} y={y + 40} L={300} ang={-25 + 5 * Math.sin(t * 3)} k={0.001} />
    <Tramo x={x} y={y - 60 - Math.sin(t * 2.5) * 12} L={180} ang={70 + t * 40} />
    <Tramo x={x + 260 + Math.sin(t * 2) * 10} y={y + 40} L={300} ang={25 - 5 * Math.sin(t * 3)} k={-0.001} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Tres t={t} x={540} y={960} />
    <Texto x={540} y={660} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este espagueti se rompe en tres?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.doblas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Doblas un espagueti y casi nunca se parte en dos: salen tres o más + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const k = interpolate(t, [T.doblas, T.salen], [0, 0.0045], clamp);
  const roto = t > T.salen;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.doblas, T.cuando], [1, 1.04])}>
        {roto ? <Tres t={t} x={540} y={960} /> : <Tramo x={540} y={900} L={760} k={-k} />}
        <Texto x={540} y={1200} size={44} color={C.red} op={aparece(t, T.dos) * (roto ? 0.4 : 1)}>
          ¿en dos? casi nunca
        </Texto>
        <Texto x={540} y={1290} size={46} color={C.yellow} op={aparece(t, T.salen)}>
          3 pedazos o más
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            el truco del MIT: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.cuando], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.salen} color={C.yellow} />
    </>
  );
};

// C. Primera rotura: cada mitad estaba muy doblada y queda libre de golpe
export const Primera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const roto = t > T.primera;
  const suelta = interpolate(t, [T.libre, T.libre + 0.3], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.endereza], [1, 1.04])}>
        {!roto ? (
          <Tramo x={540} y={900} L={760} k={-0.0045} />
        ) : (
          <>
            <g transform={`rotate(${-20 * suelta} 220 1000)`}>
              <Tramo x={360} y={860} L={380} ang={-38 + 30 * suelta} k={-0.0045 * (1 - suelta * 0.3)} />
            </g>
            <g transform={`rotate(${20 * suelta} 860 1000)`}>
              <Tramo x={720} y={860} L={380} ang={38 - 30 * suelta} k={-0.0045 * (1 - suelta * 0.3)} />
            </g>
          </>
        )}
        <Chispa x={540} y={760} op={roto ? Math.max(0, 1 - (t - T.primera) * 2) : 0} />
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.primera)}>
          1.ª rotura
        </Texto>
        <Texto x={540} y={1250} size={38} color={C.orange} op={aparece(t, T.doblada)}>
          cada mitad: muy doblada
        </Texto>
        <Texto x={540} y={1330} size={40} color={C.yellow} op={aparece(t, T.libre)}>
          …y de golpe, libre
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.primera} color={C.yellow} />
    </>
  );
};

// D. Se endereza tan rápido que la sacudida viaja como una onda y lo dobla de más en otro punto
export const Onda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pos = interpolate(t, [T.sacudida, T.dobla], [-300, 120], clamp);
  const amp = aparece(t, T.sacudida) * 60;
  const exceso = aparece(t, T.dobla);
  return (
    <Lienzo zoom={interpolate(t, [T.endereza, T.ahi], [1, 1.04])}>
      <Tramo x={540} y={900} L={700} k={-0.0012 * (1 - aparece(t, T.endereza))} onda={{ pos, amp }} />
      <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.endereza)}>
        se endereza de golpe
      </Texto>
      <Texto x={540} y={1150} size={40} color={C.cyan} op={aparece(t, T.onda)}>
        la sacudida viaja como onda →
      </Texto>
      <circle cx={540 + 120} cy={900} r={70} fill="none" stroke={C.red} strokeWidth={6} opacity={exceso} />
      <Texto x={660} y={800} size={36} color={C.red} op={exceso}>
        ¡doblado de más!
      </Texto>
    </Lienzo>
  );
};

// E. Ahí se rompe otra vez: tres pedazos o más
export const Otra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ahi, T.en2018], [1, 1.06])}>
        <Tres t={t} x={540} y={960} />
        <Chispa x={540} y={900} op={Math.max(0, 1 - (t - T.ahi) * 2)} />
        <Texto x={540} y={1250} size={46} color={C.yellow} op={aparece(t, T.porEso1)}>
          3 pedazos o más
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.ahi} color={C.yellow} />
    </>
  );
};

// Espagueti torcido: rayas en espiral que giran con tw (vueltas)
const Torcido: React.FC<{ readonly x: number; readonly y: number; readonly L: number; readonly tw: number }> = ({ x, y, L, tw }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-L / 2} y={-20} width={L} height={40} rx={20} fill={PASTA} />
    <clipPath id="clipTor">
      <rect x={-L / 2} y={-20} width={L} height={40} rx={20} />
    </clipPath>
    <g clipPath="url(#clipTor)">
      {new Array(30).fill(0).map((_, k) => {
        const s = -L / 2 + (k / 29) * L;
        const fase = (s / L + 0.5) * tw * Math.PI * 2;
        const yy = 18 * Math.sin(fase);
        return <circle key={k} cx={s} cy={yy} r={8} fill="#8A5A10" opacity={Math.cos(fase) > 0 ? 1 : 0.25} />;
      })}
    </g>
  </g>
);

// F. 2018, MIT: torcerlo unas tres cuartas de vuelta antes de doblarlo
export const Mit: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tw = 0.75 * interpolate(t, [T.torcerlo, T.vuelta + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.en2018, T.soltarse], [1, 1.04])}>
      <Texto x={540} y={560} size={56} color={C.white} op={aparece(t, T.en2018)}>
        2018
      </Texto>
      <Texto x={540} y={640} size={44} color={C.cyan} op={aparece(t, T.mit)}>
        investigadores del MIT
      </Texto>
      <g opacity={aparece(t, T.torcerlo)}>
        <Torcido x={540} y={950} L={760} tw={tw} />
        <path d="M 140 870 A 60 80 0 1 0 140 1030" stroke={C.yellow} strokeWidth={8} fill="none" />
        <path d="M 940 1030 A 60 80 0 1 0 940 870" stroke={C.yellow} strokeWidth={8} fill="none" />
        <Texto x={540} y={1180} size={42} color={C.yellow} op={aparece(t, T.vuelta)}>
          3/4 de vuelta ({Math.round(tw * 360)}°)
        </Texto>
        <Texto x={540} y={1260} size={38} color={C.white} op={aparece(t, T.doblarlo)}>
          …y luego doblarlo
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Al soltarse, la torsión se libera primero y gasta la energía: se rompe en solo dos
export const Libera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const roto = t > T.soltarse;
  const des = interpolate(t, [T.torsion, T.gasta + 0.5], [0.4, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.soltarse, T.porEso], [1, 1.04])}>
        {roto ? (
          <>
            <Torcido x={320} y={960} L={360} tw={des} />
            <Torcido x={760} y={960} L={360} tw={des} />
          </>
        ) : (
          <Tramo x={540} y={900} L={760} k={-0.004} />
        )}
        <g opacity={aparece(t, T.torsion) * (1 - aparece(t, T.asi))}>
          {[320, 760].map((x) => (
            <path key={x} d={`M ${x - 60} 1060 A 60 30 0 1 0 ${x + 60} 1060`} stroke={C.cyan} strokeWidth={6} fill="none" transform={`rotate(${t * 300} ${x} 1060)`} />
          ))}
        </g>
        <Texto x={540} y={640} size={40} color={C.cyan} op={aparece(t, T.torsion)}>
          primero se suelta la torsión
        </Texto>
        <Texto x={540} y={1200} size={38} color={C.white} op={aparece(t, T.gasta)}>
          gasta la energía de la sacudida
        </Texto>
        <Texto x={540} y={1300} size={48} color={C.yellow} op={aparece(t, T.asi)}>
          solo 2 pedazos ✓
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.asi} color={C.yellow} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
