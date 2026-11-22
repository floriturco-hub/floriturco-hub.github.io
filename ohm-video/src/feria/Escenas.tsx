import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/feria/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  feria: 2.44, // feria
  botellas: 3.84, // botellas
  encestar: 4.40, // encestar
  nadie: 5.68, // nadie
  final: 6.96, // final
  botellas2: 9.76, // botellas
  liviana: 11.22, // liviana
  pesadas: 12.76, // pesadas
  impulso: 14.94, // impulso
  aros: 17.42, // aros
  cuello: 19.56, // cuello
  perfecto: 21.30, // perfecto
  rebota: 23.26, // rebota
  baloncesto: 24.38, // baloncesto
  ovalado: 26.66, // ovalado
  inflada: 27.92, // inflada
  entrar: 30.06, // entrar
  mala: 31.06, // mala
  fisica: 32.02, // fisica
  porEso: 32.88, // por
  fin: 34.74, // FIN
};

const Botella: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly col?: string; readonly rot?: number }> = ({ x, y, s = 1, col = "#E8E8EE", rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -30 0 L -30 -90 Q -30 -110 -12 -120 L -12 -160 L 12 -160 L 12 -120 Q 30 -110 30 -90 L 30 0 Z" fill={col} />
    <rect x={-30} y={-70} width={60} height={30} fill={C.red} />
  </g>
);

const Piramide: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly caida?: number; readonly pesadas?: number }> = ({ x, y, s = 1, caida = 0, pesadas = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={0} width={300} height={20} fill="#8A6A4A" />
    {[-70, 0, 70].map((dx) => (
      <Botella key={dx} x={dx} y={0} col={pesadas ? "#8A8A96" : "#E8E8EE"} />
    ))}
    {[-35, 35].map((dx) => (
      <Botella key={dx} x={dx + caida * (dx > 0 ? 120 : 60)} y={-160 + caida * 140} rot={caida * (dx > 0 ? 80 : -60)} />
    ))}
    <Botella x={caida * 40} y={-320 + caida * 300} rot={caida * 100} />
  </g>
);

const Peluche: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-50} cy={-120} r={30} fill="#C8885A" />
    <circle cx={50} cy={-120} r={30} fill="#C8885A" />
    <circle cx={0} cy={-80} r={80} fill="#D8986A" />
    <ellipse cx={0} cy={60} rx={90} ry={100} fill="#D8986A" />
    <circle cx={-25} cy={-90} r={8} fill="#222" />
    <circle cx={25} cy={-90} r={8} fill="#222" />
    <ellipse cx={0} cy={-60} rx={20} ry={14} fill="#8A5A3A" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <path d="M 90 620 L 990 620 L 940 520 L 140 520 Z" fill={C.red} />
    {[0, 1, 2, 3, 4, 5].map((k) => (
      <path key={k} d={`M ${140 + k * 133} 520 L ${206 + k * 133} 520 L ${190 + k * 133} 620 L ${156 + k * 133} 620 Z`} fill="#fff" opacity={0.8} />
    ))}
    <Peluche x={250} y={900} s={0.9} />
    <Piramide x={680} y={1160} s={1.1} />
    <Texto x={540} y={1420} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    {void t}
  </>
);

