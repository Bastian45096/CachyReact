package cosmos

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"gocachy-backend/internal/domain/gocachy"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

type UserRepo struct {
	store     *Store
	container *azcosmos.ContainerClient
}

func NewUserRepo(store *Store) (*UserRepo, error) {
	c, err := store.Container("usuario_gocachy")
	if err != nil {
		return nil, err
	}
	return &UserRepo{store: store, container: c}, nil
}

func (r *UserRepo) Create(user *gocachy.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	data, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf("marshal user: %w", err)
	}

	pk := azcosmos.NewPartitionKeyString(user.ID)
	_, err = r.container.CreateItem(ctx, pk, data, nil)
	if err != nil {
		return fmt.Errorf("crear user: %w", err)
	}
	return nil
}

func (r *UserRepo) FindByID(id string) (*gocachy.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pk := azcosmos.NewPartitionKeyString(id)
	resp, err := r.container.ReadItem(ctx, pk, id, nil)
	if err != nil {
		return nil, gocachy.ErrNotFound
	}

	var user gocachy.User
	if err := json.Unmarshal(resp.Value, &user); err != nil {
		return nil, fmt.Errorf("unmarshal user: %w", err)
	}
	return &user, nil
}

// FindByEmail — query cross-partition (el login no tiene la partition key)
func (r *UserRepo) FindByEmail(email string) (*gocachy.User, error) {
	return r.findOne("c.email = @email", "@email", email)
}

// FindByUsername — query cross-partition
func (r *UserRepo) FindByUsername(username string) (*gocachy.User, error) {
	return r.findOne("c.username = @username", "@username", username)
}

func (r *UserRepo) findOne(where, paramName string, paramValue any) (*gocachy.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := fmt.Sprintf("SELECT * FROM c WHERE %s", where)
	opts := &azcosmos.QueryOptions{
		QueryParameters: []azcosmos.QueryParameter{
			{Name: paramName, Value: paramValue},
		},
	}

	// partition key vacía = todas las particiones
	pager := r.container.NewQueryItemsPager(query, azcosmos.NewPartitionKey(), opts)

	for pager.More() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			return nil, fmt.Errorf("query user: %w", err)
		}
		for _, item := range page.Items {
			var user gocachy.User
			if err := json.Unmarshal(item, &user); err != nil {
				continue
			}
			return &user, nil
		}
	}
	return nil, gocachy.ErrNotFound
}

func (r *UserRepo) Update(user *gocachy.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user.UpdatedAt = time.Now().UTC()
	data, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf("marshal user: %w", err)
	}

	pk := azcosmos.NewPartitionKeyString(user.ID)
	_, err = r.container.ReplaceItem(ctx, pk, user.ID, data, nil)
	if err != nil {
		return fmt.Errorf("actualizar user: %w", err)
	}
	return nil
}
