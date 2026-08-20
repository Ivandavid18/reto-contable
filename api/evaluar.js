export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método no permitido"
        });
    }

    try {

        const { audio, concepto } = req.body || {};

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

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "La API de OpenAI no está configurada."
            });
        }


        /*
        ========================================
        1. CONVERTIR BASE64 A ARCHIVO
        ========================================
        */

        const audioBuffer = Buffer.from(audio, "base64");

        const audioBlob = new Blob(
            [audioBuffer],
            {
                type: "audio/webm"
            }
        );


        /*
        ========================================
        2. TRANSCRIBIR
        ========================================
        */

        const formulario = new FormData();

        formulario.append(
            "file",
            audioBlob,
            "explicacion.webm"
        );

        formulario.append(
            "model",
            "gpt-4o-mini-transcribe"
        );


        const respuestaTranscripcion = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            {
                method: "POST",

                headers: {
                    "Authorization": "Bearer " + apiKey
                },

                body: formulario
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
                error: "No se pudo transcribir el audio."
            });

        }


        const transcripcion =
            datosTranscripcion.text || "";


        /*
        ========================================
        3. EVALUAR EXPLICACIÓN CON IA
        ========================================
        */

        const respuestaIA = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey
                },

                body: JSON.stringify({

                    model: "gpt-4o-mini",

                    messages: [

                        {
                            role: "system",

                            content:
                                "Eres un profesor de contabilidad. " +
                                "Evalúa si el estudiante realmente comprendió " +
                                "el concepto que está explicando. " +
                                "Sé justo, claro y breve."
                        },

                        {
                            role: "user",

                            content:
                                "Concepto que debía explicar: " +
                                concepto +

                                "\n\nExplicación del estudiante:\n" +
                                transcripcion +

                                "\n\nEvalúa la explicación y responde exactamente con esta estructura:\n\n" +

                                "RESULTADO: APROBADO o NECESITA REPASAR\n" +

                                "PUNTUACIÓN: X/10\n" +

                                "FORTALEZA: una frase\n" +

                                "DEBE MEJORAR: una frase\n" +

                                "RECOMENDACIÓN: una frase"
                        }

                    ],

                    temperature: 0.2

                })
            }
        );


        const datosIA =
            await respuestaIA.json();


        if (!respuestaIA.ok) {

            console.error(
                "Error evaluación IA:",
                datosIA
            );

            return res.status(500).json({
                error: "No se pudo evaluar la explicación."
            });

        }


        const evaluacion =
            datosIA.choices?.[0]?.message?.content || "";


        /*
        ========================================
        4. RESPUESTA
        ========================================
        */

        return res.status(200).json({

            ok: true,

            transcripcion: transcripcion,

            evaluacion: evaluacion

        });


    } catch (error) {

        console.error(
            "ERROR API:",
            error
        );

        return res.status(500).json({

            error:
                "Ocurrió un error al procesar la explicación."

        });

    }

}
