import ReactMarkdown from "react-markdown";
import type { NextPage, GetStaticProps } from "next";
import { BasePage } from "../../components/base";
import * as path from "path";
import { DocsNavBar } from "../../components/docsNavBar";
import { Hero } from "../../components/hero";
import { content } from "../../utils";

interface DocsProps {

}

const Docs: NextPage<content.PageContent<DocsProps>> = ({ data, markdown }) => {
    return(
        <BasePage title={data.title} description={data.description} >
            <Hero name="Documentation" />

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

export const getStaticProps: GetStaticProps<content.PageContent<DocsProps>> = () => {
    const docPath = path.join(process.cwd(), "content", "docs", "connecti.md");
    const page = content.readContentFile(docPath);

    return {
        props: {
            data: page.data,
            markdown: page.markdown,
        },
    };
}

export default Docs;
