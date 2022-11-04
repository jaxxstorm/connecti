import React from "react";
import Link from "next/link";

interface DocsNavProps {

}

export const DocsNavBar: React.FC<DocsNavProps> = ({}) => {
    return(
        <>
            <h3 className="mb-3">
                <Link href="/docs/">
                    <p className="hover:underline">CLI</p>
                </Link>
            </h3>
            <ul className="list-none">
                <li className="my-2">
                    <h4>
                        <Link href="/docs/connect/" className="hover:font-bold">
                            <p className="hover:underline">connect</p>
                        </Link>
                    </h4>
                    <ul className="list-none pl-6">
                        <li>
                            <h5>
                                <Link href="/docs/connect-aws/">
                                    <p className="hover:underline">aws</p>
                                </Link>
                            </h5>
                        </li>

                        <li>
                            <h5>
                                <Link href="/docs/connect-azure/">
                                    <p className="hover:underline">azure</p>
                                </Link>
                            </h5>
                        </li>

                        <li>
                            <h5>
                                <Link href="/docs/connect-kubernetes/">
                                    <p className="hover:underline">kubernetes</p>
                                </Link>
                            </h5>
                        </li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4>
                        <Link href="/docs/disconnect/">
                            <p className="hover:underline">disconnect</p>
                        </Link>
                    </h4>

                    <ul className="list-none pl-6">
                        <li>
                            <h5>
                                <Link href="/docs/disconnect-aws/">
                                    <p className="hover:underline">aws</p>
                                </Link>
                            </h5>
                        </li>

                        <li>
                            <h5>
                                <Link href="/docs/disconnect-azure/">
                                    <p className="hover:underline">azure</p>
                                </Link>
                            </h5>
                        </li>

                        <li>
                            <h5>
                                <Link href="/docs/disconnect-kubernetes/">
                                    <p className="hover:underline">kubernetes</p>
                                </Link>
                            </h5>
                        </li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4>
                        <Link href="/docs/list/">
                            <p className="hover:underline">list</p>
                        </Link>
                    </h4>
                </li>
                <li className="my-2">
                    <h4>
                        <Link href="/docs/version/">
                            <p className="hover:underline">version</p>
                        </Link>
                    </h4>
                </li>
            </ul>
        </>
    );
};
