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
import { DURACION_MORETON_S, MoretonVideo } from "./moreton/MoretonVideo";
import { BracketsVideo, DURACION_BRACKETS_S } from "./brackets/BracketsVideo";
import { AgresionVideo, DURACION_AGRESION_S } from "./agresion/AgresionVideo";
import { DURACION_INTERNET_S, InternetVideo } from "./internet/InternetVideo";
import { ConcretoVideo, DURACION_CONCRETO_S } from "./concreto/ConcretoVideo";
import { DURACION_PILARES_S, PilaresVideo } from "./pilares/PilaresVideo";
import { DURACION_EXTINTOR_S, ExtintorVideo } from "./extintor/ExtintorVideo";
import { DURACION_OJOSGATO_S, OjosGatoVideo } from "./ojosgato/OjosGatoVideo";
import { DURACION_POLILLA_S, PolillaVideo } from "./polilla/PolillaVideo";
import { DURACION_IMPRESORA_S, ImpresoraVideo } from "./impresora/ImpresoraVideo";
import { BrocheVideo, DURACION_BROCHE_S } from "./broche/BrocheVideo";
import { CaptchaVideo, DURACION_CAPTCHA_S } from "./captcha/CaptchaVideo";
import { BoliVideo, DURACION_BOLI_S } from "./boli/BoliVideo";
import { DURACION_SUPERP_S, SuperpVideo } from "./superp/SuperpVideo";
import { DURACION_GOMA_S, GomaVideo } from "./goma/GomaVideo";
import { CintaVideo, DURACION_CINTA_S } from "./cinta/CintaVideo";
import { DURACION_PISA_S, PisaVideo } from "./pisa/PisaVideo";
import { DetectorVideo, DURACION_DETECTOR_S } from "./detector/DetectorVideo";
import { DURACION_SERIE_S, SerieVideo } from "./serie/SerieVideo";
import { DURACION_BASCULA_S, BasculaVideo } from "./bascula/BasculaVideo";
import { DURACION_CERRADURA_S, CerraduraVideo } from "./cerradura/CerraduraVideo";
import { DURACION_ALGODON_S, AlgodonVideo } from "./algodon/AlgodonVideo";
import { DURACION_HELIO_S, HelioVideo } from "./helio/HelioVideo";
import { DURACION_AUTOTUNE_S, AutoTuneVideo } from "./autotune/AutoTuneVideo";
import { DURACION_SOBRE_S, SobreVideo } from "./sobre/SobreVideo";
import { DURACION_NITINOL_S, NitinolVideo } from "./nitinol/NitinolVideo";
import { DURACION_ACHOO_S, AchooVideo } from "./achoo/AchooVideo";

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
      <Composition
        id="MoretonColores"
        component={MoretonVideo}
        durationInFrames={Math.round(DURACION_MORETON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BracketsHueso"
        component={BracketsVideo}
        durationInFrames={Math.round(DURACION_BRACKETS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AgresionTierna"
        component={AgresionVideo}
        durationInFrames={Math.round(DURACION_AGRESION_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InternetSubmarino"
        component={InternetVideo}
        durationInFrames={Math.round(DURACION_INTERNET_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ConcretoAcero"
        component={ConcretoVideo}
        durationInFrames={Math.round(DURACION_CONCRETO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PilaresAgua"
        component={PilaresVideo}
        durationInFrames={Math.round(DURACION_PILARES_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ExtintorSarten"
        component={ExtintorVideo}
        durationInFrames={Math.round(DURACION_EXTINTOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OjosGato"
        component={OjosGatoVideo}
        durationInFrames={Math.round(DURACION_OJOSGATO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PolillaAntirreflejo"
        component={PolillaVideo}
        durationInFrames={Math.round(DURACION_POLILLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ImpresoraPuntos"
        component={ImpresoraVideo}
        durationInFrames={Math.round(DURACION_IMPRESORA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BrocheAntirrobo"
        component={BrocheVideo}
        durationInFrames={Math.round(DURACION_BROCHE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CaptchaRobot"
        component={CaptchaVideo}
        durationInFrames={Math.round(DURACION_CAPTCHA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BoligrafoBola"
        component={BoliVideo}
        durationInFrames={Math.round(DURACION_BOLI_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Superpegamento"
        component={SuperpVideo}
        durationInFrames={Math.round(DURACION_SUPERP_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GomaBorrar"
        component={GomaVideo}
        durationInFrames={Math.round(DURACION_GOMA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CintaAdhesiva"
        component={CintaVideo}
        durationInFrames={Math.round(DURACION_CINTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TorrePisa"
        component={PisaVideo}
        durationInFrames={Math.round(DURACION_PISA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DetectorMentiras"
        component={DetectorVideo}
        durationInFrames={Math.round(DURACION_DETECTOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NumeroSerie"
        component={SerieVideo}
        durationInFrames={Math.round(DURACION_SERIE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BasculaDigital"
        component={BasculaVideo}
        durationInFrames={Math.round(DURACION_BASCULA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CerraduraHotel"
        component={CerraduraVideo}
        durationInFrames={Math.round(DURACION_CERRADURA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AlgodonAzucar"
        component={AlgodonVideo}
        durationInFrames={Math.round(DURACION_ALGODON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HelioVoz"
        component={HelioVideo}
        durationInFrames={Math.round(DURACION_HELIO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AutoTune"
        component={AutoTuneVideo}
        durationInFrames={Math.round(DURACION_AUTOTUNE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AguaSobreenfriada"
        component={SobreVideo}
        durationInFrames={Math.round(DURACION_SOBRE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Nitinol"
        component={NitinolVideo}
        durationInFrames={Math.round(DURACION_NITINOL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EstornudoSol"
        component={AchooVideo}
        durationInFrames={Math.round(DURACION_ACHOO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
