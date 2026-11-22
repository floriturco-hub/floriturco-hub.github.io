import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/torque/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  aprietas: 2.00, // aprietas
  clic: 5.30, // cli
  final: 6.42, // final
  dentro: 9.00, // dentro
  resorte: 10.20, // resorte
  bloque: 11.62, // bloque
  girando: 13.68, // girando
  comprimes: 14.46, // comprimes
  eliges: 17.12, // eliges
  mientras: 18.54, // mientras
  aguanta: 19.90, // aguanta
  pero: 20.66, // pero
  supera: 21.54, // supera
  desliza: 23.54, // desliza
  salto: 25.24, // salto
  clic2: 26.78, // cli
  si: 27.02, // si
  apretado: 28.60, // apretado
  cansa: 29.42, // cansa
  minimo: 32.56, // minimo
  asi: 33.24, // asi
  fin: 35.00, // FIN
};

const ACERO = "#B8B8CC";

// Torquímetro: perno en (0,0); corte muestra el interior; comp = compresión del resorte;
// salto = desliza el bloque; giro = ángulo de toda la llave
const Llave: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly corte?: number;
  readonly comp?: number;
  readonly salto?: number;
  readonly giro?: number;
  readonly fatiga?: number;
}> = ({ x, y, s, corte = 0, comp = 0.3, salto = 0, giro = 0, fatiga = 0 }) => {
  const tapon = 640 - 160 * comp;
  const bloque = 170;
  const n = 10;
  const resorte = new Array(n * 2 + 1)
    .fill(0)
    .map((_, i) => {
      const px = bloque + 40 + ((tapon - bloque - 40) * i) / (n * 2);
      const py = i === 0 || i === n * 2 ? 0 : i % 2 ? -24 : 24;
      return `${i ? "L" : "M"} ${px} ${py}`;
    })
    .join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${s})`}>
      {/* perno */}
      <polygon points="-60,-35 -60,35 0,70 60,35 60,-35 0,-70" fill="#5A5478" />
      <g transform={`rotate(${salto * 5})`}>
        <circle cx={0} cy={0} r={85} fill={ACERO} />
        <circle cx={0} cy={0} r={38} fill="#3A3650" />
      </g>
      <rect x={70} y={-45} width={680} height={90} rx={30} fill={ACERO} />
      <rect x={740} y={-55} width={140} height={110} rx={24} fill="#2A2640" />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={760 + k * 24} y={-55} width={10} height={110} fill="#4A4466" />
      ))}
      <g opacity={corte}>
        <rect x={90} y={-32} width={640} height={64} rx={20} fill="#141030" />
        <rect x={bloque - 60} y={-26 + salto * 18} width={100} height={52} rx={8} fill={C.yellow} />
        <path d={resorte} stroke={fatiga > 0.5 ? C.red : C.cyan} strokeWidth={9} fill="none" strokeLinejoin="round" />
        <rect x={tapon} y={-30} width={30} height={60} rx={6} fill={C.grey} />
        <rect x={tapon + 30} y={-8} width={740 - tapon} height={16} fill={C.grey} />
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Llave x={200} y={960} s={0.9} />
    <Texto x={540} y={780} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe esta llave cuándo parar?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.aprietas], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Aprietas y, en la fuerza exacta, suena clic + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.aprietas, T.clic], [0, -18], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aprietas, T.dentro], [1, 1.05])}>
        <Llave x={200} y={960} s={0.9} giro={giro} salto={aparece(t, T.clic) * (1 - aparece(t, T.clic + 0.4))} />
        <Texto x={760} y={700} size={80} color={C.yellow} op={aparece(t, T.clic) * (1 - aparece(t, T.final + 0.3))}>
          ¡CLIC!
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.dentro], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            por qué no guardarla así: al final
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.clic} color={C.yellow} />
    </>
  );
};

// C. Dentro del mango hay un resorte que empuja un bloque contra la cabeza
export const Dentro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.girando], [1, 1.04])}>
      <Llave x={120} y={900} s={1.0} corte={aparece(t, T.dentro + 0.2)} />
      <g opacity={aparece(t, T.resorte)}>
        <path d="M 540 1040 L 540 960" stroke={C.cyan} strokeWidth={6} />
        <Texto x={540} y={1090} size={38} color={C.cyan}>
          resorte
        </Texto>
      </g>
      <g opacity={aparece(t, T.bloque)}>
        <path d="M 280 800 L 280 860" stroke={C.yellow} strokeWidth={6} />
        <Texto x={280} y={770} size={38} color={C.yellow}>
          bloque
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Girando la perilla comprimes el resorte: así eliges la fuerza
export const Perilla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const comp = interpolate(t, [T.girando, T.eliges], [0.1, 0.8], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.girando, T.mientras], [1, 1.04])}>
      <Llave x={120} y={900} s={1.0} corte={1} comp={comp} />
      <g opacity={aparece(t, T.girando)}>
        <path d="M 1000 760 a 60 60 0 1 1 -40 -30" stroke={C.yellow} strokeWidth={8} fill="none" />
        <path d="M 945 715 l 20 20 l -30 8 Z" fill={C.yellow} />
      </g>
      <g opacity={aparece(t, T.eliges)}>
        <rect x={340} y={1120} width={400} height={130} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={1205} size={60} color={C.yellow}>
          {`${Math.round(20 + comp * 100)} N·m`}
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. El resorte aguanta; cuando la fuerza lo supera, el bloque se desliza: clic
export const Clic: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fuerza = interpolate(t, [T.mientras, T.supera + 0.3], [0.1, 1], clamp);
  const salto = aparece(t, T.desliza);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.mientras, T.si], [1, 1.04])}>
        <Llave x={120} y={900} s={1.0} corte={1} comp={0.6} salto={salto} />
        <g opacity={aparece(t, T.mientras)}>
          <rect x={880} y={1000} width={40} height={60 + 260 * fuerza} rx={14} fill={C.orange} />
          <path d={`M 860 ${1060 + 260 * fuerza} l 40 50 l 40 -50 Z`} fill={C.orange} />
          <Texto x={900} y={970} size={32} color={C.orange}>
            fuerza
          </Texto>
        </g>
        <Texto x={540} y={1150} size={38} color={C.cyan} op={aparece(t, T.aguanta) * (1 - salto)}>
          el resorte aguanta
        </Texto>
        <Texto x={420} y={700} size={80} color={C.yellow} op={aparece(t, T.salto)}>
          ¡CLIC!
        </Texto>
        <Texto x={540} y={1150} size={38} color={C.yellow} op={salto}>
          el bloque se desliza
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desliza} color={C.yellow} />
    </>
  );
};

// F. Si la guardas con el resorte apretado se cansa; déjala en el mínimo
export const Guardar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fat = aparece(t, T.cansa);
  const comp = interpolate(t, [T.minimo - 0.3, T.minimo + 0.5], [0.9, 0.05], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.asi], [1, 1.04])}>
      <Llave x={120} y={900} s={1.0} corte={1} comp={comp} fatiga={fat * (1 - aparece(t, T.minimo))} />
      <Texto x={540} y={1150} size={40} color={C.red} op={aparece(t, T.cansa) * (1 - aparece(t, T.minimo))}>
        se cansa: pierde precisión
      </Texto>
      <Texto x={540} y={1150} size={40} color={C.cyan} op={aparece(t, T.minimo)}>
        guárdala en el mínimo
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
