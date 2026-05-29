const form = document.querySelector('#qr-form');
const input = document.querySelector('#text');
const button = document.querySelector('#generate-button');
const errorMessage = document.querySelector('#error-message');
const previewBox = document.querySelector('#preview-box');
const qrImage = document.querySelector('#qr-image');
const downloadLink = document.querySelector('#download-link');
const clearButton = document.querySelector('#clear-button');

let currentImageUrl = '';

function setImageUrl(url) {
    if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
    }

    currentImageUrl = url;
    qrImage.src = url;
    downloadLink.href = url;
    previewBox.classList.add('has-image');
    downloadLink.classList.add('is-ready');
}

function clearPreview() {
    if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
    }

    currentImageUrl = '';
    qrImage.removeAttribute('src');
    downloadLink.removeAttribute('href');
    previewBox.classList.remove('has-image');
    downloadLink.classList.remove('is-ready');
    errorMessage.textContent = '';
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    if (!input.value.trim()) {
        errorMessage.textContent = 'Please enter text or a URL before generating a QR code.';
        input.focus();
        return;
    }

    button.disabled = true;
    button.textContent = 'Generating';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || 'Unable to generate the QR code.');
        }

        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = 'Generate';
    }
});

clearButton.addEventListener('click', () => {
    input.value = '';
    input.focus();
    clearPreview();
});
