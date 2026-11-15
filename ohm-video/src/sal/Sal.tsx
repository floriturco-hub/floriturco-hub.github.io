import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, papas fritas con un salero; luego el sodio que estalla en agua, el cloro venenoso, los átomos
// que se pasan un electrón y la red de iones que forma el cristal de sal.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const PAPA = "#F8C848";
const NA = "#B8C0D8";
const CL = "#9AE87A";
const IONNA = "#A88AF8";
const SAL = new Array(18).fill(0).map((_, i) => ({ x: 420 + random(`sx${i}`) * 260, f: random(`sf${i}`) }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1080, 1.15],
  [T.final - 0.1, 550, 1080, 1.2],
  [T.final + 0.2, 550, 1050, 1.0],
  [T.sodio - 0.1, 550, 1050, 1.03],
  [T.sodio + 0.2, 1850, 1030, 1.0],
  [T.agua - 0.1, 1850, 1030, 1.03],
  [T.agua + 0.2, 1850, 1100, 1.25],
  [T.explotar - 0.1, 1850, 1100, 1.28],
  [T.explotar + 0.2, 1850, 1080, 1.0],
  [T.cloro - 0.1, 1850, 1080, 1.03],
  [T.cloro + 0.2, 3100, 1030, 1.0],
  [T.toxico - 0.1, 3100, 1030, 1.03],
  [T.toxico + 0.2, 3100, 1000, 1.3],
  [T.arma - 0.1, 3100, 1000, 1.33],
  [T.arma + 0.2, 3100, 1030, 1.05],
  [T.pero - 0.1, 3100, 1030, 1.08],
  [T.pero + 0.2, 4350, 1030, 1.0],
  [T.sobra - 0.1, 4350, 1030, 1.03],
  [T.sobra + 0.2, 4130, 1030, 1.5],
  [T.falta - 0.1, 4130, 1030, 1.53],
  [T.falta + 0.2, 4580, 1030, 1.5],
  [T.juntan - 0.1, 4580, 1030, 1.53],
  [T.juntan + 0.2, 4350, 1030, 1.0],
  [T.llama - 0.1, 4350, 1030, 1.03],
  [T.llama + 0.2, 4350, 1030, 1.2],
  [T.iones - 0.1, 4350, 1030, 1.23],
  [T.iones + 0.2, 4350, 1030, 1.0],
  [T.cristales - 0.1, 4350, 1030, 1.03],
  [T.cristales + 0.2, 4350, 1030, 1.15],
  [T.sal - 0.1, 4350, 1030, 1.18],
  [T.sal + 0.2, 550, 920, 1.5],
  [T.ya - 0.1, 550, 920, 1.53],
  [T.ya + 0.2, 4350, 1030, 1.05],
  [T.asi - 0.1, 4350, 1030, 1.08],
  [T.asi + 0.25, 550, 1080, 1.15],
  [T.fin + 0.3, 550, 1080, 1.2],
];

