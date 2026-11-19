import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/anestesia/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  pero: 2.18,
  cara: 4.16,
  final: 4.78,
  de: 6.3,
  nervios: 7.26,
  dolor: 9.16,
  aislante: 11.08,
  tacto: 11.98,
  gruesos: 13.4,
  mielina: 14.8,
  anestesia: 17.04,
  canales: 18.26,
  puertas: 19.42,
  senal: 20.74,
  finos: 21.88,
  apagan: 22.9,
  poca: 23.88,
  taladro: 26.0,
  noDuele: 26.4,
  gruesosAg: 27.22,
  empujon: 29.02,
  hueso: 30.42,
  lejos: 32.98,
  porEso: 34.36,
  presion: 35.12,
  noDolor: 35.92,
  porque: 36.9,
  fin: 39.16,
};

const DIENTE = "#F2EFE6";
const DOLOR = C.red;
const TACTO = C.cyan;
const MIELINA = "#E8D8A0";
const ANEST = "#5AC878";

// Muela con raíces
const Muela: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -120 -60 Q -130 -150 -60 -140 Q 0 -120 60 -140 Q 130 -150 120 -60 Q 115 20 80 40 L 60 170 Q 50 190 35 170 L 15 70 L -15 70 L -35 170 Q -50 190 -60 170 L -80 40 Q -115 20 -120 -60 Z"
      fill={DIENTE}
    />
  </g>
);

