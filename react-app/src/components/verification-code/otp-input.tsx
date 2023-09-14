import { classNames, modulize } from 'utils/classNames'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import styles from './otp-input.module.css'

import { motion, MotionProps } from 'framer-motion'

interface OTPInputProps {
    n: number
    className?: string
    disabled?: boolean
    autoFocus?: boolean
    onValueChanged?: (value: Array<string>) => void,
    onComplete?: (value: Array<string>) => void,
}

export default function OTPInput({ n, className, disabled, autoFocus, onValueChanged, onComplete}: OTPInputProps) {
    const s = modulize(styles)
    const [otp, setOtpArray] = useState<string[]>(new Array(n).fill(""))
    const fieldListRef = useRef<HTMLDivElement>(null)

    const [nFilled, setNFilled] = useState(0)

    useEffect(() => {
        onValueChanged && onValueChanged(otp)
    }, [onValueChanged, otp]);

    useEffect(() => {
        if(nFilled === n) onComplete && onComplete(otp)
    }, [nFilled, onComplete, otp, n]);

    const motionConfig: MotionProps = {
        initial: { y: '3rem' },
        animate: { y: '0rem' },
        exit:    { y: '-3rem' },
        transition: { type: 'spring', duration: 0.4 }
    }

    const setOtp = (i: number, value: string) => {
        setOtpArray(otp => {
            if(otp[i] === '' && value !== '') setNFilled(n => n + 1)
            if(otp[i] !== '' && value === '') setNFilled(n => n - 1)

            otp = [...otp]
            otp[i] = value
            return otp
        })
    }

    const focusOn = (i: number) => {
        const elem = fieldListRef.current!.children[i] as HTMLButtonElement
        elem.focus()
    }

    useEffect(() => {
        if(autoFocus) focusOn(0)
    }, [autoFocus]);

    const handleOtpInput = useCallback((i: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
        if(disabled) return

        const next = Math.min(i + 1, n - 1)
        const prev = Math.max(i - 1, 0)

        if(/^[0-9]$/.test(e.key)) {
            setOtp(i, e.key)
            focusOn(next) 
            return
        }

        switch(e.key) {
            case "Delete":
                setOtp(i, '')
                break
            case "Backspace":
                setOtp(i, '')
                focusOn(prev)
                break
            case "ArrowLeft":
                focusOn(prev)
                break
            case "ArrowRight":
                focusOn(next)
                break
            case "v":
                if(!e.getModifierState('Control') && !e.getModifierState('Meta')) return
                window.api.readClipboard().then((text: string) => {
                    for(let j = 0; j < Math.min(n - i, text.length); j++) {
                        if(/^[0-9]$/.test(text[j])) setOtp(i + j, text[j])
                        else break
                    }
                })
                break
            case "End":
                focusOn(n - 1)
                break;
            case "Home":
                focusOn(0)
                break;
        }
    }, [n, disabled])

    return (
        <div
            className={classNames(s('wrapper'), className)}
            ref={fieldListRef}
        >
            {otp.map((_, i) => (
                <React.Fragment key={i}>
                    <button
                        type="button"
                        className={s('input-field', disabled ? 'disabled' : '')}
                        data-otp={otp[i]}
                        onKeyDown={(e) => handleOtpInput(i, e)}
                    >
                        { otp[i] !== '' ? 
                            <motion.label {...motionConfig} className={s('otp-value')}>
                                {otp[i]}
                            </motion.label > 
                            :
                            <span className={s("pseudo-i-beam")}/>
                        }
                    </button>
                </React.Fragment>
            ))}
        </div>
    )
}
