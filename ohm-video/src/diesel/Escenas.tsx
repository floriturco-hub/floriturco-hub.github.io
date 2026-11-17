import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/diesel/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  gasolina: 2.12, // gasolina
  bujias: 2.88, // bujias
  diesel: 5.20, // diesel
  final: 6.40, // final
  truco: 9.56, // truco
  piston: 11.58, // piston
  aprieta: 11.94, // aprieta
  volumen: 14.16, // volumen
  comprimir: 15.10, // comprimir
  calienta: 16.18, // calienta
  grados: 18.60, // grados
  inyector: 20.66, // inyector
  gotas: 22.10, // gotas
  enciende: 23.54, // enciende
  gasolina2: 25.92, // gasolina
  explotaria: 28.14, // explotaria
  frio: 30.20, // frio
  precalentamiento: 33.34, // precalentamiento
  arrancar: 35.38, // arrancar
  asi: 36.12, // asi
  fin: 37.64, // FIN
};

// Cilindro con pistón; pos 0 = abajo, 1 = arriba; calor 0..1 colorea el aire; llama 0..1
const Cilindro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly pos: number;
  readonly calor?: number;
  readonly llama?: number;
  readonly bujia?: number;
  readonly inyector?: number;
  readonly glow?: number;
  readonly s?: number;
  readonly t?: number;
}> = ({ x, y, pos, calor = 0, llama = 0, bujia = 0, inyector = 0, glow = 0, s = 1, t = 0 }) => {
  const top = y - 400;
  const py = y - 40 - pos * 300;
  const r = Math.round(40 + calor * 200);
  const g = Math.round(60 + calor * 80);
  const b = Math.round(120 - calor * 100);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <rect x={x - 170} y={top - 20} width={340} height={480} rx={10} fill="#5A5A66" />
      <rect x={x - 140} y={top} width={280} height={440} fill="#1A1A22" />
      <rect x={x - 140} y={top} width={280} height={py - top} fill={`rgb(${r},${g},${b})`} opacity={0.8} />
      {llama > 0 ? <ellipse cx={x} cy={(top + py) / 2} rx={120 * llama} ry={Math.max(10, (py - top) / 2.2) * llama} fill={C.orange} opacity={0.9} /> : null}
      <rect x={x - 140} y={py} width={280} height={90} rx={8} fill="#B8B8C4" />
      <rect x={x - 25} y={py + 90} width={50} height={200} fill="#8A8A96" />
      {bujia > 0 ? (
        <g>
          <rect x={x - 18} y={top - 90} width={36} height={80} fill="#E8E8EE" />
          <path d={`M ${x - 20} ${top + 10} L ${x + 5} ${top + 30} L ${x - 10} ${top + 40} L ${x + 20} ${top + 60}`} stroke={C.yellow} strokeWidth={6} fill="none" opacity={bujia * (Math.sin(t * 20) > 0 ? 1 : 0.3)} />
        </g>
      ) : null}
      {inyector > 0 ? (
        <g>
          <rect x={x + 50} y={top - 100} width={30} height={100} fill="#8A8A96" />
          {new Array(16).fill(0).map((_, k) => (
            <circle key={k} cx={x + 65 + (k % 4) * 14 * (k % 2 ? 1 : -1) * inyector} cy={top + 10 + Math.floor(k / 4) * 16 * inyector} r={4} fill={C.yellow} opacity={inyector} />
          ))}
        </g>
      ) : null}
      {glow > 0 ? (
        <g>
          <rect x={x - 90} y={top - 80} width={24} height={70} fill="#8A8A96" />
          <rect x={x - 86} y={top} width={16} height={50} rx={6} fill={C.orange} opacity={glow} />
          <circle cx={x - 78} cy={top + 30} r={34} fill={C.orange} opacity={glow * 0.3} />
        </g>
      ) : null}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cilindro x={540} y={1300} pos={0.9} calor={1} llama={0.8 + 0.2 * Math.sin(t * 10)} t={t} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo explota sin chispa?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.gasolina], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Gasolina usa bujías; el diésel no + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gasolina, T.truco], [1, 1.04])}>
      <g opacity={aparece(t, T.gasolina)}>
        <Cilindro x={290} y={1250} pos={0.85} bujia={aparece(t, T.bujias)} t={t} s={0.75} />
        <Texto x={290} y={1360} size={34} color={C.white}>
          gasolina: bujía ⚡
        </Texto>
      </g>
      <g opacity={aparece(t, T.diesel)}>
        <Cilindro x={790} y={1250} pos={0.85} t={t} s={0.75} />
        <Texto x={790} y={1360} size={34} color={C.yellow}>
          diésel: sin bujía
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y sus bujías de precalentamiento?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.truco], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El truco es la compresión: el pistón aprieta el aire hasta 20 veces menos volumen; el gas se calienta a +500 °C
export const Compresion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pos = interpolate(t, [T.aprieta, T.volumen + 0.4], [0, 0.93], clamp);
  const calor = interpolate(t, [T.calienta - 0.3, T.grados], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.truco, T.inyector], [1, 1.04])}>
        <Cilindro x={420} y={1350} pos={pos} calor={calor} t={t} />
        <Texto x={540} y={560} size={46} color={C.yellow} op={aparece(t, T.truco)}>
          compresión
        </Texto>
        <Texto x={820} y={800} size={50} color={C.cyan} op={aparece(t, T.volumen)}>
          ÷20
        </Texto>
        <g opacity={aparece(t, T.comprimir)}>
          <rect x={780} y={900} width={60} height={400} rx={30} fill="#2A2440" />
          <rect x={780} y={1300 - 400 * calor} width={60} height={400 * calor} rx={30} fill={C.orange} />
          <Texto x={810} y={1380} size={40} color={C.orange}>
            {Math.round(30 + 500 * calor) + " °C"}
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.grados} color={C.orange} />
    </>
  );
};

