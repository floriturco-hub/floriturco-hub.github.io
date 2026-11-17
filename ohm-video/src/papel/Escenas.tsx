import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/papel/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  hoja: 2.18, // hoja
  corta: 3.00, // corta
  cuchillo: 4.76, // cuchillo
  final: 6.06, // final
  yemas: 8.28, // yemas
  terminaciones: 10.06, // terminaciones
  cuerpo: 13.08, // cuerpo
  borde: 14.00, // borde
  liso: 14.96, // liso
  cerca: 15.82, // cerca
  sierra: 16.56, // sierra
  desgarra: 19.72, // desgarra
  superficial: 21.56, // superficial
  sangra: 22.90, // sangra
  costra: 24.92, // costra
  expuestas: 27.42, // expuestas
  mueves: 29.28, // mueves
  abre: 30.80, // abre
  porEso: 31.80, // por
  fin: 33.62, // FIN
};

const PIEL = "#E8B48A";
const NERVIO = C.yellow;
const SANGRE = "#C8283A";

// Dedo horizontal con corte (op)
const Dedo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly corte: number; readonly rot?: number }> = ({ x, y, s, corte, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-500} y={-90} width={560} height={180} rx={90} fill="#C8946A" />
    <rect x={-40} y={-90} width={300} height={180} rx={90} fill={PIEL} />
    <path d="M 180 -70 Q 250 -60 250 0 Q 250 60 180 70 L 180 -70 Z" fill="#F4D8D0" />
    <line x1={60} y1={-40} x2={140} y2={30} stroke={SANGRE} strokeWidth={6} opacity={corte} />
  </g>
);

const Dolor: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly t: number }> = ({ x, y, op, t }) => (
  <g opacity={op * (0.6 + 0.4 * Math.sin(t * 10))}>
    {[-50, 0, 50].map((d, k) => (
      <path key={k} d={`M ${x + d} ${y - 60} l 15 25 l -15 10 l 15 25`} stroke={C.yellow} strokeWidth={8} fill="none" transform={`rotate(${(k - 1) * 25} ${x} ${y})`} />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Dedo x={540} y={960} s={1.2} corte={1} />
    <Dolor x={680} y={820} op={1} t={t} />
    <Texto x={540} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué duele tanto este corte?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.hoja], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={SANGRE} />
    </>
  );
};

// B. Una hoja de papel te corta el dedo y duele más que un cuchillo + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hoja = interpolate(t, [T.hoja, T.corta + 0.3], [-200, 100], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.hoja, T.yemas], [1, 1.04])}>
        <Dedo x={540} y={900} s={1} corte={aparece(t, T.corta + 0.3)} />
        <rect x={560 + hoja} y={560} width={12} height={360} fill={C.white} transform={`rotate(-20 ${566 + hoja} 740)`} />
        <Dolor x={660} y={760} op={aparece(t, T.corta + 0.3)} t={t} />
        <g opacity={aparece(t, T.cuchillo)}>
          <path d="M 200 1150 L 480 1150 L 480 1200 Q 300 1200 200 1150 Z" fill="#C8C8D8" />
          <rect x={480} y={1145} width={140} height={60} rx={14} fill="#5A3A2A" />
          <Texto x={760} y={1190} size={34} color={C.grey}>
            duele menos
          </Texto>
        </g>
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.yemas], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            por qué tarda en sanar
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.corta + 0.3} color={SANGRE} />
    </>
  );
};

// C. Las yemas de los dedos tienen muchísimas terminaciones de dolor
export const Yemas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.yemas, T.borde], [1, 1.04])}>
      <Dedo x={420} y={900} s={1.6} corte={0} />
      <g opacity={aparece(t, T.terminaciones)}>
        {new Array(40).fill(0).map((_, k) => {
          const a = (k / 40) * Math.PI * 1.6 - Math.PI * 0.8;
          const r = 60 + (k % 4) * 30;
          return <circle key={k} cx={700 + Math.cos(a) * r} cy={900 + Math.sin(a) * r * 1.3} r={7} fill={NERVIO} opacity={0.6 + 0.4 * Math.sin(t * 5 + k)} />;
        })}
      </g>
      <Texto x={540} y={1250} size={40} color={NERVIO} op={aparece(t, T.terminaciones)}>
        muchísimas terminaciones de dolor
      </Texto>
      <Texto x={540} y={1320} size={34} color={C.grey} op={aparece(t, T.cuerpo)}>
        más que casi todo el cuerpo
      </Texto>
    </Lienzo>
  );
};

