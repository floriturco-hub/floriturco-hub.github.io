import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/termopar/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  corriente: 2.10, // corriente
  apaga: 2.86, // apaga
  corta: 6.10, // corta
  final: 7.24, // final
  junto: 10.48, // junto
  termopar: 12.96, // termopar
  metales: 14.38, // metales
  calienta: 17.58, // calienta
  voltaje: 18.76, // voltaje
  alimenta: 21.74, // alimenta
  electroiman: 22.64, // electroiman
  valvula: 24.44, // valvula
  enfria: 27.32, // enfria
  desaparece: 28.62, // desaparece
  resorte: 29.68, // resorte
  sostienes: 32.92, // sostienes
  segundos: 33.94, // segundos
  asi: 36.46, // asi
  fin: 37.90, // FIN
};

const GAS = "#5A8AE8";

// Quemador con llama (llama 0..1) y termopar al lado (calor 0..1)
const Quemador: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly llama: number; readonly calor: number; readonly s?: number; readonly viento?: number }> = ({
  x,
  y,
  t,
  llama,
  calor,
  s = 1,
  viento = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={0} width={520} height={50} rx={10} fill="#3A3A44" />
    <ellipse cx={0} cy={0} rx={200} ry={40} fill="#5A5A66" />
    <ellipse cx={0} cy={-10} rx={170} ry={30} fill="#2A2A34" />
    {llama > 0
      ? new Array(10).fill(0).map((_, k) => {
          const dx = -150 + k * 33;
          const h = (60 + 20 * Math.sin(t * 12 + k)) * llama;
          return <path key={k} d={`M ${dx - 14} -12 Q ${dx + viento * 30} ${-12 - h} ${dx + viento * 50} ${-12 - h * 1.3} Q ${dx + 14} ${-12 - h * 0.5} ${dx + 14} -12 Z`} fill={k % 2 ? "#4A8AF0" : "#6AA8FF"} opacity={0.9} />;
        })
      : null}
    <line x1={210} y1={40} x2={170} y2={-60} stroke="#B8B8C4" strokeWidth={14} strokeLinecap="round" />
    <circle cx={168} cy={-64} r={14} fill={calor > 0.3 ? `rgb(255, ${Math.round(200 - calor * 120)}, 60)` : "#B8B8C4"} opacity={0.4 + 0.6 * Math.max(calor, 0.4)} />
  </g>
);

const Viento: React.FC<{ readonly t: number; readonly op: number }> = ({ t, op }) => (
  <g opacity={op}>
    {[0, 1, 2, 3].map((k) => {
      const u = (t * 1.5 + k / 4) % 1;
      return <path key={k} d={`M ${-100 + u * 900} ${820 + k * 40} q 60 -30 120 0 t 120 0`} stroke="#C8E0F0" strokeWidth={6} fill="none" opacity={1 - u} />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Quemador x={540} y={1100} t={t} llama={0} calor={0} s={1.3} />
    <Viento t={t} op={1} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe que se apagó la llama?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.corriente], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. El viento apaga la llama y el gas se corta solo + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const llama = 1 - interpolate(t, [T.apaga, T.apaga + 0.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.corriente, T.junto], [1, 1.04])}>
      <Quemador x={540} y={1100} t={t} llama={llama} calor={llama} s={1.3} viento={aparece(t, T.corriente)} />
      <Viento t={t} op={aparece(t, T.corriente) * (1 - aparece(t, T.corta))} />
      <Texto x={540} y={1360} size={44} color="#5AD08A" op={aparece(t, T.corta)}>
        ✓ gas cortado
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué sostener la perilla?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.junto], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Junto a la llama: el termopar, dos metales distintos unidos en la punta; al calentarse aparece un voltaje
export const Termopar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cal = interpolate(t, [T.calienta, T.voltaje], [0.2, 1], clamp);
  const mv = Math.round(cal * 25);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.junto, T.alimenta], [1, 1.04])}>
        <g opacity={aparece(t, T.junto)}>
          <path d="M 200 1300 L 520 780" stroke="#E08A4A" strokeWidth={30} strokeLinecap="round" />
          <path d="M 300 1300 L 540 800" stroke="#B8B8C4" strokeWidth={30} strokeLinecap="round" />
          <circle cx={532} cy={784} r={34} fill={`rgb(255, ${Math.round(220 - cal * 130)}, 80)`} />
          {new Array(6).fill(0).map((_, k) => (
            <path key={k} d={`M ${560 + k * 30} 760 Q ${570 + k * 30} ${680 - 20 * Math.sin(t * 10 + k)} ${590 + k * 30} 620`} stroke="#6AA8FF" strokeWidth={14} fill="none" opacity={0.7} />
          ))}
          <Texto x={160} y={1360} size={30} color="#E08A4A">
            metal 1
          </Texto>
          <Texto x={360} y={1360} size={30} color="#B8B8C4">
            metal 2
          </Texto>
        </g>
        <Texto x={540} y={560} size={46} color={C.yellow} op={aparece(t, T.termopar)}>
          termopar
        </Texto>
        <g opacity={aparece(t, T.voltaje)}>
          <rect x={660} y={1080} width={300} height={170} rx={20} fill="#1A2A1A" />
          <Texto x={810} y={1190} size={60} color="#5AE07A">
            {mv + " mV"}
          </Texto>
          <path d="M 200 1300 Q 200 1420 660 1180 M 300 1300 Q 340 1400 660 1200" stroke="#8A8A96" strokeWidth={5} fill="none" />
          <Texto x={810} y={1320} size={32} color={C.white}>
            voltaje diminuto
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.voltaje} color={C.yellow} />
    </>
  );
};

