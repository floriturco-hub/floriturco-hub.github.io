import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { Persona } from "../orinar/Persona";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: el polígrafo con sus agujas (gancho y final); una persona con los sensores (pecho, brazo, dedos);
// la gráfica de las tres señales con preguntas neutra, de control y clave; inocente contra mentiroso entrenado.
// Retención (estilo §10): un cambio de plano cada 2-3 s y nada importante en la franja de subtítulos (arriba).
const ROJO = C.red;
const VERDE = "#48C878";
const AZUL = "#5AB8F8";
const PX = 1850;
const SUELO = 1480;

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1080, 1.05],
  [1.2, 550, 1080, 1.12],
  [T.final, 550, 1120, 1.6],
  [T.poligrafo - 0.2, 550, 1120, 1.65],
  [T.poligrafo + 0.4, PX, 1080, 1.05],
  [T.bandas - 0.2, PX, 1080, 1.08],
  [T.bandas + 0.3, PX - 10, 940, 2.2],
  [T.brazalete - 0.2, PX - 10, 940, 2.25],
  [T.brazalete + 0.3, PX + 10, 990, 2.4],
  [T.sensores - 0.2, PX + 10, 990, 2.45],
  [T.sensores + 0.3, PX + 30, 1100, 2.5],
  [T.nervioso - 0.2, PX + 30, 1100, 2.55],
  [T.nervioso + 0.4, 3100, 1030, 1.0],
  [T.clave - 0.1, 3100, 1030, 1.02],
  [T.reacciona, 3330, 1000, 1.6],
  [T.nervios - 0.3, 3330, 1000, 1.65],
  [T.nervios + 0.4, 4300, 1030, 1.0],
  [T.inocente, 4300, 1030, 1.02],
  [T.inocente + 0.4, 4060, 1030, 1.5],
  [T.mentiroso - 0.2, 4060, 1030, 1.52],
  [T.mentiroso + 0.4, 4540, 1030, 1.5],
  [T.porEso - 0.3, 4540, 1030, 1.55],
  [T.porEso + 0.3, 550, 1080, 1.05],
  [T.fin + 2, 550, 1080, 1.12],
];

// Trazo de una señal: picos en los segundos dados, dibujado hasta `hasta` (0..1)
const senal = (x0: number, ancho: number, y: number, picos: [number, number][], ruido: number, t: number, hasta = 1, fase = 0) =>
  new Array(Math.max(2, Math.round(120 * hasta)))
    .fill(0)
    .map((_, i, arr) => {
      const u = (i / (arr.length - 1)) * hasta;
      const pico = picos.reduce((a, [c, h]) => a + h * Math.exp(-(((u - c) / 0.03) ** 2)), 0);
      const v = Math.sin(u * 60 + fase + t * 0) * ruido + pico;
      return `${i === 0 ? "M" : "L"} ${x0 + u * ancho} ${y - v}`;
    })
    .join(" ");

