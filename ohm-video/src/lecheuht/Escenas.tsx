import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/lecheuht/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  leche: 2.28, // leche
  seis: 3.40, // seis
  conservadores: 5.30, // conservadores
  final: 6.52, // final
  uht: 9.30, // uht
  ultra: 10.42, // ultra
  calientan: 12.48, // calientan
  ciento: 13.18, // ciento
  segundos: 16.24, // segundos
  calor: 17.26, // calor
  bacterias: 18.44, // bacterias
  esporas: 19.70, // esporas
  pasteurizacion: 21.06, // pasteurizacion
  luego: 22.40, // luego
  esteril: 23.74, // esteril
  aire: 25.32, // aire
  capas: 26.86, // capas
  carton: 27.56, // carton
  aluminio: 29.72, // aluminio
  oxigeno: 31.28, // oxigeno
  microbios: 32.20, // microbios
  perder: 35.24, // perder
  asi: 35.86, // asi
  fin: 37.76, // FIN
};

const AZUL = "#3A6EE8";

const Caja: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -120 -260 L 0 -320 L 120 -260 L 120 260 L -120 260 Z" fill={C.white} />
    <path d="M -120 -260 L 0 -320 L 120 -260 L 0 -220 Z" fill="#D8D8E8" />
    <rect x={-120} y={-120} width={240} height={180} fill={AZUL} />
    <Texto x={0} y={-30} size={52} color={C.white}>
      LECHE
    </Texto>
    <Texto x={0} y={30} size={40} color={C.yellow}>
      UHT
    </Texto>
    <rect x={30} y={-300} width={40} height={30} rx={6} fill={C.yellow} />
  </g>
);

const Bacteria: React.FC<{ readonly x: number; readonly y: number; readonly muerta: number; readonly espora?: boolean }> = ({ x, y, muerta, espora = false }) => (
  <g transform={`translate(${x} ${y})`} opacity={1 - muerta * 0.6}>
    {espora ? (
      <g>
        <circle cx={0} cy={0} r={34} fill="#8A6A3A" />
        <circle cx={0} cy={0} r={20} fill="#C8A86A" />
      </g>
    ) : (
      <rect x={-50} y={-20} width={100} height={40} rx={20} fill="#6AC84A" />
    )}
    <g opacity={muerta}>
      <line x1={-40} y1={-40} x2={40} y2={40} stroke={C.red} strokeWidth={10} />
      <line x1={40} y1={-40} x2={-40} y2={40} stroke={C.red} strokeWidth={10} />
    </g>
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Caja x={540} y={980} s={1.1} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo dura meses sin refrigerar?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.leche], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.white} />
    </>
  );
};

// B. Aguanta seis meses fuera de la nevera, sin conservadores + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const meses = Math.min(6, Math.floor(interpolate(t, [T.seis - 0.3, T.seis + 1], [0, 6], clamp)));
  return (
    <Lienzo zoom={interpolate(t, [T.leche, T.uht], [1, 1.04])}>
      <Caja x={360} y={940} s={0.8} />
      <g transform="translate(780 800)" opacity={aparece(t, T.seis)}>
        <rect x={-130} y={-120} width={260} height={240} rx={16} fill={C.white} />
        <rect x={-130} y={-120} width={260} height={60} rx={16} fill={C.red} />
        <Texto x={0} y={60} size={90} color="#141030">
          {`${meses}`}
        </Texto>
        <Texto x={0} y={170} size={36} color={C.white}>
          meses
        </Texto>
      </g>
      <g opacity={aparece(t, T.conservadores)}>
        <rect x={560} y={1060} width={440} height={80} rx={16} fill={C.card} stroke={C.red} strokeWidth={4} />
        <Texto x={780} y={1112} size={32} color={C.white}>
          sin conservadores
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.uht], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          ¿qué hay en la caja? al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. UHT: ultra alta temperatura, 135 grados durante 2 a 4 segundos
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const temp = Math.round(interpolate(t, [T.calientan, T.ciento + 0.8], [20, 135], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.uht, T.calor], [1, 1.04])}>
      <Texto x={540} y={520} size={50} color={C.yellow} op={aparece(t, T.ultra)}>
        Ultra alta Temperatura
      </Texto>
      <g transform="translate(380 900)">
        <rect x={-40} y={-300} width={80} height={420} rx={40} fill="#1A1630" stroke={C.grey} strokeWidth={8} />
        <rect x={-24} y={110 - ((temp - 20) / 115) * 380} width={48} height={((temp - 20) / 115) * 380} rx={20} fill={C.red} />
        <circle cx={0} cy={150} r={70} fill={C.red} />
      </g>
      <Texto x={720} y={860} size={90} color={C.red} op={aparece(t, T.calientan)}>
        {`${temp}°C`}
      </Texto>
      <g opacity={aparece(t, T.segundos)}>
        <rect x={560} y={960} width={320} height={110} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={720} y={1035} size={50} color={C.yellow}>
          2 a 4 s
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Mata bacterias y esporas, que sobreviven a la pasteurización normal
export const Bacterias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mueren = aparece(t, T.bacterias + 0.4);
  const esporas = aparece(t, T.esporas + 0.4);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.calor, T.luego], [1, 1.04])}>
        <Texto x={540} y={500} size={44} color={C.red} op={aparece(t, T.calor)}>
          135 °C
        </Texto>
        {[0, 1, 2, 3].map((k) => (
          <Bacteria key={k} x={240 + k * 200} y={720} muerta={mueren} />
        ))}
        {[0, 1, 2].map((k) => (
          <Bacteria key={`e${k}`} x={340 + k * 200} y={900} muerta={esporas} espora />
        ))}
        <Texto x={540} y={1020} size={34} color="#C8A86A" op={aparece(t, T.esporas)}>
          esporas
        </Texto>
        <g opacity={aparece(t, T.pasteurizacion)}>
          <rect x={160} y={1140} width={760} height={190} rx={20} fill={C.card} stroke={C.grey} strokeWidth={3} />
          <Texto x={540} y={1200} size={30} color={C.grey}>
            pasteurización normal (72 °C)
          </Texto>
          <Bacteria x={540} y={1270} muerta={0} espora />
          <Texto x={760} y={1285} size={30} color="#C8A86A">
            sobreviven
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.bacterias + 0.4} color={C.red} />
    </>
  );
};

