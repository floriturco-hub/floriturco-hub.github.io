import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/pieseis/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sentado: 1.58, // sentado
  reloj: 4.00, // reloj
  mano: 5.52, // mano
  seis: 6.80, // 6
  solo: 9.22, // solo
  final: 10.18, // final
  vencerlo: 11.20, // vencerlo
  contra: 13.80, // contra
  controla: 16.46, // controla
  izquierdo: 18.98, // izquierdo
  sincronizar: 20.74, // sincronizar
  opuestas: 24.76, // opuestas
  mezclan: 27.18, // mezclan
  habil: 28.80, // habil
  copiando: 29.74, // copiando
  truco: 31.56, // truco
  izquierda: 32.82, // izquierda
  despacio: 36.54, // despacio
  porEso: 37.42, // por
  fin: 38.58, // FIN
};

const PIEL = "#E8B48A";

// Flecha circular: sentido 1 = del reloj, -1 = contra el reloj
const Giro: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly sentido: number; readonly t: number; readonly color: string; readonly op?: number }> = ({ x, y, r, sentido, t, color, op = 1 }) => {
  const a0 = t * 4 * sentido;
  const a1 = a0 + 4.6 * sentido;
  const p = (a: number) => [x + Math.cos(a) * r, y + Math.sin(a) * r];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const tang = a1 + (Math.PI / 2) * sentido;
  return (
    <g opacity={op}>
      <path d={`M ${x0} ${y0} A ${r} ${r} 0 1 ${sentido > 0 ? 1 : 0} ${x1} ${y1}`} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path
        d={`M ${x1 + Math.cos(tang) * 26} ${y1 + Math.sin(tang) * 26} L ${x1 + Math.cos(tang + 2.4) * 22} ${y1 + Math.sin(tang + 2.4) * 22} L ${x1 + Math.cos(tang - 2.4) * 22} ${y1 + Math.sin(tang - 2.4) * 22} Z`}
        fill={color}
      />
    </g>
  );
};

// Pie visto de lado cuya punta dibuja un círculo (sentido)
const Pie: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly sentido: number }> = ({ x, y, t, sentido }) => {
  const a = t * 4 * sentido;
  return (
    <g>
      <rect x={x - 40} y={y - 300} width={80} height={250} rx={36} fill={PIEL} opacity={0.85} />
      <g transform={`translate(${x} ${y - 60}) rotate(${12 * Math.sin(a)})`}>
        <path d={`M -40 0 L -40 50 Q 0 ${80 + 8 * Math.cos(a)} 150 70 Q 175 55 150 25 L 40 0 Z`} fill={PIEL} />
      </g>
    </g>
  );
};

// Mano con lápiz que dibuja un 6 (camino) hasta u
const Seis: React.FC<{ readonly x: number; readonly y: number; readonly u: number; readonly color?: string }> = ({ x, y, u, color = C.yellow }) => {
  // 6: trazo de arriba hacia abajo y lazo contra el reloj
  const pts: [number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const s = i / 40;
    if (s < 0.45) {
      const v = s / 0.45;
      pts.push([x + 60 - 110 * v + 30 * Math.sin(v * 2), y - 180 + 230 * v]);
    } else {
      const v = (s - 0.45) / 0.55;
      const a = Math.PI + v * Math.PI * 2;
      pts.push([x + 10 + Math.cos(a) * 70 * -1 * -1, y + 120 - Math.sin(a) * 70]);
    }
  }
  const n = Math.max(2, Math.floor(41 * u));
  const d = pts.slice(0, n).map(([px, py], i) => `${i ? "L" : "M"} ${px} ${py}`).join(" ");
  const [hx, hy] = pts[n - 1];
  return (
    <g>
      <path d={d} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" />
      <g transform={`translate(${hx} ${hy})`}>
        <rect x={-6} y={-90} width={12} height={90} fill="#D8C080" transform="rotate(25)" />
        <ellipse cx={36} cy={-70} rx={50} ry={36} fill={PIEL} />
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Pie x={380} y={1450} t={t} sentido={1} />
    <Giro x={480} y={1400} r={70} sentido={1} t={t} color={C.cyan} />
    <Seis x={680} y={850} u={(t * 0.5) % 1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué tu pie se rebela?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sentado], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Gira el pie con el reloj; dibuja un seis con la mano: el pie cambia solo + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cambia = aparece(t, T.solo);
  const sentido = cambia > 0.5 ? -1 : 1;
  return (
    <Lienzo zoom={interpolate(t, [T.sentado, T.contra], [1, 1.04])}>
      <Pie x={380} y={1450} t={t} sentido={sentido} />
      <Giro x={480} y={1400} r={70} sentido={sentido} t={t} color={cambia > 0.5 ? C.yellow : C.cyan} op={aparece(t, T.reloj)} />
      <Texto x={480} y={1560} size={32} color={C.cyan} op={aparece(t, T.reloj) * (1 - cambia)}>
        pie: con el reloj
      </Texto>
      <Texto x={480} y={1560} size={32} color={C.yellow} op={cambia}>
        ¡cambió solo!
      </Texto>
      <g opacity={aparece(t, T.mano)}>
        <Seis x={680} y={850} u={interpolate(t, [T.seis, T.solo + 0.4], [0, 1], clamp)} />
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo vencerlo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.contra], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Dibujar un seis es girar en contra del reloj
export const Contra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.contra, T.controla], [1, 1.04])}>
      <Giro x={300} y={1000} r={140} sentido={1} t={t} color={C.cyan} />
      <Texto x={300} y={1230} size={34} color={C.cyan}>
        pie: con el reloj
      </Texto>
      <Giro x={780} y={1000} r={140} sentido={-1} t={t} color={C.yellow} op={aparece(t, T.contra)} />
      <Texto x={780} y={1000} size={120} color={C.yellow} op={aparece(t, T.contra)}>
        6
      </Texto>
      <Texto x={780} y={1230} size={34} color={C.yellow} op={aparece(t, T.contra)}>
        6: contra el reloj
      </Texto>
    </Lienzo>
  );
};

