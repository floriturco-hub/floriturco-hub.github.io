import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: arriba, "lo que ves" (un cielo azul con manchitas flotando); abajo, el ojo en corte mirando hacia arriba:
// córnea, pupila y cristalino arriba, el gel vítreo en medio y la retina abajo, donde caen las sombras.
type P2 = [number, number];
const VISTA = { x0: 40, y0: 60, x1: 1040, y1: 980 };
const E: P2 = [540, 1620];
const R = 360;
const R_RETINA = 330;
const PUPILA: P2 = [0, -290];
// Centros de los grumos (coordenadas locales del ojo)
const GRUMOS: P2[] = [
  [-130, -40],
  [70, 30],
  [-20, 150],
  [150, -120],
];
// Manchas en "lo que ves"
const MANCHAS: P2[] = [
  [560, 620],
  [330, 760],
  [760, 820],
  [450, 900],
];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 540, 540, 1.12],
  [T.parece - 0.3, 540, 540, 1.14],
  [T.parece + 0.6, 540, 1150, 0.8],
  [T.relleno - 0.3, 540, 1150, 0.81],
  [T.relleno + 0.6, 540, 1600, 1.2],
  [T.luz - 0.3, 540, 1600, 1.22],
  [T.luz + 0.6, 540, 1640, 1.25],
  [T.retina - 0.2, 540, 1640, 1.26],
  [T.retina + 0.6, 540, 1800, 1.7],
  [T.porEso - 0.3, 540, 1800, 1.72],
  [T.porEso + 0.6, 540, 600, 1.15],
  [T.porQue - 0.3, 540, 600, 1.16],
  [T.porQue + 0.6, 540, 1150, 0.8],
  [T.llaman - 0.3, 540, 1150, 0.81],
  [T.llaman + 0.6, 540, 1520, 1.0],
  [T.pero - 0.3, 540, 1520, 1.01],
  [T.pero + 0.6, 540, 1200, 0.78],
  [T.final - 0.3, 540, 1200, 0.79],
  [T.final + 0.6, 540, 1150, 0.82],
  [T.fin, 540, 1150, 0.84],
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

// Muelle amortiguado: llega con retraso, se pasa y vuelve (como algo que flota en un gel)
const muelle = (s: number) => (s <= 0 ? 0 : 1 - Math.exp(-1.6 * s) * Math.cos(3.2 * s));

