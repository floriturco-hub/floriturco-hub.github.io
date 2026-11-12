import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el ferrofluido en una placa con un imán debajo que sube y levanta las espinas; en el centro, las
// partículas de hierro con su capa de jabón en el aceite (al azar sin imán, alineadas con él); a la derecha, las tres
// fuerzas sobre una espina; al fondo, el tanque de combustible de la NASA sin gravedad.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (las espinas de cerca).
const NEGRO = "#0A0A12";
const JABON = "#C8D860";
const IMAN_N = "#E8414F";
const IMAN_S = "#4A7AE8";
const PART = new Array(16).fill(0).map((_, i) => ({ x: 1440 + random(`px${i}`) * 780, y: 720 + random(`py${i}`) * 620, a: random(`pa${i}`) * 360, f: 1 + random(`pf${i}`) * 2 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1130, 1.6],
  [T.final - 0.1, 550, 1130, 1.65],
  [T.final + 0.2, 550, 1060, 0.95],
  [T.aceite - 0.1, 550, 1060, 0.98],
  [T.aceite + 0.2, 1850, 1030, 1.0],
  [T.hierro - 0.1, 1850, 1030, 1.03],
  [T.hierro + 0.2, 1850, 1030, 1.3],
  [T.cabello - 0.1, 1850, 1030, 1.33],
  [T.cabello + 0.2, 1950, 1030, 1.0],
  [T.jabon - 0.1, 1950, 1030, 1.03],
  [T.jabon + 0.2, PART[3].x, PART[3].y, 2.1],
  [T.sin - 0.1, PART[3].x, PART[3].y, 2.15],
  [T.sin + 0.2, 550, 1120, 1.05],
  [T.acercar - 0.1, 550, 1120, 1.08],
  [T.acercar + 0.2, 550, 1200, 1.2],
  [T.particula - 0.1, 550, 1200, 1.23],
  [T.particula + 0.2, 1850, 1030, 1.0],
  [T.alinea - 0.1, 1850, 1030, 1.03],
  [T.alinea + 0.2, 1850, 1030, 1.25],
  [T.sube - 0.1, 1850, 1030, 1.28],
  [T.sube + 0.2, 550, 1080, 1.1],
  [T.gravedad - 0.1, 550, 1080, 1.13],
  [T.gravedad + 0.2, 3100, 1030, 1.0],
  [T.tension - 0.1, 3100, 1030, 1.03],
  [T.tension + 0.2, 3100, 1030, 1.15],
  [T.equilibrio - 0.1, 3100, 1030, 1.18],
  [T.equilibrio + 0.2, 3100, 1030, 1.0],
  [T.espinas - 0.1, 3100, 1030, 1.03],
  [T.espinas + 0.2, 550, 1130, 1.6],
  [T.quien - 0.1, 550, 1130, 1.63],
  [T.quien + 0.2, 4350, 1030, 1.0],
  [T.mover - 0.1, 4350, 1030, 1.03],
  [T.mover + 0.2, 4350, 1120, 1.3],
  [T.porque - 0.1, 4350, 1120, 1.33],
  [T.porque + 0.25, 550, 1130, 1.6],
  [T.fin + 0.3, 550, 1130, 1.65],
];

export const FerroMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Espinas: dependen de lo cerca que esté el imán
  const h =
    t < T.sin ? 1 : t < T.acercar ? interpolate(t, [T.sin, T.sin + 0.6], [1, 0], clamp) : t < T.espinas ? interpolate(t, [T.acercar + 0.3, T.sube + 1.2, T.espinas], [0, 0.7, 1], clamp) : 1;
  const magY = 1300 + (1 - h) * 230;
  const perfil = new Array(131).fill(0).map((_, i) => {
    const x = 290 + i * 4;
    const u = (x - 550) / 260;
    const monton = 30 * Math.sqrt(Math.max(0, 1 - u * u));
    const f = (((x - 550) / 52) % 1 + 1) % 1;
    const pico = Math.max(0, 1 - 2 * Math.abs(f - 0.5)) ** 1.6;
    const env = Math.exp(-(((x - 550) / 170) ** 2));
    return [x, 1236 - monton - 210 * h * env * pico * (1 + 0.04 * Math.sin(t * 6 + i))];
  });
  const charco = `M 290 1236 L ${perfil.map((q) => `${q[0]} ${q[1].toFixed(1)}`).join(" L ")} L 810 1236 Z`;
  const campo = Math.max(ventana(T.acercar + 0.3, T.particula + 0.2), ventana(T.sube, T.gravedad + 0.2));

  // Partículas
  const verPart = Math.max(ventana(T.aceite - 0.1, T.sin + 0.2), ventana(T.particula - 0.1, T.sube + 0.2));
  const capa = interpolate(t, [T.jabon, T.jabon + 0.5], [0, 1], clamp);
  const al = interpolate(t, [T.alinea - 0.6, T.alinea + 0.4], [0, 1], clamp);
  const lineasCampo = ventana(T.particula, T.sube + 0.2);

  // Fuerzas sobre una espina
  const verFuerzas = ventana(T.gravedad - 0.1, T.espinas + 0.2);
  const fIman = interpolate(t, [T.gravedad - 0.1, T.gravedad + 0.3], [0, 1], clamp);
  const fGrav = interpolate(t, [T.gravedad + 0.6, T.gravedad + 1.0], [0, 1], clamp);
  const fTens = interpolate(t, [T.tension, T.tension + 0.4], [0, 1], clamp);

  // NASA
  const verNasa = ventana(T.quien - 0.1, T.porque + 0.2);
  const lleva = interpolate(t, [T.mover + 0.2, T.mover + 1.4], [0, 1], clamp);
  const bx = 4320 + 30 * (1 - lleva) * Math.sin(t * 1.3) + 30 * lleva;
  const by = 940 + 40 * (1 - lleva) * Math.cos(t * 1.1) + 330 * lleva;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="ferro" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2A2A40" />
          <stop offset="0.5" stopColor={NEGRO} />
          <stop offset="1" stopColor="#1A1A2A" />
        </linearGradient>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#181A26" />

        {/* Placa con ferrofluido e imán debajo, sobre fondo claro para que se vea el negro */}
        <rect x={80} y={640} width={940} height={920} rx={30} fill="#D8DEE8" />
        {campo > 0
          ? [-3, -2, -1, 0, 1, 2, 3].map((k) => (
              <path key={k} d={`M ${550 + k * 25} ${magY} C ${550 + k * 40} ${magY - 200}, ${550 + k * 70} 1000, ${550 + k * 120} 820`} fill="none" stroke={IMAN_N} strokeWidth={4} strokeDasharray="14 10" opacity={0.6 * campo} />
            ))
          : null}
        <g transform={`translate(0 ${magY - 1300})`}>
          <rect x={430} y={1300} width={240} height={70} fill={IMAN_N} />
          <rect x={430} y={1370} width={240} height={70} fill={IMAN_S} />
          <text x={550} y={1352} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={44} fontWeight={700}>
            N
          </text>
          <text x={550} y={1422} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={44} fontWeight={700}>
            S
          </text>
        </g>
        <rect x={120} y={1240} width={860} height={24} fill="#8AA8C8" />
        <path d={charco} fill="url(#ferro)" />
        {perfil.map((q, i) =>
          i % 13 === 6 && h > 0.3 ? <circle key={i} cx={q[0] - 3} cy={q[1] + 8} r={4} fill="#FFFFFF" opacity={0.7 * h} /> : null,
        )}
        <rect x={250} y={1196} width={600} height={44} fill="none" stroke="#C8E0F8" strokeWidth={4} opacity={0.6} />
        <Pildora x={550} y={760} texto="¿quién lo inventó?" color={C.white} o={ventana(T.final + 0.3, T.aceite)} tam={44} />
        <Pildora x={550} y={860} texto="sin imán: líquido" color={C.white} o={ventana(T.sin + 0.6, T.acercar)} tam={44} />

        {/* Partículas en aceite */}
        <g opacity={verPart}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} fill="#22180C" />
          {lineasCampo > 0
            ? new Array(9).fill(0).map((_, k) => <line key={k} x1={1420 + k * 110} y1={1440} x2={1420 + k * 110} y2={620} stroke={IMAN_N} strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-t * 60} opacity={0.45 * lineasCampo} />)
            : null}
          <rect x={2250} y={610} width={100} height={840} rx={30} fill="#7A5A3A" opacity={ventana(T.cabello, T.jabon)} />
          {PART.map((p, i) => {
            const x = p.x + 18 * Math.sin(t * p.f + i);
            const y = p.y + 18 * Math.cos(t * p.f * 0.8 + i * 2);
            const a = ((1 - al) * (p.a + t * 40 * (p.f - 2)) + al * -90) * (Math.PI / 180);
            return (
              <g key={i}>
                {capa > 0
                  ? new Array(12).fill(0).map((_, k) => {
                      const b = (k / 12) * Math.PI * 2;
                      return <line key={k} x1={x + 26 * Math.cos(b)} y1={y + 26 * Math.sin(b)} x2={x + 42 * Math.cos(b)} y2={y + 42 * Math.sin(b)} stroke={JABON} strokeWidth={4} opacity={capa} />;
                    })
                  : null}
                <circle cx={x} cy={y} r={26} fill="#3A3A48" stroke="#6A6A7A" strokeWidth={3} />
                {t > T.sin - 0.3 ? (
                  <g opacity={interpolate(t, [T.sin - 0.3, T.sin], [0, 1], clamp)}>
                    <line x1={x - 16 * Math.cos(a)} y1={y - 16 * Math.sin(a)} x2={x + 16 * Math.cos(a)} y2={y + 16 * Math.sin(a)} stroke={IMAN_N} strokeWidth={6} strokeLinecap="round" />
                    <circle cx={x + 16 * Math.cos(a)} cy={y + 16 * Math.sin(a)} r={6} fill={IMAN_N} />
                  </g>
                ) : null}
              </g>
            );
          })}
        </g>
        <Pildora x={1850} y={1380} texto="hierro en aceite" color={C.white} o={ventana(T.aceite + 0.4, T.cabello)} tam={44} />

        {/* Tres fuerzas sobre una espina */}
        <g opacity={verFuerzas}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} fill="#D8DEE8" />
          <path d="M 2860 1320 Q 3060 1200 3100 760 Q 3140 1200 3340 1320 Z" fill="url(#ferro)" />
          <circle cx={3092} cy={830} r={6} fill="#FFFFFF" opacity={0.8} />
          <g opacity={fIman}>
            <path d="M 3440 1260 L 3440 790 M 3410 830 L 3440 790 L 3470 830" fill="none" stroke={IMAN_N} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <text x={3440} y={1320} textAnchor="middle" fill={IMAN_N} fontFamily={mono} fontSize={36} fontWeight={700}>
              imán
            </text>
          </g>
          <g opacity={fGrav}>
            <path d="M 2760 820 L 2760 1240 M 2730 1200 L 2760 1240 L 2790 1200" fill="none" stroke="#0A78C8" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <text x={2760} y={780} textAnchor="middle" fill="#0A78C8" fontFamily={mono} fontSize={36} fontWeight={700}>
              gravedad
            </text>
          </g>
          <g opacity={fTens}>
            {[-1, 1].map((l) => (
              <path key={l} d={`M ${3100 + l * 70} 980 L ${3100 + l * 120} 1160 M ${3100 + l * 120 - 26 * l} 1135 L ${3100 + l * 120} 1160 L ${3100 + l * 120 + 6 * l} 1125`} fill="none" stroke="#1A9A3A" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            ))}
            <text x={3100} y={1400} textAnchor="middle" fill="#1A9A3A" fontFamily={mono} fontSize={34} fontWeight={700}>
              tensión superficial
            </text>
          </g>
        </g>
        <Pildora x={3100} y={690} texto="equilibrio" color={C.yellow} o={ventana(T.equilibrio + 0.2, T.espinas + 0.2)} tam={46} />

        {/* NASA: combustible sin gravedad */}
        <g opacity={verNasa}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} fill="#0A0A18" />
          {new Array(24).fill(0).map((_, k) => (
            <circle key={k} cx={3880 + random(`sx${k}`) * 940} cy={620 + random(`sy${k}`) * 820} r={3} fill="#FFFFFF" opacity={0.6} />
          ))}
          <rect x={4120} y={720} width={460} height={620} rx={180} fill="#1A1E2E" stroke="#C8CED8" strokeWidth={10} />
          <rect x={4320} y={1336} width={60} height={110} fill="#C8CED8" />
          <ellipse cx={4350} cy={1320} rx={110} ry={30} fill="none" stroke={IMAN_N} strokeWidth={10} opacity={lleva > 0 ? 1 : 0.25} />
          <ellipse cx={bx} cy={by} rx={90 + 30 * lleva + 8 * Math.sin(t * 3)} ry={80 - 30 * lleva + 8 * Math.cos(t * 3)} fill={NEGRO} stroke="#3A3A5A" strokeWidth={4} />
        </g>
        <Pildora x={4350} y={1400} texto="NASA · años 60" color={C.white} o={ventana(T.nasa, T.porque)} tam={44} />
      </g>

      {[T.acercar + 0.3, T.sube, T.espinas, T.nasa].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(PART[3].x)} y={sy(PART[3].y)} dx={60} dy={-150} texto="capa de jabón" color={JABON} o={ventana(T.jabon + 0.3, T.sin)} />
      <Tag x={sx(PART[5].x)} y={sy(PART[5].y)} dx={-40} dy={-220} texto="partícula de hierro" color={C.white} o={ventana(T.hierro + 0.2, T.cabello)} />
      <Tag x={sx(2300)} y={sy(800)} dx={-200} dy={-150} texto="un cabello" color="#C8A070" o={ventana(T.cabello + 0.2, T.jabon)} />
      <Tag x={sx(4400)} y={sy(by)} dx={170} dy={-200} texto="combustible" color={C.white} o={ventana(T.mover, T.porque)} />
    </svg>
  );
};
