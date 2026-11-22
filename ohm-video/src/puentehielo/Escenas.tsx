import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/puentehielo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  noche: 2.70, // noche
  pista: 4.60, // pista
  seca: 6.56, // seca
  final: 7.48, // final
  senales: 8.94, // se
  carretera2: 10.10, // carretera
  tierra: 12.02, // tierra
  suelo: 12.88, // suelo
  suelta: 14.74, // suelta
  abajo: 17.38, // abajo
  aire: 18.98, // aire
  caras: 22.26, // caras
  rapido: 24.56, // r
  cero: 27.16, // grados
  congelan: 30.24, // congelan
  avisan: 32.76, // avisan
  porEso: 35.62, // por
  fin: 37.64, // FIN
};

const HIELO = "#C8E8FF";
const FRIO = "#3AB8E8";
const TIBIO = "#E8703C";

// Escena: carretera sobre tierra (izq) y puente sobre vacío (der); hielo en el puente (0..1)
const Paisaje: React.FC<{ readonly t: number; readonly hielo: number; readonly calor?: number; readonly frio?: number }> = ({ t, hielo, calor = 0, frio = 0 }) => (
  <g>
    {/* tierra */}
    <rect x={0} y={1100} width={460} height={500} fill="#5A4030" />
    <rect x={0} y={1080} width={460} height={24} fill="#4A4A54" />
    {/* hueco y puente */}
    <rect x={460} y={1180} width={620} height={420} fill="#141A2A" />
    <rect x={460} y={1080} width={620} height={24} fill="#6A6A74" />
    <rect x={460} y={1104} width={620} height={30} fill="#8A8A96" />
    {[600, 900].map((x) => (
      <rect key={x} x={x - 18} y={1134} width={36} height={470} fill="#8A8A96" />
    ))}
    <rect x={460} y={1062} width={620} height={22} rx={6} fill={HIELO} opacity={hielo} />
    {/* calor que sube del suelo bajo la carretera */}
    {calor > 0
      ? [0, 1, 2, 3].map((k) => <path key={k} d={`M ${80 + k * 100} ${1500 - ((t * 60 + k * 30) % 300)} l 0 -40 m -12 12 l 12 -12 l 12 12`} stroke={TIBIO} strokeWidth={6} fill="none" opacity={calor} />)
      : null}
    {/* frío por arriba y por abajo del puente */}
    {frio > 0
      ? [0, 1, 2, 3].map((k) => (
          <g key={k} opacity={frio}>
            <path d={`M ${540 + k * 140} 960 l 0 60 m -12 -12 l 12 12 l 12 -12`} stroke={FRIO} strokeWidth={6} fill="none" />
            <path d={`M ${540 + k * 140} 1280 l 0 -60 m -12 12 l 12 -12 l 12 12`} stroke={FRIO} strokeWidth={6} fill="none" />
          </g>
        ))
      : null}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Paisaje t={t} hielo={1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este puente se congela primero?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.noche], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Noche fría: el puente es una pista de hielo y la carretera sigue seca + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.noche, T.carretera2], [1, 1.04])}>
      <Paisaje t={t} hielo={aparece(t, T.pista)} />
      <circle cx={880} cy={700} r={60} fill="#E8E6F0" opacity={0.8} />
      <Texto x={770} y={990} size={34} color={HIELO} op={aparece(t, T.pista)}>
        puente: hielo
      </Texto>
      <Texto x={230} y={990} size={34} color={C.white} op={aparece(t, T.seca)}>
        carretera: seca
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué avisan las señales?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.carretera2], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La carretera está sobre la tierra, que guarda el calor del día y lo suelta de noche
export const Suelo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.carretera2, T.abajo], [1, 1.04])}>
        <Paisaje t={t} hielo={0} calor={aparece(t, T.suelta)} />
        <rect x={0} y={1100} width={460} height={500} fill={TIBIO} opacity={0.25 * aparece(t, T.suelo)} />
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.tierra)}>
          la carretera se apoya en la tierra
        </Texto>
        <Texto x={540} y={720} size={34} color={TIBIO} op={aparece(t, T.suelta)}>
          el suelo suelta el calor del día
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.suelta} color={TIBIO} />
    </>
  );
};

// D. El puente no tiene tierra abajo: aire frío arriba y abajo; pierde calor por las dos caras
export const DosCaras: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.abajo, T.cero], [1, 1.04])}>
        <Paisaje t={t} hielo={0} frio={aparece(t, T.aire)} />
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.abajo)}>
          el puente no tiene tierra abajo
        </Texto>
        <Texto x={540} y={720} size={36} color={FRIO} op={aparece(t, T.caras)}>
          pierde calor por las dos caras
        </Texto>
        <Texto x={540} y={800} size={32} color={C.white} op={aparece(t, T.rapido)}>
          acero y concreto: se enfrían rápido
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.caras} color={FRIO} />
    </>
  );
};

// E. Llega a cero grados antes y se congela ahí primero; las señales avisan
export const Senal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sen = aparece(t, T.avisan);
  return (
    <Lienzo zoom={interpolate(t, [T.cero, T.porEso], [1, 1.04])}>
      <Paisaje t={t} hielo={aparece(t, T.congelan)} />
      <Texto x={770} y={990} size={36} color={HIELO} op={aparece(t, T.cero)}>
        0 °C primero
      </Texto>
      <g opacity={sen} transform="translate(540 760)">
        <path d="M 0 -160 L 170 120 L -170 120 Z" fill="#F0C040" stroke="#2A2A2A" strokeWidth={10} strokeLinejoin="round" />
        <Texto x={0} y={60} size={30} color="#1A1A1A">
          PUENTE
        </Texto>
        <Texto x={0} y={100} size={22} color="#1A1A1A">
          SE CONGELA ANTES
        </Texto>
      </g>
    </Lienzo>
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
