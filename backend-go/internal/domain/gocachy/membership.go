package gocachy

import "time"

func (Membership) TableName() string { return "membership_gocachy" }

type Role string

const (
	RoleOwner   Role = "owner"   // dueño
	RoleArtisan Role = "artisan" // artesano (publica)
	RoleLearner Role = "learner" // aprendiz (solo lee)
)

type Membership struct {
	ID          string    `json:"id"`
	CommunityID string    `json:"communityId"` // partition key
	UserID      string    `json:"userId"`
	Role        Role      `json:"role"`
	CreatedAt   time.Time `json:"createdAt"`
}

func NewMembership(communityID, userID string, role Role) (*Membership, error) {
	if communityID == "" || userID == "" {
		return nil, ErrInvalidInput
	}
	if role != RoleOwner && role != RoleArtisan && role != RoleLearner {
		return nil, ErrInvalidInput
	}
	return &Membership{
		ID:          newID(),
		CommunityID: communityID,
		UserID:      userID,
		Role:        role,
		CreatedAt:   time.Now().UTC(),
	}, nil
}

func (m *Membership) CanPost() bool {
	return m.Role == RoleOwner || m.Role == RoleArtisan
}

func (m *Membership) CanModerate() bool { return m.Role == RoleOwner }

type MembershipRepository interface {
	Create(m *Membership) error
	FindByCommunityAndUser(communityID, userID string) (*Membership, error)
	FindByUser(userID string) ([]*Membership, error)
	UpdateRole(m *Membership) error
	Delete(id, communityID string) error
}
