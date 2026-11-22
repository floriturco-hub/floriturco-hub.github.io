import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/fluxometro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  publicos: 2.28, // publicos
  tanque: 3.24, // tanque
  palanca: 4.40, // palanca
  canonazo: 5.40, // ca
  final: 7.66, // final
  casa: 8.66, // casa
  diafragma: 10.78, // diafragma
  camaras: 12.44, // camaras
  agujerito: 13.38, // agujerito
  grande: 16.64, // grande
  aplasta: 17.70, // aplasta
  cerrado: 19.52, // cerrado
  palanca2: 20.52, // palanca
  vacia: 20.86, // vacia
  cae: 22.98, // cae
  empuja: 23.90, // empuja
  chorro: 26.06, // chorro
  agujerito2: 26.78, // agujerito
  llenar: 27.72, // llenar
  cierra: 30.06, // cierra
  tubos: 31.14, // tubos
  asi: 34.58, // asi
  fin: 36.30, // FIN
};

const CROMO = "#C8CCD8";
const AGUA = "#3A8AD8";

// Corte de la válvula. abre: 0..1 (diafragma levantado); arriba: nivel de agua en la cámara superior 0..1; flujo: chorro de salida
const Valvula: React.FC<{ readonly t: number; readonly abre: number; readonly arriba: number; readonly flujo: number; readonly alivio?: number; readonly bypass?: number }> = ({
  t,
  abre,
  arriba,
  flujo,
  alivio = 0,
  bypass = 0,
}) => {
  const yD = 1000 - 70 * abre;
  return (
    <g>
      {/* cuerpo */}
      <rect x={300} y={700} width={480} height={460} rx={40} fill="#4A5060" />
      {/* entrada desde la izquierda */}
      <rect x={60} y={1030} width={260} height={90} fill="#4A5060" />
      <rect x={60} y={1045} width={300} height={60} fill={AGUA} />
      {/* cámara inferior con agua de la tubería */}
      <rect x={330} y={1010} width={420} height={120} fill={AGUA} />
      {/* salida hacia abajo (asiento en el centro) */}
      <rect x={480} y={1000} width={120} height={160} fill="#2A2E3A" />
      <rect x={480} y={1160} width={120} height={380} fill="#4A5060" />
      <rect x={500} y={1000} width={80} height={540} fill={AGUA} opacity={flujo} />
      {new Array(6).fill(0).map((_, k) => (
        <rect key={k} x={510} y={1000 + ((t * 600 + k * 90) % 540)} width={60} height={30} rx={10} fill="#8AC8FF" opacity={flujo * 0.7} />
      ))}
      {/* cámara superior */}
      <rect x={330} y={730} width={420} height={yD - 740} fill="#2A2E3A" />
      <rect x={330} y={730 + (yD - 740) * (1 - arriba)} width={420} height={(yD - 740) * arriba} fill={AGUA} opacity={0.85} />
      {/* diafragma de hule */}
      <rect x={330} y={yD - 10} width={420} height={22} rx={10} fill="#2A2A2A" />
      <rect x={470} y={yD} width={140} height={30} rx={8} fill="#3A3A3A" />
      {/* agujerito (bypass) */}
      <circle cx={400} cy={yD} r={9} fill={C.yellow} opacity={bypass} />
      {/* válvula de alivio arriba */}
      <rect x={520} y={690} width={40} height={60} fill={alivio ? C.cyan : CROMO} />
      {/* palanca */}
      <g transform={`rotate(${alivio * 25} 780 760)`}>
        <rect x={780} y={750} width={200} height={24} rx={12} fill={CROMO} />
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => {
  const c = (t * 0.4) % 1;
  const abre = c < 0.5 ? Math.sin(c * 2 * Math.PI) : 0;
  return (
    <>
      <Valvula t={t} abre={Math.max(0, abre)} arriba={1 - Math.max(0, abre)} flujo={Math.max(0, abre)} />
      <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
        ?
      </Texto>
    </>
  );
};

// A. Gancho: ¿cómo se cierra solo este baño?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.publicos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// Inodoro con fluxómetro (vista exterior)
const Bano: React.FC<{ readonly t: number; readonly chorro: number; readonly palanca: number }> = ({ t, chorro, palanca }) => (
  <g>
    <rect x={500} y={640} width={50} height={420} fill={CROMO} />
    <rect x={470} y={780} width={110} height={110} rx={20} fill={CROMO} />
    <g transform={`rotate(${palanca * 30} 580 835)`}>
      <rect x={580} y={825} width={150} height={20} rx={10} fill={CROMO} />
    </g>
    <path d="M 330 1080 L 750 1080 Q 760 1250 600 1300 L 600 1450 L 470 1450 L 470 1300 Q 320 1250 330 1080 Z" fill="#E8E8F0" />
    <ellipse cx={540} cy={1090} rx={190} ry={40} fill="#C8D0DC" />
    {new Array(5).fill(0).map((_, k) => (
      <circle key={k} cx={420 + k * 60} cy={1100 + ((t * 300 + k * 20) % 60)} r={10} fill={AGUA} opacity={chorro} />
    ))}
  </g>
);

// B. Sin tanque: bajas la palanca, cañonazo de agua y se cierra + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ch = interpolate(t, [T.canonazo, T.canonazo + 0.3, T.final - 0.2, T.final + 0.3], [0, 1, 1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.publicos, T.diafragma], [1, 1.04])}>
      <Bano t={t} chorro={ch} palanca={interpolate(t, [T.palanca, T.palanca + 0.3, T.canonazo + 0.3], [0, 1, 0], clamp)} />
      <Texto x={540} y={1550} size={36} color={C.white} op={aparece(t, T.tanque)}>
        sin tanque
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué tu casa no tiene uno?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.diafragma], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Diafragma que separa dos cámaras; el agujerito llena la de arriba y la presión lo mantiene cerrado
export const Cerrado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lleno = interpolate(t, [T.agujerito, T.grande], [0.3, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.diafragma, T.palanca2], [1, 1.04])}>
        <Valvula t={t} abre={0} arriba={lleno} flujo={0} bypass={aparece(t, T.agujerito)} />
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.diafragma)}>
          diafragma de hule entre dos cámaras
        </Texto>
        <Texto x={240} y={980} size={28} color={C.yellow} op={aparece(t, T.agujerito)}>
          agujerito
        </Texto>
        <g opacity={aparece(t, T.aplasta)}>
          {[400, 540, 680].map((x) => (
            <path key={x} d={`M ${x} 790 l 0 120 m -16 -16 l 16 16 l 16 -16`} stroke={C.yellow} strokeWidth={8} fill="none" />
          ))}
        </g>
        <Texto x={540} y={1500} size={36} color={C.yellow} op={aparece(t, T.grande)}>
          cara de arriba más grande: lo aplasta
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.aplasta} color={C.yellow} />
    </>
  );
};

