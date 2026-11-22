import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/vidrioliquido/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  dicen: 2.18, // dicen
  lentisimo: 3.78, // lent
  ventanas: 5.58, // ventanas
  final: 7.98, // final
  falso: 9.42, // falso
  amorfo: 11.30, // amorfo
  desordenados: 12.86, // desordenados
  mueven: 15.18, // mueven
  fluyera: 16.26, // fluyera
  universo: 19.34, // universo
  gruesas: 22.44, // gruesas
  girando: 25.14, // girando
  disparejos: 26.88, // disparejos
  solia: 28.02, // sol
  arriba: 31.18, // arriba
  romanas: 32.44, // romanas
  deformado: 34.30, // deformado
  este: 35.62, // este
  fin: 37.54, // FIN
};

const VIDRIO = "#9AD8E8";

// Ventana con un vidrio de grosor desigual (g arriba / g abajo)
const Ventana: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly arriba?: number; readonly abajo?: number }> = ({ x, y, s = 1, arriba = 10, abajo = 40 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -180 260 L -180 -120 Q -180 -260 0 -260 Q 180 -260 180 -120 L 180 260 Z" fill="#5A4030" />
    <path d="M -150 230 L -150 -110 Q -150 -230 0 -230 Q 150 -230 150 -110 L 150 230 Z" fill={VIDRIO} opacity={0.35} />
    {/* corte del grosor a la derecha */}
    <path d={`M 230 -230 L ${230 + arriba} -230 L ${230 + abajo} 230 L 230 230 Z`} fill={VIDRIO} opacity={0.8} />
    <line x1={-150} y1={0} x2={150} y2={0} stroke="#5A4030" strokeWidth={10} />
    <line x1={0} y1={-230} x2={0} y2={230} stroke="#5A4030" strokeWidth={10} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Ventana x={480} y={1000} s={1.3} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M ${400 + k * 80} ${1260 + ((t * 30 + k * 20) % 40)} q 6 14 0 22`} stroke={VIDRIO} strokeWidth={6} fill="none" opacity={0.7} />
    ))}
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿este vidrio se está derritiendo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.dicen], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Dicen que es un líquido lentísimo y por eso las ventanas antiguas son gruesas abajo + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dicen, T.amorfo], [1, 1.04])}>
      <Ventana x={460} y={980} s={1.1} />
      <Texto x={540} y={1360} size={36} color={C.white} op={aparece(t, T.lentisimo)}>
        «el vidrio es un líquido lentísimo»
      </Texto>
      <Texto x={760} y={1260} size={30} color={VIDRIO} op={aparece(t, T.ventanas)}>
        más grueso abajo
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          la prueba de que es falso: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.amorfo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Sólido amorfo: átomos desordenados como un líquido, pero quietos; fluir tardaría más que la edad del universo
export const Amorfo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.amorfo, T.gruesas], [1, 1.04])}>
        <rect x={180} y={720} width={720} height={460} rx={30} fill={VIDRIO} opacity={0.15} />
        {new Array(40).fill(0).map((_, k) => (
          <circle key={k} cx={220 + ((k * 97) % 640)} cy={760 + ((k * 61) % 380)} r={16} fill={VIDRIO} opacity={aparece(t, T.desordenados)} />
        ))}
        <Texto x={540} y={640} size={42} color={C.white} op={aparece(t, T.amorfo)}>
          sólido amorfo
        </Texto>
        <Texto x={540} y={1260} size={34} color={VIDRIO} op={aparece(t, T.desordenados)}>
          átomos desordenados… pero quietos
        </Texto>
        <Texto x={540} y={1360} size={34} color={C.white} op={aparece(t, T.fluyera)}>
          para fluir algo visible:
        </Texto>
        <Texto x={540} y={1430} size={40} color={C.yellow} op={aparece(t, T.universo)}>
          más que la edad del universo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.amorfo} color={VIDRIO} />
    </>
  );
};

// D. Antes se hacían girando vidrio fundido y salían disparejos; se solía poner lo grueso abajo, pero a veces arriba
export const Corona: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const arr = aparece(t, T.arriba);
  return (
    <Lienzo zoom={interpolate(t, [T.gruesas, T.romanas], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.solia)}>
        <g transform={`translate(540 960) rotate(${t * 120})`}>
          <ellipse cx={0} cy={0} rx={260} ry={260} fill={VIDRIO} opacity={0.35} />
          {[60, 130, 200].map((r) => (
            <circle key={r} cx={0} cy={0} r={r} fill="none" stroke={VIDRIO} strokeWidth={4 + (260 - r) / 30} opacity={0.6} />
          ))}
        </g>
        <rect x={530} y={600} width={20} height={360} fill="#8A90A0" opacity={aparece(t, T.girando)} />
        <Texto x={540} y={1320} size={36} color={C.white} op={aparece(t, T.girando)}>
          girando vidrio fundido
        </Texto>
        <Texto x={540} y={1400} size={36} color={C.yellow} op={aparece(t, T.disparejos)}>
          salían disparejos
        </Texto>
      </g>
      <g opacity={aparece(t, T.solia)}>
        <Ventana x={300} y={980} s={0.75} arriba={10} abajo={40} />
        <Texto x={300} y={1280} size={30} color={C.white}>
          grueso abajo
        </Texto>
        <g opacity={arr}>
          <Ventana x={760} y={980} s={0.75} arriba={40} abajo={10} />
          <Texto x={760} y={1280} size={30} color={C.yellow}>
            ¡grueso arriba!
          </Texto>
        </g>
      </g>
    </Lienzo>
  );
};

// E. Copas romanas de dos mil años que no se han deformado
export const Romanas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.romanas, T.este], [1, 1.04])}>
        <g transform="translate(540 1000)">
          <path d="M -150 -220 Q -160 20 -40 60 L -20 200 L -110 230 L 110 230 L 20 200 L 40 60 Q 160 20 150 -220 Z" fill={VIDRIO} opacity={0.4} stroke={VIDRIO} strokeWidth={6} />
        </g>
        <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.romanas)}>
          copa romana: unos 2000 años
        </Texto>
        <Texto x={540} y={1360} size={42} color={C.yellow} op={aparece(t, T.deformado)}>
          ni una gota escurrida
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.deformado} color={C.yellow} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.este, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
