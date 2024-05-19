
function exportVideo(chunks) {
    var blob = new Blob(chunks, { 'type': 'video/webm' });

    // Draw video to screen
    var videoElement = document.createElement('video');
    videoElement.setAttribute("id", Date.now());
    videoElement.controls = true;
    document.body.appendChild(videoElement);
    videoElement.src = window.URL.createObjectURL(blob);

    // Download the video 
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'newVid.webm';
    a.click();
    window.URL.revokeObjectURL(url);

    videoElement.remove()
}


export function record(chunks, framerate = 60) {
    chunks.length = 0;
    let stream = document.querySelector('canvas').captureStream(framerate);
    const bitrate = 50000000;
    const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: bitrate
    });
    recorder.ondataavailable = e => {
        if (e.data.size) {
            chunks.push(e.data);
        }
    };
    recorder.onstop = () => exportVideo(chunks);
    recorder.start();
    return recorder
}