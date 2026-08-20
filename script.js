const conceptos = [
    { nombre: "Activo", categoria: "Fundamentos", dificultad: "Fácil" },
    { nombre: "Pasivo", categoria: "Fundamentos", dificultad: "Fácil" },
    { nombre: "Patrimonio", categoria: "Fundamentos", dificultad: "Fácil" },
    { nombre: "Partida doble", categoria: "Fundamentos", dificultad: "Fácil" },
    { nombre: "Ecuación contable", categoria: "Fundamentos", dificultad: "Fácil" },
    { nombre: "Débito", categoria: "Fundamentos", dificultad: "Fácil" },
    { nombre: "Crédito", categoria: "Fundamentos", dificultad: "Fácil" },

    { nombre: "Devengo", categoria: "NIIF", dificultad: "Intermedio" },
    { nombre: "Materialidad", categoria: "NIIF", dificultad: "Intermedio" },
    { nombre: "Valor razonable", categoria: "NIIF", dificultad: "Intermedio" },
    { nombre: "Deterioro", categoria: "NIIF", dificultad: "Intermedio" },
    { nombre: "Provisión", categoria: "NIIF", dificultad: "Intermedio" },
    { nombre: "Activo intangible", categoria: "NIIF", dificultad: "Intermedio" },

    { nombre: "Impuesto diferido", categoria: "Tributaria", dificultad: "Difícil" },
    { nombre: "Hecho generador", categoria: "Tributaria", dificultad: "Intermedio" },
    { nombre: "Base gravable", categoria: "Tributaria", dificultad: "Intermedio" },
    { nombre: "Retención en la fuente", categoria: "Tributaria", dificultad: "Intermedio" },

    { nombre: "Evidencia de auditoría", categoria: "Auditoría", dificultad: "Intermedio" },
    { nombre: "Riesgo inherente", categoria: "Auditoría", dificultad: "Difícil" },
    { nombre: "Riesgo de control", categoria: "Auditoría", dificultad: "Difícil" },
    { nombre: "Riesgo de detección", categoria: "Auditoría", dificultad: "Difícil" },

    { nombre: "Costo fijo", categoria: "Costos", dificultad: "Fácil" },
    { nombre: "Costo variable", categoria: "Costos", dificultad: "Fácil" },
    { nombre: "Margen de contribución", categoria: "Costos", dificultad: "Intermedio" },
    { nombre: "Costeo ABC", categoria: "Costos", dificultad: "Difícil" },

    { nombre: "Flujo de caja", categoria: "Finanzas", dificultad: "Fácil" },
    { nombre: "Valor presente neto", categoria: "Finanzas", dificultad: "Intermedio" },
    { nombre: "Tasa interna de retorno", categoria: "Finanzas", dificultad: "Intermedio" },
    { nombre: "Liquidez", categoria: "Finanzas", dificultad: "Fácil" },

    { nombre: "Hecho económico", categoria: "Contabilidad Pública", dificultad: "Intermedio" },
    { nombre: "Reconocimiento", categoria: "Contabilidad Pública", dificultad: "Intermedio" },
    { nombre: "Medición", categoria: "Contabilidad Pública", dificultad: "Intermedio" },
    { nombre: "Revelación", categoria: "Contabilidad Pública", dificultad: "Intermedio" },
    { nombre: "Catálogo General de Cuentas", categoria: "Contabilidad Pública", dificultad: "Difícil" }
];

let conceptoActual = null;
let tiempo = 15 * 60;
let tiempoExplicacion = 60;
let intervalo = null;
let intervaloExplicacion = null;
let pausado = false;

let retos = Number(localStorage.getItem("retos") || 0);
let entendidos = Number(localStorage.getItem("entendidos") || 0);
let repaso = JSON.parse(localStorage.getItem("repaso") || "[]");


