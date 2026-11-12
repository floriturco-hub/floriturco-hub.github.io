import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Barco, Bunuelo, Fuerzas, Paila, Termometro } from "./Piezas";

// Instantes clave (s) de public/audio/bunuelos/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  toca: 0.48,
  voltean: 2.22,
  magia: 4.14,
  barco: 5.1,
  cae: 7.36,
  abajo: 9.2,
  hierve: 11.26,
  vapor: 13.16,
  huequitos: 14.82,
  liviana: 16.76,
  arriba: 18.5,
  cruda: 20.16,
  pesada: 21.04,
  empuja: 22.52,
  centro: 23.6,
  peso: 24.84,
  concentrado: 25.82,
  barco2: 27.36,
  techo: 28.62,
  girar: 29.16,
  abajo2: 31.46,
  otra: 33.42,
  aligera: 35.48,
  vueltas: 37.52,
  dorado: 39.82,
  caliente: 41.88,
  costra: 44.8,
  revienta: 46.36,
  pum: 48.88,
  asi: 49.86,
  punto: 52.4,
  fin: 54.0,
};

const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);
const giro = (t: number, d: number, dur = 0.9) =>
  180 *
  interpolate(t, [d, d + dur], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

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

// Tres buñuelos flotando que giran a destiempo
const Trio: React.FC<{
  readonly t: number;
  readonly y: number;
  readonly giros: number[];
  readonly id: string;
}> = ({ t, y, giros, id }) => (
  <>
    {[220, 540, 860].map((x, k) => {
      const rot = giros.reduce(
        (acc, g, i) => acc + (i % 3 === k ? giro(t, g) : 0),
        0,
      );
      const bob = Math.sin(t * 3 + k * 2) * 6;
      return (
        <Bunuelo
          key={k}
          id={`${id}${k}`}
          x={x}
          y={y + bob}
          r={120}
          rot={rot + k * 8}
          a={1}
          b={0.3}
          t={t}
          vapor={0.6}
        />
      );
    })}
  </>
);

// A. Gancho: se voltean solos
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const flash = interpolate(
    t,
    [T.voltean, T.voltean + 0.08, T.voltean + 0.45],
    [0, 0.22, 0],
    clamp,
  );
  const barco = aparece(t, T.barco);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cae], [1, 1.07])}>
        <Paila y={880} t={t} />
        <Trio
          t={t}
          y={880}
          giros={[0.5, 1.6, T.voltean, 3.3, 4.6, 5.6]}
          id="g"
        />
        <g opacity={barco}>
          <Texto x={540} y={500} color={C.yellow} size={44}>
            como un barco que se vuelca
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

// B. Se cocina abajo, se aligera; arriba sigue cruda y pesada
export const Cocina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = interpolate(t, [T.abajo, T.liviana], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cae, T.empuja], [1, 1.05])}>
      <Paila y={900} t={t} />
      <Bunuelo
        id="c"
        x={540}
        y={interpolate(t, [T.cae, T.cae + 0.7], [500, 900], {
          ...clamp,
          easing: Easing.out(Easing.bounce),
        })}
        r={230}
        rot={0}
        a={a}
        b={0}
        t={t}
        vapor={aparece(t, T.vapor)}
      />
      <g opacity={aparece(t, T.abajo) * (1 - aparece(t, T.vapor))}>
        <Texto x={540} y={1250} color={"#2A1236"} size={40}>
          se cocina primero
        </Texto>
      </g>
      <g opacity={aparece(t, T.huequitos)}>
        <Texto x={880} y={1080} color={"#2A1236"} size={36} anchor="start">
          huecos
        </Texto>
        <path d="M 870 1068 L 760 1000" stroke={"#2A1236"} strokeWidth={5} />
      </g>
      <g opacity={aparece(t, T.liviana)}>
        <Texto x={540} y={1250} color={"#2A1236"} size={44}>
          liviana
        </Texto>
      </g>
      <g opacity={aparece(t, T.cruda)}>
        <Texto x={540} y={600} color={C.white} size={44}>
          cruda
        </Texto>
      </g>
      <g opacity={aparece(t, T.pesada)}>
        <Texto x={540} y={540} color={C.red} size={52}>
          pesada
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Fuerzas: el aceite empuja desde el centro, el peso tira desde arriba
export const Fuerzas_: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tiembla = Math.sin(t * 14) * 4 * aparece(t, T.concentrado);
  return (
    <Lienzo zoom={interpolate(t, [T.empuja, T.barco2], [1, 1.05])}>
      <Paila y={900} t={t} />
      <Bunuelo
        id="f"
        x={540}
        y={900}
        r={230}
        rot={tiembla}
        a={1}
        b={0}
        t={t}
        vapor={0.4}
      />
      <g opacity={aparece(t, T.empuja)}>
        <Fuerzas x={540} y={900} r={230} cg={-95} op={1} etiquetas={false} />
      </g>
      <Texto
        x={420}
        y={480}
        color={C.cyan}
        op={aparece(t, T.centro)}
        anchor="end"
      >
        empuje
      </Texto>
      <Texto
        x={640}
        y={1300}
        color={"#2A1236"}
        op={aparece(t, T.peso)}
        anchor="start"
      >
        peso arriba
      </Texto>
      <g opacity={aparece(t, T.concentrado)}>
        <path
          d="M 860 700 A 160 160 0 0 1 860 1000"
          stroke={C.yellow}
          strokeWidth={10}
          fill="none"
        />
        <path
          d="M 836 978 L 862 1012 L 890 982"
          stroke={C.yellow}
          strokeWidth={10}
          fill="none"
        />
      </g>
    </Lienzo>
  );
};

