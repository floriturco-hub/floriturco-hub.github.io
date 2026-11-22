import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import {
  BateriaTachada,
  Campo,
  Datafono,
  Distancia,
  Modulacion,
  Tarjeta,
} from "./Piezas";

// Instantes clave (s) de public/audio/contactless/narracion.wav (voz x1,12), sacados con Whisper
export const T = {
  computador: 1.94,
  bateria: 3.42,
  energia: 4.98,
  aire: 6.06,
  acercas: 7.58,
  alumbras: 8.56,
  ve: 11.3,
  borde: 12.42,
  antena: 13.64,
  vueltas: 15.22,
  chip: 16.52,
  datafono: 17.38,
  campo: 18.3,
  cambia: 19.38,
  millones: 20.12,
  cuando: 22.9,
  induccion: 24.84,
  corriente: 25.92,
  cargador: 27.44,
  enciende: 29.3,
  milesimas: 31.6,
  responde: 33.22,
  ingenioso: 35.88,
  conecta: 37.32,
  cambia2: 39.84,
  unos: 43.48,
  centimetros: 45.0,
  debilita: 47.38,
  codigo: 50.1,
  copie: 52.94,
  cobro: 55.14,
  sin: 56.3,
  induccionFin: 57.38,
  fin: 58.2,
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

// A. Gancho: un computador sin batería que se enciende al acercarlo
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.aire, T.acercas], [0, 1], suave);
  const pago = aparece(t, T.acercas);
  const flash = interpolate(
    t,
    [T.acercas, T.acercas + 0.08, T.acercas + 0.45],
    [0, 0.25, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.alumbras], [1, 1.06])}>
        <g opacity={aparece(t, T.energia - 0.3)}>
          <Datafono
            x={540}
            y={1180}
            s={0.75}
            pantalla={pago > 0.5 ? "APROBADO" : "$ 12.500"}
            color={pago > 0.5 ? C.yellow : C.white}
          />
          <Campo x={540} y={940} t={t} op={0.4 + 0.6 * baja} />
        </g>
        <Tarjeta
          x={540}
          y={interpolate(baja, [0, 1], [640, 840])}
          s={1.35 - 0.35 * baja}
          rot={-6 + 6 * baja}
          energia={pago}
          t={t}
        />
        <g opacity={aparece(t, T.computador) * (1 - aparece(t, T.energia))}>
          <circle
            cx={540 - 215 * 1.35 + 85 * 1.35}
            cy={640 - 22 * 1.35}
            r={90}
            fill="none"
            stroke={C.yellow}
            strokeWidth={6}
          />
          <Texto x={300} y={470} color={C.yellow} size={40}>
            un computador
          </Texto>
        </g>
        <BateriaTachada x={820} y={330} op={aparece(t, T.bateria)} />
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

// B. Rayos X: la antena alrededor del borde
export const Antena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xray = interpolate(t, [T.alumbras + 0.6, T.ve + 0.3], [0, 1], suave);
  const luz = aparece(t, T.alumbras);
  return (
    <Lienzo zoom={interpolate(t, [T.alumbras, T.datafono], [1, 1.06])}>
      <g opacity={luz * (1 - 0.6 * xray)}>
        <path
          d="M 540 300 L 280 660 L 800 660 Z"
          fill="#FFF2C8"
          opacity={0.12}
        />
        <rect x={500} y={200} width={80} height={110} rx={14} fill="#5A5478" />
      </g>
      <Tarjeta x={540} y={900} s={1.9} xray={xray} t={t} />
      <g opacity={aparece(t, T.antena)}>
        <Texto x={540} y={1210} color="#E8A050" size={44}>
          antena: varias vueltas
        </Texto>
      </g>
      <g opacity={aparece(t, T.chip)}>
        <path d="M 260 650 L 300 820" stroke={C.yellow} strokeWidth={5} />
        <Texto x={250} y={630} color={C.yellow} size={44}>
          chip
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Campo alternante e inducción
export const Induccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.cuando, T.cuando + 1.2], [0, 1], suave);
  const energia = aparece(t, T.induccion + 0.4);
  const cuenta = Math.round(
    interpolate(t, [T.millones - 0.4, T.millones + 1.6], [0, 13560000], clamp),
  );
  return (
    <Lienzo zoom={interpolate(t, [T.datafono, T.enciende], [1, 1.04])}>
      <Datafono x={540} y={1180} s={0.75} pantalla="..." />
      <Campo x={540} y={940} t={t} op={aparece(t, T.campo)} hz={1.6} />
      <g opacity={aparece(t, T.millones - 0.4) * (1 - aparece(t, T.cuando))}>
        <Texto x={540} y={330} color={C.cyan} size={64}>
          {cuenta.toLocaleString("es-CO")}
        </Texto>
        <Texto x={540} y={400} color={C.grey} size={34}>
          cambios de sentido por segundo
        </Texto>
      </g>
      <g opacity={entra}>
        <Tarjeta
          x={540}
          y={interpolate(entra, [0, 1], [380, 700])}
          s={1.1}
          xray={1}
          energia={energia}
          t={t}
        />
      </g>
      <g opacity={aparece(t, T.cargador)}>
        <Texto x={540} y={300} color={C.yellow} size={40}>
          como un cargador inalámbrico
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. El chip se enciende en milésimas de segundo
export const Enciende: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const on = aparece(t, T.enciende + 1.4);
  const ms = interpolate(
    t,
    [T.milesimas - 0.3, T.milesimas + 0.6],
    [0, 0.003],
    clamp,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.enciende, T.responde], [1, 1.08])}>
      <Tarjeta x={540} y={880} s={1.9} xray={1} energia={on} t={t} />
      <Texto
        x={540}
        y={1240}
        color={C.yellow}
        size={60}
        op={aparece(t, T.milesimas)}
      >
        {`${ms.toFixed(3).replace(".", ",")} s`}
      </Texto>
      <Texto x={540} y={520} color={on > 0.5 ? C.yellow : C.grey} size={52}>
        {on > 0.5 ? "CHIP: ON" : "CHIP: OFF"}
      </Texto>
    </Lienzo>
  );
};

