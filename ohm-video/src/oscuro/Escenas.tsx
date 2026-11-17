import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/oscuro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  vienes: 1.54, // vienes
  entras: 2.64, // entras
  ciego: 4.36, // ciego
  final: 5.30, // final
  tipos: 8.94, // tipos
  conos: 10.20, // conos
  bastones: 11.96, // bastones
  oscuridad: 12.90, // oscuridad
  pigmento: 14.72, // pigmento
  rodopsina: 15.56, // rodopsina
  descompone: 17.42, // descompone
  gastado: 18.44, // gastado
  volver: 20.90, // volver
  tarda: 22.28, // tarda
  minutos: 23.22, // minutos
  media: 24.74, // media
  todo: 25.90, // todo
  porEso1: 26.58, // por
  piratas: 27.66, // piratas
  listo: 29.44, // listo
  barco: 31.24, // barco
  porEso: 31.86, // por
  fin: 33.32, // FIN
};

const RODO = "#C84AA8";

// Ojo de frente: pupila según luz (0 = oscuro -> pupila grande)
const Ojo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly pupila: number; readonly parche?: number }> = ({
  x,
  y,
  s,
  pupila,
  parche = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 0 Q 0 -150 200 0 Q 0 150 -200 0 Z" fill={C.white} />
    <circle cx={0} cy={0} r={85} fill="#3A7AB8" />
    <circle cx={0} cy={0} r={25 + 45 * pupila} fill="#05040F" />
    <circle cx={-25} cy={-30} r={14} fill={C.white} opacity={0.8} />
    <g opacity={parche}>
      <line x1={-300} y1={-160} x2={300} y2={140} stroke="#5A5478" strokeWidth={16} />
      <path d="M -230 -40 Q 0 -200 230 -40 L 230 40 Q 0 200 -230 40 Z" fill="#2A2630" stroke={C.grey} strokeWidth={8} />
      <path d="M -80 -20 l 40 40 m 0 -40 l -40 40 M 40 -20 l 40 40 m 0 -40 l -40 40" stroke={C.white} strokeWidth={8} opacity={0.6} />
    </g>
  </g>
);

const Sol: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly t: number }> = ({ x, y, op, t }) => (
  <g opacity={op} transform={`translate(${x} ${y}) rotate(${t * 10})`}>
    {new Array(10).fill(0).map((_, k) => (
      <line key={k} x1={0} y1={-110} x2={0} y2={-150} stroke={C.yellow} strokeWidth={12} strokeLinecap="round" transform={`rotate(${k * 36})`} />
    ))}
    <circle cx={0} cy={0} r={85} fill={C.yellow} />
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Ojo x={540} y={940} s={1.5} pupila={1} />
    <Texto x={540} y={680} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué no ves nada al entrar?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.vienes], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Vienes del sol, entras a un cuarto oscuro y quedas ciego + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const oscuro = interpolate(t, [T.entras, T.entras + 0.4], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#E8C870", opacity: 0.25 * (1 - oscuro) }} />
      <Lienzo zoom={interpolate(t, [T.vienes, T.tipos], [1, 1.05])}>
        <Sol x={820} y={560} op={1 - oscuro} t={t} />
        <Ojo x={540} y={900} s={1.2} pupila={interpolate(t, [T.entras, T.ciego + 1], [0, 1], clamp)} />
        <g opacity={oscuro * (1 - aparece(t, T.final))}>
          <rect x={0} y={420} width={1080} height={1500} fill="#000" opacity={0.85} />
          <Texto x={540} y={940} size={60} color={C.grey}>
            ???
          </Texto>
        </g>
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.tipos], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            por qué los piratas usaban parche
          </Texto>
        </g>
      </Lienzo>
    </>
  );
};

