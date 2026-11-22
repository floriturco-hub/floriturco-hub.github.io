import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cintametrica/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sacas: 2.24, // sacas
  derecha: 4.34, // derecha
  dobla: 6.18, // dobla
  clac: 6.84, // clac
  final: 8.52, // final
  juguete: 9.30, // juguete
  plana: 12.24, // plana
  canaleta: 14.52, // canaleta
  doblarla: 15.44, // doblarla
  direcciones: 17.70, // direcciones
  estirar: 19.80, // estirar
  aguanta: 23.40, // aguanta
  fuerza: 24.92, // fuerza
  aplana: 26.82, // aplana
  facilisimo: 29.36, // facil
  cae: 30.48, // cae
  estados: 31.50, // estados
  salta: 34.14, // salta
  pulseras: 35.58, // pulseras
  porEso: 37.42, // por
  fin: 39.42, // FIN
};

const CINTA = "#F0C840";

// Flexómetro: caja en x0 y cinta horizontal de largo L; caida: 0 = recta, 1 = doblada y colgando desde el punto de quiebre
const Flexo: React.FC<{ readonly L: number; readonly caida: number; readonly y?: number }> = ({ L, caida, y = 1000 }) => {
  const x0 = 220;
  const kink = x0 + L * 0.45;
  const ang = caida * 80;
  return (
    <g>
      <path d={`M ${x0} ${y - 12} L ${kink} ${y - 12} L ${kink} ${y + 12} L ${x0} ${y + 12} Z`} fill={CINTA} />
      {new Array(Math.floor((kink - x0) / 40)).fill(0).map((_, k) => (
        <line key={k} x1={x0 + 20 + k * 40} y1={y - 12} x2={x0 + 20 + k * 40} y2={y - 2} stroke="#2A2A2A" strokeWidth={3} />
      ))}
      <g transform={`rotate(${ang} ${kink} ${y})`}>
        <rect x={kink} y={y - 12} width={L * 0.55} height={24} fill={CINTA} />
        <rect x={kink + L * 0.55 - 6} y={y - 30} width={10} height={42} fill="#8A8A96" />
      </g>
      <rect x={60} y={y - 110} width={190} height={190} rx={40} fill="#3A3E4A" stroke="#E8C040" strokeWidth={6} />
      <circle cx={155} cy={y - 15} r={30} fill="#E8C040" />
    </g>
  );
};

