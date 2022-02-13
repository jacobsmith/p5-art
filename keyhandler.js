document.addEventListener('keydown', handleKeyPress);

let rotateMode = false;
let rotation = 0;

function toggleRotateMode() {
  rotateMode = !rotateMode;
}

function toggleMenu() {
  const menu = document.getElementById('menu');

  console.log('toggleMenu');
  if (menu.style.display == 'none') {
    menu.style.display = '';
  } else {
    menu.style.display = 'none';
  }
}

function rotateModeHandle(e) {
  if (e.key == 'ArrowRight') {
    rotation = rotation + 0.1
    document.body.style.transform = `rotate(${rotation}deg)`
  } else if (e.key == 'ArrowLeft') {
    rotation = rotation - 0.1
    document.body.style.transform = `rotate(${rotation}deg)`
  } else if (e.key == 'r') {
    toggleRotateMode(); 
  } 
}

function handleKeyPress(e) {
  if (rotateMode) {
    return rotateModeHandle(e);
  }

  if (e.key == 'r') {
    toggleRotateMode();
  }
  
  if (e.key == 'ArrowRight') {
    increaseFile();
  } else if (e.key == 'ArrowLeft') {
    decreaseFile();
  } else if (e.key == 'm') {
    toggleMenu();
  }
}
