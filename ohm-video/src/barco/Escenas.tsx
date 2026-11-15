import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/barco/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  pesa: 2.0,
  aguja: 4.14,
  final: 6.0,
  todo: 8.12,
  aparta: 9.58,
  y: 10.36,
  empuja: 10.74,
  peso: 13.54,
  la: 15.06,
  poquita: 17.62,
  hunde: 20.12,
  el: 20.94,
  aire: 22.84,
  su: 23.98,
  montana: 25.24,
  cuando: 26.74,
  flota: 30.6,
  si: 31.54,
  agujero: 32.18,
  ocupa: 33.1,
  pesa2: 34.94,
  hunde2: 36.88,
  porEso: 37.62,
  fin: 39.56,
};

const MAR = "#1A4A7A";
const CASCO = "#C84A3A";
const ACERO = "#8A86A8";

// Barco carguero de perfil; hunde = cuánto baja (px)
const Barco: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -380 -60 L 360 -60 L 400 -100 L 400 -40 L 320 60 L -340 60 Z" fill={CASCO} />
    <rect x={-380} y={-80} width={760} height={24} fill="#2A2640" />
    {["#4AA8E8", "#E8C048", "#5AC878", "#E8703C", "#4AA8E8", "#E8C048"].map((c, k) => (
      <rect key={k} x={-300 + k * 90} y={-160} width={80} height={80} fill={c} />
    ))}
    <rect x={250} y={-230} width={90} height={150} fill={C.white} />
    <rect x={265} y={-210} width={60} height={20} fill="#2A2640" />
  </g>
);

// Olas superficie
const Agua: React.FC<{ readonly y: number; readonly t: number; readonly x0?: number; readonly x1?: number }> = ({ y, t, x0 = 0, x1 = 1080 }) => (
  <path
    d={
      new Array(Math.floor((x1 - x0) / 40) + 1)
        .fill(0)
        .map((_, k) => `${k === 0 ? "M" : "L"} ${x0 + k * 40} ${y + Math.sin(k * 0.6 - t * 2) * 8}`)
        .join(" ") + ` L ${x1} 1500 L ${x0} 1500 Z`
    }
    fill={MAR}
    opacity={0.85}
  />
);

// A. Gancho: ¿por qué flota este gigante de acero?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pesa], [1.12, 1])}>
        <Barco x={540} y={880 + Math.sin(t * 1.5) * 6} s={1.25} rot={Math.sin(t) * 1} />
        <Agua y={930} t={t} />
        <Texto x={540} y={600} size={110} color={C.yellow} op={interpolate(t, [0.6, 0.9], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.84} color="#8AB8E8" />
    </>
  );
};

