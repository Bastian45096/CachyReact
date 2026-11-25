package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	CosmosEndpoint string
	CosmosKey      string
	CosmosDatabase string
	JWTSecret      string
	Port           string
}

func Load() *Config {
	// intenta configs/.env, luego .env en raíz
	if err := godotenv.Load("configs/.env"); err != nil {
		_ = godotenv.Load(".env")
	}

	cfg := &Config{
		CosmosEndpoint: os.Getenv("COSMOS_ENDPOINT"),
		CosmosKey:      os.Getenv("COSMOS_KEY"),
		CosmosDatabase: os.Getenv("COSMOS_DATABASE"),
		JWTSecret:      os.Getenv("JWT_SECRET"),
		Port:           os.Getenv("PORT"),
	}

	if cfg.Port == "" {
		cfg.Port = "8080"
	}
	if cfg.CosmosDatabase == "" {
		cfg.CosmosDatabase = "gocachy"
	}

	if cfg.CosmosEndpoint == "" || cfg.CosmosKey == "" {
		log.Fatal("Faltan COSMOS_ENDPOINT y COSMOS_KEY en configs/.env")
	}
	if cfg.JWTSecret == "" {
		log.Fatal("Falta JWT_SECRET en configs/.env")
	}

	return cfg
}
