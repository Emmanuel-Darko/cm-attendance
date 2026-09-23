import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const supabase = serverSupabaseServiceRole<Database>(event)

  // Fetch winners and teams to join in memory
  const [{ data: winners }, { data: teams }] = await Promise.all([
    supabase.from('soul_winners').select('id, full_name, team_id'),
    supabase.from('soul_teams').select('id, name, color_tag')
  ])

  const teamMap = new Map<string, { id: string; name: string; color_tag: string }>()
  for (const t of teams || []) {
    teamMap.set(t.id, t)
  }

  const winnerMap = new Map<string, { id: string; full_name: string; team_id: string; team_name: string; team_color_tag: string }>()
  for (const w of winners || []) {
    const team = teamMap.get(w.team_id)
    winnerMap.set(w.id, {
      id: w.id,
      full_name: w.full_name,
      team_id: w.team_id,
      team_name: team?.name || 'Unknown Team',
      team_color_tag: team?.color_tag || 'amber'
    })
  }

  // Filter winners if team_id filter is passed
  let allowedWinnerIds: string[] | null = null
  if (query.team_id && query.team_id !== 'all') {
    allowedWinnerIds = (winners || [])
      .filter((w) => w.team_id === query.team_id)
      .map((w) => w.id)
  }

  let request = supabase
    .from('souls')
    .select('*')
    .order('date_won', { ascending: false })
    .order('created_at', { ascending: false })

  if (query.status && query.status !== 'all') {
    request = request.eq('status', String(query.status))
  }

  if (query.won_by && query.won_by !== 'all') {
    request = request.eq('won_by', String(query.won_by))
  } else if (allowedWinnerIds !== null) {
    if (allowedWinnerIds.length === 0) {
      return []
    }
    request = request.in('won_by', allowedWinnerIds)
  }

  if (query.date_from) {
    request = request.gte('date_won', String(query.date_from))
  }

  if (query.date_to) {
    request = request.lte('date_won', String(query.date_to))
  }

  if (query.search) {
    const search = String(query.search).replace(/[%_]/g, '\\$&')
    request = request.or(
      `full_name.ilike.%${search}%,location.ilike.%${search}%,phone.ilike.%${search}%,notes.ilike.%${search}%`
    )
  }

  const { data: souls, error } = await request

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return (souls || []).map((soul) => {
    const winner = winnerMap.get(soul.won_by)
    return {
      ...soul,
      won_by_name: winner?.full_name || 'Unknown Winner',
      team_id: winner?.team_id || '',
      team_name: winner?.team_name || 'Unknown Team',
      team_color_tag: winner?.team_color_tag || 'amber'
    }
  })
})