// Átomo de Bohr simplificado: núcleo, capa interna tenue y capa externa con n electrones (huecos hasta 8)
const Atomo: React.FC<{ x: number; y: number; r: number; color: string; n: number; giro: number; carga?: string; o?: number }> = ({ x, y, r, color, n, giro, carga, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <circle r={r * 0.32} fill={color} />
    <circle r={r * 0.62} fill="none" stroke={color} strokeWidth={3} opacity={0.35} />
    <circle r={r} fill="none" stroke={color} strokeWidth={4} opacity={0.7} />
    {new Array(n).fill(0).map((_, k) => {
      const a = giro + (k / 8) * Math.PI * 2;
      return <circle key={k} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={13} fill="#FFFFFF" />;
    })}
    {carga ? (
      <text y={16} textAnchor="middle" fill="#1A1A2A" fontFamily={mono} fontSize={48} fontWeight={700}>
        {carga}
      </text>
    ) : null}
  </g>
);

export const SalMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Papas y salero
  const sacude = t < T.final || t > T.asi ? Math.sin(t * 14) * 14 : 0;
  const lupa = ventana(T.sal, T.ya + 0.2);

  // Sodio en agua
  const verSodio = ventana(T.sodio - 0.1, T.cloro + 0.2);
  const cae = interpolate(t, [T.agua, T.agua + 0.9], [0, 1], clamp);
  const boom = interpolate(t, [T.explotar - 0.3, T.explotar, T.explotar + 1.4], [0, 1, 0.4], clamp);

  // Cloro
  const verCloro = ventana(T.cloro - 0.1, T.pero + 0.2);

  // Átomos e iones
  const verAtomos = ventana(T.pero - 0.1, T.asi + 0.2);
  const viaje = interpolate(t, [T.entrega, T.entrega + 0.9], [0, 1], clamp);
  const ion = interpolate(t, [T.iones - 0.2, T.iones + 0.4], [0, 1], clamp);
  const acerca = interpolate(t, [T.atraen, T.atraen + 0.8], [0, 1], clamp);
  const red = interpolate(t, [T.cristales, T.cristales + 0.9], [0, 1], clamp);
  const giro = t * 0.8;
  const xNa = 4130 + 90 * acerca;
  const xCl = 4580 - 110 * acerca;
  const e0: [number, number] = [4130 + 130 * Math.cos(giro), 1030 + 130 * Math.sin(giro)];
  const e1: [number, number] = [4580 + 150 * Math.cos(giro + Math.PI), 1030 + 150 * Math.sin(giro + Math.PI)];

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#1A1A26" />

        {/* Papas fritas y salero */}
        <path d="M 260 1300 L 840 1300 L 780 1500 L 320 1500 Z" fill="#C83A3A" />
        <path d="M 260 1300 L 840 1300 L 820 1340 L 280 1340 Z" fill="#F8F0E0" />
        {new Array(12).fill(0).map((_, k) => (
          <rect key={k} x={290 + k * 45} y={1110 + (k % 3) * 30} width={30} height={220} rx={8} fill={PAPA} stroke="#C89A2A" strokeWidth={3} transform={`rotate(${(k - 6) * 3} ${305 + k * 45} 1300)`} />
        ))}
        <g transform={`translate(${560 + sacude} 760) rotate(${150 + sacude * 0.6})`}>
          <rect x={-60} y={-120} width={120} height={200} rx={30} fill="#E8E6F0" />
          <rect x={-60} y={-160} width={120} height={60} rx={20} fill="#8A90A0" />
          {[-24, 0, 24].map((d) => (
            <circle key={d} cx={d} cy={-140} r={6} fill="#3A3F4C" />
          ))}
        </g>
        {SAL.map((s, i) => {
          const q = (t * 1.4 + s.f) % 1;
          return <rect key={i} x={s.x} y={900 + q * 340} width={9} height={9} fill="#FFFFFF" opacity={1 - q * 0.3} />;
        })}
        {lupa > 0 ? (
          <g opacity={lupa}>
            <circle cx={550} cy={880} r={170} fill="#1A1A26" stroke="#C8CED8" strokeWidth={14} />
            <g transform="translate(550 880) rotate(20)">
              <path d="M -70 -40 L 0 -80 L 70 -40 L 70 50 L 0 90 L -70 50 Z" fill="#E8F0F8" />
              <path d="M -70 -40 L 0 0 L 70 -40 M 0 0 L 0 90" fill="none" stroke="#A8B8C8" strokeWidth={5} />
            </g>
          </g>
        ) : null}
        <Pildora x={550} y={1580} texto="¿peligroso?" color={C.white} o={ventana(T.final + 0.2, T.sodio)} tam={46} />
        <Pildora x={550} y={1100} texto="NaCl" color={C.yellow} o={ventana(T.cloruro, T.ya + 0.2)} tam={60} />

        {/* Sodio que estalla en agua */}
        <g opacity={verSodio}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={1560} y={1080} width={580} height={340} rx={20} fill="#2A3040" stroke="#C8E0F8" strokeWidth={6} />
          <rect x={1566} y={1140} width={568} height={274} rx={14} fill="#3A8AD8" opacity={0.7} />
          <rect x={1810} y={720 + 420 * cae} width={80} height={60} rx={8} fill={NA} opacity={boom > 0.6 ? 0 : 1} />
          {boom > 0 ? (
            <g opacity={boom}>
              <circle cx={1850} cy={1140} r={80 + 220 * boom} fill={C.orange} opacity={0.6} />
              <circle cx={1850} cy={1140} r={40 + 120 * boom} fill={C.yellow} opacity={0.8} />
              {new Array(10).fill(0).map((_, k) => {
                const a = -Math.PI * (k / 9);
                return <circle key={k} cx={1850 + Math.cos(a) * 300 * boom} cy={1140 + Math.sin(a) * 300 * boom} r={14} fill="#C8E0F8" />;
              })}
            </g>
          ) : null}
          <text x={1850} y={690} textAnchor="middle" fill={NA} fontFamily={mono} fontSize={40} fontWeight={700} opacity={1 - cae}>
            sodio (Na)
          </text>
        </g>
        <Pildora x={1850} y={1390} texto="¡explota!" color={C.orange} o={ventana(T.explotar, T.cloro)} tam={52} />

        {/* Cloro venenoso */}
        <g opacity={verCloro}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <path d="M 3020 760 L 3180 760 L 3180 940 L 3360 1330 Q 3370 1380 3320 1380 L 2880 1380 Q 2830 1380 2840 1330 L 3020 940 Z" fill="#2A3040" stroke="#C8E0F8" strokeWidth={6} />
          <path d="M 2990 1000 L 3210 1000 L 3350 1320 Q 3355 1360 3310 1360 L 2890 1360 Q 2845 1360 2850 1320 Z" fill={CL} opacity={0.55 + 0.1 * Math.sin(t * 3)} />
          {[0, 1, 2].map((k) => {
            const q = (t * 0.4 + k / 3) % 1;
            return <circle key={k} cx={3100 + Math.sin(t + k) * 40} cy={740 - q * 120} r={40 + q * 40} fill={CL} opacity={0.4 * (1 - q)} />;
          })}
          <g transform="translate(3100 1180)" opacity={ventana(T.toxico, T.pero + 0.2)}>
            <path d="M 0 -110 L 110 80 L -110 80 Z" fill={C.yellow} stroke="#1A1A1A" strokeWidth={8} />
            <text y={50} textAnchor="middle" fill="#1A1A1A" fontFamily={mono} fontSize={110} fontWeight={700}>
              !
            </text>
          </g>
          <text x={3100} y={690} textAnchor="middle" fill={CL} fontFamily={mono} fontSize={40} fontWeight={700}>
            cloro (Cl)
          </text>
        </g>
        <Pildora x={3100} y={1430} texto="arma en 1915" color={C.red} o={ventana(T.arma, T.pero)} tam={44} />

        {/* Átomos, electrón e iones */}
        <g opacity={verAtomos}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          {red < 1 ? (
            <g opacity={1 - red}>
              <Atomo x={xNa} y={1030} r={130 * (1 - 0.3 * ion)} color={ion > 0.5 ? IONNA : NA} n={0} giro={giro} carga={ion > 0.5 ? "+" : undefined} />
              <Atomo x={xCl} y={1030} r={150 * (1 + 0.1 * ion)} color={CL} n={7} giro={giro + Math.PI + Math.PI / 8} carga={ion > 0.5 ? "−" : undefined} />
              {viaje < 1 ? (
                <circle cx={e0[0] + (e1[0] - e0[0]) * viaje} cy={e0[1] + (e1[1] - e0[1]) * viaje - 120 * Math.sin(viaje * Math.PI)} r={15} fill={C.yellow} />
              ) : (
                <circle cx={xCl + 165 * Math.cos(giro + Math.PI)} cy={1030 + 165 * Math.sin(giro + Math.PI)} r={13} fill={C.yellow} />
              )}
              <text x={4130} y={850} textAnchor="middle" fill={NA} fontFamily={mono} fontSize={40} fontWeight={700} opacity={1 - acerca}>
                Na
              </text>
              <text x={4580} y={830} textAnchor="middle" fill={CL} fontFamily={mono} fontSize={40} fontWeight={700} opacity={1 - acerca}>
                Cl
              </text>
            </g>
          ) : null}
          {destello(T.llama) > 0 ? <circle cx={4350} cy={1030} r={260} fill={C.yellow} opacity={0.5 * destello(T.llama)} /> : null}
          {red > 0
            ? new Array(5).fill(0).map((_, j) =>
                new Array(6).fill(0).map((__, k) => {
                  const na = (j + k) % 2 === 0;
                  return <circle key={`${j}-${k}`} cx={4100 + k * 100 - (1 - red) * (k - 2.5) * 30} cy={830 + j * 100 - (1 - red) * (j - 2) * 30} r={na ? 30 : 44} fill={na ? IONNA : CL} opacity={red} />;
                }),
              )
            : null}
        </g>
        <Pildora x={4130} y={1300} texto="le sobra 1" color={NA} o={ventana(T.sobra, T.falta)} tam={44} />
        <Pildora x={4580} y={1300} texto="le falta 1" color={CL} o={ventana(T.falta, T.juntan)} tam={44} />
        <Pildora x={4350} y={1400} texto="estables" color={C.cyan} o={ventana(T.ninguno, T.asi + 0.2)} tam={48} />
      </g>

      {[T.sodio, T.explotar, T.cloro, T.cristales].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(e0[0])} y={sy(e0[1])} dx={-100} dy={-200} texto="electrón" color={C.yellow} o={ventana(T.sobra + 0.2, T.falta)} />
      <Tag x={sx(4350 - 20)} y={sy(1030)} dx={-120} dy={250} texto="se atraen" color={C.white} o={ventana(T.atraen + 0.2, T.cristales)} />
    </svg>
  );
};
