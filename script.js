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
   EVALUACIÓN GRATIS CON VOZ
   ================================= */

let reconocimiento = null;
let grabando = false;
let transcripcionLocal = "";
let deteniendoGrabacion = false;


/* =================================
   INICIAR / DETENER EXPLICACIÓN
   ================================= */

function grabarExplicacion() {

    /*
    Si ya está hablando, detenemos
    */

    if (grabando) {

        deteniendoGrabacion = true;

        grabando = false;

        actualizarBotonGrabacion();

        if (reconocimiento) {
            reconocimiento.stop();
        }

        return;
    }


    /*
    Comprobar compatibilidad
    */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "⚠️ Tu navegador no permite reconocimiento de voz. Prueba con Chrome o Edge."
        );

        return;
    }


    /*
    Crear reconocimiento
    */

    reconocimiento =
        new SpeechRecognition();


    reconocimiento.lang = "es-ES";

    reconocimiento.continuous = true;

    reconocimiento.interimResults = true;

    reconocimiento.maxAlternatives = 1;


    transcripcionLocal = "";

    deteniendoGrabacion = false;


    /*
    Cuando comienza
    */

    reconocimiento.onstart = function() {

        grabando = true;

        actualizarBotonGrabacion();

        mostrarMensajeGrabacion(
            "🔴 Escuchando... Habla con tus propias palabras."
        );

    };


    /*
    Cuando reconoce palabras
    */

    reconocimiento.onresult =
        function(evento) {

            let textoNuevo = "";

            for (
                let i = evento.resultIndex;
                i < evento.results.length;
                i++
            ) {

                textoNuevo +=
                    evento.results[i][0].transcript + " ";

            }


            /*
            Guardamos solamente texto final
            */

            for (
                let i = evento.resultIndex;
                i < evento.results.length;
                i++
            ) {

                if (
                    evento.results[i].isFinal
                ) {

                    transcripcionLocal +=
                        evento.results[i][0].transcript +
                        " ";

                }

            }


            mostrarTranscripcion(
                transcripcionLocal
            );

        };


    /*
    Cuando ocurre un error
    */

    reconocimiento.onerror =
        function(evento) {

            console.error(
                "Error de reconocimiento:",
                evento.error
            );


            if (
                evento.error ===
                "not-allowed"
            ) {

                grabando = false;

                actualizarBotonGrabacion();

                alert(
                    "⚠️ Necesitamos permiso para usar el micrófono."
                );

            }

        };


    /*
    Cuando termina
    */

    reconocimiento.onend =
        function() {

            /*
            Si el usuario pulsó detener,
            evaluamos la explicación.
            */

            if (deteniendoGrabacion) {

                grabando = false;

                actualizarBotonGrabacion();

                evaluarExplicacionLocal();

                return;
            }


            /*
            Si el navegador se desconectó
            mientras seguíamos hablando,
            intentamos continuar.
            */

            if (grabando) {

                try {

                    reconocimiento.start();

                } catch (error) {

                    console.log(
                        "No se pudo reiniciar el reconocimiento."
                    );

                }

            }

        };


    /*
    Comenzar
    */

    try {

        reconocimiento.start();

    } catch (error) {

        console.error(error);

        alert(
            "No se pudo iniciar el reconocimiento de voz."
        );

    }

}


/* =================================
   BOTÓN
   ================================= */

function actualizarBotonGrabacion() {

    const boton =
        document.getElementById(
            "botonGrabacion"
        );


    if (!boton) return;


    if (grabando) {

        boton.textContent =
            "⏹️ TERMINAR EXPLICACIÓN";

    } else {

        boton.textContent =
            "🎙️ EMPEZAR A HABLAR";

    }

}


/* =================================
   MENSAJE
   ================================= */

function mostrarMensajeGrabacion(texto) {

    const resultado =
        document.getElementById(
            "resultadoIA"
        );


    if (!resultado) return;


    resultado.classList.remove(
        "oculto"
    );


    resultado.innerHTML =
        "<p>" +
        texto +
        "</p>";

}


/* =================================
   MOSTRAR TRANSCRIPCIÓN
   ================================= */

