import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, mono, useT } from "../theme";

// Instantes clave (s) de public/audio/lluviacerebro/narracion.wav (voz x1,10), sacados con Whisper
export const T = {
  porque: 2.06,
  clave: 4.68,
  constante: 5.88,
  sorpresas: 7.54,
  vigilar: 8.62,
  golpe: 11.98,
  voz: 12.8,
  puerta: 13.48,
  despertarte: 14.32,
  rosa: 17.4,
  frecuencias: 19.76,
  agudos: 21.26,
  manta: 22.54,
  alerta: 25.48,
  estudio: 27.08,
  pulsos: 29.44,
  ondas: 33.26,
  profundo: 35.94,
  recordaban: 37.72,
  junta: 40.32,
  lofi: 43.6,
  busca: 45.14,
  youtube: 46.52,
  frase: 47.08,
  fin: 48.9,
};

const ROSA = "#E87AB8";
const LLUVIA = "#9AA8D8";

// Cerebro estilizado; alerta 0..1 lo tiñe de rojo, calma de verde
const Cerebro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly alerta?: number;
  readonly calma?: number;
}> = ({ x, y, s, alerta = 0, calma = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -200 20 C -220 -110 -110 -190 0 -180 C 130 -190 230 -110 210 10 C 230 90 150 150 60 140 C 20 180 -60 180 -90 140 C -170 150 -230 100 -200 20 Z"
      fill={calma > 0.5 ? "#2A4A3A" : "#3A2A5A"}
      stroke={alerta > 0.5 ? C.red : calma > 0.5 ? "#5AC878" : ROSA}
      strokeWidth={10}
    />
    {[
      "M -150 -60 q 40 -40 80 0 q 40 40 80 0",
      "M -170 30 q 50 -40 100 0 q 50 40 100 0 q 40 -30 80 0",
      "M -60 -130 q 30 30 60 0 q 30 -30 60 0",
      "M -120 100 q 40 -30 80 0 q 40 30 80 0",
    ].map((d, k) => (
      <path
        key={k}
        d={d}
        stroke={alerta > 0.5 ? C.red : calma > 0.5 ? "#5AC878" : ROSA}
        strokeWidth={8}
        fill="none"
        opacity={0.6}
        strokeLinecap="round"
      />
    ))}
    <circle r={230} fill={C.red} opacity={alerta * 0.15} />
  </g>
);

// Nube que llueve
const NubeLluvia: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly op?: number;
}> = ({ x, y, s, t, op = 1 }) => (
  <g opacity={op} transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(16).fill(0).map((_, k) => {
      const u = (t * 1.4 + random(`ll${k}`)) % 1;
      const lx = -150 + random(`lx${k}`) * 300;
      return (
        <line
          key={k}
          x1={lx}
          y1={40 + u * 260}
          x2={lx - 6}
          y2={70 + u * 260}
          stroke={LLUVIA}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={1 - u}
        />
      );
    })}
    {[
      [-110, 10, 70],
      [-30, -30, 95],
      [80, -5, 80],
      [150, 25, 60],
      [10, 30, 90],
    ].map(([cx, cy, r], k) => (
      <circle key={k} cx={cx} cy={cy} r={r} fill="#5A5A7A" />
    ))}
  </g>
);

// A. Gancho: la lluvia hackea tu cerebro
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.porque], [1.08, 1])}>
        <Cerebro x={540} y={1000} s={1.6} calma={aparece(t, 1.0)} />
        <NubeLluvia x={540} y={520} s={1.4} t={t} />
        {[0, 1, 2].map((k) => {
          const u = (t * 0.8 + k / 3) % 1;
          return (
            <Texto
              key={k}
              x={760 + u * 80}
              y={900 - u * 160}
              color={C.white}
              size={40 + u * 24}
              op={aparece(t, 1.0) * Math.sin(u * Math.PI)}
            >
              z
            </Texto>
          );
        })}
      </Lienzo>
      <Flash t={t} d={1.0} color={LLUVIA} />
    </>
  );
};

// B. Ruido constante y parejo, sin sorpresas
export const Constante: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.vigilar], [1, 1.03])}>
      <NubeLluvia x={540} y={520} s={1.3} t={t} />
      <Tarjeta x={100} y={880} w={880} h={300} op={aparece(t, T.constante)}>
        <path
          d={`M 140 1030 ${new Array(80)
            .fill(0)
            .map(
              (_, k) =>
                `L ${140 + k * 10} ${1030 + (random(`cn${k}${Math.floor(t * 12)}`) - 0.5) * 70}`,
            )
            .join(" ")}`}
          stroke={LLUVIA}
          strokeWidth={4}
          fill="none"
        />
      </Tarjeta>
      <Texto
        x={540}
        y={1280}
        color={LLUVIA}
        size={46}
        op={aparece(t, T.constante)}
      >
        constante y parejo
      </Texto>
      <Texto
        x={540}
        y={1360}
        color={C.yellow}
        size={44}
        op={aparece(t, T.sorpresas)}
      >
        sin sorpresas
      </Texto>
    </Lienzo>
  );
};

