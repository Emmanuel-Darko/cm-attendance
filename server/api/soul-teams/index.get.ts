import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)

  // Fetch teams ordered by name
  const { data: teams, error: teamsError } = await supabase
    .from('soul_teams')
    .select('*')
    .order('name', { ascending: true })

  if (teamsError) {
    throw createError({ statusCode: 400, statusMessage: teamsError.message })
  }

  // Fetch winners to map winner -> team
  const { data: winners, error: winnersError } = await supabase
    .from('soul_winners')
    .select('id, team_id')

  if (winnersError) {
    throw createError({ statusCode: 400, statusMessage: winnersError.message })
  }

  // Fetch souls to count per team
  const { data: souls, error: soulsError } = await supabase
    .from('souls')
    .select('id, won_by')

  if (soulsError) {
    throw createError({ statusCode: 400, statusMessage: soulsError.message })
  }

  const winnerTeamMap = new Map<string, string>()
  const teamMemberCountMap = new Map<string, number>()
  for (const w of winners || []) {
    winnerTeamMap.set(w.id, w.team_id)
    teamMemberCountMap.set(w.team_id, (teamMemberCountMap.get(w.team_id) || 0) + 1)
  }

  const teamSoulCountMap = new Map<string, number>()
  for (const s of souls || []) {
    const teamId = winnerTeamMap.get(s.won_by)
    if (teamId) {
      teamSoulCountMap.set(teamId, (teamSoulCountMap.get(teamId) || 0) + 1)
    }
  }

  return (teams || []).map((team) => ({
    ...team,
    member_count: teamMemberCountMap.get(team.id) || 0,
    soul_count: teamSoulCountMap.get(team.id) || 0
  }))
})
