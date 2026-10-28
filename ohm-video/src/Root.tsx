import { Composition } from "remotion";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { DURACION_INSTANTE_S, LuzInstante } from "./instante/LuzInstante";
import { LeyDeOhm } from "./LeyDeOhm";
import { MicroondasVideo } from "./microondas/MicroondasVideo";
import { OllaPresion } from "./olla/OllaPresion";
import { DURACION_PAJARO_S, PajaroCable } from "./pajaro/PajaroCable";
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
    </>
  );
};
