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

// Instantes clave (s) de public/audio/candado/narracion.wav (voz x1,06), sacados con Whisper
export const T = {
  fuera: 2.64,
  discos: 5.96,
  muesca: 9.76,
  dientes: 11.6,
  medio: 17.04,
  tren: 21.64,
  derecha: 23.42,
  primero: 28.74,
  izquierda: 29.98,
  segundo: 35.48,
  final: 36.58,
  tercero: 40.6,
  alineadas: 41.58,
  barra: 44.28,
  abre: 47.66,
  tres: 49.12,
  fin: 51.1,
};

const METAL = "#8C88A8";
const COLORES = [C.cyan, C.yellow, C.orange];
const NOMBRES = ["cercano", "medio", "lejano"];

// Ángulos (grados) de la muesca de cada disco: 0 = arriba, alineada con la barra.
// Fases: A arrastre en cadena, B derecha, C izquierda, D derecha final.
const angulos = (t: number): [number, number, number] => {
  const a = interpolate(t, [T.dientes + 0.3, T.derecha - 0.3], [0, 900], suave);
  let n1 = 150 + a;
  let n2 = 250 + Math.max(0, a - 300);
  let n3 = 60 + Math.max(0, a - 600);
  const b = interpolate(t, [T.derecha + 0.3, T.primero + 0.5], [0, 360], suave);
  n1 += b;
  n2 += b;
  n3 += b;
  const c = interpolate(
    t,
    [T.izquierda + 0.2, T.segundo + 0.5],
    [0, 490],
    suave,
  );
  n1 -= c;
  n2 -= Math.max(0, c - 360);
  const d = interpolate(t, [T.final + 0.3, T.tercero + 0.5], [0, 160], suave);
  n1 += d;
  return [n1, n2, n3];
};

// Disco con muesca y diente de arrastre
const Disco: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly ang: number;
  readonly color: string;
  readonly brillo?: number;
}> = ({ x, y, r, ang, color, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <path
      d={`M ${-r * 0.18} ${-r} A ${r} ${r} 0 1 0 ${r * 0.18} ${-r} L ${r * 0.18} ${-r * 0.72} L ${-r * 0.18} ${-r * 0.72} Z`}
      fill="#2E2A48"
      stroke={color}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    <rect
      x={-r * 0.2}
      y={-r * 1.02}
      width={r * 0.4}
      height={r * 0.34}
      fill={color}
      opacity={brillo * 0.5}
    />
    <circle r={r * 0.18} fill={C.bg} stroke={METAL} strokeWidth={5} />
    <rect
      x={r * 0.55}
      y={-10}
      width={r * 0.3}
      height={20}
      rx={6}
      fill={METAL}
    />
  </g>
);

// Rueda de números (dial)
const Dial: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly ang: number;
}> = ({ x, y, r, ang }) => (
  <g>
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <circle r={r} fill="#1E1A34" stroke={METAL} strokeWidth={10} />
      {new Array(40).fill(0).map((_, k) => (
        <line
          key={k}
          x1={0}
          y1={-r + 10}
          x2={0}
          y2={-r + (k % 5 === 0 ? 40 : 24)}
          stroke={C.white}
          strokeWidth={k % 5 === 0 ? 5 : 3}
          transform={`rotate(${k * 9})`}
        />
      ))}
      {[0, 10, 20, 30].map((n) => (
        <text
          key={n}
          x={0}
          y={-r + 82}
          textAnchor="middle"
          fill={C.white}
          fontFamily={mono}
          fontSize={36}
          fontWeight={700}
          transform={`rotate(${-n * 9})`}
        >
          {n}
        </text>
      ))}
      <circle r={r * 0.28} fill="#2E2A48" stroke={METAL} strokeWidth={6} />
    </g>
    <path
      d={`M ${x - 18} ${y - r - 40} L ${x + 18} ${y - r - 40} L ${x} ${y - r - 8} Z`}
      fill={C.red}
    />
  </g>
);

// Mecanismo completo: dial arriba, tres discos en fila y barra sobre las muescas
const Mecanismo: React.FC<{
  readonly t: number;
  readonly ops?: [number, number, number];
  readonly brillo?: number;
  readonly caida?: number;
  readonly dientes?: number;
}> = ({ t, ops = [1, 1, 1], brillo = 0, caida = 0, dientes = 0 }) => {
  const [n1, n2, n3] = angulos(t);
  const ang = [n1, n2, n3];
  return (
    <g>
      <Dial x={540} y={560} r={200} ang={n1 - 150} />
      <line
        x1={540}
        y1={760}
        x2={540}
        y2={930}
        stroke={METAL}
        strokeWidth={10}
        opacity={0.5}
      />
      <line
        x1={160}
        y1={1060}
        x2={920}
        y2={1060}
        stroke={METAL}
        strokeWidth={10}
        opacity={0.4}
      />
      {ang.map((a, k) => (
        <g key={k} opacity={ops[k]}>
          <Disco
            x={240 + k * 300}
            y={1060}
            r={120}
            ang={a}
            color={COLORES[k]}
            brillo={brillo}
          />
          <Texto x={240 + k * 300} y={1240} color={COLORES[k]} size={30}>
            {NOMBRES[k]}
          </Texto>
        </g>
      ))}
      <g opacity={dientes}>
        {[0, 1].map((k) => (
          <path
            key={k}
            d={`M ${300 + k * 300} 1150 Q ${390 + k * 300} 1200 ${480 + k * 300} 1150`}
            stroke={C.white}
            strokeWidth={5}
            fill="none"
            strokeDasharray="12 10"
            markerEnd="none"
          />
        ))}
      </g>
      <g transform={`translate(0 ${caida * 40})`} opacity={Math.max(...ops)}>
        <rect
          x={150}
          y={880}
          width={780}
          height={36}
          rx={10}
          fill={C.red}
          opacity={0.85}
        />
      </g>
    </g>
  );
};

