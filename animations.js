// animations.js - 過關特效邏輯

function triggerSuccessAnimation() {
  const overlay = document.getElementById('success-overlay');
  if (!overlay) return;
  
  overlay.classList.add('show-anim');
  
  // Confetti Animation
  if (typeof confetti !== 'undefined') {
    var duration = 3000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d4af37', '#8b3a3a', '#c8a97e'] // 金色、紅磚色、木頭色
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d4af37', '#8b3a3a', '#c8a97e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}
