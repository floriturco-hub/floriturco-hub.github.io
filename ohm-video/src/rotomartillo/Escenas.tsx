import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/rotomartillo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  taladro: 2.14, // taladro
  quema: 3.14, // quema
  rotomartillo: 5.14, // rotomartillo
  segundos: 6.72, // segundos
  final: 7.92, // final
  concreto: 10.62, // concreto
  fragil: 11.90, // fragil
  raspar: 13.22, // raspar
  golpes: 14.58, // golpes
  roto2: 15.52, // rotomartillo
  piston: 16.88, // piston
  miles: 18.26, // miles
  gira: 20.02, // gira
  pulveriza: 21.28, // pulveriza
  giro: 23.78, // giro
  polvo: 24.58, // polvo
  espirales: 25.14, // espirales
  punta: 26.98, // punta
  cuchillo: 28.18, // cuchillo
  carburo: 29.68, // carburo
  golpear: 31.46, // golpear
  taladro2: 32.70, // taladro
  raspa: 34.22, // raspa
  calienta: 35.04, // calienta
  avanza: 36.06, // avanza
  asi: 36.92, // asi
  fin: 38.56, // FIN
};

const CONC = "#7A7680";

// Broca vertical con espirales que giran; punta en (x, y)
const Broca: React.FC<{ readonly x: number; readonly y: number; readonly largo: number; readonly giro: number; readonly calor?: number; readonly carburo?: boolean }> = ({
  x,
  y,
  largo,
  giro,
  calor = 0,
  carburo = true,
}) => {
  const w = 60;
  const col = calor > 0 ? `rgb(${150 + calor * 105}, ${150 - calor * 90}, ${160 - calor * 130})` : "#B8B8C4";
  return (
    <g>
      <clipPath id={`br${x}`}>
        <rect x={x - w / 2} y={y - largo} width={w} height={largo - 40} />
      </clipPath>
      <rect x={x - w / 2} y={y - largo} width={w} height={largo - 40} fill={col} />
      <g clipPath={`url(#br${x})`}>
        {new Array(Math.ceil(largo / 50) + 2).fill(0).map((_, k) => {
          const yy = y - largo + k * 50 - ((giro * 50) % 50);
          return <path key={k} d={`M ${x - w / 2} ${yy} L ${x + w / 2} ${yy + 30} L ${x + w / 2} ${yy + 46} L ${x - w / 2} ${yy + 16} Z`} fill="#000" opacity={0.3} />;
        })}
      </g>
      <path d={`M ${x - w / 2} ${y - 40} L ${x + w / 2} ${y - 40} L ${x} ${y} Z`} fill={col} />
      {carburo ? <path d={`M ${x - w / 2 - 8} ${y - 46} L ${x + w / 2 + 8} ${y - 46} L ${x} ${y + 4} Z`} fill="#5A6070" /> : null}
    </g>
  );
};

const Bloque: React.FC<{ readonly y: number; readonly hueco?: { x: number; prof: number } }> = ({ y, hueco }) => (
  <g>
    <rect x={120} y={y} width={840} height={1500 - y} fill={CONC} />
    {new Array(30).fill(0).map((_, k) => (
      <circle key={k} cx={150 + ((k * 137) % 780)} cy={y + 30 + ((k * 89) % (1440 - y))} r={6 + (k % 3) * 4} fill="#5A5660" />
    ))}
    {hueco ? <rect x={hueco.x - 36} y={y - 2} width={72} height={hueco.prof + 2} fill="#1A1626" /> : null}
  </g>
);

