package gocachy

import (
	"regexp"
	"strings"
	"time"
)

// TableName devuelve el nombre del contenedor Cosmos (formato nombretabla_gocachy)
func (User) TableName() string { return "usuario_gocachy" }

// User = cuenta + perfil (todo en un documento)
type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"passwordHash"`
	Username     string    `json:"username"`
	DisplayName  string    `json:"displayName"`
	Bio          string    `json:"bio,omitempty"`
	AvatarURL    string    `json:"avatarUrl,omitempty"`
	Status       Status    `json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type Status string

const (
	StatusActive    Status = "activo"
	StatusSuspended Status = "suspendido"
)

var (
	emailRe    = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	usernameRe = regexp.MustCompile(`^[a-z0-9_]{3,20}$`)
)

// NewUser crea un usuario validado (constructor con reglas de negocio)
func NewUser(email, username, displayName, passwordHash string) (*User, error) {
	u := &User{
		ID:           newID(),
		Email:        strings.ToLower(strings.TrimSpace(email)),
		Username:     strings.ToLower(strings.TrimSpace(username)),
		DisplayName:  strings.TrimSpace(displayName),
		PasswordHash: passwordHash,
		Status:       StatusActive,
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
	}
	if err := u.Validate(); err != nil {
		return nil, err
	}
	return u, nil
}

// Validate reglas de dominio (sin tocar la BD ni la red)
func (u *User) Validate() error {
	if !emailRe.MatchString(u.Email) {
		return ErrInvalidInput
	}
	if !usernameRe.MatchString(u.Username) {
		return ErrInvalidInput
	}
	if u.DisplayName == "" || len(u.DisplayName) > 50 {
		return ErrInvalidInput
	}
	if len(u.PasswordHash) == 0 {
		return ErrInvalidInput
	}
	return nil
}

func (u *User) IsActive() bool { return u.Status == StatusActive }

func (u *User) UpdateProfile(displayName, bio, avatarURL string) error {
	if len(displayName) > 50 || len(bio) > 500 {
		return ErrInvalidInput
	}
	if displayName != "" {
		u.DisplayName = strings.TrimSpace(displayName)
	}
	u.Bio = bio
	u.AvatarURL = avatarURL
	u.UpdatedAt = time.Now().UTC()
	return nil
}

// UserRepository puerto: lo implementa infrastructure/cosmos
type UserRepository interface {
	Create(user *User) error
	FindByID(id string) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByUsername(username string) (*User, error)
	Update(user *User) error
}
