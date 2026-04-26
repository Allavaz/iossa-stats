import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    })
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (profile?.id) {
        token.discordId = profile.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.discordId) {
        session.user.id = token.discordId as string;
      }
      return session;
    }
  }
});

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  const allowed = (process.env.ADMIN_IDS ?? "").split(",").map(s => s.trim());
  return allowed.includes(session.user.id);
}
