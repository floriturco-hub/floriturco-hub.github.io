import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/panal/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  pequeno: 2.40, // pequeno
  litro: 3.94, // litro
  gotear: 4.82, // gotear
  final: 5.78, // final
  polvo: 9.10, // polvo
  poliacrilato: 9.66, // poliacrilato
  cadenas: 11.44, // cadenas
  negativas: 13.04, // negativas
  iones: 13.82, // iones
  red: 15.58, // red
  llega: 16.36, // llega
  sodio: 17.32, // sodio
  repelen: 19.40, // repelen
  estira: 20.78, // estira
  hincha: 21.60, // hincha
  osmosis: 23.66, // osmosis
  disuelve: 27.00, // disuelve
  gel: 29.10, // gel
  cientos: 30.28, // cientos
  pura: 31.98, // pura
  orina: 33.34, // orina
  frena: 33.64, // frena
  asi: 36.34, // asi
  fin: 38.14, // FIN
};

const AGUA = "#5AB8F0";

const Panal: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly lleno?: number }> = ({ x, y, s = 1, lleno = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -280 -160 L 280 -160 L 260 -40 Q 160 200 0 220 Q -160 200 -260 -40 Z" fill="#F0F0F4" />
    <path d="M -280 -160 L 280 -160 L 270 -110 L -270 -110 Z" fill="#8AC8F0" />
    <path d="M -180 -80 L 180 -80 Q 120 140 0 160 Q -120 140 -180 -80 Z" fill={AGUA} opacity={0.15 + 0.45 * lleno} />
    <rect x={-300} y={-150} width={50} height={60} rx={10} fill="#F8D060" />
    <rect x={250} y={-150} width={50} height={60} rx={10} fill="#F8D060" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Panal x={540} y={1050} s={1.3} lleno={1} />
    {[0, 1, 2].map((k) => {
      const u = (t * 0.8 + k / 3) % 1;
      return <path key={k} transform={`translate(${460 + k * 80} ${700 + u * 260}) scale(1.2)`} d="M 0 -30 C 15 -8 22 4 22 14 A 22 22 0 0 1 -22 14 C -22 4 -15 -8 0 -30 Z" fill={AGUA} opacity={1 - u} />;
    })}
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo absorbe tanto este pañal?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pequeno], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Un pañal pequeño atrapa casi un litro de agua sin gotear + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vierte = interpolate(t, [T.litro, T.final], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.pequeno, T.polvo], [1, 1.04])}>
      <Panal x={540} y={1150} s={1.1} lleno={vierte} />
      <g opacity={aparece(t, T.litro)} transform={`rotate(${-70 * Math.min(1, vierte * 3)} 760 760)`}>
        <rect x={680} y={600} width={160} height={320} rx={24} fill={AGUA} opacity={0.4 + 0.5 * (1 - vierte)} stroke="#C8E8FF" strokeWidth={4} />
        <Texto x={760} y={790} size={44} color="#0A3A5A">
          1 L
        </Texto>
      </g>
      <path d={`M 600 820 Q 560 900 545 ${1000}`} stroke={AGUA} strokeWidth={18} fill="none" opacity={vierte > 0.1 && vierte < 0.95 ? 1 : 0} />
      <Texto x={540} y={1460} size={42} color="#5AD08A" op={aparece(t, T.gotear)}>
        sin gotear
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué con orina absorbe menos?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.polvo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Red de polímero: hinchado 0..1; sodio suelto 0..1; agua dentro 0..1
const Red: React.FC<{ readonly t: number; readonly hinchado: number; readonly suelto: number; readonly agua: number; readonly cargas?: number; readonly iones?: number }> = ({
  t,
  hinchado,
  suelto,
  agua,
  cargas = 1,
  iones = 1,
}) => {
  const esc = 1 + hinchado * 0.7;
  const nodos = new Array(16).fill(0).map((_, k) => {
    const i = k % 4;
    const j = Math.floor(k / 4);
    return [540 + (i - 1.5) * 150 * esc + 10 * Math.sin(t * 2 + k), 980 + (j - 1.5) * 150 * esc + 10 * Math.cos(t * 2 + k)];
  });
  return (
    <g>
      {agua > 0 ? <rect x={540 - 280 * esc} y={980 - 280 * esc} width={560 * esc} height={560 * esc} rx={60} fill={AGUA} opacity={0.3 * agua} /> : null}
      {nodos.map(([x, y], k) => {
        const lados: number[] = [];
        if (k % 4 < 3) lados.push(k + 1);
        if (k < 12) lados.push(k + 4);
        return lados.map((m) => <line key={`${k}-${m}`} x1={x} y1={y} x2={nodos[m][0]} y2={nodos[m][1]} stroke="#E8E8EE" strokeWidth={8} />);
      })}
      {nodos.map(([x, y], k) => (
        <g key={k}>
          <circle cx={x} cy={y} r={20} fill={C.red} opacity={cargas} />
          <Texto x={x} y={y + 10} size={30} color="#fff" op={cargas}>
            −
          </Texto>
          <g opacity={iones}>
            <circle cx={x + 30 + suelto * (k % 2 ? 120 : -120) * Math.cos(k)} cy={y - 30 + suelto * 100 * Math.sin(k * 2)} r={16} fill={C.purpleLight} />
            <Texto x={x + 30 + suelto * (k % 2 ? 120 : -120) * Math.cos(k)} y={y - 22 + suelto * 100 * Math.sin(k * 2)} size={20} color="#111">
              Na+
            </Texto>
          </g>
        </g>
      ))}
    </g>
  );
};

