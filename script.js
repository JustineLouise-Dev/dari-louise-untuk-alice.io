(function () {
  const $ = (id) => document.getElementById(id);

  const box = $('pergeseran');
  const slides = Array.from(box.querySelectorAll(':scope > p'));
  const totalSlide = slides.length;
  const dotsContainer = $('dots-container');
  const audio = new Audio($('linkmp3').src);
  const deffotostiker = $('fotostiker').src;

  // fase: 'intro' -> 'slides' -> 'akhir'
  let fase = 'intro';
  let index = 0;
  let terkunci = true;
  let katakata = '';

  $('Content').style.cssText = 'opacity:1;margin-top:14vh';

  // ---------- Dots ----------
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', (e) => { e.stopPropagation(); if (fase === 'slides') pergi(i); });
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  // ---------- Intro: tombol love ----------
  function mulai() {
    if (fase !== 'intro') return;
    fase = 'mulai';
    ['loveIn', 'ftAwal', 'ket', 'link'].forEach((id) => {
      $(id).style.cssText = 'transition:all .5s ease;opacity:0';
    });
    setTimeout(() => {
      ['loveIn', 'ftAwal', 'ket', 'link'].forEach((id) => { $(id).style.display = 'none'; });
      $('Content').style.cssText = 'opacity:1;margin-top:10vh';
      audio.play().catch(() => {});
      setTimeout(tampilkanSlide, 200);
    }, 300);
  }
  const love = $('loveIn');
  love.addEventListener('click', (e) => { e.stopPropagation(); mulai(); });
  love.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') mulai(); });

  // ---------- Slide ----------
  function tampilkanSlide() {
    box.style.cssText = 'position:relative;opacity:1;transform:scale(1);';
    $('keterangan').style.cssText = 'opacity:.7';
    dotsContainer.style.opacity = '1';
    fase = 'slides';
    aktifkan(0, false);
    setTimeout(() => { terkunci = false; }, 600);
  }

  function aktifkan(i, animasi = true) {
    index = i;
    const target = slides[i];
    const kiri = target.offsetLeft - (box.clientWidth - target.offsetWidth) / 2;
    box.scrollTo({ left: Math.max(0, kiri), behavior: animasi ? 'smooth' : 'auto' });
    slides.forEach((s, n) => s.classList.toggle('aktif', n === i));
    dots.forEach((d, n) => d.classList.toggle('active', n === i));
  }

  function pergi(i) {
    if (terkunci || i < 0 || i === index) return;
    terkunci = true;
    $('swipeHint').classList.add('hilang');
    aktifkan(i);
    setTimeout(() => { terkunci = false; }, 600);
  }

  function berikutnya() {
    if (fase !== 'slides' || terkunci) return;
    if (index >= totalSlide - 1) return aksiakhir();
    pergi(index + 1);
  }
  function sebelumnya() {
    if (fase !== 'slides') return;
    pergi(index - 1);
  }

  // ---------- Gestur: tap, swipe, keyboard ----------
  let mulaiX = null;
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, label, .dot')) { mulaiX = null; return; }
    mulaiX = e.clientX;
  });
  document.addEventListener('pointerup', (e) => {
    if (mulaiX === null) return;
    const dx = e.clientX - mulaiX;
    mulaiX = null;
    if (fase !== 'slides') return;
    if (dx < -40) berikutnya();        // geser kiri -> lanjut
    else if (dx > 40) sebelumnya();    // geser kanan -> kembali
    else if (Math.abs(dx) < 10) berikutnya(); // tap biasa
  });
  document.addEventListener('pointercancel', () => { mulaiX = null; });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') berikutnya();
    if (e.key === 'ArrowLeft') sebelumnya();
  });

  // ---------- Akhir: kado -> pesan ----------
  function aksiakhir() {
    fase = 'akhir';
    box.style.cssText = 'position:relative;';
    dotsContainer.style.opacity = '0';
    $('keterangan').style.opacity = '0';
    $('bodyblur').style.opacity = '.2';
    setTimeout(() => {
      $('gift').classList.add('animate');
      $('teksgift').classList.add('textanimate');
      setTimeout(bqmuncul, 2000);
    }, 600);
  }

  function bqmuncul() {
    $('bodyblur').style.cssText = '';
    const kalimat = $('kalimat');
    katakata = kalimat.innerHTML;
    kalimat.innerHTML = '';
    $('Content').style.cssText = 'opacity:1;margin-top:7vh';
    $('fotostiker').style.display = 'none';
    box.style.display = 'none';
    dotsContainer.style.display = 'none';
    $('keterangan').style.display = 'none';
    $('bq').style.cssText = 'position:relative;opacity:1;visibility:visible;margin-top:0;transform:scale(1);';
    setTimeout(kalimatakhir, 200);
    gantiStiker(deffotostiker);
  }

  function kalimatakhir() {
    new TypeIt('#kalimat', {
      strings: [katakata], startDelay: 50, speed: 37, cursor: true,
      afterComplete: function () {
        $('kalimat').innerHTML = katakata;
        setTimeout(munculteksnim, 300);
      },
    }).go();
  }

  function munculteksnim() {
    const t = $('teksnim');
    t.style.cssText = 'position:relative;opacity:1;transform:scale(1);margin:20px auto';
    setTimeout(() => { t.style.animation = 'rto .8s infinite alternate'; }, 550);
    gantiStiker($('fotostiker1').src);
  }

  function gantiStiker(src) {
    const f = $('fotostiker');
    f.style.cssText = 'display:inline-flex;opacity:0;transform:scale(0)';
    setTimeout(() => {
      f.src = src;
      f.style.cssText = 'display:inline-flex;opacity:1;transform:scale(1)';
    }, 250);
  }
})();