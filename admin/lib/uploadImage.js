import { supabase } from '@/lib/supabaseClient'

/**
 * Uploads images to a specified Supabase storage bucket.
 * * @param {File | File[]} files - The file(s) to upload.
 * @param {string} bucketName - The name of the Supabase bucket (e.g., 'products', 'categories').
 * @param {string} folderPath - Optional folder path inside the bucket.
 * @returns {Promise<string[]>} Array of public URLs for the uploaded images.
 */
export async function uploadImages(files, bucketName = 'products', folderPath = '') {
  try {
    // normalize to array
    const fileArray = Array.isArray(files) ? files : [files]

    const uploadedUrls = []

    for (const file of fileArray) {
      const fileExt = file.name.split('.').pop()
      // Added a slightly cleaner random string generator for the filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // If a folderPath is provided, put it in the folder, otherwise put it at the root of the bucket
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

      // 🔥 Upload dynamically to the requested bucket
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file)

      if (error) {
        console.error(`Upload error for ${file.name}:`, error)
        continue // Skip this file but try the others
      }

      // 🔗 Get public URL dynamically from the requested bucket
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      uploadedUrls.push(data.publicUrl)
    }

    return uploadedUrls

  } catch (err) {
    console.error('Upload failed:', err)
    return []
  }
}