import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cafebano/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tomas: 1.62, // tomas
  bano: 4.12, // bano
  descafeinado: 5.16, // descafeinado
  final: 6.30, // final
  personas: 7.32, // personas
  cafeina: 9.18, // cafeina
  reflejo: 11.06, // reflejo
  estomago: 12.90, // estomago
  acidos: 14.02, // acidos
  hormonas: 15.78, // hormonas
  gastrina: 17.16, // gastrina
  colon: 19.20, // colon
  oleadas: 20.40, // oleadas
  espacio: 22.82, // espacio
  normal: 23.84, // normal
  descafeinado2: 25.82, // descafeinado
  todos: 29.78, // todos
  estudios: 30.88, // estudios
  llamado: 33.90, // llamado
  porEso: 34.56, // por
  fin: 36.06, // FIN
};

const CAFE = "#6B3E22";

const Taza: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t?: number; readonly etiqueta?: string }> = ({ x, y, s = 1, t = 0, etiqueta }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M ${-40 + k * 40} ${-130 - ((t * 40 + k * 15) % 40)} q 16 -24 0 -48`} stroke="#E8E6F0" strokeWidth={6} fill="none" opacity={0.5} />
    ))}
    <path d="M -110 -100 L 110 -100 L 90 100 Q 0 130 -90 100 Z" fill="#E8E6F0" />
    <ellipse cx={0} cy={-100} rx={110} ry={22} fill={CAFE} />
    <path d="M 105 -60 Q 170 -50 160 10 Q 150 50 95 40" stroke="#E8E6F0" strokeWidth={18} fill="none" />
    {etiqueta ? (
      <Texto x={0} y={20} size={34} color={CAFE}>
        {etiqueta}
      </Texto>
    ) : null}
  </g>
);

// Intestino grueso estilizado (marco); ola 0..1 = contracciones
const Colon: React.FC<{ readonly t: number; readonly ola: number }> = ({ t, ola }) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const s = i / 60;
    let x;
    let y;
    if (s < 0.3) {
      x = 280;
      y = 1350 - (s / 0.3) * 500;
    } else if (s < 0.6) {
      x = 280 + ((s - 0.3) / 0.3) * 520;
      y = 850;
    } else {
      x = 800;
      y = 850 + ((s - 0.6) / 0.4) * 600;
    }
    pts.push([x, y]);
  }
  return (
    <g>
      {pts.map(([x, y], i) => {
        const w = 70 - 26 * ola * Math.max(0, Math.sin(i * 0.5 - t * 6));
        return <circle key={i} cx={x} cy={y} r={w / 2} fill="#C86A5A" opacity={0.85} />;
      })}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Taza x={420} y={1050} s={1.4} t={t} />
    <g transform="translate(800 1100)">
      <rect x={-70} y={-160} width={140} height={60} rx={14} fill="#E8E6F0" />
      <path d="M -90 -100 L 90 -100 Q 100 40 0 60 Q -100 40 -90 -100 Z" fill="#E8E6F0" />
    </g>
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este café te llama?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tomas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Te tomas un café y en minutos necesitas ir al baño, aunque sea descafeinado + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const min = Math.round(interpolate(t, [T.tomas, T.bano], [0, 5], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.tomas, T.cafeina], [1, 1.04])}>
      <Taza x={540} y={1000} s={1.3} t={t} etiqueta={aparece(t, T.descafeinado) > 0.5 ? "descaf." : undefined} />
      <Texto x={540} y={1330} size={44} color={C.yellow} op={aparece(t, T.tomas)}>
        {"+" + min + " min"}
      </Texto>
      <Texto x={540} y={1420} size={40} color={C.white} op={aparece(t, T.bano)}>
        ¡al baño!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿a cuántos les pasa?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.cafeina], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. No es solo la cafeína: despierta un reflejo del intestino
export const Reflejo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cafeina, T.estomago], [1, 1.04])}>
      <Texto x={540} y={900} size={56} color={C.white} op={aparece(t, T.cafeina)}>
        cafeína
      </Texto>
      <line x1={360} y1={880} x2={720} y2={880} stroke={C.red} strokeWidth={10} opacity={aparece(t, T.cafeina + 0.6)} />
      <Texto x={540} y={1100} size={42} color={C.yellow} op={aparece(t, T.reflejo)}>
        un reflejo del intestino
      </Texto>
    </Lienzo>
  );
};

// D. En el estómago, sus compuestos ácidos liberan hormonas digestivas, como la gastrina
export const Hormonas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.estomago, T.colon], [1, 1.04])}>
        <path d="M 400 700 Q 380 820 460 900 Q 560 1000 700 940 Q 820 880 760 760 Q 700 680 600 760 Q 520 820 480 700 Z" fill="#E8A090" opacity={0.85} />
        {new Array(8).fill(0).map((_, k) => (
          <circle key={k} cx={480 + ((k * 61) % 220)} cy={800 + ((k * 37) % 120)} r={10} fill={CAFE} opacity={aparece(t, T.acidos)} />
        ))}
        {new Array(6).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 6) % 1;
          return <circle key={k} cx={620 + u * 250} cy={900 + u * 400} r={14} fill={C.yellow} opacity={aparece(t, T.hormonas) * (1 - u)} />;
        })}
        <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.estomago)}>
          en el estómago
        </Texto>
        <Texto x={540} y={1200} size={34} color="#E8C8A8" op={aparece(t, T.acidos)}>
          compuestos ácidos del café
        </Texto>
        <Texto x={540} y={1400} size={40} color={C.yellow} op={aparece(t, T.hormonas)}>
          hormonas digestivas
        </Texto>
        <Texto x={540} y={1470} size={34} color={C.white} op={aparece(t, T.gastrina)}>
          como la gastrina
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.hormonas} color={C.yellow} />
    </>
  );
};

// E. Las hormonas hacen que el colon se contraiga en oleadas para hacer espacio
export const ColonEsc: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.colon, T.normal], [1, 1.04])}>
      <Colon t={t} ola={aparece(t, T.oleadas)} />
      <Texto x={540} y={640} size={42} color={C.white} op={aparece(t, T.colon)}>
        el colon se contrae
      </Texto>
      <Texto x={540} y={1500} size={38} color={C.yellow} op={aparece(t, T.oleadas)}>
        en oleadas, para hacer espacio
      </Texto>
    </Lienzo>
  );
};

// F. El normal lo hace con más fuerza, pero el descafeinado también
export const Decaf: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.normal, T.todos], [1, 1.04])}>
        <Taza x={300} y={900} s={0.9} t={t} />
        <Taza x={780} y={900} s={0.9} t={t} etiqueta="descaf." />
        {[
          [300, 1, T.normal],
          [780, 0.65, T.descafeinado2],
        ].map(([x, v, tt]) => (
          <g key={x} opacity={aparece(t, tt)}>
            <rect x={x - 50} y={1350 - 280 * v} width={100} height={280 * v} rx={14} fill={C.yellow} />
          </g>
        ))}
        <line x1={160} y1={1350} x2={920} y2={1350} stroke={C.grey} strokeWidth={3} />
        <Texto x={540} y={1410} size={30} color={C.grey}>
          fuerza del reflejo
        </Texto>
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.descafeinado2)}>
          el descafeinado también lo activa
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.descafeinado2} color={C.white} />
    </>
  );
};

// G. No a todos: en estudios, cerca de 3 de cada 10 personas
export const Personas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.todos, T.porEso], [1, 1.04])}>
      {new Array(10).fill(0).map((_, k) => {
        const on = k < 3 && aparece(t, T.estudios) > 0.5;
        const x = 200 + (k % 5) * 170;
        const y = 920 + Math.floor(k / 5) * 260;
        return (
          <g key={k} opacity={aparece(t, T.todos + k * 0.06)}>
            <circle cx={x} cy={y - 60} r={34} fill={on ? C.yellow : C.grey} />
            <rect x={x - 36} y={y - 20} width={72} height={110} rx={30} fill={on ? C.yellow : C.grey} />
          </g>
        );
      })}
      <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.todos)}>
        no a todos les pasa
      </Texto>
      <Texto x={540} y={1480} size={46} color={C.yellow} op={aparece(t, T.estudios)}>
        ~3 de cada 10
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
