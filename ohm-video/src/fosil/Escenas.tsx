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

// Instantes clave (s) de public/audio/fosil/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  nunca: 1.62,
  final: 3.3,
  vivimos: 6.26,
  comemos: 7.34,
  c14: 9.58,
  radiactivo: 10.68,
  morir: 11.78,
  cuenta: 14.22,
  cada: 15.22,
  mitad: 17.56,
  midiendo: 18.34,
  murio: 20.16,
  pero: 20.9,
  cincuenta: 22.22,
  dino: 23.68,
  ceniza: 25.12,
  abajo: 26.66,
  relojes: 27.44,
  potasio: 29.32,
  argon: 30.64,
  medio: 31.38,
  entre: 33.36,
  porque: 34.56,
  fin: 36.8,
};

const HUESO = "#E8DCC0";
const ROCA = ["#5A4030", "#6E5038", "#4A3428", "#7A5A40", "#5E4432"];
const CENIZA = "#B8B4C8";

// Hueso (fémur) horizontal centrado en (x,y)
const Hueso: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly color?: string;
}> = ({ x, y, s, color = HUESO }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <rect x={-150} y={-28} width={300} height={56} rx={20} />
    <circle cx={-160} cy={-34} r={42} />
    <circle cx={-160} cy={34} r={42} />
    <circle cx={160} cy={-34} r={42} />
    <circle cx={160} cy={34} r={42} />
  </g>
);

// Esfera de reloj con agujas
const Reloj: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly a: number; // vueltas del minutero
  readonly color?: string;
  readonly op?: number;
}> = ({ x, y, r, a, color = C.cyan, op = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <circle r={r} fill="#120F22" stroke={color} strokeWidth={r * 0.08} />
    {new Array(12).fill(0).map((_, k) => (
      <line
        key={k}
        x1={0}
        y1={-r * 0.78}
        x2={0}
        y2={-r * 0.9}
        stroke={color}
        strokeWidth={r * 0.05}
        transform={`rotate(${k * 30})`}
      />
    ))}
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-r * 0.7}
      stroke={C.white}
      strokeWidth={r * 0.06}
      strokeLinecap="round"
      transform={`rotate(${a * 360})`}
    />
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-r * 0.45}
      stroke={C.yellow}
      strokeWidth={r * 0.08}
      strokeLinecap="round"
      transform={`rotate(${a * 30})`}
    />
    <circle r={r * 0.07} fill={C.white} />
  </g>
);

// Imagen del gancho y del cierre: hueso con un reloj dentro
const HuesoReloj: React.FC<{ readonly t: number; readonly brillo: number }> = ({
  t,
  brillo,
}) => (
  <>
    <circle cx={540} cy={900} r={330} fill={C.cyan} opacity={0.12 * brillo} />
    <Hueso x={540} y={900} s={2.2} />
    <Reloj x={540} y={900} r={120} a={t * 0.25} op={brillo} />
  </>
);

// A. Gancho: este hueso esconde un reloj
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.nunca], [1.12, 1])}>
        <HuesoReloj t={t} brillo={interpolate(t, [0.6, 1.1], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.0} color={C.cyan} />
    </>
  );
};

// B. Nunca se atrasa + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.nunca, T.vivimos], [1, 1.05])}>
      <Reloj x={540} y={760} r={230} a={t * 1.5} />
      <Texto x={540} y={1090} color={C.white} size={46}>
        nunca se atrasa
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.vivimos], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          la hora de un dinosaurio: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Átomo de carbono: gris (C-12) o amarillo (C-14)
const Atomo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly c14: boolean;
  readonly op?: number;
  readonly r?: number;
}> = ({ x, y, c14, op = 1, r = 26 }) => (
  <g opacity={op}>
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={c14 ? C.yellow : "#4A4466"}
      stroke={c14 ? "#FFF0B0" : "#6A6488"}
      strokeWidth={3}
    />
    <text
      x={x}
      y={y + r * 0.38}
      textAnchor="middle"
      fontSize={r * 1.0}
      fontWeight={700}
      fill={c14 ? "#1A1636" : C.white}
      fontFamily="JetBrains Mono"
    >
      C
    </text>
  </g>
);

// Persona esquemática
const Persona: React.FC<{ readonly x: number; readonly y: number }> = ({
  x,
  y,
}) => (
  <g transform={`translate(${x} ${y})`} fill={C.purpleLight}>
    <circle cx={0} cy={-170} r={60} />
    <rect x={-70} y={-100} width={140} height={200} rx={50} />
    <rect x={-60} y={90} width={45} height={150} rx={20} />
    <rect x={15} y={90} width={45} height={150} rx={20} />
  </g>
);

