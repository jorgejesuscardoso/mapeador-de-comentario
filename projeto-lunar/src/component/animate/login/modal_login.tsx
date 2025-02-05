import { useEffect, useState } from "react";
import { ContainerAnimated } from "./style"
import { useNavigate } from "react-router-dom";

const AnimatedLogin = () => {
    
    const [index, setIndex] = useState(0);
    const [gifs, setGifs] = useState("");
    const navigate = useNavigate();

    const LoginAnimated = () => {
        const frases = [
            "Esquentando os motores",
            "Decolando",
            "Em órbita",
            "Chegando à Lua",
            "Pousando"
        ];
    
        useEffect(() => {
            if (index >= frases.length - 1) {
                setGifs("end-trip.mp4");
                setTimeout(() => navigate('/home'), 2000); // Aguarda 1s antes de redirecionar
                return; // Para de executar o efeito
            }
            

            const intervalo = setInterval(() => {
                setIndex((prevIndex) => prevIndex + 1);
            }, 1000); // Troca a frase a cada 1s
    
            return () => {
                clearInterval(intervalo); // Limpa o intervalo ao desmontar ou mudar o index
            };

        }, [index, navigate, frases.length]);
    
        return <span>
            <video
                src={gifs}
                autoPlay
                loop
                muted
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
            />
            {frases[index]}
        </span>;
    };

    return (
        <ContainerAnimated>
            <span>{ LoginAnimated() }</span>
        </ContainerAnimated>
    )
}

export default AnimatedLogin;