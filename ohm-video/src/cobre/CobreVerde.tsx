import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import {
  Cierre,
  EscudoPatina,
  Estatua1906,
  Europa,
  Gancho,
  PorQue,
  Reaccion,
  T,
} from "./Escenas";
import { PATINA } from "./Piezas";

export const INICIO_LOGO_COBRE = T.fin + 0.5;
export const DURACION_COBRE_S = INICIO_LOGO_COBRE + 6.5;
const D = INICIO_LOGO_COBRE - 61.5;
const COBRE_TXT = "#FFB880";

export const CobreVerde: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: no siempre fue verde" desde={0} hasta={T.techos}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Techos de Europa" desde={T.techos} hasta={T.cobre}>
        {(t0) => <Europa t0={t0} />}
      </Escena>
      <Escena nombre="Por qué cobre" desde={T.cobre} hasta={T.pero}>
        {(t0) => <PorQue t0={t0} />}
      </Escena>
      <Escena nombre="Reacción" desde={T.pero} hasta={T.estatua}>
        {(t0) => <Reaccion t0={t0} />}
      </Escena>
      <Escena nombre="Estatua 1906" desde={T.estatua} hasta={T.menos}>
        {(t0) => <Estatua1906 t0={t0} />}
      </Escena>
      <Escena nombre="Escudo" desde={T.menos} hasta={T.asi}>
        {(t0) => <EscudoPatina t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.asi} hasta={INICIO_LOGO_COBRE}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_COBRE} hasta={DURACION_COBRE_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_COBRE} />}
      </Escena>

      <Etiqueta
        texto="No siempre fue verde"
        desde={0.15}
        hasta={T.cuando - 0.1}
        y={1560}
        color={PATINA}
        tamano={54}
      />
      <Etiqueta
        texto="Brillaba como una moneda"
        desde={T.cuando}
        hasta={T.techos - 0.1}
        y={1560}
        color={COBRE_TXT}
        tamano={50}
      />
      <Etiqueta
        texto="Y los techos de Europa"
        desde={T.techos}
        hasta={T.cobre - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Son de cobre"
        desde={T.cobre}
        hasta={T.catedrales - 0.1}
        y={1560}
        color={COBRE_TXT}
      />
      <Etiqueta
        texto="Catedrales y cúpulas"
        desde={T.catedrales}
        hasta={T.pero - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Reacciona con el aire"
        desde={T.reacciona}
        hasta={T.oscurece - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Primero se oscurece"
        desde={T.oscurece}
        hasta={T.despues - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Lluvia, CO2 y azufre"
        desde={T.lluvia}
        hasta={T.verde2 - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="La pátina verde"
        desde={T.verde2}
        hasta={T.estatua - 0.1}
        y={1560}
        color={PATINA}
        tamano={56}
      />
      <Etiqueta
        texto="Unos 20 años"
        desde={T.veinte}
        hasta={T.pintarla - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Casi la pintan"
        desde={T.pintarla}
        hasta={T.protesto - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="La gente protestó"
        desde={T.protesto}
        hasta={T.menos - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="No es suciedad"
        desde={T.suciedad}
        hasta={T.escudo - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Es un escudo"
        desde={T.escudo}
        hasta={T.piel - 0.1}
        y={1560}
        color={PATINA}
        tamano={56}
      />
      <Etiqueta
        texto="Piel de menos de 3 mm"
        desde={T.tres}
        hasta={T.asi - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="No es óxido que destruye"
        desde={T.asi}
        hasta={T.protegiendo - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="El cobre se protege"
        desde={T.protegiendo}
        hasta={T.fin + 0.4}
        y={1560}
        color={PATINA}
        tamano={56}
      />

      <Audio src={staticFile("audio/cobre/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_COBRE - 0.3,
              INICIO_LOGO_COBRE + 0.7,
              DURACION_COBRE_S - 1.5,
              DURACION_COBRE_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[
        T.cuando - 0.1,
        T.oscurece,
        T.patina,
        T.protesto,
        T.escudo,
        T.protegiendo,
      ].map((tc) => (
        <Sequence
          key={tc}
          name="Tic"
          from={Math.round(tc * fps)}
          durationInFrames={Math.round(0.3 * fps)}
        >
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
        </Sequence>
      ))}
      <Sequence
        name="SFX logo"
        from={Math.round((62.35 + D) * fps)}
        durationInFrames={Math.round(2.9 * fps)}
      >
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence
        name="Voz: Frecuencia Cero"
        from={Math.round((63.75 + D) * fps)}
        durationInFrames={Math.round(1.7 * fps)}
      >
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
