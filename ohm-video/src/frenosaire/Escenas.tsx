import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/frenosaire/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  trailer: 2.32, // trailer
  aire: 3.26, // aire
  golpe: 5.42, // golpe
  final: 6.24, // final
  seguro: 8.02, // seguro
  compresor: 9.04, // compresor
  tanques: 9.84, // tanques
  rueda: 11.68, // rueda
  pisar: 14.14, // pisar
  piston: 15.92, // piston
  balatas: 16.96, // balatas
  resorte: 18.66, // resorte
  frenaria: 21.36, // frenaria
  presion: 23.20, // presion
  comprimido: 25.12, // comprimido
  libres: 26.92, // libres
  manguera: 27.98, // manguera
  escapa: 29.44, // escapa
  suelta: 31.70, // suelta
  falla: 34.28, // falla
  porEso: 36.54, // por
  fin: 38.66, // FIN
};

const AIRE = "#8AC8FF";

const Camion: React.FC<{ readonly x: number; readonly t: number; readonly giro?: number }> = ({ x, t, giro = 1 }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-420} y={880} width={620} height={240} rx={14} fill="#C8CCD8" />
    <path d="M 210 940 L 360 940 L 420 1020 L 420 1120 L 210 1120 Z" fill="#E8A040" />
    <rect x={250} y={960} width={90} height={60} rx={8} fill="#8AC8FF" opacity={0.7} />
    {[-340, -230, 300].map((wx) => (
      <g key={wx} transform={`translate(${wx} 1140) rotate(${t * 300 * giro})`}>
        <circle cx={0} cy={0} r={50} fill="#2A2A2A" />
        <rect x={-6} y={-36} width={12} height={72} fill="#5A6070" />
      </g>
    ))}
  </g>
);

