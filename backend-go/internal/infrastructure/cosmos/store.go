package cosmos

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"gocachy-backend/internal/infrastructure/config"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

type Store struct {
	client   *azcosmos.Client
	database string
}

var containers = []struct {
	ID           string
	PartitionKey string
}{
	{"usuario_gocachy", "/id"},
	{"sesion_gocachy", "/userId"},
	{"auditoria_gocachy", "/userId"},
	{"idea_gocachy", "/userId"},
	{"reaction_gocachy", "/ideaId"},
	{"follow_gocachy", "/followerId"},
	{"community_gocachy", "/id"},
	{"membership_gocachy", "/communityId"},
}

func NewStore(cfg *config.Config) (*Store, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	cred, err := azcosmos.NewKeyCredential(cfg.CosmosKey)
	if err != nil {
		return nil, fmt.Errorf("credencial: %w", err)
	}

	client, err := azcosmos.NewClientWithKey(cfg.CosmosEndpoint, cred, nil)
	if err != nil {
		return nil, fmt.Errorf("cliente: %w", err)
	}

	store := &Store{client: client, database: cfg.CosmosDatabase}

	// ============================================================
	// Crear database CON throughput compartido (1000 RU/s free tier)
	// Todos los contenedores COMPARTEN esos 1000 RU/s
	// ============================================================
	throughput := azcosmos.NewManualThroughputProperties(1000)
	_, err = client.CreateDatabase(ctx, azcosmos.DatabaseProperties{
		ID: cfg.CosmosDatabase,
	}, &azcosmos.CreateDatabaseOptions{
		ThroughputProperties: &throughput,
	})
	if err != nil {
		if isConflict(err) {
			log.Printf("ℹ️  Database '%s' ya existía", cfg.CosmosDatabase)
		} else {
			return nil, fmt.Errorf("crear database: %w", err)
		}
	} else {
		log.Printf("✅ Database '%s' creada con 1000 RU/s compartidos", cfg.CosmosDatabase)
	}

	// ============================================================
	// Crear contenedores SIN throughput dedicado
	// → comparten los 1000 RU/s de la database
	// ============================================================
	for _, c := range containers {
		if err := store.createContainer(ctx, c.ID, c.PartitionKey); err != nil {
			if isConflict(err) {
				log.Printf("ℹ️  Contenedor '%s' ya existía", c.ID)
				continue
			}
			return nil, fmt.Errorf("contenedor %s: %w", c.ID, err)
		}
		log.Printf("✅ Contenedor '%s' (pk: %s)", c.ID, c.PartitionKey)
	}

	return store, nil
}

func (s *Store) createContainer(ctx context.Context, id, partitionKey string) error {
	db, err := s.client.NewDatabase(s.database)
	if err != nil {
		return err
	}

	props := azcosmos.ContainerProperties{
		ID: id,
		PartitionKeyDefinition: azcosmos.PartitionKeyDefinition{
			Paths: []string{partitionKey},
		},
	}

	// nil = SIN throughput dedicado → comparten los 1000 RU/s
	_, err = db.CreateContainer(ctx, props, nil)
	return err
}

func (s *Store) Container(name string) (*azcosmos.ContainerClient, error) {
	return s.client.NewContainer(s.database, name)
}

// isConflict detecta el error 409 (ya existe)
func isConflict(err error) bool {
	return err != nil && strings.Contains(err.Error(), "409")
}
