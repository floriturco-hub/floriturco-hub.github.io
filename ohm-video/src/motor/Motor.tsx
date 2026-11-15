import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el motor visto de frente (imanes fijos N y S, la bobina-electroimán que gira y la pila); en el
// centro, el conmutador de cerca: el anillo partido gira bajo las escobillas e invierte la corriente cada media vuelta.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const NORTE = "#E8414F";
const SUR = "#4A7AE8";
const COBRE = "#D8904A";
const CORR = C.yellow;
const M = { x: 550, y: 1050 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1080, 1.0],
  [T.final - 0.1, 550, 1080, 1.04],
  [T.final + 0.2, 550, 1050, 1.3],
  [T.dentro - 0.1, 550, 1050, 1.33],
  [T.dentro + 0.2, 550, 1080, 0.95],
  [T.imanes - 0.1, 550, 1080, 0.98],
  [T.imanes + 0.2, 550, 1050, 1.15],
  [T.bobina - 0.1, 550, 1050, 1.18],
  [T.bobina + 0.2, 550, 1050, 1.45],
  [T.corriente - 0.1, 550, 1050, 1.48],
  [T.corriente + 0.2, 550, 1250, 1.0],
  [T.electroiman - 0.1, 550, 1250, 1.03],
  [T.electroiman + 0.2, 550, 1050, 1.35],
  [T.polo - 0.1, 550, 1050, 1.38],
  [T.polo + 0.2, 720, 1000, 1.5],
  [T.empieza - 0.1, 720, 1000, 1.53],
  [T.empieza + 0.2, 550, 1080, 1.0],
  [T.pero - 0.1, 550, 1080, 1.03],
  [T.pero + 0.2, 720, 1050, 1.55],
  [T.siempre - 0.1, 720, 1050, 1.58],
  [T.siempre + 0.2, 550, 1080, 1.05],
  [T.truco - 0.1, 550, 1080, 1.08],
  [T.truco + 0.2, 1850, 1030, 1.0],
  [T.conmutador - 0.1, 1850, 1030, 1.03],
  [T.conmutador + 0.2, 1850, 1030, 1.4],
  [T.instante - 0.1, 1850, 1030, 1.43],
  [T.instante + 0.2, 1850, 1030, 1.1],
  [T.polos - 0.1, 1850, 1030, 1.13],
  [T.polos + 0.2, 550, 1050, 1.25],
  [T.empuja - 0.1, 550, 1050, 1.28],
  [T.empuja + 0.2, 720, 1050, 1.45],
  [T.sigue - 0.1, 720, 1050, 1.48],
  [T.sigue + 0.2, 550, 1080, 1.0],
  [T.cada - 0.1, 550, 1080, 1.03],
  [T.cada + 0.2, 550, 1050, 1.2],
  [T.engana - 0.1, 550, 1050, 1.23],
  [T.engana + 0.2, 550, 1050, 1.35],
  [T.asi - 0.1, 550, 1050, 1.38],
  [T.asi + 0.25, 550, 1080, 1.0],
  [T.fin + 0.3, 550, 1080, 1.04],
];

