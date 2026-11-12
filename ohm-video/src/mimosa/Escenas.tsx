import { Easing, interpolate } from "remotion";
import { Dedo } from "../espejoespia/Piezas";
import { C, clamp, H, mono, useT, W } from "../theme";
import { caidaDe, Hoja, Planta, Pulso, Pulvinulo } from "./Piezas";

// Instantes clave (s) de public/audio/mimosa/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  tocas: 1.54,
  mimosa: 2.36,
  dormidera: 5.4,
  roza: 6.4,
  pliega: 8.44,
  rama: 10.26,
  muerto: 11.48,
  musculos: 12.76,
  truco: 14.1,
  base: 16.24,
  pulvinulos: 17.38,
  celulas: 18.92,
  globos: 20.28,
  cuando: 21.22,
  senal: 22.74,
  viaja: 23.72,
  llegar: 25.04,
  compuertas: 26.26,
  potasio: 27.7,
  agua: 28.78,
  desinflan: 30.5,
  dobla: 32.16,
  despues: 33.56,
  bombea: 35.08,
  recupera: 36.68,
  abre: 37.76,
  paraQue: 39.76,
  marchita: 41.74,
  espinas: 42.86,
  animal: 44.66,
  loco: 46.9,
  experimento: 47.86,
  caer: 49.58,
  cerrarse: 52.58,
  semanas: 54.04,
  sinCerebro: 55.48,
  aprende: 57.36,
  fin: 58.0,
};

const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

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
}> = ({ x, y, children, color = C.white, op = 1, size = 36 }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={color}
    fontFamily={mono}
    fontSize={size}
    fontWeight={700}
    opacity={op}
  >
    {children}
  </text>
);

// Dedo que entra desde la derecha y toca en (x,y)
const DedoToca: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly p: number;
}> = ({ x, y, p }) => (
  <g
    transform={`translate(${x + 260 * (1 - p)} ${y}) scale(-1 1)`}
    opacity={Math.min(1, p * 3)}
  >
    <Dedo x={0} y={0} s={0.55} />
  </g>
);

// A. Gancho: ¡se desmaya!
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const toque = interpolate(t, [0, 0.35], [0, 1], suave);
  const flash = interpolate(t, [0.35, 0.43, 0.8], [0, 0.25, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.roza], [1.04, 1])} cy={900}>
        <Planta
          x={540}
          y={1300}
          s={1.25}
          cierreDe={(i) => caidaDe(t, 0.35, 4 - i, 0.12, 0.5)}
        />
        <DedoToca x={640} y={600} p={toque * (1 - aparece(t, 1.4))} />
        <g opacity={aparece(t, T.mimosa)}>
          <Texto x={540} y={330} color={C.yellow} size={56}>
            Mimosa pudica
          </Texto>
          <Texto
            x={540}
            y={400}
            color={C.grey}
            size={36}
            op={aparece(t, T.dormidera - 0.3)}
          >
            «dormidera»
          </Texto>
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

// B. La rozas y en dos segundos se pliega y cae la rama
export const Demo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const toque = interpolate(t, [T.roza + 0.3, T.roza + 0.9], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.roza, T.musculos], [1, 1.06])} cy={900}>
      <Planta
        x={540}
        y={1300}
        s={1.25}
        cierreDe={(i) => caidaDe(t, T.pliega - 0.6, 4 - i, 0.25, 0.9)}
      />
      <DedoToca x={640} y={600} p={toque * (1 - aparece(t, T.pliega + 0.8))} />
      <Texto
        x={540}
        y={330}
        color={C.yellow}
        size={52}
        op={aparece(t, T.pliega)}
      >
        2 segundos
      </Texto>
    </Lienzo>
  );
};

