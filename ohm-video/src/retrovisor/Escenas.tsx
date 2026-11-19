import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/retrovisor/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  el: 2.16,
  oscurece: 5.34,
  final: 6.46,
  espejo: 8.94,
  sensores: 10.02,
  uno: 11.18,
  atras: 13.52,
  noche: 14.86,
  oscuro: 17.34,
  si: 18.12,
  deslumbrando: 21.34,
  entonces: 22.52,
  gel: 24.9,
  vidrios: 25.74,
  electro: 27.22,
  oscurece2: 29.8,
  reflejo: 32.0,
  cuando: 33.8,
  aclara: 36.26,
  porEso: 37.44,
  fin: 39.44,
};

const GEL = "#2A4A6A";
const FARO = "#FFF4C8";

// Retrovisor con faros reflejados; osc = oscurecimiento (0..1)
const Retrovisor: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly osc: number; readonly faros?: number }> = ({
  x,
  y,
  s,
  osc,
  faros = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-220} width={40} height={90} fill="#3A3650" />
    <rect x={-300} y={-140} width={600} height={240} rx={60} fill="#1A1620" />
    <rect x={-280} y={-120} width={560} height={200} rx={46} fill="#8AA8C8" />
    {/* faros del auto de atrás */}
    <g opacity={faros}>
      <circle cx={-70} cy={-10} r={34} fill={FARO} />
      <circle cx={70} cy={-10} r={34} fill={FARO} />
      <circle cx={-70} cy={-10} r={90} fill={FARO} opacity={0.4 * (1 - osc)} />
      <circle cx={70} cy={-10} r={90} fill={FARO} opacity={0.4 * (1 - osc)} />
    </g>
    <rect x={-280} y={-120} width={560} height={200} rx={46} fill={GEL} opacity={osc * 0.75} />
  </g>
);

// A. Gancho: ¿cómo sabe tu espejo que te ciegan?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.el], [1.12, 1])}>
        <Retrovisor x={540} y={880} s={1.5} osc={interpolate(t, [0.6, 1.6], [0, 1], suave)} />
        <Texto x={540} y={1300} size={110} color={C.yellow} op={interpolate(t, [0.8, 1.1], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.4} color={FARO} />
    </>
  );
};

// Auto visto de frente con luces altas
const AutoFrente: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly luces: number }> = ({ x, y, s, luces }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 0 L -160 -110 L 160 -110 L 200 0 L 200 90 L -200 90 Z" fill="#4A4466" />
    <rect x={-140} y={-100} width={280} height={80} rx={10} fill="#2A2640" />
    <circle cx={-140} cy={30} r={30} fill={FARO} />
    <circle cx={140} cy={30} r={30} fill={FARO} />
    <g opacity={luces}>
      <path d="M -140 30 L -480 -200 L -480 260 Z" fill={FARO} opacity={0.25} />
      <path d="M 140 30 L 480 -200 L 480 260 Z" fill={FARO} opacity={0.25} />
    </g>
  </g>
);

// B. El auto de atrás trae luces altas y el retrovisor se oscurece solo + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.espejo], [1, 1.05])}>
      <AutoFrente x={540} y={1050} s={0.9} luces={aparece(t, T.el + 1)} />
      <Retrovisor x={540} y={600} s={0.8} osc={interpolate(t, [T.oscurece - 0.4, T.oscurece + 0.6], [0, 1], clamp)} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1290} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1290}
          width={700 * interpolate(t, [T.final, T.espejo], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1390} color={C.white} size={40}>
          qué esconde por dentro: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Medidor de luz
const Medidor: React.FC<{ readonly x: number; readonly y: number; readonly nivel: number; readonly color: string; readonly etiqueta: string; readonly op?: number }> = ({
  x,
  y,
  nivel,
  color,
  etiqueta,
  op = 1,
}) => (
  <g opacity={op}>
    <rect x={x - 40} y={y - 300} width={80} height={300} rx={20} fill="#2A2440" />
    <rect x={x - 40} y={y - 300 * nivel} width={80} height={300 * nivel} rx={20} fill={color} />
    <Texto x={x} y={y + 60} size={30} color={color}>
      {etiqueta}
    </Texto>
  </g>
);

// C-E. Dos sensores: adelante (camino) y atrás; de noche, si atrás hay mucha más luz, te deslumbran
export const Sensores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const adelante = aparece(t, T.uno);
  const atras = aparece(t, T.atras);
  const medir = aparece(t, T.noche);
  const alto = interpolate(t, [T.si, T.si + 1], [0.1, 0.95], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.espejo, T.entonces], [1, 1.04])}>
        <g transform="translate(540 600)">
          <rect x={-300} y={-120} width={600} height={240} rx={60} fill="#1A1620" />
          <circle cx={-200} cy={-60} r={22} fill={C.cyan} opacity={adelante} />
          <circle cx={200} cy={60} r={22} fill={C.orange} opacity={atras} />
        </g>
        <Texto x={300} y={460} size={30} color={C.cyan} op={adelante}>
          sensor hacia adelante
        </Texto>
        <Texto x={780} y={800} size={30} color={C.orange} op={atras}>
          sensor hacia atrás
        </Texto>
        <Medidor x={330} y={1240} nivel={0.12} color={C.cyan} etiqueta="camino: oscuro" op={medir} />
        <Medidor x={750} y={1240} nivel={alto} color={C.orange} etiqueta="atrás: ¡mucha luz!" op={aparece(t, T.si)} />
        <Texto x={540} y={1400} size={40} color={C.red} op={aparece(t, T.deslumbrando)}>
          ¡te están deslumbrando!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.deslumbrando} color={FARO} />
    </>
  );
};

