package gocachy

import "github.com/google/uuid"

// newID genera el ID único de cada documento
func newID() string {
	return uuid.NewString()
}
