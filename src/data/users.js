const USERS_STORAGE_KEY = 'simtik_users_db'

export const MOCK_USERS = [
    {
        email: "admin@inspektorat.example.com",
        name: "Admin Inspektorat",
        role: "admin",
        password: "inspektorat"
    },
    {
        email: "staff@inspektorat.example.com",
        name: "Staff Inspektorat",
        role: "staff",
        password: "inspektorat"
    },
    {
        email: "pimpinan@inspektorat.example.com",
        name: "Pimpinan",
        role: "leader",
        password: "inspektorat"
    },
    {
        email: "fryzamashuri@gmail.com",
        name: "Fryza Mashuri",
        role: "admin",
        password: "inspektorat"
    },
    {
        email: "inspektorat.trenggalek@gmail.com",
        name: "Inspektorat Trenggalek",
        role: "admin",
        password: "inspektorat"
    }
]

// Initialize users in localStorage if not exists
const initializeUsers = () => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    if (!stored) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS))
        return MOCK_USERS
    }
    return JSON.parse(stored)
}

export const getUserByEmail = (email) => {
    const users = initializeUsers()
    return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export const updateUserPassword = (email, newPassword) => {
    const users = initializeUsers()
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex !== -1) {
        users[userIndex].password = newPassword
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
        return true
    }
    return false
}
