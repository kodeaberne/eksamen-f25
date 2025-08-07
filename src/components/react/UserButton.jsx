import React from 'react';
import { useState } from 'react';

export default function UserButton() {
    const [isOpen, setIsOpen] = useState(false);
    function handleClick() {
        console.log('User button clicked');
        setIsOpen(!isOpen);
    }


    return (
        <>
        <button className="bg-surface-page border-border-black w-12 h-12 flex items-center justify-center cursor-pointer" onClick={handleClick}>
            <img src="/images/user.svg" alt="User icon"></img>
        </button>
        {isOpen &&  <div className="absolute top-36 sm:top-50 left-0 sm:left-auto sm:right-4 w-full sm:w-1/3 h-110 bg-surface-page border-border-black border-6 flex flex-col">
            <button className='text-text-body font-heading text-2xl place-self-end p-4 cursor-pointer' onClick={handleClick}>X</button>
            <div className='flex flex-col items-center justify-center gap-4'>
            <h1 className="text-text-body font-heading text-4xl">Login</h1>
            <form action="#" method='post'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="email" className='text-text-body font-heading text-2xl'>Email</label>
                    <input type="email" id="email" name="email" className='bg-surface-page border-border-black border-2 p-2 sm:w-80 focus:outline-none' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="password" className='text-text-body font-heading text-2xl mt-4'>Password</label>
                    <input type="password" id="password" name="password" className='bg-surface-page border-border-black border-2 p-2 focus:outline-none' />
                    <button type="submit" className='bg-surface-button-alt border-border-black border-2 p-2 text-text-body-alt font-heading text-2xl place-self-center mt-4 cursor-pointer'>Login</button>
                </div>
                
            </form>
            </div>
        </div>}
        </>
    )
}