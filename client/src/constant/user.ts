import { UserProfile } from "@/types";


export const userRoles = {
    SUBSCRIBER: 'subscriber',
    CONTRIBUTOR: 'contributor',
    MODERATOR: 'moderator',
    SUPERADMIN: 'superadmin',
}

export const INITIAL_USER: UserProfile = {
    id: '',
    name: '',
    email: '',
    role: ''
};