// Pecera / tanque
const Tanque: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly nivel: number }> = ({ x, y, w, h, nivel }) => (
  <g>
    <rect x={x} y={y + h * (1 - nivel)} width={w} height={h * nivel} fill={MAR} opacity={0.85} />
    <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y}`} stroke="#C8C4D8" strokeWidth={8} fill="none" />
  </g>
);

// B. Pesa 200.000 toneladas, pero una aguja de acero se hunde + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cae = interpolate(t, [T.aguja, T.aguja + 1.2], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.pesa, T.todo], [1, 1.05])}>
      <Tanque x={80} y={620} w={440} h={500} nivel={0.7} />
      <Barco x={300} y={760} s={0.42} />
      <Texto x={300} y={1200} size={36} color={C.white} op={aparece(t, T.pesa)}>
        200.000 t: flota
      </Texto>
      <g opacity={aparece(t, T.aguja - 0.4)}>
        <Tanque x={560} y={620} w={440} h={500} nivel={0.7} />
        <rect x={776} y={interpolate(cae, [0, 1], [700, 1060])} width={8} height={60} fill={ACERO} />
        <Texto x={780} y={1200} size={36} color={C.red}>
          1 g: se hunde
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.todo], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={40}>
          qué lo puede hundir: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Flecha vertical
const Flecha: React.FC<{ readonly x: number; readonly y1: number; readonly y2: number; readonly color: string; readonly op?: number }> = ({ x, y1, y2, color, op = 1 }) => {
  const d = y2 > y1 ? 1 : -1;
  return (
    <g opacity={op}>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={14} />
      <path d={`M ${x - 26} ${y2 - d * 6} L ${x} ${y2 + d * 30} L ${x + 26} ${y2 - d * 6} Z`} fill={color} />
    </g>
  );
};

// C. Todo lo que entra al agua la aparta; el agua empuja hacia arriba con el peso del agua apartada
export const Aparta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.todo + 0.3, T.aparta + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.todo, T.la], [1, 1.04])}>
      <Tanque x={240} y={560} w={600} h={700} nivel={0.6 + 0.12 * entra} />
      <rect x={440} y={interpolate(entra, [0, 1], [500, 860])} width={200} height={200} fill={ACERO} opacity={0.85} />
      <rect x={240} y={840 - 84 * entra} width={600} height={84 * entra} fill="#4AA8E8" opacity={0.5 * aparece(t, T.aparta)} />
      <Flecha x={540} y1={1180} y2={1080} color={C.cyan} op={aparece(t, T.empuja)} />
      <Texto x={540} y={1340} size={36} color={C.cyan} op={aparece(t, T.empuja)}>
        empuje hacia arriba
      </Texto>
      <Texto x={540} y={1410} size={32} color={C.white} op={aparece(t, T.peso)}>
        = peso del agua apartada
      </Texto>
    </Lienzo>
  );
};

// D. La aguja es pequeña y maciza: aparta muy poca agua y su peso gana
export const Aguja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cae = interpolate(t, [T.hunde - 0.4, T.el], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.el], [1, 1.04])}>
      <Tanque x={240} y={560} w={600} h={700} nivel={0.75} />
      <rect x={530} y={interpolate(cae, [0, 1], [760, 1180])} width={20} height={80} fill={ACERO} />
      <g opacity={aparece(t, T.poquita)} transform={`translate(0 ${cae * 420})`}>
        <Flecha x={460} y1={880} y2={820} color={C.cyan} />
        <Flecha x={620} y1={760} y2={920} color={C.red} />
      </g>
      <Texto x={540} y={1360} size={36} color={C.cyan} op={aparece(t, T.poquita)}>
        empuje pequeño
      </Texto>
      <Texto x={540} y={1420} size={36} color={C.red} op={aparece(t, T.hunde)}>
        su peso gana: se hunde
      </Texto>
    </Lienzo>
  );
};

// E-F. El barco es casi todo aire; aparta una montaña de agua y flota cuando los pesos se igualan
export const Hueco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const monta = aparece(t, T.montana);
  const igual = aparece(t, T.cuando + 0.6);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.el, T.si], [1, 1.04])}>
        <Agua y={860} t={t} />
        {/* casco en corte */}
        <path d="M 200 700 L 880 700 L 820 1000 L 260 1000 Z" fill={CASCO} />
        <path d="M 230 720 L 850 720 L 795 975 L 285 975 Z" fill="#C8E0F0" opacity={0.25 + 0.2 * aparece(t, T.aire)} />
        <Texto x={540} y={880} size={44} color={C.white} op={aparece(t, T.aire)}>
          aire
        </Texto>
        <g opacity={monta}>
          <rect x={260} y={1060} width={560} height={200} fill="#4AA8E8" opacity={0.6} />
          <Texto x={540} y={1180} size={32} color={C.white}>
            agua apartada
          </Texto>
        </g>
        <g opacity={igual}>
          <Flecha x={160} y1={760} y2={960} color={C.red} />
          <Flecha x={920} y1={1000} y2={800} color={C.cyan} />
          <Texto x={540} y={1360} size={40} color={C.yellow}>
            peso = empuje: flota
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.flota} color="#8AB8E8" />
    </>
  );
};

// G. Si se abre un agujero, el agua ocupa el lugar del aire y se hunde
export const Agujero: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const llena = interpolate(t, [T.ocupa - 0.3, T.pesa2 + 0.6], [0, 1], suave);
  const baja = interpolate(t, [T.pesa2, T.porEso], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.04])}>
      <g transform={`translate(0 ${baja * 380}) rotate(${baja * 8} 540 850)`}>
        <path d="M 200 700 L 880 700 L 820 1000 L 260 1000 Z" fill={CASCO} />
        <path d="M 230 720 L 850 720 L 795 975 L 285 975 Z" fill="#C8E0F0" opacity={0.3} />
        <path d={`M ${285 + 10 * (1 - llena)} ${975 - 255 * llena} L ${795 - 10 * (1 - llena)} ${975 - 255 * llena} L 795 975 L 285 975 Z`} fill={MAR} />
        <circle cx={700} cy={960} r={20} fill="#0A0814" opacity={aparece(t, T.agujero)} />
      </g>
      <Agua y={860} t={t} />
      <Texto x={540} y={1420} size={40} color={C.red} op={aparece(t, T.hunde2)}>
        se hunde
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Barco x={540} y={880 + Math.sin(t * 1.5) * 6} s={1.25} rot={Math.sin(t) * 1} />
      <Agua y={930} t={t} />
      <Texto x={540} y={600} size={110} color={C.yellow} op={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)}>
        ?
      </Texto>
    </Lienzo>
  );
};
