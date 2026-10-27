const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

// ====================
// NAVBAR SCROLL EFFECT
// ====================

// Solid setelah lewat hero, sembunyi saat scroll ke bawah, muncul saat scroll ke atas
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    navbar.classList.toggle('hidden', y > window.innerHeight * 0.6 && y > lastScrollY && !document.body.classList.contains('no-scroll'));
    lastScrollY = y;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });
updateNavbar();

// ====================
// SMOOTH SCROLL
// ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
});

// ====================
// SCROLL SPY & REVEAL
// ====================

const spyLinks = document.querySelectorAll('[data-spy]');

if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            spyLinks.forEach(link => link.classList.toggle('active', link.dataset.spy === entry.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('#home, main section[id]').forEach(section => spyObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// ====================
// CONTACT FORM SUBMIT
// ====================

const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitLabel = form.querySelector('.submit-label');
const submitBtn = form.querySelector('.submit-btn');

function validateField(input) {
    const valid = input.value.trim() !== '' && input.checkValidity();
    input.closest('.form-field').classList.toggle('invalid', !valid);
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
}

form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => input.value && validateField(input));
    input.addEventListener('input', () => {
        if (input.closest('.form-field').classList.contains('invalid')) validateField(input);
    });
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const inputs = Array.from(form.querySelectorAll('.form-input'));
    const invalid = inputs.filter(input => !validateField(input));
    if (invalid.length) {
        invalid[0].focus();
        return;
    }

    // Simulasi pengiriman, ganti dengan request ke backend/layanan email
    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';

    setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitLabel.textContent = 'Send Message';
        successMessage.textContent = "Thank you for reaching out. I'll be in touch soon.";
        setTimeout(() => { successMessage.textContent = ''; }, 5000);
    }, 900);
});

// ====================
// SIDEBAR TOGGLE
// ====================

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebarOverlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    sidebarClose.focus();
}

function closeSidebar() {
    if (!sidebar.classList.contains('open')) return;
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    sidebarOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', () => {
    closeSidebar();
    hamburger.focus();
});
sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// Tutup otomatis jika layar melebar ke ukuran desktop
window.matchMedia('(min-width: 861px)').addEventListener('change', e => e.matches && closeSidebar());

// ====================
// LIGHTBOX GALLERY
// ====================

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxTitle = lightbox.querySelector('.lightbox-title');
const lightboxCounter = lightbox.querySelector('.lightbox-counter');
const galleryTriggers = Array.from(document.querySelectorAll('.gallery-trigger'));
let currentIndex = 0;
let lastFocused = null;

function showImage(index) {
    currentIndex = (index + galleryTriggers.length) % galleryTriggers.length;
    const trigger = galleryTriggers[currentIndex];
    const thumb = trigger.querySelector('img');

    lightboxImg.classList.remove('loaded');
    lightboxImg.onload = () => lightboxImg.classList.add('loaded');
    lightboxImg.src = trigger.dataset.full;
    lightboxImg.alt = thumb.alt;
    lightboxTitle.textContent = trigger.querySelector('.gallery-label').lastChild.textContent.trim();
    lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryTriggers.length).padStart(2, '0')}`;
    if (lightboxImg.complete) lightboxImg.classList.add('loaded');
}

function openLightbox(index) {
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => lightbox.classList.add('open'));
    lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { lightbox.hidden = true; }, reduceMotion ? 0 : 350);
    if (lastFocused) lastFocused.focus();
}

galleryTriggers.forEach((trigger, i) => trigger.addEventListener('click', () => openLightbox(i)));
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));
lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-figure')) closeLightbox();
});

// Geser kiri/kanan di layar sentuh untuk pindah foto
let touchStartX = null;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) showImage(currentIndex + (dx < 0 ? 1 : -1));
    touchStartX = null;
});

// ====================
// KEYBOARD
// ====================

document.addEventListener('keydown', e => {
    if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        if (e.key === 'Tab') {
            // Fokus tetap di dalam lightbox
            const focusables = Array.from(lightbox.querySelectorAll('button'));
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
        return;
    }

    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
        hamburger.focus();
    }
});
