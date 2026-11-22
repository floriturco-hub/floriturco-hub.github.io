import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/stepper/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  impresora: 2.28, // impresora
  cabezal: 3.62, // cabezal
  equivocarse: 5.52, // equivocarse
  final: 6.66, // final
  motor: 10.00, // motor
  rotor: 12.10, // rotor
  dientes: 12.58, // dientes
  electroimanes: 14.26, // electroimanes
  lugar: 15.54, // lugar
  circuito: 16.78, // circuito
  tras: 18.72, // tras
  cambia: 20.10, // cambia
  salta: 21.04, // salta
  alinearse: 21.84, // alinearse
  exacto: 23.66, // exacto
  uno2: 25.36, // uno
  doscientos: 26.82, // doscientos
  tornillo: 29.00, // tornillo
  avance: 30.72, // avance
  centesimas2: 32.64, // centesimas
  pulso: 34.66, // pulso
  contarlos: 36.58, // contarlos
  asi: 38.40, // asi
  fin: 40.14, // FIN
};

const COBRE = "#D88A4A";

// Corte del motor de pasos: activo = índice de polo encendido (0-3), giro del rotor en grados
const Motor: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly activo: number; readonly giro: number; readonly polos?: number }> = ({
  x,
  y,
  s,
  activo,
  giro,
  polos = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={330} fill="#3A3650" stroke="#5A5478" strokeWidth={10} />
    <circle cx={0} cy={0} r={260} fill="#141030" />
    <g opacity={polos}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
        const on = k % 4 === activo;
        return (
          <g key={k} transform={`rotate(${k * 45})`}>
            <rect x={-34} y={-325} width={68} height={130} fill={on ? C.yellow : "#8C88A8"} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-48} y={-310 + i * 26} width={96} height={14} rx={6} fill={on ? C.orange : COBRE} opacity={0.9} />
            ))}
          </g>
        );
      })}
    </g>
    <g transform={`rotate(${giro})`}>
      <circle cx={0} cy={0} r={170} fill="#B8B8C8" />
      {new Array(25).fill(0).map((_, k) => (
        <rect key={k} x={-10} y={-190} width={20} height={28} fill="#B8B8C8" transform={`rotate(${k * 14.4})`} />
      ))}
      <circle cx={0} cy={0} r={40} fill="#5A5478" />
      <rect x={-6} y={-160} width={12} height={60} fill={C.red} />
    </g>
  </g>
);

// Impresora 3D sencilla: cabezal en x
const Impresora: React.FC<{ readonly hx: number }> = ({ hx }) => (
  <g>
    <rect x={160} y={560} width={30} height={760} fill="#5A5478" />
    <rect x={890} y={560} width={30} height={760} fill="#5A5478" />
    <rect x={160} y={720} width={760} height={30} fill="#8C88A8" />
    <g transform={`translate(${hx} 735)`}>
      <rect x={-60} y={-60} width={120} height={120} rx={14} fill="#3A3650" stroke={C.cyan} strokeWidth={5} />
      <path d="M -20 60 L 20 60 L 0 100 Z" fill={C.orange} />
    </g>
    <rect x={260} y={1220} width={560} height={30} fill="#3A3650" />
    <rect x={420} y={1120} width={240} height={100} fill={C.cyan} opacity={0.6} />
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Impresora hx={540 + Math.sin(t * 2) * 120} />
    <Texto x={540} y={500} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo se mueve con tanta precisión?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.impresora], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.cyan} />
    </>
  );
};

// B. Una impresora 3D mueve su cabezal centésimas de milímetro + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hx = 380 + Math.floor((t - T.impresora) * 6) * 8;
  return (
    <Lienzo zoom={interpolate(t, [T.impresora, T.motor], [1, 1.04])}>
      <Impresora hx={Math.min(760, hx)} />
      <g opacity={aparece(t, T.cabezal)}>
        <rect x={340} y={1300} width={400} height={90} rx={18} fill={C.card} stroke={C.cyan} strokeWidth={4} />
        <Texto x={540} y={1360} size={40} color={C.cyan}>
          0,01 mm
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={500} color={C.white} size={34}>
          ¿no necesita mirar? al final
        </Texto>
        <rect x={290} y={525} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={525} width={500 * interpolate(t, [T.final, T.motor], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Un motor de pasos: rotor con dientes y electroimanes alrededor
export const Interior: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.motor, T.lugar], [1, 1.04])}>
      <Motor x={540} y={880} s={1.1} activo={-1} giro={0} polos={aparece(t, T.electroimanes)} />
      <Texto x={540} y={1330} size={40} color="#B8B8C8" op={aparece(t, T.rotor) * (1 - aparece(t, T.electroimanes))}>
        rotor con dientes
      </Texto>
      <Texto x={540} y={1330} size={40} color={COBRE} op={aparece(t, T.electroimanes)}>
        electroimanes alrededor
      </Texto>
    </Lienzo>
  );
};

