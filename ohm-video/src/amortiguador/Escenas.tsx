import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/amortiguador/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  rueda: 2.04, // rueda
  resorte: 2.82, // resorte
  baches: 3.54, // baches
  rebotaria: 5.68, // rebotaria
  final: 7.84, // final
  guarda: 11.52, // guarda
  devuelve: 13.30, // devuelve
  oscilando: 15.60, // oscilando
  dentro: 17.12, // dentro
  amortiguador: 18.30, // amortiguador
  aceite: 20.14, // aceite
  piston: 20.82, // piston
  agujeros: 23.66, // agujeros
  frena: 25.24, // frena
  calor: 28.04, // calor
  vaiven: 30.78, // vaiven
  empuja: 31.56, // empuja
  gastados: 36.38, // gastados
  porEso: 37.24, // por
  fin: 39.00, // FIN
};

const ACEITE = "#C8A040";

// Auto de perfil; dy = desplazamiento vertical de la carrocería
const Auto: React.FC<{ readonly x: number; readonly y: number; readonly dy: number; readonly rot?: number; readonly s?: number }> = ({ x, y, dy, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`translate(0 ${dy}) rotate(${rot})`}>
      <path d="M -380 -40 L -380 -150 L -230 -160 L -140 -290 L 180 -290 L 290 -160 L 400 -140 L 400 -40 Z" fill={C.cyan} />
      <path d="M -120 -270 L 160 -270 L 250 -170 L -200 -170 Z" fill="#1A2A3A" opacity={0.8} />
    </g>
    <circle cx={-240} cy={20} r={70} fill="#111" />
    <circle cx={260} cy={20} r={70} fill="#111" />
    <circle cx={-240} cy={20} r={28} fill="#8A8A96" />
    <circle cx={260} cy={20} r={28} fill="#8A8A96" />
  </g>
);

const Calle: React.FC<{ readonly y: number; readonly t: number; readonly bache?: number }> = ({ y, t, bache = 0 }) => (
  <g>
    <rect x={0} y={y} width={1080} height={300} fill="#3A3A44" />
    {bache > 0 ? <ellipse cx={1200 - ((t * 500) % 1500)} cy={y} rx={70} ry={26} fill="#5A5A66" /> : null}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Calle y={1180} t={t} />
    <Auto x={540} y={1100} dy={-60 * Math.abs(Math.sin(t * 5))} rot={3 * Math.sin(t * 5)} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este auto no rebota?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.rueda], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Cada rueda tiene un resorte; solo con eso, el auto rebotaría por toda la calle + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rebote = aparece(t, T.rebotaria);
  return (
    <Lienzo zoom={interpolate(t, [T.rueda, T.guarda], [1, 1.04])}>
      <Calle y={1180} t={t} bache={aparece(t, T.baches)} />
      <Auto x={540} y={1100} dy={-70 * rebote * Math.abs(Math.sin(t * 5))} rot={4 * rebote * Math.sin(t * 5)} />
      <g opacity={aparece(t, T.resorte)}>
        <path d={`M 300 ${1060} ${new Array(8).fill(0).map((_, k) => `l ${k % 2 ? -26 : 26} -14`).join(" ")}`} stroke={C.yellow} strokeWidth={8} fill="none" />
        <path d={`M 800 ${1060} ${new Array(8).fill(0).map((_, k) => `l ${k % 2 ? -26 : 26} -14`).join(" ")}`} stroke={C.yellow} strokeWidth={8} fill="none" />
      </g>
      <Texto x={540} y={1400} size={42} color={C.orange} op={rebote}>
        ¡boing, boing, boing!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿están gastados los tuyos?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.guarda], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Resorte vertical entre y1 (arriba) y y2 (abajo)
const Muelle: React.FC<{ readonly x: number; readonly y1: number; readonly y2: number; readonly w?: number; readonly col?: string }> = ({ x, y1, y2, w = 110, col = C.yellow }) => {
  const n = 12;
  const pts = new Array(n + 1).fill(0).map((_, i) => `${i === 0 || i === n ? x : x + (i % 2 ? w : -w)} ${y1 + ((y2 - y1) * i) / n}`);
  return <path d={`M ${pts.join(" L ")}`} stroke={col} strokeWidth={14} fill="none" strokeLinejoin="round" />;
};

// C. Un resorte guarda la energía del golpe y la devuelve: sube, baja y sigue oscilando
export const Resorte: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = 120 * Math.sin(t * 6) * aparece(t, T.guarda);
  return (
    <Lienzo zoom={interpolate(t, [T.guarda, T.dentro], [1, 1.04])}>
      <rect x={180} y={600 + d} width={300} height={120} rx={16} fill={C.cyan} />
      <Muelle x={330} y1={720 + d} y2={1300} />
      <rect x={180} y={1300} width={300} height={40} fill="#5A5A66" />
      <path
        d={`M 560 950 ${new Array(80)
          .fill(0)
          .map((_, i) => `L ${560 + i * 5} ${950 - 120 * Math.sin(i * 0.3) * aparece(t, T.devuelve)}`)
          .join(" ")}`}
        stroke={C.yellow}
        strokeWidth={6}
        fill="none"
      />
      <Texto x={760} y={760} size={34} color={C.white} op={aparece(t, T.guarda)}>
        guarda la energía…
      </Texto>
      <Texto x={760} y={1150} size={34} color={C.white} op={aparece(t, T.devuelve)}>
        …y la devuelve
      </Texto>
      <Texto x={540} y={1460} size={40} color={C.orange} op={aparece(t, T.oscilando)}>
        sigue oscilando
      </Texto>
    </Lienzo>
  );
};

