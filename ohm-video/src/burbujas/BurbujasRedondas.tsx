import narracion from "../../guion/burbujas/narracion.json";
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
  Cubo,
  Esfera,
  Gancho,
  Pelicula,
  T,
} from "./Escenas";

export const DURACION_BURBUJAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BurbujasRedondas: React.FC = () => (
  <Short
    carpeta="burbujas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.soplas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.soplas, hasta: T.pelicula, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Pelicula", desde: T.pelicula, hasta: T.aire, render: (t0) => <Pelicula t0={t0} /> },
      { nombre: "Esfera", desde: T.aire, hasta: T.aro2, render: (t0) => <Esfera t0={t0} /> },
      { nombre: "Cubo", desde: T.aro2, hasta: T.porEso, render: (t0) => <Cubo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Superficie mínima", T.menor, T.aro2, C.yellow],
    ]}
    tics={[0.6, T.tension, T.cuadrada2]}
  />
);
