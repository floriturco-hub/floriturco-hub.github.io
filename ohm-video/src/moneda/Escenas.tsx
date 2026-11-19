import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, mono, useT } from "../theme";

// Instantes clave (s) de public/audio/moneda/narracion.wav (voz x1,05), sacados con Whisper
export const T = {
  metes: 1.92,
  segundo: 3.3,
  mide: 6.32,
  tamano: 8.26,
  sensores: 9.92,
  grosor: 11.88,
  fuera: 13.22,
  pero: 14.9,
  disco: 15.44,
  bobinas: 19.84,
  campo: 20.92,
  remolinos: 24.92,
  distinto: 27.18,
  acero: 30.72,
  huella: 31.84,
  compara: 33.34,
  iman: 37.18,
  velocidad: 39.04,
  hierro: 42.12,
  coincide: 43.8,
  compuerta: 44.86,
  devuelve: 47.16,
  examen: 48.46,
  fin: 51.0,
};

const COBRE = "#D8904A";
const NIQUEL = "#C8C4D8";
const ACERO = "#7A8090";

// Moneda de frente
const Moneda: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly color?: string;
  readonly rot?: number;
  readonly op?: number;
  readonly falsa?: boolean;
}> = ({ x, y, r, color = C.yellow, rot = 0, op = 1, falsa = false }) => (
  <g opacity={op} transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle
      r={r}
      fill={falsa ? ACERO : color}
      stroke="#2A2440"
      strokeWidth={r * 0.06}
    />
    <circle
      r={r * 0.78}
      fill="none"
      stroke="#2A2440"
      strokeWidth={r * 0.03}
      opacity={0.5}
    />
    {falsa ? null : (
      <text
        y={r * 0.22}
        textAnchor="middle"
        fontSize={r * 0.7}
        fontFamily={mono}
        fontWeight={700}
        fill="#2A2440"
        opacity={0.6}
      >
        1
      </text>
    )}
  </g>
);

// Ranura de la máquina
const Ranura: React.FC<{ readonly x: number; readonly y: number }> = ({
  x,
  y,
}) => (
  <g>
    <rect
      x={x - 200}
      y={y - 160}
      width={400}
      height={320}
      rx={30}
      fill="#3A3A4A"
      stroke="#8A8A9A"
      strokeWidth={8}
    />
    <rect
      x={x - 14}
      y={y - 90}
      width={28}
      height={180}
      rx={10}
      fill="#0B091D"
    />
  </g>
);

// Forma de onda (huella electromagnética)
const Onda: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly amp: number;
  readonly fase: number;
  readonly amort: number;
  readonly color: string;
  readonly op?: number;
}> = ({ x, y, w, amp, fase, amort, color, op = 1 }) => (
  <path
    opacity={op}
    d={new Array(81)
      .fill(0)
      .map((_, k) => {
        const u = k / 80;
        const v = amp * Math.exp(-amort * u) * Math.sin(u * 14 + fase);
        return `${k === 0 ? "M" : "L"} ${x + u * w} ${y - v}`;
      })
      .join(" ")}
    stroke={color}
    strokeWidth={6}
    fill="none"
  />
);

// A. Gancho: la máquina detecta la falsa
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cae = interpolate(t, [0, 0.9], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.metes], [1.08, 1])}>
        <Ranura x={540} y={760} />
        <Moneda
          x={540}
          y={420 + cae * 300}
          r={90}
          falsa
          op={1 - aparece(t, 1.4)}
        />
        <g opacity={aparece(t, 1.0)}>
          <line
            x1={380}
            y1={1000}
            x2={700}
            y2={1320}
            stroke={C.red}
            strokeWidth={28}
            strokeLinecap="round"
          />
          <line
            x1={700}
            y1={1000}
            x2={380}
            y2={1320}
            stroke={C.red}
            strokeWidth={28}
            strokeLinecap="round"
          />
        </g>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.red} />
    </>
  );
};

// B. No la mira: la mide, en menos de un segundo
export const Mide: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.metes, T.metes + 1], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.metes, T.tamano], [1, 1.04])}>
      <Ranura x={540} y={760} />
      <Moneda x={540} y={480 + entra * 250} r={90} op={1 - entra} />
      <Tarjeta x={290} y={1010} w={500} h={160} op={aparece(t, T.segundo)}>
        <Texto x={540} y={1112} color={C.yellow} size={66}>
          {"< 1 s"}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1300}
        color={C.grey}
        size={44}
        op={aparece(t, T.mide) * 0.9}
      >
        no la mira…
      </Texto>
      <Texto
        x={540}
        y={1380}
        color={C.yellow}
        size={56}
        op={aparece(t, T.mide + 0.4)}
      >
        la mide
      </Texto>
    </Lienzo>
  );
};

