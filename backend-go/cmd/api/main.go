package main

import (
	"log"

	"gocachy-backend/internal/api/http"
	authapp "gocachy-backend/internal/application/auth"
	"gocachy-backend/internal/infrastructure/config"
	"gocachy-backend/internal/infrastructure/cosmos"
	"gocachy-backend/internal/infrastructure/security"
)

func main() {
	// 1. Config (.env)
	cfg := config.Load()

	// 2. Cosmos (crea DB + 8 contenedores)
	store, err := cosmos.NewStore(cfg)
	if err != nil {
		log.Fatalf("❌ Cosmos: %v", err)
	}

	// 3. Repositorios
	userRepo, err := cosmos.NewUserRepo(store)
	if err != nil {
		log.Fatalf("❌ UserRepo: %v", err)
	}
	sesionRepo, err := cosmos.NewSesionRepo(store)
	if err != nil {
		log.Fatalf("❌ SesionRepo: %v", err)
	}
	auditoriaRepo, err := cosmos.NewAuditoriaRepo(store)
	if err != nil {
		log.Fatalf("❌ AuditoriaRepo: %v", err)
	}

	// 4. Seguridad
	hasher := security.NewBcryptHasher()
	tokens := security.NewJWTIssuer(cfg.JWTSecret)

	// 5. Services (application)
	registerSvc := authapp.NewRegisterService(userRepo, auditoriaRepo, hasher)
	loginSvc := authapp.NewLoginService(userRepo, sesionRepo, auditoriaRepo, hasher, tokens)
	profileSvc := authapp.NewProfileService(userRepo, auditoriaRepo)

	// 6. Controller + Router (api)
	authCtrl := http.NewAuthController(registerSvc, loginSvc, profileSvc)
	router := http.NewRouter(http.Deps{
		Auth:   authCtrl,
		Tokens: tokens,
	})

	// 7. Correr
	log.Printf("🚀 GoCachy API en http://localhost:%s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("❌ servidor: %v", err)
	}
}