// C. Dentro tiene un polvo: poliacrilato de sodio; cadenas con cargas negativas e iones de sodio, en red
export const Polvo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const red = aparece(t, T.cadenas);
  return (
    <Lienzo zoom={interpolate(t, [T.polvo, T.llega], [1, 1.04])}>
      <g opacity={1 - red}>
        {new Array(60).fill(0).map((_, k) => (
          <rect key={k} x={240 + ((k * 97) % 600)} y={760 + ((k * 61) % 400)} width={14} height={14} fill="#F0F0F4" transform={`rotate(${k * 30} ${247 + ((k * 97) % 600)} ${767 + ((k * 61) % 400)})`} />
        ))}
      </g>
      <g opacity={red}>
        <Red t={t} hinchado={0} suelto={0} agua={0} cargas={aparece(t, T.negativas)} iones={aparece(t, T.iones)} />
      </g>
      <Texto x={540} y={560} size={44} color={C.white} op={aparece(t, T.poliacrilato)}>
        poliacrilato de sodio
      </Texto>
      <Texto x={540} y={1400} size={36} color={C.red} op={aparece(t, T.negativas)}>
        cadenas con cargas negativas
      </Texto>
      <Texto x={540} y={1460} size={34} color={C.purpleLight} op={aparece(t, T.iones)}>
        + iones de sodio
      </Texto>
    </Lienzo>
  );
};

// D. Llega el agua: el sodio se suelta, las cargas negativas se repelen y la red se estira y se hincha
export const Hincha: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hin = interpolate(t, [T.repelen, T.hincha + 0.5], [0, 0.6], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llega, T.osmosis], [1, 1.04])}>
        <Red t={t} hinchado={hin} suelto={aparece(t, T.sodio)} agua={aparece(t, T.llega)} />
        <Texto x={540} y={560} size={40} color={C.red} op={aparece(t, T.repelen)}>
          las cargas − se repelen
        </Texto>
        <Texto x={540} y={1560} size={42} color={C.yellow} op={aparece(t, T.hincha)}>
          ¡se hincha!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.hincha} color={C.yellow} />
    </>
  );
};

// E. El agua entra por ósmosis; la red no se disuelve: forma un gel. Cientos de veces su peso en agua pura
export const Gel: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gel = aparece(t, T.gel);
  return (
    <Lienzo zoom={interpolate(t, [T.osmosis, T.orina], [1, 1.04])}>
      <g opacity={1 - gel}>
        <Red t={t} hinchado={0.6} suelto={1} agua={1} />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = (k / 6) * Math.PI * 2;
          const u = (t * 0.8 + k / 6) % 1;
          const r = 520 - u * 160;
          return <path key={k} d={`M ${540 + Math.cos(a) * r} ${980 + Math.sin(a) * r} l ${-Math.cos(a) * 40} ${-Math.sin(a) * 40}`} stroke={AGUA} strokeWidth={10} opacity={aparece(t, T.osmosis) * (1 - u)} />;
        })}
        <Texto x={540} y={560} size={44} color={AGUA} op={aparece(t, T.osmosis)}>
          ósmosis
        </Texto>
      </g>
      <g opacity={gel}>
        <ellipse cx={540} cy={1000} rx={300} ry={220} fill={AGUA} opacity={0.6} />
        <ellipse cx={460} cy={920} rx={80} ry={40} fill="#fff" opacity={0.4} />
        <Texto x={540} y={600} size={48} color={AGUA}>
          gel
        </Texto>
        <Texto x={540} y={1340} size={40} color={C.yellow} op={aparece(t, T.cientos)}>
          cientos de veces su peso
        </Texto>
        <Texto x={540} y={1410} size={34} color={C.white} op={aparece(t, T.pura)}>
          en agua pura
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. La sal de la orina frena la ósmosis: absorbe mucho menos
export const Orina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fr = aparece(t, T.frena);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.orina, T.asi], [1, 1.04])}>
        <ellipse cx={300} cy={1000} rx={200} ry={150} fill={AGUA} opacity={0.6} />
        <Texto x={300} y={1240} size={34} color={AGUA}>
          agua pura
        </Texto>
        <ellipse cx={780} cy={1000} rx={200 - 110 * fr} ry={150 - 80 * fr} fill="#E8D060" opacity={0.6} />
        {new Array(10).fill(0).map((_, k) => (
          <rect key={k} x={680 + ((k * 37) % 200)} y={900 + ((k * 53) % 200)} width={12} height={12} fill="#fff" opacity={aparece(t, T.orina)} />
        ))}
        <Texto x={780} y={1240} size={34} color="#E8D060">
          orina (con sal)
        </Texto>
        <Texto x={540} y={1400} size={42} color={C.orange} op={fr}>
          la sal frena la ósmosis
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.frena} color={C.orange} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
