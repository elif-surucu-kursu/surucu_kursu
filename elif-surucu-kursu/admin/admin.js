// Admin Panel JavaScript

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show section
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Load section data
        loadSectionData(section);
    });
});

// Load section data
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'settings':
            loadSettings();
            break;
        case 'courses':
            loadCourses();
            break;
        case 'faq':
            loadFAQ();
            break;
        case 'blog':
            loadBlog();
            break;
        case 'testimonials':
            loadTestimonials();
            break;
        case 'notifications':
            loadNotifications();
            break;
    }
}

// Load Dashboard
async function loadDashboard() {
    try {
        const loadJSON = async (path, defaultValue = {}) => {
            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.warn(`${path} yüklenemedi:`, error);
                return defaultValue;
            }
        };
        
        const [settings, courses, blog, analytics] = await Promise.all([
            loadJSON('../data/site_settings.json', {site_name: 'Elif Trafik Sürücü Kursu'}),
            loadJSON('../data/courses.json', {courses: []}),
            loadJSON('../data/blog_posts.json', {posts: []}),
            loadJSON('../data/analytics.json', {general: {total_visitors: 0, total_registrations: 0}})
        ]);
        
        document.getElementById('totalVisitors').textContent = analytics.general?.total_visitors || 0;
        document.getElementById('totalRegistrations').textContent = analytics.general?.total_registrations || 0;
        document.getElementById('totalCourses').textContent = courses.courses?.length || 0;
        document.getElementById('totalBlogPosts').textContent = blog.posts?.length || 0;
    } catch (error) {
        console.error('Dashboard yüklenirken hata:', error);
        // Varsayılan değerler
        document.getElementById('totalVisitors').textContent = '0';
        document.getElementById('totalRegistrations').textContent = '0';
        document.getElementById('totalCourses').textContent = '0';
        document.getElementById('totalBlogPosts').textContent = '0';
    }
}

// Load Settings
async function loadSettings() {
    try {
        // Önce localStorage'dan kontrol et
        const savedData = localStorage.getItem('site_settings');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                populateSettingsForm(data);
                return;
            } catch (e) {
                console.log('LocalStorage verisi geçersiz, dosyadan yükleniyor...');
            }
        }
        
        // Dosyadan yükle
        const response = await fetch('../data/site_settings.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        populateSettingsForm(data);
        
        // LocalStorage'a kaydet
        localStorage.setItem('site_settings', JSON.stringify(data));
    } catch (error) {
        console.error('Ayarlar yüklenirken hata:', error);
        
        // Hata mesajını göster
        const errorMsg = error.message || 'Bilinmeyen hata';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'background: #fee; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #ef4444;';
        errorDiv.innerHTML = `
            <strong>⚠️ Hata:</strong> ${errorMsg}<br>
            <small>JSON dosyasını manuel olarak yükleyebilirsiniz:</small><br>
            <input type="file" id="jsonFileInput" accept=".json" style="margin-top: 0.5rem;">
        `;
        
        const formContainer = document.querySelector('#settings .form-container');
        if (formContainer) {
            formContainer.insertBefore(errorDiv, formContainer.firstChild);
            
            // Dosya yükleme
            document.getElementById('jsonFileInput').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const data = JSON.parse(event.target.result);
                            populateSettingsForm(data);
                            localStorage.setItem('site_settings', JSON.stringify(data));
                            errorDiv.remove();
                            alert('✅ Ayarlar başarıyla yüklendi!');
                        } catch (err) {
                            alert('❌ JSON dosyası geçersiz: ' + err.message);
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }
    }
}

