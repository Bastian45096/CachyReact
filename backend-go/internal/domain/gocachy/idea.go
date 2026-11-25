package gocachy

import (
	"strings"
	"time"
)

func (Idea) TableName() string { return "idea_gocachy" }

type IdeaStatus string

const (
	StatusIdea       IdeaStatus = "idea"
	StatusInProgress IdeaStatus = "in_progress"
	StatusPublished  IdeaStatus = "published"
	StatusAbandoned  IdeaStatus = "abandoned"
)

// Idea = publicación del muro (post, comentario o build)
type Idea struct {
	ID             string     `json:"id"`
	UserID         string     `json:"userId"`             // partition key
	ParentID       string     `json:"parentId,omitempty"` // "" = post raíz
	Body           string     `json:"body"`
	CoverURL       string     `json:"coverUrl,omitempty"`
	Status         IdeaStatus `json:"status,omitempty"` // solo builds
	Stack          []string   `json:"stack,omitempty"`  // ["Go","Cosmos"]
	ProjectLink    string     `json:"projectLink,omitempty"`
	IsEdited       bool       `json:"isEdited"`
	ReactionsCount int        `json:"reactionsCount"`
	CommentsCount  int        `json:"commentsCount"`
	AuthorName     string     `json:"authorName"` // denormalizado
	AuthorAvatar   string     `json:"authorAvatar,omitempty"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}

const maxBody = 5000

func NewIdea(userID, body, coverURL string, stack []string, projectLink string) (*Idea, error) {
	body = strings.TrimSpace(body)
	if body == "" || len(body) > maxBody {
		return nil, ErrInvalidInput
	}
	now := time.Now().UTC()
	return &Idea{
		ID:          newID(),
		UserID:      userID,
		Body:        body,
		CoverURL:    coverURL,
		Stack:       stack,
		ProjectLink: projectLink,
		Status:      StatusIdea,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

func NewComment(userID, parentID, body string) (*Idea, error) {
	idea, err := NewIdea(userID, body, "", nil, "")
	if err != nil {
		return nil, err
	}
	idea.ParentID = parentID
	return idea, nil
}

func (i *Idea) IsComment() bool { return i.ParentID != "" }

func (i *Idea) CanEdit(userID string) bool { return i.UserID == userID }

func (i *Idea) Edit(userID, newBody string) error {
	if !i.CanEdit(userID) {
		return ErrForbidden
	}
	newBody = strings.TrimSpace(newBody)
	if newBody == "" || len(newBody) > maxBody {
		return ErrInvalidInput
	}
	i.Body = newBody
	i.IsEdited = true
	i.UpdatedAt = time.Now().UTC()
	return nil
}

func (i *Idea) IncrementReactions(delta int) {
	i.ReactionsCount += delta
	i.UpdatedAt = time.Now().UTC()
}

type IdeaRepository interface {
	Create(idea *Idea) error
	FindByID(userID, id string) (*Idea, error)
	Update(idea *Idea) error
	Delete(userID, id string) error
	FindFeed(userID string, limit, offset int) ([]*Idea, error)
	FindReplies(parentID string, limit int) ([]*Idea, error)
	FindByUser(userID string, limit int) ([]*Idea, error)
	IncrementCounter(userID, ideaID, field string, delta int) error
}
