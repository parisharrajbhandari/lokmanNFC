// ============================================================
// BUSINESS CARD CONFIGURATION
// Edit the details below to update your NFC business card.
// All changes here will automatically reflect on the page.
// ============================================================

const BUSINESS_CONFIG = {

    // --- Personal Details ---
    person: {
        firstName: "Bimish",
        middleName: "Man",
        lastName: "Shakya",
        fullName: "Mr. BimishMan Shakya",       // Displayed in header & vCard
        title: "Proprietor",              // Job title / designation
    },

    // --- Company Details ---
    company: {
        name: "Lokman and Sons",    // Displayed in header & page title
        tagline: "Gold made since 1961",               // Used in the page <title>
        aboutHeading: "New Chandraman And Sons",     // Heading for the about section
        aboutText: `Our shop has given serive since 1961 where sell all kinds of Gold, Silver and Diamond Jewellery. We take custom orders and designs. Be confident to buy from us.`,
    },

    // --- Contact Details ---
    contact: {
        phones: [
            { number: "+9779841819642", label: "Work" },
        ],
        whatsapp: "9779841819642",            // WhatsApp number (without +)
        email: "shakya418@hotmail.com",
        locationUrl: "https://maps.app.goo.gl/zFihrFUhgGqEjgA88",
        reviewUrl: "https://www.google.com/maps/place/New+Chandraman+and+sons/@27.6958468,84.4255943,17.75z/data=!4m6!3m5!1s0x3994fb9beee44863:0x80040679721f6db0!8m2!3d27.6973649!4d84.4256387!16s%2Fg%2F11zysl1gpm?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D",
    },

    // --- Social Media Links ---
    // Each entry: { platform, url, icon (FontAwesome class), label }
    // Add, remove, or reorder entries as needed.
    socials: [
        {
            platform: "Instagram",
            url: "https://www.instagram.com/chandramanandsons?stkn=Ynd6YndwOHJjMmZm",
            icon: "fab fa-instagram",
        },
        {
            platform: "TikTok",
            url: "https://www.tiktok.com/@newchandramanandsons?_r=1&_t=ZS-99wKiXirPmP",
            icon: "fab fa-tiktok",
        },
        {
            platform: "Facebook",
            url: "https://www.facebook.com/share/19XbVYLCjv/",
            icon: "fab fa-facebook-f",
        },
        {
            platform: "website",
            url: "https://newchandramanandsons.tappoo.workers.dev/",
        },
    ],

    // --- Logo ---
    logo: {
        src: "image/new_chandraman_logo.png",
        alt: "New Chandraman and Sons logo",
    },

    // --- vCard / Address Details ---
    vcard: {
        // This note will be saved with the contact on the device.
        // Customize it to include any info you want the recipient to see.
        contactNote: "New Chandraman and Sons - Gold, Silver & Diamond Jewellery since 1961. Contact: Bimish man Shakya (Manager)",
        addressStreet: "New Channdraman and Sons",
        addressCity: "Chitwan",
        addressState: "Bagmati",
        addressCountry: "Nepal",
        // Base64-encoded photo for the vCard (PNG).
        // Replace this string to change the contact photo.
        photoBase64: "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",
    },
};
