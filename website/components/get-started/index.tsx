import React, { useState } from "react";
import { Command } from "../command";

interface StepLabelProps {
    step: number;
    label: string;
    color: "blue" | "green" | "red";
}

const StepLabel: React.FC<StepLabelProps> = ({ step, label, color }) => {
    let bgColor = "";
    switch (color) {
        case "blue":
            bgColor = "bg-blue-600";
            break;
        case "green":
            bgColor = "bg-green-600";
            break;
        case "red":
            bgColor = "bg-red-600";
            break;
    }

    return(
        <div className="flex justify-start items-start">
            <div className={`rounded-full h-10 w-10 ${bgColor} flex justify-center items-center text-2xl mr-4 font-bold`}>
                { step }
            </div>
            <h3>{ label }</h3>
        </div>
    );
};

interface StepProps extends StepLabelProps {
    topPadding?: boolean;
    children: React.ReactNode;
}

const GettingStartedStep: React.FC<StepProps> = ({ step, label, color, topPadding, children }) => {
    const borderColor: Record<StepLabelProps["color"], string> = {
        "blue": "border-l-blue-900",
        "green": "border-l-green-900",
        "red": "border-l-red-900",
    };

    const flipArrow = (step % 2) === 0;
    let borderClass = `border-l-8 rounded-md ${borderColor[color]}`;
    if (flipArrow) {
        borderClass = `border-l-8 rounded-md ${borderColor[color]}`;
    }

    return(
        <div className={`flex py-4 px-3 pb-16 my-10 ${borderClass}`}>
            <div className={`w-1/4 border-r-2 border-r-gray-700 relative`}>
                <StepLabel step={step} label={label} color={color} />
                {/* <div className="getting-started-arrowhead">
                    <img src="/images/down-triangle.svg" />
                </div> */}
            </div>

            <div className={`w-3/4 px-12`}>
                {children}
            </div>
        </div>
    );
};

type GettingStaringClouds = "kubernetes" | "aws" | "azure" | "google";

const cloudCredentialLinks: Record<GettingStaringClouds, string> = {
    "kubernetes": "https://www.pulumi.com/registry/packages/kubernetes/",
    "aws": "https://www.pulumi.com/registry/packages/aws/",
    "azure": "https://www.pulumi.com/registry/packages/azure-native/",
    "google": "https://www.pulumi.com/registry/packages/gcp/",
};

const cloudConnectionCommands: Record<GettingStaringClouds, string> = {
    "kubernetes": `connecti connect kubernetes --routes="<your_route>"`,
    "aws": `connecti connect aws --subnet-ids="<your_subnet_id>"`,
    "azure": `connecti connect azure --subnet-name="<your_subnet_name>" --virtual-network-name="<your_virtual_network_name>" --route="<your_route>" --resource-group-name="<your_resource_group_name>"`,
    "google": `connecti connect google --subnet-ids="<your_subnet_id>"`,
};

