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

// Instantes clave (s) de public/audio/plataforma/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  en: 1.9,
  metros: 3.0,
  anclas: 4.68,
  final: 5.78,
  algunas: 8.3,
  posicion: 11.28,
  debajo: 13.3,
  helices: 14.02,
  girar: 15.42,
  satelites: 17.18,
  miden: 18.2,
  si: 21.34,
  empuja: 22.04,
  computadora: 23.28,
  contraria: 25.38,
  devuelven: 26.26,
  asi: 27.92,
  circulo: 29.54,
  loco: 31.4,
  y: 32.84,
  desconecta: 34.64,
  aleja: 35.92,
  porEso: 36.66,
  fin: 38.68,
};

const MAR = "#1A4A7A";
const MAR_OSC = "#0E2A4A";
const CASCO = "#C84A3A";
const ACERO = "#8A86A8";

// Olas animadas en y con amplitud a
const Olas: React.FC<{ readonly y: number; readonly t: number; readonly a: number; readonly color?: string }> = ({ y, t, a, color = MAR }) => (
  <path
    d={
      new Array(28)
        .fill(0)
        .map((_, k) => `${k === 0 ? "M" : "L"} ${k * 40} ${y + Math.sin(k * 0.6 - t * 3) * a + Math.sin(k * 1.3 + t * 2) * a * 0.4}`)
        .join(" ") + ` L 1080 1920 L 0 1920 Z`
    }
    fill={color}
  />
);

// Plataforma / barco de perforación de perfil, centrado en (x,y) sobre el agua
const Plataforma: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -260 0 L 260 0 L 230 70 L -230 70 Z" fill={CASCO} />
    <rect x={-240} y={-40} width={480} height={40} fill="#E8E6F0" />
    <path d="M -30 -40 L 30 -40 L 15 -300 L -15 -300 Z" fill="none" stroke={ACERO} strokeWidth={10} />
    {[0, 1, 2, 3, 4].map((k) => (
      <line key={k} x1={-26 + k * 3} y1={-60 - k * 50} x2={26 - k * 3} y2={-100 - k * 50} stroke={ACERO} strokeWidth={6} />
    ))}
    <rect x={-220} y={-110} width={120} height={70} fill="#6A6488" />
    <circle cx={180} cy={-70} r={34} fill="#6A6488" />
  </g>
);

// Imagen del gancho y del cierre: plataforma en el huracán con su punto fijo
const Tormenta: React.FC<{ readonly t: number; readonly pin: number }> = ({ t, pin }) => (
  <>
    {new Array(18).fill(0).map((_, k) => {
      const u = (t * 1.5 + k / 18) % 1;
      return <line key={k} x1={(k * 70 + u * 200) % 1100} y1={380 + u * 600} x2={(k * 70 + u * 200) % 1100 - 30} y2={430 + u * 600} stroke="#8AA8C8" strokeWidth={4} opacity={0.5} />;
    })}
    <Plataforma x={540} y={1000} s={1.2} rot={Math.sin(t * 2) * 1.5} />
    <Olas y={1040} t={t} a={34} />
    <g opacity={pin}>
      <path d="M 540 1250 L 500 1170 A 50 50 0 1 1 580 1170 Z" fill={C.yellow} />
      <circle cx={540} cy={1150} r={18} fill={MAR_OSC} />
      <circle cx={540} cy={1260} r={70} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" />
    </g>
  </>
);

// A. Gancho: ¿cómo no se mueve esta plataforma?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.en], [1.12, 1])}>
        <Tormenta t={t} pin={interpolate(t, [0.6, 1.0], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.92} color="#8AA8C8" />
    </>
  );
};

