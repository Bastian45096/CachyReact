package auth

import (
	"strings"

	"gocachy-backend/internal/domain/gocachy"
)

type RegisterService struct {
	users  gocachy.UserRepository
	audit  gocachy.AuditoriaRepository
	hasher gocachy.PasswordHasher
}

func NewRegisterService(
	users gocachy.UserRepository,
	audit gocachy.AuditoriaRepository,
	hasher gocachy.PasswordHasher,
) *RegisterService {
	return &RegisterService{users: users, audit: audit, hasher: hasher}
}

func (s *RegisterService) Execute(in gocachy.RegisterInput) (*gocachy.User, error) {
	// 1. Normalizar
	in.Email = strings.ToLower(strings.TrimSpace(in.Email))
	in.Username = strings.ToLower(strings.TrimSpace(in.Username))

	// 2. Validar contraseña (mínimo 8)
	if len(in.Password) < 8 {
		return nil, gocachy.ErrInvalidInput
	}

	// 3. ¿Ya existe el email?
	if _, err := s.users.FindByEmail(in.Email); err == nil {
		return nil, gocachy.ErrAlreadyExists
	}

	// 4. ¿Ya existe el username?
	if _, err := s.users.FindByUsername(in.Username); err == nil {
		return nil, gocachy.ErrAlreadyExists
	}

	// 5. Hashear contraseña
	hash, err := s.hasher.Hash(in.Password)
	if err != nil {
		return nil, err
	}

	// 6. Crear usuario (valida dentro del constructor)
	user, err := gocachy.NewUser(in.Email, in.Username, in.DisplayName, hash)
	if err != nil {
		return nil, err
	}

	// 7. Guardar en Cosmos
	if err := s.users.Create(user); err != nil {
		return nil, err
	}

	// 8. Auditar (no bloquea si falla)
	_ = s.audit.Create(gocachy.NewAuditoria(
		user.ID,
		gocachy.AccionRegister,
		"", "", "",
	))

	return user, nil
}
