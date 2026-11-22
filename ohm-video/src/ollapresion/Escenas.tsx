import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/ollapresion/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  viejas: 2.96, // viejas
  explotaban: 3.84, // explotaban
  seguros: 6.12, // seguros
  final: 7.04, // final
  importante: 8.04, // importante
  cerrar: 9.28, // cerrar
  presion: 11.78, // presi
  hierve: 14.04, // hierve
  rapido: 18.00, // rapido
  valvula: 19.02, // valvula
  limite: 23.24, // limite
  segunda: 24.88, // segunda
  sola: 25.98, // sola
  hule: 28.34, // hule
  ventana: 29.40, // ventana
  tapa: 32.64, // tapa
  traba: 33.08, // traba
  adentro: 35.38, // adentro
  porEso: 36.02, // por
  fin: 37.88, // FIN
};

const ACERO = "#A8AEBC";
const VAPOR = "#E8E6F0";

const Vapor: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) =>
  op > 0 ? (
    <g>
      {[0, 1, 2, 3].map((k) => {
        const u = (t * 0.9 + k / 4) % 1;
        return <circle key={k} cx={x + 20 * Math.sin(t * 3 + k)} cy={y - u * 220} r={18 + 30 * u} fill={VAPOR} opacity={op * 0.6 * (1 - u)} />;
      })}
    </g>
  ) : null;

// Olla: válvula 1 arriba, válvula 2 al lado, ventana del empaque, traba de la tapa
const Olla: React.FC<{ readonly t: number; readonly v1?: number; readonly v2?: number; readonly emp?: number; readonly traba?: number; readonly marca?: number; readonly presion?: number }> = ({
  t,
  v1 = 0,
  v2 = 0,
  emp = 0,
  traba = 0,
  marca = 0,
  presion = 0,
}) => (
  <g>
    <rect x={220} y={940} width={640} height={440} rx={40} fill={ACERO} />
    <rect x={240} y={980} width={600} height={380} rx={30} fill="#3A3E4A" opacity={0.25 + 0.4 * presion} />
    <rect x={160} y={1060} width={60} height={40} rx={12} fill="#2A2A2A" />
    <rect x={860} y={1060} width={60} height={40} rx={12} fill="#2A2A2A" />
    {/* tapa */}
    <path d="M 200 950 Q 540 820 880 950 L 880 970 L 200 970 Z" fill="#C8CCD8" />
    <rect x={880} y={920} width={200} height={40} rx={16} fill="#2A2A2A" />
    {/* empaque */}
    <rect x={200} y={962} width={680} height={14} fill="#3A3A3A" />
    {/* válvula 1 */}
    <rect x={515} y={830 - 20 * v1} width={50} height={60} rx={10} fill={marca === 1 ? C.yellow : "#5A5E6A"} />
    <Vapor x={540} y={800} t={t} op={v1} />
    {/* válvula 2 */}
    <rect x={330} y={870 - 14 * v2} width={36} height={36} rx={8} fill={marca === 2 ? C.yellow : "#5A5E6A"} />
    <Vapor x={348} y={850} t={t} op={v2} />
    {/* ventana del empaque */}
    <rect x={720} y={880} width={50} height={30} rx={6} fill={marca === 3 ? C.yellow : "#2A2A2A"} />
    {emp > 0 ? <path d={`M 745 880 q 10 -${30 * emp} 0 -${50 * emp}`} stroke="#5A3A3A" strokeWidth={10} fill="none" /> : null}
    <Vapor x={745} y={850} t={t} op={emp} />
    {/* traba */}
    <rect x={620} y={900} width={60} height={40} rx={10} fill={marca === 4 ? C.yellow : "#E05050"} transform={`translate(0 ${-20 * traba})`} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Olla t={t} v1={0.6 + 0.4 * Math.sin(t * 2)} presion={0.6} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta olla ya no explota?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.viejas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Las viejas a veces explotaban; las modernas tienen varios seguros + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ex = aparece(t, T.explotaban);
  const mod = aparece(t, T.seguros);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.viejas, T.cerrar], [1, 1.04])}>
        <g opacity={1 - mod}>
          <rect x={300} y={1000} width={480} height={360} rx={30} fill="#6A6058" />
          <path d={`M 280 ${1000 - 160 * ex} Q 540 ${880 - 200 * ex} 800 ${1000 - 160 * ex} L 800 ${1020 - 160 * ex} L 280 ${1020 - 160 * ex} Z`} fill="#8A8078" transform={`rotate(${-15 * ex} 540 900)`} />
          {ex > 0
            ? new Array(8).fill(0).map((_, k) => (
                <line key={k} x1={540} y1={980} x2={540 + Math.cos(k * 0.8) * 360 * ex} y2={980 + Math.sin(k * 0.8) * 200 * ex - 80} stroke={C.orange} strokeWidth={6} opacity={ex} />
              ))
            : null}
          <Texto x={540} y={1450} size={36} color={C.orange} op={ex}>
            las viejas a veces explotaban
          </Texto>
        </g>
        <g opacity={mod}>
          <Olla t={t} />
          <Texto x={540} y={1460} size={38} color="#5AD08A">
            las modernas: varios seguros
          </Texto>
        </g>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            el más importante: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.cerrar], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.explotaban} color={C.orange} />
    </>
  );
};

