/* Static dashboard: no database, build tools or external libraries. */
(function () {
  'use strict';
  var config = window.DASHBOARD, viewer = document.getElementById('viewer');
  var frame = document.getElementById('frame'), wake = document.getElementById('wake');
  var idleTimer, slideTimer, slideIndex = 0, rotation = false, previousFocus;
  function validURL(value) {
    try { var url = new URL(value, location.href); return value && url.protocol === 'https:' ? url.href : null; } catch (_) { return null; }
  }
  function clock() {
    var now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString('es-UY', {timeZone:'America/Montevideo',hour:'2-digit',minute:'2-digit',hour12:false});
    document.getElementById('date').textContent = now.toLocaleDateString('es-UY', {timeZone:'America/Montevideo',weekday:'long',day:'numeric',month:'long'});
  }
  function resetIdle() {
    clearTimeout(idleTimer);
    if (!viewer.hidden) return;
    idleTimer = setTimeout(startRotation, Math.max(10, Number(config.idleSeconds) || 90) * 1000);
  }
  function show(section, automatic) {
    previousFocus = document.activeElement;
    clearTimeout(idleTimer); rotation = automatic;
    viewer.hidden = false; viewer.classList.toggle('rotating', automatic); wake.hidden = !automatic;
    document.getElementById('menu').hidden = true;
    document.getElementById('section-title').textContent = section.title.replace('|', ' ');
    document.getElementById('external').href = validURL(section.url);
    frame.src = validURL(section.url);
    (automatic ? wake : document.getElementById('back')).focus();
  }
  function back() {
    clearTimeout(slideTimer); rotation = false; frame.src = 'about:blank';
    viewer.hidden = true; document.getElementById('menu').hidden = false;
    if (previousFocus && previousFocus.focus) previousFocus.focus(); resetIdle();
  }
  function startRotation() {
    var slides = config.sections.filter(function(s){return s.embed && s.rotate && validURL(s.url);});
    if (!slides.length) { resetIdle(); return; }
    function next() { show(slides[slideIndex++ % slides.length], true); slideTimer = setTimeout(next, Math.max(5, Number(config.slideSeconds) || 25) * 1000); }
    next();
  }
  config.sections.forEach(function(section){
    var button = document.createElement('button'); button.type = 'button';
    var icon = document.createElement('span'); icon.className = 'icon'; icon.setAttribute('aria-hidden','true'); icon.textContent = section.icon;
    var label = document.createElement('span'); label.className = 'label';
    section.title.split('|').forEach(function(line,i){if(i) label.appendChild(document.createElement('br'));label.appendChild(document.createTextNode(line));});
    button.appendChild(icon); button.appendChild(label);
    button.addEventListener('click',function(){
      var url = validURL(section.url);
      if (!url) { document.getElementById('notice').textContent = 'Falta configurar el enlace de ' + section.title.replace('|',' ') + '.'; return; }
      if (section.embed) show(section,false); else window.open(url,'_blank','noopener,noreferrer');
    }); document.getElementById('buttons').appendChild(button);
  });
  document.getElementById('back').onclick = back;
  wake.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();back();});
  wake.onclick = function(){if(rotation) back();};
  document.addEventListener('keydown',function(e){if(e.key === 'Escape' || rotation) back(); else resetIdle();});
  ['pointerdown','pointermove','touchstart'].forEach(function(event){document.addEventListener(event,function(){if(!rotation) resetIdle();},{passive:true});});
  document.getElementById('fullscreen').onclick = function(){
    if (!document.documentElement.requestFullscreen) {document.getElementById('notice').textContent='Usá la opción de pantalla completa del navegador.';return;}
    document.documentElement.requestFullscreen().catch(function(){document.getElementById('notice').textContent='El navegador no permitió pantalla completa.';});
  };
  async function weather() {
    var element = document.getElementById('weather');
    if (!validURL(config.weatherEndpoint)) return;
    var controller = new AbortController(), timeout = setTimeout(function(){controller.abort();},10000);
    try {
      var response = await fetch(config.weatherEndpoint,{signal:controller.signal}); if(!response.ok) throw Error('Weather');
      var data = await response.json(); if(typeof data.temperature !== 'number' || !Number.isFinite(data.temperature)) throw Error('Temperature');
      var code = data.code, symbol = code === 0 ? '☀️' : code <= 3 ? '⛅' : code <= 48 ? '🌫️' : code >= 95 ? '⛈️' : code >= 71 && code <= 77 ? '❄️' : '🌧️';
      element.textContent = symbol + ' ' + Math.round(data.temperature) + ' °C'; element.title='Clima actualizado: '+new Date().toLocaleTimeString('es-UY');
    } catch (_) { element.textContent='Clima no disponible'; } finally {clearTimeout(timeout);}
  }
  clock(); setInterval(clock,1000); weather(); setInterval(weather,600000); resetIdle();
})();
