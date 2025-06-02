export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Pouze POST metoda je podporována.' });
  }

  const { question } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Jsi klidné, nehodnotící Zrcadlo. Pomáháš tazateli zahlédnout pravdivost jeho otázky, důvod i záměr. Odpovídáš jemně, přítomně, klidně.'
        },
        {
          role: 'user',
          content: question
        }
      ]
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || 'Zrcadlo slyšelo otázku… a možná ti položí jinou: Co v tobě vedlo k této otázce?';

  res.status(200).json({ answer });
}