import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database, SoulStatus } from '~/types/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const supabase = serverSupabaseServiceRole<Database>(event)

  // Fetch target, teams, winners, souls in parallel
  const [
    { data: targetData },
    { data: teams, error: teamsError },
    { data: winners, error: winnersError },
    { data: souls, error: soulsError }
  ] = await Promise.all([
    supabase.from('soul_targets').select('target_count, monthly_target, project_title').eq('id', 1).maybeSingle(),
    supabase.from('soul_teams').select('*'),
    supabase.from('soul_winners').select('*'),
    supabase.from('souls').select('*').order('created_at', { ascending: false })
  ])

  if (teamsError) {
    throw createError({ statusCode: 400, statusMessage: teamsError.message })
  }
  if (winnersError) {
    throw createError({ statusCode: 400, statusMessage: winnersError.message })
  }
  if (soulsError) {
    throw createError({ statusCode: 400, statusMessage: soulsError.message })
  }

  const target = targetData?.target_count || 800000
  const monthly_target = targetData?.monthly_target || 75
  const project_title = targetData?.project_title || "Chairman's 800,000 Souls Project"

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

  const total_souls = (souls || []).length

  // Determine current and requested month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const selected_month = query.month && typeof query.month === 'string' && /^\d{4}-\d{2}$/.test(query.month)
    ? query.month
    : currentMonth

  // Collect all unique months from soul records
  const monthsSet = new Set<string>()
  monthsSet.add(currentMonth)
  for (const s of souls || []) {
    if (s.date_won && s.date_won.length >= 7) {
      monthsSet.add(s.date_won.slice(0, 7))
    }
  }
  const available_months = Array.from(monthsSet).sort().reverse()

  let monthly_souls = 0

  const status_breakdown: Record<SoulStatus, number> = {
    new: 0,
    contacted: 0,
    in_discipleship: 0,
    baptized: 0,
    integrated: 0
  }

  const teamCountMap = new Map<string, number>()
  const winnerCountMap = new Map<string, number>()

  for (const s of souls || []) {
    // Check if won in selected month
    if (s.date_won && s.date_won.startsWith(selected_month)) {
      monthly_souls++
    }

    const st = s.status as SoulStatus
    if (status_breakdown[st] !== undefined) {
      status_breakdown[st]++
    } else {
      status_breakdown.new++
    }

    const winner = winnerMap.get(s.won_by)
    if (winner) {
      winnerCountMap.set(winner.id, (winnerCountMap.get(winner.id) || 0) + 1)
      if (winner.team_id) {
        teamCountMap.set(winner.team_id, (teamCountMap.get(winner.team_id) || 0) + 1)
      }
    }
  }

  // Team leaderboard (include all teams, sorted desc by soul count)
  const team_leaderboard = (teams || []).map((t) => ({
    team_id: t.id,
    team_name: t.name,
    color_tag: t.color_tag || 'amber',
    count: teamCountMap.get(t.id) || 0
  })).sort((a, b) => b.count - a.count)

  // Top winners (include winners with > 0 souls first, sorted desc, limit 10)
  const top_winners = (winners || []).map((w) => {
    const team = teamMap.get(w.team_id)
    return {
      winner_id: w.id,
      full_name: w.full_name,
      team_name: team?.name || 'Unknown Team',
      team_color_tag: team?.color_tag || 'amber',
      count: winnerCountMap.get(w.id) || 0
    }
  })
  .sort((a, b) => b.count - a.count)
  .slice(0, 10)

  // Recent 10 souls
  const recent_souls = (souls || []).slice(0, 10).map((s) => {
    const winner = winnerMap.get(s.won_by)
    return {
      id: s.id,
      full_name: s.full_name,
      team_id: winner?.team_id || '',
      team_name: winner?.team_name || 'Unknown Team',
      team_color_tag: winner?.team_color_tag || 'amber',
      won_by_id: s.won_by,
      won_by_name: winner?.full_name || 'Unknown Winner',
      date_won: s.date_won,
      status: s.status,
      created_at: s.created_at
    }
  })

  return {
    target,
    monthly_target,
    project_title,
    total_souls,
    monthly_souls,
    selected_month,
    available_months,
    status_breakdown,
    team_leaderboard,
    top_winners,
    recent_souls
  }
})
