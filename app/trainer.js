var apiai = require('apiai');
const bodyParser = require('body-parser')
var apiaiapp = apiai(process.env.APIAI_TOKEN);

export default function trainer(event) {
    let sender = event.user;
    let message = event.text;
    console.log(sender, 'sendign')
    console.log(event.text, 'text')

    let request = apiaiapp.textRequest(message, {
        sessionId: 'schedule4me'
    });

    // request.query = message;
    // byte_response = request.getresponse().read()
    // json_response = byte_response.decode('utf8').replace("'", '"')
    // response = json.loads(json_response)
    // console.log(response)

    request.on('response', function(response) {
        // console.log(response, 'given response that comes back');
        let aiText = response.result.fulfillment.speech;
        // console.log(aiText)
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
}
