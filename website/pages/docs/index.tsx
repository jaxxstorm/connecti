import ReactMarkdown from "react-markdown";
import type { NextPage, GetStaticProps } from "next";
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

export const getStaticProps: GetStaticProps<DocsProps> = () => {
    const docPath = path.join(process.cwd(), "..", "docs-output", "connecti.md");
    const docsString = fs.readFileSync(docPath).toString();

    return {
        props: { docText: docsString },
    };
}

export default Docs;