// C. Mientras vivimos comemos carbono; una parte es carbono 14
export const Comer: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const flujo = (t - T.vivimos) * 0.9;
  return (
    <Lienzo zoom={interpolate(t, [T.vivimos, T.morir], [1, 1.04])}>
      <Persona x={760} y={880} />
      {/* planta */}
      <g transform="translate(220 1040)">
        <rect x={-10} y={-200} width={20} height={200} fill="#5AC878" />
        <ellipse cx={-50} cy={-150} rx={60} ry={26} fill="#5AC878" />
        <ellipse cx={50} cy={-100} rx={60} ry={26} fill="#5AC878" />
        <ellipse cx={0} cy={-220} rx={40} ry={50} fill="#5AC878" />
      </g>
      {new Array(10).fill(0).map((_, k) => {
        const u = (flujo + k * 0.1) % 1;
        const op = aparece(t, T.comemos) * interpolate(u, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
        return (
          <Atomo
            key={k}
            x={260 + u * 440}
            y={760 + Math.sin(u * 6 + k) * 40}
            c14={k === 3 && t > T.c14}
            op={op}
          />
        );
      })}
      <g opacity={aparece(t, T.c14)}>
        <Atomo x={380} y={1240} c14={false} r={40} />
        <Texto x={380} y={1340} size={34} color={C.grey}>
          carbono 12
        </Texto>
        <Atomo x={700} y={1240} c14 r={40} />
        <Texto x={700} y={1340} size={34} color={C.yellow}>
          carbono 14
        </Texto>
      </g>
      <Flash t={t} d={T.radiactivo} color={C.yellow} />
    </Lienzo>
  );
};

// D. Al morir empieza la cuenta atrás: cada 5.700 años desaparece la mitad
export const Cuenta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  // 0, 1, 2, 3 vidas medias a lo largo de la escena
  const vidas = interpolate(t, [T.cada, T.midiendo - 0.2], [0, 3], clamp);
  const vivos = 32 / Math.pow(2, vidas);
  return (
    <Lienzo zoom={interpolate(t, [T.morir, T.midiendo], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.cuenta) * 0.6}>
        <Hueso x={540} y={520} s={1.0} color={HUESO} />
      </g>
      <Reloj
        x={540}
        y={520}
        r={80}
        a={-(t - T.cuenta) * 0.6}
        op={aparece(t, T.cuenta)}
        color={C.red}
      />
      {new Array(32).fill(0).map((_, k) => {
        const orden = random(`fos${k}`);
        const op = orden * 32 < vivos ? 1 : 0.12;
        return (
          <Atomo
            key={k}
            x={240 + (k % 8) * 86}
            y={760 + Math.floor(k / 8) * 86}
            c14
            r={30}
            op={op}
          />
        );
      })}
      <g opacity={aparece(t, T.cada)}>
        <rect x={190} y={1150} width={700} height={8} fill={C.grey} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k} opacity={vidas >= k - 0.05 ? 1 : 0.3}>
            <circle cx={190 + k * 233} cy={1154} r={14} fill={C.yellow} />
            <Texto x={190 + k * 233} y={1220} size={30} color={C.white}>
              {k === 0 ? "0" : `${(k * 5.7).toFixed(1).replace(".", ",")} mil`}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={1320} size={40} color={C.yellow}>
          {`queda ${Math.round(100 / Math.pow(2, Math.floor(vidas + 0.02)))} %`}
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Midiendo cuánto queda se sabe cuándo murió; límite de 50.000 años
export const Medir: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const limite = aparece(t, T.pero);
  const queda = interpolate(t, [T.midiendo, T.murio], [1, 0.25], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.midiendo, T.dino], [1, 1.04])}>
      <Tarjeta x={160} y={460} w={760} h={460}>
        <path
          d="M 300 820 A 240 240 0 0 1 780 820"
          fill="none"
          stroke="#2A2440"
          strokeWidth={40}
        />
        <path
          d="M 300 820 A 240 240 0 0 1 780 820"
          fill="none"
          stroke={C.yellow}
          strokeWidth={40}
          strokeDasharray={`${754 * queda} 2000`}
        />
        <line
          x1={540}
          y1={820}
          x2={540 - 200 * Math.cos(Math.PI * queda)}
          y2={820 - 200 * Math.sin(Math.PI * queda)}
          stroke={C.white}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <Texto x={540} y={560} size={34} color={C.grey}>
          carbono 14 que queda
        </Texto>
        <Texto x={540} y={890} size={44} color={C.yellow}>
          {`${Math.round(100 * queda)} %`}
        </Texto>
      </Tarjeta>
      <g opacity={aparece(t, T.murio) * (1 - limite)}>
        <Texto x={540} y={1100} size={48} color={C.white}>
          murió hace 11.400 años
        </Texto>
      </g>
      <g opacity={limite}>
        <rect x={140} y={1060} width={800} height={36} rx={18} fill="#2A2440" />
        <rect
          x={140}
          y={1060}
          width={800 * interpolate(t, [T.pero, T.cincuenta + 0.5], [0, 1], clamp)}
          height={36}
          rx={18}
          fill={C.cyan}
        />
        <line
          x1={940}
          y1={1030}
          x2={940}
          y2={1130}
          stroke={C.red}
          strokeWidth={10}
          opacity={aparece(t, T.cincuenta)}
        />
        <Texto x={540} y={1210} size={40} color={C.red} op={aparece(t, T.cincuenta)}>
          límite: unos 50.000 años
        </Texto>
      </g>
    </Lienzo>
  );
};

