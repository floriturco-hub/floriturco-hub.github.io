import { Composition } from "remotion";
import { AguaCobro, DURACION_AGUA_S } from "./agua/AguaCobro";
import { AntenaNasa, DURACION_ANTENA_S } from "./antena/AntenaNasa";
import { DURACION_APPLE_S, PortatilTienda } from "./apple/PortatilTienda";
import { BateriaDescargada } from "./bateria/BateriaDescargada";
import { DURACION_CINCO_S, ReglaCinco } from "./cinco/ReglaCinco";
import { DURACION_ESPEJO_S, EspejoMito } from "./espejo/EspejoMito";
import {
  DURACION_IBU_S,
  IbuprofenoGenerico,
} from "./ibuprofeno/IbuprofenoGenerico";
import { DURACION_GAS_S, GasolinaCorte } from "./gasolina/GasolinaCorte";
import { DURACION_HUESOS_S, HuesosRenuevan } from "./huesos/HuesosRenuevan";
import { DURACION_LENGUA_S, MapaLengua } from "./lengua/MapaLengua";
import { DURACION_HIGADO_S, HigadoRegenera } from "./higado/HigadoRegenera";
import { CobreVerde, DURACION_COBRE_S } from "./cobre/CobreVerde";
import { BunuelosGiran, DURACION_BUNUELOS_S } from "./bunuelos/BunuelosGiran";
import { DURACION_BIMETAL_S, TiraBimetalica } from "./bimetal/TiraBimetalica";
import {
  DURACION_CONTACTLESS_S,
  TarjetaContactless,
} from "./contactless/TarjetaContactless";
import { AmnesiaInfantil, DURACION_AMNESIA_S } from "./amnesia/AmnesiaInfantil";
import { DURACION_ESPIA_S, EspejoEspia } from "./espejoespia/EspejoEspia";
import { DURACION_MIMOSA_S, MimosaPudica } from "./mimosa/MimosaPudica";
import { CarpinteroG, DURACION_CARPINTERO_S } from "./carpintero/Carpintero";
import { DURACION_LATA_S, LataAutocalentable } from "./lata/LataAutocalentable";
import { DURACION_GRIPE_S, GripeSabor } from "./gripe/GripeSabor";
import { DURACION_PETA_S, PetaZetas } from "./petazetas/PetaZetas";
import {
  CinturonBloqueo,
  DURACION_CINTURON_S,
} from "./cinturon/CinturonBloqueo";
import { ArenasMovedizas, DURACION_ARENAS_S } from "./arenas/ArenasMovedizas";
import {
  Alcoholimetro,
  DURACION_ALCOHOL_S,
} from "./alcoholimetro/Alcoholimetro";
import { DURACION_SILEN_S, Silenciador } from "./silenciador/Silenciador";
import {
  AsientoEyectable,
  DURACION_EYECT_S,
} from "./eyectable/AsientoEyectable";
import { DURACION_INSTANTE_S, LuzInstante } from "./instante/LuzInstante";
import { LeyDeOhm } from "./LeyDeOhm";
import { CoffeeDelight, DURACION_COFFEE_S } from "./coffeedelight/CoffeeDelight";
import { TigoVelocidad, DURACION_TIGO_S } from "./tigo/TigoVelocidad";
import { Bumeran, DURACION_BUMERAN_S } from "./bumeran/Bumeran";
import { TipoSangre, DURACION_SANGRE_S } from "./sangretipo/TipoSangre";
import { CalentadorManos, DURACION_CALENTADOR_S } from "./calentador/CalentadorManos";
import { PuenteColgante, DURACION_PUENTE_S } from "./puente/PuenteColgante";
import { SaciedadSemantica, DURACION_SACIEDAD_S } from "./saciedad/SaciedadSemantica";
import { RadarPolicia, DURACION_RADAR_S } from "./radarpoli/RadarPolicia";
import { PanDuro, DURACION_PANDURO_S } from "./panduro/PanDuro";
import { CamaraClic, DURACION_OBTURADOR_S } from "./obturador/CamaraClic";
import { GatoCae, DURACION_GATO_S } from "./gatocae/GatoCae";
import { BotellaSoplado, DURACION_PREFORMA_S } from "./preforma/BotellaSoplado";
import { MiembroFantasma, DURACION_FANTASMA_S } from "./fantasma/MiembroFantasma";
import { CamaClavos, DURACION_CLAVOS_S } from "./clavos/CamaClavos";
import { ControlRemoto, DURACION_CONTROL_S } from "./controlremoto/ControlRemoto";
import { PiedraRebota, DURACION_PIEDRA_S } from "./piedrarebota/PiedraRebota";
import { LlaveCerradura, DURACION_CERRADURA_S } from "./cerradura/LlaveCerradura";
import { LlaveStilson, DURACION_STILSON_S } from "./stilson/LlaveStilson";
import { Amortiguador, DURACION_AMORTIGUADOR_S } from "./amortiguador/Amortiguador";
import { VisorNocturno, DURACION_VISOR_S } from "./visor/VisorNocturno";
import { BotellaPicada, DURACION_PICADA_S } from "./picada/BotellaPicada";
import { DolorEspejo, DURACION_ESPEJODOLOR_S } from "./espejodolor/DolorEspejo";
import { ChorroGotas, DURACION_CHORRO_S } from "./chorro/ChorroGotas";
import { EfectoCoctel, DURACION_COCTEL_S } from "./coctel/EfectoCoctel";
import { EstufaTermopar, DURACION_TERMOPAR_S } from "./termopar/EstufaTermopar";
import { CafeDerrama, DURACION_CAFEOLA_S } from "./cafeola/CafeDerrama";
import { SierraYeso, DURACION_YESO_S } from "./yeso/SierraYeso";
import { PanalAbsorbe, DURACION_PANAL_S } from "./panal/PanalAbsorbe";
import { MareoAuto, DURACION_MAREO_S } from "./mareo/MareoAuto";
import { LectorQr, DURACION_LECTORQR_S } from "./lectorqr/LectorQr";
import { AguacateCafe, DURACION_AGUACATE_S } from "./aguacate/AguacateCafe";
import { EstornudoOjos, DURACION_ESTORNUDO_S } from "./estornudo/EstornudoOjos";
import { Winglets, DURACION_WINGLETS_S } from "./winglets/Winglets";
import { Ampollas, DURACION_AMPOLLA_S } from "./ampolla/Ampollas";
import { SalOsmosis, DURACION_OSMOSIS_S } from "./osmosis/SalOsmosis";
import { BuscaPolos, DURACION_BUSCAPOLOS_S } from "./buscapolos/BuscaPolos";
import { ViajeVuelta, DURACION_VUELTA_S } from "./vuelta/ViajeVuelta";
import { MotorDiesel, DURACION_DIESEL_S } from "./diesel/MotorDiesel";
import { FrenosAbs, DURACION_ABS_S } from "./abs/FrenosAbs";
import { BolsaPapas, DURACION_PAPAS_S } from "./papas/BolsaPapas";
import { QuesoDerretido, DURACION_QUESO_S } from "./queso/QuesoDerretido";
import { CargaInalambrica, DURACION_QI_S } from "./qi/CargaInalambrica";
import { JuegosFeria, DURACION_FERIA_S } from "./feria/JuegosFeria";
import { EstrellaFugaz, DURACION_ESTRELLAFUGAZ_S } from "./estrellafugaz/EstrellaFugaz";
import { RopaMojada, DURACION_ROPAMOJADA_S } from "./ropamojada/RopaMojada";
import { AceiteOlas, DURACION_ACEITE_S } from "./aceite/AceiteOlas";
import { Fosfenos, DURACION_FOSFENOS_S } from "./fosfenos/Fosfenos";
import { EspaguetiTres, DURACION_ESPAGUETI_S } from "./espagueti/EspaguetiTres";
import { ReversoresEmpuje, DURACION_REVERSORES_S } from "./reversores/ReversoresEmpuje";
import { FlamencoRosa, DURACION_FLAMENCO_S } from "./flamenco/FlamencoRosa";
import { EfectoLarsen, DURACION_LARSEN_S } from "./larsen/EfectoLarsen";
import { NivelBurbuja, DURACION_NIVEL_S } from "./nivel/NivelBurbuja";
import { SudorNervios, DURACION_SUDORNERVIOS_S } from "./sudornervios/SudorNervios";
import { DardoNerf, DURACION_NERF_S } from "./nerf/DardoNerf";
import { DetectorCO, DURACION_DETECTORCO_S } from "./detectorco/DetectorCO";
import { Rotomartillo, DURACION_ROTOMARTILLO_S } from "./rotomartillo/Rotomartillo";
import { CabezaExplosiva, DURACION_CABEZAEXPLOSIVA_S } from "./cabezaexplosiva/CabezaExplosiva";
import { EsferasAsteroides, DURACION_ESFERAS_S } from "./esferas/EsferasAsteroides";
import { Cierrapuertas, DURACION_CIERRAPUERTAS_S } from "./cierrapuertas/Cierrapuertas";
import { CortePapel, DURACION_PAPEL_S } from "./papel/CortePapel";
import { TrenMaglev, DURACION_MAGLEV_S } from "./maglev/TrenMaglev";
import { LecheUht, DURACION_LECHEUHT_S } from "./lecheuht/LecheUht";
import { Cronostasis, DURACION_CRONOSTASIS_S } from "./cronostasis/Cronostasis";
import { HeliceReves, DURACION_ESTROBOSCOPIO_S } from "./estroboscopio/HeliceReves";
import { MotorPasos, DURACION_STEPPER_S } from "./stepper/MotorPasos";
import { LlorarNariz, DURACION_LAGRIMAS_S } from "./lagrimas/LlorarNariz";
import { CucharaOlla, DURACION_CUCHARA_S } from "./cuchara/CucharaOlla";
import { CamaleonOjos, DURACION_CAMALEON_S } from "./camaleon/CamaleonOjos";
import { ImanMartillo, DURACION_MARTILLO_S } from "./martillo/ImanMartillo";
import { Taximetro, DURACION_TAXIMETRO_S } from "./taximetro/Taximetro";
import { JugoNaranja, DURACION_NARANJA_S } from "./naranja/JugoNaranja";
import { HologramaBillete, DURACION_HOLOGRAMA_S } from "./holograma/HologramaBillete";
import { AlcantarillaRedonda, DURACION_ALCANTARILLA_S } from "./alcantarilla/AlcantarillaRedonda";
import { GolpeBarbilla, DURACION_BARBILLA_S } from "./barbilla/GolpeBarbilla";
import { CarbonSinLlama, DURACION_BRASAS_S } from "./brasas/CarbonSinLlama";
import { PeajeRfid, DURACION_RFID_S } from "./rfid/PeajeRfid";
import { AguaOido, DURACION_GOTA_S } from "./gota/AguaOido";
import { SierraSawstop, DURACION_SAWSTOP_S } from "./sawstop/SierraSawstop";
import { ChocolateCristales, DURACION_CHOCOLATE_S } from "./chocolate/ChocolateCristales";
import { FrenosCarbono, DURACION_FRENOS_S } from "./frenos/FrenosCarbono";
import { LunaAlejandose, DURACION_LUNALEJA_S } from "./lunaleja/LunaAlejandose";
import { PantallaOreja, DURACION_PROXIMIDAD_S } from "./proximidad/PantallaOreja";
import { Sifon, DURACION_SIFON_S } from "./sifon/Sifon";
import { CloroManchas, DURACION_CLORO_S } from "./cloro/CloroManchas";
import { PuertaSensor, DURACION_PUERTA_S } from "./puerta/PuertaSensor";
import { BuhoSilencio, DURACION_BUHO_S } from "./buho/BuhoSilencio";
import { EspejismoCarretera, DURACION_ESPEJISMO_S } from "./espejismo/EspejismoCarretera";
import { TorresAltaTension, DURACION_TORRES_S } from "./torres/TorresAltaTension";
import { PanzaRuge, DURACION_TRIPAS_S } from "./tripas/PanzaRuge";
import { ZoomPeriscopio, DURACION_PERISCOPIO_S } from "./periscopio/ZoomPeriscopio";
import { PlumaFuente, DURACION_ESTILOGRAFICA_S } from "./estilografica/PlumaFuente";
import { VisionNocturna, DURACION_OSCURO_S } from "./oscuro/VisionNocturna";
import { EncendedorPlasma, DURACION_PLASMA_S } from "./plasma/EncendedorPlasma";
import { LataAgitada, DURACION_REFRESCO_S } from "./refresco/LataAgitada";
import { SirenaDoppler, DURACION_DOPPLER_S } from "./doppler/SirenaDoppler";
import { Oximetro, DURACION_OXIMETRO_S } from "./oximetro/Oximetro";
import { Dialisis, DURACION_DIALISIS_S } from "./dialisis/Dialisis";
import { Cortaunas, DURACION_CORTAUNAS_S } from "./cortaunas/Cortaunas";
import { PistolaSilicona, DURACION_SILICONA_S } from "./silicona/PistolaSilicona";
import { TermometroInfrarrojo, DURACION_INFRARROJO_S } from "./infrarrojo/TermometroInfrarrojo";
import { CelularVibra, DURACION_VIBRA_S } from "./vibra/CelularVibra";
import { Limpiaparabrisas, DURACION_PARABRISAS_S } from "./parabrisas/Limpiaparabrisas";
import { Torquimetro, DURACION_TORQUE_S } from "./torque/Torquimetro";
import { MetalMemoria, DURACION_NITINOL_S } from "./nitinol/MetalMemoria";
import { LataAire, DURACION_AIRE_S } from "./aire/LataAire";
import { BateriaLenta, DURACION_BATERIA_S } from "./bateria/BateriaLenta";
import { MemoriaUsb, DURACION_FLASH_S } from "./flash/MemoriaUsb";
import { CaminarCirculos, DURACION_CIRCULOS_S } from "./circulos/CaminarCirculos";
import { PlantaTrepadora, DURACION_TREPADORA_S } from "./trepadora/PlantaTrepadora";
import { GuitarraAcustica, DURACION_GUITARRA_S } from "./guitarra/GuitarraAcustica";
import { FrotarGolpe, DURACION_COMPUERTA_S } from "./compuerta/FrotarGolpe";
import { HelicopteroVuela, DURACION_HELICOPTERO_S } from "./helicoptero/HelicopteroVuela";
import { BarcoFlota, DURACION_BARCO_S } from "./barco/BarcoFlota";
import { ConvertidorCatalitico, DURACION_CATALIZADOR_S } from "./catalizador/ConvertidorCatalitico";
import { RetrovisorAuto, DURACION_RETROVISOR_S } from "./retrovisor/RetrovisorAuto";
import { LentesTransitions, DURACION_FOTOCROM_S } from "./fotocrom/LentesTransitions";
import { LentesAgujeritos, DURACION_AGUJEROS_S } from "./agujeros/LentesAgujeritos";
import { TarjetaSim, DURACION_SIM_S } from "./sim/TarjetaSim";
import { AnillosTinta, DURACION_VORTICE_S } from "./vortice/AnillosTinta";
import { PruebaEmbarazo, DURACION_EMBARAZO_S } from "./embarazo/PruebaEmbarazo";
import { CaraLuna, DURACION_LUNA_S } from "./luna/CaraLuna";
import { ChipTarjeta, DURACION_CHIP_S } from "./chip/ChipTarjeta";
import { MoscaReflejos, DURACION_MOSCA_S } from "./mosca/MoscaReflejos";
import { EscaleraElectrica, DURACION_ESCALERA_S } from "./escalera/EscaleraElectrica";
import { HumoRefresco, DURACION_HUMITO_S } from "./humito/HumoRefresco";
import { HuellaCelular, DURACION_HUELLA_S } from "./huellacel/HuellaCelular";
import { FibraCarbono, DURACION_FIBRA_S } from "./fibra/FibraCarbono";
import { HieloResbala, DURACION_HIELO_S } from "./hielo/HieloResbala";
import { TanqueInodoro, DURACION_INODORO_S } from "./inodoro/TanqueInodoro";
import { EspejoEmpanado, DURACION_EMPANO_S } from "./empano/EspejoEmpanado";
import { PlataformaHuracan, DURACION_PLATAFORMA_S } from "./plataforma/PlataformaHuracan";
import { FacturaGratis, DURACION_FACTURA_S } from "./factura/FacturaGratis";
import { LamparaLava, DURACION_LAVA_S } from "./lava/LamparaLava";
import { LentesPolarizados, DURACION_POLAR_S } from "./polar/LentesPolarizados";
import { MosquitoElige, DURACION_MOSQUITO_S } from "./mosquito/MosquitoElige";
import { VenenoSangre, DURACION_VENENO_S } from "./veneno/VenenoSangre";
import { PerlaOstra, DURACION_PERLA_S } from "./perla/PerlaOstra";
import { RelojAtomico, DURACION_ATOMICO_S } from "./atomico/RelojAtomico";
import { AnestesiaDentista, DURACION_ANESTESIA_S } from "./anestesia/AnestesiaDentista";
import { CilantroJabon, DURACION_CILANTRO_S } from "./cilantro/CilantroJabon";
import { ApendiceBunker, DURACION_APENDICE_S } from "./apendice/ApendiceBunker";
import { ChileAgua, DURACION_CHILE_S } from "./chile/ChileAgua";
import { CafeSueno, DURACION_CAFE_S } from "./cafe/CafeSueno";
import { TicketTermico, DURACION_TICKET_S } from "./ticket/TicketTermico";
import { CajeroBilletes, DURACION_CAJERO_S } from "./cajero/CajeroBilletes";
import { PerroRastreador, DURACION_PERRO_S } from "./perro/PerroRastreador";
import { CarbonActivado, DURACION_CARBON_S } from "./carbon/CarbonActivado";
import { EdadFosil, DURACION_FOSIL_S } from "./fosil/EdadFosil";
import { BalaFirma, DURACION_BALISTICA_S } from "./balistica/BalaFirma";
import { DURACION_LUMINOL_S, LuminolSangre } from "./luminol/LuminolSangre";
import { ComoImprime, DURACION_IMPRESORA_S } from "./impresora/ComoImprime";
import { ComidaTibia, DURACION_NEVERA_S } from "./nevera/ComidaTibia";
import {
  DURACION_LLUVIACEREBRO_S,
  LluviaCerebro,
} from "./lluviacerebro/LluviaCerebro";
import {
  DURACION_ASTRO_S,
  MusculosEspacio,
} from "./astronautas/MusculosEspacio";
import { DURACION_RADIOLOFI_S, RadioLofi } from "./radiolofi/RadioLofi";
import { ComposicionesLoFi } from "./lofi/LoFi";
import { LluviaLoFi, LOOP_FRAMES } from "./lluvia/LluviaLoFi";
import { DURACION_JETFLORIDA_S, JetFlorida } from "./jetflorida/JetFlorida";
import {
  Antitranspirante,
  DURACION_ANTI_S,
} from "./antitranspirante/Antitranspirante";
import { PlumaBorrable, DURACION_PLUMA_S } from "./pluma/PlumaBorrable";
import {
  EncendedorPiezo,
  DURACION_ENCENDEDOR_S,
} from "./encendedor/EncendedorPiezo";
import { PresionLlanta, DURACION_LLANTA_S } from "./llanta/PresionLlanta";
import { TronarDedos, DURACION_DEDOS_S } from "./dedos/TronarDedos";
import { PilasRebote, DURACION_PILAS_S } from "./pilas/PilasRebote";
import {
  CandadoCombinacion,
  DURACION_CANDADO_S,
} from "./candado/CandadoCombinacion";
import { DURACION_LENTES3D_S, Lentes3D } from "./lentes3d/Lentes3D";
import { DURACION_PLUMON_S, PlumonBillete } from "./plumon/PlumonBillete";
import { DURACION_RAYOSX_S, RayosMaleta } from "./rayosx/RayosMaleta";
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
        id="CandadoCombinacion"
        component={CandadoCombinacion}
        durationInFrames={Math.round(DURACION_CANDADO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PlumonBillete"
        component={PlumonBillete}
        durationInFrames={Math.round(DURACION_PLUMON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RayosMaleta"
        component={RayosMaleta}
        durationInFrames={Math.round(DURACION_RAYOSX_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Lentes3D"
        component={Lentes3D}
        durationInFrames={Math.round(DURACION_LENTES3D_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Antitranspirante"
        component={Antitranspirante}
        durationInFrames={Math.round(DURACION_ANTI_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PlumaBorrable"
        component={PlumaBorrable}
        durationInFrames={Math.round(DURACION_PLUMA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EncendedorPiezo"
        component={EncendedorPiezo}
        durationInFrames={Math.round(DURACION_ENCENDEDOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PresionLlanta"
        component={PresionLlanta}
        durationInFrames={Math.round(DURACION_LLANTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TronarDedos"
        component={TronarDedos}
        durationInFrames={Math.round(DURACION_DEDOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PilasRebote"
        component={PilasRebote}
        durationInFrames={Math.round(DURACION_PILAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JetFlorida"
        component={JetFlorida}
        durationInFrames={Math.round(DURACION_JETFLORIDA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LluviaLoFi"
        component={LluviaLoFi}
        durationInFrames={LOOP_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <ComposicionesLoFi />
      <Composition
        id="RadioLofi"
        component={RadioLofi}
        durationInFrames={Math.round(DURACION_RADIOLOFI_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MusculosEspacio"
        component={MusculosEspacio}
        durationInFrames={Math.round(DURACION_ASTRO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LluviaCerebro"
        component={LluviaCerebro}
        durationInFrames={Math.round(DURACION_LLUVIACEREBRO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ComidaTibia"
        component={ComidaTibia}
        durationInFrames={Math.round(DURACION_NEVERA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ComoImprime"
        component={ComoImprime}
        durationInFrames={Math.round(DURACION_IMPRESORA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LuminolSangre"
        component={LuminolSangre}
        durationInFrames={Math.round(DURACION_LUMINOL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BalaFirma"
        component={BalaFirma}
        durationInFrames={Math.round(DURACION_BALISTICA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EdadFosil"
        component={EdadFosil}
        durationInFrames={Math.round(DURACION_FOSIL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CarbonActivado"
        component={CarbonActivado}
        durationInFrames={Math.round(DURACION_CARBON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PerroRastreador"
        component={PerroRastreador}
        durationInFrames={Math.round(DURACION_PERRO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CajeroBilletes"
        component={CajeroBilletes}
        durationInFrames={Math.round(DURACION_CAJERO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TicketTermico"
        component={TicketTermico}
        durationInFrames={Math.round(DURACION_TICKET_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CafeSueno"
        component={CafeSueno}
        durationInFrames={Math.round(DURACION_CAFE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChileAgua"
        component={ChileAgua}
        durationInFrames={Math.round(DURACION_CHILE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ApendiceBunker"
        component={ApendiceBunker}
        durationInFrames={Math.round(DURACION_APENDICE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CilantroJabon"
        component={CilantroJabon}
        durationInFrames={Math.round(DURACION_CILANTRO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnestesiaDentista"
        component={AnestesiaDentista}
        durationInFrames={Math.round(DURACION_ANESTESIA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RelojAtomico"
        component={RelojAtomico}
        durationInFrames={Math.round(DURACION_ATOMICO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PerlaOstra"
        component={PerlaOstra}
        durationInFrames={Math.round(DURACION_PERLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VenenoSangre"
        component={VenenoSangre}
        durationInFrames={Math.round(DURACION_VENENO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MosquitoElige"
        component={MosquitoElige}
        durationInFrames={Math.round(DURACION_MOSQUITO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LentesPolarizados"
        component={LentesPolarizados}
        durationInFrames={Math.round(DURACION_POLAR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LamparaLava"
        component={LamparaLava}
        durationInFrames={Math.round(DURACION_LAVA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FacturaGratis"
        component={FacturaGratis}
        durationInFrames={Math.round(DURACION_FACTURA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PlataformaHuracan"
        component={PlataformaHuracan}
        durationInFrames={Math.round(DURACION_PLATAFORMA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EspejoEmpanado"
        component={EspejoEmpanado}
        durationInFrames={Math.round(DURACION_EMPANO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TanqueInodoro"
        component={TanqueInodoro}
        durationInFrames={Math.round(DURACION_INODORO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HieloResbala"
        component={HieloResbala}
        durationInFrames={Math.round(DURACION_HIELO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FibraCarbono"
        component={FibraCarbono}
        durationInFrames={Math.round(DURACION_FIBRA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HuellaCelular"
        component={HuellaCelular}
        durationInFrames={Math.round(DURACION_HUELLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HumoRefresco"
        component={HumoRefresco}
        durationInFrames={Math.round(DURACION_HUMITO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EscaleraElectrica"
        component={EscaleraElectrica}
        durationInFrames={Math.round(DURACION_ESCALERA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MoscaReflejos"
        component={MoscaReflejos}
        durationInFrames={Math.round(DURACION_MOSCA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChipTarjeta"
        component={ChipTarjeta}
        durationInFrames={Math.round(DURACION_CHIP_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CaraLuna"
        component={CaraLuna}
        durationInFrames={Math.round(DURACION_LUNA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PruebaEmbarazo"
        component={PruebaEmbarazo}
        durationInFrames={Math.round(DURACION_EMBARAZO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnillosTinta"
        component={AnillosTinta}
        durationInFrames={Math.round(DURACION_VORTICE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TarjetaSim"
        component={TarjetaSim}
        durationInFrames={Math.round(DURACION_SIM_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LentesAgujeritos"
        component={LentesAgujeritos}
        durationInFrames={Math.round(DURACION_AGUJEROS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LentesTransitions"
        component={LentesTransitions}
        durationInFrames={Math.round(DURACION_FOTOCROM_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RetrovisorAuto"
        component={RetrovisorAuto}
        durationInFrames={Math.round(DURACION_RETROVISOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ConvertidorCatalitico"
        component={ConvertidorCatalitico}
        durationInFrames={Math.round(DURACION_CATALIZADOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BarcoFlota"
        component={BarcoFlota}
        durationInFrames={Math.round(DURACION_BARCO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HelicopteroVuela"
        component={HelicopteroVuela}
        durationInFrames={Math.round(DURACION_HELICOPTERO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FrotarGolpe"
        component={FrotarGolpe}
        durationInFrames={Math.round(DURACION_COMPUERTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GuitarraAcustica"
        component={GuitarraAcustica}
        durationInFrames={Math.round(DURACION_GUITARRA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PlantaTrepadora"
        component={PlantaTrepadora}
        durationInFrames={Math.round(DURACION_TREPADORA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CaminarCirculos"
        component={CaminarCirculos}
        durationInFrames={Math.round(DURACION_CIRCULOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MemoriaUsb"
        component={MemoriaUsb}
        durationInFrames={Math.round(DURACION_FLASH_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BateriaLenta"
        component={BateriaLenta}
        durationInFrames={Math.round(DURACION_BATERIA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LataAire"
        component={LataAire}
        durationInFrames={Math.round(DURACION_AIRE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MetalMemoria"
        component={MetalMemoria}
        durationInFrames={Math.round(DURACION_NITINOL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Torquimetro"
        component={Torquimetro}
        durationInFrames={Math.round(DURACION_TORQUE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Limpiaparabrisas"
        component={Limpiaparabrisas}
        durationInFrames={Math.round(DURACION_PARABRISAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CelularVibra"
        component={CelularVibra}
        durationInFrames={Math.round(DURACION_VIBRA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TermometroInfrarrojo"
        component={TermometroInfrarrojo}
        durationInFrames={Math.round(DURACION_INFRARROJO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PistolaSilicona"
        component={PistolaSilicona}
        durationInFrames={Math.round(DURACION_SILICONA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Cortaunas"
        component={Cortaunas}
        durationInFrames={Math.round(DURACION_CORTAUNAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Dialisis"
        component={Dialisis}
        durationInFrames={Math.round(DURACION_DIALISIS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Oximetro"
        component={Oximetro}
        durationInFrames={Math.round(DURACION_OXIMETRO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SirenaDoppler"
        component={SirenaDoppler}
        durationInFrames={Math.round(DURACION_DOPPLER_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LataAgitada"
        component={LataAgitada}
        durationInFrames={Math.round(DURACION_REFRESCO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EncendedorPlasma"
        component={EncendedorPlasma}
        durationInFrames={Math.round(DURACION_PLASMA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VisionNocturna"
        component={VisionNocturna}
        durationInFrames={Math.round(DURACION_OSCURO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PlumaFuente"
        component={PlumaFuente}
        durationInFrames={Math.round(DURACION_ESTILOGRAFICA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ZoomPeriscopio"
        component={ZoomPeriscopio}
        durationInFrames={Math.round(DURACION_PERISCOPIO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PanzaRuge"
        component={PanzaRuge}
        durationInFrames={Math.round(DURACION_TRIPAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TorresAltaTension"
        component={TorresAltaTension}
        durationInFrames={Math.round(DURACION_TORRES_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EspejismoCarretera"
        component={EspejismoCarretera}
        durationInFrames={Math.round(DURACION_ESPEJISMO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BuhoSilencio"
        component={BuhoSilencio}
        durationInFrames={Math.round(DURACION_BUHO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PuertaSensor"
        component={PuertaSensor}
        durationInFrames={Math.round(DURACION_PUERTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CloroManchas"
        component={CloroManchas}
        durationInFrames={Math.round(DURACION_CLORO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Sifon"
        component={Sifon}
        durationInFrames={Math.round(DURACION_SIFON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PantallaOreja"
        component={PantallaOreja}
        durationInFrames={Math.round(DURACION_PROXIMIDAD_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LunaAlejandose"
        component={LunaAlejandose}
        durationInFrames={Math.round(DURACION_LUNALEJA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FrenosCarbono"
        component={FrenosCarbono}
        durationInFrames={Math.round(DURACION_FRENOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChocolateCristales"
        component={ChocolateCristales}
        durationInFrames={Math.round(DURACION_CHOCOLATE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SierraSawstop"
        component={SierraSawstop}
        durationInFrames={Math.round(DURACION_SAWSTOP_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AguaOido"
        component={AguaOido}
        durationInFrames={Math.round(DURACION_GOTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PeajeRfid"
        component={PeajeRfid}
        durationInFrames={Math.round(DURACION_RFID_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CarbonSinLlama"
        component={CarbonSinLlama}
        durationInFrames={Math.round(DURACION_BRASAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GolpeBarbilla"
        component={GolpeBarbilla}
        durationInFrames={Math.round(DURACION_BARBILLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AlcantarillaRedonda"
        component={AlcantarillaRedonda}
        durationInFrames={Math.round(DURACION_ALCANTARILLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HologramaBillete"
        component={HologramaBillete}
        durationInFrames={Math.round(DURACION_HOLOGRAMA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JugoNaranja"
        component={JugoNaranja}
        durationInFrames={Math.round(DURACION_NARANJA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Taximetro"
        component={Taximetro}
        durationInFrames={Math.round(DURACION_TAXIMETRO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ImanMartillo"
        component={ImanMartillo}
        durationInFrames={Math.round(DURACION_MARTILLO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CamaleonOjos"
        component={CamaleonOjos}
        durationInFrames={Math.round(DURACION_CAMALEON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CucharaOlla"
        component={CucharaOlla}
        durationInFrames={Math.round(DURACION_CUCHARA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LlorarNariz"
        component={LlorarNariz}
        durationInFrames={Math.round(DURACION_LAGRIMAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MotorPasos"
        component={MotorPasos}
        durationInFrames={Math.round(DURACION_STEPPER_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HeliceReves"
        component={HeliceReves}
        durationInFrames={Math.round(DURACION_ESTROBOSCOPIO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Cronostasis"
        component={Cronostasis}
        durationInFrames={Math.round(DURACION_CRONOSTASIS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LecheUht"
        component={LecheUht}
        durationInFrames={Math.round(DURACION_LECHEUHT_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TrenMaglev"
        component={TrenMaglev}
        durationInFrames={Math.round(DURACION_MAGLEV_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CortePapel"
        component={CortePapel}
        durationInFrames={Math.round(DURACION_PAPEL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Cierrapuertas"
        component={Cierrapuertas}
        durationInFrames={Math.round(DURACION_CIERRAPUERTAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EsferasAsteroides"
        component={EsferasAsteroides}
        durationInFrames={Math.round(DURACION_ESFERAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CabezaExplosiva"
        component={CabezaExplosiva}
        durationInFrames={Math.round(DURACION_CABEZAEXPLOSIVA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Rotomartillo"
        component={Rotomartillo}
        durationInFrames={Math.round(DURACION_ROTOMARTILLO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DetectorCO"
        component={DetectorCO}
        durationInFrames={Math.round(DURACION_DETECTORCO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DardoNerf"
        component={DardoNerf}
        durationInFrames={Math.round(DURACION_NERF_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SudorNervios"
        component={SudorNervios}
        durationInFrames={Math.round(DURACION_SUDORNERVIOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NivelBurbuja"
        component={NivelBurbuja}
        durationInFrames={Math.round(DURACION_NIVEL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EfectoLarsen"
        component={EfectoLarsen}
        durationInFrames={Math.round(DURACION_LARSEN_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FlamencoRosa"
        component={FlamencoRosa}
        durationInFrames={Math.round(DURACION_FLAMENCO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReversoresEmpuje"
        component={ReversoresEmpuje}
        durationInFrames={Math.round(DURACION_REVERSORES_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EspaguetiTres"
        component={EspaguetiTres}
        durationInFrames={Math.round(DURACION_ESPAGUETI_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Fosfenos"
        component={Fosfenos}
        durationInFrames={Math.round(DURACION_FOSFENOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AceiteOlas"
        component={AceiteOlas}
        durationInFrames={Math.round(DURACION_ACEITE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RopaMojada"
        component={RopaMojada}
        durationInFrames={Math.round(DURACION_ROPAMOJADA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EstrellaFugaz"
        component={EstrellaFugaz}
        durationInFrames={Math.round(DURACION_ESTRELLAFUGAZ_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JuegosFeria"
        component={JuegosFeria}
        durationInFrames={Math.round(DURACION_FERIA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CargaInalambrica"
        component={CargaInalambrica}
        durationInFrames={Math.round(DURACION_QI_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QuesoDerretido"
        component={QuesoDerretido}
        durationInFrames={Math.round(DURACION_QUESO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BolsaPapas"
        component={BolsaPapas}
        durationInFrames={Math.round(DURACION_PAPAS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FrenosAbs"
        component={FrenosAbs}
        durationInFrames={Math.round(DURACION_ABS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MotorDiesel"
        component={MotorDiesel}
        durationInFrames={Math.round(DURACION_DIESEL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ViajeVuelta"
        component={ViajeVuelta}
        durationInFrames={Math.round(DURACION_VUELTA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BuscaPolos"
        component={BuscaPolos}
        durationInFrames={Math.round(DURACION_BUSCAPOLOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SalOsmosis"
        component={SalOsmosis}
        durationInFrames={Math.round(DURACION_OSMOSIS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Ampollas"
        component={Ampollas}
        durationInFrames={Math.round(DURACION_AMPOLLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Winglets"
        component={Winglets}
        durationInFrames={Math.round(DURACION_WINGLETS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EstornudoOjos"
        component={EstornudoOjos}
        durationInFrames={Math.round(DURACION_ESTORNUDO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AguacateCafe"
        component={AguacateCafe}
        durationInFrames={Math.round(DURACION_AGUACATE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LectorQr"
        component={LectorQr}
        durationInFrames={Math.round(DURACION_LECTORQR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MareoAuto"
        component={MareoAuto}
        durationInFrames={Math.round(DURACION_MAREO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PanalAbsorbe"
        component={PanalAbsorbe}
        durationInFrames={Math.round(DURACION_PANAL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SierraYeso"
        component={SierraYeso}
        durationInFrames={Math.round(DURACION_YESO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CafeDerrama"
        component={CafeDerrama}
        durationInFrames={Math.round(DURACION_CAFEOLA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EstufaTermopar"
        component={EstufaTermopar}
        durationInFrames={Math.round(DURACION_TERMOPAR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EfectoCoctel"
        component={EfectoCoctel}
        durationInFrames={Math.round(DURACION_COCTEL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChorroGotas"
        component={ChorroGotas}
        durationInFrames={Math.round(DURACION_CHORRO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DolorEspejo"
        component={DolorEspejo}
        durationInFrames={Math.round(DURACION_ESPEJODOLOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BotellaPicada"
        component={BotellaPicada}
        durationInFrames={Math.round(DURACION_PICADA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VisorNocturno"
        component={VisorNocturno}
        durationInFrames={Math.round(DURACION_VISOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Amortiguador"
        component={Amortiguador}
        durationInFrames={Math.round(DURACION_AMORTIGUADOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LlaveStilson"
        component={LlaveStilson}
        durationInFrames={Math.round(DURACION_STILSON_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LlaveCerradura"
        component={LlaveCerradura}
        durationInFrames={Math.round(DURACION_CERRADURA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PiedraRebota"
        component={PiedraRebota}
        durationInFrames={Math.round(DURACION_PIEDRA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ControlRemoto"
        component={ControlRemoto}
        durationInFrames={Math.round(DURACION_CONTROL_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CamaClavos"
        component={CamaClavos}
        durationInFrames={Math.round(DURACION_CLAVOS_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MiembroFantasma"
        component={MiembroFantasma}
        durationInFrames={Math.round(DURACION_FANTASMA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BotellaSoplado"
        component={BotellaSoplado}
        durationInFrames={Math.round(DURACION_PREFORMA_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GatoCae"
        component={GatoCae}
        durationInFrames={Math.round(DURACION_GATO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CamaraClic"
        component={CamaraClic}
        durationInFrames={Math.round(DURACION_OBTURADOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PanDuro"
        component={PanDuro}
        durationInFrames={Math.round(DURACION_PANDURO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RadarPolicia"
        component={RadarPolicia}
        durationInFrames={Math.round(DURACION_RADAR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SaciedadSemantica"
        component={SaciedadSemantica}
        durationInFrames={Math.round(DURACION_SACIEDAD_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PuenteColgante"
        component={PuenteColgante}
        durationInFrames={Math.round(DURACION_PUENTE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CalentadorManos"
        component={CalentadorManos}
        durationInFrames={Math.round(DURACION_CALENTADOR_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TipoSangre"
        component={TipoSangre}
        durationInFrames={Math.round(DURACION_SANGRE_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Bumeran"
        component={Bumeran}
        durationInFrames={Math.round(DURACION_BUMERAN_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TigoVelocidad"
        component={TigoVelocidad}
        durationInFrames={Math.round(DURACION_TIGO_S * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CoffeeDelight"
        component={CoffeeDelight}
        durationInFrames={Math.round(DURACION_COFFEE_S * 30)}
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
