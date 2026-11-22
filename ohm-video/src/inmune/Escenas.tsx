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

// Instantes clave (s) de public/audio/inmune/narracion.wav (voz x1,10), sacados con Whisper
export const T = {
  primera: 2.18,
  sabe: 4.84,
  semanas: 5.9,
  anticuerpos: 8.96,
  llave: 11.22,
  enfermas: 12.56,
  gana: 14.44,
  memoria: 18.58,
  linfocitos: 19.88,
  decadas: 23.64,
  ganglios: 25.06,
  anos: 27.5,
  patrullando: 29.56,
  vuelve: 30.9,
  inmediato: 34.42,
  reconocen: 36.72,
  dias: 38.1,
  ejercito: 39.72,
  fuerte: 41.92,
  sintoma: 45.8,
  vacunas: 46.94,
  sin: 49.04,
  olvida: 50.64,
  fin: 52.8,
};

const VERDE = "#5AC878";

// Virus: esfera con espigas
export const Virus: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly t: number;
  readonly op?: number;
  readonly color?: string;
}> = ({ x, y, r, t, op = 1, color = C.red }) => (
  <g opacity={op} transform={`translate(${x} ${y}) rotate(${t * 20})`}>
    {new Array(10).fill(0).map((_, k) => (
      <g key={k} transform={`rotate(${k * 36})`}>
        <line
          x1={0}
          y1={-r}
          x2={0}
          y2={-r * 1.4}
          stroke={color}
          strokeWidth={r * 0.12}
        />
        <circle cx={0} cy={-r * 1.45} r={r * 0.14} fill={color} />
      </g>
    ))}
    <circle r={r} fill="#5A1E2E" stroke={color} strokeWidth={r * 0.1} />
    <circle
      cx={-r * 0.3}
      cy={-r * 0.2}
      r={r * 0.15}
      fill={color}
      opacity={0.5}
    />
    <circle
      cx={r * 0.35}
      cy={r * 0.25}
      r={r * 0.1}
      fill={color}
      opacity={0.5}
    />
  </g>
);

// Anticuerpo en forma de Y
export const Anticuerpo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly rot: number;
  readonly op?: number;
}> = ({ x, y, s, rot, op = 1 }) => (
  <g opacity={op} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M 0 40 L 0 0 L -26 -34 M 0 0 L 26 -34"
      stroke={C.cyan}
      strokeWidth={10}
      strokeLinecap="round"
      fill="none"
    />
  </g>
);

// Linfocito de memoria con la "foto" del virus dentro
const Celula: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly letra: string;
  readonly t: number;
  readonly op?: number;
}> = ({ x, y, letra, t, op = 1 }) => (
  <g opacity={op}>
    <circle
      cx={x}
      cy={y}
      r={130 + 4 * Math.sin(t * 3 + x)}
      fill="#2A3A6A"
      stroke={C.yellow}
      strokeWidth={8}
    />
    <Virus x={x} y={y + 10} r={34} t={t * 0.3} color={C.yellow} />
    <text
      x={x}
      y={y - 70}
      textAnchor="middle"
      fill={C.white}
      fontFamily={mono}
      fontSize={44}
      fontWeight={700}
    >
      {letra}
    </text>
  </g>
);

// A. Gancho: la lista negra
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sello = interpolate(t, [1.0, 1.2], [2, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.primera], [1.08, 1])}>
        <Tarjeta x={190} y={420} w={700} h={900}>
          <Texto x={540} y={520} color={C.white} size={52}>
            LISTA NEGRA
          </Texto>
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <Virus x={340} y={680 + k * 200} r={50} t={t + k} />
              <rect
                x={460}
                y={660 + k * 200}
                width={330}
                height={16}
                rx={8}
                fill={C.grey}
                opacity={0.5}
              />
              <rect
                x={460}
                y={700 + k * 200}
                width={220}
                height={16}
                rx={8}
                fill={C.grey}
                opacity={0.3}
              />
            </g>
          ))}
        </Tarjeta>
        <g
          opacity={aparece(t, 1.0)}
          transform={`translate(540 900) rotate(-14) scale(${sello})`}
        >
          <rect
            x={-260}
            y={-70}
            width={520}
            height={140}
            rx={16}
            fill="none"
            stroke={C.red}
            strokeWidth={12}
          />
          <Texto x={0} y={26} color={C.red} size={80}>
            BUSCADO
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={1.0} />
    </>
  );
};

