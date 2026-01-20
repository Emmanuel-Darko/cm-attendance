import { serverSupabaseServiceRole } from '#supabase/server'
import type { locals } from '~/types/database'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event)

    const {data, error} = await client
    .from('locals')
    .select('*')
    .order('name', {ascending: true})
    
    if (error)
        throw createError({ statusCode: 400, statusMessage: error?.message})
    
    return data as locals[]
})