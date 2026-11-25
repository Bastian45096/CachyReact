package gocachy

// DTOs de entrada/salida de auth (no son entidades, pero viven en dominio
// porque definen los contratos que usan services y puertos)

type RegisterInput struct {
	Email       string `json:"email"`
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
	Password    string `json:"password"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Token struct {
	AccessToken string `json:"accessToken"`
	UserID      string `json:"userId"`
	Username    string `json:"username"`
	ExpiresAt   int64  `json:"expiresAt"` // unix
}

// Puertos de seguridad (los implementa infrastructure/security)
type PasswordHasher interface {
	Hash(password string) (string, error)
	Compare(hash, password string) error
}

type TokenIssuer interface {
	Issue(userID, username string) (*Token, error)
	Verify(token string) (string, error) // devuelve userID
}
