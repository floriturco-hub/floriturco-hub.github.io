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

## Las dos simulaciones pedidas (techo con flujo y techo con temperatura)

| | Caso 1: flujo en el techo | Caso 2: temperatura en el techo |
|---|---|---|
| Techo inclinado | Heat Flux = 1,095 W/m² | Temperature = 42,45 °C (T de la cara inferior del panel del informe) |
| Todo lo demás | igual | igual |

### En Workbench (en tu proyecto Thermal)
1. En el **Project Schematic** está tu sistema *Steady-State Thermal* (A). Llámalo "Caso 1 – Flujo".
2. Arrastra un nuevo **Steady-State Thermal** desde Toolbox y suéltalo **sobre la celda Model (A4)** del sistema A. Se crea el sistema B, que comparte materiales, geometría y malla. Llámalo "Caso 2 – Temperatura".
3. Abre **Setup** del sistema B. Ahí:
   - Pon las mismas cargas que en el caso 1, excepto el techo. Puedes copiarlas: clic derecho en cada carga de A → Copy, y Paste en el Steady-State Thermal de B.
   - En lugar del Heat Flux del techo, pon **Temperature** de 42,45 °C en la cara superior inclinada del aire.
4. En **Solution** de B agrega:
   - Temperature.
   - **Probe → Reaction** en la cara del techo. Esa reacción es el calor que el panel entrega al aire. Divídela entre el área del techo (1,0 × W m²) y compárala con los 1,095 W/m² del caso 1.
5. Haz **Update Project** para resolver los dos casos.

### Con el script APDL
Cambia `CASO = 1` o `CASO = 2` al inicio de `agrivoltaico_3d.inp` y córrelo una vez por cada caso. En el caso 2, el mensaje final también imprime el flujo medio por el techo (el signo indica el sentido).

### Qué comparar en el informe
- Perfil T(z) en el centro de los dos casos, superpuestos.
- T media de la superficie del suelo (z = 0).
- El caso 1 deja que la temperatura del panel salga como resultado. El caso 2 la fija y deja que el flujo salga como resultado. Si los dos son consistentes, la T del techo en el caso 1 debería parecerse a 42,45 °C y el flujo del caso 2 a 1,095 W/m². Si no se parecen, coméntalo como discusión: el 42,45 °C viene de la red de resistencias 1D del panel.

---

## Validación

Con `EXTREMOS = 0`, el corte y = W/2 debe coincidir con tu solución 2D de Python (Liebmann o LU). En el informe, la superficie del suelo queda cerca de 27,8 °C. Para comparar, calcula la diferencia nodo a nodo o compara el perfil vertical del centro.
