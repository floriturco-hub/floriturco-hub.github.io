import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/turbo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  potencia: 3.08, // potencia
  escape: 5.66, // escape
  final: 6.62, // final
  reaccionar: 8.50, // reaccionar
  gases: 9.80, // gases
  turbina: 11.40, // turbina
  miles: 12.70, // miles
  eje: 15.96, // eje
  compresor: 17.32, // compresor
  entrada: 18.78, // entrada
  aprieta: 20.56, // aprieta
  cilindro: 22.58, // cilindro
  oxigeno: 24.86, // oxigeno
  combustible: 27.98, // combustible
  potencia2: 30.12, // potencia
  aceleras: 31.26, // aceleras
  retraso: 35.00, // retraso
  lag: 36.42, // lag
  asi: 37.16, // asi
  fin: 38.76, // FIN
};

const GAS = "#E8703C";
const AIRE = "#8AC8FF";

// Turbo en corte: turbina (izq, gases) y compresor (der, aire) unidos por un eje
const Turbo: React.FC<{ readonly t: number; readonly giro: number; readonly gas?: number; readonly aire?: number; readonly ejeOp?: number }> = ({ t, giro, gas = 1, aire = 1, ejeOp = 1 }) => {
  const a = t * 720 * giro;
  const Rueda = ({ x, col }: { x: number; col: string }) => (
    <g transform={`translate(${x} 1000)`}>
      <circle cx={0} cy={0} r={150} fill="#2A2E3A" stroke="#8A90A0" strokeWidth={8} />
      <g transform={`rotate(${a})`}>
        {new Array(8).fill(0).map((_, k) => (
          <path key={k} transform={`rotate(${k * 45})`} d="M 0 -20 Q 50 -80 20 -130 L 0 -130 Q 20 -80 -10 -20 Z" fill={col} />
        ))}
      </g>
      <circle cx={0} cy={0} r={24} fill="#C8CCD8" />
    </g>
  );
  return (
    <g>
      <rect x={300} y={985} width={480} height={30} fill="#C8CCD8" opacity={ejeOp} />
      <Rueda x={250} col={GAS} />
      <Rueda x={830} col={AIRE} />
      {/* flujo de gases (entra por abajo a la izquierda y sale) */}
      {new Array(5).fill(0).map((_, k) => {
        const u = (t * 0.8 + k / 5) % 1;
        return <circle key={`g${k}`} cx={100 + u * 300} cy={1260 - u * 260} r={18} fill={GAS} opacity={gas * (1 - u)} />;
      })}
      {new Array(5).fill(0).map((_, k) => {
        const u = (t * 0.8 + k / 5) % 1;
        return <circle key={`a${k}`} cx={1000 - u * 170} cy={740 + u * 260} r={14} fill={AIRE} opacity={aire * (1 - u)} />;
      })}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Turbo t={t} giro={1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo usa este turbo el humo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.potencia], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Más potencia con los gases que iban a salir por el escape + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.potencia, T.gases], [1, 1.04])}>
      {/* auto con escape */}
      <path d="M 140 1080 L 220 960 L 640 940 L 820 1010 L 940 1030 L 940 1120 L 140 1120 Z" fill="#C8CCD8" />
      {[300, 780].map((x) => (
        <circle key={x} cx={x} cy={1130} r={56} fill="#2A2A2A" />
      ))}
      {new Array(6).fill(0).map((_, k) => {
        const u = (t * 0.7 + k / 6) % 1;
        return <circle key={k} cx={130 - u * 120} cy={1100 - u * 60} r={20 + u * 30} fill="#8C88A8" opacity={(1 - u) * 0.6 * (1 - aparece(t, T.escape) * 0.7)} />;
      })}
      <Texto x={540} y={1330} size={40} color={C.yellow} op={aparece(t, T.potencia)}>
        más potencia…
      </Texto>
      <Texto x={540} y={1410} size={36} color={GAS} op={aparece(t, T.escape)}>
        …con los gases del escape
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué tarda en reaccionar?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.gases], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Los gases del escape hacen girar una turbina a decenas de miles de vueltas por minuto
export const Turbina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.gases, T.eje], [1, 1.04])}>
        <Turbo t={t} giro={aparece(t, T.turbina) * 2} aire={0} ejeOp={0} />
        <Texto x={250} y={760} size={38} color={GAS} op={aparece(t, T.turbina)}>
          turbina
        </Texto>
        <Texto x={540} y={1420} size={36} color={C.yellow} op={aparece(t, T.miles)}>
          decenas de miles de vueltas por minuto
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.turbina} color={GAS} />
    </>
  );
};

