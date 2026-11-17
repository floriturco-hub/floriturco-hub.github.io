import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/estroboscopio/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  video: 2.74, // video
  ruedas: 3.44, // ruedas
  atras: 5.68, // atras
  quietas: 6.88, // quietas
  final: 7.86, // final
  camara: 10.50, // camara
  fotos: 12.84, // fotos
  treinta: 13.66, // treinta
  si: 15.06, // si
  completa: 17.62, // completa
  quieta: 20.50, // quieta
  si2: 21.24, // si
  poquito: 21.84, // poquito
  atras2: 25.18, // atras
  reves: 26.64, // reves
  muchas: 27.46, // muchas
  golpe: 29.68, // golpe
  linea: 30.72, // linea
  abajo: 32.28, // abajo
  mientras: 33.18, // mientras
  doblada: 35.64, // doblada
  porEso: 36.40, // por
  fin: 38.62, // FIN
};

// Rueda con rayos y uno rojo; ang en grados
const Rueda: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly ang: number }> = ({ x, y, r, ang }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <circle cx={0} cy={0} r={r} fill="#222" stroke="#5A5478" strokeWidth={r * 0.12} />
    {new Array(6).fill(0).map((_, k) => (
      <line key={k} x1={0} y1={0} x2={0} y2={-r * 0.85} stroke={k === 0 ? C.red : "#B8B8C8"} strokeWidth={r * 0.07} transform={`rotate(${k * 60})`} />
    ))}
    <circle cx={0} cy={0} r={r * 0.15} fill="#8C88A8" />
  </g>
);

// Hélice de 3 palas; curva = doblez por obturador
const Helice: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly ang: number; readonly curva?: number }> = ({ x, y, r, ang, curva = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        transform={`rotate(${k * 120})`}
        d={`M -16 0 Q ${curva * r * 0.6} ${-r * 0.5} ${curva * r * 0.9} ${-r} L ${curva * r * 0.9 + 30} ${-r} Q ${curva * r * 0.6 + 34} ${-r * 0.5} 16 0 Z`}
        fill="#C8C4D8"
      />
    ))}
    <circle cx={0} cy={0} r={30} fill="#5A5478" />
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Helice x={540} y={940} r={320} ang={-t * 20} />
    <Texto x={540} y={540} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta hélice parece girar al revés?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.video], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.white} />
    </>
  );
};

// B. En video, ruedas y hélices parecen girar hacia atrás o quedarse quietas + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const quieta = t > T.quietas;
  return (
    <Lienzo zoom={interpolate(t, [T.video, T.camara], [1, 1.04])}>
      <rect x={140} y={560} width={800} height={600} rx={30} fill="#141030" stroke={C.grey} strokeWidth={6} />
      <circle cx={880} cy={610} r={14} fill={C.red} opacity={Math.sin(t * 6) > 0 ? 1 : 0.3} />
      <Rueda x={540} y={860} r={220} ang={quieta ? 0 : -(t - T.video) * 40} />
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.atras) * (1 - aparece(t, T.quietas))}>
        ¿hacia atrás?
      </Texto>
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.quietas)}>
        ¿quieta?
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.camara], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué las hélices se doblan
        </Texto>
      </g>
    </Lienzo>
  );
};

// Tira de fotogramas: angulos de la rueda en cada foto
const Tira: React.FC<{ readonly angs: number[]; readonly op: number; readonly y?: number }> = ({ angs, op, y = 1120 }) => (
  <g opacity={op}>
    <rect x={80} y={y - 110} width={920} height={220} fill="#1A1A22" />
    {angs.map((a, k) => (
      <g key={k}>
        <rect x={100 + k * 180} y={y - 90} width={160} height={180} fill="#2A2640" />
        <Rueda x={180 + k * 180} y={y} r={66} ang={a} />
      </g>
    ))}
  </g>
);

// C. La cámara toma fotos, unas 30 por segundo
export const Fotos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.camara, T.si], [1, 1.04])}>
      <g transform="translate(540 700)" opacity={aparece(t, T.camara)}>
        <rect x={-180} y={-110} width={360} height={220} rx={30} fill="#3A3650" />
        <circle cx={0} cy={0} r={80} fill="#141030" stroke="#8C88A8" strokeWidth={12} />
        <rect x={-120} y={-150} width={100} height={50} rx={10} fill="#3A3650" />
      </g>
      <Tira angs={[0, 30, 60, 90, 120]} op={aparece(t, T.fotos)} />
      <Texto x={540} y={1340} size={44} color={C.yellow} op={aparece(t, T.treinta)}>
        30 fotos por segundo
      </Texto>
    </Lienzo>
  );
};

// D. Si da justo una vuelta entre fotos, aparece igual: parece quieta
export const Quieta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.si2], [1, 1.04])}>
        <Rueda x={540} y={720} r={200} ang={(t - T.si) * 1080} />
        <Texto x={540} y={470} size={34} color={C.grey}>
          real: una vuelta por foto
        </Texto>
        <Tira angs={[0, 0, 0, 0, 0]} op={aparece(t, T.completa)} />
        <Texto x={540} y={1340} size={44} color={C.yellow} op={aparece(t, T.quieta)}>
          en video: quieta
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.quieta} color={C.yellow} />
    </>
  );
};

// E. Un poquito menos de una vuelta: cada foto la muestra más atrás, parece girar al revés
export const Reves: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const visto = -Math.floor((t - T.si2) * 6) * 12;
  return (
    <Lienzo zoom={interpolate(t, [T.si2, T.muchas], [1, 1.04])}>
      <Rueda x={300} y={720} r={140} ang={(t - T.si2) * 1000} />
      <Texto x={300} y={520} size={30} color={C.grey}>
        real
      </Texto>
      <Rueda x={780} y={720} r={140} ang={visto} />
      <Texto x={780} y={520} size={30} color={C.yellow}>
        en video
      </Texto>
      <Tira angs={[0, -12, -24, -36, -48]} op={aparece(t, T.poquito)} />
      <Texto x={540} y={1340} size={44} color={C.yellow} op={aparece(t, T.reves)}>
        ¡parece girar al revés!
      </Texto>
    </Lienzo>
  );
};

// F. Las cámaras de celular leen línea por línea; la hélice sigue girando y sale doblada
export const Lineas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const scan = interpolate(t, [T.linea, T.abajo + 0.6], [560, 1200], clamp);
  const curva = aparece(t, T.doblada) * 0.8;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.muchas, T.porEso], [1, 1.04])}>
        <rect x={140} y={560} width={800} height={640} rx={20} fill="#141030" stroke={C.grey} strokeWidth={6} />
        <clipPath id="vista">
          <rect x={140} y={560} width={800} height={scan - 560} />
        </clipPath>
        <g clipPath="url(#vista)">
          <Helice x={540} y={880} r={300} ang={20} curva={curva} />
        </g>
        <line x1={140} y1={scan} x2={940} y2={scan} stroke={C.red} strokeWidth={6} opacity={aparece(t, T.linea) * (1 - aparece(t, T.doblada))} />
        <Texto x={540} y={1300} size={38} color={C.white} op={aparece(t, T.linea) * (1 - aparece(t, T.doblada))}>
          línea por línea
        </Texto>
        <Texto x={540} y={1300} size={44} color={C.yellow} op={aparece(t, T.doblada)}>
          ¡sale doblada!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.doblada} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
