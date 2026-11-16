/**
 * FARMVEST — FARMER PRODUCER COMPANY
 * Premium Modern Agricultural Platform Core JavaScript
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 01. THEME SWITCHER (Bright Mode & Dark Mode with LocalStorage)
  // --------------------------------------------------------------------------
  const THEME_KEY = 'farmvest_theme_pref';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }

  // Initialize theme immediately
  initTheme();

  // --------------------------------------------------------------------------
  // 01B. RTL (RIGHT-TO-LEFT) CONTROLLER with LocalStorage
  // --------------------------------------------------------------------------
  const DIRECTION_KEY = 'farmvest_direction_pref';

  function initDirection() {
    const savedDir = localStorage.getItem(DIRECTION_KEY) || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateRTLButtons(savedDir);
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem(DIRECTION_KEY, newDir);
    updateRTLButtons(newDir);
    window.dispatchEvent(new Event('directionchange'));
  }

  function updateRTLButtons(dir) {
    document.querySelectorAll('.js-rtl-toggle').forEach(btn => {
      btn.setAttribute('aria-pressed', dir === 'rtl' ? 'true' : 'false');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      const badge = btn.querySelector('.rtl-text-indicator');
      if (badge) {
        badge.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  // Initialize direction immediately
  initDirection();

  // --------------------------------------------------------------------------
  // 02. DOM READY INITIALIZATION
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle buttons (both desktop header and mobile drawer)
    const themeToggles = document.querySelectorAll('.js-theme-toggle');
    themeToggles.forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // RTL toggle buttons (both desktop header and mobile drawer)
    const rtlToggles = document.querySelectorAll('.js-rtl-toggle');
    rtlToggles.forEach(btn => {
      btn.addEventListener('click', toggleDirection);
    });
    updateRTLButtons(document.documentElement.getAttribute('dir') || 'ltr');

    // ------------------------------------------------------------------------
    // 03. STICKY NAVBAR SCROLL BEHAVIOR
    // ------------------------------------------------------------------------
    const header = document.querySelector('.header');
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (header) {
        if (scrollPos > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      if (backToTopBtn) {
        if (scrollPos > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ------------------------------------------------------------------------
    // 04. MOBILE DRAWER NAVIGATION
    // ------------------------------------------------------------------------
    const hamburgerBtn = document.querySelector('.js-hamburger-btn');
    const drawerCloseBtn = document.querySelector('.js-drawer-close');
    const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
    const mobileDrawer = document.querySelector('.mobile-drawer');

    function openDrawer() {
      if (mobileDrawer && drawerOverlay) {
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeDrawer() {
      if (mobileDrawer && drawerOverlay) {
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when clicking mobile links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // ------------------------------------------------------------------------
    // 05. MODALS SYSTEM (Bulk Enquiry, Membership, Service, Details)
    // ------------------------------------------------------------------------
    window.openModal = function (modalId, options = {}) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // Handle product prefill if provided
      if (options.product && modal.querySelector('[name="product"]')) {
        const prodInput = modal.querySelector('[name="product"]');
        prodInput.value = options.product;
      }

      // Reset any previous success states
      const form = modal.querySelector('form');
      const successState = modal.querySelector('.modal-success-state');
      if (form) form.style.display = 'block';
      if (successState) successState.style.display = 'none';

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    window.closeModal = function (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    // Close modal triggers
    document.querySelectorAll('.js-modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on clicking backdrop
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
        closeDrawer();
      }
    });

    // Trigger buttons via attributes
    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
        const modalId = trigger.getAttribute('data-open-modal');
        const product = trigger.getAttribute('data-product');
        window.openModal(modalId, { product });
      });
    });

    // ------------------------------------------------------------------------
    // 06. FORM VALIDATION & FRONTEND SUBMISSION
    // ------------------------------------------------------------------------
    const forms = document.querySelectorAll('.js-validated-form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Simple required fields check
        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#D32F2F';
          } else {
            input.style.borderColor = '';
          }
        });

        if (!isValid) return;

        // Show success state
        const submitBtn = form.querySelector('button[type="submit"]');
        const origBtnText = submitBtn ? submitBtn.innerText : 'Submit';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Processing...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = origBtnText;
          }

          const modal = form.closest('.modal-dialog');
          if (modal) {
            const successState = modal.querySelector('.modal-success-state');
            if (successState) {
              form.style.display = 'none';
              successState.style.display = 'block';
              form.reset();
            }
          } else {
            // Standalone form (e.g. on contact.html)
            const successMsg = form.querySelector('.form-inline-success');
            if (successMsg) {
              successMsg.style.display = 'block';
              form.reset();
              setTimeout(() => {
                successMsg.style.display = 'none';
              }, 6000);
            }
          }
        }, 600);
      });
    });

    // ------------------------------------------------------------------------
    // 07. PRODUCT CATEGORY FILTER (Products Page)
    // ------------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.js-filter-btn');
    const productCards = document.querySelectorAll('.js-product-card');

    if (filterBtns.length > 0 && productCards.length > 0) {
      // Check URL query parameters e.g. products.html?category=vegetables
      const urlParams = new URLSearchParams(window.location.search);
      const urlCategory = urlParams.get('category');

      function applyFilter(category) {
        filterBtns.forEach(b => {
          if (b.getAttribute('data-filter') === category) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        productCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.getAttribute('data-filter');
          applyFilter(cat);
        });
      });

      if (urlCategory) {
        applyFilter(urlCategory);
      }
    }

    // ------------------------------------------------------------------------
    // 08. INTERACTIVE NETWORK FLOW (Home 2)
    // ------------------------------------------------------------------------
    const networkNodes = document.querySelectorAll('.js-network-node');
    const networkDetailImg = document.getElementById('networkDetailImg');
    const networkDetailTitle = document.getElementById('networkDetailTitle');
    const networkDetailDesc = document.getElementById('networkDetailDesc');
    const networkDetailPoints = document.getElementById('networkDetailPoints');

    if (networkNodes.length > 0 && networkDetailTitle) {
      const nodeData = {
        'farmers': {
          title: '01. Smallholder Farmer Collectives',
          desc: 'Over 12,000 member farmers organized into village-level Farmer Interest Groups (FIGs) adopting sustainable practices, pooled resource management, and direct market participation.',
          points: ['Decentralized village clusters', 'Zero-middleman aggregation', 'Transparent price realization'],
          image: 'images/image-53.png'
        },
        'collection': {
          title: '02. Farm-Gate Produce Collection',
          desc: 'Primary procurement points located within 5km of farming clusters equipped with digital weighing balances, moisture meters, and direct digital receipt generation.',
          points: ['Fair digital weighment', 'Immediate procurement documentation', 'Village cluster collection points'],
          image: 'images/image-72.png'
        },
        'sorting': {
          title: '03. Scientific Sorting & Optical Grading',
          desc: 'Centralized packing hubs where produce undergoes rigorous quality screening, automated roller sizing, defect sorting, and standard food-safe packing.',
          points: ['Automated roller sorting', 'Export-grade packaging', 'Residue & moisture verification'],
          image: 'images/image-60.png'
        },
        'coordination': {
          title: '04. Cold Chain & Warehousing Coordination',
          desc: 'State-of-the-art temperature-controlled pre-cooling rooms, cold storage chambers, and palletized dry warehousing to maximize post-harvest shelf life.',
          points: ['Pre-cooling & temperature control', 'Hydraulic pallet warehousing', 'Traceable batch coding'],
          image: 'images/image-25.png'
        },
        'buyers': {
          title: '05. Wholesale Buyer & Institutional Linkage',
          desc: 'Supplying bulk agricultural produce directly to food processing enterprises, modern retail chains, exporters, and wholesale mandi distributors on transparent terms.',
          points: ['B2B bulk supply contracts', 'Consistent volume fulfillment', 'End-to-end supply documentation'],
          image: 'images/image-74.png'
        }
      };

      networkNodes.forEach(node => {
        node.addEventListener('click', () => {
          networkNodes.forEach(n => n.classList.remove('active'));
          node.classList.add('active');

          const key = node.getAttribute('data-node');
          const data = nodeData[key];
          if (data) {
            networkDetailTitle.textContent = data.title;
            networkDetailDesc.textContent = data.desc;
            if (networkDetailImg) networkDetailImg.src = data.image;

            if (networkDetailPoints) {
              networkDetailPoints.innerHTML = data.points
                .map(pt => `<li class="service-feature-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ${pt}</li>`)
                .join('');
            }
          }
        });
      });
    }

    // ------------------------------------------------------------------------
    // 09. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // ------------------------------------------------------------------------
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

      document.querySelectorAll('.reveal-item').forEach(el => {
        observer.observe(el);
      });
    } else {
      document.querySelectorAll('.reveal-item').forEach(el => {
        el.classList.add('revealed');
      });
    }

    // ------------------------------------------------------------------------
    // 10. PRODUCT DETAIL MODAL VIEWER
    // ------------------------------------------------------------------------
    document.querySelectorAll('.js-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = btn.getAttribute('data-name');
        const category = btn.getAttribute('data-category-name');
        const image = btn.getAttribute('data-image');
        const desc = btn.getAttribute('data-desc');
        const packaging = btn.getAttribute('data-packaging');
        const minOrder = btn.getAttribute('data-moq');

        const modal = document.getElementById('productDetailModal');
        if (!modal) return;

        const imgEl = modal.querySelector('.js-modal-prod-img');
        const titleEl = modal.querySelector('.js-modal-prod-title');
        const catEl = modal.querySelector('.js-modal-prod-category');
        const descEl = modal.querySelector('.js-modal-prod-desc');
        const pkgEl = modal.querySelector('.js-modal-prod-packaging');
        const moqEl = modal.querySelector('.js-modal-prod-moq');
        const enquireBtn = modal.querySelector('.js-modal-prod-enquire-btn');

        if (imgEl) imgEl.src = image;
        if (titleEl) titleEl.textContent = name;
        if (catEl) catEl.textContent = category;
        if (descEl) descEl.textContent = desc;
        if (pkgEl) pkgEl.textContent = packaging || 'Standard wholesale crates / 25kg bags';
        if (moqEl) moqEl.textContent = minOrder || '500 kg / 1 Metric Ton';

        if (enquireBtn) {
          enquireBtn.setAttribute('data-product', name);
          enquireBtn.onclick = () => {
            window.closeModal('productDetailModal');
            window.openModal('bulkEnquiryModal', { product: name });
          };
        }

        window.openModal('productDetailModal');
      });
    });

    // ------------------------------------------------------------------------
    // 11. HOME 1: 3D HERO CARD STACK CAROUSEL INTERACTION
    // ------------------------------------------------------------------------
    const heroStackWrapper = document.getElementById('heroStackWrapper');
    const heroStackDots = document.getElementById('heroStackDots');

    if (heroStackWrapper && heroStackDots) {
      const cards = Array.from(heroStackWrapper.querySelectorAll('.hero-stack-card'));
      const dots = Array.from(heroStackDots.querySelectorAll('.hero-indicator-dot'));
      let activeIndex = 0;
      let autoTimer = null;

      function updateCardStack(newIndex) {
        activeIndex = (newIndex + cards.length) % cards.length;

        cards.forEach((card, idx) => {
          // Calculate relative slot offset (0 = front, 1 = middle, 2 = rear)
          const slot = (idx - activeIndex + cards.length) % cards.length;
          
          card.classList.remove('card-slot-1', 'card-slot-2', 'card-slot-3', 'active');
          if (slot === 0) {
            card.classList.add('card-slot-1', 'active');
          } else if (slot === 1) {
            card.classList.add('card-slot-2');
          } else {
            card.classList.add('card-slot-3');
          }
        });

        dots.forEach((dot, idx) => {
          if (idx === activeIndex) {
            dot.classList.add('active');
            dot.setAttribute('aria-selected', 'true');
          } else {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
          }
        });
      }

      // Click card to bring to front
      cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
          updateCardStack(idx);
          resetAutoTimer();
        });
      });

      // Click indicator dot to switch
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          updateCardStack(idx);
          resetAutoTimer();
        });
      });

      function startAutoTimer() {
        if (!autoTimer) {
          autoTimer = setInterval(() => {
            updateCardStack(activeIndex + 1);
          }, 4500);
        }
      }

      function stopAutoTimer() {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      }

      function resetAutoTimer() {
        stopAutoTimer();
        startAutoTimer();
      }

      heroStackWrapper.addEventListener('mouseenter', stopAutoTimer);
      heroStackWrapper.addEventListener('mouseleave', startAutoTimer);
      heroStackWrapper.addEventListener('touchstart', stopAutoTimer, { passive: true });
      heroStackWrapper.addEventListener('touchend', startAutoTimer, { passive: true });

      startAutoTimer();
    }

    // ------------------------------------------------------------------------
    // 12. HERO VIDEO / JOURNEY SCROLL TRIGGER
    // ------------------------------------------------------------------------
    const heroVideoTrigger = document.querySelector('.js-hero-video-trigger');
    if (heroVideoTrigger) {
      heroVideoTrigger.addEventListener('click', (e) => {
        const target = document.getElementById('farm-journey');
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // ------------------------------------------------------------------------
    // 13. HOME 1: STRATEGIC ADVANTAGES CARD SLIDER
    // ------------------------------------------------------------------------
    const advantageTrack = document.getElementById('advantageSliderTrack');
    const advantageDotsContainer = document.getElementById('advantageSliderDots');
    const advantagePrevBtn = document.querySelector('.js-advantage-prev');
    const advantageNextBtn = document.querySelector('.js-advantage-next');

    if (advantageTrack && advantageDotsContainer) {
      const slides = Array.from(advantageTrack.querySelectorAll('.advantage-slide'));
      const dots = Array.from(advantageDotsContainer.querySelectorAll('.slider-dot'));
      let currentIndex = 0;
      const totalSlides = slides.length;

      function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        const offset = isRtl ? currentIndex * 100 : -currentIndex * 100;
        advantageTrack.style.transform = `translateX(${offset}%)`;

        slides.forEach((slide, idx) => {
          slide.classList.toggle('active', idx === currentIndex);
        });

        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
          dot.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
        });
      }

      if (advantagePrevBtn) {
        advantagePrevBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          goToSlide(isRtl ? currentIndex + 1 : currentIndex - 1);
        });
      }

      if (advantageNextBtn) {
        advantageNextBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          goToSlide(isRtl ? currentIndex - 1 : currentIndex + 1);
        });
      }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          goToSlide(idx);
        });
      });

      window.addEventListener('directionchange', () => {
        goToSlide(currentIndex);
      });

      // Swipe / touch navigation
      let touchStartX = 0;
      let touchEndX = 0;

      advantageTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      advantageTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          if (diff < 0) {
            goToSlide(isRtl ? currentIndex - 1 : currentIndex + 1);
          } else {
            goToSlide(isRtl ? currentIndex + 1 : currentIndex - 1);
          }
        }
      }, { passive: true });
    }

    // ------------------------------------------------------------------------
    // 14. HOME 2: STANDARDIZED OPERATIONS BRUSH-STROKE SLIDER
    // ------------------------------------------------------------------------
    const opsTrack = document.getElementById('opsSliderTrack');
    const opsDotsContainer = document.getElementById('opsSliderDots');
    const opsPrevBtn = document.querySelector('.js-ops-prev');
    const opsNextBtn = document.querySelector('.js-ops-next');
    const opsSlider = document.getElementById('operationsSlider');

    if (opsTrack && opsDotsContainer) {
      const slides = Array.from(opsTrack.querySelectorAll('.ops-slide'));
      const dots = Array.from(opsDotsContainer.querySelectorAll('.js-ops-dot'));
      let currentOpsIndex = 0;
      const totalOpsSlides = slides.length;
      let autoplayTimer = null;

      function goToOpsSlide(index) {
        currentOpsIndex = (index + totalOpsSlides) % totalOpsSlides;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        const offset = isRtl ? currentOpsIndex * 100 : -currentOpsIndex * 100;
        opsTrack.style.transform = `translateX(${offset}%)`;

        slides.forEach((slide, idx) => {
          slide.classList.toggle('active', idx === currentOpsIndex);
        });

        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentOpsIndex);
          dot.setAttribute('aria-selected', idx === currentOpsIndex ? 'true' : 'false');
        });
      }

      if (opsPrevBtn) {
        opsPrevBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          goToOpsSlide(isRtl ? currentOpsIndex + 1 : currentOpsIndex - 1);
          resetAutoplay();
        });
      }

      if (opsNextBtn) {
        opsNextBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          goToOpsSlide(isRtl ? currentOpsIndex - 1 : currentOpsIndex + 1);
          resetAutoplay();
        });
      }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          goToOpsSlide(idx);
          resetAutoplay();
        });
      });

      window.addEventListener('directionchange', () => {
        goToOpsSlide(currentOpsIndex);
      });

      // Swipe / touch navigation
      let touchStartX = 0;
      let touchEndX = 0;

      opsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      opsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          if (diff < 0) {
            goToOpsSlide(isRtl ? currentOpsIndex - 1 : currentOpsIndex + 1);
          } else {
            goToOpsSlide(isRtl ? currentOpsIndex + 1 : currentOpsIndex - 1);
          }
          resetAutoplay();
        }
      }, { passive: true });

      // Keyboard navigation when slider area is focused
      if (opsSlider) {
        opsSlider.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            goToOpsSlide(isRtl ? currentOpsIndex + 1 : currentOpsIndex - 1);
            resetAutoplay();
          } else if (e.key === 'ArrowRight') {
            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            goToOpsSlide(isRtl ? currentOpsIndex - 1 : currentOpsIndex + 1);
            resetAutoplay();
          }
        });

        function startAutoplay() {
          stopAutoplay();
          autoplayTimer = setInterval(() => {
            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            goToOpsSlide(isRtl ? currentOpsIndex - 1 : currentOpsIndex + 1);
          }, 6000);
        }

        function stopAutoplay() {
          if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
        }

        function resetAutoplay() {
          stopAutoplay();
          startAutoplay();
        }

        opsSlider.addEventListener('mouseenter', stopAutoplay);
        opsSlider.addEventListener('mouseleave', startAutoplay);
        startAutoplay();
      }
    }

    // ------------------------------------------------------------------------
    // 15. PRODUCTS PAGE: ORDER WORKFLOW 3D COVERFLOW CAROUSEL
    // ------------------------------------------------------------------------
    const workflowWrapper = document.getElementById('orderWorkflowCoverflow');
    const workflowStage = document.getElementById('workflowStage');
    const workflowDotsContainer = document.getElementById('workflowDots');
    const workflowPrevBtn = document.querySelector('.js-workflow-prev');
    const workflowNextBtn = document.querySelector('.js-workflow-next');

    if (workflowStage && workflowWrapper) {
      const cards = Array.from(workflowStage.querySelectorAll('.workflow-card'));
      const dots = workflowDotsContainer ? Array.from(workflowDotsContainer.querySelectorAll('.js-workflow-dot')) : [];
      let activeWorkflowIndex = 0;
      const totalCards = cards.length;
      let autoplayTimer = null;

      function updateWorkflowCoverflow(index) {
        activeWorkflowIndex = (index + totalCards) % totalCards;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

        cards.forEach((card, i) => {
          let diff = i - activeWorkflowIndex;
          if (diff > totalCards / 2) diff -= totalCards;
          if (diff < -totalCards / 2) diff += totalCards;

          const visualDiff = isRtl ? -diff : diff;
          card.setAttribute('data-pos', visualDiff);
          card.classList.toggle('active', diff === 0);
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeWorkflowIndex);
          dot.setAttribute('aria-selected', i === activeWorkflowIndex ? 'true' : 'false');
        });
      }

      cards.forEach((card, i) => {
        card.addEventListener('click', () => {
          if (i !== activeWorkflowIndex) {
            updateWorkflowCoverflow(i);
            resetAutoplay();
          }
        });
      });

      if (workflowPrevBtn) {
        workflowPrevBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateWorkflowCoverflow(isRtl ? activeWorkflowIndex + 1 : activeWorkflowIndex - 1);
          resetAutoplay();
        });
      }

      if (workflowNextBtn) {
        workflowNextBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateWorkflowCoverflow(isRtl ? activeWorkflowIndex - 1 : activeWorkflowIndex + 1);
          resetAutoplay();
        });
      }

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          updateWorkflowCoverflow(i);
          resetAutoplay();
        });
      });

      window.addEventListener('directionchange', () => {
        updateWorkflowCoverflow(activeWorkflowIndex);
      });

      // Swipe / touch navigation
      let touchStartX = 0;
      let touchEndX = 0;

      workflowStage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      workflowStage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          if (diff < 0) {
            updateWorkflowCoverflow(isRtl ? activeWorkflowIndex - 1 : activeWorkflowIndex + 1);
          } else {
            updateWorkflowCoverflow(isRtl ? activeWorkflowIndex + 1 : activeWorkflowIndex - 1);
          }
          resetAutoplay();
        }
      }, { passive: true });

      // Keyboard arrow navigation
      workflowWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateWorkflowCoverflow(isRtl ? activeWorkflowIndex + 1 : activeWorkflowIndex - 1);
          resetAutoplay();
        } else if (e.key === 'ArrowRight') {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateWorkflowCoverflow(isRtl ? activeWorkflowIndex - 1 : activeWorkflowIndex + 1);
          resetAutoplay();
        }
      });

      // Auto-rotation with pause on hover
      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateWorkflowCoverflow(isRtl ? activeWorkflowIndex - 1 : activeWorkflowIndex + 1);
        }, 5500);
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      workflowWrapper.addEventListener('mouseenter', stopAutoplay);
      workflowWrapper.addEventListener('mouseleave', startAutoplay);

      updateWorkflowCoverflow(0);
      startAutoplay();
    }

    // 16. FARMERS PAGE: LEADERSHIP SPOTLIGHT SHOWCASE STAGE
    // ------------------------------------------------------------------------
    const leaderStageTrack = document.getElementById('leadershipStageTrack');
    const leaderTabsContainer = document.getElementById('leadershipTabsNav');
    const leaderDotsContainer = document.getElementById('leadershipStageDots');
    const leaderPrevBtn = document.querySelector('.js-leader-stage-prev');
    const leaderNextBtn = document.querySelector('.js-leader-stage-next');
    const leaderStageViewport = document.querySelector('.leadership-stage-viewport');

    if (leaderStageTrack && leaderTabsContainer) {
      const slides = Array.from(leaderStageTrack.querySelectorAll('.leadership-slide'));
      const tabs = Array.from(leaderTabsContainer.querySelectorAll('.leader-tab-btn'));
      const dots = leaderDotsContainer ? Array.from(leaderDotsContainer.querySelectorAll('.stage-dot')) : [];
      let currentLeaderIndex = 0;
      const totalSlides = slides.length;
      let autoplayTimer = null;

      function goToLeaderSlide(index) {
        currentLeaderIndex = (index + totalSlides) % totalSlides;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        const offset = isRtl ? currentLeaderIndex * 100 : -currentLeaderIndex * 100;
        leaderStageTrack.style.transform = `translateX(${offset}%)`;

        tabs.forEach((tab, idx) => {
          tab.classList.toggle('active', idx === currentLeaderIndex);
          tab.setAttribute('aria-selected', idx === currentLeaderIndex ? 'true' : 'false');
        });

        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentLeaderIndex);
          dot.setAttribute('aria-selected', idx === currentLeaderIndex ? 'true' : 'false');
        });
      }

      if (leaderPrevBtn) {
        leaderPrevBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          goToLeaderSlide(isRtl ? currentLeaderIndex + 1 : currentLeaderIndex - 1);
          resetLeaderAutoplay();
        });
      }

      if (leaderNextBtn) {
        leaderNextBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          goToLeaderSlide(isRtl ? currentLeaderIndex - 1 : currentLeaderIndex + 1);
          resetLeaderAutoplay();
        });
      }

      tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => {
          goToLeaderSlide(idx);
          resetLeaderAutoplay();
        });
      });

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          goToLeaderSlide(idx);
          resetLeaderAutoplay();
        });
      });

      window.addEventListener('directionchange', () => {
        goToLeaderSlide(currentLeaderIndex);
      });

      // Swipe / touch navigation
      let touchStartX = 0;
      let touchEndX = 0;

      leaderStageTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      leaderStageTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          if (diff > 0) {
            goToLeaderSlide(isRtl ? currentLeaderIndex - 1 : currentLeaderIndex + 1);
          } else {
            goToLeaderSlide(isRtl ? currentLeaderIndex + 1 : currentLeaderIndex - 1);
          }
          resetLeaderAutoplay();
        }
      }, { passive: true });

      // Autoplay with pause on hover
      function startLeaderAutoplay() {
        stopLeaderAutoplay();
        autoplayTimer = setInterval(() => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          goToLeaderSlide(isRtl ? currentLeaderIndex - 1 : currentLeaderIndex + 1);
        }, 6000);
      }

      function stopLeaderAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function resetLeaderAutoplay() {
        stopLeaderAutoplay();
        startLeaderAutoplay();
      }

      if (leaderStageViewport) {
        leaderStageViewport.addEventListener('mouseenter', stopLeaderAutoplay);
        leaderStageViewport.addEventListener('mouseleave', startLeaderAutoplay);
      }

      goToLeaderSlide(0);
      startLeaderAutoplay();
    }



    // ------------------------------------------------------------------------
    // 19. MEMBERSHIP PAGE: COMMUNITY STORIES 3D STACKED DECK CAROUSEL
    // ------------------------------------------------------------------------
    const storiesStackViewport = document.getElementById('memberStoriesStack');
    const storiesStackStage = document.getElementById('storiesStackStage');
    const storiesStackDots = document.getElementById('storiesStackDots');
    const storiesPrevBtn = document.querySelector('.js-stories-prev');
    const storiesNextBtn = document.querySelector('.js-stories-next');

    if (storiesStackStage && storiesStackViewport) {
      const cards = Array.from(storiesStackStage.querySelectorAll('.stories-stack-card'));
      const dots = storiesStackDots ? Array.from(storiesStackDots.querySelectorAll('.stories-indicator-dot')) : [];
      let activeStoriesIndex = 0;
      const totalStories = cards.length;
      let storiesAutoTimer = null;

      function updateStoriesStack(newIndex) {
        activeStoriesIndex = (newIndex + totalStories) % totalStories;

        cards.forEach((card, idx) => {
          // relative slot: 0 = front (active), 1 = 1st behind, 2 = 2nd behind, 3 = 3rd behind
          const slot = (idx - activeStoriesIndex + totalStories) % totalStories;
          
          card.classList.remove('card-slot-0', 'card-slot-1', 'card-slot-2', 'card-slot-3', 'active');
          card.classList.add('card-slot-' + slot);
          if (slot === 0) {
            card.classList.add('active');
            card.setAttribute('aria-hidden', 'false');
          } else {
            card.setAttribute('aria-hidden', 'true');
          }
        });

        dots.forEach((dot, idx) => {
          const isActive = idx === activeStoriesIndex;
          dot.classList.toggle('active', isActive);
          dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }

      // Click card to bring to front
      cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
          if (idx !== activeStoriesIndex) {
            updateStoriesStack(idx);
            resetStoriesAutoTimer();
          }
        });
      });

      // Circular navigation buttons
      if (storiesPrevBtn) {
        storiesPrevBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateStoriesStack(isRtl ? activeStoriesIndex + 1 : activeStoriesIndex - 1);
          resetStoriesAutoTimer();
        });
      }

      if (storiesNextBtn) {
        storiesNextBtn.addEventListener('click', () => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateStoriesStack(isRtl ? activeStoriesIndex - 1 : activeStoriesIndex + 1);
          resetStoriesAutoTimer();
        });
      }

      // Indicator dots navigation
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          updateStoriesStack(idx);
          resetStoriesAutoTimer();
        });
      });

      // Touch / swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      storiesStackStage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      storiesStackStage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          if (diff > 0) {
            updateStoriesStack(isRtl ? activeStoriesIndex - 1 : activeStoriesIndex + 1);
          } else {
            updateStoriesStack(isRtl ? activeStoriesIndex + 1 : activeStoriesIndex - 1);
          }
          resetStoriesAutoTimer();
        }
      }, { passive: true });

      // Autoplay with hover pause
      function startStoriesAutoTimer() {
        stopStoriesAutoTimer();
        storiesAutoTimer = setInterval(() => {
          const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
          updateStoriesStack(isRtl ? activeStoriesIndex - 1 : activeStoriesIndex + 1);
        }, 5500);
      }

      function stopStoriesAutoTimer() {
        if (storiesAutoTimer) {
          clearInterval(storiesAutoTimer);
          storiesAutoTimer = null;
        }
      }

      function resetStoriesAutoTimer() {
        stopStoriesAutoTimer();
        startStoriesAutoTimer();
      }

      storiesStackViewport.addEventListener('mouseenter', stopStoriesAutoTimer);
      storiesStackViewport.addEventListener('mouseleave', startStoriesAutoTimer);

      window.addEventListener('directionchange', () => {
        updateStoriesStack(activeStoriesIndex);
      });

      // Initial state
      updateStoriesStack(0);
      startStoriesAutoTimer();
    }


    // ------------------------------------------------------------------------
    // 20. CONTACT PAGE: BRIGHT MAP HUB SWITCHER & FAQ ACCORDION
    // ------------------------------------------------------------------------
    
    // 20A. Bright Map Regional Hub Switcher
    const hubTabs = document.querySelectorAll('.bright-hub-tab');
    const hubTagBadge = document.getElementById('hubTagBadge');
    const hubName = document.getElementById('hubName');
    const hubAddress = document.getElementById('hubAddress');
    const hubCapacity = document.getElementById('hubCapacity');
    const hubPhone = document.getElementById('hubPhone');
    const hubHours = document.getElementById('hubHours');
    const hubMapBtn = document.getElementById('hubMapBtn');
    const brightMapIframe = document.getElementById('brightMapIframe');

    const hubData = {
      pune: {
        tag: 'CENTRAL HEADQUARTERS',
        name: 'APMC Central Agricultural Yard',
        address: 'Plot 42-48, Agro-Industrial Logistics Sector, Pune - Bangalore National Highway (NH-48), Maharashtra 411037, India',
        capacity: '50+ MT Daily Grading • 6 Refr. Docks',
        phone: '+91 (0) 80 2345 6789',
        hours: 'Mon – Sat: 05:30 AM – 06:00 PM',
        mapUrl: 'https://maps.google.com/?q=APMC+Market+Yard+Pune+Maharashtra+India',
        iframeSrc: 'https://maps.google.com/maps?q=APMC+Market+Yard+Pune+Maharashtra+India&t=&z=13&ie=UTF8&iwloc=&output=embed'
      },
      nashik: {
        tag: 'WESTERN MAHARASHTRA HUB',
        name: 'Nashik & Solapur Aggregation Depot',
        address: 'Pimpalgaon APMC Complex, Mumbai-Agra Highway, Nashik & Solapur Belts, Maharashtra 422209, India',
        capacity: '40+ MT Onion & Pomegranate Grading • Pre-Cooling Unit',
        phone: '+91 (0) 80 2345 6790',
        hours: 'Mon – Sat: 05:00 AM – 06:30 PM',
        mapUrl: 'https://maps.google.com/?q=APMC+Market+Nashik+Maharashtra+India',
        iframeSrc: 'https://maps.google.com/maps?q=APMC+Market+Nashik+Maharashtra+India&t=&z=13&ie=UTF8&iwloc=&output=embed'
      },
      belagavi: {
        tag: 'KARNATAKA HORTICULTURE HUB',
        name: 'Belagavi & Kolar Field Terminal',
        address: 'Agri Export Facilitation Zone, Auto Nagar, Belagavi, Karnataka 590016, India',
        capacity: '35+ MT Daily Vegetables, Mango & Ragi Dispatch',
        phone: '+91 (0) 80 2345 9876',
        hours: 'Mon – Sat: 05:30 AM – 06:00 PM',
        mapUrl: 'https://maps.google.com/?q=APMC+Market+Belagavi+Karnataka+India',
        iframeSrc: 'https://maps.google.com/maps?q=APMC+Market+Belagavi+Karnataka+India&t=&z=13&ie=UTF8&iwloc=&output=embed'
      },
      chittoor: {
        tag: 'ANDHRA SPICE & ORCHARD HUB',
        name: 'Chittoor & Guntur Procurement Center',
        address: 'Industrial Estate Road, Papaya & Chilli Aggregation Mandi, Guntur, Andhra Pradesh 522004, India',
        capacity: '30+ MT APEDA Export-Compliant Packing & Drying Yard',
        phone: '+91 (0) 80 2345 9878',
        hours: 'Mon – Sat: 06:00 AM – 06:00 PM',
        mapUrl: 'https://maps.google.com/?q=APMC+Market+Guntur+Andhra+Pradesh+India',
        iframeSrc: 'https://maps.google.com/maps?q=APMC+Market+Guntur+Andhra+Pradesh+India&t=&z=13&ie=UTF8&iwloc=&output=embed'
      },
      indore: {
        tag: 'CENTRAL GRAINS & PULSES HUB',
        name: 'Indore & Raipur Milling Corridor',
        address: 'Khadya Mandi Complex, Lasudia Mori, Dewas Naka, Indore, Madhya Pradesh 452010, India',
        capacity: '60+ MT Grain Weighing, Moisture Testing & Bagging',
        phone: '+91 (0) 80 2345 6792',
        hours: 'Mon – Fri: 08:30 AM – 07:00 PM',
        mapUrl: 'https://maps.google.com/?q=Khadya+Mandi+Indore+Madhya+Pradesh+India',
        iframeSrc: 'https://maps.google.com/maps?q=Khadya+Mandi+Indore+Madhya+Pradesh+India&t=&z=13&ie=UTF8&iwloc=&output=embed'
      }
    };

    if (hubTabs.length > 0 && brightMapIframe) {
      hubTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const hubKey = tab.getAttribute('data-hub');
          const data = hubData[hubKey];
          if (!data) return;

          // Update active tab state
          hubTabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          // Update Info Panel
          if (hubTagBadge) hubTagBadge.textContent = data.tag;
          if (hubName) hubName.textContent = data.name;
          if (hubAddress) hubAddress.textContent = data.address;
          if (hubCapacity) hubCapacity.innerHTML = data.capacity;
          if (hubPhone) hubPhone.textContent = data.phone;
          if (hubHours) hubHours.textContent = data.hours;
          if (hubMapBtn) hubMapBtn.setAttribute('href', data.mapUrl);

          // Update Map Iframe smoothly
          brightMapIframe.style.opacity = '0.5';
          setTimeout(() => {
            brightMapIframe.src = data.iframeSrc;
            brightMapIframe.style.opacity = '1';
          }, 180);
        });
      });
    }

    // 20B. Contact Page: FAQ Accordion with Rotating Chevron Dropdowns
    const faqItems = document.querySelectorAll('.faq-accordion-item');

    if (faqItems.length > 0) {
      faqItems.forEach((item) => {
        const btn = item.querySelector('.faq-question-btn');
        const collapse = item.querySelector('.faq-answer-collapse');

        if (btn && collapse) {
          btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Optional accordion: close others
            faqItems.forEach((otherItem) => {
              if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                const otherBtn = otherItem.querySelector('.faq-question-btn');
                const otherCollapse = otherItem.querySelector('.faq-answer-collapse');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                if (otherCollapse) otherCollapse.style.maxHeight = '0px';
              }
            });

            if (isActive) {
              item.classList.remove('active');
              btn.setAttribute('aria-expanded', 'false');
              collapse.style.maxHeight = '0px';
            } else {
              item.classList.add('active');
              btn.setAttribute('aria-expanded', 'true');
              collapse.style.maxHeight = collapse.scrollHeight + 30 + 'px';
            }
          });
        }
      });
    }

  });
})();
