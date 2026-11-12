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

// Instantes clave (s) de public/audio/mosquito/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  y: 1.8,
  dulce: 2.6,
  final: 3.66,
  el: 6.4,
  co2: 8.48,
  metros: 10.34,
  al: 12.04,
  calor: 13.28,
  olor: 15.2,
  ese: 16.0,
  bacterias: 17.14,
  sudor: 18.34,
  mezcla: 19.98,
  quien: 21.32,
  ejercicio: 22.74,
  exhala: 23.66,
  pero: 25.46,
  acidos: 26.42,
  estudio: 27.5,
  muchisimos: 30.24,
  tres: 31.72,
  favoritas: 33.36,
  porque: 34.28,
  fin: 36.48,
};

const PIEL = "#E8B890";
const CO2 = "#A8A4C0";
const OLOR = "#C8E85A";

// Mosquito (de perfil, mirando a la izquierda)
const Mosquito: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly op?: number }> = ({
  x,
  y,
  s,
  t,
  op = 1,
}) => {
  const ala = Math.sin(t * 80) * 20;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      <ellipse cx={20} cy={0} rx={34} ry={9} fill="#3A3040" />
      <circle cx={-16} cy={-2} r={10} fill="#3A3040" />
      <line x1={-24} y1={0} x2={-56} y2={8} stroke="#3A3040" strokeWidth={3} />
      <ellipse cx={10} cy={-16} rx={22} ry={8} fill={C.white} opacity={0.5} transform={`rotate(${-20 + ala} 0 -6)`} />
      {[-6, 6, 18].map((dx) => (
        <path key={dx} d={`M ${dx} 6 l -10 24 M ${dx} 6 l 12 24`} stroke="#3A3040" strokeWidth={2.5} fill="none" />
      ))}
    </g>
  );
};

// Persona acostada (cabeza y cuerpo bajo la sábana)
const Durmiente: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly color?: string }> = ({ x, y, s = 1, color = "#4A5A8A" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-140} y={-60} width={280} height={500} rx={40} fill="#2A2440" />
    <circle cx={0} cy={20} r={60} fill={PIEL} />
    <rect x={-120} y={90} width={240} height={330} rx={30} fill={color} />
  </g>
);

// Imagen del gancho y del cierre: dos camas, mosquitos solo en una
const DosCamas: React.FC<{ readonly t: number; readonly mira: number }> = ({ t, mira }) => (
  <>
    <Durmiente x={320} y={720} />
    <Durmiente x={760} y={720} color="#5A4A7A" />
    <g opacity={mira}>
      <circle cx={320} cy={740} r={120} fill="none" stroke={C.red} strokeWidth={8} />
      <line x1={320} y1={590} x2={320} y2={660} stroke={C.red} strokeWidth={8} />
      <line x1={320} y1={820} x2={320} y2={890} stroke={C.red} strokeWidth={8} />
      <line x1={170} y1={740} x2={240} y2={740} stroke={C.red} strokeWidth={8} />
      <line x1={400} y1={740} x2={470} y2={740} stroke={C.red} strokeWidth={8} />
    </g>
    {new Array(7).fill(0).map((_, k) => (
      <Mosquito
        key={k}
        x={320 + Math.cos(t * 1.5 + k) * (120 + k * 14)}
        y={760 + Math.sin(t * 2 + k * 1.3) * (110 + k * 10)}
        s={1.7}
        t={t + k}
        op={mira}
      />
    ))}
  </>
);

// A. Gancho: los mosquitos te eligen a ti
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.y], [1.12, 1])}>
        <DosCamas t={t} mira={interpolate(t, [0.5, 0.9], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.82} color={C.red} />
    </>
  );
};

// B. No es por tu sangre dulce + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.el], [1, 1.05])}>
      <g transform="translate(540 760)">
        <rect x={-120} y={-120} width={240} height={240} rx={20} fill={C.white} />
        <rect x={-120} y={-120} width={240} height={240} rx={20} fill="none" stroke="#C8C4D8" strokeWidth={6} />
        {new Array(9).fill(0).map((_, k) => (
          <circle key={k} cx={-70 + (k % 3) * 70} cy={-70 + Math.floor(k / 3) * 70} r={6} fill="#C8C4D8" />
        ))}
      </g>
      <g opacity={aparece(t, T.dulce)}>
        <line x1={360} y1={580} x2={720} y2={940} stroke={C.red} strokeWidth={16} />
        <Texto x={540} y={1020} size={40} color={C.red}>
          sangre dulce: mito
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.el], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={36}>
          si algún día te dejarán en paz: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Cabeza de perfil mirando a la derecha
