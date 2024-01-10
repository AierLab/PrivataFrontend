export function norm(vec: number[], n: number) {
    let sum = vec.map(v => Math.pow(v, n)).reduce((acc, v) => acc + v, 0);
    return Math.pow(sum, 1/n);
}
