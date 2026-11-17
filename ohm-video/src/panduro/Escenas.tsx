import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/panduro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  hecho: 2.48, // hecho
  suave: 2.92, // suave
  duro: 4.58, // duro
  final: 6.80, // final
  almidon: 9.68, // almidon
  horno: 11.74, // horno
  hinchan: 13.10, // hinchan
  desordenan: 13.86, // desordenan
  enfriarse: 16.32, // enfriarse
  cristales: 19.20, // cristales
  atrapan: 20.38, // atrapan
  retrogradacion: 21.86, // retrogradacion
  perdio: 23.94, // perdio
  presa: 25.24, // presa
  refrigerador: 27.22, // refrigerador
  rapido: 30.08, // rapido
  congelador: 31.02, // congelador
  detienen: 32.20, // detienen
  revivirlo: 33.14, // revivirlo
  calor: 34.92, // calor
  ablanda: 36.54, // ablanda
  porEso: 37.78, // por
  fin: 39.26, // FIN
};

const CORTEZA = "#C8843A";
const MIGA = "#F4E2B8";
const AGUA = "#5AB8F0";

// Pan; duro 0..1 cambia la miga a más gris y compacta
const Pan: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly duro?: number; readonly vapor?: number; readonly t?: number }> = ({ x, y, s = 1, duro = 0, vapor = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -320 60 Q -330 -150 -120 -170 Q 0 -200 120 -170 Q 330 -150 320 60 Z" fill={CORTEZA} />
    <path d="M -290 60 Q -290 -120 -110 -140 Q 0 -165 110 -140 Q 290 -120 290 60 Z" fill={duro > 0.5 ? "#D8C8A0" : MIGA} />
    {new Array(14).fill(0).map((_, k) => (
      <ellipse key={k} cx={-220 + ((k * 97) % 440)} cy={-90 + ((k * 53) % 130)} rx={14 * (1 - duro * 0.6)} ry={9 * (1 - duro * 0.6)} fill="#E0C890" />
    ))}
    <rect x={-330} y={58} width={660} height={16} rx={8} fill="#8A5A2A" />
    {vapor > 0
      ? [0, 1, 2].map((k) => (
          <path key={k} d={`M ${-80 + k * 80} ${-200 - ((t * 60 + k * 25) % 60)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#E8E8EE" strokeWidth={8} fill="none" opacity={vapor * 0.7} />
        ))
      : null}
  </g>
);

// Cadenas de almidón: orden 0 = desordenadas (hinchadas), 1 = cristal ordenado; con gotas de agua
const Almidon: React.FC<{ readonly t: number; readonly orden: number; readonly agua: number; readonly atrapada?: number }> = ({ t, orden, agua, atrapada = 0 }) => (
  <g>
    {new Array(8).fill(0).map((_, k) => {
      const y0 = 760 + k * 70;
      const pts = new Array(14).fill(0).map((__, i) => {
        const x = 200 + i * 52;
        const caos = (1 - orden) * 50 * Math.sin(i * 1.3 + k * 2.1 + t * 0.8);
        return `${i ? "L" : "M"} ${x} ${y0 + caos}`;
      });
      return <path key={k} d={pts.join(" ")} stroke={C.yellow} strokeWidth={8} fill="none" opacity={0.9} />;
    })}
    {new Array(16).fill(0).map((_, k) => {
      const libre = 1 - atrapada;
      const x = 220 + ((k * 137) % 640) + libre * 20 * Math.sin(t * 2 + k);
      const y = atrapada ? 795 + (k % 7) * 70 : 780 + ((k * 89) % 480) + libre * 15 * Math.cos(t * 2 + k);
      return <circle key={k} cx={x} cy={y} r={12} fill={AGUA} opacity={agua} />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Pan x={540} y={1050} s={1.2} duro={1} />
    <Texto x={540} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    {void t}
  </>
);

// A. Gancho: ¿por qué este pan se endureció?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.hecho], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Recién hecho es suave; a los dos días está duro aunque no se haya secado + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const duro = aparece(t, T.duro);
  return (
    <Lienzo zoom={interpolate(t, [T.hecho, T.almidon], [1, 1.04])}>
      <Pan x={540} y={1050} s={1.2} duro={duro} vapor={1 - duro} t={t} />
      <Texto x={540} y={1300} size={40} color={MIGA} op={aparece(t, T.suave) * (1 - duro)}>
        hoy: suave
      </Texto>
      <Texto x={540} y={1300} size={40} color={C.grey} op={duro}>
        2 días después: ¡duro!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo revivirlo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.almidon], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El almidón: en el horno absorbe agua, se hincha y se desordena; eso lo hace suave
export const Horno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.almidon, T.enfriarse], [1, 1.04])}>
      <Almidon t={t} orden={1 - aparece(t, T.desordenan)} agua={aparece(t, T.horno)} />
      <Texto x={540} y={600} size={42} color={C.yellow} op={aparece(t, T.almidon)}>
        almidón: cadenas largas
      </Texto>
      <Texto x={540} y={1400} size={38} color={AGUA} op={aparece(t, T.hinchan)}>
        absorben agua y se hinchan
      </Texto>
      <Texto x={540} y={1470} size={38} color={MIGA} op={aparece(t, T.desordenan)}>
        desordenadas = suave
      </Texto>
    </Lienzo>
  );
};

// D. Al enfriarse se reacomodan en cristales que atrapan el agua: retrogradación
export const Cristales: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const orden = interpolate(t, [T.enfriarse, T.atrapan + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.enfriarse, T.refrigerador], [1, 1.04])}>
        <Almidon t={t} orden={orden} agua={1} atrapada={aparece(t, T.atrapan)} />
        <Texto x={540} y={600} size={40} color={C.cyan} op={aparece(t, T.cristales)}>
          se ordenan en cristales
        </Texto>
        <Texto x={540} y={1400} size={46} color={C.yellow} op={aparece(t, T.retrogradacion)}>
          retrogradación
        </Texto>
        <Texto x={540} y={1470} size={36} color={AGUA} op={aparece(t, T.presa)}>
          el agua sigue ahí, presa
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.retrogradacion} color={C.yellow} />
    </>
  );
};

// E. En el refrigerador se forman hasta 3 veces más rápido; en el congelador casi se detienen
export const Frio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const barra = (y: number, v: number, col: string, op: number, lab: string) => (
    <g opacity={op}>
      <Texto x={220} y={y + 34} size={32} color={col}>
        {lab}
      </Texto>
      <rect x={380} y={y} width={560} height={50} rx={14} fill="#2A2440" />
      <rect x={380} y={y} width={560 * v} height={50} rx={14} fill={col} />
    </g>
  );
  return (
    <Lienzo zoom={interpolate(t, [T.refrigerador, T.revivirlo], [1, 1.04])}>
      <Texto x={540} y={640} size={38} color={C.white}>
        velocidad de endurecimiento
      </Texto>
      {barra(800, 0.3, MIGA, 1, "mesa")}
      {barra(920, 0.9 * aparece(t, T.rapido), C.cyan, aparece(t, T.refrigerador), "refri")}
      {barra(1040, 0.03, "#C8E8FF", aparece(t, T.congelador), "congelador")}
      <Texto x={540} y={1240} size={44} color={C.cyan} op={aparece(t, T.rapido)}>
        refri: ¡hasta 3 veces más rápido!
      </Texto>
      <Texto x={540} y={1320} size={38} color="#C8E8FF" op={aparece(t, T.detienen)}>
        congelador: casi se detiene
      </Texto>
    </Lienzo>
  );
};

// F. Para revivirlo, caliéntalo: el calor derrite los cristales y se ablanda por un rato
export const Revivir: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cal = interpolate(t, [T.calor, T.ablanda + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.revivirlo, T.porEso], [1, 1.04])}>
        <rect x={160} y={720} width={760} height={560} rx={30} fill="#3A3A44" />
        <rect x={200} y={760} width={680} height={420} rx={14} fill="#1A1A22" />
        {[0, 1].map((k) => (
          <rect key={k} x={220} y={k ? 1150 : 780} width={640} height={12} rx={6} fill={C.orange} opacity={aparece(t, T.calor) * (0.6 + 0.4 * Math.sin(t * 6))} />
        ))}
        <Pan x={540} y={1060} s={0.85} duro={1 - cal} vapor={cal} t={t} />
        <Texto x={540} y={620} size={40} color={C.orange} op={aparece(t, T.revivirlo)}>
          caliéntalo
        </Texto>
        <Texto x={540} y={1380} size={40} color={MIGA} op={aparece(t, T.ablanda)}>
          los cristales se derriten: suave otra vez
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.calor} color={C.orange} />
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