const Perfil: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={110} fill={PIEL} />
    <path d="M 100 -10 L 140 30 L 100 40 Z" fill={PIEL} />
    <circle cx={50} cy={-30} r={10} fill="#1A1010" />
  </g>
);

// C. Te encuentra primero por el CO2 que exhalas, desde decenas de metros
export const Co2: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nube = aparece(t, T.co2);
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.al], [1, 1.04])}>
      <Perfil x={220} y={820} s={1} />
      {new Array(16).fill(0).map((_, k) => {
        const u = (t * 0.35 + k / 16) % 1;
        return (
          <g key={k} opacity={nube * (1 - u)}>
            <circle cx={380 + u * 560} cy={840 + (random(`c${k}`) - 0.5) * 300 * u} r={20} fill={CO2} />
            <text x={380 + u * 560} y={848 + (random(`c${k}`) - 0.5) * 300 * u} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.bg} fontFamily="JetBrains Mono">
              CO₂
            </text>
          </g>
        );
      })}
      <Mosquito x={interpolate(t, [T.co2, T.al], [980, 700], clamp)} y={700 + Math.sin(t * 3) * 30} s={1.4} t={t} />
      <Texto x={600} y={1120} size={40} color={CO2} op={nube}>
        dióxido de carbono
      </Texto>
      <g opacity={aparece(t, T.metros)}>
        <line x1={300} y1={1220} x2={900} y2={1220} stroke={C.yellow} strokeWidth={6} />
        <path d="M 300 1200 L 300 1240 M 900 1200 L 900 1240" stroke={C.yellow} strokeWidth={6} />
        <Texto x={600} y={1290} size={36} color={C.yellow}>
          decenas de metros
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Al acercarse sigue el calor de tu piel y sobre todo tu olor
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const term = aparece(t, T.calor);
  const olor = aparece(t, T.olor);
  return (
    <Lienzo zoom={interpolate(t, [T.al, T.ese], [1, 1.05])}>
      <g>
        <circle cx={420} cy={700} r={110} fill={term > 0.5 ? C.orange : PIEL} />
        <rect x={320} y={820} width={200} height={380} rx={60} fill={term > 0.5 ? C.red : "#4A5A8A"} />
        <circle cx={420} cy={700} r={170} fill={C.yellow} opacity={0.15 * term} />
      </g>
      {new Array(5).fill(0).map((_, k) => {
        const u = (t * 0.7 + k / 5) % 1;
        return (
          <path
            key={k}
            d={`M ${560 + u * 300} ${760 + k * 60} q 20 -20 40 0 q 20 20 40 0`}
            stroke={OLOR}
            strokeWidth={8}
            fill="none"
            opacity={olor * Math.sin(u * Math.PI)}
          />
        );
      })}
      <Mosquito x={interpolate(t, [T.al, T.ese], [960, 640], clamp)} y={780 + Math.sin(t * 4) * 20} s={1.6} t={t} />
      <Texto x={420} y={1300} size={38} color={C.orange} op={term}>
        calor
      </Texto>
      <Texto x={800} y={1300} size={38} color={OLOR} op={olor}>
        olor
      </Texto>
    </Lienzo>
  );
};

