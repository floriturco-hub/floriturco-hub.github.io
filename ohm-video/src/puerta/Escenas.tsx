import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/puerta/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  metes: 2.06, // metes
  abre: 4.28, // abre
  final: 5.72, // final
  lados: 8.38, // lados
  cortina: 9.06, // cortina
  decenas: 10.88, // decenas
  emisor: 13.00, // emisor
  receptor: 13.78, // receptor
  corta: 15.02, // corta
  perro: 17.26, // perro
  invierte: 20.30, // invierte
  portones: 21.28, // portones
  suelo: 24.74, // suelo
  falla: 26.86, // falla
  esfuerzo: 28.34, // esfuerzo
  detiene: 31.04, // detiene
  viejos: 33.22, // viejos
  barra: 34.62, // barra
  tocarte: 35.46, // tocarte
  asi: 37.00, // asi
  fin: 38.74, // FIN
};

const IR = C.red;
const METAL = "#8C88A8";

// Puertas de ascensor: abierto 0 (cerrado) a 1 (abierto); rayos = cortina visible; cortados = índices tapados
const Ascensor: React.FC<{ readonly abierto: number; readonly rayos?: number; readonly tapa?: [number, number]; readonly t?: number }> = ({
  abierto,
  rayos = 0,
  tapa,
  t = 0,
}) => {
  const hueco = 40 + 300 * abierto;
  const yTop = 520;
  const yBot = 1260;
  return (
    <g>
      <rect x={160} y={yTop - 40} width={760} height={yBot - yTop + 80} rx={10} fill="#2A2640" stroke="#5A5478" strokeWidth={8} />
      <rect x={540 - hueco} y={yTop} width={hueco * 2} height={yBot - yTop} fill="#E8D8A8" opacity={0.25} />
      <rect x={190} y={yTop} width={350 - hueco} height={yBot - yTop} fill={METAL} />
      <rect x={540 + hueco} y={yTop} width={350 - hueco} height={yBot - yTop} fill={METAL} />
      <rect x={530 - hueco} y={yTop} width={10} height={yBot - yTop} fill="#2A2640" opacity={rayos} />
      <rect x={540 + hueco} y={yTop} width={10} height={yBot - yTop} fill="#2A2640" opacity={rayos} />
      <g opacity={rayos}>
        {new Array(24).fill(0).map((_, k) => {
          const y = yTop + 20 + k * 29;
          const cortado = tapa && y > tapa[0] && y < tapa[1];
          return (
            <line
              key={k}
              x1={540 - hueco + 4}
              y1={y}
              x2={540 + hueco - 4}
              y2={y}
              stroke="#FF5A6A"
              strokeWidth={6}
              strokeDasharray="14 8"
              strokeDashoffset={-t * 60}
              opacity={cortado ? 0.08 : 0.85}
            />
          );
        })}
      </g>
    </g>
  );
};

const Mano: React.FC<{ readonly x: number; readonly y: number; readonly op: number }> = ({ x, y, op }) => (
  <g opacity={op} transform={`translate(${x} ${y})`}>
    <rect x={-300} y={-40} width={260} height={90} rx={30} fill="#C8946A" />
    <rect x={-60} y={-60} width={110} height={130} rx={40} fill="#E8B48A" />
    {[0, 1, 2, 3].map((k) => (
      <rect key={k} x={40} y={-56 + k * 32} width={70} height={26} rx={13} fill="#E8B48A" />
    ))}
  </g>
);

const Perro: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={110} ry={50} fill="#B8864A" />
    <circle cx={110} cy={-40} r={45} fill="#B8864A" />
    <path d="M 95 -80 L 80 -30 L 110 -60 Z" fill="#8A5A2A" />
    <circle cx={125} cy={-48} r={6} fill="#111" />
    <circle cx={152} cy={-34} r={8} fill="#111" />
    {[-70, -30, 40, 80].map((lx) => (
      <rect key={lx} x={lx} y={30} width={18} height={70} rx={8} fill="#B8864A" />
    ))}
    <path d="M -110 -10 q -50 -40 -40 -80" stroke="#B8864A" strokeWidth={14} fill="none" />
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Ascensor abierto={0.25} t={t} />
    <Mano x={560} y={880} op={1} />
    <Texto x={540} y={440} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe esta puerta que estás ahí?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.metes], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Metes la mano y la puerta se abre al instante + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abierto = t < T.abre ? interpolate(t, [T.metes - 0.8, T.abre], [0.8, 0.25], clamp) : interpolate(t, [T.abre, T.abre + 0.6], [0.25, 0.9], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.metes, T.lados], [1, 1.04])}>
      <Ascensor abierto={abierto} t={t} />
      <Mano x={interpolate(t, [T.metes, T.metes + 0.4], [0, 560], clamp)} y={880} op={aparece(t, T.metes) * (1 - aparece(t, T.final))} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.lados], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué antes te golpeaba
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Una cortina de luz infrarroja: decenas de rayos del emisor al receptor
export const Cortina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.lados, T.corta], [1, 1.04])}>
      <Ascensor abierto={0.6} rayos={aparece(t, T.cortina)} t={t} />
      <Texto x={540} y={1360} size={40} color={IR} op={aparece(t, T.decenas)}>
        decenas de rayos infrarrojos
      </Texto>
      <Texto x={250} y={460} size={32} color={C.white} op={aparece(t, T.emisor)}>
        emisor
      </Texto>
      <Texto x={830} y={460} size={32} color={C.white} op={aparece(t, T.receptor)}>
        receptor
      </Texto>
    </Lienzo>
  );
};

