import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from "./db";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    providers: [Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })],
    callbacks: {
        signIn: async ({ user }) => {
            if (!user.id || !user.email) {
                return false;
            }
            await prisma.user.upsert({
                where: {
                    email: user.email
                },
                update: {},
                create: {
                    id: user.email,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            });
            return true;
        },
        // session: async ({ session }) => {
        //     console.log(session);
        //     return session;
        // },
    }
});
