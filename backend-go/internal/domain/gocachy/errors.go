package gocachy

import "errors"

var (
	ErrNotFound      = errors.New("no encontrado")
	ErrAlreadyExists = errors.New("ya existe")
	ErrForbidden     = errors.New("no autorizado")
	ErrInvalidInput  = errors.New("datos inválidos")
	ErrUnauthorized  = errors.New("credenciales inválidas")
)
