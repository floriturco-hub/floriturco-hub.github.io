import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/sawstop/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tocas: 2.06, // tocas
  detiene: 3.64, // detiene
  final: 5.46, // final
  senal: 9.30, // senal
  madera: 10.78, // madera
  cuerpo: 12.58, // cuerpo
  tocarla: 13.62, // tocarla
  absorbe: 14.56, // absorbe
  circuito: 16.56, // circuito
  instante: 17.94, // instante
  entonces: 18.74, // entonces
  bloque: 19.94, // bloque
  aluminio: 20.36, // aluminio
  resorte: 22.40, // resorte
  clavan: 24.66, // clavan
  detiene2: 26.40, // detiene
  cinco: 27.04, // cinco
  esconde: 28.56, // esconde
  rasguno: 30.26, // rasgu
  eso: 32.12, // eso
  destruidos: 34.16, // destruidos
  asi: 35.10, // asi
  fin: 37.02, // FIN
};

const MESA = 900;
const PIEL = "#E8B48A";

// Sierra de mesa de perfil: ang = giro de la hoja; baja = cuánto se esconde; senal = ondas; freno = bloque contra los dientes
const Sierra: React.FC<{ readonly ang: number; readonly baja?: number; readonly senal?: number; readonly corte?: number; readonly freno?: number; readonly t?: number }> = ({
  ang,
  baja = 0,
  senal = 0,
  corte = 0,
  freno = 0,
  t = 0,
}) => {
  const cy = MESA + 120 + baja * 230;
  return (
    <g>
      <g opacity={corte}>
        <rect x={160} y={MESA} width={760} height={460} fill="#141030" stroke="#5A5478" strokeWidth={6} />
      </g>
      <g transform={`translate(540 ${cy}) rotate(${ang})`}>
        <circle cx={0} cy={0} r={220} fill="#B8B8C8" />
        {new Array(24).fill(0).map((_, k) => (
          <polygon key={k} points="0,-220 18,-246 26,-214" fill="#B8B8C8" transform={`rotate(${k * 15})`} />
        ))}
        <circle cx={0} cy={0} r={40} fill="#5A5478" />
      </g>
      <g opacity={corte}>
        <g transform={`translate(${790 - freno * 110} ${MESA + 300})`}>
          <rect x={-60} y={-60} width={120} height={120} rx={10} fill="#D8D8E8" stroke={C.yellow} strokeWidth={4} />
          <path d={`M 60 0 L ${120 + 60 * (1 - freno)} 0`} stroke={C.yellow} strokeWidth={6} strokeDasharray="10 8" />
          <Texto x={0} y={100} size={28} color="#D8D8E8">
            aluminio
          </Texto>
        </g>
      </g>
      <g opacity={senal}>
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={540} cy={cy} r={120 + ((t * 120 + k * 40) % 120)} fill="none" stroke={C.yellow} strokeWidth={4} opacity={0.6} />
        ))}
      </g>
      <rect x={60} y={MESA} width={960} height={40} fill="#C8A86A" />
      <rect x={500} y={MESA} width={80} height={40} fill="#141030" opacity={0.7} />
    </g>
  );
};

const Dedo: React.FC<{ readonly x: number; readonly y: number; readonly rasguno?: number }> = ({ x, y, rasguno = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-420} y={-40} width={420} height={90} rx={40} fill="#C8946A" />
    <rect x={-60} y={-36} width={140} height={80} rx={40} fill={PIEL} />
    <rect x={40} y={-30} width={36} height={30} rx={10} fill="#F4D8D0" />
    <line x1={60} y1={30} x2={80} y2={20} stroke={C.red} strokeWidth={5} opacity={rasguno} />
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Sierra ang={t * 900} />
    <Dedo x={240} y={MESA - 50} />
    <Texto x={860} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo frena esta sierra tan rápido?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tocas], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Tocas la hoja con el dedo y se detiene antes de cortarte + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const toque = T.tocas + 0.6;
  const ang = t < toque ? t * 900 : toque * 900;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tocas, T.senal], [1, 1.04])}>
        <Sierra ang={ang} baja={interpolate(t, [toque, toque + 0.3], [0, 1], clamp)} />
        <Dedo x={interpolate(t, [T.tocas, toque], [240, 300], clamp)} y={MESA - 50} />
        <Texto x={800} y={700} size={48} color={C.yellow} op={aparece(t, T.detiene)}>
          ¡se detiene!
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.senal], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            qué se sacrifica: al final
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={toque} color={C.yellow} />
    </>
  );
};

