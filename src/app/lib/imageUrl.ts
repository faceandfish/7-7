// utils/imageUrl.ts

const IMAGE_BASE_URL = "http://13.208.244.92:9000/book-bucket/";
const AVATAR_BASE_URL = "http://13.208.244.92:9000//avatar-bucket/";

export function getImageUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${IMAGE_BASE_URL}${path}`;
}

export function getAvatarUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    // 解析 URL 以获取主机名
    try {
      const url = new URL(path);
      if (url.hostname === "lh3.googleusercontent.com") {
        return path; // 如果是 Google 用户头像，直接返回原始 URL
      }
    } catch (error) {
      console.error("Invalid URL:", path);
    }
    return path; // 对于其他外部 URL，也直接返回
  }
  return `${AVATAR_BASE_URL}${path}`;
}
