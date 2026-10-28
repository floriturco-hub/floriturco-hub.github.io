import { Composition } from "remotion";
import { AspiradoraVideo, DURACION_ASPIRADORA_S } from "./aspiradora/AspiradoraVideo";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { LeyDeOhm } from "./LeyDeOhm";
import { MicroondasVideo } from "./microondas/MicroondasVideo";
import { OllaPresion } from "./olla/OllaPresion";
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
    </>
  );
};
