import { modulize } from 'utils/classNames'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'
import styles from './index.module.css'

export interface TooltipProps {
    children: ReactNode | ReactNode[] | string
    content: ReactNode | ReactNode[] | string
}

function Tooltip({ children, content }: TooltipProps) {
    const s = modulize(styles)

    return (
        <RadixTooltip.Provider delayDuration={100}>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>
                    { children }
                </RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <RadixTooltip.Content className={s("tooltip-content")} side="bottom" sideOffset={4}>
                        { content }
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    )
}

export default Tooltip
