(function() {
  var contentDiv, readBar, statusBar;

  statusBar = $('#status-bar');

  contentDiv = $(statusBar.data('element')).get(0);

  readBar = statusBar.find('div');

  document.addEventListener('scroll', function(e) {
    var current, ratio, total, viewportHeight;
    viewportHeight = window.innerHeight;
    total = contentDiv.clientHeight + contentDiv.offsetTop;
    current = $(document).scrollTop() - contentDiv.offsetTop + viewportHeight;
    if (current < 0) {
      ratio = "0%";
    } else {
      ratio = Math.round(current * 100 / total) + "%";
    }
    readBar.css('width', ratio);
  });

}).call(this);
