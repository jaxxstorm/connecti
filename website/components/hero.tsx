import React from "react";

interface HeroProps {
    name: string;
}

export const Hero: React.FC<HeroProps> = ({ name }) => {
    return(
        <div className="container mx-auto mt-6">
            <div className="w-full flex justify-center items-start hero">
                <div className="w-full text-center mb-8">
                    <h1 className="my-3">
                        { name }
                    </h1>
                </div>
            </div>
        </div>
    );
};