// D. El borde del papel parece liso, pero de cerca es una sierra de fibras: desgarra
export const Borde: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = aparece(t, T.cerca);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.borde, T.superficial], [1, 1.04])}>
        <g opacity={1 - zoom}>
          <rect x={200} y={700} width={680} height={400} fill={C.white} />
          <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.liso)}>
            parece liso...
          </Texto>
        </g>
        <g opacity={zoom}>
          <circle cx={540} cy={880} r={360} fill="#141030" stroke={C.white} strokeWidth={8} />
          <path
            d={`M 200 1000 ${new Array(25)
              .fill(0)
              .map((_, k) => `L ${200 + k * 28} ${700 + (k % 2 ? 0 : 60) + ((k * 37) % 40)}`)
              .join(" ")} L 880 1000 Z`}
            fill="#F0ECE0"
          />
          {new Array(10).fill(0).map((_, k) => (
            <line key={k} x1={220 + k * 66} y1={720 + (k % 3) * 20} x2={240 + k * 66} y2={640 + (k % 2) * 30} stroke="#F0ECE0" strokeWidth={5} />
          ))}
          <Texto x={540} y={1300} size={40} color={C.white} op={aparece(t, T.sierra)}>
            una sierra de fibras
          </Texto>
        </g>
        <Texto x={540} y={1380} size={46} color={SANGRE} op={aparece(t, T.desgarra)}>
          ¡desgarra!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desgarra} color={SANGRE} />
    </>
  );
};

// Corte de piel: capas con nervios arriba y capilares abajo; prof = profundidad del corte 0-1, abierto 0-1
const Piel: React.FC<{ readonly prof: number; readonly abierto: number; readonly sangre: number; readonly t: number }> = ({ prof, abierto, sangre, t }) => {
  const h = 120 + prof * 420;
  const w = 20 + abierto * 60;
  return (
    <g>
      <rect x={100} y={700} width={880} height={600} fill="#D89A72" />
      <rect x={100} y={700} width={880} height={110} fill={PIEL} />
      {new Array(8).fill(0).map((_, k) => (
        <path key={k} d={`M ${150 + k * 110} 830 q 20 40 0 80 q -20 40 0 80`} stroke={NERVIO} strokeWidth={6} fill="none" opacity={0.6 + 0.4 * Math.sin(t * 4 + k)} />
      ))}
      {new Array(6).fill(0).map((_, k) => (
        <path key={k} d={`M ${120 + k * 160} 1150 q 40 -20 80 0 q 40 20 80 0`} stroke={SANGRE} strokeWidth={10} fill="none" />
      ))}
      <path d={`M ${540 - w} 700 L 540 ${700 + h} L ${540 + w} 700 Z`} fill="#141030" />
      <path d={`M ${540 - w} 700 L 540 ${700 + h} L ${540 + w} 700 Z`} fill={SANGRE} opacity={sangre} />
    </g>
  );
};

// E. El corte es tan superficial que casi no sangra: no se forma costra
export const Superficial: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.superficial, T.expuestas], [1, 1.04])}>
      <Piel prof={0.4} abierto={0.2} sangre={0} t={t} />
      <Texto x={760} y={880} size={30} color={NERVIO} anchor="start" op={aparece(t, T.superficial)}>
        nervios
      </Texto>
      <Texto x={760} y={1110} size={30} color={SANGRE} anchor="start" op={aparece(t, T.superficial)}>
        vasos de sangre
      </Texto>
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.sangra) * (1 - aparece(t, T.costra))}>
        casi no sangra
      </Texto>
      <Texto x={540} y={600} size={40} color={C.red} op={aparece(t, T.costra)}>
        sin costra que lo tape
      </Texto>
    </Lienzo>
  );
};

// F. Las terminaciones quedan expuestas, y cada vez que mueves el dedo la herida se abre otra vez
export const Expuesta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mueve = aparece(t, T.mueves);
  const abierto = 0.2 + mueve * (0.5 + 0.5 * Math.sin(t * 5));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.expuestas, T.porEso], [1, 1.04])}>
        <Piel prof={0.4} abierto={abierto} sangre={0} t={t} />
        <g opacity={aparece(t, T.expuestas)}>
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${360 + k * 180} 640 q 20 -30 40 0`} stroke="#8AC8F8" strokeWidth={6} fill="none" />
          ))}
          <Texto x={540} y={560} size={36} color="#8AC8F8">
            nervios expuestos al aire
          </Texto>
        </g>
        <Dolor x={540} y={500} op={mueve * abierto} t={t} />
        <Texto x={540} y={1400} size={40} color={C.yellow} op={aparece(t, T.abre)}>
          se abre otra vez
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.abre} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
