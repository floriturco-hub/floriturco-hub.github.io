import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { Persona } from "./Persona";
import { T } from "./tiempos";

// Mundo: a la izquierda la calle (tienda cerrada, farola); a la derecha la fachada de casa con la puerta,
// que se abre a un pasillo con el baño al fondo. La persona espera en la puerta; rayos X para vejiga y cerebro.
type P2 = [number, number];
const SUELO = 1500;
const PX = 380;
const PUERTA = { x0: 575, x1: 925, y0: 575, y1: SUELO };
const CERRADURA: P2 = [610, 1050];
const VEJIGA: P2 = [PX + 16, SUELO - 405];
const ESFINTER: P2 = [PX + 16, SUELO - 362];
const CEREBRO: P2 = [PX - 6, SUELO - 740];
const NERVIO: P2[] = [
  [PX + 4, SUELO - 400],
  [PX - 34, SUELO - 440],
  [PX - 38, SUELO - 560],
  [PX - 30, SUELO - 640],
  [PX - 14, SUELO - 668],
  [PX - 8, SUELO - 722],
];
const AMARILLO_ORINA = "#E8C440";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1060, 1.25],
  [T.parece - 0.3, 560, 1060, 1.27],
  [T.parece + 0.5, 560, 1100, 1.15],
  [T.musculo - 0.4, 560, 1100, 1.17],
  [T.musculo + 0.5, 400, 960, 2.0],
  [T.calle - 0.4, 400, 960, 2.03],
  [T.calle + 0.6, -380, 1080, 1.1],
  [T.aprende - 0.4, -380, 1080, 1.12],
  [T.aprende + 0.6, 640, 1040, 1.0],
  [T.suelta - 0.4, 640, 1040, 1.02],
  [T.suelta + 0.5, 400, 980, 2.0],
  [T.pavlov - 0.4, 400, 980, 2.03],
  [T.pavlov + 0.5, 600, 1080, 1.15],
  [T.truco - 0.3, 600, 1080, 1.16],
  [T.truco + 0.5, 430, 1130, 1.2],
  [T.aprieta - 0.3, 430, 1130, 1.21],
  [T.aprieta + 0.5, 400, 1000, 1.9],
  [T.escapa - 0.4, 400, 1000, 1.92],
  [T.escapa + 0.5, 640, 1060, 1.05],
  [T.final - 0.3, 640, 1060, 1.06],
  [T.final + 0.5, 560, 1060, 1.2],
  [T.fin, 560, 1060, 1.23],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

// Punto a lo largo del nervio (0 = vejiga, 1 = cerebro)
const enNervio = (u: number): P2 => {
  const tramos = NERVIO.length - 1;
  const v = Math.max(0, Math.min(0.9999, u)) * tramos;
  const i = Math.floor(v);
  const f = v - i;
  return [NERVIO[i][0] + (NERVIO[i + 1][0] - NERVIO[i][0]) * f, NERVIO[i][1] + (NERVIO[i + 1][1] - NERVIO[i][1]) * f];
};

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

const Calle: React.FC<{ readonly t: number }> = ({ t }) => (
  <g>
    {/* Edificios del fondo */}
    <rect x={-1300} y={520} width={300} height={980} fill="#17132C" />
    <rect x={-980} y={640} width={140} height={860} fill="#1B1734" />
    {/* Tienda cerrada */}
    <rect x={-880} y={760} width={480} height={740} fill="#2C2648" />
    <rect x={-880} y={760} width={480} height={18} fill="#3A3360" />
    <rect x={-850} y={800} width={420} height={90} rx={8} fill="#1A1530" />
    <text x={-640} y={862} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={48} fontWeight={700}>
      TIENDA
    </text>
    <rect x={-840} y={930} width={400} height={570} fill="#3A3458" />
    {new Array(18).fill(0).map((_, i) => (
      <line key={i} x1={-840} y1={958 + i * 30} x2={-440} y2={958 + i * 30} stroke="#2A2446" strokeWidth={6} />
    ))}
    <text x={-640} y={1240} textAnchor="middle" fill="#8C88A8" fontFamily={mono} fontSize={40} fontWeight={700}>
      CERRADO
    </text>
    {/* Cartel de baño tachado */}
    <g transform="translate(-300 980)">
      <rect x={-70} y={-70} width={140} height={140} rx={18} fill="#E8E6F0" />
      <text x={0} y={22} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={58} fontWeight={700}>
        WC
      </text>
      <line x1={-56} y1={-56} x2={56} y2={56} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
      <line x1={-280} y1={0} x2={-70} y2={0} stroke="#5A5478" strokeWidth={6} />
    </g>
    {/* Farola */}
    <path d={`M -60 1500 L -60 760 Q -60 720 -20 720 L 40 720`} fill="none" stroke="#4A4468" strokeWidth={14} />
    <path d="M 10 712 L 70 712 L 60 740 L 20 740 Z" fill="#6A6488" />
    <path d="M 20 740 L 60 740 L 200 1500 L -120 1500 Z" fill={C.yellow} opacity={0.06 + 0.01 * Math.sin(t * 3)} />
    <ellipse cx={40} cy={744} rx={22} ry={8} fill={C.yellow} opacity={0.9} />
  </g>
);

