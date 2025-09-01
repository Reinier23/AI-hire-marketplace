export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    has_HUBSPOT_TOKEN: !!process.env.HUBSPOT_TOKEN,
    HS_AI_AGENT_TYPE_ID: process.env.HS_AI_AGENT_TYPE_ID || null,
    AGENTS_JSON_URL: process.env.AGENTS_JSON_URL || null,
  });
}