const Polvo: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) => (
  <g opacity={op}>
    {new Array(14).fill(0).map((_, k) => {
      const u = (t * 1.2 + k / 14) % 1;
      const a = k * 2.3;
      return <circle key={k} cx={x + Math.cos(a) * (40 + u * 140)} cy={y - u * 160} r={8 + u * 10} fill="#B8B0A8" opacity={1 - u} />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => {
  const golpe = Math.abs(Math.sin(t * 25)) * 8;
  return (
    <>
      <Bloque y={1000} hueco={{ x: 540, prof: 160 }} />
      <rect x={490} y={420 + golpe} width={100} height={200} rx={20} fill={C.orange} />
      <Broca x={540} y={1160 + golpe} largo={540} giro={t * 6} />
      <Polvo x={540} y={1000} t={t} op={1} />
      <Texto x={820} y={700} size={130} color={C.yellow} op={q}>
        ?
      </Texto>
    </>
  );
};

// A. Gancho: ¿cómo atraviesa este concreto?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.taladro], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Taladro normal quema la broca; el rotomartillo atraviesa en segundos + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const prof = 40 + 360 * interpolate(t, [T.rotomartillo, T.segundos + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.taladro, T.concreto], [1, 1.04])}>
      <Bloque y={1000} hueco={{ x: 330, prof: 30 }} />
      <rect x={720} y={1000} width={72} height={prof} fill="#1A1626" />
      <Broca x={330} y={1030} largo={500} giro={t * 6} calor={interpolate(t, [T.quema, T.quema + 1.2], [0, 1], clamp)} />
      <Texto x={330} y={460} size={36} color={C.white} op={aparece(t, T.taladro)}>
        taladro normal
      </Texto>
      <Texto x={330} y={405} size={40} color={C.red} op={aparece(t, T.quema)}>
        ¡se quema!
      </Texto>
      <g opacity={aparece(t, T.rotomartillo)}>
        <Broca x={756} y={1000 + prof} largo={500} giro={t * 6} />
        <Polvo x={756} y={1000} t={t} op={1} />
        <Texto x={756} y={460} size={36} color={C.orange}>
          rotomartillo
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={1530} color={C.white} size={34}>
          ¿por qué no tiene filo?: al final
        </Texto>
        <rect x={290} y={1555} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={1555} width={500 * interpolate(t, [T.final, T.concreto], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El concreto es duro pero frágil: no se deja raspar, pero se rompe a golpes
export const Concreto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = aparece(t, T.golpes);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.concreto, T.roto2], [1, 1.04])}>
        <rect x={290} y={700} width={500} height={400} rx={12} fill={CONC} />
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={360 + k * 90} cy={760 + (k % 2) * 260} r={14} fill="#5A5660" />
        ))}
        <g opacity={g}>
          <path d="M 540 700 L 500 820 L 580 900 L 520 1100 M 580 900 L 700 960 M 500 820 L 380 860" stroke="#1A1626" strokeWidth={10} fill="none" />
        </g>
        <Texto x={540} y={620} size={42} color={C.white} op={aparece(t, T.fragil)}>
          duro pero frágil
        </Texto>
        <Texto x={540} y={1220} size={40} color={C.red} op={aparece(t, T.raspar)}>
          raspar: ✗
        </Texto>
        <Texto x={540} y={1300} size={40} color="#5AD08A" op={g}>
          golpes: ✓
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.golpes} color={C.white} />
    </>
  );
};

// D. Un pistón dentro golpea la broca miles de veces por minuto mientras gira
export const Piston: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciclo = (t * 3) % 1;
  const golpe = ciclo > 0.7 && ciclo < 0.8 ? 1 : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.roto2, T.pulveriza], [1, 1.04])}>
      <rect x={380} y={480} width={320} height={560} rx={30} fill={C.orange} opacity={0.35} />
      <rect x={440} y={520} width={200} height={480} rx={10} fill="#2A2440" />
      <g opacity={aparece(t, T.piston)}>
        <rect x={460} y={560 + (ciclo < 0.75 ? ciclo * 260 : 195 - (ciclo - 0.75) * 780)} width={160} height={120} rx={10} fill="#C8C8D4" />
        <Texto x={820} y={640} size={34} color={C.white}>
          pistón
        </Texto>
      </g>
      <Broca x={540} y={1460 + golpe * 14} largo={500} giro={aparece(t, T.gira) * t * 6} />
      <rect x={510} y={940 + golpe * 14} width={60} height={60} fill="#B8B8C4" />
      {golpe ? <Texto x={680} y={960} size={40} color={C.yellow}>¡TAC!</Texto> : null}
      <Texto x={540} y={1505} size={40} color={C.yellow} op={aparece(t, T.miles)}>
        miles de golpes por minuto
      </Texto>
      <Texto x={540} y={430} size={36} color={C.cyan} op={aparece(t, T.gira)}>
        + giro
      </Texto>
    </Lienzo>
  );
};

