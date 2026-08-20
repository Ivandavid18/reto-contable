export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Método no permitido"
        });

    }


    try {

        const {
            audio,
            concepto
        } = req.body || {};


        if (!audio) {

            return res.status(400).json({
                error: "No se recibió el audio."
            });

        }


        if (!concepto) {

            return res.status(400).json({
                error: "No se recibió el concepto."
            });

        }


        const apiKey =
            process.env.OPENAI_API_KEY;


        if (!apiKey) {

            return res.status(500).json({
                error: "La API de OpenAI no está configurada."
            });

        }


        /*
        ========================================
        1. CONVERTIR BASE64 A AUDIO
        ========================================
        */

        const audioBuffer =
            Buffer.from(audio, "base64");


        const archivoAudio =
            new Blob(
                [audioBuffer],
                {
                    type: "audio/webm"
                }
            );


        /*
        ========================================
        2. ENVIAR AUDIO A OPENAI
        ========================================
        */

        const formulario =
            new FormData();


        formulario.append(
            "file",
            archivoAudio,
            "explicacion.webm"
        );


        formulario.append(
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
                        formulario
                }
            );


        const datosTranscripcion =
            await respuestaTranscripcion.json();


        if (!respuestaTranscripcion.ok) {

            console.error(
                "Error transcripción:",
                datosTranscripcion
            );

            return res.status(500).json({
                error:
                    "No se pudo transcribir el audio."
            });

        }


        const transcripcion =
            datosTranscripcion.text || "";


        /*
        ========================================
        3. EVALUAR EXPLICACIÓN
        ========================================
        */

        const prompt = `
Eres un profesor de contabilidad.

El estudiante debía explicar el siguiente concepto:

CONCEPTO:
${concepto}

Esta fue su explicación transcrita:

"${transcripcion}"

Evalúa si realmente parece comprender el concepto.

Responde EXCLUSIVAMENTE en JSON con esta estructura:

{
  "aprobado": true,
  "nota": 8,
  "nivel": "Bueno",
  "retroalimentacion": "Explicación clara...",
  "fortalezas": [
    "..."
  ],
  "por_mejorar": [
    "..."
  ]
}

La nota debe ser de 0 a 10.

Considera que:

0-4 = No demuestra comprensión suficiente.
5-6 = Comprensión básica.
7-8 = Buena comprensión.
9-10 = Excelente comprensión.

No evalúes la gramática ni la forma de hablar.
Evalúa principalmente si entiende el concepto, para qué sirve y cómo se aplica.
`;


        const respuestaIA =
            await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + apiKey
                    },

                    body: JSON.stringify({

                        model: "gpt-4o-mini",

                        response_format: {
                            type: "json_object"
                        },

                        messages: [

                            {
                                role: "system",
                                content:
                                    "Eres un profesor experto en contabilidad."
                            },

                            {
                                role: "user",
                                content: prompt
                            }

                        ]

                    })
                }
            );


        const datosIA =
            await respuestaIA.json();


        if (!respuestaIA.ok) {

            console.error(
                "Error evaluación:",
                datosIA
            );

            return res.status(500).json({
                error:
                    "No se pudo evaluar la explicación."
            });

        }


        const contenido =
            datosIA.choices?.[0]?.message?.content;


        if (!contenido) {

            return res.status(500).json({
                error:
                    "La IA no devolvió una evaluación."
            });

        }


        let evaluacion;


        try {

            evaluacion =
                JSON.parse(contenido);

        } catch (error) {

            console.error(
                "Error convirtiendo evaluación:",
                contenido
            );

            return res.status(500).json({
                error:
                    "La respuesta de la IA no tuvo el formato esperado."
            });

        }


        /*
        ========================================
        4. DEVOLVER RESULTADO
        ========================================
        */

        return res.status(200).json({

            transcripcion:
                transcripcion,

            aprobado:
                evaluacion.aprobado,

            nota:
                evaluacion.nota,

            nivel:
                evaluacion.nivel,

            retroalimentacion:
                evaluacion.retroalimentacion,

            fortalezas:
                evaluacion.fortalezas || [],

            por_mejorar:
                evaluacion.por_mejorar || []

        });


    } catch (error) {

        console.error(
            "ERROR GENERAL:",
            error
        );


        return res.status(500).json({

            error:
                error.message ||
                "Ocurrió un error al procesar la explicación."

        });

    }

}
