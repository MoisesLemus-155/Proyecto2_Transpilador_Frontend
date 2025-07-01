import { useState } from "react"
import { pensumData } from "../Api/ApiTranspilador"
import { useEditor, useError } from "../context/ErrorContext";
import Swal from "sweetalert2";
import { PensumNavbar } from "./Navbar";

export const Inicial = () => {
    const { editorText, setEditorText } = useEditor();
    const [tokenList, setTokenList] = useState([]);
    const { setErrors, setSyntacticErrors } = useError();
    const [translatedCode, setTranslatedCode] = useState("");

    const refreshPage = () => {
        setEditorText("");
        setTranslatedCode("");
        setTokenList([]);
        setErrors([]);
        setSyntacticErrors([]);
    };

    const handleFileLoad = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setEditorText(content);
        };
        reader.onerror = (e) => {
            console.error("Error al leer el archivo:", e);
        };
        reader.readAsText(file);
    };

    const handleFileClick = () => {
        document.getElementById("fileInput").click();
    };

    const handlePensumDataOriginal = async () => {
        const result = await pensumData(editorText);
        if (result) {
            const errores = result.errors || [];
            setErrors(errores);
            setTokenList(result.tokens || []);

            if (errores.length > 0) {
                Swal.fire({
                    icon: "error",
                    title: "Errores detectados",
                    text: "Se detectaron errores. Puedes verlos en la sección de Reporte.",
                    confirmButtonText: "OK"
                });
            } else {
                setTranslatedCode(result.traduction || "");
            }
        }
    };

    const handlePensumData2 = async () => {
        const result = await pensumData(editorText);

        if (result) {
            const erroresLexicos = result.errors || [];
            const erroresSintacticos = result.syntacticErrors || [];

            setErrors(erroresLexicos);
            setSyntacticErrors(erroresSintacticos);
            setTokenList(result.tokens || []);

            if (erroresLexicos.length > 0) {
                Swal.fire({
                    icon: "error",
                    title: "Errores detectados",
                    text: "Se detectaron errores léxicos. Revisa el reporte.",
                    confirmButtonText: "Ir al reporte"
                })
                setTranslatedCode(result.traduction || "");
                return;
            } else if (erroresSintacticos.length > 0) {
                Swal.fire({
                    icon: "error",
                    title: "Errores detectados",
                    text: "Se detectaron errores sintacticos. Revisa el reporte.",
                    confirmButtonText: "Ir al reporte"
                })
                return;
            }
            setTranslatedCode(result.traduction || "");
        }
    };

    const handlePensumData = async () => {
        const result = await pensumData(editorText);

        if (result) {
            const erroresLexicos = result.errors || [];
            const erroresSintacticos = result.syntacticErrors || [];

            setErrors(erroresLexicos);
            setSyntacticErrors(erroresSintacticos);
            setTokenList(result.tokens || []);

            if (erroresLexicos.length > 0 || erroresSintacticos.length > 0) {
                const tipo = erroresLexicos.length > 0 ? "léxicos" : "sintácticos";

                Swal.fire({
                    icon: "error",
                    title: "Errores detectados",
                    text: `Se detectaron errores ${tipo}. Revisa el reporte.`,
                    confirmButtonText: "Entendido"
                })
                if (erroresLexicos.length > 0) {
                    setTranslatedCode(result.traduction || "");
                }
                return;
            }

            setTranslatedCode(result.traduction || "");
        }
    };

    return (
        <>
            <PensumNavbar onFileClick={handleFileClick} />
            <div className="container">
                <div className="row">
                    {/* Editor de texto en C# */}
                    <div className="col-lg-6 col-md-6 col-sm-12 col-token">
                        <h2>Editor de texto en C#</h2>
                        <textarea
                            className="form-control text-editor"
                            value={editorText}
                            onChange={(e) => setEditorText(e.target.value)}
                            rows="10"
                            cols="50"
                        />
                        <button className="btn btn-analizar" onClick={handlePensumData}>
                            Analizar
                        </button>
                        <button className="btn btn-analizar" onClick={refreshPage}>
                            Limpiar Editor
                        </button>
                    </div>

                    {/* Salida traducida */}
                    <div className="col-lg-6 col-md-6 col-sm-12 col-token">
                        <h2>Salida Traducida a TypeScript</h2>
                        <textarea
                            className="form-control text-editor"
                            value={translatedCode}
                            readOnly
                            rows="10"
                            cols="50"
                        />
                    </div>
                </div>

                {/* Salida de consola + tabla de tokens */}
                <div className="row mt-4">
                    {/* Tabla de tokens */}
                    <div className="col-token col-lg-12 col-md-12 col-sm-12 table-responsive table-bordered table-striped table-h">
                        <h1 className="text-center">Tabla de Tokens</h1>
                        <table className="table table-hover table-bordered table-striped table-success">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Fila</th>
                                    <th scope="col">Columna</th>
                                    <th scope="col">Lexema</th>
                                    <th scope="col">Token</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokenList.map((token, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{token.row}</td>
                                        <td>{token.column}</td>
                                        <td>{token.lexeme}</td>
                                        <td>{token.typeToken}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <br /><br /><br /><br />
            </div>

            {/* File input oculto */}
            <input
                type="file"
                id="fileInput"
                accept=".cs"
                style={{ display: "none" }}
                onChange={handleFileLoad}
            />
        </>
    );
};
