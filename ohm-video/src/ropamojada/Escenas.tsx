import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/ropamojada/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cuelgas: 2.06, // cuelgas
  fresco: 5.14, // fresco
  humedo: 5.72, // humedo
  final: 6.74, // final
  evaporarse: 10.08, // evaporarse
  molecula: 11.02, // molecula
  energia: 12.20, // energia
  escapar: 13.18, // escapar
  toma: 15.16, // toma
  calor: 17.92, // calor
  seca: 19.74, // seca
  enfria: 21.22, // enfria
  vapor: 22.86, // vapor
  sudor: 24.36, // sudor
  litro: 26.82, // litro
  estufa: 29.08, // estufa
  seiscientos: 29.58, // seiscientos
  hora: 31.54, // hora
  porEso: 32.10, // por
  fin: 33.80, // FIN
};

const AGUA = "#5AB8F0";

const Camisa: React.FC<{ readonly x: number; readonly y: number; readonly col: string; readonly s?: number }> = ({ x, y, col, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 0 L -30 -10 L 0 10 L 30 -10 L 70 0 L 100 60 L 60 80 L 55 200 L -55 200 L -60 80 L -100 60 Z" fill={col} />
  </g>
);

const Goteo: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op?: number }> = ({ x, y, t, op = 1 }) => (
  <g opacity={op}>
    {[0, 1].map((k) => {
      const u = (t * 0.9 + k * 0.5) % 1;
      return <path key={k} transform={`translate(${x + k * 30} ${y + u * 160})`} d="M 0 -12 C 6 -4 9 2 9 6 A 9 9 0 0 1 -9 6 C -9 2 -6 -4 0 -12 Z" fill={AGUA} opacity={1 - u} />;
    })}
  </g>
);

const Termometro: React.FC<{ readonly x: number; readonly y: number; readonly nivel: number; readonly texto: string }> = ({ x, y, nivel, texto }) => (
  <g>
    <rect x={x - 22} y={y - 260} width={44} height={260} rx={22} fill="#E8E8EE" />
    <circle cx={x} cy={y + 10} r={40} fill={nivel < 0.5 ? C.cyan : C.red} />
    <rect x={x - 12} y={y - 240 * nivel} width={24} height={240 * nivel + 10} fill={nivel < 0.5 ? C.cyan : C.red} />
    <Texto x={x} y={y + 110} size={40} color={C.white}>
      {texto}
    </Texto>
  </g>
);

// Vapor que sube
const Vapor: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op?: number; readonly ancho?: number }> = ({ x, y, t, op = 1, ancho = 400 }) => (
  <g opacity={op}>
    {new Array(10).fill(0).map((_, k) => {
      const u = (t * 0.4 + k / 10) % 1;
      return <circle key={k} cx={x - ancho / 2 + ((k * 137) % ancho) + 20 * Math.sin(t + k)} cy={y - u * 300} r={10 + u * 10} fill="#C8E0F0" opacity={0.6 * (1 - u)} />;
    })}
  </g>
);

const Tendedero: React.FC<{ readonly t: number; readonly y: number }> = ({ t, y }) => (
  <g>
    <line x1={120} y1={y} x2={960} y2={y} stroke="#B8B8C4" strokeWidth={6} />
    <Camisa x={300} y={y} col="#4A7AC8" />
    <Camisa x={560} y={y} col="#C84A6A" />
    <Camisa x={820} y={y} col="#4AC88A" />
    <Goteo x={290} y={y + 210} t={t} />
    <Goteo x={550} y={y + 210} t={t + 0.3} />
    <Goteo x={810} y={y + 210} t={t + 0.6} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Tendedero t={t} y={760} />
    <Vapor x={560} y={740} t={t} />
    <Texto x={540} y={1400} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta ropa enfría el cuarto?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cuelgas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Ropa mojada dentro de casa: el cuarto se pone más fresco y húmedo + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const temp = interpolate(t, [T.fresco - 0.3, T.fresco + 1], [24, 22], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cuelgas, T.evaporarse], [1, 1.04])}>
      <Tendedero t={t} y={700} />
      <g opacity={aparece(t, T.fresco)}>
        <Termometro x={260} y={1330} nivel={(temp - 15) / 20} texto={`${temp.toFixed(1)} °C`} />
      </g>
      <g opacity={aparece(t, T.humedo)}>
        <path transform="translate(800 1200) scale(3)" d="M 0 -40 C 20 -10 30 5 30 18 A 30 30 0 0 1 -30 18 C -30 5 -20 -10 0 -40 Z" fill={AGUA} />
        <Texto x={800 } y={1410} size={36} color={AGUA}>
          + humedad
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuánto calor se lleva un litro?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.evaporarse], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Para evaporarse, cada molécula necesita energía para escapar del líquido
export const Molecula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.escapar, T.escapar + 1], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.evaporarse, T.toma], [1, 1.04])}>
      <rect x={90} y={1000} width={900} height={400} fill={AGUA} opacity={0.35} />
      {new Array(24).fill(0).map((_, k) => (
        <circle key={k} cx={130 + (k % 8) * 115 + 8 * Math.sin(t * 4 + k)} cy={1050 + Math.floor(k / 8) * 110 + 8 * Math.cos(t * 3 + k)} r={26} fill={AGUA} />
      ))}
      <g opacity={aparece(t, T.molecula)}>
        <circle cx={540} cy={1000 - sale * 380} r={30} fill={C.yellow} stroke="#fff" strokeWidth={4} />
      </g>
      <g opacity={aparece(t, T.energia) * (1 - sale)}>
        <path d="M 600 880 L 570 950 L 610 950 L 580 1020" stroke={C.orange} strokeWidth={10} fill="none" />
        <Texto x={720} y={900} size={36} color={C.orange}>
          energía
        </Texto>
      </g>
      <Texto x={540} y={540} size={40} color={C.white} op={aparece(t, T.escapar)}>
        escapa como vapor
      </Texto>
    </Lienzo>
  );
};

