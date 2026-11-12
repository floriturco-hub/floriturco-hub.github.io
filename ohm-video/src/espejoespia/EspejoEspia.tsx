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
import { Cierre, Espia, Falla, Gancho, Luz, Normal, T } from "./Escenas";

export const INICIO_LOGO_ESPIA = T.fin + 0.5;
export const DURACION_ESPIA_S = INICIO_LOGO_ESPIA + 6.5;
const D = INICIO_LOGO_ESPIA - 61.5;

export const EspejoEspia: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: el dedo toca" desde={0} hasta={T.normal}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Espejo normal" desde={T.normal} hasta={T.espia}>
        {(t0) => <Normal t0={t0} />}
      </Escena>
      <Escena nombre="Espejo espía" desde={T.espia} hasta={T.falla}>
        {(t0) => <Espia t0={t0} />}
      </Escena>
      <Escena nombre="La prueba falla" desde={T.falla} hasta={T.luz}>
        {(t0) => <Falla t0={t0} />}
      </Escena>
      <Escena nombre="La luz" desde={T.luz} hasta={T.protege}>
        {(t0) => <Luz t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.protege} hasta={INICIO_LOGO_ESPIA}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_ESPIA} hasta={DURACION_ESPIA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ESPIA} />}
      </Escena>

      <Etiqueta
        texto="Pon el dedo en el espejo"
        desde={0.15}
        hasta={T.toca - 0.1}
        y={1560}
        color={C.white}
        tamano={50}
      />
      <Etiqueta
        texto="Si toca su reflejo…"
        desde={T.toca}
        hasta={T.dicen - 0.1}
        y={1560}
        color={C.yellow}
        tamano={54}
      />
      <Etiqueta
        texto="¿Te están mirando?"
        desde={T.dicen}
        hasta={T.verdad - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Solo en parte"
        desde={T.parte}
        hasta={T.normal - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Capa por detrás"
        desde={T.detras}
        hasta={T.espacio2 - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Hay un espacio"
        desde={T.espacio2}
        hasta={T.espia - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Capa por delante"
        desde={T.delante}
        hasta={T.toca2 - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="El dedo toca su reflejo"
        desde={T.toca2}
        hasta={T.falla - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Pero la prueba falla"
        desde={T.falla}
        hasta={T.luz - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="La clave es la luz"
        desde={T.luz}
        hasta={T.oscuro - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="El otro lado, más oscuro"
        desde={T.oscuro}
        hasta={T.apaga - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Linterna pegada al espejo"
        desde={T.linterna}
        hasta={T.tunel - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Túnel con las manos"
        desde={T.tunel}
        hasta={T.cuarto - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="¿Ves un cuarto?"
        desde={T.cuarto}
        hasta={T.protege - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="El dedo no te protege"
        desde={T.protege}
        hasta={T.luzSi - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="La luz, sí"
        desde={T.luzSi}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={64}
      />

      <Audio src={staticFile("audio/espejo-espia/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_ESPIA - 0.3,
              INICIO_LOGO_ESPIA + 0.7,
              DURACION_ESPIA_S - 1.5,
              DURACION_ESPIA_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.toca + 0.4, T.mirando, T.espacio2, T.toca2, T.falla, T.cuarto].map(
        (tc) => (
          <Sequence
            key={tc}
            name="Tic"
            from={Math.round(tc * fps)}
            durationInFrames={Math.round(0.3 * fps)}
          >
            <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
          </Sequence>
        ),
      )}
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
