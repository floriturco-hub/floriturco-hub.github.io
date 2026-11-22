import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/congelador/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  ahorra: 3.12, // ahorra
  refrigerador: 5.90, // refrigerador
  gastar: 6.94, // gastar
  final: 8.18, // final
  puerta: 11.10, // puerta
  cae: 12.20, // cae
  tibio: 13.36, // tibio
  lleno: 16.06, // lleno
  poco: 16.74, // poco
  bateria: 20.34, // bateria
  refrigerador2: 21.38, // refrigerador
  circular: 22.98, // circular
  atiborras: 24.38, // atiborras
  salidas: 25.54, // salidas
  zonas: 26.98, // zonas
  motor: 28.06, // motor
  truco: 29.72, // truco
  botellas: 32.08, // botellas
  espacio: 34.40, // espacio
  porEso: 36.38, // por
  fin: 38.26, // FIN
};

const FRIO = "#3AB8E8";
const TIBIO = "#E8703C";

// Caja de electrodoméstico abierta: lleno 0..1 (cajas de comida), puerta 0..1 abierta
const Caja: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly lleno: number; readonly puerta?: number; readonly t: number; readonly color?: string; readonly fuga?: number }> = ({
  x,
  y,
  w,
  h,
  lleno,
  puerta = 0,
  t,
  color = FRIO,
  fuga = 0,
}) => {
  const n = Math.round(lleno * 12);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={30} fill="#1E2A3A" stroke="#C8D0DC" strokeWidth={8} />
      {new Array(n).fill(0).map((_, k) => (
        <rect key={k} x={x + 30 + (k % 3) * ((w - 60) / 3)} y={y + h - 30 - (Math.floor(k / 3) + 1) * ((h - 60) / 4)} width={(w - 60) / 3 - 10} height={(h - 60) / 4 - 10} rx={10} fill={["#C8D0DC", "#8AC8FF", "#E8C870"][k % 3]} />
      ))}
      {/* aire frío que cae al abrir */}
      {fuga > 0
        ? new Array(6).fill(0).map((_, k) => {
            const u = (t * 0.8 + k / 6) % 1;
            return <path key={k} d={`M ${x + w - 20} ${y + 80 + u * (h - 40)} q 60 20 120 ${30 + u * 40}`} stroke={color} strokeWidth={8} fill="none" opacity={fuga * (1 - u) * (1 - lleno * 0.8)} />;
          })
        : null}
      <g transform={`translate(${x + w} ${y})`}>
        <rect x={-8} y={0} width={16 + 0 * puerta} height={h} fill="#C8D0DC" transform={`skewY(${puerta * 20})`} opacity={puerta > 0.05 ? 1 : 0} />
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Caja x={260} y={720} w={560} h={640} lleno={1} t={t} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M ${380 + k * 160} 700 l 0 -40`} stroke={FRIO} strokeWidth={8} opacity={0.5 + 0.4 * Math.sin(t * 3 + k)} />
    ))}
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué conviene llenar este congelador?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.ahorra], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Congelador lleno ahorra; refrigerador atiborrado gasta más + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ahorra, T.puerta], [1, 1.04])}>
      <Caja x={90} y={760} w={420} h={520} lleno={1} t={t} />
      <Texto x={300} y={1340} size={32} color={C.white}>
        congelador lleno
      </Texto>
      <Texto x={300} y={1410} size={38} color="#5AD08A" op={aparece(t, T.ahorra)}>
        ahorra
      </Texto>
      <g opacity={aparece(t, T.refrigerador)}>
        <Caja x={570} y={760} w={420} h={520} lleno={1} t={t} />
        <rect x={570} y={760} width={420} height={520} rx={30} fill={TIBIO} opacity={0.15} />
        <Texto x={780} y={1340} size={32} color={C.white}>
          refri atiborrado
        </Texto>
        <Texto x={780} y={1410} size={38} color={TIBIO} op={aparece(t, T.gastar)}>
          gasta más
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el truco para ahorrar: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.puerta], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Al abrir la puerta el aire frío cae y entra aire tibio; lleno hay poco aire que cambiar y la comida guarda frío
export const Puerta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lleno = aparece(t, T.lleno);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.puerta, T.refrigerador2], [1, 1.04])}>
        <Caja x={200} y={720} w={520} h={620} lleno={lleno} t={t} fuga={aparece(t, T.cae)} puerta={aparece(t, T.puerta)} />
        {aparece(t, T.tibio) > 0
          ? new Array(4).fill(0).map((_, k) => {
              const u = (t * 0.6 + k / 4) % 1;
              return <path key={k} d={`M ${980 - u * 200} ${780 + k * 40} l -60 0 m 14 -12 l -14 12 l 14 12`} stroke={TIBIO} strokeWidth={7} fill="none" opacity={aparece(t, T.tibio) * (1 - lleno * 0.8)} />;
            })
          : null}
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.cae) * (1 - lleno)}>
          sale aire frío, entra aire tibio
        </Texto>
        <Texto x={540} y={640} size={38} color="#5AD08A" op={lleno * (1 - aparece(t, T.bateria))}>
          lleno: poco aire que cambiar
        </Texto>
        <Texto x={540} y={640} size={38} color={FRIO} op={aparece(t, T.bateria)}>
          la comida guarda frío, como una batería
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.lleno} color={FRIO} />
    </>
  );
};

// D. El refrigerador enfría haciendo circular aire; si lo atiborras, tapas las salidas y el motor trabaja más
export const Refri: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const at = aparece(t, T.atiborras);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.refrigerador2, T.truco], [1, 1.04])}>
        <Caja x={220} y={720} w={520} h={680} lleno={at} t={t} />
        <rect x={420} y={740} width={120} height={30} rx={8} fill={at > 0.5 ? TIBIO : FRIO} />
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 8) % 1;
          const ang = u * Math.PI * 2;
          return <circle key={k} cx={480 + Math.cos(ang) * 200} cy={1060 + Math.sin(ang) * 260} r={14} fill={FRIO} opacity={aparece(t, T.circular) * (1 - at * 0.85)} />;
        })}
        <g opacity={aparece(t, T.zonas)}>
          <circle cx={320} cy={1250} r={60} fill={TIBIO} opacity={0.4} />
          <circle cx={620} cy={950} r={60} fill={TIBIO} opacity={0.4} />
        </g>
        <Texto x={540} y={640} size={38} color={FRIO} op={aparece(t, T.circular) * (1 - at)}>
          enfría haciendo circular aire
        </Texto>
        <Texto x={540} y={640} size={38} color={TIBIO} op={at}>
          atiborrado: se tapan las salidas
        </Texto>
        <g opacity={aparece(t, T.motor)} transform={`translate(880 1300) rotate(${t * 400})`}>
          <circle cx={0} cy={0} r={50} fill="#4A5060" />
          <rect x={-8} y={-45} width={16} height={90} fill={TIBIO} />
        </g>
        <Texto x={880} y={1420} size={28} color={TIBIO} op={aparece(t, T.motor)}>
          motor: más tiempo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.atiborras} color={TIBIO} />
    </>
  );
};

// E. El truco: botellas de agua en los huecos del congelador; espacio para el aire en el refrigerador
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.truco, T.porEso], [1, 1.04])}>
      <Caja x={90} y={760} w={420} h={520} lleno={0.5} t={t} />
      {new Array(3).fill(0).map((_, k) => (
        <g key={k} opacity={aparece(t, T.botellas + k * 0.2)}>
          <rect x={130 + k * 120} y={810} width={70} height={190} rx={20} fill="#8AC8FF" opacity={0.8} />
          <rect x={150 + k * 120} y={790} width={30} height={30} rx={6} fill="#4A80C8" />
        </g>
      ))}
      <Texto x={300} y={1340} size={30} color={C.white} op={aparece(t, T.botellas)}>
        botellas de agua
      </Texto>
      <g opacity={aparece(t, T.espacio)}>
        <Caja x={570} y={760} w={420} h={520} lleno={0.42} t={t} />
        {new Array(5).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 5) % 1;
          return <circle key={k} cx={780 + Math.cos(u * 6.28) * 150} cy={1000 + Math.sin(u * 6.28) * 200} r={12} fill={FRIO} />;
        })}
        <Texto x={780} y={1340} size={30} color={C.white}>
          espacio para el aire
        </Texto>
      </g>
      <Texto x={540} y={620} size={44} color={C.yellow} op={aparece(t, T.truco)}>
        el truco
      </Texto>
    </Lienzo>
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
