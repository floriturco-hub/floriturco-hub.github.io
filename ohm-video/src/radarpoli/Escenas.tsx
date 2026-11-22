import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/radarpoli/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  policia: 2.36, // policia
  aparato: 3.40, // aparato
  segundo: 5.24, // segundo
  final: 7.28, // final
  radar: 9.54, // radar
  ondas: 10.20, // ondas
  rebotan: 11.14, // rebotan
  regresan: 12.36, // regresan
  acercas: 13.52, // acercas
  apretadas: 15.26, // apretadas
  frecuencia: 16.30, // frecuencia
  doppler: 17.70, // doppler
  sirena: 19.10, // sirena
  diferencia: 20.88, // diferencia
  laser: 23.36, // laser
  pulsos: 24.96, // pulsos
  tardan: 27.20, // tardan
  distancia: 29.02, // distancia
  cientos: 30.58, // cientos
  baja: 33.04, // baja
  fino: 35.84, // fino
  solo: 37.22, // solo
  asi: 38.10, // asi
  fin: 39.96, // FIN
};

const Auto: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly col?: string }> = ({ x, y, s = 1, col = C.cyan }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -150 0 L -150 -50 L -100 -55 L -60 -110 L 70 -110 L 110 -55 L 150 -50 L 150 0 Z" fill={col} />
    <circle cx={-90} cy={6} r={28} fill="#111" />
    <circle cx={95} cy={6} r={28} fill="#111" />
  </g>
);

const Pistola: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly lectura?: string }> = ({ x, y, s = 1, lectura }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-50} width={200} height={100} rx={20} fill="#3A3A44" />
    <rect x={-20} y={40} width={50} height={120} rx={14} fill="#2A2A34" />
    <circle cx={140} cy={0} r={34} fill="#1A1A22" stroke="#8A8A96" strokeWidth={6} />
    <rect x={-50} y={-40} width={130} height={60} rx={8} fill="#1A2A1A" />
    {lectura ? (
      <Texto x={15} y={-1} size={36} color="#5AE07A">
        {lectura}
      </Texto>
    ) : null}
  </g>
);

