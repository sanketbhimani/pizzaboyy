if('serviceWorker' in navigator)
  {
    navigator.serviceWorker.register('./js/sw.js',{scope: './'})
    .then(
      function(registration){
        console.log('Service Worker Registered',registration);
      }
    );
  }