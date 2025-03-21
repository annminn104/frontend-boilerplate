import { supabase } from './supabase'

export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage.from('images').upload(`${path}/${Date.now()}-${file.name}`, file)

  if (error) throw error
  return data.path
}
