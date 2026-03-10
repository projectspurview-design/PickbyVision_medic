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

// Send photo (placeholder - in a real app, this would send to a server)
function sendPhoto() {
    // Show success message
    const sendButton = document.querySelector('.btn-send');
    const originalText = sendButton.innerHTML;
    
    sendButton.innerHTML = '✅ Sent!';
    sendButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    // Reset button after 2 seconds
    setTimeout(() => {
        sendButton.innerHTML = originalText;
    }, 2000);
    
    // In a real application, you would send the image to a server here
    // For example:
    // const imageData = document.getElementById('previewImage').src;
    // fetch('/api/send-photo', {
    //     method: 'POST',
    //     body: JSON.stringify({ image: imageData }),
    //     headers: { 'Content-Type': 'application/json' }
    // });
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
