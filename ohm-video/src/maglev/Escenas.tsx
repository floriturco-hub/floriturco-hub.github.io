import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/maglev/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  imanes: 2.20, // imanes
  estable: 4.72, // estable
  voltean: 5.64, // voltean
  pegan: 6.60, // pegan
  final: 7.44, // final
  japones: 10.24, // japones
  superconductores: 11.30, // superconductores
  vagones: 13.32, // vagones
  pasar: 14.36, // pasar
  bobinas: 15.44, // bobinas
  induce: 17.00, // induce
  empujan: 20.48, // empujan
  arriba: 21.06, // arriba
  poca: 22.40, // poca
  ruedas: 23.68, // ruedas
  despega: 24.44, // despega
  ciento: 25.56, // ciento
  otros: 27.78, // otros
  sensores: 29.84, // sensores
  miles: 31.44, // miles
  campo: 33.44, // campo
  adelante: 35.88, // adelante
  asi: 36.96, // asi
  fin: 38.12, // FIN
};

// Tren de perfil; alto = altura sobre la vía; ruedas 0-1
const Tren: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly alto: number; readonly ruedas?: number; readonly imanes?: number }> = ({
  x,
  y,
  s,
  alto,
  ruedas = 0,
  imanes = 0,
}) => (
  <g transform={`translate(${x} ${y - alto}) scale(${s})`}>
    <path d="M -420 0 L -420 -150 L 260 -150 Q 420 -150 460 0 Z" fill={C.white} />
    <rect x={-420} y={-110} width={600} height={50} fill="#3A6EE8" />
    <path d="M 270 -140 Q 380 -140 420 -40 L 300 -40 Z" fill="#141030" />
    <rect x={-420} y={0} width={840} height={20} fill="#8C88A8" />
    {[-320, -120, 80, 280].map((cx) => (
      <g key={cx}>
        <rect x={cx - 40} y={20} width={80} height={24} rx={6} fill={C.cyan} opacity={imanes} />
        <circle cx={cx} cy={40} r={26} fill="#222" opacity={ruedas} />
      </g>
    ))}
  </g>
);

const Via: React.FC<{ readonly y: number; readonly bobinas?: number; readonly ola?: number; readonly t?: number; readonly tx?: number }> = ({ y, bobinas = 0, ola = 0, t = 0, tx = 540 }) => (
  <g>
    <rect x={0} y={y} width={1080} height={70} fill="#5A5478" />
    {new Array(14).fill(0).map((_, k) => {
      const cx = 40 + k * 80;
      const cerca = Math.max(0, 1 - Math.abs(cx - tx) / 400);
      const onda = Math.max(0, Math.sin((cx - t * 400) / 80));
      const brillo = Math.max(bobinas * cerca, ola * onda);
      return (
        <g key={k}>
          <rect x={cx - 26} y={y + 14} width={52} height={40} rx={8} fill="#D88A4A" opacity={0.4 + 0.6 * brillo} />
          <rect x={cx - 26} y={y + 14} width={52} height={40} rx={8} fill={C.yellow} opacity={brillo} />
        </g>
      );
    })}
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Via y={1110} t={t} />
    <Tren x={540} y={1090} s={1.05} alto={30 + Math.sin(t * 3) * 6} imanes={1} />
    <Texto x={540} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo flota este tren a seiscientos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.imanes], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.cyan} />
    </>
  );
};

// Imán simple
const Iman: React.FC<{ readonly x: number; readonly y: number; readonly rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-150} y={-40} width={150} height={80} fill={C.red} />
    <rect x={0} y={-40} width={150} height={80} fill="#3A6EE8" />
    <Texto x={-75} y={14} size={40} color={C.white}>
      N
    </Texto>
    <Texto x={75} y={14} size={40} color={C.white}>
      S
    </Texto>
  </g>
);

