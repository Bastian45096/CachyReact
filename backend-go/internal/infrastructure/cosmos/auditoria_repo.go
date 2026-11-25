package cosmos

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"gocachy-backend/internal/domain/gocachy"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

type AuditoriaRepo struct {
	container *azcosmos.ContainerClient
}

func NewAuditoriaRepo(store *Store) (*AuditoriaRepo, error) {
	c, err := store.Container("auditoria_gocachy")
	if err != nil {
		return nil, err
	}
	return &AuditoriaRepo{container: c}, nil
}

func (r *AuditoriaRepo) Create(a *gocachy.Auditoria) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	data, err := json.Marshal(a)
	if err != nil {
		return fmt.Errorf("marshal auditoria: %w", err)
	}

	// partition key: si no hay userID, usamos "anon" para agrupar
	pkValue := a.UserID
	if pkValue == "" {
		pkValue = "anon"
	}

	pk := azcosmos.NewPartitionKeyString(pkValue)
	_, err = r.container.CreateItem(ctx, pk, data, nil)
	if err != nil {
		return fmt.Errorf("crear auditoria: %w", err)
	}
	return nil
}
