import narracion from "../../guion/plataforma/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aleja,
  Bucle,
  Cierre,
  Circulo,
  Corrige,
  Dinamico,
  Gancho,
  Helices,
  Sensores,
  T,
} from "./Escenas";

export const DURACION_PLATAFORMA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PlataformaHuracan: React.FC = () => (
  <Short
    carpeta="plataforma"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.en, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.en, hasta: T.algunas, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Posicionamiento", desde: T.algunas, hasta: T.debajo, render: (t0) => <Dinamico t0={t0} /> },
      { nombre: "Hélices", desde: T.debajo, hasta: T.satelites, render: (t0) => <Helices t0={t0} /> },
      { nombre: "Sensores", desde: T.satelites, hasta: T.si, render: (t0) => <Sensores t0={t0} /> },
      { nombre: "Corrige", desde: T.si, hasta: T.asi, render: (t0) => <Corrige t0={t0} /> },
      { nombre: "Círculo", desde: T.asi, hasta: T.y, render: (t0) => <Circulo t0={t0} /> },
      { nombre: "Se aleja", desde: T.y, hasta: T.porEso, render: (t0) => <Aleja t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Propulsores orientables", T.girar, T.satelites, C.white],
      ["Corrección automática", T.devuelven, T.asi, C.cyan],
    ]}
    tics={[0.92, T.anclas, T.helices, T.empuja, T.contraria, T.desconecta]}
  />
);
