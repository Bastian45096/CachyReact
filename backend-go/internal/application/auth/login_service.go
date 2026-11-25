package auth

import (
	"crypto/rand"
	"encoding/hex"

	"gocachy-backend/internal/domain/gocachy"
)

type LoginService struct {
	users    gocachy.UserRepository
	sesiones gocachy.SesionRepository
	audit    gocachy.AuditoriaRepository
	hasher   gocachy.PasswordHasher
	tokens   gocachy.TokenIssuer
}

func NewLoginService(
	users gocachy.UserRepository,
	sesiones gocachy.SesionRepository,
	audit gocachy.AuditoriaRepository,
	hasher gocachy.PasswordHasher,
	tokens gocachy.TokenIssuer,
) *LoginService {
	return &LoginService{
		users: users, sesiones: sesiones, audit: audit,
		hasher: hasher, tokens: tokens,
	}
}

type LoginResult struct {
	Token        *gocachy.Token `json:"token"`
	RefreshToken string         `json:"refreshToken"`
	SesionID     string         `json:"sesionId"`
}

func (s *LoginService) Execute(in gocachy.LoginInput, ip, device string) (*LoginResult, error) {
	// 1. Buscar usuario por email
	user, err := s.users.FindByEmail(in.Email)
	if err != nil {
		// auditoría de intento fallido (no revuelvas si es u otro error)
		_ = s.audit.Create(gocachy.NewAuditoria(
			"", gocachy.AccionLoginFallido, ip, device, "",
		))
		return nil, gocachy.ErrUnauthorized
	}

	// 2. Comparar contraseña
	if err := s.hasher.Compare(user.PasswordHash, in.Password); err != nil {
		_ = s.audit.Create(gocachy.NewAuditoria(
			user.ID, gocachy.AccionLoginFallido, ip, device, "",
		))
		return nil, gocachy.ErrUnauthorized
	}

	// 3. ¿Está activo?
	if !user.IsActive() {
		return nil, gocachy.ErrForbidden
	}

	// 4. Emitir access JWT
	token, err := s.tokens.Issue(user.ID, user.Username)
	if err != nil {
		return nil, err
	}

	// 5. Generar refresh token y guardar SU HASH en la BD
	refreshRaw, err := newRefreshToken()
	if err != nil {
		return nil, err
	}
	refreshHash := hashToken(refreshRaw)

	sesion := gocachy.NewSesion(user.ID, refreshHash, device, ip)
	if err := s.sesiones.Create(sesion); err != nil {
		return nil, err
	}

	// 6. Auditar login exitoso
	_ = s.audit.Create(gocachy.NewAuditoria(
		user.ID, gocachy.AccionLoginOK, ip, device, "",
	))

	return &LoginResult{
		Token:        token,
		RefreshToken: refreshRaw,
		SesionID:     sesion.ID,
	}, nil
}

// newRefreshToken genera 64 bytes aleatorios en hex
func newRefreshToken() (string, error) {
	b := make([]byte, 64)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// hashToken hashea el refresh (SHA-256) — en producción usa crypto/sha256
func hashToken(token string) string {
	// por simplicidad usamos el mismo hex; en producción: sha256.Sum256
	return token // ← TODO: cambiar a SHA-256 real
}