// Taladro del dentista
const Taladro: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) rotate(-35) scale(${s})`}>
    <rect x={0} y={-22} width={300} height={44} rx={22} fill="#A8A4C0" />
    <rect x={-60} y={-14} width={70} height={28} rx={10} fill="#C8C4D8" />
    <rect x={-100} y={-5 + Math.sin(t * 60) * 2} width={50} height={10} rx={4} fill="#E8E6F0" />
  </g>
);

// Rayos de dolor
const Rayo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op: number }> = ({ x, y, s, op }) => (
  <path d="M 0 -60 L -25 5 L 5 5 L -15 60 L 30 -10 L 0 -10 L 15 -60 Z" transform={`translate(${x} ${y}) scale(${s})`} fill={C.yellow} opacity={op} />
);

// Imagen del gancho y del cierre: muela, taladro y dolor apagado
const MuelaTaladro: React.FC<{ readonly t: number; readonly apaga: number }> = ({ t, apaga }) => (
  <>
    <circle cx={540} cy={880} r={330} fill={ANEST} opacity={0.08 * apaga} />
    <Muela x={540} y={900} s={1.7} />
    <Taladro x={760} y={620} s={1} t={t} />
    {[0, 1, 2].map((k) => (
      <Rayo key={k} x={300 + k * 240} y={620 + (k % 2) * 60} s={1} op={1 - apaga} />
    ))}
    <g opacity={apaga} transform="translate(540 1300)">
      <rect x={-130} y={-50} width={260} height={100} rx={50} fill="#2A2440" />
      <circle cx={-70} cy={0} r={40} fill={C.grey} />
      <Texto x={40} y={14} size={40} color={C.white}>
        OFF
      </Texto>
    </g>
  </>
);

// A. Gancho: el dentista te apaga solo el dolor
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pero], [1.12, 1])}>
        <MuelaTaladro t={t} apaga={interpolate(t, [0.7, 1.1], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.7} color={ANEST} />
    </>
  );
};

// Cara de frente con mano que empuja
const Cara: React.FC<{ readonly t: number; readonly empuja: number }> = ({ t, empuja }) => {
  const d = Math.sin(t * 6) * 14 * empuja;
  return (
    <g>
      <g transform={`translate(${d} 0)`}>
        <ellipse cx={540} cy={820} rx={240} ry={300} fill="#E8B890" />
        <circle cx={460} cy={740} r={22} fill="#1A1010" />
        <circle cx={620} cy={740} r={22} fill="#1A1010" />
        <ellipse cx={540} cy={960} rx={70} ry={40} fill="#5A1A20" />
      </g>
      <g opacity={empuja} transform={`translate(${-d * 1.5} 0)`}>
        <rect x={830} y={860} width={200} height={110} rx={50} fill="#C8E0F0" />
        <path d="M 820 900 L 760 900" stroke={C.yellow} strokeWidth={14} strokeLinecap="round" />
        <path d="M 760 870 L 720 900 L 760 930 Z" fill={C.yellow} />
      </g>
    </g>
  );
};

// B. Sigues sintiendo cómo te empujan la cara + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.de], [1, 1.05])}>
      <Cara t={t} empuja={aparece(t, T.pero + 0.6)} />
      <Texto x={540} y={1200} size={40} color={C.yellow} op={aparece(t, T.cara)}>
        presión: sí se siente
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1270} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1270}
          width={700 * interpolate(t, [T.final, T.de], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1370} color={C.white} size={40}>
          por qué: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Pulso que viaja por un cable horizontal
const Pulso: React.FC<{ readonly x0: number; readonly x1: number; readonly y: number; readonly t: number; readonly color: string; readonly op: number; readonly hasta?: number }> = ({
  x0,
  x1,
  y,
  t,
  color,
  op,
  hasta = 1,
}) => (
  <g>
    {[0, 1, 2].map((k) => {
      const u = (t * 0.8 + k / 3) % 1;
      const visible = u <= hasta;
      return <circle key={k} cx={x0 + (x1 - x0) * u} cy={y} r={18} fill={color} opacity={op * (visible ? 1 : 0)} />;
    })}
  </g>
);

// C. De la muela salen nervios: los del dolor son finos y casi sin aislante
export const Cables: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fino = aparece(t, T.dolor);
  return (
    <Lienzo zoom={interpolate(t, [T.de, T.tacto], [1, 1.04])}>
      <Muela x={220} y={820} s={0.9} />
      <g opacity={aparece(t, T.nervios)}>
        <path d="M 260 960 Q 400 900 1000 900" stroke={DOLOR} strokeWidth={8} fill="none" />
        <path d="M 200 960 Q 380 1060 1000 1060" stroke={TACTO} strokeWidth={30} fill="none" opacity={1 - fino * 0.7} />
      </g>
      <g opacity={fino}>
        <Pulso x0={400} x1={1000} y={900} t={t} color={DOLOR} op={1} />
        <Texto x={700} y={850} size={36} color={DOLOR}>
          dolor: fino
        </Texto>
        <Texto x={700} y={1180} size={36} color={C.white} op={aparece(t, T.aislante)}>
          casi sin aislante
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Los del tacto y la presión son gruesos y envueltos en mielina
export const Gruesos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mielina = aparece(t, T.mielina);
  return (
    <Lienzo zoom={interpolate(t, [T.tacto, T.anestesia], [1, 1.04])}>
      <rect x={60} y={830} width={960} height={40} rx={20} fill={TACTO} />
      {new Array(6).fill(0).map((_, k) => (
        <rect key={k} x={80 + k * 160} y={790} width={130} height={120} rx={50} fill={MIELINA} opacity={mielina} />
      ))}
      <Pulso x0={60} x1={1020} y={850} t={t * 1.4} color={C.white} op={aparece(t, T.gruesos)} />
      <Texto x={540} y={700} size={40} color={TACTO} op={aparece(t, T.tacto)}>
        tacto y presión: grueso
      </Texto>
      <Texto x={540} y={1040} size={40} color={MIELINA} op={mielina}>
        mielina = aislante
      </Texto>
    </Lienzo>
  );
};

// E. La anestesia bloquea los canales de sodio por donde viaja la señal
export const Canales: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapa = interpolate(t, [T.senal - 0.4, T.finos - 0.2], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.anestesia, T.finos], [1, 1.04])}>
      <rect x={60} y={820} width={960} height={80} fill="#5A3A5A" />
      {[0, 1, 2].map((k) => {
        const x = 240 + k * 300;
        const abierto = tapa < 0.9;
        return (
          <g key={k} opacity={aparece(t, T.canales)}>
            <rect x={x - 70} y={790} width={50} height={140} rx={18} fill="#C85A88" />
            <rect x={x + 20} y={790} width={50} height={140} rx={18} fill="#C85A88" />
            {new Array(3).fill(0).map((__, j) => {
              const u = (t * 1.2 + j / 3 + k * 0.2) % 1;
              return (
                <g key={j} opacity={abierto ? Math.sin(u * Math.PI) : 0}>
                  <circle cx={x} cy={680 + u * 300} r={18} fill={C.yellow} />
                  <text x={x} y={688 + u * 300} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.bg} fontFamily="JetBrains Mono">
                    Na
                  </text>
                </g>
              );
            })}
            <circle cx={x} cy={interpolate(tapa, [0, 1], [600, 860])} r={26} fill={ANEST} opacity={aparece(t, T.anestesia + 0.3)} />
          </g>
        );
      })}
      <Texto x={540} y={1060} size={40} color={C.yellow} op={aparece(t, T.puertas) * (1 - tapa)}>
        puertas de sodio
      </Texto>
      <Texto x={540} y={1060} size={40} color={ANEST} op={tapa}>
        bloqueadas: no pasa la señal
      </Texto>
      <g opacity={aparece(t, T.anestesia + 0.3)}>
        <circle cx={300} cy={1180} r={20} fill={ANEST} />
        <Texto x={340} y={1192} size={34} color={ANEST} anchor="start">
          anestesia
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Los cables finos se apagan primero con poca anestesia: el taladro no duele
export const Finos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const apaga = aparece(t, T.apagan);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.finos, T.gruesosAg], [1, 1.04])}>
        <line x1={80} y1={760} x2={1000} y2={760} stroke={DOLOR} strokeWidth={8} />
        <rect x={80} y={960} width={920} height={30} rx={15} fill={TACTO} />
        {new Array(5).fill(0).map((_, k) => (
          <rect key={k} x={100 + k * 185} y={935} width={150} height={80} rx={36} fill={MIELINA} />
        ))}
        {new Array(4).fill(0).map((_, k) => (
          <circle key={k} cx={480 + k * 40} cy={760 + Math.sin(k * 2) * 20} r={14} fill={ANEST} opacity={aparece(t, T.finos + k * 0.15)} />
        ))}
        <Pulso x0={80} x1={1000} y={760} t={t} color={DOLOR} op={1} hasta={apaga > 0.5 ? 0.42 : 1} />
        <Pulso x0={80} x1={1000} y={975} t={t * 1.3} color={C.white} op={1} />
        <Texto x={540} y={700} size={36} color={DOLOR} op={apaga}>
          dolor: apagado
        </Texto>
        <Texto x={540} y={1100} size={36} color={TACTO}>
          presión: sigue
        </Texto>
        <g opacity={aparece(t, T.taladro)}>
          <Taladro x={720} y={1300} s={0.6} t={t} />
          <Texto x={420} y={1300} size={40} color={ANEST} op={aparece(t, T.noDuele)}>
            no duele
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.apagan} color={ANEST} />
    </>
  );
};

// G. Los gruesos aguantan más; hueso y músculos de la mandíbula tienen nervios lejos de la inyección
export const Empujon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mand = aparece(t, T.hueso);
  return (
    <Lienzo zoom={interpolate(t, [T.gruesosAg, T.porEso], [1, 1.04])}>
      {/* mandíbula de perfil */}
      <path d="M 180 640 L 260 1060 Q 300 1160 460 1160 L 900 1120 Q 960 1100 940 1040 L 880 960 L 420 980 L 360 640 Z" fill="#E8DCC0" opacity={0.9} />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={480 + k * 100} y={900} width={80} height={80} rx={20} fill={DIENTE} />
      ))}
      {/* zona dormida por la inyección */}
      <circle cx={680} cy={960} r={170} fill={ANEST} opacity={0.18} stroke={ANEST} strokeWidth={6} strokeDasharray="20 14" />
      <Texto x={680} y={760} size={32} color={ANEST}>
        zona dormida
      </Texto>
      {/* músculo masetero y su nervio */}
      <g opacity={mand}>
        <path d="M 200 560 Q 330 620 300 900 Q 260 960 220 900 Q 160 700 200 560 Z" fill="#C85A60" opacity={0.85} />
        <path d="M 250 560 Q 260 480 340 440" stroke={TACTO} strokeWidth={12} fill="none" />
        <Pulso x0={250} x1={340} y={480} t={t * 1.2} color={C.white} op={1} />
        <Texto x={330} y={1260} size={36} color={C.white}>
          hueso y músculos
        </Texto>
      </g>
      <Texto x={540} y={1360} size={36} color={TACTO} op={aparece(t, T.lejos)}>
        sus nervios: lejos de la inyección
      </Texto>
    </Lienzo>
  );
};

// H. Por eso sientes presión, pero no dolor
export const Resumen: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.porque], [1, 1.05])}>
      <Tarjeta x={160} y={620} w={760} h={180} op={aparece(t, T.presion)}>
        <Texto x={300} y={730} size={50} color={TACTO} anchor="start">
          presión
        </Texto>
        <path d="M 780 710 L 810 745 L 870 670" stroke="#5AC878" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Tarjeta>
      <Tarjeta x={160} y={860} w={760} h={180} op={aparece(t, T.noDolor)}>
        <Texto x={300} y={970} size={50} color={DOLOR} anchor="start">
          dolor
        </Texto>
        <path d="M 785 915 L 855 985 M 855 915 L 785 985" stroke={DOLOR} strokeWidth={16} strokeLinecap="round" />
      </Tarjeta>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <MuelaTaladro t={t} apaga={1} />
    </Lienzo>
  );
};
