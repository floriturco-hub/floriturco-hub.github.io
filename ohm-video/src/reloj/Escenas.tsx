import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { METAL, ORO, Reloj, Rueda } from "./Piezas";
import { T } from "./tiempos";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Gancho y cierre: los dos relojes con su precio
export const Comparacion: React.FC<{ readonly t0: number; readonly fase: "intro" | "final" }> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";
  const precios = intro ? interpolate(t, [0.6, 1.2], [0, 1], clamp) : 1;
  const corona = intro ? interpolate(t, [T.preciso, T.preciso + 0.4], [0, 1], clamp) : 1;
  const zoom = intro
    ? interpolate(t, [0, T.cuarzo - 0.6, T.cuarzo + 0.2], [1, 1.05, 2.2], { ...clamp, easing: Easing.in(Easing.cubic) })
    : interpolate(t, [t0, t0 + 1, T.fin + 0.5], [1.3, 1.02, 1.05], suave);
  const foco = intro ? interpolate(zoom, [1.05, 2.2], [0, 1], clamp) : 0;
  const cx = 540 + (300 - 540) * foco;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - cx * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <Reloj x={290} y={900} r={170} t={t} tipo="cuarzo" etiqueta="CUARZO" />
        <Reloj x={790} y={900} r={170} t={t} tipo="automatico" etiqueta="AUTOMÁTICO" />
        <g opacity={precios}>
          <text x={290} y={1300} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={88} fontWeight={700}>$10</text>
          <text x={790} y={1300} textAnchor="middle" fill={ORO} fontFamily={mono} fontSize={88} fontWeight={700}>$10.000</text>
        </g>
        {/* La corona del más preciso, sobre el barato */}
        <g opacity={corona} transform="translate(290 580)">
          <path d="M -70 30 L -80 -40 L -35 0 L 0 -55 L 35 0 L 80 -40 L 70 30 Z" fill={C.yellow} />
          <text y={90} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>más preciso</text>
        </g>
      </g>
    </svg>
  );
};

