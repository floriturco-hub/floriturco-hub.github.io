import narracion from "../../guion/perla/narracion.json";
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
  Capas,
  Cierre,
  Cultivo,
  Gancho,
  Gira,
  Intruso,
  Nacar,
  T,
} from "./Escenas";

export const DURACION_PERLA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PerlaOstra: React.FC = () => (
  <Short
    carpeta="perla"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: perla", desde: 0, hasta: T.y, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.y, hasta: T.ostra, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Nácar", desde: T.ostra, hasta: T.cuando, render: (t0) => <Nacar t0={t0} /> },
      { nombre: "Intruso", desde: T.cuando, hasta: T.entonces, render: (t0) => <Intruso t0={t0} /> },
      { nombre: "Capas", desde: T.entonces, hasta: T.secree, render: (t0) => <Capas t0={t0} /> },
      { nombre: "Gira", desde: T.secree, hasta: T.brilla, render: (t0) => <Gira t0={t0} /> },
      { nombre: "Brillo", desde: T.brilla, hasta: T.cultivo, render: (t0) => <Brillo t0={t0} /> },
      { nombre: "Cultivo", desde: T.cultivo, hasta: T.porque, render: (t0) => <Cultivo t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Saco perlero", T.saco, T.miles, C.white],
      ["Una perla = años de capas", T.pelo, T.secree, C.yellow],
      ["Iridiscencia", T.arco, T.cultivo, C.cyan],
    ]}
    tics={[0.8, T.arena, T.atrapado, T.miles, T.redonda, T.arco]}
  />
);
