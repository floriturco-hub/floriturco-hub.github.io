import { Easing, interpolate } from "remotion";
import { ChipTachado } from "../gasolina/Piezas";
import { C, clamp, H, mono, useT, W } from "../theme";
import {
  ACERO,
  Circuito,
  Dilatacion,
  Espiral,
  LATON,
  Plancha,
  puntaTira,
  Tira,
} from "./Piezas";

// Instantes clave (s) de public/audio/bimetal/narracion.wav (voz x1,15), sacados con Whisper
export const T = {
  chip: 1.62,
  apagarse: 4.1,
  secreto: 5.44,
  dos: 6.5,
  pelean: 7.62,
  tira: 8.42,
  lamina: 10.28,
  laton: 13.54,
  acero: 14.0,
  calor: 15.82,
  dilatan: 17.3,
  igual: 18.16,
  crece: 19.38,
  pegados: 21.76,
  curva: 25.38,
  haciaAcero: 26.4,
  plancha: 27.5,
  corriente: 28.64,
  contacto: 29.6,
  base: 31.5,
  dobla: 33.4,
  separa: 34.48,
  click: 35.96,
  resistencia: 36.78,
  enfriarse: 38.36,
  endereza: 39.26,
  enciende: 41.58,
  click2: 43.02,
  perilla: 45.98,
  acerca: 46.9,
  lejos: 48.8,
  caliente: 51.42,
  termostatos: 52.82,
  espiral: 55.54,
  sin: 56.84,
  fisica: 57.84,
  fin: 58.6,
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

const Llamas: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly t: number;
  readonly op: number;
}> = ({ x, y, w, t, op }) => (
  <g opacity={op}>
    {new Array(6).fill(0).map((_, k) => {
      const px = x + (k + 0.5) * (w / 6);
      const h = 70 + 20 * Math.sin(t * 9 + k * 1.7);
      return (
        <path
          key={k}
          d={`M ${px - 26} ${y} Q ${px - 30} ${y - h * 0.6} ${px} ${y - h} Q ${px + 30} ${y - h * 0.6} ${px + 26} ${y} Z`}
          fill={k % 2 ? C.orange : C.yellow}
          opacity={0.85}
        />
      );
    })}
  </g>
);

// A. Gancho: la plancha sin chip sabe cuándo apagarse
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const off = t > T.apagarse + 0.4;
  const flash = interpolate(
    t,
    [T.apagarse + 0.4, T.apagarse + 0.48, T.apagarse + 0.85],
    [0, 0.25, 0],
    clamp,
  );
  const metales = aparece(t, T.dos);
  const choque = Math.sin(t * 18) * 10 * aparece(t, T.pelean);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tira], [1, 1.06])}>
        <g opacity={1 - metales * 0.75}>
          <Plancha
            x={560}
            y={820}
            s={1.15}
            calor={off ? 0.5 : interpolate(t, [0, T.apagarse], [0.3, 1], clamp)}
            luz={!off}
          />
          <ChipTachado x={540} y={420} op={aparece(t, T.chip)} />
          <Texto
            x={540}
            y={1180}
            color={off ? C.grey : C.orange}
            size={52}
            op={aparece(t, T.apagarse - 0.4)}
          >
            {off ? "APAGADA" : "ENCENDIDA"}
          </Texto>
        </g>
        <g opacity={metales}>
          <rect
            x={150 + choque}
            y={1250}
            width={360}
            height={70}
            rx={12}
            fill={LATON}
          />
          <rect
            x={570 - choque}
            y={1250}
            width={360}
            height={70}
            rx={12}
            fill={ACERO}
          />
          <path
            d="M 540 1220 L 520 1280 L 548 1280 L 528 1350"
            stroke={C.yellow}
            strokeWidth={8}
            fill="none"
            opacity={aparece(t, T.pelean)}
          />
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

// B. La tira bimetálica
export const TiraEscena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tira, T.calor], [1.08, 1])}>
      <g opacity={aparece(t, T.tira)}>
        <Tira
          x={240}
          y={900}
          L={640}
          theta={0}
          h={40}
          etiquetas={aparece(t, T.laton)}
        />
      </g>
      <Texto x={540} y={600} color={C.yellow} size={50} op={aparece(t, T.tira)}>
        tira bimetálica
      </Texto>
      <Texto
        x={540}
        y={1150}
        color={C.white}
        size={34}
        op={aparece(t, T.lamina)}
      >
        dos metales unidos a lo largo
      </Texto>
    </Lienzo>
  );
};

// C. Dilatación: el latón crece más
export const DilatacionEscena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.calor, T.pegados], [1, 1.04])}>
      <Dilatacion
        x={150}
        y={720}
        w={560}
        p={interpolate(t, [T.dilatan, T.crece + 1], [0, 1], suave)}
      />
      <Llamas x={150} y={1150} w={780} t={t} op={aparece(t, T.calor)} />
      <Texto x={540} y={560} color={LATON} size={44} op={aparece(t, T.crece)}>
        el latón crece más
      </Texto>
    </Lienzo>
  );
};

// D. Pegados: la tira se curva hacia el acero
export const Curva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const theta = interpolate(
    t,
    [T.curva - 0.6, T.haciaAcero + 0.4],
    [0, 0.95],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.pegados, T.plancha], [1, 1.04])}>
      <Tira
        x={240}
        y={760}
        L={640}
        theta={theta}
        h={40}
        etiquetas={1}
        calor={theta}
      />
      <Llamas x={240} y={1350} w={640} t={t} op={1} />
      <Texto
        x={540}
        y={560}
        color={C.white}
        size={40}
        op={aparece(t, T.pegados)}
      >
        pegados: no pueden estirarse solos
      </Texto>
      <g opacity={aparece(t, T.haciaAcero)}>
        <Texto x={780} y={1260} color={ACERO} size={42}>
          hacia el acero
        </Texto>
      </g>
    </Lienzo>
  );
};

