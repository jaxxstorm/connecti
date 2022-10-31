import React, { useState } from "react";

interface CommandProps {
    text: string;
    disableCopy?: boolean;
}

export const Command: React.FC<CommandProps> = ({ text }) => {
    const [ copyText, setCopyText ] = useState("Copy");

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopyText("Copied!");

        setTimeout(() => setCopyText("Copy"), 2000);
    };

    return(
        <div className="rounded bg-gray-500 px-1 py-2 text-black my-6 flex">
            <p>$ {text}</p>
            <a onClick={handleCopy} className="flex-grow text-right cursor-pointer hover:underline">{ copyText }</a>
        </div>
    );
};
