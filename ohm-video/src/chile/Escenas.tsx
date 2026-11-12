import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/chile/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  no: 2.06,
  quemas: 4.46,
  final: 5.24,
  capsa: 7.78,
  capsaicina: 8.6,
  sensores: 9.7,
  calor: 11.54,
  grados: 13.14,
  encaja: 14.58,
  abre: 17.0,
  fria: 17.52,
  cerebro: 19.2,
  fuego: 21.3,
  sudas: 21.94,
  rojo: 23.42,
  pero: 24.1,
  aceite: 25.54,
  agua: 26.2,
  beber: 27.66,
  reparte: 28.72,
  leche: 30.42,
  grasa: 31.92,
  atrapan: 33.32,
  porque: 34.84,
  fin: 36.88,
};

const ROJO = "#D8343E";
const AGUA = "#4AA8E8";
const ACEITE = "#F0B030";

// Chile rojo
const Chile: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({
  x,
  y,
  s,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -150 -30 Q -60 -70 80 -40 Q 170 -20 200 60 Q 120 10 -10 30 Q -120 40 -150 -30 Z" fill={ROJO} />
    <path d="M -110 -40 Q -40 -60 60 -45" stroke="#FF8A90" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
    <path d="M -150 -30 Q -190 -50 -200 -100" stroke="#3A8A3A" strokeWidth={22} fill="none" strokeLinecap="round" />
    <ellipse cx={-155} cy={-28} rx={26} ry={20} fill="#3A8A3A" />
  </g>
);

// Llama
const Llama: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly op?: number }> = ({
  x,
  y,
  s,
  t,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * (1 + Math.sin(t * 16 + x) * 0.07)})`} opacity={op}>
    <path d="M 0 -150 Q 70 -60 60 10 Q 50 70 0 70 Q -50 70 -60 10 Q -70 -60 0 -150 Z" fill={C.orange} />
    <path d="M 0 -70 Q 35 -20 30 20 Q 25 55 0 55 Q -25 55 -30 20 Q -35 -20 0 -70 Z" fill={C.yellow} />
  </g>
);

// Imagen del gancho y del cierre: chile en llamas
const ChileFuego: React.FC<{ readonly t: number; readonly fuego: number }> = ({ t, fuego }) => (
  <>
    <circle cx={540} cy={880} r={340} fill={ROJO} opacity={0.12 * fuego} />
    {[-260, -90, 90, 260].map((dx, k) => (
      <Llama key={k} x={540 + dx} y={700 + (k % 2) * 40} s={0.9} t={t} op={fuego} />
    ))}
    <Chile x={540} y={920} s={1.9} rot={-8} />
  </>
);

// A. Gancho: el chile engaña a tu lengua
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.no], [1.12, 1])}>
        <ChileFuego t={t} fuego={interpolate(t, [0.4, 0.8], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.46} color={ROJO} />
    </>
  );
};

// Termómetro
const Termometro: React.FC<{ readonly x: number; readonly y: number; readonly nivel: number; readonly color: string }> = ({
  x,
  y,
  nivel,
  color,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-34} y={-240} width={68} height={300} rx={34} fill="#2A2440" />
    <rect x={-18} y={60 - 280 * nivel} width={36} height={280 * nivel} rx={18} fill={color} />
    <circle cx={0} cy={90} r={60} fill={color} />
  </g>
);

// B. No está caliente pero el cerebro jura que te quemas + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.no, T.capsa], [1, 1.05])}>
      <Termometro x={300} y={800} nivel={0.2} color={AGUA} />
      <Texto x={300} y={1010} size={40} color={AGUA}>
        frío
      </Texto>
      <g opacity={aparece(t, T.quemas - 1)}>
        <Llama x={760} y={790} s={1.4} t={t} />
        <Texto x={760} y={1010} size={40} color={C.orange}>
          ¡fuego!
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.capsa], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          por qué el agua lo empeora: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Molécula de capsaicina: cadena en zigzag con un anillo
const Capsaicina: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color?: string; readonly rot?: number }> = ({
  x,
  y,
  s,
  color = ROJO,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <polygon points="-90,-20 -70,-55 -30,-55 -10,-20 -30,15 -70,15" fill="none" stroke={color} strokeWidth={10} />
    <polyline points="-10,-20 20,0 50,-20 80,0 110,-20 140,0" fill="none" stroke={color} strokeWidth={10} strokeLinejoin="round" />
    <circle cx={140} cy={0} r={12} fill={color} />
  </g>
);

// Canal sensor (TRPV1) en la membrana: abierto 0..1
const Canal: React.FC<{ readonly x: number; readonly y: number; readonly abierto: number; readonly t: number }> = ({ x, y, abierto, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-480} y={-40} width={960} height={80} fill="#7A3A5A" />
    <rect x={-90 - abierto * 30} y={-80} width={70} height={160} rx={24} fill="#C85A88" />
    <rect x={20 + abierto * 30} y={-80} width={70} height={160} rx={24} fill="#C85A88" />
    {new Array(5).fill(0).map((_, k) => {
      const u = (t * 1.2 + k / 5) % 1;
      return <circle key={k} cx={0} cy={-150 + u * 300} r={14} fill={C.yellow} opacity={abierto * Math.sin(u * Math.PI)} />;
    })}
  </g>
);

// C. El chile tiene capsaicina; la lengua tiene sensores de calor que saltan a 43 °C
export const Sensor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lengua = aparece(t, T.sensores);
  const temp = interpolate(t, [T.calor, T.grados + 0.3], [36, 43], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.capsa, T.encaja], [1, 1.04])}>
      <g opacity={1 - lengua}>
        <Chile x={340} y={780} s={1} />
        <Capsaicina x={720} y={790} s={1.3} rot={0} />
        <Texto x={760} y={930} size={38} color={ROJO} op={aparece(t, T.capsaicina)}>
          capsaicina
        </Texto>
      </g>
      <g opacity={lengua}>
        <Canal x={540} y={860} abierto={temp >= 42.9 ? 1 : 0} t={t} />
        <Texto x={540} y={700} size={36} color={C.white}>
          sensor de calor (TRPV1)
        </Texto>
        <Termometro x={880} y={1220} nivel={(temp - 30) / 15} color={temp >= 42.9 ? ROJO : C.orange} />
        <Texto x={540} y={1180} size={60} color={temp >= 42.9 ? ROJO : C.white} op={aparece(t, T.calor)}>
          {`${Math.round(temp)} °C`}
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. La capsaicina encaja en esos sensores y los abre, aunque esté fría
export const Encaja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.encaja + 0.4, T.abre], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.encaja, T.cerebro], [1, 1.04])}>
        <Canal x={540} y={860} abierto={entra > 0.95 ? 1 : 0} t={t} />
        <Capsaicina x={interpolate(entra, [0, 1], [300, 470])} y={interpolate(entra, [0, 1], [600, 760])} s={1} rot={entra * 20} />
        <g opacity={aparece(t, T.fria)}>
          <g transform="translate(860 1180)" stroke={AGUA} strokeWidth={12} strokeLinecap="round">
            {[0, 60, 120].map((a) => (
              <line key={a} x1={0} y1={-70} x2={0} y2={70} transform={`rotate(${a})`} />
            ))}
          </g>
          <Texto x={420} y={1200} size={42} color={AGUA}>
            aunque esté fría
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.abre} color={ROJO} />
    </>
  );
};

// E. El cerebro recibe la misma alarma que con fuego: sudas, lloras, te pones rojo
export const Alarma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rojo = aparece(t, T.rojo);
  return (
    <Lienzo zoom={interpolate(t, [T.cerebro, T.pero], [1, 1.05])}>
      {/* cara */}
      <circle cx={540} cy={860} r={300} fill={rojo > 0.5 ? "#E8706A" : "#E8B890"} />
      <circle cx={430} cy={790} r={30} fill="#1A1010" />
      <circle cx={650} cy={790} r={30} fill="#1A1010" />
      <ellipse cx={540} cy={1000} rx={90} ry={60} fill="#5A1A20" />
      <g opacity={aparece(t, T.sudas)}>
        {[0, 1, 2].map((k) => {
          const u = (t * 0.7 + k / 3) % 1;
          return <path key={k} d={`M ${300 + k * 240} ${600 + u * 200} q 26 42 0 56 q -26 -14 0 -56 Z`} fill={AGUA} opacity={1 - u} />;
        })}
        {[430, 650].map((x) => (
          <rect key={x} x={x - 8} y={830} width={16} height={60 + ((t * 80) % 60)} rx={8} fill={AGUA} opacity={aparece(t, T.sudas + 0.5)} />
        ))}
      </g>
      <g opacity={aparece(t, T.fuego - 0.6)}>
        <Llama x={540} y={480} s={0.9} t={t} />
      </g>
      <Texto x={540} y={1290} size={42} color={C.orange} op={aparece(t, T.fuego)}>
        misma alarma que el fuego
      </Texto>
    </Lienzo>
  );
};

// F. La capsaicina es como aceite: no se mezcla con agua; al beber la repartes
export const Aceite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const reparte = interpolate(t, [T.beber, T.leche - 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.leche], [1, 1.04])}>
      <path d="M 300 560 L 780 560 L 740 1160 L 340 1160 Z" fill={AGUA} opacity={0.35} />
      <path d="M 300 560 L 780 560 L 740 1160 L 340 1160 Z" fill="none" stroke="#C8C4D8" strokeWidth={8} />
      {new Array(9).fill(0).map((_, k) => {
        const bx = 400 + (k % 3) * 140 + Math.sin(t * 2 + k) * 10;
        const by = 620 + Math.floor(k / 3) * 30;
        const rx = 120 + random(`rx${k}`) * 840;
        const ry = 640 + random(`ry${k}`) * 500;
        return (
          <circle
            key={k}
            cx={interpolate(reparte, [0, 1], [bx, rx])}
            cy={interpolate(reparte, [0, 1], [by, ry])}
            r={28}
            fill={ACEITE}
            stroke="#A87A10"
            strokeWidth={4}
            opacity={aparece(t, T.aceite)}
          />
        );
      })}
      <Texto x={540} y={1260} size={40} color={ACEITE} op={aparece(t, T.agua) * (1 - aparece(t, T.reparte))}>
        flota: no se mezcla
      </Texto>
      <Texto x={540} y={1260} size={40} color={C.red} op={aparece(t, T.reparte)}>
        ¡la repartes por la boca!
      </Texto>
    </Lienzo>
  );
};

// G. La leche sí: grasa y caseína la atrapan y se la llevan
export const Leche: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const atrapa = interpolate(t, [T.grasa + 0.4, T.atrapan + 0.3], [0, 1], suave);
  const lleva = interpolate(t, [T.atrapan + 0.5, T.porque], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.leche, T.porque], [1, 1.04])}>
        <path d="M 330 520 L 750 520 L 715 900 L 365 900 Z" fill={C.white} />
        <Texto x={540} y={980} size={38} color={C.white}>
          leche
        </Texto>
        {new Array(5).fill(0).map((_, k) => {
          const cx = 180 + k * 180;
          const cy = 1180;
          return (
            <g key={k} transform={`translate(${lleva * 700} 0)`} opacity={1 - lleva * 0.9}>
              <circle cx={cx} cy={cy - 60 * (1 - atrapa)} r={26} fill={ACEITE} />
              <circle cx={cx} cy={cy} r={50 * aparece(t, T.grasa)} fill="none" stroke={C.white} strokeWidth={12} strokeDasharray="20 12" />
            </g>
          );
        })}
        <Texto x={540} y={1340} size={38} color={C.white} op={aparece(t, T.grasa)}>
          grasa + caseína la atrapan
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.atrapan} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <ChileFuego t={t} fuego={1} />
    </Lienzo>
  );
};
