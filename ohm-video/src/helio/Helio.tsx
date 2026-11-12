import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una cabeza en corte (cuerdas vocales, garganta y boca) con las ondas que salen; en el centro,
// la garganta como tubo de resonancia por el que viaja el sonido (aire, helio o gas pesado); a la derecha, el espectro:
// los armónicos de las cuerdas no se mueven, la envolvente de la caja se estira o se encoge.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho («Y aun así…» → «¡Tu voz no cambia de tono!»).
const PIEL = "#C98A64";
const TRACTO = "#5A2030";
const AIRE = C.yellow;
const HELIO = C.cyan;
const PESADO = C.orange;
const TUBO = { x0: 1460, x1: 2240, y0: 950, y1: 1110 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 600, 1000, 1.0],
  [T.final - 0.1, 600, 1000, 1.04],
  [T.final + 0.2, 680, 1040, 0.9],
  [T.hablar - 0.1, 680, 1040, 0.93],
  [T.hablar + 0.2, 520, 1240, 2.0],
  [T.zumbido - 0.1, 520, 1240, 2.05],
  [T.zumbido + 0.2, 560, 1060, 1.15],
  [T.caja - 0.1, 560, 1060, 1.18],
  [T.caja + 0.2, 1850, 1030, 1.0],
  [11.5, 1850, 1030, 1.05],
  [11.8, 1850, 1030, 1.3],
  [T.notas - 0.1, 1850, 1030, 1.33],
  [T.notas + 0.2, 1850, 1060, 1.0],
  [T.helio - 0.1, 1850, 1060, 1.03],
  [T.helio + 0.2, 1850, 1030, 1.25],
  [T.asi - 0.1, 1850, 1030, 1.28],
  [T.asi + 0.2, 3100, 1030, 1.0],
  [T.agudas - 0.1, 3100, 1030, 1.03],
  [T.agudas + 0.2, 3250, 1000, 1.3],
  [T.cuerdas - 0.1, 3250, 1000, 1.33],
  [T.cuerdas + 0.2, 3000, 1150, 1.5],
  [T.ardilla - 0.1, 3000, 1150, 1.53],
  [T.ardilla + 0.2, 650, 1000, 1.05],
  [T.hexa - 0.1, 650, 1000, 1.08],
  [T.hexa + 0.2, 1850, 1060, 1.0],
  [T.lento - 0.1, 1850, 1060, 1.03],
  [T.lento + 0.2, 3100, 1030, 1.0],
  [T.gigante - 0.1, 3100, 1030, 1.03],
  [T.gigante + 0.2, 650, 1000, 1.05],
  [T.ojo - 0.1, 650, 1000, 1.08],
  [T.ojo + 0.2, 600, 1000, 1.3],
  [T.aun - 0.1, 600, 1000, 1.33],
  [T.aun + 0.2, 600, 1000, 1.0],
  [T.fin + 0.3, 600, 1000, 1.04],
];

