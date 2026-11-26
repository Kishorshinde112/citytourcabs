type ImageLoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src, width, quality }: ImageLoaderParams): string {
  if (!src) return src;

  // Serve locally-cached WebP variants for the default hero & logo assets so initial
  // viewport paint avoids a cross-origin handshake; any custom CMS-uploaded URL falls
  // straight through to Cloudinary CDN below.
  if (src.includes('bd08021da8c244de8eafa9a4f86c4e2a30099151-CaKyNwZu')) {
    return width <= 750 ? '/optimized/hero-640.webp' : '/optimized/hero-1024.webp';
  }

  if (
    src.includes('2fb8d36e68b18567546da82e33c3bec544da2220-BkfUJrnl') ||
    src.includes('citytourcabs-logo')
  ) {
    return '/optimized/logo-128.webp';
  }

  if (src.includes('res.cloudinary.com') && src.includes('/image/upload/')) {
    const q = quality ? String(quality) : 'auto';
    const transform = `f_auto,q_${q},w_${width},c_limit`;
    const [prefix, rest] = src.split('/image/upload/');

    if (!rest) return src;

    // Replace existing transform segment before version folder (/v123456/...) if present
    const versionIdx = rest.search(/(?:^|\/)v\d+\//);
    if (versionIdx >= 0) {
      const versionStart = rest[versionIdx] === '/' ? versionIdx + 1 : versionIdx;
      return `${prefix}/image/upload/${transform}/${rest.slice(versionStart)}`;
    }

    return `${prefix}/image/upload/${transform}/${rest}`;
  }

  return src;
}
