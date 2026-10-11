import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const revalidatePage: CollectionAfterChangeHook = ({ doc }) => {
  const path = doc?.slug === 'home' || !doc?.slug ? '/' : `/tours/${doc.slug}`
  try {
    revalidatePath(path)
    revalidateTag('tours')
  } catch (err: any) {
    if (!err?.message?.includes('static generation store missing')) {
      console.warn(`[ISR Revalidate] Path error for ${path}:`, err)
    }
  }
  return doc
}

export const revalidatePageDelete: CollectionAfterDeleteHook = ({ doc }) => {
  const path = doc?.slug === 'home' || !doc?.slug ? '/' : `/tours/${doc.slug}`
  try {
    revalidatePath(path)
    revalidateTag('tours')
  } catch (err: any) {
    if (!err?.message?.includes('static generation store missing')) {
      console.warn(`[ISR Revalidate] Delete error for ${path}:`, err)
    }
  }
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ global }) => {
  try {
    revalidatePath('/', 'layout')
    revalidateTag('globals')
  } catch (err: any) {
    if (!err?.message?.includes('static generation store missing')) {
      console.warn(`[ISR Revalidate] Global error for ${global.slug}:`, err)
    }
  }
}
