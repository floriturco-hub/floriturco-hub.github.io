import narracion from "../../guion/oscuro/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cierre,
  Fabrica,
  Gancho,
  Piratas,
  Rodopsina,
  Sensores,
  T,
} from "./Escenas";

export const DURACION_OSCURO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const VisionNocturna: React.FC = () => (
  <Short
    carpeta="oscuro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.vienes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.vienes, hasta: T.tipos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sensores", desde: T.tipos, hasta: T.pigmento, render: (t0) => <Sensores t0={t0} /> },
      { nombre: "Rodopsina", desde: T.pigmento, hasta: T.volver, render: (t0) => <Rodopsina t0={t0} /> },
      { nombre: "Adaptación", desde: T.volver, hasta: T.porEso1, render: (t0) => <Fabrica t0={t0} /> },
      { nombre: "Piratas", desde: T.porEso1, hasta: T.porEso, render: (t0) => <Piratas t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Conos y bastones", T.conos, T.pigmento, C.white],
      ["Fotoblanqueo", T.descompone, T.volver, C.purpleLight],
      ["Adaptación a la oscuridad", T.tarda, T.porEso1, C.purpleLight],
    ]}
    tics={[0.7, T.descompone, T.barco]}
  />
);
