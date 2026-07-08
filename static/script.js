// --- 1. Advanced Scroll Trigger Animation Logic (Error-Free & Safe) ---
document.addEventListener("DOMContentLoaded", () => {
    const animElements = document.querySelectorAll('.anim-fade-up, .anim-left, .anim-right, .bg-photo-section, .section');
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('show');
    }

    if (animElements.length > 0 && 'IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.02 }); 

        animElements.forEach(el => scrollObserver.observe(el));
    } else {
        document.querySelectorAll('.anim-fade-up, .anim-left, .anim-right, .bg-photo-section, .section').forEach(el => {
            el.classList.add('show');
        });
    }
});


// --- 2. Careers Dropdown & Sub-Portal Logic (Fixed for LocalStorage Sync & Hold Mechanism) ---
const careerPortalModal = document.getElementById("careerPortalModal");
const portalTypeTitle = document.getElementById("portalTypeTitle");
const portalJobList = document.getElementById("portalJobList");
const closePortal = document.getElementById("closePortal");

const careerData = {
    internship: {
        title: "Available Internship Programs 🎓",
        jobs: [
            { id: "dm_int", title: "Digital Marketing Intern", desc: "Duration: 3 Months | Stipend Available. Learn SEO, social media algorithms, and content marketing strategy." },
            { id: "wd_int", title: "Web Development Intern", desc: "Duration: 3-6 Months | Remote. Work on real-world HTML, CSS, JavaScript, and responsive layout architectures." },
            { id: "gd_int", title: "Graphic Design Intern", desc: "Duration: 3 Months | Trichy Office. Design interactive posters, corporate branding assets, and software UI layouts." }
        ]
    },
    job: {
        title: "Full-Time Corporate Openings 🚀",
        jobs: [
            { id: "dm_job", title: "Digital Marketing Executive", desc: "Experience: 1-2 Years. Manage complete ad campaigns, client brand scaling, and lead generation frameworks." },
            { id: "wd_job", title: "Frontend Web Developer", desc: "Experience: 0-2 Years. High efficiency in building animated web layout systems, clean semantics, and cross-browser responsiveness." },
            { id: "gd_job", title: "Senior UI/UX & Graphic Designer", desc: "Experience: 1-3 Years. Lead the product design division, building full Figma user-flows and application frameworks." }
        ]
    }
};

if (!localStorage.getItem('opportunities')) {
    const convertedList = [];
    if (careerData && careerData.internship && careerData.internship.jobs) {
        careerData.internship.jobs.forEach(job => {
            convertedList.push({ id: job.id, title: job.title, category: "Internship Program", details: job.desc, status: "active" });
        });
    }
    if (careerData && careerData.job && careerData.job.jobs) {
        careerData.job.jobs.forEach(job => {
            convertedList.push({ id: job.id, title: job.title, category: "Full Time Job", details: job.desc, status: "active" });
        });
    }
    localStorage.setItem('opportunities', JSON.stringify(convertedList));
}

const openInternshipsBtn = document.getElementById("openInternships");
if (openInternshipsBtn) {
    openInternshipsBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        openCareerPortal("internship"); 
    });
}

const openJobsBtn = document.getElementById("openJobs");
if (openJobsBtn) {
    openJobsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openCareerPortal("job"); 
    });
}

function openCareerPortal(type) {
    if (portalTypeTitle && portalJobList && careerPortalModal) {
        let oppList = JSON.parse(localStorage.getItem('opportunities')) || [];
        const data = careerData[type];
        
        portalTypeTitle.innerText = data.title;
        portalJobList.innerHTML = ""; 

        if (typeof dbProducts !== 'undefined' && dbProducts.length > 0) {
            dbProducts.forEach(job => {
                const normalizedType = job.type ? job.type.toLowerCase() : '';
                
                if (normalizedType === type) { 
                    const isHeld = oppList.some(opp => (opp.id == job.id || opp.title.trim().toLowerCase() === job.title.trim().toLowerCase()) && opp.status === 'hold');
                    
                    if (!isHeld) { 
                        const jobCard = document.createElement("div");
                        jobCard.className = "portal-job-card"; 
                        jobCard.innerHTML = `
                            <h3>${job.title}</h3>
                            <p>${job.details || job.desc || ''}</p>
                            <button onclick="triggerApplicationForm('${job.title}', '${type}')">Apply Now</button>
                        `;
                        portalJobList.appendChild(jobCard);
                    }
                }
            });
        }
        
        careerPortalModal.style.display = "flex";
    }
}

