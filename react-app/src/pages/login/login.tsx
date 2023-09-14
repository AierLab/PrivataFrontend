import { useRef, useState } from "react"
import styles from "./login.module.css"
import { getLoginResponse } from "utils/request"
import { useNavigate } from "react-router-dom"
import { modulize } from 'utils/classNames'
import Titlebar from "components/Titlebar"
import * as Tabs from '@radix-ui/react-tabs'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence, MotionProps } from "framer-motion"
import OTPInput from "components/verification-code/otp-input"

const Login = () => {
    const s = modulize(styles)

    const [loginStage, setLoginStage] = useState('login-method')

    const emailInput = useRef<HTMLInputElement>(null)
    const phoneNumberInput = useRef<HTMLInputElement>(null)
    const goto = useNavigate()

    const tabTransitionConfig: MotionProps = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit:    { opacity: 0, x: -20 },
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
                    <Tabs.Root className={s("login-form-content-tabs")} value={loginStage}>
                        <AnimatePresence mode="wait" initial={false}>
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
                                                <input spellCheck="false" className={s("email-input")} placeholder="请输入你的邮箱"/>
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
                                    <OTPInput
                                        className={s('otp-input')}
                                        n={6}
                                        autoFocus
                                        onComplete={() => console.log('complete')}
                                    />
                                </motion.div>
                            </Tabs.Content>
                        </AnimatePresence>
                    </Tabs.Root>
                    <button type="button" className={s('next-step')} onClick={() => handleNextStepClick()}>
                        下一步
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
