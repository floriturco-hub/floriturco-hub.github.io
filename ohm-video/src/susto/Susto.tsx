import { interpolate, random } from "remotion";
import { Cara } from "../components/Cara";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una cara de perfil que se asusta y palidece, y una mano que se enfría; en el centro, el mapa
// del cuerpo (glándulas suprarrenales, adrenalina y sangre que se va a músculos, corazón y cerebro); a la derecha, un
// vaso de la piel que se cierra; al fondo, el corazón que se acelera y los pulmones.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const PIEL = "#C98A64";
const PALIDA = "#EADFD2";
const SANGRE = "#E8414F";
const ADRE = C.yellow;
const GOTAS = new Array(24).fill(0).map((_, i) => ({ a: random(`ga${i}`) * Math.PI * 2, r: 0.3 + random(`gr${i}`) * 0.7 }));

const mezcla = (a: string, b: string, p: number) => {
  const h = (s: string, k: number) => parseInt(s.slice(1 + 2 * k, 3 + 2 * k), 16);
  return `rgb(${[0, 1, 2].map((k) => Math.round(h(a, k) + (h(b, k) - h(a, k)) * Math.max(0, Math.min(1, p)))).join(",")})`;
};

const camaraKeys = (): ClaveCamara[] => [
  [0, 580, 1000, 1.0],
  [T.final - 0.1, 580, 1000, 1.04],
  [T.final + 0.2, 580, 980, 0.95],
  [T.asustarte - 0.1, 580, 980, 0.98],
  [T.asustarte + 0.2, 1850, 1030, 1.0],
  [T.lucha - 0.1, 1850, 1030, 1.03],
  [T.lucha + 0.2, 1850, 820, 1.5],
  [T.glandulas - 0.1, 1850, 820, 1.53],
  [T.glandulas + 0.2, 1850, 1080, 1.9],
  [T.adrenalina - 0.1, 1850, 1080, 1.93],
  [T.adrenalina + 0.2, 1850, 1030, 1.0],
  [T.cierra - 0.1, 1850, 1030, 1.03],
  [T.cierra + 0.2, 3100, 1030, 1.0],
  [T.vasos - 0.1, 3100, 1030, 1.03],
  [T.vasos + 0.2, 3100, 1000, 1.4],
  [T.cara - 0.1, 3100, 1000, 1.43],
  [T.cara + 0.2, 580, 980, 1.0],
  [T.manos - 0.1, 580, 980, 1.03],
  [T.manos + 0.2, 850, 1360, 1.7],
  [T.menos - 0.1, 850, 1360, 1.73],
  [T.menos + 0.2, 600, 1000, 1.0],
  [T.palida - 0.1, 600, 1000, 1.03],
  [T.palida + 0.2, 640, 920, 1.5],
  [T.enfrian - 0.1, 640, 920, 1.53],
  [T.enfrian + 0.2, 850, 1360, 1.6],
  [T.donde - 0.1, 850, 1360, 1.63],
  [T.donde + 0.2, 1850, 1030, 1.0],
  [T.musculos - 0.1, 1850, 1030, 1.03],
  [T.musculos + 0.2, 1850, 1200, 1.35],
  [T.corazon - 0.1, 1850, 1200, 1.38],
  [T.corazon + 0.2, 1830, 930, 1.7],
  [T.cerebro - 0.1, 1830, 930, 1.73],
  [T.cerebro + 0.2, 1850, 760, 1.7],
  [T.correr - 0.1, 1850, 760, 1.73],
  [T.correr + 0.2, 1850, 1030, 1.0],
  [T.late - 0.1, 1850, 1030, 1.03],
  [T.late + 0.2, 4350, 1000, 1.0],
  [T.respiras - 0.1, 4350, 1000, 1.03],
  [T.respiras + 0.2, 4520, 1000, 1.3],
  [T.ventaja - 0.1, 4520, 1000, 1.33],
  [T.ventaja + 0.2, 850, 1360, 1.6],
  [T.sangras - 0.1, 850, 1360, 1.63],
  [T.sangras + 0.2, 850, 1300, 1.3],
  [T.poreso - 0.1, 850, 1300, 1.33],
  [T.poreso + 0.25, 580, 1000, 1.0],
  [T.fin + 0.3, 580, 1000, 1.04],
];

