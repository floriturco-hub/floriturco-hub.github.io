import narracion from "../../guion/sangretipo/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Ataque,
  Bucle,
  Cierre,
  Gancho,
  Marcas,
  Universal,
  T,
} from "./Escenas";

export const DURACION_SANGRE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TipoSangre: React.FC = () => (
  <Short
    carpeta="sangretipo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sangre, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sangre, hasta: T.globulos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Marcas", desde: T.globulos, hasta: T.plasma, render: (t0) => <Marcas t0={t0} /> },
      { nombre: "Ataque", desde: T.plasma, hasta: T.negativo, render: (t0) => <Ataque t0={t0} /> },
      { nombre: "Donante universal", desde: T.negativo, hasta: T.eso, render: (t0) => <Universal t0={t0} /> },
      { nombre: "Cierre", desde: T.eso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Antígenos A y B", T.marcas, T.plasma, C.white],
      ["Donante universal", T.negativo, T.eso, C.yellow],
    ]}
    tics={[0.6, T.banderas, T.revientan]}
  />
);
