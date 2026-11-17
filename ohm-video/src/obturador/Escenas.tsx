import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/obturador/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tomas: 1.56, // tomas
  suena: 2.56, // suena
  piezas: 4.78, // piezas
  final: 6.30, // final
  antigua: 9.58, // antigua
  cortinilla: 10.46, // cortinilla
  luz: 13.02, // luz
  electronico: 16.42, // electronico
  pixeles: 18.26, // pixeles
  contar: 19.94, // contar
  fila: 21.74, // fila
  milesimas: 22.98, // milesimas
  silencio: 25.18, // silencio
  grabacion: 26.96, // grabacion
  reproduce: 28.34, // reproduce
  vieja: 29.86, // vieja
  japon: 32.48, // japon
  corea: 32.94, // corea
  escondidas: 35.70, // escondidas
  ahi: 36.70, // ahi
  fin: 37.72, // FIN
};

const Celular: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly flash?: number }> = ({ x, y, s = 1, flash = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-320} width={340} height={640} rx={40} fill="#1A1A22" stroke="#5A5A66" strokeWidth={8} />
    <rect x={-150} y={-290} width={300} height={580} rx={24} fill="#2A3A5A" />
    <path d="M -150 120 L -60 0 L 20 80 L 80 20 L 150 100 L 150 290 L -150 290 Z" fill="#3A6A4A" />
    <circle cx={80} cy={-180} r={36} fill={C.yellow} opacity={0.8} />
    <circle cx={0} cy={240} r={40} fill="#fff" stroke="#8A8A96" strokeWidth={6} />
    <rect x={-150} y={-290} width={300} height={580} rx={24} fill="#fff" opacity={flash} />
  </g>
);

const Onda: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) => (
  <g opacity={op}>
    {[0, 1, 2].map((k) => {
      const u = (t * 2 + k / 3) % 1;
      const r = 40 + u * 120;
      return <path key={k} d={`M ${x + r * 0.7} ${y - r * 0.7} A ${r} ${r} 0 0 1 ${x + r * 0.7} ${y + r * 0.7}`} stroke={C.yellow} strokeWidth={8} fill="none" opacity={1 - u} />;
    })}
  </g>
);

// Cámara antigua con cortinilla (abierta 0..1)
const CamaraVieja: React.FC<{ readonly x: number; readonly y: number; readonly abierta: number }> = ({ x, y, abierta }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-260} y={-160} width={520} height={320} rx={30} fill="#3A3A44" />
    <rect x={-120} y={-220} width={240} height={70} rx={14} fill="#3A3A44" />
    <circle cx={0} cy={0} r={130} fill="#1A1A22" stroke="#8A8A96" strokeWidth={10} />
    <rect x={-90} y={-90} width={180} height={180} fill="#F8F0C8" />
    <rect x={-90} y={-90} width={180} height={180 * (1 - abierta)} fill="#5A5A66" />
    <rect x={-90} y={-90 + 180 * (1 - abierta)} width={180} height={6} fill="#8A8A96" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Celular x={480} y={1000} flash={Math.max(0, Math.sin(t * 3)) ** 8} />
    <Onda x={700} y={760} t={t} op={1} />
    <Texto x={540} y={1420} size={60} color={C.yellow}>
      ¡clic!
    </Texto>
    <Texto x={850} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿de dónde sale este clic?
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

// B. Tomas una foto, suena un clic, pero el celular no tiene piezas que se muevan + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tomas, T.antigua], [1, 1.04])}>
      <Celular x={540} y={1000} flash={t > T.suena && t < T.suena + 0.2 ? 1 : 0} />
      <Onda x={760} y={760} t={t} op={aparece(t, T.suena)} />
      <Texto x={540} y={1430} size={40} color={C.white} op={aparece(t, T.piezas)}>
        sin piezas que se muevan
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿dónde no se puede apagar?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.antigua], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. En una cámara antigua, una cortinilla se abría y cerraba: ese era el clic
export const Antigua: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciclo = (t * 1.2) % 1;
  const ab = aparece(t, T.cortinilla) * (ciclo < 0.3 ? ciclo / 0.3 : ciclo < 0.5 ? 1 : Math.max(0, 1 - (ciclo - 0.5) / 0.3));
  return (
    <Lienzo zoom={interpolate(t, [T.antigua, T.electronico], [1, 1.04])}>
      <CamaraVieja x={540} y={950} abierta={ab} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.antigua)}>
        cámara antigua
      </Texto>
      <Texto x={540} y={1260} size={38} color={C.grey} op={aparece(t, T.cortinilla)}>
        una cortinilla se abre y se cierra
      </Texto>
      <Texto x={540} y={1340} size={46} color={C.yellow} op={aparece(t, T.luz) * (ab > 0.6 ? 1 : 0.3)}>
        ¡clac!
      </Texto>
    </Lienzo>
  );
};

