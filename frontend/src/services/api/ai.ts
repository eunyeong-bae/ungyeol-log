export const explainTerm = async(
    term: string,
    context: string,
    sajuContext?: string
): Promise<string> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/term-explain`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({term, context, sajuContext}),
    });

    if(!response.ok){
        let message  = 'AI 설명 생성에 실패했습니다';

        try{
            const error = await response.json();
            message = error.error || message;
        }catch{}
        throw new Error(message);
    }

    const {explanation} = await response.json();
    return explanation;
}