import React, { useState } from 'react';

export default function ToggleSwitch() {
    const [isActive, setActive] = useState(false);
    return (
        <div onClick={() => setActive(!isActive)} className={`h-4 w-8 relative flex items-center transition-colors text-black p-1 rounded-xl ${ isActive ? "bg-blue-500" : "bg-gray-500"}`}>
            <div className={`rounded-full bg-slate-200 h-2 w-2 transition-transform ease-in-out relative right-0 ${isActive ? "translate-x-4" : "translate-x-0"}`}>

            </div>
        </div>
    );
}
