export class QRPage {
  debug(bool) {
    this.debug = bool;
  }

  setup(canvas) {
    this.isImporting = false;

    this.canvas = canvas;

    this.capture = createCapture(VIDEO);
    this.capture.hide();
    
    this.detector = new AR.Detector();
  }

  draw() {
    if (!this.isImporting) { return; }

    let img = createImage(this.capture.width, this.capture.height);
    img.copy(this.capture, 0, 0, this.capture.width, this.capture.height, 0, 0, this.capture.width, this.capture.height)

    img.loadPixels();
    let imageDuckType = { data: img.pixels, width: this.capture.width, height: this.capture.height }

    var markers = this.detector.detect(imageDuckType);

    image(img, 0, 0, img.width, img.height)
   
    markers.forEach((marker) => {
      stroke(color(255, 0, 0))
      line(marker.corners[0].x, marker.corners[0].y, marker.corners[1].x, marker.corners[1].y);
      line(marker.corners[1].x, marker.corners[1].y, marker.corners[2].x, marker.corners[2].y);
      line(marker.corners[2].x, marker.corners[2].y, marker.corners[3].x, marker.corners[3].y);
      line(marker.corners[3].x, marker.corners[3].y, marker.corners[0].x, marker.corners[0].y);
    })

    if (this.allCornersFound(markers)) {
      this.foundImage = img;
      this.markers = markers;
      this.isImporting = false;
    } 
  }

  reset() {
    this.foundImage = null;
    this.markers = null;
  }
  
  allCornersFound(markers) {
    for (let i of [1, 2, 3, 4]) {
      if (markers.find(m => m.id == i)) {
        // nop
      } else {
        return false;
      }
    }

    return true;
  }

  importPicture() {
    this.isImporting = true;
  }
}
