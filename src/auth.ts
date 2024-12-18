import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login" // 指定登录页面
  },

  callbacks: {
    async session({ session, token }) {
      // 可以在这里自定义 session
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 确保重定向到正确的页面
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
});