// E. Responde absorbiendo más o menos energía: unos y ceros
export const Respuesta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.conecta, T.unos + 0.8], [0, 1], clamp);
  const interruptor = Math.floor(t * 4) % 2 === 0;
  return (
    <Lienzo zoom={interpolate(t, [T.responde, T.centimetros], [1, 1.04])}>
      <Texto
        x={540}
        y={420}
        color={C.white}
        size={48}
        op={aparece(t, T.responde) * (1 - aparece(t, T.conecta))}
      >
        ¿cómo responde?
      </Texto>
      <g opacity={1 - aparece(t, T.conecta)}>
        <Tarjeta x={540} y={900} s={1.6} xray={1} energia={1} t={t} />
        <text x={540} y={1260} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={160} fontWeight={700}>
          ?
        </text>
      </g>
      <g opacity={aparece(t, T.conecta)} transform="translate(540 450)">
        <circle cx={-90} cy={0} r={14} fill={C.white} />
        <circle cx={90} cy={0} r={14} fill={C.white} />
        <line
          x1={-90}
          y1={0}
          x2={interruptor ? 90 : 60}
          y2={interruptor ? 0 : -70}
          stroke={C.yellow}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <text
          y={90}
          textAnchor="middle"
          fill={C.yellow}
          fontFamily={mono}
          fontSize={34}
          fontWeight={700}
        >
          conecta / desconecta
        </text>
      </g>
      <g opacity={aparece(t, T.conecta)}>
        <Modulacion x={130} y={960} w={820} p={p} t={t} />
      </g>
      <Texto
        x={540}
        y={1260}
        color={C.yellow}
        size={40}
        op={aparece(t, T.unos)}
      >
        el datáfono lee unos y ceros
      </Texto>
    </Lienzo>
  );
};

// F. Solo a pocos centímetros
export const Cerca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.centimetros, T.codigo], [1, 1.04])}>
      <Distancia
        x={100}
        y={560}
        w={880}
        h={620}
        p={interpolate(t, [T.centimetros, T.debilita + 1], [0, 1], suave)}
      />
    </Lienzo>
  );
};

// G. Código único en cada pago
const CODIGOS = ["8F3A-21C7", "B07E-9D42", "4C91-E6A0"];
export const Codigo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const copia = aparece(t, T.copie);
  const rechazo = aparece(t, T.cobro);
  return (
    <Lienzo zoom={interpolate(t, [T.codigo, T.sin], [1, 1.04])}>
      {CODIGOS.map((c, k) => (
        <g
          key={c}
          opacity={aparece(t, T.codigo + k * 0.7)}
          transform={`translate(140 ${420 + k * 150})`}
        >
          <rect
            width={800}
            height={110}
            rx={20}
            fill={C.card}
            stroke={C.cardBorder}
            strokeWidth={2}
          />
          <text
            x={40}
            y={70}
            fill={C.grey}
            fontFamily={mono}
            fontSize={32}
            fontWeight={700}
          >{`pago ${k + 1}`}</text>
          <text
            x={760}
            y={72}
            textAnchor="end"
            fill={C.cyan}
            fontFamily={mono}
            fontSize={44}
            fontWeight={700}
          >
            {c}
          </text>
        </g>
      ))}
      <g opacity={copia} transform="translate(140 920)">
        <rect
          width={800}
          height={130}
          rx={20}
          fill={C.card}
          stroke={rechazo > 0.5 ? C.red : C.cardBorder}
          strokeWidth={4}
        />
        <text
          x={40}
          y={80}
          fill={C.white}
          fontFamily={mono}
          fontSize={34}
          fontWeight={700}
        >
          copia
        </text>
        <text
          x={760}
          y={82}
          textAnchor="end"
          fill={C.grey}
          fontFamily={mono}
          fontSize={44}
          fontWeight={700}
        >
          8F3A-21C7
        </text>
      </g>
      <g opacity={rechazo}>
        <Texto x={540} y={1180} color={C.red} size={56}>
          RECHAZADO
        </Texto>
      </g>
    </Lienzo>
  );
};

// H. Cierre: sin batería, solo inducción
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.fin + 0.5], [1, 1.05])}>
      <BateriaTachada x={540} y={360} op={aparece(t, T.sin)} />
      <Datafono
        x={540}
        y={1180}
        s={0.75}
        pantalla="APROBADO"
        color={C.yellow}
      />
      <Campo x={540} y={940} t={t} op={1} hz={1.6} />
      <Tarjeta
        x={540}
        y={760}
        s={1}
        xray={aparece(t, T.induccionFin)}
        energia={1}
        t={t}
      />
    </Lienzo>
  );
};
