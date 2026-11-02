import { Easing, interpolate } from "remotion";
import { Persona } from "../orinar/Persona";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: una calle con paso de peatones, semáforo y botón; un armario controlador; la central de tráfico;
// más a la derecha, el vestíbulo de un edificio con un ascensor y un termostato de oficina.
type P2 = [number, number];
const SUELO = 1500;
const PX = 330;
const POSTE = 600;
const BOTON: P2 = [556, 1090];
const ARMARIO = { x0: 740, x1: 850, y0: 1300 };
const CENTRAL = { x0: 1260, x1: 1560, y0: 760 };
const ASC = { x0: 1880, x1: 2300, y0: 560, panel: [2258, 1050] as P2 };
const PX2 = 2050;
const TERMO: P2 = [2720, 1100];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 480, 1080, 1.6],
  [T.conectado - 0.3, 480, 1080, 1.62],
  [T.conectado + 0.5, 600, 1200, 1.3],
  [T.pero - 0.3, 600, 1200, 1.32],
  [T.pero + 0.6, 640, 1150, 1.0],
  [T.resto - 0.3, 640, 1150, 1.02],
  [T.resto + 0.6, 950, 1150, 0.75],
  [T.otros - 0.2, 950, 1150, 0.76],
  [T.otros + 0.6, 560, 1150, 1.2],
  [T.punta - 0.3, 560, 1150, 1.22],
  [T.punta + 0.5, 700, 1150, 0.95],
  [T.ascensores - 0.4, 700, 1150, 0.96],
  [T.ascensores + 0.6, 2090, 1080, 1.25],
  [T.oficinas - 0.3, 2090, 1080, 1.27],
  [T.oficinas + 0.6, TERMO[0], TERMO[1], 2.0],
  [T.porQue - 0.3, TERMO[0], TERMO[1], 2.03],
  [T.porQue + 0.7, 480, 1120, 1.4],
  [T.truco - 0.3, 480, 1120, 1.42],
  [T.truco + 0.5, 480, 1100, 1.55],
  [T.final - 0.3, 480, 1100, 1.57],
  [T.final + 0.6, 600, 1150, 1.1],
  [T.fin, 600, 1150, 1.12],
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

// Pulsaciones: [inicio, nº de pulsaciones, intervalo]
const PULSA: [number, number, number][] = [
  [0.0, 5, 0.6],
  [T.apretas - 0.1, 1, 0.6],
  [T.verde - 0.6, 1, 0.6],
  [T.unaVez - 0.1, 1, 0.6],
  [T.cinco2 - 0.1, 5, 0.24],
];
// Brazo hacia el botón (0 colgando, 1 en el botón) y empuje de cada pulsación (0..1)
const pulsacion = (t: number) => {
  let brazo = 0;
  let empuje = 0;
  for (const [a, n, dt] of PULSA) {
    const fin = a + n * dt;
    brazo = Math.max(brazo, interpolate(t, [a - 0.35, a, fin + 0.2, fin + 0.6], [0, 1, 1, 0], suave));
    if (t >= a && t < fin) {
      const f = ((t - a) % dt) / dt;
      empuje = Math.max(empuje, f < 0.4 ? Math.sin((f / 0.4) * Math.PI) : 0);
    }
  }
  return { brazo, empuje };
};

const COCHES = [
  { color: "#C8503A", v: 260, o: 0 },
  { color: "#3A78C8", v: 300, o: 700 },
  { color: "#E8C040", v: 240, o: 1350 },
  { color: "#8A8A9A", v: 280, o: 300 },
  { color: "#48A878", v: 250, o: 1000 },
  { color: "#E8E6F0", v: 270, o: 1700 },
];

