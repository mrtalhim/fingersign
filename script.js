document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('signature-pad');
    const clearButton = document.getElementById('clear');
    const saveButton = document.getElementById('save');
    const signaturePad = new SignaturePad(canvas);

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        signaturePad.clear(); // Clear the canvas on resize
    }

    function handleTouchEvent(event) {
        const rect = canvas.getBoundingClientRect();
        const touch = event.changedTouches[0];
        const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
        return { x, y };
    }

    canvas.addEventListener('touchstart', (event) => {
        const point = handleTouchEvent(event);
        signaturePad._strokeBegin(point);
    });

    canvas.addEventListener('touchmove', (event) => {
        const point = handleTouchEvent(event);
        signaturePad._strokeUpdate(point);
    });

    canvas.addEventListener('touchend', (event) => {
        const point = handleTouchEvent(event);
        signaturePad._strokeEnd(point);
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    clearButton.addEventListener('click', () => {
        signaturePad.clear();
    });

    saveButton.addEventListener('click', () => {
        if (!signaturePad.isEmpty()) {
            const dataURL = signaturePad.toDataURL();
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'signature.png';
            link.click();
        } else {
            alert('Please provide a signature first.');
        }
    });
});
