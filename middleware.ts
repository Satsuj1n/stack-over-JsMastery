import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/jobs",
    "/assets/icons/(.*)", // Para permitir ícones na pasta assets/icons
    "/assets/images/(.*)", // Para permitir imagens na pasta assets/images
  ],
  ignoredRoutes: ["/api/webhook", "/api/chatgpt"],
});

export const config = {
  matcher: [
    "/((?!.+.[w]+$|_next|static|public|favicon.ico|assets).*)", // Exclui rotas estáticas e adiciona novas condições
    "/",
    "/(api|trpc)(.*)",
  ],
};
