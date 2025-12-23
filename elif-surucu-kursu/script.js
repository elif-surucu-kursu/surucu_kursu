/* =====================================================
   ELIF SÜRÜCÜ KURSU - JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // =====================================================
    // DYNAMIC CONTENT LOADING
    // =====================================================
    
    // Helper function to load JSON with LocalStorage fallback
    async function loadJSONWithFallback(path, localStorageKey) {
        // Önce LocalStorage'dan kontrol et (Admin panelden güncellenmiş veriler)
        const savedData = localStorage.getItem(localStorageKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                console.log(`✅ ${localStorageKey} LocalStorage'dan yüklendi`);
                return data;
            } catch (e) {
                console.warn(`${localStorageKey} LocalStorage verisi geçersiz, dosyadan yükleniyor...`);
            }
        }
        
        // LocalStorage'da yoksa dosyadan yükle
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            // LocalStorage'a kaydet (cache için)
            localStorage.setItem(localStorageKey, JSON.stringify(data));
            console.log(`✅ ${localStorageKey} dosyadan yüklendi`);
            return data;
        } catch (error) {
            console.error(`${path} yüklenirken hata:`, error);
            // Hata durumunda LocalStorage'dan eski veriyi dene
            if (savedData) {
                try {
                    return JSON.parse(savedData);
                } catch (e) {
                    return null;
                }
            }
            return null;
        }
    }
    
    async function loadSiteData() {
        try {
            // 1. Load Courses
            const courseData = await loadJSONWithFallback('data/courses.json', 'courses_data');
            if (courseData && courseData.courses) {
                const cards = document.querySelectorAll('.course-card');
                courseData.courses.forEach(course => {
                    cards.forEach(card => {
                        const titleEl = card.querySelector('.course-title');
                        if (titleEl && titleEl.textContent.trim().includes(course.title)) {
                            const priceEl = card.querySelector('.price-value');
                            if (priceEl) priceEl.textContent = course.price;
                        }
                    });
                });
            }

            // 2. Load Site Settings (Hero, Contact, Footer) - LocalStorage öncelikli
            const settings = await loadJSONWithFallback('data/site_settings.json', 'site_settings');
            if (!settings) {
                console.warn('Site ayarları yüklenemedi, varsayılan değerler kullanılıyor');
                return;
            }

            if (settings.site_name) {
                const logo = document.getElementById('logoText');
                if (logo) logo.innerHTML = settings.site_name;
            }

            if (settings.hero) {
                const heroTitle = document.getElementById('heroTitle');
                const heroDesc = document.getElementById('heroDescription');
                const heroBtn = document.getElementById('heroButton');
                if (heroTitle) heroTitle.innerHTML = settings.hero.title;
                if (heroDesc) heroDesc.textContent = settings.hero.description;
                if (heroBtn) heroBtn.querySelector('span').textContent = settings.hero.button_text;
            }

            if (settings.stats) {
                const sStud = document.getElementById('statStudents');
                const sSucc = document.getElementById('statSuccess');
                const sExp = document.getElementById('statExperience');
                if (sStud) sStud.textContent = settings.stats.students;
                if (sSucc) sSucc.textContent = settings.stats.success;
                if (sExp) sExp.textContent = settings.stats.experience;
            }

            if (settings.courses_section) {
                const cTitle = document.getElementById('coursesSectionTitle');
                if (cTitle) cTitle.textContent = settings.courses_section.title;
            }

            if (settings.contact) {
                const addr = document.getElementById('contactAddress');
                const footerAddr = document.getElementById('footerAddress');
                const phone = document.getElementById('contactPhone');
                const mobile = document.getElementById('contactMobile');
                const email = document.getElementById('contactEmail');
                const hours = document.getElementById('contactWorkingHours');
                const waBtn = document.querySelector('.whatsapp-button');

                if (addr) addr.textContent = settings.contact.address;
                if (footerAddr) footerAddr.textContent = settings.contact.address;
                if (phone) {
                    phone.textContent = settings.contact.phone;
                    phone.href = `tel:${settings.contact.phone.replace(/\s+/g, '')}`;
                }
                if (mobile) {
                    mobile.textContent = settings.contact.phone_mobile;
                    mobile.href = `tel:${settings.contact.phone_mobile.replace(/\s+/g, '')}`;
                }
                if (email) {
                    email.textContent = settings.contact.email;
                    email.href = `mailto:${settings.contact.email}`;
                }
                if (hours) hours.textContent = settings.contact.working_hours;
                if (waBtn && settings.contact.whatsapp) {
                    waBtn.href = `https://wa.me/${settings.contact.whatsapp.replace(/\+/g, '')}?text=Merhaba,%20ehliyet%20kursu%20hakkında%20bilgi%20almak%20istiyorum.`;
                }
            }

            if (settings.footer && settings.footer.copyright) {
                const copy = document.getElementById('footerCopyright');
                if (copy) copy.innerHTML = settings.footer.copyright;
            }

            // 3. Load FAQ - LocalStorage öncelikli
            const faqData = await loadJSONWithFallback('data/faq.json', 'faq_data');
            const faqList = document.getElementById('faqList');

            if (faqList && faqData && faqData.questions) {
                faqList.innerHTML = ''; // Clear static ones
                faqData.questions.forEach(item => {
                    const faqItem = document.createElement('div');
                    faqItem.className = 'faq-item';
                    faqItem.innerHTML = `
                        <button class="faq-question">
                            <span>${item.question}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        <div class="faq-answer">
                            <p>${item.answer}</p>
                        </div>
                    `;
                    faqList.appendChild(faqItem);

                    // Re-bind FAQ events for new items
                    const btn = faqItem.querySelector('.faq-question');
                    btn.addEventListener('click', () => {
                        const parent = btn.parentElement;
                        const isOpen = parent.classList.contains('active');

                        // Close others
                        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

                        if (!isOpen) {
                            parent.classList.add('active');
                        }
                    });
                });
            }

        } catch (error) {
            console.error('Veriler yüklenirken hata oluştu:', error);
        }
    }
    loadSiteData();

    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // =====================================================
    // NAVBAR SCROLL EFFECT
    // =====================================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =====================================================
    // FAQ ACCORDION
    // =====================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // =====================================================
    // FORM SUBMISSION - WEB3FORMS
    // =====================================================
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.phone || !data.email || !data.course) {
                alert('Lütfen tüm zorunlu alanları doldurun.');
                return;
            }

            // Phone validation (Turkish format)
            const phoneRegex = /^(05)[0-9]{9}$/;
            const cleanPhone = data.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                alert('Lütfen geçerli bir telefon numarası girin. (05XX XXX XX XX)');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Lütfen geçerli bir e-posta adresi girin.');
                return;
            }

            // Show loading state
            const submitButton = registrationForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Gönderiliyor...</span>';
            submitButton.disabled = true;

            try {
                // Send form to Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success show';
                    successMessage.innerHTML = `
                        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">✅</span>
                        Teşekkürler ${data.name}! Kayıt talebiniz alındı.<br>
                        En kısa sürede sizinle iletişime geçeceğiz.
                    `;

                    registrationForm.innerHTML = '';
                    registrationForm.appendChild(successMessage);

                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    throw new Error(result.message || 'Form gönderilemedi');
                }
            } catch (error) {
                console.error('Form gönderim hatası:', error);
                alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // =====================================================
    // SCROLL REVEAL ANIMATION
    // =====================================================
    const revealElements = document.querySelectorAll('.course-card, .contact-card, .faq-item, .benefit');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // =====================================================
    // ACTIVE NAV LINK ON SCROLL
    // =====================================================
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // =====================================================
    // PHONE INPUT FORMATTING
    // =====================================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) {
                value = value.slice(0, 11);
            }

            // Format: 05XX XXX XX XX
            if (value.length >= 4) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            }
            if (value.length >= 8) {
                value = value.slice(0, 8) + ' ' + value.slice(8);
            }
            if (value.length >= 11) {
                value = value.slice(0, 11) + ' ' + value.slice(11);
            }

            e.target.value = value;
        });
    }

    // =====================================================
    // WHATSAPP BUTTON PULSE ANIMATION
    // =====================================================
    const whatsappButton = document.querySelector('.whatsapp-button');

    if (whatsappButton) {
        // Add pulse effect every 5 seconds
        setInterval(() => {
            whatsappButton.style.animation = 'pulse-whatsapp 0.6s ease-in-out';
            setTimeout(() => {
                whatsappButton.style.animation = '';
            }, 600);
        }, 5000);
    }

    // Add pulse animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-whatsapp {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }
    `;
    document.head.appendChild(style);

    // =====================================================
    // COURSE CARD HOVER EFFECT
    // =====================================================
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // =====================================================
    // AUTO-SELECT COURSE ON CLICK
    // =====================================================
    const courseButtons = document.querySelectorAll('.course-card a[href="#kayit"]');
    const courseSelect = document.getElementById('course');

    if (courseButtons.length > 0 && courseSelect) {
        courseButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                // Find the course title from the card
                const courseCard = this.closest('.course-card');
                const courseTitle = courseCard.querySelector('.course-title').textContent.trim();

                // Set the select value
                for (let i = 0; i < courseSelect.options.length; i++) {
                    if (courseSelect.options[i].value === courseTitle) {
                        courseSelect.selectedIndex = i;
                        break;
                    }
                }
            });
        });
    }

    console.log('🚗 Elif Sürücü Kursu web sitesi yüklendi!');
});
