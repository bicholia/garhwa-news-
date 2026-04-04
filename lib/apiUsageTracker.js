import { sql } from '@vercel/postgres';

// Initialize Usage Table
export async function initializeUsageTracker() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS api_usage (
        id SERIAL PRIMARY KEY,
        api_name VARCHAR(100) NOT NULL,
        call_date DATE NOT NULL DEFAULT CURRENT_DATE,
        call_count INTEGER DEFAULT 0,
        last_call_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(api_name, call_date)
      )
    `;
    return { success: true };
  } catch (error) {
    console.error('Usage Tracker Init Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Track API Call
export async function trackApiCall(apiName) {
  try {
    await sql`
      INSERT INTO api_usage (api_name, call_date, call_count, last_call_at)
      VALUES (${apiName}, CURRENT_DATE, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (api_name, call_date)
      DO UPDATE SET 
        call_count = api_usage.call_count + 1,
        last_call_at = CURRENT_TIMESTAMP
    `;
  } catch (error) {
    console.error('Track Call Error:', error.message);
  }
}

// --- Agent Action Logging (PULSE V2) ---

export async function initializeAgentLog() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS agent_actions (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        agent_name VARCHAR(50) DEFAULT 'PULSE',
        type VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'success',
        raw_details JSONB
      )
    `;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logAgentAction({ agent_name = 'PULSE', type, message, status = 'success', details = null }) {
  try {
    await sql`
      INSERT INTO agent_actions (agent_name, type, message, status, raw_details)
      VALUES (${agent_name}, ${type}, ${message}, ${status}, ${details ? JSON.stringify(details) : null})
    `;
  } catch (error) {
    console.error('[Usage Tracker] Log Fail:', error.message);
  }
}

export async function getRecentAgentActions(limit = 50) {
  try {
    const { rows } = await sql`
      SELECT id, TO_CHAR(timestamp, 'HH24:MI:SS') as time, agent_name, type, message, status 
      FROM agent_actions 
      ORDER BY timestamp DESC 
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    console.error('[Usage Tracker] Query Fail:', error.message);
    return [];
  }
}

export async function clearOldAgentLogs(days = 7) {
  try {
    await sql`DELETE FROM agent_actions WHERE timestamp < NOW() - INTERVAL '${days} days'`;
  } catch (error) {}
}

// Get Usage
export async function getApiUsage(apiName) {
  try {
    const { rows } = await sql`
      SELECT call_count FROM api_usage 
      WHERE api_name = ${apiName} AND call_date = CURRENT_DATE
    `;
    return rows[0]?.call_count || 0;
  } catch (error) {
    return 0;
  }
}

// Filter Available APIs based on usage/quota
export async function getAvailableApis(configs) {
  const available = [];
  for (const api of configs) {
    if (!api.enabled) continue;
    const used = await getApiUsage(api.name);
    if (api.freeTier === 'unlimited' || used < api.freeTier) {
      available.push(api);
    }
  }
  return available.sort((a, b) => b.weight - a.weight);
}