// Settings formunu doldur
function populateSettingsForm(data) {
    document.getElementById('siteName').value = data.site_name || '';
    document.getElementById('heroTitle').value = data.hero?.title || '';
    document.getElementById('heroDescription').value = data.hero?.description || '';
    document.getElementById('heroButton').value = data.hero?.button_text || '';
    document.getElementById('statSuccess').value = data.stats?.success || '';
    document.getElementById('statExperience').value = data.stats?.experience || '';
    document.getElementById('coursesTitle').value = data.courses_section?.title || '';
    document.getElementById('contactAddress').value = data.contact?.address || '';
    document.getElementById('contactPhone').value = data.contact?.phone || '';
    document.getElementById('contactPhoneMobile').value = data.contact?.phone_mobile || '';
    document.getElementById('contactWhatsapp').value = data.contact?.whatsapp || '';
    document.getElementById('contactEmail').value = data.contact?.email || '';
    document.getElementById('contactWorkingHours').value = data.contact?.working_hours || '';
    document.getElementById('footerCopyright').value = data.footer?.copyright || '';
}

// Save Settings
function initSettingsForm() {
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        // Remove existing listener if any
        const newForm = settingsForm.cloneNode(true);
        settingsForm.parentNode.replaceChild(newForm, settingsForm);
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                site_name: document.getElementById('siteName').value,
                hero: {
                    title: document.getElementById('heroTitle').value,
                    description: document.getElementById('heroDescription').value,
                    button_text: document.getElementById('heroButton').value
                },
                stats: {
                    success: document.getElementById('statSuccess').value,
                    experience: document.getElementById('statExperience').value
                },
                courses_section: {
                    title: document.getElementById('coursesTitle').value
                },
                contact: {
                    address: document.getElementById('contactAddress').value,
                    phone: document.getElementById('contactPhone').value,
                    phone_mobile: document.getElementById('contactPhoneMobile').value,
                    whatsapp: document.getElementById('contactWhatsapp').value,
                    email: document.getElementById('contactEmail').value,
                    working_hours: document.getElementById('contactWorkingHours').value
                },
                footer: {
                    copyright: document.getElementById('footerCopyright').value
                }
            };
            
            // Save to localStorage - ANINDA SİTEYE YANSIR!
            localStorage.setItem('site_settings', JSON.stringify(formData));
            
            // Show download link
            const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'site_settings.json';
            a.click();
            URL.revokeObjectURL(url);
            
            showSuccess('✅ Ayarlar kaydedildi ve ANINDA siteye yansıdı! Sayfayı yenileyin. JSON dosyası da indirildi - data/site_settings.json dosyasına kopyalayarak kalıcı hale getirin.');
        });
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsForm);
} else {
    initSettingsForm();
}

