// This file combines mockMentors and mockCollegeMentors into a structure
// that the seeder script can use to create both Users and Mentor profiles.
const mentorsData = [
    {
        id: 1,
        name: "Ananya Sharma",
        college: "IIT Delhi",
        field: "Computer Science",
        rating: 4.9,
        reviews: [
             {
                name: "Akash Singh",
                status: "Alumnus, Class of 2021",
                branch: "Mechanical Engineering",
                qualifications: "Currently a Design Engineer at Tesla.",
                achievements: "Led the college's Formula Student team to a national victory.",
                reviewType: 'positive',
                reviewTitle: "Incredible Opportunities & Peer Group",
                reviewText: "IIT Delhi is a world of its own. The exposure you get is unparalleled. The curriculum is rigorous, but the hands-on projects and competitions are where you truly learn. The alumni network is incredibly strong and has helped me immensely in my career.",
                image: "https://i.pravatar.cc/150?u=akash"
            },
            {
                name: "Priya Sharma",
                status: "4th Year Student",
                branch: "Textile Technology",
                qualifications: "Interned with a leading fashion export house.",
                achievements: "Organized the department's annual tech fest.",
                reviewType: 'negative',
                reviewTitle: "Can Feel Overwhelming & Impersonal",
                reviewText: "The 'IIT' tag comes with immense pressure. It's a highly competitive environment which can be draining. Some of the core engineering branches have theoretical teaching methods that could use an update. It's easy to feel lost in the crowd if you're not proactive.",
                image: "https://i.pravatar.cc/150?u=priyas"
            }
        ],
        image: "https://i.pravatar.cc/150?u=ananya",
        availability: { days: ["Monday", "Wednesday", "Friday"], time: "5 PM - 8 PM IST" }
    },
    {
        id: 2,
        name: "Rohan Verma",
        college: "AIIMS Delhi",
        field: "Medicine",
        rating: 4.8,
        reviews: [
            {
                name: "Dr. Sameer Joshi",
                status: "Alumnus, Class of 2018",
                branch: "MBBS",
                qualifications: "MD in Cardiology, practicing at a top hospital.",
                achievements: "Co-authored a paper on preventive cardiology during residency.",
                reviewType: 'positive',
                reviewTitle: "The Best Medical Training in India",
                reviewText: "AIIMS provides the best clinical exposure, period. You see a variety of cases you wouldn't see anywhere else. The faculty are legends in their fields. The training is intense but it prepares you for anything. Proud to be an AIIMS graduate.",
                image: "https://i.pravatar.cc/150?u=sameer"
            },
            {
                name: "Anjali Menon",
                status: "4th Year Student",
                branch: "MBBS",
                qualifications: "Research assistant in the neurology department.",
                achievements: "Volunteers for health camps in rural areas.",
                reviewType: 'negative',
                reviewTitle: "Extremely Stressful with No Work-Life Balance",
                reviewText: "The life of a student here is incredibly tough. The workload is immense, and there's virtually no time for personal hobbies or relaxation. The infrastructure, especially hostels, is old and needs significant upgrades. The administration can be slow to respond to student needs.",
                image: "https://i.pravatar.cc/150?u=anjali"
            }
        ],
        image: "https://i.pravatar.cc/150?u=rohan",
        availability: { days: ["Saturday", "Sunday"], time: "10 AM - 1 PM IST" }
    },
    // Add other mentors similarly...
];

module.exports = mentorsData;
