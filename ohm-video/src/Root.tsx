import { Composition } from "remotion";
import { AguaCobro, DURACION_AGUA_S } from "./agua/AguaCobro";
import { AntenaNasa, DURACION_ANTENA_S } from "./antena/AntenaNasa";
import { DURACION_APPLE_S, PortatilTienda } from "./apple/PortatilTienda";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { DURACION_CINCO_S, ReglaCinco } from "./cinco/ReglaCinco";
import { DURACION_ESPEJO_S, EspejoMito } from "./espejo/EspejoMito";
import { DURACION_IBU_S, IbuprofenoGenerico } from "./ibuprofeno/IbuprofenoGenerico";
import { DURACION_GAS_S, GasolinaCorte } from "./gasolina/GasolinaCorte";
import { DURACION_HUESOS_S, HuesosRenuevan } from "./huesos/HuesosRenuevan";
import { DURACION_LENGUA_S, MapaLengua } from "./lengua/MapaLengua";
import { DURACION_HIGADO_S, HigadoRegenera } from "./higado/HigadoRegenera";
import { CobreVerde, DURACION_COBRE_S } from "./cobre/CobreVerde";
import { BunuelosGiran, DURACION_BUNUELOS_S } from "./bunuelos/BunuelosGiran";
import { DURACION_BIMETAL_S, TiraBimetalica } from "./bimetal/TiraBimetalica";
import { DURACION_CONTACTLESS_S, TarjetaContactless } from "./contactless/TarjetaContactless";
import { AmnesiaInfantil, DURACION_AMNESIA_S } from "./amnesia/AmnesiaInfantil";
import { DURACION_ESPIA_S, EspejoEspia } from "./espejoespia/EspejoEspia";
import { DURACION_MIMOSA_S, MimosaPudica } from "./mimosa/MimosaPudica";
import { CarpinteroG, DURACION_CARPINTERO_S } from "./carpintero/Carpintero";
import { DURACION_LATA_S, LataAutocalentable } from "./lata/LataAutocalentable";
import { DURACION_GRIPE_S, GripeSabor } from "./gripe/GripeSabor";
import { DURACION_PETA_S, PetaZetas } from "./petazetas/PetaZetas";
import { CinturonBloqueo, DURACION_CINTURON_S } from "./cinturon/CinturonBloqueo";
import { ArenasMovedizas, DURACION_ARENAS_S } from "./arenas/ArenasMovedizas";
import { Alcoholimetro, DURACION_ALCOHOL_S } from "./alcoholimetro/Alcoholimetro";
import { DURACION_SILEN_S, Silenciador } from "./silenciador/Silenciador";
import { AsientoEyectable, DURACION_EYECT_S } from "./eyectable/AsientoEyectable";
import { DURACION_INSTANTE_S, LuzInstante } from "./instante/LuzInstante";
import { LeyDeOhm } from "./LeyDeOhm";
import { DetectorHumo, DURACION_HUMO_S } from "./humo/DetectorHumo";
import { DURACION_INMUNE_S, MemoriaInmune } from "./inmune/MemoriaInmune";
import { DURACION_MONEDA_S, MonedaFalsa } from "./moneda/MonedaFalsa";
import { DURACION_OIDOS_S, OidosTapados } from "./oidos/OidosTapados";
import { DURACION_ORO_S, OroInvisible } from "./oro/OroInvisible";
import { DURACION_INSERTO_S, InsertoVioleta } from "./luminous/InsertoVioleta";
import { MicroondasVideo } from "./microondas/MicroondasVideo";
import { DURACION_OJOS_S, OjosRojos } from "./ojos/OjosRojos";
import { OllaPresion } from "./olla/OllaPresion";
import { DURACION_PAJARO_S, PajaroCable } from "./pajaro/PajaroCable";
import { DURACION_PEDOS_S, PedosCiencia } from "./pedos/PedosCiencia";
import { DURACION_PIE_S, PieMito } from "./pie/PieMito";
import { DURACION_PINA_S, PinaMito } from "./pina/PinaMito";
import { DURACION_REGLA_S, ReglaSincronia } from "./regla/ReglaSincronia";
import { DURACION_RELOJ_S, RelojCuarzo } from "./reloj/RelojCuarzo";
import { DURACION_RIMEL_S, RimelBombeo } from "./rimel/RimelBombeo";
import { CabezaPerfilPreview } from "./components/CabezaPerfil";
import { DURACION_TUNEL_S, TunelTierra } from "./tunel/TunelTierra";
import { DURACION_VOZ_S, VozGrabada } from "./voz/VozGrabada";
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
        id="ReglaCinco"
        component={ReglaCinco}
        durationInFrames={Math.round(DURACION_CINCO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RimelBombeo"
        component={RimelBombeo}
        durationInFrames={Math.round(DURACION_RIMEL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IbuprofenoGenerico"
        component={IbuprofenoGenerico}
        durationInFrames={Math.round(DURACION_IBU_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EspejoMito"
        component={EspejoMito}
        durationInFrames={Math.round(DURACION_ESPEJO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OjosRojos"
        component={OjosRojos}
        durationInFrames={Math.round(DURACION_OJOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TunelTierra"
        component={TunelTierra}
        durationInFrames={Math.round(DURACION_TUNEL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReglaSincronia"
        component={ReglaSincronia}
        durationInFrames={Math.round(DURACION_REGLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PedosCiencia"
        component={PedosCiencia}
        durationInFrames={Math.round(DURACION_PEDOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VozGrabada"
        component={VozGrabada}
        durationInFrames={Math.round(DURACION_VOZ_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PieMito"
        component={PieMito}
        durationInFrames={Math.round(DURACION_PIE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GasolinaCorte"
        component={GasolinaCorte}
        durationInFrames={Math.round(DURACION_GAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HuesosRenuevan"
        component={HuesosRenuevan}
        durationInFrames={Math.round(DURACION_HUESOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MapaLengua"
        component={MapaLengua}
        durationInFrames={Math.round(DURACION_LENGUA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HigadoRegenera"
        component={HigadoRegenera}
        durationInFrames={Math.round(DURACION_HIGADO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CobreVerde"
        component={CobreVerde}
        durationInFrames={Math.round(DURACION_COBRE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BunuelosGiran"
        component={BunuelosGiran}
        durationInFrames={Math.round(DURACION_BUNUELOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TiraBimetalica"
        component={TiraBimetalica}
        durationInFrames={Math.round(DURACION_BIMETAL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TarjetaContactless"
        component={TarjetaContactless}
        durationInFrames={Math.round(DURACION_CONTACTLESS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AmnesiaInfantil"
        component={AmnesiaInfantil}
        durationInFrames={Math.round(DURACION_AMNESIA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EspejoEspia"
        component={EspejoEspia}
        durationInFrames={Math.round(DURACION_ESPIA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MimosaPudica"
        component={MimosaPudica}
        durationInFrames={Math.round(DURACION_MIMOSA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CarpinteroG"
        component={CarpinteroG}
        durationInFrames={Math.round(DURACION_CARPINTERO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LataAutocalentable"
        component={LataAutocalentable}
        durationInFrames={Math.round(DURACION_LATA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GripeSabor"
        component={GripeSabor}
        durationInFrames={Math.round(DURACION_GRIPE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PetaZetas"
        component={PetaZetas}
        durationInFrames={Math.round(DURACION_PETA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CinturonBloqueo"
        component={CinturonBloqueo}
        durationInFrames={Math.round(DURACION_CINTURON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ArenasMovedizas"
        component={ArenasMovedizas}
        durationInFrames={Math.round(DURACION_ARENAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Alcoholimetro"
        component={Alcoholimetro}
        durationInFrames={Math.round(DURACION_ALCOHOL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Silenciador"
        component={Silenciador}
        durationInFrames={Math.round(DURACION_SILEN_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AsientoEyectable"
        component={AsientoEyectable}
        durationInFrames={Math.round(DURACION_EYECT_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OroInvisible"
        component={OroInvisible}
        durationInFrames={Math.round(DURACION_ORO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MemoriaInmune"
        component={MemoriaInmune}
        durationInFrames={Math.round(DURACION_INMUNE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OidosTapados"
        component={OidosTapados}
        durationInFrames={Math.round(DURACION_OIDOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DetectorHumo"
        component={DetectorHumo}
        durationInFrames={Math.round(DURACION_HUMO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MonedaFalsa"
        component={MonedaFalsa}
        durationInFrames={Math.round(DURACION_MONEDA_S * 30)}
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
