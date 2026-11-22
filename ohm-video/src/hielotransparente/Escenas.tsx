import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/hielotransparente/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  blancos: 2.44, // blancos
  bares: 4.10, // bares
  final: 5.80, // final
  casa: 7.22, // casa
  aire: 8.60, // aire
  congelador: 10.94, // congelador
  lados: 13.14, // lados
  afuera: 14.32, // afuera
  empuja: 16.30, // empuja
  burbujitas: 19.16, // burbujitas
  blanco: 21.70, // blanco
  maquinas: 22.60, // m
  direccion: 25.14, // direcci
  escapar: 28.82, // escapar
  hielera: 31.48, // hielera
  turbia: 34.40, // turbia
  porEso: 35.56, // por
  fin: 37.02, // FIN
};

const HIELO = "#DDEEF8";

// Cubo de hielo; turbio 0..1 = nube blanca en el centro; frente 0..1 = congelado desde afuera
const Cubo: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly turbio: number; readonly frente?: number; readonly burbujas?: number }> = ({ x, y, s = 1, turbio, frente = 1, burbujas = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-160} width={320} height={320} rx={40} fill="#3A8AD8" opacity={0.25} />
    <rect x={-160 + 160 * (1 - frente)} y={-160 + 160 * (1 - frente)} width={320 * frente} height={320 * frente} rx={40} fill="none" />
    {/* hielo formado (marco que crece hacia adentro) */}
    <path
      fillRule="evenodd"
      d={`M -160 -160 L 160 -160 L 160 160 L -160 160 Z M ${-160 + 160 * frente} ${-160 + 160 * frente} L ${160 - 160 * frente} ${-160 + 160 * frente} L ${160 - 160 * frente} ${160 - 160 * frente} L ${-160 + 160 * frente} ${160 - 160 * frente} Z`}
      fill={HIELO}
      opacity={0.85}
    />
    <ellipse cx={0} cy={0} rx={90} ry={90} fill="#FFFFFF" opacity={0.75 * turbio} />
    {burbujas > 0
      ? new Array(16).fill(0).map((_, k) => <circle key={k} cx={Math.cos(k * 2.4) * (20 + (k % 5) * 14)} cy={Math.sin(k * 2.4) * (20 + (k % 5) * 14)} r={6 + (k % 3) * 3} fill="#FFFFFF" stroke="#B8C8D8" strokeWidth={2} opacity={burbujas} />)
      : null}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cubo x={540} y={1000} s={1.4} turbio={1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    {void t}
  </>
);

// A. Gancho: ¿por qué este hielo es turbio?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.blancos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Los tuyos salen blancos por el centro; en los bares, transparentes + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.blancos, T.aire], [1, 1.04])}>
      <Cubo x={300} y={1000} s={0.9} turbio={1} />
      <Texto x={300} y={1230} size={32} color={C.white} op={aparece(t, T.blancos)}>
        tu congelador
      </Texto>
      <g opacity={aparece(t, T.bares)}>
        <Cubo x={780} y={1000} s={0.9} turbio={0} />
        <Texto x={780} y={1230} size={32} color={C.cyan}>
          bar: transparente
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo hacerlos en casa?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.aire], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El agua tiene aire disuelto; el cubo se congela de afuera hacia adentro y empuja el aire al centro
export const Congela: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fr = interpolate(t, [T.lados, T.burbujitas], [0.05, 0.85], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aire, T.maquinas], [1, 1.04])}>
        <Cubo x={540} y={1000} s={1.3} turbio={aparece(t, T.blanco)} frente={fr} burbujas={aparece(t, T.burbujitas)} />
        {new Array(10).fill(0).map((_, k) => {
          const a = k * 0.63;
          const r = 200 * (1 - fr) + 30;
          return <circle key={k} cx={540 + Math.cos(a) * r} cy={1000 + Math.sin(a) * r} r={8} fill="#FFFFFF" opacity={aparece(t, T.aire) * (1 - aparece(t, T.burbujitas))} />;
        })}
        <Texto x={540} y={640} size={36} color={C.white} op={aparece(t, T.aire)}>
          el agua tiene aire disuelto
        </Texto>
        <Texto x={540} y={1330} size={34} color={C.cyan} op={aparece(t, T.afuera)}>
          se congela de afuera hacia adentro
        </Texto>
        <Texto x={540} y={1410} size={36} color={C.yellow} op={aparece(t, T.empuja)}>
          el aire queda atrapado en el centro
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.burbujitas} color={C.white} />
    </>
  );
};

// D. Las máquinas congelan en una sola dirección y despacio: las burbujas escapan
export const Direccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nivel = interpolate(t, [T.direccion, T.hielera], [0.1, 0.9], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.maquinas, T.hielera], [1, 1.04])}>
      <rect x={340} y={760} width={400} height={520} rx={20} fill="#3A8AD8" opacity={0.25} stroke="#8AC8FF" strokeWidth={6} />
      <rect x={340} y={1280 - 520 * nivel} width={400} height={520 * nivel} rx={20} fill={HIELO} opacity={0.85} />
      {new Array(6).fill(0).map((_, k) => {
        const u = (t * 0.6 + k / 6) % 1;
        return <circle key={k} cx={400 + k * 55} cy={1280 - 520 * nivel - u * (520 * (1 - nivel))} r={8} fill="#FFFFFF" opacity={aparece(t, T.escapar) * (1 - u)} />;
      })}
      <path d="M 800 1240 L 800 820 M 780 840 L 800 810 L 820 840" stroke={C.cyan} strokeWidth={6} fill="none" opacity={aparece(t, T.direccion)} />
      <Texto x={540} y={640} size={36} color={C.white} op={aparece(t, T.maquinas)}>
        máquinas de hielo claro
      </Texto>
      <Texto x={540} y={1380} size={34} color={C.cyan} op={aparece(t, T.direccion)}>
        una sola dirección, despacio
      </Texto>
      <Texto x={540} y={1450} size={36} color={C.yellow} op={aparece(t, T.escapar)}>
        las burbujas escapan
      </Texto>
    </Lienzo>
  );
};

// E. En casa: hielera sin tapa en el congelador; corta la parte turbia de abajo
export const Casa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = aparece(t, T.turbia);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.hielera, T.porEso], [1, 1.04])}>
        <rect x={260} y={760} width={560} height={480} rx={30} fill="#E8A040" opacity={0.25} stroke="#E8A040" strokeWidth={8} />
        <rect x={290} y={790} width={500} height={330} fill={HIELO} opacity={0.9} />
        <rect x={290} y={1120 + 40 * corte} width={500} height={90} fill="#FFFFFF" opacity={0.8} />
        <line x1={270} y1={1115 + 20 * corte} x2={810} y2={1115 + 20 * corte} stroke={C.yellow} strokeWidth={6} strokeDasharray="16 10" opacity={corte} />
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.hielera)}>
          hielera sin tapa en el congelador
        </Texto>
        <Texto x={540} y={1360} size={38} color={C.yellow} op={corte}>
          corta la parte turbia de abajo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.turbia} color={C.yellow} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
