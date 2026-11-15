import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/agujeros/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sin: 2.06,
  perforado: 4.38,
  final: 5.6,
  si: 7.84,
  retina: 11.02,
  circulo: 13.1,
  ese: 14.26,
  angulos: 16.98,
  un: 18.14,
  haz: 20.8,
  con: 23.16,
  nitida: 26.48,
  es: 27.3,
  entrecerrar: 28.5,
  la: 29.96,
  luz: 31.5,
  pedacitos: 32.44,
  no: 33.48,
  porEso: 36.08,
  fin: 38.38,
};

const OJO = "#E8E6F0";
const IRIS = "#4A7AB8";

// Lentes estenopeicos: montura con rejilla de agujeritos
const LentesAgujeros: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((l) => (
      <g key={l} transform={`translate(${l * 170} 0)`}>
        <ellipse rx={150} ry={110} fill="#1A1620" stroke="#3A3650" strokeWidth={14} />
        {new Array(7).fill(0).map((_, i) =>
          new Array(5).fill(0).map((__, j) => {
            const px = -105 + i * 35;
            const py = -70 + j * 35;
            if ((px / 140) ** 2 + (py / 100) ** 2 > 0.85) return null;
            return <circle key={`${i}${j}`} cx={px} cy={py} r={6} fill="#C8C4D8" />;
          }),
        )}
      </g>
    ))}
    <path d="M -20 -20 Q 0 -40 20 -20" stroke="#3A3650" strokeWidth={14} fill="none" />
  </g>
);

// Texto de prueba con desenfoque
const Letras: React.FC<{ readonly x: number; readonly y: number; readonly borroso: number; readonly size?: number }> = ({ x, y, borroso, size = 90 }) => (
  <g>
    {[-1, 0, 1].map((k) => (
      <text
        key={k}
        x={x + k * 10 * borroso}
        y={y + k * 4 * borroso}
        textAnchor="middle"
        fontSize={size}
        fontWeight={700}
        fill={C.white}
        fontFamily="JetBrains Mono"
        opacity={k === 0 ? 1 - borroso * 0.5 : 0.35 * borroso}
      >
        E F P T O Z
      </text>
    ))}
  </g>
);

// A. Gancho: ¿ver nítido a través de agujeritos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.8, 1.1], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sin], [1.12, 1])}>
        <Letras x={540} y={600} borroso={interpolate(t, [0.4, 1.2], [1, 0], clamp)} />
        <LentesAgujeros x={540} y={950} s={1.25} />
        <Texto x={540} y={1300} size={110} color={C.yellow} op={q}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.14} />
    </>
  );
};

// B. Sin cristales ni aumento, solo plástico negro perforado + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.si], [1, 1.05])}>
      <LentesAgujeros x={540} y={760} s={1.1} />
      <Texto x={540} y={1000} size={38} color={C.white} op={aparece(t, T.sin)}>
        sin cristales, sin aumento
      </Texto>
      <Texto x={540} y={1070} size={34} color={C.grey} op={aparece(t, T.perforado)}>
        solo plástico perforado
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.si], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={40}>
          su gran trampa: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Ojo en corte (pupila a la izquierda en x0, retina a la derecha)
const Ojo: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={220} fill={OJO} />
    <path d="M 160 -150 A 220 220 0 0 1 160 150" stroke={C.red} strokeWidth={14} fill="none" />
    <ellipse cx={-210} cy={0} rx={30} ry={80} fill={IRIS} opacity={0.8} />
  </g>
);

// Rayos que entran por la pupila con apertura (0..1) y se cruzan en xf
const Rayos: React.FC<{ readonly x0: number; readonly y: number; readonly apertura: number; readonly xf: number; readonly xr: number; readonly op?: number }> = ({
  x0,
  y,
  apertura,
  xf,
  xr,
  op = 1,
}) => {
  const h = 70 * apertura;
  const n = 5;
  return (
    <g opacity={op}>
      {new Array(n).fill(0).map((_, k) => {
        const dy = -h + (2 * h * k) / (n - 1);
        const yr = y - dy * ((xr - xf) / (xf - x0));
        return (
          <g key={k}>
            <line x1={x0 - 300} y1={y + dy} x2={x0} y2={y + dy} stroke={C.yellow} strokeWidth={5} />
            <line x1={x0} y1={y + dy} x2={xr} y2={yr} stroke={C.yellow} strokeWidth={5} />
          </g>
        );
      })}
    </g>
  );
};

