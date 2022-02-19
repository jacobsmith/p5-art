// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
var ball = Bodies.circle(450, 50, 8, { render: {
  fillStyle: '#FFFFFF'
}});
var plinko = [];
let even = true;

for (let i = 40; i < 750; i += 20) {
  for (let j = 40; j < 400; j += 20) {
    even = !even;
    plinko.push(Bodies.circle(i + (even ? 0 : 30), j, 1, {
      isStatic: true ,
      render: {
        fillStyle: '#FFFFFF'
      }
    }));
  }
}

// add all of the bodies to the world
Composite.add(engine.world, plinko);
Composite.add(engine.world, [ball]);

render.options.wireframes = false;

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

Events.on(runner, 'afterTick', function(event) {
  if (ball.position.y > 1600) {
    // setTimeout(() => {
      let newBallXPos = (Math.random() * 600)
      Body.setVelocity(ball, { x: 0, y: 0 });
      Body.setPosition(ball, { x: newBallXPos, y: 0 });
    // }, 2000);
  }
});


// run the engine
Runner.run(runner, engine);