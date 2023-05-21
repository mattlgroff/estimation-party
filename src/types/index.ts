export interface Room {
    id: number;
    join_code: string;
    lead_name: string | null;
    current_estimation_id: number | null; // new field
    created_at: string;
}

export interface Estimation {
    id: number;
    ticket_name: string;
    ticket_href: string | null;
    room_id: number;
    created_at: string;
}

export interface User {
    id: number;
    name: string;
    room_id: number;
    created_at: string;
    updated_at: string;
}

export interface UserEstimation {
    user_id: number;
    estimation_id: number;
    estimate: string;
    inserted_at: string;
    updated_at: string;
}

export interface UserWithEstimation {
    user: User;
    userEstimation: UserEstimation | null; // null if the user hasn't estimated yet
}
