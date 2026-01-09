'use client'

import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from '@clerk/themes';
import React, { useState, useEffect } from "react";

const TopBar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
      document.documentElement.classList.toggle("dark", savedTheme === "true");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", String(!prev));
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  return (
    <>
      <nav className="topbar flex justify-between items-center p-4 bg-white dark:bg-gray-900">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/assets/logo.png" alt="logo" width={75} height={75} />
        </Link>

        <div className="flex items-center gap-3">
          <SignedIn>
            <OrganizationSwitcher
              appearance={{
                baseTheme: dark,
                elements: {
                  organizationSwitcherTrigger: "py-2 px-4",
                },
              }}
            />
            <UserButton />
          </SignedIn>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="ml-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default TopBar;
