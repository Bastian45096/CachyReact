package http

import (
	"net/http"

	"gocachy-backend/internal/domain/gocachy"

	"github.com/gin-gonic/gin"
)

// RequireAuth protege rutas: verifica el JWT de la cookie
func RequireAuth(tokens gocachy.TokenIssuer) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token, err := ctx.Cookie("access_token")
		if err != nil || token == "" {
			fail(ctx, http.StatusUnauthorized, "token requerido")
			ctx.Abort()
			return
		}

		userID, err := tokens.Verify(token)
		if err != nil {
			fail(ctx, http.StatusUnauthorized, "token inválido o expirado")
			ctx.Abort()
			return
		}

		// pasa el userID a los handlers
		ctx.Set("userID", userID)
		ctx.Next()
	}
}
