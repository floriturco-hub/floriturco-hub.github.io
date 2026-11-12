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

// Instantes clave (s) de public/audio/perro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  y: 2.12,
  cinco: 3.64,
  final: 4.86,
  cada: 6.64,
  sudor: 7.62,
  piel: 8.24,
  evaporarse: 10.44,
  vieja: 11.4,
  nueva: 13.5,
  perro: 16.3,
  compara: 18.6,
  diminuta: 19.8,
  logra: 20.62,
  receptores: 22.54,
  contra: 23.3,
  fosa: 25.58,
  separado: 27.24,
  asi: 27.98,
  creciendo: 29.22,
  fugitivo: 30.74,
  porque: 31.56,
  fin: 33.84,
};

const PERRO = "#C89060";
const OLOR = "#B87AE8";

// Huella de zapato (vista desde arriba), apuntando hacia la derecha
const Huella: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly izq?: boolean;
  readonly op?: number;
  readonly color?: string;
}> = ({ x, y, s = 1, izq = false, op = 1, color = "#6A6488" }) => (
  <g transform={`translate(${x} ${y + (izq ? -34 : 34) * s}) scale(${s})`} opacity={op} fill={color}>
    <ellipse cx={22} cy={0} rx={42} ry={26} />
    <ellipse cx={-36} cy={0} rx={22} ry={20} />
  </g>
);

// Fila de pisadas hacia la derecha; el olor crece hacia las más nuevas
const Rastro: React.FC<{
  readonly t: number;
  readonly y: number;
  readonly n: number;
  readonly x0: number;
  readonly paso: number;
  readonly olor: number;
  readonly s?: number;
}> = ({ t, y, n, x0, paso, olor, s = 1 }) => (
  <g>
    {new Array(n).fill(0).map((_, k) => {
      const fuerza = (k + 1) / n;
      return (
        <g key={k}>
          <Huella x={x0 + k * paso} y={y} s={s} izq={k % 2 === 0} />
          {new Array(4).fill(0).map((__, j) => {
            const u = (t * 0.6 + j / 4 + random(`r${k}${j}`)) % 1;
            return (
              <circle
                key={j}
                cx={x0 + k * paso + Math.sin(u * 6 + j) * 18 * s}
                cy={y + (k % 2 === 0 ? -34 : 34) * s - u * 140 * s}
                r={(10 + 10 * fuerza) * s}
                fill={OLOR}
                opacity={olor * fuerza * 0.6 * (1 - u)}
              />
            );
          })}
        </g>
      );
    })}
  </g>
);

// Perro de perfil mirando a la derecha, con la nariz en (x, y)
const Perro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly anda?: number;
}> = ({ x, y, s, t, anda = 0 }) => {
  const p = Math.sin(t * 10) * 14 * anda;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={PERRO}>
      <ellipse cx={-260} cy={-140} rx={170} ry={70} />
      <rect x={-390} y={-110} width={34} height={150} rx={14} transform={`rotate(${p} -373 -110)`} />
      <rect x={-330} y={-110} width={34} height={150} rx={14} transform={`rotate(${-p} -313 -110)`} />
      <rect x={-200} y={-110} width={34} height={150} rx={14} transform={`rotate(${-p} -183 -110)`} />
      <rect x={-140} y={-110} width={34} height={150} rx={14} transform={`rotate(${p} -123 -110)`} />
      <path d="M -420 -170 Q -480 -240 -470 -270" stroke={PERRO} strokeWidth={22} fill="none" strokeLinecap="round" />
      {/* cuello y cabeza agachada hacia el suelo */}
      <path d="M -130 -190 Q -40 -170 -20 -60 L -80 -40 Q -110 -130 -170 -110 Z" />
      <ellipse cx={-40} cy={-40} rx={70} ry={50} />
      <path d="M -10 -60 L 30 -10 Q 10 10 -20 0 Z" />
      <circle cx={18} cy={-6} r={14} fill="#2A1A10" />
      <ellipse cx={-80} cy={-60} rx={24} ry={50} fill="#8A5A38" transform="rotate(20 -80 -60)" />
      <circle cx={-30} cy={-58} r={8} fill="#1A1010" />
    </g>
  );
};

