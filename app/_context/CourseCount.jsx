"use client";  

import { createContext, useState } from "react";

export const CourseCount = createContext(null);

export function CourseCountProvider({ children }) {
    const [totalCourse, setTotalCourse] = useState(0);

    return (
        <CourseCount.Provider value={{ totalCourse, setTotalCourse }}>
            {children}
        </CourseCount.Provider>
    );
}

export default CourseCount;  

