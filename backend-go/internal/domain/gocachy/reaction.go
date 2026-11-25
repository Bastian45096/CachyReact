package gocachy

import "time"

func (Reaction) TableName() string { return "reaction_gocachy" }

type ReactionType string

const (
	ReactionFire  ReactionType = "fire"  // 🔥
	ReactionBrain ReactionType = "brain" // 🧠
	ReactionStar  ReactionType = "star"  // ⭐
)

type Reaction struct {
	ID        string       `json:"id"`
	IdeaID    string       `json:"ideaId"` // partition key
	UserID    string       `json:"userId"`
	Type      ReactionType `json:"type"`
	CreatedAt time.Time    `json:"createdAt"`
}

func ValidReaction(t ReactionType) bool {
	return t == ReactionFire || t == ReactionBrain || t == ReactionStar
}

func NewReaction(ideaID, userID string, t ReactionType) (*Reaction, error) {
	if !ValidReaction(t) {
		return nil, ErrInvalidInput
	}
	return &Reaction{
		ID:        newID(),
		IdeaID:    ideaID,
		UserID:    userID,
		Type:      t,
		CreatedAt: time.Now().UTC(),
	}, nil
}

type ReactionRepository interface {
	Create(r *Reaction) error
	FindByIdeaAndUser(ideaID, userID string) (*Reaction, error)
	Delete(id, ideaID string) error
	CountByIdea(ideaID string) (map[ReactionType]int, error)
}
