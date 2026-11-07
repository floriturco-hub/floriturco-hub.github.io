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

// Instantes clave (s) de public/audio/lentes3d/narracion.wav (voz x1,12), sacados con Whisper
export const T = {
  cerebro: 1.92,
  dos: 3.94,
  noventa: 7.38,
  arruinaban: 10.82,
  polarizada: 12.56,
  onda: 16.44,
  gira: 18.34,
  derecha: 22.2,
  proyector: 24.24,
  alterna: 25.54,
  cientos: 27.8,
  filtro: 30.58,
  contrario: 35.6,
  plateada: 36.8,
  cristal: 40.54,
  ojo: 43.4,
  inclinar: 46.0,
  junta: 49.22,
  sale: 51.28,
  fin: 53.0,
};

const IZQ = "#E8703C";
const DER = "#08D8E8";

// Cubo en perspectiva simple, desplazado según el ojo
const Cubo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly dx?: number;
  readonly color?: string;
  readonly op?: number;
}> = ({ x, y, s, dx = 0, color = C.yellow, op = 1 }) => (
  <g opacity={op} transform={`translate(${x} ${y}) scale(${s})`}>
    <polygon
      points={`${-60 + dx},-20 ${40 + dx},-20 ${40},80 ${-60},80`}
      fill={color}
      opacity={0.9}
    />
    <polygon
      points={`${-60 + dx},-20 ${-20 + dx * 1.4},-60 ${80 + dx * 1.4},-60 ${40 + dx},-20`}
      fill={color}
      opacity={0.6}
    />
    <polygon
      points={`${40 + dx},-20 ${80 + dx * 1.4},-60 ${80 + dx * 0.4},40 ${40},80`}
      fill={color}
      opacity={0.4}
    />
  </g>
);

// Ojo esquemático
const Ojo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly color: string;
}> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -90 0 Q 0 -70 90 0 Q 0 70 -90 0 Z" fill="#E8E6F0" />
    <circle r={34} fill={color} />
    <circle r={14} fill="#05040C" />
  </g>
);

// Lentes: color de cada cristal y rotación
const Lentes: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly izq: string;
  readonly der: string;
  readonly rot?: number;
  readonly flechas?: number;
  readonly t?: number;
}> = ({ x, y, s, izq, der, rot = 0, flechas = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={-300}
      y={-80}
      width={250}
      height={160}
      rx={50}
      fill={izq}
      opacity={0.55}
      stroke="#2A2440"
      strokeWidth={16}
    />
    <rect
      x={50}
      y={-80}
      width={250}
      height={160}
      rx={50}
      fill={der}
      opacity={0.55}
      stroke="#2A2440"
      strokeWidth={16}
    />
    <path
      d="M -50 -20 Q 0 -50 50 -20"
      stroke="#2A2440"
      strokeWidth={16}
      fill="none"
    />
    <g opacity={flechas}>
      <Giro x={-175} y={0} r={50} sentido={1} color={IZQ} t={t} />
      <Giro x={175} y={0} r={50} sentido={-1} color={DER} t={t} />
    </g>
  </g>
);

// Flecha que gira (polarización circular)
const Giro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly sentido: number;
  readonly color: string;
  readonly t: number;
  readonly op?: number;
}> = ({ x, y, r, sentido, color, t, op = 1 }) => {
  const a = t * 4 * sentido;
  return (
    <g opacity={op} transform={`translate(${x} ${y})`}>
      <circle
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        opacity={0.4}
        strokeDasharray="10 8"
      />
      <line
        x1={0}
        y1={0}
        x2={Math.cos(a) * r}
        y2={Math.sin(a) * r}
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <circle cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={12} fill={color} />
    </g>
  );
};

// A. Gancho: cada ojo ve otra película
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cerebro], [1.08, 1])}>
        <Ojo x={330} y={560} color={IZQ} />
        <Ojo x={750} y={560} color={DER} />
        <Tarjeta x={130} y={720} w={400} h={400} op={aparece(t, 0.6)}>
          <Cubo x={330} y={930} s={1.5} dx={-30} color={IZQ} />
        </Tarjeta>
        <Tarjeta x={550} y={720} w={400} h={400} op={aparece(t, 0.9)}>
          <Cubo x={750} y={930} s={1.5} dx={30} color={DER} />
        </Tarjeta>
        <Texto x={330} y={1200} color={IZQ} size={44} op={aparece(t, 0.6)}>
          izquierdo
        </Texto>
        <Texto x={750} y={1200} color={DER} size={44} op={aparece(t, 0.9)}>
          derecho
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} />
    </>
  );
};

