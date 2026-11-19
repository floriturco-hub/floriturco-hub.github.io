import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/balistica/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  arma: 1.88,
  final: 4.58,
  canon: 6.34,
  estrias: 7.78,
  girar: 9.04,
  fabricar: 11.24,
  rayones: 13.14,
  distintos: 14.68,
  uso: 16.46,
  sale: 18.7,
  roza: 20.66,
  grabada: 21.9,
  codigo: 23.54,
  peritos: 25.02,
  tanque: 26.88,
  comparan: 29.3,
  microscopio: 30.82,
  encajan: 32.1,
  firmar: 33.46,
  porque: 35.12,
  fin: 37.5,
};

const COBRE = "#C87848";
const ACERO = "#8C88A8";

// Estrías de una bala vista de lado (patrón de rayas propio de cada semilla)
const Rayas: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly semilla: string;
  readonly op?: number;
  readonly color?: string;
}> = ({ x, y, w, h, semilla, op = 1, color = "#5A3A20" }) => (
  <g opacity={op}>
    {new Array(16).fill(0).map((_, k) => {
      const yy = y + random(`${semilla}y${k}`) * h;
      return (
        <line
          key={k}
          x1={x}
          y1={yy}
          x2={x + w}
          y2={yy + (random(`${semilla}d${k}`) - 0.5) * 8}
          stroke={color}
          strokeWidth={1 + random(`${semilla}g${k}`) * 4}
          opacity={0.7}
        />
      );
    })}
  </g>
);

// Bala de lado (punta a la derecha)
const Bala: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly rayas?: number;
  readonly semilla?: string;
  readonly brillo?: number;
}> = ({ x, y, s, rayas = 0, semilla = "a", brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -120 -40 L 40 -40 Q 120 -40 140 0 Q 120 40 40 40 L -120 40 Z"
      fill={COBRE}
    />
    <defs>
      <clipPath id={`clip-${semilla}`}>
        <path d="M -120 -40 L 40 -40 Q 120 -40 140 0 Q 120 40 40 40 L -120 40 Z" />
      </clipPath>
    </defs>
    <g clipPath={`url(#clip-${semilla})`}>
      <Rayas x={-120} y={-40} w={260} h={80} semilla={semilla} op={rayas} />
      <Rayas
        x={-120}
        y={-40}
        w={260}
        h={80}
        semilla={semilla}
        op={brillo}
        color={C.cyan}
      />
    </g>
  </g>
);

// Pistola esquemática
const Pistola: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
}> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-60} width={440} height={90} rx={16} fill="#3A3A4A" />
    <path d="M -200 30 L -110 30 L -80 200 L -170 200 Z" fill="#2A2A3A" />
    <rect
      x={-120}
      y={30}
      width={60}
      height={50}
      rx={10}
      fill="none"
      stroke="#2A2A3A"
      strokeWidth={12}
    />
    <rect x={150} y={-40} width={70} height={50} fill="#1A1A2A" />
  </g>
);

// A. Gancho: cada bala lleva una huella dactilar
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.arma], [1.12, 1])}>
        <Bala
          x={540}
          y={900}
          s={2.8}
          rayas={1}
          semilla="huella"
          brillo={interpolate(t, [0.6, 1.2], [0, 1], clamp)}
        />
      </Lienzo>
      <Flash t={t} d={1.0} color={C.cyan} />
    </>
  );
};

// B. El arma no puede borrarla
export const Arma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.arma, T.arma + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.arma, T.canon], [1, 1.05])}>
      <Pistola x={360} y={780} s={1.2} />
      <Bala x={640 + sale * 260} y={750} s={0.6} rayas={1} semilla="huella" />
      <line
        x1={680}
        y1={860}
        x2={1000}
        y2={860}
        stroke={C.red}
        strokeWidth={10}
        opacity={aparece(t, T.arma + 1)}
      />
      <Texto
        x={840}
        y={940}
        color={C.red}
        size={38}
        op={aparece(t, T.arma + 1)}
      >
        no se borra
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.canon], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={40}>
          cómo la atrapan: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Corte transversal del cañón con estrías (engranaje)
const Corte: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly rot: number;
}> = ({ x, y, r, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r + 60} fill={ACERO} />
    <path
      d={
        new Array(12)
          .fill(0)
          .map((_, k) => {
            const a = (k / 12) * Math.PI * 2;
            const rr = k % 2 ? r : r - 22;
            const a2 = ((k + 1) / 12) * Math.PI * 2;
            return `${k === 0 ? "M" : "L"} ${Math.cos(a) * rr} ${Math.sin(a) * rr} A ${rr} ${rr} 0 0 1 ${Math.cos(a2) * rr} ${Math.sin(a2) * rr}`;
          })
          .join(" ") + " Z"
      }
      fill="#120F22"
    />
  </g>
);

