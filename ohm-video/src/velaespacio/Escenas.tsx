import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/velaespacio/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tierra: 2.32, // tierra
  lagrima: 4.46, // lagr
  estacion: 6.02, // estaci
  azul: 8.00, // azul
  final: 8.94, // final
  tiempo: 10.40, // tiempo
  sube: 12.80, // sube
  fresco: 14.00, // fresco
  estira: 15.58, // estira
  espacio: 17.22, // espacio
  peso: 17.98, // peso
  oxigeno: 20.74, // ox
  direcciones: 23.92, // direcci
  esfera2: 26.48, // esfera
  fria: 27.68, // fr
  hollin: 28.54, // holl
  azul2: 31.32, // azul
  despacio: 33.36, // despacio
  apaga: 35.54, // apaga
  porEso: 36.48, // por
  fin: 38.20, // FIN
};

const Vela: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={0} width={100} height={260} rx={12} fill="#F4F0E8" />
    <line x1={0} y1={0} x2={0} y2={-30} stroke="#2A2A2A" strokeWidth={6} />
  </g>
);

// Llama de lágrima (Tierra) que se transforma en esfera azul (e 0..1); op general
const Llama: React.FC<{ readonly x: number; readonly y: number; readonly e: number; readonly t: number; readonly s?: number; readonly op?: number }> = ({ x, y, e, t, s = 1, op = 1 }) => {
  const parp = 1 + 0.05 * Math.sin(t * 9) * (1 - e);
  const alto = 150 * (1 - e) + 70 * e;
  return (
    <g transform={`translate(${x} ${y - 40 - 30 * (1 - e)}) scale(${s})`} opacity={op}>
      <ellipse cx={0} cy={-alto * 0.35 * (1 - e)} rx={70 * parp} ry={alto * parp} fill="#3A6AF0" opacity={0.25 + 0.5 * e} />
      <ellipse cx={0} cy={-alto * 0.35 * (1 - e)} rx={50 * parp} ry={alto * 0.8 * parp} fill="#F0B030" opacity={1 - e} />
      <ellipse cx={0} cy={-alto * 0.2 * (1 - e)} rx={28} ry={alto * 0.4} fill="#FFF4C0" opacity={1 - e} />
      <circle cx={0} cy={0} r={40 * e} fill="#6A9AFF" opacity={0.7 * e} />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Vela x={540} y={1100} />
    <Llama x={540} y={1070} e={1} t={t} s={1.3} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta llama es una esfera?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tierra], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. En la Tierra: lágrima amarilla; en la estación espacial: esfera azul + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const es = aparece(t, T.estacion);
  return (
    <Lienzo zoom={interpolate(t, [T.tierra, T.sube], [1, 1.04])}>
      <Vela x={300} y={1100} s={0.8} />
      <Llama x={300} y={1076} e={0} t={t} s={1.1} />
      <Texto x={300} y={1400} size={34} color={C.white}>
        Tierra
      </Texto>
      <g opacity={es}>
        <Vela x={780} y={1100} s={0.8} />
        <Llama x={780} y={1076} e={aparece(t, T.azul)} t={t} s={1.1} />
        <Texto x={780} y={1400} size={34} color="#6A9AFF">
          estación espacial
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          qué le pasa con el tiempo: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.sube], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. En la Tierra, el aire caliente sube y jala aire fresco desde abajo: estira la llama
export const Conveccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sube, T.espacio], [1, 1.04])}>
        <Vela x={540} y={1150} />
        <Llama x={540} y={1120} e={0} t={t} s={1.4 + 0.2 * aparece(t, T.estira)} />
        {aparece(t, T.sube) > 0
          ? [0, 1, 2, 3].map((k) => {
              const u = (t * 0.8 + k / 4) % 1;
              return <path key={k} d={`M ${500 + (k % 2) * 80} ${880 - u * 260} l 0 -40 m -14 14 l 14 -14 l 14 14`} stroke="#E8703C" strokeWidth={6} fill="none" opacity={aparece(t, T.sube) * (1 - u)} />;
            })
          : null}
        {aparece(t, T.fresco) > 0
          ? [-1, 1].map((d) =>
              [0, 1].map((k) => {
                const u = (t * 0.8 + k / 2) % 1;
                const x = 540 + d * (320 - 200 * u);
                const y = 1180 - 120 * u;
                return <circle key={`${d}${k}`} cx={x} cy={y} r={14} fill="#3AB8E8" opacity={aparece(t, T.fresco) * (1 - u * 0.5)} />;
              }),
            )
          : null}
        <Texto x={540} y={620} size={36} color="#E8703C" op={aparece(t, T.sube)}>
          el aire caliente sube
        </Texto>
        <Texto x={540} y={1480} size={34} color="#3AB8E8" op={aparece(t, T.fresco)}>
          y jala aire fresco desde abajo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sube} color="#E8703C" />
    </>
  );
};

// D. En el espacio no hay peso; el oxígeno llega despacio desde todas direcciones: esfera
export const Esfera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const e = interpolate(t, [T.peso, T.esfera2 + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.espacio, T.fria], [1, 1.04])}>
        <Vela x={540} y={1150} />
        <Llama x={540} y={1120} e={e} t={t} s={1.6} />
        {aparece(t, T.oxigeno) > 0
          ? new Array(12).fill(0).map((_, k) => {
              const a = (k / 12) * Math.PI * 2;
              const u = (t * 0.25 + k * 0.083) % 1;
              const r = 380 - 260 * u;
              return <circle key={k} cx={540 + Math.cos(a) * r} cy={1040 + Math.sin(a) * r} r={12} fill="#5AD08A" opacity={aparece(t, T.oxigeno) * (1 - u)} />;
            })
          : null}
        <Texto x={540} y={620} size={36} color={C.white} op={aparece(t, T.espacio)}>
          en el espacio no hay peso
        </Texto>
        <Texto x={540} y={1480} size={34} color="#5AD08A" op={aparece(t, T.oxigeno)}>
          oxígeno desde todas direcciones
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.esfera2} color="#6A9AFF" />
    </>
  );
};

// E. Arde más fría y sin hollín (el amarillo): se ve azul. El oxígeno llega despacio: a veces se apaga sola
export const Apaga: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ap = interpolate(t, [T.apaga, T.apaga + 0.8], [1, 0.1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.fria, T.porEso], [1, 1.04])}>
        <Vela x={540} y={1150} />
        <Llama x={540} y={1120} e={1} t={t} s={1.6 * (0.6 + 0.4 * ap)} op={ap} />
        <g opacity={aparece(t, T.hollin) * (1 - aparece(t, T.despacio))}>
          {new Array(8).fill(0).map((_, k) => (
            <circle key={k} cx={300 + k * 18} cy={760 + (k % 3) * 14} r={8} fill="#F0B030" />
          ))}
          <line x1={280} y1={740} x2={460} y2={810} stroke="#E05050" strokeWidth={8} />
          <Texto x={370} y={860} size={28} color={C.white}>
            sin hollín
          </Texto>
        </g>
        <Texto x={540} y={620} size={36} color="#6A9AFF" op={aparece(t, T.fria) * (1 - aparece(t, T.despacio))}>
          arde más fría: se ve azul
        </Texto>
        <Texto x={540} y={620} size={36} color={C.white} op={aparece(t, T.despacio)}>
          el oxígeno llega muy despacio
        </Texto>
        <Texto x={540} y={1480} size={40} color={C.yellow} op={aparece(t, T.apaga)}>
          a veces se apaga sola
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.fria} color="#6A9AFF" />
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
