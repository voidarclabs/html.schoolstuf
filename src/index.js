window.addEventListener('message', function(event) {
    // Log the message received from the iframe
    console.log('URL received:', event.data);

    var url = event.data;

    document.getElementById('iframe-content').src = url;
  });