// D. La palanca vacía la cámara de arriba; la presión cae, el agua empuja el diafragma y sale el chorro
export const Abre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vac = interpolate(t, [T.vacia, T.cae + 0.3], [1, 0.1], clamp);
  const abre = interpolate(t, [T.empuja, T.empuja + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.palanca2, T.agujerito2], [1, 1.04])}>
        <Valvula t={t} abre={abre} arriba={vac} flujo={aparece(t, T.chorro)} alivio={aparece(t, T.palanca2)} />
        <Texto x={540} y={640} size={38} color={C.cyan} op={aparece(t, T.vacia)}>
          la palanca vacía la cámara de arriba
        </Texto>
        <g opacity={aparece(t, T.empuja)}>
          {[380, 700].map((x) => (
            <path key={x} d={`M ${x} 1120 l 0 -90 m -16 16 l 16 -16 l 16 16`} stroke={C.cyan} strokeWidth={8} fill="none" />
          ))}
        </g>
        <Texto x={760} y={1450} size={40} color={C.yellow} op={aparece(t, T.chorro)}>
          ¡chorro!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.chorro} color={C.cyan} />
    </>
  );
};

// E. El agujerito vuelve a llenar la cámara y el diafragma se cierra
export const Cierra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ll = interpolate(t, [T.agujerito2, T.cierra + 0.3], [0.1, 1], clamp);
  const abre = interpolate(t, [T.llenar, T.cierra + 0.3], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.agujerito2, T.tubos], [1, 1.04])}>
      <Valvula t={t} abre={abre} arriba={ll} flujo={abre} bypass={1} />
      <Texto x={540} y={640} size={38} color={C.yellow} op={aparece(t, T.agujerito2)}>
        el agujerito la vuelve a llenar
      </Texto>
      <Texto x={540} y={1500} size={42} color="#5AD08A" op={aparece(t, T.cierra)}>
        ¡se cierra solo!
      </Texto>
    </Lienzo>
  );
};

// F. Necesita tubos grandes y mucha presión
export const Casa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tubos, T.asi], [1, 1.04])}>
      <rect x={200} y={700} width={240} height={700} fill="#4A5060" />
      <rect x={225} y={700} width={190} height={700} fill={AGUA} />
      <Texto x={320} y={1480} size={32} color={C.white}>
        edificio: tubo grande
      </Texto>
      <rect x={720} y={700} width={60} height={700} fill="#4A5060" />
      <rect x={735} y={700} width={30} height={700} fill={AGUA} opacity={0.7} />
      <Texto x={750} y={1480} size={32} color={C.grey}>
        casa: tubo delgado
      </Texto>
      <Texto x={540} y={620} size={40} color={C.yellow} op={aparece(t, T.tubos)}>
        necesita tubos grandes y mucha presión
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
