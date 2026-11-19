import narracion from "../../guion/empano/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Capa,
  Cierre,
  Gancho,
  Gotitas,
  Lupa,
  Nube,
  Recta,
  Truco,
  Vapor,
  T,
} from "./Escenas";

export const DURACION_EMPANO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EspejoEmpanado: React.FC = () => (
  <Short
    carpeta="empano"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.y, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.y, hasta: T.agua, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Vapor", desde: T.agua, hasta: T.cuando, render: (t0) => <Vapor t0={t0} /> },
      { nombre: "Gotitas", desde: T.cuando, hasta: T.cada, render: (t0) => <Gotitas t0={t0} /> },
      { nombre: "Lupa", desde: T.cada, hasta: T.porEso, render: (t0) => <Lupa t0={t0} /> },
      { nombre: "Nube", desde: T.porEso, hasta: T.jabon2, render: (t0) => <Nube t0={t0} /> },
      { nombre: "Capa", desde: T.jabon2, hasta: T.y2, render: (t0) => <Capa t0={t0} /> },
      { nombre: "Recta", desde: T.y2, hasta: T.frota, render: (t0) => <Recta t0={t0} /> },
      { nombre: "Truco", desde: T.frota, hasta: T.porEso2, render: (t0) => <Truco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso2, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Condensación", T.gotitas, T.cada, C.white],
      ["Luz dispersada", T.porEso, T.jabon2, C.yellow],
      ["Tensoactivo", T.capa, T.frota, C.cyan],
    ]}
    tics={[0.9, T.vapor, T.gotitas, T.desvia, T.capa, T.recta]}
  />
);
