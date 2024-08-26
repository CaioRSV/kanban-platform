interface User{
    id: number;
    name: string; 
}

interface Task{
    id: 1;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    color: string;
    done: boolean;
}