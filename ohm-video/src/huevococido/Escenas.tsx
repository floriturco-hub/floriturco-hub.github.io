import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/huevococido/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  derrite: 2.64, // derrite
  hielo: 4.06, // hielo
  mantequilla: 4.70, // mantequilla
  clara: 6.06, // clara
  solida: 7.26, // solida
  final: 8.94, // final
  atras: 10.66, // atras
  agua: 12.76, // agua
  proteinas: 13.30, // proteinas
  ovillos: 15.84, // ovillos
  vibrar: 18.10, // vibrar
  desenrollan: 19.26, // desenrollan
  estiradas: 20.42, // estiradas
  enredan: 21.26, // enredan
  red: 23.24, // red
  gel: 26.06, // gel
  luz: 28.44, // luz
  transparente: 30.30, // transparente
  blanca2: 31.48, // blanca
  enlaces: 32.40, // enlaces
  enfriar: 34.10, // enfriar
  crudo: 37.14, // crudo
  porEso: 37.86, // por
  fin: 39.68, // FIN
};

const YEMA = "#F0B030";

// Huevo frito en sartén: blanco 0 = clara transparente, 1 = blanca
const Huevo: React.FC<{ readonly x: number; readonly y: number; readonly blanco: number; readonly s?: number; readonly t?: number }> = ({ x, y, blanco, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={30} rx={330} ry={250} fill="#2A2E3A" />
    <rect x={300} y={10} width={260} height={40} rx={20} fill="#2A2E3A" />
    <path
      d={`M -200 0 Q -230 -150 -40 -170 Q 180 -190 210 -40 Q 240 120 40 150 Q -180 170 -200 0 Z`}
      fill={blanco > 0.5 ? "#F4F4F0" : "#DDEEFF"}
      opacity={0.25 + 0.75 * blanco}
      stroke="#F4F4F0"
      strokeWidth={4}
    />
    <circle cx={0} cy={-10} r={70} fill={YEMA} />
    {blanco < 1 && t > 0
      ? [0, 1, 2].map((k) => <circle key={k} cx={-120 + k * 110} cy={60 - ((t * 30 + k * 12) % 40)} r={6} fill="#FFFFFF" opacity={0.5} />)
      : null}
  </g>
);

// Proteínas: abre 0 = ovillos, 1 = estiradas; pega 0..1 = red
const Proteinas: React.FC<{ readonly t: number; readonly abre: number; readonly pega: number; readonly vib?: number }> = ({ t, abre, pega, vib = 0 }) => (
  <g>
    {new Array(9).fill(0).map((_, k) => {
      const cx = 260 + (k % 3) * 280;
      const cy = 760 + Math.floor(k / 3) * 230;
      const pts = new Array(40)
        .fill(0)
        .map((_, i) => {
          const u = i / 39;
          const a = u * Math.PI * 6;
          const r = 60 * (1 - u * 0.5);
          const xo = cx + Math.cos(a + k) * r;
          const yo = cy + Math.sin(a + k) * r;
          const xs = cx - 130 + u * 260;
          const ys = cy + 30 * Math.sin(u * 8 + k + t * 2) * (1 - pega * 0.5);
          const jx = vib * 6 * Math.sin(t * 40 + i);
          return `${i ? "L" : "M"} ${xo + (xs - xo) * abre + jx} ${yo + (ys - yo) * abre}`;
        })
        .join(" ");
      return <path key={k} d={pts} stroke={[C.cyan, C.yellow, "#5AD08A"][k % 3]} strokeWidth={6} fill="none" strokeLinejoin="round" />;
    })}
    {pega > 0
      ? new Array(12).fill(0).map((_, k) => {
          const x = 260 + (k % 3) * 280 + (k % 2 ? 120 : -120);
          const y = 760 + Math.floor(k / 3) * 115;
          return <line key={k} x1={x} y1={y} x2={x + 30} y2={y + 115} stroke={C.white} strokeWidth={4} opacity={pega} />;
        })
      : null}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Huevo x={500} y={1000} blanco={0.5 + 0.5 * Math.sin(t * 0.8)} s={1.1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este huevo se endurece?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.derrite], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Casi todo se derrite con el calor; la clara se vuelve sólida y blanca + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const huevo = aparece(t, T.clara);
  const derr = interpolate(t, [T.hielo, T.clara], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.derrite, T.agua], [1, 1.04])}>
      <g opacity={1 - huevo}>
        <g opacity={aparece(t, T.hielo)}>
          <rect x={230 - 0 * derr} y={900 + 120 * derr} width={160} height={160 * (1 - derr * 0.75)} rx={20} fill="#C8E8FF" />
          <ellipse cx={310} cy={1080} rx={60 + 60 * derr} ry={14} fill="#8AC8FF" />
          <Texto x={310} y={1160} size={32} color={C.white}>
            hielo
          </Texto>
        </g>
        <g opacity={aparece(t, T.mantequilla)}>
          <rect x={690} y={950 + 80 * derr} width={180} height={110 * (1 - derr * 0.6)} rx={14} fill="#F0D870" />
          <ellipse cx={780} cy={1080} rx={60 + 50 * derr} ry={12} fill="#E8C040" />
          <Texto x={780} y={1160} size={32} color={C.white}>
            mantequilla
          </Texto>
        </g>
        <Texto x={540} y={780} size={40} color={C.orange} op={aparece(t, T.derrite)}>
          con calor: se derriten
        </Texto>
      </g>
      <g opacity={huevo}>
        <Huevo x={500} y={1000} blanco={interpolate(t, [T.clara, T.solida + 0.8], [0, 1], clamp)} t={t} />
        <Texto x={540} y={1400} size={40} color={C.yellow} op={aparece(t, T.solida)}>
          la clara: sólida y blanca
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué no vuelve atrás?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.agua], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La clara: agua con proteínas enrolladas como ovillos; el calor las hace vibrar y se desenrollan
export const Ovillos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abre = interpolate(t, [T.desenrollan, T.desenrollan + 1], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.agua, T.estiradas], [1, 1.04])}>
        <rect x={120} y={640} width={840} height={720} rx={40} fill="#8AC8FF" opacity={0.12} />
        <g opacity={aparece(t, T.proteinas)}>
          <Proteinas t={t} abre={abre} pega={0} vib={aparece(t, T.vibrar)} />
        </g>
        <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.agua)}>
          agua + proteínas
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.cyan} op={aparece(t, T.ovillos) * (1 - aparece(t, T.vibrar))}>
          enrolladas como ovillos
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.orange} op={aparece(t, T.vibrar) * (1 - abre)}>
          el calor las hace vibrar…
        </Texto>
        <Texto x={540} y={1440} size={40} color={C.yellow} op={abre}>
          …y se desenrollan
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desenrollan} color={C.orange} />
    </>
  );
};

