import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/vuelta/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  nuevo: 2.54, // nuevo
  eterno: 3.98, // eterno
  vuelta: 5.16, // vuelta
  volando: 7.10, // volando
  final: 8.20, // final
  llama: 10.86, // llama
  efecto: 11.10, // efecto
  creia: 13.30, // creia
  ida: 14.56, // ida
  detalles: 17.08, // detalles
  experimentos: 18.20, // experimentos
  expectativas: 20.52, // expectativas
  pronto: 23.00, // pronto
  dura: 24.10, // dura
  largo: 26.22, // largo
  vuelta2: 27.24, // vuelta
  mismo: 30.38, // mismo
  corto: 31.64, // corto
  mide: 33.00, // mide
  compara: 34.18, // compara
  porEso: 35.78, // por
  fin: 37.60, // FIN
};

const Carro: React.FC<{ readonly x: number; readonly y: number; readonly dir?: number; readonly col?: string }> = ({ x, y, dir = 1, col = C.cyan }) => (
  <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
    <path d="M -70 0 L -70 -30 L -40 -60 L 30 -60 L 60 -30 L 80 -30 L 80 0 Z" fill={col} />
    <circle cx={-40} cy={4} r={18} fill="#111" />
    <circle cx={50} cy={4} r={18} fill="#111" />
  </g>
);

const Reloj: React.FC<{ readonly x: number; readonly y: number; readonly ang: number; readonly col?: string }> = ({ x, y, ang, col = C.white }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={0} r={60} fill="none" stroke={col} strokeWidth={8} />
    <line x1={0} y1={0} x2={40 * Math.sin(ang)} y2={-40 * Math.cos(ang)} stroke={col} strokeWidth={8} strokeLinecap="round" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <rect x={0} y={1000} width={1080} height={120} fill="#3A3A44" />
    <line x1={0} y1={1060} x2={1080} y2={1060} stroke="#fff" strokeWidth={6} strokeDasharray="40 30" strokeDashoffset={t * 200} />
    <Carro x={540} y={1040} dir={-1} />
    <Reloj x={540} y={780} ang={t * 6} />
    <Texto x={540} y={1400} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué la vuelta parece más corta?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.nuevo], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. A un lugar nuevo el camino es eterno; la vuelta se pasa volando + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ida = interpolate(t, [T.nuevo, T.vuelta], [0, 1], clamp);
  const vu = interpolate(t, [T.vuelta, T.volando + 0.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.nuevo, T.llama], [1, 1.04])}>
      <rect x={100} y={800} width={880} height={80} rx={20} fill="#3A3A44" />
      <rect x={100} y={1150} width={880} height={80} rx={20} fill="#3A3A44" />
      <Texto x={160} y={770} size={34} color={C.white}>
        ida →
      </Texto>
      <Carro x={160 + ida * 740} y={855} />
      <Reloj x={880} y={680} ang={ida * 12} col={C.red} />
      <Texto x={540} y={960} size={38} color={C.red} op={aparece(t, T.eterno)}>
        eterno
      </Texto>
      <g opacity={aparece(t, T.vuelta)}>
        <Texto x={920} y={1120} size={34} color={C.white}>
          ← vuelta
        </Texto>
        <Carro x={900 - vu * 740} y={1205} dir={-1} col="#5AD08A" />
        <Texto x={540} y={1310} size={38} color="#5AD08A" op={aparece(t, T.volando)}>
          ¡volando!
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          lo que realmente lo causa: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.llama], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Efecto del viaje de vuelta; la idea vieja: a la ida todo es nuevo y registras más detalles
export const Nombre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tacha = aparece(t, T.experimentos);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llama, T.expectativas], [1, 1.04])}>
        <Texto x={540} y={560} size={46} color={C.yellow} op={aparece(t, T.efecto) * (1 - aparece(t, T.creia))}>
          efecto del viaje de vuelta
        </Texto>
        <g opacity={aparece(t, T.creia)}>
          <Texto x={540} y={560} size={36} color={C.grey}>
            se creía que…
          </Texto>
          {new Array(9).fill(0).map((_, k) => (
            <circle key={k} cx={300 + (k % 3) * 240} cy={800 + Math.floor(k / 3) * 180} r={50} fill={[C.cyan, C.orange, C.purpleLight][k % 3]} opacity={aparece(t, T.ida + k * 0.12)} />
          ))}
          <Texto x={540} y={1400} size={38} color={C.white} op={aparece(t, T.detalles)}>
            ida: más detalles nuevos
          </Texto>
          <line x1={150} y1={1390} x2={150 + 780 * tacha} y2={1370} stroke={C.red} strokeWidth={10} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.efecto} color={C.yellow} />
    </>
  );
};