// Cerebro visto desde arriba (dos hemisferios)
const Cerebro: React.FC<{ readonly izq: number; readonly der: number }> = ({ izq, der }) => (
  <g>
    <path d="M 530 640 Q 330 640 330 820 Q 330 1000 530 1000 Z" fill={C.cyan} opacity={0.15 + 0.6 * izq} stroke={C.white} strokeWidth={4} />
    <path d="M 550 640 Q 750 640 750 820 Q 750 1000 550 1000 Z" fill={C.yellow} opacity={0.15 + 0.6 * der} stroke={C.white} strokeWidth={4} />
    <Texto x={430} y={830} size={28} color={C.white}>
      izq.
    </Texto>
    <Texto x={650} y={830} size={28} color={C.white}>
      der.
    </Texto>
  </g>
);

// D. Tu mano y tu pie derechos los controla sobre todo el lado izquierdo del cerebro
export const Lado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const iz = aparece(t, T.izquierdo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.controla, T.sincronizar], [1, 1.04])}>
        <Cerebro izq={iz} der={0} />
        <g opacity={iz}>
          <path d="M 430 1000 Q 600 1150 780 1180" stroke={C.cyan} strokeWidth={6} fill="none" strokeDasharray="14 10" strokeDashoffset={-t * 60} />
          <path d="M 430 1000 Q 620 1300 780 1420" stroke={C.cyan} strokeWidth={6} fill="none" strokeDasharray="14 10" strokeDashoffset={-t * 60} />
        </g>
        <Texto x={820} y={1200} size={34} color={C.white} op={aparece(t, T.controla)}>
          mano derecha
        </Texto>
        <Texto x={820} y={1440} size={34} color={C.white} op={aparece(t, T.controla)}>
          pie derecho
        </Texto>
        <Texto x={540} y={1490} size={36} color={C.cyan} op={iz}>
          los controla el lado izquierdo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.izquierdo} color={C.cyan} />
    </>
  );
};

// E. El cerebro tiende a sincronizar; las órdenes se mezclan y el pie copia a la mano
export const Sincronia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const copia = aparece(t, T.copiando);
  const mezcla = aparece(t, T.mezclan) * (1 - copia);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sincronizar, T.truco], [1, 1.04])}>
        <Cerebro izq={0.6 + 0.3 * Math.sin(t * 10) * mezcla} der={0} />
        <Giro x={300} y={1250} r={110} sentido={copia > 0.5 ? -1 : 1} t={t} color={copia > 0.5 ? C.yellow : C.cyan} />
        <Texto x={300} y={1430} size={32} color={C.white}>
          pie
        </Texto>
        <Giro x={780} y={1250} r={110} sentido={-1} t={t} color={C.yellow} />
        <Texto x={780} y={1430} size={32} color={C.white}>
          mano
        </Texto>
        <Texto x={540} y={1110} size={34} color={C.white} op={aparece(t, T.opuestas) * (1 - copia)}>
          ¿direcciones opuestas? difícil
        </Texto>
        <Texto x={540} y={1490} size={38} color={C.yellow} op={copia}>
          el pie copia el giro de la mano
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.copiando} color={C.yellow} />
    </>
  );
};

// F. El truco: usa la mano izquierda (la controla el otro lado) o practícalo despacio
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const iz = aparece(t, T.izquierda);
  return (
    <Lienzo zoom={interpolate(t, [T.truco, T.porEso], [1, 1.04])}>
      <Cerebro izq={0.6} der={0.6 * iz} />
      <Giro x={300} y={1250} r={110} sentido={1} t={t} color={C.cyan} />
      <Texto x={300} y={1430} size={32} color={C.white}>
        pie derecho
      </Texto>
      <g opacity={iz}>
        <Giro x={780} y={1250} r={110} sentido={-1} t={t} color={C.yellow} />
        <Texto x={780} y={1430} size={32} color={C.white}>
          mano izquierda
        </Texto>
      </g>
      <Texto x={540} y={1480} size={40} color="#5AD08A" op={iz}>
        ¡ahora sí se puede!
      </Texto>
      <Texto x={540} y={1540} size={32} color={C.white} op={aparece(t, T.despacio)}>
        o practícalo muy despacio
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
