import React from "react";
import { PageHead } from "./head";
import { PageFooter } from "./footer";
import { Header } from "./header";

interface BasePageProps {
    children: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
    return(
        <>
            <PageHead />
            <Header />

            <main>
                { children }
            </main>

            <PageFooter />
        </>
    );
};