// C. El cerebro vigila los sonidos repentinos
export const Alerta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sonidos = [
    ["¡pum!", T.golpe, 240, 520],
    ["¡hola!", T.voz, 820, 600],
    ["¡clac!", T.puerta, 300, 1300],
  ] as const;
  const alerta = sonidos.reduce(
    (a, [, d]) =>
      Math.max(a, interpolate(t, [d, d + 0.15, d + 0.9], [0, 1, 0.3], clamp)),
    0,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.vigilar, T.rosa], [1, 1.03])}>
      <Cerebro x={540} y={920} s={1.3} alerta={alerta} />
      <g opacity={aparece(t, T.vigilar)}>
        {[0, 1, 2].map((k) => (
          <circle
            key={k}
            cx={540}
            cy={920}
            r={330 + ((t * 120 + k * 80) % 240)}
            fill="none"
            stroke={ROSA}
            strokeWidth={4}
            opacity={0.4 * (1 - ((t * 120 + k * 80) % 240) / 240)}
          />
        ))}
      </g>
      {sonidos.map(([txt, d, x, y]) => (
        <g
          key={txt}
          opacity={aparece(t, d)}
          transform={`translate(${x} ${y}) scale(${interpolate(t, [d, d + 0.2], [1.5, 1], clamp)})`}
        >
          <rect x={-110} y={-56} width={220} height={84} rx={24} fill={C.red} />
          <Texto x={0} y={0} color={C.white} size={44}>
            {txt}
          </Texto>
        </g>
      ))}
      <Texto
        x={540}
        y={1450}
        color={C.red}
        size={40}
        op={aparece(t, T.despertarte)}
      >
        te despiertan o te distraen
      </Texto>
    </Lienzo>
  );
};

// D. Ruido rosa: espectro y manta que tapa los picos
export const Rosa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const manta = interpolate(t, [T.manta, T.manta + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.rosa, T.estudio], [1, 1.03])}>
      <Texto x={540} y={440} color={ROSA} size={58} op={aparece(t, T.rosa)}>
        ruido rosa
      </Texto>
      <Tarjeta x={100} y={520} w={880} h={420} op={aparece(t, T.frecuencias)}>
        {new Array(22).fill(0).map((_, k) => {
          const h =
            (300 / Math.sqrt(1 + k * 0.5)) * (0.9 + 0.1 * Math.sin(t * 6 + k));
          return (
            <rect
              key={k}
              x={150 + k * 37}
              y={890 - h}
              width={26}
              height={h}
              rx={6}
              fill={ROSA}
              opacity={0.85}
            />
          );
        })}
        <Texto
          x={180}
          y={920}
          color={C.grey}
          size={24}
          anchor="start"
          op={aparece(t, T.agudos)}
        >
          graves
        </Texto>
        <Texto
          x={930}
          y={920}
          color={C.grey}
          size={24}
          anchor="end"
          op={aparece(t, T.agudos)}
        >
          agudos
        </Texto>
      </Tarjeta>
      <Tarjeta x={100} y={980} w={880} h={340} op={aparece(t, T.manta)}>
        {[300, 540, 780].map((x, k) => (
          <path
            key={x}
            d={`M ${x - 26} 1280 L ${x} ${1040 + k * 30} L ${x + 26} 1280`}
            fill={C.red}
            opacity={0.85}
          />
        ))}
        <path
          d={`M 140 1280 ${new Array(38)
            .fill(0)
            .map(
              (_, k) =>
                `L ${140 + k * 21} ${1280 - interpolate(manta, [0, 1], [40, 250]) - 16 * random(`mn${k}${Math.floor(t * 8)}`)}`,
            )
            .join(" ")} L 940 1280 Z`}
          fill={ROSA}
          opacity={0.6}
        />
      </Tarjeta>
      <Texto
        x={540}
        y={1420}
        color="#5AC878"
        size={42}
        op={aparece(t, T.alerta)}
      >
        el cerebro deja la alerta
      </Texto>
    </Lienzo>
  );
};

