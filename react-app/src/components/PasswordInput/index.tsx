import { classNames } from "@/utils/classNames"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import React, { useCallback, useRef, useState } from "react"

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props}: PasswordInputProps, forwardedRef) => {
    const [inputType, setInputType] = useState('password')
    const [reveal, setReveal] = useState(false)
    const [focused, setFocused] = useState(false)

    const alternatePasswordReveal = useCallback(() => {
        setInputType(reveal ? 'password' : 'text')
        setReveal(r => !r)
    }, [reveal])


    const blurTimeoutRef = useRef<NodeJS.Timeout>();
    const handleFocus = () => {
        clearTimeout(blurTimeoutRef.current)
        setFocused(true)
    }
    const handleBlur = () => {
        blurTimeoutRef.current = setTimeout(() => {
            setFocused(false)
        }, 10)
    }

    const handleRevealClick = () => {
        clearTimeout(blurTimeoutRef.current)
        alternatePasswordReveal()
    }

    return (
        <div
            className={classNames(className, "relative")}
            onFocusCapture={handleFocus}
            onBlur={handleBlur}
        >
            <input {...props} ref={forwardedRef}
                data-password-input
                autoComplete="current-password"
                className="pr-10 w-full"
                type={inputType}
            />
            { (focused || reveal) &&
                <button
                    aria-label="Show password as plain text. Warning: this will display your password on the screen."
                    className="absolute right-3 top-2 w-8 h-8 p-1 transition rounded-full focus-visible:ring focus-visible:ring-indigo-200"
                    onClick={handleRevealClick}
                >
                    { reveal ? <EyeSlashIcon /> : <EyeIcon /> }
                </button>
            }
        </div>
    )
})

export default PasswordInput
