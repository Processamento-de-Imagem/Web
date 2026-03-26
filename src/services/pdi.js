import axios from "axios";

export const processImage = async (file) => {
    const formData = new FormData();
    formData.append("imagem", file);

    const response = await axios.post(
        "https://pdi-api-112480462744.europe-west1.run.app/processar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};