import type { User } from "@/types";

export function dummyUser(param: Partial<User>): User {
    return {
        id: 1,
        email: "fake@gmail.com",
        full_name: "fake",
        ...param
    };
}