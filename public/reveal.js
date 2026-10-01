// Scroll reveals. One observer, unobserve after firing, transforms only.
(function () {
  var targets = document.querySelectorAll('.reveal, .reveal-group');
  if (!targets.length || !('IntersectionObserver' in window)) {
    for (var i = 0; i < targets.length; i++) targets[i].classList.add('revealed');
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add('revealed');
        observer.unobserve(entries[i].target);
      }
    },
    { threshold: 0.15 }
  );

  for (var j = 0; j < targets.length; j++) observer.observe(targets[j]);
})();