// B. El cerebro necesita dos imágenes; los lentes rojo y azul arruinaban el color
export const Antes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const viejo = aparece(t, T.noventa);
  const gris = aparece(t, T.arruinaban);
  return (
    <Lienzo zoom={interpolate(t, [T.cerebro, T.polarizada], [1, 1.04])}>
      <g opacity={1 - viejo}>
        <Cubo x={480} y={860} s={2.4} dx={-30} color={IZQ} op={0.7} />
        <Cubo
          x={600}
          y={860}
          s={2.4}
          dx={30}
          color={DER}
          op={aparece(t, T.dos) * 0.7}
        />
        <Texto
          x={540}
          y={1200}
          color={C.white}
          size={44}
          op={aparece(t, T.dos)}
        >
          dos imágenes distintas
        </Texto>
      </g>
      <g opacity={viejo}>
        <Lentes x={540} y={640} s={1.3} izq="#E8414F" der="#3A7AE8" />
        <Texto x={540} y={500} color={C.grey} size={40}>
          años 90
        </Texto>
        <rect
          x={190}
          y={860}
          width={700}
          height={360}
          rx={20}
          fill={gris > 0.5 ? "#6A6080" : "#3A6A4A"}
        />
        <circle
          cx={360}
          cy={1000}
          r={70}
          fill={gris > 0.5 ? "#8A8098" : C.yellow}
        />
        <rect
          x={500}
          y={940}
          width={300}
          height={200}
          rx={20}
          fill={gris > 0.5 ? "#5A5070" : C.red}
        />
        <Texto x={540} y={1320} color={C.red} size={44} op={gris}>
          adiós a los colores
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Luz polarizada: la vibración gira como un sacacorchos
export const Polarizada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const helice = aparece(t, T.gira);
  const onda = new Array(121)
    .fill(0)
    .map(
      (_, k) =>
        `${k === 0 ? "M" : "L"} ${140 + k * 6.7} ${760 + Math.sin(k * 0.25 - t * 6) * 90}`,
    )
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.polarizada, T.proyector], [1, 1.03])}>
      <Texto
        x={540}
        y={470}
        color={C.yellow}
        size={52}
        op={aparece(t, T.polarizada)}
      >
        luz polarizada
      </Texto>
      <path
        d={onda}
        stroke={C.yellow}
        strokeWidth={8}
        fill="none"
        opacity={aparece(t, T.polarizada + 0.6) * (1 - helice * 0.7)}
      />
      <g opacity={helice}>
        <Giro x={330} y={1100} r={110} sentido={1} color={IZQ} t={t} />
        <Giro x={750} y={1100} r={110} sentido={-1} color={DER} t={t} />
        <Texto x={330} y={1290} color={IZQ} size={36}>
          gira a un lado
        </Texto>
        <Texto
          x={750}
          y={1290}
          color={DER}
          size={36}
          op={aparece(t, T.derecha)}
        >
          gira al otro
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Proyector: alterna izquierda y derecha 144 veces por segundo
export const Proyector: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lado = Math.floor(t * 4) % 2;
  const col = lado ? DER : IZQ;
  return (
    <Lienzo zoom={interpolate(t, [T.proyector, T.plateada], [1, 1.03])}>
      <rect
        x={140}
        y={760}
        width={280}
        height={180}
        rx={24}
        fill="#3A3A4A"
        stroke={C.grey}
        strokeWidth={8}
      />
      <circle
        cx={420}
        cy={850}
        r={60}
        fill="#1A1A2A"
        stroke={C.grey}
        strokeWidth={8}
      />
      <g opacity={aparece(t, T.filtro)}>
        <rect
          x={500}
          y={770}
          width={40}
          height={160}
          rx={10}
          fill={col}
          opacity={0.8}
        />
        <Texto x={520} y={740} color={C.white} size={28}>
          filtro
        </Texto>
      </g>
      <polygon
        points="540,820 960,640 960,1060 540,880"
        fill={col}
        opacity={0.18 * aparece(t, T.alterna)}
      />
      <Tarjeta x={640} y={720} w={280} h={260} op={aparece(t, T.alterna)}>
        <Texto x={780} y={880} color={col} size={120}>
          {lado ? "D" : "I"}
        </Texto>
      </Tarjeta>
      <Giro
        x={780}
        y={1110}
        r={60}
        sentido={lado ? -1 : 1}
        color={col}
        t={t}
        op={aparece(t, T.filtro)}
      />
      <Tarjeta x={240} y={1220} w={600} h={150} op={aparece(t, T.cientos)}>
        <Texto x={540} y={1318} color={C.yellow} size={56}>
          {`${Math.round(interpolate(t, [T.cientos, T.cientos + 1.2], [0, 144], clamp))} por segundo`}
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// E. Pantalla plateada y lentes que filtran cada giro
export const Filtran: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.plateada, T.inclinar], [1, 1.03])}>
      <g opacity={aparece(t, T.plateada)}>
        <rect x={140} y={420} width={800} height={260} rx={10} fill="#B8B8C8" />
        <rect
          x={140}
          y={420}
          width={800}
          height={260}
          rx={10}
          fill="url(#brilloP)"
          opacity={0.6}
        />
        <defs>
          <linearGradient id="brilloP" x1="0" x2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
            <stop
              offset={((t * 0.3) % 1).toFixed(2)}
              stopColor="#FFFFFF"
              stopOpacity={0.8}
            />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Texto x={540} y={740} color={C.grey} size={34}>
          pantalla plateada
        </Texto>
      </g>
      <g opacity={aparece(t, T.cristal)}>
        <Lentes x={540} y={920} s={1.3} izq={IZQ} der={DER} flechas={1} t={t} />
      </g>
      <g opacity={aparece(t, T.ojo)}>
        <Ojo x={315} y={1170} color={IZQ} />
        <Ojo x={765} y={1170} color={DER} />
        <Texto x={315} y={1300} color={IZQ} size={36}>
          solo imagen I
        </Texto>
        <Texto x={765} y={1300} color={DER} size={36}>
          solo imagen D
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Puedes inclinar la cabeza
export const Inclinar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rot = 18 * Math.sin((t - T.inclinar) * 2.2) * aparece(t, T.inclinar);
  return (
    <Lienzo zoom={interpolate(t, [T.inclinar, T.junta], [1, 1.03])}>
      <Lentes
        x={540}
        y={860}
        s={1.4}
        izq={IZQ}
        der={DER}
        rot={rot}
        flechas={1}
        t={t}
      />
      <Texto
        x={540}
        y={1160}
        color={C.cyan}
        size={48}
        op={aparece(t, T.inclinar + 1)}
      >
        el efecto sigue
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: el cerebro junta las imágenes y la película sale de la pantalla
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.sale, T.fin], [0, 1], suave);
  const junta = interpolate(t, [T.junta, T.junta + 1], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.junta, T.fin + 0.5], [1, 1.05])}>
      <rect
        x={190}
        y={560}
        width={700}
        height={500}
        rx={10}
        fill="#B8B8C8"
        opacity={0.25}
      />
      <Cubo
        x={540 - 60 * (1 - junta)}
        y={800}
        s={2 + sale * 1.6}
        dx={-30 * (1 - junta)}
        color={junta > 0.95 ? C.yellow : IZQ}
        op={0.8}
      />
      <Cubo
        x={540 + 60 * (1 - junta)}
        y={800}
        s={2 + sale * 1.6}
        dx={30 * (1 - junta)}
        color={junta > 0.95 ? C.yellow : DER}
        op={junta > 0.95 ? 0 : 0.6}
      />
      <text
        x={540}
        y={1300}
        textAnchor="middle"
        fill={C.yellow}
        fontFamily={mono}
        fontSize={90}
        fontWeight={700}
        opacity={aparece(t, T.sale)}
      >
        3D
      </text>
    </Lienzo>
  );
};
