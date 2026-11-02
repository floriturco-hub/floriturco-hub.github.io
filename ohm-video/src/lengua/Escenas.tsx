import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import {
  BotonGustativo,
  Grafica,
  IconoSabor,
  Lengua,
  Libro,
  Pizca,
  SABOR,
  Sabor,
} from "./Piezas";

// Instantes clave (s) de public/audio/lengua/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  falso: 2.84,
  pizca: 5.7,
  segun: 6.92,
  dulce: 8.08,
  amargo: 9.68,
  salado: 11.1,
  acido: 11.78,
  pero: 13.08,
  pon: 13.64,
  notas: 15.68,
  donde: 17.22,
  n1901: 18.28,
  sensibles: 22.94,
  minimas: 24.18,
  decadas: 25.3,
  harvard: 26.64,
  grafica: 28.88,
  libros: 29.64,
  exclusivas: 31.32,
  territorio: 32.26,
  realidad: 34.64,
  miles: 35.76,
  paladar: 39.62,
  garganta: 40.42,
  cada: 41.38,
  cinco: 42.52,
  sDulce: 43.68,
  sSalado: 44.3,
  sAcido: 45.0,
  sAmargo: 45.64,
  umami: 46.38,
  ni: 48.72,
  asi: 50.64,
  barrios: 51.68,
  rincon: 53.3,
  fin: 55.1,
};

const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);
const pulso = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.2, d + 1.2], [0, 1, 0.35], clamp);

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

const Rotulo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly texto: string;
  readonly color: string;
  readonly op: number;
  readonly anchor?: "start" | "middle" | "end";
}> = ({ x, y, texto, color, op, anchor = "middle" }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={color}
    fontFamily={mono}
    fontSize={36}
    fontWeight={700}
    opacity={op}
  >
    {texto}
  </text>
);

// A. Gancho: el mapa del colegio es falso
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sello = interpolate(t, [T.falso - 0.05, T.falso + 0.2], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });
  const flash = interpolate(
    t,
    [T.falso, T.falso + 0.08, T.falso + 0.45],
    [0, 0.25, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.segun], [1, 1.06])}>
        <Lengua id="g" x={540} y={860} s={1.25} zonas={1} bordes={1} t={t} />
        <g
          transform={`translate(540 860) rotate(-14) scale(${0.4 + 0.6 * sello})`}
          opacity={sello}
        >
          <rect
            x={-290}
            y={-90}
            width={580}
            height={180}
            rx={20}
            fill={C.bg}
            fillOpacity={0.85}
            stroke={C.red}
            strokeWidth={14}
          />
          <text
            y={44}
            textAnchor="middle"
            fill={C.red}
            fontFamily={mono}
            fontSize={130}
            fontWeight={700}
          >
            FALSO
          </text>
        </g>
        <Pizca
          x={800}
          y={430}
          caida={interpolate(t, [T.pizca, T.segun], [0, 0.6], clamp)}
          op={aparece(t, T.pizca - 0.6)}
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

// B. El mapa: cada sabor en su zona
export const Mapa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const res = {
    dulce: pulso(t, T.dulce),
    amargo: pulso(t, T.amargo),
    salado: pulso(t, T.salado),
    acido: pulso(t, T.acido),
  };
  return (
    <Lienzo zoom={interpolate(t, [T.segun, T.pero], [1, 1.04])}>
      <Lengua
        id="m"
        x={540}
        y={860}
        s={1.25}
        zonas={aparece(t, T.segun)}
        res={res}
        t={t}
      />
      <Rotulo
        x={540}
        y={1400}
        texto="dulce"
        color={SABOR.dulce}
        op={aparece(t, T.dulce)}
      />
      <Rotulo
        x={540}
        y={340}
        texto="amargo"
        color={SABOR.amargo}
        op={aparece(t, T.amargo)}
      />
      <Rotulo
        x={130}
        y={1080}
        texto="salado"
        color={SABOR.salado}
        op={aparece(t, T.salado)}
      />
      <Rotulo
        x={950}
        y={1080}
        texto="salado"
        color={SABOR.salado}
        op={aparece(t, T.salado)}
      />
      <Rotulo
        x={120}
        y={800}
        texto="ácido"
        color={SABOR.acido}
        op={aparece(t, T.acido)}
      />
      <Rotulo
        x={960}
        y={800}
        texto="ácido"
        color={SABOR.acido}
        op={aparece(t, T.acido)}
      />
    </Lienzo>
  );
};

