import ReactMarkdown from "react-markdown";
import type { NextPage, GetStaticProps, GetStaticPropsContext, GetStaticPaths } from "next";
import { BasePage } from "../../components/base";
import * as path from "path";
import { DocsNavBar } from "../../components/docsNavBar";
import { content } from "../../utils";

interface DocsProps {

}

const Docs: NextPage<content.PageContent<DocsProps>> = ({ data, markdown }) => {
    return(
        <BasePage title={data.title} description={data.description}>
            <div className="container mx-auto py-12 text-center">
                <h1>Documentation</h1>
            </div>

            <div className="container mx-auto flex">
                <div className="w-1/4 lg:w-1/5 bg-gray-800 rounded p-6">
                    <DocsNavBar />
                </div>

                <div className="cli-doc-markdown">
                    <ReactMarkdown>{ markdown }</ReactMarkdown>
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

export const getStaticProps: GetStaticProps<content.PageContent<DocsProps>> = (ctx: GetStaticPropsContext) => {
    const command = ctx.params?.command as string;
    if (!command) {
        throw Error(`command not provided`);
    }

    const commandParts = command.split("-");
    const fileName = [ "connecti", ...commandParts ].join("_") + ".md";

    const docPath = path.join(process.cwd(), "content", "docs", fileName);
    const pageData = content.readContentFile(docPath);

    return {
        props: {
            data: pageData.data,
            markdown: pageData.markdown,
        },
    };
}

export default Docs;
