import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/estornudo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  estornudas: 2.40, // estornudas
  cierran: 3.84, // cierran
  final: 5.04, // final
  reflejo: 8.48, // reflejo
  dispara: 9.40, // dispara
  tronco: 9.88, // tronco
  irrita: 11.36, // irrita
  activa: 12.48, // activa
  musculos: 14.08, // musculos
  pecho: 14.92, // pecho
  garganta: 15.58, // garganta
  parpados: 17.50, // parpados
  cerrar: 18.40, // cerrar
  protegerlos: 21.12, // protegerlos
  pero: 22.94, // pero
  saldrian: 23.60, // saldrian
  presion: 25.60, // presion
  pecho2: 27.18, // pecho
  detras: 29.22, // detras
  personas: 30.76, // personas
  abiertos: 33.08, // abiertos
  porEso: 33.84, // por
  fin: 35.20, // FIN
};

const PIEL = "#E0A888";

// Cara de frente; ojos 0 = abiertos, 1 = cerrados; achu = boca abierta + gotitas
const Cara: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly ojos: number; readonly achu?: number; readonly t?: number }> = ({ x, y, s = 1, ojos, achu = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={230} ry={280} fill={PIEL} />
    <path d="M -230 -60 C -240 -300 240 -300 230 -60 C 150 -180 -150 -180 -230 -60 Z" fill="#4A3A2A" />
    {[-90, 90].map((dx) =>
      ojos < 0.5 ? (
        <g key={dx}>
          <ellipse cx={dx} cy={-20} rx={44} ry={30} fill="#fff" />
          <circle cx={dx} cy={-20} r={18} fill="#3A2A22" />
        </g>
      ) : (
        <path key={dx} d={`M ${dx - 44} -20 Q ${dx} 0 ${dx + 44} -20`} stroke="#3A2A22" strokeWidth={10} fill="none" strokeLinecap="round" />
      ),
    )}
    <path d="M 0 0 L -26 90 L 26 90 Z" fill="#C88868" />
    {achu > 0 ? <ellipse cx={0} cy={160} rx={70 * achu} ry={50 * achu} fill="#6A2A2A" /> : <path d="M -60 160 Q 0 190 60 160" stroke="#8A4A3A" strokeWidth={10} fill="none" />}
    {achu > 0
      ? new Array(14).fill(0).map((_, k) => {
          const u = (t * 1.2 + k / 14) % 1;
          const a = -0.5 + (k / 14) * 1.0 + Math.PI / 2;
          return <circle key={k} cx={Math.cos(a) * (80 + u * 300)} cy={160 + Math.sin(a) * (40 + u * 200)} r={8} fill="#C8E8FF" opacity={achu * (1 - u)} />;
        })
      : null}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cara x={540} y={980} ojos={1} achu={1} t={t} />
    <Texto x={860} y={640} size={60} color={C.yellow}>
      ¡ACHÚ!
    </Texto>
    <Texto x={220} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué se cierran estos ojos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.estornudas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Cada vez que estornudas, los ojos se te cierran solos + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ach = t > T.estornudas + 0.4 ? 1 : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.estornudas, T.reflejo], [1, 1.04])}>
      <Cara x={540} y={980} ojos={ach} achu={ach} t={t} />
      <Texto x={540} y={1400} size={42} color={C.yellow} op={aparece(t, T.cierran)}>
        los ojos se cierran solos
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿se te saldrían los ojos?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.reflejo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Cabeza de perfil con cerebro y tronco
const Perfil: React.FC<{ readonly t: number; readonly tronco: number; readonly senal: number }> = ({ t, tronco, senal }) => (
  <g>
    <path d="M 300 1300 L 300 1150 Q 200 1100 220 900 Q 240 640 520 620 Q 800 620 820 860 L 860 960 L 820 980 L 830 1060 Q 780 1120 700 1110 L 680 1300 Z" fill={PIEL} />
    <path d="M 300 870 C 280 700 420 650 540 660 C 700 660 760 760 740 860 C 700 920 600 900 540 920 C 440 940 320 940 300 870 Z" fill="#E8A0B0" />
    <path d="M 480 920 Q 470 1000 440 1080" stroke={C.yellow} strokeWidth={36} fill="none" opacity={0.3 + 0.7 * tronco} strokeLinecap="round" />
    {senal > 0
      ? new Array(4).fill(0).map((_, k) => {
          const u = (t * 0.9 + k / 4) % 1;
          return <circle key={k} cx={840 - u * 360} cy={960 - u * 20} r={12} fill={C.yellow} opacity={senal * (1 - u * 0.5)} />;
        })
      : null}
  </g>
);

