import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/termostato/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  motor: 2.64, // motor
  radiador: 4.98, // radiador
  cera: 6.44, // cera
  final: 8.16, // final
  atasca: 9.58, // atasca
  valvula: 11.70, // v
  capsula: 14.88, // c
  frio: 17.36, // fr
  resorte: 19.34, // resorte
  agua: 21.94, // agua
  derrite: 24.30, // derrite
  perno: 26.52, // perno
  radiador2: 28.82, // radiador
  encoge: 31.08, // encoge
  cerrada: 33.70, // cerrada
  sobrecalienta: 34.92, // sobrecalienta
  asi: 35.94, // asi
  fin: 38.10, // FIN
};

const CERA = "#F0E0A0";
const FRIA = "#3AB8E8";
const CALIENTE = "#E8703C";

// Termostato en corte: cápsula de cera abajo, perno, válvula (plato) arriba; abre 0..1; fundida 0..1
const Termo: React.FC<{ readonly t: number; readonly abre: number; readonly fundida: number; readonly temp: number; readonly flujo?: number }> = ({ t, abre, fundida, temp, flujo = 0 }) => {
  const agua = temp > 0.5 ? CALIENTE : FRIA;
  return (
    <g>
      {/* tubo */}
      <rect x={160} y={700} width={760} height={640} rx={30} fill="#2A2E3A" stroke="#5A6070" strokeWidth={8} />
      <rect x={180} y={720} width={720} height={600} rx={24} fill={agua} opacity={0.18} />
      {/* asiento */}
      <rect x={180} y={880} width={260} height={30} fill="#8A90A0" />
      <rect x={640} y={880} width={260} height={30} fill="#8A90A0" />
      {/* válvula (plato) */}
      <rect x={430} y={880 - 70 * abre} width={220} height={30} rx={10} fill="#C8CCD8" />
      {/* perno */}
      <rect x={530} y={910 - 70 * abre} width={20} height={200} fill="#9AA2B4" />
      {/* resorte */}
      <path d={new Array(9).fill(0).map((_, k) => `${k ? "L" : "M"} ${k % 2 ? 470 : 610} ${930 + k * (24 - 6 * abre)}`).join(" ")} stroke={C.yellow} strokeWidth={6} fill="none" />
      {/* cápsula de cera */}
      <rect x={460} y={1130} width={160} height={150} rx={30} fill="#B8B8C4" />
      <rect x={475} y={1145 - 20 * fundida} width={130} height={120 + 20 * fundida} rx={24} fill={CERA} opacity={0.6 + 0.4 * fundida} />
      {fundida > 0.5 ? [0, 1, 2].map((k) => <circle key={k} cx={500 + k * 40} cy={1200 + 10 * Math.sin(t * 4 + k)} r={6} fill="#FFFFFF" opacity={0.6} />) : null}
      {/* flujo de agua hacia el radiador */}
      {flujo > 0
        ? new Array(5).fill(0).map((_, k) => {
            const u = (t * 0.8 + k / 5) % 1;
            return <circle key={k} cx={540} cy={1000 - u * 280} r={14} fill={CALIENTE} opacity={flujo * (1 - u)} />;
          })
        : null}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => {
  const a = 0.5 + 0.5 * Math.sin(t * 1.2);
  return (
    <>
      <Termo t={t} abre={a} fundida={a} temp={a} flujo={a} />
      <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
        ?
      </Texto>
    </>
  );
};

// A. Gancho: ¿cómo sabe este termostato cuándo abrir?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.motor], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. El motor decide cuándo mandar agua al radiador con una pastilla de cera, sin chips + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.motor, T.valvula], [1, 1.04])}>
      <rect x={140} y={820} width={360} height={360} rx={30} fill="#5A6070" />
      <Texto x={320} y={1010} size={36} color={C.white}>
        motor
      </Texto>
      <g opacity={aparece(t, T.radiador)}>
        <rect x={640} y={780} width={300} height={440} rx={20} fill="#3A3E4A" />
        {new Array(10).fill(0).map((_, k) => (
          <line key={k} x1={660} y1={810 + k * 40} x2={920} y2={810 + k * 40} stroke="#8A90A0" strokeWidth={6} />
        ))}
        <Texto x={790} y={1270} size={32} color={C.white}>
          radiador
        </Texto>
      </g>
      <path d="M 500 900 L 640 900" stroke={CALIENTE} strokeWidth={20} opacity={aparece(t, T.radiador)} />
      <g opacity={aparece(t, T.cera)} transform="translate(570 900)">
        <circle cx={0} cy={0} r={46} fill={CERA} stroke="#8A90A0" strokeWidth={6} />
      </g>
      <Texto x={540} y={1420} size={40} color={CERA} op={aparece(t, T.cera)}>
        una pastilla de cera, sin chips
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y si se atasca?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.valvula], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Una válvula con una cápsula de cera; frío: cera sólida y el resorte la mantiene cerrada
export const Cerrada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.valvula, T.agua], [1, 1.04])}>
      <Termo t={t} abre={0} fundida={0} temp={0} />
      <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.valvula)}>
        una válvula entre motor y radiador
      </Texto>
      <Texto x={760} y={1220} size={30} color={CERA} op={aparece(t, T.capsula)}>
        cápsula de cera
      </Texto>
      <Texto x={540} y={1420} size={36} color={FRIA} op={aparece(t, T.frio)}>
        frío: cera sólida, válvula cerrada
      </Texto>
    </Lienzo>
  );
};

// D. A unos 90 °C la cera se derrite y se expande: empuja el perno, abre la válvula y el agua va al radiador
export const Abre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const f = interpolate(t, [T.derrite, T.derrite + 0.8], [0, 1], clamp);
  const a = interpolate(t, [T.perno, T.perno + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.agua, T.encoge], [1, 1.04])}>
        <Termo t={t} abre={a} fundida={f} temp={aparece(t, T.agua)} flujo={aparece(t, T.radiador2)} />
        <Texto x={540} y={640} size={40} color={CALIENTE} op={aparece(t, T.agua)}>
          agua a ~90 °C
        </Texto>
        <Texto x={760} y={1220} size={30} color={CERA} op={aparece(t, T.derrite)}>
          se derrite y se expande
        </Texto>
        <Texto x={540} y={1420} size={36} color={C.yellow} op={aparece(t, T.perno)}>
          empuja el perno: se abre
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.derrite} color={CERA} />
    </>
  );
};

// E. Si se enfría, la cera se encoge y cierra; si se atasca cerrada, el motor se sobrecalienta
export const Atasca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const c = interpolate(t, [T.encoge, T.encoge + 0.8], [1, 0], clamp);
  const sobre = aparece(t, T.sobrecalienta);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.encoge, T.asi], [1, 1.04])}>
        <Termo t={t} abre={c} fundida={c} temp={c > 0.5 || sobre > 0.5 ? 1 : 0} />
        <Texto x={540} y={640} size={36} color={FRIA} op={aparece(t, T.encoge) * (1 - aparece(t, T.cerrada))}>
          se enfría: la cera se encoge y cierra
        </Texto>
        <Texto x={540} y={640} size={36} color={C.orange} op={aparece(t, T.cerrada)}>
          ¿atascada cerrada?
        </Texto>
        <Texto x={540} y={1420} size={44} color={C.red} op={sobre}>
          ¡motor sobrecalentado!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sobrecalienta} color={C.red} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