const rota = (p: P2, grados: number): P2 => {
  const a = (grados * Math.PI) / 180;
  return [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
};

// Proyección de un grumo sobre la retina, en línea recta desde la pupila
const sobreRetina = (k: P2): P2 => {
  const d: P2 = [k[0] - PUPILA[0], k[1] - PUPILA[1]];
  const a = d[0] * d[0] + d[1] * d[1];
  const b = 2 * (PUPILA[0] * d[0] + PUPILA[1] * d[1]);
  const c = PUPILA[0] * PUPILA[0] + PUPILA[1] * PUPILA[1] - R_RETINA * R_RETINA;
  const s = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return [PUPILA[0] + d[0] * s, PUPILA[1] + d[1] * s];
};

// Fibras de colágeno: de una red repartida por el gel a hebras enredadas en cada grumo
const FIBRAS = new Array(12).fill(0).map((_, i) => {
  const y = -200 + i * 34;
  const ancho = Math.sqrt(Math.max(0, 300 * 300 - y * y));
  const k = GRUMOS[i % 4];
  const capa = Math.floor(i / 4);
  return new Array(9).fill(0).map((__, j): [P2, P2] => {
    const red: P2 = [-ancho + (2 * ancho * j) / 8, y + Math.sin(j * 1.3 + i) * 10];
    const hebra: P2 = [k[0] + (j - 4) * (8 + capa * 2) + Math.sin(j + i) * 6, k[1] + Math.sin(j * 0.9 + i) * 14 + (capa - 1) * 8];
    return [red, hebra];
  });
});

const PUNTITOS = new Array(40).fill(0).map((_, i) => ({ u: random(`pu${i}`), v: random(`pv${i}`), r: random(`pr${i}`) }));

// Mancha flotante vista en el cielo: transparente con borde gris
const Mancha: React.FC<{ readonly x: number; readonly y: number; readonly tipo: number; readonly t: number; readonly o?: number }> = ({ x, y, tipo, t, o = 1 }) => {
  const borde = "rgba(30, 40, 60, 0.38)";
  const brillo = "rgba(255, 255, 255, 0.35)";
  let forma: React.ReactNode;
  if (tipo === 0) {
    const cuentas = new Array(7).fill(0).map((_, j) => [j * 22 - 66, Math.sin(j * 0.9 + t * 0.6) * 18] as P2);
    forma = cuentas.map((c, j) => (
      <g key={j}>
        <circle cx={c[0]} cy={c[1]} r={11} fill="none" stroke={borde} strokeWidth={6} />
        <circle cx={c[0]} cy={c[1]} r={11} fill="none" stroke={brillo} strokeWidth={2} />
      </g>
    ));
  } else if (tipo === 1 || tipo === 3) {
    const largo = tipo === 1 ? 1 : 1.5;
    const d = `M ${-80 * largo} 0 C ${-40 * largo} ${-40 + Math.sin(t) * 10}, ${0} ${40}, ${40 * largo} ${-10} S ${90 * largo} ${-30 + Math.sin(t * 0.8) * 12}, ${110 * largo} 10`;
    forma = (
      <g>
        <path d={d} fill="none" stroke={borde} strokeWidth={14} strokeLinecap="round" />
        <path d={d} fill="none" stroke={brillo} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  } else {
    forma = [
      [0, 0, 18],
      [26, 10, 12],
      [8, 28, 10],
    ].map(([cx, cy, r], j) => (
      <g key={j}>
        <circle cx={cx} cy={cy} r={r} fill="rgba(30,40,60,0.12)" stroke={borde} strokeWidth={6} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={brillo} strokeWidth={2} />
      </g>
    ));
  }
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {forma}
    </g>
  );
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

export const Ojo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Persecución: la mirada va a por la mancha y la mancha se escapa
  const persigue1 = ventana(T.intenta - 0.3, T.parece + 0.3);
  const persigue2 = ventana(T.mueves - 0.4, T.llaman);
  const huida1 = 210 * muelle(t - T.intenta - 0.25) * (1 - interpolate(t, [T.parece + 0.5, T.relleno], [0, 1], suave));
  const huida2 = 220 * muelle(t - T.mueves - 0.2) + 70 * interpolate(t, [T.paras, T.deslizan + 1.2], [0, 1], suave);
  const huida = huida1 + huida2 * interpolate(t, [T.mueves - 0.5, T.mueves], [0, 1], clamp) * (1 - interpolate(t, [T.llaman, T.normales], [0, 1], suave));
  const mira = Math.max(
    interpolate(t, [T.intenta - 0.1, T.intenta + 0.5], [0, 1], suave) * (1 - interpolate(t, [T.parece, T.parece + 0.4], [0, 1], clamp)),
    interpolate(t, [T.mueves - 0.2, T.mueves + 0.4], [0, 1], suave),
  );
  const reticula: P2 = [540 + (MANCHAS[0][0] - 540) * mira, 470 + (MANCHAS[0][1] - 470) * mira];

  // Ojo que gira al mirar, y grumos que lo siguen tarde y se pasan
  const giro = 16 * interpolate(t, [T.mueves, T.mueves + 0.5, T.llaman, T.llaman + 1.2], [0, 1, 1, 0], suave);
  const giroGrumos = 16 * muelle(t - T.mueves - 0.15) * (1 - interpolate(t, [T.llaman, T.llaman + 1.2], [0, 1], suave)) + 10 * interpolate(t, [T.paras, T.deslizan + 1.2, T.llaman, T.llaman + 1.2], [0, 1, 1, 0], suave);
  const relativo = giroGrumos - giro;

  // Gel, red de fibras que se condensa en grumos, luz y sombras
  const gel = Math.max(ventana(T.relleno, T.anos + 0.5), 0.35);
  const brilloGel = ventana(T.vitreo - 0.1, T.fibras + 0.5);
  const condensa = interpolate(t, [T.licuando - 0.3, T.grumos + 1.4], [0, 1], suave);
  const luz = Math.max(ventana(T.luz, T.porEso + 0.4), 0.5 * ventana(T.porQue, T.fin + 1));
  const sombras = interpolate(t, [T.proyecta, T.proyecta + 0.8], [0, 1], clamp);
  const rayos = ventana(T.proyecta, T.porEso);
  const polvo = ventana(T.polvo - 0.1, T.relleno - 0.2);
  const tachaPolvo = interpolate(t, [T.dentro - 0.1, T.dentro + 0.3], [0, 1], clamp);

  // Señales de alarma
  const golpe = interpolate(t, [T.golpe, T.golpe + 0.8, T.final, T.final + 0.6], [0, 1, 1, 0], clamp);
  const destellos = ventana(T.destellos - 0.1, T.final, 0.2, 0.4) * (Math.sin(t * 23) > 0.2 ? 1 : 0.15);
  const cortina = interpolate(t, [T.cortina, T.cortina + 1.2, T.final, T.final + 0.6], [0, 1, 1, 0], suave);
  const desgarro = interpolate(t, [T.desgarro - 0.2, T.desgarro + 0.6, T.final, T.final + 0.6], [0, 1, 1, 0], clamp);

  const grumosRotados = GRUMOS.map((k) => rota(k, relativo * condensa));
  const proyecciones = grumosRotados.map(sobreRetina);

  // Etiquetas ancladas
  const tagVista = ventana(T.parece + 0.3, T.relleno - 0.2);
  const tagOjo = ventana(T.parece + 0.5, T.relleno - 0.2);
  const tagEncima = ventana(T.polvo, T.relleno - 0.2);
  const tagVitreo = ventana(T.vitreo, T.fibras);
  const tagFibras = ventana(T.fibras, T.licuando);
  const tagGrumo = ventana(T.grumos + 0.6, T.luz);
  const tagPupila = ventana(T.pupila - 0.1, T.retina);
  const tagRetina = ventana(T.retina, T.porEso);
  const tagSombra = ventana(T.proyecta + 0.6, T.porEso);
  const tagDesgarro = ventana(T.desgarro, T.final);

  const ojoW = (p: P2): P2 => {
    const r = rota(p, giro);
    return [E[0] + r[0], E[1] + r[1]];
  };
  const pupilaW = ojoW(PUPILA);
  const grumoW = ojoW(grumosRotados[1]);
  const sombraW = ojoW(proyecciones[1]);
  const retinaW = ojoW([R_RETINA * Math.cos(1.2), R_RETINA * Math.sin(1.2)]);
  const desgarroP: P2 = [R_RETINA * Math.cos(0.62), R_RETINA * Math.sin(0.62)];
  const desgarroW = ojoW(desgarroP);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="cielo-mc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3C82D0" />
          <stop offset="1" stopColor="#A8D4F4" />
        </linearGradient>
        <clipPath id="vista-mc">
          <rect x={VISTA.x0} y={VISTA.y0} width={VISTA.x1 - VISTA.x0} height={VISTA.y1 - VISTA.y0} rx={60} />
        </clipPath>
        <clipPath id="gel-mc">
          <circle cx={0} cy={0} r={R - 14} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        {/* Lo que ves: cielo con manchitas */}
        <g clipPath="url(#vista-mc)">
          <rect x={VISTA.x0} y={VISTA.y0} width={VISTA.x1 - VISTA.x0} height={VISTA.y1 - VISTA.y0} fill="url(#cielo-mc)" />
          {[
            [250, 260, 1],
            [760, 360, 1.3],
            [520, 180, 0.8],
          ].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x + Math.sin(t * 0.1 + i) * 20} ${y}) scale(${s})`} opacity={0.85}>
              <ellipse cx={0} cy={0} rx={90} ry={34} fill="#FFFFFF" />
              <ellipse cx={-40} cy={-20} rx={50} ry={34} fill="#FFFFFF" />
              <ellipse cx={30} cy={-26} rx={56} ry={40} fill="#FFFFFF" />
            </g>
          ))}
          {MANCHAS.map((m, i) => (
            <Mancha key={i} x={m[0] + Math.sin(t * 0.35 + i * 2) * 26 + (i === 0 ? huida : 0)} y={m[1] + Math.cos(t * 0.3 + i) * 18 + (i === 0 ? -huida * 0.25 : 0)} tipo={i} t={t} />
          ))}
          {/* Muchas de golpe */}
          {golpe > 0
            ? PUNTITOS.map((p, i) => (
                <circle
                  key={i}
                  cx={VISTA.x0 + 60 + p.u * 880}
                  cy={VISTA.y0 + 60 + p.v * 800 + Math.sin(t + i) * 10}
                  r={4 + p.r * 6}
                  fill="rgba(30,40,60,0.45)"
                  opacity={interpolate(golpe, [p.r * 0.6, p.r * 0.6 + 0.4], [0, 1], clamp)}
                />
              ))
            : null}
          {/* Destellos en la periferia */}
          {destellos > 0 ? (
            <g opacity={destellos}>
              <path d="M 120 300 l 40 -30 l -10 40 l 46 -28" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 930 700 l -40 24 l 14 -38 l -44 22" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
          {/* Cortina oscura que baja */}
          <rect x={VISTA.x0} y={VISTA.y0} width={VISTA.x1 - VISTA.x0} height={(VISTA.y1 - VISTA.y0) * 0.55 * cortina} fill="#0A0818" opacity={0.85} />
          {/* Retícula de la mirada */}
          {persigue1 + persigue2 > 0 ? (
            <g opacity={Math.max(persigue1, persigue2)} transform={`translate(${reticula[0]} ${reticula[1]})`}>
              <circle r={70} fill="none" stroke={C.yellow} strokeWidth={6} />
              <path d="M -96 0 L -54 0 M 54 0 L 96 0 M 0 -96 L 0 -54 M 0 54 L 0 96" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
            </g>
          ) : null}
        </g>
        <rect x={VISTA.x0} y={VISTA.y0} width={VISTA.x1 - VISTA.x0} height={VISTA.y1 - VISTA.y0} rx={60} fill="none" stroke="#5A4E78" strokeWidth={8} />

        {/* El ojo en corte, mirando hacia arriba */}
        <g transform={`translate(${E[0]} ${E[1]}) rotate(${giro})`}>
          {/* Interior y gel vítreo */}
          <circle cx={0} cy={0} r={R - 10} fill="#16203A" />
          <circle cx={0} cy={0} r={R - 14} fill={C.cyan} opacity={0.06 * gel + 0.14 * brilloGel} />
          {/* Luz que entra por la pupila y llega a la retina */}
          <g clipPath="url(#gel-mc)">
            <polygon points={`-40,-290 40,-290 310,113 245,221 0,330 -245,221 -310,113`} fill={C.yellow} opacity={0.14 * luz} />
          </g>
          {/* Retina y nervio óptico */}
          <path d={`M ${R_RETINA * Math.cos(0.35)} ${R_RETINA * Math.sin(0.35)} A ${R_RETINA} ${R_RETINA} 0 0 1 ${R_RETINA * Math.cos(2.79)} ${R_RETINA * Math.sin(2.79)}`} fill="none" stroke="#E8704C" strokeWidth={16} strokeLinecap="round" />
          <path d="M -60 350 C -66 400, -80 450, -96 520 L -40 520 C -30 460, -20 410, -14 352 Z" fill="#E8C478" />
          <path d="M -50 380 L -76 500 M -32 380 L -54 500" stroke="#C8A058" strokeWidth={3} />
          {/* Sombras sobre la retina */}
          {proyecciones.map((p, i) => (
            <ellipse
              key={i}
              cx={p[0] * 0.97}
              cy={p[1] * 0.97}
              rx={i === 2 ? 16 : 26}
              ry={12}
              transform={`rotate(${(Math.atan2(p[1], p[0]) * 180) / Math.PI + 90} ${p[0] * 0.97} ${p[1] * 0.97})`}
              fill="#0A0818"
              opacity={0.8 * sombras * condensa}
            />
          ))}
          {/* Rayos de la pupila a la sombra, pasando por el grumo */}
          {rayos > 0
            ? proyecciones.map((p, i) => (
                <line key={i} x1={PUPILA[0]} y1={PUPILA[1]} x2={p[0]} y2={p[1]} stroke={C.yellow} strokeWidth={3} strokeDasharray="10 8" opacity={0.7 * rayos} />
              ))
            : null}
          {/* Fibras de colágeno: red repartida → grumos y hebras */}
          <g clipPath="url(#gel-mc)" transform={`rotate(${relativo * condensa})`}>
            {FIBRAS.map((f, i) => {
              const d = f.map(([a, b], j) => `${j === 0 ? "M" : "L"} ${a[0] + (b[0] - a[0]) * condensa} ${a[1] + (b[1] - a[1]) * condensa}`).join(" ");
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke="#3A4660" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.9 * condensa} />
                  <path d={d} fill="none" stroke="#BEE8F4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.25 + 0.4 * gel * (1 - 0.5 * condensa) + 0.3 * brilloGel} />
                </g>
              );
            })}
          </g>
          {/* Muchas manchas nuevas de golpe */}
          {golpe > 0
            ? PUNTITOS.slice(0, 24).map((p, i) => {
                const a = p.u * Math.PI * 2;
                const r = 40 + p.v * 230;
                return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={3 + p.r * 4} fill="#3A4660" opacity={interpolate(golpe, [p.r * 0.6, p.r * 0.6 + 0.4], [0, 1], clamp)} />;
              })
            : null}
          {/* Desgarro: un trozo de retina que se levanta */}
          {desgarro > 0 ? (
            <g opacity={desgarro}>
              <path
                d={`M ${desgarroP[0] - 30} ${desgarroP[1] + 22} Q ${desgarroP[0] - 40 - 30 * desgarro} ${desgarroP[1] - 30 * desgarro} ${desgarroP[0] + 6} ${desgarroP[1] - 24 * desgarro - 6} L ${desgarroP[0] + 20} ${desgarroP[1] - 10}`}
                fill="#E8704C"
                stroke="#B04030"
                strokeWidth={3}
              />
              <circle cx={desgarroP[0]} cy={desgarroP[1]} r={46} fill="none" stroke={C.red} strokeWidth={5} />
            </g>
          ) : null}
          {destellos > 0 ? (
            <path d={`M ${desgarroP[0] - 70} ${desgarroP[1] - 70} l 20 -18 l 4 22 l 22 -20`} fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={destellos} />
          ) : null}

          {/* Esclerótica (blanco del ojo), abierta arriba para la córnea */}
          <path d={`M 123 -338 A ${R} ${R} 0 1 1 -123 -338`} fill="none" stroke="#E8E2EA" strokeWidth={22} />
          <path d={`M 112 -322 A ${R - 18} ${R - 18} 0 1 1 -112 -322`} fill="none" stroke="#6A2A3A" strokeWidth={6} />
          {/* Córnea */}
          <path d="M -128 -336 C -90 -400, 90 -400, 128 -336" fill={C.cyan} fillOpacity={0.14} stroke={C.cyan} strokeWidth={7} />
          {/* Iris y pupila */}
          <rect x={-124} y={-314} width={84} height={18} rx={6} fill="#5A8AB8" />
          <rect x={40} y={-314} width={84} height={18} rx={6} fill="#5A8AB8" />
          {/* Cristalino */}
          <ellipse cx={0} cy={-262} rx={100} ry={38} fill="#CDEFFF" opacity={0.35} stroke="#9AD8E8" strokeWidth={4} />
          <path d="M -120 -262 L -100 -262 M 100 -262 L 120 -262" stroke="#8A7AA8" strokeWidth={8} strokeLinecap="round" />
          {/* Polvo encima del ojo (no es eso) */}
          {polvo > 0 ? (
            <g opacity={polvo}>
              {[
                [-60, -392],
                [-10, -400],
                [44, -396],
                [86, -380],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y - 10} r={7} fill="#8C7A60" />
              ))}
              <g opacity={tachaPolvo}>
                <line x1={-100} y1={-450} x2={100} y2={-360} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
                <line x1={100} y1={-450} x2={-100} y2={-360} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
              </g>
            </g>
          ) : null}
        </g>
      </g>

      <Tag x={sx(VISTA.x0 + 80)} y={sy(VISTA.y1 - 40)} dx={120} dy={110} texto="lo que ves" color={C.white} o={tagVista} />
      <Tag x={sx(E[0] + R - 20)} y={sy(E[1] + 40)} dx={-100} dy={300} texto="tu ojo" color={C.white} o={tagOjo} />
      <Tag x={sx(E[0] + 80)} y={sy(E[1] - 400)} dx={190} dy={-60} texto="¿encima?" color={C.red} o={tagEncima} />
      <Tag x={sx(E[0] - 160)} y={sy(E[1] + 60)} dx={0} dy={260} texto="humor vítreo" color={C.cyan} o={tagVitreo} />
      <Tag x={sx(E[0] + FIBRAS[6][6][0][0])} y={sy(E[1] + FIBRAS[6][6][0][1])} dx={40} dy={330} texto="fibras de colágeno" color={C.cyan} o={tagFibras} />
      <Tag x={sx(grumoW[0])} y={sy(grumoW[1])} dx={170} dy={-150} texto="grumo" color={C.white} o={tagGrumo} />
      <Tag x={sx(pupilaW[0])} y={sy(pupilaW[1])} dx={230} dy={-50} texto="pupila" color={C.yellow} o={tagPupila} />
      <Tag x={sx(retinaW[0])} y={sy(retinaW[1])} dx={-230} dy={120} texto="retina" color={C.orange} o={tagRetina} />
      <Tag x={sx(sombraW[0])} y={sy(sombraW[1])} dx={200} dy={120} texto="sombra" color={C.yellow} o={tagSombra} />
      <Tag x={sx(desgarroW[0])} y={sy(desgarroW[1])} dx={60} dy={170} texto="desgarro" color={C.red} o={tagDesgarro} />
    </svg>
  );
};