// C. El estornudo es un reflejo: lo dispara el tronco del cerebro cuando algo irrita la nariz
export const Reflejo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.reflejo, T.activa], [1, 1.04])}>
        <Perfil t={t} tronco={aparece(t, T.tronco)} senal={aparece(t, T.irrita)} />
        <Texto x={540} y={540} size={52} color={C.yellow} op={aparece(t, T.reflejo)}>
          reflejo
        </Texto>
        <Texto x={300} y={1380} size={36} color={C.yellow} op={aparece(t, T.tronco)}>
          tronco del cerebro
        </Texto>
        <Texto x={860} y={1180} size={34} color={C.white} op={aparece(t, T.irrita)}>
          nariz irritada
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.reflejo} color={C.yellow} />
    </>
  );
};

// D. Activa a la vez muchos músculos: pecho, garganta, cara y párpados; cerrar los ojos viene en el paquete
export const Musculos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zonas: [number, number, number, number, string][] = [
    [540, 1250, 220, T.pecho, "pecho"],
    [540, 1010, 70, T.garganta, "garganta"],
    [540, 820, 150, T.garganta + 0.6, "cara"],
    [540, 760, 90, T.parpados, "párpados"],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.activa, T.pero], [1, 1.04])}>
      <ellipse cx={540} cy={800} rx={150} ry={180} fill={PIEL} />
      <rect x={490} y={960} width={100} height={90} fill={PIEL} />
      <path d="M 300 1500 L 320 1100 Q 330 1050 420 1040 L 660 1040 Q 750 1050 760 1100 L 780 1500 Z" fill="#4A6AC8" />
      {zonas.map(([x, y, r, tt, nom], k) => (
        <g key={k} opacity={aparece(t, tt)}>
          <circle cx={x} cy={y} r={r} fill={C.yellow} opacity={0.25 + 0.15 * Math.sin(t * 8 + k)} />
          <Texto x={k % 2 ? 860 : 220} y={y + 10} size={32} color={C.yellow}>
            {nom}
          </Texto>
        </g>
      ))}
      <Texto x={540} y={560} size={40} color={C.white} op={aparece(t, T.musculos)}>
        muchos músculos a la vez
      </Texto>
      <Texto x={540} y={1600} size={36} color={C.cyan} op={aparece(t, T.protegerlos)}>
        ¿para proteger los ojos?
      </Texto>
    </Lienzo>
  );
};

// E. No se saldrían: la presión está en el pecho y las vías respiratorias, no detrás de los ojos
export const Mito: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.personas], [1, 1.04])}>
        <g opacity={1 - aparece(t, T.presion)}>
          <ellipse cx={540} cy={900} rx={180} ry={120} fill="#fff" />
          <circle cx={540} cy={900} r={70} fill="#3A2A22" />
          <Texto x={540} y={1150} size={46} color={C.white} op={aparece(t, T.saldrian)}>
            ¿se saldrían?
          </Texto>
          <Texto x={540} y={1250} size={60} color={C.red} op={aparece(t, T.saldrian + 0.6)}>
            ✗ mito
          </Texto>
        </g>
        <g opacity={aparece(t, T.presion)}>
          <path d="M 540 700 L 540 860 M 540 860 Q 460 880 420 960 M 540 860 Q 620 880 660 960" stroke="#E8A0B0" strokeWidth={24} fill="none" />
          <path d="M 410 940 Q 300 960 300 1150 Q 320 1320 460 1300 Q 500 1100 470 960 Z" fill="#E8A0B0" />
          <path d="M 670 940 Q 780 960 780 1150 Q 760 1320 620 1300 Q 580 1100 610 960 Z" fill="#E8A0B0" />
          <circle cx={540} cy={1080} r={260 + 20 * Math.sin(t * 6)} fill="none" stroke={C.yellow} strokeWidth={8} strokeDasharray="16 12" opacity={aparece(t, T.pecho2)} />
          <Texto x={540} y={600} size={40} color={C.yellow}>
            la presión está aquí
          </Texto>
          <Texto x={540} y={1440} size={38} color={C.white} op={aparece(t, T.detras)}>
            no detrás de los ojos
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.presion} color={C.yellow} />
    </>
  );
};

// F. Algunas personas logran estornudar con los ojos abiertos
export const Abiertos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.personas, T.porEso], [1, 1.04])}>
      <Cara x={540} y={980} ojos={0} achu={aparece(t, T.abiertos - 0.5)} t={t} />
      <Texto x={540} y={1400} size={40} color={C.cyan} op={aparece(t, T.abiertos)}>
        ¡con los ojos abiertos!
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
