import React, { useCallback, useState } from "react"
import styles from "./index.module.css"
import { useNavigate } from "react-router-dom"
import { classNames, modulize } from 'utils/classNames'
import Titlebar from "components/Titlebar"
import * as Tabs from '@radix-ui/react-tabs'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Select from '@radix-ui/react-select'
import { ArrowLeftIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence, MotionProps } from "framer-motion"
import OTPInput from "components/OTPInput"
import PasswordInput from "components/PasswordInput/index"

type Pathway = 'unregistered' | 'invited' | 'registered'
const pathways: Record<Pathway, Array<string>> = {
    unregistered: ['login-method', 'email-verification-code', 'create-organization', 'set-password'],
    invited: ['login-method', 'select-organization', 'create-account', 'set-password'],
    registered: ['login-method', 'login'],
}

const Login = () => {
    const s = modulize(styles)

    const [email, setEmail] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [rememberMe, setRemeberMe] = useState<boolean>(false)

    const goto = useNavigate()

    const tabTransitionConfig: MotionProps = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    }

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // FIXME:
        // if the cursor is not at the end of text,
        // editing would make cursor be put on the end.
        let value = e.target.value.replaceAll(/[^\d]/g, '')
        if (value.length > 11) value = value.substring(0, 11)

        let i = 0
        value = '### #### ####'.replace(/#/g, _ => value[i++] || '')
        value = value.trimEnd()

        setPhoneNumber(value)
    }

    const [pathway, setPathway] = useState<Pathway>('unregistered')
    const [pathwayIndex, setPathwayIndex] = useState(0)

    const handleNextStepClick = useCallback(() => {
        if(pathwayIndex === 0) {
            // for debug
            if(rememberMe) setPathway('registered')
            else if(email === '') setPathway('unregistered')
            else setPathway('invited')
            
            setPathwayIndex(i => i + 1)
        } else if(pathwayIndex === pathways[pathway].length - 1) {
            goto('/home')
        } else {
            setPathwayIndex(i => i + 1)
        }
    }, [email, goto, pathway, pathwayIndex, rememberMe])

    const handlePreviousStepClick = useCallback(() => {
        setPathwayIndex(i => Math.max(0, i - 1))
    }, [setPathwayIndex])

    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const url = (event.target as any).href;
        window.api.openExternal(url); // Use the api preloaded by the preload.js

    }; //Check whether the url is clicked. If so, open an external browser (system's default browser) to enter the website 

    return (
        <div className={s('login-page')}>
            <Titlebar />
            <div className={s('feature-slide-container')}>
                <div className={s('feature-slide')}>
                    <img rel="preload" src="lock.png" alt="feature introduction" />
                </div>
            </div>
            <div className={s('login-form-container')}>
                <form className={s('login-form')}>
                    <AnimatePresence mode="wait" initial={false}>
                        <Tabs.Root className={s("login-form-content-tabs")} value={pathways[pathway][pathwayIndex]}>
                            { pathwayIndex !== 0 && <PreviousTabButton onClick={handlePreviousStepClick}/> }
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
                                        <Checkbox.Root id={s("remember-me")} checked={rememberMe} onCheckedChange={c => setRemeberMe(c as boolean)}>
                                            <Checkbox.Indicator>
                                                <CheckIcon className="text-black dark:text-white" />
                                            </Checkbox.Indicator>
                                        </Checkbox.Root>
                                        <label htmlFor={s("remember-me")}> 30 天内自动登录 </label>
                                    </div>
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value="email-verification-code">
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 输入邮箱验证码 </h1>
                                    <p className={s('tips', 'mt-2')}>
                                        已向邮箱 t*******@******* 发送 6 位验证码，有效期10分钟
                                    </p>
                                    <OTPInput
                                        className={s('otp-input')}
                                        n={6}
                                        autoFocus
                                        onComplete={() => console.log('complete')}
                                    />
                                    <p className="mt-4"> 42 秒后可重新获得验证码 </p>
                                    <p className="mt-4"> 邮箱已停用？
                                        <a
                                            className="underline underline-offset-2"
                                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" onClick={handleLinkClick}>
                                            找回账号
                                        </a>
                                    </p>
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value='create-organization'>
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 创建你的组织 </h1>
                                    <h2> 你的资料 </h2>
                                    <div className="flex flex-row items-center justify-between mt-2">
                                        <input className={s('half-width-input')} type="text" placeholder="姓氏" />
                                        <input className={s('half-width-input')} type="text" placeholder="名字" />
                                    </div>
                                    <Select.Root>
                                        <Select.Trigger className={s('select-trigger', 'mt-4')}>
                                            <Select.Value placeholder="职位" className="text-left" />
                                            <Select.Icon className={s('select-icon')}>
                                                <ChevronDownIcon />
                                            </Select.Icon>
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Content className={s('select-content')}>
                                                <Select.ScrollUpButton />
                                                <Select.Viewport className="p-4">
                                                    <Select.Group>
                                                        <Select.Label className={s('select-label')}> 管理 </Select.Label>
                                                        <SelectItem value='ceo'> 老板 </SelectItem>
                                                    </Select.Group>

                                                    <Select.Separator className={s('select-separator')} />

                                                    <Select.Group>
                                                        <Select.Label className={s('select-label')}> 产品 </Select.Label>
                                                        <SelectItem value='pm'> 产品经理 </SelectItem>
                                                        <SelectItem value='uiux'> UI/UX </SelectItem>
                                                    </Select.Group>

                                                    <Select.Separator className={s('select-separator')} />

                                                    <Select.Group>
                                                        <Select.Label className={s('select-label')}> 开发 </Select.Label>
                                                        <SelectItem value='backend-dev'> 后端开发 </SelectItem>
                                                        <SelectItem value='frontend-dev'> 前端开发 </SelectItem>
                                                    </Select.Group>
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Portal>
                                    </Select.Root>
                                    <h2> 你的组织 </h2>
                                    <input className='w-full mt-3' type="text" placeholder="输入企业或组织名称" />
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value="set-password">
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 设置密码 </h1>
                                    <p className={s('tips', 'mt-2')}>
                                        密码仅可由数字、英文字母或英文符号组成，且需包含其中至少两种类型，长度不少于 8 个字符
                                    </p>
                                    { /* <input className='w-full mt-8' type="password" placeholder="输入密码" /> */ }
                                    <PasswordInput className='w-full mt-8' placeholder="输入密码" />
                                    <PasswordInput className='w-full mt-3' placeholder="再次输入密码" />
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value="select-organization">
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 你可加入以下企业 </h1>
                                    <p className={s('tips', 'mt-2')}>
                                        信嗝嗝 已邀请你加入 ValMech 企业或组织
                                    </p>
                                    <div role='list' className={s('org-list')}>
                                        <button role="listitem" type='button' className={s('org-item')} data-selected="true">
                                            <span className={s('org-icon')}></span>
                                            <span className={s('org-title')}> ValMech </span>
                                        </button>
                                    </div>
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value='create-account'>
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 创建你的账号 </h1>
                                    <h2> 你的资料 </h2>
                                    <div className="flex flex-row items-center justify-between mt-2">
                                        <input className={s('half-width-input')} type="text" placeholder="姓氏" />
                                        <input className={s('half-width-input')} type="text" placeholder="名字" />
                                    </div>
                                    <Select.Root>
                                        <Select.Trigger className={s('select-trigger', 'mt-4')}>
                                            <Select.Value placeholder="职位" className="text-left" />
                                            <Select.Icon className={s('select-icon')}>
                                                <ChevronDownIcon />
                                            </Select.Icon>
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Content className={s('select-content')}>
                                                <Select.ScrollUpButton />
                                                <Select.Viewport className="p-4">
                                                    <Select.Group>
                                                        <Select.Label className={s('select-label')}> 管理 </Select.Label>
                                                        <SelectItem value='ceo'> 老板 </SelectItem>
                                                    </Select.Group>

                                                    <Select.Separator className={s('select-separator')} />

                                                    <Select.Group>
                                                        <Select.Label className={s('select-label')}> 产品 </Select.Label>
                                                        <SelectItem value='pm'> 产品经理 </SelectItem>
                                                        <SelectItem value='uiux'> UI/UX </SelectItem>
                                                    </Select.Group>

                                                    <Select.Separator className={s('select-separator')} />

                                                    <Select.Group>
                                                        <Select.Label className={s('select-label')}> 开发 </Select.Label>
                                                        <SelectItem value='backend-dev'> 后端开发 </SelectItem>
                                                        <SelectItem value='frontend-dev'> 前端开发 </SelectItem>
                                                    </Select.Group>
                                                </Select.Viewport>
                                            </Select.Content>
                                        </Select.Portal>
                                    </Select.Root>
                                </motion.div>
                            </Tabs.Content>
                            
                            <Tabs.Content value="login">
                                <motion.div {...tabTransitionConfig}>
                                    <h1> 输入密码 </h1>
                                    <input className='w-full mt-8' type="password" placeholder="输入密码" />
                                    <p className={s('tips', 'mt-4')}>
                                        密码仅可由数字、英文字母或英文符号组成，且需包含其中至少两种类型，长度不少于 8 个字符
                                    </p>
                                    <a
                                        className="underline underline-offset-2 mt-4 block"
                                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" onClick={handleLinkClick}>
                                        忘记密码
                                    </a>
                                </motion.div>
                            </Tabs.Content>
                        </Tabs.Root>
                    </AnimatePresence>
                    <button type="button" className={s('next-step')} onClick={() => handleNextStepClick()}>
                        { pathwayIndex === pathways[pathway].length - 1 ? '完成' : '下一步' }
                    </button>
                </form>
            </div>
        </div>
    )
}

const SelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
    return (
        <Select.Item
            className={classNames(
                'leading-none rounded-lg flex items-center py-2 px-8 my-1 relative',
                'focus:bg-neutral-100 dark:focus:bg-neutral-900',
                className
            )}
            {...props}
            ref={forwardedRef}
        >
            <Select.ItemText>{children}</Select.ItemText>
            <Select.ItemIndicator className="absolute left-2 h-4 w-4 inline-flex items-center justify-center">
                <CheckIcon />
            </Select.ItemIndicator>
        </Select.Item>
    );
});

type PreviousTabButtonProps = {
    onClick: () => void,
};

const PreviousTabButton = function({ onClick }: PreviousTabButtonProps) {
    return (
        <motion.button
            className="absolute top-4 left-4 p-2 transition text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white"
            onClick={onClick}
            initial={{
                filter: 'blur(2px)',
                opacity: 0,
            }}
            animate={{
                filter: 'blur(0px)',
                opacity: 1,
                transition: {
                    duration: 0.3,
                    ease: 'easeOut'
                }
            }}
        >
            <ArrowLeftIcon className="relative h-4 w-4"/>
        </motion.button>
    )
};

export default Login
