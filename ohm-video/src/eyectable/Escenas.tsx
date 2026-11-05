import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Asiento, Avion, GraficaG, Paracaidas } from "./Piezas";

// Instantes clave (s) de public/audio/eyectable/narracion.wav (voz x1,0), sacados con Whisper
export const T = {
  manija: 0,
  medio: 0,
  cientos: 0,
  cabina: 0,
  carga: 0,
  cartucho: 0,
  rieles: 0,
  patada: 0,
  columna: 0,
  progresiva: 0,
  sale: 0,
  cohete: 0,
  cola: 0,
  sensores: 0,
  paracaidas: 0,
  separa: 0,
  colgado: 0,
  doce: 0,
  recto: 0,
  medio2: 0,
  fin: 0,
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

// A. Gancho: te disparan fuera del avión
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sube = interpolate(t, [0.3, 1.3], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cabina], [1.05, 1])}>
        <Avion
          x={540 - 200 * sube}
          y={1000 + 80 * sube}
          s={1}
          cabina={sube > 0.05 ? 1 : 0}
          t={t}
        />
        <Asiento
          x={720 - 60 * sube}
          y={950 - 700 * sube}
          s={0.55}
          cohete={sube > 0.2 ? 1 : 0}
          t={t}
        />
        <Texto
          x={540}
          y={1400}
          color={C.grey}
          size={40}
          op={aparece(t, T.cientos)}
        >
          a cientos de km/h
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.3} />
    </>
  );
};

// B. Secuencia: cabina fuera, cartucho de gas, rieles
export const Secuencia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cabina = interpolate(t, [T.carga, T.carga + 0.8], [0, 1], clamp);
  const sube = interpolate(t, [T.cartucho + 0.4, T.patada], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cabina, T.patada], [1.6, 1.7])} cy={900}>
        <Avion x={400} y={1000} s={1} cabina={cabina} t={t} />
        <line
          x1={590}
          y1={960}
          x2={600}
          y2={560}
          stroke="#C8C8D8"
          strokeWidth={8}
          opacity={aparece(t, T.rieles)}
        />
        <Asiento x={590} y={950 - 300 * sube} s={0.55} t={t} />
        <Texto
          x={540}
          y={640}
          color={C.orange}
          size={30}
          op={aparece(t, T.carga) * (1 - aparece(t, T.cartucho))}
        >
          carga explosiva
        </Texto>
        <Texto
          x={540}
          y={640}
          color={C.cyan}
          size={30}
          op={aparece(t, T.cartucho)}
        >
          cartucho de gas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.carga} />
    </>
  );
};

// C. Empuje progresivo, no un golpe
export const Empuje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.patada, T.sale], [1, 1.04])}>
      <GraficaG
        x={100}
        y={620}
        w={880}
        h={560}
        p={interpolate(t, [T.progresiva, T.progresiva + 1.4], [0, 1], clamp)}
        suave={aparece(t, T.progresiva)}
      />
      <Texto
        x={540}
        y={500}
        color={C.red}
        size={40}
        op={aparece(t, T.columna) * (1 - aparece(t, T.progresiva))}
      >
        golpe brusco = columna rota
      </Texto>
      <Texto
        x={540}
        y={500}
        color={C.cyan}
        size={40}
        op={aparece(t, T.progresiva)}
      >
        empuje progresivo
      </Texto>
    </Lienzo>
  );
};

// D. El cohete lo aleja de la cola
export const Cohete: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.sale, T.paracaidas], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.sale, T.paracaidas], [1, 1.04])}>
      <Avion x={540 - 700 * p} y={1300 + 100 * p} s={0.7} cabina={1} t={t} />
      <Asiento
        x={560}
        y={1150 - 500 * p}
        s={0.6}
        rot={-10 * p}
        cohete={aparece(t, T.cohete)}
        t={t}
      />
      <Texto
        x={540}
        y={380}
        color={C.yellow}
        size={44}
        op={aparece(t, T.cohete) * (1 - aparece(t, T.sensores))}
      >
        se enciende un cohete
      </Texto>
      <Texto
        x={540}
        y={380}
        color={C.cyan}
        size={40}
        op={aparece(t, T.sensores)}
      >
        sensores: altura y velocidad
      </Texto>
    </Lienzo>
  );
};

// E. Paracaídas y separación del asiento
export const Separa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abre = interpolate(t, [T.paracaidas, T.paracaidas + 1], [0, 1], suave);
  const cae = interpolate(t, [T.separa, T.separa + 1.5], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  return (
    <Lienzo zoom={interpolate(t, [T.paracaidas, T.doce], [1, 1.04])}>
      <g transform={`translate(0 ${Math.sin(t * 2) * 10})`}>
        <Paracaidas x={540} y={760} abre={abre} />
        <Asiento x={540} y={900} s={0.6} piloto t={t} />
      </g>
      <g opacity={cae > 0 ? 1 - cae : 0}>
        <Asiento
          x={560 + 100 * cae}
          y={960 + 600 * cae}
          s={0.6}
          rot={40 * cae}
          piloto={false}
          t={t}
        />
      </g>
      <Texto
        x={540}
        y={1420}
        color={C.white}
        size={40}
        op={aparece(t, T.colgado)}
      >
        el piloto baja colgado
      </Texto>
    </Lienzo>
  );
};

// F. Más de 12 G: espalda recta
export const Doce: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = Math.round(interpolate(t, [T.doce, T.doce + 1], [1, 12], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.doce, T.medio2], [1, 1.04])}>
      <Texto x={540} y={560} color={C.red} size={140} op={aparece(t, T.doce)}>
        {`${g} G`}
      </Texto>
      <g opacity={aparece(t, T.recto)}>
        <Asiento x={540} y={1150} s={1.1} t={t} />
        <line
          x1={560}
          y1={940}
          x2={560}
          y2={1130}
          stroke={C.cyan}
          strokeWidth={8}
          strokeDasharray="14 10"
        />
        <Texto x={540} y={1380} color={C.cyan} size={40}>
          espalda recta
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Cierre: medio segundo
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const s = interpolate(t, [T.medio2, T.medio2 + 0.8], [0, 0.5], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.medio2, T.fin + 0.5], [1, 1.05])}>
      <Texto x={540} y={900} color={C.yellow} size={150}>
        {`${s.toFixed(1).replace(".", ",")} s`}
      </Texto>
    </Lienzo>
  );
};