export const MotorMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Ángulo del extremo A de la bobina (grados; 0 = mira al imán S de la derecha)
  const gira = t < T.final || t > T.asi;
  const vel = 300;
  let th: number;
  if (gira) {
    th = (t > T.asi ? t - T.asi : t) * vel;
  } else if (t < T.empieza) {
    th = -90;
  } else if (t < T.instante) {
    const u = t - T.empieza;
    th = u < 1 ? interpolate(u, [0, 1], [-90, 0], { ...clamp, easing: (x) => x * x * (3 - 2 * x) }) : 12 * Math.exp(-(u - 1) * 2) * Math.sin((u - 1) * 9);
  } else {
    const u = t - T.instante;
    th = 2 + 60 * u + 140 * u * u * (u < 1.5 ? 1 : 0) + (u >= 1.5 ? 140 * 2.25 + 420 * (u - 1.5) : 0);
  }
  const aEsNorte = gira || t > T.instante ? ((Math.floor(th / 180) % 2) + 2) % 2 === 1 : true;
  const encendida = gira || t > T.corriente + 0.3;
  const rad = (th * Math.PI) / 180;
  const extremoA: [number, number] = [M.x + 230 * Math.cos(rad), M.y + 230 * Math.sin(rad)];
  const atrae = ventana(T.atraido, T.pero + 0.2);
  const empuja = ventana(T.empuja, T.cada);

  // Conmutador
  const verConm = ventana(T.truco - 0.1, T.polos + 0.2);
  const contactoA = Math.sin(rad) < 0;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const flujo = (d: string, o: number) => (o > 0 ? <path d={d} fill="none" stroke={CORR} strokeWidth={8} strokeDasharray="16 22" strokeDashoffset={-t * 120} opacity={o} /> : null);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={3000} height={2400} fill="#141824" />

        {/* Imanes fijos */}
        <path d="M 140 820 L 300 820 L 300 900 A 170 170 0 0 0 300 1200 L 300 1280 L 140 1280 Z" fill={NORTE} />
        <path d="M 960 820 L 800 820 L 800 900 A 170 170 0 0 1 800 1200 L 800 1280 L 960 1280 Z" fill={SUR} />
        <text x={210} y={1070} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={90} fontWeight={700}>
          N
        </text>
        <text x={890} y={1070} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={90} fontWeight={700}>
          S
        </text>
        {/* Bobina que gira (electroimán) */}
        <g transform={`rotate(${th} ${M.x} ${M.y})`}>
          <rect x={M.x - 240} y={M.y - 46} width={480} height={92} rx={30} fill="#5A5F6C" />
          {new Array(12).fill(0).map((_, k) => (
            <line key={k} x1={M.x - 180 + k * 30} y1={M.y - 46} x2={M.x - 170 + k * 30} y2={M.y + 46} stroke={COBRE} strokeWidth={10} />
          ))}
          {encendida ? (
            <g>
              <rect x={M.x + 160} y={M.y - 46} width={80} height={92} rx={24} fill={aEsNorte ? NORTE : SUR} />
              <rect x={M.x - 240} y={M.y - 46} width={80} height={92} rx={24} fill={aEsNorte ? SUR : NORTE} />
              <text x={M.x + 200} y={M.y + 18} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={50} fontWeight={700} transform={`rotate(${-th} ${M.x + 200} ${M.y})`}>
                {aEsNorte ? "N" : "S"}
              </text>
              <text x={M.x - 200} y={M.y + 18} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={50} fontWeight={700} transform={`rotate(${-th} ${M.x - 200} ${M.y})`}>
                {aEsNorte ? "S" : "N"}
              </text>
            </g>
          ) : null}
          <circle cx={M.x} cy={M.y} r={36} fill={COBRE} stroke="#1A1A1A" strokeWidth={6} />
          <line x1={M.x} y1={M.y - 36} x2={M.x} y2={M.y + 36} stroke="#1A1A1A" strokeWidth={8} />
        </g>
        {/* Pila y cables */}
        <rect x={470} y={1420} width={160} height={70} rx={10} fill="#3A3F4C" />
        <rect x={470} y={1420} width={60} height={70} rx={10} fill={NORTE} />
        <path d="M 470 1455 L 380 1455 L 380 1050 L 500 1050" fill="none" stroke="#8A90A0" strokeWidth={10} />
        <path d="M 630 1455 L 720 1455 L 720 1050 L 600 1050" fill="none" stroke="#8A90A0" strokeWidth={10} />
        {flujo("M 470 1455 L 380 1455 L 380 1050 L 500 1050", encendida ? 1 : 0)}
        {flujo("M 600 1050 L 720 1050 L 720 1455 L 630 1455", encendida ? 1 : 0)}
        {/* Atracción y empuje */}
        {atrae > 0 ? <path d={`M ${extremoA[0]} ${extremoA[1]} Q 760 ${Math.min(extremoA[1], 1000) - 60} 800 1040`} fill="none" stroke={C.white} strokeWidth={6} strokeDasharray="14 10" opacity={atrae} /> : null}
        {empuja > 0 ? (
          <g opacity={empuja}>
            <path d="M 790 960 L 690 860 M 690 860 l 10 40 M 690 860 l 40 10" fill="none" stroke={C.orange} strokeWidth={10} strokeLinecap="round" />
            <path d="M 790 1140 L 690 1240 M 690 1240 l 10 -40 M 690 1240 l 40 -10" fill="none" stroke={C.orange} strokeWidth={10} strokeLinecap="round" />
          </g>
        ) : null}
        <Pildora x={550} y={700} texto="¿el truco?" color={C.white} o={ventana(T.final + 0.2, T.dentro)} tam={46} />
        <Pildora x={680} y={720} texto="se quedaría quieta" color={C.white} o={ventana(T.detendria, T.truco)} tam={42} />
        <Pildora x={680} y={720} texto="¡ahora empuja!" color={C.orange} o={ventana(T.empuja, T.cada)} tam={46} />
        <Pildora x={550} y={700} texto="cada media vuelta" color={C.yellow} o={ventana(T.cada + 0.2, T.asi)} tam={44} />

        {/* Conmutador de cerca */}
        <g opacity={verConm}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <g transform={`rotate(${th} 1850 1030)`}>
            <path d="M 1850 830 A 200 200 0 0 1 1850 1230 L 1850 1170 A 140 140 0 0 0 1850 890 Z" fill={COBRE} stroke="#1A1A1A" strokeWidth={6} transform="rotate(-90 1850 1030)" />
            <path d="M 1850 830 A 200 200 0 0 0 1850 1230 L 1850 1170 A 140 140 0 0 1 1850 890 Z" fill="#B8783A" stroke="#1A1A1A" strokeWidth={6} transform="rotate(-90 1850 1030)" />
            <rect x={1838} y={820} width={24} height={420} fill="#141824" transform="rotate(90 1850 1030)" />
            <text x={1850} y={940} textAnchor="middle" fill="#1A1A1A" fontFamily={mono} fontSize={44} fontWeight={700}>
              A
            </text>
            <text x={1850} y={1160} textAnchor="middle" fill="#1A1A1A" fontFamily={mono} fontSize={44} fontWeight={700}>
              B
            </text>
          </g>
          <rect x={1560} y={980} width={90} height={100} rx={10} fill="#8A90A0" />
          <rect x={2050} y={980} width={90} height={100} rx={10} fill="#8A90A0" />
          <text x={1605} y={1050} textAnchor="middle" fill={NORTE} fontFamily={mono} fontSize={60} fontWeight={700}>
            +
          </text>
          <text x={2095} y={1050} textAnchor="middle" fill={SUR} fontFamily={mono} fontSize={60} fontWeight={700}>
            −
          </text>
          <path d="M 1560 1030 L 1420 1030 L 1420 1380 L 2280 1380 L 2280 1030 L 2140 1030" fill="none" stroke="#8A90A0" strokeWidth={10} />
          {flujo("M 1560 1030 L 1420 1030 L 1420 1380 L 2280 1380 L 2280 1030 L 2140 1030", 1)}
        </g>
        <Pildora x={1850} y={700} texto={contactoA ? "A toca +" : "A toca −"} color={contactoA ? NORTE : SUR} o={ventana(T.invierte, T.polos + 0.2)} tam={46} />
      </g>

      {[T.corriente, T.truco, T.instante, T.engana].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.25 * destello(q)} />
      ))}
      <Tag x={sx(210)} y={sy(860)} dx={120} dy={-180} texto="imanes fijos" color={C.white} o={ventana(T.imanes + 0.2, T.bobina)} />
      <Tag x={sx(M.x - 100)} y={sy(M.y)} dx={-60} dy={-230} texto="bobina" color={COBRE} o={ventana(T.bobina + 0.2, T.corriente)} />
      <Tag x={sx(M.x - 100)} y={sy(M.y)} dx={-60} dy={-230} texto="electroimán" color={C.cyan} o={ventana(T.electroiman + 0.2, T.polo)} />
      <Tag x={sx(1850)} y={sy(830)} dx={150} dy={-130} texto="anillo partido" color={COBRE} o={ventana(T.anillo, T.invierte)} />
      <Tag x={sx(1605)} y={sy(980)} dx={-40} dy={-200} texto="escobilla" color="#C8CED8" o={ventana(T.conmutador + 0.2, T.invierte)} />
    </svg>
  );
};
