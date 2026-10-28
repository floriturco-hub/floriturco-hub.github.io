import { Composition } from "remotion";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { LeyDeOhm } from "./LeyDeOhm";

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
    </>
  );
};
