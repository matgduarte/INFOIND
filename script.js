// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animation library with optimized settings
    AOS.init({
      duration: 800,
      easing: 'ease',
      once: true, // Only animate elements once for better performance
      offset: 100,
      disable: 'mobile' // Disable on mobile for better performance
    });
    
    // Cache DOM elements for better performance
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const backToTop = document.getElementById('back-to-top');
    
    // Lazy-load components and initialize features when needed
    let countdownInitialized = false;
    let scrollListenerAdded = false;
    
    // ===== STICKY HEADER =====
    function handleScroll() {
      // Use requestAnimationFrame for smoother scrolling experience
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        
        // Update header appearance based on scroll position
        if (scrollPosition > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        // Show/hide back to top button based on scroll position
        if (scrollPosition > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
        
        // Initialize countdown only when the element is in viewport (lazy initialize)
        if (!countdownInitialized && isElementInViewport(document.querySelector('.countdown-container'))) {
          initCountdown();
          countdownInitialized = true;
        }
        
        // Highlight active nav item based on scroll position
        highlightActiveNavItem();
      });
    }
    
    // Add scroll event listener with debounce for performance
    function addScrollListener() {
      if (scrollListenerAdded) return;
      
      window.addEventListener('scroll', debounce(handleScroll, 10));
      scrollListenerAdded = true;
      
      // Call handleScroll initially to set initial states
      handleScroll();
    }
    
    // ===== MOBILE MENU TOGGLE =====
    function initMobileMenu() {
      if (!menuToggle) return;
      
      menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
      
      // Close mobile menu when clicking a link
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          navLinks.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });
    }
    
    // ===== SMOOTH SCROLLING =====
    function initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (!targetElement) return;
          
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        });
      });
    }
    
    // ===== TAB SWITCHING =====
    function initTabs() {
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Get the tab ID from the data-tab attribute
          const tabId = button.getAttribute('data-tab');
          
          // Remove active class from all buttons and panes
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabPanes.forEach(pane => pane.classList.remove('active'));
          
          // Add active class to the clicked button and corresponding pane
          button.classList.add('active');
          document.getElementById(tabId).classList.add('active');
        });
      });
    }
    
    // ===== COUNTDOWN TIMER =====
    function initCountdown() {
      // Event date - May 26, 2025
      const eventDate = new Date('May 03, 2025 08:00:00').getTime();
      
      // Update countdown every second (using more efficient setInterval)
      const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        // If the event date has passed, clear the interval
        if (distance < 0) {
          clearInterval(countdownTimer);
          document.getElementById('days').innerHTML = '00';
          document.getElementById('hours').innerHTML = '00';
          document.getElementById('minutes').innerHTML = '00';
          document.getElementById('seconds').innerHTML = '00';
          return;
        }
        
        // Calculate days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the countdown display
        document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
        document.getElementById('hours').innerHTML = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerHTML = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');
      }, 1000);
    }
    
    // ===== BACK TO TOP BUTTON =====
    function initBackToTop() {
      backToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // ===== HIGHLIGHT ACTIVE NAV ITEM =====
    function highlightActiveNavItem() {
      // Get current scroll position
      const scrollPosition = window.scrollY;
      
      // Get all sections for checking which one is in view
      const sections = document.querySelectorAll('section[id]');
      
      // Loop through each section
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // If the current scroll position is within this section
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          // Remove active class from all nav links
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
          });
          
          // Add active class to the corresponding nav link
          const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }
    
    // ===== HELPER FUNCTIONS =====
    
    // Utility: Check if element is in viewport
    function isElementInViewport(el) {
      if (!el) return false;
      
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
      );
    }
    
    // Utility: Debounce function for performance optimization
    function debounce(func, wait) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    }
    
    // ===== INITIALIZE COMPONENTS =====
    function initComponents() {
      // Initialize all components
      initMobileMenu();
      initTabs();
      initSmoothScroll();
      initBackToTop();
      addScrollListener();
      
      // Initialize countdown only if element exists
      if (document.querySelector('.countdown-container')) {
        // Check if countdown is in viewport, otherwise it will be lazy loaded on scroll
        if (isElementInViewport(document.querySelector('.countdown-container'))) {
          initCountdown();
          countdownInitialized = true;
        }
      }
    }
    
    // Start initialization
    initComponents();
  });
