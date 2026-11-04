document.addEventListener('DOMContentLoaded', () => {
    // 4-step HI Assay sequence configuration
    const steps = [
        {
            src: './images/Step1HI.mp4',
            caption: 'Step 1: Centrifuge the blood sample, then carefully discard the supernatant while retaining the red blood cell (RBC) pellet.'
        },
        {
            src: './images/Step2HI.mp4',
            caption: 'Step 2: Wash the RBC pellet with PBS, then centrifuge to discard the supernatant, repeat this 3 times, and store the pellet in PBS at 4 °C.'
        },
        {
            src: './images/Step3HI.mp4',
            caption: 'Step 3: Add PBS to the wells and the antibody to the first column, and perform two-fold serial dilutions using a multichannel pipette.'
        },
        {
            src: './images/Step4HI.mp4',
            caption: 'Step 4: Add 50 µL of virus to each diluted antibody well and to the virus control well.'
        },
        {
            src: './images/Step5HI.mp4',
            caption: 'Step 5: Add 50 µL of 1% chicken RBCs, incubate for 30–40 minutes, observe agglutination, and record the HI titre.'
        }
    ];

    let currentIndex = 0;

    const sliderVideo = document.getElementById('sliderVideo');
    const slideCaption = document.getElementById('slideCaption');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const stepCounter = document.getElementById('stepCounter');
    const progressBar = document.getElementById('progressBar');
    const indicatorsContainer = document.getElementById('indicators');

    // Initialize dot indicators
    function initIndicators() {
        indicatorsContainer.innerHTML = '';
        steps.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', () => jumpToSlide(index));
            indicatorsContainer.appendChild(dot);
        });
    }

    // Update the layout and slide content
    function updateSlide() {
        const step = steps[currentIndex];

        // Apply fade-out animation to the media element
        sliderVideo.classList.add('fade-out');

        setTimeout(() => {
            // Update source and load video
            sliderVideo.src = step.src;
            sliderVideo.load();

            // Wait for video data to load to prevent visual stutter/grey backgrounds
            sliderVideo.onloadeddata = () => {
                sliderVideo.classList.remove('fade-out');
                // Automatically play the video (with volume muted to prevent browser blocks)
                sliderVideo.play().catch(e => console.log('Playback prevented by browser policies:', e));
            };

            // Update caption content
            slideCaption.style.animation = 'none';
            slideCaption.offsetHeight; // trigger reflow
            slideCaption.style.animation = null;
            slideCaption.textContent = step.caption;

            // Update text counter and progress bar
            stepCounter.textContent = `Step ${currentIndex + 1} of ${steps.length}`;
            const progressPercentage = ((currentIndex + 1) / steps.length) * 100;
            progressBar.style.width = `${progressPercentage}%`;

            // Update dot indicators states
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Enable/disable navigation buttons
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === steps.length - 1;

        }, 250); // Matches the CSS transition duration
    }

    function goToNext() {
        if (currentIndex < steps.length - 1) {
            currentIndex++;
            updateSlide();
        }
    }

    // Handle video end to automatically trigger next step
    sliderVideo.addEventListener('ended', () => {
        if (currentIndex < steps.length - 1) {
            goToNext();
        }
    });

    function goToPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlide();
        }
    }

    function jumpToSlide(index) {
        if (index !== currentIndex && index >= 0 && index < steps.length) {
            currentIndex = index;
            updateSlide();
        }
    }

    // Event Listeners
    nextBtn.addEventListener('click', goToNext);
    prevBtn.addEventListener('click', goToPrev);

    // Initial setup
    initIndicators();
    updateSlide();
});
