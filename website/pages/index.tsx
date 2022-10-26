import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { BasePage } from "../components/base";

const Home: NextPage = () => {
    const [ videoLoaded, setVideoLoaded ] = useState(false);

    const appendVideo = () => {
        if (videoLoaded) {
            return;
        }

        const script = document.createElement("script");
        script.id = "asciicast-526613";
        script.src = "https://asciinema.org/a/526613.js";
        script.async = true;

        const element = document.getElementById("hero-video");
        element?.appendChild(script);
        setVideoLoaded(true);
    };

    useEffect(() => {
        appendVideo();
    }, []);

    return (
        <BasePage title="connecti" description="">
            <div className="container mx-auto mt-6">
                <div className="w-full flex justify-center items-start hero">
                    <div className="w-full text-center mb-8">
                        <h1 className="my-3">
                            connecti
                        </h1>
                        <p className="text-xl">
                            Quickly connect to any subnet.
                        </p>
                        <div className="mt-12">
                            <a href="#get-started" className="rounded bg-gray-700 px-6 py-3 text-white font-bold hover:bg-gray-600">Get Started</a>
                        </div>
                    </div>
                </div>

            </div>

            <div className="container mx-auto my-12">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-2/3 pl-12">
                        <div className="bg-gray-800 px-4 rounded w-full h-full flex justify-center items-center">
                            <div id="hero-video" className="w-full h-full"></div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 pl-6">
                        <h2 className="mb-6">Connect to any subnet</h2>
                        <p className="mb-3 text-lg">
                            If you're provisioning cloud infrastructure correctly, you'll provision sensitive services
                            in private subnets. This means they're often not routable from your machine or your CI/CD
                            infrastructure.
                        </p>
                        <p className="text-lg">
                            connecti uses Pulumi's Automation API to create Tailscale API keys, store them in your cloud provider's
                            secret store, and then creates a small compute node for which to advertise routes for you.
                        </p>
                    </div>
                </div>
            </div>

            <div id="get-started" className="container mx-auto my-16">
                <h2 className="text-center mb-3">Get Started</h2>
                <p className="text-center max-w-4xl mx-auto text-xl">
                    To get started you will need to install connecti, install the Pulumi CLI,
                    and set up your Tailscale and cloud provider configuration.
                </p>

                <div id="install">
                    <div className="flex justify-center items-center mt-10 mb-4">
                        <div className="rounded-full h-10 w-10 bg-blue-600 flex justify-center items-center text-2xl mr-4 font-bold">
                            1
                        </div>
                        <h3>Install connecti</h3>
                    </div>
                    <p className="my-6 text-center text-lg">
                        The first step in using connecti is installing it.
                    </p>

                    <div className="flex justify-center items-stretch">
                        <div className="w-full lg:w-1/2 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        A
                                    </div>
                                    <h4>MacOS</h4>
                                </div>

                                <p className="mt-4 mb-6 pl-2">You can install via the homebrew tap:</p>
                                <div className="rounded bg-gray-500 px-1 py-2 text-black my-3">
                                    <p>brew install jaxxstorm/tap/connecti</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        B
                                    </div>
                                    <h4>Windows</h4>
                                </div>

                                <p className="mt-2 mb-6 pl-2">If you're a scoop user, you can add the bucket and install from that bucket:</p>
                                <div className="rounded bg-gray-500 px-1 py-2 text-black my-3">
                                    <p>scoop bucket add jaxxstorm https://github.com/jaxxstorm/scoop-bucket.git</p>
                                </div>
                                <div className="rounded bg-gray-500 px-1 py-2 text-black my-3">
                                    <p>scoop install connecti</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="configure-pulumi">
                    <div className="flex justify-center items-center mt-10 mb-4">
                        <div className="rounded-full h-10 w-10 bg-blue-600 flex justify-center items-center text-2xl mr-4 font-bold">
                            2
                        </div>
                        <h3>Configure Pulumi</h3>
                    </div>
                    <p className="my-6 text-center text-lg max-w-2xl mx-auto">
                        connecti uses Pulumi's Automation API. You'll need to ensure you
                        have the Pulumi CLI installed and be logged into a state backend.
                    </p>

                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-1/3 p-3">
                            <h4 className="pl-6 font-bold">1. Install Pulumi CLI</h4>
                            <div>
                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                A
                                            </div>
                                            <h4>Install Script</h4>
                                        </div>

                                        <div className="rounded bg-gray-500 px-1 py-2 text-black my-6">
                                            <p>curl -fsSL https://get.pulumi.com | sh</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                B
                                            </div>
                                            <h4>Homebrew</h4>
                                        </div>

                                        <div className="rounded bg-gray-500 px-1 py-2 text-black my-6">
                                            <p>brew install pulumi/tap/pulumi</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                C
                                            </div>
                                            <h4>Windows</h4>
                                        </div>

                                        <p className="my-6">
                                            For information on how to install Pulumi on Windows, see <a className="underline hover:font-bold" href="https://www.pulumi.com/docs/get-started/install/" target="_blank" rel="noopener noreferrer">Pulumi's Documentation</a> for instructions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 p-3">
                            <h4 className="pl-6 font-bold">2. Configure State Management</h4>
                            <div>
                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                A
                                            </div>
                                            <h4>Pulumi Service (Recommended)</h4>
                                        </div>

                                        <div className="rounded bg-gray-500 px-1 py-2 text-black my-6">
                                            <p>pulumi login</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                B
                                            </div>
                                            <h4>Open Source</h4>
                                        </div>

                                        <p className="my-6">
                                            You also have the option to manage state by yourself via your local
                                            file system or cloud storage service. You can visit Pulumi's Documentation
                                            to learn more about their <a href="https://www.pulumi.com/docs/intro/concepts/state/#using-a-self-managed-backend" className="underline hover:font-bold" target="_blank" rel="noopener noreferrer">Open Source Backend Options</a>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 p-3">
                            <h4 className="text-center font-bold">3. Configure Cloud</h4>
                            <div>
                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                A
                                            </div>
                                            <h4>AWS</h4>
                                        </div>

                                        <p className="my-6">
                                            Please take a look at <a className="underline hover:font-bold" href="https://www.pulumi.com/registry/packages/aws/installation-configuration/#configuration" target="_blank" rel="noopener noreferrer">Pulumi's Documentation</a> for
                                            information on how to configure your AWS Credentials.
                                        </p>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                B
                                            </div>
                                            <h4>Azure</h4>
                                        </div>

                                        <p className="my-6">
                                            Coming soon.
                                        </p>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <div className="rounded bg-gray-800 p-3">
                                        <div className="flex justify-start items-center">
                                            <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                                C
                                            </div>
                                            <h4>Google Cloud</h4>
                                        </div>

                                        <p className="my-6">
                                            Coming soon.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="setup-tailscale">
                    <div className="flex justify-center items-center mt-10 mb-4">
                        <div className="rounded-full h-10 w-10 bg-blue-600 flex justify-center items-center text-2xl mr-4 font-bold">
                            3
                        </div>
                        <h3>Setup Tailscale</h3>
                    </div>
                    <p className="my-6 text-center text-lg max-w-2xl mx-auto">
                        connecti uses Tailscale to create tunneled connections. You
                        need to have Tailscale installed and have created a TailNet.
                    </p>

                    <div className="flex justify-center items-stretch">
                        <div className="w-full lg:w-1/3 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        1
                                    </div>
                                    <h4>Create Tailscale Account</h4>
                                </div>

                                <div className="text-center mt-8 mb-4">
                                    <a className="rounded border px-6 py-3 hover:underline bg-gray-900" href="https://login.tailscale.com/start" target="_blank" rel="noopener noreferrer">Create Account</a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                            <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        2
                                    </div>
                                    <h4>Download Tailscale</h4>
                                </div>

                                <div className="text-center mt-8 mb-4">
                                    <a className="rounded border px-6 py-3 hover:underline bg-gray-900" href="https://tailscale.com/download/" target="_blank" rel="noopener noreferrer">Download</a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        3
                                    </div>
                                    <h4>Create Tailscale API Key</h4>
                                </div>

                                <div className="text-center mt-8 mb-4">
                                    <a className="rounded border px-6 py-3 hover:underline bg-gray-900" href="https://login.tailscale.com/admin/settings/keys" target="_blank" rel="noopener noreferrer">Create API Key</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="connection">
                    <div className="flex justify-center items-center mt-10 mb-4">
                        <div className="rounded-full h-10 w-10 bg-green-600 flex justify-center items-center text-2xl mr-4 font-bold">
                            4
                        </div>
                        <h3>Create Connection</h3>
                    </div>
                    <p className="my-6 text-center text-lg max-w-2xl mx-auto">
                        Once you've set up your environment, you need to provision your bastion. You
                        can do this by specifying the subnets you want to connect to. connecti takes
                        a list of subnets, these subnets all need to be within the same VPC.
                    </p>

                    <div className="flex flex-wrap justify-center items-stretch">
                        <div className="w-full lg:w-1/2 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        A
                                    </div>
                                    <h4>AWS</h4>
                                </div>

                                <div className="rounded bg-gray-500 px-1 py-2 text-black my-6">
                                    <p>{`connecti connect aws --subnet-ids="<your_subnet_id>"`}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        B
                                    </div>
                                    <h4>Azure</h4>
                                </div>

                                <p className="my-6">
                                    Coming soon.
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        C
                                    </div>
                                    <h4>Google Cloud</h4>
                                </div>

                                <p className="my-6">
                                    Coming soon.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="disconnect">
                    <div className="flex justify-center items-center mt-10 mb-4">
                        <div className="rounded-full h-10 w-10 bg-red-600 flex justify-center items-center text-2xl mr-4 font-bold">
                            5
                        </div>
                        <h3>Disconnect</h3>
                    </div>
                    <p className="my-6 text-center text-lg">
                        Once you're done using your private connection, you can destroy the connection
                        by name.
                    </p>

                    <div className="flex justify-center items-stretch">
                        <div className="w-full lg:w-1/2 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        1
                                    </div>
                                    <h4>List Connections</h4>
                                </div>

                                <p className="mt-4 mb-6 pl-2">You can view the names of open connections via the list command:</p>
                                <div className="rounded bg-gray-500 px-1 py-2 text-black my-3">
                                    <p>connecti list</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 p-3">
                            <div className="h-full rounded bg-gray-800 p-3">
                                <div className="flex justify-start items-center">
                                    <div className="rounded-full h-8 w-8 bg-gray-400 flex justify-center items-center text-black text-lg mr-4">
                                        2
                                    </div>
                                    <h4>Disconnect</h4>
                                </div>

                                <p className="mt-4 mb-6 pl-2">Next select the connecti instance you'd like to destroy, and disconnect:</p>
                                <div className="rounded bg-gray-500 px-1 py-2 text-black my-3">
                                    <p>{`connecti disconnect aws --name <my-name>`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </BasePage>
    )
}

export default Home
