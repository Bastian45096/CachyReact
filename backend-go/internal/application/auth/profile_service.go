package auth

import (
	"gocachy-backend/internal/domain/gocachy"
)

type ProfileService struct {
	users gocachy.UserRepository
	audit gocachy.AuditoriaRepository
}

func NewProfileService(users gocachy.UserRepository, audit gocachy.AuditoriaRepository) *ProfileService {
	return &ProfileService{users: users, audit: audit}
}

// Get: ver perfil (propio o de otro)
func (s *ProfileService) Get(userID string) (*gocachy.User, error) {
	return s.users.FindByID(userID)
}

// UpdateProfileInput: lo que llega del frontend
type UpdateProfileInput struct {
	DisplayName string `json:"displayName"`
	Bio         string `json:"bio"`
	AvatarURL   string `json:"avatarUrl"`
}

// Update: editar perfil propio
func (s *ProfileService) Update(userID string, in UpdateProfileInput) (*gocachy.User, error) {
	user, err := s.users.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if err := user.UpdateProfile(in.DisplayName, in.Bio, in.AvatarURL); err != nil {
		return nil, err
	}

	if err := s.users.Update(user); err != nil {
		return nil, err
	}

	// auditar
	_ = s.audit.Create(gocachy.NewAuditoria(
		user.ID, gocachy.AccionPerfilEditado, "", "", "",
	))

	return user, nil
}
