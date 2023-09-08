import { classNames } from "utils/classNames"

interface SeparatorProps {
    vertical?: boolean,
    margin?: 0 | 1 | 2 | 4 | 8,
}

export default function Separator({ vertical, margin }: SeparatorProps) {
    if (vertical === undefined) vertical = false
    const dim = vertical ? 'h-full w-[2px]' : 'w-full h-[2px]'
    const bg = vertical ? 'bg-gradient-to-b' : 'bg-gradient-to-r'
    const gradient = 'from-transparent via-black/5 to-transparent'

    let marginClass = 'my-4'
    switch (margin) {
        case 0:
            marginClass = ''; break;
        case 1:
            marginClass = 'my-1'; break;
        case 2:
            marginClass = 'my-2'; break;
        case 8:
            marginClass = 'my-8'; break;
    }

    return (
        <div className={classNames(dim, bg, gradient, marginClass)} />
    )
}
