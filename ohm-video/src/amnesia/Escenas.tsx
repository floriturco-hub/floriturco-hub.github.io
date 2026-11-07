import { interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Bebe, Cerebro, Foto, Linea, Llave, Raton, Red } from "./Piezas";

// Instantes clave (s) de public/audio/amnesia/narracion.wav (voz x1,15), sacados con Whisper
export const T = {
  caras: 2.1,
  gatear: 3.2,
  palabras: 4.0,
  recuerdas: 5.82,
  segundo: 6.98,
  noEs: 8.18,
  cerebro: 9.3,
  obras: 10.14,
  amnesia: 11.02,
  tres: 13.08,
  curioso: 15.96,
  recuerdan: 17.42,
  bebe: 18.6,
  mama: 20.06,
  gestos: 20.68,
  rutinas: 21.42,
  problema: 22.78,
  conservar: 24.3,
  hipocampo: 25.74,
  explicaciones: 28.46,
  nacen: 30.52,
  ritmo: 32.84,
  cada: 34.32,
  reorganiza: 36.34,
  inaccesibles: 37.58,
  suma: 40.66,
  sinPalabras: 41.94,
  quien: 44.0,
  reconstruye: 45.9,
  fotos: 49.54,
  sorprendente: 51.54,
  ratones: 52.82,
  reactivar: 54.46,
  quiza: 56.62,
  llave: 58.16,
  fin: 59.4,
};

const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{
  readonly children: React.ReactNode;
  readonly zoom?: number;
  readonly cy?: number;
}> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g
      transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}
    >
      {children}
    </g>
  </svg>
);

const Texto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly op?: number;
  readonly size?: number;
  readonly anchor?: "start" | "middle" | "end";
}> = ({
  x,
  y,
  children,
  color = C.white,
  op = 1,
  size = 36,
  anchor = "middle",
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={color}
    fontFamily={mono}
    fontSize={size}
    fontWeight={700}
    opacity={op}
  >
    {children}
  </text>
);

const Burbuja: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly texto: string;
  readonly op: number;
  readonly w?: number;
}> = ({ x, y, texto, op, w = 300 }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <rect x={-w / 2} y={-60} width={w} height={110} rx={30} fill={C.white} />
    <path d="M -20 48 L -40 90 L 10 48 Z" fill={C.white} />
    <text
      y={14}
      textAnchor="middle"
      fill={C.bg}
      fontFamily={mono}
      fontSize={40}
      fontWeight={700}
    >
      {texto}
    </text>
  </g>
);

const Check: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly ok: boolean;
  readonly op: number;
}> = ({ x, y, ok, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <circle r={30} fill={ok ? C.yellow : C.red} />
    {ok ? (
      <path
        d="M -14 0 L -4 12 L 16 -12"
        stroke={C.bg}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M -12 -12 L 12 12 M 12 -12 L -12 12"
        stroke={C.bg}
        strokeWidth={8}
        strokeLinecap="round"
      />
    )}
  </g>
);

// A. Gancho: un año entero aprendiendo… y cero recuerdos
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const borra = interpolate(t, [T.recuerdas, T.recuerdas + 0.5], [0, 1], clamp);
  const cerebro = aparece(t, T.noEs + 0.3);
  const flash = interpolate(
    t,
    [T.recuerdas, T.recuerdas + 0.08, T.recuerdas + 0.45],
    [0, 0.25, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.amnesia], [1, 1.06])}>
        <g opacity={1 - cerebro}>
          <g opacity={1 - borra}>
            <Bebe x={540} y={820} s={1.2} t={t} />
          </g>
          <g
            opacity={borra}
            fill="none"
            stroke={C.grey}
            strokeWidth={6}
            strokeDasharray="18 14"
          >
            <circle cx={540} cy={820} r={204} />

            <text
              x={540}
              y={880}
              textAnchor="middle"
              fill={C.grey}
              stroke="none"
              fontFamily={mono}
              fontSize={180}
              fontWeight={700}
            >
              ?
            </text>
          </g>
          <g opacity={1 - borra}>
            <Burbuja
              x={260}
              y={400}
              texto="caras"
              op={aparece(t, T.caras)}
              w={240}
            />
            <Burbuja
              x={820}
              y={360}
              texto="gatear"
              op={aparece(t, T.gatear)}
              w={260}
            />
            <Burbuja
              x={560}
              y={240}
              texto="¡ma-má!"
              op={aparece(t, T.palabras)}
              w={300}
            />
          </g>
          <g opacity={borra}>
            <Texto x={540} y={360} color={C.red} size={110}>
              0
            </Texto>
            <Texto x={540} y={430} color={C.grey} size={40}>
              recuerdos
            </Texto>
          </g>
        </g>
        <g opacity={cerebro}>
          <Cerebro x={540} y={880} s={1.25} obras={aparece(t, T.obras)} />
        </g>
      </Lienzo>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: flash,
        }}
      />
    </>
  );
};

// B. Línea de tiempo: vacío antes de los 3 años
export const LineaTiempo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.amnesia, T.curioso], [1, 1.04])}>
      <Linea
        x={110}
        y={1100}
        w={860}
        p={interpolate(t, [T.amnesia + 0.4, T.tres + 1.2], [0, 1], clamp)}
        marca={aparece(t, T.tres)}
      />
      <Texto
        x={540}
        y={520}
        color={C.yellow}
        size={56}
        op={aparece(t, T.amnesia)}
      >
        amnesia infantil
      </Texto>
    </Lienzo>
  );
};