// Ondas (arcos) que viajan de x1 a x2; comp = compresión de las de regreso
const Ondas: React.FC<{ readonly x1: number; readonly x2: number; readonly y: number; readonly t: number; readonly op: number; readonly regreso?: number; readonly comp?: number }> = ({
  x1,
  x2,
  y,
  t,
  op,
  regreso = 0,
  comp = 0,
}) => (
  <g opacity={op}>
    {new Array(6).fill(0).map((_, k) => {
      const u = (t * 0.8 + k / 6) % 1;
      const x = x1 + (x2 - x1) * u;
      return <path key={k} d={`M ${x} ${y - 70} Q ${x + 30} ${y} ${x} ${y + 70}`} stroke={C.cyan} strokeWidth={6} fill="none" />;
    })}
    {regreso > 0
      ? new Array(6 + Math.round(comp * 4)).fill(0).map((_, k, arr) => {
          const u = (t * 0.8 + k / arr.length) % 1;
          const x = x2 - (x2 - x1) * u;
          return <path key={`r${k}`} d={`M ${x} ${y - 60} Q ${x - 30} ${y} ${x} ${y + 60}`} stroke={C.orange} strokeWidth={6} fill="none" opacity={regreso} />;
        })
      : null}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Pistola x={220} y={1000} lectura="87" />
    <Ondas x1={380} x2={760} y={1000} t={t} op={1} />
    <Auto x={860} y={1040} s={0.9} />
    <Texto x={540} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe a qué velocidad vienes?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.policia], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Un policía apunta el aparato y en menos de un segundo sabe tu velocidad + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xa = interpolate(t, [T.policia, T.radar], [1100, 800], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.policia, T.radar], [1, 1.04])}>
      <rect x={0} y={1080} width={1080} height={160} fill="#3A3A44" />
      <Pistola x={220} y={900} lectura={t > T.segundo ? "87 km/h" : "--"} />
      <Ondas x1={380} x2={xa - 140} y={950} t={t} op={aparece(t, T.aparato)} />
      <Auto x={xa} y={1080} s={0.9} />
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuál es más preciso?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.radar], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El radar lanza ondas de radio que rebotan; si te acercas vuelven más apretadas: efecto Doppler
export const Radar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const comp = aparece(t, T.apretadas);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.radar, T.laser], [1, 1.04])}>
        <Pistola x={180} y={900} />
        <Ondas x1={340} x2={760} y={900} t={t} op={aparece(t, T.ondas)} regreso={aparece(t, T.rebotan)} comp={comp} />
        <Auto x={880} y={940} s={0.8} />
        <Texto x={540} y={620} size={40} color={C.cyan} op={aparece(t, T.ondas)}>
          ondas de radio →
        </Texto>
        <Texto x={540} y={1140} size={38} color={C.orange} op={aparece(t, T.regresan)}>
          ← rebotan y regresan
        </Texto>
        <Texto x={540} y={1220} size={36} color={C.orange} op={comp}>
          más apretadas si te acercas
        </Texto>
        <Texto x={540} y={1330} size={50} color={C.yellow} op={aparece(t, T.doppler)}>
          efecto Doppler
        </Texto>
        <g opacity={aparece(t, T.sirena)} transform="translate(540 1460)">
          <rect x={-90} y={-30} width={180} height={60} rx={10} fill="#E8E8EE" />
          <rect x={-30} y={-60} width={60} height={30} rx={8} fill={Math.sin(t * 10) > 0 ? C.red : "#3A6AE0"} />
        </g>
        <Texto x={540} y={1580} size={34} color={C.white} op={aparece(t, T.diferencia)}>
          de la diferencia sale tu velocidad
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.doppler} color={C.yellow} />
    </>
  );
};

// D. Pistola láser: pulsos infrarrojos, mide cuánto tardan en volver = distancia; cientos por segundo; rayo fino
export const Laser: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dist = Math.round(interpolate(t, [T.distancia, T.asi], [500, 430], clamp));
  const fino = aparece(t, T.fino);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.laser, T.asi], [1, 1.04])}>
        <Pistola x={180} y={880} lectura={aparece(t, T.distancia) > 0.5 ? `${dist} m` : ""} />
        {new Array(5).fill(0).map((_, k) => {
          const u = (t * 1.6 + k / 5) % 1;
          return <rect key={k} x={340 + u * 500} y={872} width={40} height={16} fill={C.red} opacity={aparece(t, T.pulsos)} />;
        })}
        <Auto x={900} y={920} s={0.8} />
        <g opacity={1 - fino}>
          <Texto x={540} y={620} size={40} color={C.red} op={aparece(t, T.laser)}>
            pistola láser
          </Texto>
          <Texto x={540} y={1100} size={36} color={C.white} op={aparece(t, T.tardan)}>
            mide cuánto tarda el pulso en volver
          </Texto>
          <Texto x={540} y={1180} size={36} color={C.yellow} op={aparece(t, T.cientos)}>
            cientos de veces por segundo
          </Texto>
          <Texto x={540} y={1260} size={38} color={C.orange} op={aparece(t, T.baja)}>
            la distancia baja rápido = vas rápido
          </Texto>
        </g>
        <g opacity={fino}>
          <path d="M 340 1180 L 960 1080 L 960 1500 Z" fill={C.cyan} opacity={0.15} />
          <Auto x={880} y={1180} s={0.6} col="#C8A040" />
          <Auto x={880} y={1420} s={0.6} col="#C84A6A" />
          <Texto x={540} y={1600} size={30} color={C.cyan}>
            radar: haz ancho, varios autos
          </Texto>
          <Texto x={540} y={1100} size={40} color={C.red} op={aparece(t, T.solo)}>
            láser: un solo auto ✓
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.laser} color={C.red} />
    </>
  );
};

// E. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