// Movimiento de cuarzo: pila → circuito → diapasón de cuarzo → divisor ÷2 ×15 → motor paso a paso
export const Cuarzo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pila = interpolate(t, [T.pila - 0.2, T.pila + 0.3], [0, 1], clamp);
  const circuito = interpolate(t, [T.circuito - 0.2, T.circuito + 0.3], [0, 1], clamp);
  const cristal = interpolate(t, [T.cristal - 0.2, T.cristal + 0.3], [0, 1], clamp);
  const vibra = interpolate(t, [T.vibra - 0.3, T.vibra + 0.2], [0, 1], clamp);
  const divisores = Math.floor(interpolate(t, [T.cuenta + 0.4, T.pulso - 0.2], [0, 15], clamp));
  const pulso = interpolate(t, [T.pulso, T.salto - 0.1], [0, 1], suave);
  const saltos = t >= T.salto ? 1 + Math.floor((t - T.salto) / 1.1) : 0;
  const hz = Math.round(interpolate(t, [T.vibra, T.vibra + 1.6], [0, 32768], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const zoom = interpolate(t, [T.cuarzo - 0.3, T.cuarzo + 0.8, T.rolex], [1.4, 1, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });
  const amp = 6 * vibra * Math.sin(t * 90);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1050 * zoom}) scale(${zoom})`}>
        <circle cx={540} cy={1050} r={460} fill="#15112E" stroke={METAL} strokeWidth={10} />
        {/* Cables */}
        <g opacity={circuito}>
          <path d="M 330 1230 L 330 1060 L 460 1060" fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d="M 620 1060 L 760 1060 L 760 900" fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d="M 540 1140 L 540 1300 L 700 1300" fill="none" stroke={C.cyan} strokeWidth={6} />
        </g>
        {/* Pila de botón */}
        <g opacity={pila}>
          <circle cx={330} cy={1290} r={110} fill="#5A5675" stroke={METAL} strokeWidth={8} />
          <circle cx={330} cy={1290} r={80} fill="#6E6A8C" />
          <text x={330} y={1305} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>+</text>
        </g>
        {/* Circuito */}
        <g opacity={circuito}>
          {new Array(6).fill(0).map((_, k) => (
            <g key={k}>
              <line x1={460 + k * 30} y1={970} x2={460 + k * 30} y2={985} stroke={METAL} strokeWidth={6} />
              <line x1={460 + k * 30} y1={1135} x2={460 + k * 30} y2={1150} stroke={METAL} strokeWidth={6} />
            </g>
          ))}
          <rect x={445} y={985} width={180} height={150} rx={14} fill="#1A1636" stroke={C.cyan} strokeWidth={4} />
          <text x={535} y={1072} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>CI</text>
        </g>
        {/* Diapasón de cuarzo en su cápsula */}
        <g opacity={cristal}>
          <rect x={700} y={620} width={120} height={280} rx={56} fill="rgba(200,196,216,0.12)" stroke={METAL} strokeWidth={6} />
          <path d={`M 740 880 L 740 ${700 - 0} Q 740 660 ${748 - amp} 660`} fill="none" stroke="#E8E6F0" strokeWidth={14} strokeLinecap="round" />
          <path d={`M 780 880 L 780 700 Q 780 660 ${772 + amp} 660`} fill="none" stroke="#E8E6F0" strokeWidth={14} strokeLinecap="round" />
          <line x1={735 - amp} y1={650} x2={735 - amp} y2={760} stroke="#E8E6F0" strokeWidth={14} strokeLinecap="round" />
          <line x1={785 + amp} y1={650} x2={785 + amp} y2={760} stroke="#E8E6F0" strokeWidth={14} strokeLinecap="round" />
          {vibra > 0 ? <circle cx={760} cy={700} r={90 + 6 * Math.sin(t * 40)} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.4 * vibra} /> : null}
        </g>
        {/* Motor paso a paso y segundero */}
        <g opacity={interpolate(t, [T.pulso - 0.3, T.pulso + 0.2], [0, 1], clamp)}>
          <rect x={700} y={1240} width={120} height={120} rx={14} fill="#2A2350" stroke={C.orange} strokeWidth={5} />
          {new Array(5).fill(0).map((_, k) => (
            <line key={k} x1={712} y1={1258 + k * 20} x2={808} y2={1258 + k * 20} stroke={C.orange} strokeWidth={4} opacity={0.7} />
          ))}
          <g transform={`translate(860 1300) rotate(${saltos * 30})`}>
            <circle r={36} fill="#1A1636" stroke={METAL} strokeWidth={4} />
            <line x1={0} y1={8} x2={0} y2={-34} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
          </g>
          {pulso > 0 && pulso < 1 ? (
            <circle cx={540 + 160 * pulso} cy={1300} r={14} fill={C.yellow} />
          ) : null}
        </g>
      </g>
      {/* Tarjetas */}
      {vibra > 0 && t < T.cuenta ? (
        <g opacity={interpolate(t, [T.cuenta - 0.4, T.cuenta], [1, 0], clamp) * vibra}>
          <rect x={60} y={150} width={960} height={250} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>vibraciones del cuarzo</text>
          <text x={110} y={340} fill={C.cyan} fontFamily={mono} fontSize={96} fontWeight={700}>
            {hz.toLocaleString("es-ES")}
            <tspan fill={C.grey} fontSize={48}> /s</tspan>
          </text>
        </g>
      ) : null}
      {t >= T.cuenta - 0.2 ? (
        <g opacity={interpolate(t, [T.cuenta - 0.2, T.cuenta + 0.3, T.rolex - 0.4, T.rolex], [0, 1, 1, 0], clamp)}>
          <rect x={60} y={150} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>el circuito divide entre 2, quince veces</text>
          {new Array(15).fill(0).map((_, k) => (
            <rect key={k} x={110 + k * 58} y={250} width={48} height={48} rx={8} fill={k < divisores ? C.yellow : "rgba(255,255,255,0.08)"} />
          ))}
          <text x={110} y={400} fill={C.yellow} fontFamily={mono} fontSize={72} fontWeight={700}>
            {(32768 / 2 ** divisores).toLocaleString("es-ES")}
            <tspan fill={C.grey} fontSize={40}> /s</tspan>
          </text>
          {divisores >= 15 ? <text x={980} y={400} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>= 1 pulso/s</text> : null}
        </g>
      ) : null}
    </svg>
  );
};

// Movimiento automático: rotor → muelle real → tren de ruedas → escape (rueda de escape + áncora + volante)
export const Automatico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rotor = interpolate(t, [T.muneca - 0.2, T.muneca + 0.3], [0, 1], clamp);
  const anguloRotor = 70 * Math.sin((t - T.muneca) * 2.4) * rotor;
  const tension = interpolate(t, [T.muelle, T.golpe], [0.3, 1], suave);
  const sacudida = t > T.golpe && t < T.escape ? 4 * Math.sin(t * 50) : 0;
  const escape = interpolate(t, [T.escape - 0.2, T.escape + 0.4], [0, 1], clamp);
  // Volante a cámara lenta: 1 oscilación/s (real: 4/s)
  const fase = Math.max(0, t - T.escape) * Math.PI * 2;
  const volante = 130 * Math.sin(fase) * escape;
  const latidos = Math.floor(Math.max(0, t - T.escape) * 2);
  const paso = latidos * 18;
  const zoom = interpolate(t, [T.rolex - 0.3, T.rolex + 0.8, T.diferencia], [1.4, 1, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });
  const segundero = interpolate(t, [T.desliza - 0.3, T.desliza + 0.3], [0, 1], clamp);

  const espiral: string[] = [];
  const vueltas = 3 + 3 * tension;
  for (let k = 0; k <= 200; k++) {
    const u = k / 200;
    const a = u * vueltas * Math.PI * 2;
    const r = 16 + u * 74;
    espiral.push(`${(330 + Math.cos(a) * r).toFixed(1)},${(1180 + Math.sin(a) * r).toFixed(1)}`);
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1050 * zoom}) scale(${zoom})`}>
        <circle cx={540} cy={1050} r={460} fill="#14284A" stroke={ORO} strokeWidth={10} />
        {/* Barrilete con el muelle real */}
        <g transform={`translate(${sacudida} 0)`} opacity={interpolate(t, [T.muelle - 0.3, T.muelle + 0.2], [0.35, 1], clamp)}>
          <circle cx={330} cy={1180} r={110} fill="#1A1636" stroke={ORO} strokeWidth={8} />
          <polyline points={espiral.join(" ")} fill="none" stroke="#D8D4E8" strokeWidth={4} />
        </g>
        {/* Tren de ruedas */}
        <Rueda x={500} y={1040} r={70} dientes={18} angulo={-paso * 0.5} />
        <Rueda x={620} y={930} r={46} dientes={12} angulo={paso * 0.8} />
        <Rueda x={540} y={1250} r={40} dientes={10} angulo={paso} />
        {/* Escape: rueda de escape, áncora y volante */}
        <g opacity={0.35 + 0.65 * escape}>
          <Rueda x={720} y={1010} r={50} dientes={15} angulo={paso * 1.2} color={C.cyan} />
          <g transform={`translate(780 900) rotate(${8 * Math.sign(Math.sin(fase)) * escape})`}>
            <path d="M -70 60 L 0 0 L 70 60 M 0 0 L 0 -90" stroke={C.cyan} strokeWidth={10} fill="none" strokeLinecap="round" />
          </g>
          <g transform={`translate(780 760) rotate(${volante})`}>
            <circle r={110} fill="none" stroke={ORO} strokeWidth={12} />
            {[0, 1, 2].map((k) => (
              <line key={k} x1={0} y1={0} x2={0} y2={-110} stroke={ORO} strokeWidth={8} transform={`rotate(${k * 120})`} />
            ))}
            <path d="M 0 0 m -12 0 a 12 12 0 1 1 12 12 a 24 24 0 1 1 -24 -24 a 36 36 0 1 1 36 36" fill="none" stroke="#D8D4E8" strokeWidth={3} />
          </g>
        </g>
        {/* Rotor (pesa oscilante) */}
        <g opacity={rotor * 0.85} transform={`rotate(${anguloRotor} 540 1050)`}>
          <path d="M 120 1050 A 420 420 0 0 0 960 1050 L 860 1050 A 320 320 0 0 1 220 1050 Z" fill={ORO} opacity={0.75} />
        </g>
        <circle cx={540} cy={1050} r={22} fill={ORO} />
        {/* Segundero que se desliza (8 pasos por segundo) */}
        <g opacity={segundero} transform={`translate(${880} ${1330}) rotate(${(Math.floor((t - T.desliza) * 8) / 8) * 6})`}>
          <circle r={40} fill="#14284A" stroke={ORO} strokeWidth={4} />
          <line x1={0} y1={8} x2={0} y2={-36} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
        </g>
      </g>
      {escape > 0 && t > T.volante ? (
        <g opacity={interpolate(t, [T.volante, T.volante + 0.4, T.diferencia - 0.4, T.diferencia], [0, 1, 1, 0], clamp)}>
          <rect x={60} y={150} width={960} height={250} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>oscilaciones del volante</text>
          <text x={110} y={340} fill={ORO} fontFamily={mono} fontSize={96} fontWeight={700}>
            4<tspan fill={C.grey} fontSize={48}> /s</tspan>
          </text>
          <text x={980} y={340} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={28}>(aquí, a cámara lenta)</text>
        </g>
      ) : null}
    </svg>
  );
};