// Medidor de señal
const Senal: React.FC<{ readonly v: number; readonly op: number }> = ({ v, op }) => (
  <g opacity={op}>
    <rect x={190} y={470} width={700} height={40} rx={20} fill="#2A2440" />
    <rect x={190} y={470} width={700 * v} height={40} rx={20} fill={v < 0.6 ? C.red : C.yellow} />
    <Texto x={540} y={560} size={30} color={C.grey}>
      señal en la hoja
    </Texto>
  </g>
);

// C. La hoja lleva una señal eléctrica; la madera no la conduce, tu cuerpo sí; un circuito detecta el cambio
export const Deteccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const madera = aparece(t, T.madera) * (1 - aparece(t, T.cuerpo));
  const dedo = aparece(t, T.tocarla);
  const v = 0.9 - 0.5 * aparece(t, T.absorbe);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.senal, T.entonces], [1, 1.04])}>
        <Sierra ang={(t - T.senal) * 900} senal={aparece(t, T.senal)} t={t} />
        <g opacity={madera}>
          <rect x={interpolate(t, [T.madera, T.cuerpo], [100, 400], clamp)} y={MESA - 90} width={360} height={90} fill="#C8884A" />
        </g>
        <g opacity={dedo}>
          <Dedo x={300} y={MESA - 50} />
        </g>
        <Senal v={v} op={aparece(t, T.senal)} />
        <g opacity={aparece(t, T.circuito)}>
          <rect x={780} y={620} width={160} height={120} rx={14} fill="#3A3650" stroke={C.yellow} strokeWidth={4} />
          <Texto x={860} y={695} size={30} color={C.yellow}>
            {aparece(t, T.instante) > 0.5 ? "¡CAMBIO!" : "chip"}
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.instante} color={C.red} />
    </>
  );
};

// D. Dispara un bloque de aluminio contra los dientes; la hoja se detiene en 5 ms y se esconde
export const Freno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const freno = interpolate(t, [T.resorte, T.clavan], [0, 1], clamp);
  const baja = interpolate(t, [T.esconde, T.esconde + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.entonces, T.rasguno], [1, 1.04])}>
        <Sierra ang={freno > 0.99 ? 0 : (t - T.entonces) * 900} corte={aparece(t, T.bloque)} freno={freno} baja={baja} />
        <Texto x={540} y={500} size={40} color={C.white} op={aparece(t, T.resorte) * (1 - aparece(t, T.cinco))}>
          un resorte muy potente
        </Texto>
        <g opacity={aparece(t, T.cinco)}>
          <rect x={340} y={440} width={400} height={120} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={525} size={64} color={C.yellow}>
            5 ms
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.clavan} color={C.white} />
    </>
  );
};

// E. Te queda un rasguño en vez de perder un dedo; el freno y la hoja quedan destruidos
export const Rasguno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.rasguno, T.asi], [1, 1.04])}>
      <Dedo x={700} y={640} rasguno={1} />
      <Texto x={540} y={790} size={40} color={C.white} op={aparece(t, T.rasguno)}>
        solo un rasguño
      </Texto>
      <g opacity={aparece(t, T.eso)}>
        <rect x={250} y={960} width={200} height={200} rx={16} fill="#C8C8D8" />
        <circle cx={760} cy={1060} r={130} fill="#B8B8C8" />
        <line x1={220} y1={940} x2={480} y2={1180} stroke={C.red} strokeWidth={12} />
        <line x1={640} y1={940} x2={880} y2={1180} stroke={C.red} strokeWidth={12} />
        <Texto x={540} y={1300} size={38} color={C.red} op={aparece(t, T.destruidos)}>
          freno y hoja: destruidos
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
