import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/mareo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  asiento: 2.40, // asiento
  celular: 3.56, // celular
  mareas: 4.26, // mareas
  conductor: 5.20, // conductor
  perfecto: 6.02, // perfecto
  final: 7.28, // final
  oido: 9.74, // oido
  curvas: 10.94, // curvas
  baches: 12.56, // baches
  ojos: 13.64, // ojos
  quieto: 16.82, // quieto
  cerebro: 17.84, // cerebro
  coinciden: 19.76, // coinciden
  teoria: 20.98, // teoria
  envenenamiento: 22.56, // envenenamiento
  nauseas: 24.16, // nauseas
  conductor2: 25.28, // conductor
  carretera: 26.18, // carretera
  mismo: 27.80, // mismo
  decide: 30.78, // decide
  anticipa: 33.06, // anticipa
  truco: 34.18, // truco
  adelante: 35.38, // adelante
  horizonte: 36.48, // horizonte
  porEso: 37.28, // por
  fin: 39.00, // FIN
};

const VERDE = "#9AC84A";
const PIEL = "#E0A888";

// Cabeza simple; mareo 0..1 la pone verde
const Cabeza: React.FC<{ readonly x: number; readonly y: number; readonly mareo: number; readonly r?: number }> = ({ x, y, mareo, r = 60 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={mareo > 0.5 ? "#B8D07A" : PIEL} />
    {mareo > 0.5 ? (
      <path d={`M ${x - r * 0.5} ${y - r * 0.1} l ${r * 0.3} ${r * 0.15} M ${x + r * 0.2} ${y - r * 0.1} l ${r * 0.3} ${r * 0.15} M ${x - r * 0.4} ${y + r * 0.45} q ${r * 0.2} ${-r * 0.2} ${r * 0.4} 0 q ${r * 0.2} ${r * 0.2} ${r * 0.4} 0`} stroke="#3A4A1A" strokeWidth={5} fill="none" />
    ) : (
      <path d={`M ${x - r * 0.4} ${y - r * 0.1} l 0 4 M ${x + r * 0.4} ${y - r * 0.1} l 0 4 M ${x - r * 0.35} ${y + r * 0.35} q ${r * 0.35} ${r * 0.3} ${r * 0.7} 0`} stroke="#3A2A22" strokeWidth={6} fill="none" strokeLinecap="round" />
    )}
  </g>
);

// Auto de perfil con conductor (adelante, a la derecha) y pasajero atrás
const Auto: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly mareo: number; readonly bache?: number }> = ({ x, y, t, mareo, bache = 0 }) => {
  const dy = bache * 8 * Math.sin(t * 9);
  return (
    <g transform={`translate(${x} ${y + dy})`}>
      <path d="M -420 0 L -420 -120 L -260 -130 L -160 -280 L 200 -280 L 320 -130 L 440 -110 L 440 0 Z" fill={C.cyan} />
      <path d="M -140 -260 L 180 -260 L 280 -140 L -230 -140 Z" fill="#1A2A3A" opacity={0.8} />
      <line x1={30} y1={-260} x2={30} y2={-140} stroke={C.cyan} strokeWidth={14} />
      <Cabeza x={150} y={-190} mareo={0} r={42} />
      <Cabeza x={-90} y={-190} mareo={mareo} r={42} />
      <rect x={-60} y={-176} width={24} height={40} rx={4} fill="#111" opacity={mareo > 0 ? 1 : 0.6} />
      <circle cx={-260} cy={10} r={70} fill="#111" />
      <circle cx={260} cy={10} r={70} fill="#111" />
      <circle cx={-260} cy={10} r={30} fill="#8A8A96" />
      <circle cx={260} cy={10} r={30} fill="#8A8A96" />
    </g>
  );
};