export const DetectorMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Polígrafo: agujas nerviosas en el gancho y el final
  const nervios = t < T.final || t > T.porEso ? 1 : 0.35;
  const tacha = ventana(1.2, T.final + 0.2, 0.15, 0.3);
  const mentira = ventana(0.1, 1.2, 0.1, 0.1) * (Math.sin(t * 18) > 0 ? 1 : 0.4);
  const abierto = ventana(T.final, T.poligrafo);

  // Sensores sobre la persona
  const sensores = interpolate(t, [T.poligrafo, T.poligrafo + 0.5], [0, 1], clamp);
  const bandas = ventana(T.bandas, T.brazalete);
  const brazalete = ventana(T.brazalete, T.sensores);
  const dedos = ventana(T.sensores, T.nervioso);

  // Gráfica de tres señales
  const grafica = ventana(T.nervioso - 0.3, T.nervios + 0.3, 0.4, 0.4);
  const avance = interpolate(t, [T.nervioso, T.reacciona], [0.18, 1], clamp);
  const picosTodo: [number, number][] = [
    [0.12, t > T.nervioso ? 50 : 0],
    [0.4, t > T.neutras ? 8 : 0],
    [0.62, t > T.control ? 30 : 0],
    [0.85, t > T.clave ? 80 : 0],
  ];
  const lupa = ventana(T.sospecha - 0.4, T.nervios);

  // Inocente contra mentiroso
  const casos = ventana(T.nervios - 0.3, T.porEso + 0.3, 0.4, 0.4);
  const inocente = interpolate(t, [T.inocente, T.fallar + 0.3], [0, 1], clamp);
  const mentiroso = interpolate(t, [T.mentiroso, T.igual], [0, 1], clamp);
  const tenso = t > T.tenso ? 1 : 0;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#1A1626" />
        {/* Polígrafo sobre la mesa */}
        <rect x={-300} y={1300} width={1400} height={60} fill="#5A4A3A" />
        <rect x={180} y={980} width={740} height={320} rx={24} fill="#3A3442" />
        <rect x={220} y={1020} width={560} height={240} fill="#F4F0E4" />
        {[0, 1, 2, 3].map((k) => (
          <line key={`r${k}`} x1={220} y1={1060 + k * 60} x2={780} y2={1060 + k * 60} stroke="#E0D8C8" strokeWidth={2} />
        ))}
        {[0, 1, 2, 3].map((k) => {
          const y = 1060 + k * 60;
          const d = new Array(60)
            .fill(0)
            .map((_, i) => {
              const x = 220 + i * 9.4;
              const v = Math.sin(i * 0.9 + t * 9 + k) * (6 + 22 * nervios) * (0.5 + 0.5 * Math.sin(i * 0.31 + k));
              return `${i === 0 ? "M" : "L"} ${x} ${y + v}`;
            })
            .join(" ");
          const punta = y + Math.sin(56 * 0.9 + t * 9 + k) * (6 + 22 * nervios);
          return (
            <g key={k}>
            <path d={d} fill="none" stroke={[ROJO, AZUL, "#1A1A20", VERDE][k]} strokeWidth={4} />
              <line x1={900} y1={y - 20} x2={780} y2={punta} stroke="#8A8A9A" strokeWidth={6} />
            </g>
          );
        })}
        <Pildora x={550} y={880} texto="¿MENTIRA?" color={ROJO} o={mentira} tam={60} />
        {tacha > 0 ? (
          <g opacity={tacha}>
            <path d="M 260 900 L 840 1300 M 840 900 L 260 1300" stroke={ROJO} strokeWidth={30} strokeLinecap="round" />
          </g>
        ) : null}
        <Pildora x={500} y={1180} texto="…al final" color={C.yellow} o={abierto} tam={40} />

        {/* Persona con los sensores */}
        <Persona x={PX} suelo={SUELO} t={t} respira={1} />
        <g opacity={sensores} transform={`translate(${PX} ${SUELO})`}>
          {[-570, -520].map((y) => (
            <rect key={y} x={-62} y={y} width={118} height={14} rx={7} fill={AZUL} opacity={0.6 + 0.4 * bandas} />
          ))}
          <rect x={-22} y={-560} width={44} height={60} rx={10} fill={ROJO} opacity={0.7 + 0.3 * brazalete} />
          <circle cx={22} cy={-322} r={8} fill={VERDE} opacity={0.7 + 0.3 * dedos} />
          <circle cx={14} cy={-312} r={8} fill={VERDE} opacity={0.7 + 0.3 * dedos} />
          <path d="M 0 -540 C -120 -480, -160 -300, -260 -200" fill="none" stroke="#8A8A9A" strokeWidth={4} />
        </g>
        {/* Señales en pequeño junto a cada sensor */}
        {bandas > 0 ? <path d={`M ${PX + 70} 930 ${new Array(30).fill(0).map((_, i) => `L ${PX + 70 + i * 6} ${930 + Math.sin(i * 0.4 - t * 3) * 18}`).join(" ")}`} fill="none" stroke={AZUL} strokeWidth={4} opacity={bandas} /> : null}
        {brazalete > 0 ? <path d={`M ${PX + 70} 980 ${new Array(30).fill(0).map((_, i) => `L ${PX + 70 + i * 6} ${980 - (((i + Math.floor(t * 12)) % 10) === 0 ? 30 : 0)}`).join(" ")}`} fill="none" stroke={ROJO} strokeWidth={4} opacity={brazalete} /> : null}
        {dedos > 0
          ? [0, 1, 2].map((k) => {
              const p = (t * 1.2 + k / 3) % 1;
              return <ellipse key={k} cx={PX + 40 + k * 12} cy={SUELO - 320 + p * 50} rx={5} ry={8} fill={AZUL} opacity={dedos * (1 - p)} />;
            })
          : null}

        {/* Gráfica: neutra, control y clave */}
        <g opacity={grafica}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {[
            ["respiración", AZUL, 820],
            ["pulso", ROJO, 1040],
            ["sudor", VERDE, 1260],
          ].map(([nombre, color, y], k) => (
            <g key={nombre as string}>
              <text x={2640} y={(y as number) - 90} fill={color as string} fontFamily={mono} fontSize={28} fontWeight={700}>
                {nombre}
              </text>
              <path d={senal(2640, 920, y as number, picosTodo.map(([c, h]) => [c, h * (k === 2 ? 1.2 : 1)]), 6, t, avance, k)} fill="none" stroke={color as string} strokeWidth={5} />
            </g>
          ))}
          {[
            ["neutra", 0.4, T.neutras, C.grey],
            ["control", 0.62, T.control, C.yellow],
            ["clave", 0.85, T.clave, ROJO],
          ].map(([nombre, u, desde, color]) =>
            t > (desde as number) ? (
              <g key={nombre as string}>
                <line x1={2640 + (u as number) * 920} y1={680} x2={2640 + (u as number) * 920} y2={1420} stroke={color as string} strokeWidth={3} strokeDasharray="10 8" />
                <text x={2640 + (u as number) * 920} y={1440} textAnchor="middle" fill={color as string} fontFamily={mono} fontSize={28} fontWeight={700}>
                  {nombre}
                </text>
              </g>
            ) : null,
          )}
          {lupa > 0 ? <circle cx={2640 + 0.85 * 920} cy={1000} r={150} fill="none" stroke={ROJO} strokeWidth={8} opacity={lupa} /> : null}
        </g>
        <Pildora x={3420} y={700} texto="¡sospecha!" color={ROJO} o={ventana(T.sospecha - 0.3, T.nervios)} tam={40} />

        {/* Inocente asustado contra mentiroso entrenado */}
        <g opacity={casos}>
          <Panel x0={3800} y0={600} x1={4800} y1={1460} />
          <line x1={4300} y1={640} x2={4300} y2={1420} stroke="#3A3360" strokeWidth={4} />
          <text x={4060} y={700} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
            inocente
          </text>
          <text x={4540} y={700} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
            mentiroso
          </text>
          {[0.3, 0.6].map((u, k) => (
            <g key={k}>
              <line x1={3840 + u * 420} y1={760} x2={3840 + u * 420} y2={1200} stroke={k === 0 ? C.yellow : ROJO} strokeWidth={2} strokeDasharray="8 6" />
              <line x1={4320 + u * 420} y1={760} x2={4320 + u * 420} y2={1200} stroke={k === 0 ? C.yellow : ROJO} strokeWidth={2} strokeDasharray="8 6" />
            </g>
          ))}
          <path d={senal(3840, 420, 1050, [[0.3, 50], [0.6, 160]], 18, t, Math.max(0.05, inocente), 1)} fill="none" stroke={ROJO} strokeWidth={6} />
          <path d={senal(4320, 420, 1050, [[0.3, tenso ? 150 : 10], [0.6, 150]], 4, t, Math.max(0.05, mentiroso), 2)} fill="none" stroke={VERDE} strokeWidth={6} />
          <text x={4060} y={1320} textAnchor="middle" fill={ROJO} fontFamily={mono} fontSize={40} fontWeight={700} opacity={interpolate(t, [T.fallar - 0.2, T.fallar + 0.2], [0, 1], clamp)}>
            ✗ falla
          </text>
          <text x={4540} y={1320} textAnchor="middle" fill={VERDE} fontFamily={mono} fontSize={40} fontWeight={700} opacity={interpolate(t, [T.igual - 0.2, T.igual + 0.2], [0, 1], clamp)}>
            ✓ pasa
          </text>
        </g>
      </g>

      {[T.poligrafo + 0.4, T.bandas + 0.3, T.brazalete + 0.3, T.sensores + 0.3, T.nervioso + 0.4, T.clave, T.nervios + 0.4, T.porEso + 0.3].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.18 * destello(d)} />
      ))}
      <Tag x={sx(PX)} y={sy(SUELO - 545)} dx={-200} dy={140} texto="respiración" color={AZUL} o={bandas} />
      <Tag x={sx(PX)} y={sy(SUELO - 530)} dx={-200} dy={150} texto="pulso y presión" color={ROJO} o={brazalete} />
      <Tag x={sx(PX + 18)} y={sy(SUELO - 317)} dx={-200} dy={160} texto="sudor" color={VERDE} o={dedos} />
      <Tag x={sx(4540)} y={sy(1050 - 150)} dx={0} dy={-160} texto="tenso a propósito" color={C.yellow} o={ventana(T.tenso, T.porEso)} />
    </svg>
  );
};
