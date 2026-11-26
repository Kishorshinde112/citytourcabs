type ImageLoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src, width, quality }: ImageLoaderParams): string {
  if (!src) return src;

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
