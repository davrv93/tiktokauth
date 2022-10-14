const ENDPOINT = 'http://localhost:5000'

const TEXT_BYTE_LIMIT = 300
const textEncoder = new TextEncoder()

window.onload = () => {
    document.getElementById('charcount').textContent = `0/${TEXT_BYTE_LIMIT}`
    const req = new XMLHttpRequest()
    enableControls();

    /*
    req.open('GET', `${ENDPOINT}/api/status`, false)
    req.send()

    let resp = JSON.parse(req.responseText)
    if (resp.data) {
        if (resp.data.available) {
            console.info(`${resp.data.meta.dc} (age ${resp.data.meta.age} minutes) is able to provide service`)
            enableControls()
        } else {
            console.error(`${resp.data.meta.dc} (age ${resp.data.meta.age} minutes) is unable to provide service`)
            setError(
                `Service not available${resp.data.message && resp.data.message.length > 1 ? ` (<b>"${resp.data.message}"</b>)` : ''}, try again later or check the <a href='https://github.com/Weilbyte/tiktok-tts'>GitHub</a> repository for more info`
                )
        }
    } else {
        setError('Error querying API status, try again later or check the <a href=\'https://github.com/Weilbyte/tiktok-tts\'>GitHub</a> repository for more info')
    }  */
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

            withCredentials: true,
            credentials: 'same-origin',
        }).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error.response)
        });

        /*

      req.open('POST', `${ENDPOINT}/api/generate`, false)
      req.setRequestHeader('Content-Type', 'application/json')
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      req.setRequestHeader('Access-Control-Allow-Origin', '*');
      req.send(JSON.stringify({
          text: text,
          voice: voice
      }))

      let resp = JSON.parse(req.responseText)
      if (resp.data === null) {
          setError(`<b>Generation failed</b><br/> ("${resp.error}")`)
      } else {
          setAudio(resp.data, text)
      }*/
    } catch {
        setError('Error submitting form (printed to F12 console)')
        console.log('^ Please take a screenshot of this and create an issue on the GitHub repository if one does not already exist :)')
        console.log('If the error code is 503, the service is currently unavailable. Please try again later.')
        console.log(`Voice: ${voice}`)
        console.log(`Text: ${text}`)
    }

    enableControls()
}