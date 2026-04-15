import { createContext, useCallback, useContext, useRef, useState } from "react";
import { processImage } from "../services/pdi";

const MainContext = createContext(null);

const ETAPAS_LABELS = [
    "Carregando imagem...",
    "Convertendo para escala de cinza...",
    "Aplicando filtro de média...",
    "Aplicando filtro gaussiano...",
    "Detectando bordas com Sobel...",
    "Binarização...",
    "Fechamento morfológico...",
    "Erosão morfológica...",
    "Dilatação morfológica...",
    "Transformada de Hough...",
    "Agrupamento de linhas...",
    "Cálculo de espaçamento...",
    "Cálculo de desvio padrão...",
    "Cálculo de coeficiente de variação...",
    "Cálculo de média de espaçamento...",
    "Cálculo de desvio padrão de espaçamento...",
    "Cálculo de coeficiente de variação de espaçamento...",
];

export function MainProvider({ children }) {

    const [inputFile, setInputFile] = useState(null);
    const [inputImage, setInputImage] = useState(null);
    const [outputImage, setOutputImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingLabel, setProcessingLabel] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const [carouselIdx, setCarouselIdx] = useState(0);

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const url = URL.createObjectURL(file);
        setInputFile(file);
        setInputImage(url);
        setOutputImage(null);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, [handleFile]);

    const handleProcess = useCallback(async () => {
        if (!inputFile) return;
        setCarouselIdx(0);
        setIsProcessing(true);
        setOutputImage(null);
        setProcessingLabel(ETAPAS_LABELS[0]);

        const dataPromise = processImage(inputFile);

        await new Promise((resolve) => {
            let labelIdx = 0;
            const interval = setInterval(() => {
                labelIdx += 1;
                if (labelIdx < ETAPAS_LABELS.length) {
                    setProcessingLabel(ETAPAS_LABELS[labelIdx]);
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });

        try {
            const data = await dataPromise;
            setOutputImage(data.etapas);
        } catch (err) {
            console.error("Falha no processamento da imagem:", err);
        } finally {
            setIsProcessing(false);
            setProcessingLabel("");
        }
    }, [inputFile]);

    const handleClear = () => {
        setInputFile(null);
        setInputImage(null);
        setOutputImage(null);
        setIsProcessing(false);
        setProcessingLabel("");
    };

    const outputState = isProcessing ? "processing" : outputImage ? "done" : "idle";

    return (
        <MainContext.Provider
            value={{
                inputImage,
                dragOver,
                setDragOver,
                handleDrop,
                fileInputRef,
                outputState,
                isProcessing,
                processingLabel,
                handleProcess,
                outputImage,
                handleFile,
                handleClear,
                carouselIdx,
                setCarouselIdx
            }}
        >
            {children}
        </MainContext.Provider>
    );
}

export function useMain() {
    return useContext(MainContext);
}