// E. El olor lo fabrican las bacterias de tu piel con tu sudor; cada persona, una mezcla distinta
export const Bacterias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mezcla = aparece(t, T.mezcla);
  return (
    <Lienzo zoom={interpolate(t, [T.ese, T.quien], [1, 1.04])}>
      <g opacity={1 - mezcla}>
        <rect x={60} y={900} width={960} height={260} fill={PIEL} />
        {new Array(6).fill(0).map((_, k) => (
          <path key={k} d={`M ${140 + k * 160} 860 q 20 30 0 40 q -20 -10 0 -40 Z`} fill={C.cyan} opacity={aparece(t, T.sudor)} transform={`translate(0 ${-((t * 30 + k * 10) % 20)})`} />
        ))}
        {new Array(8).fill(0).map((_, k) => (
          <rect key={k} x={110 + k * 115} y={920} width={50} height={24} rx={12} fill="#5AC878" opacity={aparece(t, T.bacterias)} />
        ))}
        {new Array(10).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 10) % 1;
          return <circle key={k} cx={120 + k * 92} cy={880 - u * 300} r={12} fill={OLOR} opacity={aparece(t, T.sudor + 0.6) * (1 - u)} />;
        })}
        <Texto x={540} y={1250} size={38} color="#5AC878" op={aparece(t, T.bacterias)}>
          bacterias + sudor = olor
        </Texto>
      </g>
      <g opacity={mezcla}>
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <circle cx={240 + k * 300} cy={760} r={80} fill={PIEL} />
            {new Array(6).fill(0).map((_, j) => (
              <circle key={j} cx={240 + k * 300 + Math.cos(j + t) * 120} cy={760 + Math.sin(j * 1.7 + t) * 120} r={14} fill={[OLOR, C.purpleLight, C.cyan, C.orange][(j + k * 2) % 4]} />
            ))}
          </g>
        ))}
        <Texto x={540} y={1050} size={40} color={C.white}>
          cada uno, una mezcla distinta
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Quien es más grande o acaba de hacer ejercicio exhala más y atrae más
export const Grande: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.quien, T.pero], [1, 1.04])}>
      <g>
        <circle cx={280} cy={760} r={70} fill={PIEL} />
        <rect x={220} y={840} width={120} height={260} rx={40} fill="#4A5A8A" />
        <circle cx={280} cy={600} r={70} fill={CO2} opacity={0.3} />
      </g>
      <g opacity={aparece(t, T.ejercicio - 0.6)}>
        <circle cx={760} cy={720} r={95} fill={PIEL} />
        <rect x={670} y={820} width={180} height={330} rx={50} fill="#8A4A4A" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${700 + k * 50} 600 q 10 20 0 30 q -10 -10 0 -30 Z`} fill={C.cyan} />
        ))}
        <circle cx={760} cy={480} r={150 * (1 + Math.sin(t * 3) * 0.05)} fill={CO2} opacity={0.35 * aparece(t, T.exhala)} />
        {new Array(6).fill(0).map((_, k) => (
          <Mosquito key={k} x={760 + Math.cos(t * 2 + k) * 200} y={760 + Math.sin(t * 2.4 + k) * 200} s={1.4} t={t + k} op={aparece(t, T.exhala + k * 0.1)} />
        ))}
      </g>
      <Texto x={760} y={1260} size={36} color={C.white} op={aparece(t, T.exhala)}>
        más CO₂ = más mosquitos
      </Texto>
    </Lienzo>
  );
};

// G. La clave: ácidos grasos de la piel; las preferidas producían muchísimos más, y 3 años después igual
export const Acidos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const barras = [0.15, 0.25, 1, 0.2, 0.3];
  const crece = interpolate(t, [T.estudio + 0.3, T.muchisimos + 0.4], [0, 1], suave);
  const anos = aparece(t, T.tres);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.porque], [1, 1.04])}>
        <Texto x={540} y={560} size={40} color={OLOR} op={aparece(t, T.acidos)}>
          ácidos grasos de la piel
        </Texto>
        <Tarjeta x={120} y={620} w={840} h={560} op={aparece(t, T.estudio)}>
          {barras.map((b, k) => (
            <g key={k}>
              <rect
                x={190 + k * 150}
                y={1080 - 380 * b * crece}
                width={100}
                height={380 * b * crece}
                rx={12}
                fill={k === 2 ? C.red : "#6A6488"}
              />
              <circle cx={240 + k * 150} cy={1130} r={22} fill={k === 2 ? C.red : PIEL} />
            </g>
          ))}
        </Tarjeta>
        <g opacity={anos}>
          <rect x={240} y={1220} width={600} height={90} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={1280} size={40} color={C.yellow}>
            3 años después: igual
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.favoritas} color={C.red} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <DosCamas t={t} mira={1} />
    </Lienzo>
  );
};