// C. Los bebés sí recuerdan: el problema es conservar
const HABILIDADES: [string, keyof typeof T][] = [
  ["reconoce a mamá", "mama"],
  ["imita gestos", "gestos"],
  ["aprende rutinas", "rutinas"],
];
export const SiRecuerdan: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lista = 1 - aparece(t, T.problema);
  return (
    <Lienzo zoom={interpolate(t, [T.curioso, T.hipocampo], [1, 1.04])}>
      <Bebe x={540} y={560} s={0.85} t={t} />
      <g opacity={lista}>
        {HABILIDADES.map(([txt, k], i) => (
          <g key={txt}>
            <Check x={250} y={980 + i * 120} ok op={aparece(t, T[k])} />
            <Texto
              x={310}
              y={994 + i * 120}
              anchor="start"
              op={aparece(t, T[k])}
              size={40}
            >
              {txt}
            </Texto>
          </g>
        ))}
      </g>
      <g opacity={aparece(t, T.problema)}>
        <Check x={250} y={1020} ok op={1} />
        <Texto x={310} y={1034} anchor="start" size={48}>
          guardar
        </Texto>
        <Check x={250} y={1160} ok={false} op={aparece(t, T.conservar)} />
        <Texto
          x={310}
          y={1174}
          anchor="start"
          size={48}
          color={C.red}
          op={aparece(t, T.conservar)}
        >
          conservar
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. El hipocampo
export const Hipocampo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.hipocampo, T.nacen], [1, 1.12])} cy={980}>
      <Cerebro
        x={540}
        y={900}
        s={1.3}
        hipo={aparece(t, T.hipocampo + 1.5)}
        t={t}
      />
      <Texto
        x={330}
        y={1250}
        color={C.yellow}
        size={52}
        op={aparece(t, T.hipocampo + 1.5)}
      >
        hipocampo
      </Texto>
    </Lienzo>
  );
};

// E. Neuronas nuevas reorganizan los circuitos y el recuerdo se pierde
export const Neuronas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.nacen, T.suma], [1, 1.05])}>
      <Red
        x={540}
        y={880}
        t={t}
        recuerdo={1}
        nuevas={interpolate(t, [T.nacen + 0.6, T.reorganiza], [0, 1], clamp)}
        roto={interpolate(
          t,
          [T.inaccesibles - 0.3, T.inaccesibles + 1],
          [0, 1],
          clamp,
        )}
      />
      <Texto
        x={540}
        y={460}
        color={C.yellow}
        size={40}
        op={1 - aparece(t, T.nacen + 0.6)}
      >
        un recuerdo
      </Texto>
      <Texto
        x={540}
        y={460}
        color={C.cyan}
        size={40}
        op={aparece(t, T.nacen + 0.6) * (1 - aparece(t, T.inaccesibles))}
      >
        neuronas nuevas
      </Texto>
      <Texto
        x={540}
        y={460}
        color={C.red}
        size={44}
        op={aparece(t, T.inaccesibles)}
      >
        recuerdo inaccesible
      </Texto>
    </Lienzo>
  );
};

// F. Sin palabras y sin idea de "yo"
export const SinPalabras: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.suma, T.reconstruye], [1, 1.05])}>
      <Bebe x={540} y={900} s={1} t={t} />
      <Burbuja
        x={760}
        y={500}
        texto="...?"
        op={aparece(t, T.sinPalabras)}
        w={220}
      />
      <g opacity={aparece(t, T.quien)}>
        <Texto x={300} y={520} color={C.yellow} size={60}>
          ¿yo?
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Recuerdos reconstruidos con fotos e historias
export const Fotos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.reconstruye, T.sorprendente], [1, 1.05])}>
      <Foto x={330} y={760} rot={-10} op={aparece(t, T.reconstruye + 0.6)} />
      <Foto x={740} y={820} rot={8} op={aparece(t, T.fotos)} />
      <Burbuja
        x={560}
        y={1180}
        texto="¿te acuerdas?"
        op={aparece(t, T.fotos + 0.5)}
        w={420}
      />
      <Texto
        x={540}
        y={460}
        color={C.yellow}
        size={44}
        op={aparece(t, T.reconstruye + 0.6)}
      >
        recuerdos reconstruidos
      </Texto>
    </Lienzo>
  );
};

// H. En ratones se reactivan: quizá solo perdimos la llave
export const Llave_: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const reactiva = interpolate(
    t,
    [T.reactivar, T.reactivar + 1.2],
    [1, 0],
    clamp,
  );
  const flash = interpolate(
    t,
    [T.reactivar + 0.6, T.reactivar + 0.68, T.reactivar + 1],
    [0, 0.2, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sorprendente, T.fin + 0.5], [1, 1.05])}>
        <Raton x={560} y={420} s={0.9} op={aparece(t, T.ratones)} />
        <g transform="translate(0 120)">
          <Red x={540} y={880} t={t} recuerdo={1} nuevas={0} roto={reactiva} />
        </g>
        <Llave
          x={540}
          y={1340}
          s={1.1}
          op={aparece(t, T.llave)}
          rot={-10 + 10 * aparece(t, T.llave)}
        />
      </Lienzo>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: flash,
        }}
      />
    </>
  );
};
