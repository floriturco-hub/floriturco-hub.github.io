import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cafe/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  y: 1.8,
  caloria: 3.48,
  final: 4.78,
  mientras: 7.32,
  acumula: 9.1,
  sueno: 11.88,
  cuando: 12.5,
  encendiera: 14.6,
  descansa: 15.92,
  cafeina: 16.9,
  forma: 18.48,
  tapa: 21.12,
  sin: 21.64,
  cansancio: 23.06,
  notas: 24.96,
  cinco: 25.64,
  mitad: 28.08,
  va: 28.66,
  golpe: 31.76,
  desplomas: 32.52,
  porque: 33.7,
  fin: 35.8,
};

const CAFE = "#8A5A3A";
const ADENO = C.purpleLight;

// Taza de café con vapor
const Taza: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((k) => {
      const u = (t * 0.5 + k / 3) % 1;
      return (
        <path
          key={k}
          d={`M ${-50 + k * 50} ${-120 - u * 120} q 20 -25 0 -50 q -20 -25 0 -50`}
          stroke={C.white}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          opacity={0.5 * Math.sin(u * Math.PI)}
        />
      );
    })}
    <path d="M -130 -100 L 130 -100 L 110 100 Q 100 130 70 130 L -70 130 Q -100 130 -110 100 Z" fill={C.white} />
    <ellipse cx={0} cy={-100} rx={130} ry={24} fill={CAFE} />
    <path d="M 125 -50 Q 200 -50 190 20 Q 180 70 112 70" stroke={C.white} strokeWidth={22} fill="none" />
  </g>
);

// Cerebro esquemático
const Cerebro: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color?: string }> = ({
  x,
  y,
  s,
  color = "#E8A0B8",
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -150 20 Q -170 -80 -90 -110 Q -50 -160 20 -130 Q 90 -160 140 -90 Q 190 -30 150 40 Q 140 100 60 100 Q 0 130 -60 100 Q -150 100 -150 20 Z"
      fill={color}
    />
    <path d="M -80 -60 Q -40 -20 -90 30 M 0 -110 Q 30 -50 -10 0 Q -40 50 10 90 M 80 -80 Q 50 -20 100 30" stroke="#B86A88" strokeWidth={8} fill="none" />
  </g>
);

// Imagen del gancho y del cierre
const TazaCerebro: React.FC<{ readonly t: number; readonly brillo: number }> = ({ t, brillo }) => (
  <>
    <circle cx={540} cy={640} r={240} fill={C.yellow} opacity={0.12 * brillo} />
    <Cerebro x={540} y={640} s={1.25} />
    <g opacity={brillo}>
      <ellipse cx={540} cy={640} rx={70} ry={40} fill={C.white} />
      <circle cx={540} cy={640} r={26} fill={CAFE} />
    </g>
    <Taza x={540} y={1150} s={1.3} t={t} />
  </>
);

// A. Gancho: el café engaña a tu cerebro
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.y], [1.12, 1])}>
        <TazaCerebro t={t} brillo={interpolate(t, [0.4, 0.8], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.44} color={C.yellow} />
    </>
  );
};

