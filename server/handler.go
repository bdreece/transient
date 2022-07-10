/* Transient - A temporary audio file sharing service
 * Copyright (C) 2022 Brian Reece
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
)

var BUCKET = []byte("songs")

type HandlerError struct{ string }

func (e HandlerError) Error() string {
	return e.string
}

type Handler struct {
	verbose bool
	db      *bolt.DB
}

func NewHandler(verbose bool, db *bolt.DB) *Handler {
	return &Handler{
		verbose,
		db,
	}
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var (
		body []byte
		song *Song
	)

	// Get request ID slug as bytes
	id := []byte(mux.Vars(r)["id"])

	if h.verbose {
		log.Printf("New request on song: %s\n", id)
		log.Printf("Request method: %s\n", r.Method)
	}

	switch r.Method {
	case "POST":
		// Read body
		if n, err := r.Body.Read(body); err != nil || n < 1 {
			// Empty body
			w.WriteHeader(http.StatusBadRequest)
		}

		// Update DB with Song
		if err := h.db.Update(func(tx *bolt.Tx) error {
			bucket, err := tx.CreateBucketIfNotExists([]byte("songs"))
			if err != nil {
				// Error creating bucket
				return err
			}
			err = bucket.Put(id, body)
			if err != nil {
				// Error putting value in bucket
				return err
			}
			return nil
		}); err != nil {
			if h.verbose {
				log.Printf("Unexpected server error: %v\n", err)
			}
			w.WriteHeader(http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusOK)
	case "GET":
		if err := h.db.Update(func(tx *bolt.Tx) error {
			bucket, err := tx.CreateBucketIfNotExists(BUCKET)
			if err != nil {
				// Error creating bucket
				return err
			}

			body := bucket.Get([]byte(id))
			if body == nil {
				return HandlerError{"ID does not exist"}
			}

			if err := json.Unmarshal(body, song); err != nil {
				return err
			}

			// Decrement remaining plays
			newSong := *song
			newSong.RemainingPlays -= 1
			body, err = json.Marshal(newSong)
			if err != nil {
				return err
			}
			bucket.Put(id, body)

			return nil
		}); err != nil {
			if _, ok := err.(HandlerError); ok {
				// ID does not exist
				if h.verbose {
					log.Printf("Requested ID (%v) does not exist in DB\n", id)
				}
				w.WriteHeader(http.StatusNoContent)
			}
			if h.verbose {
				log.Printf("Unexpected server error: %v\n", err)
			}
			w.WriteHeader(http.StatusInternalServerError)
		}

		if song == nil {
			w.WriteHeader(http.StatusNoContent)
		}

		bytes, err := json.Marshal(song)
		if err != nil {
			if h.verbose {
				log.Println("Error marshaling JSON")
			}
			w.WriteHeader(http.StatusInternalServerError)
		}

		w.Write(bytes)
	}
}
