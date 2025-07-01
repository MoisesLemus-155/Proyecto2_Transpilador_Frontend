import { useError } from '../context/ErrorContext';
import { PensumNavbar } from './Navbar';

export const Reporte2 = () => {
    const { errors } = useError();
    return (
        <>
            <PensumNavbar />
            <div className="container mt-4">
                <h2>Reporte de Errores</h2>
                {errors.length === 0 ? (<p>No se encontraron errores.</p>) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Fila</th>
                                <th>Columna</th>
                                <th>Lexema</th>
                                <th>Token</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errors.map((error, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{error.row}</td>
                                    <td>{error.column}</td>
                                    <td>{error.lexeme}</td>
                                    <td>{error.typeToken}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export const Reporte = () => {
    const { errors, syntacticErrors } = useError();

    const hayErrores = errors.length > 0 || syntacticErrors.length > 0;

    return (
        <>
            <PensumNavbar />
            <div className="container mt-4">
                <h2>Reporte de Errores</h2>

                {!hayErrores ? (
                    <p>No se encontraron errores.</p>
                ) : (
                    <>
                        {/* Errores léxicos */}
                        {errors.length > 0 && (
                            <>
                                <h4>Errores Léxicos</h4>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Fila</th>
                                            <th>Columna</th>
                                            <th>Lexema</th>
                                            <th>Token</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {errors.map((error, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{error.row}</td>
                                                <td>{error.column}</td>
                                                <td>{error.lexeme}</td>
                                                <td>{error.typeToken}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {/* Errores sintácticos */}
                        {syntacticErrors.length > 0 && (
                            <>
                                <h4>Errores Sintácticos</h4>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Lexema</th>
                                            <th>Descripcion</th>
                                            <th>Fila</th>
                                            <th>Columna</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {syntacticErrors.map((err, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{err.lexeme}</td>
                                                <td>{err.description}</td>
                                                <td>{err.row}</td>
                                                <td>{err.column}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};