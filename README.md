# 🎩 El Sombrero Seleccionador · Instituto Obras Sanitarias

Una experiencia interactiva y mágica en 3D inspirada en el Sombrero Seleccionador del Mundo Mágico, creada especialmente para la **Gran Feria Escolar del Instituto Obras Sanitarias de la Nación**.

Permite a los estudiantes y sus familias escanear un código QR junto al Sombrero en el stand escolar, responder 6 dilemas mágicos y descubrir con emoción a qué casa pertenecen (**Gryffindor, Hufflepuff, Ravenclaw o Slytherin**), destacando la identidad y valores aurinegros del Instituto Obras.

---

## 🌟 Características Principales

1. **Escena 3D Interactiva con Three.js**:
   - Sombrero Seleccionador procedural 3D con textura de cuero, pliegues faciales y boca animada que habla y gesticula.
   - Partículas mágicas que reaccionan dinámicamente con los colores de cada casa y de Obras (#FDB913).
   - Efecto Parallax 3D que responde al movimiento del mouse o giro en dispositivos móviles.

2. **Cuestionario Dinámico al Estilo TikTok Showcase**:
   - Carrusel 3D con flechas de navegación táctil y de teclado entre las opciones A, B, C y D.
   - Inclinación 3D (tilt) con GSAP y sombras glassmorphism de alta gama.
   - Iconografía y microanimaciones vibrantes adaptadas para niños de 6 a 12 años.

3. **Matriz de Puntuación Exacta (6 Preguntas)**:
   Basado estrictamente en la tabla de asignación de la feria:
   - **1. Puerta misteriosa**: A = Gryffindor | B = Ravenclaw | C = Hufflepuff | D = Slytherin
   - **2. Compañero frustrado**: A = Gryffindor | B = Ravenclaw | C = Hufflepuff | D = Slytherin
   - **3. Poción mágica**: A = Gryffindor | B = Ravenclaw | C = Hufflepuff | D = Slytherin
   - **4. Desafío mágico**: A = Gryffindor | B = Hufflepuff | C = Ravenclaw | D = Slytherin
   - **5. Hizo trampa**: A = Ravenclaw | B = Slytherin | C = Gryffindor | D = Hufflepuff
   - **6. Objeto mágico**: A = Slytherin | B = Hufflepuff | C = Ravenclaw | D = Gryffindor

4. **Resolución de Empates ("El Sombrero Duda")**:
   - Si dos o más casas obtienen la misma cantidad máxima de votos, el Sombrero lo anuncia con voz enérgica y le da al estudiante el poder de elegir su destino entre las casas empatadas.

5. **Audio Mágico y Voz del Sombrero**:
   - Efectos sonoros sintetizados mediante Web Audio API (campanas mágicas, campanillas en hover, fanfarria triunfal).
   - Síntesis de voz real con `window.speechSynthesis` en español con tono grave de mago anciano.

6. **Diploma Oficial de Selección**:
   - Generación instantánea de certificado en alta resolución (1600x1130 px) sobre pergamino antiguo con el escudo del Instituto Obras, el blasón de la casa, fecha y firmas.
   - Botón para **Descargar en PNG** o **Imprimir**.

7. **Cartel QR para el Stand**:
   - Modal con código QR listo para imprimir o proyectar en una tablet junto al sombrero real en la feria.

---

## 🚀 Cómo Iniciar la Aplicación

### En Windows (Doble Clic):
Simplemente haz doble clic sobre el archivo:
```text
iniciar_sombrero.bat
```
El script comprobará Node.js, levantará el servidor en red local y abrirá automáticamente tu navegador.

### Mediante Terminal:
```bash
cd sombrero-seleccionador-obras
npm install
npm run dev -- --host
```
Accede desde tu computadora o celular conectado al mismo Wi-Fi:
- Local: `http://localhost:5173/`
- En la red de la feria: `http://[IP-LOCAL]:5173/`

---

## 🎨 Paleta de Colores
- **Aurinegro Instituto Obras**: Dorado `#FDB913`, Negro `#0C0D12`, Gris grafito `#1B1E24`
- **Gryffindor**: Carmesí `#8A0303` y Oro `#F1BE32`
- **Hufflepuff**: Amarillo Canario `#E5A100` y Ébano `#121212`
- **Ravenclaw**: Azul Zafiro `#0C2340` y Bronce `#9E7339`
- **Slytherin**: Verde Esmeralda `#1A472A` y Plata `#A7A8AA`
