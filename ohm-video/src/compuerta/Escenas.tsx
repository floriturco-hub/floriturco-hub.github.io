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

// Instantes clave (s) de public/audio/compuerta/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  te: 1.88,
  frotarlo: 4.18,
  final: 5.06,
  el: 7.66,
  finos: 9.56,
  tacto: 11.14,
  gruesos: 13.12,
  los: 14.92,
  medula: 15.98,
  compuerta: 17.78,
  cuando: 19.68,
  inundas: 20.44,
  esas: 22.82,
  cierran: 24.64,
  asi: 26.86,
  sube: 28.02,
  no: 29.32,
  filtro: 30.82,
  aparatos: 33.7,
  corrientes: 35.26,
  porEso: 36.56,
  fin: 38.24,
};

const PIEL = "#E8B890";
const DOLOR = C.red;
const TACTO = C.cyan;

// Brazo doblado con el codo en (x,y)
const Brazo: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -380 -260 L -40 -40" stroke={PIEL} strokeWidth={110} strokeLinecap="round" />
    <path d="M -40 -40 L 300 -220" stroke={PIEL} strokeWidth={95} strokeLinecap="round" />
    <circle cx={330} cy={-240} r={60} fill={PIEL} />
  </g>
);

// Estrella de dolor
const Estrella: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op: number }> = ({ x, y, s, op }) => (
  <polygon
    points={new Array(16)
      .fill(0)
      .map((_, k) => {
        const r = k % 2 ? 40 : 90;
        const a = (k / 16) * Math.PI * 2;
        return `${x + Math.cos(a) * r * s},${y + Math.sin(a) * r * s}`;
      })
      .join(" ")}
    fill={DOLOR}
    opacity={op}
  />
);

// Mano que frota
const ManoFrota: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) => (
  <g transform={`translate(${x + Math.sin(t * 12) * 40} ${y})`} opacity={op}>
    <rect x={-80} y={-60} width={160} height={120} rx={50} fill="#D8A880" />
    {[-50, -17, 17, 50].map((dx) => (
      <rect key={dx} x={dx - 14} y={-150} width={28} height={100} rx={14} fill="#D8A880" />
    ))}
  </g>
);

// Imagen del gancho y del cierre: codo golpeado y mano frotando
const CodoGolpe: React.FC<{ readonly t: number; readonly mano: number; readonly q: number }> = ({ t, mano, q }) => (
  <>
    <Brazo x={560} y={1000} s={1.1} />
    <Estrella x={516} y={956} s={1.2 + Math.sin(t * 8) * 0.05} op={1 - mano * 0.5} />
    <ManoFrota x={516} y={900} t={t} op={mano} />
    <Texto x={540} y={1340} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué sobarte alivia el golpe?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.te], [1.12, 1])}>
        <CodoGolpe t={t} mano={interpolate(t, [0.6, 1.0], [0, 1], clamp)} q={interpolate(t, [0.9, 1.2], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.3} color={DOLOR} />
    </>
  );
};

// B. Te pegas en el codo y tu mano va sola a frotarlo + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.te, T.el], [1, 1.05])}>
      <Brazo x={560} y={900} s={0.9} />
      <Estrella x={524} y={864} s={1} op={1 - aparece(t, T.frotarlo) * 0.5} />
      <ManoFrota x={524} y={820} t={t} op={aparece(t, T.frotarlo - 0.6)} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.el], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={36}>
          ¿es solo un truco de tu mente? al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Pulsos por un nervio horizontal
const Nervio: React.FC<{ readonly y: number; readonly t: number; readonly color: string; readonly grosor: number; readonly vel: number; readonly op?: number; readonly hasta?: number }> = ({
  y,
  t,
  color,
  grosor,
  vel,
  op = 1,
  hasta = 980,
}) => (
  <g opacity={op}>
    <line x1={100} y1={y} x2={980} y2={y} stroke={color} strokeWidth={grosor} opacity={0.4} />
    {[0, 1, 2].map((k) => {
      const x = 100 + ((t * vel + k / 3) % 1) * 880;
      return <circle key={k} cx={Math.min(x, hasta)} cy={y} r={grosor + 8} fill={color} opacity={x > hasta ? 0.15 : 1} />;
    })}
  </g>
);

// C. El dolor viaja por nervios finos y lentos; el tacto por nervios gruesos y rápidos
export const Nervios: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.los], [1, 1.04])}>
      <Nervio y={720} t={t} color={DOLOR} grosor={6} vel={0.25} op={aparece(t, T.el + 0.4)} />
      <Texto x={540} y={650} size={38} color={DOLOR} op={aparece(t, T.finos)}>
        dolor: fino y lento
      </Texto>
      <Nervio y={1000} t={t} color={TACTO} grosor={18} vel={0.8} op={aparece(t, T.tacto)} />
      <Texto x={540} y={930} size={38} color={TACTO} op={aparece(t, T.gruesos)}>
        tacto: grueso y rápido
      </Texto>
    </Lienzo>
  );
};

