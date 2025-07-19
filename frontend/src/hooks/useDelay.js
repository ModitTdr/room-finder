import { useEffect, useState } from 'react';

const useDelay = (delay = 300) => {
    const [done, setDone] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setDone(false), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    return done;
};

export default useDelay;
