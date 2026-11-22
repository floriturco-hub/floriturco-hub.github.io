import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Auto, Cinta, Pesitas, Rueda, Sensor } from "./Piezas";

// Instantes clave (s) de public/audio/cinturon/narracion.wav (voz x1,03), sacados con Whisper
export const T = {
  despacio: 2.04,
  frena: 5.02,
  bloquea: 6.48,
  cables: 8.06,
  carrete: 11.18,
  rueda: 13.62,
  bolita: 15.78,
  normal: 18.38,
  frenazo: 21.62,
  inercia: 24.6,
  sube: 26.56,
  palanquita: 28.14,
  dientes: 31.44,
  trabado: 32.8,
  segundo: 34.68,
  rapido: 36.14,
  pesitas: 39.86,
  centrifuga: 41.72,
  tiron: 44.26,
  parado: 47.18,
  newton: 48.8,
  fin: 50.7,
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

const Candado: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
}> = ({ x, y, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <path
      d="M -40 -10 L -40 -50 Q -40 -90 0 -90 Q 40 -90 40 -50 L 40 -10"
      stroke={C.red}
      strokeWidth={14}
      fill="none"
    />
    <rect x={-60} y={-14} width={120} height={90} rx={14} fill={C.red} />
  </g>
);

// A. Gancho: una bolita te salva la vida
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const frenazo = interpolate(t, [T.frena, T.frena + 0.3], [0, 1], suave);
  const flash = interpolate(
    t,
    [T.bloquea, T.bloquea + 0.08, T.bloquea + 0.45],
    [0, 0.25, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.carrete], [1.05, 1])}>
        <g transform="translate(540 760)">
          <circle
            r={180 + 6 * Math.sin(t * 6)}
            fill="#D8DCE4"
            stroke="#8A8E9A"
            strokeWidth={6}
          />
          <circle cx={-50} cy={-50} r={50} fill="#FFFFFF" opacity={0.8} />
        </g>
        <Auto
          x={540 + (1 - frenazo) * 30 * Math.sin(t * 2)}
          y={1250}
          s={1.3}
          inclina={4 * frenazo}
        />
        <Texto
          x={540}
          y={1050}
          color={C.white}
          size={40}
          op={aparece(t, T.despacio) * (1 - aparece(t, T.frena))}
        >
          tiras despacio: sale
        </Texto>
        <g opacity={aparece(t, T.bloquea)}>
          <Candado x={860} y={560} op={1} />
          <Texto x={540} y={1050} color={C.red} size={48}>
            frenazo: ¡bloqueado!
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

// B. Dentro del carrete: rueda dentada, bolita y palanca
const Mecanismo: React.FC<{
  readonly t: number;
  readonly inercia: number;
  readonly giro: number;
  readonly mov: number;
  readonly etiquetas: { rueda?: number; bolita?: number; palanca?: number };
}> = ({ t, inercia, giro, mov, etiquetas }) => (
  <g>
    <Cinta x1={540} y1={540} x2={960} y2={300} t={t} mov={mov} />
    <Rueda x={540} y={700} r={170} rot={giro} />
    <Sensor x={470} y={1110} inercia={inercia} />
    <g fontFamily={mono} fontWeight={700} fontSize={32}>
      <text x={800} y={760} fill="#A8ACB8" opacity={etiquetas.rueda ?? 0}>
        rueda dentada
      </text>
      <text x={150} y={1220} fill="#D8DCE4" opacity={etiquetas.bolita ?? 0}>
        bolita de acero
      </text>
      <text x={720} y={1000} fill={C.yellow} opacity={etiquetas.palanca ?? 0}>
        palanca
      </text>
    </g>
  </g>
);

export const Carrete: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.carrete, T.frenazo], [1, 1.04])}>
      <Mecanismo
        t={t}
        inercia={0}
        giro={t * 30}
        mov={1}
        etiquetas={{
          rueda: aparece(t, T.rueda),
          bolita: aparece(t, T.bolita),
          palanca: aparece(t, T.bolita + 1),
        }}
      />
      <Texto
        x={540}
        y={400}
        color={C.white}
        size={40}
        op={aparece(t, T.normal)}
      >
        marcha normal: bolita quieta
      </Texto>
    </Lienzo>
  );
};

