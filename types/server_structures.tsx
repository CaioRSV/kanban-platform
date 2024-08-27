interface User{
    id: number
}

interface UserColumns{
    userId: number
    columns: [
        [{}, {}, {}], //To-Do
        [{}, {}], // In-Progress
        [{}] // Done
    ]
}

interface Task {
    id: number
    name?: string
    description?: string
    color?: string
    startDate?: Date
    endDate?: Date
    done: boolean
};

// Fetch: Info exists (User)
// Fetch: User Columns

// Create: New Task
// - Fetch highest Task ID

// Remove Task (Only from list, keeps alive on database for simplicity)

// Update: User Columns (states of all of them every time for simplicity)