// Corte transversal de la cinta: curv 1 = canaleta, 0 = plana
const Perfil: React.FC<{ readonly x: number; readonly y: number; readonly curv: number; readonly s?: number }> = ({ x, y, curv, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -160 0 Q 0 ${-90 * curv} 160 0`} stroke={CINTA} strokeWidth={18} fill="none" strokeLinecap="round" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Flexo L={760} caida={0} />
    <Perfil x={760} y={1300} curv={1} s={0.7} />
    <Texto x={880} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    {void t}
  </>
);

// A. Gancho: ¿por qué esta cinta se mantiene rígida?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sacas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Sacas un metro y se queda derecha; si se dobla, clac y cae + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const L = interpolate(t, [T.sacas, T.derecha], [200, 760], clamp);
  const caida = interpolate(t, [T.clac, T.clac + 0.25], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sacas, T.plana], [1, 1.04])}>
        <Flexo L={L} caida={caida} />
        <Texto x={560} y={880} size={36} color={C.white} op={aparece(t, T.derecha) * (1 - caida)}>
          derecha como una espada
        </Texto>
        <Texto x={380} y={1300} size={56} color={C.yellow} op={caida}>
          ¡clac!
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            ¿qué juguete usa el truco?: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.plana], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.clac} color={C.yellow} />
    </>
  );
};

// C. No es plana: curvada como una canaleta; doblarla exigiría curvarse en dos direcciones y estirar el acero
export const Canaleta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dos = aparece(t, T.direcciones);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.plana, T.fuerza], [1, 1.04])}>
        <Perfil x={540} y={820} curv={aparece(t, T.canaleta)} s={1.4} />
        <Texto x={540} y={940} size={38} color={C.white} op={aparece(t, T.plana)}>
          corte de la cinta
        </Texto>
        <Texto x={540} y={1000} size={40} color={C.yellow} op={aparece(t, T.canaleta)}>
          curvada, como una canaleta
        </Texto>
        <g opacity={dos} transform="translate(540 1250)">
          {/* superficie doblemente curvada: rejilla */}
          {new Array(6).fill(0).map((_, k) => {
            const v = (k - 2.5) / 2.5;
            return <path key={`a${k}`} d={`M -260 ${v * 60 - 40 * (1 - v * v)} Q 0 ${v * 60 + 60 - 100 * (1 - v * v)} 260 ${v * 60 - 40 * (1 - v * v)}`} stroke={CINTA} strokeWidth={4} fill="none" />;
          })}
          {[-2, -1, 0, 1, 2].map((k) => (
            <path key={`b${k}`} d={`M ${k * 120} -100 Q ${k * 120} 0 ${k * 120} 110`} stroke={CINTA} strokeWidth={4} fill="none" opacity={0.6} />
          ))}
        </g>
        <Texto x={540} y={1430} size={36} color={C.cyan} op={dos}>
          curvarse en dos direcciones a la vez
        </Texto>
        <Texto x={540} y={1500} size={36} color={C.yellow} op={aparece(t, T.estirar)}>
          = estirar y comprimir el acero
        </Texto>
        <Texto x={540} y={640} size={40} color="#5AD08A" op={aparece(t, T.aguanta)}>
          por eso aguanta su peso
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.canaleta} color={C.yellow} />
    </>
  );
};

// D. Con fuerza suficiente, la canaleta se aplana en un punto; plana, doblarla es facilísimo y se cae
export const Pandeo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ap = interpolate(t, [T.aplana, T.aplana + 0.3], [0, 1], clamp);
  const caida = interpolate(t, [T.cae - 0.2, T.cae + 0.1], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.fuerza, T.estados], [1, 1.04])}>
        <Flexo L={760} caida={caida} />
        <circle cx={220 + 760 * 0.45} cy={1000} r={60} fill="none" stroke={C.yellow} strokeWidth={5} opacity={aparece(t, T.aplana)} />
        <Perfil x={300} y={1350} curv={1} s={0.7} />
        <Texto x={300} y={1440} size={30} color={C.white}>
          curvada: rígida
        </Texto>
        <Perfil x={780} y={1350} curv={1 - ap} s={0.7} />
        <Texto x={780} y={1440} size={30} color={C.yellow} op={aparece(t, T.aplana)}>
          aplanada: se dobla
        </Texto>
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.fuerza)}>
          con fuerza suficiente…
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.aplana} color={C.yellow} />
    </>
  );
};

// E. Dos estados estables; las pulseras de golpe usan lo mismo
export const Biestable: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pul = aparece(t, T.pulseras);
  const c = (t * 0.6) % 1;
  const enrolla = c > 0.5 ? 1 : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.estados, T.porEso], [1, 1.04])}>
      <g opacity={1 - pul}>
        <Perfil x={300} y={1000} curv={1} s={1} />
        <Perfil x={780} y={1000} curv={0} s={1} />
        <Texto x={300} y={1120} size={32} color={C.white}>
          estado 1
        </Texto>
        <Texto x={780} y={1120} size={32} color={C.white}>
          estado 2
        </Texto>
        <path d="M 420 900 Q 540 820 660 900" stroke={C.cyan} strokeWidth={6} fill="none" opacity={aparece(t, T.salta)} />
        <Texto x={540} y={1300} size={40} color={C.yellow} op={aparece(t, T.estados)}>
          dos estados estables
        </Texto>
      </g>
      <g opacity={pul}>
        {enrolla ? (
          <circle cx={540} cy={1000} r={110} fill="none" stroke="#3AC8D8" strokeWidth={30} />
        ) : (
          <rect x={240} y={985} width={600} height={30} rx={12} fill="#3AC8D8" />
        )}
        <Texto x={540} y={1300} size={42} color={C.yellow}>
          pulsera de golpe
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
