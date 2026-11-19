import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import {
  Aguila,
  Copa,
  Higado,
  Medidor,
  Persona,
  Tejido,
  Virus,
} from "./Piezas";

// Instantes clave (s) de public/audio/higado/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  dos: 0.64,
  semanas: 2.32,
  pero: 4.32,
  trozo: 6.08,
  crecer: 7.8,
  queda: 8.46,
  agranda: 10.24,
  tus: 11.9,
  hepatocitos: 13.12,
  reposo: 15.24,
  falta: 15.88,
  alarma: 17.38,
  despiertan: 19.52,
  copian: 21.2,
  dividen: 22.46,
  basta: 23.3,
  curioso: 26.38,
  parar: 27.86,
  cuando: 29.08,
  frenan: 31.74,
  gramo: 33.64,
  donacion: 35.08,
  alguien: 37.06,
  meses: 38.9,
  tanto: 39.72,
  griegos: 43.3,
  prometeo: 45.12,
  noche: 47.62,
  crecer2: 49.04,
  eso: 50.18,
  cicatrices: 50.92,
  alcohol: 52.86,
  hepatitis: 53.62,
  pierde: 54.38,
  fin: 55.6,
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

// A. Gancho: te quitan 2/3 y vuelve a su tamaño
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const quitar = interpolate(t, [T.dos + 0.5, T.semanas - 0.2], [0, 1], suave);
  const crece = interpolate(t, [T.semanas + 0.2, T.pero], [0, 1], suave);
  const flash = interpolate(
    t,
    [T.dos + 0.5, T.dos + 0.58, T.dos + 0.95],
    [0, 0.25, 0],
    clamp,
  );
  const dias = Math.round(interpolate(t, [T.semanas, T.pero], [0, 8], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.trozo], [1, 1.06])}>
        <Higado
          x={540}
          y={880}
          s={1.25}
          linea={interpolate(t, [0.1, T.dos + 0.4], [0, 1], clamp) * (1 - quitar)}
          quitar={quitar}
          crece={crece}
          fantasma={aparece(t, T.semanas) * 0.8}
        />
        <Texto
          x={300}
          y={600}
          color={C.red}
          op={aparece(t, T.dos) * (1 - aparece(t, T.semanas))}
          size={56}
        >
          2/3 fuera
        </Texto>
        <g opacity={aparece(t, T.semanas)}>
          <Texto x={540} y={1250} color={C.yellow} size={60}>
            {dias} semanas
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

// B. No vuelve a crecer el trozo: lo que queda se agranda
export const Forma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.agranda - 0.3, T.tus - 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.tus], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.trozo)}>
        <Higado x={540} y={880} s={1.25} quitar={1} crece={1} fantasma={0.8} />
        <text x={540} y={1300} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={200} fontWeight={700}>
          ?
        </text>
      </g>
      <g opacity={aparece(t, T.trozo)}>
        <Higado x={360} y={560} s={0.85} solo="D" />
        <g
          opacity={aparece(t, T.crecer - 0.4)}
          stroke={C.red}
          strokeWidth={16}
          strokeLinecap="round"
        >
          <line x1={150} y1={420} x2={430} y2={700} />
          <line x1={430} y1={420} x2={150} y2={700} />
        </g>
        <Texto x={300} y={800} color={C.red} op={aparece(t, T.crecer - 0.4)}>
          no vuelve a crecer
        </Texto>
      </g>
      <g opacity={aparece(t, T.queda)}>
        <Higado
          x={460}
          y={1150}
          s={0.9}
          quitar={1}
          crece={crece}
          fantasma={0.7}
        />
        {[-1, 1].map((l) => (
          <path
            key={l}
            d={`M ${540 + l * 330} 1150 l ${l * 60} 0 m ${-l * 22} -22 l ${l * 22} 22 l ${-l * 22} 22`}
            stroke={C.yellow}
            strokeWidth={8}
            fill="none"
            opacity={aparece(t, T.agranda)}
          />
        ))}
        <Texto x={540} y={1420} color={C.yellow} op={aparece(t, T.agranda)}>
          lo que queda se agranda
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Hepatocitos: en reposo, alarma, despiertan, copian ADN y se dividen
export const Celulas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const veces = t < T.basta + 1.2 ? 1 : 2;
  return (
    <Lienzo zoom={interpolate(t, [T.tus, T.curioso], [1, 1.04])}>
      <Tejido
        x={90}
        y={380}
        w={900}
        h={980}
        t={t}
        zzz={aparece(t, T.hepatocitos) * (1 - aparece(t, T.despiertan))}
        senales={aparece(t, T.alarma) * (1 - aparece(t, T.copian + 0.6))}
        brillo={interpolate(
          t,
          [T.despiertan, T.despiertan + 0.8],
          [0, 1],
          clamp,
        )}
        adn={t > T.copian && t < T.dividen + 1.2 ? 1 : 0}
        division={interpolate(t, [T.dividen, T.dividen + 1.6], [0, 1], clamp)}
      />
      <g opacity={aparece(t, T.basta)}>
        <rect
          x={340}
          y={1390}
          width={400}
          height={90}
          rx={20}
          fill={C.card}
          stroke={C.yellow}
          strokeWidth={4}
        />
        <Texto x={540} y={1448} color={C.yellow}>
          {`x${veces === 1 ? "1" : "2"} divisiones`}
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Saben cuándo parar
export const Freno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nivel = interpolate(t, [T.parar - 0.4, T.frenan], [0.35, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Lienzo zoom={interpolate(t, [T.curioso, T.donacion], [1, 1.04])}>
      <Higado
        x={560}
        y={680}
        s={0.8}
        quitar={1}
        crece={(nivel - 0.35) / 0.65}
        fantasma={0.6}
      />
      <Medidor
        x={360}
        y={960}
        h={420}
        nivel={nivel}
        freno={aparece(t, T.frenan)}
      />
    </Lienzo>
  );
};

// E. Donación en vida
export const Donacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const reparto = interpolate(t, [T.alguien, T.alguien + 1.2], [0, 1], suave);
  const crece = interpolate(t, [T.meses, T.tanto + 1.6], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.donacion, T.griegos], [1, 1.04])}>
      <g opacity={aparece(t, T.donacion)}>
        <Persona x={290} y={900} etiqueta="donante" color={C.cyan}>
          <Higado
            x={0}
            y={0}
            s={0.42}
            quitar={reparto}
            crece={crece}
            fantasma={reparto * 0.6}
          />
        </Persona>
        <Persona x={790} y={900} etiqueta="receptor" color={C.yellow}>
          <g opacity={reparto}>
            <Higado x={60} y={0} s={0.42} solo="D" creceD={crece} />
          </g>
        </Persona>
        <g opacity={reparto * (1 - crece)}>
          <path
            d="M 420 860 Q 540 760 660 860"
            stroke={C.white}
            strokeWidth={6}
            fill="none"
            strokeDasharray="14 10"
          />
          <path
            d="M 640 836 L 664 862 L 632 872"
            stroke={C.white}
            strokeWidth={6}
            fill="none"
          />
        </g>
      </g>
      <Texto
        x={540}
        y={1400}
        color={C.yellow}
        op={aparece(t, T.meses)}
        size={48}
      >
        en unos meses
      </Texto>
    </Lienzo>
  );
};

