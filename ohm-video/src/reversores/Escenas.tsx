import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/reversores/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  avionG: 0.74, // avion
  avion: 2.22, // avion
  toneladas: 3.10, // toneladas
  aterriza: 4.08, // aterriza
  motores: 5.96, // motores
  rugen: 6.36, // rugen
  final: 8.16, // final
  tocar: 10.78, // tocar
  trasera: 12.02, // trasera
  desliza: 13.32, // desliza
  rejillas: 14.70, // rejillas
  compuertas: 15.90, // compuertas
  bloquean: 16.38, // bloquean
  atras: 19.04, // atras
  ese: 19.70, // ese
  rejillas2: 20.94, // rejillas
  adelante: 22.36, // adelante
  empuja: 24.02, // empuja
  contra: 24.64, // contra
  son: 26.02, // son
  reversores: 26.42, // reversores
  mojadas: 29.20, // mojadas
  resbalan: 30.46, // resbalan
  pero: 31.34, // pero
  frenos: 32.88, // frenos
  spoilers: 34.60, // spoilers
  alas: 36.08, // alas
  asi: 36.74, // asi
  fin: 38.54, // FIN
};

const FUS = "#E8E8EE";

// Avión de perfil mirando a la izquierda; rev: chorros hacia adelante; spo: spoilers
const Avion: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rev?: number; readonly spo?: number; readonly t?: number }> = ({
  x,
  y,
  s = 1,
  rev = 0,
  spo = 0,
  t = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -420 -10 Q -440 -60 -360 -70 L 340 -70 L 430 -200 L 470 -200 L 440 -60 L 440 30 L -360 30 Q -420 30 -420 -10 Z" fill={FUS} />
    {new Array(10).fill(0).map((_, k) => (
      <circle key={k} cx={-280 + k * 60} cy={-30} r={10} fill="#5A6A8A" />
    ))}
    <path d="M -80 0 L 160 0 L 240 50 L 60 50 Z" fill="#C8C8D4" />
    <path d={`M 120 0 L ${120 + 30} ${-40 * spo} L 170 ${-40 * spo} L 150 0 Z`} fill="#A8A8B4" opacity={spo} />
    <rect x={-10} y={50} width={170} height={70} rx={30} fill="#9A9AA8" />
    {rev > 0 ? (
      <g opacity={rev}>
        {[0, 1, 2].map((k) => {
          const u = (t * 2 + k / 3) % 1;
          return <path key={k} d={`M ${100 - u * 120} ${40 - u * 50} l -40 -10`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" opacity={1 - u} />;
        })}
        {[0, 1, 2].map((k) => {
          const u = (t * 2 + k / 3 + 0.15) % 1;
          return <path key={k} d={`M ${100 - u * 120} ${130 + u * 50} l -40 10`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" opacity={1 - u} />;
        })}
      </g>
    ) : null}
    <line x1={-300} y1={30} x2={-300} y2={110} stroke="#5A5A66" strokeWidth={10} />
    <circle cx={-300} cy={120} r={22} fill="#222" />
    <line x1={80} y1={30} x2={80} y2={110} stroke="#5A5A66" strokeWidth={10} />
    <circle cx={65} cy={120} r={24} fill="#222" />
    <circle cx={105} cy={120} r={24} fill="#222" />
  </g>
);

// Corte del motor: abre = funda trasera desplazada; bloq = compuertas; rev = flujo invertido
const Motor: React.FC<{ readonly t: number; readonly abre: number; readonly bloq: number; readonly rev: number; readonly flujo?: number }> = ({ t, abre, bloq, rev, flujo = 1 }) => {
  const dx = abre * 130;
  const puerta = (y0: number, dir: number) => {
    const ang = bloq * 70 * dir;
    return <rect x={590} y={y0 - 6} width={64} height={12} rx={4} fill={C.orange} transform={`rotate(${ang} 590 ${y0})`} />;
  };
  return (
    <g>
      {/* núcleo */}
      <path d="M 260 850 L 900 870 L 960 900 L 900 930 L 260 950 Z" fill="#5A5A66" />
      <ellipse cx={240} cy={900} rx={30} ry={130} fill="#3A3A44" />
      {[-90, -45, 0, 45, 90].map((d) => (
        <line key={d} x1={240} y1={900} x2={240 + 10 * Math.cos((t * 600 + d) * 0.0174)} y2={900 + d * 1.3} stroke="#8A8A96" strokeWidth={6} />
      ))}
      {/* góndola fija */}
      <rect x={180} y={740} width={420} height={50} rx={20} fill="#B8B8C4" />
      <rect x={180} y={1010} width={420} height={50} rx={20} fill="#B8B8C4" />
      {/* rejillas */}
      <g opacity={abre}>
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <line x1={610 + k * 30} y1={790} x2={590 + k * 30} y2={745} stroke={C.yellow} strokeWidth={6} />
            <line x1={610 + k * 30} y1={1010} x2={590 + k * 30} y2={1055} stroke={C.yellow} strokeWidth={6} />
          </g>
        ))}
      </g>
      {/* funda trasera deslizante */}
      <rect x={600 + dx} y={740} width={280} height={50} rx={20} fill="#9A9AA8" />
      <rect x={600 + dx} y={1010} width={280} height={50} rx={20} fill="#9A9AA8" />
      {puerta(790, 1)}
      {puerta(1010, -1)}
      {/* flujo de aire */}
      <g opacity={flujo}>
        {new Array(6).fill(0).map((_, k) => {
          const u = (t * 1.2 + k / 6) % 1;
          if (rev < 0.5) {
            const x = 280 + u * 720;
            return (
              <g key={k}>
                <path d={`M ${x} 820 l 50 0`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
                <path d={`M ${x} 980 l 50 0`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
              </g>
            );
          }
          const p = u < 0.5 ? [280 + u * 2 * 300, 820] : [580 + 20 - (u - 0.5) * 2 * 260, 800 - (u - 0.5) * 2 * 260];
          const q = u < 0.5 ? [p[0], 980] : [p[0], 1000 + (u - 0.5) * 2 * 260];
          const ang = u < 0.5 ? 0 : 1;
          return (
            <g key={k}>
              <path d={`M ${p[0]} ${p[1]} l ${ang ? -40 : 50} ${ang ? -40 : 0}`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
              <path d={`M ${q[0]} ${q[1]} l ${ang ? -40 : 50} ${ang ? 40 : 0}`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
            </g>
          );
        })}
      </g>
    </g>
  );
};

const Pista: React.FC<{ readonly y: number; readonly t: number; readonly v?: number }> = ({ y, t, v = 1 }) => (
  <g>
    <rect x={0} y={y} width={1080} height={300} fill="#3A3A44" />
    {new Array(8).fill(0).map((_, k) => (
      <rect key={k} x={((k * 200 + t * 600 * v) % 1600) - 200} y={y + 40} width={120} height={14} fill="#E8E8EE" />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Pista y={1080} t={t} v={0.6} />
    <Avion x={560} y={920} s={1} rev={1} t={t} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo frena este avión gigante?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.avion], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. 250 toneladas aterrizan y los motores rugen más fuerte + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.avion, T.aterriza + 0.6], [-260, 0], clamp);
  const ruge = aparece(t, T.rugen);
  return (
    <Lienzo zoom={interpolate(t, [T.avion, T.tocar], [1, 1.04])}>
      <Pista y={1080} t={t} />
      <Avion x={560} y={920 + baja} s={1} rev={ruge} t={t} />
      <Texto x={540} y={600} size={48} color={C.white} op={aparece(t, T.toneladas)}>
        250 toneladas
      </Texto>
      <g opacity={ruge}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${740 + k * 40} ${880} q 20 30 0 60 q -20 30 0 60`} stroke={C.orange} strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 20 + k)} />
        ))}
        <Texto x={540} y={1450} size={44} color={C.orange}>
          ¡RRROOOAAARRR!
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿quién hace el trabajo pesado?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.tocar], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Al tocar la pista, la parte trasera del motor se desliza y descubre rejillas
export const Desliza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abre = interpolate(t, [T.desliza, T.desliza + 0.8], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tocar, T.compuertas], [1, 1.04])}>
      <Motor t={t} abre={abre} bloq={0} rev={0} />
      <Texto x={750} y={680} size={34} color={C.white} op={aparece(t, T.trasera)}>
        parte trasera
      </Texto>
      <Texto x={640} y={1160} size={40} color={C.yellow} op={aparece(t, T.rejillas)}>
        rejillas
      </Texto>
      <Texto x={200} y={1300} size={30} color={C.grey}>
        ← sentido de marcha
      </Texto>
    </Lienzo>
  );
};

// D. Compuertas bloquean el aire que sale hacia atrás
export const Compuertas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bloq = interpolate(t, [T.bloquean, T.bloquean + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.compuertas, T.ese], [1, 1.04])}>
      <Motor t={t} abre={1} bloq={bloq} rev={0} flujo={1 - aparece(t, T.bloquean)} />
      <Texto x={620} y={680} size={38} color={C.orange} op={aparece(t, T.compuertas)}>
        compuertas
      </Texto>
      <Texto x={540} y={1200} size={38} color={C.cyan} op={aparece(t, T.atras)}>
        aire hacia atrás: bloqueado ✗
      </Texto>
    </Lienzo>
  );
};

// E. El aire sale por las rejillas hacia adelante: el motor empuja contra el movimiento
export const Desvio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const emp = aparece(t, T.empuja);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ese, T.son], [1, 1.04])}>
        <Motor t={t} abre={1} bloq={1} rev={1} />
        <Texto x={540} y={520} size={40} color={C.cyan} op={aparece(t, T.adelante)}>
          desviado hacia adelante
        </Texto>
        <g opacity={emp}>
          <path d="M 300 1260 L 780 1260" stroke={C.grey} strokeWidth={10} />
          <path d="M 300 1260 l 40 -25 l 0 50 Z" fill={C.grey} />
          <Texto x={540} y={1230} size={32} color={C.grey}>
            movimiento
          </Texto>
          <path d="M 300 1360 L 780 1360" stroke={C.red} strokeWidth={16} />
          <path d="M 800 1360 l -50 -35 l 0 70 Z" fill={C.red} />
          <Texto x={540} y={1430} size={38} color={C.red}>
            empuje en contra
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.empuja} color={C.red} />
    </>
  );
};

// F. Reversores de empuje: ayudan sobre todo en pistas mojadas, donde las ruedas resbalan
export const Reversores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.son, T.pero], [1, 1.04])}>
        <Texto x={540} y={560} size={54} color={C.yellow} op={aparece(t, T.reversores)}>
          reversores de empuje
        </Texto>
        <Pista y={1080} t={t} v={0.8} />
        <g opacity={aparece(t, T.mojadas)}>
          {new Array(12).fill(0).map((_, k) => (
            <ellipse key={k} cx={((k * 97 + t * 300) % 1080)} cy={1100 + (k % 3) * 40} rx={50} ry={8} fill="#5A8AC8" opacity={0.6} />
          ))}
        </g>
        <Avion x={560} y={920} s={1} rev={1} t={t} />
        <Texto x={540} y={1450} size={40} color="#5A8AC8" op={aparece(t, T.mojadas)}>
          pista mojada
        </Texto>
        <Texto x={540} y={1520} size={36} color={C.white} op={aparece(t, T.resbalan)}>
          las ruedas resbalan
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.reversores} color={C.yellow} />
    </>
  );
};

// G. El trabajo pesado: frenos de las ruedas y spoilers en las alas
export const Frenos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fr = aparece(t, T.frenos);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.asi], [1, 1.04])}>
      <Pista y={1080} t={t} v={0.4} />
      <Avion x={560} y={920} s={1} rev={0.4} spo={aparece(t, T.spoilers)} t={t} />
      <circle cx={625} cy={1040} r={34} fill={C.orange} opacity={fr * (0.6 + 0.4 * Math.sin(t * 10))} />
      <circle cx={665} cy={1040} r={34} fill={C.orange} opacity={fr * (0.6 + 0.4 * Math.sin(t * 10 + 1))} />
      <Texto x={540} y={1300} size={40} color={C.orange} op={fr}>
        frenos de las ruedas
      </Texto>
      <Texto x={700} y={780} size={34} color={C.white} op={aparece(t, T.spoilers)}>
        spoilers ↑
      </Texto>
      <g opacity={aparece(t, T.pero)}>
        <Texto x={540} y={560} size={36} color={C.white}>
          ¿quién frena más?
        </Texto>
        <rect x={190} y={600} width={700} height={40} rx={12} fill="#2A2440" />
        <rect x={190} y={600} width={700 * 0.7 * fr} height={40} rx={12} fill={C.orange} />
        <rect x={190 + 700 * 0.7 * fr} y={600} width={700 * 0.2 * aparece(t, T.spoilers)} height={40} fill="#A8A8B4" />
        <rect x={190 + 700 * (0.7 * fr + 0.2 * aparece(t, T.spoilers))} y={600} width={700 * 0.1} height={40} fill={C.cyan} />
      </g>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
