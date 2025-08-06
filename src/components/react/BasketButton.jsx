import React from 'react';

export default function BasketButton() {
    return (
        <button className="bg-surface-basket border-border-black w-12 h-12 flex items-center justify-center cursor-pointer">
            <img src="/images/basket.svg" alt="Basket icon"></img>
        </button>
    )
}