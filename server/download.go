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

type DownloadHandlerError struct {
	string
}

type SongNotFound struct{}

func (e SongNotFound) Error() string {
	return "Song not found!"
}

func (d DownloadHandlerError) Error() string {
	return d.string
}

type DownloadHandler struct {
	db      *bolt.DB
	verbose *bool
}

func NewDownloadHandler(db *bolt.DB, verbose *bool) *DownloadHandler {
	return &DownloadHandler{
		db,
		verbose,
	}
}

func (h *DownloadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var song SongStore
	id := mux.Vars(r)["id"]

	if *h.verbose {
		log.Printf("Incoming download request for song: %s\n", id)
	}

	w.Header().Add("Access-Control-Allow-Origin", "*")

	if err := h.db.Update(func(tx *bolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte(BUCKET))
		if err != nil {
			return err
		}
		// Get data
		data := bucket.Get([]byte(id))
		if data == nil {
			if *h.verbose {
				log.Printf("Song '%s' not found!\n", id)
			}
			return SongNotFound{}
		}
		if *h.verbose {
			log.Println("Found song!")
		}
		// Unmarshal into Song
		if err = json.Unmarshal(data, &song); err != nil {
			return err
		}

		// Decrement remaining plays
		song.RemainingPlays -= 1
		// Marshal this back into bytes
		data, err = json.Marshal(song)
		if err != nil {
			return err
		}
		// Put updated bytes in DB
		if song.RemainingPlays == 0 {
			if *h.verbose {
				log.Println("Remaining plays exhausted, deleting song")
			}
			if err = bucket.Delete([]byte(id)); err != nil {
				return err
			}
		} else {
			err = bucket.Put([]byte(id), data)
			if err != nil {
				return err
			}
			if *h.verbose {
				log.Println("Decremented remaining plays in DB")
			}
		}
		return nil
	}); err != nil {
		if _, ok := err.(SongNotFound); ok {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		if *h.verbose {
			log.Printf("Unexpected error downloading song: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	data, err := song.Data()
	if err != nil {
		if *h.verbose {
			log.Printf("Unexpected error loading song data from disk: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if *h.verbose {
		log.Println("Loaded song from disk")
	}
	body, err := json.Marshal(data)
	if err != nil {
		if *h.verbose {
			log.Printf("Unexpected error marshalling song JSON: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(body)
}
