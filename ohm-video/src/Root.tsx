import { Composition } from "remotion";
import { AguaVideo, DURACION_AGUA_S } from "./agua/AguaVideo";
import { AspiradoraVideo, DURACION_ASPIRADORA_S } from "./aspiradora/AspiradoraVideo";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { CosquillasVideo, DURACION_COSQUILLAS_S } from "./cosquillas/CosquillasVideo";
import { DURACION_GPS_S, GpsVideo } from "./gps/GpsVideo";
import { LeyDeOhm } from "./LeyDeOhm";
import { DURACION_MARTIN_S, MartingalaVideo } from "./martingala/MartingalaVideo";
import { DURACION_LIVE_S, LiveVideo } from "./live/LiveVideo";
import { DURACION_LUZ_S, LuzVideo } from "./luz/LuzVideo";
import { MicroondasVideo } from "./microondas/MicroondasVideo";
import { DURACION_NARIZ_S, NarizVideo } from "./nariz/NarizVideo";
import { OllaPresion } from "./olla/OllaPresion";
import { DURACION_SMOOTHIE_S, SmoothieVideo } from "./smoothie/SmoothieVideo";
import { DURACION_PARALISIS_S, ParalisisVideo } from "./paralisis/ParalisisVideo";
import { DURACION_PECHO_S, PechoVideo } from "./pecho/PechoVideo";
import { DURACION_PINA_S, PinaVideo } from "./pina/PinaVideo";
import { DURACION_PREMIUM_S, PremiumVideo } from "./premium/PremiumVideo";
import { DURACION_ORINAR_S, OrinarVideo } from "./orinar/OrinarVideo";
import { DURACION_MANCHAS_S, ManchasVideo } from "./manchas/ManchasVideo";
import { DURACION_VINO_S, VinoVideo } from "./vino/VinoVideo";
import { BotonesVideo, DURACION_BOTONES_S } from "./botones/BotonesVideo";
import { DURACION_PASTA_S, PastaVideo } from "./pasta/PastaVideo";
import { DURACION_REVELADO_S, ReveladoVideo } from "./revelado/ReveladoVideo";
import { DURACION_INTESTINO_S, IntestinoVideo } from "./intestino/IntestinoVideo";
import { DedosVideo, DURACION_DEDOS_S } from "./dedos/DedosVideo";
import { DURACION_GFCI_S, GfciVideo } from "./gfci/GfciVideo";
import { DURACION_MIEL_S, MielVideo } from "./miel/MielVideo";
import { DURACION_TACTIL_S, TactilVideo } from "./tactil/TactilVideo";
import { DURACION_INDUCCION_S, InduccionVideo } from "./induccion/InduccionVideo";
import { DURACION_PLANTA_S, PlantaVideo } from "./planta/PlantaVideo";
import { DURACION_GRILLO_S, GrilloVideo } from "./grillo/GrilloVideo";
import { CamaronVideo, DURACION_CAMARON_S } from "./camaron/CamaronVideo";
import { DURACION_MOSQUITO_S, MosquitoVideo } from "./mosquito/MosquitoVideo";
import { DURACION_SACUDIDA_S, SacudidaVideo } from "./sacudida/SacudidaVideo";
import { DURACION_PAJARO_S, PajaroCable } from "./pajaro/PajaroCable";
import { AnguilaVideo, DURACION_ANGUILA_S } from "./anguila/AnguilaVideo";
import { DURACION_PASTILLA_S, PastillaVideo } from "./pastilla/PastillaVideo";

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
      <Composition
        id="Luz"
        component={LuzVideo}
        durationInFrames={Math.round(DURACION_LUZ_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Pecho"
        component={PechoVideo}
        durationInFrames={Math.round(DURACION_PECHO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Pina"
        component={PinaVideo}
        durationInFrames={Math.round(DURACION_PINA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Live"
        component={LiveVideo}
        durationInFrames={Math.round(DURACION_LIVE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Martingala"
        component={MartingalaVideo}
        durationInFrames={Math.round(DURACION_MARTIN_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Premium"
        component={PremiumVideo}
        durationInFrames={Math.round(DURACION_PREMIUM_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Orinar"
        component={OrinarVideo}
        durationInFrames={Math.round(DURACION_ORINAR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Manchas"
        component={ManchasVideo}
        durationInFrames={Math.round(DURACION_MANCHAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Vino"
        component={VinoVideo}
        durationInFrames={Math.round(DURACION_VINO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Botones"
        component={BotonesVideo}
        durationInFrames={Math.round(DURACION_BOTONES_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Pasta"
        component={PastaVideo}
        durationInFrames={Math.round(DURACION_PASTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Revelado"
        component={ReveladoVideo}
        durationInFrames={Math.round(DURACION_REVELADO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Intestino"
        component={IntestinoVideo}
        durationInFrames={Math.round(DURACION_INTESTINO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DedosArrugados"
        component={DedosVideo}
        durationInFrames={Math.round(DURACION_DEDOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EnchufeGfci"
        component={GfciVideo}
        durationInFrames={Math.round(DURACION_GFCI_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MielEterna"
        component={MielVideo}
        durationInFrames={Math.round(DURACION_MIEL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PantallaTactil"
        component={TactilVideo}
        durationInFrames={Math.round(DURACION_TACTIL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Induccion"
        component={InduccionVideo}
        durationInFrames={Math.round(DURACION_INDUCCION_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PlantaCarnivora"
        component={PlantaVideo}
        durationInFrames={Math.round(DURACION_PLANTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GrilloTermometro"
        component={GrilloVideo}
        durationInFrames={Math.round(DURACION_GRILLO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CamaronMantis"
        component={CamaronVideo}
        durationInFrames={Math.round(DURACION_CAMARON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MosquitoAgujas"
        component={MosquitoVideo}
        durationInFrames={Math.round(DURACION_MOSQUITO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnguilaElectrica"
        component={AnguilaVideo}
        durationInFrames={Math.round(DURACION_ANGUILA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PastillaDolor"
        component={PastillaVideo}
        durationInFrames={Math.round(DURACION_PASTILLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
