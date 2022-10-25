import React from "react";
import { PageHead } from "./head";
import { PageFooter } from "./footer";
import { Header } from "./header";

interface BasePageProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ title, description, children }) => {
    return(
        <>
            <PageHead title={title} description={description} />
            <Header />

            <main>
                { children }
            </main>

            <PageFooter />
        </>
    );
};
