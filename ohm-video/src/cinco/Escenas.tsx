import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { BACTERIA, Comida, Cronometro, Suelo } from "./Piezas";

// Instantes clave (s) de public/audio/cinco/narracion.wav (voz ×1,1), sacados con Whisper
export const T = {
  recoges: 1.6,
  regla: 3.28,
  funciona: 4.98,
  rutgers: 6.26,
  contaminaron: 11.54,
  sandia: 14.18,
  pan: 14.98,
  mantequilla: 15.5,
  gomitas: 16.6,
  t1: 19.24,
  t5: 20.44,
  t30: 21.12,
  t300: 22.0,
  resultado: 23.3,
  saltan: 24.82,
  cuentes: 27.18,
  tiempo: 28.66,
  humedad: 31.8,
  sandiaMas: 33.96,
  gomitasMenos: 36.72,
  piso: 39.02,
  alfombra: 40.5,
  puntos: 43.5,
  asi: 45.8,
  contar: 49.86,
  decide: 51.26,
  donde: 53.6,
  comer: 54.24,
  galleta: 55.46,
  sandiaFin: 57.36,
  fin: 58.2,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

// Gancho: la galleta cae, cuentas, la recoges
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const caida = interpolate(t, [0.2, 0.8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const sube = interpolate(t, [T.recoges + 0.6, T.regla - 0.2], [0, 1], suave);
  const y = 520 + 640 * caida - 300 * sube;
  const segundos = Math.min(5, Math.max(0, t - 0.8));
  const zoom = interpolate(t, [0, T.rutgers], [1, 1.06]);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1000 * zoom}) scale(${zoom})`}>
        <Suelo tipo="baldosa" x={60} y={1230} w={960} h={240} bacterias={22} t={t} />
        <Comida tipo="galleta" x={540} y={y} s={1.3} rot={caida * 25} />
        {/* Mano que la recoge */}
        <g opacity={interpolate(t, [T.recoges, T.recoges + 0.4], [0, 1], clamp)} transform={`translate(${620} ${y - 30 + (1 - sube) * 0})`}>
          <path d="M 0 0 L 90 -10 Q 110 -10 110 10 Q 110 30 90 30 L 40 34 L 120 50 Q 140 60 120 75 L 20 80 Q -20 80 -40 50 Z" fill="#E8C8A8" stroke="#B8987A" strokeWidth={3} />
        </g>
        <Cronometro x={540} y={420} segundos={segundos} color={segundos >= 4.99 ? C.yellow : C.white} />
        {t > T.funciona ? (
          <text x={540} y={700} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={110} fontWeight={700} opacity={aparece(t, T.funciona)}>?</text>
        ) : null}
      </g>
    </svg>
  );
};

// El experimento de Rutgers: superficies, alimentos y tiempos
export const Experimento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = interpolate(t, [T.rutgers, T.resultado], [1, 1.04]);
  const superficies: { tipo: "acero" | "baldosa" | "madera" | "alfombra"; nombre: string }[] = [
    { tipo: "acero", nombre: "acero" },
    { tipo: "baldosa", nombre: "baldosa" },
    { tipo: "madera", nombre: "madera" },
    { tipo: "alfombra", nombre: "alfombra" },
  ];
  const comidas = [
    { tipo: "sandia", nombre: "sandía", t: T.sandia },
    { tipo: "pan", nombre: "pan", t: T.pan },
    { tipo: "panMantequilla", nombre: "pan + mant.", t: T.mantequilla },
    { tipo: "gomita", nombre: "gomita", t: T.gomitas },
  ];
  const tiempos = [
    { texto: "<1 s", t: T.t1 },
    { texto: "5 s", t: T.t5 },
    { texto: "30 s", t: T.t30 },
    { texto: "5 min", t: T.t300 },
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <g opacity={aparece(t, T.rutgers + 0.3)}>
          <rect x={60} y={220} width={960} height={220} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={290} fill={C.grey} fontFamily={mono} fontSize={30}>experimento</text>
          <text x={110} y={390} fill={C.white} fontFamily={mono} fontSize={60} fontWeight={700}>Universidad Rutgers · 2016</text>
        </g>
        {superficies.map((s, k) => (
          <g key={k} opacity={aparece(t, T.contaminaron + k * 0.2)}>
            <Suelo tipo={s.tipo} x={80 + k * 240} y={620} w={200} h={110} bacterias={8} t={t} />
            <text x={180 + k * 240} y={780} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>{s.nombre}</text>
          </g>
        ))}
        {comidas.map((c, k) => (
          <g key={k} opacity={aparece(t, c.t)}>
            <Comida tipo={c.tipo} x={180 + k * 240} y={960} s={0.85} />
            <text x={180 + k * 240} y={1100} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>{c.nombre}</text>
          </g>
        ))}
        {tiempos.map((c, k) => (
          <g key={k} opacity={aparece(t, c.t)}>
            <rect x={90 + k * 240} y={1220} width={180} height={90} rx={45} fill="#2A2350" stroke={C.cyan} strokeWidth={4} />
            <text x={180 + k * 240} y={1280} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>{c.texto}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// Resultado: las bacterias pasan en menos de un segundo
export const Contacto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const caida = interpolate(t, [T.resultado + 0.3, T.resultado + 0.9], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const tc = T.resultado + 0.9;
  const salto = interpolate(t, [tc, tc + 0.8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const crono = Math.min(0.8, Math.max(0, t - tc));
  const zoom = interpolate(t, [T.resultado, T.tiempo], [1, 1.08]);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1100 * zoom}) scale(${zoom})`}>
        <Suelo tipo="baldosa" x={60} y={1200} w={960} h={240} bacterias={30} t={t} />
        <Comida tipo="sandia" x={540} y={600 + 384 * caida} s={2.4} />
        {salto > 0
          ? new Array(26).fill(0).map((_, k) => {
              const x0 = 360 + random(`sx${k}`) * 360;
              const y1 = 1190 - random(`sy${k}`) * 120;
              return <ellipse key={k} cx={x0} cy={1210 + (y1 - 1210) * salto} rx={9} ry={5} fill={BACTERIA} />;
            })
          : null}
        <Cronometro x={540} y={420} segundos={crono} color={t > tc ? C.yellow : C.white} />
      </g>
    </svg>
  );
};