const Fachada: React.FC<{ readonly t: number; readonly abre: number; readonly brilloWc: number; readonly giroLlave: number }> = ({ t, abre, brilloWc, giroLlave }) => {
  const L = PUERTA.x0 + (PUERTA.x1 - PUERTA.x0) * 0.82 * abre;
  const panel = `${L},${PUERTA.y0 + 34 * abre} ${PUERTA.x1},${PUERTA.y0} ${PUERTA.x1},${PUERTA.y1} ${L},${PUERTA.y1 - 34 * abre}`;
  const cerr: P2 = [L + 35 * (1 - abre), CERRADURA[1]];
  return (
    <g>
      {/* Muro y tejado */}
      <rect x={250} y={380} width={1500} height={1120} fill="#241E3E" />
      {new Array(18).fill(0).map((_, i) => (
        <line key={i} x1={250} y1={440 + i * 60} x2={1750} y2={440 + i * 60} stroke="#1E1934" strokeWidth={4} />
      ))}
      <path d="M 210 400 L 1790 400 L 1700 300 L 300 300 Z" fill="#1A1530" />
      <rect x={210} y={392} width={1580} height={16} fill="#2E2850" />
      {/* Ventana con luz cálida */}
      <rect x={1040} y={760} width={290} height={310} rx={8} fill="#5A4E78" />
      <rect x={1056} y={776} width={258} height={278} fill={C.yellow} opacity={0.32} />
      <line x1={1185} y1={776} x2={1185} y2={1054} stroke="#5A4E78" strokeWidth={10} />
      <line x1={1056} y1={915} x2={1314} y2={915} stroke="#5A4E78" strokeWidth={10} />
      {/* Lámpara del porche */}
      <circle cx={1000} cy={640} r={90} fill={C.yellow} opacity={0.08} />
      <rect x={986} y={610} width={28} height={44} rx={8} fill={C.yellow} opacity={0.9} />

      {/* Marco de la puerta */}
      <rect x={PUERTA.x0 - 18} y={PUERTA.y0 - 18} width={PUERTA.x1 - PUERTA.x0 + 36} height={PUERTA.y1 - PUERTA.y0 + 18} fill="#5A4E78" />
      {/* Interior: pasillo con el baño al fondo */}
      <polygon points={`${PUERTA.x0},${PUERTA.y0} ${PUERTA.x1},${PUERTA.y0} 810,820 690,820`} fill="#2A2236" />
      <polygon points={`${PUERTA.x0},${PUERTA.y0} 690,820 690,1240 ${PUERTA.x0},${PUERTA.y1}`} fill="#4A3C58" />
      <polygon points={`${PUERTA.x1},${PUERTA.y0} 810,820 810,1240 ${PUERTA.x1},${PUERTA.y1}`} fill="#403450" />
      <polygon points={`${PUERTA.x0},${PUERTA.y1} ${PUERTA.x1},${PUERTA.y1} 810,1240 690,1240`} fill="#6A5240" />
      {[0.25, 0.5, 0.75].map((u) => (
        <line key={u} x1={PUERTA.x0 + (690 - PUERTA.x0) * u} y1={PUERTA.y1 + (1240 - PUERTA.y1) * u} x2={PUERTA.x1 + (810 - PUERTA.x1) * u} y2={PUERTA.y1 + (1240 - PUERTA.y1) * u} stroke="#5A4434" strokeWidth={4} />
      ))}
      <rect x={690} y={820} width={120} height={420} fill="#5A4A66" />
      <rect x={712} y={900} width={76} height={340} fill="#E8E0D0" />
      <circle cx={778} cy={1080} r={5} fill="#8C7A60" />
      <rect x={724} y={930} width={52} height={36} rx={6} fill="#2A6AA8" />
      <text x={750} y={958} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={24} fontWeight={700}>
        WC
      </text>
      <rect x={712} y={900} width={76} height={340} fill={C.cyan} opacity={0.25 * brilloWc} />
      <ellipse cx={750} cy={690} rx={40} ry={10} fill={C.yellow} opacity={0.8} />
      {/* Hoja de la puerta (se abre hacia dentro) */}
      <polygon points={panel} fill="#6A4A3A" />
      <polygon
        points={`${L + (PUERTA.x1 - L) * 0.12},${PUERTA.y0 + 80} ${PUERTA.x1 - (PUERTA.x1 - L) * 0.12},${PUERTA.y0 + 70} ${PUERTA.x1 - (PUERTA.x1 - L) * 0.12},${PUERTA.y0 + 400} ${L + (PUERTA.x1 - L) * 0.12},${PUERTA.y0 + 410}`}
        fill="none"
        stroke="#4E3428"
        strokeWidth={8}
      />
      <polygon
        points={`${L + (PUERTA.x1 - L) * 0.12},${PUERTA.y0 + 500} ${PUERTA.x1 - (PUERTA.x1 - L) * 0.12},${PUERTA.y0 + 500} ${PUERTA.x1 - (PUERTA.x1 - L) * 0.12},${PUERTA.y1 - 80} ${L + (PUERTA.x1 - L) * 0.12},${PUERTA.y1 - 90}`}
        fill="none"
        stroke="#4E3428"
        strokeWidth={8}
      />
      <line x1={L + 6} y1={PUERTA.y0 + 40 * abre} x2={L + 6} y2={PUERTA.y1 - 40 * abre} stroke="#8A6650" strokeWidth={6} opacity={0.8} />
      {/* Cerradura con las llaves puestas */}
      <rect x={cerr[0] - 14} y={cerr[1] - 30} width={28} height={78} rx={8} fill="#B89A50" />
      <circle cx={cerr[0]} cy={cerr[1]} r={6} fill="#3A2A1A" />
      <g transform={`translate(${cerr[0]} ${cerr[1]}) scale(${Math.cos(giroLlave * Math.PI)} 1)`}>
        <path d="M 0 0 L -40 0 M -26 0 L -26 9 M -34 0 L -34 7" stroke="#D8B848" strokeWidth={5} strokeLinecap="round" />
        <circle cx={-52} cy={0} r={12} fill="none" stroke="#D8B848" strokeWidth={5} />
        <g transform={`rotate(${Math.sin(t * 6) * 10} -62 6)`}>
          <circle cx={-64} cy={22} r={10} fill="none" stroke="#9AA4B8" strokeWidth={4} />
          <rect x={-72} y={30} width={14} height={30} rx={4} fill="#9AA4B8" />
        </g>
      </g>
      {/* Felpudo */}
      <rect x={PUERTA.x0 + 10} y={SUELO - 10} width={PUERTA.x1 - PUERTA.x0 - 20} height={20} rx={6} fill="#6A5A3A" />
    </g>
  );
};

