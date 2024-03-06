from flask import Flask, request, jsonify
import requests
import whisper

model = whisper.load_model("tiny.en")

app = Flask(__name__)

@app.route('/', methods=['POST'])
def save_mp3():
    try:
       
        data = request.get_json()
        
        url = data['url'].replace('https://', 'http://', 1)

        response = requests.get(url)
        
        if response.status_code == 200:
            
            filename = "audio.mp3"

            with open(filename, 'wb') as file:
                file.write(response.content)
                
            text = model.transcribe(filename)

            print(text["text"])
            
            message = {'status': 'success', 'message': text["text"]}
        else:
            message = {'status': 'error', 'message': 'Failed to fetch MP3 file from the URL'}
    except Exception as e:
        message = {'status': 'error', 'message': str(e)}
    
    return jsonify(message)

if __name__ == '__main__':
    app.run(debug=True)