// Válvula con electroimán y resorte; abierta 0..1
const Valvula: React.FC<{ readonly t: number; readonly abierta: number; readonly iman: number }> = ({ t, abierta, iman }) => (
  <g>
    <rect x={140} y={1000} width={800} height={120} fill="#3A3A44" />
    <rect x={140} y={1020} width={800} height={80} fill="#1A1A22" />
    <rect x={490} y={1020 - abierta * 90} width={30} height={80} fill="#C8C8D4" />
    <rect x={430} y={700} width={150} height={180} rx={14} fill={iman > 0.5 ? C.orange : "#5A4A3A"} />
    {new Array(6).fill(0).map((_, k) => (
      <line key={k} x1={430} y1={720 + k * 28} x2={580} y2={720 + k * 28} stroke="#E08A4A" strokeWidth={6} opacity={0.8} />
    ))}
    <line x1={505} y1={880} x2={505} y2={1020 - abierta * 90} stroke="#C8C8D4" strokeWidth={10} />
    <path d={`M 600 880 ${new Array(8).fill(0).map((_, k) => `l ${k % 2 ? -30 : 30} ${(140 - abierta * 90) / 8}`).join(" ")}`} stroke={C.cyan} strokeWidth={6} fill="none" />
    {abierta > 0.5
      ? new Array(10).fill(0).map((_, k) => {
          const u = (t * 0.8 + k / 10) % 1;
          return <circle key={k} cx={160 + u * 760} cy={1060} r={12} fill={GAS} />;
        })
      : new Array(5).fill(0).map((_, k) => <circle key={k} cx={180 + k * 60} cy={1060} r={12} fill={GAS} opacity={0.6} />)}
  </g>
);

// D. El voltaje alimenta un electroimán que mantiene abierta la válvula del gas
export const Iman: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.alimenta, T.enfria], [1, 1.04])}>
      <Valvula t={t} abierta={1} iman={aparece(t, T.electroiman)} />
      <Texto x={505} y={650} size={40} color={C.orange} op={aparece(t, T.electroiman)}>
        electroimán
      </Texto>
      <Texto x={760} y={860} size={32} color={C.cyan} op={aparece(t, T.electroiman)}>
        resorte
      </Texto>
      <Texto x={540} y={1260} size={40} color={GAS} op={aparece(t, T.valvula)}>
        válvula abierta: pasa el gas
      </Texto>
    </Lienzo>
  );
};

// E. Si la llama se apaga, la punta se enfría, la corriente desaparece y el resorte cierra la válvula
export const Cierra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cierra = interpolate(t, [T.resorte, T.resorte + 0.25], [1, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.enfria, T.sostienes], [1, 1.04])}>
        <Valvula t={t} abierta={cierra} iman={1 - aparece(t, T.desaparece)} />
        <Texto x={540} y={560} size={38} color={C.cyan} op={aparece(t, T.enfria)}>
          llama apagada: la punta se enfría
        </Texto>
        <Texto x={540} y={630} size={36} color={C.white} op={aparece(t, T.desaparece)}>
          sin corriente, sin imán
        </Texto>
        <Texto x={540} y={1260} size={44} color="#5AD08A" op={aparece(t, T.resorte)}>
          ¡el resorte la cierra!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.resorte} color="#5AD08A" />
    </>
  );
};

// F. Al encenderla sostienes la perilla unos segundos, hasta que el termopar se calienta
export const Perilla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const seg = Math.min(5, Math.max(0, Math.floor(t - T.sostienes)));
  const cal = interpolate(t, [T.sostienes, T.asi], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.sostienes, T.asi], [1, 1.04])}>
      <Quemador x={540} y={1250} t={t} llama={1} calor={cal} s={1} />
      <g transform="translate(540 760)">
        <circle cx={0} cy={0} r={110} fill="#3A3A44" stroke="#5A5A66" strokeWidth={8} />
        <rect x={-20} y={-90} width={40} height={90} rx={10} fill="#C8C8D4" transform={`rotate(${-60 * aparece(t, T.sostienes)})`} />
        <path d="M -40 -200 q 40 -40 80 0 l 0 80 l -80 0 Z" fill="#E0A888" opacity={aparece(t, T.sostienes)} transform={`translate(0 ${10 * Math.sin(t * 3)})`} />
      </g>
      <Texto x={860} y={760} size={60} color={C.yellow} op={aparece(t, T.segundos)}>
        {seg + " s"}
      </Texto>
      <Texto x={540} y={1450} size={30} color={C.white} op={aparece(t, T.segundos)}>
        sostienes hasta que el termopar se calienta
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
