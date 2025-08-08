import React from 'react';

export default function ProductToggle() {
    function handleClick() {
        const catMenu = document.getElementById('catMenu');
        catMenu.classList.toggle('hidden');
    }
    
    return (
        <button 
            className="flex flex-row gap-0 | items-center | cursor-pointer | " 
            onClick={handleClick}
            type="button"
        >
            <h2 className="font-heading text-text-menu-active text-2xl hover:text-text-menu-hover">Produkter</h2>
            <img src="/images/chevronDown.svg" alt="Dropdown arrow"></img>
        </button>
    )
}