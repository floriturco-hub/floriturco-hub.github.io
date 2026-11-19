import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/refresco/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  agitas: 2.64, // agitas
  abres: 3.50, // abres
  explota: 4.06, // explota
  muchos: 4.92, // muchos
  final: 6.90, // final
  refresco: 8.94, // refresco
  gas: 9.68, // gas
  agitarlo: 10.94, // agitarlo
  burbujitas: 12.44, // burbujitas
  paredes: 13.60, // paredes
  abrir: 14.46, // abrir
  presion: 15.06, // presion
  corre: 16.32, // corre
  crecen: 17.86, // crecen
  empujan: 18.96, // empujan
  idea: 20.76, // idea
  despegarlas: 22.00, // despegarlas
  suban: 22.98, // suban
  pero: 24.36, // pero
  estudio: 24.92, // estudio
  latas: 26.04, // latas
  golpear: 27.10, // golpear
  nada: 28.16, // nada
  esperar: 29.66, // esperar
  minutos: 30.84, // minutos
  disuelven: 32.02, // disuelven
  asi: 33.04, // asi
  fin: 36.28, // FIN
};

const LATA = "#C8283A";
const SODA = "#5A2A1A";
const ESPUMA = "#F0E8D8";

// Burbujas pegadas a las paredes (posiciones fijas)
const PARED = new Array(16).fill(0).map((_, k) => ({ x: k % 2 ? 95 : -95, y: -140 + Math.floor(k / 2) * 40 }));

// Lata con corte: burbujas pegadas (0-1), tamaño, despegue (suben), espuma (sale)
const Lata: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly rot?: number;
  readonly corte?: number;
  readonly pegadas?: number;
  readonly crece?: number;
  readonly suben?: number;
  readonly espuma?: number;
  readonly abierta?: boolean;
  readonly t?: number;
}> = ({ x, y, s, rot = 0, corte = 0, pegadas = 0, crece = 0, suben = 0, espuma = 0, abierta = false, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {espuma > 0 ? (
      <g>
        {new Array(12).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={Math.sin(k * 2.1) * 60 * espuma}
            cy={-230 - espuma * (60 + ((k * 37) % 200))}
            r={20 + espuma * 26}
            fill={ESPUMA}
            opacity={0.9}
          />
        ))}
      </g>
    ) : null}
    <rect x={-120} y={-210} width={240} height={420} rx={30} fill={LATA} />
    <rect x={-110} y={-230} width={220} height={30} rx={12} fill="#C8C4D8" />
    <rect x={-110} y={200} width={220} height={24} rx={10} fill="#C8C4D8" />
    <g opacity={abierta ? 1 : 0}>
      <ellipse cx={20} cy={-232} rx={30} ry={10} fill="#141030" />
    </g>
    <g opacity={1 - corte}>
      <path d="M -120 -40 q 120 60 240 0 l 0 60 q -120 60 -240 0 Z" fill={C.white} />
    </g>
    <g opacity={corte}>
      <rect x={-105} y={-195} width={210} height={390} rx={20} fill="#141030" />
      <rect x={-105} y={-160} width={210} height={355} rx={16} fill={SODA} />
      {new Array(30).fill(0).map((_, k) => (
        <circle key={k} cx={-90 + ((k * 47) % 180)} cy={-140 + ((k * 71) % 320)} r={3} fill={C.white} opacity={0.5} />
      ))}
      {PARED.map((b, k) => {
        const yy = b.y - suben * (b.y + 175) + Math.sin(t * 3 + k) * 2;
        const xx = b.x * (1 - suben * 0.6);
        return <circle key={k} cx={xx} cy={yy} r={9 + crece * 24} fill="none" stroke={C.white} strokeWidth={4} opacity={pegadas} />;
      })}
    </g>
  </g>
);

const Dedo: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) => {
  const g = Math.abs(Math.sin(t * 9)) * 30;
  return (
    <g opacity={op}>
      <rect x={x + g} y={y - 30} width={200} height={60} rx={30} fill="#E8B48A" />
      <path d={`M ${x - 20} ${y - 50} l -30 -20 M ${x - 25} ${y} l -40 0 M ${x - 20} ${y + 50} l -30 20`} stroke={C.yellow} strokeWidth={6} opacity={g < 8 ? 1 : 0} />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Lata x={460} y={960} s={1.2} />
    <Dedo x={640} y={960} t={t} op={1} />
    <Texto x={760} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿sirve golpear la lata antes de abrirla?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.agitas], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. La agitas, la abres y explota; muchos le dan golpecitos + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const agita = t > T.agitas && t < T.abres ? Math.sin(t * 25) * 20 : 0;
  const esp = interpolate(t, [T.explota, T.explota + 0.5, T.muchos, T.muchos + 0.3], [0, 1, 1, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.agitas, T.refresco], [1, 1.05])}>
        <Lata x={460} y={900} s={1} rot={agita} espuma={esp} abierta={t > T.abres} />
        <Dedo x={620} y={900} t={t} op={aparece(t, T.muchos)} />
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.refresco], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            ¿funciona de verdad? al final
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.explota} color={ESPUMA} />
    </>
  );
};

