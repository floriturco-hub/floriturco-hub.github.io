import narracion from "../../guion/infrarrojo/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Brillo,
  Bucle,
  Chip,
  Cierre,
  Gancho,
  Laser,
  Lente,
  Metal,
  T,
} from "./Escenas";

export const DURACION_INFRARROJO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TermometroInfrarrojo: React.FC = () => (
  <Short
    carpeta="infrarrojo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.apuntas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.apuntas, hasta: T.laser, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Láser", desde: T.laser, hasta: T.todo, render: (t0) => <Laser t0={t0} /> },
      { nombre: "Brillo", desde: T.todo, hasta: T.lente, render: (t0) => <Brillo t0={t0} /> },
      { nombre: "Lente", desde: T.lente, hasta: T.chip, render: (t0) => <Lente t0={t0} /> },
      { nombre: "Chip", desde: T.chip, hasta: T.pero, render: (t0) => <Chip t0={t0} /> },
      { nombre: "Metal", desde: T.pero, hasta: T.asi, render: (t0) => <Metal t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Radiación térmica", T.infrarroja, T.lente, C.red],
      ["Termopila", T.termopila, T.chip, C.orange],
      ["Emisividad", T.poco, T.asi, C.cyan],
    ]}
    tics={[0.7, T.nada, T.temperatura, T.engana]}
  />
);
