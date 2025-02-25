'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import QuizCardItem from './__components/QuizCardItem';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

function Quiz() {
    const { courseId } = useParams();
    const router = useRouter();
    const [quizData, setQuizData] = useState();
    const [quiz, setQuiz] = useState([]);
    const [stepCount, setStepCount] = useState(0);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
    const [correctAns, setCorrectAns] = useState();
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!courseId) return;
        
        const checkQuizStatus = async () => {
            try {
                for (let i = 0; i < 10; i++) {  
                    await new Promise(res => setTimeout(res, 5000)); 
                    const checkStatus = await axios.get(`/api/generate-study-content?courseId=${courseId}&type=quiz`);
                    
                    if (checkStatus.data?.ready) {
                        GetQuiz();
                        return;
                    }
                }

                console.error("Quiz not generated in time");
            } catch (error) {
                console.error("Error checking quiz status:", error.message);
            } finally {
                setLoading(false);
            }
        };

        checkQuizStatus();
    }, [courseId]);   

    const GetQuiz = async () => {
        try {
            if (!courseId) {
                console.error("Error: courseId is undefined");
                return;
            }
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'quiz'
            });

            if (!result.data?.content?.length) {
                console.error("No quiz content found");
                setLoading(false);
                return;
            }

            setQuizData(result.data);
            const quizContent = result.data?.content?.[0]?.content;

            if (quizContent?.candidates?.[0]?.content?.parts?.[0]?.text) {
                let quizText = quizContent.candidates[0].content.parts[0].text;
                quizText = quizText.replace(/```json|```/g, "").trim();
                
                try {
                    JSON.parse(quizText); 
                } catch (error) {
                    console.error("Invalid JSON detected in quizText:", quizText);
                    return; 
                }
                
                try {
                    const parsedQuiz = JSON.parse(quizText);
                    setQuiz(parsedQuiz.quiz.questions || []);
                    setQuizData(parsedQuiz.quiz);
                } catch (parseError) {
                    console.error("Error parsing quiz JSON:", parseError);
                }
            } else {
                console.error("Quiz content is missing or malformed:", quizContent);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            setLoading(false);
        }
    };

    const checkAnswer = (userAnswer, currentQuestion) => {
        if (userAnswer === currentQuestion?.answer) {
            setIsCorrectAnswer(true);
            setCorrectAns(currentQuestion?.answer);
        } else {
            setIsCorrectAnswer(false);
            setCorrectAns(currentQuestion?.answer);
        }
    };
    useEffect(() => {
        setCorrectAns(null);
        setIsCorrectAnswer(null);
    }, [stepCount]);

    return (
        <div className="text-center font-bold text-2xl mb-4">
            <h2>Quiz</h2>

            {quizCompleted ? (
                <div className="flex items-center gap-4 flex-col justify-center">
                    <h2 className="mt-14 text-3xl font-bold text-green-800">Completed!</h2>
                    <Button onClick={()=>router.back()}>Back to Course Overview</Button>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <button
                        className="px-3 py-1 m-2 h-auto w-auto bg-gray-100 text-black rounded-md shadow-md hover:bg-gray-200 disabled:opacity-50 text-[20px]"
                        onClick={() => setStepCount(prev => Math.max(prev - 1, 0))}
                        disabled={stepCount === 0}
                        >
                            <Image src={'/arrow-left.svg'} alt='left' width={30} height={30} />
                        </button>
                        
                        <div className="w-full max-w-3xl mx-auto text-xl m-4 bg-[#EBEAFF] p-4 rounded-lg shadow-lg text-center">
                            <h2 className="font-semibold text-lg sm:text-xl md:text-2xl text-black">{quiz[stepCount]?.question}</h2>
                        </div>

                        <button
                            className="px-3 py-1 h-auto w-auto m-2 bg-gray-100 text-black rounded-md shadow-md hover:bg-gray-200 disabled:opacity-50 text-[20px]"
                            onClick={() => {
                                if (stepCount < quiz.length - 1) {
                                    setStepCount(prev => prev + 1);
                                } else {
                                    setQuizCompleted(true);
                                }
                            }}
                        >
                            {stepCount === quiz.length - 1 
                            ? "Finish" 
                            : <Image src={'/arrow-right.svg'} alt='right' width={30} height={30} />
                            }
                        </button>
                    </div>

                    <div className="flex justify-center items-center text-center font-bold text-xl mb-4 w-full px-4 sm:px-6 lg:px-8">
                        {quiz.length > 0 && quiz[stepCount] ? (
                            <QuizCardItem 
                                quiz={quiz[stepCount]} 
                                userSelectedOption={(v) => checkAnswer(v, quiz[stepCount])} 
                            />
                        ) : (
                            <p className='text-sm'>Loading...</p>
                        )}
                    </div>

                    
                    {isCorrectAnswer === false && (
                        <div className="bg-red-200 rounded-lg p-3 shadow-lg mt-4">
                            <h2 className="font-bold text-lg text-red-950">Incorrect Answer</h2>
                            <p className="text-red-900">Correct answer is: {correctAns}</p>
                        </div>
                    )}

                    {isCorrectAnswer === true && (
                        <div className="bg-green-200 rounded-lg p-3 shadow-lg mt-4">
                            <h2 className="font-bold text-lg text-green-950">Correct Answer!</h2>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Quiz;
