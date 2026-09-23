// composables/useSoulsTracking.ts
//
// Composable for the Chairman's 800,000 Souls Project.
// Provides reactive state and actions for teams, winners, souls, and dashboard summary.

import type { SoulStatus } from '~/types/database'

export interface SoulTeamItem {
  id: string
  name: string
  color_tag: string
  created_at: string
  member_count?: number
  soul_count?: number
}

export interface SoulWinnerItem {
  id: string
  full_name: string
  team_id: string
  phone: string | null
  created_at: string
  team_name?: string
  team_color_tag?: string
  soul_count?: number
}

export interface SoulRecord {
  id: string
  full_name: string
  phone: string | null
  location: string | null
  date_won: string
  status: SoulStatus
  won_by: string
  won_by_name?: string
  team_id?: string
  team_name?: string
  team_color_tag?: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SoulInput {
  full_name: string
  phone?: string | null
  location?: string | null
  date_won?: string
  status?: SoulStatus
  won_by: string
  notes?: string | null
}

export interface TeamLeaderboardItem {
  team_id: string
  team_name: string
  color_tag: string
  count: number
}

export interface TopWinnerItem {
  winner_id: string
  full_name: string
  team_name: string
  team_color_tag?: string
  count: number
}

export interface RecentSoulItem {
  id: string
  full_name: string
  team_id?: string
  team_name: string
  team_color_tag?: string
  won_by_id?: string
  won_by_name: string
  date_won: string
  status: SoulStatus
  created_at?: string
}

export interface SoulsSummary {
  target: number
  monthly_target: number
  project_title: string
  total_souls: number
  monthly_souls: number
  selected_month?: string
  available_months?: string[]
  status_breakdown: Record<SoulStatus, number>
  team_leaderboard: TeamLeaderboardItem[]
  top_winners: TopWinnerItem[]
  recent_souls: RecentSoulItem[]
}

export interface SoulsFilterParams {
  search?: string
  team_id?: string
  won_by?: string
  status?: string
  date_from?: string
  date_to?: string
}

export const useSoulsTracking = () => {
  const souls = useState<SoulRecord[]>('souls-tracking-list', () => [])
  const teams = useState<SoulTeamItem[]>('souls-tracking-teams', () => [])
  const winners = useState<SoulWinnerItem[]>('souls-tracking-winners', () => [])
  const summary = useState<SoulsSummary | null>('souls-tracking-summary', () => null)
  const loading = useState<boolean>('souls-tracking-loading', () => false)
  const error = useState<string | null>('souls-tracking-error', () => null)

  // All-time 800k target progress
  const allTimeProgressPercent = computed(() => {
    if (!summary.value || !summary.value.target || summary.value.target <= 0) return 0
    return (summary.value.total_souls / summary.value.target) * 100
  })

  const clampedAllTimeProgressPercent = computed(() => {
    return Math.min(100, Math.max(0, allTimeProgressPercent.value))
  })

  // District Monthly (75 souls/month) progress
  const monthlyProgressPercent = computed(() => {
    if (!summary.value || !summary.value.monthly_target || summary.value.monthly_target <= 0) return 0
    return (summary.value.monthly_souls / summary.value.monthly_target) * 100
  })

  const clampedMonthlyProgressPercent = computed(() => {
    return Math.min(100, Math.max(0, monthlyProgressPercent.value))
  })

  // Summary
  const fetchSummary = async (month?: string) => {
    try {
      const query = month ? { month } : undefined
      summary.value = await $fetch<SoulsSummary>('/api/souls/summary', { query })
      return summary.value
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not load project summary.'
      throw err
    }
  }

  // Souls
  const fetchSouls = async (filters?: SoulsFilterParams) => {
    loading.value = true
    error.value = null
    try {
      souls.value = await $fetch<SoulRecord[]>('/api/souls', {
        query: filters
      })
      return souls.value
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not load souls records.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addSoul = async (payload: SoulInput) => {
    error.value = null
    try {
      const created = await $fetch<SoulRecord>('/api/souls', {
        method: 'POST',
        body: payload
      })
      souls.value = [created, ...souls.value]
      // Refresh summary in background to keep stats in sync
      fetchSummary().catch(() => {})
      return created
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not save soul record.'
      throw err
    }
  }

  const updateSoul = async (id: string, patch: Partial<SoulInput>) => {
    error.value = null
    try {
      const updated = await $fetch<SoulRecord>(`/api/souls/${id}`, {
        method: 'PATCH',
        body: patch
      })
      const index = souls.value.findIndex((s) => s.id === id)
      if (index !== -1) souls.value[index] = updated
      fetchSummary().catch(() => {})
      return updated
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not update soul record.'
      throw err
    }
  }

  const updateSoulStatus = async (id: string, status: SoulStatus) => {
    return updateSoul(id, { status })
  }

  const deleteSoul = async (id: string) => {
    error.value = null
    try {
      await $fetch(`/api/souls/${id}`, { method: 'DELETE' })
      souls.value = souls.value.filter((s) => s.id !== id)
      fetchSummary().catch(() => {})
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not remove soul record.'
      throw err
    }
  }

  // Teams
  const fetchTeams = async () => {
    try {
      teams.value = await $fetch<SoulTeamItem[]>('/api/soul-teams')
      return teams.value
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not load teams.'
      throw err
    }
  }

  const addTeam = async (payload: { name: string; color_tag?: string }) => {
    error.value = null
    try {
      const created = await $fetch<SoulTeamItem>('/api/soul-teams', {
        method: 'POST',
        body: payload
      })
      teams.value = [...teams.value, { ...created, member_count: 0, soul_count: 0 }].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      fetchSummary().catch(() => {})
      return created
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not create team.'
      throw err
    }
  }

  const updateTeam = async (id: string, payload: { name?: string; color_tag?: string }) => {
    error.value = null
    try {
      const updated = await $fetch<SoulTeamItem>(`/api/soul-teams/${id}`, {
        method: 'PATCH',
        body: payload
      })
      const index = teams.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        teams.value[index] = { ...teams.value[index], ...updated }
      }
      fetchSummary().catch(() => {})
      return updated
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not update team.'
      throw err
    }
  }

  const deleteTeam = async (id: string) => {
    error.value = null
    try {
      await $fetch(`/api/soul-teams/${id}`, { method: 'DELETE' })
      teams.value = teams.value.filter((t) => t.id !== id)
      fetchSummary().catch(() => {})
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not delete team.'
      throw err
    }
  }

  // Winners
  const fetchWinners = async (teamId?: string) => {
    try {
      const query = teamId && teamId !== 'all' ? { team_id: teamId } : undefined
      const data = await $fetch<SoulWinnerItem[]>('/api/soul-winners', { query })
      if (!teamId || teamId === 'all') {
        winners.value = data
      }
      return data
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not load soul winners.'
      throw err
    }
  }

  const addWinner = async (payload: { full_name: string; team_id: string; phone?: string | null }) => {
    error.value = null
    try {
      const created = await $fetch<SoulWinnerItem>('/api/soul-winners', {
        method: 'POST',
        body: payload
      })
      winners.value = [...winners.value, created].sort((a, b) => a.full_name.localeCompare(b.full_name))
      // Update team member count in local state
      const teamIdx = teams.value.findIndex((t) => t.id === payload.team_id)
      if (teamIdx !== -1) {
        teams.value[teamIdx].member_count = (teams.value[teamIdx].member_count || 0) + 1
      }
      return created
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not add soul winner.'
      throw err
    }
  }

  const updateWinner = async (
    id: string,
    payload: { full_name?: string; team_id?: string; phone?: string | null }
  ) => {
    error.value = null
    try {
      const updated = await $fetch<SoulWinnerItem>(`/api/soul-winners/${id}`, {
        method: 'PATCH',
        body: payload
      })
      const index = winners.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        winners.value[index] = { ...winners.value[index], ...updated }
      }
      return updated
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not update soul winner.'
      throw err
    }
  }

  const deleteWinner = async (id: string) => {
    error.value = null
    try {
      await $fetch(`/api/soul-winners/${id}`, { method: 'DELETE' })
      const winner = winners.value.find((w) => w.id === id)
      if (winner) {
        const teamIdx = teams.value.findIndex((t) => t.id === winner.team_id)
        if (teamIdx !== -1 && (teams.value[teamIdx].member_count || 0) > 0) {
          teams.value[teamIdx].member_count!--
        }
      }
      winners.value = winners.value.filter((w) => w.id !== id)
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not delete soul winner.'
      throw err
    }
  }

  return {
    souls,
    teams,
    winners,
    summary,
    loading,
    error,
    allTimeProgressPercent,
    clampedAllTimeProgressPercent,
    monthlyProgressPercent,
    clampedMonthlyProgressPercent,
    fetchSummary,
    fetchSouls,
    addSoul,
    updateSoul,
    updateSoulStatus,
    deleteSoul,
    fetchTeams,
    addTeam,
    updateTeam,
    deleteTeam,
    fetchWinners,
    addWinner,
    updateWinner,
    deleteWinner
  }
}
