import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Soul ID is required.' })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Only administrators can promote a soul to the church directory.' })
  }

  // Fetch soul details with winner and team
  const { data: soul, error: soulError } = await supabase
    .from('souls')
    .select('*, soul_winners(full_name, soul_teams(name))')
    .eq('id', id)
    .single()

  if (soulError || !soul) {
    throw createError({ statusCode: 404, statusMessage: 'Soul record not found.' })
  }

  const winnerData = soul.soul_winners as any
  const winnerName = winnerData?.full_name || 'Soul Winner'
  const teamName = winnerData?.soul_teams?.name || 'Soul Winning Team'

  // Parse name into first and last name
  const nameParts = (soul.full_name || '').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Soul'
  const lastName = nameParts.slice(1).join(' ') || nameParts[0]

  // Check if visitor with same name/phone already exists in adult_visitors
  let existingQuery = supabase.from('adult_visitors').select('id')
  if (soul.phone) {
    existingQuery = existingQuery.eq('phone', soul.phone)
  } else {
    existingQuery = existingQuery.eq('first_name', firstName).eq('last_name', lastName)
  }
  const { data: existingVisitor } = await existingQuery.maybeSingle()

  if (existingVisitor) {
    throw createError({
      statusCode: 409,
      statusMessage: `This person (${soul.full_name}) is already registered in the Adult Visitors directory.`
    })
  }

  // Insert into adult_visitors
  const { data: newVisitor, error: insertError } = await supabase
    .from('adult_visitors')
    .insert({
      first_name: firstName,
      last_name: lastName,
      phone: soul.phone || null,
      address: soul.location || null,
      visit_date: soul.date_won || new Date().toISOString().slice(0, 10),
      first_time_guest: false,
      how_heard: `Evangelism (${teamName})`,
      assigned_to: winnerName,
      follow_up_status: 'contacted',
      interested_in: ['membership', 'small_groups'],
      notes: `Promoted from Chairman's Souls Project. Won by ${winnerName} (${teamName}). ${soul.notes ? 'Notes: ' + soul.notes : ''}`.trim()
    })
    .select()
    .single()

  if (insertError) {
    throw createError({ statusCode: 400, statusMessage: insertError.message })
  }

  setResponseStatus(event, 201)
  return newVisitor
})
