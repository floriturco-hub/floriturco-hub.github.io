import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/botox/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  dosis: 2.20, // dosis
  pelicula: 4.48, // pelicula
  final: 5.56, // final
  mortal: 7.12, // mortal
  serpiente: 10.06, // serpiente
  antidotos: 12.14, // antidotos
  caballo: 13.22, // caballo
  anticuerpos: 15.30, // anticuerpos
  suero: 16.24, // suero
  muchos: 17.12, // muchos
  defenderse: 19.84, // defenderse
  acumula: 21.14, // acumula
  intentes: 22.20, // intentes
  toxina: 23.34, // toxina
  bloquea: 26.28, // bloquea
  paraliza: 28.72, // paraliza
  inyectada: 29.70, // inyectada
  relaja: 32.46, // relaja
  botox: 33.50, // botox
  arrugas: 34.78, // arrugas
  asi: 37.32, // asi
  fin: 39.30, // FIN
};

const VENENO = "#5AD08A";

const Frasco: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-150} width={80} height={40} rx={8} fill="#5A6070" />
    <path d="M -30 -110 L 30 -110 L 30 -70 Q 110 -40 110 60 L 110 140 Q 110 170 80 170 L -80 170 Q -110 170 -110 140 L -110 60 Q -110 -40 -30 -70 Z" fill="#DDE6F0" opacity={0.2} stroke="#DDE6F0" strokeWidth={5} />
    <path d="M -105 40 L 105 40 L 105 140 Q 105 165 80 165 L -80 165 Q -105 165 -105 140 Z" fill={VENENO} opacity={0.8} />
    <circle cx={0} cy={85} r={34} fill="#1A2A1A" />
    <rect x={-18} y={105} width={36} height={24} rx={4} fill="#1A2A1A" />
    <circle cx={-12} cy={82} r={9} fill={VENENO} />
    <circle cx={12} cy={82} r={9} fill={VENENO} />
  </g>
);

const Jeringa: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number; readonly s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-30} y={-180} width={60} height={240} rx={10} fill="#DDE6F0" opacity={0.25} stroke="#DDE6F0" strokeWidth={5} />
    <rect x={-25} y={-40} width={50} height={95} fill={C.cyan} opacity={0.6} />
    <rect x={-6} y={-260} width={12} height={90} fill="#B8C0D0" />
    <rect x={-40} y={-270} width={80} height={14} rx={6} fill="#B8C0D0" />
    <rect x={-3} y={60} width={6} height={90} fill="#B8C0D0" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Frasco x={360} y={1000} s={1.3} />
    <Jeringa x={760} y={1000} rot={20 + 3 * Math.sin(t * 2)} s={1.1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿puedes volverte inmune al veneno?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.dosis], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Dosis diminutas para volverte inmune: suena a película + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gotas = Math.floor(interpolate(t, [T.dosis, T.final], [0, 7], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.dosis, T.serpiente], [1, 1.04])}>
      <Frasco x={540} y={950} s={1.2} />
      {new Array(7).fill(0).map((_, k) => (
        <g key={k} opacity={k < gotas ? 1 : 0.15}>
          <circle cx={240 + k * 100} cy={1330} r={22} fill={VENENO} />
          <Texto x={240 + k * 100} y={1400} size={24} color={C.grey}>
            {"día " + (k + 1)}
          </Texto>
        </g>
      ))}
      <Texto x={540} y={1500} size={36} color={C.white} op={aparece(t, T.pelicula)}>
        ¿truco de película?
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el veneno que es medicina: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.serpiente], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Con algunos venenos de serpiente sí: así se hacen los antídotos (caballo -> anticuerpos -> suero)
export const Antidoto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasos: [string, number][] = [
    ["veneno en dosis pequeñas", T.caballo],
    ["el caballo fabrica anticuerpos", T.anticuerpos],
    ["con ellos se hace el suero", T.suero],
  ];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.serpiente, T.muchos], [1, 1.04])}>
        <path d="M 200 800 Q 300 720 400 800 T 600 800 T 800 800" stroke={VENENO} strokeWidth={30} fill="none" strokeLinecap="round" opacity={aparece(t, T.serpiente)} />
        <circle cx={820} cy={790} r={30} fill={VENENO} opacity={aparece(t, T.serpiente)} />
        <Texto x={540} y={640} size={40} color={VENENO} op={aparece(t, T.serpiente)}>
          venenos de serpiente
        </Texto>
        {pasos.map(([txt, tt], k) => (
          <g key={txt} opacity={aparece(t, tt)}>
            <circle cx={170} cy={1000 + k * 140} r={34} fill={C.cyan} />
            <Texto x={170} y={1012 + k * 140} size={32} color="#0A1A2A">
              {String(k + 1)}
            </Texto>
            <Texto x={580} y={1012 + k * 140} size={34} color={C.white}>
              {txt}
            </Texto>
          </g>
        ))}
        {aparece(t, T.anticuerpos) > 0
          ? new Array(6).fill(0).map((_, k) => (
              <path key={k} transform={`translate(${760 + (k % 3) * 70} ${1340 + Math.floor(k / 3) * 70}) rotate(${k * 40 + t * 30})`} d="M 0 24 L 0 0 L -16 -20 M 0 0 L 16 -20" stroke={C.cyan} strokeWidth={6} fill="none" opacity={aparece(t, T.anticuerpos)} />
            ))
          : null}
        <Texto x={300} y={1440} size={38} color={C.yellow} op={aparece(t, T.antidotos)}>
          = antídoto
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.antidotos} color={VENENO} />
    </>
  );
};

