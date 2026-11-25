package gocachy

import (
	"strings"
	"time"
)

func (Community) TableName() string { return "community_gocachy" }

type Community struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"` // "#golang-chile"
	Description string    `json:"description"`
	CoverURL    string    `json:"coverUrl,omitempty"`
	OwnerID     string    `json:"ownerId"`
	MemberCount int       `json:"memberCount"`
	CreatedAt   time.Time `json:"createdAt"`
}

func NewCommunity(name, description, ownerID string) (*Community, error) {
	name = strings.TrimSpace(name)
	if name == "" || len(name) > 50 {
		return nil, ErrInvalidInput
	}
	return &Community{
		ID:          newID(),
		Name:        name,
		Description: description,
		OwnerID:     ownerID,
		MemberCount: 1,
		CreatedAt:   time.Now().UTC(),
	}, nil
}

type CommunityRepository interface {
	Create(c *Community) error
	FindByID(id string) (*Community, error)
	FindAll(limit int) ([]*Community, error)
	Update(c *Community) error
	Delete(id string) error
}