// B. Huracán, 3.000 m de agua y sin anclas + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.en, T.algunas], [1, 1.05])}>
      <rect x={0} y={560} width={1080} height={800} fill={MAR_OSC} />
      <Olas y={560} t={t} a={16} />
      <Plataforma x={540} y={540} s={0.6} />
      <rect x={0} y={1300} width={1080} height={80} fill="#4A3A2A" />
      <g opacity={aparece(t, T.metros)}>
        <line x1={900} y1={600} x2={900} y2={1290} stroke={C.white} strokeWidth={4} strokeDasharray="14 10" />
        <Texto x={900} y={960} size={40} color={C.white}>
          3.000 m
        </Texto>
      </g>
      <g opacity={aparece(t, T.anclas)} transform="translate(300 940)">
        <path d="M 0 -80 L 0 60 M -60 30 Q 0 100 60 30 M -30 -50 L 30 -50" stroke={C.grey} strokeWidth={12} fill="none" />
        <line x1={-90} y1={-110} x2={90} y2={110} stroke={C.red} strokeWidth={14} />
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1440} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1440}
          width={700 * interpolate(t, [T.final, T.algunas], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1530} color={C.white} size={36}>
          qué pasa si el huracán gana: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Posicionamiento dinámico
export const Dinamico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.algunas, T.debajo], [1, 1.04])}>
      <Plataforma x={540} y={960} s={1} rot={Math.sin(t * 2) * 1} />
      <Olas y={1000} t={t} a={18} />
      <g opacity={aparece(t, T.posicion)}>
        <Tarjeta x={140} y={480} w={800} h={200}>
          <Texto x={540} y={560} size={44} color={C.yellow}>
            posicionamiento
          </Texto>
          <Texto x={540} y={630} size={44} color={C.yellow}>
            dinámico
          </Texto>
        </Tarjeta>
      </g>
    </Lienzo>
  );
};

// D. Debajo tiene hélices gigantes que giran en cualquier dirección
export const Helices: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pos = [
    [300, 760],
    [780, 760],
    [240, 960],
    [840, 960],
    [300, 1160],
    [780, 1160],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.debajo, T.satelites], [1, 1.04])}>
      {/* casco visto desde abajo */}
      <path d="M 540 560 Q 820 640 820 960 L 820 1300 L 260 1300 L 260 960 Q 260 640 540 560 Z" fill={CASCO} opacity={0.8} />
      {pos.map(([x, y], k) => {
        const ang = aparece(t, T.girar) * ((t - T.girar) * 60 + k * 70);
        return (
          <g key={k} opacity={aparece(t, T.helices + k * 0.1)} transform={`translate(${x} ${y}) rotate(${ang})`}>
            <circle r={50} fill="#3A3650" />
            {[0, 120, 240].map((a) => (
              <ellipse key={a} cx={0} cy={-28} rx={12} ry={26} fill={ACERO} transform={`rotate(${a + t * 600})`} />
            ))}
            <line x1={0} y1={-60} x2={0} y2={-110} stroke={C.cyan} strokeWidth={8} />
            <path d="M -14 -100 L 0 -125 L 14 -100 Z" fill={C.cyan} />
          </g>
        );
      })}
      <Texto x={540} y={1400} size={40} color={C.cyan} op={aparece(t, T.girar)}>
        giran en cualquier dirección
      </Texto>
    </Lienzo>
  );
};

// E. Satélites y sensores miden cada movimiento, varias veces por segundo
export const Sensores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.satelites, T.si], [1, 1.04])}>
      {[0, 1, 2].map((k) => {
        const sx = 200 + k * 340;
        return (
          <g key={k} opacity={aparece(t, T.satelites + k * 0.2)}>
            <rect x={sx - 30} y={460} width={60} height={40} rx={6} fill={C.white} />
            <rect x={sx - 90} y={470} width={50} height={20} fill={C.cyan} />
            <rect x={sx + 40} y={470} width={50} height={20} fill={C.cyan} />
            <line x1={sx} y1={500} x2={540} y2={880} stroke={C.yellow} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-t * 80} />
          </g>
        );
      })}
      <Plataforma x={540} y={960} s={0.9} rot={Math.sin(t * 2) * 1} />
      <Olas y={1000} t={t} a={18} />
      <g opacity={aparece(t, T.miden)}>
        <Tarjeta x={200} y={1180} w={680} h={170}>
          {new Array(10).fill(0).map((_, k) => (
            <rect key={k} x={240 + k * 62} y={1300 - 60 * Math.abs(Math.sin(t * 6 + k))} width={40} height={60 * Math.abs(Math.sin(t * 6 + k))} rx={6} fill={C.yellow} />
          ))}
          <Texto x={540} y={1230} size={30} color={C.grey}>
            mediciones por segundo
          </Texto>
        </Tarjeta>
      </g>
    </Lienzo>
  );
};

// Plataforma vista desde arriba
const Arriba: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -150 -60 L 120 -60 Q 190 0 120 60 L -150 60 Z" fill={CASCO} />
    <rect x={-40} y={-40} width={80} height={80} fill="#E8E6F0" />
    <circle cx={0} cy={0} r={20} fill={ACERO} />
  </g>
);