// D. Como un barco con la carga en el techo
export const BarcoEscena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rot =
    interpolate(t, [T.girar, T.abajo2 + 0.6], [0, 180], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }) +
    Math.sin(t * 3) * 4 * (1 - aparece(t, T.girar));
  return (
    <Lienzo zoom={interpolate(t, [T.barco2, T.otra], [1, 1.04])}>
      <Barco x={540} y={560} rot={rot} t={t} />
      <Texto x={540} y={300} color={C.red} op={aparece(t, T.techo)} size={40}>
        carga en el techo
      </Texto>
      <Paila y={1080} t={t} nivel={0} fondo={360} />
      <Bunuelo
        id="b"
        x={540}
        y={1080}
        r={170}
        rot={rot}
        a={1}
        b={0}
        t={t}
        vapor={0.5}
      />
    </Lienzo>
  );
};

// E. Se cocina la otra cara y vuelve a girar: dorado parejo
export const OtraCara: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = interpolate(t, [T.otra, T.aligera], [0, 1], clamp);
  const rot =
    180 +
    giro(t, T.aligera + 0.6) +
    giro(t, T.vueltas + 0.3, 0.7) +
    giro(t, T.vueltas + 1.3, 0.7) +
    giro(t, T.vueltas + 2.3, 0.7);
  return (
    <Lienzo zoom={interpolate(t, [T.otra, T.caliente], [1, 1.05])}>
      <Paila y={900} t={t} />
      <Bunuelo
        id="o"
        x={540}
        y={900}
        r={230}
        rot={rot}
        a={1}
        b={b}
        t={t}
        vapor={0.7}
      />
      <g opacity={aparece(t, T.dorado)}>
        <Texto x={540} y={560} color={C.yellow} size={52}>
          redondo y dorado
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Aceite demasiado caliente: se revienta
export const Caliente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const costra = interpolate(t, [T.costra, T.costra + 0.8], [0, 1], clamp);
  const pum = interpolate(t, [T.pum - 0.05, T.pum + 0.15], [0, 1], clamp);
  const flash = interpolate(
    t,
    [T.pum, T.pum + 0.08, T.pum + 0.45],
    [0, 0.3, 0],
    clamp,
  );
  const sacude = (1 - pum) * Math.sin(t * 40) * 6 * aparece(t, T.revienta);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.caliente, T.asi], [1, 1.06])}>
        <Paila y={900} t={t} calor={aparece(t, T.caliente)} burbujas={1.4} />
        <Termometro
          x={960}
          y={330}
          nivel={interpolate(
            t,
            [T.caliente, T.caliente + 1],
            [0.5, 0.95],
            clamp,
          )}
          op={aparece(t, T.caliente)}
        />
        <Bunuelo
          id="r"
          x={540 + sacude}
          y={900}
          r={230}
          rot={0}
          a={costra}
          b={costra}
          t={t}
          vapor={0}
          grieta={pum}
        />
        <g opacity={aparece(t, T.costra) * (1 - pum)}>
          <Texto x={540} y={560} color={C.orange} size={44}>
            costra de golpe
          </Texto>
        </g>
        <g opacity={aparece(t, T.revienta) * (1 - pum)}>
          {[0, 1, 2, 3, 4].map((k) => (
            <circle
              key={k}
              cx={480 + k * 30}
              cy={830 + Math.sin(t * 9 + k) * 20}
              r={14}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={4}
              opacity={0.8}
            />
          ))}
        </g>
        <g opacity={pum}>
          {new Array(10).fill(0).map((_, k) => {
            const ang = (k / 10) * Math.PI * 2;
            const d = 260 + 120 * pum;
            return (
              <line
                key={k}
                x1={540 + Math.cos(ang) * 240}
                y1={900 + Math.sin(ang) * 240}
                x2={540 + Math.cos(ang) * d}
                y2={900 + Math.sin(ang) * d}
                stroke={C.yellow}
                strokeWidth={10}
                strokeLinecap="round"
              />
            );
          })}
          <Texto x={540} y={560} color={C.red} size={70}>
            ¡PUM!
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

// G. Cierre: si se voltean solos, el aceite está en su punto
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ok = aparece(t, T.punto);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.05])}>
      <Paila y={980} t={t} fondo={420} />
      <Trio
        t={t}
        y={980}
        giros={[
          T.asi + 0.3,
          T.asi + 0.9,
          T.asi + 1.5,
          T.punto - 0.4,
          T.punto + 0.3,
          T.punto + 1,
        ]}
        id="z"
      />
      <Termometro x={540} y={300} nivel={0.6} op={1} />
      <g opacity={ok}>
        <circle cx={680} cy={560} r={52} fill={C.yellow} />
        <path
          d="M 654 560 L 674 582 L 708 538"
          stroke={C.bg}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </Lienzo>
  );
};