// La diferencia: frecuencia del "corazón", perturbaciones y desvío mensual
export const Diferencia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ondas = interpolate(t, [T.diferencia, T.diferencia + 0.5], [0, 1], clamp);
  const golpe = t > T.golpes ? Math.exp(-((t - T.golpes - 0.4) ** 2) / 0.2) : 0;
  const desvio = interpolate(t, [T.desvia - 0.2, T.desvia + 0.3], [0, 1], clamp);
  const barraQ = interpolate(t, [T.desvia, T.desvia + 1.0], [0, 1], suave);
  const barraA = interpolate(t, [T.rolexDia, T.rolexDia + 1.4], [0, 1], suave);

  const onda = (y: number, frec: number, color: string, perturba: number) => {
    let d = `M 110 ${y}`;
    for (let x = 0; x <= 860; x += 3) {
      const fase = (x / 860) * frec * Math.PI * 2 - t * 6 + perturba * golpe * Math.exp(-((x - 600) ** 2) / 20000) * 2.5;
      d += ` L ${110 + x} ${y + 45 * Math.sin(fase)}`;
    }
    return <path d={d} fill="none" stroke={color} strokeWidth={5} />;
  };

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g opacity={ondas * (1 - desvio * 0.0)}>
        <rect x={60} y={420} width={960} height={620} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={490} fill={C.grey} fontFamily={mono} fontSize={30}>el "corazón" de cada reloj</text>
        <text x={110} y={570} fill={C.cyan} fontFamily={mono} fontSize={38} fontWeight={700}>cuarzo · 32.768 /s</text>
        {onda(660, 60, C.cyan, 0.05)}
        <text x={110} y={820} fill={ORO} fontFamily={mono} fontSize={38} fontWeight={700}>automático · 4 /s</text>
        {onda(910, 2.5, ORO, 1)}
        {golpe > 0.05 ? (
          <g opacity={golpe}>
            <path d="M 690 560 L 650 650 L 690 650 L 640 760" fill="none" stroke={C.red} strokeWidth={8} strokeLinejoin="round" />
            <path d="M 690 810 L 650 900 L 690 900 L 640 1010" fill="none" stroke={C.red} strokeWidth={8} strokeLinejoin="round" />
          </g>
        ) : null}
      </g>
      {desvio > 0 ? (
        <g opacity={desvio}>
          <rect x={60} y={1100} width={960} height={460} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={1170} fill={C.grey} fontFamily={mono} fontSize={30}>desvío en un mes (aprox.)</text>
          <text x={110} y={1260} fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>cuarzo</text>
          <rect x={110} y={1285} width={860} height={44} rx={22} fill="rgba(255,255,255,0.06)" />
          <rect x={110} y={1285} width={860 * 0.25 * barraQ} height={44} rx={22} fill={C.cyan} />
          <text x={970} y={1260} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>±15 s</text>
          <g opacity={interpolate(t, [T.rolexDia - 0.2, T.rolexDia + 0.3], [0, 1], clamp)}>
            <text x={110} y={1420} fill={ORO} fontFamily={mono} fontSize={40} fontWeight={700}>automático</text>
            <rect x={110} y={1445} width={860} height={44} rx={22} fill="rgba(255,255,255,0.06)" />
            <rect x={110} y={1445} width={860 * barraA} height={44} rx={22} fill={ORO} />
            <text x={970} y={1420} textAnchor="end" fill={ORO} fontFamily={mono} fontSize={40} fontWeight={700}>±60 s</text>
            <text x={970} y={1535} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={26}>(±2 s al día)</text>
          </g>
        </g>
      ) : null}
    </svg>
  );
};

