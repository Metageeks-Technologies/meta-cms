import { UserProfile } from "@/types";


const userProfile: UserProfile = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNo: "+1234567890",
    bio: "Developer, tech enthusiast",
    role: "moderator",
    socialLinks: {
        linkedIn: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe"
    }
};


export const initialUsers: UserProfile[] = [
    {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phoneNo: "+1234567890",
        bio: "Front-end developer passionate about UX/UI design.",
        role: 'moderator',
        socialLinks: {
            linkedIn: "https://linkedin.com/in/alicejohnson",
            instagram: "https://instagram.com/alicejohnson"
        }
    },
    {
        id: "2",
        name: "Bob Smith",
        email: "bob.smith@example.com",
        phoneNo: "+9876543210",
        bio: "Full-stack developer with a love for clean code.",
        role: 'moderator',
        socialLinks: {
            linkedIn: "https://linkedin.com/in/bobsmith",
            twitter: "https://twitter.com/bobsmith"
        }
    },
    {
        id: "3",
        name: "Charlie Lee",
        email: "charlie.lee@example.com",
        role: 'moderator',
        socialLinks: {
            facebook: "https://facebook.com/charlielee"
        }
    },
    {
        id: "4",
        name: "Dana Lee",
        email: "dana.lee@example.com",
        phoneNo: "+1112233445",
        bio: "Creative designer, always looking for new challenges.",
        role: 'moderator'
    },
    {
        id: "5",
        name: "Eve Martin",
        email: "eve.martin@example.com",
        phoneNo: "+1222333445",
        bio: "Tech enthusiast with a knack for problem-solving.",
        role: 'moderator',
        socialLinks: {
            twitter: "https://twitter.com/evemartin"
        }
    }

];

export const initialContributors = [
    { id: 1, name: 'Eve Smith', email: 'evesmith@example.com', role: 'contributor' },
    { id: 2, name: 'John Doe', email: 'johndoe@example.com', role: 'contributor' },
    { id: 3, name: 'Sarah Lee', email: 'sarahlee@example.com', role: 'contributor' },
    { id: 4, name: 'Michael Turner', email: 'michaelturner@example.com', role: 'user' },
    { id: 5, name: 'Jessica Wilson', email: 'jessicawilson@example.com', role: 'user' },
    { id: 6, name: 'David Brown', email: 'davidbrown@example.com', role: 'contributor' },
    { id: 7, name: 'Olivia Green', email: 'oliviagreen@example.com', role: 'user' },
    { id: 8, name: 'Daniel Harris', email: 'danielharris@example.com', role: 'user' },
    { id: 9, name: 'Emily Adams', email: 'emilyadams@example.com', role: 'contributor' },
    { id: 10, name: 'Luke Evans', email: 'lukeevans@example.com', role: 'user' },
];

export const initialAdmins = [
    { id: 2, name: 'Alice Johnson', email: 'alicejohnson@example.com', role: 'moderator' },
    { id: 3, name: 'Bob Brown', email: 'bobbrown@example.com', role: 'moderator' },
    { id: 4, name: 'Charlie Williams', email: 'charliewilliams@example.com', role: 'moderator' },
    { id: 5, name: 'David Lee', email: 'davidlee@example.com', role: 'moderator' },
    { id: 6, name: 'Emma Davis', email: 'emmadavis@example.com', role: 'user' },
    { id: 7, name: 'Frank Harris', email: 'frankharris@example.com', role: 'user' },
    { id: 8, name: 'Grace Clark', email: 'graceclark@example.com', role: 'user' },
    { id: 9, name: 'Hannah Lewis', email: 'hannahlewis@example.com', role: 'user' },
    { id: 10, name: 'Ian Young', email: 'ianyoung@example.com', role: 'user' },
    { id: 11, name: 'Jack Martin', email: 'jackmartin@example.com', role: 'user' },
];

export const userRoles = {
    SUBSCRIBER: 'subscriber',
    CONTRIBUTOR: 'contributor',
    MODERATOR: 'moderator',
    SUPERADMIN: 'superadmin',
}