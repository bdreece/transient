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
	"time"

	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
)

type Song struct {
	TrackName  string
	ArtistName string
	Audio      []byte
	Format     string
	Expiration time.Time
	MaxPlays   int
}

func NewSong() (s Song) { return }

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
	id := mux.Vars(r)["id"]
	if h.verbose {
		log.Printf("New request on song: %s\n", id)
		log.Printf("Request method: %s\n", r.Method)
	}
	switch r.Method {
	case "POST":
		var rawBody []byte
		_, err := r.Body.Read(rawBody)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}

		song := NewSong()
		json.Unmarshal(rawBody, &song)
		// TODO: Put song in BoltDB
		h.db.Update(func(tx *bolt.Tx) error {
			bucket, err := tx.CreateBucketIfNotExists([]byte("songs"))
			if err != nil {
				return err
			}
			bucket.Put([]byte(id), rawBody)
			return nil
		})

		w.WriteHeader(http.StatusOK)
	case "GET":
		// TODO: Get song from BoltDB
		var song *Song
		if err := h.db.View(func(tx *bolt.Tx) error {
			bucket, err := tx.CreateBucketIfNotExists([]byte("songs"))
			if err != nil {
				return err
			}
			body := bucket.Get([]byte(id))
			if body == nil {
				song = nil
			}
			json.Unmarshal(body, song)
			return nil
		}); err != nil {
			w.WriteHeader(400)
		}

		if song == nil {
			w.WriteHeader(http.StatusNoContent)
		}

		bytes, err := json.Marshal(song)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}

		w.Write(bytes)
	}
}