// Amortiguador en corte con el resorte alrededor; d = compresión
const Amort: React.FC<{ readonly x: number; readonly y: number; readonly d: number; readonly t: number; readonly flujo: number; readonly s?: number }> = ({ x, y, d, t, flujo, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-120} width={140} height={520} rx={20} fill="#3A3A44" />
    <rect x={-56} y={-100} width={112} height={480} rx={12} fill={ACEITE} opacity={0.7} />
    <rect x={-56} y={60 + d} width={112} height={40} fill="#C8C8D4" />
    {[-30, 0, 30].map((dx) => (
      <rect key={dx} x={dx - 5} y={60 + d} width={10} height={40} fill="#1A1A22" />
    ))}
    <rect x={-14} y={-380 + d} width={28} height={440} fill="#C8C8D4" />
    <rect x={-120} y={-420 + d} width={240} height={40} rx={10} fill="#5A5A66" />
    {flujo > 0
      ? [-30, 0, 30].map((dx, k) => {
          const u = (t * 1.2 + k / 3) % 1;
          return <circle key={dx} cx={dx} cy={100 + d + u * 60 * Math.sign(Math.cos(t * 4))} r={6} fill="#F8E0A0" opacity={flujo} />;
        })
      : null}
  </g>
);

// D. Dentro del resorte, un amortiguador: tubo de aceite con un pistón que empuja el aceite por agujeros diminutos
export const Dentro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = 50 * Math.sin(t * 4);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.dentro, T.calor], [1, 1.04])}>
        <Amort x={400} y={1050} d={d} t={t} flujo={aparece(t, T.agujeros)} />
        <g opacity={0.6}>
          <Muelle x={400} y1={630 + d} y2={1440} w={150} />
        </g>
        <Texto x={760} y={700} size={40} color={C.yellow} op={aparece(t, T.amortiguador)}>
          amortiguador
        </Texto>
        <Texto x={760} y={880} size={34} color={ACEITE} op={aparece(t, T.aceite)}>
          tubo con aceite
        </Texto>
        <Texto x={760} y={1150} size={34} color="#C8C8D4" op={aparece(t, T.piston)}>
          pistón
        </Texto>
        <Texto x={760} y={1210} size={30} color="#F8E0A0" op={aparece(t, T.agujeros)}>
          agujeros diminutos
        </Texto>
        <Texto x={540} y={1530} size={40} color={C.white} op={aparece(t, T.frena)}>
          el aceite frena el movimiento
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.amortiguador} color={C.yellow} />
    </>
  );
};

// E. La energía se convierte en calor y el auto se calma tras un solo vaivén
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.calor, T.empuja], [1, 1.04])}>
      <line x1={120} y1={950} x2={960} y2={950} stroke={C.grey} strokeWidth={3} />
      <path
        d={`M 120 950 ${new Array(160)
          .fill(0)
          .map((_, i) => `L ${120 + i * 5.25} ${950 - 200 * Math.sin(i * 0.12) * 0.5}`)
          .join(" ")}`}
        stroke={C.red}
        strokeWidth={4}
        fill="none"
        opacity={0.5}
      />
      <path
        d={`M 120 950 ${new Array(160)
          .fill(0)
          .map((_, i) => `L ${120 + i * 5.25} ${950 - 200 * Math.sin(i * 0.12) * Math.exp(-i * 0.03)}`)
          .join(" ")}`}
        stroke={C.yellow}
        strokeWidth={8}
        fill="none"
        opacity={aparece(t, T.vaiven)}
      />
      <Texto x={780} y={760} size={32} color={C.red}>
        solo resorte
      </Texto>
      <Texto x={540} y={1250} size={38} color={C.yellow} op={aparece(t, T.vaiven)}>
        con amortiguador: un solo vaivén
      </Texto>
      <g opacity={aparece(t, T.calor)}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${430 + k * 110} ${640 - ((t * 60 + k * 20) % 60)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke={C.orange} strokeWidth={8} fill="none" opacity={0.7} />
        ))}
        <Texto x={540} y={1330} size={34} color={C.orange}>
          la energía se va como calor
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Empuja una esquina del auto y suéltala: si rebota más de una o dos veces, están gastados
export const Prueba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tt = Math.max(0, t - T.empuja - 0.6);
  const bueno = -40 * Math.exp(-tt * 3) * Math.cos(tt * 8);
  const malo = -40 * Math.exp(-tt * 0.5) * Math.cos(tt * 8);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.empuja, T.porEso], [1, 1.04])}>
        <Calle y={1300} t={t} />
        <Auto x={540} y={1220} dy={t < T.empuja + 0.6 ? 40 * aparece(t, T.empuja) : aparece(t, T.gastados) ? malo : bueno} s={0.9} />
        <path d="M 900 700 L 860 900" stroke="#E0A888" strokeWidth={50} strokeLinecap="round" opacity={t < T.empuja + 0.6 ? aparece(t, T.empuja) : 0} />
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.empuja)}>
          empuja una esquina y suelta
        </Texto>
        <Texto x={540} y={1480} size={40} color={C.red} op={aparece(t, T.gastados)}>
          ¿sigue rebotando? → gastados
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.gastados} color={C.red} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