// A. Gancho: ¿por qué casi nadie gana este juego?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.feria], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// Aro de baloncesto visto de frente: ancho relativo
const Aro: React.FC<{ readonly x: number; readonly y: number; readonly ancho: number }> = ({ x, y, ancho }) => (
  <g>
    <rect x={x - 150} y={y - 220} width={300} height={200} rx={10} fill="#E8E8EE" />
    <ellipse cx={x} cy={y} rx={ancho / 2} ry={16} fill="none" stroke={C.orange} strokeWidth={10} />
    <path d={`M ${x - ancho / 2} ${y} L ${x - ancho / 3} ${y + 100} L ${x + ancho / 3} ${y + 100} L ${x + ancho / 2} ${y}`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
  </g>
);

// B. Parece fácil tumbar botellas o encestar, pero casi nadie gana + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.feria, T.botellas2], [1, 1.04])}>
      <g opacity={aparece(t, T.feria - 0.3)}>
        <Piramide x={290} y={1100} s={0.8} />
      </g>
      <g opacity={aparece(t, T.feria)}>
        <Aro x={790} y={920} ancho={190} />
        <circle cx={790} cy={1120 + 30 * Math.sin(t * 4)} r={60} fill={C.orange} />
      </g>
      <Texto x={540} y={1360} size={46} color={C.red} op={aparece(t, T.nadie)}>
        casi nadie gana
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el truco del aro de baloncesto: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.botellas2], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Botellas: pelota liviana y botellas de abajo pesadas; no tiene impulso para tumbarlas todas
export const Botellas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lanz = interpolate(t, [T.impulso - 0.6, T.impulso], [0, 1], clamp);
  const caida = interpolate(t, [T.impulso, T.impulso + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.botellas2, T.aros], [1, 1.04])}>
        <Piramide x={680} y={1150} s={1.1} caida={caida} pesadas={aparece(t, T.pesadas)} />
        <circle cx={150 + lanz * 480} cy={820 - Math.sin(lanz * Math.PI) * 60} r={40} fill="#E8E8EE" opacity={1 - caida * 0.5} />
        <Texto x={200} y={720} size={36} color={C.white} op={aparece(t, T.liviana)}>
          pelota liviana
        </Texto>
        <Texto x={680} y={1260} size={36} color="#B8B8C4" op={aparece(t, T.pesadas)}>
          abajo: más pesadas
        </Texto>
        <Texto x={540} y={1400} size={40} color={C.red} op={aparece(t, T.impulso + 0.6)}>
          no alcanza el impulso
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.impulso} color={C.white} />
    </>
  );
};

// D. Aros: apenas más anchos que el cuello; si tocan el vidrio, rebotan
export const Aros: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.perfecto, T.rebota], [0, 1], clamp);
  const reb = interpolate(t, [T.rebota, T.rebota + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.aros, T.baloncesto], [1.3, 1.36])} cy={950}>
      <Botella x={540} y={1250} s={2.4} />
      <g transform={`translate(${540 + reb * 220} ${620 + u * 210 - Math.sin(reb * Math.PI) * 160}) rotate(${reb * 200})`}>
        <ellipse cx={0} cy={0} rx={38} ry={12} fill="none" stroke={C.yellow} strokeWidth={8} />
      </g>
      <g opacity={aparece(t, T.cuello)}>
        <line x1={500} y1={820} x2={580} y2={820} stroke={C.cyan} strokeWidth={4} />
        <Texto x={680} y={800} size={28} color={C.cyan}>
          cuello
        </Texto>
      </g>
      <Texto x={540} y={1360} size={34} color={C.yellow} op={aparece(t, T.rebota)}>
        ¡toca el vidrio y rebota!
      </Texto>
    </Lienzo>
  );
};

// E. Baloncesto: aro más pequeño y ovalado, pelota inflada de más que rebota
export const Baloncesto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tiro = interpolate(t, [T.inflada, T.entrar], [0, 1], clamp);
  const reb = interpolate(t, [T.entrar, T.entrar + 0.7], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.baloncesto, T.mala], [1, 1.04])}>
        <Aro x={540} y={900} ancho={interpolate(t, [T.ovalado - 0.6, T.ovalado], [260, 160], clamp)} />
        <circle cx={540 - 200 * (1 - tiro) + reb * 250} cy={1300 - 410 * Math.sin(tiro * Math.PI * 0.5) - Math.sin(reb * Math.PI) * 200 + reb * 300} r={70} fill={C.orange} stroke="#8A3A1A" strokeWidth={4} />
        <Texto x={540} y={600} size={36} color={C.white} op={aparece(t, T.ovalado)}>
          aro más pequeño y ovalado
        </Texto>
        <Texto x={540} y={1460} size={38} color={C.orange} op={aparece(t, T.inflada)}>
          pelota inflada de más → rebota
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.entrar} color={C.orange} />
    </>
  );
};

// F. No es mala suerte: es física
export const Fisica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.mala, T.porEso], [1, 1.06])}>
      <Texto x={540} y={860} size={56} color={C.grey} op={aparece(t, T.mala)}>
        no es mala suerte
      </Texto>
      <Texto x={540} y={1000} size={80} color={C.yellow} op={aparece(t, T.fisica)}>
        es física
      </Texto>
    </Lienzo>
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
