document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const bookingForm = document.getElementById('booking-form');
    const eventSelect = document.getElementById('event-select');
    const formMessage = document.getElementById('form-message');
    const eventCards = document.querySelectorAll('.event-card');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const navItems = document.querySelectorAll('.nav-links a');
 
    
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                
                const hash = this.hash;
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    
 
                    
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            } else if (this.getAttribute('href') === 'index.html') {
                 
            }
        });
    });
 
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }
 
    
    const events = [];
    eventCards.forEach(card => {
        const eventName = card.dataset.eventName;
        if (eventName) {
            events.push(eventName);
            const option = document.createElement('option');
            option.value = eventName;
            option.textContent = eventName;
            if (eventSelect) {
                eventSelect.appendChild(option);
            }
        }
    });
 
    
    bookNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            window.location.href = 'book-events.html';
            
        });
    });
 
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            clearErrors();
            formMessage.textContent = '';
            formMessage.className = 'form-status-message'; 
 
            let isValid = true;
 
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const eventSelected = document.getElementById('event-select');
            const ticketsInput = document.getElementById('tickets');
 
  
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required.');
                isValid = false;
            }
 

            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }
 
 
            if (eventSelected.value === '') {
                showError(eventSelected, 'Please select an event.');
                isValid = false;
            }
 
           
            if (ticketsInput.value === '' || parseInt(ticketsInput.value) < 1) {
                showError(ticketsInput, 'Please enter a valid number of tickets (at least 1).');
                isValid = false;
            }
 
            if (isValid) {
                
                formMessage.textContent = `Booking successful for ${ticketsInput.value} ticket(s) to "${eventSelected.value}" for ${nameInput.value}! We've sent a confirmation to ${emailInput.value}. (This is a demo - no email sent).`;
                formMessage.classList.add('success');
                bookingForm.reset(); 
                
                if(eventSelect.options.length > 0 && eventSelect.options[0].value === "") {
                    eventSelect.value = ""; 
                }
            } else {
                formMessage.textContent = 'Please correct the errors above.';
                formMessage.classList.add('error');
            }
        });
    }
 
    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement;
        const errorDisplay = formGroup.querySelector('.error-message');
        if (errorDisplay) {
            errorDisplay.textContent = message;
        }
        inputElement.classList.add('error');
    }
 
    function clearErrors() {
        const errorInputs = bookingForm.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
 
        const errorMessages = bookingForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
    }
 
    function isValidEmail(email) {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
 
    
    const sections = document.querySelectorAll('main section[id]');
    window.addEventListener('scroll', navHighlighter);
 
    function navHighlighter() {
        let scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar').offsetHeight || 60;
 
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 50;
            let sectionId = current.getAttribute('id');
            let correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (correspondingLink) {
                 if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                } else {
                    
                }
            }
        });
        
        const heroSection = document.getElementById('home');
        if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight - navbarHeight - 50;
            if (scrollY < heroBottom * 0.7) { 
                 document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                 const homeLink = document.querySelector('.nav-links a[href="#home"]');
                 if(homeLink) homeLink.classList.add('active');
            }
        }
    }
    
    navHighlighter();
 
 
});