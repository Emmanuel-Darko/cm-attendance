import type { Database } from "~/types/database"

export const useSessions = async () => {
    const supabase = useSupabaseClient<Database>()
    const title = ref('')
    const date = ref(null)
    const sessions = useState<Database['public']['Tables']['sessions']['Row'][]>('sessions', () => [])
    
    async function createSession() {
        const { error } = await supabase.from('sessions')
        .insert([
            { title: title.value, date: date.value, is_open: true } as Database['public']['Tables']['sessions']['Insert']
        ])
        if (!error) {
            await fetchSessions()
            title.value = ''
        }
    }
    
    async function fetchSessions() {
        const { data } = await supabase.from('sessions').select('*').order('created_at', { ascending: false })
        sessions.value = data ?? []
    }

    async function closeSession(id: string) {
        await supabase.from('sessions').update({ is_open: false }).eq('id', id)
        await fetchSessions()
    }

    return {
        title,
        date,
        sessions,
        createSession,
        fetchSessions,
        closeSession
    }
}