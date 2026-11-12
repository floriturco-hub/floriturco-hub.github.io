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

// Instantes clave (s) de public/audio/cajero/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  ysi: 1.98,
  descubre: 3.7,
  final: 5.14,
  dentro: 7.34,
  casetes: 8.02,
  rodillo: 10.2,
  uno: 11.54,
  cada: 12.64,
  sensores: 13.76,
  grosor: 14.86,
  centesimo: 15.58,
  luz: 17.36,
  si: 18.72,
  duplica: 20.6,
  menosLuz: 21.54,
  tambien: 22.48,
  largo: 23.22,
  torcido: 24.34,
  ese: 24.7,
  rechazo: 28.52,
  otro: 29.56,
  todo: 30.2,
  porque: 32.34,
  fin: 34.96,
};

const VERDE = "#4AA870";
const VERDE_OSC = "#2E7A4E";
const METAL = "#4A4466";

// Billete (centrado en x, y)
const Billete: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly rot?: number;
  readonly op?: number;
  readonly borde?: string;
}> = ({ x, y, s = 1, rot = 0, op = 1, borde = VERDE_OSC }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-160} y={-75} width={320} height={150} rx={10} fill={VERDE} stroke={borde} strokeWidth={8} />
    <rect x={-140} y={-55} width={280} height={110} rx={6} fill="none" stroke={VERDE_OSC} strokeWidth={4} />
    <circle cx={0} cy={0} r={40} fill={VERDE_OSC} />
    <text x={0} y={16} textAnchor="middle" fontSize={46} fontWeight={700} fill={VERDE} fontFamily="JetBrains Mono">
      $
    </text>
  </g>
);

// Frente del cajero con pantalla y ranura
const Cajero: React.FC<{ readonly t: number; readonly ojo: number; readonly sale: number }> = ({ t, ojo, sale }) => (
  <g>
    <rect x={240} y={430} width={600} height={900} rx={30} fill={METAL} />
    <rect x={300} y={500} width={480} height={300} rx={16} fill="#120F22" stroke={C.cyan} strokeWidth={6} />
    <g opacity={ojo}>
      <ellipse cx={540} cy={650} rx={130} ry={70} fill="none" stroke={C.cyan} strokeWidth={10} />
      <circle cx={540 + Math.sin(t * 2) * 40} cy={650} r={38} fill={C.cyan} />
    </g>
    {new Array(12).fill(0).map((_, k) => (
      <rect key={k} x={340 + (k % 4) * 60} y={860 + Math.floor(k / 4) * 50} width={44} height={34} rx={6} fill="#2A2640" />
    ))}
    <Billete x={540} y={1065 + 110 * sale} s={0.9} />
    <rect x={340} y={1090} width={400} height={30} rx={10} fill="#0A0814" />
    <rect x={240} y={1095} width={600} height={240} fill={METAL} />
  </g>
);

// A. Gancho: el cajero desconfía de cada billete
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.ysi], [1.12, 1])}>
        <Cajero t={t} ojo={interpolate(t, [0.4, 0.9], [0, 1], clamp)} sale={0} />
      </Lienzo>
      <Flash t={t} d={0.46} color={C.cyan} />
    </>
  );
};