// B. Primera infección: 1-2 semanas para fabricar la llave
export const Primera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const llegan = interpolate(t, [T.anticuerpos, T.llave + 0.6], [0, 1], suave);
  const fiebre = aparece(t, T.enfermas);
  return (
    <Lienzo zoom={interpolate(t, [T.primera, T.gana], [1, 1.04])}>
      <rect
        x={0}
        y={0}
        width={1080}
        height={1920}
        fill={C.red}
        opacity={fiebre * 0.08}
      />
      <Virus x={540} y={760} r={120} t={t} op={aparece(t, T.primera)} />
      <Texto
        x={540}
        y={500}
        color={C.white}
        size={110}
        op={aparece(t, T.sabe) * (1 - llegan)}
      >
        ?
      </Texto>
      {new Array(8).fill(0).map((_, k) => {
        const a = (k / 8) * Math.PI * 2;
        const d = interpolate(llegan, [0, 1], [460, 215]);
        return (
          <Anticuerpo
            key={k}
            x={540 + Math.cos(a) * d}
            y={760 + Math.sin(a) * d}
            s={1.3}
            rot={(a * 180) / Math.PI - 90}
            op={aparece(t, T.anticuerpos)}
          />
        );
      })}
      <g opacity={aparece(t, T.semanas)}>
        <rect x={190} y={1120} width={700} height={36} rx={18} fill={C.wire} />
        <rect
          x={190}
          y={1120}
          width={700 * interpolate(t, [T.semanas, T.llave], [0, 1], clamp)}
          height={36}
          rx={18}
          fill={C.orange}
        />
        <Texto x={540} y={1230} color={C.orange} size={40}>
          1-2 semanas
        </Texto>
      </g>
      <Texto x={540} y={1340} color={C.red} size={44} op={fiebre}>
        mientras, te enfermas
      </Texto>
    </Lienzo>
  );
};

// C. Células de memoria que viven décadas
export const Memoria: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const patrulla = aparece(t, T.anos);
  return (
    <Lienzo zoom={interpolate(t, [T.gana, T.vuelve], [1, 1.04])}>
      <Texto
        x={540}
        y={430}
        color={C.yellow}
        size={50}
        op={aparece(t, T.memoria)}
      >
        células de memoria
      </Texto>
      <g opacity={aparece(t, T.gana) * (1 - aparece(t, T.gana + 1.9))}>
        <Virus x={540} y={760} r={110} t={t} color={C.grey} />
        <line
          x1={360}
          y1={940}
          x2={720}
          y2={580}
          stroke="#5AC878"
          strokeWidth={20}
          strokeLinecap="round"
        />
        <Texto x={540} y={1060} color="#5AC878" size={48}>
          ganó tu cuerpo
        </Texto>
      </g>
      <Celula x={330} y={720} letra="B" t={t} op={aparece(t, T.gana + 2)} />
      <Celula x={750} y={720} letra="T" t={t} op={aparece(t, T.gana + 2.3)} />
      <Tarjeta x={240} y={930} w={600} h={160} op={aparece(t, T.decadas)}>
        <Texto x={540} y={1030} color={C.yellow} size={60}>
          {`${Math.round(interpolate(t, [T.decadas, T.decadas + 1.5], [0, 50], clamp))}+ años`}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1170}
        color={C.grey}
        size={34}
        op={aparece(t, T.ganglios)}
      >
        médula ósea y ganglios
      </Texto>
      {new Array(10).fill(0).map((_, k) => (
        <Anticuerpo
          key={k}
          x={((t * 120 + k * 140) % 1300) - 110}
          y={1300 + 50 * Math.sin(t * 2 + k)}
          s={0.9}
          rot={t * 60 + k * 30}
          op={patrulla}
        />
      ))}
      <Texto
        x={540}
        y={1440}
        color={C.cyan}
        size={36}
        op={aparece(t, T.patrullando)}
      >
        anticuerpos de guardia
      </Texto>
    </Lienzo>
  );
};

