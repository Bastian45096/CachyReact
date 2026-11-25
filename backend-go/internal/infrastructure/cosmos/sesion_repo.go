package cosmos

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"gocachy-backend/internal/domain/gocachy"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

type SesionRepo struct {
	container *azcosmos.ContainerClient
}

func NewSesionRepo(store *Store) (*SesionRepo, error) {
	c, err := store.Container("sesion_gocachy")
	if err != nil {
		return nil, err
	}
	return &SesionRepo{container: c}, nil
}

func (r *SesionRepo) Create(s *gocachy.Sesion) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	data, err := json.Marshal(s)
	if err != nil {
		return fmt.Errorf("marshal sesion: %w", err)
	}

	pk := azcosmos.NewPartitionKeyString(s.UserID)
	_, err = r.container.CreateItem(ctx, pk, data, nil)
	if err != nil {
		return fmt.Errorf("crear sesion: %w", err)
	}
	return nil
}

// FindByRefreshHash — query cross-partition (no tenemos la partition key)
func (r *SesionRepo) FindByRefreshHash(hash string) (*gocachy.Sesion, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := "SELECT * FROM c WHERE c.refreshTokenHash = @hash"
	opts := &azcosmos.QueryOptions{
		QueryParameters: []azcosmos.QueryParameter{
			{Name: "@hash", Value: hash},
		},
	}

	pager := r.container.NewQueryItemsPager(query, azcosmos.NewPartitionKey(), opts)
	for pager.More() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			return nil, fmt.Errorf("query sesion: %w", err)
		}
		for _, item := range page.Items {
			var s gocachy.Sesion
			if err := json.Unmarshal(item, &s); err != nil {
				continue
			}
			if s.IsActive() {
				return &s, nil
			}
		}
	}
	return nil, gocachy.ErrNotFound
}

func (r *SesionRepo) Revoke(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// leer la sesión para conocer su partition key (userId)
	// en un caso real: usarías el userID que ya tienes
	query := "SELECT * FROM c WHERE c.id = @id"
	opts := &azcosmos.QueryOptions{
		QueryParameters: []azcosmos.QueryParameter{
			{Name: "@id", Value: id},
		},
	}

	pager := r.container.NewQueryItemsPager(query, azcosmos.NewPartitionKey(), opts)
	for pager.More() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			return fmt.Errorf("query sesion: %w", err)
		}
		for _, item := range page.Items {
			var s gocachy.Sesion
			if err := json.Unmarshal(item, &s); err != nil {
				continue
			}
			s.Revoke()
			data, _ := json.Marshal(s)
			pk := azcosmos.NewPartitionKeyString(s.UserID)
			_, err = r.container.ReplaceItem(ctx, pk, s.ID, data, nil)
			return err
		}
	}
	return gocachy.ErrNotFound
}