// B. Sin una caloría + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.mientras], [1, 1.05])}>
      <Taza x={420} y={840} s={1.1} t={t} />
      <g opacity={aparece(t, T.caloria)} transform="translate(800 640) rotate(10)">
        <circle r={120} fill={C.red} />
        <Texto x={0} y={0} size={70} color={C.white}>
          0
        </Texto>
        <Texto x={0} y={60} size={36} color={C.white}>
          kcal
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.mientras], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          cuándo te cobra la factura: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Molécula de adenosina (morada) o cafeína (marrón): hexágono + pentágono
const Molecula: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly color: string;
  readonly op?: number;
  readonly rot?: number;
}> = ({ x, y, s, color, op = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <polygon points="-40,-23 -20,-46 10,-46 20,-23 10,0 -20,0" transform="translate(0 23)" fill={color} />
    <polygon points="20,0 45,-10 55,15 35,32 15,22" fill={color} />
  </g>
);

// C. Mientras estás despierto se acumula adenosina, que da sueño
export const Adenosina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.floor(interpolate(t, [T.acumula - 0.3, T.cuando], [0, 22], clamp));
  const sueno = interpolate(t, [T.acumula, T.cuando], [0.05, 0.8], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.mientras, T.cuando], [1, 1.04])}>
      <Cerebro x={480} y={780} s={1.7} />
      {new Array(22).fill(0).map((_, k) => (
        <Molecula
          key={k}
          x={270 + random(`ax${k}`) * 420}
          y={630 + random(`ay${k}`) * 300 + Math.sin(t * 2 + k) * 8}
          s={0.6}
          color={ADENO}
          op={k < n ? 1 : 0}
          rot={k * 40}
        />
      ))}
      <g opacity={aparece(t, T.acumula)}>
        <rect x={880} y={560} width={60} height={440} rx={30} fill="#2A2440" />
        <rect x={880} y={1000 - 440 * sueno} width={60} height={440 * sueno} rx={30} fill={ADENO} />
        <Texto x={910} y={1060} size={32} color={ADENO}>
          sueño
        </Texto>
      </g>
      <Texto x={480} y={1180} size={40} color={ADENO} op={aparece(t, T.acumula + 0.4)}>
        adenosina
      </Texto>
    </Lienzo>
  );
};

// Receptor en la membrana de una neurona, con luz de aviso
const Receptor: React.FC<{
  readonly ocupa: "nada" | "adeno" | "cafe";
  readonly entra: number;
  readonly luz: number;
}> = ({ ocupa, entra, luz }) => (
  <g>
    <rect x={60} y={900} width={960} height={70} fill="#3A2440" />
    <path d="M 420 900 L 420 780 L 470 780 L 470 860 L 610 860 L 610 780 L 660 780 L 660 900 Z" fill="#6A4A8A" />
    {ocupa === "nada" ? null : (
      <Molecula x={540} y={interpolate(entra, [0, 1], [560, 815])} s={1.3} color={ocupa === "adeno" ? ADENO : CAFE} />
    )}
    {/* aviso */}
    <g transform="translate(540 1130)">
      <circle r={90} fill={luz > 0.5 ? ADENO : "#1A1636"} stroke={ADENO} strokeWidth={8} />
      <path d="M 20 -45 A 50 50 0 1 0 20 45 A 38 38 0 1 1 20 -45 Z" fill={luz > 0.5 ? C.white : "#2A2440"} />
    </g>
  </g>
);

// D. Cuando llega a sus receptores se enciende un aviso: descansa
export const Aviso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.cuando + 0.4, T.encendiera], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.cafeina], [1, 1.04])}>
        <Receptor ocupa="adeno" entra={entra} luz={entra > 0.98 ? 1 : 0} />
        <Texto x={540} y={720} size={34} color={C.white} op={aparece(t, T.cuando + 0.3) * (1 - entra)}>
          receptor
        </Texto>
        <Texto x={540} y={1300} size={46} color={ADENO} op={aparece(t, T.descansa)}>
          DESCANSA
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.encendiera + 0.1} color={ADENO} />
    </>
  );
};