// D. Un eje la une al compresor, en la entrada de aire, que aprieta el aire y mete más en cada cilindro
export const Compresor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.eje, T.oxigeno], [1, 1.04])}>
        <Turbo t={t} giro={2} aire={aparece(t, T.entrada)} ejeOp={aparece(t, T.eje)} />
        <Texto x={540} y={950} size={32} color={C.white} op={aparece(t, T.eje)}>
          eje
        </Texto>
        <Texto x={830} y={760} size={38} color={AIRE} op={aparece(t, T.compresor)}>
          compresor
        </Texto>
        <g opacity={aparece(t, T.cilindro)} transform="translate(540 1300)">
          <rect x={-90} y={-60} width={180} height={200} rx={14} fill="none" stroke="#C8CCD8" strokeWidth={8} />
          {new Array(18).fill(0).map((_, k) => (
            <circle key={k} cx={-60 + (k % 6) * 24} cy={-30 + Math.floor(k / 6) * 34} r={9} fill={AIRE} />
          ))}
        </g>
        <Texto x={540} y={1530} size={34} color={AIRE} op={aparece(t, T.aprieta)}>
          aire apretado: más en cada cilindro
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.compresor} color={AIRE} />
    </>
  );
};

// E. Más aire = más oxígeno = más combustible quemado = más potencia
export const Potencia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasos: [string, string, number][] = [
    ["más aire", AIRE, T.oxigeno - 0.5],
    ["más oxígeno", C.cyan, T.oxigeno],
    ["más combustible", GAS, T.combustible],
    ["más potencia", C.yellow, T.potencia2],
  ];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.oxigeno, T.aceleras], [1, 1.04])}>
        {pasos.map(([txt, col, tt], k) => (
          <g key={txt} opacity={aparece(t, tt)}>
            <rect x={240} y={700 + k * 180} width={600} height={110} rx={24} fill="#1A2633" stroke={col} strokeWidth={5} />
            <Texto x={540} y={768 + k * 180} size={44} color={col}>
              {txt}
            </Texto>
            {k < 3 ? <path d={`M 540 ${815 + k * 180} l 0 50 m -14 -14 l 14 14 l 14 -14`} stroke={C.grey} strokeWidth={5} fill="none" /> : null}
          </g>
        ))}
      </Lienzo>
      <Flash t={t} d={T.potencia2} color={C.yellow} />
    </>
  );
};

// F. Si aceleras de golpe, primero debe haber gases: ese retraso es el turbo lag
export const Lag: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.aceleras + 0.3, T.lag + 0.8], [0.1, 2], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aceleras, T.asi], [1, 1.04])}>
        <Turbo t={t} giro={giro} gas={giro / 2} aire={giro / 2} />
        <g transform="translate(540 1380)">
          <rect x={-300} y={-25} width={600} height={50} rx={25} fill="#2A2E3A" />
          <rect x={-300} y={-25} width={600 * (giro / 2)} height={50} rx={25} fill={C.yellow} />
          <Texto x={0} y={-50} size={30} color={C.white}>
            empuje del turbo
          </Texto>
        </g>
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.aceleras)}>
          aceleras de golpe…
        </Texto>
        <Texto x={540} y={1520} size={44} color={C.orange} op={aparece(t, T.lag)}>
          turbo lag
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.lag} color={C.orange} />
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