// Médula con compuerta (apertura 1 = abierta) y cerebro arriba
const Medula: React.FC<{ readonly apertura: number; readonly t: number; readonly flujoTacto: number; readonly dolorPasa: number }> = ({ apertura, t, flujoTacto, dolorPasa }) => (
  <g>
    {/* cerebro */}
    <path d="M 380 560 Q 360 440 470 420 Q 540 380 610 420 Q 720 440 700 560 Q 690 620 540 620 Q 390 620 380 560 Z" fill="#E8A0B8" />
    {/* médula */}
    <rect x={500} y={620} width={80} height={700} rx={30} fill="#C8A0B8" opacity={0.6} />
    {/* compuerta */}
    <rect x={460} y={880} width={80 - 70 * apertura} height={24} fill={C.yellow} />
    <rect x={540 + 70 * apertura} y={880} width={80 - 70 * apertura} height={24} fill={C.yellow} />
    {/* señales de dolor que suben */}
    {[0, 1, 2].map((k) => {
      const u = (t * 0.35 + k / 3) % 1;
      const y = 1300 - u * 700;
      const bloqueada = y < 900 && dolorPasa < 0.5;
      return <circle key={k} cx={530} cy={bloqueada ? 910 : y} r={14} fill={DOLOR} opacity={bloqueada ? 0.25 : y < 640 ? 0 : 1} />;
    })}
    {/* señales de tacto (entran por el lado) */}
    {new Array(6).fill(0).map((_, k) => {
      const u = (t * 1.1 + k / 6) % 1;
      return <circle key={`t${k}`} cx={180 + u * 340} cy={1060 + (k % 2) * 40} r={16} fill={TACTO} opacity={flujoTacto} />;
    })}
  </g>
);

// D. Los dos llegan a la médula, que funciona como una compuerta antes del cerebro
export const Compuerta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.los, T.cuando], [1, 1.04])}>
      <Medula apertura={1} t={t} flujoTacto={0.3} dolorPasa={1} />
      <Texto x={790} y={1150} size={34} color={C.white} op={aparece(t, T.medula)}>
        médula espinal
      </Texto>
      <Texto x={790} y={900} size={36} color={C.yellow} op={aparece(t, T.compuerta)}>
        compuerta
      </Texto>
    </Lienzo>
  );
};

// E-F. Al frotar, las señales de tacto cierran parte de la compuerta: menos dolor sube
export const Frotar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cierra = interpolate(t, [T.cierran - 0.4, T.cierran + 0.6], [1, 0.1], suave);
  const menos = aparece(t, T.asi);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.no], [1, 1.04])}>
        <Medula apertura={cierra} t={t} flujoTacto={aparece(t, T.inundas)} dolorPasa={cierra > 0.5 ? 1 : 0} />
        <Texto x={270} y={1180} size={34} color={TACTO} op={aparece(t, T.inundas)}>
          ¡tacto!
        </Texto>
        <Texto x={790} y={900} size={36} color={C.yellow} op={aparece(t, T.cierran)}>
          se cierra
        </Texto>
        <g opacity={menos}>
          <Tarjeta x={740} y={430} w={280} h={150}>
            <Texto x={880} y={480} size={26} color={C.grey}>
              dolor
            </Texto>
            <rect x={770} y={510} width={220} height={30} rx={15} fill="#2A2440" />
            <rect x={770} y={510} width={220 * interpolate(t, [T.asi, T.sube + 0.4], [1, 0.3], clamp)} height={30} rx={15} fill={DOLOR} />
          </Tarjeta>
        </g>
      </Lienzo>
      <Flash t={t} d={T.cierran} color={C.yellow} />
    </>
  );
};

// G. No es imaginación: un filtro real, en el que se basan aparatos de pequeñas corrientes
export const Real: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.no, T.porEso], [1, 1.04])}>
      <Texto x={540} y={520} size={44} color={C.white} op={aparece(t, T.no)}>
        no es imaginación
      </Texto>
      <Texto x={540} y={590} size={36} color={C.yellow} op={aparece(t, T.filtro)}>
        es un filtro real del sistema nervioso
      </Texto>
      <g opacity={aparece(t, T.aparatos - 0.4)}>
        <rect x={180} y={900} width={720} height={200} rx={90} fill={PIEL} />
        <rect x={300} y={940} width={120} height={120} rx={16} fill="#E8E6F0" />
        <rect x={660} y={940} width={120} height={120} rx={16} fill="#E8E6F0" />
        <rect x={430} y={700} width={220} height={140} rx={20} fill="#3A3650" />
        <rect x={460} y={730} width={160} height={50} rx={8} fill="#0A1A10" />
        <path d="M 470 840 Q 400 880 360 940 M 610 840 Q 680 880 720 940" stroke="#C8C4D8" strokeWidth={6} fill="none" />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${380 + k * 60} 1000 l 10 -20 l 10 40 l 10 -20`}
            stroke={C.cyan}
            strokeWidth={5}
            fill="none"
            opacity={aparece(t, T.corrientes) * (0.4 + 0.6 * Math.abs(Math.sin(t * 6 + k)))}
          />
        ))}
      </g>
      <Texto x={540} y={1240} size={34} color={C.cyan} op={aparece(t, T.corrientes)}>
        pequeñas corrientes que alivian el dolor
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fin = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <CodoGolpe t={t} mano={fin} q={fin} />
    </Lienzo>
  );
};