export const HelioMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Gas en la garganta: 0 aire, 1 helio, -1 gas pesado
  const helio = Math.max(t < T.final ? 1 : 0, ventana(T.helio, T.hexa, 0.4, 0.3), interpolate(t, [T.aun, T.aun + 0.3], [0, 1], clamp));
  const pesado = ventana(T.hexa, T.ojo, 0.4, 0.3);
  const estira = 1 + 1.4 * helio - 0.55 * pesado;
  const colorGas = helio > 0.5 ? HELIO : pesado > 0.5 ? PESADO : AIRE;
  const vel = helio > 0.5 ? "helio: ≈ 1000 m/s" : pesado > 0.5 ? "gas pesado: ≈ 130 m/s" : "aire: 343 m/s";

  // Cabeza: cuerdas que vibran igual siempre, ondas cuyo espaciado depende del gas
  const vibra = Math.sin(t * 40) * 6;
  const ondas = t < T.hablar || (t > T.ardilla && t < T.hexa) || (t > T.gigante && t < T.ojo) || t > T.aun;
  const paso = 80 / estira;
  const alerta = ventana(T.ojo, T.aun);
  const globo = Math.max(t < T.final ? 1 : 0, ventana(T.ardilla - 0.1, T.hexa), interpolate(t, [T.aun, T.aun + 0.3], [0, 1], clamp));
  const tanque = Math.max(ventana(T.final, T.hablar), ventana(T.gigante - 0.1, T.ojo));
  const pulsoSube = ventana(T.zumbido, T.caja + 0.2);

  // Tubo de resonancia
  const verTubo = Math.max(ventana(T.caja - 0.1, T.asi + 0.2), ventana(T.hexa - 0.1, T.lento + 0.2));
  const L = TUBO.x1 - TUBO.x0;
  const recorrido = (t * 520 * estira) % (2 * L);
  const pulsoX = TUBO.x0 + (recorrido < L ? recorrido : 2 * L - recorrido);

  // Espectro
  const verEsp = Math.max(ventana(T.asi - 0.1, T.ardilla + 0.2), ventana(T.lento - 0.1, T.gigante + 0.2));
  const estEsp = t < T.ardilla ? interpolate(t, [T.asi + 0.4, T.agudas], [1, estira], clamp) : interpolate(t, [T.lento + 0.4, T.lento + 1.4], [1, estira], clamp);
  const envolvente = (x: number) => {
    const u = (x - 2700) / (180 * estEsp);
    return 60 + 260 * Math.exp(-(((u - 1.6) / 0.6) ** 2)) + 200 * Math.exp(-(((u - 3.2) / 0.7) ** 2));
  };
  const curva = new Array(60).fill(0).map((_, i) => {
    const x = 2700 + i * 13.5;
    return `${i === 0 ? "M" : "L"} ${x} ${1300 - envolvente(x)}`;
  });

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#1A1A2C" />

        {/* Cabeza en corte, mirando a la derecha */}
        <path
          d="M 330 1500 L 360 1240 C 260 1160, 240 980, 270 850 C 300 690, 430 600, 560 600 C 700 600, 780 700, 790 820 L 830 900 L 790 920 L 800 960 C 805 990, 790 1010, 770 1015 L 780 1050 C 770 1100, 720 1120, 660 1120 L 640 1240 L 680 1500 Z"
          fill={PIEL}
        />
        <path d="M 520 1400 L 520 1000 C 520 950, 560 930, 620 930 L 770 940" fill="none" stroke={TRACTO} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 520 1400 L 520 1000 C 520 950, 560 930, 620 930 L 770 940" fill="none" stroke={colorGas} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.25 * Math.max(helio, pesado)} />
        <circle cx={480} cy={760} r={22} fill="#3A2A20" />
        {/* Cuerdas vocales */}
        <line x1={498} y1={1250} x2={518 - vibra} y2={1250} stroke="#F8E0E0" strokeWidth={8} strokeLinecap="round" />
        <line x1={542} y1={1250} x2={522 + vibra} y2={1250} stroke="#F8E0E0" strokeWidth={8} strokeLinecap="round" />
        {/* Zumbido que sube por la garganta */}
        {pulsoSube > 0
          ? [0, 1, 2].map((k) => {
              const p = (t * 0.9 + k / 3) % 1;
              const [x, y] = p < 0.7 ? [520, 1250 - (p / 0.7) * 300] : [520 + ((p - 0.7) / 0.3) * 240, 950 - ((p - 0.7) / 0.3) * 10];
              return <circle key={k} cx={x} cy={y} r={14} fill={AIRE} opacity={pulsoSube} />;
            })
          : null}
        {/* Ondas que salen de la boca */}
        {ondas
          ? new Array(6).fill(0).map((_, k) => {
              const d = ((t * 140) % paso) + k * paso;
              const o = Math.max(0, 1 - d / (6 * 80));
              return <path key={k} d={`M ${800 + d} ${880} A ${70 + d * 0.3} ${80 + d * 0.4} 0 0 1 ${800 + d} ${1000}`} fill="none" stroke={colorGas} strokeWidth={8} strokeLinecap="round" opacity={o} transform={`translate(${d * 0.15} 0)`} />;
            })
          : null}
        {/* Globo de helio */}
        <g opacity={globo}>
          <path d="M 150 860 C 120 960, 200 1060, 250 1180" fill="none" stroke="#C8C8D8" strokeWidth={3} />
          <ellipse cx={150} cy={760} rx={90} ry={110} fill={HELIO} opacity={0.85} />
          <path d="M 142 868 l 8 -12 l 8 12 Z" fill={HELIO} />
          <text x={150} y={775} textAnchor="middle" fill="#0A2A30" fontFamily={mono} fontSize={44} fontWeight={700}>
            He
          </text>
        </g>
        {/* Tanque de gas pesado */}
        <g opacity={tanque} transform="translate(950 1180)">
          <rect x={-70} y={-230} width={140} height={330} rx={50} fill="#5A5F6C" />
          <rect x={-22} y={-270} width={44} height={44} fill="#8A90A0" />
          <text y={-50} textAnchor="middle" fill={t < T.hablar ? C.white : PESADO} fontFamily={mono} fontSize={t < T.hablar ? 90 : 46} fontWeight={700}>
            {t < T.hablar ? "?" : "SF6"}
          </text>
        </g>
        <Pildora x={600} y={1430} texto="cuerdas: 120 Hz" color={C.white} o={Math.max(ventana(-1, T.final - 0.1), ventana(T.aun, T.fin + 2))} tam={44} />
        <Pildora x={760} y={760} texto="voz de ardilla" color={HELIO} o={ventana(T.ardilla + 0.2, T.hexa)} tam={40} />
        <Pildora x={700} y={760} texto="voz de gigante" color={PESADO} o={ventana(T.gigante + 0.2, T.ojo)} tam={40} />
        {/* Ojo: sin oxígeno */}
        <g opacity={alerta}>
          <rect x={-300} y={-400} width={1500} height={2400} fill={C.red} opacity={0.12 + 0.06 * Math.sin(t * 8)} />
        </g>
        <Pildora x={600} y={1430} texto="¡sin oxígeno!" color={C.red} o={ventana(T.ojo + 0.2, T.aun)} tam={50} />

        {/* Tubo de resonancia */}
        <g opacity={verTubo}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={TUBO.x0} y={TUBO.y0} width={L} height={TUBO.y1 - TUBO.y0} fill={colorGas} opacity={0.12} />
          <line x1={TUBO.x0} y1={TUBO.y0} x2={TUBO.x1} y2={TUBO.y0} stroke={C.white} strokeWidth={10} />
          <line x1={TUBO.x0} y1={TUBO.y1} x2={TUBO.x1} y2={TUBO.y1} stroke={C.white} strokeWidth={10} />
          <line x1={TUBO.x0} y1={TUBO.y0} x2={TUBO.x0} y2={TUBO.y1} stroke={C.white} strokeWidth={10} />
          {/* Onda estacionaria (cuarto de onda) */}
          {[1, -1].map((s) => (
            <path
              key={s}
              d={`M ${new Array(30)
                .fill(0)
                .map((_, i) => {
                  const x = TUBO.x0 + (i / 29) * L;
                  return `${x} ${1030 + s * 60 * Math.sin((i / 29) * Math.PI * 1.5) * Math.cos(t * 10 * estira)}`;
                })
                .join(" L ")}`}
              fill="none"
              stroke={colorGas}
              strokeWidth={6}
              opacity={0.8}
            />
          ))}
          <circle cx={pulsoX} cy={1030} r={22} fill={colorGas} opacity={ventana(T.notas, T.asi + 0.2) + pesado} />
          <text x={1850} y={800} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700} opacity={ventana(T.caja, T.notas)}>
            garganta + boca
          </text>
        </g>
        <Pildora x={1850} y={1300} texto={vel} color={colorGas} o={Math.max(ventana(T.notas + 0.4, T.asi), ventana(T.hexa + 0.4, T.lento))} tam={44} />
        <Pildora x={1850} y={790} texto="× 3" color={HELIO} o={ventana(T.helio + 1.2, T.asi)} tam={64} />

        {/* Espectro */}
        <g opacity={verEsp}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <line x1={2680} y1={1300} x2={3520} y2={1300} stroke={C.white} strokeWidth={5} />
          <text x={3510} y={1360} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={30}>
            grave → agudo
          </text>
          {new Array(14).fill(0).map((_, k) => {
            const x = 2720 + k * 58;
            return <rect key={k} x={x - 9} y={1300 - envolvente(x)} width={18} height={envolvente(x)} rx={4} fill={C.white} opacity={0.9} />;
          })}
          <path d={curva.join(" ")} fill="none" stroke={colorGas} strokeWidth={8} />
        </g>
        <Pildora x={3100} y={720} texto="la caja refuerza" color={colorGas} o={Math.max(ventana(T.asi + 0.3, T.cuerdas), ventana(T.lento + 0.3, T.gigante))} tam={42} />
      </g>

      {[T.caja, T.helio, T.ardilla, T.hexa, T.ojo].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(d)} />
      ))}
      <Tag x={sx(520)} y={sy(1250)} dx={150} dy={-170} texto="cuerdas vocales" color="#F8E0E0" o={ventana(T.hablar + 0.3, T.zumbido)} />
      <Tag x={sx(2780)} y={sy(1300 - envolvente(2778))} dx={60} dy={-200} texto="cuerdas: igual" color={C.white} o={ventana(T.cuerdas + 0.2, T.ardilla)} />
    </svg>
  );
};