export const Casa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Estado de la persona
  const baile = interpolate(t, [0, T.parece, T.parece + 1, T.suelta - 0.3, T.suelta + 0.5, T.truco, T.truco + 0.6], [1, 1, 0.12, 0.12, 1, 1, 0], clamp);
  const miedo = interpolate(t, [0, T.parece, T.parece + 1, T.suelta - 0.3, T.suelta + 0.5, T.truco, T.truco + 0.6], [0.6, 0.6, 0, 0, 0.6, 0.6, 0], clamp);
  const bajaMano = interpolate(t, [T.pasillo - 1.0, T.pasillo - 0.4], [0, 1], suave);
  const reposo: P2 = [12, -330];
  const llaveLocal: P2 = [CERRADURA[0] - PX - 62, CERRADURA[1] - SUELO + 8];
  const mano: P2 = [llaveLocal[0] + (reposo[0] - llaveLocal[0]) * bajaMano, llaveLocal[1] + (reposo[1] - llaveLocal[1]) * bajaMano];
  const respira = interpolate(t, [T.respira - 0.2, T.respira + 0.3, T.escapa], [0, 1, 0], clamp);
  const abre = interpolate(t, [T.pasillo - 0.6, T.pasillo + 0.4], [0, 1], suave);
  const giroLlave = interpolate(t, [T.llave, T.llave + 0.5], [0, 1], suave);
  const brilloWc = Math.max(
    interpolate(t, [T.pasillo, T.pasillo + 0.4, T.suelta - 0.3, T.suelta], [0, 1, 1, 0], clamp),
    interpolate(t, [T.aqui, T.aqui + 0.3, T.aqui + 0.6], [0, 1, 0.6], clamp),
  );

  // Recuerdo en la calle: la misma persona caminando hace un rato
  const recuerdo = ventana(T.calle - 0.2, T.aprende - 0.1, 0.5, 0.5);
  const xRecuerdo = interpolate(t, [T.calle - 0.2, T.aprende], [-760, -300], clamp);

  // Rayos X de vejiga y cerebro
  const rayos = Math.max(ventana(T.musculo - 0.2, T.calle), ventana(T.suelta - 0.1, T.pavlov), ventana(T.aprieta - 0.3, T.escapa));
  const llenado = interpolate(t, [T.musculo, T.ml + 0.3], [0.35, 0.78], suave);
  const contrae = interpolate(t, [T.contrae - 0.2, T.contrae + 0.4, T.pavlov, T.pavlov + 0.4], [0, 1, 1, 0], clamp);
  const apriete = interpolate(t, [T.aprieta, T.aprieta + 0.3], [0, 1], clamp) * (t < T.bajaU + 0.6 ? Math.max(0, Math.sin((t - T.aprieta) * 5)) : 0);
  const freno = t < T.suelta + 0.6 ? 1 : t < T.truco ? interpolate(t, [T.suelta + 0.6, T.suelta + 1.2], [1, 0.25], clamp) : Math.max(0.25, interpolate(t, [T.aprieta, T.aprieta + 0.6], [0.25, 1], clamp));
  const radio = (26 + 18 * llenado) * (1 - 0.1 * contrae * (0.5 + 0.5 * Math.sin(t * 14)));
  const nivel = VEJIGA[1] + radio - 2 * radio * Math.min(0.95, llenado);
  const marca200 = VEJIGA[1] + (26 + 18 * 0.78) * (1 - 2 * 0.6);
  const brillo = Math.max(
    interpolate(t, [T.avisa + 0.6, T.avisa + 1.0, T.todavia, T.todavia + 0.5], [0, 1, 1, 0], clamp),
    interpolate(t, [T.suelta - 0.2, T.suelta + 0.2, T.suelta + 1.2], [0, 1, 0], clamp),
  );

  // Señales por el nervio: aviso (sube), "todavía no" (baja, rojo), "aquí sí" (baja, verde)
  const senal = (desde: number, dur: number, sube: boolean, color: string) => {
    if (t < desde || t > desde + dur + 0.3) {
      return null;
    }
    return [0, 0.18, 0.36].map((k) => {
      const u = (t - desde) / dur - k;
      if (u < 0 || u > 1) {
        return null;
      }
      const p = enNervio(sube ? u : 1 - u);
      return <circle key={k} cx={p[0]} cy={p[1]} r={7} fill={color} />;
    });
  };

  // Etiquetas ancladas
  const tagCerebro = ventana(T.cerebro - 0.2, T.musculo);
  const tagVejiga = ventana(T.musculo + 0.4, T.ml);
  const tag200 = ventana(T.ml, T.calle - 0.2);
  const tagFreno = ventana(T.todavia, T.calle - 0.2);
  const tagRecuerdo = ventana(T.calle + 0.3, T.aprende - 0.3);
  const tagSinBano = ventana(T.calle + 0.8, T.aprende - 0.3);
  const tagPuerta = ventana(T.puertaA - 0.1, T.suelta - 0.3);
  const tagLlaves = ventana(T.llaves - 0.1, T.suelta - 0.3);
  const tagPasillo = ventana(T.pasillo, T.suelta - 0.3);
  const tagSuelta = ventana(T.suelta + 0.3, T.contrae);
  const tagContrae = ventana(T.contrae, T.pavlov);
  const tagSuelo = ventana(T.aprieta + 0.3, T.escapa);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <Calle t={t} />
        <Fachada t={t} abre={abre} brilloWc={brilloWc} giroLlave={giroLlave} />
        {/* Suelo y acera */}
        <rect x={-1400} y={SUELO} width={3300} height={700} fill="#16122A" />
        <rect x={-1400} y={SUELO} width={3300} height={14} fill="#2E2850" />

        {recuerdo > 0 ? <Persona x={xRecuerdo} suelo={SUELO} t={t} paso={(t - T.calle) * 6} opacidad={0.75 * recuerdo} /> : null}
        <Persona x={PX} suelo={SUELO} t={t} baile={baile} miedo={miedo} mano={bajaMano < 1 ? mano : null} respira={respira} />

        {/* Respiración: bocanadas que salen de la nariz */}
        {respira > 0
          ? [0, 1].map((k) => {
              const p = (t * 0.8 + k * 0.5) % 1;
              return (
                <path
                  key={k}
                  d={`M ${PX + 56 + p * 60} ${SUELO - 698 - 14} q 10 14 0 28`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={(1 - p) * respira}
                />
              );
            })
          : null}

        {/* Rayos X */}
        {rayos > 0 ? (
          <g opacity={rayos}>
            <circle cx={VEJIGA[0] - 6} cy={VEJIGA[1] - 8} r={96} fill="#0A0818" opacity={0.86} />
            <circle cx={VEJIGA[0] - 6} cy={VEJIGA[1] - 8} r={96} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.6} />
            {/* Suelo pélvico: hamaca bajo la vejiga */}
            <path
              d={`M ${VEJIGA[0] - 70} ${ESFINTER[1] + 4 - 10 * apriete} Q ${VEJIGA[0]} ${ESFINTER[1] + 30 - 26 * apriete} ${VEJIGA[0] + 66} ${ESFINTER[1] + 4 - 10 * apriete}`}
              fill="none"
              stroke={C.orange}
              strokeWidth={10 + 4 * apriete}
              strokeLinecap="round"
              opacity={0.85}
            />
            {/* Vejiga: pared muscular que se estira, orina dentro */}
            <defs>
              <clipPath id="vejiga-or">
                <ellipse cx={VEJIGA[0]} cy={VEJIGA[1]} rx={radio * 1.05} ry={radio} />
              </clipPath>
            </defs>
            <rect x={VEJIGA[0] - 60} y={nivel} width={120} height={120} fill={AMARILLO_ORINA} clipPath="url(#vejiga-or)" opacity={0.85} />
            <ellipse cx={VEJIGA[0]} cy={VEJIGA[1]} rx={radio * 1.05} ry={radio} fill="none" stroke="#E87A8A" strokeWidth={7} />
            {[-0.6, -0.2, 0.2, 0.6].map((u) => (
              <path
                key={u}
                d={`M ${VEJIGA[0] + u * radio} ${VEJIGA[1] - radio * Math.sqrt(1 - u * u) + 2} Q ${VEJIGA[0] + u * radio * 1.3} ${VEJIGA[1]} ${VEJIGA[0] + u * radio} ${VEJIGA[1] + radio * Math.sqrt(1 - u * u) - 2}`}
                fill="none"
                stroke="#C85A6A"
                strokeWidth={2}
                opacity={0.6}
              />
            ))}
            {/* Marca de 200 ml */}
            <g opacity={tag200}>
              <line x1={VEJIGA[0] - 54} y1={marca200} x2={VEJIGA[0] + 54} y2={marca200} stroke={C.white} strokeWidth={3} strokeDasharray="8 6" />
            </g>
            {/* Freno (esfínter): dos mordazas, rojo cerrado, verde suelto */}
            <path d={`M ${ESFINTER[0] - 3} ${VEJIGA[1] + radio - 2} L ${ESFINTER[0] - 3} ${ESFINTER[1] + 26} M ${ESFINTER[0] + 3} ${VEJIGA[1] + radio - 2} L ${ESFINTER[0] + 3} ${ESFINTER[1] + 26}`} stroke="#E87A8A" strokeWidth={5} />
            <rect x={ESFINTER[0] - 22 - 10 * (1 - freno)} y={ESFINTER[1] + 4} width={18} height={14} rx={4} fill={freno > 0.6 ? C.red : "#48C878"} />
            <rect x={ESFINTER[0] + 4 + 10 * (1 - freno)} y={ESFINTER[1] + 4} width={18} height={14} rx={4} fill={freno > 0.6 ? C.red : "#48C878"} />
            {/* Nervio hasta el cerebro */}
            <path d={`M ${NERVIO.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="6 6" opacity={0.7} />
            <ellipse cx={CEREBRO[0]} cy={CEREBRO[1]} rx={34} ry={24} fill="#E89AB0" opacity={0.92} />
            <path d={`M ${CEREBRO[0] - 24} ${CEREBRO[1] - 4} q 8 -10 16 0 q 8 10 16 0 q 8 -10 14 2 M ${CEREBRO[0] - 18} ${CEREBRO[1] + 10} q 10 -6 20 2 q 8 6 16 -2`} fill="none" stroke="#B85A78" strokeWidth={2.5} />
            <ellipse cx={CEREBRO[0]} cy={CEREBRO[1]} rx={46} ry={36} fill="none" stroke={C.yellow} strokeWidth={4} opacity={brillo} />
            {senal(T.avisa, 0.9, true, C.cyan)}
            {senal(T.todavia - 0.3, 0.8, false, C.red)}
            {senal(T.suelta - 0.1, 0.8, false, "#48C878")}
          </g>
        ) : null}
      </g>

      <Tag x={sx(CEREBRO[0])} y={sy(CEREBRO[1])} dx={-150} dy={-130} texto="cerebro" color={C.yellow} o={tagCerebro} />
      <Tag x={sx(VEJIGA[0] + 40)} y={sy(VEJIGA[1] - 20)} dx={230} dy={-60} texto="vejiga" color="#E87A8A" o={tagVejiga} />
      <Tag x={sx(VEJIGA[0] + 54)} y={sy(marca200)} dx={230} dy={-60} texto="200 ml" color={C.white} o={tag200} />
      <Tag x={sx(ESFINTER[0] + 20)} y={sy(ESFINTER[1] + 10)} dx={230} dy={110} texto="freno" color={C.red} o={tagFreno} />
      <Tag x={sx(xRecuerdo + 20)} y={sy(SUELO - 780)} dx={-200} dy={140} texto="hace un rato" color={C.grey} o={tagRecuerdo} />
      <Tag x={sx(-300)} y={sy(910)} dx={120} dy={-130} texto="sin baño" color={C.red} o={tagSinBano} />
      <Tag x={sx(880)} y={sy(820)} dx={110} dy={40} texto="puerta" color={C.yellow} o={tagPuerta} />
      <Tag x={sx(CERRADURA[0] + 300 * abre)} y={sy(CERRADURA[1])} dx={0} dy={160} texto="llaves" color={C.yellow} o={tagLlaves} />
      <Tag x={sx(750)} y={sy(1180)} dx={150} dy={180} texto="pasillo" color={C.yellow} o={tagPasillo} />
      <Tag x={sx(ESFINTER[0] + 20)} y={sy(ESFINTER[1] + 10)} dx={230} dy={110} texto="se suelta" color="#48C878" o={tagSuelta} />
      <Tag x={sx(VEJIGA[0] + 40)} y={sy(VEJIGA[1] - 20)} dx={230} dy={-60} texto="se contrae" color="#E87A8A" o={tagContrae} />
      <Tag x={sx(VEJIGA[0] + 60)} y={sy(ESFINTER[1] + 10)} dx={200} dy={120} texto="suelo pélvico" color={C.orange} o={tagSuelo} />
    </svg>
  );
};
