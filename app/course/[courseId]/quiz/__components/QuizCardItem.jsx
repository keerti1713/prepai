import React, { useState } from "react";
import { Button } from "@/components/ui/button"; 

function QuizCardItem({ quiz, userSelectedOption }) {
    if (!quiz || !quiz.question || !quiz.options) {
        console.warn("No question or options available:", quiz);
        return <p className="text-gray-300">No question available</p>;
    }

    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div className="mt-10 p-5">
            <div className="flex flex-wrap justify-center gap-6 h-full w-full max-w-2xl mx-auto">
                {quiz.options.map((option, index) => (
                    <Button
                        key={index}
                        className={`flex justify-center items-center text-center 
                            min-w-[150px] w-[45%] h-[100px] p-3 text-[18px] 
                            bg-gray-200 hover:bg-gray-300
                            rounded-3xl shadow
                            transition-all cursor-pointer break-words whitespace-normal 
                            ${selectedOption === option ?  
                                "bg-[#645CBB] font-semibold hover:bg-[#645CBB]" : "hover:bg-gray-200"}`}
                        onClick={() => {
                            setSelectedOption(option);
                            userSelectedOption(option);
                        }}
                        variant="outline"
                    >
                        {option}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default QuizCardItem;