// Montaje de la plancha: tira invertida (acero arriba) que se curva hacia arriba y suelta el contacto de abajo
const Montaje: React.FC<{
  readonly t: number;
  readonly theta: number;
  readonly contactoY: number;
  readonly cerrado: boolean;
  readonly chispa: number;
  readonly calor: number;
}> = ({ t, theta, contactoY, cerrado, chispa, calor }) => {
  const X = 220;
  const Y = 760;
  const L = 600;
  const h = 30;
  const [px, py] = puntaTira(X, Y, L, theta);
  const tipY = 2 * Y - py;
  return (
    <g>
      <Circuito
        tx={X}
        ty={Y}
        cx={px}
        cy={contactoY}
        cerrado={cerrado}
        t={t}
        chispa={chispa}
      />
      <g transform={`translate(0 ${2 * Y}) scale(1 -1)`}>
        <Tira x={X} y={Y} L={L} theta={theta} h={h} calor={calor} />
      </g>
      <text
        x={X + 260}
        y={Y - 70}
        fill={ACERO}
        fontFamily={mono}
        fontSize={30}
        fontWeight={700}
      >
        acero
      </text>
      <text
        x={X + 260}
        y={Y + 90}
        fill={LATON}
        fontFamily={mono}
        fontSize={30}
        fontWeight={700}
      >
        latón
      </text>
      {cerrado ? <circle cx={px} cy={tipY + h} r={10} fill={C.cyan} /> : null}
    </g>
  );
};

// E. En la plancha: la tira abre y cierra el contacto
export const Contacto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciclo1 = interpolate(t, [T.dobla, T.separa + 0.3], [0, 0.32], suave);
  const vuelta = interpolate(t, [T.endereza, T.enciende], [0, 0.32], suave);
  const ciclo2 =
    interpolate(t, [T.click2, T.click2 + 0.5], [0, 0.32], suave) -
    interpolate(t, [T.click2 + 1.2, T.click2 + 1.9], [0, 0.32], suave);
  const theta = ciclo1 - vuelta + ciclo2;
  const abierto = theta > 0.2;
  const chispa = Math.max(
    interpolate(t, [T.click, T.click + 0.35], [0, 1], clamp) *
      (t < T.click + 0.35 ? 1 : 0),
    interpolate(t, [T.click2 + 0.3, T.click2 + 0.65], [0, 1], clamp) *
      (t > T.click2 + 0.3 && t < T.click2 + 0.65 ? 1 : 0),
  );
  const flash = interpolate(
    t,
    [T.click, T.click + 0.08, T.click + 0.4],
    [0, 0.2, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.plancha, T.perilla], [1, 1.04])}>
        <Plancha
          x={560}
          y={330}
          s={0.55}
          calor={abierto ? 0.6 : 0.85}
          luz={!abierto}
        />
        <Montaje
          t={t}
          theta={theta}
          contactoY={760 + 30 + 14}
          cerrado={!abierto}
          chispa={chispa}
          calor={abierto ? 0.8 : 0.3}
        />
        <Texto
          x={540}
          y={1050}
          color={abierto ? C.red : C.cyan}
          size={60}
          op={aparece(t, T.click)}
        >
          {abierto ? "clic: OFF" : "ON"}
        </Texto>
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

// F. La perilla aleja el contacto: más calor
export const Perilla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lejos = interpolate(t, [T.acerca + 0.3, T.lejos + 0.6], [0, 1], suave);
  const theta = interpolate(
    t,
    [T.lejos + 0.8, T.caliente],
    [0, 0.32 + 0.3 * lejos],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.perilla, T.termostatos], [1, 1.04])}>
      <Plancha
        x={560}
        y={330}
        s={0.55}
        calor={0.5 + 0.5 * lejos}
        luz
        perilla={lejos * 120}
      />
      <Montaje
        t={t}
        theta={theta}
        contactoY={760 + 30 + 14 + 120 * lejos}
        cerrado={theta < 0.2 + 0.3 * lejos}
        chispa={0}
        calor={0.3 + 0.6 * lejos}
      />
      <Texto
        x={540}
        y={1050}
        color={C.yellow}
        size={44}
        op={aparece(t, T.lejos)}
      >
        más lejos = más caliente
      </Texto>
    </Lienzo>
  );
};

// G. Termostato antiguo en espiral
export const Termostato: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.termostatos, T.sin], [1, 1.05])}>
      <Espiral
        x={540}
        y={860}
        giro={Math.sin((t - T.termostatos) * 1.6) * 0.9}
      />
      <Texto
        x={540}
        y={500}
        color={C.white}
        size={44}
        op={aparece(t, T.termostatos)}
      >
        termostato antiguo
      </Texto>
      <Texto
        x={540}
        y={1210}
        color={LATON}
        size={40}
        op={aparece(t, T.espiral)}
      >
        bimetal en espiral
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: sin electrónica, solo física
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.fin + 0.5], [1, 1.05])}>
      <ChipTachado x={540} y={560} op={aparece(t, T.sin)} />
      <g opacity={aparece(t, T.fisica)}>
        <Tira
          x={240}
          y={960}
          L={640}
          theta={0.4 + 0.15 * Math.sin(t * 3)}
          h={40}
        />
      </g>
    </Lienzo>
  );
};