// Barras de esperado vs real
const Barras: React.FC<{ readonly esperado: number; readonly real: number; readonly opR: number; readonly col: string }> = ({ esperado, real, opR, col }) => (
  <g>
    <Texto x={250} y={860} size={32} color={C.grey}>
      esperabas
    </Texto>
    <rect x={420} y={820} width={500 * esperado} height={60} rx={14} fill={C.grey} />
    <g opacity={opR}>
      <Texto x={250} y={1000} size={32} color={col}>
        duró
      </Texto>
      <rect x={420} y={960} width={500 * real} height={60} rx={14} fill={col} />
    </g>
  </g>
);

// D. Los experimentos apuntan a las expectativas; a la ida esperas llegar pronto y dura más: se siente largo
export const Ida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.expectativas, T.vuelta2], [1, 1.04])}>
        <Texto x={540} y={600} size={52} color={C.yellow} op={aparece(t, T.expectativas)}>
          expectativas
        </Texto>
        <g opacity={aparece(t, T.pronto)}>
          <Texto x={540} y={740} size={36} color={C.white}>
            ida
          </Texto>
          <Barras esperado={0.45} real={interpolate(t, [T.dura, T.dura + 0.8], [0.45, 0.8], clamp)} opR={aparece(t, T.dura)} col={C.red} />
        </g>
        <Texto x={540} y={1200} size={46} color={C.red} op={aparece(t, T.largo)}>
          se siente largo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.expectativas} color={C.yellow} />
    </>
  );
};

// E. A la vuelta esperas un viaje largo; dura lo mismo: parece más corto
export const Vuelta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.vuelta2, T.mide], [1, 1.04])}>
      <Texto x={540} y={740} size={36} color={C.white}>
        vuelta
      </Texto>
      <Barras esperado={0.95} real={0.8} opR={aparece(t, T.mismo)} col="#5AD08A" />
      <Texto x={540} y={1200} size={46} color="#5AD08A" op={aparece(t, T.corto)}>
        se siente corto
      </Texto>
    </Lienzo>
  );
};

// F. Tu cerebro no mide el tiempo: lo compara con lo que esperaba
export const Compara: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const inc = aparece(t, T.compara) * 8 * Math.sin(t * 2);
  return (
    <Lienzo zoom={interpolate(t, [T.mide, T.porEso], [1, 1.04])}>
      <g opacity={aparece(t, T.mide) * (1 - aparece(t, T.compara))}>
        <Reloj x={540} y={900} ang={t * 3} col={C.grey} />
        <line x1={460} y1={820} x2={620} y2={980} stroke={C.red} strokeWidth={12} />
        <Texto x={540} y={1100} size={40} color={C.grey}>
          no mide el tiempo
        </Texto>
      </g>
      <g opacity={aparece(t, T.compara)} transform={`rotate(${inc} 540 900)`}>
        <line x1={240} y1={900} x2={840} y2={900} stroke={C.yellow} strokeWidth={10} />
        <path d="M 540 900 L 500 1000 L 580 1000 Z" fill={C.yellow} />
        <rect x={200} y={820} width={120} height={80} rx={10} fill={C.grey} />
        <rect x={760} y={820} width={120} height={80} rx={10} fill={C.cyan} />
        <Texto x={260} y={790} size={30} color={C.grey}>
          esperado
        </Texto>
        <Texto x={820} y={790} size={30} color={C.cyan}>
          real
        </Texto>
      </g>
      <Texto x={540} y={1200} size={42} color={C.yellow} op={aparece(t, T.compara)}>
        lo compara con lo que esperaba
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