// C. Al cerrarla, el vapor no escapa y la presión sube; el agua hierve a ~120 °C y cocina más rápido
export const Presion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.presion, T.hierve], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cerrar, T.valvula], [1, 1.04])}>
      <Olla t={t} presion={p} />
      {new Array(8).fill(0).map((_, k) => {
        const u = (t * 0.7 + k / 8) % 1;
        return <circle key={k} cx={300 + ((k * 73) % 480)} cy={1340 - u * 340} r={10 + 6 * p} fill={VAPOR} opacity={0.5 * p} />;
      })}
      <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.presion)}>
        el vapor no escapa: la presión sube
      </Texto>
      <Texto x={540} y={1460} size={40} color={C.yellow} op={aparece(t, T.hierve)}>
        hierve a ~120 °C, no a 100 °C
      </Texto>
      <Texto x={540} y={1530} size={32} color={C.white} op={aparece(t, T.rapido)}>
        se cocina más rápido
      </Texto>
    </Lienzo>
  );
};

// D. Válvula de arriba: primer seguro; si se tapa, una segunda se abre sola; si falla, el empaque se deforma por una ventana
export const Seguros: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v1 = aparece(t, T.limite) * (1 - aparece(t, T.segunda));
  const v2 = aparece(t, T.sola) * (1 - aparece(t, T.hule));
  const emp = aparece(t, T.ventana);
  const marca = t >= T.hule ? 3 : t >= T.segunda ? 2 : 1;
  const n = marca;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.valvula, T.tapa], [1, 1.04])}>
        <Olla t={t} v1={v1} v2={v2} emp={emp} marca={marca} presion={0.7} />
        <Texto x={540} y={600} size={44} color={C.yellow}>
          {`seguro ${n}`}
        </Texto>
        <Texto x={540} y={1460} size={34} color={C.white} op={aparece(t, T.valvula) * (1 - aparece(t, T.segunda))}>
          la válvula suelta vapor al límite
        </Texto>
        <Texto x={540} y={1460} size={34} color={C.white} op={aparece(t, T.segunda) * (1 - aparece(t, T.hule))}>
          si se tapa, otra se abre sola
        </Texto>
        <Texto x={540} y={1460} size={34} color={C.white} op={aparece(t, T.hule)}>
          el empaque sale por una ventana
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.segunda} color={C.yellow} />
    </>
  );
};

// E. El más importante: la tapa se traba y no se abre mientras hay presión
export const Traba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tr = aparece(t, T.traba);
  const intento = tr > 0 ? Math.max(0, Math.sin(t * 6)) * 8 : 0;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tapa, T.porEso], [1, 1.04])}>
        <g transform={`rotate(${intento} 540 950)`}>
          <Olla t={t} traba={tr} marca={4} presion={0.8} />
        </g>
        <Texto x={540} y={600} size={44} color={C.yellow} op={aparece(t, T.tapa)}>
          seguro 4: la tapa se traba
        </Texto>
        <Texto x={540} y={1460} size={34} color={C.white} op={aparece(t, T.adentro)}>
          no abre mientras haya presión
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.traba} color="#E05050" />
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