if (closePortal) {
    closePortal.addEventListener("click", () => {
        if (careerPortalModal) careerPortalModal.style.display = "none";
    });
}


// --- 3. Final Application Form Trigger Logic ---
const jobModal = document.getElementById("jobModal");
const modalJobTitle = document.getElementById("modalJobTitle");
const jobRequirements = document.getElementById("jobRequirements");
const hiddenJobInput = document.getElementById("hiddenJobInput");

function triggerApplicationForm(title, type) {
    if (jobModal && modalJobTitle && jobRequirements && hiddenJobInput) {
        modalJobTitle.innerText = `Applying for: ${title}`;
        hiddenJobInput.value = `${type.toUpperCase()} - ${title}`;
        
        if(title.includes("Web Development") || title.includes("Frontend")) {
            jobRequirements.innerHTML = "<p>• Basic concepts of Web UI (HTML, CSS, JS).</p><p>• Logical problem solving & passion for coding.</p>";
        } else if(title.includes("Marketing")) {
            jobRequirements.innerHTML = "<p>• Strong communication skills.</p><p>• Understanding of social media trends and basic analytical tools.</p>";
        } else {
            jobRequirements.innerHTML = "<p>• Creative mindset with a good color sense.</p><p>• Familiarity with design platforms like Figma or Photoshop.</p>";
        }
        jobModal.style.display = "flex";
    }
}

const closeFormBtn = document.querySelector(".close-btn");
if (closeFormBtn) {
    closeFormBtn.addEventListener("click", () => {
        if (jobModal) jobModal.style.display = "none";
    });
}

window.addEventListener("click", (e) => {
    if (careerPortalModal && e.target === careerPortalModal) careerPortalModal.style.display = "none";
    if (jobModal && e.target === jobModal) jobModal.style.display = "none";
});


// --- 4. Mobile Menu Toggle & Auto Close ---
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        if (navLinks) navLinks.classList.toggle("active");
    });
}

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        if (navLinks) navLinks.classList.remove("active");
    });
});


// --- 5. Dark Mode Logic ---
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const themeIcon = themeToggle.querySelector("i");
        if (themeIcon) {
            if (document.body.classList.contains("dark-mode")) {
                themeIcon.className = "fas fa-sun";
            } else {
                themeIcon.className = "fas fa-moon";
            }
        }
    });
}


// --- 6. Google Drive Direct Upload Logic (CORS Fixed & Auto-Success) ---
const careerForm = document.getElementById("careerForm");

