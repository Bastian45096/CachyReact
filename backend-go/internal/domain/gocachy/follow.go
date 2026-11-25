package gocachy

import "time"

func (Follow) TableName() string { return "follow_gocachy" }

type Follow struct {
	ID         string    `json:"id"`
	FollowerID string    `json:"followerId"` // partition key
	FollowedID string    `json:"followedId"`
	CreatedAt  time.Time `json:"createdAt"`
}

func NewFollow(followerID, followedID string) (*Follow, error) {
	if followerID == "" || followedID == "" {
		return nil, ErrInvalidInput
	}
	if followerID == followedID {
		return nil, ErrInvalidInput // no seguirse a sí mismo
	}
	return &Follow{
		ID:         newID(),
		FollowerID: followerID,
		FollowedID: followedID,
		CreatedAt:  time.Now().UTC(),
	}, nil
}

type FollowRepository interface {
	Create(f *Follow) error
	Exists(followerID, followedID string) (bool, error)
	Delete(followerID, followedID string) error
	FindFollowingIDs(userID string) ([]string, error)
	CountFollowers(userID string) (int, error)
	CountFollowing(userID string) (int, error)
}
