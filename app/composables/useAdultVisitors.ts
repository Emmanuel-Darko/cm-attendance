// composables/useAdultVisitors.ts
//
// Handles fetching, creating, updating, and deleting adult visitor /
// new-member records against the /api/adult-visitors endpoints.

export type FollowUpStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'no_response'

export interface AdultVisitor {
  id: string
  first_name: string
  last_name: string
  email?: string | null
  phone?: string | null
  visit_date: string
  first_time_guest: boolean
  address?: string | null
  occupation?: string | null
  how_heard?: string | null
  interested_in: string[]
  assigned_to?: string | null
  follow_up_status: FollowUpStatus
  notes?: string | null
  created_at: string
  updated_at: string
}

export type AdultVisitorInput = Partial<
  Omit<AdultVisitor, 'id' | 'created_at' | 'updated_at'>
> & {
  first_name: string
  last_name: string
}

export const useAdultVisitors = () => {
  const visitors = useState<AdultVisitor[]>('adult-visitors', () => [])
  const pending = useState<boolean>('adult-visitors-pending', () => false)
  const error = useState<string | null>('adult-visitors-error', () => null)

  const fetchVisitors = async (filters?: { status?: string; search?: string }) => {
    pending.value = true
    error.value = null
    try {
      visitors.value = await $fetch<AdultVisitor[]>('/api/adult-visitors', {
        query: filters
      })
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not load visitor records.'
    } finally {
      pending.value = false
    }
  }

  const addVisitor = async (input: AdultVisitorInput) => {
    error.value = null
    try {
      const created = await $fetch<AdultVisitor>('/api/adult-visitors', {
        method: 'POST',
        body: input
      })
      visitors.value = [created, ...visitors.value]
      return created
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not save this visitor.'
      throw err
    }
  }

  const updateVisitor = async (id: string, patch: Partial<AdultVisitorInput>) => {
    error.value = null
    try {
      const updated = await $fetch<AdultVisitor>(`/api/adult-visitors/${id}`, {
        method: 'PATCH',
        body: patch
      })
      const index = visitors.value.findIndex((v) => v.id === id)
      if (index !== -1) visitors.value[index] = updated
      return updated
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not update this visitor.'
      throw err
    }
  }

  const removeVisitor = async (id: string) => {
    error.value = null
    try {
      await $fetch(`/api/adult-visitors/${id}`, { method: 'DELETE' })
      visitors.value = visitors.value.filter((v) => v.id !== id)
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Could not remove this visitor.'
      throw err
    }
  }

  return {
    visitors,
    pending,
    error,
    fetchVisitors,
    addVisitor,
    updateVisitor,
    removeVisitor
  }
}