// Cámara de freno de resorte: aire 0..1 (presión), resorte comprimido cuando aire=1
const Camara: React.FC<{ readonly aire: number; readonly servicio?: number; readonly t: number }> = ({ aire, servicio = 0, t }) => {
  const comp = aire; // 1 = resorte comprimido
  const xR = 720 - 160 * comp; // extremo del resorte
  const empuje = Math.max(servicio, 1 - comp);
  return (
    <g transform="translate(110 0)">
      {/* carcasa */}
      <rect x={160} y={820} width={620} height={300} rx={40} fill="none" stroke="#C8CCD8" strokeWidth={10} />
      <line x1={470} y1={820} x2={470} y2={1120} stroke="#C8CCD8" strokeWidth={8} />
      {/* lado del resorte (derecha) con aire */}
      <rect x={480} y={830} width={290} height={280} fill={AIRE} opacity={0.35 * aire} />
      {/* resorte */}
      <path
        d={new Array(13)
          .fill(0)
          .map((_, k) => `${k ? "L" : "M"} ${770 - ((770 - xR) * k) / 12} ${k % 2 ? 860 : 1080}`)
          .join(" ")}
        stroke={C.yellow}
        strokeWidth={10}
        fill="none"
      />
      {/* lado de servicio (izquierda) */}
      <rect x={170} y={830} width={290} height={280} fill={AIRE} opacity={0.35 * servicio} />
      {/* varilla que empuja hacia la rueda */}
      <rect x={60 - 50 * empuje} y={955} width={420} height={30} fill="#9AA2B4" />
      <rect x={20 - 50 * empuje} y={900} width={60} height={140} rx={10} fill="#C86A5A" />
      <Texto x={70 - 50 * empuje} y={1080} size={26} color="#C86A5A">
        balata
      </Texto>
      {void t}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Camion x={520} t={t} giro={0} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M ${200 + k * 50} 1200 l 20 30`} stroke={C.yellow} strokeWidth={6} opacity={0.5 + 0.4 * Math.sin(t * 8 + k)} />
    ))}
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué estos frenos se clavan solos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.trailer], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Un tráiler frena con aire; si se le acaba el aire, frena de golpe + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const para = aparece(t, T.golpe);
  const x = 520 + interpolate(t, [T.trailer, T.golpe], [-300, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.trailer, T.compresor], [1, 1.04])}>
      <Camion x={x} t={t} giro={1 - para} />
      <Texto x={540} y={1360} size={40} color={AIRE} op={aparece(t, T.aire) * (1 - para)}>
        frena con aire
      </Texto>
      <Texto x={540} y={1360} size={44} color={C.yellow} op={para}>
        sin aire: ¡frena de golpe!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué es más seguro?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.compresor], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Un compresor llena tanques de aire a presión
export const Tanques: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lleno = interpolate(t, [T.tanques, T.rueda], [0.2, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.compresor, T.rueda], [1, 1.04])}>
      <g transform={`translate(260 1000) rotate(${t * 400})`} opacity={aparece(t, T.compresor)}>
        <circle cx={0} cy={0} r={90} fill="#5A6070" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={-10} y={-80} width={20} height={70} fill="#9AA2B4" transform={`rotate(${k * 90})`} />
        ))}
      </g>
      <Texto x={260} y={1150} size={32} color={C.white} op={aparece(t, T.compresor)}>
        compresor
      </Texto>
      {[0, 1].map((k) => (
        <g key={k} opacity={aparece(t, T.tanques)}>
          <rect x={500} y={820 + k * 240} width={420} height={180} rx={90} fill="#2A2E3A" stroke="#C8CCD8" strokeWidth={6} />
          <rect x={510} y={830 + k * 240} width={400 * lleno} height={160} rx={80} fill={AIRE} opacity={0.6} />
        </g>
      ))}
      <Texto x={710} y={1360} size={36} color={AIRE} op={aparece(t, T.tanques)}>
        tanques de aire a presión
      </Texto>
    </Lienzo>
  );
};

// D. En cada rueda, una cámara con dos partes: al pisar, el aire empuja un pistón que aprieta las balatas
export const Servicio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const serv = interpolate(t, [T.pisar, T.piston + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rueda, T.resorte], [1, 1.04])}>
        <Camara aire={1} servicio={serv} t={t} />
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.rueda)}>
          cámara de freno: dos partes
        </Texto>
        <Texto x={315} y={1200} size={32} color={AIRE} op={aparece(t, T.pisar)}>
          pisas: entra aire
        </Texto>
        <Texto x={540} y={1400} size={38} color="#C86A5A" op={aparece(t, T.balatas)}>
          el pistón aprieta las balatas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.piston} color={AIRE} />
    </>
  );
};

// E. Detrás, un resorte gigante; mientras hay presión, el aire lo mantiene comprimido y las ruedas giran libres
export const Resorte: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.resorte, T.manguera], [1, 1.04])}>
        <Camara aire={aparece(t, T.presion)} t={t} />
        <Texto x={540} y={640} size={40} color={C.yellow} op={aparece(t, T.resorte)}>
          un resorte gigante
        </Texto>
        <Texto x={540} y={720} size={32} color={C.white} op={aparece(t, T.frenaria) * (1 - aparece(t, T.presion))}>
          por sí solo frenaría el camión
        </Texto>
        <Texto x={625} y={1200} size={32} color={AIRE} op={aparece(t, T.comprimido)}>
          el aire lo comprime
        </Texto>
        <Texto x={540} y={1400} size={40} color="#5AD08A" op={aparece(t, T.libres)}>
          ruedas libres
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.resorte} color={C.yellow} />
    </>
  );
};

// F. Si una manguera se rompe y el aire se escapa, el resorte se suelta y clava los frenos
export const Falla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const aire = 1 - interpolate(t, [T.escapa, T.suelta + 0.2], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.manguera, T.porEso], [1, 1.04])}>
        <Camara aire={aire} t={t} />
        <path d="M 890 960 Q 980 960 990 860" stroke="#5A6070" strokeWidth={22} fill="none" />
        {aparece(t, T.escapa) > 0
          ? new Array(6).fill(0).map((_, k) => {
              const u = (t * 1.2 + k / 6) % 1;
              return <circle key={k} cx={990 + u * 40} cy={860 - u * 160} r={12 + u * 14} fill={AIRE} opacity={aparece(t, T.escapa) * (1 - u) * aire} />;
            })
          : null}
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.manguera)}>
          se rompe una manguera…
        </Texto>
        <Texto x={540} y={1400} size={44} color={C.yellow} op={aparece(t, T.suelta)}>
          el resorte clava los frenos
        </Texto>
        <Texto x={540} y={1480} size={36} color="#5AD08A" op={aparece(t, T.falla)}>
          una falla nunca lo deja sin frenos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.suelta} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
