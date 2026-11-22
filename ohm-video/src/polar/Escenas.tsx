import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/polar/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  y: 1.48,
  reja: 2.74,
  final: 4.0,
  luz: 6.46,
  todas: 7.88,
  pero: 9.18,
  agua: 10.26,
  horizontal: 12.98,
  ese: 13.86,
  brillo: 14.62,
  lentes: 16.26,
  filtro: 17.8,
  moleculas: 18.38,
  alineadas: 19.48,
  esa: 21.18,
  vertical: 23.22,
  bloquea: 23.92,
  asi: 24.86,
  desaparece: 26.28,
  prueba: 29.0,
  mira: 29.88,
  giralos: 31.82,
  negra: 33.48,
  porque: 35.06,
  fin: 37.08,
};

const AGUA = "#1A5A8A";
const AGUA_OSC = "#0E3A5E";
const LENTE = "#2A2440";

// Escena de agua con reflejos; sinBrillo = 0..1 (1 = vista a través del filtro)
const Agua: React.FC<{ readonly t: number; readonly sinBrillo: number; readonly peces?: number }> = ({ t, sinBrillo, peces = 0 }) => (
  <g>
    <rect x={0} y={620} width={1080} height={700} fill={sinBrillo > 0.5 ? AGUA_OSC : AGUA} />
    {new Array(3).fill(0).map((_, k) => (
      <g key={`p${k}`} opacity={peces * sinBrillo} transform={`translate(${260 + k * 260 + Math.sin(t + k) * 30} ${880 + k * 90})`}>
        <ellipse rx={60} ry={24} fill={C.orange} />
        <path d="M 55 0 L 95 -24 L 95 24 Z" fill={C.orange} />
      </g>
    ))}
    {new Array(14).fill(0).map((_, k) => (
      <rect
        key={k}
        x={(k * 157 + t * 40) % 1100 - 60}
        y={660 + (k % 7) * 90}
        width={160 + (k % 3) * 60}
        height={14}
        rx={7}
        fill={C.white}
        opacity={(1 - sinBrillo) * (0.5 + 0.5 * Math.sin(t * 3 + k))}
      />
    ))}
  </g>
);

// Lentes de sol (montura); dentro se dibuja lo que se ve a través
const Montura: React.FC<{ readonly cx: number; readonly cy: number; readonly s: number; readonly color?: string; readonly vidrio?: boolean }> = ({
  cx,
  cy,
  s,
  color = "#1A1620",
  vidrio = false,
}) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`} stroke={color}>
    {vidrio ? (
      <>
        <path d="M -300 -80 Q -300 120 -150 120 Q -30 120 -30 -80 Z" fill="#3A3460" stroke="none" />
        <path d="M 300 -80 Q 300 120 150 120 Q 30 120 30 -80 Z" fill="#3A3460" stroke="none" />
      </>
    ) : null}
    <path d="M -300 -80 Q -300 120 -150 120 Q -30 120 -30 -80 Z" fill="none" strokeWidth={24} />
    <path d="M 300 -80 Q 300 120 150 120 Q 30 120 30 -80 Z" fill="none" strokeWidth={24} />
    <path d="M -30 -60 Q 0 -90 30 -60" strokeWidth={20} fill="none" />
    <line x1={-300} y1={-80} x2={300} y2={-80} strokeWidth={24} />
  </g>
);

// Imagen del gancho y del cierre: agua deslumbrante, pero sin brillo a través de los lentes
const LentesAgua: React.FC<{ readonly t: number; readonly efecto: number }> = ({ t, efecto }) => (
  <>
    <circle cx={880} cy={480} r={70} fill={C.yellow} />
    <Agua t={t} sinBrillo={0} />
    <defs>
      <clipPath id="vidrios">
        <path d="M 240 820 Q 240 1020 390 1020 Q 510 1020 510 820 Z M 840 820 Q 840 1020 690 1020 Q 570 1020 570 820 Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#vidrios)" opacity={efecto}>
      <Agua t={t} sinBrillo={1} peces={1} />
      <rect x={0} y={600} width={1080} height={600} fill="#3A2A10" opacity={0.25} />
    </g>
    <Montura cx={540} cy={900} s={1} />
  </>
);

// A. Gancho: tus lentes borran los reflejos
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.y], [1.12, 1])}>
        <LentesAgua t={t} efecto={interpolate(t, [0.6, 1.0], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.94} />
    </>
  );
};

// B. Con una reja invisible + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.luz], [1, 1.05])}>
      <path d="M 260 640 Q 260 980 540 980 Q 820 980 820 640 Z" fill={LENTE} opacity={0.85} />
      <g opacity={aparece(t, T.reja)}>
        <defs>
          <clipPath id="lenteB">
            <path d="M 260 640 Q 260 980 540 980 Q 820 980 820 640 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#lenteB)">
          {new Array(20).fill(0).map((_, k) => (
            <line key={k} x1={270 + k * 28} y1={640} x2={270 + k * 28} y2={990} stroke={C.cyan} strokeWidth={6} opacity={0.6} />
          ))}
        </g>
      </g>
      <path d="M 260 640 Q 260 980 540 980 Q 820 980 820 640 Z" fill="none" stroke="#1A1620" strokeWidth={20} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.luz], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={36}>
          cómo comprobarlo con tu teléfono: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Flecha doble (dirección de vibración) centrada en (x,y) con ángulo a
const Vibra: React.FC<{ readonly x: number; readonly y: number; readonly a: number; readonly l: number; readonly color: string; readonly op?: number }> = ({
  x,
  y,
  a,
  l,
  color,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`} opacity={op}>
    <line x1={-l} y1={0} x2={l} y2={0} stroke={color} strokeWidth={8} />
    <path d={`M ${l + 14} 0 L ${l - 10} -14 L ${l - 10} 14 Z`} fill={color} />
    <path d={`M ${-l - 14} 0 L ${-l + 10} -14 L ${-l + 10} 14 Z`} fill={color} />
  </g>
);

