import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/olorrecuerdo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  perfume: 2.32, // perfume
  tierra: 3.08, // tierra
  infancia: 5.76, // infancia
  final: 6.86, // final
  edad: 7.76, // edad
  ves: 9.88, // ves
  talamo: 11.62, // t
  filtra: 13.00, // filtra
  olfato: 14.64, // olfato
  bulbo: 17.28, // bulbo
  amigdala: 18.38, // am
  hipocampo: 20.60, // hipocampo
  sentias: 26.44, // sent
  recuerdos2: 27.58, // recuerdos
  primeros: 29.78, // primeros
  porEso: 31.50, // por
  fin: 33.26, // FIN
};

const ROSA = "#E8A0C8";

// Cerebro de perfil con regiones: tálamo (centro), amígdala, hipocampo, bulbo olfatorio (adelante abajo)
const Cerebro: React.FC<{ readonly t: number; readonly ruta: number; readonly olor: number; readonly amig?: number; readonly hipo?: number; readonly tal?: number }> = ({ t, ruta, olor, amig = 0, hipo = 0, tal = 0 }) => {
  const u = (t * 0.8) % 1;
  return (
    <g>
      <path d="M 240 1000 Q 220 760 420 700 Q 600 640 760 720 Q 900 800 880 960 Q 870 1080 760 1120 L 520 1140 Q 300 1140 240 1000 Z" fill="#E8B4C8" opacity={0.25} stroke="#E8B4C8" strokeWidth={6} />
      <circle cx={560} cy={930} r={44} fill={C.cyan} opacity={0.25 + 0.6 * tal} />
      <ellipse cx={600} cy={1040} rx={40} ry={28} fill={C.orange} opacity={0.25 + 0.7 * amig} />
      <path d="M 620 1060 Q 700 1080 760 1020" stroke={C.yellow} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.25 + 0.7 * hipo} />
      <ellipse cx={330} cy={1100} rx={60} ry={18} fill={ROSA} />
      {/* ruta del olor: bulbo -> amígdala/hipocampo */}
      <path d="M 340 1095 Q 460 1080 590 1040" stroke={ROSA} strokeWidth={6} fill="none" strokeDasharray="14 10" strokeDashoffset={-t * 60} opacity={ruta} />
      <circle cx={340 + u * 250} cy={1095 - u * 55} r={12} fill={ROSA} opacity={ruta} />
      {/* ruta de la vista: ojo -> tálamo */}
      <path d="M 240 880 Q 400 900 520 925" stroke={C.cyan} strokeWidth={5} fill="none" strokeDasharray="10 10" opacity={olor} />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <g transform="translate(540 1000)">
      <rect x={-60} y={-120} width={120} height={200} rx={30} fill={ROSA} opacity={0.8} />
      <rect x={-30} y={-170} width={60} height={60} rx={10} fill="#C8CCD8" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${-60 + k * 60} ${-200 - ((t * 40 + k * 20) % 80)} q 20 -30 0 -60`} stroke={ROSA} strokeWidth={6} fill="none" opacity={0.6} />
      ))}
    </g>
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este olor te transporta?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.perfume], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Hueles un perfume o tierra mojada y vuelves a tu infancia + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const inf = aparece(t, T.infancia);
  return (
    <Lienzo zoom={interpolate(t, [T.perfume, T.ves], [1, 1.04])}>
      <g opacity={1 - inf}>
        <Inicio t={t} q={0} />
        <Texto x={540} y={1320} size={36} color={ROSA} op={aparece(t, T.tierra)}>
          perfume · tierra mojada
        </Texto>
      </g>
      <g opacity={inf}>
        <rect x={240} y={760} width={600} height={460} rx={20} fill="#E8D8B0" opacity={0.2} stroke="#E8D8B0" strokeWidth={10} />
        <circle cx={460} cy={940} r={50} fill="#E8B48A" opacity={0.7} />
        <rect x={420} y={990} width={80} height={130} rx={30} fill="#E8A040" opacity={0.7} />
        <path d="M 600 1120 L 680 960 L 760 1120 Z" fill="#5AD08A" opacity={0.6} />
        <Texto x={540} y={1320} size={40} color="#E8D8B0">
          de vuelta a la infancia
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿de qué edad son?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.ves], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Lo que ves u oyes pasa por el tálamo, que filtra; el olfato va directo a la amígdala y al hipocampo
export const Ruta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ves, T.sentias], [1, 1.04])}>
        <Cerebro t={t} ruta={aparece(t, T.bulbo)} olor={aparece(t, T.ves)} tal={aparece(t, T.talamo)} amig={aparece(t, T.amigdala)} hipo={aparece(t, T.hipocampo)} />
        <Texto x={560} y={860} size={28} color={C.cyan} op={aparece(t, T.talamo)}>
          tálamo
        </Texto>
        <Texto x={540} y={640} size={34} color={C.cyan} op={aparece(t, T.filtra) * (1 - aparece(t, T.olfato))}>
          vista y oído: pasan por el filtro
        </Texto>
        <Texto x={540} y={640} size={36} color={ROSA} op={aparece(t, T.olfato)}>
          el olfato va directo
        </Texto>
        <Texto x={330} y={1170} size={26} color={ROSA} op={aparece(t, T.bulbo)}>
          bulbo olfatorio
        </Texto>
        <Texto x={540} y={1260} size={32} color={C.orange} op={aparece(t, T.amigdala)}>
          amígdala: emociones
        </Texto>
        <Texto x={540} y={1330} size={32} color={C.yellow} op={aparece(t, T.hipocampo)}>
          hipocampo: recuerdos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.olfato} color={ROSA} />
    </>
  );
};

// D. Trae el recuerdo y cómo te sentías; suelen ser de los primeros diez años
export const Infancia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sentias, T.porEso], [1, 1.04])}>
        <g opacity={1 - aparece(t, T.recuerdos2)}>
          <Texto x={540} y={900} size={44} color={C.yellow}>
            recuerdo
          </Texto>
          <Texto x={540} y={980} size={44} color={C.white}>
            +
          </Texto>
          <Texto x={540} y={1060} size={44} color={C.orange}>
            cómo te sentías
          </Texto>
        </g>
        <g opacity={aparece(t, T.recuerdos2)}>
          <line x1={140} y1={1000} x2={940} y2={1000} stroke={C.grey} strokeWidth={4} />
          {[0, 10, 20, 30, 40].map((a, k) => (
            <Texto key={a} x={140 + k * 200} y={1060} size={28} color={C.grey}>
              {String(a)}
            </Texto>
          ))}
          <rect x={140} y={880} width={200} height={110} rx={14} fill={ROSA} opacity={0.7 * aparece(t, T.primeros)} />
          <Texto x={540} y={1200} size={38} color={ROSA} op={aparece(t, T.primeros)}>
            los primeros diez años
          </Texto>
          <Texto x={540} y={860} size={28} color={C.white}>
            edad del recuerdo
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.primeros} color={ROSA} />
    </>
  );
};

// E. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
