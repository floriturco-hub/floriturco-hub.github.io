import { interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Alveolo, Aparato, Pila, Proporcion } from "./Piezas";

// Instantes clave (s) de public/audio/alcoholimetro/narracion.wav (voz x1,05), sacados con Whisper
export const T = {
  soplas: 1.6,
  sabe: 3.62,
  agujas: 6.08,
  pulmones: 7.14,
  alveolos: 10.7,
  pared: 13.34,
  evapora: 16.36,
  proporcion: 18.72,
  gota: 21.0,
  dosmil: 22.46,
  largo: 25.44,
  fondo: 28.02,
  pila: 30.24,
  platino: 34.44,
  corriente: 36.92,
  mas: 38.36,
  ojo: 40.24,
  enjuague: 41.86,
  boca: 43.1,
  esperan: 45.28,
  habla: 47.82,
  fin: 50.4,
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

const Flash: React.FC<{ readonly t: number; readonly d: number }> = ({
  t,
  d,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: C.white,
      opacity: interpolate(t, [d, d + 0.08, d + 0.45], [0, 0.25, 0], clamp),
    }}
  />
);

const Soplido: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly op: number;
}> = ({ x, y, t, op }) => (
  <g opacity={op}>
    {new Array(6).fill(0).map((_, k) => {
      const f = (t * 0.9 + k / 6) % 1;
      return (
        <path
          key={k}
          d={`M ${x - f * 260} ${y + (k - 2.5) * 16} q -30 -20 -60 0`}
          stroke="#C8E0F0"
          strokeWidth={8}
          fill="none"
          opacity={(1 - f) * 0.8}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

// A. Gancho: tu aliento te delata
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lectura = interpolate(t, [0.2, 1.6], [0, 0.45], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pulmones], [1.05, 1])}>
        <Aparato
          x={540}
          y={900}
          s={1.6}
          lectura={lectura.toFixed(2).replace(".", ",")}
          alerta={lectura > 0.3}
        />
        <Soplido x={540} y={420} t={t} op={1 - aparece(t, T.agujas)} />
        <g opacity={aparece(t, T.agujas)}>
          <path
            d="M 790 420 L 940 300"
            stroke={C.grey}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <line
            x1={760}
            y1={260}
            x2={980}
            y2={460}
            stroke={C.red}
            strokeWidth={12}
            strokeLinecap="round"
          />
          <Texto x={870} y={530} color={C.grey} size={32}>
            sin agujas
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={1.6} />
    </>
  );
};

// B. En los pulmones: el alcohol pasa de la sangre al aire
export const Pulmon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pulmones, T.proporcion], [1, 1.05])}>
      <Alveolo x={540} y={820} s={1.4} t={t} paso={aparece(t, T.evapora)} />
      <Texto
        x={540}
        y={380}
        color={C.white}
        size={44}
        op={aparece(t, T.alveolos)}
      >
        alveolo pulmonar
      </Texto>
      <Texto
        x={540}
        y={1400}
        color="#C8E048"
        size={40}
        op={aparece(t, T.evapora)}
      >
        el alcohol pasa al aire
      </Texto>
    </Lienzo>
  );
};

// C. Siempre en la misma proporción: 1 a 2100
export const Proporcion_: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.proporcion, T.largo], [1, 1.04])}>
      <Texto
        x={540}
        y={420}
        color={C.white}
        size={44}
        op={aparece(t, T.proporcion)}
      >
        siempre la misma proporción
      </Texto>
      <Proporcion
        x={540}
        y={860}
        p={interpolate(t, [T.gota, T.dosmil + 1], [0, 1], clamp)}
      />
      <Texto
        x={540}
        y={1250}
        color={C.yellow}
        size={64}
        op={aparece(t, T.dosmil)}
      >
        1 : 2100
      </Texto>
    </Lienzo>
  );
};

// D. Soplido largo: el aire del fondo de los pulmones
export const Largo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.largo, T.pila - 0.3], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.largo, T.pila], [1, 1.04])}>
      {[-1, 1].map((l) => (
        <path
          key={l}
          d={`M ${540 + l * 40} 560 C ${540 + l * 320} 560 ${540 + l * 330} 1100 ${540 + l * 200} 1200 C ${540 + l * 90} 1240 ${540 + l * 50} 1100 ${540 + l * 40} 900 Z`}
          fill="#3A2A4A"
          stroke="#E87890"
          strokeWidth={8}
        />
      ))}
      {[-1, 1].map((l) => (
        <rect
          key={`a${l}`}
          x={540 + l * 200 - 40}
          y={1180 - 560 * p}
          width={80}
          height={560 * p}
          rx={20}
          fill="#C8E0F0"
          opacity={0.35}
        />
      ))}
      <line
        x1={540}
        y1={400}
        x2={540}
        y2={600}
        stroke="#E87890"
        strokeWidth={30}
        strokeLinecap="round"
      />
      <Texto x={540} y={1380} color={C.cyan} size={42} op={aparece(t, T.fondo)}>
        el aire del fondo
      </Texto>
    </Lienzo>
  );
};

// E. Pila de combustible: más alcohol, más corriente
export const PilaEscena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pila, T.ojo], [1, 1.04])}>
      <Pila
        x={540}
        y={940}
        t={t}
        corriente={interpolate(t, [T.corriente, T.mas + 1], [0, 0.85], clamp)}
      />
      <Texto x={540} y={500} color={C.white} size={44} op={aparece(t, T.pila)}>
        pila de combustible
      </Texto>
      <Texto x={540} y={1260} color={C.cyan} size={40} op={aparece(t, T.mas)}>
        más alcohol = más corriente
      </Texto>
    </Lienzo>
  );
};

// F. Ojo con el alcohol en la boca
export const Boca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const espera = aparece(t, T.esperan);
  return (
    <Lienzo zoom={interpolate(t, [T.ojo, T.habla], [1, 1.04])}>
      <g opacity={aparece(t, T.enjuague)} transform="translate(300 880)">
        <rect
          x={-80}
          y={-200}
          width={160}
          height={340}
          rx={30}
          fill="#4AA8D8"
          opacity={0.85}
        />
        <rect x={-50} y={-260} width={100} height={70} rx={14} fill="#E8E6F0" />
        <text
          y={-40}
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily={mono}
          fontSize={30}
          fontWeight={700}
        >
          enjuague
        </text>
      </g>
      <Aparato
        x={780}
        y={900}
        s={1.1}
        lectura={espera > 0.5 ? "0,00" : "1,20"}
        alerta={espera < 0.5}
      />
      <Texto
        x={540}
        y={420}
        color={C.red}
        size={44}
        op={aparece(t, T.boca) * (1 - espera)}
      >
        lectura falsa
      </Texto>
      <Texto x={540} y={420} color={C.cyan} size={44} op={espera}>
        esperan unos minutos
      </Texto>
    </Lienzo>
  );
};

// G. Cierre
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.habla, T.fin + 0.5], [1, 1.05])}>
      <Aparato x={540} y={900} s={1.6} lectura="0,45" alerta />
      <Soplido x={540} y={420} t={t} op={1} />
    </Lienzo>
  );
};
