export async function testMediaDevices(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoElement) {
      videoElement.srcObject = stream;
    }

    console.log("Camera and microphone access granted");
    return stream;
  } catch (error) {
    console.error("Error accessing media devices:", error);
    return null;
  }
}