// D. Esa energía la toma del aire y de la tela, en forma de calor
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const frio = aparece(t, T.calor);
  return (
    <Lienzo zoom={interpolate(t, [T.toma, T.seca], [1, 1.04])}>
      <rect x={90} y={500} width={900} height={500} rx={20} fill={frio ? `rgba(90,184,240,${0.15 * frio})` : "none"} />
      <rect x={90} y={1000} width={900} height={300} fill="#C84A6A" />
      <Texto x={540} y={1360} size={34} color={C.white}>
        tela mojada
      </Texto>
      {new Array(8).fill(0).map((_, k) => {
        const u = (t * 0.7 + k / 8) % 1;
        const x = 160 + k * 110;
        const desdeArriba = k % 2 === 0;
        return (
          <path
            key={k}
            d={desdeArriba ? `M ${x} ${620 + u * 300} l 0 40` : `M ${x} ${1240 - u * 200} l 0 -40`}
            stroke={C.red}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={aparece(t, T.toma) * (1 - u)}
          />
        );
      })}
      <Texto x={540} y={580} size={38} color={C.red} op={aparece(t, T.toma)}>
        calor del aire →  agua
      </Texto>
      <Texto x={540} y={1460} size={40} color={C.cyan} op={frio}>
        el aire pierde calor
      </Texto>
    </Lienzo>
  );
};

// E. Mientras la ropa se seca, el aire se enfría y se llena de vapor
export const Cuarto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const temp = interpolate(t, [T.enfria - 0.3, T.vapor], [24, 21.5], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.seca, T.sudor], [1, 1.04])}>
      <rect x={90} y={500} width={900} height={1000} rx={20} fill="none" stroke="#4A4270" strokeWidth={10} />
      <Tendedero t={t} y={640} />
      <Termometro x={240} y={1320} nivel={(temp - 15) / 20} texto={`${temp.toFixed(1)} °C`} />
      <Vapor x={640} y={1300} t={t} op={aparece(t, T.vapor)} ancho={500} />
      <Texto x={680} y={1420} size={38} color="#C8E0F0" op={aparece(t, T.vapor)}>
        aire con vapor
      </Texto>
    </Lienzo>
  );
};

// F. Lo mismo que hace tu sudor al evaporarse sobre la piel
export const Sudor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sudor, T.litro], [1, 1.04])}>
      <path d="M 90 1100 Q 540 980 990 1100 L 990 1500 L 90 1500 Z" fill="#C89A7A" />
      {[220, 400, 600, 800].map((x, k) => (
        <path key={x} transform={`translate(${x} ${1060 - (x === 600 ? 10 : 0)}) scale(${1 - ((t * 0.3 + k * 0.25) % 1) * 0.8})`} d="M 0 -30 C 15 -8 22 4 22 14 A 22 22 0 0 1 -22 14 C -22 4 -15 -8 0 -30 Z" fill={AGUA} />
      ))}
      <Vapor x={540} y={1000} t={t} ancho={700} />
      <Texto x={540} y={700} size={42} color={C.cyan}>
        el sudor te enfría igual
      </Texto>
    </Lienzo>
  );
};

// G. Evaporar un litro se lleva tanto calor como una estufa de 600 W durante una hora
export const Litro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.litro, T.porEso], [1, 1.04])}>
        <g opacity={aparece(t, T.litro)}>
          <rect x={180} y={740} width={200} height={420} rx={30} fill={AGUA} opacity={0.7} />
          <rect x={240} y={690} width={80} height={60} rx={10} fill="#4A7AC8" />
          <Texto x={280} y={980} size={56} color="#0A3A5A">
            1 L
          </Texto>
        </g>
        <Texto x={540} y={980} size={70} color={C.white} op={aparece(t, T.estufa)}>
          =
        </Texto>
        <g opacity={aparece(t, T.estufa)}>
          <rect x={660} y={760} width={260} height={380} rx={20} fill="#5A5A66" />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={690} y={800 + k * 80} width={200} height={30} rx={15} fill={C.orange} opacity={0.6 + 0.4 * Math.sin(t * 5 + k)} />
          ))}
          <Texto x={790} y={1220} size={44} color={C.orange} op={aparece(t, T.seiscientos)}>
            600 W
          </Texto>
          <Texto x={790} y={1290} size={40} color={C.white} op={aparece(t, T.hora)}>
            × 1 hora
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.seiscientos} color={C.orange} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
