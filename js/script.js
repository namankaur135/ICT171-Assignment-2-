document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const bookingForm = document.getElementById('booking-form');
    const eventSelect = document.getElementById('event-select');
    const formMessage = document.getElementById('form-message');
    const eventCards = document.querySelectorAll('.event-card');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const navItems = document.querySelectorAll('.nav-links a');
 
    // Smooth scroll for nav links and close mobile menu
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                // e.preventDefault(); // Prevent default only if it's an internal link
                const hash = this.hash;
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    // For smooth scroll, CSS `html { scroll-behavior: smooth; }` is used.
                    // Or you could implement JS smooth scroll here.
                    // window.scrollTo({ top: targetElement.offsetTop - 60, behavior: 'smooth' });
 
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            } else if (this.getAttribute('href') === 'index.html') {
                 // For home button, just go to top if already on index.html
                // or let it navigate if it's linking to a different page structure.
            }
        });
    });
 
    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }
 
    // Populate event select dropdown
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
 
    // Handle "Book Now" button clicks on event cards
    bookNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            window.location.href = 'book-events.html';
            // const card = e.target.closest('.event-card');
            // const eventName = card.dataset.eventName;
            // if (eventSelect && eventName) {
            //     eventSelect.value = eventName;
            // }
            // // Scroll to booking form
            // const bookingSection = document.getElementById('book-tickets');
            // if (bookingSection) {
            //     // Adjust offset for fixed navbar height (approx 60px)
            //     const navbarHeight = document.querySelector('.navbar').offsetHeight || 60;
            //     const elementPosition = bookingSection.getBoundingClientRect().top + window.pageYOffset;
            //     const offsetPosition = elementPosition - navbarHeight;
 
            //     window.scrollTo({
            //         top: offsetPosition,
            //         behavior: 'smooth'
            //     });
            // }
        });
    });
 
    // Booking form validation and submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual submission for this demo
            clearErrors();
            formMessage.textContent = '';
            formMessage.className = 'form-status-message'; // Reset class
 
            let isValid = true;
 
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const eventSelected = document.getElementById('event-select');
            const ticketsInput = document.getElementById('tickets');
 
            // Name validation
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required.');
                isValid = false;
            }
 
            // Email validation
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }
 
            // Event selection validation
            if (eventSelected.value === '') {
                showError(eventSelected, 'Please select an event.');
                isValid = false;
            }
 
            // Tickets validation
            if (ticketsInput.value === '' || parseInt(ticketsInput.value) < 1) {
                showError(ticketsInput, 'Please enter a valid number of tickets (at least 1).');
                isValid = false;
            }
 
            if (isValid) {
                // Simulate successful booking
                formMessage.textContent = `Booking successful for ${ticketsInput.value} ticket(s) to "${eventSelected.value}" for ${nameInput.value}! We've sent a confirmation to ${emailInput.value}. (This is a demo - no email sent).`;
                formMessage.classList.add('success');
                bookingForm.reset(); // Clear the form
                // Optionally, clear event select placeholder
                if(eventSelect.options.length > 0 && eventSelect.options[0].value === "") {
                    eventSelect.value = ""; // Reset to placeholder
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
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
 
    // Active nav link highlighting on scroll (optional, can be complex)
    // This is a simplified version. For robust active link highlighting, 
    // you might need a library or more complex intersection observer logic.
    const sections = document.querySelectorAll('main section[id]');
    window.addEventListener('scroll', navHighlighter);
 
    function navHighlighter() {
        let scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar').offsetHeight || 60;
 
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 50; // Adjusted offset
            let sectionId = current.getAttribute('id');
            let correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (correspondingLink) {
                 if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                } else {
                    // correspondingLink.classList.remove('active'); // This can cause flicker
                }
            }
        });
        // If at the very top, or hero is mostly visible, highlight "Home"
        const heroSection = document.getElementById('home');
        if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight - navbarHeight - 50;
            if (scrollY < heroBottom * 0.7) { // If more than 30% of hero is visible from top
                 document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                 const homeLink = document.querySelector('.nav-links a[href="#home"]');
                 if(homeLink) homeLink.classList.add('active');
            }
        }
    }
    // Initial call to set active link on page load
    navHighlighter();
 
 
});