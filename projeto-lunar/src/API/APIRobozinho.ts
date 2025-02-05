export const Robozinho = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout

    try {
        const response = await fetch("http://localhost:3000", {
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar comentários.");
    } finally {
        clearTimeout(timeout);
    }
}
