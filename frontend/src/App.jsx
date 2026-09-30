import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/test")
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Could not connect to Laravel");
            });
    }, []);

    return (
        <div>
            <h1>CMS Project</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;