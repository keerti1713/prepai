import React from 'react'
import ReactCardFlip from 'react-card-flip'

function flashcardItem({front, back, isFlipped, handleClick}) {
  return (
          <div>
              <ReactCardFlip isFlipped={isFlipped} flipDirection='vertical'>
            <div 
            className='p-4 bg-gradient-to-r from-purple-800 to-purple-500 text-white shadow-lg flex flex-col items-center justify-center rounded-lg cursor-pointer h-[400px] w-[250px] relative' 
            onClick={handleClick}>
            <h2 className='flex items-center text-[20px] justify-center text-center flex-1 m-2'>{front}</h2>
            <button className="absolute bottom-4 bg-white text-purple-500 px-4 py-1 rounded m-1">Answer</button>
            </div>
            <div 
                className='p-4 bg-[#DAD2FF] text-black shadow-xl flex flex-col items-center justify-center rounded-lg cursor-pointer h-[400px] w-[250px] relative ' 
                onClick={handleClick}
            >
                <h2 className='flex items-center text-[15px] justify-center text-center flex-1 m-2'>{back}</h2>
                <button className="absolute bottom-4 bg-white text-purple-500 px-4 py-1 m-1 rounded">Back to Question</button>
            </div>
        </ReactCardFlip>
    </div>
  )
}

export default flashcardItem