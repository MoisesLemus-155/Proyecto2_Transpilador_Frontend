import axios from "axios";

export const pensumData = async (data) => {
    try {
        const response = await axios.post("http://localhost:3000/analyze", {
            input: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error al analizar:", error);
        return null;
    }
};