// B. Si salen dos pegados lo descubre al instante + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x = interpolate(t, [T.ysi, T.descubre], [-200, 540], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.ysi, T.dentro], [1, 1.05])}>
      <Billete x={x - 14} y={760 - 14} s={1.4} />
      <Billete x={x} y={760} s={1.4} borde={t > T.descubre ? C.red : VERDE_OSC} />
      <g opacity={aparece(t, T.descubre)}>
        <circle cx={850} cy={560} r={70} fill={C.red} />
        <Texto x={850} y={590} size={80} color={C.white}>
          !
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.dentro], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          qué hace con ellos: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Rodillo de goma que gira
const Rodillo: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly giro: number }> = ({ x, y, r, giro }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro})`}>
    <circle r={r} fill="#2A2A30" stroke="#5A5A66" strokeWidth={6} />
    <line x1={-r * 0.7} y1={0} x2={r * 0.7} y2={0} stroke="#5A5A66" strokeWidth={6} />
    <line x1={0} y1={-r * 0.7} x2={0} y2={r * 0.7} stroke="#5A5A66" strokeWidth={6} />
  </g>
);

// C. Casetes con cientos de billetes; un rodillo los arrastra uno por uno
export const Casetes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rod = aparece(t, T.rodillo);
  const ciclo = ((t - T.rodillo) * 1.4) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.cada], [1, 1.04])}>
      <g opacity={aparece(t, T.casetes)}>
        <rect x={160} y={700} width={560} height={500} rx={20} fill="none" stroke={C.grey} strokeWidth={10} />
        {new Array(26).fill(0).map((_, k) => (
          <rect key={k} x={190} y={1170 - k * 17} width={500} height={11} rx={3} fill={VERDE} opacity={0.6 + (k % 3) * 0.13} />
        ))}
        <Texto x={440} y={1270} size={36} color={C.grey}>
          casete
        </Texto>
      </g>
      <g opacity={rod}>
        <Rodillo x={600} y={680} r={56} giro={(t - T.rodillo) * 500} />
        {t > T.rodillo ? (
          <rect
            x={interpolate(ciclo, [0, 1], [190, 900])}
            y={725 - ciclo * 60}
            width={500}
            height={11}
            rx={3}
            fill={C.yellow}
            transform={`rotate(${-ciclo * 6} 600 700)`}
          />
        ) : null}
        <Texto x={780} y={600} size={34} color={C.white} anchor="start">
          rodillo
        </Texto>
      </g>
      <Texto x={540} y={1380} size={40} color={C.yellow} op={aparece(t, T.uno)}>
        uno por uno
      </Texto>
    </Lienzo>
  );
};

// Sensor de paso: billete(s) entre rodillos medidores y un haz de luz
const Paso: React.FC<{
  readonly t: number;
  readonly dobles: boolean;
  readonly x: number;
  readonly luz: number;
  readonly grosor: number;
}> = ({ t, dobles, x, luz, grosor }) => (
  <g>
    {dobles ? <rect x={x - 220} y={786} width={440} height={16} rx={4} fill={VERDE_OSC} /> : null}
    <rect x={x - 220} y={800} width={440} height={16} rx={4} fill={VERDE} />
    <Rodillo x={360} y={750 - (dobles ? 8 : 0)} r={44} giro={t * 400} />
    <Rodillo x={360} y={866} r={44} giro={-t * 400} />
    <g opacity={luz}>
      <rect x={680} y={560} width={80} height={60} rx={10} fill={C.yellow} />
      <path
        d={`M 690 620 L 750 620 L 760 ${dobles ? 800 : 1000} L 680 ${dobles ? 800 : 1000} Z`}
        fill={C.yellow}
        opacity={0.35}
      />
      <path d="M 690 816 L 750 816 L 760 1000 L 680 1000 Z" fill={C.yellow} opacity={dobles ? 0.12 : 0.3} />
      <rect x={670} y={1000} width={100} height={40} rx={8} fill="#6A6488" />
    </g>
    <g opacity={grosor}>
      <Tarjeta x={140} y={1110} w={380} h={140}>
        <Texto x={330} y={1160} size={28} color={C.grey}>
          grosor
        </Texto>
        <Texto x={330} y={1220} size={44} color={dobles ? C.red : C.white}>
          {dobles ? "0,22 mm" : "0,11 mm"}
        </Texto>
      </Tarjeta>
    </g>
    <g opacity={luz}>
      <Tarjeta x={560} y={1110} w={380} h={140}>
        <Texto x={750} y={1160} size={28} color={C.grey}>
          luz que pasa
        </Texto>
        <Texto x={750} y={1220} size={44} color={dobles ? C.red : C.yellow}>
          {dobles ? "40 %" : "100 %"}
        </Texto>
      </Tarjeta>
    </g>
  </g>
);

// D. Sensores de grosor (centésimas de milímetro) y luz que lo atraviesa
export const Sensores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x = interpolate(t, [T.cada, T.si], [200, 620], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.si], [1, 1.04])}>
      <Paso t={t} dobles={false} x={x} luz={aparece(t, T.luz)} grosor={aparece(t, T.grosor)} />
      <Texto x={540} y={540} size={36} color={C.white} op={aparece(t, T.sensores) * (1 - aparece(t, T.luz))}>
        sensores
      </Texto>
      <Texto x={540} y={1340} size={34} color={C.cyan} op={aparece(t, T.centesimo)}>
        precisión: 0,01 mm
      </Texto>
    </Lienzo>
  );
};

// E. Dos pegados: el grosor se duplica y pasa menos luz
export const Doble: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x = interpolate(t, [T.si, T.tambien], [200, 620], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.tambien], [1, 1.04])}>
        <Paso t={t} dobles x={x} luz={aparece(t, T.menosLuz)} grosor={aparece(t, T.duplica)} />
        <Texto x={540} y={1340} size={40} color={C.red} op={aparece(t, T.duplica)}>
          ¡dos pegados!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.duplica} color={C.red} />
    </>
  );
};

// F. También mide su largo, para saber si va torcido
export const Largo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tuerce = interpolate(t, [T.largo + 0.4, T.torcido], [0, 14], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.tambien, T.ese], [1, 1.04])}>
      <Billete x={540} y={800} s={1.8} rot={tuerce} borde={tuerce > 10 ? C.red : VERDE_OSC} />
      <g opacity={aparece(t, T.largo)}>
        <line x1={250} y1={1090} x2={830} y2={1090} stroke={C.cyan} strokeWidth={6} />
        <path d="M 250 1070 L 250 1110 M 830 1070 L 830 1110" stroke={C.cyan} strokeWidth={6} />
        <Texto x={540} y={1160} size={38} color={C.cyan}>
          largo
        </Texto>
      </g>
      <Texto x={540} y={1300} size={42} color={C.red} op={aparece(t, T.torcido)}>
        ¿torcido?
      </Texto>
    </Lienzo>
  );
};

// G. El dudoso va a la caja de rechazo y saca otro; varios por segundo
export const Rechazo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.ese + 1.2, T.rechazo + 0.6], [0, 1], suave);
  const sale = interpolate(t, [T.otro, T.otro + 0.7], [0, 1], suave);
  const rapido = aparece(t, T.todo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ese, T.porque], [1, 1.05])}>
        {/* bifurcación */}
        <rect x={80} y={640} width={520} height={20} rx={10} fill="#3A3456" />
        <path d="M 600 650 L 940 520" stroke={VERDE} strokeWidth={20} strokeLinecap="round" />
        <path d="M 600 650 L 760 1020" stroke={C.red} strokeWidth={20} strokeLinecap="round" />
        <rect x={620} y={1020} width={300} height={200} rx={16} fill="none" stroke={C.red} strokeWidth={10} />
        <Texto x={770} y={1290} size={34} color={C.red}>
          caja de rechazo
        </Texto>
        <Texto x={890} y={470} size={34} color={VERDE}>
          a ti
        </Texto>
        <g opacity={1 - rapido}>
          <Billete
            x={interpolate(baja, [0, 0.4, 1], [300, 600, 770])}
            y={interpolate(baja, [0, 0.4, 1], [600, 610, 1110])}
            s={0.6}
            rot={baja * 60}
            borde={C.red}
          />
          <Billete
            x={interpolate(sale, [0, 0.5, 1], [-200, 560, 900])}
            y={interpolate(sale, [0, 0.5, 1], [600, 600, 470])}
            s={0.6}
            op={aparece(t, T.otro)}
          />
        </g>
        <g opacity={rapido}>
          {new Array(5).fill(0).map((_, k) => {
            const u = ((t - T.todo) * 3 + k / 5) % 1;
            return (
              <Billete
                key={k}
                x={interpolate(u, [0, 0.5, 1], [80, 600, 940])}
                y={interpolate(u, [0, 0.5, 1], [600, 600, 470])}
                s={0.5}
                op={interpolate(u, [0, 0.1, 0.9, 1], [0, 1, 1, 0])}
              />
            );
          })}
          <Texto x={300} y={880} size={44} color={C.yellow}>
            varios por segundo
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.rechazo} color={C.red} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <Cajero t={t} ojo={1} sale={0} />
    </Lienzo>
  );
};