// F. Manda una pequeña corriente a un gel especial entre dos vidrios
export const Gel: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corriente = aparece(t, T.entonces + 0.6);
  return (
    <Lienzo zoom={interpolate(t, [T.entonces, T.electro], [1, 1.04])}>
      <rect x={300} y={520} width={60} height={700} fill="#A8C8E8" opacity={0.7} />
      <rect x={360} y={520} width={80} height={700} fill={GEL} opacity={0.35 + 0.1 * Math.sin(t * 6) * corriente} />
      <rect x={440} y={520} width={60} height={700} fill="#A8C8E8" opacity={0.7} />
      <rect x={500} y={520} width={30} height={700} fill="#C8C4D8" />
      <Texto x={330} y={480} size={28} color="#A8C8E8" op={aparece(t, T.vidrios)}>
        vidrio
      </Texto>
      <Texto x={400} y={1280} size={30} color={C.cyan} op={aparece(t, T.gel)}>
        gel
      </Texto>
      <g opacity={corriente}>
        <rect x={720} y={760} width={160} height={240} rx={20} fill="#3A3650" />
        <rect x={770} y={730} width={60} height={30} fill="#3A3650" />
        <path d="M 810 820 L 770 890 L 800 890 L 785 950 L 835 870 L 805 870 L 820 820 Z" fill={C.yellow} />
        <path d="M 720 820 L 400 820" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-t * 60} />
      </g>
    </Lienzo>
  );
};

// G. El gel es electrocrómico: con electricidad se oscurece, como unas gafas de sol
export const Electro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const osc = interpolate(t, [T.oscurece2 - 0.4, T.oscurece2 + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.electro, T.reflejo], [1, 1.04])}>
      <rect x={300} y={520} width={60} height={700} fill="#A8C8E8" opacity={0.7} />
      <rect x={360} y={520} width={80} height={700} fill={GEL} opacity={0.35 + 0.65 * osc} />
      <rect x={440} y={520} width={60} height={700} fill="#A8C8E8" opacity={0.7} />
      <rect x={500} y={520} width={30} height={700} fill="#C8C4D8" />
      <g transform="translate(790 860)" opacity={aparece(t, T.oscurece2 + 0.4)}>
        {[-1, 1].map((l) => (
          <ellipse key={l} cx={l * 85} cy={0} rx={75} ry={55} fill="#1A1620" stroke="#C8C4D8" strokeWidth={8} />
        ))}
      </g>
      <Texto x={540} y={1360} size={40} color={C.cyan} op={aparece(t, T.electro + 0.5)}>
        gel electrocrómico
      </Texto>
    </Lienzo>
  );
};

// H. El reflejo pierde fuerza; cuando el auto pasa, la corriente se corta y el gel se aclara
export const Pasa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasa = aparece(t, T.cuando + 0.4);
  const osc = interpolate(t, [T.cuando + 0.6, T.aclara + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.reflejo, T.porEso], [1, 1.04])}>
      <Retrovisor x={540} y={760} s={1.2} osc={osc} faros={1 - pasa} />
      <Tarjeta x={190} y={1150} w={700} h={150}>
        <Texto x={540} y={1210} size={30} color={C.grey}>
          reflejo
        </Texto>
        <rect x={240} y={1240} width={600} height={30} rx={15} fill="#2A2440" />
        <rect x={240} y={1240} width={600 * (pasa > 0.5 ? 0.15 : 0.25 + 0.75 * (1 - osc))} height={30} rx={15} fill={FARO} />
      </Tarjeta>
      <Texto x={540} y={1400} size={38} color={C.white} op={aparece(t, T.aclara)}>
        sin corriente: el gel se aclara
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Retrovisor x={540} y={880} s={1.5} osc={interpolate(t, [T.porEso, T.fin], [1, 0], clamp)} />
      <Texto x={540} y={1300} size={110} color={C.yellow} op={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)}>
        ?
      </Texto>
    </Lienzo>
  );
};