// E. Estudio 2017: pulsos de ruido rosa sincronizados con ondas lentas
export const Estudio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const onda = new Array(121)
    .fill(0)
    .map(
      (_, k) =>
        `${k === 0 ? "M" : "L"} ${140 + k * 6.7} ${980 + 90 * Math.sin(k * 0.13 - t * 1.6)}`,
    )
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.estudio, T.junta], [1, 1.03])}>
      <Tarjeta x={340} y={300} w={400} h={140} op={aparece(t, T.estudio)}>
        <Texto x={540} y={392} color={C.yellow} size={66}>
          2017
        </Texto>
      </Tarjeta>
      {/* persona durmiendo */}
      <g opacity={aparece(t, T.estudio + 0.5)}>
        <rect x={180} y={600} width={720} height={120} rx={30} fill="#3A3460" />
        <rect x={200} y={560} width={160} height={70} rx={30} fill="#E8E6F0" />
        <circle cx={280} cy={560} r={48} fill="#E8B8A0" />
        <path
          d="M 340 600 Q 600 540 880 600 L 880 650 L 340 650 Z"
          fill="#5A7AB8"
        />
      </g>
      <Tarjeta x={100} y={830} w={880} h={300} op={aparece(t, T.ondas - 1)}>
        <path d={onda} stroke={C.cyan} strokeWidth={6} fill="none" />
        {[0, 1, 2].map((k) => {
          // crestas de la onda: sin(k*0.13 - 1,6 t) = -1, separadas 2π/0,13 · 6,7 ≈ 323,8 px
          const periodo = ((2 * Math.PI) / 0.13) * 6.7;
          const fase0 = (6.7 * (1.6 * t - Math.PI / 2)) / 0.13;
          const x =
            140 + (((fase0 % periodo) + periodo) % periodo) + k * periodo;
          return x > 944 ? null : (
            <rect
              key={k}
              x={x - 6}
              y={850}
              width={12}
              height={36}
              rx={6}
              fill={ROSA}
              opacity={aparece(t, T.pulsos)}
            />
          );
        })}
      </Tarjeta>
      <Texto x={540} y={1210} color={C.cyan} size={38} op={aparece(t, T.ondas)}>
        pulsos sincronizados con las ondas lentas
      </Texto>
      <Texto
        x={540}
        y={1300}
        color={C.yellow}
        size={44}
        op={aparece(t, T.profundo)}
      >
        + sueño profundo
      </Texto>
      <Texto
        x={540}
        y={1380}
        color={C.yellow}
        size={44}
        op={aparece(t, T.recordaban)}
      >
        + memoria al día siguiente
      </Texto>
    </Lienzo>
  );
};

// F. Lluvia + música lenta sin letra = lo-fi
export const Lofi: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const une = interpolate(t, [T.junta + 0.5, T.lofi], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.junta, T.busca], [1, 1.03])}>
      <NubeLluvia
        x={540 - 240 * (1 - une)}
        y={620}
        s={0.9}
        t={t}
        op={1 - une * 0.6}
      />
      {[0, 1, 2, 3].map((k) => {
        const u = (t * 0.5 + k / 4) % 1;
        return (
          <text
            key={k}
            x={540 + 240 * (1 - une) + (k - 1.5) * 60}
            y={760 - u * 220}
            fill={[C.cyan, ROSA, C.yellow][k % 3]}
            opacity={Math.sin(u * Math.PI) * (1 - une * 0.5)}
            fontSize={60}
            fontFamily={mono}
            fontWeight={700}
          >
            {["♪", "♫", "♩"][k % 3]}
          </text>
        );
      })}
      <g opacity={une} transform={`translate(540 1000) rotate(${t * 50})`}>
        <circle r={200} fill="#0E0C14" />
        {[170, 140, 110].map((r) => (
          <circle key={r} r={r} fill="none" stroke="#2A2632" strokeWidth={3} />
        ))}
        <circle r={60} fill={ROSA} />
      </g>
      <Texto
        x={540}
        y={1340}
        color={C.yellow}
        size={64}
        op={aparece(t, T.lofi)}
      >
        = lo-fi
      </Texto>
    </Lienzo>
  );
};

// G. Busca en YouTube: Frecuencia Cero LoFi
const BUSQUEDA = "Frecuencia Cero LoFi";
export const Busca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.round(
    interpolate(t, [T.frase - 0.2, T.frase + 1.4], [0, BUSQUEDA.length], clamp),
  );
  const cursor = Math.floor(t * 2.5) % 2 === 0;
  return (
    <Lienzo zoom={interpolate(t, [T.busca, T.fin + 0.5], [1, 1.04])}>
      <NubeLluvia x={540} y={480} s={0.8} t={t} op={0.6} />
      <Texto x={540} y={820} color={C.white} size={44} op={aparece(t, T.busca)}>
        busca en YouTube
      </Texto>
      <g opacity={aparece(t, T.youtube - 0.3)}>
        <rect x={90} y={880} width={900} height={120} rx={60} fill="#F0EEF8" />
        <circle
          cx={170}
          cy={940}
          r={22}
          fill="none"
          stroke="#5A5670"
          strokeWidth={7}
        />
        <line
          x1={186}
          y1={956}
          x2={206}
          y2={976}
          stroke="#5A5670"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <text
          x={240}
          y={958}
          fill="#1A1636"
          fontFamily={mono}
          fontSize={46}
          fontWeight={700}
        >
          {BUSQUEDA.slice(0, n)}
          {cursor ? "|" : " "}
        </text>
      </g>
      <g
        opacity={aparece(t, T.frase + 1.6)}
        transform={`translate(0 ${10 * Math.sin(t * 4)})`}
      >
        <path
          d="M 540 1060 L 540 1180 M 490 1130 L 540 1180 L 590 1130"
          stroke={C.yellow}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </Lienzo>
  );
};