// Imagen del gancho y del cierre: pisadas con flecha de dirección
const Pisadas: React.FC<{ readonly t: number; readonly flecha: number }> = ({ t, flecha }) => (
  <>
    <Rastro t={t} y={900} n={6} x0={150} paso={156} olor={1} s={1.3} />
    <g opacity={flecha}>
      <line x1={200} y1={1140} x2={880} y2={1140} stroke={C.yellow} strokeWidth={14} strokeLinecap="round" />
      <path d="M 880 1100 L 950 1140 L 880 1180 Z" fill={C.yellow} />
    </g>
  </>
);

// A. Gancho: tus pisadas dicen hacia dónde vas
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.y], [1.12, 1])}>
        <Pisadas t={t} flecha={interpolate(t, [0.8, 1.2], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.12} color={C.yellow} />
    </>
  );
};

// B. Un perro lo descubre en solo cinco pasos + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasos = Math.min(5, Math.floor(interpolate(t, [T.cinco - 0.2, T.cinco + 1], [0, 5], clamp)));
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.cada], [1, 1.05])}>
      <Perro x={720} y={940} s={1.15} t={t} />
      <g opacity={aparece(t, T.cinco)}>
        {[0, 1, 2, 3, 4].map((k) => (
          <Huella key={k} x={180 + k * 175} y={1080} s={1} izq={k % 2 === 0} color={k < pasos ? C.yellow : "#3A3456"} />
        ))}
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.cada], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={40}>
          su truco: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Cada pisada deja sudor y células de piel que se evaporan
export const Olor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const evap = aparece(t, T.evaporarse);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.vieja], [1, 1.05])}>
      <Huella x={540} y={840} s={3.2} />
      {new Array(14).fill(0).map((_, k) => {
        const u = (t * 0.5 + k / 14) % 1;
        const tipo = k % 2;
        return (
          <circle
            key={k}
            cx={400 + random(`o${k}`) * 280 + Math.sin(u * 6 + k) * 30}
            cy={860 - u * 380 * evap}
            r={tipo ? 14 : 20}
            fill={tipo ? C.cyan : C.white}
            opacity={aparece(t, tipo ? T.piel : T.sudor) * (1 - u * evap)}
          />
        );
      })}
      <g opacity={aparece(t, T.sudor)}>
        <circle cx={260} cy={1180} r={18} fill={C.white} />
        <Texto x={360} y={1192} size={36} color={C.white} anchor="start">
          sudor
        </Texto>
      </g>
      <g opacity={aparece(t, T.piel)}>
        <circle cx={260} cy={1260} r={14} fill={C.cyan} />
        <Texto x={360} y={1272} size={36} color={C.cyan} anchor="start">
          células de piel
        </Texto>
      </g>
      <Texto x={540} y={1380} size={40} color={OLOR} op={evap}>
        el olor se evapora
      </Texto>
    </Lienzo>
  );
};

// D. La huella más vieja huele menos; la más nueva, un poco más
export const Gradiente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nueva = aparece(t, T.nueva);
  return (
    <Lienzo zoom={interpolate(t, [T.vieja, T.perro], [1, 1.04])}>
      <Rastro t={t} y={820} n={5} x0={180} paso={180} olor={1} s={1.1} />
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={k}>
          <rect x={140 + k * 180} y={1180 - (k + 1) * 50} width={80} height={(k + 1) * 50} rx={10} fill={OLOR} opacity={0.4 + 0.12 * k} />
        </g>
      ))}
      <rect x={110} y={1180} width={860} height={6} fill={C.grey} />
      <g opacity={aparece(t, T.vieja + 0.3)}>
        <Texto x={180} y={1250} size={34} color={C.grey}>
          vieja
        </Texto>
      </g>
      <g opacity={nueva}>
        <Texto x={900} y={1250} size={34} color={C.yellow}>
          nueva
        </Texto>
        <Texto x={540} y={1360} size={40} color={C.white}>
          más olor = más reciente
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. El perro olfatea varias huellas seguidas y compara
export const Compara: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nariz = interpolate(t, [T.perro + 0.3, T.logra], [460, 900], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.perro, T.logra], [1, 1.04])}>
      <Rastro t={t} y={1000} n={5} x0={190} paso={160} olor={0.8} />
      <Perro x={nariz} y={960} s={0.75} t={t} anda={1} />
      <g opacity={aparece(t, T.compara)}>
        <Tarjeta x={180} y={1170} w={720} h={160}>
          <rect x={230} y={1210} width={260} height={30} rx={15} fill={OLOR} opacity={0.6} />
          <rect x={230} y={1260} width={280} height={30} rx={15} fill={OLOR} />
          <Texto x={540} y={1236} size={30} color={C.grey} anchor="start">
            antes
          </Texto>
          <Texto x={540} y={1286} size={30} color={C.yellow} anchor="start">
            después
          </Texto>
        </Tarjeta>
      </g>
      <Texto x={540} y={1420} size={38} color={C.yellow} op={aparece(t, T.diminuta)}>
        diferencia diminuta
      </Texto>
    </Lienzo>
  );
};