// Por qué cuesta tanto: máquina ajustada a mano, sin pila
export const Artesania: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lupa = interpolate(t, [T.maquina - 0.2, T.maquina + 0.4], [0, 1], clamp);
  const sinPila = interpolate(t, [T.sinPila - 0.2, T.sinPila + 0.3], [0, 1], clamp);
  const zoom = interpolate(t, [T.cuesta - 0.3, T.final], [1, 1.08]);
  const pinza = 12 * Math.sin(t * 3);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <circle cx={540} cy={1000} r={380} fill="#14284A" stroke={ORO} strokeWidth={10} />
        <Rueda x={430} y={920} r={90} dientes={22} angulo={t * 20} />
        <Rueda x={600} y={820} r={55} dientes={14} angulo={-t * 34} />
        <Rueda x={640} y={1120} r={70} dientes={18} angulo={t * 26} />
        <Rueda x={440} y={1140} r={45} dientes={12} angulo={-t * 40} color={C.cyan} />
        <g transform={`translate(700 700) rotate(${120 * Math.sin(t * 6)})`}>
          <circle r={70} fill="none" stroke={ORO} strokeWidth={8} />
          <line x1={-70} y1={0} x2={70} y2={0} stroke={ORO} strokeWidth={6} />
        </g>
        {/* Lupa y pinzas del relojero */}
        <g opacity={lupa}>
          <circle cx={560} cy={1000} r={170} fill="rgba(255,255,255,0.06)" stroke={C.white} strokeWidth={10} />
          <line x1={680} y1={1120} x2={860} y2={1300} stroke={C.white} strokeWidth={26} strokeLinecap="round" />
          <path d={`M ${1000 + pinza} 560 L ${640} ${860} M ${1000 - pinza} 600 L ${660} ${880}`} stroke="#C8C4D8" strokeWidth={10} strokeLinecap="round" />
        </g>
      </g>
      {sinPila > 0 ? (
        <g opacity={sinPila} transform="translate(860 400)">
          <circle r={90} fill="#5A5675" stroke={METAL} strokeWidth={8} />
          <text y={18} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={56} fontWeight={700}>+</text>
          <line x1={-110} y1={-110} x2={110} y2={110} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
};