function nuevoConcepto() {

    clearInterval(intervalo);
    clearInterval(intervaloExplicacion);

    const categoria = document.getElementById("categoria").value;
    const dificultad = document.getElementById("dificultad").value;

    let disponibles = conceptos.filter(function(c) {

        const categoriaOK =
            categoria === "Todas" || c.categoria === categoria;

        const dificultadOK =
            dificultad === "Todas" || c.dificultad === dificultad;

        return categoriaOK && dificultadOK;
    });

    if (disponibles.length === 0) {
        alert("No hay conceptos con esos filtros.");
        return;
    }

    const posicion =
        Math.floor(Math.random() * disponibles.length);

    conceptoActual = disponibles[posicion];

    document.getElementById("concepto").textContent =
        conceptoActual.nombre;

    document.getElementById("categoriaTexto").textContent =
        "📚 " + conceptoActual.categoria;

    document.getElementById("dificultadTexto").textContent =
        "🎯 " + conceptoActual.dificultad;

    document.getElementById("mensaje").textContent =
        "Investiga este concepto durante 15 minutos. Intenta comprenderlo, no solo memorizarlo.";

    document.getElementById("zonaReto")
        .classList.remove("oculto");

    document.getElementById("zonaExplicacion")
        .classList.add("oculto");

    tiempo = 15 * 60;
    pausado = false;

    actualizarTemporizador();

    intervalo = setInterval(function() {

        if (pausado) return;

        tiempo--;

        actualizarTemporizador();

        if (tiempo <= 0) {

            clearInterval(intervalo);

            comenzarExplicacion();
        }

    }, 1000);

    retos++;

    localStorage.setItem("retos", retos);

    actualizarEstadisticas();
}


function actualizarTemporizador() {

    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;

    document.getElementById("temporizador").textContent =
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0");

    const porcentaje =
        ((15 * 60 - tiempo) / (15 * 60)) * 100;

    document.getElementById("barra").style.width =
        porcentaje + "%";
}


function pausar() {
    pausado = !pausado;
}


function comenzarExplicacion() {

    clearInterval(intervalo);

    tiempoExplicacion = 60;

    document.getElementById("zonaExplicacion")
        .classList.remove("oculto");

    actualizarExplicacion();

    intervaloExplicacion = setInterval(function() {

        tiempoExplicacion--;

        actualizarExplicacion();

        if (tiempoExplicacion <= 0) {

            clearInterval(intervaloExplicacion);

            alert("⏰ Terminó el minuto. ¡Muy bien!");
        }

    }, 1000);
}


function actualizarExplicacion() {

    const minutos =
        Math.floor(tiempoExplicacion / 60);

    const segundos =
        tiempoExplicacion % 60;

    document.getElementById("temporizadorExplicacion").textContent =
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0");
}


function terminarReto() {

    clearInterval(intervaloExplicacion);

    entendidos++;

    localStorage.setItem("entendidos", entendidos);

    actualizarEstadisticas();

    alert("🎉 ¡Concepto marcado como entendido!");
}


function guardarRepaso() {

    if (!conceptoActual) return;

    const existe = repaso.some(function(c) {
        return c.nombre === conceptoActual.nombre;
    });

    if (!existe) {

        repaso.push(conceptoActual);

        localStorage.setItem(
            "repaso",
            JSON.stringify(repaso)
        );
    }

    mostrarRepaso();
    actualizarEstadisticas();

    alert("📌 Guardado para repasar.");
}


function mostrarRepaso() {

    const lista =
        document.getElementById("listaRepaso");

    if (!lista) return;

    if (repaso.length === 0) {

        lista.innerHTML =
            "<li>Todavía no tienes conceptos pendientes.</li>";

        return;
    }

    lista.innerHTML = "";

    repaso.forEach(function(c, index) {

        const li = document.createElement("li");

        li.innerHTML =
            "<strong>" +
            c.nombre +
            "</strong> · " +
            c.categoria +
            " · " +
            c.dificultad +
            " <button onclick='eliminarRepaso(" +
            index +
            ")'>✓</button>";

        lista.appendChild(li);
    });
}


function eliminarRepaso(index) {

    repaso.splice(index, 1);

    localStorage.setItem(
        "repaso",
        JSON.stringify(repaso)
    );

    mostrarRepaso();
    actualizarEstadisticas();
}


function actualizarEstadisticas() {

    const contador =
        document.getElementById("contador");

    const entendidosElemento =
        document.getElementById("entendidos");

    const pendientes =
        document.getElementById("pendientes");

    if (contador)
        contador.textContent = retos;

    if (entendidosElemento)
        entendidosElemento.textContent = entendidos;

    if (pendientes)
        pendientes.textContent = repaso.length;
}


function reiniciar() {

    clearInterval(intervalo);
    clearInterval(intervaloExplicacion);

    document.getElementById("zonaReto")
        .classList.add("oculto");

    document.getElementById("zonaExplicacion")
        .classList.add("oculto");

    document.getElementById("concepto").textContent =
        "¿Listo para comenzar?";

    document.getElementById("mensaje").textContent =
        "Elige tus preferencias y obtén un concepto al azar.";
}


actualizarEstadisticas();
mostrarRepaso();

console.log("SCRIPT.JS CARGADO CORRECTAMENTE");

/* =================================
   GRABAR EXPLICACIÓN CON IA
================================= */

let grabadora = null;
let partesAudio = [];
let grabando = false;


