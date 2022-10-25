import React from "react";
import Image from "next/image";

export const PageFooter: React.FC = ({}) => {
    return(
        <footer className="flex items-center justify-center">
            <a
                href="https://pulumi.com?utm_source=connecti&utm_medium=footer&utm_campaign=connecti"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
            >
                <span className="pr-2 pb-2 text-lg">Powered by</span>
                <span>
                    <Image src="/images/pulumi-logo.svg" alt="Pulumi Logo" width={100} height={25} />
                </span>
            </a>
        </footer>
    );
};
