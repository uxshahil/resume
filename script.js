document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header Scroll Logic
    const hero = document.querySelector('.hero');
    const summaryGrid = document.querySelector('.summary-grid');
    const glitchElement = document.querySelector('.glitch');
    let lastScroll = 0;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                
                // Scroll-Triggered Minification
                // Simply toggle the class based on a small threshold
                // This relies on CSS transitions for the smooth animation
                if (currentScroll > 10) {
                    hero.classList.add('scrolled');
                    glitchElement.setAttribute('data-text', 'SS');
                    document.body.classList.add('scrolled');
                    
                    // Start counters after blur transition completes (400ms)
                    setTimeout(() => {
                        startCounterAnimations();
                    }, 400);
                } else {
                    hero.classList.remove('scrolled');
                    glitchElement.setAttribute('data-text', 'SHAHIL SUKURAM');
                    document.body.classList.remove('scrolled');
                }

                // Exponential gap shrink/grow effect
                // Only run on non-mobile devices to save performance
                if (window.innerWidth > 768) {
                    // Gap shrinks as you scroll down, grows as you scroll up
                    const maxScroll = 500; // Max scroll distance for effect
                    const minGap = 0.5; // Minimum gap in rem
                    const maxGap = 1.5; // Maximum gap in rem
                    
                    // Calculate progress (0 to 1) with exponential easing
                    const progress = Math.min(currentScroll / maxScroll, 1);
                    const exponentialProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
                    
                    // Calculate gap (inverted - shrinks as you scroll)
                    const gap = maxGap - (exponentialProgress * (maxGap - minGap));
                    summaryGrid.style.gap = `${gap}rem`;
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });

            ticking = true;
        }
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            const content = document.getElementById(tabId);
            if (content) {
                content.classList.add('active');
                
                // Trigger timeline animation if timeline tab is active
                if (tabId === 'timeline') {
                    const items = content.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        // Reset animation
                        item.classList.remove('animate');
                        void item.offsetWidth; // Trigger reflow
                        
                        // Add delay for stagger effect
                        // Total duration target: 1.36s
                        // Item animation: 0.5s
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 78); 
                    });
                }

                // Scroll to tabs section when clicking a tab
                setTimeout(() => {
                    const tabs = document.querySelector('.tabs');
                    const tabsTop = tabs.getBoundingClientRect().top + window.scrollY;
                    const heroHeight = 80; // Approximate scrolled hero height
                    
                    smoothScrollTo(tabsTop - heroHeight, 639);
                }, 10);
            }
        });
    });

    // Custom Smooth Scroll Function
    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Ease in out cubic
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startY + (distance * ease));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Animated Counters
    const stats = document.querySelectorAll('.stat-number');
    const duration = 2670; // 2.67 seconds
    let countersHaveRun = false;

    function startCounterAnimations() {
        if (countersHaveRun) return; // Only run once
        countersHaveRun = true;

        stats.forEach((stat, index) => {
            const originalText = stat.innerText;
            const isFloat = originalText.includes('.');
            const target = parseFloat(originalText);
            const suffix = originalText.replace(/[0-9.]/g, '');
            
            let startTime = null;
            
            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                
                let currentValue;
                
                if (index === 0) {
                    // Effect 1: Exponential Ease Out (Smooth precision)
                    // Rapidly approaches target then slows down for decimals
                    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    currentValue = target * ease;
                } else if (index === 1) {
                    // Effect 2: Random Noise / Digital Scramble
                    // Value jumps around randomly while generally increasing
                    if (progress === 1) {
                        currentValue = target;
                    } else {
                        // Mix of linear progress and random noise
                        const noise = (Math.random() - 0.5) * 10 * (1 - progress);
                        currentValue = (target * progress) + noise;
                        if (currentValue < 0) currentValue = 0;
                    }
                } else if (index === 2) {
                    // Effect 3: Elastic / Overshoot
                    // Shoots past the target and snaps back
                    const c4 = (2 * Math.PI) / 3;
                    const ease = progress === 0 ? 0 : progress === 1 ? 1 : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
                    // Actually let's use a simpler Back Out for cleaner look on integers
                    // const c1 = 1.70158;
                    // const c3 = c1 + 1;
                    // const easeBack = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
                    currentValue = target * ease;
                } else {
                    // Effect 4: Stepped / Stutter
                    // Updates in discrete steps (like a low framerate or mechanical counter)
                    const steps = 12;
                    const stepProgress = Math.floor(progress * steps) / steps;
                    // Add a slight ease in to the steps
                    const ease = stepProgress * stepProgress; 
                    currentValue = target * stepProgress;
                }
                
                // Format output
                if (isFloat) {
                    stat.textContent = currentValue.toFixed(2) + suffix;
                } else {
                    stat.textContent = Math.floor(currentValue) + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    stat.textContent = originalText;
                }
            }
            
            requestAnimationFrame(animate);
        });

        // Start random glitch effect after animations finish
        setTimeout(() => {
            setInterval(() => {
                const randomStat = stats[Math.floor(Math.random() * stats.length)];
                
                // Brief glitch
                randomStat.style.textShadow = '2px 0 #ff00ff, -2px 0 #00f3ff';
                randomStat.style.transform = 'translate(1px, 1px)';
                
                setTimeout(() => {
                    randomStat.style.textShadow = 'none';
                    randomStat.style.transform = 'none';
                }, 100);
            }, 3000);
        }, duration + 500);
    }

    // Scroll Top Button Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Preloader Logic
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        // Ensure minimum display time of 1s for effect, but wait for load
        setTimeout(() => {
            preloader.classList.add('loaded');
            
            // Remove from DOM after transition
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Trigger initial animations if at top
                if (window.scrollY <= 100) {
                    // Optional: Trigger any entrance animations here
                }
            }, 800); // Match CSS transition duration
        }, 1000); // Minimum 1s loading time
    });
});
