package http

import (
	"gocachy-backend/internal/domain/gocachy"

	"github.com/gin-gonic/gin"
)

type Deps struct {
	Auth   *AuthController
	Tokens gocachy.TokenIssuer
}

func NewRouter(d Deps) *gin.Engine {
	r := gin.Default()

	// CORS (para que React en el navegador pueda llamar)
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Health
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "gocachy-api"})
	})

	api := r.Group("/api")
	{
		// Públicas
		api.POST("/auth/register", d.Auth.Register)
		api.POST("/auth/login", d.Auth.Login)
		api.POST("/auth/logout", d.Auth.Logout)

		// Protegidas (requieren JWT)
		auth := api.Group("", RequireAuth(d.Tokens))
		{
			auth.GET("/profile", d.Auth.GetProfile)
			auth.PUT("/profile", d.Auth.UpdateProfile)
		}
	}

	return r
}