// Estratos de roca con dos capas de ceniza y un dinosaurio en medio
const Estratos: React.FC<{
  readonly cenizas: number;
  readonly dino: number;
}> = ({ cenizas, dino }) => {
  const capas = [
    [440, 120, ROCA[0]],
    [560, 50, CENIZA],
    [610, 140, ROCA[1]],
    [750, 180, ROCA[2]],
    [930, 140, ROCA[3]],
    [1070, 50, CENIZA],
    [1120, 160, ROCA[4]],
  ] as const;
  return (
    <g>
      {capas.map(([y, h, col], k) => (
        <rect
          key={k}
          x={60}
          y={y}
          width={960}
          height={h}
          fill={col}
          opacity={col === CENIZA ? 0.35 + 0.65 * cenizas : 1}
        />
      ))}
      <g opacity={dino} transform="translate(540 840)" fill={HUESO}>
        {/* esqueleto de dinosaurio esquemático */}
        <path
          d="M -300 10 Q -200 -60 -60 -40 L 120 -50 Q 200 -120 260 -110 L 300 -90 L 250 -70 L 160 -30 Q 120 0 60 10 L -60 20 Q -200 40 -300 10 Z"
          opacity={0.9}
        />
        {new Array(7).fill(0).map((_, k) => (
          <rect key={k} x={-120 + k * 30} y={-36} width={10} height={46} rx={4} />
        ))}
        <rect x={-40} y={10} width={18} height={70} rx={8} />
        <rect x={60} y={10} width={18} height={70} rx={8} />
      </g>
    </g>
  );
};

// F. Para un dinosaurio: ceniza volcánica de arriba y de abajo, relojes lentos
export const Dino: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ceniza = aparece(t, T.ceniza);
  const atomos = aparece(t, T.potasio);
  const conv = interpolate(t, [T.potasio + 0.4, T.argon + 0.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.dino, T.medio], [1, 1.04])}>
      <Estratos cenizas={ceniza} dino={1} />
      <Texto x={540} y={600} size={34} color="#1A1636" op={ceniza}>
        ceniza volcánica
      </Texto>
      <Texto x={540} y={1110} size={34} color="#1A1636" op={aparece(t, T.abajo)}>
        ceniza volcánica
      </Texto>
      <Reloj x={900} y={585} r={60} a={(t - T.relojes) * 0.05} op={aparece(t, T.relojes)} />
      <Reloj x={900} y={1095} r={60} a={(t - T.relojes) * 0.05} op={aparece(t, T.relojes)} />
      <g opacity={atomos}>
        <Tarjeta x={140} y={1320} w={800} h={150}>
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const ar = conv > (k + 1) / 7;
            return (
              <g key={k}>
                <circle
                  cx={250 + k * 116}
                  cy={1395}
                  r={36}
                  fill={ar ? C.cyan : C.purpleLight}
                />
                <text
                  x={250 + k * 116}
                  y={1408}
                  textAnchor="middle"
                  fontSize={30}
                  fontWeight={700}
                  fill={C.bg}
                  fontFamily="JetBrains Mono"
                >
                  {ar ? "Ar" : "K"}
                </text>
              </g>
            );
          })}
        </Tarjeta>
      </g>
      <Texto x={540} y={1300} size={34} color={C.white} op={atomos}>
        potasio → argón
      </Texto>
    </Lienzo>
  );
};

// G. El fósil queda en medio, atrapado entre dos fechas
export const Medio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fechas = aparece(t, T.medio + 0.4);
  const entre = aparece(t, T.entre);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.medio, T.porque], [1, 1.05])}>
        <Estratos cenizas={1} dino={1} />
        <g opacity={fechas}>
          <rect x={300} y={555} width={480} height={60} rx={14} fill={C.card} />
          <Texto x={540} y={598} size={36} color={C.yellow}>
            66 millones de años
          </Texto>
          <rect x={300} y={1065} width={480} height={60} rx={14} fill={C.card} />
          <Texto x={540} y={1108} size={36} color={C.yellow}>
            68 millones de años
          </Texto>
        </g>
        <g opacity={entre}>
          <rect
            x={120}
            y={680}
            width={840}
            height={330}
            rx={20}
            fill="none"
            stroke={C.cyan}
            strokeWidth={8}
            strokeDasharray="30 18"
          />
          <rect x={230} y={1290} width={620} height={90} rx={20} fill={C.card} />
          <Texto x={540} y={1350} size={42} color={C.cyan}>
            entre 66 y 68 millones
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.entre} color={C.cyan} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <HuesoReloj t={t} brillo={1} />
    </Lienzo>
  );
};
