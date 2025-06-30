import { useState } from "react"
import { pensumData } from "../Api/ApiTranspilador"
import { useEditor, useError } from "../context/ErrorContext";
import Swal from "sweetalert2";
import { PensumNavbar } from "./Navbar";

export const Inicial = () => {
    const { editorText, setEditorText } = useEditor();
    const [tokenList, setTokenList] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [prerrequisitosRecursivos, setPrerrequisitosRecursivos] = useState([]);
    const { setErrors } = useError();

    const refreshPage = () => {
        window.location.reload();
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

    const handlePensumData = async () => {
        const result = await pensumData(editorText);
        if (result) {
            const errores = result.errors || [];
            setErrors(errores);
            if (errores.length > 0) {
                setTokenList(result.tokens || []);
                Swal.fire({
                    icon: 'error',
                    title: 'Errores detectados',
                    text: 'Se detectaron errores. Puedes verlos en la sección de Reporte.',
                    confirmButtonText: 'OK'
                })
            } else {
                setTokenList(result.tokens || []);
                setCarreras(result.carreras || []);
            }
        }
    };

    const encontrarPrerrequisitosRecursivos = (codigoCurso, carrera) => {
        const encontrados = new Set();
        const buscar = (codigo) => {
            for (const semestre of carrera.semestres) {
                for (const curso of semestre.cursos) {
                    if (curso.codigo === codigo) {
                        curso.prerrequisitos.forEach(pr => {
                            if (!encontrados.has(pr)) {
                                encontrados.add(pr);
                                buscar(pr);
                            }
                        });
                    }
                }
            }
        };
        buscar(codigoCurso);
        return Array.from(encontrados);
    };

    const handleCursoClick = (codigoCurso) => {
        setCursoSeleccionado(codigoCurso);
        if (carreraSeleccionada) {
            const prereqs = encontrarPrerrequisitosRecursivos(codigoCurso, carreraSeleccionada);
            setPrerrequisitosRecursivos(prereqs);
        }
    };

    return (
        <>
            <PensumNavbar onFileClick={handleFileClick} />
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-token">
                        <textarea className="form-control text-editor"
                            value={editorText}
                            onChange={(e) => setEditorText(e.target.value)}
                            rows="10"
                            cols="50"
                        />
                        <button className="btn btn-analizar" onClick={handlePensumData}>Analizar</button>
                        <button className="btn btn-analizar" onClick={refreshPage}>Limpiar Editor</button>
                    </div>
                    <div className="col-token col-lg-6 col-md-6 col-sm-12 table-responsive table-bordered table-striped table-h">
                        <h1 className="text-center">Tabla de Tokens</h1>
                        <table className="table table-hover table-bordered table-striped table-warning">
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

                <div className="row mt-4">
                    <h1 className="text-center">Carreras</h1>
                    <div className="text-center">
                        {carreras.map((carrera, index) => (
                            <button
                                key={index}
                                className="btn btn-primary m-2"
                                onClick={() => {
                                    setCarreraSeleccionada(carrera);
                                    setCursoSeleccionado(null);
                                    setPrerrequisitosRecursivos([]);
                                }}
                            >
                                {carrera.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                {carreraSeleccionada && (
                    <div className="mt-4 mb-4">
                        <h2 className="text-center">{carreraSeleccionada.nombre}</h2>
                        <div className="row">
                            {carreraSeleccionada.semestres.map((semestre, index) => (
                                <div key={index} className="col border">
                                    <h5 className="text-center">Semestre {semestre.numero}</h5>
                                    {semestre.cursos.map((curso, i) => {
                                        const esSeleccionado = curso.codigo === cursoSeleccionado;
                                        const esPrerrequisito = prerrequisitosRecursivos.includes(curso.codigo);
                                        const clase = esSeleccionado ? 'bg-success text-white' : esPrerrequisito ? 'bg-warning' : 'bg-light';
                                        return (
                                            <div
                                                key={i}
                                                className={`m-2 p-2 border rounded text-center curso-box ${clase}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleCursoClick(curso.codigo)}
                                            >
                                                <strong>{curso.codigo}</strong><br />
                                                {curso.nombre}
                                                <p>Area: {curso.area}</p>
                                                <p>Prerrequisito: {curso.prerrequisitos.join(',')}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <input
                type="file"
                id="fileInput"
                accept=".cs"
                style={{ display: 'none' }}
                onChange={handleFileLoad}
            />
        </>
    )
};
