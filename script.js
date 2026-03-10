let stream = null;

// Handle file upload
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        displayImage(file);
    }
});

// Display image from file
function displayImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('previewImage').src = e.target.result;
        document.getElementById('previewSection').classList.remove('hidden');
        document.getElementById('cameraSection').classList.add('hidden');
        document.getElementById('fileInput').value = ''; // Reset file input
    };
    reader.readAsDataURL(file);
}

// Toggle camera visibility
function toggleCamera() {
    const cameraSection = document.getElementById('cameraSection');
    if (cameraSection.classList.contains('hidden')) {
        startCamera();
    } else {
        closeCamera();
    }
}

// Start camera
async function startCamera() {
    try {
        document.getElementById('cameraSection').classList.remove('hidden');
        document.getElementById('previewSection').classList.add('hidden');
        
        // Request camera access with specific constraints
        const constraints = {
            video: {
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('video');
        video.srcObject = stream;
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check your browser permissions.');
        document.getElementById('cameraSection').classList.add('hidden');
    }
}

// Capture photo from camera
function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert canvas to image and display
    const imageData = canvas.toDataURL('image/png');
    document.getElementById('previewImage').src = imageData;
    document.getElementById('previewSection').classList.remove('hidden');
    document.getElementById('cameraSection').classList.add('hidden');
    
    // Stop camera stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// Close camera
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    document.getElementById('cameraSection').classList.add('hidden');
    document.getElementById('video').srcObject = null;
}

// Download photo
function downloadPhoto() {
    const image = document.getElementById('previewImage').src;
    const link = document.createElement('a');
    link.href = image;
    link.download = `photo-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Clear photo
function clearPhoto() {
    document.getElementById('previewImage').src = '';
    document.getElementById('previewSection').classList.add('hidden');
    document.getElementById('fileInput').value = '';
}

// Handle page unload to clean up camera stream
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});
