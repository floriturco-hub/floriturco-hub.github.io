import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/calentador/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  doblas: 1.78, // doblas
  monedita: 2.40, // monedita
  solido: 5.76, // solido
  final: 7.46, // final
  acetato: 10.20, // acetato
  deberia: 12.30, // deberia
  sobreenfriado: 13.84, // sobreenfriado
  senal: 16.54, // senal
  semilla: 18.70, // semilla
  primer: 19.52, // primer
  doblar: 21.38, // doblar
  diminuto: 23.20, // diminuto
  ola: 26.90, // ola
  volverse: 27.62, // volverse
  calor: 29.00, // calor
  grados: 31.26, // grados
  recargarla: 32.38, // recargarla
  hierve: 33.20, // hierve
  liquida: 35.04, // liquida
  asi: 35.76, // asi
  fin: 37.32, // FIN
};

const LIQ = "#8AC8F0";
const CRIS = "#F0F0F8";

// Bolsa con frente de cristalización (radio r desde la monedita)
const Bolsa: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly s?: number; readonly t?: number }> = ({ x, y, r, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <clipPath id={`bolsa${x}${y}`}>
      <rect x={-300} y={-220} width={600} height={440} rx={80} />
    </clipPath>
    <rect x={-300} y={-220} width={600} height={440} rx={80} fill={LIQ} opacity={0.5} stroke="#C8E8FF" strokeWidth={6} />
    <g clipPath={`url(#bolsa${x}${y})`}>
      <circle cx={-120} cy={40} r={r} fill={CRIS} opacity={0.9} />
      {r > 0
        ? new Array(18).fill(0).map((_, k) => {
            const a = (k / 18) * Math.PI * 2;
            return <line key={k} x1={-120} y1={40} x2={-120 + Math.cos(a) * r} y2={40 + Math.sin(a) * r} stroke="#C8D0E0" strokeWidth={3} />;
          })
        : null}
    </g>
    <circle cx={-120} cy={40} r={34} fill="#B8B8C4" stroke="#8A8A96" strokeWidth={4} />
    {void t}
  </g>
);

const Termometro: React.FC<{ readonly x: number; readonly y: number; readonly v: number; readonly texto: string }> = ({ x, y, v, texto }) => (
  <g>
    <rect x={x - 20} y={y - 260} width={40} height={260} rx={20} fill="#E8E8EE" />
    <circle cx={x} cy={y + 10} r={36} fill={v > 0.5 ? C.red : C.cyan} />
    <rect x={x - 10} y={y - 240 * v} width={20} height={240 * v + 10} fill={v > 0.5 ? C.red : C.cyan} />
    <Texto x={x} y={y + 100} size={36} color={C.white}>
      {texto}
    </Texto>
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Bolsa x={540} y={1000} r={60 + ((t * 200) % 500)} t={t} />
    <Texto x={540} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo se calienta esta bolsita?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.doblas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Doblas una monedita dentro del líquido y en segundos se vuelve sólido y caliente + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.monedita + 0.3, T.solido + 0.6], [0, 600], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.doblas, T.acetato], [1, 1.04])}>
      <Bolsa x={480} y={1000} r={r} t={t} />
      <Termometro x={920} y={1180} v={0.25 + 0.55 * (r / 600)} texto={`${Math.round(20 + 34 * (r / 600))} °C`} />
      <Texto x={480} y={1330} size={40} color={C.yellow} op={aparece(t, T.monedita) * (1 - aparece(t, T.solido))}>
        ¡clic!
      </Texto>
      <Texto x={480} y={1330} size={40} color={C.orange} op={aparece(t, T.solido)}>
        sólido y caliente
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo se recarga?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.acetato], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Acetato de sodio en agua: debería estar sólido pero está sobreenfriado, esperando una señal
export const Sobreenfriado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.acetato, T.semilla], [1, 1.04])}>
      <rect x={140} y={720} width={600} height={520} rx={40} fill={LIQ} opacity={0.3} />
      {new Array(24).fill(0).map((_, k) => (
        <circle key={k} cx={180 + ((k * 97 + t * 60 * (k % 3 + 1)) % 520)} cy={760 + ((k * 61 + t * 40 * ((k % 2) + 1)) % 440)} r={16} fill={LIQ} />
      ))}
      <Termometro x={900} y={1180} v={0.25} texto="20 °C" />
      <line x1={860} y1={1180 - 240 * 0.54} x2={960} y2={1180 - 240 * 0.54} stroke={C.yellow} strokeWidth={4} strokeDasharray="10 8" opacity={aparece(t, T.deberia)} />
      <Texto x={1010} y={1180 - 240 * 0.54 + 10} size={28} color={C.yellow} op={aparece(t, T.deberia)}>
        54 °C
      </Texto>
      <Texto x={540} y={1295} size={30} color={C.yellow} op={aparece(t, T.deberia)}>
        debería ser sólido por debajo de 54 °C
      </Texto>
      <Texto x={440} y={640} size={40} color={LIQ} op={aparece(t, T.acetato)}>
        acetato de sodio + agua
      </Texto>
      <Texto x={540} y={1360} size={44} color={C.cyan} op={aparece(t, T.sobreenfriado)}>
        sobreenfriado
      </Texto>
      <Texto x={540} y={1430} size={34} color={C.white} op={aparece(t, T.senal)}>
        sigue líquido, esperando una señal
      </Texto>
    </Lienzo>
  );
};