// Retina: conos y bastones; pig = nivel de rodopsina (0-1)
const Retina: React.FC<{ readonly conos: number; readonly bastones: number; readonly pig: number }> = ({ conos, bastones, pig }) => (
  <g>
    {new Array(9).fill(0).map((_, k) => {
      const x = 130 + k * 102;
      const cono = k % 3 === 1;
      return cono ? (
        <g key={k} opacity={conos}>
          <rect x={x - 22} y={900} width={44} height={220} rx={10} fill="#5A5478" />
          <polygon points={`${x - 30},900 ${x + 30},900 ${x},790`} fill={[C.red, "#3AC86A", "#3A6EE8"][Math.floor(k / 3)]} />
        </g>
      ) : (
        <g key={k} opacity={bastones}>
          <rect x={x - 20} y={700} width={40} height={420} rx={14} fill="#5A5478" />
          <rect x={x - 14} y={710 + 200 * (1 - pig)} width={28} height={200 * pig} rx={8} fill={RODO} />
        </g>
      );
    })}
  </g>
);

// C. Dos sensores: conos para la luz fuerte, bastones para la oscuridad
export const Sensores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tipos, T.pigmento], [1, 1.04])}>
      <Retina conos={aparece(t, T.conos)} bastones={aparece(t, T.bastones)} pig={0} />
      <Texto x={540} y={1240} size={40} color={C.yellow} op={aparece(t, T.conos)}>
        conos: luz fuerte
      </Texto>
      <Texto x={540} y={1310} size={40} color={C.purpleLight} op={aparece(t, T.bastones)}>
        bastones: oscuridad
      </Texto>
    </Lienzo>
  );
};

// D. Los bastones usan rodopsina; con el sol se descompone y queda gastado
export const Rodopsina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pig = interpolate(t, [T.pigmento, T.rodopsina], [0, 1], clamp) * (1 - interpolate(t, [T.descompone, T.gastado + 0.4], [0, 0.9], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pigmento, T.volver], [1, 1.04])}>
        <Retina conos={0.35} bastones={1} pig={pig} />
        <Sol x={540} y={520} op={aparece(t, T.descompone - 0.3)} t={t} />
        <Texto x={540} y={1240} size={44} color={RODO} op={aparece(t, T.rodopsina) * (1 - aparece(t, T.gastado))}>
          rodopsina
        </Texto>
        <Texto x={540} y={1240} size={40} color={C.grey} op={aparece(t, T.gastado)}>
          gastada por el sol
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.descompone} color={C.yellow} />
    </>
  );
};

// E. En la oscuridad hay que fabricarla de nuevo: minutos para ver algo, media hora para todo
export const Fabrica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.volver, T.todo + 0.3], [0.1, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.volver, T.porEso1], [1, 1.04])}>
      <g transform="translate(0 -120)">
        <Retina conos={0.35} bastones={1} pig={p} />
      </g>
      <g opacity={aparece(t, T.minutos)}>
        <rect x={140} y={1200} width={800} height={24} rx={12} fill="#2A2440" />
        <rect x={140} y={1200} width={800 * p} height={24} rx={12} fill={RODO} />
        <line x1={300} y1={1180} x2={300} y2={1245} stroke={C.white} strokeWidth={4} />
        <Texto x={300} y={1300} size={30} color={C.white}>
          minutos: algo
        </Texto>
      </g>
      <g opacity={aparece(t, T.media)}>
        <line x1={940} y1={1180} x2={940} y2={1245} stroke={C.white} strokeWidth={4} />
        <Texto x={860} y={1360} size={30} color={C.white}>
          30 min: todo
        </Texto>
      </g>
      <Texto x={540} y={1450} size={40} color={C.purpleLight} op={aparece(t, T.tarda)}>
        fabricarla tarda
      </Texto>
    </Lienzo>
  );
};

// F. Se dice que los piratas tapaban un ojo: lo tenían listo para la oscuridad
export const Piratas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cambia = aparece(t, T.barco);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.6 * cambia }} />
      <Lienzo zoom={interpolate(t, [T.porEso1, T.porEso], [1, 1.04])}>
        <Ojo x={320} y={860} s={0.9} pupila={cambia ? 1 : 0} parche={1 - cambia} />
        <Ojo x={760} y={860} s={0.9} pupila={0} parche={cambia} />
        <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.piratas) * (1 - cambia)}>
          un ojo tapado, en la oscuridad
        </Texto>
        <Texto x={540} y={1150} size={40} color={C.yellow} op={cambia}>
          ¡listo para ver bajo cubierta!
        </Texto>
        <Texto x={540} y={1250} size={30} color={C.grey} op={aparece(t, T.piratas)}>
          (es una hipótesis popular)
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.barco} color={C.white} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
