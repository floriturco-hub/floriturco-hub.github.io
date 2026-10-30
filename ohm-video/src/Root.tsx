import { Composition } from "remotion";
import { AguaCobro, DURACION_AGUA_S } from "./agua/AguaCobro";
import { AntenaNasa, DURACION_ANTENA_S } from "./antena/AntenaNasa";
import { DURACION_APPLE_S, PortatilTienda } from "./apple/PortatilTienda";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { DURACION_INSTANTE_S, LuzInstante } from "./instante/LuzInstante";
import { LeyDeOhm } from "./LeyDeOhm";
import { DURACION_INSERTO_S, InsertoVioleta } from "./luminous/InsertoVioleta";
import { MicroondasVideo } from "./microondas/MicroondasVideo";
import { OllaPresion } from "./olla/OllaPresion";
import { DURACION_PAJARO_S, PajaroCable } from "./pajaro/PajaroCable";
import { DURACION_PINA_S, PinaMito } from "./pina/PinaMito";
import { DURACION_RELOJ_S, RelojCuarzo } from "./reloj/RelojCuarzo";
import { CabezaPerfilPreview } from "./components/CabezaPerfil";
import { DURACION_TINNITUS_S, Tinnitus } from "./tinnitus/Tinnitus";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LeyDeOhm"
        component={LeyDeOhm}
        durationInFrames={2040}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BateriaDescargada"
        component={BateriaDescargada}
        durationInFrames={2040}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OllaPresion"
        component={OllaPresion}
        durationInFrames={1875}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Microondas"
        component={MicroondasVideo}
        durationInFrames={2022}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PajaroCable"
        component={PajaroCable}
        durationInFrames={Math.round(DURACION_PAJARO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LuzInstante"
        component={LuzInstante}
        durationInFrames={Math.round(DURACION_INSTANTE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Tinnitus"
        component={Tinnitus}
        durationInFrames={Math.round(DURACION_TINNITUS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AntenaNasa"
        component={AntenaNasa}
        durationInFrames={Math.round(DURACION_ANTENA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AguaCobro"
        component={AguaCobro}
        durationInFrames={Math.round(DURACION_AGUA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RelojCuarzo"
        component={RelojCuarzo}
        durationInFrames={Math.round(DURACION_RELOJ_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PinaMito"
        component={PinaMito}
        durationInFrames={Math.round(DURACION_PINA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PortatilTienda"
        component={PortatilTienda}
        durationInFrames={Math.round(DURACION_APPLE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InsertoVioleta"
        component={InsertoVioleta}
        durationInFrames={DURACION_INSERTO_S * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CabezaPerfil"
        component={CabezaPerfilPreview}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