// B. Los imanes normales no flotan de forma estable: se voltean o se pegan + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const voltea = interpolate(t, [T.voltean, T.voltean + 0.4], [0, 180], clamp);
  const pega = interpolate(t, [T.pegan, T.pegan + 0.3], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.imanes, T.japones], [1, 1.04])}>
      <Iman x={540} y={1100} rot={0} />
      <Iman x={540} y={interpolate(pega, [0, 1], [860, 1020])} rot={voltea + Math.sin(t * 10) * 8 * (1 - aparece(t, T.voltean))} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.estable) * (1 - aparece(t, T.voltean))}>
        ¿flotar estable?
      </Texto>
      <Texto x={540} y={600} size={44} color={C.red} op={aparece(t, T.voltean)}>
        {pega > 0.5 ? "se pegan" : "se voltean"}
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.japones], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          cómo lo resuelven: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El tren japonés lleva imanes superconductores; al pasar induce corrientes en las bobinas que lo empujan hacia arriba
export const Induce: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tx = interpolate(t, [T.pasar, T.poca], [200, 880], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.japones, T.poca], [1, 1.04])}>
        <Via y={1110} bobinas={aparece(t, T.induce)} tx={tx} t={t} />
        <Tren x={tx} y={1090} s={0.75} alto={aparece(t, T.empujan) * 40} imanes={aparece(t, T.superconductores)} />
        <Texto x={540} y={600} size={40} color={C.cyan} op={aparece(t, T.superconductores) * (1 - aparece(t, T.bobinas))}>
          imanes superconductores
        </Texto>
        <Texto x={540} y={600} size={40} color={C.yellow} op={aparece(t, T.induce) * (1 - aparece(t, T.empujan))}>
          induce corrientes en las bobinas
        </Texto>
        <g opacity={aparece(t, T.empujan)}>
          <path d={`M ${tx} 1000 L ${tx} 880 M ${tx - 24} 908 L ${tx} 880 L ${tx + 24} 908`} stroke={C.yellow} strokeWidth={10} fill="none" />
          <Texto x={540} y={600} size={44} color={C.yellow}>
            lo empujan hacia arriba
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.empujan} color={C.yellow} />
    </>
  );
};

// D. A poca velocidad va sobre ruedas; despega al pasar unos 150 km/h
export const Despega: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = Math.round(interpolate(t, [T.poca, T.ciento + 0.6], [0, 150], clamp));
  const vuela = v >= 150 ? 1 : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.poca, T.otros], [1, 1.04])}>
      <Via y={1110} t={t} />
      <Tren x={540} y={1090} s={0.9} alto={vuela * interpolate(t, [T.ciento + 0.6, T.ciento + 1.2], [0, 40], clamp)} ruedas={1 - vuela * 0.9} imanes={1} />
      <g transform="translate(540 620)">
        <rect x={-220} y={-80} width={440} height={160} rx={24} fill={C.card} stroke={C.cyan} strokeWidth={4} />
        <Texto x={0} y={20} size={70} color={C.cyan}>
          {`${v} km/h`}
        </Texto>
      </g>
      <Texto x={540} y={1300} size={40} color={C.white} op={aparece(t, T.ruedas) * (1 - vuela)}>
        sobre ruedas
      </Texto>
      <Texto x={540} y={1300} size={44} color={C.yellow} op={vuela}>
        ¡despega!
      </Texto>
    </Lienzo>
  );
};

// E. Otros trenes usan electroimanes y sensores que corrigen la distancia miles de veces por segundo
export const Sensores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gap = 10 + Math.sin(t * 40) * 1.5 * aparece(t, T.miles);
  return (
    <Lienzo zoom={interpolate(t, [T.otros, T.campo], [1, 1.04])}>
      <rect x={140} y={900} width={800} height={70} fill="#5A5478" />
      <g transform={`translate(0 ${gap * 4})`}>
        <path d="M 160 980 L 160 1060 L 920 1060 L 920 980" stroke={C.white} strokeWidth={14} fill="none" />
        <rect x={260} y={1010} width={560} height={40} rx={10} fill={C.yellow} opacity={aparece(t, T.otros)} />
        <circle cx={880} cy={1020} r={16} fill={C.red} opacity={aparece(t, T.sensores)} />
      </g>
      <Texto x={540} y={1180} size={36} color={C.yellow} op={aparece(t, T.otros)}>
        electroimanes bajo el riel
      </Texto>
      <Texto x={540} y={1250} size={36} color={C.red} op={aparece(t, T.sensores)}>
        sensores de distancia
      </Texto>
      <g opacity={aparece(t, T.miles)}>
        <rect x={290} y={560} width={500} height={110} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={630} size={40} color={C.yellow}>
          miles de ajustes/s
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Un campo magnético que avanza por la vía lo jala hacia adelante
export const Avance: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tx = interpolate(t, [T.campo, T.asi + 0.4], [300, 760], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.campo, T.asi], [1, 1.04])}>
        <Via y={1110} ola={aparece(t, T.campo)} t={t} />
        <Tren x={tx} y={1090} s={0.8} alto={40} imanes={1} />
        <Texto x={540} y={620} size={40} color={C.yellow} op={aparece(t, T.campo)}>
          campo magnético que avanza
        </Texto>
        <g opacity={aparece(t, T.adelante)}>
          <path d="M 700 760 L 900 760 M 870 740 L 900 760 L 870 780" stroke={C.cyan} strokeWidth={10} fill="none" />
        </g>
      </Lienzo>
      <Flash t={t} d={T.adelante} color={C.cyan} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
