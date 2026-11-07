import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/rayosx/narracion.wav (voz x1,11), sacados con Whisper
export const T = {
  pantalla: 1.96,
  sincolor: 6.6,
  atraviesan: 8.78,
  detectores: 11.84,
  denso: 13.34,
  oscuro: 15.06,
  energias: 17.36,
  baja: 19.96,
  hierro: 21.44,
  alta: 24.04,
  comparando: 26.82,
  atomos: 29.74,
  color: 31.92,
  naranja: 33.1,
  explosivos: 39.04,
  verde: 41.02,
  azul: 43.94,
  negro: 46.02,
  mano: 49.54,
  traducida: 50.78,
  fin: 53.2,
};

const NARANJA = "#E89A3C";
const VERDE = "#5AC878";
const AZUL = "#3A7AE8";

// Objetos de la maleta: [x, y, w, h, color, forma]
const OBJETOS: readonly [number, number, number, number, string, string][] = [
  [-230, -90, 170, 120, NARANJA, "ropa"],
  [-20, -110, 90, 200, NARANJA, "botella"],
  [130, -100, 120, 60, VERDE, "lata"],
  [130, 0, 140, 90, AZUL, "tijeras"],
  [-230, 60, 130, 70, VERDE, "vidrio"],
  [-60, 110, 200, 40, AZUL, "llave"],
];

// Maleta en rayos X; gris = sin color, color = paleta del escáner
const Maleta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly color: number;
  readonly barrido?: number;
  readonly negro?: number;
}> = ({ x, y, s, color, barrido = -1, negro = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-320}
      y={-200}
      width={640}
      height={400}
      rx={40}
      fill="#1A2440"
      stroke="#6A8AB8"
      strokeWidth={8}
    />
    <rect
      x={-80}
      y={-250}
      width={160}
      height={60}
      rx={20}
      fill="none"
      stroke="#6A8AB8"
      strokeWidth={10}
    />
    {OBJETOS.map(([ox, oy, w, h, col], k) => (
      <rect
        key={k}
        x={ox}
        y={oy}
        width={w}
        height={h}
        rx={k === 1 ? 30 : 14}
        fill={color > 0.5 ? col : "#8C8CA8"}
        opacity={color > 0.5 ? 0.85 : 0.35 + 0.1 * k}
      />
    ))}
    <rect
      x={160}
      y={-180}
      width={120}
      height={70}
      rx={10}
      fill="#05040C"
      opacity={negro}
    />
    {barrido >= 0 ? (
      <rect
        x={-320 + barrido * 640}
        y={-210}
        width={10}
        height={420}
        fill={C.cyan}
        opacity={0.8}
      />
    ) : null}
  </g>
);

// A. Gancho: tu maleta no tiene secretos
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = interpolate(t, [0, 1.2], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pantalla], [1.08, 1])}>
        <defs>
          <clipPath id="barridoG">
            <rect x={0} y={0} width={220 + b * 640} height={1920} />
          </clipPath>
        </defs>
        <Maleta x={540} y={880} s={1.4} color={0} />
        <g clipPath="url(#barridoG)">
          <Maleta x={540} y={880} s={1.4} color={1} barrido={b < 1 ? b : -1} />
        </g>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.cyan} />
    </>
  );
};

// B. Pantalla en colores, pero los rayos X no tienen color
export const Pantalla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gris = aparece(t, T.sincolor);
  return (
    <Lienzo zoom={interpolate(t, [T.pantalla, T.atraviesan], [1, 1.04])}>
      <rect
        x={110}
        y={520}
        width={860}
        height={640}
        rx={30}
        fill="#0A0A14"
        stroke={C.grey}
        strokeWidth={10}
      />
      <rect x={480} y={1160} width={120} height={80} fill={C.grey} />
      <rect x={380} y={1240} width={320} height={24} rx={10} fill={C.grey} />
      <Maleta x={540} y={850} s={1.1} color={1 - gris} />
      <Texto x={540} y={1380} color={C.grey} size={44} op={gris}>
        los rayos X no tienen color
      </Texto>
    </Lienzo>
  );
};

