"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";
import { Type, ImageIcon, Settings2, ZoomIn, ZoomOut, Target, Maximize, Minimize, X } from "lucide-react";

// Memoized observer to trigger load
const FileObserver = memo(({ file, onFileLoaded }: { file: File | undefined, onFileLoaded: (file: File) => void }) => {
    useEffect(() => {
        if (file) {
            onFileLoaded(file);
        }
    }, [file, onFileLoaded]);
    return null;
});

// A component to render a single PDF page with its own draggable watermark over it
const PDFPageCanvas = memo(({
    pdfDoc,
    pageIndex,
    zoom,
    watermarkType,
    text,
    fontSize,
    color,
    opacity,
    rotation,
    imagePreview,
    position,
    onPositionChange
}: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const renderTaskRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        let isMounted = true;

        const renderPage = async () => {
            if (!pdfDoc) return;
            try {
                const page = await pdfDoc.getPage(pageIndex + 1);
                // Render at higher scale for crispness, visual size dictated by CSS
                const renderScale = 2.0;
                const viewport = page.getViewport({ scale: renderScale });

                const originalViewport = page.getViewport({ scale: 1.0 });
                if (isMounted) {
                    setDimensions({ width: originalViewport.width, height: originalViewport.height });
                }

                const canvas = canvasRef.current;
                if (canvas && isMounted) {
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext("2d");
                    if (context) {
                        if (renderTaskRef.current) {
                            try { renderTaskRef.current.cancel(); } catch (e) { }
                        }
                        const renderContext = { canvasContext: context, viewport };
                        const renderTask = page.render(renderContext);
                        renderTaskRef.current = renderTask;
                        await renderTask.promise;
                        renderTaskRef.current = null;
                    }
                }
            } catch (err: any) {
                if (err?.name === 'RenderingCancelledException') return;
                console.error("Render error", err);
            }
        };
        renderPage();
        return () => { isMounted = false; };
    }, [pdfDoc, pageIndex]);

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newX = ((e.clientX - rect.left) / rect.width) * 100;
        let newY = ((e.clientY - rect.top) / rect.height) * 100;
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));
        onPositionChange(pageIndex, { x: newX, y: newY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    if (dimensions.width === 0) {
        return (
            <div className="bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-8 mx-auto my-4 rounded-lg animate-pulse w-full max-w-[500px] aspect-[1/1.4] relative shadow-sm">
                <span className="text-sm font-medium text-slate-400">Loading Page {pageIndex + 1}...</span>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center my-6 group">
            <span className="absolute -left-12 top-0 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hidden md:block">
                P{pageIndex + 1}
            </span>
            <div
                ref={containerRef}
                className="relative bg-white shadow-xl flex-shrink-0 transition-all duration-200"
                style={{
                    width: `${dimensions.width * zoom}px`,
                    height: `${dimensions.height * zoom}px`,
                    maxWidth: '100%'
                }}
            >
                <canvas ref={canvasRef} className="w-full h-full object-contain select-none pointer-events-none" />

                {/* Draggable Watermark Overlay */}
                <div
                    className="absolute pointer-events-auto cursor-move touch-none leading-none select-none z-10 box-border border-2 border-transparent hover:border-blue-500/50 transition-colors rounded"
                    style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transformOrigin: `0% 100%`,
                        transform: `translate(0, -100%) rotate(${rotation}deg)`,
                        opacity: opacity,
                        color: color,
                        fontSize: `${fontSize * zoom}px`,
                        lineHeight: 1,
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <div className="whitespace-nowrap">
                        {watermarkType === "text" ? text : (
                            imagePreview ? <img src={imagePreview} alt="watermark" draggable={false} style={{ width: `${(dimensions.width * 0.4) * (fontSize / 40) * zoom}px` }} /> : <span className="text-slate-400 text-xs bg-slate-100 p-2 rounded">No Image</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default function ToolPage() {
    const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
    const [text, setText] = useState("PDFY AI");
    const [fontSize, setFontSize] = useState(40);
    const [color, setColor] = useState("#000000");
    const [opacity, setOpacity] = useState(0.5);
    const [rotation, setRotation] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [numPages, setNumPages] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Store per-page positions. Global position default is 50,50
    const [globalPosition, setGlobalPosition] = useState({ x: 50, y: 50 });
    const [pagePositions, setPagePositions] = useState<Record<number, { x: number, y: number }>>({});

    const loadPDF = useCallback(async (file: File) => {
        try {
            if (!(window as any).pdfjsLib) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error("Failed to load PDF.js"));
                    document.head.appendChild(script);
                });
            }
            const pdfjsLib = (window as any).pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setPagePositions({});
        } catch (error) {
            console.error("Failed to load PDF", error);
        }
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setImagePreview(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePositionChange = useCallback((pageIndex: number, newPos: { x: number, y: number }) => {
        setPagePositions(prev => ({
            ...prev,
            [pageIndex]: newPos
        }));
    }, []);

    const handleResetPositions = () => {
        setPagePositions({});
    };

    const handleProcess = async (files: File[]) => {
        const payloadPositions: any = {};
        for (let i = 0; i < numPages; i++) {
            if (pagePositions[i]) {
                payloadPositions[i] = {
                    positionX: pagePositions[i].x,
                    positionY: pagePositions[i].y
                };
            }
        }

        let payload: any = {
            type: watermarkType,
            positionX: globalPosition.x,
            positionY: globalPosition.y,
            opacity,
            rotation,
            positions: payloadPositions
        };

        if (watermarkType === "text") {
            if (!text.trim()) throw new Error("Please enter watermark text.");
            payload = { ...payload, text, fontSize, color };
        } else {
            if (!imageFile) throw new Error("Please upload an image for the watermark.");
        }

        const processingFiles = [...files];
        if (watermarkType === "image" && imageFile) processingFiles.push(imageFile);

        return processPDFJob("WATERMARK", processingFiles, payload);
    };

    const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
    const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));

    return (
        <PDFToolBase
            title="WATERMARK PDF"
            description="Add watermark to your PDF with full preview. Adjust text, images, transparency, and place them freely on each page."
            onProcess={handleProcess}
            maxFiles={1}
        >
            {(files) => (
                <>
                    <FileObserver file={files[0]} onFileLoaded={loadPDF} />
                    <div className="flex flex-col lg:flex-row gap-8 mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">

                        {/* Settings Panel */}
                        <div className="w-full lg:w-1/3 xl:w-1/4 space-y-6 text-left flex-shrink-0">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-rose-500" />
                                Options
                            </h3>

                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                                <button
                                    onClick={() => setWatermarkType("text")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${watermarkType === "text" ? "bg-white dark:bg-slate-900 shadow-sm text-rose-600" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                                >
                                    <Type className="w-4 h-4" /> Text
                                </button>
                                <button
                                    onClick={() => setWatermarkType("image")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${watermarkType === "image" ? "bg-white dark:bg-slate-900 shadow-sm text-rose-600" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                                >
                                    <ImageIcon className="w-4 h-4" /> Image
                                </button>
                            </div>

                            {watermarkType === "text" ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Text</label>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-1">Color</label>
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-full h-10 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 cursor-pointer p-1"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-1 flex justify-between">
                                                <span>Size</span> <span>{fontSize}</span>
                                            </label>
                                            <input
                                                type="range" min="10" max="150"
                                                value={fontSize}
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full accent-rose-500 mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Upload Image</label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={handleImageUpload}
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-900/20 dark:file:text-rose-400"
                                        />
                                    </div>

                                    {/* Fake size control for image purely mapped visually */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 flex justify-between">
                                            <span>Image Scale</span> <span>{Math.round((fontSize / 40) * 100)}%</span>
                                        </label>
                                        <input
                                            type="range" min="10" max="150"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                                            className="w-full accent-rose-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div>
                                    <label className="block text-sm font-medium mb-1 flex justify-between">
                                        <span>Opacity</span>
                                        <span>{Math.round(opacity * 100)}%</span>
                                    </label>
                                    <input
                                        type="range" min="0.1" max="1" step="0.05"
                                        value={opacity}
                                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                        className="w-full accent-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 flex justify-between">
                                        <span>Rotation</span>
                                        <span>{rotation}°</span>
                                    </label>
                                    <input
                                        type="range" min="-180" max="180" step="5"
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                        className="w-full accent-rose-500"
                                    />
                                </div>

                                {Object.keys(pagePositions).length > 0 && (
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <p className="text-sm text-amber-600 dark:text-amber-400 mb-2 font-medium flex gap-2 items-center">
                                            <Target className="w-4 h-4" /> Custom positions set
                                        </p>
                                        <button
                                            onClick={handleResetPositions}
                                            className="w-full py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            Reset All & Lock to Center
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fullscreen Backdrop */}
                        {isFullscreen && (
                            <div
                                className="fixed inset-0 z-[90] bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
                                onClick={() => setIsFullscreen(false)}
                            />
                        )}

                        {/* Preview Panel (Inline or Fullscreen Modal popup) */}
                        <div className={isFullscreen
                            ? "fixed inset-4 md:inset-12 z-[100] bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
                            : "flex-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[600px] lg:max-h-[800px]"
                        }>
                            {/* Toolbar */}
                            <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
                                <span className="text-sm font-semibold text-slate-500">
                                    Preview ({numPages} {numPages === 1 ? 'Page' : 'Pages'})
                                </span>
                                <div className="flex items-center gap-2">
                                    <button onClick={zoomOut} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Zoom Out">
                                        <ZoomOut className="w-5 h-5" />
                                    </button>
                                    <span className="text-xs font-bold w-12 text-center text-slate-400 select-none">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <button onClick={zoomIn} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Zoom In">
                                        <ZoomIn className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setIsFullscreen(!isFullscreen)} className={`p-1.5 ml-1 sm:ml-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-l border-slate-200 dark:border-slate-700 pl-2 sm:pl-3 flex items-center gap-2 ${isFullscreen ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : ''}`} title="Toggle Fullscreen">
                                        {isFullscreen ? (
                                            <><X className="w-5 h-5" /> <span className="hidden sm:inline text-sm font-medium">Close Popup</span></>
                                        ) : (
                                            <><Maximize className="w-5 h-5" /> <span className="hidden sm:inline text-sm font-medium">Fullscreen Pop-up</span></>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable canvas list */}
                            <div
                                onDoubleClick={() => !isFullscreen && setIsFullscreen(true)}
                                className={`flex-1 overflow-auto p-4 md:p-8 custom-scrollbar relative bg-slate-200/50 dark:bg-slate-900/80 w-full flex flex-col items-center ${!isFullscreen ? 'cursor-zoom-in' : ''}`}
                                title={!isFullscreen ? "Double click to open full screen pop-up" : ""}
                            >
                                {!pdfDoc ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                                        <div className="w-12 h-12 border-4 border-slate-300 border-t-rose-500 rounded-full animate-spin mb-4" />
                                        <p>Processing Document...</p>
                                    </div>
                                ) : (
                                    Array.from({ length: numPages }).map((_, i) => (
                                        <PDFPageCanvas
                                            key={i}
                                            pdfDoc={pdfDoc}
                                            pageIndex={i}
                                            zoom={zoom}
                                            watermarkType={watermarkType}
                                            text={text}
                                            fontSize={fontSize}
                                            color={color}
                                            opacity={opacity}
                                            rotation={rotation}
                                            imagePreview={imagePreview}
                                            position={pagePositions[i] || globalPosition}
                                            onPositionChange={handlePositionChange}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </>
            )}
        </PDFToolBase>
    );
}
