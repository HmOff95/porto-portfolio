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
