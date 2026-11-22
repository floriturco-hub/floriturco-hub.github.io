import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/rubor/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  rojos: 2.46, // rojos
  verguenza: 2.96, // verg
  animal: 5.12, // animal
  final: 6.54, // final
  darwin: 7.56, // darwin
  avergz: 9.10, // averg
  adrenalina: 10.72, // adrenalina
  cierra: 13.68, // cierra
  mejillas: 16.16, // mejillas
  abren: 19.08, // abren
  sangre: 20.34, // sangre
  caliente: 23.26, // caliente
  evitarlo: 24.56, // evitarlo
  estudios: 26.66, // estudios
  perdonan: 30.52, // perdonan
  darwin2: 31.76, // darwin
  humana: 33.28, // humana
  porEso: 35.22, // por
  fin: 37.16, // FIN
};

const PIEL = "#E8B48A";

const Cara: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rubor: number; readonly t?: number }> = ({ x, y, s = 1, rubor, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={200} ry={250} fill={PIEL} />
    <path d="M -200 -40 Q -210 -260 0 -270 Q 210 -260 200 -40 Q 150 -190 0 -190 Q -150 -190 -200 -40 Z" fill="#4A3020" />
    {[-1, 1].map((d) => (
      <ellipse key={d} cx={d * 110} cy={60} rx={70} ry={45} fill="#E05050" opacity={0.65 * rubor * (0.9 + 0.1 * Math.sin(t * 4))} />
    ))}
    <path d="M -100 -20 q 25 12 50 0 M 50 -20 q 25 12 50 0" stroke="#3A2A20" strokeWidth={8} fill="none" />
    <path d={rubor > 0.5 ? "M -50 120 q 50 -20 100 0" : "M -50 110 q 50 30 100 0"} stroke="#3A2A20" strokeWidth={8} fill="none" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cara x={540} y={1000} s={1.2} rubor={1} t={t} />
    <Texto x={880} y={580} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta cara se pone roja?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.rojos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Nos ponemos rojos de vergüenza y no conocemos otro animal que lo haga + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.rojos, T.avergz], [1, 1.04])}>
      <Cara x={540} y={980} s={1} rubor={aparece(t, T.rojos)} t={t} />
      <Texto x={540} y={1360} size={38} color={C.white} op={aparece(t, T.animal)}>
        ningún otro animal lo hace
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué dijo Darwin?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.avergz], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Vaso sanguíneo: ancho w
const Vaso: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly t: number; readonly col?: string }> = ({ x, y, w, t, col = "#E05050" }) => (
  <g>
    <rect x={x - 180} y={y - w / 2} width={360} height={w} rx={w / 2} fill={col} opacity={0.8} />
    {new Array(5).fill(0).map((_, k) => (
      <circle key={k} cx={x - 160 + ((t * 120 + k * 72) % 320)} cy={y} r={Math.max(4, w / 4)} fill="#A83030" />
    ))}
  </g>
);

// C. La adrenalina cierra vasos en casi todo el cuerpo, pero en las mejillas varias venas se abren: más sangre, cara roja
export const Venas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cierra = aparece(t, T.cierra);
  const abre = aparece(t, T.abren);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.avergz, T.evitarlo], [1, 1.04])}>
        <Texto x={540} y={620} size={40} color={C.orange} op={aparece(t, T.adrenalina)}>
          adrenalina
        </Texto>
        <Vaso x={540} y={820} w={60 - 30 * cierra} t={t} />
        <Texto x={540} y={900} size={30} color={C.white} op={cierra}>
          en casi todo el cuerpo: se cierran
        </Texto>
        <Vaso x={540} y={1080} w={40 + 50 * abre} t={t} />
        <Texto x={540} y={1180} size={32} color={C.yellow} op={aparece(t, T.mejillas)}>
          en las mejillas: se abren
        </Texto>
        <g opacity={aparece(t, T.sangre)}>
          <Cara x={540} y={1400} s={0.4} rubor={1} t={t} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.abren} color="#E05050" />
    </>
  );
};

// D. No puedes fingirlo; quien se sonroja tras un error es perdonado más fácil
export const Senal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.evitarlo, T.darwin2], [1, 1.04])}>
      <Cara x={330} y={980} s={0.7} rubor={1} t={t} />
      <g opacity={aparece(t, T.perdonan)}>
        <Cara x={780} y={980} s={0.7} rubor={0} t={t} />
        <path d="M 520 950 Q 560 900 600 950" stroke="#5AD08A" strokeWidth={8} fill="none" />
        <Texto x={560} y={880} size={40} color="#5AD08A">
          ✓
        </Texto>
      </g>
      <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.evitarlo)}>
        no se puede fingir
      </Texto>
      <Texto x={540} y={1300} size={34} color={C.yellow} op={aparece(t, T.perdonan)}>
        tras un error, se perdona más fácil
      </Texto>
    </Lienzo>
  );
};

// E. Darwin: la más humana de todas las expresiones
export const Darwin: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.darwin2, T.porEso], [1, 1.04])}>
        <g transform="translate(540 940)">
          <circle cx={0} cy={-60} r={110} fill={PIEL} />
          <path d="M -110 -40 Q -120 200 0 230 Q 120 200 110 -40 Q 60 60 0 50 Q -60 60 -110 -40 Z" fill="#E8E6F0" />
          <rect x={-150} y={170} width={300} height={140} rx={40} fill="#3A3A44" />
        </g>
        <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.darwin2)}>
          Charles Darwin
        </Texto>
        <Texto x={540} y={1360} size={36} color={C.yellow} op={aparece(t, T.humana)}>
          «la más humana de las expresiones»
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.humana} color={C.yellow} />
    </>
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
