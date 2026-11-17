import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/naranja/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  lavas: 2.22, // lavas
  amargo: 4.76, // amargo
  final: 6.90, // final
  culpable: 8.76, // culpable
  lauril: 11.06, // lauril
  espuma: 13.06, // espuma
  primero: 13.76, // primero
  receptores: 15.40, // receptores
  azucar: 18.10, // azucar
  segundo: 19.36, // segundo
  grasas: 20.76, // grasas
  amargo2: 23.30, // amargo
  dulzor: 25.28, // dulzor
  dispara: 26.98, // dispara
  evitarlo: 27.96, // evitarlo
  treinta: 29.06, // treinta
  pasta: 30.70, // pasta
  porEso: 32.34, // por
  fin: 34.14, // FIN
};

const JUGO = "#F8A030";
const LENGUA = "#E8829A";
const DULCE = "#F8C8E8";
const AMARGO = "#6AC84A";

const Vaso: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly nivel?: number }> = ({ x, y, s, nivel = 0.8 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 -200 L -90 200 L 90 200 L 110 -200 Z" fill="#8AC8F8" opacity={0.25} stroke={C.white} strokeWidth={6} />
    <path d={`M ${-110 + 20 * (1 - nivel)} ${200 - 400 * nivel} L -90 196 L 90 196 L ${110 - 20 * (1 - nivel)} ${200 - 400 * nivel} Z`} fill={JUGO} />
    <circle cx={60} cy={-190} r={50} fill={JUGO} stroke="#F8D060" strokeWidth={8} />
  </g>
);

const Cepillo: React.FC<{ readonly x: number; readonly y: number; readonly rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-20} y={-40} width={40} height={300} rx={18} fill="#3A8AE8" />
    <rect x={-26} y={-120} width={52} height={90} rx={8} fill={C.white} />
    <path d="M -24 -130 q 10 -30 24 -6 q 14 -28 24 6" fill="#8AE8F8" />
  </g>
);

// Cara simple: gesto 0 = neutro, 1 = asco
const Cara: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly asco: number }> = ({ x, y, s, asco }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={150} fill="#E8B48A" />
    <path d={`M -70 -40 l 40 ${10 * asco}`} stroke="#111" strokeWidth={10} strokeLinecap="round" />
    <path d={`M 70 -40 l -40 ${10 * asco}`} stroke="#111" strokeWidth={10} strokeLinecap="round" />
    <path d={asco > 0.5 ? "M -60 70 q 15 -20 30 0 q 15 20 30 0 q 15 -20 30 0 q 15 20 30 0" : "M -50 60 q 50 30 100 0"} stroke="#111" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

// Lengua con receptores de dulce (bloqueo 0-1) y de amargo (protección 0-1)
const Lengua: React.FC<{ readonly bloqueo: number; readonly escudo: number; readonly amargo: number; readonly t: number }> = ({ bloqueo, escudo, amargo, t }) => (
  <g>
    <path d="M 160 1150 Q 160 650 540 640 Q 920 650 920 1150 Z" fill={LENGUA} />
    <line x1={540} y1={700} x2={540} y2={1100} stroke="#C86A7A" strokeWidth={6} />
    {[0, 1, 2, 3].map((k) => {
      const x = 300 + k * 160;
      return (
        <g key={`d${k}`}>
          <circle cx={x} cy={800} r={34} fill={DULCE} opacity={1 - bloqueo * 0.7} />
          <Texto x={x} y={812} size={24} color="#8A2A5A">
            D
          </Texto>
          <g opacity={bloqueo}>
            <line x1={x - 30} y1={770} x2={x + 30} y2={830} stroke="#3A3650" strokeWidth={8} />
            <line x1={x + 30} y1={770} x2={x - 30} y2={830} stroke="#3A3650" strokeWidth={8} />
          </g>
        </g>
      );
    })}
    {[0, 1, 2].map((k) => {
      const x = 380 + k * 160;
      const brilla = amargo * (0.6 + 0.4 * Math.sin(t * 8 + k));
      return (
        <g key={`a${k}`}>
          <circle cx={x} cy={980} r={34 + 10 * brilla} fill={AMARGO} opacity={0.4 + 0.6 * brilla} />
          <Texto x={x} y={992} size={24} color="#1A3A1A">
            A
          </Texto>
          <path d={`M ${x - 50} 960 A 52 52 0 0 1 ${x + 50} 960`} stroke={C.yellow} strokeWidth={10} fill="none" opacity={escudo} />
        </g>
      );
    })}
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Vaso x={420} y={980} s={1.3} />
    <Cepillo x={760} y={1000} rot={20} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué sabe horrible este jugo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.lavas], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={JUGO} />
    </>
  );
};

