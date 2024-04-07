"use client";
import React, { useState, useEffect } from 'react';
import NavigationLink from "@/_components/nav/navigation_link";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "sonner";
import { getUserName, getUserId } from "@/_lib/actions";
import dayjs from "dayjs";
import Button from "@/_components/button";
import FeatherIcon from "feather-icons-react";
import NavigationBar from "@/_components/nav/navigation_bar";
import Modal from "@/_components/uploadModal/modal";

export default function AppLayout({children}: {children: any}) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const date = dayjs();

  useEffect(() => {
    const fetchUserName = async () => {
      const userName = await getUserName();
      const id = await getUserId();
      setName(userName);
      setId(id);
    };

    fetchUserName();
  }, []);

  return (
    <div className="flex min-h-screen flex-row bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-100">
      <NavigationBar />
      <div className="ml-48 w-full">
        <div className="mx-auto flex min-h-screen max-w-screen-xl flex-1 flex-col px-16">
          <Toaster />
          <header className="mb-16 flex h-36 flex-row items-center justify-between border-b dark:border-stone-800">
            <div className="flex flex-col">
              <h1 className="text-xl">{name}</h1>
              <p className="opacity-70">{date.format("MMMM D, YYYY")}</p>
            </div>
            <div className="flex flex-row gap-2">
              <Button icon="upload-cloud" label="Upload" onClick={() => setModalOpen(true)} />
              <Link href="/app/watchlist">
                <Button icon="bookmark" label="Watchlist" />
              </Link>
            </div>
          </header>
          <Modal isOpen={isModalOpen} close={() => setModalOpen(false)} userId={id} />
          <section>{children}</section>
          <footer className="mt-16 flex h-16 flex-row items-end justify-end gap-4 border-t py-4 text-xs opacity-40 dark:border-stone-800">
            <p>Copyright © Avova Health 2024</p>
            <Link href="/terms">Terms and Conditions</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
