// https://www.florin-pop.com/blog/2019/04/drawing-app-built-with-p5js/

const div = document.createElement('div');
div.innerHTML = `
<div class="sidebar">
  <ul style="display: flex; align-items: center; justify-content: space-between; color: white;">
    <li>
      <label for="color">Color:</label>
      <input type="color" id="color"/>
    </li>
    <li>
      <label for="weight">Stroke:</label>
      <input type="number" id="weight" min="2" max="200" value="3"/>
    </li>
    <li>
      <div id="send">SEND</div>
    </li>
  </ul>
</div>
`
document.body.appendChild(div);

const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const send = document.getElementById('send');
// const clear = document.getElementById('clear');
const paths = [];
let currentPath = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    // var pusher = new Pusher('a804478fa264a5596a28', {
    //   cluster: 'us2'
    // });

    const pusher = new Pusher({
      appId: "1346445",
      key: "a804478fa264a5596a28",
      secret: "3f9a16dd353279472fac",
      cluster: "us2",
      useTLS: true,
      authEndpoint: "https://5vctwhnzji.execute-api.us-east-1.amazonaws.com/default/pusher-projector-authorization",
    });
    
    var channel = pusher.subscribe('private-my-channel');
    channel.bind('client-my-event', function(data) {
      alert(JSON.stringify(data));
    });
   
    setTimeout(() => {
      channel.trigger("client-my-event", {
        message: "hello world"
      });
    }, 5000);
}

function draw() {
  noFill();
  
  if(mouseIsPressed){
    const point = {
      x: mouseX,
      y: mouseY,
      color: colorInput.value,
      weight: weight.value
    };
    currentPath.push(point);
  }
  
  paths.forEach(path => {
    beginShape();
    path.forEach(point => {
      stroke(point.color);
      strokeWeight(point.weight);
      vertex(point.x, point.y);
    });
    endShape();
  });
}

function mousePressed() {
  currentPath = [];
  paths.push(currentPath);
}

send.addEventListener('click', () => {

});

// clear.addEventListener('click', () => {
//   paths.splice(0);
//   background(255);
// });