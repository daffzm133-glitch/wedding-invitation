document.addEventListener('DOMContentLoaded', () => {
  // --- 0. Dynamic Guest Name ---
  const guestNameDisplay = document.getElementById('guest-name-display');
  if (guestNameDisplay) {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    if (guestName) {
      guestNameDisplay.innerText = guestName;
    } else {
      guestNameDisplay.innerText = "Tamu Undangan";
    }
  }

  // --- 1. Door Animation & Initialization ---
  const openDoorBtn = document.getElementById('open-door-btn');
  const doorContainer = document.getElementById('door-container');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');

  // Disable scrolling initially
  document.body.style.overflow = 'hidden';

  openDoorBtn.addEventListener('click', () => {
    // Open doors
    doorContainer.classList.add('open');
    
    // Attempt to play music (browsers require user interaction)
    bgMusic.play().then(() => {
      musicBtn.classList.add('playing');
    }).catch(error => {
      console.log('Autoplay prevented by browser:', error);
    });

    // Zoom in main content immediately so it scales while doors open
    mainContent.classList.add('visible');

    // Show main content and allow scroll
    setTimeout(() => {
      doorContainer.style.display = 'none';
      document.body.style.overflow = 'auto';
      musicBtn.classList.add('visible');

      
      // Trigger initial scroll reveal
      reveal();
    }, 1200);
  });

  // --- 2. Background Music Controller ---
  let isMusicPlaying = false;
  
  bgMusic.onplaying = () => {
    isMusicPlaying = true;
    musicBtn.classList.add('playing');
  };
  
  bgMusic.onpause = () => {
    isMusicPlaying = false;
    musicBtn.classList.remove('playing');
  };

  musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      bgMusic.pause();
    } else {
      bgMusic.play();
    }
  });

  // --- 3. Scroll Reveal Animation ---
  const reveals = document.querySelectorAll('.reveal');

  function reveal() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100; // Trigger point

    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', reveal);

  // --- 4. Countdown Timer ---
  // Set the date we're counting down to (25 August 2026, 09:30:00)
  const countDownDate = new Date("Aug 25, 2026 09:30:00").getTime();

  const countdownTimer = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result with leading zeros
    document.getElementById("days").innerText = days < 10 ? '0' + days : days;
    document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;

    // If the count down is finished
    if (distance < 0) {
      clearInterval(countdownTimer);
      document.getElementById("countdown").innerHTML = "<h3>Acara Telah Dimulai</h3>";
    }
  }, 1000);

  // --- 5. RSVP Form Handling (Google Apps Script) ---
  const rsvpForm = document.getElementById('rsvp-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  
  if(rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      
      // Loading state
      submitBtn.innerText = 'Kiriming Pesan...';
      submitBtn.disabled = true;

      // Get form data natively (tanpa diubah ke string)
      const formData = new FormData(rsvpForm);
      
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwyFTIWVztomYILn22XyUZYXEPg6eEL-kjMvF4-I-aNPRTIAVDlcbv8J-XreUrrlUp4/exec';
      
      fetch(scriptURL, { 
        method: 'POST', 
        body: formData
      })
      .then(response => {
        // Success
        rsvpForm.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        if (successModal) {
          successModal.classList.add('show');
        } else {
          alert('Matur Nuwun, panyuwun donga pangestu panjenengan sampun katampi.');
        }
      })
      .catch(error => {
        console.error('Error!', error.message);
        alert('Maaf, terjadi kesalahan saat mengirim. Silakan coba lagi nanti.');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // Close Modal Logic
  if(closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('show');
    });

    // Close when clicking outside content
    window.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('show');
      }
    });
  }

  // --- 6. Front Layer Particles (Golden Light) ---
  const canvas = document.getElementById('particles-canvas');
  if(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particlesArray = [];
    const numberOfParticles = 40;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (this.y > canvas.height) {
          this.y = 0 - this.size;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

});
