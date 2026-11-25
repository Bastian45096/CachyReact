package gocachy

import "time"

func (Sesion) TableName() string { return "sesion_gocachy" }

// Sesion = el refresh token vive aquí (hasheado), no en localStorage
type Sesion struct {
	ID               string     `json:"id"`
	UserID           string     `json:"userId"` // partition key
	RefreshTokenHash string     `json:"refreshTokenHash"`
	Device           string     `json:"device,omitempty"`
	IP               string     `json:"ip,omitempty"`
	CreatedAt        time.Time  `json:"createdAt"`
	ExpiresAt        time.Time  `json:"expiresAt"`
	RevokedAt        *time.Time `json:"revokedAt,omitempty"` // nil = activa
}

const refreshTTL = 30 * 24 * time.Hour // 30 días

func NewSesion(userID, hash, device, ip string) *Sesion {
	now := time.Now().UTC()
	return &Sesion{
		ID:               newID(),
		UserID:           userID,
		RefreshTokenHash: hash,
		Device:           device,
		IP:               ip,
		CreatedAt:        now,
		ExpiresAt:        now.Add(refreshTTL),
	}
}

func (s *Sesion) IsActive() bool {
	return s.RevokedAt == nil && time.Now().UTC().Before(s.ExpiresAt)
}

func (s *Sesion) Revoke() {
	now := time.Now().UTC()
	s.RevokedAt = &now
}

type SesionRepository interface {
	Create(s *Sesion) error
	FindByRefreshHash(hash string) (*Sesion, error)
	Revoke(id string) error
}