// F. Si una ola la empuja un metro, la computadora calcula la fuerza contraria y las hélices la devuelven
export const Corrige: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const empuje = interpolate(t, [T.empuja, T.empuja + 0.6, T.devuelven, T.devuelven + 0.8], [0, 1, 1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.asi], [1, 1.04])}>
      <rect x={0} y={420} width={1080} height={1000} fill={MAR} />
      <circle cx={540} cy={800} r={60} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" />
      <line x1={520} y1={800} x2={560} y2={800} stroke={C.yellow} strokeWidth={4} />
      <line x1={540} y1={780} x2={540} y2={820} stroke={C.yellow} strokeWidth={4} />
      <Arriba x={540 + empuje * 160} y={800} />
      <g opacity={aparece(t, T.empuja) * (1 - aparece(t, T.contraria))}>
        <path d="M 160 800 L 340 800" stroke={C.white} strokeWidth={14} />
        <path d="M 340 770 L 390 800 L 340 830 Z" fill={C.white} />
        <Texto x={250} y={760} size={32} color={C.white}>
          ola
        </Texto>
      </g>
      <g opacity={aparece(t, T.contraria)}>
        <path d={`M ${880 + empuje * 0} 800 L ${760} 800`} stroke={C.cyan} strokeWidth={14} />
        <path d="M 760 770 L 710 800 L 760 830 Z" fill={C.cyan} />
        <Texto x={840} y={760} size={32} color={C.cyan}>
          hélices
        </Texto>
      </g>
      <g opacity={aparece(t, T.computadora)}>
        <rect x={340} y={1040} width={400} height={240} rx={16} fill="#2A2640" stroke={C.grey} strokeWidth={6} />
        <Texto x={540} y={1130} size={34} color="#5AC878">
          desvío: {(empuje * 1).toFixed(1).replace(".", ",")} m
        </Texto>
        <Texto x={540} y={1200} size={30} color={C.cyan} op={aparece(t, T.contraria)}>
          corrigiendo…
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Se mantiene dentro de un círculo de pocos metros aunque el mar se vuelva loco
export const Circulo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.y], [1, 1.04])}>
      <rect x={0} y={420} width={1080} height={1000} fill={MAR} />
      {new Array(12).fill(0).map((_, k) => (
        <path
          key={k}
          d={`M ${(k * 120 + t * 300) % 1200 - 100} ${460 + (k % 6) * 160} q 40 -30 80 0 q 40 30 80 0`}
          stroke={C.white}
          strokeWidth={6}
          fill="none"
          opacity={0.25 + 0.4 * aparece(t, T.loco)}
        />
      ))}
      <circle cx={540} cy={900} r={120} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" opacity={aparece(t, T.circulo)} />
      <Arriba x={540 + Math.sin(t * 3) * 30} y={900 + Math.cos(t * 2.3) * 24} />
      <Texto x={540} y={1150} size={40} color={C.yellow} op={aparece(t, T.circulo)}>
        círculo de pocos metros
      </Texto>
    </Lienzo>
  );
};

// H. Si la tormenta es demasiado fuerte, se desconecta del pozo y se aleja
export const Aleja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suelta = aparece(t, T.desconecta);
  const va = interpolate(t, [T.aleja - 0.4, T.porEso], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.y, T.porEso], [1, 1.04])}>
        <Olas y={790} t={t} a={30} color={MAR_OSC} />
        <rect x={0} y={1400} width={1080} height={80} fill="#4A3A2A" />
        <rect x={510} y={1360} width={60} height={50} fill="#6A6488" />
        {/* tubo del pozo */}
        <line x1={540} y1={1360} x2={540} y2={interpolate(suelta, [0, 1], [1360, 1290])} stroke={ACERO} strokeWidth={14} />
        <g transform={`translate(${va * 500} 0)`}>
          <line x1={540} y1={830} x2={540} y2={interpolate(suelta, [0, 1], [1290, 1000])} stroke={ACERO} strokeWidth={14} />
          <Plataforma x={540} y={760} s={0.7} rot={Math.sin(t * 3) * 3} />
        </g>
        <Texto x={540} y={1550} size={40} color={C.red} op={aparece(t, T.desconecta)}>
          se desconecta y se aleja
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desconecta} color={C.red} />
    </>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Tormenta t={t} pin={1} />
    </Lienzo>
  );
};