function mostrarTranscripcion(texto) {

    const resultado =
        document.getElementById(
            "resultadoIA"
        );


    if (!resultado) return;


    resultado.classList.remove(
        "oculto"
    );


    resultado.innerHTML =

        "<h3>🎙️ Tu explicación</h3>" +

        "<p>" +
        (texto || "Escuchando...") +
        "</p>";

}


/* =================================
   EVALUAR SIN IA
   ================================= */

function evaluarExplicacionLocal() {

    const texto =
        transcripcionLocal
            .toLowerCase()
            .trim();


    const resultado =
        document.getElementById(
            "resultadoIA"
        );


    if (!resultado) return;


    if (!texto) {

        resultado.classList.remove(
            "oculto"
        );


        resultado.innerHTML =

            "<h3>⚠️ No pude detectar una explicación</h3>" +

            "<p>Intenta hablar nuevamente durante unos segundos.</p>";

        return;
    }


    /*
    Concepto actual
    */

    const concepto =
        conceptoActual
            ? conceptoActual.nombre.toLowerCase()
            : "";


    /*
    Palabras que indican definición
    */

    const definicion = [
        "es",
        "significa",
        "se refiere",
        "consiste",
        "concepto",
        "se define"
    ];


    /*
    Palabras relacionadas con utilidad
    */

    const utilidad = [
        "sirve",
        "permite",
        "utiliza",
        "utilidad",
        "objetivo",
        "función"
    ];


    /*
    Palabras relacionadas con aplicación
    */

    const aplicacion = [
        "aplica",
        "aplicación",
        "cuando",
        "caso",
        "proceso",
        "registro",
        "contabiliza"
    ];


    /*
    Palabras relacionadas con ejemplo
    */

    const ejemplo = [
        "ejemplo",
        "por ejemplo",
        "supongamos",
        "imagina",
        "caso"
    ];


    let puntos = 0;


    /*
    Mencionar el concepto
    */

    if (
        concepto &&
        texto.includes(concepto)
    ) {

        puntos += 2;

    }


    /*
    Definición
    */

    if (
        contieneAlguna(
            texto,
            definicion
        )
    ) {

        puntos += 2;

    }


    /*
    Utilidad
    */

    if (
        contieneAlguna(
            texto,
            utilidad
        )
    ) {

        puntos += 2;

    }


    /*
    Aplicación
    */

    if (
        contieneAlguna(
            texto,
            aplicacion
        )
    ) {

        puntos += 2;

    }


    /*
    Ejemplo
    */

    if (
        contieneAlguna(
            texto,
            ejemplo
        )
    ) {

        puntos += 2;

    }


    /*
    Convertir puntos a nota
    */

    let nota = puntos;


    /*
    Evitar que una explicación
    muy corta tenga buena nota
    */

    const cantidadPalabras =
        texto.split(/\s+/).length;


    if (
        cantidadPalabras < 20
    ) {

        nota = Math.min(
            nota,
            4
        );

    }


    /*
    Determinar resultado
    */

    let nivel = "";

    let mensaje = "";


    if (nota >= 8) {

        nivel =
            "🟢 APROBADO";

        mensaje =
            "Demuestras una buena comprensión del concepto.";

    }

    else if (nota >= 5) {

        nivel =
            "🟡 CASI";

        mensaje =
            "Tienes una comprensión básica, pero todavía puedes profundizar.";

    }

    else {

        nivel =
            "🔴 REPASAR";

        mensaje =
            "La explicación todavía no demuestra suficiente comprensión.";

    }


    /*
    Mostrar resultado
    */

    resultado.classList.remove(
        "oculto"
    );


    resultado.innerHTML =

        "<h2>" +
        nivel +
        "</h2>" +

        "<h3>📊 Nota: " +
        nota +
        "/10</h3>" +

        "<p>" +
        mensaje +
        "</p>" +

        "<hr>" +

        "<h3>🎙️ Lo que dijiste</h3>" +

        "<p>" +
        texto +
        "</p>" +

        "<hr>" +

        "<p>" +
        "La evaluación automática comprueba si mencionaste definición, utilidad, aplicación y ejemplo." +
        "</p>";

}


/* =================================
   BUSCAR PALABRAS
   ================================= */

function contieneAlguna(
    texto,
    palabras
) {

    return palabras.some(
        function(palabra) {

            return texto.includes(
                palabra
            );

        }
    );

}

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