// C. Gas disuelto; al agitarlo se forman burbujitas pegadas a las paredes
export const Gas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const agita = t > T.agitarlo && t < T.burbujitas ? Math.sin(t * 25) * 15 : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.refresco, T.abrir], [1, 1.05])}>
      <Lata x={540} y={880} s={1.2} rot={agita} corte={aparece(t, T.refresco)} pegadas={aparece(t, T.burbujitas)} t={t} />
      <Texto x={540} y={1250} size={38} color={C.white} op={aparece(t, T.gas) * (1 - aparece(t, T.burbujitas))}>
        gas disuelto
      </Texto>
      <Texto x={540} y={1250} size={38} color={C.white} op={aparece(t, T.burbujitas)}>
        burbujitas pegadas a las paredes
      </Texto>
    </Lienzo>
  );
};

// D. Al abrir baja la presión; el gas corre a las burbujas, crecen y empujan el líquido
export const Abrir: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.corre, T.crecen + 0.4], [0, 1], clamp);
  const esp = interpolate(t, [T.empujan, T.empujan + 0.7], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.abrir, T.idea], [1, 1.04])}>
        <Lata x={540} y={940} s={1.1} corte={1} pegadas={1} crece={crece} espuma={esp} abierta t={t} />
        <Texto x={540} y={1300} size={38} color={C.white} op={aparece(t, T.presion) * (1 - aparece(t, T.crecen))}>
          la presión baja
        </Texto>
        <Texto x={540} y={1300} size={40} color={C.yellow} op={aparece(t, T.crecen)}>
          las burbujas crecen de golpe
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.empujan} color={ESPUMA} />
    </>
  );
};

// E. La idea: los golpecitos despegan las burbujas para que suban
export const Idea: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suben = interpolate(t, [T.despegarlas, T.suban + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.idea, T.pero], [1, 1.04])}>
      <Lata x={460} y={900} s={1.1} corte={1} pegadas={1} suben={suben} t={t} />
      <Dedo x={630} y={900} t={t} op={aparece(t, T.idea)} />
      <Texto x={540} y={1300} size={38} color={C.white} op={aparece(t, T.despegarlas)}>
        la idea: despegarlas para que suban
      </Texto>
    </Lienzo>
  );
};

// F. Un estudio con más de mil latas: golpear no cambia nada
export const Estudio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = interpolate(t, [T.golpear, T.nada], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.esperar], [1, 1.04])}>
        <Texto x={540} y={500} size={44} color={C.white} op={aparece(t, T.estudio)}>
          estudio
        </Texto>
        <Texto x={540} y={600} size={70} color={C.yellow} op={aparece(t, T.latas)}>
          +1.000 latas
        </Texto>
        {[
          [360, "golpeadas"],
          [720, "sin golpear"],
        ].map(([x, n]) => (
          <g key={n as string} opacity={aparece(t, T.golpear)}>
            <rect x={(x as number) - 80} y={1150 - 360 * h} width={160} height={360 * h} rx={14} fill={ESPUMA} />
            <Texto x={x as number} y={1210} size={34} color={C.white}>
              {n as string}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={1300} size={34} color={C.grey} op={aparece(t, T.golpear)}>
          líquido derramado
        </Texto>
        <Texto x={540} y={1400} size={52} color={C.red} op={aparece(t, T.nada)}>
          ¡no cambia nada!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.nada} color={C.red} />
    </>
  );
};

// G. Lo que funciona es esperar: en unos minutos las burbujas se disuelven
export const Esperar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ang = interpolate(t, [T.minutos, T.asi], [0, 300], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.esperar, T.asi], [1, 1.04])}>
      <Lata x={380} y={940} s={1} corte={1} pegadas={1 - interpolate(t, [T.disuelven - 0.4, T.disuelven + 0.6], [0, 1], clamp)} t={t} />
      <g transform="translate(820 820)" opacity={aparece(t, T.esperar)}>
        <circle cx={0} cy={0} r={120} fill={C.card} stroke={C.white} strokeWidth={8} />
        <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * 90} y2={-Math.cos((ang * Math.PI) / 180) * 90} stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
        <circle cx={0} cy={0} r={12} fill={C.white} />
      </g>
      <Texto x={820} y={1010} size={38} color={C.yellow} op={aparece(t, T.esperar)}>
        espera
      </Texto>
      <Texto x={540} y={1330} size={38} color={C.white} op={aparece(t, T.disuelven)}>
        las burbujas se disuelven solas
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