// E. Cada golpe pulveriza la punta; el giro saca el polvo por las espirales
export const PolvoEsc: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const golpe = Math.abs(Math.sin(t * 25)) * 8;
  return (
    <Lienzo zoom={interpolate(t, [T.pulveriza, T.punta], [1.2, 1.25])} cy={1050}>
      <Bloque y={900} hueco={{ x: 540, prof: 360 }} />
      <Broca x={540} y={1260 + golpe} largo={800} giro={t * 6} />
      <Polvo x={540} y={1240} t={t} op={aparece(t, T.pulveriza) * (1 - aparece(t, T.giro))} />
      <g opacity={aparece(t, T.polvo)}>
        {new Array(10).fill(0).map((_, k) => {
          const u = (t * 0.7 + k / 10) % 1;
          const yy = 1240 - u * 420;
          return <circle key={k} cx={540 + Math.sin(u * 20) * 26} cy={yy} r={10} fill="#E8E0D8" />;
        })}
      </g>
      <Texto x={780} y={1200} size={34} color={C.white} op={aparece(t, T.pulveriza)}>
        polvo
      </Texto>
      <Texto x={540} y={760} size={34} color={C.cyan} op={aparece(t, T.espirales)}>
        sale por las espirales
      </Texto>
    </Lienzo>
  );
};

// F. La punta no corta: pastilla de carburo hecha para golpear
export const Punta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.punta, T.taladro2], [1, 1.04])}>
        <g opacity={aparece(t, T.cuchillo) * (1 - aparece(t, T.carburo))}>
          <path d="M 200 760 L 520 720 L 520 790 Z" fill="#D8D8E4" />
          <rect x={80} y={735} width={130} height={50} rx={10} fill="#5A3A2A" />
          <Texto x={300} y={880} size={38} color={C.red}>
            filo: ✗
          </Texto>
        </g>
        <g transform="translate(540 1000) scale(2.2)">
          <rect x={-30} y={-260} width={60} height={220} fill="#B8B8C4" />
          <path d="M -38 -46 L 38 -46 L 0 4 Z" fill="#5A6070" stroke={C.yellow} strokeWidth={aparece(t, T.carburo) * 3} />
        </g>
        <Texto x={540} y={1150} size={44} color={C.yellow} op={aparece(t, T.carburo)}>
          pastilla de carburo
        </Texto>
        <Texto x={540} y={1230} size={38} color={C.white} op={aparece(t, T.golpear)}>
          hecha para golpear
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.carburo} color={C.yellow} />
    </>
  );
};

// G. Un taladro normal solo gira y raspa: se calienta y apenas avanza
export const Normal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.taladro2, T.asi], [1, 1.04])}>
      <Bloque y={1000} hueco={{ x: 540, prof: 20 + interpolate(t, [T.taladro2, T.asi], [0, 15], clamp) }} />
      <Broca x={540} y={1020} largo={560} giro={t * 6} calor={interpolate(t, [T.calienta, T.calienta + 1.2], [0, 1], clamp)} carburo={false} />
      <Texto x={540} y={400} size={36} color={C.white} op={aparece(t, T.taladro2)}>
        taladro normal: gira y raspa
      </Texto>
      <Texto x={800} y={860} size={40} color={C.red} op={aparece(t, T.calienta)}>
        se calienta
      </Texto>
      <Texto x={800} y={930} size={40} color={C.grey} op={aparece(t, T.avanza)}>
        apenas avanza
      </Texto>
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
