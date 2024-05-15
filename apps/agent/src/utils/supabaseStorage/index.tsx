export const getAvatarURL = (path: string) =>
  `${import.meta.env.ILLA_SUPABASE_URL}/storage/v1/object/public/avatars/${path}`
