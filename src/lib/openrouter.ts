/**
 * OpenRouter API 연동 모듈
 * Model: Opus 4.6 (Anthropic: Claude 3 Opus 등)
 */

export async function callOpenRouter(prompt: string, userMessage: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY가 설정되지 않았습니다.');
    return 'API 키 프로젝트 설정이 필요합니다.';
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus', // Opus 4.6에 해당하는 모델 ID
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter 호출 중 오류 발생:', error);
    return '서비스 일시 오류';
  }
}
