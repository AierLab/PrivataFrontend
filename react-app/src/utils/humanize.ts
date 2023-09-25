export function humanizeFileSize(bytes: number) {
    // note: use division rather than bit opration
    // to perserve decimals

    let i = 0
    let result = bytes
    for (i = 0; i < 5; i++) {
        let tmp = result / Math.pow(2, 10)
        if (tmp < 0.9) break
        else result = tmp
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    return `${result.toFixed(2)} ${units[i]}`
}
