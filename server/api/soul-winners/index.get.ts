import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const supabase = serverSupabaseServiceRole<Database>(event)

  // Fetch winners optionally filtered by team_id
  let winnersRequest = supabase
    .from('soul_winners')
    .select('*')
    .order('full_name', { ascending: true })

  if (query.team_id && typeof query.team_id === 'string' && query.team_id !== 'all') {
    winnersRequest = winnersRequest.eq('team_id', query.team_id)
  }

  const { data: winners, error: winnersError } = await winnersRequest

  if (winnersError) {
    throw createError({ statusCode: 400, statusMessage: winnersError.message })
  }

  // Fetch teams to attach team details
  const { data: teams, error: teamsError } = await supabase
    .from('soul_teams')
    .select('*')

  if (teamsError) {
    throw createError({ statusCode: 400, statusMessage: teamsError.message })
  }

  const teamMap = new Map<string, { name: string; color_tag: string }>()
  for (const t of teams || []) {
    teamMap.set(t.id, { name: t.name, color_tag: t.color_tag })
  }

  // Fetch souls to compute soul_count per winner
  const { data: souls, error: soulsError } = await supabase
    .from('souls')
    .select('id, won_by')

  if (soulsError) {
    throw createError({ statusCode: 400, statusMessage: soulsError.message })
  }

  const soulCountMap = new Map<string, number>()
  for (const s of souls || []) {
    soulCountMap.set(s.won_by, (soulCountMap.get(s.won_by) || 0) + 1)
  }

  return (winners || []).map((w) => {
    const team = teamMap.get(w.team_id)
    return {
      ...w,
      team_name: team?.name || 'Unknown Team',
      team_color_tag: team?.color_tag || 'amber',
      soul_count: soulCountMap.get(w.id) || 0
    }
  })
})
