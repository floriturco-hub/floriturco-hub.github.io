import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/buho/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  paloma: 2.40, // paloma
  abanico: 4.26, // abanico
  buho: 5.36, // buho
  nada: 7.46, // nada
  final: 8.56, // final
  ruido: 11.38, // ruido
  arremolina: 14.70, // arremolina
  trucos: 16.82, // trucos
  delantero: 18.04, // delantero
  peine: 19.66, // peine
  diminutos: 21.94, // diminutos
  atras: 23.48, // atras
  flecos: 24.32, // flecos
  deshacen: 25.38, // deshacen
  aterciopeladas: 28.44, // aterciopeladas
  crujen: 30.00, // crujen
  ingenieros: 31.44, // ingenieros
  ventiladores: 33.40, // ventiladores
  asi: 35.96, // asi
  fin: 37.74, // FIN
};

const PLUMA = "#B8925A";
const AIRE = "#8AC8F8";

// Búho de frente con alas abiertas; aleteo en grados
const Buho: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly ala?: number }> = ({ x, y, s, ala = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`scale(${sd} 1) rotate(${-ala})`}>
        <path d="M 40 -30 Q 200 -90 360 -40 L 340 0 L 300 -10 L 290 25 L 240 10 L 230 45 L 170 25 L 150 55 L 60 40 Z" fill={PLUMA} />
        {new Array(6).fill(0).map((_, k) => (
          <line key={k} x1={100 + k * 40} y1={-20} x2={110 + k * 40} y2={30} stroke="#8A6A3A" strokeWidth={4} />
        ))}
      </g>
    ))}
    <ellipse cx={0} cy={20} rx={80} ry={110} fill="#9A7A4A" />
    <circle cx={0} cy={-70} r={75} fill="#E8D8B8" />
    <circle cx={-30} cy={-75} r={22} fill={C.yellow} />
    <circle cx={30} cy={-75} r={22} fill={C.yellow} />
    <circle cx={-30} cy={-75} r={10} fill="#111" />
    <circle cx={30} cy={-75} r={10} fill="#111" />
    <path d="M -10 -50 L 10 -50 L 0 -30 Z" fill="#5A4A2A" />
  </g>
);

// Paloma de lado aleteando
const Paloma: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={110} ry={60} fill="#8C88A8" />
    <circle cx={100} cy={-40} r={38} fill="#8C88A8" />
    <path d="M 132 -40 L 160 -32 L 132 -26 Z" fill="#E8A040" />
    <circle cx={110} cy={-48} r={6} fill="#111" />
    <path d="M -110 0 L -180 -20 L -180 30 Z" fill="#6A6688" />
    <path d={`M -20 -20 Q -40 ${-140 * Math.sin(t * 25)} -120 ${-160 * Math.sin(t * 25)} L 40 -20 Z`} fill="#6A6688" />
  </g>
);

const Ondas: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly t: number; readonly n?: number }> = ({ x, y, op, t, n = 3 }) => (
  <g opacity={op}>
    {new Array(n).fill(0).map((_, k) => (
      <g key={k} opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 14 - k))}>
        <path d={`M ${x + 60 + k * 40} ${y - 60 - k * 20} q 30 ${60 + k * 20} 0 ${120 + k * 40}`} stroke={C.yellow} strokeWidth={8} fill="none" />
        <path d={`M ${x - 60 - k * 40} ${y - 60 - k * 20} q -30 ${60 + k * 20} 0 ${120 + k * 40}`} stroke={C.yellow} strokeWidth={8} fill="none" />
      </g>
    ))}
  </g>
);

// Medidor de ruido
const Medidor: React.FC<{ readonly x: number; readonly y: number; readonly v: number; readonly op: number }> = ({ x, y, v, op }) => (
  <g opacity={op} transform={`translate(${x} ${y})`}>
    <rect x={-200} y={-30} width={400} height={60} rx={30} fill="#2A2440" />
    <rect x={-200} y={-30} width={400 * v} height={60} rx={30} fill={v > 0.4 ? C.red : C.cyan} />
    <Texto x={0} y={80} size={32} color={C.grey}>
      ruido
    </Texto>
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Buho x={540} y={900} s={1.25} ala={Math.sin(t * 2) * 6} />
    <Medidor x={540} y={1300} v={0.03} op={1} />
    <Texto x={540} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo vuela este búho sin ruido?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.paloma], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. La paloma suena como un abanico; el búho pasa y no oyes nada + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const buho = aparece(t, T.buho);
  return (
    <Lienzo zoom={interpolate(t, [T.paloma, T.ruido], [1, 1.05])}>
      <g opacity={1 - buho}>
        <Paloma x={540} y={860} s={1.3} t={t} />
        <Ondas x={540} y={860} op={aparece(t, T.abanico)} t={t} />
      </g>
      <g opacity={buho}>
        <Buho x={interpolate(t, [T.buho, T.final], [300, 760], clamp)} y={860} s={0.9} ala={Math.sin(t * 3) * 10} />
      </g>
      <Medidor x={540} y={1180} v={buho > 0.5 ? 0.03 : 0.8 + 0.1 * Math.sin(t * 20)} op={aparece(t, T.paloma)} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.ruido], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          qué copian los ingenieros: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Perfil de ala con flujo; remolinos al final (tam), peine en el borde delantero, flecos detrás
