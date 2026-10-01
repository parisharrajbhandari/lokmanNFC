document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // POPULATE PAGE FROM CONFIG
    // ============================================================
    const cfg = BUSINESS_CONFIG;

    // --- Page Title ---
    document.title = `${cfg.company.name} | ${cfg.company.tagline}`;

    // --- Logo ---
    const logoEl = document.getElementById('logo');
    if (logoEl) {
        logoEl.src = cfg.logo.src;
        logoEl.alt = cfg.logo.alt;
    }

    // --- Header: Person Details (shown when scrolled) ---
    const personNameEl = document.getElementById('person-name');
    const personTitleEl = document.getElementById('person-title');
    if (personNameEl) personNameEl.textContent = cfg.person.fullName;
    if (personTitleEl) personTitleEl.textContent = cfg.person.title;

    // --- First Page: Company Name & Tagline (shown on logo page) ---
    const companyNameEl = document.getElementById('company-name');
    if (companyNameEl) companyNameEl.textContent = cfg.company.name;

    const companyTaglineEl = document.getElementById('company-tagline');
    if (companyTaglineEl) companyTaglineEl.textContent = cfg.company.tagline;


    // --- About Section ---
    const aboutHeadingEl = document.getElementById('about-heading');
    const aboutTextEl = document.getElementById('about-text');
    if (aboutHeadingEl) aboutHeadingEl.textContent = cfg.company.aboutHeading;
    if (aboutTextEl) aboutTextEl.textContent = cfg.company.aboutText;

    // --- Action Buttons ---
    const btnCall = document.getElementById('btn-call');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const btnEmail = document.getElementById('btn-email');
    const btnLocation = document.getElementById('btn-location');
    const btnReview = document.getElementById('btn-review');

    if (btnCall) btnCall.href = `tel:${cfg.contact.phones[0].number}`;
    if (btnWhatsapp) btnWhatsapp.href = `https://wa.me/${cfg.contact.whatsapp}`;
    if (btnEmail) btnEmail.href = `mailto:${cfg.contact.email}`;
    if (btnLocation) btnLocation.href = cfg.contact.locationUrl;
    if (btnReview) btnReview.href = cfg.contact.reviewUrl;

    // --- Social Media Icons (dynamically generated) ---
    const socialBar = document.getElementById('social-bar');
    if (socialBar) {
        cfg.socials.forEach(social => {
            const a = document.createElement('a');
            a.href = social.url;
            a.target = '_blank';
            a.className = 'social-icon';
            a.setAttribute('aria-label', social.platform);

            const i = document.createElement('i');
            i.className = social.icon;
            a.appendChild(i);

            socialBar.appendChild(a);
        });
    }

    // ============================================================
    // SCROLL ANIMATIONS
    // ============================================================
    const header = document.getElementById('header');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const contactsSection = document.getElementById('contacts-section');

    // Threshold in pixels to trigger the animation
    const headerThreshold = 10;

    // Listen for scroll events on the window
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        // Step 1: Header Shrink & Initial Text Fade
        if (scrollPosition > headerThreshold) {
            header.classList.add('scrolled');
            if (companyNameEl) companyNameEl.classList.add('hidden');
            if (companyTaglineEl) companyTaglineEl.classList.add('hidden');
            if (scrollIndicator) scrollIndicator.classList.add('hidden');
        } else {
            header.classList.remove('scrolled');
            if (companyNameEl) companyNameEl.classList.remove('hidden');
            if (companyTaglineEl) companyTaglineEl.classList.remove('hidden');
            if (scrollIndicator) scrollIndicator.classList.remove('hidden');
        }

        // Step 2: Contacts Fade In
        if (scrollPosition > headerThreshold) {
            if (contactsSection) contactsSection.classList.add('visible');
        } else {
            if (contactsSection) contactsSection.classList.remove('visible');
        }
    });

    // ============================================================
    // vCARD DOWNLOAD (built from config)
    // ============================================================
    // Pre-cache contact photo from image/logo.jpg as fallback if needed
    let cachedContactPhoto = null;
    const contactPhotoImg = new Image();
    contactPhotoImg.crossOrigin = 'anonymous';
    contactPhotoImg.src = (cfg.vcard && cfg.vcard.photoSrc) || 'image/logo.jpg';
    contactPhotoImg.onload = () => {
        try {
            const canvas = document.createElement('canvas');
            const size = 512;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(contactPhotoImg, 0, 0, size, size);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                const commaIdx = dataUrl.indexOf(',');
                if (commaIdx !== -1) {
                    cachedContactPhoto = {
                        data: dataUrl.substring(commaIdx + 1),
                        type: 'JPEG'
                    };
                }
            }
        } catch (e) {
            // Silently ignore if canvas is tainted in local file:// mode
        }
    };

    function getContactPhoto() {
        // 1. If configured in config.js and valid, use it
        if (cfg.vcard && cfg.vcard.photoBase64 && cfg.vcard.photoBase64.trim().length > 100) {
            const format = (cfg.vcard.photoFormat || 'JPEG').toUpperCase();
            return {
                data: cfg.vcard.photoBase64.trim(),
                type: format
            };
        }

        // 2. Pre-cached photo from image/logo.jpg
        if (cachedContactPhoto) {
            return cachedContactPhoto;
        }

        return null;
    }

    const saveContactBtn = document.getElementById('btn-save-contact');
    if (saveContactBtn) {
        saveContactBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const vcardLines = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                // Company name as the primary display name for the contact
                `FN:${cfg.company.name}`,
                `N:${cfg.company.name};;;;`,
                `ORG:${cfg.company.name}`,
                `TITLE:${cfg.person.fullName} - ${cfg.person.title}`,
            ];

            if (cfg.vcard && cfg.vcard.contactNote) {
                vcardLines.push(`NOTE:${cfg.vcard.contactNote}`);
            }

            const photo = getContactPhoto();
            if (photo && photo.data) {
                vcardLines.push(`PHOTO;ENCODING=b;TYPE=${photo.type}:${photo.data}`);
            }

            // Build phone number lines dynamically (supports multiple numbers)
            if (cfg.contact && cfg.contact.phones && cfg.contact.phones.length > 0) {
                cfg.contact.phones.forEach(p => {
                    if (p.number) {
                        vcardLines.push(`TEL;TYPE=${(p.label || 'WORK').toUpperCase()},VOICE:${p.number}`);
                    }
                });
            }

            if (cfg.contact && cfg.contact.email && cfg.contact.email.trim()) {
                vcardLines.push(`EMAIL;TYPE=PREF,INTERNET:${cfg.contact.email.trim()}`);
            }

            if (cfg.contact && cfg.contact.locationUrl) {
                vcardLines.push(`URL;type=Location:${cfg.contact.locationUrl}`);
            }

            if (cfg.contact && cfg.contact.whatsapp) {
                vcardLines.push(`URL;type=WhatsApp:https://wa.me/${cfg.contact.whatsapp}`);
            }

            // Build social URL lines dynamically
            if (cfg.socials && cfg.socials.length > 0) {
                cfg.socials.forEach(s => {
                    if (s.url) {
                        vcardLines.push(`URL;type=${s.platform}:${s.url}`);
                        vcardLines.push(`X-SOCIALPROFILE;type=${s.platform.toLowerCase()}:${s.url}`);
                    }
                });
            }

            if (cfg.vcard) {
                const street = cfg.vcard.addressStreet || '';
                const city = cfg.vcard.addressCity || '';
                const state = cfg.vcard.addressState || '';
                const country = cfg.vcard.addressCountry || '';
                if (street || city || state || country) {
                    vcardLines.push(`ADR;TYPE=WORK:;;${street};${city};${state};;${country}`);
                }
            }

            vcardLines.push('END:VCARD');
            vcardLines.push('');

            const vcardContent = vcardLines.join('\r\n');
            const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${cfg.company.name.replace(/\s+/g, '_')}.vcf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        });
    }
});