export const GetStarted: React.FC = ({}) => {
    const [ cloud, setCloud ] = useState<GettingStaringClouds>("kubernetes");

    const handleCloudChoice = (c: GettingStaringClouds) => () => setCloud(c);

    const renderCloudCheckbox = (label: GettingStaringClouds) => {
        const imgClass = label === "aws" ? "w-24" : "w-10/12";
        const isSelected = cloud === label;
        const checkboxBackground = isSelected ? " bg-green-400 border-green-400" : " border-gray-900";

        return(
            <div className="w-1/4 flex justify-center items-center p-6">
                <div onClick={handleCloudChoice(label)} className="clickable-card">
                    <div className="flex justify-center items-center">
                        <div className="mr-3">
                            <div className={`text-4xl font-bold flex justify-center items-center h-10 w-10 rounded-full border${checkboxBackground}`}>
                                { isSelected ? "✔" : "" }
                            </div>
                        </div>
                        <img className={imgClass} src={`/images/clouds/${label}.svg`} />
                    </div>
                </div>
            </div>
        );
    };

    const renderCloudCheckboxes = () => {
        const clouds: GettingStaringClouds[] = [ "kubernetes", "aws", "azure", "google" ];

        return(
            <div className="flex justify-center items-stretch mb-16">
                {clouds.map(renderCloudCheckbox)}
            </div>
        );
    };

    return(
        <div id="get-started" className="container mx-auto my-16">
            <h2 className="text-center mb-3">Get Started</h2>
            <p className="text-center max-w-4xl mx-auto text-xl">
                To get started you will need to install connecti, install the Pulumi CLI,
                and set up your Tailscale and cloud provider configuration.
            </p>

            <h3 className="text-center my-8">Pick a Cloud</h3>
            <div className="mb-20">
                {renderCloudCheckboxes()}
            </div>

            <GettingStartedStep step={1} label="Install connecti" color="blue">
                <h4 className="font-bold">Homebrew</h4>
                <Command text="brew install jaxxstorm/tap/connecti" />

                <h4 className="font-bold">Scoop</h4>
                <Command text="scoop bucket add jaxxstorm https://github.com/jaxxstorm/scoop-bucket.git" />
                <Command text="scoop install connecti" />
            </GettingStartedStep>

            <GettingStartedStep step={2} label="Configure Pulumi" color="blue" topPadding={true}>
                <div>
                    <h4 className="font-bold">Install Pulumi CLI</h4>
                    <p className="my-6">
                        You can easily install the Pulumi CLI via the Install Script or Homebrew.
                        For information on other methods of installing Pulumi, see <a className="underline hover:font-bold" href="https://www.pulumi.com/docs/get-started/install/" target="_blank" rel="noopener noreferrer">Pulumi's Documentation</a>.
                    </p>

                    <h5>Install Script</h5>
                    <Command text="curl -fsSL https://get.pulumi.com | sh" />

                    <h5>Homebrew</h5>
                    <Command text="brew install pulumi/tap/pulumi" />

                </div>

                <div className="my-8">
                    <h4 className="font-bold">Configure State Management</h4>
                    <p className="my-6">


                        Pulumi needs to store metadata about your infrastructure so that it can manage your
                        resources. You have the option to manage state by yourself via your local
                        file system or cloud storage service, but we recommend using the Pulumi Service to
                        get the full value out of connecti.
                    </p>

                    <h5>Pulumi Service (Recommended)</h5>
                    <Command text="pulumi login" />

                    <h5>Open Source</h5>
                    <p className="my-6">
                        Please visit Pulumi's Documentation
                        to learn more about their <a href="https://www.pulumi.com/docs/intro/concepts/state/#using-a-self-managed-backend" className="underline hover:font-bold" target="_blank" rel="noopener noreferrer">Open Source Backend Options</a>.
                    </p>
                    </div>

                <div className="my-8">
                    <h4 className="mb-6 font-bold">Configure Cloud</h4>

                    <p className="my-6">
                        Please take a look at <a className="underline hover:font-bold" href={cloudCredentialLinks[cloud]} target="_blank" rel="noopener noreferrer">Pulumi's Documentation</a> for
                        information on how to configure your credentials.
                    </p>
                </div>
            </GettingStartedStep>

            <GettingStartedStep step={3} label="Setup Tailscale" color="blue" topPadding={true}>
                <h4 className="font-bold">Create Tailscale Account</h4>
                <div className="my-8">
                    <a className="rounded border px-6 py-3 hover:underline bg-gray-900" href="https://login.tailscale.com/start" target="_blank" rel="noopener noreferrer">Create Account</a>
                </div>

                <h4 className="font-bold">Download Tailscale</h4>
                <div className="my-8">
                    <a className="rounded border px-6 py-3 hover:underline bg-gray-900" href="https://tailscale.com/download/" target="_blank" rel="noopener noreferrer">Download Tailscale</a>
                </div>

                <h4 className="font-bold">Create Tailscale API Key</h4>
                <div className="my-8">
                    <a className="rounded border px-6 py-3 hover:underline bg-gray-900" href="https://login.tailscale.com/admin/settings/keys" target="_blank" rel="noopener noreferrer">Create API Key</a>
                </div>
            </GettingStartedStep>

            <GettingStartedStep step={4} label="Create Connection" color="green" topPadding={true}>
                <p>
                    You can create a connection by running the following command:
                </p>
                <Command text={cloudConnectionCommands[cloud]} />
            </GettingStartedStep>

            <GettingStartedStep step={5} label="Disconnect" color="red" topPadding={true}>
                <h4 className="font-bold">List Connections</h4>
                <p className="mt-4 mb-6 pl-2">You can view the names of open connections via the list command:</p>
                <Command text="connecti list" />

                <h4 className="mb-4 font-bold">Disconnect</h4>

                <Command text={`connecti disconnect ${cloud} --name <your-connection-name>`} />
            </GettingStartedStep>
        </div>
    );
};
