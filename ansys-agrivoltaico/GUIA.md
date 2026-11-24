# Simulación 3D del sistema agrivoltaico en Ansys

Modelo: conducción estacionaria (Laplace) en dos dominios acoplados, la cavidad de aire (prisma trapezoidal) y el suelo (bloque). Es el mismo planteamiento del informe 2D, extruido una profundidad `W` en el eje Y.

| Frontera | Condición | Valor |
|---|---|---|
| Fondo del suelo, z = −1 m | Temperatura | 25 °C |
| Laterales del aire, x = 0 y x = Lx | Temperatura | 27 °C |
| Techo inclinado del aire (cara inferior del panel) | Flujo de calor | q″PV = fPV(Gb,p + Gd,h) ≈ 1,095 W/m² |
| Superficie del suelo, z = 0 | Flujo de calor | q″dif = αg·Gd,h·Fsky ≈ 6,77 W/m² |
| Laterales del suelo | Adiabática | — |
| Caras en Y | Adiabáticas (= 2D) u opcionalmente 27 °C (efecto 3D) | — |

Propiedades: k_aire = 0,0263 W/m·K y k_suelo = 2,20 W/m·K.

---

## Opción A: script APDL (la más rápida)

1. Abre **Mechanical APDL** (Ansys Mechanical APDL Product Launcher → Run).
2. Ve a **File → Read Input from…** y elige `agrivoltaico_3d.inp`.
3. El script crea la geometría, malla con hexaedros, aplica las condiciones, resuelve y muestra:
   - el campo 3D de temperatura,
   - el perfil vertical T(z) en el centro,
   - un mensaje con la T media de la interfaz y la T máxima.

Parámetros que puedes cambiar al inicio del archivo:
- `W`: ancho en Y.
- `EXTREMOS = 0`: caras Y adiabáticas. Da el mismo resultado que el 2D y sirve para validar contra tu código en Python.
- `EXTREMOS = 1`: caras Y del aire a 27 °C. Representa una mesa finita, que es el efecto realmente 3D.
- `NX, NY, NZG, NZA`: divisiones de la malla. Con los valores actuales hay unos 43 000 nodos, dentro del límite de la versión Student.

**Detalle técnico:** z = 0 es una interfaz interna entre aire y suelo. Si se aplicara ahí el flujo como carga de superficie, Ansys lo cargaría en las caras de ambos materiales y lo contaría dos veces. Por eso q″dif se modela como generación volumétrica en una capa de suelo de 1 cm, con HGEN = q″dif / 0,01 m. Es equivalente al flujo superficial con un error despreciable.

---

## Opción B: Workbench (Steady-State Thermal), con interfaz gráfica

1. **Workbench → Steady-State Thermal**.
2. **Engineering Data**: crea dos materiales, *Aire* (isotropic thermal conductivity 0,0263) y *Suelo* (2,20).
3. **Geometry (SpaceClaim o DesignModeler)**, con X horizontal, Y en profundidad y Z vertical:
   - *Suelo*: caja de 0,9962 × W × 1,0 m, con z de −1 a 0.
   - *Capa*: caja de 0,9962 × W × 0,01 m, con z de −0,01 a 0. Divide el suelo para obtenerla.
   - *Aire*: dibuja en el plano XZ el trapecio (0,0) → (0,9962, 0) → (0,9962, 2,0872) → (0, 2,0) y extrúyelo W en Y.
   - Agrupa los tres cuerpos en **un solo Part** (Share Topology) para que la malla sea continua.
4. **Mechanical**:
   - Asigna los materiales: Aire al prisma, Suelo a la caja y a la capa.
   - **Mesh**: Sizing de 0,04 m y Method = MultiZone o Sweep (hexaedros).
   - **Temperature** de 25 °C en la cara inferior del suelo.
   - **Temperature** de 27 °C en las dos caras laterales del aire (x = 0 y x = Lx).
   - **Heat Flux** de 1,095 W/m² en la cara superior inclinada del aire.
   - **Internal Heat Generation** de 676,6 W/m³ en el cuerpo *Capa* (= 6,77 / 0,01).
   - Las demás caras quedan adiabáticas por defecto.
5. **Solution**: Temperature, Total Heat Flux, y un Path vertical en el centro para comparar con el 2D.

---

## Validación

Con `EXTREMOS = 0`, el corte y = W/2 debe coincidir con tu solución 2D de Python (Liebmann o LU). En el informe, la superficie del suelo queda cerca de 27,8 °C. Para comparar, calcula la diferencia nodo a nodo o compara el perfil vertical del centro.