export const SustoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Cara y mano
  const bu = Math.max(ventana(-1, T.final - 0.2, 0.1, 0.3), ventana(T.fin - 0.5, T.fin + 2, 0.15, 0.3));
  const palidez = t < T.final ? interpolate(t, [0.1, 1.0], [0, 1], clamp) : t < T.poreso ? interpolate(t, [T.cara, T.palida + 0.5], [0, 1], clamp) : interpolate(t, [T.poreso, T.poreso + 0.6], [1, 0], clamp);
  const miedo = Math.max(bu, t > T.cara && t < T.poreso ? 0.6 : 0);
  const piel = mezcla(PIEL, PALIDA, palidez);
  const frio = Math.max(t < T.final ? palidez : 0, ventana(T.enfrian, T.donde + 0.2));
  const corte = ventana(T.hieren, T.poreso + 0.2);
  const manoColor = mezcla(palidez > 0.5 ? PALIDA : PIEL, "#B8D4F0", frio * 0.7);

  // Cuerpo
  const verCuerpo = Math.max(ventana(T.asustarte - 0.1, T.cierra + 0.2), ventana(T.donde - 0.1, T.late + 0.2));
  const cerebroAct = ventana(T.asustarte, T.glandulas);
  const glandula = ventana(T.glandulas, T.cierra + 0.2);
  const adre = interpolate(t, [T.adrenalina, T.cierra], [0, 1], clamp);
  const redirige = t > T.donde - 0.2 ? interpolate(t, [T.donde, T.musculos + 0.5], [0, 1], clamp) : 0;
  const nucleo = Math.max(ventana(T.musculos, T.late + 0.2), redirige);

  // Vaso de la piel
  const verVaso = ventana(T.cierra - 0.1, T.cara + 0.2);
  const cierre = interpolate(t, [T.vasos - 0.3, T.vasos + 0.8], [0, 1], clamp);
  const altoVaso = 110 * (1 - 0.65 * cierre);

  // Corazón y pulmones
  const verCorazon = ventana(T.late - 0.1, T.ventaja + 0.2);
  const ritmo = interpolate(t, [T.late, T.late + 1.0], [1.2, 2.2], clamp);
  const latido = Math.max(0, Math.sin(t * Math.PI * 2 * ritmo)) ** 3;
  const bpm = Math.round(interpolate(t, [T.late, T.late + 1.0], [70, 130], clamp));
  const aire = 0.5 + 0.5 * Math.sin(t * 2.4);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#1A1A2A" />

        {/* Cara que se asusta y palidece */}
        <Cara x={520} y={960} escala={3.6} miedo={miedo} piel={piel} />
        {/* Mano */}
        <g transform="translate(850 1380)" fill={manoColor}>
          <rect x={-70} y={-40} width={140} height={150} rx={44} fill={manoColor} />
          {[-48, -16, 16, 48].map((dx, k) => (
            <rect key={dx} x={dx - 14} y={-120 + (k === 0 || k === 3 ? 22 : 0)} width={28} height={110} rx={14} fill={manoColor} />
          ))}
          <rect x={-120} y={-10} width={70} height={30} rx={15} fill={manoColor} transform="rotate(-30 -70 0)" />
          {frio > 0
            ? [0, 1].map((k) => (
                <g key={k} transform={`translate(${-40 + k * 90} ${-60 + k * 70})`} stroke="#C8E8FF" strokeWidth={5} opacity={frio}>
                  <line x1={-22} y1={0} x2={22} y2={0} />
                  <line x1={-11} y1={-19} x2={11} y2={19} />
                  <line x1={11} y1={-19} x2={-11} y2={19} />
                </g>
              ))
            : null}
          {corte > 0 ? (
            <g opacity={corte}>
              <line x1={-30} y1={30} x2={30} y2={50} stroke="#9A2030" strokeWidth={6} strokeLinecap="round" />
              <ellipse cx={10} cy={70 + 20 * ((t * 0.6) % 1)} rx={8} ry={12} fill={SANGRE} />
            </g>
          ) : null}
        </g>
        {bu > 0 ? (
          <text x={830} y={760} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={130} fontWeight={700} opacity={bu} transform={`rotate(${-8 + Math.sin(t * 40) * 3} 830 760)`} stroke="#1A1A2A" strokeWidth={6} paintOrder="stroke">
            ¡BU!
          </text>
        ) : null}
        <Pildora x={580} y={640} texto="¿una ventaja?" color={C.white} o={ventana(T.final + 0.2, T.asustarte)} tam={44} />
        <Pildora x={850} y={1560} texto="manos frías" color={C.cyan} o={ventana(T.enfrian + 0.2, T.donde)} tam={44} />
        <Pildora x={850} y={1560} texto="sangras menos" color={C.yellow} o={ventana(T.sangras, T.poreso)} tam={44} />

        {/* Mapa del cuerpo */}
        <g opacity={verCuerpo}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <g fill="#3A3F55">
            <circle cx={1850} cy={760} r={78} />
            <rect x={1820} y={830} width={60} height={30} />
            <rect x={1740} y={850} width={220} height={300} rx={50} />
            <rect x={1680} y={860} width={60} height={290} rx={30} transform="rotate(10 1710 860)" />
            <rect x={1960} y={860} width={60} height={290} rx={30} transform="rotate(-10 1990 860)" />
            <rect x={1760} y={1140} width={80} height={300} rx={38} />
            <rect x={1860} y={1140} width={80} height={300} rx={38} />
          </g>
          {/* Vasos de la piel hacia manos, cara y pies */}
          {(
            [
              [1850, 900, 1650, 1150],
              [1850, 900, 2050, 1150],
              [1850, 900, 1850, 700],
              [1850, 1100, 1790, 1430],
              [1850, 1100, 1910, 1430],
            ] as const
          ).map(([x1, y1, x2, y2], k) => (
            <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SANGRE} strokeWidth={8 * (1 - 0.7 * Math.max(adre, redirige))} opacity={0.8} />
          ))}
          <circle cx={1850} cy={750} r={50} fill="#F088A8" opacity={0.4 + 0.6 * Math.max(cerebroAct, nucleo * ventana(T.cerebro, T.late))} />
          <path d="M 1830 900 c -30 -30 -60 0 -30 30 l 30 30 l 30 -30 c 30 -30 0 -60 -30 -30 Z" fill={SANGRE} opacity={0.6 + 0.4 * nucleo} />
          {[1800, 1900].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={1070} rx={22} ry={34} fill="#A84A5A" />
              <ellipse cx={x} cy={1032} rx={20} ry={12} fill={ADRE} opacity={0.4 + 0.6 * glandula} />
            </g>
          ))}
          {adre > 0
            ? GOTAS.map((g, i) => (
                <circle key={i} cx={1850 + Math.cos(g.a) * g.r * 330 * adre} cy={1040 + Math.sin(g.a) * g.r * 380 * adre} r={9} fill={ADRE} opacity={(1 - adre * 0.6) * ventana(T.adrenalina, T.cierra + 0.3)} />
              ))
            : null}
          {nucleo > 0
            ? [
                [1720, 1000],
                [1980, 1000],
                [1800, 1300],
                [1900, 1300],
              ].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx={34} ry={70} fill={SANGRE} opacity={0.35 * nucleo} />)
            : null}
        </g>
        <Pildora x={1850} y={660} texto="lucha o huida" color={C.orange} o={ventana(T.lucha, T.glandulas)} tam={44} />
        <Pildora x={1850} y={1400} texto="¡a correr!" color={C.yellow} o={ventana(T.correr, T.late)} tam={46} />

        {/* Vaso de la piel que se cierra */}
        <g opacity={verVaso}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2660} y={760} width={880} height={110} fill={mezcla("#E89A8A", PALIDA, cierre)} />
          <text x={3100} y={830} textAnchor="middle" fill="#5A3A30" fontFamily={mono} fontSize={36} fontWeight={700}>
            piel
          </text>
          <rect x={2680} y={1030 - altoVaso / 2 - 14} width={840} height={altoVaso + 28} rx={20} fill="#C86A7A" />
          <rect x={2680} y={1030 - altoVaso / 2} width={840} height={altoVaso} rx={14} fill="#5A1A2A" />
          {new Array(8).fill(0).map((_, k) => (
            <rect key={k} x={2730 + k * 100} y={1030 - altoVaso / 2 - 22} width={30} height={altoVaso + 44} rx={8} fill={ADRE} opacity={0.6 * cierre} />
          ))}
          {new Array(8).fill(0).map((_, k) => {
            if (cierre > 0.5 && k % 2 === 1) {
              return null;
            }
            const x = 2700 + (((t * 160 * (1 - 0.6 * cierre)) + k * 105) % 820);
            return <ellipse key={k} cx={x} cy={1030} rx={34} ry={Math.min(26, altoVaso / 2 - 4)} fill={SANGRE} />;
          })}
        </g>

        {/* Corazón y pulmones */}
        <g opacity={verCorazon}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <g transform={`translate(4170 980) scale(${1 + 0.12 * latido})`}>
            <path d="M 0 -40 c -60 -80 -170 -20 -120 70 l 120 110 l 120 -110 c 50 -90 -60 -150 -120 -70 Z" fill={SANGRE} />
          </g>
          <path d={`M 3900 1300 ${new Array(24).fill(0).map((_, i) => `L ${3900 + i * 40} ${1300 - (Math.abs(((i * 40 + t * 300 * ritmo) % 240) - 120) < 12 ? 90 : 0)}`).join(" ")}`} fill="none" stroke="#48C878" strokeWidth={6} />
          {[-1, 1].map((l) => (
            <ellipse key={l} cx={4560 + l * 80} cy={1000} rx={70 + 16 * aire * ventana(T.respiras, T.ventaja + 0.2)} ry={150 + 20 * aire * ventana(T.respiras, T.ventaja + 0.2)} fill="#F088A8" opacity={0.75} />
          ))}
          <line x1={4560} y1={760} x2={4560} y2={880} stroke="#F088A8" strokeWidth={22} />
        </g>
        <Pildora x={4170} y={720} texto={`${bpm} latidos/min`} color={SANGRE} o={ventana(T.late, T.ventaja)} tam={42} />
      </g>

      {[T.adrenalina, T.cierra, T.donde, T.late].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.35 * Math.max(destello(0), destello(T.fin - 0.5))} />
      <Tag x={sx(1800)} y={sy(1032)} dx={-150} dy={-200} texto="glándulas" color={ADRE} o={ventana(T.glandulas + 0.2, T.adrenalina)} />
      <Tag x={sx(1850)} y={sy(1040)} dx={200} dy={-230} texto="adrenalina" color={ADRE} o={ventana(T.adrenalina + 0.3, T.cierra)} />
      <Tag x={sx(3100)} y={sy(1030)} dx={-120} dy={230} texto="vaso que se cierra" color="#E8A0A8" o={ventana(T.vasos + 0.3, T.cara)} />
    </svg>
  );
};