// Candado por fuera
const Candado: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly abierto: number;
  readonly rayos?: number;
}> = ({ x, y, s, abierto, rayos = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`translate(0 ${-abierto * 90})`}>
      <path
        d="M -120 -60 L -120 -200 A 120 120 0 0 1 120 -200 L 120 -60"
        stroke="#C8C4D8"
        strokeWidth={44}
        fill="none"
      />
    </g>
    <rect
      x={-200}
      y={-80}
      width={400}
      height={360}
      rx={50}
      fill="#3A3A4A"
      stroke={METAL}
      strokeWidth={10}
    />
    <circle
      cx={0}
      cy={100}
      r={120}
      fill="#1E1A34"
      stroke={METAL}
      strokeWidth={8}
    />
    {new Array(20).fill(0).map((_, k) => (
      <line
        key={k}
        x1={0}
        y1={-10}
        x2={0}
        y2={-100}
        stroke={C.white}
        strokeWidth={3}
        transform={`translate(0 100) rotate(${k * 18})`}
        opacity={0.6}
      />
    ))}
    <g opacity={rayos}>
      {[0, 1, 2].map((k) => (
        <circle
          key={k}
          cx={-90 + k * 90}
          cy={100}
          r={70}
          fill="none"
          stroke={COLORES[k]}
          strokeWidth={8}
        />
      ))}
    </g>
  </g>
);

// A. Gancho: tres ruedas escondidas
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.fuera], [1.08, 1])}>
        <Candado x={540} y={860} s={1.5} abierto={0} rayos={aparece(t, 1.0)} />
        <Texto x={540} y={1360} color={C.yellow} size={60} op={aparece(t, 1.1)}>
          x3
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.cyan} />
    </>
  );
};

// B. Por fuera una rueda; por dentro tres discos con muesca
export const Dentro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = aparece(t, T.discos);
  return (
    <Lienzo zoom={interpolate(t, [T.fuera, T.dientes], [1, 1.03])}>
      <Mecanismo
        t={t}
        ops={[d, aparece(t, T.discos + 0.3), aparece(t, T.discos + 0.6)]}
        brillo={aparece(t, T.muesca) * (0.5 + 0.5 * Math.sin(t * 6))}
      />
      <Texto
        x={540}
        y={1340}
        color={C.yellow}
        size={40}
        op={aparece(t, T.muesca)}
      >
        cada disco tiene una muesca
      </Texto>
    </Lienzo>
  );
};

// C. Dientes: arrastre en cadena, como un tren
export const Arrastre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dientes, T.derecha], [1, 1.03])}>
      <Mecanismo t={t} dientes={aparece(t, T.medio)} />
      <Texto
        x={540}
        y={1340}
        color={C.white}
        size={40}
        op={aparece(t, T.dientes)}
      >
        cada disco engancha al siguiente
      </Texto>
      <Texto x={540} y={1420} color={C.cyan} size={40} op={aparece(t, T.tren)}>
        como un tren con vagones
      </Texto>
    </Lienzo>
  );
};

// D. La combinación: derecha, izquierda, derecha
export const Combinacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const paso = t < T.izquierda ? 0 : t < T.final ? 1 : 2;
  return (
    <Lienzo zoom={1}>
      <Mecanismo t={t} />
      {(
        [
          ["1. derecha: lejano", C.orange],
          ["2. izquierda: medio", C.yellow],
          ["3. derecha: cercano", C.cyan],
        ] as const
      ).map(([txt, col], k) => (
        <Texto
          key={txt}
          x={540}
          y={1320 + k * 70}
          color={col}
          size={40}
          op={k === paso ? 1 : k < paso ? 0.45 : 0.15}
        >
          {txt}
        </Texto>
      ))}
    </Lienzo>
  );
};

// E. Muescas alineadas: cae la barra y se abre
export const Abre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const caida = interpolate(t, [T.barra, T.barra + 0.4], [0, 1], clamp);
  const abierto = interpolate(t, [T.abre, T.abre + 0.5], [0, 1], suave);
  const vista = interpolate(t, [T.abre - 0.3, T.abre + 0.2], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.alineadas, T.tres], [1, 1.04])}>
        <g opacity={1 - vista}>
          <Mecanismo t={t} brillo={aparece(t, T.alineadas)} caida={caida} />
          <Texto
            x={540}
            y={1340}
            color={C.yellow}
            size={44}
            op={aparece(t, T.alineadas)}
          >
            muescas alineadas
          </Texto>
        </g>
        <g opacity={vista}>
          <Candado x={540} y={920} s={1.5} abierto={abierto} />
          <Texto x={540} y={1440} color={C.yellow} size={70}>
            ¡clic!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.abre} color={C.yellow} />
    </>
  );
};

// F. Cierre: tres discos, una rueda
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tres, T.fin + 0.5], [1, 1.05])}>
      <Tarjeta x={190} y={640} w={700} h={460}>
        {[0, 1, 2].map((k) => (
          <Disco
            key={k}
            x={340 + k * 200}
            y={820}
            r={80}
            ang={t * 40 * (k % 2 ? -1 : 1)}
            color={COLORES[k]}
          />
        ))}
        <Texto x={540} y={1020} color={C.white} size={48}>
          3 discos, 1 rueda
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};
