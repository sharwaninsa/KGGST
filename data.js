// ===========================================
// APPLICATION DATA
// ===========================================

// Carousel data from the trust document
const carouselData = [
    {
        image: "https://t4.ftcdn.net/jpg/05/23/57/17/360_F_523571782_HTB5SQBkfpA5TiKwI0lpHe3sK0VmCaVZ.jpg",
        title: "Cow Protection & Care",
        description: "Dedicated to protecting cow wealth from sickness, starvation and slaughtering, providing proper feeding and medical facilities."
    },
    {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReaEYB0tjb8-oTp3lyDPg7ZGYvTzIn5gq8Nw&s",
        title: "Animal Welfare",
        description: "Rescue, relief and rehabilitation of all animals and birds with round-the-clock veterinary services."
    },
    {
        image: "https://images.maher.ac.in/wp-content/uploads/2025/11/Awareness-Session-on-Pediatric-Liver-Health-by-MCOP-2.jpeg?strip=all&lossy=1&ssl=1",
        title: "Education & Awareness",
        description: "Promoting education and awareness in the community on every aspect of animal welfare and environmental protection."
    },
    {
        image: "https://www.aljazeera.com/wp-content/uploads/2020/01/f7a36fa136804e5a9feb606cdc7e2f9f_18.jpeg?resize=1200%2C675",
        title: "Community Service",
        description: "Organizing health, educational and welfare programmes for needy women and children on a priority basis."
    }
];

// Team data extracted from the trust document
const teamData = [
    {
        id: 1,
        name: "Manju Goel",
        designation: "Managing Trustee / Founder",
        photo: "https://img.freepik.com/premium-vector/portrait-business-woman_505024-2799.jpg?semt=ais_hybrid&w=740&q=80",
        experience: "Over 15 years of social work experience",
        education: "Social Worker",
        message: "Our mission is to protect cow wealth and serve all animals with compassion and dedication.",
        bio: "Manju Goel is the settlor and founder of Krishna Gopal Gaushala Sewa Trust. She has dedicated her life to animal welfare and cow protection. As per the Trust Deed, she is the First Managing Trustee and will hold office for her lifetime."
    },
    {
        id: 2,
        name: "Amit Kumar Shukla",
        designation: "Trustee",
        photo: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
        experience: "8 years in community service and animal welfare",
        education: "Social Worker",
        message: "Together we can create a better world for animals and humans alike.",
        bio: "Amit Kumar Shukla is a dedicated social worker and trustee of the Krishna Gopal Gaushala Sewa Trust. He works tirelessly to promote animal welfare and community development initiatives."
    }
];

// Trust information extracted from the document
const trustInfo = {
    name: "Krishna Gopal Gaushala Sewa Trust",
    certificateNo: "IN-DL-C-18140510601X",
    establishedDate: "25th December 2025",
    registrationNo: "2025/4/IV/2811",
    registeredAddress: "H.No. 57, G/F Main Market Kotla, Mayur Vihar Phase-1, Delhi-110091",
    administrationAddress: "C/o Manju Goel, Plot No. A-100, KH No. 348, Flat No. FF-4, Rail Vihar Shiv Mandir, Loni, Ghaziabad, Uttar Pradesh-201102",
    areaOfOperation: "All over India",
    objectives: {
        gaushala: [
            "Protect cow wealth from sickness, starvation and slaughtering",
            "Perform service of cows by keeping them in the Gaushala",
            "Provide conducive environment for proper feeding and medical facilities",
            "Work for Breed Improvement through AI and promote A2 milk among farmers",
            "Cremate dead cows in a proper manner with due love & respect",
            "Make ayurvedic medicines with cow dung and cow urine"
        ],
        animalWelfare: [
            "Promote Education and Awareness on animal welfare",
            "Save animal lives, improving relationships between man, animal and environment",
            "Promote Animal Birth Control (ABC) Programme",
            "Provide round-the-clock veterinary services including mobile clinic",
            "Rescue, relief and Rehabilitation of all animals and birds",
            "Build a fully fledged well-equipped Hospital and Shelter home"
        ],
        education: [
            "Establish, run, support schools, colleges, libraries",
            "Grant aid to educational institutions",
            "Establish studentships and scholarships",
            "Promote Science, literature, music, drama and fine arts"
        ],
        community: [
            "Grant relief during natural calamities",
            "Develop Empowerment for youths, women, children & marginalized communities",
            "Create awareness about sustainable environment protection",
            "Organize Health, Educational and Welfare programmes for needy Women and Children"
        ]
    },
    trusteesInfo: "The Trust is managed by a Board of Trustees consisting of not less than 2 trustees and not more than 9 trustees. The first Managing Trustee is Manju Goel, who will hold office for her lifetime."
};