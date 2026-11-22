import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, mono, useT } from "../theme";

// Instantes clave (s) de public/audio/pilas/narracion.wav (voz x1,08), sacados con Whisper
export const T = {
  deja: 2.42,
  tac: 5.72,
  gastada: 7.96,
  dentro: 10.34,
  gel: 12.2,
  blando: 15.88,
  arena: 20.06,
  usar: 21.5,
  oxido: 22.52,
  red: 25.76,
  amortigua: 30.6,
  rebota: 34.38,
  princeton: 35.94,
  mitad: 41.02,
  cambia: 44.24,
  usada: 45.78,
  trabajo: 50.18,
  fin: 52.6,
};

const MESA = 1180;

// Altura de caída con o sin rebote (u: segundos desde que se suelta)
const caida = (u: number, rebote: boolean) => {
  const g = 2600;
  const h0 = 420;
  const tc = Math.sqrt((2 * h0) / g);
  if (u < 0) return h0;
  if (u < tc) return h0 - 0.5 * g * u * u;
  if (!rebote) return 0;
  let v = g * tc * 0.55;
  let tt = u - tc;
  for (let k = 0; k < 4; k++) {
    const dur = (2 * v) / g;
    if (tt < dur) return v * tt - 0.5 * g * tt * tt;
    tt -= dur;
    v *= 0.5;
  }
  return 0;
};

// Pila AA de pie; y = base
const Pila: React.FC<{
  readonly x: number;
  readonly base: number;
  readonly s?: number;
  readonly color?: string;
  readonly rot?: number;
}> = ({ x, base, s = 1, color = C.orange, rot = 0 }) => (
  <g transform={`translate(${x} ${base}) rotate(${rot}) scale(${s})`}>
    <rect x={-50} y={-260} width={100} height={260} rx={14} fill={color} />
    <rect x={-50} y={-260} width={100} height={70} rx={14} fill="#2A2440" />
    <rect x={-18} y={-280} width={36} height={22} rx={6} fill="#C8C4D8" />
    <text
      x={0}
      y={-110}
      textAnchor="middle"
      fontSize={40}
      fontFamily={mono}
      fontWeight={700}
      fill="#2A2440"
    >
      AA
    </text>
  </g>
);

// Corte de la pila: núcleo de zinc en gel o red de óxido
const Corte: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly oxido: number;
  readonly t: number;
}> = ({ x, y, s, oxido, t }) => {
  const pts = new Array(24)
    .fill(0)
    .map(
      (_, k) =>
        [
          (random(`zx${k}`) - 0.5) * 140,
          (random(`zy${k}`) - 0.5) * 460,
        ] as const,
    );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x={-130}
        y={-300}
        width={260}
        height={600}
        rx={30}
        fill="#3A3A4A"
        stroke="#8C88A8"
        strokeWidth={8}
      />
      <rect x={-110} y={-280} width={220} height={560} rx={24} fill="#2A2440" />
      <rect
        x={-85}
        y={-250}
        width={170}
        height={500}
        rx={20}
        fill={oxido > 0.5 ? "#4A4660" : "#5A7AA8"}
        opacity={0.6}
      />
      {oxido > 0
        ? pts.map(([ax, ay], k) => {
            const [bx, by] = pts[(k + 5) % pts.length];
            return (
              <line
                key={`l${k}`}
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke={C.white}
                strokeWidth={5}
                opacity={oxido * 0.7}
              />
            );
          })
        : null}
      {pts.map(([px, py], k) => (
        <circle
          key={k}
          cx={px + (1 - oxido) * 4 * Math.sin(t * 3 + k)}
          cy={py}
          r={14}
          fill={oxido > random(`zo${k}`) ? "#E8E6F0" : "#8C88A8"}
        />
      ))}
    </g>
  );
};

// A. Gancho: la gastada rebota como pelota
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.deja], [1.08, 1])}>
        <rect x={60} y={MESA} width={960} height={30} rx={8} fill="#8A6A4A" />
        <Pila x={330} base={MESA - caida(t - 0.1, false)} color="#5AC878" />
        <Pila x={750} base={MESA - caida(t - 0.1, true)} color={C.red} />
        <Texto x={330} y={1320} color="#5AC878" size={40} op={aparece(t, 0.8)}>
          nueva
        </Texto>
        <Texto x={750} y={1320} color={C.red} size={40} op={aparece(t, 0.8)}>
          gastada
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.68} />
    </>
  );
};

// B. Nueva: tac. Gastada: rebota.
export const Caida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.deja, T.dentro], [1, 1.03])}>
      <rect x={60} y={MESA} width={960} height={30} rx={8} fill="#8A6A4A" />
      <Pila
        x={330}
        base={MESA - caida(t - T.deja - 0.3, false)}
        color="#5AC878"
      />
      <Pila x={750} base={MESA - caida(t - T.gastada, true)} color={C.red} />
      <Texto x={330} y={1320} color="#5AC878" size={46} op={aparece(t, T.tac)}>
        ¡tac!
      </Texto>
      <Texto
        x={750}
        y={1320}
        color={C.red}
        size={46}
        op={aparece(t, T.gastada + 0.4)}
      >
        ¡boing!
      </Texto>
    </Lienzo>
  );
};

