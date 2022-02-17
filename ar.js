  const cv = document.createElement('script');  
  cv.src = "/js-aruco/src/cv.js"

  const aruco = document.createElement('script');
  aruco.src = "/js-aruco/src/aruco.js";
  
  const polyfill = document.createElement('script');
  polyfill.src = "/js-aruco/samples/getusermedia/libs/polyfill.js";

  const canvasEl = document.createElement('canvas');
  canvasEl.style.width = '640px';
  canvasEl.style.height = '480px';
  canvasEl.id = 'canvas';
  canvasEl.style.display = 'none';
  canvasEl.style.position = 'absolute';

  const videoEl = document.createElement('video');
  videoEl.id = 'video';
  videoEl.autoplay = true;
  videoEl.style.display = 'none';

  document.head.appendChild(polyfill);
  document.head.appendChild(cv);
  document.head.appendChild(aruco);

  document.body.appendChild(canvasEl);
  document.body.appendChild(videoEl);

  var video, canvas, context, imageData, detector, shouldDetect;

  function onLoad(){
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
  
    canvas.width = parseInt(canvas.style.width);
    canvas.height = parseInt(canvas.style.height);
    
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }
    
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function(stream) {
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      }
    );
      
    detector = new AR.Detector();

    requestAnimationFrame(tick);
  }

  window.toggleDetection = function() {
    shouldDetect = !shouldDetect;
    if (shouldDetect) {
      canvas.style.display = '';
    } else {
      canvas.style.display = 'none';
    }
  }
  
  function allCornersFound(markers) {
    for (let i of [1, 2, 3, 4]) {
      if (markers.find(m => m.id == i)) {
        // nop
      } else {
        return false;
      }
    }

    return true;
  }

  function tick(){
    requestAnimationFrame(tick);
    
    if ((video.readyState === video.HAVE_ENOUGH_DATA) && shouldDetect) {
      snapshot();

      var markers = detector.detect(imageData);
      if (markers.length > 0) {
        console.log(markers);
      }
      drawCorners(markers);
      drawId(markers);

      if (allCornersFound(markers)) {
        window.foundPage(markers, imageData);
        window.toggleDetection(); // turn off detection
      }
    }
  }

  function snapshot(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  }
        
  function drawCorners(markers){
    var corners, corner, i, j;
  
    context.lineWidth = 3;

    for (i = 0; i !== markers.length; ++ i){
      corners = markers[i].corners;
      
      context.strokeStyle = "red";
      context.beginPath();
      
      for (j = 0; j !== corners.length; ++ j){
        corner = corners[j];
        context.moveTo(corner.x, corner.y);
        corner = corners[(j + 1) % corners.length];
        context.lineTo(corner.x, corner.y);
      }

      context.stroke();
      context.closePath();
      
      context.strokeStyle = "green";
      context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
    }
  }

  function drawId(markers){
    var corners, corner, x, y, i, j;
    
    context.strokeStyle = "blue";
    context.lineWidth = 1;
    
    for (i = 0; i !== markers.length; ++ i){
      corners = markers[i].corners;
      
      x = Infinity;
      y = Infinity;
      
      for (j = 0; j !== corners.length; ++ j){
        corner = corners[j];
        
        x = Math.min(x, corner.x);
        y = Math.min(y, corner.y);
      }

      context.strokeText(markers[i].id, x, y)
    }
  }



  window.onload = onLoad;
