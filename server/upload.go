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
	"io"
	"log"
	"net/http"

	"github.com/boltdb/bolt"
	"github.com/lucsky/cuid"
)

type UploadResponse struct {
	Id string `json:"id"`
}

type UploadHandler struct {
	db       *bolt.DB
	filePath *string
	verbose  *bool
}

func NewUploadHandler(db *bolt.DB, filePath *string, verbose *bool) *UploadHandler {
	return &UploadHandler{
		db,
		filePath,
		verbose,
	}
}

func (h *UploadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var (
		body   []byte
		buf    []byte = make([]byte, 1024)
		err    error
		length int = 0
		n      int
		song   Song
	)

	if *h.verbose {
		log.Println("Incoming request for song upload")
	}

	w.Header().Add("Access-Control-Allow-Origin", "*")

	if r.Header["Content-Type"][0] != "application/json" {
		if *h.verbose {
			log.Println("Invalid content type")
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Read all of body
	for {
		n, err = r.Body.Read(buf)
		if n == 0 {
			break
		}
		body = append(body, buf[:n]...)
		length += n
	}
	if err != nil && err != io.EOF {
		if *h.verbose {
			log.Printf("Unexpected error reading request body: %v\n", err)
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = json.Unmarshal(body[:length], &song)
	if err != nil {
		if *h.verbose {
			log.Printf("Unexpected error unmarshaling request body: %v\n", err)
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if *h.verbose {
		log.Println("Successfully read and parsed request body")
	}

	// Store contents of request body on disk
	id := cuid.Slug()
	err = song.Store(h.filePath, id, h.verbose)
	if err != nil {
		if *h.verbose {
			log.Printf("Unexpected error storing files to disk: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
	}

	if *h.verbose {
		log.Println("Successfully stored song data to disk")
	}

	// Marshal song storage meta to binary
	body, err = json.Marshal(song)
	if err != nil {
		if *h.verbose {
			log.Printf("Unexpected error marshaling song store to JSON: %v\n", err)
		}
	}

	// Add body contents to DB with new CUID
	if err = h.db.Update(func(tx *bolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte(BUCKET))
		if err != nil {
			return err
		}
		if err = bucket.Put([]byte(id), body); err != nil {
			return err
		}
		return nil
	}); err != nil {
		if *h.verbose {
			log.Printf("Unexpected error writing to database: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if *h.verbose {
		log.Println("Successfully put song meta in DB")
	}

	// Marshal response JSON containing CUID
	if body, err = json.Marshal(UploadResponse{Id: id}); err != nil {
		if *h.verbose {
			log.Printf("Unexpected error marshaling response body: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Write response
	w.Write(body)
}
