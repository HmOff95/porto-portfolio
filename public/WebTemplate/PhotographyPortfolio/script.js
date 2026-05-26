// ==================== 
// NAVBAR SCROLL EFFECT 
// ==================== 

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// ==================== 
// SMOOTH SCROLL 
// ==================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== 
// CONTACT FORM SUBMIT 
// ==================== 

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const successMessage = document.getElementById('successMessage');
    const form = this;
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Reset form
    form.reset();
    
    // Hide success message after 5 seconds
    setTimeout(function() {
        successMessage.style.display = 'none';
    }, 5000);
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
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
});
