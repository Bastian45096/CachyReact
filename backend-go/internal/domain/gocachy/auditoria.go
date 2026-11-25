package gocachy

import "time"

func (Auditoria) TableName() string { return "auditoria_gocachy" }

// Acciones auditables
const (
	AccionRegister      = "REGISTER"
	AccionLoginOK       = "LOGIN_OK"
	AccionLoginFallido  = "LOGIN_FALLIDO"
	AccionLogout        = "LOGOUT"
	AccionPerfilEditado = "PERFIL_EDITADO"
	AccionTokenRotado   = "TOKEN_ROTADO"
)

type Auditoria struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId,omitempty"`
	Accion    string    `json:"accion"`
	IP        string    `json:"ip,omitempty"`
	UserAgent string    `json:"userAgent,omitempty"`
	Detalle   string    `json:"detalle,omitempty"` // JSON sin secrets
	CreatedAt time.Time `json:"createdAt"`
}

func NewAuditoria(userID, accion, ip, userAgent, detalle string) *Auditoria {
	return &Auditoria{
		ID:        newID(),
		UserID:    userID,
		Accion:    accion,
		IP:        ip,
		UserAgent: userAgent,
		Detalle:   detalle,
		CreatedAt: time.Now().UTC(),
	}
}

type AuditoriaRepository interface {
	Create(a *Auditoria) error
}