// C. La luz del sol vibra en todas las direcciones
export const Luz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.luz, T.pero], [1, 1.04])}>
      <circle cx={540} cy={560} r={90} fill={C.yellow} />
      <line x1={540} y1={660} x2={540} y2={1200} stroke={C.yellow} strokeWidth={10} opacity={0.6} />
      {[0, 1, 2].map((k) => (
        <g key={k} opacity={aparece(t, T.todas - 0.6)}>
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <Vibra key={a} x={540} y={800 + k * 160} a={a + t * 30} l={70 * (0.6 + 0.4 * Math.abs(Math.sin(t * 6 + a)))} color={C.yellow} op={0.8} />
          ))}
        </g>
      ))}
      <Texto x={540} y={1300} size={40} color={C.yellow} op={aparece(t, T.todas)}>
        vibra en todas direcciones
      </Texto>
    </Lienzo>
  );
};

// D. Al rebotar en el agua o el asfalto, sale vibrando casi toda en horizontal
export const Rebote: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const horiz = aparece(t, T.horizontal - 0.8);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.ese], [1, 1.04])}>
      <rect x={0} y={1000} width={1080} height={320} fill={AGUA} />
      <circle cx={160} cy={500} r={70} fill={C.yellow} />
      <line x1={200} y1={560} x2={540} y2={1000} stroke={C.yellow} strokeWidth={10} />
      <line x1={540} y1={1000} x2={880} y2={560} stroke={C.white} strokeWidth={10} opacity={aparece(t, T.agua)} />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          {[0, 60, 120].map((a) => (
            <Vibra key={a} x={270 + k * 100} y={650 + k * 130} a={a} l={40} color={C.yellow} op={0.8} />
          ))}
          <Vibra x={610 + k * 100} y={910 - k * 130} a={0} l={55} color={C.white} op={horiz} />
        </g>
      ))}
      <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.horizontal)}>
        vibra en horizontal
      </Texto>
    </Lienzo>
  );
};

// E. Ese es el brillo blanco que te deslumbra
export const Deslumbra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ese, T.lentes], [1, 1.06])}>
        <Agua t={t} sinBrillo={0} />
        <rect x={0} y={0} width={1080} height={1920} fill={C.white} opacity={0.18 * aparece(t, T.brillo)} />
        <g transform="translate(540 480)">
          <ellipse rx={130} ry={60} fill={C.white} />
          <circle r={40} fill="#4A3A2A" />
          <path d="M -150 -10 Q 0 -110 150 -10" stroke="#1A1010" strokeWidth={14} fill="none" opacity={aparece(t, T.brillo)} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.brillo} />
    </>
  );
};

