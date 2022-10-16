const ENDPOINT = 'https://erp.upeu.edu.pe/flask'

const TEXT_BYTE_LIMIT = 300
const textEncoder = new TextEncoder()

window.onload = () => {
    document.getElementById('charcount').textContent = `0/${TEXT_BYTE_LIMIT}`
    const req = new XMLHttpRequest()
    enableControls();
}

const setError = (message) => {
    clearAudio()
    document.getElementById('error').style.display = 'block'
    document.getElementById('errortext').innerHTML = message
}

const clearError = () => {
    document.getElementById('error').style.display = 'none'
    document.getElementById('errortext').innerHTML = 'There was an error.'
}

const setAudio = (base64, text) => {
    console.log(`data:audio/mpeg;base64,${base64}`);
    document.getElementById('success').style.display = 'block'
    document.getElementById('audio').src = `data:audio/mpeg;base64,${base64}`
    document.getElementById('generatedtext').innerHTML = `"${text}"`
}

const clearAudio = () => {
    document.getElementById('success').style.display = 'none'
    document.getElementById('audio').src = ``
    document.getElementById('generatedtext').innerHTML = ''
}

const disableControls = () => {
    document.getElementById('text').setAttribute('disabled', '')
    document.getElementById('voice').setAttribute('disabled', '')
    document.getElementById('submit').setAttribute('disabled', '')
}

const enableControls = () => {
    document.getElementById('text').removeAttribute('disabled')
    document.getElementById('voice').removeAttribute('disabled')
    document.getElementById('submit').removeAttribute('disabled')
}

const onTextareaInput = () => {
    const text = document.getElementById('text').value
    const textEncoded = textEncoder.encode(text)

    document.getElementById('charcount').textContent = `${textEncoded.length <= 999 ? textEncoded.length : 999}/${TEXT_BYTE_LIMIT}`

    if (textEncoded.length > TEXT_BYTE_LIMIT) {
        document.getElementById('charcount').style.color = 'red'
    } else {
        document.getElementById('charcount').style.color = 'black'
    }
}

const submitForm = () => {
    clearError()
    clearAudio()

    disableControls()

    let text = document.getElementById('text').value
    const textLength = new TextEncoder().encode(text).length
    console.log(textLength)

    if (textLength === 0) text = 'The fungus among us.'
    const voice = document.getElementById('voice').value

    if (voice == "none") {
        setError("No voice has been selected");
        enableControls()
        return
    }

    if (textLength > TEXT_BYTE_LIMIT) {
        setError(`Text must not be over ${TEXT_BYTE_LIMIT} UTF-8 chracters (currently at ${textLength})`)
        enableControls()
        return
    }

    try {
        const req = new XMLHttpRequest()
        generate_url = `${ENDPOINT}/api/generate`;
        console.log('test', JSON.stringify({
            req_text: text,
            text_speaker: voice,
            session_id: 'c1ec07afdb432ba4d3bcf23b96074abb'
        }));

        var bodyFormData = new FormData();
        bodyFormData.append('req_text', text);
        bodyFormData.append('text_speaker', voice);
        bodyFormData.append('session_id', 'c1ec07afdb432ba4d3bcf23b96074abb');

       axios(generate_url, {
            method: 'POST',
            mode: 'no-cors',


            data: bodyFormData,

            //withCredentials: true,
            credentials: 'same-origin',
        }).then(response => {
           
            console.log(response)
            setAudio(response.data.b64d, text);
        }).catch(error => {
            setError(`<b>Generation failed</b><br/> ("${resp.error}")`);
        });



    } catch {
        setError('Error submitting form (printed to F12 console)')
        console.log('^ Please take a screenshot of this and create an issue on the GitHub repository if one does not already exist :)')
        console.log('If the error code is 503, the service is currently unavailable. Please try again later.')
        console.log(`Voice: ${voice}`)
        console.log(`Text: ${text}`)
    }

    enableControls()
}
