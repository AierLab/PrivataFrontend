export function classNames(...classes: (string | undefined | null)[]) {
    classes = classes.filter(c => c)
    return classes.join(' ')
}

interface CssModule {
    readonly [key: string]: string;
}

/* usage:
 * import styles from './styles.module.css'
 * const s = modulize(styles)
 * <div classNames={s('a b c', 'd')} />
 */
export function modulize(styles: CssModule) {
    return (...keys: string[]) => {
        const classes = keys
            .reduce((prev, curr) => { return [...prev, ...curr.split(' ')] }, [] as string[])
            .filter(c => c)
        const realClasses = classes.map(c => styles[c] || c)
        return realClasses.join(' ')
    }
}
