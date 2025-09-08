export const GenerateResetCode = (): string => {
    // Gera um código aleatório de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
}
