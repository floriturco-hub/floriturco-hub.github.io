import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/visor/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  visor: 2.12, // visor
  negra: 4.32, // negra
  verde: 6.02, // verde
  final: 7.52, // final
  luz: 9.90, // luz
  fotocatodo: 11.94, // fotocatodo
  foton: 13.68, // foton
  electron: 14.50, // electron
  tubitos: 17.58, // tubitos
  pelo: 19.56, // pelo
  choca: 20.96, // choca
  arranca: 22.16, // arranca
  avalancha: 25.42, // avalancha
  fosforo: 28.62, // fosforo
  brillante: 32.24, // brillante
  verde2: 33.36, // verde
  tonos: 34.98, // tonos
  cansa: 37.04, // cansa
  asi: 38.62, // asi
  fin: 40.08, // FIN
};

const VERDE = "#5AF07A";

// Paisaje nocturno: verde 0 = casi negro, 1 = visión nocturna
const Paisaje: React.FC<{ readonly t: number; readonly verde: number }> = ({ t, verde }) => {
  const c = (a: string, b: string) => (verde > 0.5 ? b : a);
  const op = 0.15 + 0.85 * verde;
  return (
    <g opacity={op}>
      <rect x={90} y={560} width={900} height={900} rx={450} fill={c("#05060A", "#0A2A10")} />
      <clipPath id="ojo">
        <rect x={90} y={560} width={900} height={900} rx={450} />
      </clipPath>
      <g clipPath="url(#ojo)">
        <path d="M 90 1180 L 300 1000 L 460 1120 L 640 940 L 990 1160 L 990 1460 L 90 1460 Z" fill={c("#0A0A12", "#1A6A2A")} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k} transform={`translate(${220 + k * 200} ${1220 - (k % 2) * 40})`}>
            <rect x={-10} y={0} width={20} height={80} fill={c("#0A0A10", "#2A8A3A")} />
            <path d="M -60 10 L 0 -140 L 60 10 Z" fill={c("#0A0A10", "#3AAA4A")} />
          </g>
        ))}
        <g transform={`translate(${560 + 30 * Math.sin(t)} 1300)`}>
          <circle cx={0} cy={-120} r={30} fill={c("#0A0A10", VERDE)} />
          <rect x={-30} y={-90} width={60} height={120} rx={20} fill={c("#0A0A10", VERDE)} />
        </g>
        {new Array(40).fill(0).map((_, k) => (
          <circle key={k} cx={100 + ((k * 137) % 880)} cy={580 + ((k * 89) % 860)} r={2} fill={VERDE} opacity={verde * 0.4 * Math.abs(Math.sin(t * 9 + k))} />
        ))}
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Paisaje t={t} verde={1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo ve en esta oscuridad?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.visor], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={VERDE} />
    </>
  );
};

// B. Con un visor nocturno, una noche casi negra se vuelve un paisaje verde brillante + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = interpolate(t, [T.verde - 0.4, T.verde + 0.3], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.visor, T.luz], [1, 1.04])}>
        <Paisaje t={t} verde={v} />
        <Texto x={540} y={1540} size={36} color={C.grey} op={aparece(t, T.negra) * (1 - v)}>
          noche casi negra
        </Texto>
        <Texto x={540} y={1540} size={38} color={VERDE} op={v}>
          ¡paisaje verde brillante!
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            ¿por qué es verde?: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.luz], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.verde} color={VERDE} />
    </>
  );
};

// Tubo intensificador: fotocátodo (x=260), placa de microcanales (x=440..640), pantalla de fósforo (x=820)
const Tubo: React.FC<{ readonly t: number; readonly foto: number; readonly placa: number; readonly cascada: number; readonly fosforo: number }> = ({ t, foto, placa, cascada, fosforo }) => (
  <g>
    <rect x={160} y={760} width={760} height={400} rx={40} fill="#1A1A22" stroke="#3A3A44" strokeWidth={8} />
    <rect x={250} y={790} width={20} height={340} fill="#8A6AE0" opacity={0.4 + 0.6 * foto} />
    <g opacity={placa}>
      {new Array(9).fill(0).map((_, k) => (
        <rect key={k} x={440} y={800 + k * 37} width={200} height={20} rx={10} fill="none" stroke="#5A5A66" strokeWidth={4} transform={`rotate(-6 540 ${810 + k * 37})`} />
      ))}
    </g>
    <rect x={810} y={790} width={20} height={340} fill={VERDE} opacity={0.2 + 0.8 * fosforo * (0.7 + 0.3 * Math.sin(t * 10))} />
    {foto > 0
      ? new Array(4).fill(0).map((_, k) => {
          const u = (t * 0.8 + k / 4) % 1;
          return <circle key={k} cx={60 + u * 190} cy={860 + k * 70} r={10} fill={C.yellow} opacity={foto} />;
        })
      : null}
    {cascada > 0
      ? new Array(4).fill(0).map((_, k) => {
          const u = (t * 0.8 + k / 4) % 1;
          const n = Math.max(1, Math.round(Math.pow(2, u * 5 * cascada)));
          const x = 270 + u * 540;
          return new Array(Math.min(n, 16)).fill(0).map((__, j) => (
            <circle key={`${k}-${j}`} cx={x} cy={860 + k * 70 + (j - n / 2) * 4 * cascada} r={5} fill={C.cyan} opacity={0.9} />
          ));
        })
      : null}
  </g>
);

