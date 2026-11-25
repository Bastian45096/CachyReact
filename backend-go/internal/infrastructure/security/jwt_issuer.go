package security

import (
	"fmt"
	"time"

	"gocachy-backend/internal/domain/gocachy"

	"github.com/golang-jwt/jwt/v5"
)

// JWTIssuer implementa gocachy.TokenIssuer
type JWTIssuer struct {
	secret []byte
	ttl    time.Duration
}

func NewJWTIssuer(secret string) *JWTIssuer {
	return &JWTIssuer{
		secret: []byte(secret),
		ttl:    15 * time.Minute, // access token corto
	}
}

type claims struct {
	UserID   string `json:"userId"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func (i *JWTIssuer) Issue(userID, username string) (*gocachy.Token, error) {
	now := time.Now()
	exp := now.Add(i.ttl)

	c := claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(exp),
			Issuer:    "gocachy",
		},
	}

	signed, err := jwt.NewWithClaims(jwt.SigningMethodHS256, c).SignedString(i.secret)
	if err != nil {
		return nil, fmt.Errorf("firmar token: %w", err)
	}

	return &gocachy.Token{
		AccessToken: signed,
		UserID:      userID,
		Username:    username,
		ExpiresAt:   exp.Unix(),
	}, nil
}

func (i *JWTIssuer) Verify(tokenStr string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inválido")
		}
		return i.secret, nil
	})
	if err != nil {
		return "", gocachy.ErrUnauthorized
	}

	c, ok := token.Claims.(*claims)
	if !ok || !token.Valid {
		return "", gocachy.ErrUnauthorized
	}
	return c.UserID, nil
}