// D. Con muchos venenos no sirve: el daño se acumula. No lo intentes
export const NoSirve: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dano = interpolate(t, [T.defenderse, T.acumula + 0.8], [0.1, 0.9], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.muchos, T.toxina], [1, 1.04])}>
      <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.muchos)}>
        con muchos venenos, no sirve
      </Texto>
      <rect x={240} y={980} width={600} height={70} rx={35} fill="#2A2E3A" />
      <rect x={240} y={980} width={600 * dano} height={70} rx={35} fill={C.orange} />
      <Texto x={540} y={940} size={30} color={C.grey}>
        daño acumulado
      </Texto>
      <Texto x={540} y={1200} size={52} color={C.red} op={aparece(t, T.intentes)}>
        ¡no lo intentes!
      </Texto>
    </Lienzo>
  );
};

// Unión nervio-músculo: señal (bolitas) que pasa o se bloquea
const Union: React.FC<{ readonly t: number; readonly bloqueo: number; readonly tenso: number }> = ({ t, bloqueo, tenso }) => (
  <g>
    <path d="M 120 760 Q 300 760 420 880" stroke="#E8C870" strokeWidth={24} fill="none" />
    <ellipse cx={460} cy={920} rx={70} ry={50} fill="#E8C870" />
    {new Array(6).fill(0).map((_, k) => {
      const u = (t * 0.8 + k / 6) % 1;
      const pasa = u > 0.5 && bloqueo > 0.5 ? 0 : 1;
      return <circle key={k} cx={460 + u * 160} cy={920 + Math.sin(k * 2) * 30 + u * 80} r={10} fill={C.cyan} opacity={pasa} />;
    })}
    {bloqueo > 0 ? (
      <path d="M 520 870 L 600 1010 M 600 870 L 520 1010" stroke={C.red} strokeWidth={10} opacity={bloqueo} />
    ) : null}
    <path d={`M 560 1040 Q 760 ${1040 - 60 * tenso} 960 1040 L 960 1200 Q 760 ${1200 + 60 * tenso} 560 1200 Z`} fill="#C86A5A" />
    {new Array(5).fill(0).map((_, k) => (
      <line key={k} x1={600} y1={1070 + k * 26} x2={930} y2={1070 + k * 26} stroke="#A84A3A" strokeWidth={4} />
    ))}
  </g>
);

// E. La toxina botulínica bloquea la señal de los nervios a los músculos y los paraliza
export const Toxina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = aparece(t, T.bloquea);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.toxina, T.inyectada], [1, 1.04])}>
        <Union t={t} bloqueo={b} tenso={1 - aparece(t, T.paraliza)} />
        <Texto x={540} y={640} size={40} color={C.yellow} op={aparece(t, T.toxina)}>
          toxina botulínica
        </Texto>
        <Texto x={300} y={700} size={28} color="#E8C870" op={aparece(t, T.toxina)}>
          nervio
        </Texto>
        <Texto x={760} y={1290} size={30} color="#C86A5A">
          músculo
        </Texto>
        <Texto x={540} y={1420} size={38} color={C.white} op={b}>
          bloquea la señal del nervio
        </Texto>
        <Texto x={540} y={1500} size={42} color={C.red} op={aparece(t, T.paraliza)}>
          parálisis
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.bloquea} color={C.yellow} />
    </>
  );
};

// F. En dosis mínimas, en un solo músculo, lo relaja: es el bótox (arrugas, espasmos, migrañas)
export const Botox: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rel = aparece(t, T.relaja);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.inyectada, T.asi], [1, 1.04])}>
        <g transform="translate(540 1000)">
          <ellipse cx={0} cy={0} rx={240} ry={300} fill="#E8B48A" />
          {[-60, -20, 20].map((dy) => (
            <path key={dy} d={`M -120 ${dy - 140} Q 0 ${dy - 140 - 18 * (1 - rel)} 120 ${dy - 140}`} stroke="#B07A5A" strokeWidth={6} fill="none" opacity={1 - 0.85 * rel} />
          ))}
          <circle cx={-80} cy={-30} r={18} fill="#3A2A20" />
          <circle cx={80} cy={-30} r={18} fill="#3A2A20" />
          <path d="M -60 120 Q 0 150 60 120" stroke="#3A2A20" strokeWidth={8} fill="none" />
        </g>
        <Jeringa x={830} y={760} rot={-50} s={0.7} />
        <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.inyectada)}>
          dosis mínima, en un solo músculo
        </Texto>
        <Texto x={540} y={1400} size={56} color={C.cyan} op={aparece(t, T.botox)}>
          bótox
        </Texto>
        <Texto x={540} y={1480} size={32} color={C.white} op={aparece(t, T.arrugas)}>
          arrugas · espasmos · algunas migrañas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.botox} color={C.cyan} />
    </>
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
