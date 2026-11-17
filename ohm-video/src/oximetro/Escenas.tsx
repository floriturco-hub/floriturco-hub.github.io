import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/oximetro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  te: 1.66, // te
  segundos: 3.00, // segundos
  llevas: 4.86, // llevas
  final: 5.78, // final
  lado: 8.84, // lado
  luces: 9.62, // luces
  roja: 10.50, // roja
  infrarroja: 11.24, // infrarroja
  otro: 12.32, // otro
  sensor: 12.88, // sensor
  atraviesa: 14.28, // atraviesa
  hemoglobina: 15.66, // hemoglobina
  absorbe: 16.88, // absorbe
  infrarrojo: 17.60, // infrarrojo
  pasar: 18.68, // pasar
  rojo: 19.12, // rojo
  no: 20.06, // no
  contrario: 21.34, // contrario
  latido: 22.54, // latido
  cambia: 24.36, // cambia
  comparando: 25.10, // comparando
  colores: 26.54, // colores
  calcula: 27.12, // calcula
  esmalte: 29.20, // esmalte
  bloquea: 29.90, // bloquea
  enganarlo: 31.62, // enganarlo
  asi: 32.46, // asi
  fin: 34.22, // FIN
};

const ROJO = "#FF3A3A";
const IRC = "#A0186A";
const PIEL = "#E8B48A";

// Pinza en el dedo, de perfil; corte muestra luces y haces
const Pinza: React.FC<{
  readonly lectura: string;
  readonly corte?: number;
  readonly haz?: number;
  readonly t?: number;
  readonly esmalte?: number;
}> = ({ lectura, corte = 0, haz = 0, t = 0, esmalte = 0 }) => (
  <g>
    {/* dedo */}
    <rect x={-40} y={880} width={760} height={180} rx={90} fill={PIEL} />
    <rect x={560} y={870} width={130} height={30} rx={12} fill={esmalte > 0.5 ? "#3A0A2A" : "#F4D8D0"} />
    {/* mandíbulas */}
    <rect x={300} y={740} width={440} height={150} rx={40} fill="#E8E4F0" />
    <rect x={300} y={1050} width={440} height={130} rx={40} fill="#E8E4F0" />
    <rect x={340} y={765} width={200} height={100} rx={12} fill="#0E1A2A" />
    <Texto x={440} y={835} size={56} color={C.cyan}>
      {lectura}
    </Texto>
    <path
      d={`M 560 815 l 30 0 l 15 -30 l 20 60 l 15 -30 l 40 0`}
      stroke={C.red}
      strokeWidth={6}
      fill="none"
      opacity={0.5 + 0.5 * Math.max(0, Math.sin(t * 7))}
    />
    <g opacity={corte}>
      <circle cx={600} cy={885} r={16} fill={ROJO} />
      <circle cx={650} cy={885} r={16} fill={IRC} />
      <rect x={590} y={1045} width={70} height={18} rx={6} fill="#141030" />
      <rect x={570} y={902} width={110} height={22} rx={8} fill="#3A0A2A" opacity={esmalte} stroke="#E85AB8" strokeWidth={3} />
      <g opacity={haz}>
        <path d="M 600 900 L 615 1045" stroke={ROJO} strokeWidth={14} opacity={0.6 * (1 - esmalte * 0.8)} />
        <path d="M 650 900 L 635 1045" stroke={IRC} strokeWidth={14} opacity={0.7 * (1 - esmalte * 0.8)} />
      </g>
    </g>
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Pinza lectura="98%" t={t} />
    <Texto x={860} y={700} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo ve tu sangre esta pinza?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.te], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={ROJO} />
    </>
  );
};

// B. Te la pones en el dedo y en segundos sabe cuánto oxígeno llevas + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = Math.round(interpolate(t, [T.segundos, T.llevas], [0, 98], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.te, T.lado], [1, 1.05])}>
      <Pinza lectura={t < T.segundos ? "--" : `${v}%`} t={t} />
      <Texto x={540} y={1260} size={38} color={C.cyan} op={aparece(t, T.llevas)}>
        oxígeno en sangre
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.lado], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué falla con uñas pintadas
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Dos luces, roja e infrarroja; del otro lado un sensor mide cuánta luz atraviesa
export const Luces: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.lado, T.hemoglobina], [1, 1.25])} cy={960}>
      <Pinza lectura="98%" corte={aparece(t, T.lado)} haz={aparece(t, T.atraviesa)} t={t} />
      <Texto x={500} y={660} size={36} color={ROJO} op={aparece(t, T.roja)}>
        roja
      </Texto>
      <Texto x={720} y={660} size={36} color="#E85AB8" op={aparece(t, T.infrarroja)}>
        infrarroja
      </Texto>
      <Texto x={625} y={1240} size={36} color={C.white} op={aparece(t, T.sensor)}>
        sensor
      </Texto>
    </Lienzo>
  );
};

