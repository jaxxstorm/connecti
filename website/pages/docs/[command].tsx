import ReactMarkdown from "react-markdown";
import type { NextPage, GetStaticProps, GetStaticPropsContext, GetStaticPaths } from "next";
import { BasePage } from "../../components/base";
import * as path from "path";
import * as fs from "fs";
import { DocsNavBar } from "../../components/docsNavBar";

interface DocsProps {
    docText: string
}

const Docs: NextPage<DocsProps> = ({ docText }) => {
    return(
        <BasePage>
            <div className="container mx-auto py-12 text-center">
                <h1>Documentation</h1>
            </div>

            <div className="container mx-auto flex">
                <div className="w-1/4 lg:w-1/5 bg-gray-800 rounded p-6">
                    <DocsNavBar />
                </div>

                <div className="cli-doc-markdown">
                    <ReactMarkdown>{ docText }</ReactMarkdown>
                </div>
            </div>
        </BasePage>
    );
};

export const getStaticPaths: GetStaticPaths = () => {
    const staticPaths = [
        "/docs/connect",
        "/docs/connect-aws",
        "/docs/disconnect",
        "/docs/disconnect-aws",
        "/docs/list",
        "/docs/version"
    ];

    return {
        paths: staticPaths,
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<DocsProps> = (ctx: GetStaticPropsContext) => {
    const command = ctx.params?.command as string;
    if (!command) {
        return { props: { docText: "Command not found" }};
    }

    const commandParts = command.split("-");
    const fileName = [ "connecti", ...commandParts ].join("_") + ".md";

    const docPath = path.join(process.cwd(), "..", "docs-output", fileName);
    const docsString = fs.readFileSync(docPath).toString();

    return {
        props: { docText: docsString },
    };
}

export default Docs;
