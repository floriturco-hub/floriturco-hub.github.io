import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cronostasis/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  miras: 1.92, // miras
  congelado: 4.12, // congelado
  largo: 5.38, // largo
  final: 6.82, // final
  mirar: 9.66, // mirar
  salto: 11.42, // salto
  sacada: 12.60, // sacada
  durante: 13.48, // durante
  apaga: 14.96, // apaga
  borroso: 16.70, // borroso
  ciego: 19.32, // ciego
  hueco: 20.86, // hueco
  rellena: 21.48, // rellena
  segundero: 24.02, // segundero
  alarga: 25.28, // alarga
  atras: 26.44, // atras
  mente: 29.36, // mente
  salto2: 31.36, // salto
  real: 32.48, // real
  porEso: 33.16, // por
  fin: 34.76, // FIN
};

// Reloj analógico; seg = posición del segundero (0-60)
const Reloj: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly seg: number }> = ({ x, y, r, seg }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={0} r={r} fill={C.white} stroke="#5A5478" strokeWidth={r * 0.06} />
    {new Array(12).fill(0).map((_, k) => (
      <line key={k} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.95} stroke="#141030" strokeWidth={r * 0.04} transform={`rotate(${k * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke="#141030" strokeWidth={r * 0.06} transform="rotate(300)" strokeLinecap="round" />
    <line x1={0} y1={0} x2={0} y2={-r * 0.7} stroke="#141030" strokeWidth={r * 0.04} transform="rotate(60)" strokeLinecap="round" />
    <line x1={0} y1={r * 0.15} x2={0} y2={-r * 0.85} stroke={C.red} strokeWidth={r * 0.02} transform={`rotate(${seg * 6})`} />
    <circle cx={0} cy={0} r={r * 0.05} fill={C.red} />
  </g>
);

// Ojo; mira hacia dx (-1 izquierda, 1 derecha)
const Ojo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly dx: number }> = ({ x, y, s, dx }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -120 0 Q 0 -90 120 0 Q 0 90 -120 0 Z" fill={C.white} />
    <circle cx={dx * 50} cy={0} r={46} fill="#3A7AB8" />
    <circle cx={dx * 50} cy={0} r={20} fill="#05040F" />
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Reloj x={540} y={920} r={330} seg={12} />
    <Texto x={540} y={520} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué ese segundo dura más?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.miras], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.red} />
    </>
  );
};

// B. Miras el reloj y el primer segundo parece congelado + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const e = Math.max(0, t - T.miras);
  const seg = 12 + (e < 2 ? 0 : Math.floor(e - 1));
  return (
    <Lienzo zoom={interpolate(t, [T.miras, T.mirar], [1, 1.04])}>
      <Reloj x={540} y={860} r={280} seg={seg} />
      <g opacity={aparece(t, T.congelado) * (1 - aparece(t, T.final))}>
        <rect x={290} y={1210} width={500} height={90} rx={18} fill={C.card} stroke={C.cyan} strokeWidth={4} />
        <Texto x={540} y={1270} size={40} color={C.cyan}>
          ¿congelado?
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.mirar], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          qué hace tu cerebro: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Tus ojos dan un salto rápido: una sacada; durante el salto el cerebro apaga la visión
export const Sacada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const salto = interpolate(t, [T.salto, T.salto + 0.25], [-1, 1], clamp);
  const negro = aparece(t, T.apaga) * (1 - aparece(t, T.hueco));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.mirar, T.hueco], [1, 1.04])}>
        <rect x={120} y={520} width={260} height={180} rx={10} fill="#C8A86A" />
        <Texto x={250} y={630} size={34} color="#5A3A1A">
          libro
        </Texto>
        <Reloj x={820} y={610} r={110} seg={12} />
        <Ojo x={540} y={980} s={1.4} dx={salto} />
        <g opacity={aparece(t, T.salto)}>
          <path d="M 330 760 Q 540 640 750 760" stroke={C.yellow} strokeWidth={8} fill="none" strokeDasharray="20 12" />
          <polygon points="750,760 714,742 726,776" fill={C.yellow} />
        </g>
        <rect x={-200} y={380} width={1480} height={1200} fill="#000" opacity={0.75 * negro} />
        <Texto x={540} y={1250} size={44} color={C.yellow} op={aparece(t, T.sacada) * (1 - aparece(t, T.apaga))}>
          sacada
        </Texto>
        <Texto x={540} y={1250} size={40} color={C.white} op={aparece(t, T.apaga) * (1 - aparece(t, T.ciego))}>
          el cerebro apaga la visión
        </Texto>
        <Texto x={540} y={1250} size={44} color={C.red} op={aparece(t, T.ciego)}>
          ¡ciego un instante!
        </Texto>
      </Lienzo>
    </>
  );
};

// D. Rellena el hueco con la primera imagen: el segundero; alarga el momento hacia atrás
export const Relleno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const relleno = interpolate(t, [T.alarga, T.atras + 0.6], [0, 1], clamp);
  const x0 = 140;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.hueco, T.mente], [1, 1.04])}>
        <Reloj x={540} y={640} r={180} seg={12} />
        <rect x={x0} y={1000} width={240} height={100} fill="#000" stroke={C.grey} strokeWidth={4} />
        <Texto x={x0 + 120} y={1065} size={30} color={C.grey}>
          salto
        </Texto>
        <rect x={x0 + 240} y={1000} width={300} height={100} fill={C.red} opacity={0.7} />
        <Texto x={x0 + 390} y={1065} size={30} color={C.white}>
          1 s
        </Texto>
        <rect x={x0 + 540} y={1000} width={260} height={100} fill="#5A5478" />
        <Texto x={x0 + 670} y={1065} size={30} color={C.white}>
          2 s
        </Texto>
        <rect x={x0 + 240 - 240 * relleno} y={1000} width={240 * relleno} height={100} fill={C.red} opacity={0.5} />
        <path d={`M ${x0 + 240} 1150 L ${x0 + 240 - 240 * relleno} 1150`} stroke={C.yellow} strokeWidth={8} opacity={aparece(t, T.alarga)} />
        <Texto x={540} y={1250} size={38} color={C.yellow} op={aparece(t, T.rellena) * (1 - aparece(t, T.alarga))}>
          rellena el hueco con el segundero
        </Texto>
        <Texto x={540} y={1250} size={40} color={C.yellow} op={aparece(t, T.alarga)}>
          lo alarga hacia atrás
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.alarga} color={C.red} />
    </>
  );
};

// E. En tu mente, ese primer segundo dura el salto más el segundo real
export const Suma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.mente, T.porEso], [1, 1.04])}>
      <rect x={140} y={820} width={540} height={130} fill={C.red} opacity={0.75} />
      <rect x={680} y={820} width={260} height={130} fill="#5A5478" />
      <Texto x={410} y={900} size={40} color={C.white}>
        «1 segundo»
      </Texto>
      <g opacity={aparece(t, T.salto2)}>
        <path d="M 140 1000 L 380 1000 M 140 980 L 140 1020 M 380 980 L 380 1020" stroke={C.grey} strokeWidth={5} />
        <Texto x={260} y={1060} size={32} color={C.grey}>
          salto
        </Texto>
      </g>
      <g opacity={aparece(t, T.real)}>
        <path d="M 380 1000 L 680 1000 M 680 980 L 680 1020" stroke={C.red} strokeWidth={5} />
        <Texto x={530} y={1060} size={32} color={C.red}>
          + segundo real
        </Texto>
      </g>
      <Texto x={540} y={700} size={44} color={C.white} op={aparece(t, T.mente)}>
        en tu mente
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
