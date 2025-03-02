/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { GetFromLocalStorage } from "../../utils/localstorage";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage === null) {
            navigate('/');
            return;
        }
    }, []);
    return (
        <div>
            <div>
                <button>
                    <Link
                        to='/register'
                    >
                        Cadastrar novo membro
                    </Link>
                </button>
                <button>
                    <Link
                        to='/member'
                    >
                        Listar membros
                    </Link>
                </button>
            </div>
            <div>
                <button>
                    <Link
                        to='/manager'
                    >
                        Gerenciar membros
                    </Link>
                </button>
            </div>
        </div>
    )
};

export default Dashboard;