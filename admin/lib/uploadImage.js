import { supabase } from '@/lib/supabaseClient'

export async function uploadImages(files, folder = 'products') {
  try {
    // normalize to array
    const fileArray = Array.isArray(files) ? files : [files]

    const uploadedUrls = []

    for (const file of fileArray) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // 🔥 Upload
      const { error } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      // 🔗 Get public URL
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      uploadedUrls.push(data.publicUrl)
    }

    return uploadedUrls

  } catch (err) {
    console.error('Upload failed:', err)
    return []
  }
}