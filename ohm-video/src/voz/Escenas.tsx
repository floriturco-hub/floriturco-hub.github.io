import { Easing, interpolate } from "remotion";
import { CabezaPerfil } from "../components/CabezaPerfil";
import { C, clamp, H, mono, useT, W } from "../theme";
import { BarrasEstudio, Caminos, Espectro, ManoOido, Microfono, NotaVoz, Onda } from "./Piezas";

// Instantes clave (s) de public/audio/voz/narracion.wav (voz x1,0: ya sale a ~188 ppm), sacados con Whisper
export const T = {
  mala: 2.56,
  esaEs: 3.82,
  cuando: 5.8,
  dos: 6.72,
  aire: 8.82,
  otro: 14.68,
  cuerdas: 16.46,
  interno: 21.84,
  refuerza: 23.14,
  graves: 24.42,
  micro: 27.92,
  capta: 29.16,
  audio: 31.16,
  aguda: 33.02,
  noSeParece: 34.86,
  prueba: 37.72,
  tapate: 38.64,
  casi: 40.5,
  curioso: 43.18,
  estudio: 44.18,
  noSabia: 47.68,
  asiQue: 50.3,
  rara: 53.1,
  fin: 55.1,
};

const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

const Tarjeta: React.FC<{ readonly y: number; readonly titulo: string; readonly color: string; readonly children: React.ReactNode; readonly resalte?: number }> = ({ y, titulo, color, children, resalte = 0 }) => (
  <g>
    <rect x={80} y={y} width={920} height={260} rx={24} fill={C.card} stroke={resalte > 0 ? C.yellow : C.cardBorder} strokeWidth={resalte > 0 ? 5 : 2} />
    <text x={120} y={y + 52} fill={color} fontFamily={mono} fontSize={32} fontWeight={700}>
      {titulo}
    </text>
    {children}
  </g>
);

// A. Gancho: la voz del audio es la real
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const real = aparece(t, T.esaEs);
  const flash = interpolate(t, [T.esaEs, T.esaEs + 0.08, T.esaEs + 0.45], [0, 0.25, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cuando], [1, 1.05])}>
        <NotaVoz x={540} y={330} s={1.2} t={t} progreso={interpolate(t, [0.1, T.cuando], [0, 1], clamp)} />
        <Tarjeta y={560} titulo="lo que oyes tú" color={C.orange}>
          <Onda x={140} y={720} w={800} amp={80} ciclos={3} t={t} color={C.orange} grosor={10} />
        </Tarjeta>
        <Tarjeta y={900} titulo="lo que oyen los demás" color={C.cyan} resalte={real}>
          <Onda x={140} y={1060} w={800} amp={45} ciclos={9} t={t} color={C.cyan} />
        </Tarjeta>
        <g opacity={real}>
          <path d="M 880 930 L 910 962 L 968 900" stroke={C.yellow} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={540} y={1250} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700}>
            = la del audio
          </text>
        </g>
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// B. Dos caminos: por el aire y por los huesos
export const DosCaminos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.refuerza], [1, 1.05])}>
      <g transform="translate(-80 -120)">
        <CabezaPerfil />
        <Caminos t={t} aire={aparece(t, T.aire)} hueso={aparece(t, T.otro)} />
      </g>
      <g fontFamily={mono} fontSize={32} fontWeight={700}>
        <text x={820} y={440} fill={C.cyan} opacity={aparece(t, T.aire)}>aire</text>
        <text x={430} y={1300} fill={C.orange} opacity={aparece(t, T.otro)}>huesos</text>
        <text x={180} y={700} fill={C.white} opacity={aparece(t, T.interno)}>oído interno</text>
      </g>
    </Lienzo>
  );
};

// C. El camino de los huesos refuerza los graves
export const Graves: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.refuerza, T.micro], [1, 1.04])}>
      <Espectro x={100} y={360} w={880} h={420} refuerzo={0} titulo="solo por el aire" color={C.cyan} />
      <Espectro x={100} y={860} w={880} h={420} refuerzo={interpolate(t, [T.graves, T.graves + 0.8], [0, 1], clamp)} titulo="lo que oyes tú" color={C.orange} />
    </Lienzo>
  );
};

// D. El micrófono solo capta el aire
export const Microfono_: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.micro, T.prueba], [1, 1.04])}>
      <Microfono x={260} y={620} s={1.3} />
      <g opacity={aparece(t, T.capta)}>
        <Onda x={420} y={560} w={580} amp={40} ciclos={8} t={t} color={C.cyan} />
        <text x={710} y={470} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>solo el aire</text>
      </g>
      <g opacity={aparece(t, T.audio)}>
        <NotaVoz x={540} y={1050} s={1.2} t={t} progreso={interpolate(t, [T.audio, T.prueba], [0, 1], clamp)} />
        <Onda x={140} y={1260} w={800} amp={32} ciclos={11} t={t} color={C.cyan} grosor={5} />
      </g>
    </Lienzo>
  );
};

// E. Haz la prueba: tápate los oídos
export const Prueba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.prueba, T.curioso], [1, 1.05])}>
      <g transform="translate(-80 -120)">
        <CabezaPerfil />
        <Caminos t={t} aire={0} hueso={aparece(t, T.casi - 0.6)} />
        <ManoOido op={aparece(t, T.tapate)} />
      </g>
    </Lienzo>
  );
};

// F. El estudio: les gusta más cuando no saben que es suya
export const Estudio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.curioso, T.asiQue], [1, 1.04])}>
      <g opacity={aparece(t, T.estudio)}>
        <BarrasEstudio x={540} y={820} p={interpolate(t, [T.estudio + 0.6, T.noSabia + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })} />
      </g>
    </Lienzo>
  );
};

// G. Cierre: la voz del audio es la que oyen todos
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.asiQue, T.fin + 0.5], [1, 1.06])}>
      <Tarjeta y={460} titulo="la que oyen todos" color={C.cyan} resalte={1}>
        <Onda x={140} y={620} w={800} amp={45} ciclos={9} t={t} color={C.cyan} />
      </Tarjeta>
      <g opacity={aparece(t, T.rara)}>
        <Tarjeta y={820} titulo="la que oyes tú: la rara" color={C.orange}>
          <Onda x={140} y={980} w={800} amp={80} ciclos={3} t={t} color={C.orange} grosor={10} />
        </Tarjeta>
      </g>
    </Lienzo>
  );
};