// F. Los lentes polarizados tienen un filtro con moléculas largas alineadas como una reja
export const Filtro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = aparece(t, T.moleculas);
  const alinea = interpolate(t, [T.alineadas - 0.4, T.alineadas + 0.6], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.lentes, T.esa], [1, 1.04])}>
      <g opacity={1 - zoom}>
        <Montura cx={540} cy={820} s={1.2} color="#8A86A8" vidrio />
        <Texto x={540} y={1080} size={40} color={C.white} op={aparece(t, T.filtro)}>
          filtro polarizador
        </Texto>
      </g>
      <g opacity={zoom}>
        <circle cx={540} cy={840} r={330} fill={LENTE} />
        {new Array(13).fill(0).map((_, k) =>
          [0, 1, 2].map((j) => {
            const desorden = (1 - alinea) * ((k * 37 + j * 71) % 180 - 90);
            return (
              <line
                key={`${k}${j}`}
                x1={0}
                y1={-80}
                x2={0}
                y2={80}
                stroke={C.cyan}
                strokeWidth={10}
                strokeLinecap="round"
                transform={`translate(${300 + k * 40} ${640 + j * 200}) rotate(${desorden})`}
              />
            );
          }),
        )}
        <Texto x={540} y={1250} size={40} color={C.cyan} op={aparece(t, T.alineadas)}>
          moléculas alineadas: una reja
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. La reja deja pasar la luz que vibra en vertical y bloquea la horizontal
export const Pasa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = ((t - T.esa) * 0.5) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.esa, T.asi], [1, 1.04])}>
      {/* reja */}
      {new Array(9).fill(0).map((_, k) => (
        <rect key={k} x={510} y={520 + k * 100} width={60} height={70} fill="#4A4466" />
      ))}
      <rect x={520} y={500} width={40} height={900} fill="none" />
      {/* luz vertical: pasa */}
      <g opacity={aparece(t, T.vertical - 0.5)}>
        <Vibra x={140 + u * 800} y={700} a={90} l={80} color={C.yellow} />
        <Texto x={540} y={470} size={34} color={C.yellow}>
          vertical: pasa
        </Texto>
      </g>
      {/* luz horizontal: bloqueada */}
      <g opacity={aparece(t, T.bloquea - 0.3)}>
        <Vibra x={Math.min(440, 140 + u * 800)} y={1150} a={0} l={60} color={C.white} op={140 + u * 800 > 440 ? 0.3 : 1} />
        <path d="M 640 1100 L 740 1200 M 740 1100 L 640 1200" stroke={C.red} strokeWidth={14} />
        <Texto x={540} y={1300} size={34} color={C.red}>
          horizontal: bloqueada
        </Texto>
      </g>
    </Lienzo>
  );
};

// H. Así el reflejo desaparece pero sigues viendo todo lo demás
export const Desaparece: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.prueba], [1, 1.04])}>
      <Agua t={t} sinBrillo={interpolate(t, [T.desaparece - 0.5, T.desaparece + 0.3], [0, 1], clamp)} peces={1} />
      <Texto x={540} y={540} size={42} color={C.white} op={aparece(t, T.desaparece)}>
        sin reflejo: ves los peces
      </Texto>
    </Lienzo>
  );
};

// I. Mira la pantalla de tu teléfono con ellos y gíralos: en un ángulo se pone negra
export const Prueba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.giralos - 0.6, T.negra + 0.4], [0, 90], suave);
  const oscuro = Math.sin((giro * Math.PI) / 180) ** 2;
  return (
    <Lienzo zoom={interpolate(t, [T.prueba, T.porque], [1, 1.04])}>
      <rect x={340} y={520} width={400} height={760} rx={50} fill="#1A1620" />
      <rect x={370} y={570} width={340} height={660} rx={20} fill={C.cyan} />
      <rect x={400} y={620} width={280} height={40} rx={10} fill={C.white} opacity={0.7} />
      <rect x={400} y={690} width={200} height={40} rx={10} fill={C.white} opacity={0.7} />
      <g opacity={aparece(t, T.mira)}>
        <g transform={`rotate(${giro} 540 900)`}>
          <defs>
            <clipPath id="lenteP">
              <circle cx={540} cy={900} r={240} />
            </clipPath>
          </defs>
          <g clipPath="url(#lenteP)">
            <rect x={300} y={660} width={480} height={480} fill="#000000" opacity={0.25 + 0.75 * oscuro} />
            {new Array(17).fill(0).map((_, k) => (
              <line key={k} x1={300 + k * 30} y1={660} x2={300 + k * 30} y2={1140} stroke={C.white} strokeWidth={3} opacity={0.2} />
            ))}
          </g>
          <circle cx={540} cy={900} r={240} fill="none" stroke="#3A3650" strokeWidth={24} />
        </g>
      </g>
      <Texto x={540} y={1380} size={42} color={C.yellow} op={aparece(t, T.negra)}>
        ¡pantalla negra!
      </Texto>
    </Lienzo>
  );
};

// J. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <LentesAgua t={t} efecto={1} />
    </Lienzo>
  );
};
