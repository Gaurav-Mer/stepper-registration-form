import { useState } from "react";


const useGetData = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState({});

    const fetchData = async (url: string) => {
        try {
            setLoading(true)
            if (!url) {
                setError(true)
            } else {
                const response = await fetch(url);
                if (response && response.status === 200) {
                    const jsonData = await response.json();
                    if (jsonData && jsonData?.length > 0) {
                        setData(jsonData);
                    } else {
                        setData([]);
                    }
                }
            }
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false)
        }
    }


    const makeApiRequest = async (url: string) => {
        fetchData(url)
    }

    return { loading, data, error, makeApiRequest }
}
export default useGetData;