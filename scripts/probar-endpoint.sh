#!/usr/bin/env bash
#
# Prueba el endpoint de Apps Script desde la terminal.
#
#   ./scripts/probar-endpoint.sh unlock  'la-contrasena'
#   ./scripts/probar-endpoint.sh buscar  'la-contrasena' 'elvira miller'
#
# `buscar` es de solo lectura: se puede correr las veces que haga falta.
#
# `confirmar` no está aquí a propósito: marcaría la fila de un invitado de
# verdad. Para probarla, usen su propia fila y borren las tres columnas del
# sitio después.
#
# Por qué no basta `curl -L`:
# Apps Script responde 302 hacia script.googleusercontent.com. Al seguir el
# redirect, curl convierte el POST en GET pero conserva el header
# Content-Type, y Google devuelve un 404. Los navegadores sí eliminan ese
# header (lo manda el spec de fetch), por eso en el sitio funciona.
# Aquí seguimos el redirect a mano en dos pasos.

set -euo pipefail

ENDPOINT="https://script.google.com/macros/s/AKfycbxUa7YJyV63KQwpbPJSibjXcBKAB9Wy3LkBFbxljL-2ZXJOSJH8WS7m3pqA3MSr5Xv_/exec"

ACCION="${1:-unlock}"
PASSWORD="${2:-}"
CONSULTA="${3:-}"

if [[ -z "$PASSWORD" ]]; then
  echo "Uso: $0 [unlock|buscar] <contraseña> [consulta]" >&2
  exit 1
fi

case "$ACCION" in
  unlock)
    CUERPO=$(printf '{"action":"unlock","password":"%s"}' "$PASSWORD")
    ;;
  buscar)
    if [[ -z "$CONSULTA" ]]; then
      echo "Uso: $0 buscar <contraseña> '<nombre a buscar>'" >&2
      exit 1
    fi
    CUERPO=$(printf '{"action":"buscar","password":"%s","consulta":"%s"}' "$PASSWORD" "$CONSULTA")
    ;;
  *)
    echo "Acción desconocida: $ACCION" >&2
    exit 1
    ;;
esac

LOCATION=$(
  curl -s --max-time 30 -X POST "$ENDPOINT" \
    -H 'Content-Type: text/plain;charset=utf-8' \
    --data-binary "$CUERPO" \
    -D - -o /dev/null |
    grep -i '^location:' | sed 's/^[Ll]ocation: //' | tr -d '\r'
)

if [[ -z "$LOCATION" ]]; then
  echo "El endpoint no devolvió redirect. ¿Está publicada la app web?" >&2
  exit 1
fi

curl -s --max-time 30 "$LOCATION"
echo
