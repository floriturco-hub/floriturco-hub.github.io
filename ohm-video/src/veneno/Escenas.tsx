import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/veneno/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  pero: 2.48,
  contrario: 4.5,
  final: 5.36,
  tu: 8.2,
  heridas: 9.64,
  coag: 10.68,
  cadena: 11.9,
  algunos: 13.48,
  disparan: 14.86,
  vaso: 16.52,
  coagulo: 18.08,
  otros: 20.12,
  rompen: 21.78,
  liquida: 23.24,
  pero2: 25.58,
  gasta: 27.14,
  mini: 29.24,
  acaban: 30.42,
  noCoag: 31.78,
  dos: 33.0,
  hemorragia: 34.08,
  antiveneno: 34.9,
  porque: 36.88,
  fin: 39.58,
};

const SANGRE = "#B0202E";
const GEL = "#7A1420";
const VENENO = "#C8E85A";

// Vaso con sangre: gel = 0 líquida (se mueve), 1 sólida (inclinada no se derrama)
const VasoSangre: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly gel: number;
  readonly incl?: number;
}> = ({ x, y, s, t, gel, incl = 0 }) => {
  const ola = (1 - gel) * Math.sin(t * 4) * 10;
  const tiembla = gel * Math.sin(t * 9) * 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${incl}) scale(${s})`}>
      <path
        d={`M -98 ${-60 + ola} Q 0 ${-70 - ola} 98 ${-60 - ola} L 86 150 L -86 150 Z`}
        fill={gel > 0.5 ? GEL : SANGRE}
        transform={`translate(${tiembla} 0)`}
      />
      {gel > 0.5 ? <ellipse cx={-30} cy={0} rx={30} ry={14} fill={C.white} opacity={0.2} /> : null}
      <path d="M -110 -150 L 110 -150 L 90 160 L -90 160 Z" fill="none" stroke="#C8C4D8" strokeWidth={8} />
    </g>
  );
};

// Gota de veneno
const Gota: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op?: number }> = ({ x, y, s, op = 1 }) => (
  <path d="M 0 -40 Q 28 0 28 18 Q 28 40 0 40 Q -28 40 -28 18 Q -28 0 0 -40 Z" transform={`translate(${x} ${y}) scale(${s})`} fill={VENENO} opacity={op} />
);

// Imagen del gancho y del cierre: gota cayendo y la sangre se vuelve gelatina
const GotaVaso: React.FC<{ readonly t: number; readonly cae: number; readonly gel: number }> = ({ t, cae, gel }) => (
  <>
    <circle cx={540} cy={920} r={330} fill={SANGRE} opacity={0.1} />
    <Gota x={540} y={interpolate(cae, [0, 1], [480, 760])} s={1.4} op={1 - (cae > 0.98 ? 1 : 0)} />
    <VasoSangre x={540} y={1000} s={1.6} t={t} gel={gel} />
  </>
);

// A. Gancho: una gota convierte tu sangre en gelatina
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pero], [1.12, 1])}>
        <GotaVaso t={t} cae={interpolate(t, [0.1, 0.6], [0, 1], clamp)} gel={interpolate(t, [0.6, 1.6], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.64} color={SANGRE} />
    </>
  );
};

// B. Otra serpiente hace lo contrario + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.tu], [1, 1.05])}>
      <VasoSangre x={300} y={800} s={1} t={t} gel={1} incl={-25} />
      <Texto x={300} y={1060} size={38} color="#E86070">
        sólida
      </Texto>
      <g opacity={aparece(t, T.contrario - 0.8)}>
        <VasoSangre x={780} y={800} s={1} t={t} gel={0} />
        <Texto x={780} y={1060} size={38} color={SANGRE}>
          líquida
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.tu], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={36}>
          por qué las dos acaban igual: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Fila de fichas (proteínas de la coagulación); caidas = cuántas han caído (puede ser fraccional)
const Cadena: React.FC<{ readonly y: number; readonly caidas: number; readonly rotas?: number }> = ({ y, caidas, rotas = 0 }) => (
  <g>
    {new Array(8).fill(0).map((_, k) => {
      const ang = interpolate(caidas - k, [0, 1], [0, 70], clamp);
      const rota = random(`rt${k}`) < rotas;
      return (
        <g key={k} transform={`translate(${160 + k * 105} ${y}) rotate(${ang} 0 0)`}>
          <rect x={-18} y={-120} width={36} height={120} rx={8} fill={rota ? "#4A4466" : C.yellow} />
          {rota ? <line x1={-24} y1={-70} x2={24} y2={-50} stroke={C.bg} strokeWidth={8} /> : null}
        </g>
      );
    })}
  </g>
);

// C. La sangre tiene un sistema para tapar heridas: una cadena de proteínas
export const Sistema: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const caidas = interpolate(t, [T.cadena, T.algunos], [0, 8], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tu, T.algunos], [1, 1.04])}>
      {/* herida en la piel */}
      <rect x={100} y={560} width={880} height={120} rx={20} fill="#E8B890" />
      <path d="M 460 560 L 540 680 L 620 560 Z" fill={C.bg} />
      <g opacity={aparece(t, T.coag)}>
        {new Array(6).fill(0).map((_, k) => (
          <line key={k} x1={470 + k * 6} y1={575 + k * 16} x2={610 - k * 6} y2={575 + k * 16} stroke={GEL} strokeWidth={6} opacity={interpolate(caidas, [6, 8], [0, 1], clamp)} />
        ))}
      </g>
      <g opacity={aparece(t, T.cadena)}>
        <Cadena y={1020} caidas={caidas} />
        <Texto x={540} y={1120} size={38} color={C.yellow}>
          cadena de proteínas
        </Texto>
      </g>
      <Texto x={540} y={800} size={40} color={C.white} op={aparece(t, T.coag)}>
        coagulación
      </Texto>
    </Lienzo>
  );
};

// D. Algunos venenos la disparan toda a la vez: coágulo sólido en segundos
export const Dispara: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const todas = interpolate(t, [T.disparan, T.disparan + 0.3], [0, 9], clamp);
  const gel = interpolate(t, [T.vaso + 0.3, T.coagulo + 0.4], [0, 1], clamp);
  const voltea = interpolate(t, [T.coagulo + 0.5, T.otros - 0.3], [0, 160], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.algunos, T.otros], [1, 1.04])}>
        <g opacity={1 - aparece(t, T.vaso)}>
          <g transform="translate(0 -200)">
            <Cadena y={1020} caidas={todas > 0 ? todas + 8 : 0} />
          </g>
          <Gota x={540} y={600} s={1.2} />
          <Texto x={540} y={1000} size={40} color={VENENO} op={aparece(t, T.disparan)}>
            ¡todas a la vez!
          </Texto>
        </g>
        <g opacity={aparece(t, T.vaso)}>
          <VasoSangre x={540} y={820} s={1.4} t={t} gel={gel} incl={voltea} />
          <Texto x={540} y={1230} size={42} color={C.white} op={aparece(t, T.coagulo)}>
            coágulo sólido
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.disparan} color={VENENO} />
    </>
  );
};

// E. Otros rompen las proteínas y la sangre queda líquida
export const Rompe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rotas = interpolate(t, [T.rompen, T.rompen + 1.2], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.otros, T.pero2], [1, 1.04])}>
      <g transform="translate(0 -250)">
        <Cadena y={1020} caidas={0} rotas={rotas} />
      </g>
      <VasoSangre x={540} y={1050} s={1.1} t={t * 1.6} gel={0} />
      <Texto x={540} y={600} size={36} color={C.white} op={aparece(t, T.rompen)}>
        rompe las proteínas
      </Texto>
      <Texto x={540} y={1300} size={42} color={SANGRE} op={aparece(t, T.liquida)}>
        no puede coagular
      </Texto>
    </Lienzo>
  );
};

// F. Dentro del cuerpo, el primer tipo gasta las proteínas en minicoágulos
export const Gasta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const reserva = interpolate(t, [T.gasta, T.acaban + 0.4], [1, 0], clamp);
  const fuga = aparece(t, T.noCoag);
  return (
    <Lienzo zoom={interpolate(t, [T.pero2, T.dos], [1, 1.04])}>
      {/* vaso sanguíneo */}
      <rect x={60} y={640} width={960} height={260} rx={130} fill="#5A1A2A" />
      {new Array(10).fill(0).map((_, k) => (
        <circle key={k} cx={100 + ((k * 100 + t * 160) % 900)} cy={770 + Math.sin(k) * 50} r={30} fill={SANGRE} />
      ))}
      {new Array(12).fill(0).map((_, k) => (
        <g key={`m${k}`} opacity={aparece(t, T.mini - 0.6 + k * 0.08)}>
          <circle cx={120 + random(`mx${k}`) * 840} cy={700 + random(`my${k}`) * 140} r={14} fill={GEL} stroke={C.yellow} strokeWidth={3} />
        </g>
      ))}
      <g opacity={fuga}>
        {[0, 1, 2].map((k) => {
          const u = (t * 0.8 + k / 3) % 1;
          return <circle key={k} cx={420 + k * 120} cy={900 + u * 140} r={20 - u * 6} fill={SANGRE} opacity={1 - u} />;
        })}
      </g>
      <Tarjeta x={180} y={1080} w={720} h={150}>
        <Texto x={540} y={1130} size={30} color={C.grey}>
          proteínas de coagulación
        </Texto>
        <rect x={230} y={1160} width={620} height={40} rx={20} fill="#2A2440" />
        <rect x={230} y={1160} width={620 * reserva} height={40} rx={20} fill={C.yellow} />
      </Tarjeta>
      <Texto x={540} y={1330} size={40} color={C.red} op={fuga}>
        ya no coagula
      </Texto>
      <Texto x={540} y={560} size={36} color={C.white} op={aparece(t, T.mini)}>
        minicoágulos por todo el cuerpo
      </Texto>
    </Lienzo>
  );
};

// G. Las dos terminan en hemorragia; por eso existe el antiveneno
export const Final: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const anti = aparece(t, T.antiveneno);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.dos, T.porque], [1, 1.05])}>
        <g opacity={1 - anti}>
          <VasoSangre x={300} y={700} s={0.7} t={t} gel={1} />
          <VasoSangre x={780} y={700} s={0.7} t={t} gel={0} />
          <path d="M 300 840 Q 300 960 520 1000 M 780 840 Q 780 960 560 1000" stroke={C.grey} strokeWidth={8} fill="none" />
          <path d="M 540 960 Q 600 1060 600 1100 Q 600 1160 540 1160 Q 480 1160 480 1100 Q 480 1060 540 960 Z" fill={SANGRE} opacity={aparece(t, T.hemorragia - 0.4)} />
          <Texto x={540} y={1270} size={44} color={C.red} op={aparece(t, T.hemorragia)}>
            hemorragia
          </Texto>
        </g>
        <g opacity={anti}>
          <rect x={440} y={600} width={200} height={360} rx={30} fill="#E8E6F0" opacity={0.25} stroke="#C8C4D8" strokeWidth={8} />
          <rect x={470} y={560} width={140} height={60} rx={10} fill={C.cyan} />
          <rect x={460} y={760} width={160} height={180} rx={20} fill={C.cyan} opacity={0.6} />
          <Texto x={540} y={1100} size={48} color={C.cyan}>
            antiveneno
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.antiveneno} color={C.cyan} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <GotaVaso t={t} cae={0} gel={0} />
    </Lienzo>
  );
};