// C. Los rayos atraviesan; lo denso frena más y sale más oscuro
export const Atraviesan: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const det = aparece(t, T.detectores);
  return (
    <Lienzo zoom={interpolate(t, [T.atraviesan, T.energias], [1, 1.03])}>
      <rect x={490} y={400} width={100} height={70} rx={14} fill={C.grey} />
      <polygon
        points="540,470 180,1180 900,1180"
        fill={C.cyan}
        opacity={0.12 * aparece(t, T.atraviesan)}
      />
      {new Array(10).fill(0).map((_, k) => {
        const xf = 200 + k * 76;
        const f = (t * 1.2 + k * 0.13) % 1;
        const frena = xf > 380 && xf < 560;
        const fin = frena ? 0.6 : 1;
        return (
          <circle
            key={k}
            cx={540 + (xf - 540) * f}
            cy={470 + 710 * f}
            r={8}
            fill={C.cyan}
            opacity={aparece(t, T.atraviesan) * (f < fin ? 1 : 0)}
          />
        );
      })}
      <rect
        x={380}
        y={820}
        width={180}
        height={140}
        rx={16}
        fill="#5A5A70"
        stroke={C.white}
        strokeWidth={4}
        opacity={aparece(t, T.denso)}
      />
      <Texto x={470} y={800} color={C.white} size={30} op={aparece(t, T.denso)}>
        denso
      </Texto>
      <rect
        x={620}
        y={840}
        width={180}
        height={110}
        rx={16}
        fill="#3A3A50"
        stroke={C.grey}
        strokeWidth={4}
        opacity={aparece(t, T.denso)}
      />
      <Texto x={710} y={820} color={C.grey} size={30} op={aparece(t, T.denso)}>
        ligero
      </Texto>
      <g opacity={det}>
        <rect x={160} y={1180} width={760} height={30} rx={8} fill={C.yellow} />
        <Texto x={540} y={1260} color={C.yellow} size={32}>
          detectores
        </Texto>
      </g>
      <g opacity={aparece(t, T.oscuro)}>
        {new Array(20).fill(0).map((_, k) => {
          const xx = 180 + k * 38;
          const v =
            xx > 380 && xx < 560 ? 0.15 : xx > 620 && xx < 800 ? 0.6 : 1;
          return (
            <rect
              key={k}
              x={xx}
              y={1300}
              width={36}
              height={60}
              fill={C.white}
              opacity={v}
            />
          );
        })}
        <Texto x={540} y={1420} color={C.white} size={38}>
          más denso = más oscuro
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Dos energías: la baja la frenan los átomos pesados
export const Energias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mats = [
    ["plástico", 0.8, 0.9, NARANJA],
    ["hierro", 0.12, 0.6, AZUL],
  ] as const;
  const crece = interpolate(t, [T.hierro, T.alta + 0.5], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.energias, T.color], [1, 1.03])}>
      <Texto
        x={540}
        y={470}
        color={C.white}
        size={46}
        op={aparece(t, T.energias)}
      >
        dos energías a la vez
      </Texto>
      <g opacity={aparece(t, T.energias)}>
        <rect
          x={180}
          y={540}
          width={30}
          height={30}
          rx={6}
          fill={C.purpleLight}
        />
        <Texto x={230} y={566} color={C.purpleLight} size={30} anchor="start">
          baja energía
        </Texto>
        <rect x={580} y={540} width={30} height={30} rx={6} fill={C.cyan} />
        <Texto x={630} y={566} color={C.cyan} size={30} anchor="start">
          alta energía
        </Texto>
      </g>
      <Tarjeta x={120} y={620} w={840} h={620} op={aparece(t, T.energias + 0.6)}>
        <line
          x1={170}
          y1={1130}
          x2={910}
          y2={1130}
          stroke={C.grey}
          strokeWidth={4}
        />
        <Texto x={200} y={680} color={C.grey} size={24} anchor="start">
          rayos que pasan
        </Texto>
        {mats.map(([nom, baja, alta, col], k) => (
          <g key={nom}>
            <rect
              x={240 + k * 360}
              y={1130 - 400 * baja * crece}
              width={110}
              height={400 * baja * crece}
              fill={C.purpleLight}
            />
            <rect
              x={370 + k * 360}
              y={1130 - 400 * alta * crece}
              width={110}
              height={400 * alta * crece}
              fill={C.cyan}
            />
            <Texto x={360 + k * 360} y={1190} color={col} size={34}>
              {nom}
            </Texto>
          </g>
        ))}
      </Tarjeta>
      <Texto
        x={540}
        y={1340}
        color={C.yellow}
        size={40}
        op={aparece(t, T.comparando)}
      >
        comparar = saber los átomos
      </Texto>
    </Lienzo>
  );
};

// E. Naranja, verde y azul
export const Colores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const filas = [
    [NARANJA, "orgánico", "comida, ropa, plástico", T.naranja],
    [VERDE, "intermedio", "aluminio, vidrio", T.verde],
    [AZUL, "metal", "acero", T.azul],
  ] as const;
  return (
    <Lienzo zoom={interpolate(t, [T.color, T.negro], [1, 1.03])}>
      {filas.map(([col, nom, ej, d], k) => (
        <g key={nom} opacity={0.2 * aparece(t, T.color) + 0.8 * aparece(t, d)}>
          <rect
            x={150}
            y={470 + k * 260}
            width={190}
            height={190}
            rx={30}
            fill={col}
          />
          <Texto x={390} y={555 + k * 260} color={col} size={50} anchor="start">
            {nom}
          </Texto>
          <Texto
            x={390}
            y={610 + k * 260}
            color={C.grey}
            size={30}
            anchor="start"
          >
            {ej}
          </Texto>
        </g>
      ))}
      <Texto
        x={540}
        y={1300}
        color={C.red}
        size={40}
        op={aparece(t, T.explosivos)}
      >
        los explosivos también son naranja
      </Texto>
    </Lienzo>
  );
};

// F. Negro: no lo atraviesan, revisión a mano
export const Negro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const alerta = t > T.mano ? 0.5 + 0.5 * Math.sign(Math.sin(t * 10)) : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.negro, T.traducida], [1, 1.04])}>
      <Maleta x={540} y={820} s={1.3} color={1} negro={aparece(t, T.negro)} />
      <rect
        x={720}
        y={530}
        width={220}
        height={150}
        rx={20}
        fill="none"
        stroke={C.red}
        strokeWidth={10}
        opacity={alerta}
      />
      <Texto
        x={540}
        y={1200}
        color={C.white}
        size={44}
        op={aparece(t, T.negro)}
      >
        negro: no lo atraviesan
      </Texto>
      <Texto x={540} y={1290} color={C.red} size={44} op={aparece(t, T.mano)}>
        revisión a mano
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: tu maleta traducida a colores
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.traducida, T.fin + 0.5], [1, 1.05])}>
      <Maleta x={540} y={880} s={1.4} color={1} />
      {new Array(12).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={540 + (random(`cx${k}`) - 0.5) * 900}
          cy={880 + (random(`cy${k}`) - 0.5) * 700}
          r={6}
          fill={[NARANJA, VERDE, AZUL][k % 3]}
          opacity={0.5 + 0.5 * Math.sin(t * 4 + k)}
        />
      ))}
    </Lienzo>
  );
};
