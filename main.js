'use strict';

//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })


//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {elementToggleFunc(this); });

for(let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for(let i = 0; i < filterItems.length; i++) {
        if(selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}
function updateScrollToTop() {
      const scrollProgress = document.getElementById("progress");
      const pos = document.documentElement.scrollTop;
      const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollValue = Math.round((pos * 100) / calcHeight);
      
      if (scrollProgress) {
        if (pos > 100) {
          scrollProgress.style.display = "grid";
        } else {
          scrollProgress.style.display = "none";
        }
        
        scrollProgress.style.background = `conic-gradient(#00ffff ${scrollValue}%, #ff00ff ${scrollValue}%)`;
      }
    }

    window.addEventListener('scroll', updateScrollToTop);
    
    document.getElementById('progress')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
//Enabling filter button for larger screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
    
    filterBtn[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for(let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if(form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else { 
            formBtn.setAttribute('disabled', '');
        }
    })
}
// Contact Form JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            const contactForm = document.getElementById('contactForm');
            const fileInput = document.getElementById('fileInput');
            const filePreview = document.getElementById('filePreview');
            const previewImage = document.getElementById('previewImage');
            const fileName = document.getElementById('fileName');
            const fileText = document.getElementById('fileText');
            const uploadBtn = document.getElementById('uploadBtn');
            const submitBtn = document.getElementById('submitBtn');
            const feedback = document.getElementById('feedback');
            const removeFileBtn = document.getElementById('removeFile');
            const anonymousCheckbox = document.getElementById('anonymous');
            const anonymousMode = document.getElementById('anonymousMode');
            const backToNormalBtn = document.getElementById('backToNormal');

            let selectedFile = null;
            let uploadedFileUrl = null;
            let isUploading = false;

            // Anonymous mode toggle
            anonymousCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    // Switch to anonymous mode
                    contactForm.style.display = 'none';
                    anonymousMode.style.display = 'block';
                } else {
                    // Switch back to normal mode
                    contactForm.style.display = 'block';
                    anonymousMode.style.display = 'none';
                }
            });

            // Back to normal form button
            backToNormalBtn.addEventListener('click', function() {
                anonymousCheckbox.checked = false;
                contactForm.style.display = 'block';
                anonymousMode.style.display = 'none';
            });

// File preview
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        fileText.textContent = "Change file";
        fileName.textContent = file.name;

        // Show remove button only if a file is selected
        removeFileBtn.style.display = 'inline-block';
        uploadBtn.style.display = 'flex';

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = e => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                filePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = 'none';
            filePreview.style.display = 'block';
        }
    } else {
        // No file selected → hide remove button
        removeFileBtn.style.display = 'none';
        filePreview.style.display = 'none';
        uploadBtn.style.display = 'none';
        fileText.textContent = 'Choose a file to upload';
    }
});


            // Remove file
            removeFileBtn.addEventListener('click', function() {
                selectedFile = null;
                uploadedFileUrl = null;
                fileInput.value = '';
                filePreview.style.display = 'none';
                uploadBtn.style.display = 'none';
                removeFileBtn.style.display = 'none';
                fileText.textContent = 'Choose a file to upload';
                checkFormValidity();
            });

            // Upload file
            uploadBtn.addEventListener('click', async function() {
                if (!selectedFile) return;
                
                isUploading = true;
                uploadBtn.disabled = true;
                uploadBtn.innerHTML = '<span class="icon">⏳</span> Uploading...';
                
                try {
                    const formData = new FormData();
                    formData.append('image', selectedFile);

                    const res = await fetch("https://api.imgbb.com/1/upload?key=551870d6a8b22aa94ff8623a6bec56bf", {
                        method: "POST",
                        body: formData
                    });

                    const data = await res.json();

                    if (data.success) {
                        uploadedFileUrl = data.data.url;
                        showFeedback('✅ File uploaded successfully!', 'success');
                        uploadBtn.innerHTML = '<span class="icon">✅</span> Uploaded';
                        uploadBtn.style.background = 'var(--success)';
                        uploadBtn.style.color = 'white';
                        uploadBtn.disabled = true;
                    } else {
                        showFeedback('❌ Upload failed: ' + data.error.message, 'error');
                        uploadBtn.innerHTML = '<span class="icon">⬆️</span> Upload File';
                        uploadBtn.disabled = false;
                    }
                } catch (err) {
                    console.error(err);
                    showFeedback('❌ Error uploading file.', 'error');
                    uploadBtn.innerHTML = '<span class="icon">⬆️</span> Upload File';
                    uploadBtn.disabled = false;
                } finally {
                    isUploading = false;
                    checkFormValidity();
                }
            });

            // Form submission
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();
                const currentUrl = window.location.href;

                // Reset feedback
                feedback.style.display = 'none';
                feedback.className = 'feedback';

                // Basic validation
                if (!name) return showFeedback('Please enter your name.', 'error');
                if (!message) return showFeedback('Please enter your message.', 'error');
                if (email && !isValidEmail(email)) return showFeedback('Please enter a valid email.', 'error');

                // Prepare WhatsApp message
                let whatsappMessage = `New Contact Form Submission:%0A%0A`;
                whatsappMessage += `*Name:* ${name}%0A`;
                if (email) {
                    whatsappMessage += `*Email:* ${email}%0A`;
                }
                whatsappMessage += `*Message:* ${message}%0A`;
                whatsappMessage += `*URL:* ${currentUrl}%0A`;
                
                if (uploadedFileUrl) {
                    whatsappMessage += `%0A*Attachment:* ${uploadedFileUrl}`;
                }

                const whatsappUrl = `https://wa.me/254769486775?text=${whatsappMessage}`;

                // Open WhatsApp
                window.open(whatsappUrl, '_blank');

                showFeedback('✅ Message ready! Opening WhatsApp...', 'success');

                // Reset form after a short delay
                setTimeout(() => {
                    contactForm.reset();
                    selectedFile = null;
                    uploadedFileUrl = null;
                    filePreview.style.display = 'none';
                    fileText.textContent = 'Choose a file to upload';
                    previewImage.src = '';
                    uploadBtn.style.display = 'none';
                    uploadBtn.innerHTML = '<span class="icon">⬆️</span> Upload File';
                    uploadBtn.style.background = 'var(--orange-yellow-crayola)';
                    uploadBtn.style.color = 'var(--smoky-black)';
                    uploadBtn.disabled = false;
                    submitBtn.disabled = true;
                }, 3000);
            });

            // Form validation
            function checkFormValidity() {
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();
                
                const hasFile = selectedFile !== null;
                const isFileUploaded = uploadedFileUrl !== null;
                
                // Enable submit button only if:
                // 1. Required fields are filled (email is optional)
                // 2. If a file is selected, it must be uploaded
                const isValid = name && message && 
                               (!hasFile || (hasFile && isFileUploaded)) &&
                               (!email || isValidEmail(email));
                
                submitBtn.disabled = !isValid;
            }

            // Add event listeners for form validation
            document.getElementById('name').addEventListener('input', checkFormValidity);
            document.getElementById('email').addEventListener('input', checkFormValidity);
            document.getElementById('message').addEventListener('input', checkFormValidity);

            function showFeedback(msg, type) {
                feedback.textContent = msg;
                feedback.className = `feedback ${type}`;
                feedback.style.display = 'block';
            }

            function isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
        });

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for(let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function() {
        
        for(let i = 0; i < pages.length; i++) {
            if(this.innerHTML.toLowerCase() == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i]. classList.remove('active');
            }
        }
    });
}
