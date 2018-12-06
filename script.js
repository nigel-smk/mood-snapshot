const mediaConstraints = {
  video: true
}
const subscriptionKey = '<your_subscription_key>'; // TODO get your own from https://azure.microsoft.com/en-ca/services/cognitive-services/face/
let globalStream;

navigator.mediaDevices.getUserMedia(mediaConstraints)
.then(function(stream) {
  onStream(stream);
})
.catch(function(err) {
  console.error(err);
});

function onStream(stream) {
  globalStream = stream;
  startLiveVideo(stream);
}

function startLiveVideo(stream) {
  const videoElem = document.getElementById('live-feed');
  videoElem.srcObject = stream;
  videoElem.play();
}

function takeSnapshot() {
  const track = globalStream.getVideoTracks()[0];
  imageCapture = new ImageCapture(track);
  imageCapture.takePhoto().then(blob => {
    const imgElem = document.getElementById('snapshot');
    imgElem.src = URL.createObjectURL(blob);
    postImage(blob);
  });
}

function postImage(blob) {
  let url = new URL("https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect")
  url.searchParams.append('returnFaceId', 'true');
  url.searchParams.append('returnFaceLandmarks', 'false');
  url.searchParams.append('returnFaceAttributes', 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise');

  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    },
    body: blob
  })
  .then(response => {
    return response.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error(err))

}