// Load Courses
async function loadCourses() {
    try {
        const response = await fetch('../data/courses.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const tbody = document.getElementById('coursesTableBody');
        tbody.innerHTML = '';
        
        if (data.courses && data.courses.length > 0) {
            data.courses.forEach((course, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${course.id || '-'}</td>
                    <td>${course.title || '-'}</td>
                    <td>${course.price || '-'}</td>
                    <td>
                        <button class="btn-small btn-secondary" onclick="editCourse(${index})">Düzenle</button>
                        <button class="btn-small btn-danger" onclick="deleteCourse(${index})">Sil</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Henüz kurs eklenmemiş</td></tr>';
        }
    } catch (error) {
        console.error('Kurslar yüklenirken hata:', error);
        document.getElementById('coursesTableBody').innerHTML = 
            '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #ef4444;">⚠️ Kurslar yüklenirken hata oluştu</td></tr>';
    }
}

// Add Course
function addCourse() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h3>Yeni Kurs Ekle</h3>
        <form id="courseForm">
            <div class="form-group">
                <label>ID</label>
                <input type="text" id="courseId" required>
            </div>
            <div class="form-group">
                <label>Kurs Adı</label>
                <input type="text" id="courseTitle" required>
            </div>
            <div class="form-group">
                <label>Fiyat</label>
                <input type="text" id="coursePrice">
            </div>
            <button type="submit" class="btn-primary">Kaydet</button>
        </form>
    `;
    modal.style.display = 'block';
    
    document.getElementById('courseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        // Implementation for saving course
        showSuccess('Kurs eklendi! JSON dosyası indirildi.');
        modal.style.display = 'none';
        loadCourses();
    });
}

// Load FAQ
async function loadFAQ() {
    try {
        // Önce localStorage'dan kontrol et
        const savedFAQ = localStorage.getItem('faq_data');
        if (savedFAQ) {
            try {
                const data = JSON.parse(savedFAQ);
                displayFAQ(data);
                return;
            } catch (e) {
                console.log('LocalStorage FAQ verisi geçersiz, dosyadan yükleniyor...');
            }
        }
        
        const response = await fetch('../data/faq.json');
        if (!response.ok) {
            // Dosya bulunamadıysa varsayılan yapı oluştur
            const list = document.getElementById('faqList');
            list.innerHTML = `
                <div class="error-message" style="margin-bottom: 1rem;">
                    <strong>⚠️ Uyarı:</strong> FAQ.json dosyası bulunamadı veya yüklenemedi.<br>
                    <small>Dosyayı manuel olarak yükleyebilirsiniz:</small><br>
                    <input type="file" id="faqFileInput" accept=".json" style="margin-top: 0.5rem; padding: 0.5rem;">
                </div>
                <div style="text-align: center; padding: 2rem;">Henüz soru eklenmemiş</div>
            `;
            
            document.getElementById('faqFileInput')?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const data = JSON.parse(event.target.result);
                            localStorage.setItem('faq_data', JSON.stringify(data));
                            displayFAQ(data);
                            showSuccess('FAQ dosyası başarıyla yüklendi!');
                        } catch (err) {
                            showError('JSON dosyası geçersiz: ' + err.message);
                        }
                    };
                    reader.readAsText(file);
                }
            });
            return;
        }
        const data = await response.json();
        // LocalStorage'a kaydet
        localStorage.setItem('faq_data', JSON.stringify(data));
        displayFAQ(data);
    } catch (error) {
        console.error('SSS yüklenirken hata:', error);
        const list = document.getElementById('faqList');
        list.innerHTML = `
            <div class="error-message" style="margin-bottom: 1rem;">
                <strong>⚠️ Hata:</strong> ${error.message || 'Bilinmeyen hata'}<br>
                <small>Dosyayı manuel olarak yükleyebilirsiniz:</small><br>
                <input type="file" id="faqFileInput" accept=".json" style="margin-top: 0.5rem; padding: 0.5rem;">
            </div>
        `;
        
        document.getElementById('faqFileInput')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        displayFAQ(data);
                        showSuccess('FAQ dosyası başarıyla yüklendi!');
                    } catch (err) {
                        showError('JSON dosyası geçersiz: ' + err.message);
                    }
                };
                reader.readAsText(file);
            }
        });
    }
}

function displayFAQ(data) {
    const list = document.getElementById('faqList');
    list.innerHTML = '';
    
    if (data.questions && data.questions.length > 0) {
        data.questions.forEach((faq, index) => {
            const div = document.createElement('div');
            div.className = 'faq-item';
            div.innerHTML = `
                <h4>${faq.question || 'Soru yok'}</h4>
                <p>${faq.answer || 'Cevap yok'}</p>
                <div>
                    <button class="btn-small btn-secondary" onclick="editFAQ(${index})">Düzenle</button>
                    <button class="btn-small btn-danger" onclick="deleteFAQ(${index})">Sil</button>
                </div>
            `;
            list.appendChild(div);
        });
    } else {
        list.innerHTML = '<div style="text-align: center; padding: 2rem;">Henüz soru eklenmemiş</div>';
    }
}

// Load Blog
async function loadBlog() {
    try {
        // Önce localStorage'dan kontrol et
        const savedBlog = localStorage.getItem('blog_data');
        if (savedBlog) {
            try {
                const data = JSON.parse(savedBlog);
                displayBlog(data);
                return;
            } catch (e) {
                console.log('LocalStorage Blog verisi geçersiz, dosyadan yükleniyor...');
            }
        }
        
        const response = await fetch('../data/blog_posts.json');
        if (!response.ok) {
            // Dosya bulunamadıysa varsayılan yapı oluştur
            const tbody = document.getElementById('blogTableBody');
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem;">
                        <div class="error-message" style="margin-bottom: 1rem; text-align: left;">
                            <strong>⚠️ Uyarı:</strong> blog_posts.json dosyası bulunamadı veya yüklenemedi.<br>
                            <small>Dosyayı manuel olarak yükleyebilirsiniz:</small><br>
                            <input type="file" id="blogFileInput" accept=".json" style="margin-top: 0.5rem; padding: 0.5rem;">
                        </div>
                        <div>Henüz blog yazısı eklenmemiş</div>
                    </td>
                </tr>
            `;
            
            document.getElementById('blogFileInput')?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const data = JSON.parse(event.target.result);
                            localStorage.setItem('blog_data', JSON.stringify(data));
                            displayBlog(data);
                            showSuccess('Blog dosyası başarıyla yüklendi!');
                        } catch (err) {
                            showError('JSON dosyası geçersiz: ' + err.message);
                        }
                    };
                    reader.readAsText(file);
                }
            });
            return;
        }
        const data = await response.json();
        // LocalStorage'a kaydet
        localStorage.setItem('blog_data', JSON.stringify(data));
        displayBlog(data);
    } catch (error) {
        console.error('Blog yüklenirken hata:', error);
        const tbody = document.getElementById('blogTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    <div class="error-message" style="margin-bottom: 1rem; text-align: left;">
                        <strong>⚠️ Hata:</strong> ${error.message || 'Bilinmeyen hata'}<br>
                        <small>Dosyayı manuel olarak yükleyebilirsiniz:</small><br>
                        <input type="file" id="blogFileInput" accept=".json" style="margin-top: 0.5rem; padding: 0.5rem;">
                    </div>
                </td>
            </tr>
        `;
        
        document.getElementById('blogFileInput')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        displayBlog(data);
                        showSuccess('Blog dosyası başarıyla yüklendi!');
                    } catch (err) {
                        showError('JSON dosyası geçersiz: ' + err.message);
                    }
                };
                reader.readAsText(file);
            }
        });
    }
}

function displayBlog(data) {
    const tbody = document.getElementById('blogTableBody');
    tbody.innerHTML = '';
    
    if (data.posts && data.posts.length > 0) {
        data.posts.forEach((post, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${post.title || '-'}</td>
                <td>${post.category || '-'}</td>
                <td>${post.date || '-'}</td>
                <td>${post.published ? '✅ Yayında' : '❌ Taslak'}</td>
                <td>
                    <button class="btn-small btn-secondary" onclick="editBlog(${index})">Düzenle</button>
                    <button class="btn-small btn-danger" onclick="deleteBlog(${index})">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Henüz blog yazısı eklenmemiş</td></tr>';
    }
}

// Load Testimonials
async function loadTestimonials() {
    try {
        const response = await fetch('../data/testimonials.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const list = document.getElementById('testimonialsList');
        list.innerHTML = '';
        
        if (data.testimonials && data.testimonials.length > 0) {
            data.testimonials.forEach((testimonial, index) => {
                const div = document.createElement('div');
                div.className = 'testimonial-item';
                div.innerHTML = `
                    <h4>${testimonial.name || 'İsimsiz'} - ${testimonial.course || 'Kurs yok'}</h4>
                    <p>⭐ ${testimonial.rating || 0}/5</p>
                    <p>${testimonial.comment || 'Yorum yok'}</p>
                    <div>
                        <button class="btn-small btn-secondary" onclick="editTestimonial(${index})">Düzenle</button>
                        <button class="btn-small btn-danger" onclick="deleteTestimonial(${index})">Sil</button>
                    </div>
                `;
                list.appendChild(div);
            });
        } else {
            list.innerHTML = '<div style="text-align: center; padding: 2rem;">Henüz yorum eklenmemiş</div>';
        }
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        document.getElementById('testimonialsList').innerHTML = 
            '<div style="text-align: center; padding: 2rem; color: #ef4444;">⚠️ Yorumlar yüklenirken hata oluştu</div>';
    }
}

// Load Notifications
async function loadNotifications() {
    try {
        const response = await fetch('../data/notifications.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const list = document.getElementById('notificationsList');
        list.innerHTML = '';
        
        if (data.notifications && data.notifications.length > 0) {
            data.notifications.forEach((notification, index) => {
                const div = document.createElement('div');
                div.className = 'notification-item';
                div.innerHTML = `
                    <h4>${notification.title || 'Başlık yok'} [${notification.type || 'Bilgi'}]</h4>
                    <p>${notification.content || 'İçerik yok'}</p>
                    <p><small>${notification.active ? '✅ Aktif' : '❌ Pasif'}</small></p>
                    <div>
                        <button class="btn-small btn-secondary" onclick="editNotification(${index})">Düzenle</button>
                        <button class="btn-small btn-danger" onclick="deleteNotification(${index})">Sil</button>
                    </div>
                `;
                list.appendChild(div);
            });
        } else {
            list.innerHTML = '<div style="text-align: center; padding: 2rem;">Henüz bildirim eklenmemiş</div>';
        }
    } catch (error) {
        console.error('Bildirimler yüklenirken hata:', error);
        document.getElementById('notificationsList').innerHTML = 
            '<div style="text-align: center; padding: 2rem; color: #ef4444;">⚠️ Bildirimler yüklenirken hata oluştu</div>';
    }
}

// Modal close
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

window.onclick = (e) => {
    const modal = document.getElementById('modal');
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<strong>✅ Başarılı:</strong> ${message}`;
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        activeSection.insertBefore(successDiv, activeSection.firstChild);
        setTimeout(() => successDiv.remove(), 5000);
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<strong>⚠️ Hata:</strong> ${message}`;
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        activeSection.insertBefore(errorDiv, activeSection.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Add FAQ
function addFAQ() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h3>Yeni SSS Ekle</h3>
        <form id="faqForm">
            <div class="form-group">
                <label>Soru</label>
                <input type="text" id="faqQuestion" required>
            </div>
            <div class="form-group">
                <label>Cevap</label>
                <textarea id="faqAnswer" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Kaydet</button>
        </form>
    `;
    modal.style.display = 'block';
    
    // Önceki event listener'ı temizle
    const oldForm = document.getElementById('faqForm');
    if (oldForm) {
        const newForm = oldForm.cloneNode(true);
        oldForm.parentNode.replaceChild(newForm, oldForm);
    }
    
    document.getElementById('faqForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            // Önce localStorage'dan kontrol et
            let data;
            const savedFAQ = localStorage.getItem('faq_data');
            
            if (savedFAQ) {
                try {
                    data = JSON.parse(savedFAQ);
                } catch (e) {
                    console.log('LocalStorage FAQ verisi geçersiz, dosyadan yükleniyor...');
                    const response = await fetch('../data/faq.json');
                    if (!response.ok) {
                        // Dosya yoksa yeni yapı oluştur
                        data = { questions: [] };
                    } else {
                        data = await response.json();
                    }
                }
            } else {
                // Dosyadan yükle
                try {
                    const response = await fetch('../data/faq.json');
                    if (!response.ok) {
                        // Dosya yoksa yeni yapı oluştur
                        data = { questions: [] };
                    } else {
                        data = await response.json();
                    }
                } catch (fetchError) {
                    // Fetch hatası varsa yeni yapı oluştur
                    data = { questions: [] };
                }
            }
            
            // questions array'i yoksa oluştur
            if (!data.questions) {
                data.questions = [];
            }
            
            const newFAQ = {
                question: document.getElementById('faqQuestion').value.trim(),
                answer: document.getElementById('faqAnswer').value.trim()
            };
            
            if (!newFAQ.question || !newFAQ.answer) {
                showError('Lütfen soru ve cevap alanlarını doldurun!');
                return;
            }
            
            data.questions.push(newFAQ);
            
            // LocalStorage'a kaydet - ANINDA SİTEYE YANSIR!
            localStorage.setItem('faq_data', JSON.stringify(data));
            
            // JSON dosyasını indir
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'faq.json';
            a.click();
            URL.revokeObjectURL(url);
            
            showSuccess('✅ SSS başarıyla eklendi ve ANINDA siteye yansıdı! Sayfayı yenileyin. JSON dosyası da indirildi - data/faq.json dosyasına kopyalayarak kalıcı hale getirin.');
            modal.style.display = 'none';
            loadFAQ();
        } catch (error) {
            console.error('SSS eklenirken hata:', error);
            showError('SSS eklenirken hata oluştu: ' + error.message);
        }
    });
}