// F. 300 millones de receptores contra 6 millones; cada fosa nasal por separado
export const Nariz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fosas = aparece(t, T.fosa);
  const barra = interpolate(t, [T.logra + 0.2, T.receptores], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.logra, T.asi], [1, 1.04])}>
        <g opacity={1 - fosas}>
          <Texto x={540} y={500} size={40} color={C.white}>
            receptores de olor
          </Texto>
          <rect x={240} y={1150 - 560 * barra} width={220} height={560 * barra} rx={16} fill={PERRO} />
          <Texto x={350} y={1220} size={36} color={PERRO}>
            perro
          </Texto>
          <Texto x={350} y={1130 - 560 * barra} size={40} color={C.white} op={barra}>
            300 M
          </Texto>
          <g opacity={aparece(t, T.contra)}>
            <rect x={620} y={1139} width={220} height={11} rx={4} fill={C.cyan} />
            <Texto x={730} y={1220} size={36} color={C.cyan}>
              humano
            </Texto>
            <Texto x={730} y={1110} size={40} color={C.white}>
              6 M
            </Texto>
          </g>
        </g>
        <g opacity={fosas}>
          <ellipse cx={540} cy={800} rx={300} ry={220} fill="#2A1A10" />
          <ellipse cx={430} cy={820} rx={70} ry={90} fill="#0A0606" />
          <ellipse cx={650} cy={820} rx={70} ry={90} fill="#0A0606" />
          {new Array(5).fill(0).map((_, k) => {
            const u = (t * 0.8 + k / 5) % 1;
            return (
              <g key={k}>
                <circle cx={430 - 60 - u * 260} cy={1000 + u * 120} r={16} fill={OLOR} opacity={1 - u} />
                <circle cx={650 + 60 + u * 260} cy={1000 + u * 120} r={16} fill={C.yellow} opacity={1 - u} />
              </g>
            );
          })}
          <Texto x={260} y={1240} size={36} color={OLOR}>
            izquierda
          </Texto>
          <Texto x={820} y={1240} size={36} color={C.yellow}>
            derecha
          </Texto>
          <Texto x={540} y={1360} size={40} color={C.white} op={aparece(t, T.separado)}>
            cada fosa huele aparte
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.receptores} color={PERRO} />
    </>
  );
};

// Silueta de persona caminando
const Fugitivo: React.FC<{ readonly x: number; readonly y: number; readonly op: number }> = ({ x, y, op }) => (
  <g transform={`translate(${x} ${y})`} fill={C.red} opacity={op}>
    <circle cx={0} cy={-230} r={40} />
    <rect x={-40} y={-185} width={80} height={150} rx={30} />
    <rect x={-36} y={-50} width={30} height={130} rx={14} transform="rotate(14 -21 -50)" />
    <rect x={6} y={-50} width={30} height={130} rx={14} transform="rotate(-14 21 -50)" />
  </g>
);

// G. Sigue el olor que crece, directo hacia el fugitivo
export const Sigue: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const avance = interpolate(t, [T.asi, T.porque], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.asi, T.porque], [1, 1.06])}>
        <Rastro t={t} y={1040} n={6} x0={120} paso={130} olor={aparece(t, T.creciendo - 0.4)} />
        <Perro x={360 + avance * 360} y={1000} s={0.65} t={t} anda={1} />
        <Fugitivo x={930} y={1060} op={aparece(t, T.fugitivo - 0.3)} />
        <line x1={180} y1={700} x2={760} y2={700} stroke={C.yellow} strokeWidth={12} strokeLinecap="round" opacity={aparece(t, T.creciendo)} />
        <path d="M 760 664 L 830 700 L 760 736 Z" fill={C.yellow} opacity={aparece(t, T.creciendo)} />
      </Lienzo>
      <Flash t={t} d={T.fugitivo} color={C.red} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <Pisadas t={t} flecha={1} />
    </Lienzo>
  );
};
