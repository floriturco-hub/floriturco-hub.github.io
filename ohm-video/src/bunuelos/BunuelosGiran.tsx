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
  BarcoEscena,
  Caliente,
  Cierre,
  Cocina,
  Fuerzas_,
  Gancho,
  OtraCara,
  T,
} from "./Escenas";

export const INICIO_LOGO_BUNUELOS = T.fin + 0.5;
export const DURACION_BUNUELOS_S = INICIO_LOGO_BUNUELOS + 6.5;
const D = INICIO_LOGO_BUNUELOS - 61.5;

export const BunuelosGiran: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: se voltean solos" desde={0} hasta={T.cae}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Se cocina abajo" desde={T.cae} hasta={T.empuja}>
        {(t0) => <Cocina t0={t0} />}
      </Escena>
      <Escena nombre="Fuerzas" desde={T.empuja} hasta={T.barco2}>
        {(t0) => <Fuerzas_ t0={t0} />}
      </Escena>
      <Escena nombre="Barco" desde={T.barco2} hasta={T.otra}>
        {(t0) => <BarcoEscena t0={t0} />}
      </Escena>
      <Escena nombre="La otra cara" desde={T.otra} hasta={T.caliente}>
        {(t0) => <OtraCara t0={t0} />}
      </Escena>
      <Escena nombre="Demasiado caliente" desde={T.caliente} hasta={T.asi}>
        {(t0) => <Caliente t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.asi} hasta={INICIO_LOGO_BUNUELOS}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_BUNUELOS}
        hasta={DURACION_BUNUELOS_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_BUNUELOS} />}
      </Escena>

      <Etiqueta
        texto="Nadie los toca"
        desde={0.15}
        hasta={T.voltean - 0.1}
        y={1560}
        color={C.white}
        tamano={54}
      />
      <Etiqueta
        texto="Y se voltean solos"
        desde={T.voltean}
        hasta={T.magia - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="No es magia"
        desde={T.magia}
        hasta={T.cae - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Abajo se cocina primero"
        desde={T.abajo}
        hasta={T.vapor - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="El agua sale en vapor"
        desde={T.vapor}
        hasta={T.liviana - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Abajo: más liviana"
        desde={T.liviana}
        hasta={T.cruda - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Arriba: cruda y pesada"
        desde={T.cruda}
        hasta={T.empuja - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Empuje desde el centro"
        desde={T.centro}
        hasta={T.peso - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Peso concentrado arriba"
        desde={T.peso}
        hasta={T.barco2 - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Carga en el techo"
        desde={T.techo}
        hasta={T.girar - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Gira hasta quedar abajo"
        desde={T.girar}
        hasta={T.otra - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Se cocina la otra cara"
        desde={T.otra}
        hasta={T.vueltas - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Y vuelve a girar"
        desde={T.vueltas}
        hasta={T.dorado - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Dorado parejo"
        desde={T.dorado}
        hasta={T.caliente - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Aceite muy caliente"
        desde={T.caliente}
        hasta={T.revienta - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="El vapor no sale"
        desde={T.revienta}
        hasta={T.pum - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Se revienta"
        desde={T.pum}
        hasta={T.asi - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Si giran solos"
        desde={T.asi}
        hasta={T.punto - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Aceite en su punto"
        desde={T.punto}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={56}
      />

      <Audio src={staticFile("audio/bunuelos/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_BUNUELOS - 0.3,
              INICIO_LOGO_BUNUELOS + 0.7,
              DURACION_BUNUELOS_S - 1.5,
              DURACION_BUNUELOS_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.voltean, T.liviana, T.peso, T.abajo2, T.aligera + 0.6, T.pum].map(
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