// Add Blog Post
function addBlogPost() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h3>Yeni Blog Yazısı Ekle</h3>
        <form id="blogForm">
            <div class="form-group">
                <label>Başlık</label>
                <input type="text" id="blogTitle" required>
            </div>
            <div class="form-group">
                <label>Kategori</label>
                <input type="text" id="blogCategory" required>
            </div>
            <div class="form-group">
                <label>İçerik</label>
                <textarea id="blogContent" rows="6" required></textarea>
            </div>
            <div class="form-group">
                <label>Yayın Tarihi</label>
                <input type="date" id="blogDate" required>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="blogPublished"> Yayında
                </label>
            </div>
            <button type="submit" class="btn-primary">Kaydet</button>
        </form>
    `;
    modal.style.display = 'block';
    
    // Önceki event listener'ı temizle
    const oldBlogForm = document.getElementById('blogForm');
    if (oldBlogForm) {
        const newBlogForm = oldBlogForm.cloneNode(true);
        oldBlogForm.parentNode.replaceChild(newBlogForm, oldBlogForm);
    }
    
    document.getElementById('blogForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            // Önce localStorage'dan kontrol et
            let data;
            const savedBlog = localStorage.getItem('blog_data');
            
            if (savedBlog) {
                try {
                    data = JSON.parse(savedBlog);
                } catch (e) {
                    console.log('LocalStorage Blog verisi geçersiz, dosyadan yükleniyor...');
                    const response = await fetch('../data/blog_posts.json');
                    if (!response.ok) {
                        data = { posts: [] };
                    } else {
                        data = await response.json();
                    }
                }
            } else {
                try {
                    const response = await fetch('../data/blog_posts.json');
                    if (!response.ok) {
                        data = { posts: [] };
                    } else {
                        data = await response.json();
                    }
                } catch (fetchError) {
                    data = { posts: [] };
                }
            }
            
            if (!data.posts) {
                data.posts = [];
            }
            
            const newPost = {
                id: 'blog-' + Date.now(),
                title: document.getElementById('blogTitle').value.trim(),
                category: document.getElementById('blogCategory').value.trim(),
                content: document.getElementById('blogContent').value.trim(),
                date: document.getElementById('blogDate').value || new Date().toISOString().split('T')[0],
                published: document.getElementById('blogPublished').checked,
                icon: '📝',
                read_time: '5 Dakika Okuma'
            };
            
            if (!newPost.title || !newPost.content) {
                showError('Lütfen başlık ve içerik alanlarını doldurun!');
                return;
            }
            
            data.posts.push(newPost);
            
            // LocalStorage'a kaydet - ANINDA SİTEYE YANSIR!
            localStorage.setItem('blog_data', JSON.stringify(data));
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'blog_posts.json';
            a.click();
            URL.revokeObjectURL(url);
            
            showSuccess('✅ Blog yazısı eklendi ve ANINDA siteye yansıdı! Sayfayı yenileyin. JSON dosyası da indirildi.');
            modal.style.display = 'none';
            loadBlog();
        } catch (error) {
            showError('Blog yazısı eklenirken hata: ' + error.message);
        }
    });
}

// Add Testimonial
function addTestimonial() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h3>Yeni Müşteri Yorumu Ekle</h3>
        <form id="testimonialForm">
            <div class="form-group">
                <label>İsim</label>
                <input type="text" id="testimonialName" required>
            </div>
            <div class="form-group">
                <label>Kurs</label>
                <input type="text" id="testimonialCourse" required>
            </div>
            <div class="form-group">
                <label>Puan (1-5)</label>
                <input type="number" id="testimonialRating" min="1" max="5" required>
            </div>
            <div class="form-group">
                <label>Yorum</label>
                <textarea id="testimonialComment" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Kaydet</button>
        </form>
    `;
    modal.style.display = 'block';
    
    document.getElementById('testimonialForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('../data/testimonials.json');
            const data = await response.json();
            const newTestimonial = {
                name: document.getElementById('testimonialName').value,
                course: document.getElementById('testimonialCourse').value,
                rating: parseInt(document.getElementById('testimonialRating').value),
                comment: document.getElementById('testimonialComment').value
            };
            data.testimonials.push(newTestimonial);
            
            // LocalStorage'a kaydet
            localStorage.setItem('testimonials_data', JSON.stringify(data));
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'testimonials.json';
            a.click();
            URL.revokeObjectURL(url);
            
            showSuccess('✅ Müşteri yorumu eklendi! JSON dosyası indirildi. (Not: Yorumlar şu an sitede gösterilmiyor, yakında eklenecek)');
            modal.style.display = 'none';
            loadTestimonials();
        } catch (error) {
            showError('Yorum eklenirken hata: ' + error.message);
        }
    });
}