// D. Estiradas, se enredan y se pegan formando una red que atrapa el agua: un gel sólido
export const Red: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pega = interpolate(t, [T.enredan, T.red + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.estiradas, T.luz], [1, 1.04])}>
        <rect x={120} y={640} width={840} height={720} rx={40} fill="#8AC8FF" opacity={0.12} />
        <Proteinas t={t} abre={1} pega={pega} />
        {aparece(t, T.red) > 0
          ? new Array(14).fill(0).map((_, k) => <circle key={k} cx={200 + ((k * 137) % 680)} cy={700 + ((k * 89) % 620)} r={10} fill="#8AC8FF" opacity={aparece(t, T.red)} />)
          : null}
        <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.enredan)}>
          se enredan y se pegan
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.cyan} op={aparece(t, T.red) * (1 - aparece(t, T.gel))}>
          una red que atrapa el agua
        </Texto>
        <Texto x={540} y={1440} size={44} color={C.yellow} op={aparece(t, T.gel)}>
          = gel sólido
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.gel} color={C.yellow} />
    </>
  );
};

// E. La red desvía la luz en todas direcciones: la clara transparente se vuelve blanca
export const Blanca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = aparece(t, T.blanca2);
  return (
    <Lienzo zoom={interpolate(t, [T.luz, T.enlaces], [1, 1.04])}>
      <rect x={160} y={760} width={760} height={420} rx={30} fill={b > 0.5 ? "#F4F4F0" : "#DDEEFF"} opacity={0.15 + 0.6 * b} />
      {new Array(8).fill(0).map((_, k) => {
        const a = (k / 8) * Math.PI * 2;
        return <line key={k} x1={540} y1={970} x2={540 + Math.cos(a) * 300} y2={970 + Math.sin(a) * 200} stroke={C.yellow} strokeWidth={5} opacity={aparece(t, T.luz) * 0.8} />;
      })}
      <path d="M 60 970 L 540 970" stroke={C.yellow} strokeWidth={8} opacity={aparece(t, T.luz)} />
      <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.luz)}>
        la red desvía la luz
      </Texto>
      <Texto x={540} y={1340} size={40} color="#F4F4F0" op={b}>
        transparente → blanca
      </Texto>
    </Lienzo>
  );
};

// F. Los enlaces nuevos no se deshacen al enfriar: un huevo cocido nunca vuelve a ser crudo
export const Irreversible: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.enlaces, T.porEso], [1, 1.04])}>
        <Huevo x={340} y={1000} blanco={1} s={0.6} />
        <path d="M 580 960 L 700 960 M 680 940 L 700 960 L 680 980" stroke={C.cyan} strokeWidth={8} fill="none" opacity={aparece(t, T.enfriar)} />
        <Texto x={640} y={920} size={30} color={C.cyan} op={aparece(t, T.enfriar)}>
          enfriar
        </Texto>
        <Huevo x={860} y={1000} blanco={1} s={0.4} />
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.enlaces)}>
          los enlaces nuevos se quedan
        </Texto>
        <Texto x={540} y={1340} size={40} color={C.yellow} op={aparece(t, T.crudo)}>
          nunca vuelve a ser crudo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.crudo} color={C.yellow} />
    </>
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
