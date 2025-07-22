"use client"

import { checkAuth } from "@/utils/checkAuth";
import {useEffect} from "react"
import {useRouter} from "next/navigation";


export default function PanelPage() {
    const router = useRouter()
    
    useEffect(() => {
        async function verify() {
            const isAuth = await checkAuth();
            if (!isAuth) router.push("/admin");
        }

        verify();
    }, [router]);


    return (
        <div>СОСАААЛ</div>
    )
}