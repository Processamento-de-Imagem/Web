import { useMain } from "../../hooks/main-provider";
import "./body.css";

export default function Body() {
  const {
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
    setCarouselIdx,
  } = useMain();

  const etapaAtual = outputImage?.[carouselIdx];
  const isLastStep =
    outputState === "done" &&
    outputImage?.length &&
    carouselIdx === outputImage.length - 1;

  const handleDownload = () => {
    if (!etapaAtual?.imagem) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${etapaAtual.imagem}`;
    link.download = "resultado-final.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdi-root">
      <header className="pdi-header">
        <div className="pdi-header-left">
          <div className="pdi-header-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="pdi-header-text">
            <h1 className="pdi-header-title">Detecção de Linhas de Plantio</h1>
            <p className="pdi-header-subtitle">
              Pipeline de processamento digital de imagens para identificação
              automática de fileiras em lavouras a partir de fotos aéreas de
              drone.
            </p>
          </div>
        </div>
        <div className="pdi-header-badges">
          <span className="pdi-header-badge">
            <span className="pdi-header-badge-dot" />
            OpenCV
          </span>
          <span className="pdi-header-badge">
            <span className="pdi-header-badge-dot" />
            Hough Transform
          </span>
          <span className="pdi-header-badge">
            <span className="pdi-header-badge-dot" />
            Morfologia
          </span>
        </div>
      </header>

      <div className="pdi-main">
        <div className="pdi-panel">
          <div className="pdi-panel-header">
            <span className="pdi-panel-title">Imagem de entrada</span>
            {inputImage && (
              <span className="pdi-tag pdi-tag-ready">Carregada</span>
            )}
          </div>
          <div className="pdi-panel-body">
            {inputImage ? (
              <img src={inputImage} alt="Input" className="pdi-preview-img" />
            ) : (
              <div
                className={`pdi-upload-zone ${dragOver ? "drag-over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <svg
                  className="pdi-upload-icon"
                  width="36"
                  height="36"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <div className="pdi-upload-text">
                  <strong>Selecionar imagem</strong>
                  <span>Clique para procurar ou arraste o arquivo</span>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        <div className="pdi-panel">
          <div className="pdi-panel-header">
            <span className="pdi-panel-title">Resultado</span>
            {outputState === "processing" && (
              <span className="pdi-tag pdi-tag-pending">Em execução</span>
            )}
            {outputState === "done" && (
              <span className="pdi-tag pdi-tag-done">
                Etapa {carouselIdx + 1} / {outputImage.length}
              </span>
            )}
          </div>
          <div className="pdi-panel-body">
            {outputState === "processing" && (
              <div className="pdi-skeleton">
                <div className="pdi-skeleton-inner">
                  <div className="pdi-spinner" />
                  <span className="pdi-processing-label" key={processingLabel}>
                    {processingLabel}
                  </span>
                </div>
              </div>
            )}

            {outputState === "done" && etapaAtual && (
              <div className="pdi-carousel">
                <div className="pdi-carousel-step-label">{etapaAtual.nome}</div>
                <div className="pdi-carousel-img-wrap">
                  <img
                    key={carouselIdx}
                    src={`data:image/png;base64,${etapaAtual.imagem}`}
                    alt={etapaAtual.nome}
                    className="pdi-result-img"
                  />
                </div>
                {etapaAtual.descricao && (
                  <p className="pdi-carousel-descricao">
                    {etapaAtual.descricao}
                  </p>
                )}
                <div className="pdi-carousel-controls">
                  <button
                    className="pdi-carousel-btn"
                    onClick={() => setCarouselIdx((i) => Math.max(0, i - 1))}
                    disabled={carouselIdx === 0}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <div className="pdi-carousel-dots">
                    {outputImage.map((_, i) => (
                      <button
                        key={i}
                        className={`pdi-carousel-dot ${i === carouselIdx ? "active" : ""}`}
                        onClick={() => setCarouselIdx(i)}
                      />
                    ))}
                  </div>
                  <button
                    className="pdi-carousel-btn"
                    onClick={() =>
                      setCarouselIdx((i) =>
                        Math.min(outputImage.length - 1, i + 1),
                      )
                    }
                    disabled={carouselIdx === outputImage.length - 1}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
                {isLastStep && (
                  <button className="pdi-btn-download" onClick={handleDownload}>
                    Exportar resultado final
                  </button>
                )}
              </div>
            )}

            {outputState === "idle" && (
              <div className="pdi-empty-output">
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
                <span>Aguardando processamento</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pdi-footer">
        <button
          className="pdi-btn-process"
          onClick={handleProcess}
          disabled={!inputImage || isProcessing}
        >
          {isProcessing ? (
            <>
              <div
                className="pdi-spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />
              Processando...
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
              Processar Imagem
            </>
          )}
        </button>
        {(inputImage || outputImage) && (
          <button className="pdi-btn-clear" onClick={handleClear}>
            Limpar sessão
          </button>
        )}
      </div>
    </div>
  );
}