const Coche: React.FC<{ readonly x: number; readonly color: string }> = ({ x, color }) => (
  <g transform={`translate(${x} 1400)`}>
    <path d="M -110 0 L -110 -40 L -70 -44 L -44 -84 L 50 -84 L 80 -44 L 110 -38 L 110 0 Z" fill={color} />
    <path d="M -36 -76 L 44 -76 L 66 -46 L -60 -46 Z" fill="#9AC4E8" opacity={0.7} />
    <line x1={4} y1={-76} x2={4} y2={-46} stroke={color} strokeWidth={6} />
    <circle cx={-66} cy={0} r={22} fill="#141018" />
    <circle cx={66} cy={0} r={22} fill="#141018" />
    <circle cx={-66} cy={0} r={8} fill="#8A8A9A" />
    <circle cx={66} cy={0} r={8} fill="#8A8A9A" />
    <rect x={100} y={-34} width={10} height={10} fill="#FFF1C9" />
  </g>
);

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

// Bocadillo de pensamiento en espacio de pantalla
const Piensa: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly o: number }> = ({ x, y, texto, o }) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 48;
  return (
    <g opacity={o}>
      <circle cx={x + 10} cy={y - 30} r={8} fill={C.white} />
      <circle cx={x + 24} cy={y - 64} r={12} fill={C.white} />
      <rect x={x + 30} y={y - 150} width={ancho} height={68} rx={34} fill={C.white} />
      <text x={x + 30 + ancho / 2} y={y - 104} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

export const Calle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Pulsaciones del peatón
  const { brazo, empuje } = pulsacion(t);
  const enBoton: P2 = [BOTON[0] - 48 + 14 * empuje, BOTON[1] + 8];
  const reposo: P2 = [PX + 12, SUELO - 330];
  const mano: P2 = [reposo[0] + (enBoton[0] - reposo[0]) * brazo - PX, reposo[1] + (enBoton[1] - reposo[1]) * brazo - SUELO];
  const prisa = interpolate(t, [0, T.parece, T.parece + 0.6], [0.5, 0.5, 0], clamp) + interpolate(t, [T.cinco2 - 0.2, T.cinco2, T.noAcelera + 0.4, T.final], [0, 0.5, 0.5, 0], clamp);
  const espere = Math.max(...PULSA.map(([a]) => (t >= a ? interpolate(t, [a, a + 0.1, a + 2.6, a + 3.0], [0, 1, 1, 0], clamp) : 0)));

  // Noche: pocos coches y el botón sí pide el verde. Hora punta: muchos coches y ciclo fijo.
  const noche = interpolate(t, [T.noche - 0.3, T.noche + 0.6, T.punta - 0.2, T.punta + 0.4], [0, 1, 1, 0], suave);
  const punta = interpolate(t, [T.punta, T.punta + 0.5, T.noSolo, T.noSolo + 0.6], [0, 1, 1, 0], clamp);
  const cochesVisibles = 3 - 2 * noche + 3 * punta;
  const verde = interpolate(t, [T.verde, T.verde + 0.15, T.punta - 0.1, T.punta + 0.1], [0, 1, 1, 0], clamp);

  // Cable desconectado y central
  const rayos = Math.max(ventana(T.conectado - 0.2, T.pero + 0.2), ventana(T.resto - 0.2, T.otros + 0.2));
  const corte = interpolate(t, [T.conectado, T.conectado + 0.4], [0, 1], clamp);
  const ondas = ventana(T.central - 0.6, T.otros + 0.5);

  // Ascensor: puertas abiertas, botón de cerrar pulsado, barra de tiempo mínimo
  const pulsa2 = interpolate(t, [T.cerrar - 0.5, T.cerrar - 0.1, T.entrar - 0.2, T.entrar + 0.2], [0, 1, 1, 0], suave);
  const empuje2 = t > T.cerrar - 0.1 && t < T.noAcorta + 1.2 ? Math.max(0, Math.sin((t - T.cerrar) * 9)) : 0;
  const tiempoMin = interpolate(t, [T.cerrar - 0.6, T.entrar + 0.2], [0, 1], clamp);
  const cierra = interpolate(t, [T.entrar + 0.2, T.entrar + 1.0], [0, 1], suave);
  const reposo2: P2 = [12, -330];
  const boton2: P2 = [ASC.panel[0] - 48 - PX2 + 10 * empuje2, ASC.panel[1] + 52 - SUELO];
  const mano2: P2 = [reposo2[0] + (boton2[0] - reposo2[0]) * pulsa2, reposo2[1] + (boton2[1] - reposo2[1]) * pulsa2];

  // Termostato de adorno
  const rayosTermo = ventana(T.nada - 0.4, T.porQue + 0.3);

  // Placebo: sensación de control
  const piensa = ventana(T.cabeza - 0.2, T.control + 0.6);

  // Etiquetas
  const tagBoton = ventana(0.4, T.conectado);
  const tagCable = ventana(T.conectado + 0.2, T.pero);
  const tagCentral = ventana(T.central - 0.4, T.otros + 0.4);
  const tagCerrar = ventana(T.cerrar, T.minimo);
  const tagMinimo = ventana(T.minimo, T.oficinas);
  const tagTermo = ventana(T.termostatos, T.porQue);
  const tagCinco = ventana(T.cinco2, T.final);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const cielo = `rgb(${Math.round(42 - 26 * noche)}, ${Math.round(58 - 40 * noche)}, ${Math.round(110 - 64 * noche)})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Cielo (más oscuro de noche), sol o luna */}
        <rect x={-800} y={-200} width={4400} height={1500} fill={cielo} />
        <circle cx={250} cy={360} r={60} fill={C.yellow} opacity={0.85 * (1 - noche)} />
        <g opacity={noche}>
          <circle cx={250} cy={360} r={56} fill="#E8E6F0" />
          <circle cx={276} cy={344} r={50} fill={cielo} />
        </g>
        {/* Edificios del fondo */}
        {[
          [-500, 620, 260],
          [-220, 760, 220],
          [40, 700, 180],
          [950, 680, 240],
          [1620, 600, 180],
        ].map(([x, y, w], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={1300 - y} fill="#1E1838" />
            {new Array(Math.floor((1300 - y) / 80)).fill(0).map((_, f) =>
              [0, 1, 2].map((c) => (
                <rect key={`${f}-${c}`} x={x + 24 + c * (w / 3)} y={y + 30 + f * 80} width={w / 3 - 40} height={40} fill={C.yellow} opacity={(f + c + i) % 3 === 0 ? 0.25 + 0.4 * noche : 0.08} />
              )),
            )}
          </g>
        ))}

        {/* Central de tráfico */}
        <rect x={CENTRAL.x0} y={CENTRAL.y0} width={CENTRAL.x1 - CENTRAL.x0} height={1300 - CENTRAL.y0} fill="#2E2850" />
        <rect x={CENTRAL.x0 + 30} y={CENTRAL.y0 + 40} width={240} height={60} rx={8} fill="#1A1430" />
        <text x={CENTRAL.x0 + 150} y={CENTRAL.y0 + 82} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>
          CENTRAL
        </text>
        {[0, 1, 2].map((k) => (
          <rect key={k} x={CENTRAL.x0 + 40 + k * 80} y={CENTRAL.y0 + 150} width={60} height={44} rx={4} fill={C.cyan} opacity={0.35 + 0.2 * Math.sin(t * 3 + k)} />
        ))}
        <path d={`M ${CENTRAL.x0 + 220} ${CENTRAL.y0} L ${CENTRAL.x0 + 220} ${CENTRAL.y0 - 140} M ${CENTRAL.x0 + 200} ${CENTRAL.y0 - 110} L ${CENTRAL.x0 + 240} ${CENTRAL.y0 - 110}`} stroke="#8A84A8" strokeWidth={6} />
        {ondas > 0
          ? [0, 1, 2].map((k) => {
              const p = (t * 0.9 + k / 3) % 1;
              return <circle key={k} cx={CENTRAL.x0 + 220} cy={CENTRAL.y0 - 140} r={30 + p * 380} fill="none" stroke={C.cyan} strokeWidth={5} opacity={(1 - p) * ondas} />;
            })
          : null}

        {/* Calzada con paso de peatones y coches */}
        <rect x={-800} y={1300} width={4400} height={170} fill="#2A2638" />
        {new Array(30).fill(0).map((_, i) => (
          <rect key={i} x={-780 + i * 150} y={1380} width={70} height={8} fill="#8C88A8" opacity={0.6} />
        ))}
        {new Array(6).fill(0).map((_, i) => (
          <polygon key={i} points={`${640 + i * 40},1310 ${668 + i * 40},1310 ${652 + i * 44},1460 ${624 + i * 44},1460`} fill="#E8E6F0" opacity={0.85} />
        ))}
        {COCHES.map((c, i) => {
          const visible = interpolate(cochesVisibles - i, [0, 1], [0, 1], clamp);
          if (visible <= 0) {
            return null;
          }
          const x = 1900 - ((t * c.v + c.o) % 2600);
          return (
            <g key={i} opacity={visible}>
              <Coche x={x} color={c.color} />
            </g>
          );
        })}
        {/* Acera */}
        <rect x={-800} y={1460} width={2560} height={40} fill="#4A4468" />
        <rect x={-800} y={SUELO} width={4400} height={1400} fill="#16122A" />

        {/* Armario controlador */}
        <rect x={ARMARIO.x0} y={ARMARIO.y0} width={ARMARIO.x1 - ARMARIO.x0} height={SUELO - ARMARIO.y0} rx={6} fill="#6A7080" />
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={ARMARIO.x0 + 20} y1={ARMARIO.y0 + 30 + k * 16} x2={ARMARIO.x1 - 20} y2={ARMARIO.y0 + 30 + k * 16} stroke="#4A5060" strokeWidth={4} />
        ))}
        <circle cx={ARMARIO.x1 - 18} cy={ARMARIO.y0 + 110} r={5} fill="#3A3E4A" />

        {/* Semáforo: poste, brazo con luces para coches, cabeza de peatones y botón */}
        <rect x={POSTE - 10} y={520} width={20} height={SUELO - 520} fill="#5A5470" />
        <rect x={POSTE} y={548} width={240} height={16} fill="#5A5470" />
        <rect x={POSTE + 200} y={564} width={80} height={230} rx={14} fill="#1A1420" />
        <circle cx={POSTE + 240} cy={608} r={26} fill={C.red} opacity={verde > 0.5 ? 1 : 0.25} />
        <circle cx={POSTE + 240} cy={678} r={26} fill={C.yellow} opacity={0.25} />
        <circle cx={POSTE + 240} cy={748} r={26} fill="#48C878" opacity={verde > 0.5 ? 0.25 : 1} />
        <rect x={POSTE + 10} y={820} width={90} height={160} rx={10} fill="#1A1420" />
        {/* Peatón rojo (quieto) y verde (andando) */}
        <g opacity={verde > 0.5 ? 0.15 : 1} transform={`translate(${POSTE + 55} 860)`}>
          <circle cx={0} cy={-14} r={9} fill={C.red} />
          <path d="M -9 -2 L 9 -2 L 9 22 L 4 22 L 4 34 L -4 34 L -4 22 L -9 22 Z" fill={C.red} />
        </g>
        <g opacity={verde > 0.5 ? 1 : 0.15} transform={`translate(${POSTE + 55} 940)`}>
          <circle cx={2} cy={-22} r={8} fill="#48C878" />
          <path d="M -2 -12 L 8 -12 L 10 6 L 18 22 L 12 24 L 4 10 L -4 24 L -12 22 L -4 4 Z" fill="#48C878" />
        </g>
        <rect x={BOTON[0] - 16} y={BOTON[1] - 60} width={60} height={130} rx={10} fill="#E8C030" />
        <rect x={BOTON[0] - 6} y={BOTON[1] - 48} width={40} height={18} rx={4} fill="#1A1420" />
        <text x={BOTON[0] + 14} y={BOTON[1] - 34} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={11} fontWeight={700} opacity={0.3 + 0.7 * espere}>
          ESPERE
        </text>
        <circle cx={BOTON[0] + 14} cy={BOTON[1] + 4} r={18} fill="#3A3448" />
        <circle cx={BOTON[0] + 14} cy={BOTON[1] + 4} r={13} fill={empuje > 0.3 ? "#F8E080" : "#C8C4D8"} />
        <path d={`M ${BOTON[0] + 2} ${BOTON[1] + 44} L ${BOTON[0] + 26} ${BOTON[1] + 44} M ${BOTON[0] + 18} ${BOTON[1] + 36} L ${BOTON[0] + 26} ${BOTON[1] + 44} L ${BOTON[0] + 18} ${BOTON[1] + 52}`} fill="none" stroke="#1A1420" strokeWidth={3} />

        {/* Rayos X: cable del botón que baja por el poste… y no llega a ninguna parte */}
        {rayos > 0 ? (
          <g opacity={rayos}>
            <rect x={POSTE - 9} y={BOTON[1] - 10} width={18} height={SUELO + 60 - BOTON[1] + 10} fill="#0A0818" opacity={0.7} />
            <rect x={POSTE - 60} y={SUELO + 4} width={ARMARIO.x1 - POSTE + 80} height={90} rx={10} fill="#0A0818" opacity={0.75} />
            <path d={`M ${BOTON[0] + 30} ${BOTON[1] + 4} L ${POSTE} ${BOTON[1] + 4} L ${POSTE} ${SUELO + 50} L ${POSTE + 70} ${SUELO + 50}`} fill="none" stroke={C.cyan} strokeWidth={5} />
            <path d={`M ${POSTE + 110} ${SUELO + 50} L ${ARMARIO.x0 + 50} ${SUELO + 50} L ${ARMARIO.x0 + 50} ${SUELO}`} fill="none" stroke="#5A6A7A" strokeWidth={5} strokeDasharray="8 6" />
            <g opacity={corte}>
              <line x1={POSTE + 76} y1={SUELO + 30} x2={POSTE + 104} y2={SUELO + 70} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
              <line x1={POSTE + 104} y1={SUELO + 30} x2={POSTE + 76} y2={SUELO + 70} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
            </g>
          </g>
        ) : null}

        {/* Peatón */}
        <Persona x={PX} suelo={SUELO} t={t} mano={brazo > 0.01 ? mano : null} miedo={prisa} />

        {/* Edificio: vestíbulo con ascensor */}
        <rect x={1760} y={300} width={1300} height={SUELO - 300} fill="#2C2440" />
        <rect x={1760} y={1380} width={1300} height={120} fill="#3A3058" />
        {/* Cabina del ascensor */}
        <rect x={ASC.x0 - 20} y={ASC.y0 - 20} width={ASC.x1 - ASC.x0 + 40} height={SUELO - ASC.y0 + 20} fill="#8A84A8" />
        <rect x={ASC.x0} y={ASC.y0} width={ASC.x1 - ASC.x0} height={SUELO - ASC.y0} fill="#C8B890" />
        <rect x={ASC.x0} y={SUELO - 30} width={ASC.x1 - ASC.x0} height={30} fill="#8A7A60" />
        <rect x={ASC.x1 - 60} y={ASC.y0} width={60} height={SUELO - ASC.y0} fill="#B0A078" />
        <rect x={ASC.panel[0] - 18} y={ASC.panel[1] - 20} width={36} height={130} rx={6} fill="#4A4458" />
        <circle cx={ASC.panel[0]} cy={ASC.panel[1] + 10} r={11} fill="#C8C4D8" />
        <text x={ASC.panel[0]} y={ASC.panel[1] + 15} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={11} fontWeight={700}>
          ◀▶
        </text>
        <circle cx={ASC.panel[0]} cy={ASC.panel[1] + 52} r={11} fill={empuje2 > 0.4 ? "#F8E080" : "#C8C4D8"} />
        <text x={ASC.panel[0]} y={ASC.panel[1] + 57} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={11} fontWeight={700}>
          ▶◀
        </text>
        <Persona x={PX2} suelo={SUELO} t={t} mano={pulsa2 > 0.01 ? mano2 : null} miedo={0.4 * pulsa2} />
        {/* Puertas que se cierran al final del tiempo mínimo */}
        <rect x={ASC.x0} y={ASC.y0} width={((ASC.x1 - ASC.x0) / 2) * cierra} height={SUELO - ASC.y0} fill="#9A94B8" stroke="#6A6488" strokeWidth={3} />
        <rect x={ASC.x1 - ((ASC.x1 - ASC.x0) / 2) * cierra} y={ASC.y0} width={((ASC.x1 - ASC.x0) / 2) * cierra} height={SUELO - ASC.y0} fill="#9A94B8" stroke="#6A6488" strokeWidth={3} />
        {/* Barra de tiempo mínimo encima de la puerta */}
        <rect x={ASC.x0} y={ASC.y0 - 70} width={ASC.x1 - ASC.x0} height={26} rx={13} fill="#1A1430" />
        <rect x={ASC.x0} y={ASC.y0 - 70} width={(ASC.x1 - ASC.x0) * tiempoMin} height={26} rx={13} fill={C.yellow} />

        {/* Termostato de oficina */}
        <rect x={2520} y={760} width={420} height={600} fill="#3A3058" />
        <rect x={TERMO[0] - 60} y={TERMO[1] - 80} width={120} height={160} rx={16} fill="#E8E6F0" />
        <rect x={TERMO[0] - 42} y={TERMO[1] - 60} width={84} height={50} rx={6} fill="#1A3A4A" />
        <text x={TERMO[0]} y={TERMO[1] - 24} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={28} fontWeight={700}>
          22°
        </text>
        <circle cx={TERMO[0] - 22} cy={TERMO[1] + 34} r={14} fill="#C8C4D8" />
        <circle cx={TERMO[0] + 22} cy={TERMO[1] + 34} r={14} fill="#C8C4D8" />
        <text x={TERMO[0] - 22} y={TERMO[1] + 42} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={22} fontWeight={700}>
          −
        </text>
        <text x={TERMO[0] + 22} y={TERMO[1] + 42} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={22} fontWeight={700}>
          +
        </text>
        {rayosTermo > 0 ? (
          <g opacity={rayosTermo}>
            <rect x={TERMO[0] - 60} y={TERMO[1] - 80} width={120} height={160} rx={16} fill="#0A0818" opacity={0.85} />
            <rect x={TERMO[0] - 46} y={TERMO[1] - 66} width={92} height={132} rx={10} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="8 6" />
            <line x1={TERMO[0] - 30} y1={TERMO[1] - 40} x2={TERMO[0] + 30} y2={TERMO[1] + 40} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
            <line x1={TERMO[0] + 30} y1={TERMO[1] - 40} x2={TERMO[0] - 30} y2={TERMO[1] + 40} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}
      </g>

      <Piensa x={sx(PX + 60)} y={sy(SUELO - 600)} texto="¡ya viene!" o={piensa} />
      <Tag x={sx(BOTON[0] + 14)} y={sy(BOTON[1] + 4)} dx={200} dy={150} texto="botón" color={C.yellow} o={tagBoton} />
      <Tag x={sx(POSTE + 90)} y={sy(SUELO + 50)} dx={140} dy={150} texto="no conectado" color={C.red} o={tagCable} />
      <Tag x={sx(CENTRAL.x0 + 150)} y={sy(CENTRAL.y0 + 70)} dx={0} dy={-200} texto="central" color={C.cyan} o={tagCentral} />
      <Tag x={sx(ASC.panel[0])} y={sy(ASC.panel[1] + 52)} dx={140} dy={160} texto="cerrar" color={C.yellow} o={tagCerrar} />
      <Tag x={sx(ASC.x1 - 40)} y={sy(ASC.y0 - 57)} dx={-60} dy={150} texto="tiempo mínimo" color={C.yellow} o={tagMinimo} />
      <Tag x={sx(TERMO[0] + 50)} y={sy(TERMO[1])} dx={120} dy={230} texto="sin cables" color={C.red} o={tagTermo} />
      <Tag x={sx(BOTON[0] + 14)} y={sy(BOTON[1] + 4)} dx={200} dy={150} texto="×5 = igual" color={C.red} o={tagCinco} />
    </svg>
  );
};