// C. Por dentro: gel con polvo de zinc, blando como una bolsa de arena
export const Gel: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.usar], [1, 1.03])}>
      <Corte x={330} y={860} s={1} oxido={0} t={t} />
      <g opacity={aparece(t, T.gel)}>
        <Texto x={760} y={660} color="#7AA8E8" size={40}>
          gel
        </Texto>
        <Texto x={760} y={720} color="#C8C4D8" size={40}>
          + polvo de zinc
        </Texto>
      </g>
      <g opacity={aparece(t, T.arena)} transform="translate(760 960)">
        <path
          d="M -110 100 Q -130 -40 -60 -80 L 60 -80 Q 130 -40 110 100 Z"
          fill="#C8A060"
        />
        <rect x={-40} y={-110} width={80} height={30} rx={8} fill="#8A6A3A" />
        <Texto x={0} y={180} color="#C8A060" size={34}>
          bolsa de arena
        </Texto>
      </g>
      <Texto
        x={540}
        y={1340}
        color={C.cyan}
        size={42}
        op={aparece(t, T.blando)}
      >
        blando: absorbe el golpe
      </Texto>
    </Lienzo>
  );
};

// D. Al gastarse: óxido de zinc forma una red rígida y la pila rebota
export const Oxido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ox = interpolate(t, [T.oxido, T.red + 1], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.usar, T.princeton], [1, 1.03])}>
      <Corte x={330} y={860} s={1} oxido={ox} t={t} />
      <Texto x={760} y={660} color="#E8E6F0" size={40} op={aparece(t, T.oxido)}>
        óxido de zinc
      </Texto>
      <Texto x={760} y={730} color={C.grey} size={34} op={aparece(t, T.red)}>
        red sólida, rígida
      </Texto>
      <g opacity={aparece(t, T.rebota - 0.4)}>
        <rect x={620} y={1180} width={280} height={20} rx={6} fill="#8A6A4A" />
        <Pila
          x={760}
          base={1180 - caida((t - T.rebota + 0.4) % 2.2, true) * 0.5}
          s={0.55}
          color={C.red}
        />
      </g>
      <Texto
        x={540}
        y={1340}
        color={C.red}
        size={42}
        op={aparece(t, T.amortigua)}
      >
        ya no amortigua: rebota
      </Texto>
    </Lienzo>
  );
};

// E. Princeton 2015: el rebote crece hasta la mitad y luego se estanca
export const Grafica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x0 = 200;
  const y0 = 1180;
  const w = 680;
  const h = 460;
  const prog = interpolate(t, [T.mitad - 0.5, T.cambia + 0.8], [0, 1], suave);
  const curva = new Array(41)
    .fill(0)
    .map((_, k) => {
      const u = k / 40;
      const v =
        u < 0.5 ? Math.sin((u / 0.5) * (Math.PI / 2)) : 1 + (u - 0.5) * 0.08;
      return `${k === 0 ? "M" : "L"} ${x0 + u * w} ${y0 - v * h * 0.9}`;
    })
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.princeton, T.trabajo], [1, 1.03])}>
      <Texto
        x={540}
        y={470}
        color={C.yellow}
        size={44}
        op={aparece(t, T.princeton)}
      >
        Princeton, 2015
      </Texto>
      <Tarjeta
        x={120}
        y={560}
        w={840}
        h={720}
        op={aparece(t, T.princeton + 0.5)}
      >
        <line
          x1={x0}
          y1={y0}
          x2={x0 + w}
          y2={y0}
          stroke={C.grey}
          strokeWidth={4}
        />
        <line
          x1={x0}
          y1={y0}
          x2={x0}
          y2={y0 - h - 20}
          stroke={C.grey}
          strokeWidth={4}
        />
        <Texto
          x={x0 + 10}
          y={y0 - h - 40}
          color={C.grey}
          size={26}
          anchor="start"
        >
          altura del rebote
        </Texto>
        <Texto x={x0 + w} y={y0 + 50} color={C.grey} size={26} anchor="end">
          carga usada
        </Texto>
        <Texto x={x0 + w / 2} y={y0 + 50} color={C.grey} size={26}>
          50 %
        </Texto>
        <line
          x1={x0 + w / 2}
          y1={y0}
          x2={x0 + w / 2}
          y2={y0 - h}
          stroke={C.grey}
          strokeWidth={2}
          strokeDasharray="10 10"
        />
        <defs>
          <clipPath id="corteP">
            <rect x={x0} y={0} width={w * prog} height={1920} />
          </clipPath>
        </defs>
        <g clipPath="url(#corteP)">
          <path d={curva} stroke={C.orange} strokeWidth={10} fill="none" />
        </g>
      </Tarjeta>
      <Texto
        x={540}
        y={1400}
        color={C.white}
        size={38}
        op={aparece(t, T.usada)}
      >
        nueva o usada: sí. carga exacta: no
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: pila que rebota, pila que ya trabajó
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.trabajo, T.fin + 0.5], [1, 1.05])}>
      <rect x={160} y={MESA} width={760} height={30} rx={8} fill="#8A6A4A" />
      <Pila
        x={540}
        base={MESA - caida((t - T.trabajo) % 2.2, true)}
        color={C.red}
      />
      <Texto
        x={540}
        y={1340}
        color={C.yellow}
        size={52}
        op={aparece(t, T.trabajo + 0.6)}
      >
        ya trabajó
      </Texto>
    </Lienzo>
  );
};
