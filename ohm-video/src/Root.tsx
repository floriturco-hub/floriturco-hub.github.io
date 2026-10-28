import { Composition } from "remotion";
import { LeyDeOhm } from "./LeyDeOhm";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LeyDeOhm"
      component={LeyDeOhm}
      durationInFrames={2040}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
