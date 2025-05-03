"use client";
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { user } from "../../store/selectors/userSelector";

export default function Home({ params }) {
    const userData = useSelector(user);
    const router = useRouter();
    useEffect(() => {
      if(userData?.username !== params.username) router.push('/');
    },[])

    return <h1>Welcome to the Hello World Page!</h1>;
}