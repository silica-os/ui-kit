(() => {
  document.documentElement.dataset.flat = '1'
  const shell = document.querySelector('.shell'); if (shell) shell.style.cssText += ';height:auto!important';
  const main = document.querySelector('main'); if (main) main.style.cssText += ';overflow:visible!important;height:auto!important';
  document.querySelectorAll('#app, html, body').forEach((e) => { e.style.cssText += ';height:auto!important;overflow:visible!important' });
  const side = document.querySelector('.side'); if (side) side.style.display = 'none';
  return 1
})()
