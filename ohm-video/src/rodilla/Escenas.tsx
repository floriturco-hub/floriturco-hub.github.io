import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/rodilla/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  medico: 2.08, // medico
  rodilla: 3.40, // rodilla
  cerebro: 5.76, // cerebro
  final: 7.16, // final
  golpe: 9.66, // golpe
  tendon: 10.56, // tendon
  muslo: 12.40, // muslo
  sensores: 13.18, // sensores
  medula: 16.46, // medula
  neurona: 18.26, // neurona
  directo: 19.20, // directo
  monosinaptico: 23.40, // monosin
  orden: 25.02, // orden
  contrae: 26.58, // contrae
  milisegundos: 29.30, // milisegundos
  aviso: 30.50, // aviso
  mantenerte: 32.78, // mantenerte
  dobla: 34.58, // dobla
  corrige: 36.10, // corrige
  porEso: 37.32, // por
  fin: 38.98, // FIN
};

const PIEL = "#E8B48A";
const MUSCULO = "#C86A5A";

// Pierna sentada de lado: muslo horizontal desde la cadera (x0,y0) hasta la rodilla; pantorrilla con ángulo a (0 = colgando)
const Pierna: React.FC<{ readonly a: number; readonly musc?: number; readonly tendon?: number; readonly sens?: number; readonly t?: number }> = ({ a, musc = 0, tendon = 0, sens = 0, t = 0 }) => (
  <g>
    <rect x={150} y={880} width={460} height={120} rx={50} fill={PIEL} />
    <ellipse cx={380} cy={920} rx={200} ry={40} fill={MUSCULO} opacity={musc} />
    {sens > 0
      ? [300, 380, 460].map((x, k) => <circle key={x} cx={x} cy={920} r={12 + 4 * Math.sin(t * 10 + k)} fill={C.yellow} opacity={sens} />)
      : null}
    <g transform={`rotate(${-a} 620 950)`}>
      <rect x={570} y={940} width={100} height={420} rx={45} fill={PIEL} />
      <path d="M 640 1340 L 640 1410 Q 700 1430 760 1410 L 760 1370 Z" fill={PIEL} />
      <rect x={605} y={990} width={14} height={80} rx={7} fill="#F0E0C8" opacity={tendon} />
    </g>
    <circle cx={630} cy={950} r={46} fill="#F0C8A0" />
  </g>
);

const Martillo: React.FC<{ readonly a: number }> = ({ a }) => (
  <g transform={`rotate(${a} 900 1150)`}>
    <rect x={895} y={1000} width={14} height={240} rx={7} fill="#B8B8C4" />
    <path d="M 860 1010 L 940 990 L 950 1030 L 870 1050 Z" fill="#E8A040" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => {
  const c = (t * 0.7) % 1;
  const golpe = c > 0.3 && c < 0.45 ? 1 : 0;
  const pat = Math.max(0, Math.sin(Math.max(0, c - 0.42) * 12)) * (c > 0.42 && c < 0.7 ? 1 : 0);
  return (
    <>
      <Pierna a={35 * pat} />
      <Martillo a={golpe ? 25 : 0} />
      <Texto x={880} y={620} size={130} color={C.yellow} op={q}>
        ?
      </Texto>
    </>
  );
};

// A. Gancho: ¿por qué esta pierna patea sola?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.medico], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. El médico golpea bajo la rodilla y la pierna patea antes de que el cerebro se entere + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = T.rodilla + 0.3;
  const pat = interpolate(t, [g + 0.1, g + 0.35, g + 0.9], [0, 35, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.medico, T.golpe], [1, 1.04])}>
      <Pierna a={pat} />
      <Martillo a={t > g - 0.15 && t < g + 0.05 ? 25 : 0} />
      <g opacity={aparece(t, T.cerebro)}>
        <ellipse cx={300} cy={650} rx={110} ry={80} fill="#E8B4C8" opacity={0.3} stroke={C.white} strokeWidth={4} />
        <Texto x={300} y={665} size={34} color={C.white}>
          ¿eh?
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿para qué sirve?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.golpe], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El golpe estira el tendón y el músculo del muslo; sus sensores mandan una señal
export const Estiron: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.golpe, T.medula], [1, 1.04])}>
        <Pierna a={0} musc={aparece(t, T.muslo)} tendon={aparece(t, T.tendon)} sens={aparece(t, T.sensores)} t={t} />
        <Martillo a={t > T.golpe && t < T.golpe + 0.3 ? 25 : 0} />
        <Texto x={680} y={1060} size={30} color="#F0E0C8" op={aparece(t, T.tendon)}>
          tendón
        </Texto>
        <Texto x={380} y={840} size={32} color={MUSCULO} op={aparece(t, T.muslo)}>
          músculo del muslo
        </Texto>
        <Texto x={540} y={640} size={38} color={C.yellow} op={aparece(t, T.sensores)}>
          sensores de estiramiento
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.golpe} color={C.white} />
    </>
  );
};

