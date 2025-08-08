import React from 'react';

export default function ProductToggle() {
    return (
        <button 
            className="flex flex-row gap-0 | items-center | cursor-pointer | " 
            type="button"
            id="product-toggle"
        >
            <h2 className="font-heading text-text-menu-active text-2xl hover:text-text-menu-hover">Produkter</h2>
            <img src="/images/chevronDown.svg" alt="Dropdown arrow"></img>
        </button>
    )
}