const Perfil: React.FC<{ readonly t: number; readonly remolino: number; readonly peine?: number; readonly flecos?: number }> = ({
  t,
  remolino,
  peine = 0,
  flecos = 0,
}) => (
  <g>
    {new Array(5).fill(0).map((_, k) => {
      const y = 700 + k * 90;
      const u = (t * 0.6 + k * 0.2) % 1;
      return (
        <g key={k}>
          <path d={`M 60 ${y} Q 540 ${y + (k < 2 ? -60 : 40)} 1020 ${y}`} stroke={AIRE} strokeWidth={4} fill="none" opacity={0.4} />
          <circle cx={60 + u * 960} cy={y + (k < 2 ? -60 : 40) * Math.sin(u * Math.PI)} r={8} fill={AIRE} />
        </g>
      );
    })}
    <path d="M 220 900 Q 300 820 560 840 Q 760 860 860 900 Q 600 920 220 900 Z" fill={PLUMA} />
    <g opacity={peine}>
      {new Array(7).fill(0).map((_, k) => (
        <path key={k} d={`M ${226 + k * 4} ${896 - k * 9} l -40 -6 l 36 -6`} fill="none" stroke={C.yellow} strokeWidth={5} />
      ))}
    </g>
    <g opacity={flecos}>
      {new Array(9).fill(0).map((_, k) => (
        <line key={k} x1={850} y1={892 + k * 2} x2={930 + (k % 2) * 10} y2={880 + k * 7} stroke={C.yellow} strokeWidth={3} />
      ))}
    </g>
    {[0, 1, 2].map((k) => {
      const r = remolino * (40 - k * 8);
      const cx = 890 + k * 50;
      return (
        <path
          key={k}
          d={`M ${cx} 900 m ${-r} 0 a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r * 0.6} ${r * 0.6} 0 1 1 ${-r * 1.2} 0`}
          stroke={C.red}
          strokeWidth={6}
          fill="none"
          transform={`rotate(${t * 300} ${cx} 900)`}
          opacity={remolino > 0.05 ? 1 : 0}
        />
      );
    })}
  </g>
);

// C. El ruido nace en los bordes de las alas, donde el aire se arremolina
export const Remolinos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ruido, T.trucos], [1, 1.04])}>
      <Perfil t={t} remolino={aparece(t, T.arremolina) * 1.2} />
      <Ondas x={900} y={900} op={aparece(t, T.arremolina)} t={t} n={2} />
      <Texto x={540} y={1250} size={40} color={C.red} op={aparece(t, T.arremolina)}>
        remolinos = ruido
      </Texto>
    </Lienzo>
  );
};

// D-E. Tres trucos: peine en el borde delantero y flecos en el de atrás
export const Bordes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const peine = aparece(t, T.peine);
  const flecos = aparece(t, T.flecos);
  const rem = interpolate(t, [T.diminutos, T.deshacen + 0.5], [1, 0.25], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.trucos, T.aterciopeladas], [1, 1.04])}>
        <Texto x={540} y={500} size={52} color={C.yellow} op={aparece(t, T.trucos)}>
          3 trucos
        </Texto>
        <Perfil t={t} remolino={rem} peine={peine} flecos={flecos} />
        <Texto x={300} y={1250} size={36} color={C.yellow} op={peine}>
          1. peine de púas
        </Texto>
        <Texto x={780} y={1250} size={36} color={C.yellow} op={flecos}>
          2. flecos suaves
        </Texto>
        <Texto x={540} y={1340} size={32} color={C.cyan} op={aparece(t, T.deshacen)}>
          remolinos diminutos: casi sin ruido
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.peine} color={C.yellow} />
    </>
  );
};

// F. Plumas aterciopeladas: no crujen al rozarse
export const Terciopelo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const roce = Math.sin(t * 4) * 30;
  return (
    <Lienzo zoom={interpolate(t, [T.aterciopeladas, T.ingenieros], [1, 1.04])}>
      <Texto x={540} y={500} size={40} color={C.yellow} op={aparece(t, T.aterciopeladas)}>
        3. plumas aterciopeladas
      </Texto>
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${540 + (k ? roce : -roce)} ${820 + k * 70})`}>
          <path d="M -300 0 Q 0 -60 300 0 Q 0 60 -300 0 Z" fill={PLUMA} />
          <line x1={-300} y1={0} x2={300} y2={0} stroke="#8A6A3A" strokeWidth={5} />
          {new Array(24).fill(0).map((_, i) => (
            <line key={i} x1={-260 + i * 22} y1={-30} x2={-256 + i * 22} y2={-44} stroke="#E8D8B8" strokeWidth={3} opacity={0.8} />
          ))}
        </g>
      ))}
      <Medidor x={540} y={1200} v={0.03} op={aparece(t, T.crujen)} />
      <Texto x={540} y={1360} size={36} color={C.cyan} op={aparece(t, T.crujen)}>
        no crujen al rozarse
      </Texto>
    </Lienzo>
  );
};

// G. Los ingenieros copian esos bordes en ventiladores y turbinas silenciosos
export const Ingenieros: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ingenieros, T.asi], [1, 1.04])}>
        <g transform={`translate(540 860) rotate(${t * 90})`} opacity={aparece(t, T.ingenieros)}>
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k} transform={`rotate(${k * 72})`}>
              <path d="M 0 -40 Q 120 -120 260 -40 Q 150 -10 0 0 Z" fill="#8C88A8" />
              {new Array(6).fill(0).map((_, i) => (
                <path key={i} d={`M ${40 + i * 38} ${-52 - Math.sin((i / 6) * Math.PI) * 30} l 10 -14 l 10 14`} fill="none" stroke={C.yellow} strokeWidth={4} />
              ))}
            </g>
          ))}
          <circle cx={0} cy={0} r={50} fill="#5A5478" />
        </g>
        <Texto x={540} y={1250} size={40} color={C.white} op={aparece(t, T.ingenieros)}>
          bordes de búho en ventiladores
        </Texto>
        <Texto x={540} y={1320} size={36} color={C.cyan} op={aparece(t, T.ventiladores)}>
          más silenciosos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.ventiladores} color={C.cyan} />
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