/* INICIAR / DETENER GRABACIÓN */

async function grabarExplicacion() {

    if (grabando) {

        grabadora.stop();
        return;

    }


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        partesAudio = [];

        grabadora =
            new MediaRecorder(stream);


        grabadora.ondataavailable =
            function(evento) {

                if (evento.data.size > 0) {

                    partesAudio.push(
                        evento.data
                    );

                }

            };


        grabadora.onstop =
            async function() {

                grabando = false;

                stream.getTracks().forEach(
                    function(track) {
                        track.stop();
                    }
                );


                const audio =
                    new Blob(
                        partesAudio,
                        {
                            type: "audio/webm"
                        }
                    );


                await enviarAudioIA(audio);

            };


        grabadora.start();

        grabando = true;

        actualizarBotonGrabacion();


    } catch (error) {

        console.error(error);

        alert(
            "🎤 No se pudo acceder al micrófono. Revisa los permisos del navegador."
        );

    }

}


/* CAMBIAR TEXTO DEL BOTÓN */

function actualizarBotonGrabacion() {

    const boton =
        document.getElementById(
            "botonGrabacion"
        );


    if (!boton) return;


    if (grabando) {

        boton.textContent =
            "⏹️ TERMINAR EXPLICACIÓN";

        boton.classList.add(
            "grabando"
        );

    } else {

        boton.textContent =
            "🎤 EMPEZAR A HABLAR";

        boton.classList.remove(
            "grabando"
        );

    }

}


/* ENVIAR AUDIO A LA IA */

async function enviarAudioIA(audio) {

    const boton =
        document.getElementById(
            "botonGrabacion"
        );


    const resultado =
        document.getElementById(
            "resultadoIA"
        );


    if (boton) {

        boton.disabled = true;

        boton.textContent =
            "🤖 ANALIZANDO...";

    }


    if (resultado) {

        resultado.classList.remove(
            "oculto"
        );

        resultado.innerHTML =
            "<p>🎧 Procesando tu explicación...</p>";

    }


    try {

        const datos =
            new FormData();


        datos.append(
            "audio",
            audio,
            "explicacion.webm"
        );


        datos.append(
            "concepto",
            conceptoActual
                ? conceptoActual.nombre
                : ""
        );


        const respuesta =
            await fetch(
                "https://reto-contable.vercel.app/api/evaluar",
                {
                    method: "POST",
                    body: datos
                }
            );


        const datosRespuesta =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datosRespuesta.error ||
                "No se pudo evaluar la explicación."
            );

        }


        mostrarResultadoIA(
            datosRespuesta
        );


    } catch (error) {

        console.error(error);

        if (resultado) {

            resultado.innerHTML =

                "<p>❌ " +
                error.message +
                "</p>";

        }

    }


    if (boton) {

        boton.disabled = false;

        actualizarBotonGrabacion();

    }

}


/* MOSTRAR EVALUACIÓN */

function mostrarResultadoIA(datos) {

    const resultado =
        document.getElementById(
            "resultadoIA"
        );


    if (!resultado) return;


    const evaluacion =
        datos.evaluacion;


    let fortalezas = "";

    if (
        evaluacion.fortalezas &&
        evaluacion.fortalezas.length
    ) {

        fortalezas =
            "<ul>" +
            evaluacion.fortalezas
                .map(
                    function(item) {
                        return "<li>✅ " +
                            item +
                            "</li>";
                    }
                )
                .join("") +
            "</ul>";

    }


    let errores = "";

    if (
        evaluacion.errores &&
        evaluacion.errores.length
    ) {

        errores =
            "<ul>" +
            evaluacion.errores
                .map(
                    function(item) {
                        return "<li>⚠️ " +
                            item +
                            "</li>";
                    }
                )
                .join("") +
            "</ul>";

    }


    resultado.innerHTML =

        "<h3>🤖 Evaluación de la IA</h3>" +

        "<div class='notaIA'>" +
        evaluacion.nota +
        "/10" +
        "</div>" +

        "<h4>" +
        evaluacion.estado +
        "</h4>" +

        "<p>" +
        evaluacion.resumen +
        "</p>" +

        "<h4>✅ Fortalezas</h4>" +

        fortalezas +

        "<h4>⚠️ Para mejorar</h4>" +

        errores +

        "<h4>💡 Recomendación</h4>" +

        "<p>" +
        evaluacion.recomendacion +
        "</p>" +

        "<details>" +

        "<summary>📝 Ver transcripción</summary>" +

        "<p>" +
        datos.transcripcion +
        "</p>" +

        "</details>";

}
