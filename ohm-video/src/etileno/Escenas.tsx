import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/etileno/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  guardas: 2.72, // guardas
  bolsa: 4.30, // bolsa
  maduro: 5.70, // maduro
  rapido: 7.42, // r
  final: 8.38, // final
  fruta: 9.38, // fruta
  etileno: 11.84, // etileno
  hormona: 14.66, // hormona
  ordena: 16.68, // ordena
  azucar: 19.74, // az
  ablanda: 20.96, // ablanda
  suelta2: 23.26, // suelta
  cadena: 25.44, // cadena
  papel2: 26.74, // papel
  humedad: 30.02, // humedad
  plastico: 31.30, // pl
  manzana: 33.16, // manzana
  porEso: 35.42, // por
  fin: 37.60, // FIN
};

const GAS = "#C8E8A0";

const Platano: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly maduro?: number }> = ({ x, y, s = 1, maduro = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -150 -40 Q -60 120 130 40 Q 160 30 150 10 Q -20 70 -120 -60 Z" fill={maduro > 0.5 ? "#F0D040" : "#9AC850"} />
    {maduro > 0.5 ? [-80, -20, 40, 90].map((dx) => <circle key={dx} cx={dx} cy={30 + Math.abs(dx) * 0.1} r={7} fill="#6A4A20" />) : null}
    <rect x={-160} y={-70} width={20} height={30} rx={6} fill="#6A5A30" />
  </g>
);

// Aguacate: madurez 0 (verde brillante) -> 1 (oscuro)
const Aguacate: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly m: number }> = ({ x, y, s = 1, m }) => {
  const col = m < 0.5 ? "#5AB040" : "#3A4A20";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 -130 Q 70 -120 80 -20 Q 100 120 0 130 Q -100 120 -80 -20 Q -70 -120 0 -130 Z" fill={col} />
      <ellipse cx={-25} cy={-60} rx={18} ry={30} fill="#FFFFFF" opacity={0.15} />
    </g>
  );
};

const Gas: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number; readonly n?: number }> = ({ x, y, t, op, n = 8 }) => (
  <g opacity={op}>
    {new Array(n).fill(0).map((_, k) => {
      const u = (t * 0.4 + k / n) % 1;
      const a = k * 2.1;
      return <circle key={k} cx={x + Math.cos(a) * 60 * (1 + u * 3)} cy={y + Math.sin(a) * 40 * (1 + u * 3) - u * 60} r={8 + u * 6} fill={GAS} opacity={1 - u} />;
    })}
  </g>
);

const Bolsa: React.FC<{ readonly t: number }> = () => (
  <path d="M 200 700 L 880 700 L 920 1400 L 160 1400 Z" fill="#C8A070" opacity={0.25} stroke="#C8A070" strokeWidth={6} />
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Bolsa t={t} />
    <Platano x={400} y={1100} />
    <Aguacate x={700} y={1100} m={0.5 + 0.5 * Math.sin(t)} />
    <Gas x={400} y={1080} t={t} op={0.8} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este plátano acelera al aguacate?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.guardas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Aguacate verde en bolsa de papel con un plátano maduro: madura mucho más rápido + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const m = interpolate(t, [T.rapido, T.final], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.guardas, T.etileno], [1, 1.04])}>
      <g opacity={aparece(t, T.bolsa)}>
        <Bolsa t={t} />
      </g>
      <Aguacate x={700} y={1100} m={m} />
      <g opacity={aparece(t, T.maduro)}>
        <Platano x={400} y={1100} />
      </g>
      <Texto x={540} y={1490} size={40} color={C.yellow} op={aparece(t, T.rapido)}>
        ¡madura mucho más rápido!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué otra fruta sirve?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.etileno], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El plátano suelta etileno, un gas hormona; ordena madurar: almidón a azúcar, pulpa blanda; reacción en cadena
export const Etileno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const m = interpolate(t, [T.ordena, T.ablanda + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.etileno, T.papel2], [1, 1.04])}>
        <Platano x={300} y={1000} />
        <Gas x={300} y={980} t={t} op={aparece(t, T.etileno)} n={10} />
        <Aguacate x={780} y={1000} m={m} />
        <Gas x={780} y={980} t={t} op={aparece(t, T.suelta2)} n={8} />
        <Texto x={540} y={640} size={42} color={GAS} op={aparece(t, T.etileno)}>
          etileno: un gas invisible
        </Texto>
        <Texto x={540} y={710} size={32} color={C.white} op={aparece(t, T.hormona)}>
          una hormona de las plantas
        </Texto>
        <Texto x={540} y={1260} size={34} color={C.yellow} op={aparece(t, T.azucar)}>
          almidón → azúcar, pulpa blanda
        </Texto>
        <Texto x={540} y={1360} size={38} color={GAS} op={aparece(t, T.cadena)}>
          ¡reacción en cadena!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.etileno} color={GAS} />
    </>
  );
};

// D. La bolsa de papel atrapa el gas pero deja salir la humedad; en plástico, se pudriría
export const Papel: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.papel2, T.manzana], [1, 1.04])}>
      <g transform="translate(-180 0) scale(1)">
        <path d="M 260 760 L 620 760 L 640 1240 L 240 1240 Z" fill="#C8A070" opacity={0.25} stroke="#C8A070" strokeWidth={6} />
        <Gas x={440} y={1050} t={t} op={1} n={10} />
        {aparece(t, T.humedad) > 0
          ? [0, 1, 2].map((k) => <path key={k} d={`M ${340 + k * 90} ${740 - ((t * 40 + k * 15) % 60)} q 10 -20 0 -40`} stroke="#8AC8FF" strokeWidth={5} fill="none" opacity={aparece(t, T.humedad)} />)
          : null}
      </g>
      <Texto x={260} y={1320} size={30} color="#C8A070">
        papel: atrapa el gas
      </Texto>
      <Texto x={260} y={1380} size={28} color="#8AC8FF" op={aparece(t, T.humedad)}>
        y deja salir la humedad
      </Texto>
      <g opacity={aparece(t, T.plastico)}>
        <path d="M 640 760 L 980 760 L 1000 1240 L 620 1240 Z" fill="#DDEEFF" opacity={0.15} stroke="#DDEEFF" strokeWidth={4} />
        {new Array(8).fill(0).map((_, k) => (
          <circle key={k} cx={680 + ((k * 47) % 280)} cy={800 + ((k * 61) % 400)} r={8} fill="#8AC8FF" opacity={0.7} />
        ))}
        <Texto x={810} y={1320} size={30} color={C.red}>
          plástico: se pudre
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. La manzana también suelta mucho etileno
export const Manzana: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.manzana, T.porEso], [1, 1.04])}>
        <g transform="translate(540 1000)">
          <path d="M 0 -100 Q 120 -170 150 -20 Q 160 120 40 150 Q 0 130 -40 150 Q -160 120 -150 -20 Q -120 -170 0 -100 Z" fill="#C8403A" />
          <rect x={-6} y={-150} width={12} height={50} fill="#6A4A20" />
          <path d="M 6 -140 Q 60 -170 70 -130 Q 30 -120 6 -140 Z" fill="#5AB040" />
        </g>
        <Gas x={540} y={980} t={t} op={aparece(t, T.manzana)} n={10} />
        <Texto x={540} y={1300} size={42} color={C.yellow} op={aparece(t, T.manzana)}>
          la manzana también
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.manzana} color={GAS} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
