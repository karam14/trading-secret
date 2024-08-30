"use server";
import { cookies } from "next/headers";

export const fetchTokenCookie = async (cookieName: string) => {
    const cookie = cookies().get(cookieName);

    if (cookie && isValidCookie(cookie)) {
        return cookie.value;
    }
    return null;
}

const isValidCookie = (cookie: { value: string; expires?: Date }): boolean => {
    if (!cookie.value) return false;

    // Check if the cookie has expired
    if (cookie.expires && new Date(cookie.expires) < new Date()) {
        return false;
    }

    return true;
}
