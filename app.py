from flask import Flask, jsonify, render_template, request, send_file
import qrcode
import io

app = Flask(__name__)
MAX_TEXT_LENGTH = 1200


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    data = request.form.get('text', '').strip()
    if not data:
        return jsonify({'error': 'Please enter text or a URL before generating a QR code.'}), 400
    if len(data) > MAX_TEXT_LENGTH:
        return jsonify({'error': f'QR content must be {MAX_TEXT_LENGTH} characters or fewer.'}), 413

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=12,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    image = qr.make_image(fill_color='#111827', back_color='white')

    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(
        img_io,
        mimetype='image/png',
        as_attachment=False,
        download_name='qr-code.png',
        max_age=0,
    )


if __name__ == '__main__':
    app.run(debug=True)