// C. La prueba: azúcar al fondo, y sabe dulce
export const Prueba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const onda = interpolate(t, [T.notas, T.notas + 1.2], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.donde], [1, 1.06])} cy={700}>
      <Lengua id="p" x={540} y={860} s={1.25} zonas={1 - 0.6 * onda} t={t} />
      <Pizca
        x={540}
        y={370}
        caida={interpolate(t, [T.pon, T.notas], [0, 1], clamp)}
        dist={140}
        op={1 - aparece(t, T.notas + 0.6)}
      />
      <circle
        cx={540}
        cy={480}
        r={60 + 340 * onda}
        fill={SABOR.dulce}
        opacity={0.5 * (1 - onda) * aparece(t, T.notas)}
      />
      <circle
        cx={540}
        cy={480}
        r={40 + 200 * onda}
        fill="none"
        stroke={SABOR.dulce}
        strokeWidth={10}
        opacity={aparece(t, T.notas) * (1 - 0.6 * onda)}
      />
      <Rotulo
        x={540}
        y={1450}
        texto="¡dulce!"
        color={SABOR.dulce}
        op={aparece(t, T.notas)}
      />
    </Lienzo>
  );
};

// D. 1901: diferencias mínimas
export const Origen: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.donde, T.decadas], [1, 1.04])}>
      <g opacity={aparece(t, T.donde) * (1 - aparece(t, T.n1901))}>
        <Lengua id="o" x={540} y={860} s={0.9} zonas={0.5} bordes={0.6} t={t} />
        <text x={540} y={960} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={340} fontWeight={700}>
          ?
        </text>
      </g>
      <g opacity={aparece(t, T.n1901)}>
        <text
          x={540}
          y={430}
          textAnchor="middle"
          fill={C.yellow}
          fontFamily={mono}
          fontSize={110}
          fontWeight={700}
        >
          1901
        </text>
        <text
          x={540}
          y={500}
          textAnchor="middle"
          fill={C.grey}
          fontFamily={mono}
          fontSize={30}
        >
          un científico alemán mide
        </text>
      </g>
      <g opacity={aparece(t, T.n1901 + 1.2)}>
        <Grafica
          x={90}
          y={600}
          w={900}
          h={640}
          amp={interpolate(t, [T.sensibles, T.minimas], [0, 60], clamp)}
          p={interpolate(t, [T.n1901 + 1.4, T.sensibles], [0, 1], clamp)}
          titulo="datos reales"
          escala="escala real"
        />
      </g>
    </Lienzo>
  );
};

// E. Harvard: la misma gráfica, exagerada
export const Harvard: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const estira = interpolate(t, [T.grafica - 0.2, T.grafica + 0.8], [60, 380], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Lienzo zoom={interpolate(t, [T.decadas, T.libros], [1, 1.04])}>
      <g opacity={aparece(t, T.decadas)}>
        <text
          x={540}
          y={430}
          textAnchor="middle"
          fill={C.white}
          fontFamily={mono}
          fontSize={90}
          fontWeight={700}
        >
          Décadas después
        </text>
        <text
          x={540}
          y={500}
          textAnchor="middle"
          fill={C.grey}
          fontFamily={mono}
          fontSize={30}
          opacity={aparece(t, T.harvard)}
        >
          un psicólogo de Harvard la redibuja
        </text>
      </g>
      <Grafica
        x={90}
        y={600}
        w={900}
        h={640}
        amp={estira}
        p={1}
        titulo="misma gráfica"
        escala="sin escala"
      />
    </Lienzo>
  );
};

// F. Los libros: zonas exclusivas, como territorios
export const Libros: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bordes = aparece(t, T.exclusivas);
  return (
    <Lienzo zoom={interpolate(t, [T.libros, T.realidad], [1, 1.08])}>
      <g opacity={aparece(t, T.libros)}>
        <Libro x={540} y={880} s={1.1}>
          <Lengua
            id="l"
            x={220}
            y={0}
            s={0.62}
            zonas={1}
            bordes={bordes}
            t={t}
          />
        </Libro>
      </g>
      <g
        opacity={aparece(t, T.territorio)}
        fontFamily={mono}
        fontWeight={700}
        fontSize={34}
      >
        <text x={782} y={510} textAnchor="middle" fill={SABOR.amargo}>
          solo amargo
        </text>
        <text x={782} y={1290} textAnchor="middle" fill={SABOR.dulce}>
          solo dulce
        </text>
      </g>
    </Lienzo>
  );
};

