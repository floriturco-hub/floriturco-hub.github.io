import narracion from "../../guion/visor/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Avalancha,
  Bucle,
  Cierre,
  Fosforo,
  Fotocatodo,
  Gancho,
  Verde,
  T,
} from "./Escenas";

export const DURACION_VISOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const VisorNocturno: React.FC = () => (
  <Short
    carpeta="visor"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.visor, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.visor, hasta: T.luz, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Fotocátodo", desde: T.luz, hasta: T.tubitos, render: (t0) => <Fotocatodo t0={t0} /> },
      { nombre: "Microcanales", desde: T.tubitos, hasta: T.fosforo, render: (t0) => <Avalancha t0={t0} /> },
      { nombre: "Fósforo", desde: T.fosforo, hasta: T.verde2, render: (t0) => <Fosforo t0={t0} /> },
      { nombre: "Verde", desde: T.verde2, hasta: T.asi, render: (t0) => <Verde t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Intensificador de imagen", T.fotocatodo, T.fosforo, C.yellow],
      ["Placa de microcanales", T.tubitos, T.fosforo, C.white],
    ]}
    tics={[0.6, T.verde, T.avalancha]}
  />
);
