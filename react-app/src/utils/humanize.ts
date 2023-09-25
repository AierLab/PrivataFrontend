export function humanizeFileSize(bytes: number) {
    // note: use division rather than bit opration
    // to perserve decimals

    // B, KB, MB, GB, TB
    let magnitudes = []
    let i = 0
    for (i = 0; i < 5; i++) magnitudes.push(bytes / Math.pow(2, i * 10))

    const whosBetter = (a: number, b: number) => b < a && b > 0.9 ? 'latter' : 'former'

    let result = bytes
    for (i = 1; i < 5; i++) {
        if (whosBetter(magnitudes[i - 1], magnitudes[i]) === 'former') {
            i = i - 1
            break
        } else {
            result = magnitudes[i]
        }
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    return `${result.toFixed(2)} ${units[i]}`
}
