import {usersApiMethods} from "@/components/API/authApiMethods";


export const changeAltData = async (phoneNumber: string, type: "phone" | "email") => {
    try {
        const token = localStorage.getItem("accessToken");
        const result = await usersApiMethods.changeAltDataUser(phoneNumber, token, type);

        if (result === null) return null;

        return result;
    } catch (error) {
        console.error(error);
    }
};
