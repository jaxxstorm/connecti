import React from "react";
import Head from "next/head";
import Script from "next/script";

interface HeadProps {
    title: string;
    description: string;
}

export const PageHead: React.FC<HeadProps> = ({ title, description }) => {
    return(
        <Head>
            <title>{title} | connecti</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            <meta name="description" content={description} />

            <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />

            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-H9C4Q0087D"
            />
            <Script
                dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-H9C4Q0087D', {
                page_path: window.location.pathname,
                });
            `,
                }}
            />
        </Head>
    );
};