// C. Sin músculos: los pulvínulos, células como globos
export const Pulvinulos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = interpolate(
    t,
    [T.pulvinulos - 0.4, T.pulvinulos + 0.6],
    [0, 1],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.musculos, T.cuando], [1, 1.04])}>
      <g opacity={1 - zoom}>
        <Hoja x={540} y={1150} rot={0} s={1.6} cierre={0} caida={0} />
        <g opacity={aparece(t, T.base)}>
          <circle
            cx={540}
            cy={1150}
            r={50}
            fill="none"
            stroke={C.yellow}
            strokeWidth={8}
          />
          <Texto x={540} y={1260} color={C.yellow} size={40}>
            base de la hoja
          </Texto>
        </g>
        <Texto
          x={540}
          y={330}
          color={C.red}
          size={48}
          op={aparece(t, T.musculos)}
        >
          sin músculos
        </Texto>
      </g>
      <g opacity={zoom}>
        <Texto x={540} y={500} color={C.yellow} size={52}>
          pulvínulo
        </Texto>
        <Pulvinulo x={540} y={900} t={t} infla={1} iones={0} agua={0} />
        <Texto
          x={540}
          y={1240}
          color={C.cyan}
          size={40}
          op={aparece(t, T.globos)}
        >
          células llenas de agua
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Una señal eléctrica viaja por la planta
export const Senal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.llegar], [1, 1.04])}>
      <Pulso
        x1={160}
        y1={900}
        x2={920}
        y2={900}
        p={interpolate(t, [T.senal, T.viaja + 1], [0, 1], clamp)}
      />
      <circle
        cx={940}
        cy={900}
        r={40}
        fill="#8AB05A"
        stroke={C.yellow}
        strokeWidth={aparece(t, T.viaja + 0.9) * 8}
      />
      <DedoToca
        x={160}
        y={860}
        p={interpolate(t, [T.cuando, T.cuando + 0.5], [0, 1], suave)}
      />
      <Texto
        x={540}
        y={760}
        color={C.yellow}
        size={44}
        op={aparece(t, T.senal)}
      >
        señal eléctrica
      </Texto>
      <Texto
        x={940}
        y={1010}
        color={C.white}
        size={32}
        op={aparece(t, T.viaja + 0.9)}
      >
        pulvínulo
      </Texto>
    </Lienzo>
  );
};

// E. Sale el potasio, sale el agua, la célula se desinfla y la hoja se dobla
export const Desinfla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const infla = interpolate(
    t,
    [T.desinflan - 0.4, T.desinflan + 1],
    [1, 0.25],
    suave,
  );
  const dobla = interpolate(t, [T.dobla - 0.2, T.dobla + 0.6], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.llegar, T.despues], [1, 1.04])}>
      <Pulvinulo
        x={540}
        y={720}
        t={t}
        infla={infla}
        iones={aparece(t, T.potasio) * (1 - aparece(t, T.dobla))}
        agua={aparece(t, T.agua) * (1 - aparece(t, T.dobla))}
      />
      <Texto
        x={540}
        y={430}
        color={C.yellow}
        size={44}
        op={aparece(t, T.potasio) * (1 - aparece(t, T.agua))}
      >
        sale potasio (K+)
      </Texto>
      <Texto
        x={540}
        y={430}
        color={C.cyan}
        size={44}
        op={aparece(t, T.agua) * (1 - aparece(t, T.desinflan))}
      >
        el agua lo sigue
      </Texto>
      <Texto
        x={540}
        y={430}
        color={C.white}
        size={44}
        op={aparece(t, T.desinflan)}
      >
        se desinflan
      </Texto>
      <g opacity={aparece(t, T.dobla - 0.3)}>
        <Hoja x={540} y={1380} rot={0} s={0.85} cierre={dobla} caida={dobla} />
      </g>
    </Lienzo>
  );
};

// F. Se recupera y se abre en unos minutos
export const Reabre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const infla = interpolate(t, [T.bombea, T.abre], [0.25, 1], suave);
  const abre = 1 - interpolate(t, [T.recupera, T.abre + 0.8], [0, 1], suave);
  const minutos = Math.round(
    interpolate(t, [T.bombea, T.abre + 0.8], [0, 15], clamp),
  );
  return (
    <Lienzo zoom={interpolate(t, [T.despues, T.paraQue], [1, 1.04])}>
      <Pulvinulo x={540} y={720} t={t} infla={infla} iones={0} agua={0} />
      <Texto x={540} y={430} color={C.cyan} size={44} op={aparece(t, T.bombea)}>
        recupera potasio y agua
      </Texto>
      <Hoja x={540} y={1380} rot={0} s={0.85} cierre={abre} caida={abre} />
      <Texto
        x={850}
        y={1150}
        color={C.yellow}
        size={48}
        op={aparece(t, T.abre)}
      >
        {`~${minutos} min`}
      </Texto>
    </Lienzo>
  );
};

