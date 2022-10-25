import React from "react";
import Link from "next/link";

export const DocsNavBar: React.FC = () => {
    return(
        <>
            <h3 className="mb-3">
                <Link href="/docs/">
                    <a className="hover:underline">CLI</a>
                </Link>
            </h3>
            <ul className="list-none">
                <li className="my-2">
                    <h4>
                        <Link href="/docs/connect/" className="hover:font-bold">
                            <a className="hover:underline">connect</a>
                        </Link>
                    </h4>
                    <ul className="list-none pl-6">
                        <li>
                            <h5>
                                <Link href="/docs/connect-aws/">
                                    <a className="hover:underline">aws</a>
                                </Link>
                            </h5>
                        </li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4>
                        <Link href="/docs/disconnect/">
                            <a className="hover:underline">disconnect</a>
                        </Link>
                    </h4>

                    <ul className="list-none pl-6">
                        <li>
                            <h5>
                                <Link href="/docs/disconnect-aws/">
                                    <a className="hover:underline">aws</a>
                                </Link>
                            </h5>
                        </li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4>
                        <Link href="/docs/list/">
                            <a className="hover:underline">list</a>
                        </Link>
                    </h4>
                </li>
                <li className="my-2">
                    <h4>
                        <Link href="/docs/version/">
                            <a className="hover:underline">version</a>
                        </Link>
                    </h4>
                </li>
            </ul>
        </>
    );
};
