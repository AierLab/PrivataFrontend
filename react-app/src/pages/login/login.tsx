import { useRef, useState } from "react"
import styles from "./login.module.css"
import { useNavigate } from "react-router-dom"
import { modulize } from 'utils/classNames'
import Titlebar from "components/Titlebar"
import * as Tabs from '@radix-ui/react-tabs'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence, MotionProps } from "framer-motion"
import OTPInput from "components/verification-code/otp-input"
import { argv0 } from "process"

const Login = () => {
    const s = modulize(styles)

    const [loginStage, setLoginStage] = useState('login-method')

    const [email, setEmail] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    const goto = useNavigate()

    const tabTransitionConfig: MotionProps = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit:    { opacity: 0, x: -20 },
    }

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replaceAll(/[^\d]/g, '')
        if(value.length > 11) value = value.substring(0, 11)

        let i = 0
        value = '### #### ####'.replace(/#/g, _ => value[i++] || '')
        value = value.trimEnd()

        setPhoneNumber(value)
    }

    const handleNextStepClick = () => {
        if(loginStage !== 'email-verification-code') setLoginStage('email-verification-code')
        else goto('/home')
    }

    // const handleLinkClick = (event) => {
    //     event.preventDefault();
    //     const url = event.target.href;
    //     window.api.openExternal(url); // Use the api preloaded by the preload.js
    //
    // }; //Check whether the url is clicked. If so, open an external browser (system's default browser) to enter the website 

    return (
        <div className={s('login-page')}>
            <Titlebar />
            <div className={s('features-slide-container')}>
                <div className={s('feature-slide')}>
                    <img src="linabell.png" alt="feature introduction"/>
                </div>
            </div>
            <div className={s('login-form-container')}>
                <form className={s('login-form')}>
                    <AnimatePresence mode="wait" initial={false}>
                        <Tabs.Root className={s("login-form-content-tabs")} value={loginStage}>
                            <Tabs.Content value="login-method">
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 欢迎使用 </h1>
                                    <Tabs.Root className={s("login-method-tab")} defaultValue="email">
                                        <Tabs.List className={s('login-method-list')}>
                                            <Tabs.Trigger value="email">
                                                邮箱
                                            </Tabs.Trigger>
                                            <Tabs.Trigger value="phone-number">
                                                手机
                                            </Tabs.Trigger>
                                        </Tabs.List>
                                        <div className="mt-3 w-full">
                                            <Tabs.Content value="email">
                                                <input
                                                    spellCheck="false"
                                                    className={s("email-input")}
                                                    placeholder="请输入你的邮箱"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </Tabs.Content>
                                            <Tabs.Content value="phone-number" className="relative flex items-center">
                                                <span className={s('call-code')}> +86 </span>
                                                <input
                                                    spellCheck="false"
                                                    className={s("phone-number-input")}
                                                    placeholder="请输入你的手机号码"
                                                    type="tel"
                                                    inputMode="numeric"
                                                    value={phoneNumber}
                                                    onChange={handlePhoneNumberChange}
                                                />
                                            </Tabs.Content>
                                        </div>
                                    </Tabs.Root>

                                    <div className="inline-flex items-center mt-4">
                                        <Checkbox.Root id={s("remember-me")}>
                                            <Checkbox.Indicator>
                                                <CheckIcon className="text-neutral-400"/>
                                            </Checkbox.Indicator>
                                        </Checkbox.Root>
                                        <label htmlFor={s("remember-me")}> 30 天内自动登录 </label>
                                    </div>
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value="email-verification-code">
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 输入邮箱验证码 </h1>
                                    <p className={s('tips')}>
                                        已向邮箱 t*******@******* 发送 6 位验证码，有效期10分钟
                                    </p>
                                    <OTPInput
                                        className={s('otp-input')}
                                        n={6}
                                        autoFocus
                                        onComplete={() => console.log('complete')}
                                    />
                                </motion.div>
                            </Tabs.Content>
                        </Tabs.Root>
                    </AnimatePresence>
                    <button type="button" className={s('next-step')} onClick={() => handleNextStepClick()}>
                        下一步
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