// D. El circuito enciende los electroimanes uno tras otro: el rotor salta un paso exacto de 1,8°
export const Pasos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = t > T.circuito ? Math.floor((t - T.circuito) * 2) : 0;
  const activo = t > T.circuito ? n % 4 : -1;
  const giro = n * 3.6;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.lugar, T.doscientos], [1, 1.04])}>
        <Motor x={540} y={860} s={1.05} activo={activo} giro={giro} />
        <Texto x={540} y={1300} size={40} color={C.yellow} op={aparece(t, T.tras) * (1 - aparece(t, T.salta))}>
          uno tras otro
        </Texto>
        <Texto x={540} y={1300} size={40} color={C.white} op={aparece(t, T.salta) * (1 - aparece(t, T.exacto))}>
          el rotor salta a alinearse
        </Texto>
        <g opacity={aparece(t, T.exacto)}>
          <rect x={260} y={1240} width={560} height={110} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={1315} size={52} color={C.yellow}>
            1 paso = 1,8°
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.exacto} color={C.yellow} />
    </>
  );
};

// E. 200 pasos son una vuelta; un tornillo convierte la vuelta en avance: centésimas de milímetro
export const Tornillo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasos = Math.min(200, Math.floor(interpolate(t, [T.doscientos, T.doscientos + 1.2], [0, 200], clamp)));
  const avance = interpolate(t, [T.tornillo, T.centesimas2 + 1], [0, 300], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.doscientos, T.pulso], [1, 1.04])}>
      <Texto x={540} y={520} size={60} color={C.yellow} op={aparece(t, T.doscientos)}>
        {`${pasos} pasos = ${Math.round(pasos * 1.8)}°`}
      </Texto>
      <g opacity={aparece(t, T.tornillo)}>
        <rect x={140} y={880} width={800} height={50} fill="#8C88A8" />
        {new Array(40).fill(0).map((_, k) => (
          <line key={k} x1={140 + ((k * 20 + t * 60) % 800)} y1={880} x2={150 + ((k * 20 + t * 60) % 800)} y2={930} stroke="#5A5478" strokeWidth={6} />
        ))}
        <rect x={260 + avance} y={830} width={140} height={150} rx={14} fill={C.cyan} opacity={0.85} />
        <Texto x={330 + avance} y={1030} size={30} color={C.cyan}>
          cabezal
        </Texto>
      </g>
      <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.avance)}>
        giro → avance
      </Texto>
      <Texto x={540} y={1290} size={40} color={C.cyan} op={aparece(t, T.centesimas2)}>
        1 paso = centésimas de mm
      </Texto>
    </Lienzo>
  );
};

// F. Cada pulso es un paso fijo: basta contarlos para saber dónde está
export const Contar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.floor(Math.max(0, t - T.pulso) * 6);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pulso, T.asi], [1, 1.04])}>
        <path
          d={new Array(24)
            .fill(0)
            .map((_, k) => `${k ? "L" : "M"} ${140 + k * 34} ${k % 2 ? 680 : 800} L ${140 + (k + 1) * 34} ${k % 2 ? 680 : 800}`)
            .join(" ")}
          stroke={C.yellow}
          strokeWidth={6}
          fill="none"
          opacity={aparece(t, T.pulso)}
        />
        <Texto x={540} y={600} size={34} color={C.yellow} op={aparece(t, T.pulso)}>
          pulsos
        </Texto>
        <g opacity={aparece(t, T.contarlos)}>
          <rect x={240} y={960} width={600} height={140} rx={24} fill={C.card} stroke={C.cyan} strokeWidth={4} />
          <Texto x={540} y={1050} size={56} color={C.cyan}>
            {`${n} pulsos`}
          </Texto>
          <Texto x={540} y={1200} size={36} color={C.white}>
            {`posición: ${(n * 0.01).toFixed(2).replace(".", ",")} mm`}
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.contarlos} color={C.cyan} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
