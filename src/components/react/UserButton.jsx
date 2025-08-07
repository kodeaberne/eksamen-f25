import React from 'react';
import { useState, useEffect } from 'react';
export const prerender = false;


export default function UserButton(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [logStatus, setLogStatus] = useState(props.logStatus);
    
    useEffect(() => {
        // Check for login success parameter on mount
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('login') === 'success') {
            setLogStatus("loggedIn");
            setIsOpen(true);
            // Clean up the URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
        
        // Listen for login success event
        const handleLoginSuccess = () => {
            setLogStatus("loggedIn");
            // Automatically open the overlay when user logs in
            setIsOpen(true);
        };
        
        window.addEventListener('loginSuccess', handleLoginSuccess);
        
        // Cleanup
        return () => {
            window.removeEventListener('loginSuccess', handleLoginSuccess);
        };
    }, []);
    
    function handleClick() {
        setIsOpen(!isOpen);
    }


    return (
        <>
        <button className="bg-surface-page border-border-black w-12 h-12 flex items-center justify-center cursor-pointer" onClick={handleClick} data-user-button>
            <img src="/images/user.svg" alt="User icon"></img>
        </button>
        {isOpen && logStatus === "loggedOut" &&  <div className="absolute top-36 sm:top-50 left-0 sm:left-auto sm:right-4 w-full sm:w-1/3 h-110 bg-surface-page border-border-black border-6 flex flex-col">
            <button className='text-text-body font-heading text-2xl place-self-end p-4 cursor-pointer' onClick={handleClick}>X</button>
            <div className='flex flex-col items-center justify-center gap-4'>
            <h1 className="text-text-body font-heading text-4xl">Login</h1>
            <form action="/api/auth/signin" method='post'>
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
        {isOpen && logStatus === "loggedIn" && <div className="absolute top-36 sm:top-50 left-0 sm:left-auto sm:right-4 w-full sm:w-1/3 h-110 bg-surface-page border-border-black border-6 flex flex-col">
            <button className='text-text-body font-heading text-2xl place-self-end p-4 cursor-pointer' onClick={handleClick}>X</button>
            <div className='flex flex-col items-center justify-center gap-4'>
            <h1 className="text-text-body font-heading text-4xl">Logget ind</h1>
            </div>
        </div>}
        </>
    )
}