// C. La luz llega al fotocátodo, que convierte cada fotón en un electrón
export const Fotocatodo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.luz, T.tubitos], [1, 1.04])}>
      <Tubo t={t} foto={aparece(t, T.luz)} placa={0} cascada={0} fosforo={0} />
      {aparece(t, T.electron) > 0
        ? new Array(4).fill(0).map((_, k) => {
            const u = (t * 0.8 + k / 4) % 1;
            return <circle key={k} cx={280 + u * 140} cy={860 + k * 70} r={8} fill={C.cyan} opacity={aparece(t, T.electron)} />;
          })
        : null}
      <Texto x={260} y={720} size={34} color="#B89AF0" op={aparece(t, T.fotocatodo)}>
        fotocátodo
      </Texto>
      <Texto x={540} y={1260} size={38} color={C.yellow} op={aparece(t, T.foton)}>
        1 fotón →
      </Texto>
      <Texto x={540} y={1330} size={38} color={C.cyan} op={aparece(t, T.electron)}>
        → 1 electrón
      </Texto>
    </Lienzo>
  );
};

// D. Placa de millones de tubitos: cada electrón choca y arranca más electrones, una avalancha
export const Avalancha: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tubitos, T.fosforo], [1, 1.04])}>
        <Tubo t={t} foto={1} placa={aparece(t, T.tubitos)} cascada={aparece(t, T.choca)} fosforo={0} />
        <Texto x={540} y={720} size={34} color={C.white} op={aparece(t, T.tubitos)}>
          millones de tubitos de vidrio
        </Texto>
        <Texto x={540} y={1260} size={34} color={C.grey} op={aparece(t, T.pelo)}>
          más delgados que un pelo
        </Texto>
        <Texto x={540} y={1340} size={46} color={C.cyan} op={aparece(t, T.avalancha)}>
          ¡avalancha de electrones!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.avalancha} color={C.cyan} />
    </>
  );
};

// E. Miles de electrones golpean una pantalla de fósforo que brilla: decenas de miles de veces más brillante
export const Fosforo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.fosforo, T.verde2], [1, 1.04])}>
      <Tubo t={t} foto={1} placa={1} cascada={1} fosforo={aparece(t, T.fosforo)} />
      <Texto x={820} y={720} size={34} color={VERDE} op={aparece(t, T.fosforo)}>
        pantalla de fósforo
      </Texto>
      <Texto x={540} y={1300} size={44} color={VERDE} op={aparece(t, T.brillante)}>
        decenas de miles de veces
      </Texto>
      <Texto x={540} y={1370} size={40} color={C.white} op={aparece(t, T.brillante)}>
        más brillante
      </Texto>
    </Lienzo>
  );
};

// F. Es verde porque tu ojo distingue más tonos de verde y cansa menos la vista
export const Verde: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.verde2, T.asi], [1, 1.04])}>
      <g opacity={aparece(t, T.tonos)}>
        {new Array(10).fill(0).map((_, k) => (
          <rect key={k} x={140 + k * 80} y={820} width={70} height={140} rx={10} fill={`rgb(${20 + k * 10}, ${60 + k * 19}, ${30 + k * 10})`} />
        ))}
        {new Array(4).fill(0).map((_, k) => (
          <rect key={k} x={300 + k * 120} y={1020} width={100} height={100} rx={10} fill={`rgb(${60 + k * 60}, 20, ${40 + k * 20})`} opacity={0.8} />
        ))}
        <Texto x={540} y={790} size={34} color={VERDE}>
          muchos tonos de verde
        </Texto>
        <Texto x={540} y={1170} size={30} color={C.grey}>
          vs. menos de otros colores
        </Texto>
      </g>
      <Texto x={540} y={600} size={46} color={VERDE} op={aparece(t, T.verde2)}>
        ¿por qué verde?
      </Texto>
      <Texto x={540} y={1340} size={38} color={C.white} op={aparece(t, T.cansa)}>
        y cansa menos la vista
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
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