// C. Tamaño: sensores de luz miden diámetro y grosor
export const Tamano: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = ((t - T.tamano) % 2.4) / 2.4;
  const rx = 160 + u * 760;
  const ry = 600 + u * 360;
  return (
    <Lienzo zoom={interpolate(t, [T.tamano, T.pero], [1, 1.04])}>
      <line
        x1={120}
        y1={700}
        x2={960}
        y2={1095}
        stroke="#8A8A9A"
        strokeWidth={14}
        strokeLinecap="round"
      />
      <Moneda x={rx} y={ry} r={90} rot={u * 720} />
      <g opacity={aparece(t, T.sensores)}>
        {[480, 600].map((x) => (
          <g key={x}>
            <rect
              x={x - 20}
              y={420}
              width={40}
              height={40}
              rx={8}
              fill={C.red}
            />
            <line
              x1={x}
              y1={460}
              x2={x}
              y2={1000}
              stroke={C.red}
              strokeWidth={4}
              opacity={0.6}
              strokeDasharray="12 10"
            />
          </g>
        ))}
      </g>
      <g opacity={aparece(t, T.grosor)}>
        <Texto x={540} y={1220} color={C.white} size={40}>
          diámetro y grosor
        </Texto>
      </g>
      <Texto x={540} y={1330} color={C.red} size={48} op={aparece(t, T.fuera)}>
        si no cuadra: fuera
      </Texto>
    </Lienzo>
  );
};