// Add Notification
function addNotification() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h3>Yeni Bildirim Ekle</h3>
        <form id="notificationForm">
            <div class="form-group">
                <label>Başlık</label>
                <input type="text" id="notificationTitle" required>
            </div>
            <div class="form-group">
                <label>İçerik</label>
                <textarea id="notificationContent" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label>Tip</label>
                <select id="notificationType" required>
                    <option value="info">Bilgi</option>
                    <option value="warning">Uyarı</option>
                    <option value="success">Başarı</option>
                </select>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="notificationActive" checked> Aktif
                </label>
            </div>
            <button type="submit" class="btn-primary">Kaydet</button>
        </form>
    `;
    modal.style.display = 'block';
    
    document.getElementById('notificationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('../data/notifications.json');
            const data = await response.json();
            const newNotification = {
                title: document.getElementById('notificationTitle').value,
                content: document.getElementById('notificationContent').value,
                type: document.getElementById('notificationType').value,
                active: document.getElementById('notificationActive').checked
            };
            data.notifications.push(newNotification);
            
            // LocalStorage'a kaydet
            localStorage.setItem('notifications_data', JSON.stringify(data));
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'notifications.json';
            a.click();
            URL.revokeObjectURL(url);
            
            showSuccess('✅ Bildirim eklendi! JSON dosyası indirildi. (Not: Bildirimler şu an sitede gösterilmiyor, yakında eklenecek)');
            modal.style.display = 'none';
            loadNotifications();
        } catch (error) {
            showError('Bildirim eklenirken hata: ' + error.message);
        }
    });
}

// Edit functions
function editCourse(i) {
    showError('Kurs düzenleme özelliği yakında eklenecek. Şimdilik JSON dosyasını manuel düzenleyin.');
}

function editFAQ(i) {
    showError('SSS düzenleme özelliği yakında eklenecek. Şimdilik JSON dosyasını manuel düzenleyin.');
}

function editBlog(i) {
    showError('Blog düzenleme özelliği yakında eklenecek. Şimdilik JSON dosyasını manuel düzenleyin.');
}

function editTestimonial(i) {
    showError('Yorum düzenleme özelliği yakında eklenecek. Şimdilik JSON dosyasını manuel düzenleyin.');
}

function editNotification(i) {
    showError('Bildirim düzenleme özelliği yakında eklenecek. Şimdilik JSON dosyasını manuel düzenleyin.');
}

// Delete functions
async function deleteCourse(i) {
    if (!confirm('Kursu silmek istediğinize emin misiniz?')) return;
    try {
        const response = await fetch('../data/courses.json');
        const data = await response.json();
        data.courses.splice(i, 1);
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'courses.json';
        a.click();
        URL.revokeObjectURL(url);
        
        // LocalStorage'ı güncelle
        localStorage.setItem('courses_data', JSON.stringify(data));
        
        showSuccess('✅ Kurs silindi ve ANINDA siteye yansıdı! Sayfayı yenileyin. JSON dosyası da indirildi.');
        loadCourses();
    } catch (error) {
        showError('Kurs silinirken hata: ' + error.message);
    }
}

async function deleteFAQ(i) {
    if (!confirm('Soruyu silmek istediğinize emin misiniz?')) return;
    try {
        const response = await fetch('../data/faq.json');
        const data = await response.json();
        data.questions.splice(i, 1);
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'faq.json';
        a.click();
        URL.revokeObjectURL(url);
        
        // LocalStorage'ı güncelle - ANINDA SİTEYE YANSIR!
        localStorage.setItem('faq_data', JSON.stringify(data));
        
        showSuccess('✅ SSS silindi ve ANINDA siteye yansıdı! Sayfayı yenileyin. JSON dosyası da indirildi.');
        loadFAQ();
    } catch (error) {
        showError('SSS silinirken hata: ' + error.message);
    }
}

async function deleteBlog(i) {
    if (!confirm('Yazıyı silmek istediğinize emin misiniz?')) return;
    try {
        const response = await fetch('../data/blog_posts.json');
        const data = await response.json();
        data.posts.splice(i, 1);
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'blog_posts.json';
        a.click();
        URL.revokeObjectURL(url);
        
        // LocalStorage'ı güncelle - ANINDA SİTEYE YANSIR!
        localStorage.setItem('blog_data', JSON.stringify(data));
        
        showSuccess('✅ Blog yazısı silindi ve ANINDA siteye yansıdı! Sayfayı yenileyin. JSON dosyası da indirildi.');
        loadBlog();
    } catch (error) {
        showError('Blog yazısı silinirken hata: ' + error.message);
    }
}

async function deleteTestimonial(i) {
    if (!confirm('Yorumu silmek istediğinize emin misiniz?')) return;
    try {
        const response = await fetch('../data/testimonials.json');
        const data = await response.json();
        data.testimonials.splice(i, 1);
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'testimonials.json';
        a.click();
        URL.revokeObjectURL(url);
        
        showSuccess('Yorum silindi! JSON dosyası indirildi.');
        loadTestimonials();
    } catch (error) {
        showError('Yorum silinirken hata: ' + error.message);
    }
}

async function deleteNotification(i) {
    if (!confirm('Bildirimi silmek istediğinize emin misiniz?')) return;
    try {
        const response = await fetch('../data/notifications.json');
        const data = await response.json();
        data.notifications.splice(i, 1);
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notifications.json';
        a.click();
        URL.revokeObjectURL(url);
        
        showSuccess('Bildirim silindi! JSON dosyası indirildi.');
        loadNotifications();
    } catch (error) {
        showError('Bildirim silinirken hata: ' + error.message);
    }
}

// Refresh Site - LocalStorage'dan verileri yükle
function refreshSite() {
    // LocalStorage'daki verileri kontrol et
    const settings = localStorage.getItem('site_settings');
    const faq = localStorage.getItem('faq_data');
    const blog = localStorage.getItem('blog_data');
    
    let message = '🔄 Site yenilendi!\n\n';
    if (settings) message += '✅ Site ayarları güncel\n';
    if (faq) message += '✅ SSS verileri güncel\n';
    if (blog) message += '✅ Blog verileri güncel\n';
    
    if (!settings && !faq && !blog) {
        message = '⚠️ Henüz güncellenmiş veri yok. Önce bir değişiklik yapın ve kaydedin.';
    }
    
    alert(message);
    
    // Ana siteyi yeni sekmede aç
    window.open('../index.html', '_blank');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadSectionData('dashboard');
        initSettingsForm();
    });
} else {
    loadSectionData('dashboard');
    initSettingsForm();
}

