const div = document.createElement('div');
div.style.marginTop = '50%';
div.style.maxWidth = '50vw';
div.innerHTML = `
<a class="weatherwidget-io" href="https://forecast7.com/en/40d04n86d13/westfield/?unit=us" data-label_1="WESTFIELD" data-icons="Climacons Animated" data-days="3" data-theme="dark" >WESTFIELD</a>
`;
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js');
document.body.appendChild(div)