// C. Estrías en espiral que hacen girar la bala
export const Canon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lateral = aparece(t, T.girar);
  return (
    <Lienzo zoom={interpolate(t, [T.canon, T.fabricar], [1, 1.04])}>
      <g opacity={1 - lateral}>
        <Corte x={540} y={820} r={200} rot={t * 30} />
        <Texto
          x={540}
          y={1180}
          color={C.white}
          size={42}
          op={aparece(t, T.estrias)}
        >
          estrías en espiral
        </Texto>
      </g>
      <g opacity={lateral}>
        <rect x={80} y={700} width={920} height={200} rx={20} fill={ACERO} />
        <rect x={80} y={730} width={920} height={140} fill="#120F22" />
        {new Array(10).fill(0).map((_, k) => (
          <path
            key={k}
            d={`M ${80 + k * 100 - ((t * 120) % 100)} 730 l 60 140`}
            stroke="#3A3650"
            strokeWidth={10}
          />
        ))}
        <g
          transform={`translate(${interpolate(t, [T.girar, T.fabricar], [200, 1000], clamp)} 800) rotate(${t * 720} 0 0)`}
        >
          <ellipse rx={50} ry={60} fill={COBRE} opacity={0.9} />
          <line
            x1={0}
            y1={-60}
            x2={0}
            y2={60}
            stroke="#5A3A20"
            strokeWidth={6}
          />
        </g>
        <Texto x={540} y={1050} color={C.cyan} size={42}>
          la bala gira y vuela recta
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Rayones microscópicos de fabricación, distintos en cada cañón
export const Rayones: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tres = aparece(t, T.distintos);
  const nuevos = aparece(t, T.uso);
  const herramienta = interpolate(
    t,
    [T.fabricar, T.rayones + 0.5],
    [80, 1000],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.fabricar, T.sale], [1, 1.04])}>
      <g opacity={1 - tres}>
        <rect x={80} y={600} width={920} height={200} rx={20} fill={ACERO} />
        <rect x={80} y={630} width={920} height={140} fill="#120F22" />
        <rect
          x={herramienta - 40}
          y={640}
          width={80}
          height={120}
          rx={10}
          fill="#C8C4D8"
        />
        <g opacity={aparece(t, T.rayones)}>
          <circle
            cx={540}
            cy={1060}
            r={200}
            fill="#3A3650"
            stroke="#6A5A9A"
            strokeWidth={8}
          />
          <Rayas
            x={360}
            y={900}
            w={360}
            h={320}
            semilla="canonA"
            color={C.white}
          />
          <line
            x1={540}
            y1={860}
            x2={540}
            y2={780}
            stroke="#6A5A9A"
            strokeWidth={4}
          />
          <Texto x={540} y={1330} color={C.white} size={40}>
            rayones microscópicos
          </Texto>
        </g>
      </g>
      <g opacity={tres}>
        {["canonA", "canonB", "canonC"].map((sem, k) => (
          <g key={sem}>
            <circle
              cx={210 + k * 330}
              cy={820}
              r={140}
              fill="#3A3650"
              stroke="#6A5A9A"
              strokeWidth={6}
            />
            <Rayas
              x={90 + k * 330}
              y={700}
              w={240}
              h={240}
              semilla={sem}
              color={C.white}
            />
            <Rayas
              x={90 + k * 330}
              y={700}
              w={240}
              h={240}
              semilla={`${sem}uso`}
              color={C.yellow}
              op={nuevos}
            />
            <Texto x={210 + k * 330} y={1010} color={C.grey} size={30}>
              {`cañón ${k + 1}`}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={1150} color={C.white} size={42}>
          distintos en cada cañón
        </Texto>
        <Texto x={540} y={1240} color={C.yellow} size={38} op={nuevos}>
          y el uso añade más
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. La bala se graba al rozar las estrías: código de barras
export const Grabado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const avance = interpolate(t, [T.sale, T.grabada + 0.6], [0, 1], suave);
  const codigo = aparece(t, T.codigo);
  return (
    <Lienzo zoom={interpolate(t, [T.sale, T.peritos], [1, 1.04])}>
      <g opacity={1 - codigo}>
        <rect x={80} y={600} width={920} height={200} rx={20} fill={ACERO} />
        <rect x={80} y={630} width={920} height={140} fill="#120F22" />
        <Bala
          x={160 + avance * 700}
          y={700}
          s={0.8}
          rayas={avance}
          semilla="huella"
        />
        <Tarjeta x={290} y={880} w={500} h={140} op={aparece(t, T.sale)}>
          <Texto x={540} y={972} color={C.red} size={50}>
            presión enorme
          </Texto>
        </Tarjeta>
        <Texto
          x={540}
          y={1120}
          color={C.cyan}
          size={42}
          op={aparece(t, T.grabada)}
        >
          los rayones se graban
        </Texto>
      </g>
      <g opacity={codigo}>
        <Bala x={540} y={700} s={2.2} rayas={1} semilla="huella" />
        <g transform="translate(240 900)">
          {new Array(30).fill(0).map((_, k) => (
            <rect
              key={k}
              x={k * 20}
              y={0}
              width={4 + random(`cb${k}`) * 10}
              height={180}
              fill={C.white}
            />
          ))}
        </g>
        <Texto x={540} y={1180} color={C.white} size={42}>
          como un código de barras
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Peritos: tanque de agua y microscopio de comparación
export const Peritos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const micro = aparece(t, T.comparan);
  const frena = interpolate(t, [T.tanque, T.tanque + 1.5], [0, 1], {
    ...clamp,
    easing: (x) => 1 - (1 - x) ** 3,
  });
  return (
    <Lienzo zoom={interpolate(t, [T.peritos, T.encajan], [1, 1.04])}>
      <g opacity={1 - micro}>
        <Pistola x={220} y={780} s={0.7} />
        <rect
          x={360}
          y={640}
          width={680}
          height={300}
          rx={20}
          fill="#2A5A8A"
          opacity={0.5}
          stroke="#7AC8F0"
          strokeWidth={6}
        />
        <Bala
          x={420 + frena * 520}
          y={760}
          s={0.4}
          rayas={1}
          semilla="prueba"
        />
        <Texto
          x={700}
          y={1020}
          color="#7AC8F0"
          size={40}
          op={aparece(t, T.tanque)}
        >
          tanque de agua
        </Texto>
      </g>
      <g opacity={micro}>
        <circle
          cx={540}
          cy={820}
          r={330}
          fill="#1A1636"
          stroke="#6A5A9A"
          strokeWidth={10}
        />
        <line
          x1={540}
          y1={490}
          x2={540}
          y2={1150}
          stroke={C.white}
          strokeWidth={4}
        />
        <defs>
          <clipPath id="izq">
            <rect x={210} y={490} width={330} height={660} />
          </clipPath>
          <clipPath id="der">
            <rect x={540} y={490} width={330} height={660} />
          </clipPath>
        </defs>
        <g clipPath="url(#izq)">
          <Bala x={540} y={820} s={2.2} rayas={1} semilla="huella" />
        </g>
        <g
          clipPath="url(#der)"
          transform={`translate(0 ${interpolate(t, [T.comparan, T.encajan], [60, 0], suave)})`}
        >
          <Bala x={540} y={820} s={2.2} rayas={1} semilla="huella" />
        </g>
        <Texto
          x={330}
          y={1220}
          color={C.grey}
          size={30}
          op={aparece(t, T.microscopio)}
        >
          escena
        </Texto>
        <Texto
          x={750}
          y={1220}
          color={C.grey}
          size={30}
          op={aparece(t, T.microscopio)}
        >
          arma sospechosa
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Las líneas encajan: el arma acaba de firmar
export const Encaje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.encajan, T.porque], [1, 1.04])}>
        <circle
          cx={540}
          cy={820}
          r={330}
          fill="#1A1636"
          stroke="#5AC878"
          strokeWidth={10}
        />
        <line
          x1={540}
          y1={490}
          x2={540}
          y2={1150}
          stroke={C.white}
          strokeWidth={4}
          opacity={0.4}
        />
        <Bala
          x={540}
          y={820}
          s={2.2}
          rayas={1}
          semilla="huella"
          brillo={aparece(t, T.encajan)}
        />
        <g
          opacity={aparece(t, T.firmar)}
          transform="translate(540 1260) rotate(-8)"
        >
          <rect
            x={-200}
            y={-60}
            width={400}
            height={120}
            rx={14}
            fill="none"
            stroke="#5AC878"
            strokeWidth={10}
          />
          <Texto x={0} y={22} color="#5AC878" size={64}>
            FIRMA
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.encajan} color="#5AC878" />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <Bala x={540} y={900} s={2.8} rayas={1} semilla="huella" />
    </Lienzo>
  );
};