// D. Si algo corta un solo rayo, el motor se invierte
export const Corta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const perro = aparece(t, T.perro);
  const abierto = interpolate(t, [T.corta, T.invierte, T.invierte + 0.6], [0.6, 0.45, 0.9], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.corta, T.portones], [1, 1.04])}>
        <Ascensor abierto={abierto} rayos={1} tapa={perro > 0.5 ? [1050, 1260] : [830, 940]} t={t} />
        <Mano x={560} y={880} op={1 - perro} />
        <g opacity={perro}>
          <Perro x={520} y={1170} s={0.8} />
        </g>
        <Texto x={540} y={1360} size={40} color={C.yellow} op={aparece(t, T.invierte)}>
          ¡el motor se invierte!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.invierte} color={C.yellow} />
    </>
  );
};

// Portón de garaje con fotocélulas cerca del suelo; sube = 0-1
const Porton: React.FC<{ readonly sube: number; readonly rayo: number; readonly cortado: boolean; readonly t: number }> = ({ sube, rayo, cortado, t }) => (
  <g>
    <rect x={140} y={540} width={800} height={720} fill="#141030" stroke="#5A5478" strokeWidth={10} />
    {new Array(8).fill(0).map((_, k) => (
      <rect key={k} x={150} y={550 + k * 88 - 700 * sube} width={780} height={84} fill="#C8C4D8" opacity={550 + k * 88 - 700 * sube > 480 ? 1 : 0} stroke="#8C88A8" strokeWidth={3} />
    ))}
    <rect x={160} y={1180} width={30} height={50} rx={6} fill="#3A3650" />
    <rect x={890} y={1180} width={30} height={50} rx={6} fill="#3A3650" />
    <line x1={190} y1={1205} x2={890} y2={1205} stroke={IR} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-t * 60} opacity={rayo * (cortado ? 0.15 : 1)} />
  </g>
);

// E. Los portones de garaje usan un rayo infrarrojo cerca del suelo
export const Garaje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const px = interpolate(t, [T.suelo, T.falla], [-200, 1200], clamp);
  const cortado = px > 300 && px < 900;
  return (
    <Lienzo zoom={interpolate(t, [T.portones, T.falla], [1, 1.04])}>
      <Porton sube={cortado ? 0.7 : interpolate(t, [T.portones, T.suelo], [0.7, 0.5], clamp)} rayo={aparece(t, T.suelo)} cortado={cortado} t={t} />
      <Perro x={px} y={1170} s={0.6} />
      <Texto x={540} y={1360} size={38} color={IR} op={aparece(t, T.suelo)}>
        un rayo cerca del suelo
      </Texto>
    </Lienzo>
  );
};

// F. Por si falla, el motor mide su esfuerzo: si le cuesta más, se detiene y retrocede
export const Esfuerzo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.falla, T.esfuerzo + 0.6], [0.6, 0.33], clamp);
  const vuelve = interpolate(t, [T.detiene, T.detiene + 0.8], [0, 0.4], clamp);
  const e = interpolate(t, [T.esfuerzo, T.esfuerzo + 0.5], [0.2, 0.95], clamp) * (1 - interpolate(t, [T.detiene, T.detiene + 0.4], [0, 0.8], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.falla, T.viejos], [1, 1.04])}>
        <Porton sube={baja + vuelve} rayo={0} cortado={false} t={t} />
        <rect x={430} y={1080} width={220} height={180} rx={10} fill="#B8864A" />
        <g opacity={aparece(t, T.esfuerzo)}>
          <rect x={190} y={420} width={700} height={40} rx={20} fill="#2A2440" />
          <rect x={190} y={420} width={700 * e} height={40} rx={20} fill={e > 0.6 ? C.red : C.cyan} />
          <Texto x={540} y={510} size={30} color={C.grey}>
            esfuerzo del motor
          </Texto>
        </g>
        <Texto x={540} y={1360} size={40} color={C.yellow} op={aparece(t, T.detiene)}>
          se detiene y retrocede
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.detiene} color={C.yellow} />
    </>
  );
};

// G. Los ascensores viejos solo tenían una barra que tenía que tocarte
export const Viejos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abierto = interpolate(t, [T.viejos, T.tocarte], [0.8, 0.25], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.viejos, T.asi], [1, 1.04])}>
        <Ascensor abierto={abierto} t={t} />
        <rect x={530 - (40 + 300 * abierto)} y={520} width={16} height={740} fill={C.yellow} opacity={aparece(t, T.barra)} />
        <rect x={524 + (40 + 300 * abierto)} y={520} width={16} height={740} fill={C.yellow} opacity={aparece(t, T.barra)} />
        <Mano x={560} y={880} op={1} />
        <Texto x={760} y={760} size={64} color={C.red} op={aparece(t, T.tocarte)}>
          ¡pum!
        </Texto>
        <Texto x={540} y={1360} size={38} color={C.yellow} op={aparece(t, T.barra)}>
          una barra que tenía que tocarte
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tocarte} color={C.red} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