// D. Segunda vez: respuesta rápida y fuerte (gráfica de anticuerpos)
export const Segunda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x0 = 170;
  const y0 = 1180;
  const ancho = 740;
  const alto = 520;
  const curva = (c: number, pico: number, alt: number, sig: number) =>
    new Array(61)
      .fill(0)
      .map((_, k) => {
        const u = k / 60;
        const v = alt * Math.exp(-((u - pico) ** 2) / (2 * sig * sig));
        return `${k === 0 ? "M" : "L"} ${x0 + c + u * (ancho / 2 - 20)} ${y0 - v * alto}`;
      })
      .join(" ");
  const p2 = interpolate(t, [T.reconocen, T.fuerte + 0.5], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.vuelve, T.vacunas], [1, 1.04])}>
      <Texto
        x={540}
        y={470}
        color={C.white}
        size={44}
        op={aparece(t, T.vuelve)}
      >
        30 años después…
      </Texto>
      <Tarjeta x={110} y={560} w={860} h={720} op={aparece(t, T.vuelve)}>
        <line
          x1={x0}
          y1={y0}
          x2={x0 + ancho}
          y2={y0}
          stroke={C.grey}
          strokeWidth={4}
        />
        <line
          x1={x0}
          y1={y0}
          x2={x0}
          y2={y0 - alto - 20}
          stroke={C.grey}
          strokeWidth={4}
        />
        <Texto
          x={x0 + 10}
          y={y0 - alto - 40}
          color={C.grey}
          size={26}
          anchor="start"
        >
          anticuerpos
        </Texto>
        <path
          d={curva(0, 0.6, 0.3, 0.13)}
          stroke={C.orange}
          strokeWidth={8}
          fill="none"
        />
        <Texto x={x0 + 200} y={y0 + 50} color={C.orange} size={28}>
          1.ª vez
        </Texto>
        <line
          x1={x0 + ancho / 2}
          y1={y0}
          x2={x0 + ancho / 2}
          y2={y0 - alto}
          stroke={C.grey}
          strokeWidth={2}
          strokeDasharray="10 10"
        />
        <g clipPath="url(#corte2)">
          <path
            d={curva(ancho / 2, 0.25, 0.95, 0.12)}
            stroke={C.cyan}
            strokeWidth={10}
            fill="none"
          />
        </g>
        <defs>
          <clipPath id="corte2">
            <rect
              x={x0 + ancho / 2}
              y={0}
              width={(ancho / 2) * p2}
              height={1920}
            />
          </clipPath>
        </defs>
        <Texto
          x={x0 + ancho * 0.75}
          y={y0 + 50}
          color={C.cyan}
          size={28}
          op={aparece(t, T.dias)}
        >
          30 años después
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1400}
        color={C.cyan}
        size={40}
        op={aparece(t, T.reconocen)}
      >
        te reconoce al instante
      </Texto>
    </Lienzo>
  );
};

// E. Vacunas: memoria sin enfermedad
export const Vacunas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.vacunas, T.olvida], [1, 1.04])}>
      <g
        opacity={aparece(t, T.vacunas)}
        transform="translate(540 760) rotate(-30)"
      >
        <rect
          x={-60}
          y={-260}
          width={120}
          height={360}
          rx={16}
          fill="none"
          stroke={C.white}
          strokeWidth={10}
        />
        <rect
          x={-50}
          y={-120}
          width={100}
          height={210}
          rx={10}
          fill={C.cyan}
          opacity={0.5}
        />
        <rect x={-90} y={-290} width={180} height={30} rx={10} fill={C.white} />
        <rect x={-14} y={-360} width={28} height={80} fill={C.white} />
        <line
          x1={0}
          y1={100}
          x2={0}
          y2={240}
          stroke={C.white}
          strokeWidth={8}
        />
      </g>
      <Texto x={540} y={1180} color={C.yellow} size={52} op={aparece(t, T.sin)}>
        memoria
      </Texto>
      <Texto
        x={540}
        y={1260}
        color={C.grey}
        size={40}
        op={aparece(t, T.sin + 0.3)}
      >
        sin la enfermedad
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: tu sangre no olvida
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.olvida, T.fin + 0.5], [1, 1.05])}>
      {new Array(18).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={100 + random(`gr${k}`) * 880}
          cy={500 + random(`gy${k}`) * 900}
          r={36}
          fill="#8A2A3A"
          opacity={0.25}
        />
      ))}
      <Virus x={540} y={860} r={110} t={t} />
      <circle
        cx={540}
        cy={860}
        r={220}
        fill="none"
        stroke={VERDE}
        strokeWidth={14}
        opacity={aparece(t, T.olvida)}
      />
      <Texto
        x={540}
        y={1200}
        color={C.yellow}
        size={54}
        op={aparece(t, T.olvida + 0.4)}
      >
        no olvida
      </Texto>
    </Lienzo>
  );
};
