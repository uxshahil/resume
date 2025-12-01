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
                
                // Progressive Hero Minification
                // Calculate progress (0 to 1) over the first 200px (desktop) or 400px (mobile) of scroll
                // Increasing the range on mobile "slows down" the animation relative to scroll speed
                const isMobile = window.innerWidth <= 768;
                const heroScrollRange = isMobile ? 400 : 200;
                const heroProgress = Math.min(currentScroll / heroScrollRange, 1);
                
                // Set CSS variable for scroll-linked animations
                hero.style.setProperty('--scroll-progress', heroProgress);

                if (currentScroll > 50) { // Lower threshold for class toggle
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

    // PDF Generation Function
    window.generateResumePDF = function(event) {
        // Show loading state
        const btn = event.target.closest('.hero-download-btn, .social-link');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg><span>Generating PDF...</span>';
        btn.style.pointerEvents = 'none';

        // Fetch and convert resume.html to PDF
        fetch('resume.html')
            .then(response => response.text())
            .then(html => {
                // Create a temporary container off-screen
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'fixed';
                tempContainer.style.left = '-9999px';
                tempContainer.style.top = '0';
                tempContainer.style.width = '210mm';
                tempContainer.innerHTML = html;
                document.body.appendChild(tempContainer);

                // Apply print styles directly
                const printStylesEl = document.createElement('style');
                printStylesEl.textContent = `
                    body { padding: 0 !important; gap: 0 !important; background: white !important; }
                    .noise-overlay, .scanline, .accent-corner { display: none !important; }

                    .page-wrapper {
                        transform: none !important;
                        margin-bottom: 0 !important;
                        gap: 0 !important;
                    }

                    .a4-page {
                        page-break-after: always;
                        box-shadow: none !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .sidebar {
                        background: #f5f5f5 !important;
                        backdrop-filter: none !important;
                        border-right: 1px solid #ddd !important;
                    }

                    .profile-photo {
                        background-image: url('./profile-pic.jpeg') !important;
                        background-size: cover !important;
                        background-position: center !important;
                    }

                    .section-title {
                        color: #333 !important;
                        border-bottom-color: #333 !important;
                    }

                    .skill-category { color: #555 !important; }
                    .skill-list, .general-text, .qualification-item { color: #333 !important; }
                    .skill-list li::before { color: #555 !important; }
                    .qualification-year { color: #555 !important; }
                    .contact-item { color: #333 !important; }
                    .contact-icon { color: #555 !important; }

                    .tech-tag {
                        background: #f0f0f0 !important;
                        border-color: #999 !important;
                        color: #333 !important;
                    }

                    .glitch { color: #000 !important; }
                    .glitch::before, .glitch::after { display: none !important; }

                    .title-primary { color: #333 !important; }
                    .title-secondary { color: #555 !important; }

                    .career-header {
                        color: #000 !important;
                        border-bottom-color: #333 !important;
                    }

                    .career-entry {
                        background: #fafafa !important;
                        border: 1px solid #ddd !important;
                        border-left: 2px solid #333 !important;
                        backdrop-filter: none !important;
                    }

                    .company-name { color: #000 !important; }
                    .meta-label { color: #666 !important; }
                    .meta-value { color: #000 !important; }
                    .meta-value.role { color: #333 !important; }
                    .career-description { color: #333 !important; }
                    .career-description strong, .role-title-inline { color: #000 !important; }
                    .tech-list { color: #555 !important; }
                    .page-number { color: #666 !important; }

                    .closing-tagline { color: #000 !important; }
                    .closing-divider { color: #333 !important; }
                    .closing-year { color: #333 !important; }
                    .closing-line { background: #333 !important; }
                `;
                tempContainer.appendChild(printStylesEl);

                // Wait for images to load
                setTimeout(() => {
                    // Configure PDF options
                    const opt = {
                        margin: 0,
                        filename: 'Shahil_Sukuram_Resume.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: {
                            scale: 3,
                            useCORS: true,
                            letterRendering: true,
                            allowTaint: false,
                            backgroundColor: '#ffffff',
                            logging: false
                        },
                        jsPDF: {
                            unit: 'mm',
                            format: 'a4',
                            orientation: 'portrait'
                        },
                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                    };

                    // Generate and save PDF
                    html2pdf().set(opt).from(tempContainer).save('Shahil_Sukuram_Resume.pdf').then(() => {
                        // Cleanup
                        document.body.removeChild(tempContainer);
                        btn.innerHTML = originalHTML;
                        btn.style.pointerEvents = 'auto';
                    }).catch(error => {
                        console.error('PDF generation error:', error);
                        document.body.removeChild(tempContainer);
                        btn.innerHTML = originalHTML;
                        btn.style.pointerEvents = 'auto';
                        alert('Failed to generate PDF. Please try again.');
                    });
                }, 1500);

            })
            .catch(error => {
                console.error('Fetch error:', error);
                btn.innerHTML = originalHTML;
                btn.style.pointerEvents = 'auto';
                alert('Failed to load resume. Please try again.');
            });
    };
});
