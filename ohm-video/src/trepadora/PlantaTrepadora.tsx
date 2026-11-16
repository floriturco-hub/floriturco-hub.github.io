import narracion from "../../guion/trepadora/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Abraza,
  Bucle,
  Cierre,
  Circulos,
  Gancho,
  Muelle,
  Sombra,
  Toca,
  Viento,
  T,
} from "./Escenas";

export const DURACION_TREPADORA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PlantaTrepadora: React.FC = () => (
  <Short
    carpeta="trepadora"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.no, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.no, hasta: T.la, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Círculos", desde: T.la, hasta: T.algunas, render: (t0) => <Circulos t0={t0} /> },
      { nombre: "Sombra", desde: T.algunas, hasta: T.cuando, render: (t0) => <Sombra t0={t0} /> },
      { nombre: "Toca", desde: T.cuando, hasta: T.asi, render: (t0) => <Toca t0={t0} /> },
      { nombre: "Abraza", desde: T.asi, hasta: T.su, render: (t0) => <Abraza t0={t0} /> },
      { nombre: "Resorte", desde: T.su, hasta: T.viento, render: (t0) => <Muelle t0={t0} /> },
      { nombre: "Viento", desde: T.viento, hasta: T.porEso, render: (t0) => <Viento t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Circumnutación", T.circulos, T.algunas, C.white],
      ["Tigmotropismo", T.toca + 1, T.asi, C.yellow],
      ["Doble hélice del zarcillo", T.otro, T.viento, C.cyan],
    ]}
    tics={[0.74, T.circulos, T.toca, T.abraza, T.mitad, T.rompe]}
  />
);