// D. Necesita una semilla: al doblar la monedita se forma un cristal diminuto y la cristalización se extiende como una ola
export const Semilla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.diminuto, T.ola + 1], [10, 600], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.semilla, T.volverse], [1, 1.04])}>
        <Bolsa x={540} y={1000} r={aparece(t, T.doblar) ? r : 0} t={t} />
        <Texto x={540} y={620} size={42} color={C.yellow} op={aparece(t, T.semilla)}>
          necesita una semilla
        </Texto>
        <Texto x={540} y={1330} size={36} color={C.white} op={aparece(t, T.diminuto)}>
          un cristal diminuto…
        </Texto>
        <Texto x={540} y={1400} size={40} color={CRIS} op={aparece(t, T.ola)}>
          …y se extiende como una ola
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.doblar} color={C.white} />
    </>
  );
};

// E. Al volverse sólido suelta el calor que guardaba: se queda a unos 54 °C
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = interpolate(t, [T.calor, T.grados], [0.3, 0.8], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.volverse, T.recargarla], [1, 1.04])}>
        <Bolsa x={480} y={1000} r={700} t={t} />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M ${300 + k * 110} ${740 - ((t * 60 + k * 20) % 60)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke={C.red} strokeWidth={8} fill="none" opacity={aparece(t, T.calor) * 0.8} />
        ))}
        <Termometro x={920} y={1180} v={v} texto={`${Math.round(20 + (v - 0.3) * 68)} °C`} />
        <Texto x={540} y={600} size={40} color={C.orange} op={aparece(t, T.calor)}>
          suelta el calor que guardaba
        </Texto>
        <Texto x={540} y={1400} size={50} color={C.red} op={aparece(t, T.grados)}>
          ~54 °C
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.grados} color={C.red} />
    </>
  );
};

// F. Para recargarla se hierve unos minutos y vuelve a quedar líquida
export const Recarga: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = 700 * (1 - interpolate(t, [T.hierve, T.liquida + 0.4], [0, 1], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.recargarla, T.asi], [1, 1.04])}>
      <path d="M 160 820 L 920 820 L 880 1400 L 200 1400 Z" fill="#5A5A66" />
      <rect x={180} y={840} width={720} height={540} fill="#5A8AC8" opacity={0.4} />
      {new Array(10).fill(0).map((_, k) => {
        const u = (t * 1.2 + k / 10) % 1;
        return <circle key={k} cx={220 + ((k * 73) % 640)} cy={1360 - u * 500} r={10 + u * 8} fill="#C8E8FF" opacity={aparece(t, T.hierve) * (1 - u)} />;
      })}
      <Bolsa x={540} y={1100} r={r} s={0.8} t={t} />
      <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.recargarla)}>
        para recargarla: hervirla
      </Texto>
      <Texto x={540} y={1530} size={40} color={LIQ} op={aparece(t, T.liquida)}>
        ¡líquida otra vez!
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
