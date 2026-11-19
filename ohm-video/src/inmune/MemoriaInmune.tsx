import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Cierre,
  Gancho,
  Memoria,
  Primera,
  Segunda,
  T,
  Vacunas,
} from "./Escenas";

export const DURACION_INMUNE_S = duracionShort(T.fin);

export const MemoriaInmune: React.FC = () => (
  <Short
    carpeta="inmune"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: lista negra",
        desde: 0,
        hasta: T.primera,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Primera infección",
        desde: T.primera,
        hasta: T.gana,
        render: (t0) => <Primera t0={t0} />,
      },
      {
        nombre: "Memoria",
        desde: T.gana,
        hasta: T.vuelve,
        render: (t0) => <Memoria t0={t0} />,
      },
      {
        nombre: "Segunda vez",
        desde: T.vuelve,
        hasta: T.vacunas,
        render: (t0) => <Segunda t0={t0} />,
      },
      {
        nombre: "Vacunas",
        desde: T.vacunas,
        hasta: T.olvida,
        render: (t0) => <Vacunas t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.olvida,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu sangre guarda una lista negra!", 0, T.primera, C.yellow, 46],
      ["La 1.ª vez: 1-2 semanas", T.semanas, T.llave, C.orange],
      ["Anticuerpo: llave y cerradura", T.llave, T.gana, C.cyan],
      ["Células de memoria", T.memoria, T.decadas, C.yellow],
      ["Viven décadas", T.decadas, T.vuelve, C.yellow],
      ["Respuesta en 1-2 días", T.dias, T.fuerte, C.cyan],
      ["Más rápida y más fuerte", T.fuerte, T.vacunas, C.yellow],
      ["Vacuna: memoria sin enfermedad", T.sin, T.olvida, C.yellow],
      ["Tu sangre no olvida", T.olvida, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.anticuerpos, T.memoria, T.dias, T.olvida]}
  />
);