// C. Con miopía el ojo enfoca antes de la retina: cada punto llega como un círculo borroso
export const Miopia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.ese], [1, 1.04])}>
      <Ojo x={600} y={820} />
      <Rayos x0={390} y={820} apertura={1} xf={680} xr={780} op={aparece(t, T.si + 0.6)} />
      <circle cx={680} cy={820} r={14} fill={C.cyan} opacity={aparece(t, T.retina - 0.6)} />
      <line x1={780} y1={770} x2={780} y2={870} stroke={C.red} strokeWidth={16} opacity={aparece(t, T.circulo)} />
      <Texto x={680} y={560} size={32} color={C.cyan} op={aparece(t, T.retina - 0.6)}>
        enfoca aquí
      </Texto>
      <Texto x={540} y={1150} size={38} color={C.red} op={aparece(t, T.circulo)}>
        en la retina: un círculo borroso
      </Texto>
    </Lienzo>
  );
};

// D-E. Entran rayos de muchos ángulos; el agujerito deja pasar solo un haz finísimo
export const Angulos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapa = aparece(t, T.un + 0.4);
  const apertura = interpolate(t, [T.un + 0.4, T.haz + 0.4], [1, 0.12], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.ese, T.con], [1, 1.04])}>
      <Ojo x={600} y={820} />
      <Rayos x0={390} y={820} apertura={apertura} xf={680} xr={780} />
      <line x1={780} y1={820 - 50 * apertura} x2={780} y2={820 + 50 * apertura} stroke={C.red} strokeWidth={16} />
      <g opacity={tapa}>
        <rect x={330} y={580} width={30} height={220} fill="#1A1620" />
        <rect x={330} y={840} width={30} height={220} fill="#1A1620" />
      </g>
      <Texto x={540} y={500} size={36} color={C.yellow} op={aparece(t, T.angulos) * (1 - tapa)}>
        rayos de muchos ángulos
      </Texto>
      <Texto x={540} y={1150} size={38} color={C.white} op={tapa}>
        un agujerito: solo rayos casi rectos
      </Texto>
    </Lienzo>
  );
};

// F. El círculo borroso se encoge y la imagen se ve más nítida; G. como entrecerrar los ojos
export const Nitido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nitido = interpolate(t, [T.con + 0.4, T.nitida], [0, 1], suave);
  const entre = aparece(t, T.entrecerrar - 0.4);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.con, T.la], [1, 1.04])}>
        <g opacity={1 - entre}>
          <circle cx={300} cy={760} r={interpolate(nitido, [0, 1], [110, 18])} fill={C.red} opacity={0.6} />
          <Texto x={300} y={960} size={32} color={C.red}>
            círculo borroso
          </Texto>
          <Letras x={720} y={790} borroso={1 - nitido} size={60} />
        </g>
        <g opacity={entre}>
          <ellipse cx={540} cy={780} rx={220} ry={interpolate(t, [T.entrecerrar - 0.4, T.entrecerrar + 0.4], [110, 30], clamp)} fill={OJO} />
          <circle cx={540} cy={780} r={Math.min(70, interpolate(t, [T.entrecerrar - 0.4, T.entrecerrar + 0.4], [110, 30], clamp))} fill={IRIS} />
          <path d="M 320 700 Q 540 620 760 700" stroke="#4A3A2A" strokeWidth={12} fill="none" />
          <Texto x={540} y={1000} size={38} color={C.white}>
            como entrecerrar los ojos
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.nitida} />
    </>
  );
};

// H. La trampa: entra menos luz, ves por pedacitos; no sirven para manejar ni curan la miopía
export const Trampa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.porEso], [1, 1.04])}>
      <defs>
        <clipPath id="agujerosVista">
          {new Array(8).fill(0).map((_, i) =>
            new Array(8).fill(0).map((__, j) => <circle key={`${i}${j}`} cx={200 + i * 97} cy={500 + j * 80} r={22} />),
          )}
        </clipPath>
      </defs>
      <rect x={160} y={460} width={760} height={680} fill="#0A0814" />
      <g clipPath="url(#agujerosVista)" opacity={0.4 + 0.6 * (1 - aparece(t, T.luz))}>
        <rect x={160} y={460} width={760} height={680} fill="#6AA8D8" />
        <circle cx={700} cy={620} r={90} fill={C.yellow} />
        <rect x={160} y={900} width={760} height={240} fill="#3A8A5A" />
      </g>
      <Texto x={540} y={1230} size={36} color={C.grey} op={aparece(t, T.luz)}>
        menos luz, a pedacitos
      </Texto>
      <g opacity={aparece(t, T.no)}>
        <rect x={190} y={1290} width={700} height={130} rx={20} fill={C.card} stroke={C.red} strokeWidth={4} />
        <Texto x={540} y={1345} size={32} color={C.red}>
          no sirven para manejar
        </Texto>
        <Texto x={540} y={1395} size={32} color={C.red}>
          y no curan la miopía
        </Texto>
      </g>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tl = interpolate(t, [T.fin, T.fin + 0.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Letras x={540} y={600} borroso={tl} />
      <LentesAgujeros x={540} y={950} s={1.25} />
      <Texto x={540} y={1300} size={110} color={C.yellow} op={1 - tl}>
        ?
      </Texto>
    </Lienzo>
  );
};