// F. Prometeo: el águila de día, la regeneración de noche
export const Prometeo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mordido =
    t < T.noche
      ? interpolate(t, [T.prometeo + 0.5, T.noche - 0.2], [0, 1], clamp)
      : interpolate(t, [T.noche + 0.2, T.crecer2 + 0.5], [1, 0], suave);
  const noche = interpolate(t, [T.noche - 0.3, T.noche + 0.3], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.griegos, T.eso], [1, 1.04])}>
      <g opacity={1 - noche}>
        <circle cx={850} cy={360} r={80} fill={C.yellow} />
        <Texto x={850} y={500} color={C.yellow} op={aparece(t, T.prometeo)}>
          día
        </Texto>
      </g>
      <g opacity={noche}>
        <circle cx={850} cy={360} r={80} fill="#E8E6F0" />
        <circle cx={885} cy={335} r={70} fill={C.bg} />
        <Texto x={850} y={500} color={C.white}>
          noche
        </Texto>
      </g>
      <path
        d="M 120 1380 L 260 1080 L 480 1020 L 700 1050 L 900 1120 L 980 1380 Z"
        fill="#3A3360"
        stroke="#5A5478"
        strokeWidth={6}
      />
      <Higado x={560} y={990} s={0.7} mordido={mordido} />
      <g opacity={(1 - noche) * aparece(t, T.prometeo - 0.4)}>
        <Aguila
          x={560 + Math.sin(t * 2) * 40}
          y={680 + Math.sin(t * 6) * 20}
          s={0.9}
          t={t}
        />
      </g>
      <Texto
        x={540}
        y={1480}
        color={C.grey}
        op={aparece(t, T.griegos)}
        size={32}
      >
        mito griego de Prometeo
      </Texto>
    </Lienzo>
  );
};

// G. Con cicatrices pierde el superpoder
export const Cicatrices: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.eso, T.fin + 0.5], [1, 1.05])}>
      <Higado
        x={540}
        y={720}
        s={1.05}
        cicatrices={interpolate(
          t,
          [T.cicatrices, T.cicatrices + 1.2],
          [0, 1],
          clamp,
        )}
      />
      <Copa x={330} y={1130} op={aparece(t, T.alcohol)} />
      <Virus x={750} y={1110} op={aparece(t, T.hepatitis)} t={t} />
      <Texto x={750} y={1270} op={aparece(t, T.hepatitis)} size={30}>
        hepatitis
      </Texto>
      <g
        opacity={aparece(t, T.pierde)}
        stroke={C.red}
        strokeWidth={18}
        strokeLinecap="round"
      >
        <line x1={300} y1={520} x2={780} y2={920} />
        <line x1={780} y1={520} x2={300} y2={920} />
      </g>
    </Lienzo>
  );
};