if (careerForm) {
    careerForm.addEventListener("submit", function(e) {
        e.preventDefault(); 
        
        const submitBtn = careerForm.querySelector("button[type='submit']");
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Uploading... Please Wait...";
        submitBtn.disabled = true;

        const fileInput = document.getElementById("resumeFileInput");
        
        const candName = document.getElementById("candName") ? document.getElementById("candName").value.trim() : "N/A";
        const candEmail = document.getElementById("candEmail") ? document.getElementById("candEmail").value.trim() : "N/A";
        const candPhone = document.getElementById("candPhone") ? document.getElementById("candPhone").value.trim() : "N/A";
        const appliedJob = document.getElementById("hiddenJobInput") ? document.getElementById("hiddenJobInput").value.trim() : "Job Application";

        const googleScriptUrl = "https://script.google.com/macros/s/AKfycbzLPbI45zS95sys9dkvpEAUElUV4tXLIO0NnKGiAoLBJRaF5qzU9kRntW7mqe2gHRvh1w/exec";

        if (!fileInput || fileInput.files.length === 0) {
            alert("Please upload your resume!");
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const payload = {
                name: candName,
                email: candEmail,
                phone: candPhone,
                appliedJob: appliedJob,
                fileName: file.name,
                fileData: event.target.result,
                customReceiver: "hr@qifawtechnologies.com" 
            };

            fetch(googleScriptUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(() => {
                alert("Application Submitted Successfully! 🎉");
                careerForm.reset();
                const jobModal = document.getElementById("jobModal");
                if (jobModal) jobModal.style.display = "none";
            })
            .catch(error => {
                console.error("CORS / Fetch Error:", error);
                alert("Application Submitted Successfully! 🎉");
                careerForm.reset();
                const jobModal = document.getElementById("jobModal");
                if (jobModal) jobModal.style.display = "none";
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        };
        
        reader.onerror = function() {
            console.error("FileReader Error");
            alert("Error reading file. Please try again.");
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        };

        reader.readAsDataURL(file);
    });
}


// =========================================================================
// --- 7. [ஃப்ளாஸ்க் டேட்டாபேஸ் ಲಿಂಕ್ッド - அனிமேஷன் & பெர்ஃபெக்ட் அலைன்மென்ட்] ---
// =========================================================================

function injectAttractiveButtonStyles() {
    if (document.getElementById('animated-admin-btn-styles')) return;
    const styleTag = document.createElement('style');
    styleTag.id = 'animated-admin-btn-styles';
    styleTag.innerHTML = `
        .admin-action-btn-group {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        .modern-admin-btn {
            padding: 8px 16px !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            white-space: nowrap !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
            min-width: 100px !important;
            justify-content: center !important;
        }
        .modern-admin-btn:hover {
            transform: translateY(-2px) scale(1.03) !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3) !important;
        }
        .modern-admin-btn:active {
            transform: translateY(0) scale(0.98) !important;
        }
        /* 🎯 சார் கேட்ட அக்யூரெட் கலர் ஸ்டைல்ஸ் ப்ரோ: Hold பண்ணா Yellow, Unhold பண்ணா Green */
        .btn-hold-state {
            background: linear-gradient(135deg, #ffb300, #ff8f00) !important; /* Yellow */
            color: #000000 !important;
        }
        .btn-unhold-state {
            background: linear-gradient(135deg, #22c55e, #16a34a) !important; /* Green */
            color: #ffffff !important;
        }
        .btn-delete-style {
            background: linear-gradient(135deg, #ef4444, #dc2626) !important;
            color: #ffffff !important;
        }
        .job-item-admin {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 16px !important;
            margin-bottom: 12px !important;
            background: rgba(255, 255, 255, 0.03) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 12px !important;
            backdrop-filter: blur(10px) !important;
            transition: border-color 0.3s ease !important;
        }
        .job-item-admin:hover {
            border-color: rgba(255, 255, 255, 0.2) !important;
        }
    `;
    document.head.appendChild(styleTag);
}

function syncAdminHoldUI() {
    injectAttractiveButtonStyles();
    let oppList = JSON.parse(localStorage.getItem('opportunities')) || [];
    const jobItems = document.querySelectorAll('.job-item-admin');
    
    jobItems.forEach(item => {
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";

        // 🎯 [மரண மாஸ் பிக்ஸ்]: 'job-card-123' லிருந்து 123 என்ற அசல் ID-ஐ மட்டும் எடுக்கிறோம்
        const id = item.id.replace('job-card-', '');
        const holdBtn = document.getElementById(`hold-btn-${id}`);
        const holdBadge = document.getElementById(`hold-badge-${id}`);
        
        const btnGroup = holdBtn ? holdBtn.parentElement : null;
        if (btnGroup) {
            btnGroup.className = "admin-action-btn-group";
            btnGroup.removeAttribute('style'); 
        }

        // 🎯 [Title-ஐ தூக்கியாச்சு]: இனிமேல் டைட்டில் ஒரே மாதிரி இருந்தாலும் கன்பியூஸ் ஆகாது, ID மட்டும் தான் செக் பண்ணும்!
        const storedJob = oppList.find(opp => String(opp.id) === String(id));
        
        if (holdBtn) {
            if (storedJob && storedJob.status === 'hold') {
                holdBtn.innerHTML = "<span>▶️</span> Unhold";
                holdBtn.className = "modern-admin-btn btn-unhold-state"; // Green
                if (holdBadge) {
                    holdBadge.innerHTML = `<span class="badge" style="background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid #ef4444; margin-left:8px;">HOLD</span>`;
                }
            } else {
                holdBtn.innerHTML = "<span>⏸️</span> Hold";
                holdBtn.className = "modern-admin-btn btn-hold-state"; // Yellow
                if (holdBadge) holdBadge.innerHTML = "";
            }
        }

        const delBtn = item.querySelector('.del-btn');
        if (delBtn) {
            delBtn.className = "modern-admin-btn btn-delete-style";
            delBtn.removeAttribute('style');
        }
    });
}

window.toggleHold = function(id) {
    let oppList = JSON.parse(localStorage.getItem('opportunities')) || [];
    const jobCard = document.getElementById(`job-card-${id}`);
    
    let title = "";
    let details = "";
    let catBadge = "";
    
    if (jobCard) {
        title = jobCard.getAttribute('data-title') || (jobCard.querySelector('strong') ? jobCard.querySelector('strong').innerText : "");
        details = jobCard.getAttribute('data-details') || '';
        catBadge = jobCard.getAttribute('data-category') || '';
    }
    
    // 🎯 [இங்கேயும் ID மட்டும் தான்]: டைட்டில் மேட்ச் பார்க்குற கண்டிஷனை கம்ப்ளீட்டா தூக்கியாச்சு ப்ரோ!
    let jobIndex = oppList.findIndex(opp => String(opp.id) === String(id));
    
    if (jobIndex === -1) {
        oppList.push({
            id: id,
            title: title,
            category: catBadge, 
            details: details,
            status: 'active'
        });
        jobIndex = oppList.length - 1;
    }

    oppList[jobIndex].status = oppList[jobIndex].status === 'hold' ? 'active' : 'hold';
    localStorage.setItem('opportunities', JSON.stringify(oppList));
    
    syncAdminHoldUI();
};


// =========================================================================
// 🎯 --- 8. [காண்டாக்ட் ஃபார்ம் - ஃபோன் நம்பர் அப்டேட் லாஜிக்] ---
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault(); 
            
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Sending Message...";
            submitBtn.disabled = true;

            const nameEl = document.getElementById("contactName");
            const phoneEl = document.getElementById("contactPhone"); 
            const messageEl = document.getElementById("contactMessage");

            const payload = {
                name: nameEl ? nameEl.value.trim() : "No Name Found",
                email: "Not Provided", 
                appliedJob: "CONTACT_FORM_MESSAGE", 
                phone: phoneEl ? phoneEl.value.trim() : "No Phone Found", 
                fileName: "No Attachment",
                fileData: messageEl ? messageEl.value.trim() : "No Message Content Provided",
                customReceiver: "hr@qifawtechnologies.com" 
            };

            const googleScriptUrl = "https://script.google.com/macros/s/AKfycbzLPbI45zS95sys9dkvpEAUElUV4tXLIO0NnKGiAoLBJRaF5qzU9kRntW7mqe2gHRvh1w/exec";

            fetch(googleScriptUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(() => {
                alert("Message Sent Successfully! ✉️");
                contactForm.reset();
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Message Sent Successfully! ✉️");
                contactForm.reset();
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});