// G. La realidad: botones gustativos por todas partes
export const Realidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const otros = aparece(t, T.paladar);
  return (
    <Lienzo zoom={interpolate(t, [T.realidad, T.cada], [1, 1.04])}>
      <g transform={`translate(0 ${160 * otros})`}>
        <Lengua
          id="r"
          x={540}
          y={860}
          s={1.2 - 0.25 * otros}
          t={t}
          botones={interpolate(t, [T.miles, T.miles + 2.2], [0, 1], clamp)}
        />
      </g>
      <g opacity={otros}>
        <path
          d="M 180 500 Q 540 170 900 500"
          stroke="#E87890"
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
        />
        {new Array(12).fill(0).map((_, k) => {
          const u = (k + 0.5) / 12;
          const px = 180 + u * 720;
          const py = 500 - Math.sin(u * Math.PI) * 165 + 24;
          return <circle key={k} cx={px} cy={py} r={9} fill="#F8D0DA" />;
        })}
        <text
          x={540}
          y={250}
          textAnchor="middle"
          fill={C.white}
          fontFamily={mono}
          fontSize={34}
          fontWeight={700}
        >
          paladar
        </text>
      </g>
      <g opacity={aparece(t, T.garganta)}>
        <ellipse
          cx={540}
          cy={585}
          rx={90}
          ry={40}
          fill="#5A1E30"
          stroke="#E87890"
          strokeWidth={6}
        />
        {[-50, -16, 18, 52].map((d) => (
          <circle
            key={d}
            cx={540 + d}
            cy={585 + (d % 3) * 4}
            r={8}
            fill="#F8D0DA"
          />
        ))}
        <text
          x={650}
          y={596}
          textAnchor="start"
          fill={C.white}
          fontFamily={mono}
          fontSize={30}
          fontWeight={700}
        >
          garganta
        </text>
      </g>
    </Lienzo>
  );
};

// H. Un botón gustativo detecta los cinco sabores
const SABORES: [Sabor, number][] = [
  ["dulce", T.sDulce],
  ["salado", T.sSalado],
  ["acido", T.sAcido],
  ["amargo", T.sAmargo],
  ["umami", T.umami],
];
export const Boton: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const luces: Partial<Record<Sabor, number>> = {};
  SABORES.forEach(([s, d]) => {
    luces[s] = aparece(t, d);
  });
  const resUmami = aparece(t, T.ni);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.asi], [1, 1.04])}>
      <g opacity={aparece(t, T.cada)}>
        <BotonGustativo x={540} y={700} s={1.25} t={t} luces={luces} />
        <text
          x={540}
          y={1060}
          textAnchor="middle"
          fill={C.grey}
          fontFamily={mono}
          fontSize={30}
        >
          un botón gustativo
        </text>
      </g>
      {SABORES.map(([s, d], k) => (
        <IconoSabor
          key={s}
          sabor={s}
          x={120 + k * 210}
          y={1220}
          s={0.85}
          op={aparece(t, d)}
        />
      ))}
      <g opacity={resUmami}>
        <rect
          x={880}
          y={1130}
          width={170}
          height={210}
          rx={20}
          fill="none"
          stroke={C.yellow}
          strokeWidth={5}
        />
        <text
          x={965}
          y={1380}
          textAnchor="middle"
          fill={C.yellow}
          fontFamily={mono}
          fontSize={24}
          fontWeight={700}
        >
          no estaba
        </text>
        <text
          x={965}
          y={1410}
          textAnchor="middle"
          fill={C.yellow}
          fontFamily={mono}
          fontSize={24}
          fontWeight={700}
        >
          en el mapa
        </text>
      </g>
    </Lienzo>
  );
};

// I. Cierre: la lengua no tiene barrios
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sinBordes = aparece(t, T.barrios + 0.4);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.06])}>
      <Lengua
        id="c"
        x={540}
        y={860}
        s={1.25}
        zonas={0.6 * (1 - sinBordes)}
        bordes={1 - sinBordes}
        botones={1}
        mezcla={aparece(t, T.rincon)}
        t={t}
      />
    </Lienzo>
  );
};
