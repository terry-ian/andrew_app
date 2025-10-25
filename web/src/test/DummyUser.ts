import type { User } from "@/types";

export function dummyUser(param: Partial<User>): User {
    return {
        id: 1,
        email: "fake@gmail.com",
        full_name: "fake",
        created_at: "2024-01-01T00:00:00Z",
        email_verified: true,
        ...param
    };
}