import narracion from "../../guion/sudornervios/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Apocrinas,
  Bacterias,
  Bucle,
  Cierre,
  Ecrinas,
  Gancho,
  Glandulas,
  T,
} from "./Escenas";

export const DURACION_SUDORNERVIOS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const SudorNervios: React.FC = () => (
  <Short
    carpeta="sudornervios"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.gimnasio, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.gimnasio, hasta: T.tienes, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Glándulas", desde: T.tienes, hasta: T.ejercicio, render: (t0) => <Glandulas t0={t0} /> },
      { nombre: "Ecrinas", desde: T.ejercicio, hasta: T.pero, render: (t0) => <Ecrinas t0={t0} /> },
      { nombre: "Apocrinas", desde: T.pero, hasta: T.porSi, render: (t0) => <Apocrinas t0={t0} /> },
      { nombre: "Bacterias", desde: T.porSi, hasta: T.porEso, render: (t0) => <Bacterias t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Glándulas ecrinas", T.ecrinas, T.pero, C.white],
      ["Glándulas apocrinas", T.apocrinas, T.porSi, C.yellow],
      ["Las bacterias hacen el olor", T.bacterias, T.porEso, C.yellow],
    ]}
    tics={[0.6, T.estres, T.bacterias]}
  />
);
