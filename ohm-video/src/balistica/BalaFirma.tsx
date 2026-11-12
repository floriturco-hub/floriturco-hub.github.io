import narracion from "../../guion/balistica/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Arma,
  Canon,
  Cierre,
  Encaje,
  Gancho,
  Grabado,
  Peritos,
  Rayones,
  T,
} from "./Escenas";

export const DURACION_BALISTICA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BalaFirma: React.FC = () => (
  <Short
    carpeta="balistica"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: huella",
        desde: 0,
        hasta: T.arma,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Arma",
        desde: T.arma,
        hasta: T.canon,
        render: (t0) => <Arma t0={t0} />,
      },
      {
        nombre: "Cañón",
        desde: T.canon,
        hasta: T.fabricar,
        render: (t0) => <Canon t0={t0} />,
      },
      {
        nombre: "Rayones",
        desde: T.fabricar,
        hasta: T.sale,
        render: (t0) => <Rayones t0={t0} />,
      },
      {
        nombre: "Grabado",
        desde: T.sale,
        hasta: T.peritos,
        render: (t0) => <Grabado t0={t0} />,
      },
      {
        nombre: "Peritos",
        desde: T.peritos,
        hasta: T.encajan,
        render: (t0) => <Peritos t0={t0} />,
      },
      {
        nombre: "Encaje",
        desde: T.encajan,
        hasta: T.porque,
        render: (t0) => <Encaje t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.porque,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["Estrías del cañón", T.estrias, T.fabricar, C.white],
      ["Rayones únicos", T.distintos, T.sale, C.yellow],
      ["Se graban en la bala", T.grabada, T.peritos, C.cyan],
      ["Microscopio de comparación", T.microscopio, T.encajan, C.white],
      ["Coinciden: es el arma", T.firmar, T.porque, C.yellow],
    ]}
    tics={[1.0, T.girar, T.distintos, T.grabada, T.encajan]}
  />
);