// D. Bobinas, campo variable, remolinos de corriente y huella de cada metal
export const Bobinas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const huellas = aparece(t, T.distinto);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.compara], [1, 1.03])}>
      <g opacity={1 - aparece(t, T.bobinas)}>
        <Moneda x={400} y={800} r={120} />
        <Moneda x={680} y={800} r={120} falsa />
        <Texto
          x={540}
          y={1050}
          color={C.white}
          size={44}
          op={aparece(t, T.disco)}
        >
          mismo tamaño
        </Texto>
      </g>
      <g opacity={aparece(t, T.bobinas) * (1 - huellas)}>
        {[620, 980].map((y) => (
          <g key={y}>
            <rect
              x={340}
              y={y - 50}
              width={400}
              height={100}
              rx={20}
              fill="#3A3A4A"
            />
            {new Array(9).fill(0).map((_, k) => (
              <rect
                key={k}
                x={360 + k * 42}
                y={y - 56}
                width={22}
                height={112}
                rx={6}
                fill={COBRE}
              />
            ))}
          </g>
        ))}
        {[0, 1, 2].map((k) => (
          <ellipse
            key={k}
            cx={540}
            cy={800}
            rx={260 + k * 70}
            ry={140 + k * 30}
            fill="none"
            stroke={C.cyan}
            strokeWidth={5}
            opacity={
              aparece(t, T.campo) * (0.3 + 0.5 * Math.abs(Math.sin(t * 6 + k)))
            }
          />
        ))}
        <Moneda
          x={interpolate(t, [T.bobinas, T.remolinos], [100, 540], suave)}
          y={800}
          r={110}
          color={COBRE}
        />
        <g
          opacity={aparece(t, T.remolinos)}
          transform={`translate(540 800) rotate(${t * 240})`}
        >
          {[50, 85].map((r) => (
            <circle
              key={r}
              r={r}
              fill="none"
              stroke={C.cyan}
              strokeWidth={7}
              strokeDasharray="22 14"
            />
          ))}
        </g>
        <Texto
          x={540}
          y={1150}
          color={C.cyan}
          size={40}
          op={aparece(t, T.remolinos)}
        >
          remolinos de corriente
        </Texto>
      </g>
      <g opacity={huellas}>
        {(
          [
            ["cobre", COBRE, 1, 0, 1.2, T.distinto + 0.6],
            ["níquel", NIQUEL, 0.75, 0.8, 2.4, T.acero - 0.6],
            ["acero", ACERO, 0.5, 1.8, 4, T.acero],
          ] as const
        ).map(([nom, col, amp, fase, am, d], k) => (
          <g key={nom} opacity={aparece(t, d)}>
            <Moneda x={210} y={620 + k * 250} r={70} color={col} />
            <Onda
              x={320}
              y={620 + k * 250}
              w={600}
              amp={90 * amp}
              fase={fase}
              amort={am}
              color={col}
            />
            <Texto x={210} y={730 + k * 250} color={C.grey} size={28}>
              {nom}
            </Texto>
          </g>
        ))}
        <Texto
          x={540}
          y={1400}
          color={C.yellow}
          size={40}
          op={aparece(t, T.huella)}
        >
          cada metal, su huella
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Compara la huella; las antiguas usaban un imán
export const Compara: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const iman = aparece(t, T.iman);
  const enc = interpolate(t, [T.compara, T.compara + 1.5], [0, 1], suave);
  const u = ((t - T.velocidad) % 2.5) / 2.5;
  return (
    <Lienzo zoom={interpolate(t, [T.compara, T.coincide], [1, 1.03])}>
      <Tarjeta
        x={110}
        y={480}
        w={860}
        h={420}
        op={aparece(t, T.compara) * (1 - iman)}
      >
        <Onda
          x={180}
          y={690}
          w={720}
          amp={110}
          fase={0}
          amort={1.2}
          color={C.grey}
        />
        <g transform={`translate(0 ${(1 - enc) * 60})`}>
          <Onda
            x={180}
            y={690}
            w={720}
            amp={110}
            fase={0}
            amort={1.2}
            color={C.cyan}
            op={0.9}
          />
        </g>
        <Texto x={540} y={870} color={C.cyan} size={36} op={enc}>
          coincide
        </Texto>
      </Tarjeta>
      <g opacity={iman}>
        <Texto x={540} y={480} color={C.white} size={44}>
          antes: un imán
        </Texto>
        <g transform="translate(540 820)">
          <path
            d="M -150 -150 L -150 60 A 150 150 0 0 0 150 60 L 150 -150 L 80 -150 L 80 60 A 80 80 0 0 1 -80 60 L -80 -150 Z"
            fill={C.red}
          />
          <rect x={-150} y={-150} width={70} height={60} fill={C.white} />
          <rect x={80} y={-150} width={70} height={60} fill={C.white} />
        </g>
        <Moneda
          x={interpolate(u, [0, 1], [100, 980])}
          y={680}
          r={60}
          op={aparece(t, T.velocidad)}
        />
        <Moneda x={540} y={1060} r={60} falsa op={aparece(t, T.hierro)} />
        <Texto
          x={540}
          y={1210}
          color={C.grey}
          size={36}
          op={aparece(t, T.hierro)}
        >
          el hierro se queda pegado
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Compuerta: pasa a la caja o se devuelve
export const Compuerta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const buena = interpolate(t, [T.compuerta, T.compuerta + 1.2], [0, 1], suave);
  const mala = interpolate(
    t,
    [T.devuelve - 0.3, T.devuelve + 0.9],
    [0, 1],
    suave,
  );
  const abierta = t < T.devuelve - 0.4;
  return (
    <Lienzo zoom={interpolate(t, [T.coincide, T.examen], [1, 1.03])}>
      <rect x={480} y={420} width={120} height={300} fill="#3A3A4A" />
      <path d="M 480 720 L 260 1100 L 380 1100 L 540 820" fill="#3A3A4A" />
      <path d="M 600 720 L 820 1100 L 700 1100 L 540 820" fill="#3A3A4A" />
      <line
        x1={540}
        y1={760}
        x2={abierta ? 440 : 640}
        y2={900}
        stroke={C.yellow}
        strokeWidth={16}
        strokeLinecap="round"
        opacity={aparece(t, T.compuerta)}
      />
      <rect
        x={180}
        y={1110}
        width={280}
        height={180}
        rx={20}
        fill="#2A2440"
        stroke={C.cyan}
        strokeWidth={6}
      />
      <Texto x={320} y={1210} color={C.cyan} size={36}>
        caja
      </Texto>
      <rect
        x={620}
        y={1110}
        width={280}
        height={180}
        rx={20}
        fill="#2A2440"
        stroke={C.red}
        strokeWidth={6}
      />
      <Texto x={760} y={1210} color={C.red} size={36}>
        devolución
      </Texto>
      <Moneda
        x={interpolate(buena, [0, 0.4, 1], [540, 540, 320])}
        y={interpolate(buena, [0, 0.4, 1], [460, 720, 1180])}
        r={55}
        op={aparece(t, T.coincide) * (1 - mala)}
      />
      <Moneda
        x={interpolate(mala, [0, 0.4, 1], [540, 540, 760])}
        y={interpolate(mala, [0, 0.4, 1], [460, 720, 1180])}
        r={55}
        falsa
        op={mala > 0 ? 1 : 0}
      />
    </Lienzo>
  );
};

// G. Cierre: examen de física aprobado
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sello = interpolate(t, [T.examen + 1.2, T.examen + 1.4], [2, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.examen, T.fin + 0.5], [1, 1.05])}>
      <Moneda x={540} y={820} r={200} />
      <g
        opacity={aparece(t, T.examen + 1.2)}
        transform={`translate(540 1130) rotate(-8) scale(${sello})`}
      >
        <rect
          x={-250}
          y={-70}
          width={500}
          height={140}
          rx={16}
          fill="none"
          stroke="#5AC878"
          strokeWidth={12}
        />
        <Texto x={0} y={26} color="#5AC878" size={74}>
          APROBADA
        </Texto>
      </g>
    </Lienzo>
  );
};
