export const getLoginResponse = (username: string, password: string) => {
    if (username === "" || password === "") {
        return false;
    }
    return true;
}