// C. En el frenazo la bolita sigue por inercia y traba la rueda
export const Frenazo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const inercia = interpolate(
    t,
    [T.inercia, T.palanquita + 0.6],
    [0, 1],
    suave,
  );
  const trabado = t > T.dientes + 0.3;
  const giro = trabado ? (T.dientes + 0.3) * 30 : t * 30;
  const flash = interpolate(
    t,
    [T.trabado, T.trabado + 0.08, T.trabado + 0.45],
    [0, 0.22, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frenazo, T.segundo], [1, 1.05])}>
        <Mecanismo
          t={t}
          inercia={inercia}
          giro={giro}
          mov={trabado ? 0 : 1}
          etiquetas={{ bolita: 1, palanca: 1 }}
        />
        <path
          d="M 560 1180 L 700 1180 M 670 1155 L 700 1180 L 670 1205"
          stroke={C.cyan}
          strokeWidth={8}
          fill="none"
          opacity={aparece(t, T.inercia) * (1 - aparece(t, T.dientes))}
        />
        <Texto
          x={540}
          y={400}
          color={C.cyan}
          size={44}
          op={aparece(t, T.inercia) * (1 - aparece(t, T.trabado))}
        >
          inercia
        </Texto>
        <g opacity={aparece(t, T.trabado)}>
          <Candado x={540} y={420} op={1} />
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

// D. Segundo seguro: pesitas centrífugas si la cinta sale muy rápido
export const Centrifuga: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vel = interpolate(t, [T.rapido, T.rapido + 1], [0.4, 3], clamp);
  const abre = interpolate(t, [T.pesitas, T.centrifuga + 0.6], [0, 1], suave);
  const giro = abre > 0.95 ? 0 : t * 120 * vel;
  return (
    <Lienzo zoom={interpolate(t, [T.segundo, T.tiron], [1, 1.04])}>
      <Cinta
        x1={540}
        y1={720}
        x2={960}
        y2={420}
        t={t}
        mov={abre > 0.95 ? 0 : vel}
      />
      <Rueda x={540} y={880} r={200} rot={giro} />
      <Pesitas x={540} y={880} r={200} rot={giro} abre={abre} />
      <Texto
        x={540}
        y={430}
        color={C.white}
        size={40}
        op={aparece(t, T.segundo)}
      >
        segundo seguro
      </Texto>
      <Texto
        x={540}
        y={1260}
        color={C.orange}
        size={44}
        op={aparece(t, T.centrifuga)}
      >
        fuerza centrífuga
      </Texto>
    </Lienzo>
  );
};

// E. Un tirón brusco lo bloquea aunque el auto esté parado
export const Tiron: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tiron = interpolate(t, [T.tiron + 0.3, T.tiron + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tiron, T.newton], [1, 1.04])}>
      <Auto x={540} y={1200} s={1.2} />
      <Cinta x1={540} y1={520} x2={540 + 300 * tiron} y2={820} t={t} mov={0} />
      <Candado x={540} y={420} op={aparece(t, T.tiron + 0.6)} />
      <Texto
        x={540}
        y={1420}
        color={C.white}
        size={40}
        op={aparece(t, T.parado)}
      >
        aunque el auto esté parado
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: Newton en tu hombro
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.newton, T.fin + 0.5], [1, 1.05])}>
      <g transform="translate(540 820)">
        <circle r={200} fill="#D8DCE4" stroke="#8A8E9A" strokeWidth={6} />
        <circle cx={-60} cy={-60} r={56} fill="#FFFFFF" opacity={0.8} />
      </g>
      <Texto
        x={540}
        y={1200}
        color={C.yellow}
        size={52}
        op={aparece(t, T.newton)}
      >
        1ª ley de Newton
      </Texto>
    </Lienzo>
  );
};
