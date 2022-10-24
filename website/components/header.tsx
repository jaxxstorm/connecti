import React from "react";
import Image from "next/image";

export const Header: React.FC = ({}) => {
    return(
        <header className="w-full">
            <div className="flex p-6 bg-gray-900">
                <div className="w-1/3 lg:w-auto flex items-center justify-center pr-12">
                    <a href="/" className="flex justify-center items-center">
                        <div className="pr-2">
                            <Image src="/images/logo.png" alt="connecti Logo" width={48} height={48} />
                        </div>
                        <span className="font-bold text-3xl mb-2 text-gray-300">connecti</span>
                    </a>
                </div>
                <div className="hidden lg:flex justify-center items-center px-12">
                    <a href="/how-it-works/" className="text-xl hover:text-gray-400">How it works</a>
                </div>
                <div className="hidden lg:flex justify-center items-center px-12">
                    <a href="/guides/" className="text-xl hover:text-gray-400">Guides</a>
                </div>
                <div className="hidden lg:flex justify-center items-center px-12">
                    <a href="/docs/" className="text-xl hover:text-gray-400">Docs</a>
                </div>
                <div className="flex-grow flex justify-end items-center pr-16">
                    <a href="/#install" className="rounded bg-gray-700 px-6 py-3 text-white font-bold hover:bg-gray-600">Install</a>
                </div>
            </div>
        </header>
    );
};
