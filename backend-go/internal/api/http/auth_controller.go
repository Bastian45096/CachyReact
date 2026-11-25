package http

import (
	"net/http"

	authapp "gocachy-backend/internal/application/auth"
	"gocachy-backend/internal/domain/gocachy"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	register *authapp.RegisterService
	login    *authapp.LoginService
	profile  *authapp.ProfileService
}

func NewAuthController(
	r *authapp.RegisterService,
	l *authapp.LoginService,
	p *authapp.ProfileService,
) *AuthController {
	return &AuthController{register: r, login: l, profile: p}
}

// POST /api/auth/register
func (c *AuthController) Register(ctx *gin.Context) {
	var in gocachy.RegisterInput
	if err := ctx.ShouldBindJSON(&in); err != nil {
		fail(ctx, http.StatusBadRequest, "json inválido")
		return
	}

	user, err := c.register.Execute(in)
	if err != nil {
		switch err {
		case gocachy.ErrAlreadyExists:
			fail(ctx, http.StatusConflict, "email o username ya existe")
		case gocachy.ErrInvalidInput:
			fail(ctx, http.StatusBadRequest, "datos inválidos")
		default:
			fail(ctx, http.StatusInternalServerError, "error interno")
		}
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	})
}

// POST /api/auth/login
func (c *AuthController) Login(ctx *gin.Context) {
	var in gocachy.LoginInput
	if err := ctx.ShouldBindJSON(&in); err != nil {
		fail(ctx, http.StatusBadRequest, "json inválido")
		return
	}

	result, err := c.login.Execute(in, ctx.ClientIP(), ctx.Request.UserAgent())
	if err != nil {
		fail(ctx, http.StatusUnauthorized, "credenciales inválidas")
		return
	}

	// Access JWT → cookie httpOnly (NUNCA localStorage)
	ctx.SetCookie("access_token", result.Token.AccessToken, 900, "/", "", true, true)

	// Refresh token → cookie httpOnly separada (path=/api/auth)
	ctx.SetCookie("refresh_token", result.RefreshToken, 30*24*3600, "/api/auth", "", true, true)

	ctx.JSON(http.StatusOK, gin.H{
		"userId":   result.Token.UserID,
		"username": result.Token.Username,
	})
}

// POST /api/auth/logout
func (c *AuthController) Logout(ctx *gin.Context) {
	// limpia cookies
	ctx.SetCookie("access_token", "", -1, "/", "", true, true)
	ctx.SetCookie("refresh_token", "", -1, "/api/auth", "", true, true)
	ctx.JSON(http.StatusOK, gin.H{"message": "sesión cerrada"})
}

// GET /api/profile (requiere auth)
func (c *AuthController) GetProfile(ctx *gin.Context) {
	userID := ctx.GetString("userID")

	user, err := c.profile.Get(userID)
	if err != nil {
		fail(ctx, http.StatusNotFound, "usuario no encontrado")
		return
	}
	ctx.JSON(http.StatusOK, user)
}

// PUT /api/profile (requiere auth)
func (c *AuthController) UpdateProfile(ctx *gin.Context) {
	userID := ctx.GetString("userID")

	var in authapp.UpdateProfileInput
	if err := ctx.ShouldBindJSON(&in); err != nil {
		fail(ctx, http.StatusBadRequest, "json inválido")
		return
	}

	user, err := c.profile.Update(userID, in)
	if err != nil {
		if err == gocachy.ErrInvalidInput {
			fail(ctx, http.StatusBadRequest, "datos inválidos")
			return
		}
		fail(ctx, http.StatusInternalServerError, "error interno")
		return
	}
	ctx.JSON(http.StatusOK, user)
}

// helpers
func fail(ctx *gin.Context, code int, msg string) {
	ctx.JSON(code, gin.H{"error": msg})
}