// Humedad y superficie: tarjetas comparativas (cualitativas)
export const Factores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const curva = interpolate(t, [T.tiempo, T.humedad], [0, 1], suave);
  const humedad = interpolate(t, [T.humedad - 0.3, T.humedad + 0.2, T.piso - 0.4, T.piso], [0, 1, 1, 0], clamp);
  const superficie = interpolate(t, [T.piso - 0.2, T.piso + 0.3], [0, 1], clamp);
  const barras = [
    { tipo: "sandia", v: 0.92, t: T.sandiaMas, color: C.red },
    { tipo: "pan", v: 0.45, t: T.sandiaMas + 1.2, color: C.grey },
    { tipo: "panMantequilla", v: 0.5, t: T.sandiaMas + 1.6, color: C.grey },
    { tipo: "gomita", v: 0.1, t: T.gomitasMenos, color: C.cyan },
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g opacity={1 - superficie}>
        <rect x={60} y={260} width={960} height={380} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={330} fill={C.grey} fontFamily={mono} fontSize={30}>más tiempo, más bacterias</text>
        <line x1={140} y1={580} x2={960} y2={580} stroke={C.grey} strokeWidth={3} opacity={0.5} />
        <path d={`M 140 560 ${new Array(41).fill(0).map((_, k) => (k / 40 <= curva ? `L ${140 + k * 20.5} ${560 - 180 * Math.sqrt(k / 40)}` : "")).join(" ")}`} fill="none" stroke={BACTERIA} strokeWidth={6} />
        <text x={960} y={620} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={26}>tiempo en el suelo</text>
        <g opacity={humedad}>
          <rect x={60} y={720} width={960} height={820} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={790} fill={C.grey} fontFamily={mono} fontSize={30}>bacterias recogidas (cualitativo)</text>
          {barras.map((b, k) => {
            const on = interpolate(t, [b.t - 0.2, b.t + 0.6], [0, 1], suave);
            const y = 880 + k * 160;
            return (
              <g key={k} opacity={0.25 + 0.75 * Math.min(1, on * 2)}>
                <Comida tipo={b.tipo} x={170} y={y + 40} s={0.6} />
                <rect x={280} y={y + 15} width={680} height={50} rx={25} fill="rgba(255,255,255,0.06)" />
                <rect x={280} y={y + 15} width={680 * b.v * on} height={50} rx={25} fill={b.color} />
              </g>
            );
          })}
        </g>
      </g>
      {superficie > 0 ? (
        <g opacity={superficie}>
          {/* Contacto: baldosa plana (mucho contacto) vs alfombra (solo las puntas) */}
          <text x={300} y={420} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>baldosa</text>
          <rect x={100} y={600} width={400} height={60} fill="#D8D4E8" />
          <rect x={140} y={540} width={320} height={60} rx={10} fill="#E8C890" />
          {new Array(10).fill(0).map((_, k) => <ellipse key={k} cx={160 + k * 32} cy={598} rx={8} ry={4} fill={BACTERIA} />)}
          <text x={780} y={420} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>alfombra</text>
          <rect x={580} y={620} width={400} height={40} fill="#7A3A5A" />
          {new Array(20).fill(0).map((_, k) => <line key={k} x1={590 + k * 20} y1={620} x2={594 + k * 20} y2={590} stroke="#9A4A7A" strokeWidth={6} strokeLinecap="round" />)}
          <rect x={620} y={530} width={320} height={60} rx={10} fill="#E8C890" />
          {[0, 4, 8, 12].map((k) => <ellipse key={k} cx={600 + k * 22} cy={590} rx={8} ry={4} fill={BACTERIA} />)}
          <g opacity={interpolate(t, [T.puntos - 0.2, T.puntos + 0.3], [0, 1], clamp)}>
            <text x={300} y={740} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={32} fontWeight={700}>mucho contacto</text>
            <text x={780} y={740} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={32} fontWeight={700}>pocos puntos</text>
          </g>
          <rect x={60} y={860} width={960} height={560} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={930} fill={C.grey} fontFamily={mono} fontSize={30}>bacterias que pasan (cualitativo)</text>
          {[
            { n: "acero", v: 0.85, color: C.red },
            { n: "baldosa", v: 0.85, color: C.red },
            { n: "alfombra", v: 0.15, color: C.cyan },
          ].map((b, k) => {
            const on = interpolate(t, [T.alfombra - 0.2 + k * 0.4, T.alfombra + 0.6 + k * 0.4], [0, 1], suave);
            const y = 1000 + k * 130;
            return (
              <g key={k}>
                <text x={110} y={y + 50} fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>{b.n}</text>
                <rect x={340} y={y + 15} width={620} height={50} rx={25} fill="rgba(255,255,255,0.06)" />
                <rect x={340} y={y + 15} width={620 * b.v * on} height={50} rx={25} fill={b.color} />
              </g>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
};

// Conclusión y cierre
export const Conclusion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tarjeta = interpolate(t, [T.asi, T.asi + 0.4, T.comer - 0.4, T.comer], [0, 1, 1, 0], clamp);
  const tachar = interpolate(t, [T.contar, T.contar + 0.5], [0, 1], suave);
  const final = interpolate(t, [T.comer - 0.2, T.comer + 0.3], [0, 1], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {tarjeta > 0 ? (
        <g opacity={tarjeta}>
          <rect x={60} y={420} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={490} fill={C.grey} fontFamily={mono} fontSize={30}>regla de los 5 segundos</text>
          <text x={110} y={620} fill={C.red} fontFamily={mono} fontSize={68} fontWeight={700}>simplificación</text>
          <g>
            <text x={110} y={880} fill={C.white} fontFamily={mono} fontSize={56} fontWeight={700}>contar 1, 2, 3...</text>
            <line x1={100} y1={862} x2={100 + 560 * tachar} y2={862} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
          </g>
          <text x={110} y={1040} fill={C.yellow} fontFamily={mono} fontSize={56} fontWeight={700} opacity={aparece(t, T.decide + 0.4)}>¿qué se cayó?</text>
          <text x={110} y={1160} fill={C.yellow} fontFamily={mono} fontSize={56} fontWeight={700} opacity={aparece(t, T.donde)}>¿y dónde?</text>
        </g>
      ) : null}
      {final > 0 ? (
        <g opacity={final}>
          <Suelo tipo="baldosa" x={60} y={1150} w={960} h={240} bacterias={14} t={t} />
          <Comida tipo="galleta" x={320} y={1059} s={1.3} />
          <Comida tipo="sandia" x={780} y={1024} s={1.4} />
          <g opacity={aparece(t, T.galleta + 0.9)}>
            <path d="M 260 840 L 310 890 L 400 780" fill="none" stroke={C.cyan} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g opacity={aparece(t, T.sandiaFin)} stroke={C.red} strokeWidth={14} strokeLinecap="round">
            <line x1={720} y1={780} x2={840} y2={900} />
            <line x1={840} y1={780} x2={720} y2={900} />
          </g>
        </g>
      ) : null}
    </svg>
  );
};