// D. Médula espinal: la neurona se conecta directo con la que mueve el músculo (monosináptico); la orden vuelve y patea
export const Arco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ida = interpolate(t, [T.medula, T.neurona + 0.4], [0, 1], clamp);
  const vuelta = interpolate(t, [T.orden, T.contrae + 0.3], [0, 1], clamp);
  const pat = interpolate(t, [T.contrae, T.contrae + 0.3, T.contrae + 1], [0, 30, 0], clamp);
  const msT = interpolate(t, [T.medula, T.milisegundos], [0, 50], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.medula, T.mantenerte], [1, 1.04])}>
        {/* médula */}
        <rect x={760} y={560} width={160} height={560} rx={70} fill="#5A6070" opacity={0.7} />
        <Texto x={840} y={540} size={30} color={C.white}>
          médula espinal
        </Texto>
        <g transform="translate(0 260) scale(0.8)">
          <Pierna a={pat} musc={0.7} />
        </g>
        {/* nervio sensorial (ida) y motor (vuelta) */}
        <path d="M 320 990 Q 600 820 800 820" stroke={C.yellow} strokeWidth={8} fill="none" opacity={0.4} />
        <path d="M 820 880 Q 600 1000 320 1010" stroke={C.cyan} strokeWidth={8} fill="none" opacity={0.4} />
        <circle cx={320 + 480 * ida} cy={990 - 170 * Math.sin(ida * Math.PI * 0.5)} r={18} fill={C.yellow} opacity={ida > 0 && ida < 1 ? 1 : 0} />
        <circle cx={820 - 500 * vuelta} cy={880 + 130 * Math.sin(vuelta * Math.PI * 0.5)} r={18} fill={C.cyan} opacity={vuelta > 0 && vuelta < 1 ? 1 : 0} />
        {/* sinapsis única */}
        <circle cx={810} cy={850} r={30} fill="none" stroke={C.white} strokeWidth={5} opacity={aparece(t, T.directo)} />
        <Texto x={540} y={1380} size={38} color={C.white} op={aparece(t, T.directo)}>
          una sola conexión
        </Texto>
        <Texto x={540} y={1450} size={44} color={C.yellow} op={aparece(t, T.monosinaptico)}>
          monosináptico
        </Texto>
        <Texto x={800} y={1250} size={36} color={C.cyan} op={aparece(t, T.milisegundos)}>
          {"~" + Math.round(msT) + " milisegundos"}
        </Texto>
        <g opacity={aparece(t, T.aviso)}>
          <ellipse cx={300} cy={650} rx={110} ry={80} fill="#E8B4C8" opacity={0.3} stroke={C.white} strokeWidth={4} />
          <Texto x={300} y={665} size={28} color={C.white}>
            cerebro: después
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.monosinaptico} color={C.yellow} />
    </>
  );
};

// E. Sirve para mantenerte de pie: si la rodilla se dobla de golpe, el músculo la corrige
export const Funcion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dob = interpolate(t, [T.dobla, T.dobla + 0.4, T.corrige + 0.4], [0, 1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.mantenerte, T.porEso], [1, 1.04])}>
      <g transform={`translate(540 1000)`}>
        <circle cx={0} cy={-330} r={50} fill={PIEL} />
        <rect x={-50} y={-280} width={100} height={220} rx={40} fill="#4A6AC8" />
        <path d={`M -30 -60 L ${-30 - 60 * dob} 140 L -30 340`} stroke={PIEL} strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M 30 -60 L ${30 + 30 * dob} 140 L 30 340`} stroke={PIEL} strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.mantenerte)}>
        te mantiene de pie
      </Texto>
      <Texto x={540} y={1440} size={38} color={C.yellow} op={aparece(t, T.corrige)}>
        el músculo corrige sin pensar
      </Texto>
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