// D. Obturador electrónico: los píxeles cuentan luz y un chip los lee fila por fila, en silencio
export const Electronico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fila = Math.floor(((t * 3) % 1) * 12);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.electronico, T.grabacion], [1, 1.04])}>
        <rect x={190} y={700} width={700} height={560} rx={16} fill="#1A1A22" />
        {new Array(12 * 16).fill(0).map((_, k) => {
          const i = Math.floor(k / 16);
          const j = k % 16;
          const leida = aparece(t, T.fila) > 0 && i === fila;
          return <rect key={k} x={210 + j * 42} y={720 + i * 44} width={36} height={38} fill={leida ? C.yellow : ["#4A2A2A", "#2A4A2A", "#2A2A4A"][(i + j) % 3]} opacity={aparece(t, T.pixeles) * (0.5 + 0.5 * aparece(t, T.contar))} />;
        })}
        <Texto x={540} y={620} size={40} color={C.cyan} op={aparece(t, T.electronico)}>
          obturador electrónico
        </Texto>
        <Texto x={540} y={1340} size={36} color={C.yellow} op={aparece(t, T.fila)}>
          se lee fila por fila
        </Texto>
        <Texto x={540} y={1410} size={34} color={C.white} op={aparece(t, T.milesimas)}>
          en milésimas de segundo
        </Texto>
        <Texto x={540} y={1490} size={40} color={C.grey} op={aparece(t, T.silencio)}>
          en silencio
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.electronico} color={C.cyan} />
    </>
  );
};

// E. El clic es una grabación de una cámara vieja, para que sepas que la foto se tomó
export const Grabacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.grabacion, T.japon], [1, 1.04])}>
      <Celular x={380} y={1000} s={0.8} />
      <g opacity={aparece(t, T.grabacion)}>
        <rect x={600} y={820} width={360} height={140} rx={20} fill="#2A2440" stroke={C.yellow} strokeWidth={4} />
        <Texto x={780} y={880} size={30} color={C.yellow}>
          clic_camara.mp3
        </Texto>
        <path
          d={`M 620 930 ${new Array(32)
            .fill(0)
            .map((_, i) => `L ${620 + i * 10} ${930 + (i > 10 && i < 18 ? 22 * Math.sin(i * 2 + t * 20) : 2)}`)
            .join(" ")}`}
          stroke={C.yellow}
          strokeWidth={4}
          fill="none"
        />
      </g>
      <Onda x={560} y={800} t={t} op={aparece(t, T.reproduce)} />
      <Texto x={540} y={600} size={42} color={C.yellow} op={aparece(t, T.grabacion)}>
        el clic es una grabación
      </Texto>
      <Texto x={540} y={1430} size={36} color={C.white} op={aparece(t, T.vieja)}>
        el sonido de una cámara vieja
      </Texto>
    </Lienzo>
  );
};

// F. En Japón y Corea del Sur no se puede apagar, para evitar fotos a escondidas
export const Paises: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.japon, T.ahi], [1, 1.04])}>
        <g opacity={aparece(t, T.japon)}>
          <rect x={160} y={760} width={340} height={230} fill="#fff" />
          <circle cx={330} cy={875} r={70} fill="#C8102E" />
          <Texto x={330} y={1060} size={38} color={C.white}>
            Japón
          </Texto>
        </g>
        <g opacity={aparece(t, T.corea)}>
          <rect x={580} y={760} width={340} height={230} fill="#fff" />
          <circle cx={750} cy={875} r={60} fill="#C8102E" />
          <path d="M 690 875 A 60 60 0 0 0 810 875 A 30 30 0 0 1 750 875 A 30 30 0 0 0 690 875 Z" fill="#0047A0" />
          <Texto x={750} y={1060} size={38} color={C.white}>
            Corea del Sur
          </Texto>
        </g>
        <Texto x={540} y={1200} size={42} color={C.yellow} op={aparece(t, T.japon)}>
          el clic no se puede apagar
        </Texto>
        <Texto x={540} y={1290} size={36} color={C.white} op={aparece(t, T.escondidas)}>
          para evitar fotos a escondidas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.japon} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ahi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
