export const config = { runtime: "nodejs18.x" };

const HUBSPOT = "https://api.hubapi.com";

function normalizeEnum(v, allowed){ if(!v) return null; v=String(v).trim().toLowerCase(); return allowed.includes(v)?v:"other"; }
function normalizeMulti(list, allowed){ if(!Array.isArray(list)) return []; const s=new Set(list.map(x=>normalizeEnum(x,allowed)).filter(Boolean)); return [...s]; }

function mapAgent(a){
  const externalId = a.id || `${(a.name||"").trim()}::${(a.vendor||"").trim()}`;
  return {
    external_agent_id: externalId,
    ai_agent_name: a.name || "",
    vendor_name: a.vendor || "",
    category: a.category || "",
    industries_supported: normalizeMulti(a.industries, ["saas","ecommerce","manufacturing","healthcare","finance","other"]),
    supported_integrations: normalizeMulti(a.integrations, ["salesforce","shopify","netsuite","slack","other"]),
    compliance_certifications: normalizeMulti(a.compliance, ["gdpr","soc2","hipaa","other"]),
    price_tier: normalizeEnum(a.price_tier, ["free","trial","standard","enterprise"]),
    price_value: typeof a.price_value==="number" ? a.price_value : null,
    deployment_stats: a.deployment_stats || "",
    demo_url: a.demo_url || ""
  };
}

async function hs(path, init={}){
  const token = process.env.HUBSPOT_TOKEN;
  if(!token) throw new Error("Missing HUBSPOT_TOKEN");
  const r = await fetch(`${HUBSPOT}${path}`, {
    ...init,
    headers:{ "Authorization":`Bearer ${token}`,"Content-Type":"application/json", ...(init.headers||{}) }
  });
  if(!r.ok){ throw new Error(`${path} ${r.status}: ${await r.text()}`); }
  return r.json();
}

async function searchByExternalId(objectTypeId, externalId){
  const body = { limit:1, properties:["external_agent_id"], filterGroups:[{ filters:[{ propertyName:"external_agent_id", operator:"EQ", value:externalId }]}]};
  const j = await hs(`/crm/v3/objects/${objectTypeId}/search`, { method:"POST", body:JSON.stringify(body) });
  return j?.results?.[0]?.id || null;
}

async function fallbackSearchByNameVendor(objectTypeId, name, vendor){
  const body = { limit:1, properties:["ai_agent_name","vendor_name"], filterGroups:[{ filters:[
    { propertyName:"ai_agent_name", operator:"EQ", value:name||"" },
    { propertyName:"vendor_name", operator:"EQ", value:vendor||"" }
  ]}]};
  const j = await hs(`/crm/v3/objects/${objectTypeId}/search`, { method:"POST", body:JSON.stringify(body) });
  return j?.results?.[0]?.id || null;
}

async function createRecord(objectTypeId, properties){
  return hs(`/crm/v3/objects/${objectTypeId}`, { method:"POST", body:JSON.stringify({ properties }) });
}
async function updateRecord(objectTypeId, id, properties){
  return hs(`/crm/v3/objects/${objectTypeId}/${id}`, { method:"PATCH", body:JSON.stringify({ properties }) });
}

async function fetchAgents(){
  const url = process.env.AGENTS_JSON_URL;
  if(!url) throw new Error("Missing AGENTS_JSON_URL");
  const r = await fetch(url, { cache:"no-store" });
  if(!r.ok) throw new Error(`Fetch agents.json failed ${r.status}`);
  const j = await r.json();
  return Array.isArray(j) ? j : (j.items || []);
}

export default async function handler(req,res){
  try{
    const objectTypeId = process.env.HS_AI_AGENT_TYPE_ID;
    if(!objectTypeId) throw new Error("Missing HS_AI_AGENT_TYPE_ID");

    const dry = String(req.query.dry||"") === "1";
    const agents = await fetchAgents();
    const results = [];

    for(const agent of agents){
      const props = mapAgent(agent);
      let id = props.external_agent_id
        ? await searchByExternalId(objectTypeId, props.external_agent_id)
        : await fallbackSearchByNameVendor(objectTypeId, props.ai_agent_name, props.vendor_name);

      if(dry){
        results.push({ action: id ? "would update":"would create", name: props.ai_agent_name });
      }else if(id){
        await updateRecord(objectTypeId, id, props);
        results.push({ action:"updated", id, name: props.ai_agent_name });
      }else{
        const created = await createRecord(objectTypeId, props);
        results.push({ action:"created", id: created.id, name: props.ai_agent_name });
      }
      await new Promise(r=>setTimeout(r,120));
    }

    res.status(200).json({ ok:true, count:results.length, results });
  }catch(e){
    res.status(500).json({ ok:false, error:String(e) });
  }
}
