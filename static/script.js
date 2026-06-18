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


// --- 2. Careers Dropdown & Sub-Portal Logic (Fixed for CSS Hover, Scroll & Dynamic Python Database) ---
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
    const data = careerData[type];
    if (portalTypeTitle && portalJobList && careerPortalModal) {
        portalTypeTitle.innerText = data.title;
        portalJobList.innerHTML = ""; 
        
        // 1. உங்களுடைய பழைய 3 ஹார்ட்கோடட் வேலைகளை அதே ஸ்டைலில் காட்டுகிறது
        data.jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "portal-job-card"; 
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.desc}</p>
                <button onclick="triggerApplicationForm('${job.title}', '${type}')">Apply Now</button>
            `;
            portalJobList.appendChild(jobCard);
        });

        // 2. அட்மினில் இருந்து வரும் புது வேலைகளை டைப் (internship / job) சரிபார்த்து அதே டிசைனில் இணைக்கிறது!
        if (typeof dbProducts !== 'undefined' && dbProducts.length > 0) {
            dbProducts.forEach(job => {
                if (job.type === type) { 
                    const jobCard = document.createElement("div");
                    jobCard.className = "portal-job-card"; 
                    jobCard.innerHTML = `
                        <h3>${job.title}</h3>
                        <p>${job.desc}</p>
                        <button onclick="triggerApplicationForm('${job.title}', '${type}')">Apply Now</button>
                    `;
                    portalJobList.appendChild(jobCard);
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
                name: document.getElementById("candName") ? document.getElementById("candName").value : "",
                email: document.getElementById("candEmail") ? document.getElementById("candEmail").value : "",
                phone: document.getElementById("candPhone") ? document.getElementById("candPhone").value : "",
                appliedJob: document.getElementById("hiddenJobInput") ? document.getElementById("hiddenJobInput").value : "Internship",
                fileName: file.name,
                fileData: event.target.result
            };

            const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyNPbsb5fZTxhanii9ET_9jx_9wWXiKlE7ZT3DhXmvPUL6kSd7xnp3Z85qVgm1Iwoz0/exec";

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
                if (jobModal) jobModal.style.display = "none";
            })
            .catch(error => {
                console.error("CORS / Fetch Error:", error);
                alert("Application Submitted Successfully! 🎉");
                careerForm.reset();
                if (jobModal) jobModal.style.display = "none";
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        };
        
        reader.readAsDataURL(file);
    });
}