// Barras de absorción
const Hemo: React.FC<{ readonly x: number; readonly ox: boolean; readonly op: number; readonly bars: number }> = ({ x, ox, op, bars }) => (
  <g opacity={op}>
    <circle cx={x} cy={640} r={95} fill={ox ? "#E8283A" : "#6A1022"} />
    <Texto x={x} y={655} size={36} color={C.white}>
      {ox ? "con O₂" : "sin O₂"}
    </Texto>
    {[
      ["rojo", ROJO, ox ? 0.25 : 0.85],
      ["infrarrojo", "#E85AB8", ox ? 0.85 : 0.4],
    ].map(([n, col, v], k) => (
      <g key={n as string}>
        <rect x={x - 110 + k * 120} y={1180 - 360 * (v as number) * bars} width={100} height={360 * (v as number) * bars} rx={10} fill={col as string} />
        <Texto x={x - 60 + k * 120} y={1230} size={26} color={col as string}>
          {n as string}
        </Texto>
      </g>
    ))}
    <Texto x={x} y={1290} size={28} color={C.grey}>
      absorbe
    </Texto>
  </g>
);

// D. La hemoglobina con oxígeno absorbe más infrarrojo; la que no tiene, lo contrario
export const Absorbe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.hemoglobina, T.latido], [1, 1.04])}>
      <Hemo x={290} ox op={aparece(t, T.hemoglobina)} bars={interpolate(t, [T.absorbe, T.rojo], [0, 1], clamp)} />
      <Hemo x={790} ox={false} op={aparece(t, T.no)} bars={interpolate(t, [T.no + 0.3, T.contrario + 0.4], [0, 1], clamp)} />
    </Lienzo>
  );
};

// E. Con cada latido la luz cambia; comparando el pulso en los dos colores calcula el porcentaje
export const Pulso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const onda = (y: number, amp: number, col: string) => (
    <path
      d={new Array(121)
        .fill(0)
        .map((_, i) => {
          const ph = ((t * 1.2 - i / 40) % 1 + 1) % 1;
          const v = Math.exp(-((ph - 0.2) ** 2) / 0.006) + 0.4 * Math.exp(-((ph - 0.45) ** 2) / 0.01);
          return `${i ? "L" : "M"} ${140 + i * 6.7} ${y - v * amp}`;
        })
        .join(" ")}
      stroke={col}
      strokeWidth={7}
      fill="none"
    />
  );
  const pct = Math.round(interpolate(t, [T.calcula, T.calcula + 0.8], [0, 98], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.latido, T.esmalte], [1, 1.04])}>
        <g opacity={aparece(t, T.latido)}>
          {onda(760, 110, ROJO)}
          <Texto x={140} y={600} size={30} color={ROJO} anchor="start">
            rojo
          </Texto>
        </g>
        <g opacity={aparece(t, T.colores)}>
          {onda(1060, 150, "#E85AB8")}
          <Texto x={140} y={880} size={30} color="#E85AB8" anchor="start">
            infrarrojo
          </Texto>
        </g>
        <g opacity={aparece(t, T.calcula)}>
          <rect x={340} y={1150} width={400} height={140} rx={24} fill={C.card} stroke={C.cyan} strokeWidth={4} />
          <Texto x={540} y={1245} size={72} color={C.cyan}>
            {`${pct} %`}
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.calcula + 0.8} color={C.cyan} />
    </>
  );
};

// F. El esmalte oscuro bloquea parte de la luz y puede engañarlo
export const Esmalte: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const e = aparece(t, T.esmalte);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.esmalte, T.asi], [1.25, 1.3])} cy={960}>
        <Pinza lectura={aparece(t, T.enganarlo) > 0.5 ? "??" : "98%"} corte={1} haz={1} t={t} esmalte={e} />
        <Texto x={625} y={1240} size={36} color={C.red} op={aparece(t, T.bloquea)}>
          el esmalte bloquea la luz
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.enganarlo} color={C.red} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