const Carretera: React.FC<{ readonly y: number; readonly t: number }> = ({ y, t }) => (
  <g>
    <rect x={0} y={y} width={1080} height={160} fill="#3A3A44" />
    <line x1={0} y1={y + 80} x2={1080} y2={y + 80} stroke="#fff" strokeWidth={6} strokeDasharray="50 40" strokeDashoffset={t * 400} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Carretera y={1080} t={t} />
    <Auto x={540} y={1070} t={t} mareo={1} bache={1} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué el conductor no se marea?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.asiento], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Atrás leyendo el celular te mareas; el conductor está perfecto + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.asiento, T.oido], [1, 1.04])}>
      <Carretera y={1080} t={t} />
      <Auto x={540} y={1070} t={t} mareo={aparece(t, T.mareas)} bache={1} />
      <Texto x={350} y={720} size={36} color={VERDE} op={aparece(t, T.mareas)}>
        atrás: mareado
      </Texto>
      <Texto x={760} y={720} size={36} color="#5AD08A" op={aparece(t, T.perfecto)}>
        conductor: perfecto
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el truco para no marearte: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.oido], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// D. El oído interno siente curvas, frenazos y baches; los ojos fijos en el celular dicen "quieto"
export const Senales: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.oido, T.cerebro], [1, 1.04])}>
      <g opacity={aparece(t, T.oido)} transform={`translate(300 900) rotate(${aparece(t, T.curvas) * 15 * Math.sin(t * 3)})`}>
        <circle cx={0} cy={-60} r={60} fill="none" stroke="#E8A0B0" strokeWidth={22} />
        <circle cx={60} cy={20} r={55} fill="none" stroke="#E8A0B0" strokeWidth={22} />
        <circle cx={-50} cy={30} r={50} fill="none" stroke="#E8A0B0" strokeWidth={22} />
        <path d="M 40 70 q 60 40 40 120 q -30 60 -80 20" stroke="#E8A0B0" strokeWidth={26} fill="none" />
      </g>
      <Texto x={300} y={1180} size={36} color="#E8A0B0" op={aparece(t, T.oido)}>
        oído interno
      </Texto>
      <Texto x={300} y={1240} size={34} color={C.orange} op={aparece(t, T.curvas)}>
        ¡curvas, baches!
      </Texto>
      <g opacity={aparece(t, T.ojos)}>
        <ellipse cx={780} cy={860} rx={110} ry={70} fill="#fff" />
        <circle cx={780} cy={890} r={36} fill="#3A2A22" />
        <rect x={720} y={960} width={120} height={200} rx={16} fill="#1A1A22" />
        <Texto x={780} y={1240} size={34} color={C.cyan} op={aparece(t, T.quieto)}>
          ojos: «estás quieto»
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Dos señales que no coinciden; una teoría: lo toma como envenenamiento y responde con náuseas
export const Conflicto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cerebro, T.conductor2], [1, 1.04])}>
        <g transform="translate(540 860) scale(1.1)">
          <path d="M -200 40 C -240 -80 -120 -200 0 -180 C 120 -220 250 -100 210 20 C 240 120 120 170 40 140 C -20 190 -160 170 -200 40 Z" fill="#E8A0B0" />
        </g>
        <path d="M 160 1100 L 400 960" stroke={C.orange} strokeWidth={10} opacity={aparece(t, T.cerebro)} />
        <path d="M 920 1100 L 680 960" stroke={C.cyan} strokeWidth={10} opacity={aparece(t, T.cerebro)} />
        <Texto x={160} y={1160} size={32} color={C.orange} op={aparece(t, T.cerebro)}>
          «me muevo»
        </Texto>
        <Texto x={920} y={1160} size={32} color={C.cyan} op={aparece(t, T.cerebro)}>
          «estoy quieto»
        </Texto>
        <Texto x={540} y={880} size={90} color={C.red} op={aparece(t, T.coinciden)}>
          ✗
        </Texto>
        <Texto x={540} y={1300} size={38} color={C.white} op={aparece(t, T.envenenamiento)}>
          ¿envenenamiento?
        </Texto>
        <Texto x={540} y={1390} size={46} color={VERDE} op={aparece(t, T.nauseas)}>
          → náuseas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.coinciden} color={C.red} />
    </>
  );
};

// F. El conductor mira la carretera: ve el mismo movimiento que siente; decide cada curva y la anticipa
export const Conductor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const curva = 120 * Math.sin(t * 0.8);
  return (
    <Lienzo zoom={interpolate(t, [T.conductor2, T.truco], [1, 1.04])}>
      <path d={`M 540 1500 Q ${540 + curva} 1000 ${540 + curva * 1.6} 640`} stroke="#3A3A44" strokeWidth={260} fill="none" />
      <path d={`M 540 1500 Q ${540 + curva} 1000 ${540 + curva * 1.6} 640`} stroke="#fff" strokeWidth={8} fill="none" strokeDasharray="40 30" strokeDashoffset={t * 300} />
      <g transform="translate(540 1560)">
        <circle cx={0} cy={0} r={140} fill="none" stroke="#5A5A66" strokeWidth={30} transform={`rotate(${curva * 0.4})`} />
        <line x1={-140} y1={0} x2={140} y2={0} stroke="#5A5A66" strokeWidth={22} transform={`rotate(${curva * 0.4})`} />
      </g>
      <Texto x={540} y={560} size={38} color={C.white} op={aparece(t, T.carretera)}>
        mira la carretera
      </Texto>
      <Texto x={540} y={620} size={34} color="#5AD08A" op={aparece(t, T.mismo)}>
        ojos y oído coinciden ✓
      </Texto>
      <Texto x={540} y={1330} size={36} color={C.yellow} op={aparece(t, T.decide)}>
        él decide cada curva
      </Texto>
    </Lienzo>
  );
};

// G. El truco: siéntate adelante y mira el horizonte
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.truco, T.porEso], [1, 1.04])}>
        <rect x={0} y={1000} width={1080} height={500} fill="#2A4A2A" />
        <circle cx={760} cy={900} r={80} fill={C.orange} opacity={aparece(t, T.horizonte)} />
        <line x1={0} y1={1000} x2={1080} y2={1000} stroke={C.yellow} strokeWidth={8} opacity={aparece(t, T.horizonte)} />
        <Texto x={540} y={600} size={52} color={C.yellow} op={aparece(t, T.truco)}>
          el truco
        </Texto>
        <Texto x={540} y={1180} size={40} color={C.white} op={aparece(t, T.adelante)}>
          1. siéntate adelante
        </Texto>
        <Texto x={540} y={1260} size={40} color={C.white} op={aparece(t, T.horizonte)}>
          2. mira el horizonte
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.truco} color={C.yellow} />
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
