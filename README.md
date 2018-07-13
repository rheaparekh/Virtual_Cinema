### Real Time Face Recognization
---
# Overview:

This app takes snapshots in real time from your webcam and verifies if it matches with the user's face. It uses microsoft cognitive face API for face verification and WebRTC for connection with webcam.

---
# To Setup:
---

```
git clone https://github.com/rheaparekh/Virtual_Cinema.git
```

```
npm install
```
To add image path:
```
   $.ajax({
           url:"https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?" + $.param(params),
           beforeSend: function (xhrObj) {
                  xhrObj.setRequestHeader("Content-Type", "application/json");
                  xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", key2);
           },
           type:"POST",
           data:'{"url": <ADD LINK TO HOSTED IMAGE>}
   })
```

Add your microsoft azure key

```
   var key1= <ADD KEY>
```