// G. ¿Para qué? Parece marchita y enseña espinas
export const Defensa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vaca = interpolate(t, [T.paraQue, T.paraQue + 1], [0, 1], suave);
  const seVa = interpolate(t, [T.animal, T.animal + 1], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.paraQue, T.loco], [1, 1.04])} cy={900}>
      <Planta
        x={420}
        y={1300}
        s={1.15}
        cierreDe={() => 1}
        espinas={aparece(t, T.espinas)}
      />
      <g
        transform={`translate(${880 + 120 * seVa} 640) scale(${seVa > 0.5 ? -1 : 1} 1)`}
        opacity={vaca}
      >
        <ellipse cx={0} cy={0} rx={110} ry={80} fill="#C8A878" />
        <ellipse cx={-90} cy={30} rx={60} ry={44} fill="#E8C8A8" />
        <path
          d="M 40 -70 L 70 -140 L 90 -60 Z M -10 -74 L -30 -146 L 10 -72 Z"
          fill="#C8A878"
        />
        <circle cx={-30} cy={-10} r={10} fill={C.bg} />
      </g>
      <Texto
        x={540}
        y={330}
        color={C.white}
        size={44}
        op={aparece(t, T.marchita)}
      >
        parece marchita
      </Texto>
      <Texto
        x={420}
        y={1580}
        color="#E8705A"
        size={40}
        op={aparece(t, T.espinas)}
      >
        espinas
      </Texto>
    </Lienzo>
  );
};

// H. El experimento: la dejan caer una y otra vez… y aprende
export const Experimento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciclo = 1.1;
  const t1 = Math.max(0, t - T.caer);
  const n = Math.floor(t1 / ciclo);
  const f = (t1 % ciclo) / ciclo;
  const caida =
    t < T.caer ? 0 : f < 0.4 ? -140 * (1 - Math.pow(f / 0.4, 2)) : 0;
  const respuesta = n < 2 ? 1 : n < 3 ? 0.5 : 0;
  const cierre =
    t < T.caer
      ? 0
      : f > 0.4
        ? interpolate(f, [0.4, 0.6, 1], [0, respuesta, respuesta * 0.6], clamp)
        : 0;
  const dias = Math.round(
    interpolate(t, [T.semanas - 0.3, T.semanas + 1.2], [1, 28], clamp),
  );
  return (
    <Lienzo zoom={interpolate(t, [T.loco, T.sinCerebro], [1, 1.04])} cy={900}>
      <Planta x={540} y={1300 + caida} s={0.95} cierreDe={() => cierre} />
      <rect x={300} y={1512} width={480} height={20} rx={8} fill="#5A5478" />
      <Texto
        x={540}
        y={300}
        color={C.yellow}
        size={44}
        op={aparece(t, T.experimento)}
      >
        {t < T.caer ? "experimento" : `caída ${Math.min(n + 1, 9)}`}
      </Texto>
      <Texto
        x={540}
        y={370}
        color={C.cyan}
        size={40}
        op={aparece(t, T.cerrarse) * (1 - aparece(t, T.semanas))}
      >
        ya no se cierra
      </Texto>
      <g opacity={aparece(t, T.semanas)}>
        <Texto x={540} y={380} color={C.yellow} size={46}>
          {`la recuerda ${dias} días`}
        </Texto>
      </g>
    </Lienzo>
  );
};

// I. Cierre: una planta sin cerebro que aprende
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo
      zoom={interpolate(t, [T.sinCerebro, T.fin + 0.5], [1, 1.05])}
      cy={900}
    >
      <Planta x={540} y={1330} s={1.05} cierreDe={() => 0} />
      <g
        opacity={aparece(t, T.sinCerebro + 0.6)}
        transform="translate(540 300)"
      >
        <path
          d="M -90 10 C -100 -60 -40 -90 0 -90 C 50 -95 100 -60 90 0 C 88 40 50 60 10 55 C -20 70 -80 60 -90 10 Z"
          fill="#E8A0B8"
        />
        <line
          x1={-110}
          y1={-100}
          x2={110}
          y2={80}
          stroke={C.red}
          strokeWidth={14}
          strokeLinecap="round"
        />
      </g>
    </Lienzo>
  );
};
