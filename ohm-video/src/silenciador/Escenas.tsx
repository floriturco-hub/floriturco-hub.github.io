import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Decibelios, Mach, Salida, Supresor } from "./Piezas";

// Instantes clave (s) de public/audio/silenciador/narracion.wav (voz x1,05), sacados con Whisper
export const T = {
  disparo: 2.4,
  ciento60: 4.3,
  avion: 6.12,
  ciento30: 8.24,
  martillo: 10.74,
  dentro: 13.08,
  bala: 14.24,
  gases: 16.06,
  botella: 19.18,
  tubo: 21.08,
  camaras: 22.94,
  entran: 24.82,
  menos: 30.64,
  dos: 32.8,
  supersonico: 34.9,
  chasquido: 37.36,
  mecanismo: 39.6,
  supresor: 42.3,
  suprime: 44.5,
  oidos: 46.26,
  susurro: 48.52,
  trueno: 50.26,
  fin: 51.6,
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

// A. Gancho: el "piu" es mentira
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tacha = interpolate(t, [0.3, 0.6], [0, 1], clamp);
  const bang = aparece(t, 1.0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.disparo], [1.06, 1])}>
        <Texto x={540} y={760} color={C.grey} size={180} op={1 - bang * 0.7}>
          «piu»
        </Texto>
        <line
          x1={240}
          y1={820}
          x2={840}
          y2={600}
          stroke={C.red}
          strokeWidth={22}
          strokeLinecap="round"
          opacity={tacha}
        />
        <g
          opacity={bang}
          transform={`translate(540 1150) scale(${0.8 + 0.2 * bang})`}
        >
          <Texto x={0} y={0} color={C.orange} size={150}>
            ¡BANG!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={1.0} />
    </>
  );
};

// B. Decibelios: sin y con supresor
export const Db: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.disparo, T.dentro], [1, 1.04])}>
      <Decibelios
        x={120}
        y={560}
        w={740}
        filas={[
          ["disparo sin supresor", 160, C.red, aparece(t, T.ciento60)],
          ["avión despegando cerca", 140, C.grey, aparece(t, T.avion)],
          ["con supresor", 130, C.orange, aparece(t, T.ciento30)],
          ["martillo neumático", 120, C.grey, aparece(t, T.martillo)],
        ]}
      />
    </Lienzo>
  );
};

// C. El ruido lo hacen los gases que salen a presión
export const Gases: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const boom = ((t - T.gases) % 1.6) / 1.6;
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.tubo], [1, 1.04])}>
      <Salida x={480} y={900} t={t} boom={t > T.gases ? boom : 0} />
      <Texto
        x={540}
        y={500}
        color={C.white}
        size={44}
        op={aparece(t, T.bala) * (1 - aparece(t, T.gases))}
      >
        no es la bala…
      </Texto>
      <Texto
        x={540}
        y={500}
        color={C.orange}
        size={44}
        op={aparece(t, T.gases)}
      >
        son los gases a presión
      </Texto>
      <Texto
        x={540}
        y={1250}
        color={C.grey}
        size={36}
        op={aparece(t, T.botella)}
      >
        como descorchar una botella gigante
      </Texto>
    </Lienzo>
  );
};

// D. El supresor: cámaras que frenan y enfrían el gas
export const Camaras: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const menos = aparece(t, T.menos);
  return (
    <Lienzo zoom={interpolate(t, [T.tubo, T.dos], [1, 1.04])}>
      <Supresor
        x={100}
        y={820}
        w={880}
        t={t}
        gas={aparece(t, T.entran)}
        corte={interpolate(t, [T.tubo, T.camaras + 0.4], [0, 1], suave)}
      />
      <Texto
        x={540}
        y={540}
        color={C.white}
        size={44}
        op={aparece(t, T.camaras)}
      >
        cámaras separadas por placas
      </Texto>
      <Texto
        x={540}
        y={1100}
        color={C.cyan}
        size={40}
        op={aparece(t, T.entran)}
      >
        chocan, giran, se enfrían
      </Texto>
      <g opacity={menos}>
        <Texto x={540} y={1260} color={C.yellow} size={44}>
          menos presión = menos ruido
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Lo que no puede borrar: el chasquido supersónico y el mecanismo
export const NoBorra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dos, T.supresor], [1, 1.04])}>
      <Texto x={540} y={420} color={C.white} size={44} op={aparece(t, T.dos)}>
        2 sonidos que no borra
      </Texto>
      <Mach
        x={interpolate(
          t,
          [T.supersonico, T.supersonico + 2],
          [500, 900],
          clamp,
        )}
        y={800}
        op={aparece(t, T.supersonico)}
      />
      <g opacity={aparece(t, T.mecanismo)} transform="translate(540 1200)">
        <rect
          x={-180}
          y={-50}
          width={360}
          height={100}
          rx={16}
          fill="#3A3A4A"
          stroke="#8A8A9A"
          strokeWidth={6}
        />
        <rect
          x={-160 + 40 * Math.abs(Math.sin(t * 6))}
          y={-36}
          width={200}
          height={72}
          rx={10}
          fill="#5A5A6A"
        />
        <text
          y={110}
          textAnchor="middle"
          fill={C.white}
          fontFamily={mono}
          fontSize={36}
          fontWeight={700}
        >
          ¡clac!
        </text>
      </g>
    </Lienzo>
  );
};

// F. Supresor: no silencia, suprime
export const Suprime: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.supresor, T.susurro], [1, 1.04])}>
      <Texto
        x={540}
        y={720}
        color={C.grey}
        size={70}
        op={aparece(t, T.supresor)}
      >
        silenciador
      </Texto>
      <line
        x1={260}
        y1={700}
        x2={820}
        y2={700}
        stroke={C.red}
        strokeWidth={12}
        opacity={aparece(t, T.suprime)}
      />
      <Texto
        x={540}
        y={900}
        color={C.yellow}
        size={90}
        op={aparece(t, T.suprime)}
      >
        supresor
      </Texto>
      <Texto x={540} y={1150} color={C.cyan} size={40} op={aparece(t, T.oidos)}>
        protege los oídos
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: susurro vs trueno
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.susurro, T.fin + 0.5], [1, 1.05])}>
      <Texto
        x={540}
        y={720}
        color={C.grey}
        size={80}
        op={aparece(t, T.susurro)}
      >
        «piu»
      </Texto>
      <line
        x1={340}
        y1={740}
        x2={740}
        y2={640}
        stroke={C.red}
        strokeWidth={16}
        opacity={aparece(t, T.susurro)}
      />
      <Texto
        x={540}
        y={1000}
        color={C.orange}
        size={130}
        op={aparece(t, T.trueno)}
      >
        ¡BOOM!
      </Texto>
    </Lienzo>
  );
};
