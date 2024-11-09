import { jwtDecode } from 'jwt-decode'; // Use named import instead of default


export const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (!token) return { expired: true };

    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = decodedToken.exp - currentTime;

    return { expired: timeRemaining <= 0, timeRemaining };
};