// E. La envasan en un ambiente estéril sin aire; la caja tiene seis capas con aluminio
export const Envase: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const capas = aparece(t, T.capas);
  const nombres = [
    ["plástico", "#C8D8E8"],
    ["cartón", "#B8945A"],
    ["plástico", "#C8D8E8"],
    ["aluminio", "#D8D8E8"],
    ["plástico", "#C8D8E8"],
    ["plástico", "#C8D8E8"],
  ];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.luego, T.microbios], [1, 1.04])}>
        <g opacity={1 - capas}>
          <rect x={240} y={560} width={600} height={700} rx={40} fill="none" stroke={C.cyan} strokeWidth={8} strokeDasharray="20 12" />
          <Caja x={540} y={920} s={0.8} />
          <Texto x={540} y={1340} size={40} color={C.cyan} op={aparece(t, T.esteril)}>
            ambiente estéril, sin aire
          </Texto>
        </g>
        <g opacity={capas}>
          {nombres.map(([n, col], k) => (
            <g key={k} opacity={k === 1 ? aparece(t, T.carton) : k === 3 ? aparece(t, T.aluminio) : aparece(t, T.capas + k * 0.15)}>
              <rect x={260 + k * 30} y={600 + k * 100} width={420} height={70} rx={10} fill={col as string} opacity={k === 3 ? 1 : 0.8} />
              <Texto x={850} y={648 + k * 100} size={32} color={col as string} anchor="start">
                {n as string}
              </Texto>
            </g>
          ))}
          <g opacity={aparece(t, T.oxigeno)}>
            <path d="M 120 760 L 340 900" stroke={C.yellow} strokeWidth={8} />
            <Texto x={160} y={730} size={30} color={C.yellow}>
              luz
            </Texto>
            <path d="M 120 1060 L 340 920" stroke={C.cyan} strokeWidth={8} />
            <Texto x={170} y={1110} size={30} color={C.cyan}>
              O₂
            </Texto>
            <Texto x={540} y={1300} size={38} color={C.white}>
              el aluminio los bloquea
            </Texto>
          </g>
        </g>
      </Lienzo>
      <Flash t={t} d={T.aluminio} color={C.white} />
    </>
  );
};

// F. Sin microbios y sin nada que entre, no tiene cómo echarse a perder
export const Sellada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.microbios, T.asi], [1, 1.04])}>
      <Caja x={540} y={900} s={1} />
      <circle cx={540} cy={880} r={420} fill="none" stroke={C.cyan} strokeWidth={10} opacity={aparece(t, T.microbios)} />
      <Texto x={540} y={1420} size={40} color={C.cyan} op={aparece(t, T.perder)}>
        nada se echa a perder
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
      <Inicio q={q} />
    </Lienzo>
  );
};
