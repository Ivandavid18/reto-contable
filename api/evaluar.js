export default async function handler(request) {

    if (request.method !== "POST") {

        return new Response(
            JSON.stringify({
                error: "Método no permitido"
            }),
            {
                status: 405,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }


    try {

        const formData = await request.formData();

        const audio = formData.get("audio");
        const concepto = formData.get("concepto");


        if (!audio) {

            return new Response(
                JSON.stringify({
                    error: "No se recibió el audio."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        if (!concepto) {

            return new Response(
                JSON.stringify({
                    error: "No se recibió el concepto."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        const apiKey =
            process.env.OPENAI_API_KEY;


        if (!apiKey) {

            return new Response(
                JSON.stringify({
                    error: "La API de OpenAI no está configurada."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        /*
        ========================================
        1. TRANSCRIBIR EL AUDIO
        ========================================
        */

        const transcripcionForm =
            new FormData();


        transcripcionForm.append(
            "file",
            audio,
            "explicacion.webm"
        );


        transcripcionForm.append(
            "model",
            "gpt-4o-mini-transcribe"
        );


        const respuestaTranscripcion =
            await fetch(
                "https://api.openai.com/v1/audio/transcriptions",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            "Bearer " + apiKey
                    },

                    body:
                        transcripcionForm
                }
            );


        if (!respuestaTranscripcion.ok) {

            const errorTexto =
                await respuestaTranscripcion.text();

            console.error(
                "Error de transcripción:",
                errorTexto
            );

            return new Response(
                JSON.stringify({
                    error:
                        "No se pudo transcribir el audio."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        }


        const datosTranscripcion =
            await respuestaTranscripcion.json();


        const texto =
            datosTranscripcion.text;


        /*
        ========================================
        2. EVALUAR LA EXPLICACIÓN CON IA
        ========================================
        */

        const prompt = `

Eres un profesor universitario experto en
Contaduría Pública.

Un estudiante está realizando un ejercicio
de aprendizaje.

El concepto que debía explicar es:

"${concepto}"

Esta fue su explicación:

"${texto}"

Evalúa si realmente comprende el concepto.

NO exijas que utilice exactamente una
definición de libro.

Evalúa principalmente:

1. Si entiende qué significa.
2. Si explica para qué sirve.
3. Si explica correctamente cómo se aplica.
4. Si utiliza un ejemplo cuando sea posible.
5. Si relaciona correctamente el concepto
   con otros conceptos contables.
6. Si existen errores conceptuales.

Asigna una calificación de 0 a 10.

Después determina uno de estos estados:

"COMPRENDIDO"

"NECESITA REPASO"

Devuelve ÚNICAMENTE un JSON válido con
esta estructura:

{
    "nota": 0,
    "estado": "COMPRENDIDO",
    "resumen": "",
    "fortalezas": [],
    "errores": [],
    "recomendacion": ""
}

No agregues texto fuera del JSON.
`;


        const respuestaIA =
            await fetch(
                "https://api.openai.com/v1/responses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + apiKey
                    },

                    body: JSON.stringify({

                        model: "gpt-5.6-luna",

                        input: prompt

                    })

                }
            );


        if (!respuestaIA.ok) {

            const errorTexto =
                await respuestaIA.text();

            console.error(
                "Error de evaluación:",
                errorTexto
            );

            return new Response(
                JSON.stringify({
                    error:
                        "La IA no pudo evaluar la explicación."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        }


        const datosIA =
            await respuestaIA.json();


        const resultadoTexto =
            datosIA.output_text;


        let evaluacion;


        try {

            evaluacion =
                JSON.parse(resultadoTexto);

        } catch (error) {

            console.error(
                "La IA no devolvió JSON válido:",
                resultadoTexto
            );

            return new Response(
                JSON.stringify({
                    error:
                        "La evaluación de la IA tuvo un formato inesperado."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        }


        /*
        ========================================
        3. DEVOLVER RESULTADO
        ========================================
        */

        return new Response(

            JSON.stringify({

                transcripcion: texto,

                evaluacion: evaluacion

            }),

            {

                status: 200,

                headers: {
                    "Content-Type":
                        "application/json"
                }

            }

        );


    } catch (error) {

        console.error(error);

        return new Response(

            JSON.stringify({

                error:
                    "Ocurrió un error al procesar la explicación."

            }),

            {

                status: 500,

                headers: {
                    "Content-Type":
                        "application/json"
                }

            }

        );

    }

}