// B. Te lavas los dientes, tomas jugo y sabe amargo y metálico + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const jugo = aparece(t, T.lavas + 1.2);
  return (
    <Lienzo zoom={interpolate(t, [T.lavas, T.culpable], [1, 1.04])}>
      <Cara x={540} y={820} s={1.2} asco={aparece(t, T.amargo)} />
      <g opacity={1 - jugo}>
        <Cepillo x={700 + Math.sin(t * 20) * 20} y={900} rot={70} />
      </g>
      <g opacity={jugo}>
        <Vaso x={760} y={980} s={0.6} nivel={0.6} />
      </g>
      <Texto x={540} y={1130} size={42} color={AMARGO} op={aparece(t, T.amargo)}>
        amargo, metálico
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.culpable], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          cómo evitarlo: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El culpable: el laurilsulfato de sodio, el que hace la espuma
export const Culpable: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.culpable, T.primero], [1, 1.04])}>
      <g transform="translate(540 900) rotate(-20)">
        <rect x={-300} y={-80} width={500} height={160} rx={30} fill={C.white} />
        <rect x={200} y={-40} width={80} height={80} rx={10} fill="#3A8AE8" />
        <Texto x={-50} y={14} size={40} color="#3A8AE8">
          PASTA
        </Texto>
      </g>
      <g opacity={aparece(t, T.espuma)}>
        {new Array(14).fill(0).map((_, k) => (
          <circle key={k} cx={800 + Math.sin(k * 1.7) * 90} cy={720 - (k % 5) * 40 + Math.cos(t * 3 + k) * 6} r={20 + (k % 3) * 10} fill={C.white} opacity={0.85} />
        ))}
      </g>
      <Texto x={540} y={1180} size={40} color={C.cyan} op={aparece(t, T.lauril)}>
        laurilsulfato de sodio
      </Texto>
      <Texto x={540} y={1250} size={34} color={C.grey} op={aparece(t, T.espuma)}>
        el que hace la espuma
      </Texto>
    </Lienzo>
  );
};

// D. Primero apaga los receptores del dulce; segundo rompe las grasas que frenan el amargo
export const Receptores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bloqueo = aparece(t, T.receptores + 0.5);
  const escudo = 1 - interpolate(t, [T.grasas, T.amargo2 + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.primero, T.dulzor], [1, 1.04])}>
        <Lengua bloqueo={bloqueo} escudo={escudo} amargo={aparece(t, T.amargo2)} t={t} />
        {[0, 1, 2].map((k) => {
          const u = (t * 0.8 + k / 3) % 1;
          return <rect key={k} x={330 + k * 180} y={500 + u * 240 - (u > 0.7 ? (u - 0.7) * 600 : 0)} width={36} height={36} fill={C.white} opacity={aparece(t, T.azucar)} />;
        })}
        <Texto x={540} y={560} size={36} color={DULCE} op={aparece(t, T.primero) * (1 - aparece(t, T.segundo))}>
          1. apaga el dulce
        </Texto>
        <Texto x={540} y={560} size={36} color={C.yellow} op={aparece(t, T.segundo)}>
          2. rompe la grasa protectora
        </Texto>
        <Texto x={540} y={1260} size={36} color={AMARGO} op={aparece(t, T.amargo2)}>
          el amargo queda libre
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.amargo2} color={AMARGO} />
    </>
  );
};

// E. El jugo pierde su dulzor y su lado amargo se dispara
export const Balanza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const inc = interpolate(t, [T.dulzor, T.dispara + 0.4], [0, 18], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.dulzor, T.evitarlo], [1, 1.04])}>
      <rect x={520} y={820} width={40} height={400} fill={C.grey} />
      <g transform={`rotate(${inc} 540 820)`}>
        <rect x={180} y={800} width={720} height={20} rx={10} fill={C.grey} />
        <g transform="translate(260 820)">
          <path d="M -90 0 L -60 140 L 60 140 L 90 0" fill="none" stroke={C.grey} strokeWidth={6} />
          <circle cx={0} cy={110} r={40} fill={DULCE} opacity={0.4} />
          <Texto x={0} y={210} size={36} color={DULCE}>
            dulce
          </Texto>
        </g>
        <g transform="translate(820 820)">
          <path d="M -90 0 L -60 140 L 60 140 L 90 0" fill="none" stroke={C.grey} strokeWidth={6} />
          <circle cx={0} cy={100} r={60} fill={AMARGO} />
          <Texto x={0} y={210} size={36} color={AMARGO}>
            amargo
          </Texto>
        </g>
      </g>
    </Lienzo>
  );
};

// F. Espera treinta minutos o usa una pasta sin laurilsulfato
export const Evitar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ang = interpolate(t, [T.treinta, T.porEso], [0, 180], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.evitarlo, T.porEso], [1, 1.04])}>
      <g transform="translate(540 720)" opacity={aparece(t, T.treinta)}>
        <circle cx={0} cy={0} r={170} fill={C.card} stroke={C.white} strokeWidth={8} />
        <path d={`M 0 0 L 0 -150 A 150 150 0 ${ang > 180 ? 1 : 0} 1 ${Math.sin((ang * Math.PI) / 180) * 150} ${-Math.cos((ang * Math.PI) / 180) * 150} Z`} fill={C.yellow} opacity={0.5} />
        <Texto x={0} y={250} size={44} color={C.yellow}>
          30 min
        </Texto>
      </g>
      <g opacity={aparece(t, T.pasta)} transform="translate(540 1250)">
        <rect x={-260} y={-60} width={520} height={120} rx={26} fill={C.white} />
        <Texto x={0} y={14} size={38} color="#3A8AE8">
          sin laurilsulfato
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
