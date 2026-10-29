import { Composition } from "remotion";
import { AguaVideo, DURACION_AGUA_S } from "./agua/AguaVideo";
import { AspiradoraVideo, DURACION_ASPIRADORA_S } from "./aspiradora/AspiradoraVideo";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { CosquillasVideo, DURACION_COSQUILLAS_S } from "./cosquillas/CosquillasVideo";
import { DURACION_GPS_S, GpsVideo } from "./gps/GpsVideo";
import { LeyDeOhm } from "./LeyDeOhm";
import { MicroondasVideo } from "./microondas/MicroondasVideo";
import { DURACION_NARIZ_S, NarizVideo } from "./nariz/NarizVideo";
import { OllaPresion } from "./olla/OllaPresion";
import { DURACION_SMOOTHIE_S, SmoothieVideo } from "./smoothie/SmoothieVideo";
import { DURACION_PARALISIS_S, ParalisisVideo } from "./paralisis/ParalisisVideo";
import { DURACION_SACUDIDA_S, SacudidaVideo } from "./sacudida/SacudidaVideo";
import { DURACION_PAJARO_S, PajaroCable } from "./pajaro/PajaroCable";

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
        id="Aspiradora"
        component={AspiradoraVideo}
        durationInFrames={Math.round(DURACION_ASPIRADORA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Gps"
        component={GpsVideo}
        durationInFrames={Math.round(DURACION_GPS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Nariz"
        component={NarizVideo}
        durationInFrames={Math.round(DURACION_NARIZ_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Sacudida"
        component={SacudidaVideo}
        durationInFrames={Math.round(DURACION_SACUDIDA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Paralisis"
        component={ParalisisVideo}
        durationInFrames={Math.round(DURACION_PARALISIS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Smoothie"
        component={SmoothieVideo}
        durationInFrames={Math.round(DURACION_SMOOTHIE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Cosquillas"
        component={CosquillasVideo}
        durationInFrames={Math.round(DURACION_COSQUILLAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Agua"
        component={AguaVideo}
        durationInFrames={Math.round(DURACION_AGUA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
