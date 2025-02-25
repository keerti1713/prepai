'use client'
import { useParams } from 'next/navigation'
import React, {useEffect, useState} from 'react'
import FlashcardItem from './__components/flashcardItem'
import axios from 'axios'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  

function Flashcards() {
    const {courseId}=useParams();
    const [flashCards, setFlashCards]= useState([]);
    const [flippedStates, setFlippedStates] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return;
        
        const checkFlashcardStatus = async () => {
            try {
                
                for (let i = 0; i < 10; i++) {  
                    await new Promise(res => setTimeout(res, 5000)); 
                    const checkStatus = await axios.get(`/api/generate-study-content?courseId=${courseId}&type=flashcards`);
                    
                    if (checkStatus.data?.ready) {
                        GetFlashcards();
                        return;
                    }
                }

                console.error("Flashcards not generated in time");
            } catch (error) {
                console.error("Error checking flashcard status:", error.message);
            } finally {
                setLoading(false);
            }
        };

        checkFlashcardStatus();
    }, [courseId]);     

    const GetFlashcards = async () => {
        try {
            if (!courseId) {
                console.error("Error: courseId is undefined");
                return;
            }
    
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'flashcards'
            });
    
            if (!result.data || !Array.isArray(result.data.content) || result.data.content.length === 0) {
                console.error("Empty or invalid API response");
                return;
            }
    
            // Extract flashcard content
            const studyContent = result.data.content[0]?.content; 
    
            if (!studyContent || !studyContent.candidates || studyContent.candidates.length === 0) {
                console.error("Unexpected API structure");
                return;
            }
    
            const candidate = studyContent.candidates[0]; 
    
            if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                console.error("Unexpected API structure: Missing `content.parts[0]`");
                return;
            }
    
            const rawContent = candidate.content.parts[0].text;
    
            if (!rawContent) {
                console.error("Flashcard content is missing");
                return;
            }
    
            // Remove ```json and ``` before parsing
            const jsonText = rawContent.replace(/```json|```/g, "").trim();
            const parsedFlashcards = JSON.parse(jsonText);
    
            setFlashCards(parsedFlashcards);
            
        } catch (error) {
            console.error("Axios Error:", error.response?.data || error.message);
        }
        };
    
    const handleClick = (cardIndex) => { 
        setFlippedStates(prevState => ({
            ...prevState,
            [cardIndex]: !prevState[cardIndex] //Toggle flip state per card
        }));
    };
  return (
    <div>
        <h2 className='font-bold text-2xl'>Flashcards</h2>
        <div className='mt-10'>
            <Carousel>
            <CarouselContent>
            {loading ? <p className='m-4'>Loading flashcards...</p> : (
                flashCards.length > 0 ? flashCards.map((flashCard, index) => (
                    <CarouselItem key={index} className='flex justify-center items-center'>
                    <FlashcardItem 
                        front={flashCard.front} 
                        back={flashCard.back} 
                        isFlipped={flippedStates[index] || false} 
                        handleClick={() => handleClick(index)}
                    />
                    </CarouselItem>
                ))
                : 
                <p className="text-center m-4 text-gray-500">No flashcards available</p>
                )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            </Carousel>
        </div>

    </div>
  )
}

export default Flashcards