// D. El inyector rocía el diésel en gotas finísimas y se enciende solo con el aire caliente
export const Inyeccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const llama = interpolate(t, [T.enciende, T.enciende + 0.3], [0, 1], clamp);
  const baja = interpolate(t, [T.enciende + 0.2, T.gasolina2], [0.93, 0.2], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.inyector, T.gasolina2], [1, 1.04])}>
        <Cilindro x={540} y={1350} pos={baja} calor={1} llama={llama} inyector={aparece(t, T.inyector) * (1 - llama)} t={t} />
        <Texto x={760} y={800} size={36} color={C.yellow} op={aparece(t, T.gotas) * (1 - llama)}>
          gotas finísimas
        </Texto>
        <Texto x={540} y={560} size={48} color={C.orange} op={llama}>
          ¡se enciende sola!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.enciende} color={C.orange} />
    </>
  );
};

// E. La gasolina no aguantaría tanta compresión: explotaría antes de tiempo
export const Gasolina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pos = interpolate(t, [T.gasolina2, T.explotaria], [0, 0.6], clamp);
  const boom = t > T.explotaria;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.gasolina2, T.frio], [1, 1.04])}>
        <Cilindro x={540} y={1350} pos={pos} calor={boom ? 1 : 0.4} llama={boom ? 1 : 0} t={t} />
        <Texto x={540} y={560} size={40} color={C.white} op={aparece(t, T.gasolina2)}>
          con gasolina…
        </Texto>
        <Texto x={540} y={630} size={44} color={C.red} op={aparece(t, T.explotaria)}>
          ¡explota antes de tiempo!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.explotaria} color={C.red} />
    </>
  );
};

// F. En frío el aire no se calienta lo suficiente: las bujías de precalentamiento calientan la cámara
export const Frio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const glow = aparece(t, T.precalentamiento) * (0.7 + 0.3 * Math.sin(t * 4));
  return (
    <Lienzo zoom={interpolate(t, [T.frio, T.asi], [1, 1.04])}>
      <Cilindro x={540} y={1350} pos={0.93} calor={0.2 + 0.6 * aparece(t, T.precalentamiento)} glow={glow} t={t} />
      <g opacity={aparece(t, T.frio)} transform="translate(860 650)">
        {[0, 60, 120].map((a) => (
          <line key={a} x1={-60} y1={0} x2={60} y2={0} stroke="#C8E8FF" strokeWidth={10} transform={`rotate(${a})`} />
        ))}
      </g>
      <Texto x={540} y={560} size={38} color="#C8E8FF" op={aparece(t, T.frio)}>
        motor frío
      </Texto>
      <Texto x={320} y={760} size={32} color={C.orange} op={aparece(t, T.precalentamiento)}>
        bujía de precalentamiento
      </Texto>
      <Texto x={540} y={1450} size={40} color={C.white} op={aparece(t, T.arrancar)}>
        calienta la cámara para arrancar
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