// E. La cafeína tiene casi la misma forma: tapa el receptor sin encender el aviso
export const Cafeina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.forma + 0.6, T.tapa], [0, 1], suave);
  const comparar = 1 - aparece(t, T.forma + 0.6);
  return (
    <Lienzo zoom={interpolate(t, [T.cafeina, T.cansancio], [1, 1.04])}>
      <g opacity={comparar}>
        <Molecula x={360} y={700} s={2} color={ADENO} />
        <Molecula x={720} y={700} s={2} color={CAFE} />
        <Texto x={360} y={880} size={34} color={ADENO}>
          adenosina
        </Texto>
        <Texto x={720} y={880} size={34} color={CAFE}>
          cafeína
        </Texto>
        <Texto x={540} y={1000} size={40} color={C.white} op={aparece(t, T.forma)}>
          casi la misma forma
        </Texto>
      </g>
      <g opacity={1 - comparar}>
        <Receptor ocupa="cafe" entra={entra} luz={0} />
        {[0, 1, 2].map((k) => (
          <Molecula key={k} x={200 + k * 340} y={560 + Math.sin(t * 3 + k) * 20} s={0.9} color={ADENO} rot={k * 50} />
        ))}
        <Texto x={540} y={1300} size={40} color={C.grey} op={aparece(t, T.sin)}>
          el aviso no se enciende
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. El cansancio sigue ahí, pero no lo notas
export const Oculto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cansancio, T.cinco], [1, 1.05])}>
      {new Array(30).fill(0).map((_, k) => (
        <Molecula
          key={k}
          x={150 + (k % 6) * 155 + Math.sin(t * 2 + k) * 10}
          y={560 + Math.floor(k / 6) * 110}
          s={0.7}
          color={ADENO}
          rot={k * 33}
          op={aparece(t, T.cansancio + k * 0.03)}
        />
      ))}
      <g opacity={aparece(t, T.notas - 0.4)}>
        <rect x={100} y={500} width={880} height={600} rx={30} fill={C.card} stroke={C.cardBorder} strokeWidth={4} />
        <Texto x={540} y={780} size={60} color="#5AC878">
          TODO BIEN
        </Texto>
        <Texto x={540} y={860} size={34} color={C.grey}>
          (no lo notas)
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Tu cuerpo tarda unas cinco horas en eliminar la mitad
export const Horas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = interpolate(t, [T.cinco + 0.6, T.mitad], [0, 5], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cinco, T.va], [1, 1.04])}>
      <g transform="translate(540 700)">
        <circle r={200} fill="#120F22" stroke={C.yellow} strokeWidth={12} />
        <line x1={0} y1={0} x2={0} y2={-150} stroke={C.white} strokeWidth={10} strokeLinecap="round" transform={`rotate(${h * 360})`} />
        <line x1={0} y1={0} x2={0} y2={-100} stroke={C.yellow} strokeWidth={14} strokeLinecap="round" transform={`rotate(${h * 30})`} />
        <circle r={14} fill={C.white} />
      </g>
      <Texto x={540} y={1000} size={50} color={C.yellow}>
        {`${h.toFixed(1).replace(".", ",")} h`}
      </Texto>
      <Tarjeta x={180} y={1080} w={720} h={140}>
        <rect x={220} y={1120} width={640} height={60} rx={30} fill="#2A2440" />
        <rect x={220} y={1120} width={640 * (1 - h / 10)} height={60} rx={30} fill={CAFE} />
        <Texto x={540} y={1164} size={34} color={C.white}>
          {`cafeína ${Math.round(100 * Math.pow(0.5, h / 5))} %`}
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// H. Cuando se va, la adenosina acumulada llega de golpe y te desplomas
export const Golpe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const golpe = interpolate(t, [T.golpe - 0.3, T.golpe + 0.2], [0, 1], suave);
  const cae = interpolate(t, [T.desplomas, T.desplomas + 0.5], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.va, T.porque], [1, 1.05])}>
        <Molecula x={540 + interpolate(t, [T.va, T.va + 1], [0, 600], clamp)} y={600} s={1.4} color={CAFE} />
        {new Array(16).fill(0).map((_, k) => (
          <Molecula
            key={k}
            x={interpolate(golpe, [0, 1], [100 + random(`gx${k}`) * 880, 540 + (k % 4 - 1.5) * 120])}
            y={interpolate(golpe, [0, 1], [520 + random(`gy${k}`) * 200, 760 + Math.floor(k / 4) * 70])}
            s={0.6}
            color={ADENO}
            rot={k * 25}
            op={aparece(t, T.va + 0.8)}
          />
        ))}
        {/* persona que cae */}
        <g transform={`translate(540 1250) rotate(${cae * -80} 0 0)`} opacity={aparece(t, T.golpe)}>
          <circle cx={0} cy={-170} r={44} fill={C.white} />
          <rect x={-40} y={-120} width={80} height={130} rx={30} fill={C.white} />
          <rect x={-36} y={10} width={30} height={90} rx={12} fill={C.white} />
          <rect x={6} y={10} width={30} height={90} rx={12} fill={C.white} />
        </g>
        <Texto x={760} y={1080} size={60} color={ADENO} op={cae}>
          Zzz
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.golpe} color={ADENO} />
    </>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <TazaCerebro t={t} brillo={1} />
    </Lienzo>
  );
};
